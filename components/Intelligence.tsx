
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
  ArrowRight,
  X,
  Maximize,
  LocateFixed,
  Focus
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
  const [showScanner, setShowScanner] = useState(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20 animate-in fade-in duration-700">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-8 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-6 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
             <Brain className="w-40 h-40 text-indigo-400" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 shadow-xl">
                <Sparkles className="w-5 h-5 text-indigo-400" />
             </div>
             <h3 className="font-black text-white uppercase text-xs tracking-[0.3em]">Oracle Cluster</h3>
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
                  {mode === m.id && <Zap className="w-3 h-3 fill-current animate-pulse" />}
                </button>
              );
            })}
            <div className="pt-4 border-t border-white/5 space-y-3">
               {[
                 { id: 'media', label: 'Video Analysis', icon: Video, color: 'bg-blue-600' },
                 { id: 'forecast', label: 'Trend Forecast', icon: TrendingUp, color: 'bg-indigo-600' },
                 { id: 'maps', label: 'Geo-Grounding', icon: MapPin, color: 'bg-amber-600' },
               ].map(m => {
                 const Icon = m.icon;
                 return (
                   <button key={m.id} onClick={() => { setMode(m.id as any); setResult(null); setMediaFile(null); }} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${mode === m.id ? `${m.color} text-white shadow-xl` : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                     <Icon className="w-4 h-4" />
                     <span className="text-xs font-black uppercase tracking-widest">{m.label}</span>
                   </button>
                 );
               })}
            </div>
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
               <Activity className="w-4 h-4 text-emerald-500" />
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence Ingest Terminal</h4>
            </div>
            
            {['plant', 'animal', 'water', 'soil', 'air', 'media'].includes(mode) && (
              <div className="grid grid-cols-1 gap-4">
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
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Upload Data Shard</p>
                     </div>
                   )}
                </div>
                <button 
                  onClick={() => setShowScanner(true)}
                  className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                >
                  <Camera className="w-4 h-4" /> Live Field Scan
                </button>
              </div>
            )}
            
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest px-2">Oracle Briefing</label>
               <textarea 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder={`Instruct the ${mode} specialist...`} 
                className="w-full bg-black/60 border border-white/10 rounded-[24px] p-5 text-white text-xs h-32 resize-none outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-800 italic font-medium" 
               />
            </div>

            <div className="pt-4 border-t border-white/5">
               <div className="flex justify-between items-center px-2 mb-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Network Bounty</span>
                  <span className="text-[10px] font-mono font-black text-emerald-400">{PRO_FEE} EAC</span>
               </div>
               <button 
                onClick={handleAuthorizeSweep} 
                disabled={loading || (['plant', 'animal', 'water', 'soil', 'air', 'media'].includes(mode) && !mediaFile)} 
                className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
               >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5 fill-current" />}
                {loading ? 'SYNTHESIZING...' : 'AUTHORIZE ORACLE SYNC'}
              </button>
            </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <div className="glass-card rounded-[56px] overflow-hidden min-h-[750px] flex flex-col border border-white/5 bg-black/20 shadow-[0_0_100px_rgba(99,102,241,0.05)]">
          <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl ${selectedSpecialist?.color || 'bg-indigo-600'} shadow-2xl ring-4 ring-white/5`}>
                 <SpecialistIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{selectedSpecialist?.label || 'Neural Oracle'} <span className="text-indigo-400">Hub</span></h3>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 font-mono">EOS INTEL PROTOCOL v3.2.1-STABLE</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">BUFFER_RESERVE: 32K_TOKENS</span>
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
            </div>
          </div>

          <div className="flex-1 p-12 relative overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl z-10 animate-in fade-in duration-500">
                <div className="relative">
                   <div className="w-40 h-40 rounded-full border-4 border-emerald-500/10 flex items-center justify-center relative">
                      <Scan className="w-20 h-20 text-emerald-500 animate-pulse" />
                   </div>
                   <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                </div>
                <div className="mt-10 space-y-4 text-center">
                   <p className="text-emerald-400 font-black text-xl mt-6 animate-pulse uppercase tracking-[0.5em] italic">Deconstructing Shard Data...</p>
                   <div className="flex justify-center gap-1">
                      {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-6 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                   </div>
                </div>
              </div>
            )}
            
            {result ? (
              <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="p-12 bg-black/60 rounded-[56px] border border-white/10 prose prose-invert max-w-none shadow-3xl relative overflow-hidden border-l-8 border-l-indigo-500/50">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                      <SpecialistIcon className="w-[500px] h-[500px]" />
                   </div>
                   <div className="flex items-center gap-6 mb-12 pb-8 border-b border-white/5 relative z-10">
                      <div className="w-14 h-14 rounded-[24px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                         <Bot className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Oracle Intelligence Shard</h4>
                         <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase font-black">VALIDATED_VIA_RESONANCE_SCAN_842</p>
                      </div>
                   </div>
                   <div className="text-slate-200 whitespace-pre-wrap leading-[2.4] italic text-xl relative z-10 font-medium border-l-4 border-emerald-500/20 pl-10 bg-white/[0.01] p-10 rounded-[32px]">
                      {result.text}
                   </div>
                   
                   <div className="mt-16 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center relative z-10 gap-8">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Audit Signature</p>
                            <p className="text-xs font-mono text-white">0x882_DIAG_EOS_FINAL</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <button className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl active:scale-95">Download PDF Shard</button>
                         <button className="px-10 py-5 agro-gradient rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-2xl shadow-emerald-900/40 active:scale-95">Anchor to Ledger</button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { label: 'C(a) Impact', val: '+1.84', unit: 'Index', icon: TrendingUp, col: 'text-emerald-400', bg: 'bg-emerald-500/5' },
                     { label: 'Trust Grade', val: 'OPTIMAL', unit: '', icon: ShieldCheck, col: 'text-blue-400', bg: 'bg-blue-500/5' },
                     { label: 'Resilience (m)', val: '1.42x', unit: '', icon: Activity, col: 'text-amber-400', bg: 'bg-amber-500/5' },
                   ].map((shard, i) => (
                     <div key={i} className={`glass-card p-10 rounded-[44px] border border-white/5 flex flex-col items-center text-center space-y-6 group hover:scale-105 transition-all shadow-2xl ${shard.bg}`}>
                        <div className="p-5 bg-white/5 rounded-[32px] border border-white/10 group-hover:rotate-6 transition-transform shadow-inner">
                           <shard.icon className={`w-8 h-8 ${shard.col}`} />
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">{shard.label}</h4>
                           <p className={`text-4xl font-black ${shard.col} font-mono tracking-tighter`}>{shard.val} <span className="text-xs font-sans ml-1 text-slate-600">{shard.unit}</span></p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-12 py-20 animate-in fade-in duration-700">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] opacity-20 group-hover:opacity-50 transition-opacity rounded-full"></div>
                    <div className="w-48 h-48 rounded-[64px] bg-black/60 border-2 border-white/5 flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform duration-1000 shadow-2xl ring-1 ring-white/10">
                       <Bot className="w-24 h-24 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#050706] rounded-[32px] border-2 border-indigo-500/40 flex items-center justify-center z-20 shadow-2xl shadow-indigo-900/40 group-hover:scale-110 transition-transform">
                       <Lock className="w-10 h-10 text-indigo-400" />
                    </div>
                 </div>
                 <div className="max-w-xl space-y-8 relative z-10">
                    <div className="space-y-4">
                       <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-indigo-400">Session Required</span></h4>
                       <p className="text-slate-500 text-xl italic leading-relaxed font-medium">
                          "Select a specialized Diagnostic Node and authorize the capital sweep to initialize a high-fidelity Oracle synchronization."
                       </p>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                       <div className="px-10 py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4 backdrop-blur-xl">
                          <Coins className="w-6 h-6 text-emerald-500" />
                          <span className="text-sm font-mono font-black text-white">{PRO_FEE} EAC SYSTEM BOUNTY</span>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-12 opacity-30 pt-16 border-t border-white/5 w-full max-w-2xl">
                    {[
                      { l: 'CROP_MINT', i: Sprout },
                      { l: 'ANIMAL_HEALTH', i: Dog },
                      { l: 'AESTHETIC_SYNC', i: Sparkles },
                    ].map(s => {
                      const Icon = s.i;
                      return (
                        <div key={s.l} className="flex flex-col items-center gap-4 group">
                           <div className="p-4 bg-white/5 rounded-2xl border border-transparent group-hover:border-white/10 transition-all">
                              <Icon className="w-10 h-10 text-slate-500 group-hover:text-indigo-400" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">{s.l}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Field Scanner Modal (Enhanced Interaction) */}
      {showScanner && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowScanner(false)}></div>
           <div className="relative z-10 w-full max-w-5xl h-[85vh] glass-card rounded-[64px] border-emerald-500/30 bg-black overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300 border-2">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=1200')] bg-cover opacity-60"></div>
              
              {/* HUD Elements */}
              <div className="absolute inset-0 pointer-events-none z-10">
                 {/* Reticle */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/40 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-emerald-500 rounded-full animate-ping"></div>
                    <div className="absolute inset-[-10px] border-4 border-transparent border-t-emerald-500/60 rounded-full animate-spin"></div>
                    <div className="absolute inset-[-20px] border-2 border-transparent border-b-emerald-500/20 rounded-full animate-spin-slow"></div>
                 </div>

                 {/* Corner Brackets */}
                 <div className="absolute top-10 left-10 w-20 h-20 border-t-4 border-l-4 border-emerald-500/50 rounded-tl-3xl"></div>
                 <div className="absolute top-10 right-10 w-20 h-20 border-t-4 border-r-4 border-emerald-500/50 rounded-tr-3xl"></div>
                 <div className="absolute bottom-10 left-10 w-20 h-20 border-b-4 border-l-4 border-emerald-500/50 rounded-bl-3xl"></div>
                 <div className="absolute bottom-10 right-10 w-20 h-20 border-b-4 border-r-4 border-emerald-500/50 rounded-br-3xl"></div>

                 {/* Data Tags */}
                 <div className="absolute top-20 left-24 p-4 glass-card rounded-2xl bg-black/60 border-emerald-500/20 space-y-2 animate-pulse">
                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Spectral Density</p>
                    <p className="text-xl font-mono font-black text-white">0.942 AR_V</p>
                 </div>
                 <div className="absolute bottom-24 right-24 p-4 glass-card rounded-2xl bg-black/60 border-indigo-500/20 space-y-2">
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">m™ Constant</p>
                    <p className="text-xl font-mono font-black text-white">1.42_SYNC</p>
                 </div>
              </div>

              <div className="relative z-20 p-12 h-full flex flex-col justify-between">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-2xl animate-pulse">
                          <Focus className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Live Field <span className="text-emerald-400">Ingest</span></h3>
                          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] mt-2">EOS_SCANNER_V3 // ACTIVE_SHARD_#842</p>
                       </div>
                    </div>
                    <button onClick={() => setShowScanner(false)} className="p-5 bg-white/10 hover:bg-rose-600 rounded-full text-white transition-all hover:rotate-90 border border-white/5">
                       <X className="w-10 h-10" />
                    </button>
                 </div>

                 <div className="flex flex-col items-center gap-10">
                    <div className="flex gap-4">
                       <button className="px-10 py-6 bg-emerald-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                          <Maximize className="w-5 h-5" /> CAPTURE EVIDENCE SHARD
                       </button>
                    </div>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-[0.5em] animate-pulse">Scanning farm biometrics... Standby for C(a) alignment</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 25s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Intelligence;
