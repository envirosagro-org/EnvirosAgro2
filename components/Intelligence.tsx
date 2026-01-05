import React, { useState } from 'react';
import { Camera, Brain, TrendingUp, Search, Sparkles, AlertCircle, Loader2, MapPin, ExternalLink, Globe, ShieldAlert, Users, Heart, Dna, Flame } from 'lucide-react';
import { predictMarketTrends, searchAgroTrends, findAgroResources, AIResponse, GroundingChunk, analyzeSocialInfluenza } from '../services/geminiService';

const Intelligence: React.FC = () => {
  const [mode, setMode] = useState<'doctor' | 'forecast' | 'sid' | 'maps'>('doctor');
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
      } else if (mode === 'sid') {
        // Node identification simulation
        const nodeData = { node_id: query || 'Global-Steward-Node', context: 'Intergenerational ideological conflict detection' };
        const data = await analyzeSocialInfluenza(nodeData);
        setResult(data);
      } else if (mode === 'maps') {
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
        return; 
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
            onClick={() => { setMode('sid'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'sid' ? 'bg-rose-600 text-white shadow-rose-950/40 shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm font-bold">Social Pathogen Scan</span>
          </button>
          <button 
            onClick={() => { setMode('forecast'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'forecast' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-bold">Market Intel</span>
          </button>
          <button 
            onClick={() => { setMode('maps'); setQuery(''); setResult(null); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === 'maps' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold">Maps Grounding</span>
          </button>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Parameters</label>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={mode === 'sid' ? "Enter Node ID or Narrative..." : "Query..."}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              onClick={handleAction}
              disabled={loading}
              className="w-full py-4 agro-gradient rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Consulting Oracle...' : 'Run Analysis'}
            </button>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className={`glass-card rounded-[40px] overflow-hidden min-h-[550px] flex flex-col border ${mode === 'sid' ? 'border-rose-500/20' : 'border-white/5'}`}>
          <div className={`p-8 border-b border-white/5 bg-white/5 flex items-center justify-between ${mode === 'sid' ? 'bg-rose-950/10' : ''}`}>
            <h3 className="font-bold text-white flex items-center gap-3">
               {mode === 'sid' ? <Flame className="w-6 h-6 text-rose-500" /> : <Brain className="w-6 h-6 text-emerald-400" />}
               {mode === 'sid' ? 'Social Influenza Diagnostics' : 'Industrial Intelligence'}
            </h3>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border ${mode === 'sid' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              Oracle Sync Active
            </span>
          </div>
          
          <div className="flex-1 p-10 relative overflow-y-auto">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md z-10">
                <Loader2 className="w-16 h-16 text-rose-500 animate-spin" />
                <p className="text-rose-400 font-black text-xs mt-6 animate-pulse uppercase tracking-[0.4em]">Deconstructing intergenerational narratives...</p>
              </div>
            )}

            {result ? (
              <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-10 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none shadow-2xl relative overflow-hidden">
                   {mode === 'sid' && <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><ShieldAlert className="w-32 h-32 text-rose-500" /></div>}
                   <div className="text-slate-300 whitespace-pre-wrap leading-relaxed italic text-lg relative z-10">
                      {result.text}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="glass-card p-8 rounded-[32px] bg-emerald-500/5 border-emerald-500/20 flex items-center gap-6 group hover:bg-emerald-500/10 transition-all">
                      <Heart className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">Remediation Path</h4>
                         <p className="text-[10px] text-slate-500 leading-relaxed mt-1 uppercase">Positive Language & Community Vouching Node</p>
                      </div>
                   </div>
                   <div className="glass-card p-8 rounded-[32px] bg-blue-500/5 border-blue-500/20 flex items-center gap-6 group hover:bg-blue-500/10 transition-all">
                      <Users className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">Social Immunity</h4>
                         <p className="text-[10px] text-slate-500 leading-relaxed mt-1 uppercase">Steward Resilience Multiplier Enabled</p>
                      </div>
                   </div>
                </div>
              </div>
            ) : mode === 'sid' ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-8 py-20 animate-in zoom-in duration-500">
                <div className="w-32 h-32 rounded-[40px] bg-rose-500/10 border-2 border-dashed border-rose-500/40 flex items-center justify-center group overflow-hidden">
                   <ShieldAlert className="w-14 h-14 text-rose-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="max-w-md space-y-4">
                   <h4 className="text-2xl font-black text-white uppercase tracking-tight">Social Pathogen Scanner</h4>
                   <p className="text-slate-500 leading-relaxed font-medium italic">"Identify and mitigate intergenerational trauma nodes to unlock higher C(a)™ Agro Code growth."</p>
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