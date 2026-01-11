
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  Maximize2, 
  Send, 
  Loader2, 
  Sparkles, 
  GripHorizontal,
  Info,
  ShieldCheck,
  Zap,
  Globe,
  Coins
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';
import { User } from '../types';

interface FloatingConsultantProps {
  user: User;
}

const WHAT_IS_AG_DEFINITION = 'an application of art or science from nature by human beings towards natural resources such as Animals, plants, water, soil and air for sustainability.';

const FloatingConsultant: React.FC<FloatingConsultantProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: `Greetings Steward ${user.name}. I am your EnvirosAgro AI Consultant, powered by the WhatIsAG™ trademark. How can I assist your natural resource applications today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.min(Math.max(0, e.clientX - dragOffset.x), window.innerWidth - (isMinimized ? 80 : 350)),
          y: Math.min(Math.max(0, e.clientY - dragOffset.y), window.innerHeight - (isMinimized ? 80 : 500))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const sysInstruction = `You are the EnvirosAgro AI Consultant, powered by the WhatIsAG™ trademark. 
      You define agriculture strictly as: "${WHAT_IS_AG_DEFINITION}". 
      Your goal is to help human beings apply art and science to natural resources (Animals, plants, water, soil, and air) for sustainability.
      Be professional, technical, and always reference this philosophy when relevant. User: ${user.name}, ESIN: ${user.esin}.`;

      const response = await chatWithAgroExpert(msg, history);
      setMessages(prev => [...prev, { role: 'bot', text: response.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Node sync error. Please verify your registry connection." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-10 z-[400] w-16 h-16 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce border-2 border-white/20"
      >
        <Bot size={32} />
      </button>
    );
  }

  return (
    <div 
      className={`fixed z-[400] transition-all duration-300 ${isDragging ? 'transition-none' : ''}`}
      style={{ left: position.x, top: position.y }}
    >
      <div className={`glass-card rounded-[32px] border-2 border-emerald-500/40 bg-[#050706]/95 shadow-3xl flex flex-col overflow-hidden ${isMinimized ? 'w-20 h-20' : 'w-[350px] h-[500px]'}`}>
        {/* Header / Drag Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="p-4 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between cursor-move select-none"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg ${isMinimized ? 'w-12 h-12' : ''}`}>
              <Bot size={isMinimized ? 28 : 24} />
            </div>
            {!isMinimized && (
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">EnvirosAgro™ AI</h4>
                <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-tighter">WhatIsAG™ Powered</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-500 hover:text-white transition-colors">
              {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="p-3 bg-emerald-500/5 border-b border-white/5">
              <p className="text-[7px] text-emerald-300/60 font-black uppercase tracking-[0.2em] text-center italic">
                "AG: application of art or science from nature by human beings towards natural resources"
              </p>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-lg ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none italic'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask your consultant..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-[11px] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40" 
                />
                <button 
                  onClick={handleSend}
                  disabled={loading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg text-white shadow-lg hover:bg-emerald-500 transition-all disabled:opacity-30"
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="mt-3 flex justify-between items-center px-1">
                <div className="flex items-center gap-1.5">
                   <ShieldCheck size={10} className="text-emerald-500" />
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Secured Shard</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <Zap size={10} className="text-amber-500" />
                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Powered by EOS</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
      `}</style>
    </div>
  );
};

export default FloatingConsultant;
