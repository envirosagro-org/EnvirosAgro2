import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Maximize,
  ArrowRight,
  Target,
  ExternalLink,
  ChevronRight,
  Brain,
  Link2,
  Waves
} from 'lucide-react';
import { chatWithAgroExpert } from '../services/geminiService';
import { User, ViewState } from '../types';

interface FloatingConsultantProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

const WHAT_IS_AG_DEFINITION = 'Agriculture is an application of art or science from nature by human beings towards natural resources such as Animals, plants, water, soil and air for sustainability.';

// Define potential deep link triggers for the AI to recommend
const SHARD_DIRECTORY = [
  { id: 'wallet', label: 'Treasury Node', keywords: ['money', 'eac', 'balance', 'swap', 'deposit', 'withdraw', 'earn', 'wallet'] },
  { id: 'economy', label: 'Market Cloud', keywords: ['buy', 'sell', 'seeds', 'marketplace', 'vendor', 'products', 'procurement', 'price'] },
  { id: 'intelligence', label: 'Science Oracle', keywords: ['science', 'research', 'data', 'telemetry', 'iot', 'sensors', 'analysis', 'results'] },
  { id: 'impact', label: 'Network Impact', keywords: ['carbon', 'sustainability', 'footprint', 'mitigation', 'impact', 'credits', 'm-constant'] },
  { id: 'digital_mrv', label: 'Digital MRV', keywords: ['verify', 'proof', 'evidence', 'satellite', 'verification', 'audit', 'land'] },
  { id: 'community', label: 'Steward Hub', keywords: ['people', 'chat', 'social', 'group', 'guild', 'community', 'learning', 'lms'] },
  { id: 'farm_os', label: 'Farm OS', icon: Link2, keywords: ['code', 'kernel', 'os', 'system', 'terminal', 'logic', 'automate'] },
  { id: 'agrowild', label: 'Agrowild', keywords: ['wild', 'animals', 'tourism', 'safari', 'nature', 'conservancy'] },
  { id: 'sitemap', label: 'Registry Matrix', keywords: ['help', 'navigate', 'where', 'sitemap', 'matrix', 'find', 'shards'] },
];

const FloatingConsultant: React.FC<FloatingConsultantProps> = ({ user, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Position state
  const [position, setPosition] = useState({ x: 20, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [messages, setMessages] = useState<{role: 'bot' | 'user', text: string, bridges?: string[]}[]>([
    { role: 'bot', text: `Greetings Steward ${user.name}. I am the EnvirosAgro™ Concierge Oracle. My logic is anchored to the WhatIsAG™ trademark. How may I bridge you to deep sustainability today?` }
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
      // Analyze msg for deep link keywords locally to supplement AI response
      const suggestedBridges = SHARD_DIRECTORY.filter(shard => 
        shard.keywords.some(k => msg.toLowerCase().includes(k))
      ).map(s => s.id);

      const history = messages.map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const sysInstruction = `You are the EnvirosAgro AI Concierge.
      CORE MISSION: Drive users toward deep agricultural sustainability using the EnvirosAgro OS.
      LOGIC BASE: "${WHAT_IS_AG_DEFINITION}".
      STYLE: Technical, helpful, authoritative, industrial.
      SHARD MAPPING: When a user mentions economy, capital, or buying, mention the "Market Cloud". When they mention data, mention "Science Oracle".
      IF relevant, use the keyword "HANDSHAKE" to signify a technical connection is possible.`;

      const response = await chatWithAgroExpert(`${msg}\n\n(System: Identify relevant industrial shards for this query)`, history);
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.text,
        bridges: suggestedBridges.length > 0 ? suggestedBridges : undefined
      }]);
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
        className="fixed bottom-24 right-10 z-[500] w-16 h-16 bg-black border-2 border-indigo-500/40 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce"
      >
        <Bot size={32} className="text-indigo-400" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>
    );
  }

  const containerStyles = isFullScreen 
    ? { inset: 0, width: '100%', height: '100%' }
    : { left: `${position.x}px`, top: `${position.y}px` };

  return (
    <>
      {/* Dimmed backdrop when consultant is active */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 z-[490] bg-black/60 backdrop-blur-md pointer-events-auto transition-opacity duration-300" onClick={() => setIsMinimized(true)}></div>
      )}
      
      <div 
        ref={containerRef}
        className={`fixed z-[500] select-none transition-all duration-300 ${isDragging ? 'scale-[1.02] cursor-grabbing transition-none' : ''} ${isFullScreen ? 'bg-black/60 backdrop-blur-3xl' : ''}`}
        style={containerStyles}
      >
        <div className={`glass-card border-2 border-indigo-500/40 bg-[#050706]/98 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden mx-auto transition-all duration-300 ${isFullScreen ? 'w-full max-w-5xl h-[90vh] my-[5vh] rounded-[48px]' : isMinimized ? 'w-24 h-24 rounded-[32px]' : 'w-[380px] h-[580px] rounded-[40px]'}`}>
          
          {/* Header / Drag Handle */}
          <div 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`p-4 md:p-6 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between transition-all ${isFullScreen ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg transition-all ${isFullScreen ? 'w-14 h-14' : isMinimized ? 'w-14 h-14' : 'w-10 h-10'}`}>
                <Sparkles size={isFullScreen || isMinimized ? 32 : 24} />
              </div>
              {!isMinimized && (
                <div>
                  <h4 className={`${isFullScreen ? 'text-xl' : 'text-[10px]'} font-black text-white uppercase tracking-widest`}>CONCIERGE ORACLE</h4>
                  <p className={`${isFullScreen ? 'text-xs' : 'text-[8px]'} text-indigo-400 font-bold uppercase tracking-tighter`}>Industrial Deep-Link Logic</p>
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
              <div className={`p-4 bg-emerald-500/5 border-b border-white/5 ${isFullScreen ? 'py-6' : ''}`}>
                <p className={`${isFullScreen ? 'text-sm' : 'text-[8px]'} text-emerald-300 font-black uppercase tracking-[0.2em] text-center italic leading-relaxed px-4`}>
                   "{WHAT_IS_AG_DEFINITION}"
                </p>
              </div>

              <div 
                ref={scrollRef}
                className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar select-text bg-[#050706]`}
              >
                <div className={isFullScreen ? "max-w-4xl mx-auto space-y-10" : "space-y-6"}>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className="flex flex-col gap-3 max-w-[90%]">
                        <div className={`${isFullScreen ? 'p-8' : 'p-4'} rounded-[32px] text-[11px] md:text-sm leading-relaxed shadow-lg ${
                          m.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'glass-card text-slate-200 border border-white/10 rounded-tl-none italic bg-black/60 backdrop-blur-md border-l-4 border-l-indigo-500'
                        }`}>
                          {m.text.split('\n').map((line, idx) => (
                            <p key={idx} className={idx > 0 ? 'mt-3' : ''}>{line}</p>
                          ))}
                        </div>

                        {/* RENDER HANDSHAKE BRIDGES */}
                        {m.bridges && m.bridges.length > 0 && (
                          <div className="flex flex-wrap gap-2 animate-in slide-in-from-left-2 duration-500">
                             {m.bridges.map(bridgeId => {
                               const shard = SHARD_DIRECTORY.find(s => s.id === bridgeId);
                               if (!shard) return null;
                               return (
                                 <button 
                                   key={bridgeId}
                                   onClick={() => { onNavigate(bridgeId as ViewState); setIsMinimized(true); }}
                                   className="px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 hover:border-indigo-400 rounded-full text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95"
                                 >
                                    <Target size={12} /> {shard.label} <ChevronRight size={10} />
                                 </button>
                               );
                             })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/5 p-4 rounded-[32px] rounded-tl-none flex flex-col gap-4">
                        <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest animate-pulse italic">Scanning Industrial Shards...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 md:p-8 border-t border-white/5 bg-black/95`}>
                <div className={`relative ${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Search Shards or Inquire Logic..."
                    className={`w-full bg-white/5 border border-white/10 rounded-2xl py-5 md:py-7 pl-6 pr-16 text-sm md:text-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all placeholder:text-slate-700 italic`} 
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 rounded-xl text-white shadow-xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90"
                  >
                    <Send size={isFullScreen ? 24 : 18} />
                  </button>
                </div>
                {!isFullScreen && (
                   <div className="mt-4 flex justify-between items-center px-4">
                      <div className="flex items-center gap-3">
                         <ShieldCheck size={12} className="text-indigo-400" />
                         <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Handshake Verified</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Waves size={12} className="text-emerald-500" />
                         <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Resonance: 1.42x</span>
                      </div>
                   </div>
                )}
              </div>
            </>
          )}
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
          .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6); }
        `}</style>
      </div>
    </>
  );
};

export default FloatingConsultant;