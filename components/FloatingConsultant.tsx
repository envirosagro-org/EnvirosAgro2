
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Minus, 
  Maximize2, 
  Minimize2,
  Send, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Info, 
  GripVertical,
  Maximize
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';
import { User } from '../types';

interface FloatingConsultantProps {
  user: User;
}

const WHAT_IS_AG_DEFINITION = 'Agriculture is an application of art or science from nature by human beings towards natural resources such as Animals, plants, water, soil and air for sustainability.';

const FloatingConsultant: React.FC<FloatingConsultantProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Position state
  const [position, setPosition] = useState({ x: 20, y: 0 }); // Initial y will be set on mount
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string}[]>([
    { role: 'bot', text: `Greetings Steward ${user.name}. I am the EnvirosAgro™ AI Consultant. My logic is anchored to the WhatIsAG™ trademark. How may I assist your natural resource applications today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set initial position on mount
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 380,
      y: window.innerHeight - 700
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized, isFullScreen]);

  // Unified drag logic for mouse and touch
  const onDragStart = (clientX: number, clientY: number) => {
    if (isFullScreen) return; 
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || isFullScreen) return;

    const newX = Math.min(Math.max(0, clientX - dragStart.x), window.innerWidth - (isMinimized ? 100 : 350));
    const newY = Math.min(Math.max(0, clientY - dragStart.y), window.innerHeight - (isMinimized ? 100 : 500));
    
    setPosition({ x: newX, y: newY });
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const touch = e.touches[0];
    onDragStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDragMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      onDragMove(touch.clientX, touch.clientY);
    };
    const handleUp = () => onDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, dragStart, isMinimized, isFullScreen]);

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

      const response = await chatWithAgroExpert(msg, history);
      setMessages(prev => [...prev, { role: 'bot', text: response.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Protocol sync error. Please verify your node signature." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-10 z-[500] w-16 h-16 agro-gradient rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce border-2 border-white/20"
      >
        <Bot size={32} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>
    );
  }

  const containerStyles = isFullScreen 
    ? { inset: 0, width: '100%', height: '100%' }
    : { left: `${position.x}px`, top: `${position.y}px` };

  return (
    <>
      {/* Dimmed backdrop when consultant is active to emphasize layering */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 z-[490] bg-black/60 backdrop-blur-md pointer-events-auto transition-opacity duration-300" onClick={() => setIsMinimized(true)}></div>
      )}
      
      <div 
        ref={containerRef}
        className={`fixed z-[500] select-none transition-all duration-300 ${isDragging ? 'scale-[1.02] cursor-grabbing transition-none' : ''} ${isFullScreen ? 'bg-black/60 backdrop-blur-3xl' : ''}`}
        style={containerStyles}
      >
        <div className={`glass-card border-2 border-emerald-500/40 bg-[#050706]/98 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden mx-auto transition-all duration-300 ${isFullScreen ? 'w-full max-w-5xl h-[90vh] my-[5vh] rounded-[48px]' : isMinimized ? 'w-24 h-24 rounded-[32px]' : 'w-[350px] h-[520px] rounded-[32px]'}`}>
          
          {/* Header / Drag Handle */}
          <div 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`p-4 md:p-6 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between transition-all ${isFullScreen ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg transition-all ${isFullScreen ? 'w-14 h-14' : isMinimized ? 'w-14 h-14' : 'w-10 h-10'}`}>
                <Bot size={isFullScreen || isMinimized ? 32 : 24} />
              </div>
              {!isMinimized && (
                <div>
                  <h4 className={`${isFullScreen ? 'text-xl' : 'text-[10px]'} font-black text-white uppercase tracking-widest`}>EnvirosAgro™ AI</h4>
                  <p className={`${isFullScreen ? 'text-xs' : 'text-[8px]'} text-emerald-400 font-bold uppercase tracking-tighter`}>WhatIsAG™ Powered</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              {!isMinimized && (
                <button 
                  onClick={toggleFullScreen} 
                  className="p-2.5 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen View"}
                >
                  {isFullScreen ? <Minimize2 size={isFullScreen ? 20 : 14} /> : <Maximize size={14} />}
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); setIsFullScreen(false); }} 
                className="p-2.5 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsFullScreen(false); }} 
                className="p-2.5 text-slate-500 hover:text-rose-400 transition-colors bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                title="Close"
              >
                <X size={isFullScreen ? 20 : 14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className={`p-3 bg-emerald-500/5 border-b border-white/5 ${isFullScreen ? 'py-4' : ''}`}>
                <p className={`${isFullScreen ? 'text-xs' : 'text-[7px]'} text-emerald-300/60 font-black uppercase tracking-[0.2em] text-center italic leading-relaxed px-10`}>
                  "AG: application of art or science from nature by human beings towards natural resources"
                </p>
              </div>

              <div 
                ref={scrollRef}
                className={`flex-1 overflow-y-auto p-4 md:p-10 space-y-6 custom-scrollbar select-text bg-[#050706]`}
              >
                <div className={isFullScreen ? "max-w-3xl mx-auto space-y-8" : "space-y-4"}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`${isFullScreen ? 'max-w-[75%] p-6' : 'max-w-[85%] p-3.5'} rounded-3xl text-[11px] md:text-sm leading-relaxed shadow-lg ${
                        m.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'glass-card text-slate-200 border border-white/10 rounded-tl-none italic bg-black/80 backdrop-blur-md'
                      }`}>
                        {m.text.split('\n').map((line, idx) => (
                          <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-none flex gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 md:p-8 border-t border-white/5 bg-black/90`}>
                <div className={`relative ${isFullScreen ? 'max-w-3xl mx-auto' : ''}`}>
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire with the Oracle..."
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-6 pl-6 pr-16 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all placeholder:text-slate-600`} 
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 rounded-xl text-white shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-30 active:scale-90"
                  >
                    <Send size={isFullScreen ? 24 : 18} />
                  </button>
                </div>
                <div className={`mt-4 flex justify-between items-center px-2 ${isFullScreen ? 'max-w-3xl mx-auto' : ''}`}>
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={isFullScreen ? 14 : 10} className="text-emerald-500" />
                     <span className={`${isFullScreen ? 'text-[10px]' : 'text-[8px]'} font-black text-slate-500 uppercase tracking-widest`}>Shard Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Zap size={isFullScreen ? 14 : 10} className="text-amber-500" />
                     <span className={`${isFullScreen ? 'text-[10px]' : 'text-[8px]'} font-black text-slate-500 uppercase tracking-widest`}>Powered by EOS Cluster</span>
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
          .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6); }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
};

export default FloatingConsultant;
