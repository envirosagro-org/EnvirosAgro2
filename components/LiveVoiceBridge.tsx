
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Bot, X, Loader2, ShieldCheck, Activity, Zap } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { encode, decode, ORACLE_TOOLS } from '../services/geminiService';

interface LiveVoiceBridgeProps {
  isOpen: boolean;
  isGuest: boolean;
  onClose: () => void;
  onMintTrigger: (amount: number, material: string) => void;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

function createAudioBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}

const LiveVoiceBridge: React.FC<LiveVoiceBridgeProps> = ({ isOpen, isGuest, onClose, onMintTrigger }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            if (!inputAudioContextRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const pcmBlob = createAudioBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'mint_carbon_shard') {
                  onMintTrigger(fc.args.amount, fc.args.material);
                  sessionPromise.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: { result: "ok" } } }));
                }
              }
            }
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            }
          },
          onclose: () => cleanup(),
          onerror: () => cleanup(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: ORACLE_TOOLS,
          systemInstruction: 'EnvirosAgro Voice Oracle. Use the mint_carbon_shard tool when a steward reports material ingest.'
        },
      });
    } catch (err) { cleanup(); }
  };

  const cleanup = () => {
    setIsActive(false); setIsConnecting(false);
    sessionRef.current?.close();
    streamRef.current?.getTracks().forEach(t => t.stop());
    outputAudioContextRef.current?.close();
    inputAudioContextRef.current?.close();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed bottom-24 right-10 z-[300] w-80 animate-in slide-in-from-bottom-10 duration-500">
      <div className="glass-card rounded-[32px] border-emerald-500/40 bg-[#050706] shadow-2xl overflow-hidden flex flex-col border-2">
        <div className="p-6 bg-emerald-600/10 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white"><Bot className="w-6 h-6" /></div>
             <h4 className="text-sm font-black text-white uppercase tracking-widest">Sovereign Oracle</h4>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center space-y-6 min-h-[250px]">
          {isConnecting ? <Loader2 className="animate-spin text-emerald-500" /> : isActive ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-end gap-1.5 h-12">
                 {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${20+Math.random()*80}%`, animationDelay: `${i*0.08}s` }}></div>)}
              </div>
              <button onClick={cleanup} className="p-6 bg-rose-600 rounded-full text-white shadow-xl hover:scale-110 transition-all"><MicOff size={24} /></button>
            </div>
          ) : (
            <button onClick={startSession} className="w-full py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Initialize Link</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveVoiceBridge;
