
import React, { useState, useRef } from 'react';
import { Camera, Brain, TrendingUp, Sparkles, Loader2, MapPin, Mic, Volume2, Video, Zap, ShieldCheck, RefreshCcw, Bot, Activity, Key, Lock, Coins, ShieldAlert, Upload, Heart } from 'lucide-react';
import { predictMarketTrends, findAgroResources, AIResponse, analyzeSocialInfluenza, diagnoseCropIssue, analyzeMedia } from '../services/geminiService';

interface IntelligenceProps {
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const Intelligence: React.FC<IntelligenceProps> = ({ userBalance, onSpendEAC }) => {
  const [mode, setMode] = useState<'doctor' | 'forecast' | 'sid' | 'maps' | 'media'>('doctor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [query, setQuery] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const PRO_FEE = 25;

  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaMime, setMediaMime] = useState('');
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleAuthorizeSweep = () => {
    if (onSpendEAC(PRO_FEE, `ORACLE_THINKING_${mode.toUpperCase()}`)) {
      setIsAuthorized(true);
      handleAction();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaMime(file.type);
    const reader = new FileReader();
    reader.onloadend = () => setMediaFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (mode === 'doctor') {
        const res = await diagnoseCropIssue(query || "Identify anomalies.", mediaFile?.split(',')[1]);
        setResult({ text: res.text });
      } else if (mode === 'media') {
        const res = await analyzeMedia(mediaFile?.split(',')[1] || "", mediaMime, query || "Explain implications.");
        setResult({ text: res });
      } else if (mode === 'forecast') {
        const data = await predictMarketTrends(query || 'Maize');
        setResult(data);
      } else if (mode === 'sid') {
        const data = await analyzeSocialInfluenza({ query: query || 'Global-Node' });
        setResult(data);
      } else if (mode === 'maps') {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await findAgroResources(query || 'Warehouse', pos.coords.latitude, pos.coords.longitude);
            setResult(data);
            setLoading(false);
          },
          async () => {
            const data = await findAgroResources(query || 'Agro Suppliers');
            setResult(data);
            setLoading(false);
          }
        );
        return; 
      }
    } catch (e) { console.error(e); }
    setLoading(false);
    setIsAuthorized(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-5 h-5 text-emerald-400" />
             <h3 className="font-bold text-white uppercase text-xs tracking-widest">Oracle Modes</h3>
          </div>
          {[
            { id: 'doctor', label: 'Pro Crop Doctor', icon: Camera, color: 'bg-emerald-600' },
            { id: 'media', label: 'Video Insight', icon: Video, color: 'bg-blue-600' },
            { id: 'sid', label: 'SID Pathogens', icon: ShieldAlert, color: 'bg-rose-600' },
            { id: 'forecast', label: 'Market Forecast', icon: TrendingUp, color: 'bg-indigo-600' },
            { id: 'maps', label: 'Grounding', icon: MapPin, color: 'bg-amber-600' },
          ].map(m => (
            <button key={m.id} onClick={() => { setMode(m.id as any); setResult(null); setMediaFile(null); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === m.id ? `${m.color} text-white shadow-lg` : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
              <m.icon className="w-4 h-4" />
              <span className="text-sm font-bold">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Oracle Ingest</label>
            {(mode === 'doctor' || mode === 'media') && (
              <div onClick={() => mediaInputRef.current?.click()} className="p-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 transition-all group h-40 bg-black/40">
                 <input type="file" ref={mediaInputRef} onChange={handleFileUpload} className="hidden" accept={mode === 'media' ? "video/*" : "image/*"} />
                 {mediaFile ? (
                   <img src={mediaFile} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                 ) : (
                   <div className="flex flex-col items-center gap-2">
                     <Upload className="w-6 h-6 text-emerald-400" />
                     <p className="text-[10px] text-slate-500 font-bold uppercase">Upload Shard</p>
                   </div>
                 )}
              </div>
            )}
            <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter technical prompt..." className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-sm h-24 resize-none outline-none focus:ring-1 focus:ring-emerald-500" />
            <div className="pt-2">
               <div className="flex justify-between items-center px-2 mb-2">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Session Fee</span>
                  <span className="text-[10px] font-mono font-black text-emerald-400">{PRO_FEE} EAC</span>
               </div>
               <button onClick={handleAuthorizeSweep} disabled={loading || ((mode === 'doctor' || mode === 'media') && !mediaFile)} className="w-full py-5 agro-gradient rounded-xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4 fill-current" />}
                {loading ? 'Consulting Oracle...' : 'AUTHORIZE PRO SWEEP'}
              </button>
            </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card rounded-[40px] overflow-hidden min-h-[550px] flex flex-col border border-white/5 bg-black/20">
          <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-3 uppercase tracking-tighter italic"><Brain className="w-6 h-6 text-indigo-400" />Industrial Intelligence <span className="text-emerald-400">Node</span></h3>
            <span className="text-[9px] font-black uppercase px-3 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">GEMINI_3_PRO</span>
          </div>
          <div className="flex-1 p-10 relative overflow-y-auto">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10">
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                <p className="text-emerald-400 font-black text-xs mt-6 animate-pulse uppercase tracking-[0.4em]">Deconstructing shards (32k Budget)...</p>
              </div>
            )}
            {result ? (
              <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-10 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none shadow-2xl relative border-l-4 border-l-indigo-500/50">
                   <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center"><Bot className="w-6 h-6 text-emerald-400" /></div><h4 className="text-sm font-black text-white uppercase tracking-widest">Oracle Briefing</h4></div>
                   <div className="text-slate-300 whitespace-pre-wrap leading-relaxed italic text-lg">{result.text}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="glass-card p-6 rounded-[32px] bg-emerald-500/5 border-emerald-500/20 flex items-center gap-6"><Heart className="w-8 h-8 text-emerald-400" /><div><h4 className="text-[10px] font-black text-white uppercase">C(a) Impact</h4><p className="text-xs text-emerald-400 font-mono font-bold">+1.24 Factor</p></div></div>
                   <div className="glass-card p-6 rounded-[32px] bg-blue-500/5 border-blue-500/20 flex items-center gap-6"><ShieldCheck className="w-8 h-8 text-blue-400" /><div><h4 className="text-[10px] font-black text-white uppercase">Vetting</h4><p className="text-xs text-blue-400 font-mono font-bold">NODE_SYNC_OK</p></div></div>
                   <div className="glass-card p-6 rounded-[32px] bg-amber-500/5 border-amber-500/20 flex items-center gap-6"><Activity className="w-8 h-8 text-amber-400" /><div><h4 className="text-[10px] font-black text-white uppercase">Registry</h4><p className="text-xs text-amber-400 font-mono font-bold">SETTLED</p></div></div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-8 py-20 opacity-20">
                 <div className="relative"><Brain className="w-24 h-24 text-emerald-500 animate-pulse" /><Lock className="absolute bottom-0 right-0 w-8 h-8 text-rose-500" /></div>
                 <div className="max-w-xs"><h4 className="text-2xl font-black text-white uppercase">Oracle Standby</h4><p className="text-slate-500 text-sm italic">Pro Thinking Session requires 25 EAC capital commitment.</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intelligence;
