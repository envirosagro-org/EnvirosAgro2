import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, User } from 'lucide-react';
import { HenIcon, SycamoreLogo } from './Icons';

interface AIAssistantProps {
  userEsin: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userEsin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are AgroBot, a helpful assistant for EnvirosAgro. The current steward ESIN is ${userEsin}. Answer farming and sustainability questions concisely. Context: ${input}` }] }]
        })
      });
      
      const data = await response.json();
      const assistantText = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'assistant', text: assistantText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error interacting with AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="p-4 bg-emerald-600 rounded-full shadow-2xl hover:scale-105 transition-transform">
          <HenIcon className="text-white" />
        </button>
      )}
      {isOpen && (
        <div className="w-80 h-96 bg-black/90 border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-emerald-900/20 flex justify-between items-center border-b border-emerald-500/10">
            <h4 className="font-black text-emerald-400 text-xs tracking-widest uppercase flex items-center gap-2"><SycamoreLogo size={18} className="text-emerald-400 animate-pulse" /> AgroBot</h4>
            <X size={14} className="cursor-pointer text-emerald-500" onClick={() => setIsOpen(false)} />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`p-2 rounded-xl shrink-0 border border-white/5 shadow-inner ${m.role === 'user' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'}`}>
                  {m.role === 'user' ? <User size={12} /> : <HenIcon size={12} />}
                </div>
                <div className={`text-[10px] p-3 rounded-2xl max-w-[85%] border border-white/5 leading-relaxed ${m.role === 'user' ? 'bg-indigo-900/40 text-white rounded-tr-none' : 'bg-slate-800/80 text-slate-300 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 animate-pulse px-2">
                <div className="relative">
                  <SycamoreLogo size={20} className="text-emerald-500 animate-spin-slow opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 size={10} className="text-emerald-400 animate-spin" />
                  </div>
                </div>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Synthesizing_Registry_Shard...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-2 border-t border-white/5 flex gap-2">
            <input className="flex-1 bg-transparent border-0 text-[10px] text-white focus:ring-0" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Ask AI..." />
            <button onClick={sendMessage}><Send size={14} className="text-emerald-500" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
