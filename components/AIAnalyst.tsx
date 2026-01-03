
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, BarChart2, ShieldCheck, Info, TrendingUp, Globe, ExternalLink } from 'lucide-react';
import { chatWithAgroExpert, analyzeSustainability, AIResponse, GroundingChunk } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: GroundingChunk[];
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

    const response = await chatWithAgroExpert(userMessage, history, useSearch);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: response.text,
      sources: response.sources
    }]);
    setIsAnalyzing(false);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-4 h-full flex flex-col">
        <div className="glass-card p-5 rounded-2xl flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white">AI Capabilities</h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">Real-time Search</span>
              </div>
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={`w-10 h-5 rounded-full relative transition-all ${useSearch ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useSearch ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <button 
              onClick={handleQuickAnalysis}
              disabled={isAnalyzing}
              className="w-full flex items-center gap-3 p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-600/20 transition-all text-sm font-medium"
            >
              <BarChart2 className="w-4 h-4" />
              Sustainability Audit
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-600/20 transition-all text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Verify Soil Health
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-600/20 transition-all text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              Predict Yields
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Active Farm Context</h4>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium text-sm">Farm #US-291</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-400">Maize - 42.5 Hectares</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl bg-amber-500/5 border-amber-500/20">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              When Search is enabled, Gemini consultations include real-time web references and grounding sources.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-3 glass-card rounded-2xl flex flex-col h-full overflow-hidden relative">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 agro-gradient rounded-full flex items-center justify-center shadow-lg">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Expert Advisor</h3>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                Gemini 3 Flash • {useSearch ? 'Search Grounding ON' : 'Standard Mode'}
              </span>
            </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col gap-2 max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-indigo-600' : 'agro-gradient'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none prose prose-invert'
                  }`}>
                    {m.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-11">
                    {m.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.web?.uri || source.maps?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {source.web?.title || "Source"}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full agro-gradient flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/5">
          <div className="relative">
            <input 
              type="text"
              placeholder="Ask about sustainable practices or your farm data..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isAnalyzing}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;
