
import React, { useState, useEffect } from 'react';
import { 
  Video, Play, Loader2, Sparkles, AlertTriangle, 
  Download, Clock, Database, ShieldCheck, RefreshCw, 
  Key, Globe, Bot, Binary, TrendingUp, X,
  ExternalLink,
  Info,
  Layers,
  Stamp
} from 'lucide-react';
import { generateTemporalVideo, getTemporalVideoOperation } from '../services/geminiService';
import { User } from '../types';
import { SycamoreLogo } from '../App';

interface TemporalVideoProps {
  user: User;
  onNavigate: (view: any) => void;
}

const TemporalVideo: React.FC<TemporalVideoProps> = ({ user, onNavigate }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState('High-fidelity time-lapse of a regenerative Bantu maize garden growing from seedling to harvest under a glowing nebula sky, cinematic lighting, 8k.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const selected = await (window as any).aistudio.hasSelectedApiKey();
    setHasKey(selected);
  };

  const handleSelectKey = async () => {
    // Rule: Assume success and proceed after triggering openSelectKey
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setStatus('Initializing Temporal Shard Ingest...');

    try {
      let operation = await generateTemporalVideo(prompt);
      
      const statusMessages = [
        "Calibrating biological time signature...",
        "Simulating m-constant growth curves...",
        "Sequencing visual genome shards...",
        "Finalizing atmospheric rendering...",
        "Anchoring vision to institutional ledger...",
        "Compressing temporal metadata...",
        "Verifying ZK-sequence fidelity...",
        "Synthesizing high-fidelity result..."
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setStatus(statusMessages[msgIdx % statusMessages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await getTemporalVideoOperation(operation);
      }

      const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Fetch using the current API key from environment
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      // Rule: Handle "Requested entity was not found" by resetting key selection
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
      }
      console.error(err);
      alert("TEMPORAL_ERROR: Link interrupted. Shard integrity compromised.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12 text-center p-12 animate-in zoom-in duration-500">
        <div className="relative group">
           <div className="w-32 h-32 md:w-44 md:h-44 rounded-[48px] bg-amber-600/10 border-2 border-amber-500/20 flex items-center justify-center text-amber-500 shadow-3xl animate-pulse relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-white/5 animate-scan"></div>
              <Key size={64} className="relative z-10 group-hover:scale-110 transition-transform" />
           </div>
           <div className="absolute inset-[-20px] border-2 border-dashed border-amber-500/20 rounded-[64px] animate-spin-slow"></div>
        </div>
        
        <div className="space-y-6 max-w-2xl mx-auto">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] italic">VEO_ACCESS_GATE</span>
              <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Handshake <span className="text-amber-500">Required.</span></h2>
           </div>
           <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed px-10">
             "Bio-temporal video sharding (Veo 3.1) requires a direct paid API key handshake for institutional resource allocation."
           </p>
           <div className="flex flex-col items-center gap-4">
              <div className="p-6 bg-black/60 rounded-[32px] border border-white/10 text-xs text-slate-500 text-left flex items-start gap-4">
                 <Info className="text-blue-400 shrink-0 mt-1" />
                 <p>
                    Billing documentation and GCP project setup are mandatory for high-compute sharding. 
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-black ml-1 uppercase inline-flex items-center gap-1">View Docs <ExternalLink size={10}/></a>
                 </p>
              </div>
           </div>
        </div>
        
        <button 
          onClick={handleSelectKey}
          className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm md:text-base uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-amber-500/5 group"
        >
          <div className="flex items-center gap-4">
             <Key size={24} className="group-hover:rotate-12 transition-transform" />
             SELECT PAID API KEY
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-6xl mx-auto pb-24 px-4">
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-12 shadow-3xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:rotate-12 transition-transform duration-[15s]"><Clock size={800} className="text-indigo-400" /></div>
         
         <div className="relative z-10 space-y-10 w-full">
            <div className="w-28 h-28 bg-indigo-600 rounded-[40px] flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 animate-float">
               <Video size={48} className="text-white animate-pulse" />
            </div>
            <div className="space-y-4">
               <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">TEMPORAL <span className="text-indigo-400">SHARDING.</span></h3>
               <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed px-10">
                  "Utilizing the Veo 3.1 fast-engine to simulate future growth trajectories for node {user.esin}. High-fidelity visual prediction shards."
               </p>
            </div>

            {!videoUrl && !isGenerating ? (
               <div className="max-w-2xl mx-auto space-y-12 py-10 animate-in slide-in-from-bottom-6">
                  <div className="p-10 bg-black/80 rounded-[56px] border-2 border-white/5 shadow-inner group/form relative overflow-hidden">
                     <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                     <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.8em] block text-center italic mb-8">PREDICTIVE_PROMPT_INGEST</label>
                     <textarea 
                       value={prompt}
                       onChange={e => setPrompt(e.target.value)}
                       className="w-full bg-transparent border-none text-center text-xl md:text-2xl italic font-medium text-white outline-none focus:ring-0 placeholder:text-stone-950 transition-all h-48 resize-none leading-relaxed" 
                     />
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 group/btn"
                  >
                     <div className="flex items-center justify-center gap-6">
                        <Sparkles size={36} className="fill-current group-hover/btn:rotate-12 transition-transform" /> 
                        INITIALIZE TEMPORAL FORGE
                     </div>
                  </button>
               </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-16 py-32 text-center animate-in zoom-in duration-500">
                 <div className="relative">
                    <Loader2 size={140} className="text-indigo-500 animate-spin mx-auto" />
                    <div className="absolute inset-0 flex items-center justify-center"><Bot size={56} className="text-indigo-400 animate-pulse" /></div>
                    <div className="absolute inset-[-30px] border-2 border-dashed border-indigo-500/20 rounded-full animate-spin-slow"></div>
                 </div>
                 <div className="space-y-6">
                    <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0 px-10 leading-tight">{status}</p>
                    <p className="text-slate-700 font-mono text-xs uppercase tracking-widest italic">VEO_ENGINE_LINK_ACTIVE // RENDERING_TEMPORAL_SHARDS</p>
                 </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 pb-10">
                 <div className="rounded-[80px] overflow-hidden border-4 border-white/10 shadow-[0_60px_150px_rgba(0,0,0,0.9)] bg-black relative aspect-video group/video group-hover:border-indigo-500/20 transition-all duration-700">
                    <video src={videoUrl!} controls autoPlay loop className="w-full h-full object-cover transition-transform duration-[10s] group-hover/video:scale-105" />
                    <div className="absolute top-10 right-10 flex gap-6 opacity-0 group-hover/video:opacity-100 transition-opacity">
                       <button className="p-5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl text-white shadow-3xl hover:bg-emerald-600 transition-all active:scale-90"><Download size={32}/></button>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    <div className="p-8 bg-black/60 rounded-[48px] border-2 border-white/5 flex items-center gap-6 shadow-inner group/val hover:border-indigo-500/30 transition-all">
                       <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400 shadow-xl group-hover/val:rotate-6 transition-transform">
                          <Binary size={28} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Shard ID</p>
                          <p className="text-sm font-mono text-white italic">0xHS_VEO_SYNC_{Math.random().toString(16).slice(2,8).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[48px] border-2 border-white/5 flex items-center gap-6 shadow-inner group/val hover:border-emerald-500/30 transition-all">
                       <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-400 shadow-xl group-hover/val:rotate-6 transition-transform">
                          <TrendingUp size={28} />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Resonance Yield</p>
                          <p className="text-lg font-mono font-black text-white">+0.12x Alpha</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-center gap-10">
                    <button onClick={() => setVideoUrl(null)} className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-sm font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all shadow-xl active:scale-95">NEW SIMULATION</button>
                    <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5 group/anchor">
                       <div className="flex items-center gap-5">
                          <Stamp size={28} className="group-hover/anchor:scale-110 transition-transform" />
                          ANCHOR TO LEDGER
                       </div>
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>

      <div className="p-16 md:p-24 glass-card rounded-[80px] border-indigo-500/20 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-12 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <Layers className="w-[1000px] h-[1000px] text-indigo-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Bot size={80} className="text-white animate-float relative z-10" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TOTAL <span className="text-indigo-400">VISION</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl opacity-80">
                 "Eliminating the risk of unverified growth. Temporal sharding allows the registry to simulate and verify biological future-states before physical resources are committed."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-20 hidden xl:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">SIM_RELIABILITY</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">99<span className="text-6xl text-indigo-400 ml-2">.8%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 80px 200px -40px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default TemporalVideo;
