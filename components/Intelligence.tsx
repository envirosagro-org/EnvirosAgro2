
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Brain, 
  TrendingUp, 
  Sparkles, 
  Loader2, 
  MapPin, 
  Mic, 
  Volume2, 
  Video, 
  Zap, 
  ShieldCheck, 
  RefreshCcw, 
  Bot, 
  Activity, 
  Key, 
  Lock, 
  Coins, 
  ShieldAlert, 
  Upload, 
  Heart,
  Droplets,
  Wind,
  Sprout,
  Dog,
  Microscope,
  Binary,
  Waves,
  Scan,
  AlertCircle,
  FileSearch,
  Dna,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { runSpecialistDiagnostic, predictMarketTrends, findAgroResources, AIResponse, analyzeMedia } from '../services/geminiService';

interface IntelligenceProps {
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

type Mode = 'plant' | 'animal' | 'water' | 'soil' | 'air' | 'forecast' | 'maps' | 'media';

const SPECIALISTS = [
  { id: 'plant', label: 'Plant Doctor', icon: Sprout, color: 'bg-emerald-600', thrust: 'Environmental', desc: 'Crop diagnostics & yield optimization.' },
  { id: 'animal', label: 'Animal Doctor', icon: Dog, color: 'bg-rose-600', thrust: 'Societal', desc: 'Livestock health & zoonotic monitoring.' },
  { id: 'water', label: 'Water Doctor', icon: Droplets, color: 'bg-blue-600', thrust: 'Environmental', desc: 'Purity, pH & runoff telemetry audit.' },
  { id: 'soil', label: 'Soil Doctor', icon: Microscope, color: 'bg-amber-600', thrust: 'Technological', desc: 'Biome analysis & nutrient sharding.' },
  { id: 'air', label: 'Air Doctor', icon: Wind, color: 'bg-indigo-600', thrust: 'Environmental', desc: 'Carbon, humidity & atmospheric quality.' },
];

const Intelligence: React.FC<IntelligenceProps> = ({ userBalance, onSpendEAC }) => {
  const [mode, setMode] = useState<Mode>('plant');
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
      if (['plant', 'animal', 'water', 'soil', 'air'].includes(mode)) {
        const res = await runSpecialistDiagnostic(
          mode.charAt(0).toUpperCase() + mode.slice(1), 
          query || `Analyze live evidence shard for current ${mode} state.`, 
          mediaFile?.split(',')[1]
        );
        setResult(res);
      } else if (mode === 'media') {
        const res = await analyzeMedia(mediaFile?.split(',')[1] || "", mediaMime, query || "Explain implications.");
        setResult({ text: res });
      } else if (mode === 'forecast') {
        const data = await predictMarketTrends(query || 'Maize');
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

  const selectedSpecialist = SPECIALISTS.find(s => s.id === mode);
  const SpecialistIcon = selectedSpecialist?.icon || Brain;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
             <Brain className="w-40 h-40 text-indigo-400" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                <Sparkles className="w-5 h-5 text-indigo-400" />
             </div>
             <h3 className="font-black text-white uppercase text-xs tracking-[0.3em]">Oracle Specialists</h3>
          </div>
          
          <div className="space-y-3 relative z-10">
            {SPECIALISTS.map(m => {
              const Icon = m.icon;
              return (
                <button 
                  key={m.id} 
                  onClick={() => { setMode(m.id as any); setResult(null); setMediaFile(null); setQuery(''); }} 
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${mode === m.id ? `${m.color} border-white text-white shadow-2xl scale-105` : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${mode === m.id ? 'text-white' : ''}`} />
                    <div className="text-left">
                      <p className="text-xs font-black uppercase tracking-tight">{m.label}</p>
                      <p className={`text-[8px] font-bold uppercase tracking-widest ${mode === m.id ? 'text-white/60' : 'text-slate-600'}`}>{m.thrust} Thrust</p>
                    </div>
                  </div>
                  {mode === m.id && <Zap className="w-3 h-3 fill-current" />}
                </button>
              );
            })}
            <div className="pt-4 border-t border-white/5 space-y-3">
               {[
                 { id: 'media', label: 'Video Insight', icon: Video, color: 'bg-blue-600' },
                 { id: 'forecast', label: 'Market Forecast', icon: TrendingUp, color: 'bg-indigo-600' },
                 { id: 'maps', label: 'Grounding', icon: MapPin, color: 'bg-amber-600' },
               ].map(m => {
                 const Icon = m.icon;
                 return (
                   <button key={m.id} onClick={() => { setMode(m.id as any); setResult(null); setMediaFile(null); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === m.id ? `${m.color} text-white shadow-lg` : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                     <Icon className="w-4 h-4" />
                     <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                   </button>
                 );
               })}
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] space-y-6">
            <div className="flex items-center gap-3">
               <Activity className="w-4 h-4 text-emerald-500" />
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence Ingest</h4>
            </div>
            
            {['plant', 'animal', 'water', 'soil', 'air', 'media'].includes(mode) && (
              <div 
                onClick={() => mediaInputRef.current?.click()} 
                className="p-8 border-2 border-dashed border-white/10 rounded-[32px] flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all group h-48 bg-black/40 relative overflow-hidden"
              >
                 <input type="file" ref={mediaInputRef} onChange={handleFileUpload} className="hidden" accept={mode === 'media' ? "video/*" : "image/*"} />
                 {mediaFile ? (
                   <img src={mediaFile} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                 ) : (
                   <div className="flex flex-col items-center gap-3">
                     <Upload className="w-8 h-8 text-slate-700 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Upload Shard</p>
                   </div>
                 )}
              </div>
            )}
            
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest px-2">Steward Briefing</label>
               <textarea 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder={`Brief the ${mode} Specialist...`} 
                className="w-full bg-black/60 border border-white/10 rounded-[24px] p-5 text-white text-xs h-32 resize-none outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-slate-800 italic" 
               />
            </div>

            <div className="pt-4 border-t border-white/5">
               <div className="flex justify-between items-center px-2 mb-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Oracle Bounty</span>
                  <span className="text-[10px] font-mono font-black text-emerald-400">{PRO_FEE} EAC</span>
               </div>
               <button 
                onClick={handleAuthorizeSweep} 
                disabled={loading || (['plant', 'animal', 'water', 'soil', 'air', 'media'].includes(mode) && !mediaFile)} 
                className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
               >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5 fill-current" />}
                {loading ? 'SYNTHESIZING...' : 'AUTHORIZE ORACLE'}
              </button>
            </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card rounded-[56px] overflow-hidden min-h-[750px] flex flex-col border border-white/5 bg-black/20 shadow-[0_0_100px_rgba(99,102,241,0.05)]">
          <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl ${selectedSpecialist?.color || 'bg-indigo-600'} shadow-xl`}>
                 <SpecialistIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{selectedSpecialist?.label || 'Oracle Node'} <span className="text-indigo-400">Terminal</span></h3>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">EOS Industrial Intelligence // Protocol v3.2</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">THINKING_BUDGET: 32K</span>
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 p-12 relative overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl z-10 animate-in fade-in duration-500">
                <div className="relative">
                   <div className="w-32 h-32 rounded-full border-4 border-emerald-500/10 flex items-center justify-center relative">
                      <Scan className="w-16 h-16 text-emerald-500 animate-pulse" />
                   </div>
                   <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                </div>
                <div className="mt-10 space-y-2 text-center">
                   <p className="text-emerald-400 font-black text-sm mt-6 animate-pulse uppercase tracking-[0.5em]">Specialist {mode.toUpperCase()} Audit Active</p>
                   <p className="text-slate-700 font-mono text-[10px]">DECONSTRUCTING SHARD DATA...</p>
                </div>
              </div>
            )}
            
            {result ? (
              <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="p-12 bg-black/60 rounded-[56px] border border-white/10 prose prose-invert max-w-none shadow-3xl relative overflow-hidden border-l-8 border-l-indigo-500/50">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                      <SpecialistIcon className="w-96 h-96" />
                   </div>
                   <div className="flex items-center gap-6 mb-10 pb-6 border-b border-white/5 relative z-10">
                      <div className="w-14 h-14 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                         <Bot className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Oracle Intelligence Shard</h4>
                         <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">Verified by Regional Cluster Validator #842</p>
                      </div>
                   </div>
                   <div className="text-slate-300 whitespace-pre-wrap leading-[2.2] italic text-xl relative z-10 font-medium border-l-4 border-emerald-500/20 pl-10">
                      {result.text}
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                         </div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Audit Hash: 0x882_DIAG_EOS</p>
                      </div>
                      <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all">Export Protocol Shard</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="glass-card p-8 rounded-[40px] bg-emerald-500/5 border-emerald-500/20 flex flex-col items-center text-center space-y-4 group hover:bg-emerald-500/10 transition-all">
                      <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 group-hover:rotate-6 transition-transform">
                         <TrendingUp className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">C(a) Impact</h4>
                         <p className="text-3xl font-mono font-black text-emerald-400">+1.84 <span className="text-sm">Factor</span></p>
                      </div>
                   </div>
                   <div className="glass-card p-8 rounded-[40px] bg-blue-500/5 border-blue-500/20 flex flex-col items-center text-center space-y-4 group hover:bg-blue-500/10 transition-all">
                      <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30 group-hover:-rotate-6 transition-transform">
                         <ShieldCheck className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pillar Alignment</h4>
                         <p className="text-3xl font-black text-blue-400 uppercase italic">OPTIMAL</p>
                      </div>
                   </div>
                   <div className="glass-card p-8 rounded-[40px] bg-amber-500/5 border-amber-500/20 flex flex-col items-center text-center space-y-4 group hover:bg-amber-500/10 transition-all">
                      <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 group-hover:rotate-12 transition-transform">
                         <Activity className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">m-Stability</h4>
                         <p className="text-3xl font-mono font-black text-amber-500">1.42x</p>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-12 py-20 animate-in fade-in duration-700">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity"></div>
                    <div className="w-40 h-40 rounded-[56px] bg-black/60 border-2 border-white/5 flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform duration-700 shadow-2xl">
                       <Bot className="w-20 h-20 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#050706] rounded-2xl border border-indigo-500/40 flex items-center justify-center z-20">
                       <Lock className="w-8 h-8 text-indigo-400" />
                    </div>
                 </div>
                 <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-indigo-400">Standby</span></h4>
                       <p className="text-slate-500 text-lg italic leading-relaxed">
                          "Select a specialized Diagnostic Doctor and authorize the capital sweep to initialize a high-fidelity Oracle session."
                       </p>
                    </div>
                    <div className="flex justify-center gap-4">
                       <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                          <Coins className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-mono font-bold text-white">{PRO_FEE} EAC REQUIRED</span>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-6 opacity-30 pt-10 border-t border-white/5 w-full max-w-lg">
                    {[
                      { l: 'PLANTS', i: Sprout },
                      { l: 'ANIMALS', i: Dog },
                      { l: 'WATER', i: Droplets },
                    ].map(s => {
                      const Icon = s.i;
                      return (
                        <div key={s.l} className="flex flex-col items-center gap-2">
                           <Icon className="w-6 h-6 text-slate-500" />
                           <span className="text-[8px] font-black uppercase tracking-widest">{s.l}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Intelligence;
