
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, BarChart2, ShieldCheck, Info, TrendingUp, Globe, ExternalLink, Trash2, Terminal } from 'lucide-react';
import { chatWithAgroExpert, analyzeSustainability, AIResponse } from '../services/geminiService';
import { SycamoreLogo } from '../App';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

const AIAnalyst: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the EnvirosAgro AI Analyst. I can help you analyze farm telemetry, predict crop yields, or optimize your carbon credit strategy. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isAnalyzing) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAnalyzing(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await chatWithAgroExpert(userMessage, history, useSearch);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text,
        sources: response.sources
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I am having trouble handshaking with the global registry. Please check your node connectivity." 
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickAnalysis = async () => {
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Run a sustainability audit on Farm #US-291' }]);
    
    const farmData = {
      id: 'US-291',
      crop: 'Organic Maize',
      soil: { moisture: 64, ph: 6.8, nitrogen: 'Optimal' },
      history: '3 seasons no-till',
      location: 'Nebraska, USA'
    };

    const response = await analyzeSustainability(farmData);
    setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    setIsAnalyzing(false);
  };

  const clearHistory = () => {
    if (confirm("ARCHIVE_COMMAND: Permanent deletion of current session shards. Proceed?")) {
      setMessages([{ role: 'assistant', content: 'Session sharded and cleared. Initializing new ingest cycle...' }]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] animate-in fade-in duration-700">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-4 h-full flex flex-col">
        <div className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex-1 space-y-6 shadow-xl">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/40"><SycamoreLogo size={24} className="text-white" /></div>
            <h3 className="font-black text-white uppercase italic tracking-widest">Oracle Logic</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between mb-2 hover:border-indigo-500/40 transition-all group">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Search</span>
              </div>
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${useSearch ? 'bg-emerald-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-xl ${useSearch ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <button 
              onClick={handleQuickAnalysis}
              disabled={isAnalyzing}
              className="w-full flex items-center gap-4 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
            >
              <BarChart2 className="w-4 h-4" />
              Sustainability Audit
            </button>
            <button className="w-full flex items-center gap-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95">
              <ShieldCheck className="w-4 h-4" />
              Verify Soil Health
            </button>
            <button className="w-full flex items-center gap-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95">
              <TrendingUp className="w-4 h-4" />
              Predict Yields
            </button>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
            <h4 className="text-[9px] font-black text-slate-700 uppercase mb-4 tracking-[0.4em]">Active Node Context</h4>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-black text-[10px] uppercase italic">Node #US-291</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              </div>
              <p className="text-[9px] text-slate-600 font-mono uppercase">Maize - 42.5 Ha</p>
            </div>
            <button onClick={clearHistory} className="w-full flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-rose-600/10 hover:text-rose-500 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">
              <Trash2 className="w-4 h-4" />
              Clear Shards
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 glass-card rounded-[48px] flex flex-col h-full overflow-hidden relative border-2 border-white/5 bg-[#050706] shadow-3xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 agro-gradient rounded-3xl flex items-center justify-center shadow-xl group">
              <SycamoreLogo size={32} className="text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Neural Analyst</h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="px-3 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">EOS_CORE_STABLE</div>
                <span className="text-[8px] text-slate-600 uppercase tracking-widest font-mono italic">
                  {useSearch ? 'GROUNDED_MODE' : 'KERNEL_ONLY'}
                </span>
              </div>
            </div>
          </div>
          <button className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white transition-all"><Terminal size={20} /></button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scroll-smooth custom-scrollbar"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`flex flex-col gap-4 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border shadow-xl ${m.role === 'user' ? 'bg-indigo-600 border-indigo-400' : 'bg-black border-white/10'}`}>
                    {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <SycamoreLogo size={24} className="text-emerald-400" />}
                  </div>
                  <div className={`p-8 rounded-[40px] text-lg leading-relaxed shadow-2xl relative overflow-hidden ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none border-t-4 border-indigo-400' 
                      : 'bg-black/60 text-slate-200 border border-white/5 rounded-tl-none prose prose-invert border-l-4 border-l-emerald-500 italic font-medium'
                  }`}>
                    {m.role === 'assistant' && <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none"><Sparkles size={100} /></div>}
                    {m.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-4' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-3 ml-16 mt-2">
                    {m.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.web?.uri || source.maps?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 bg-indigo-900/20 border border-indigo-500/20 rounded-xl text-[9px] font-black text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {source.web?.title?.substring(0, 20) || "Registry Shard"}...
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAnalyzing && (
            <div className="flex justify-start animate-in fade-in">
              <div className="flex gap-6">
                <div className="w-10 h-10 shrink-0 rounded-2xl bg-black border border-white/5 flex items-center justify-center animate-pulse">
                  <SycamoreLogo size={24} className="text-emerald-400" />
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none flex items-center gap-4">
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse italic">Sequencing Oracle Response...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/5 bg-black/95">
          <div className="relative group max-w-5xl mx-auto">
            <input 
              type="text"
              placeholder="Query the mesh for industrial patterns..."
              className="w-full bg-white/[0.01] border-2 border-white/5 rounded-[32px] py-8 pl-10 pr-24 text-xl text-white focus:outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all font-medium italic placeholder:text-stone-900 shadow-inner"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isAnalyzing || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-6 bg-indigo-600 rounded-[24px] text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-90"
            >
              <Send className="w-8 h-8" />
            </button>
          </div>
          <div className="mt-6 flex justify-between items-center px-10">
             <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">NEURAL_LINK_STABLE</span>
             </div>
             <p className="text-[9px] text-slate-800 font-mono italic">EOS_ANALYST_v6.5 // AGRO_CODE_CONSENSUS</p>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default AIAnalyst;
