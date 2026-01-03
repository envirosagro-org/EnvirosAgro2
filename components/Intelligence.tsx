
import React, { useState } from 'react';
import { Camera, Brain, TrendingUp, Search, Sparkles, AlertCircle, Loader2, MapPin, ExternalLink, Globe } from 'lucide-react';
import { predictMarketTrends, searchAgroTrends, findAgroResources, AIResponse, GroundingChunk } from '../services/geminiService';

const Intelligence: React.FC = () => {
  const [mode, setMode] = useState<'doctor' | 'forecast' | 'search' | 'maps'>('doctor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [query, setQuery] = useState('');

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (mode === 'forecast') {
        const data = await predictMarketTrends(query || 'Maize');
        setResult(data);
      } else if (mode === 'search') {
        const data = await searchAgroTrends(query || 'Sustainable Agriculture News');
        setResult(data);
      } else if (mode === 'maps') {
        // Attempt to get user location
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await findAgroResources(query || 'Fertilizer Suppliers', pos.coords.latitude, pos.coords.longitude);
            setResult(data);
            setLoading(false);
          },
          async () => {
            const data = await findAgroResources(query || 'Agro Warehouses');
            setResult(data);
            setLoading(false);
          }
        );
        return; // handleAction will be finished in the callback
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Tool Selection */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-5 h-5 text-emerald-400" />
             <h3 className="font-bold text-white">AI Analyst Modes</h3>
          </div>
          <button 
            onClick={() => { setMode('doctor'); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'doctor' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-bold">Crop Doctor</span>
          </button>
          <button 
            onClick={() => { setMode('forecast'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'forecast' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">Market Intelligence</span>
          </button>
          <button 
            onClick={() => { setMode('search'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'search' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-bold">Search Grounding</span>
          </button>
          <button 
            onClick={() => { setMode('maps'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'maps' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold">Maps Grounding</span>
          </button>
        </div>

        {mode !== 'doctor' && (
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Query</label>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'forecast' ? "Crop type..." : mode === 'search' ? "Search news..." : "Resource type..."}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              onClick={handleAction}
              disabled={loading}
              className="w-full py-3 agro-gradient rounded-xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Processing...' : 'Run Analysis'}
            </button>
          </div>
        )}

        <div className="glass-card p-6 rounded-3xl bg-amber-500/5 border-amber-500/20">
           <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-[10px] text-amber-200/60 leading-relaxed uppercase font-bold tracking-widest">Scientific Advisory</p>
           </div>
           <p className="text-xs text-slate-400 mt-2">All EOS intelligence is verified against real-time web data and Registry nodes.</p>
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
               {mode === 'doctor' ? <Camera className="w-5 h-5" /> : mode === 'forecast' ? <TrendingUp className="w-5 h-5" /> : mode === 'search' ? <Globe className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
               {mode === 'doctor' ? 'Crop Health Diagnostic' : mode === 'forecast' ? 'Market & Climate Intelligence' : mode === 'search' ? 'Real-time Web Search' : 'Nearby Resource Mapping'}
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">
              {mode === 'maps' ? 'Gemini 2.5 Maps' : 'Gemini 3 Flash'}
            </span>
          </div>
          
          <div className="flex-1 p-8 flex flex-col items-start relative overflow-y-auto">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-slate-400 text-sm mt-4 animate-pulse">Consulting real-time grounding nodes...</p>
              </div>
            ) : null}

            {result ? (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="prose prose-invert max-w-none text-slate-300">
                  <div className="p-8 bg-black/40 rounded-3xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm">
                     {result.text}
                  </div>
                </div>

                {result.sources && result.sources.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Grounding References</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.web?.uri || source.maps?.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {source.web ? <Globe className="w-4 h-4 text-blue-400" /> : <MapPin className="w-4 h-4 text-rose-400" />}
                            <span className="text-xs text-slate-300 font-medium truncate">
                              {source.web?.title || source.maps?.title || "View Location"}
                            </span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : mode === 'doctor' ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-dashed border-emerald-500/40">
                   <Camera className="w-12 h-12 text-emerald-400" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-white mb-2">Upload Crop Image</h4>
                   <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Our AI identifies pests, diseases, and nutrient deficiencies from a single photo using EOS Framework logic.</p>
                   <button className="px-8 py-3 agro-gradient rounded-xl text-white font-bold shadow-lg">Select File</button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4">
                 <Brain className="w-16 h-16 text-emerald-500 mx-auto opacity-20" />
                 <p className="text-slate-500 italic">Enter a query and run analysis to get real-time grounded intelligence.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
