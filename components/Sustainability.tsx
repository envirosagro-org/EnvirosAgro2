import React, { useState, useMemo, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  ReferenceLine
} from 'recharts';
import { User } from '../types';
import { 
  Leaf, Cpu, Activity, Zap, Info, ShieldCheck, Binary, 
  Sprout, TrendingUp, BarChart4, Loader2, Waves, 
  TreePine, Radio, Target, Heart, Thermometer, Droplets,
  Wind, Atom, Sparkles, Scale, RefreshCw, AlertTriangle,
  // Added Gauge and CheckCircle2 to fix errors on lines 155 and 285
  Gauge, CheckCircle2
} from 'lucide-react';

interface SustainabilityProps {
  user: User;
  onAction?: () => void;
  onMintEAT?: (amount: number, reason: string) => void;
}

const RESONANCE_HISTORY = [
  { t: '00:00', omega: 1.22, aggression: 10 },
  { t: '04:00', omega: 1.45, aggression: 8 },
  { t: '08:00', omega: 1.61, aggression: 5 },
  { t: '12:00', omega: 1.84, aggression: 2 },
  { t: '16:00', omega: 1.55, aggression: 4 },
  { t: '20:00', omega: 1.32, aggression: 12 },
  { t: '23:59', omega: 1.62, aggression: 5 },
];

const THRUST_ALIGNMENT = [
  { name: 'Societal', val: 84, color: '#f43f5e' },
  { name: 'Environmental', val: 96, color: '#10b981' },
  { name: 'Human', val: 78, color: '#14b8a6' },
  { name: 'Technological', val: 92, color: '#3b82f6' },
  { name: 'Industry', val: 88, color: '#818cf8' },
];

const Sustainability: React.FC<SustainabilityProps> = ({ user, onMintEAT }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Real-time Bio-Signal Metrics
  const [atmStatic, setAtmStatic] = useState(0.88);
  const [soilResonance, setSoilResonance] = useState(0.45);

  // The Equation of Sustainable Frequency (Ω)
  // Ω = (AtmosphericStatic * 0.75) / (SoilResonance * 1.2)
  const currentOmega = useMemo(() => {
    return (atmStatic * 0.75) / (soilResonance * 1.2);
  }, [atmStatic, soilResonance]);

  const mConstant = user.metrics.timeConstantTau;
  const caCode = user.metrics.agriculturalCodeU;
  const isNatureAggressive = currentOmega < 1.618;

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRestoreCycle = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      setSoilResonance(0.82);
      setAtmStatic(1.42);
      setShowSuccess(true);
      if (onMintEAT) {
        onMintEAT(50, 'RITUAL_RESONANCE_RECALIBRATION');
      }
      setTimeout(() => setShowSuccess(false), 4000);
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      
      {/* 1. Bio-Transceiver Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[64px] bg-emerald-700 shadow-[0_0_100px_rgba(16,185,129,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <TreePine size={80} className="text-white relative z-10" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[64px] animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-2xl border border-white/20 bg-black/80 flex flex-col items-center shadow-2xl">
                 <Radio size={20} className="text-emerald-400 animate-pulse mb-1" />
                 <span className="text-[8px] font-black text-slate-500 uppercase">Antenna_Sync</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner italic">MUGUMO_NODE_ACTIVE</span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">Ω_STABILITY_OK</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">SUSTAINABILITY <span className="text-emerald-400">SHARD.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Optimizing the planetary dipole. Analyzing m-constant resonance and atmospheric static to maintain 100% ecological coherence."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">RESONANCE_OMEGA</p>
              <h4 className={`text-8xl font-mono font-black tracking-tighter leading-none drop-shadow-2xl italic transition-colors ${isNatureAggressive ? 'text-rose-500' : 'text-emerald-400'}`}>
                {currentOmega.toFixed(3)}
              </h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">Target: 1.618 (Golden Ratio)</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Nature State</span>
                 <span className={`${isNatureAggressive ? 'text-rose-500 animate-pulse' : 'text-emerald-400'} font-mono`}>
                   {isNatureAggressive ? 'AGGRESSIVE' : 'STABLE'}
                 </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className={`h-full rounded-full transition-all duration-1000 ${isNatureAggressive ? 'bg-rose-500 shadow-[0_0_20px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_20px_#10b981]'}`} style={{ width: `${(currentOmega / 2.5) * 100}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Resonance History & Graph */}
        <div className="lg:col-span-8 space-y-10">
           <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-black/20 h-[500px] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Waves size={400} /></div>
              <div className="flex justify-between items-center mb-16 relative z-10 px-4">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                       <Gauge size={32} className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Resonance <span className="text-emerald-400">Velocity</span></h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase mt-3 tracking-widest">EOS_LIVE_TELEMETRY</p>
                    </div>
                 </div>
                 <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Social Immunity (x)</p>
                    <p className="text-3xl font-mono font-black text-white italic">{user.metrics.socialImmunity}%</p>
                 </div>
              </div>
              
              <div className="flex-1 h-[280px] w-full relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RESONANCE_HISTORY}>
                       <defs>
                          <linearGradient id="colorOmega" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                       <XAxis dataKey="t" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                       <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                       <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '15px' }} />
                       <ReferenceLine y={1.618} stroke="#10b981" strokeDasharray="10 10" strokeWidth={2} label={{ value: 'PHI', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                       <Area type="monotone" name="Resonance Ω" dataKey="omega" stroke="#10b981" strokeWidth={8} fillOpacity={1} fill="url(#colorOmega)" strokeLinecap="round" />
                       <Area type="monotone" name="Nature Aggression" dataKey="aggression" stroke="#f43f5e" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform"><Binary size={150} /></div>
                 <div className="space-y-4 relative z-10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Agricultural Code</p>
                    <h4 className="text-5xl font-mono font-black text-white tracking-tighter italic">C(a) = {caCode.toFixed(3)}</h4>
                    <p className="text-xs text-slate-600 font-medium italic">"Cumulative growth index weighted by planetary rest cycles."</p>
                 </div>
                 <div className="pt-8 mt-10 border-t border-white/5">
                    <button onClick={handleRestoreCycle} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Audit Agro Code Shard</button>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform"><Activity size={150} /></div>
                 <div className="space-y-4 relative z-10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resilience Constant</p>
                    <h4 className="text-5xl font-mono font-black text-emerald-400 tracking-tighter italic">m = {mConstant.toFixed(3)}</h4>
                    <p className="text-xs text-slate-600 font-medium italic">"Node resilience against volatility and environmental shock."</p>
                 </div>
                 <div className="pt-8 mt-10 border-t border-white/5">
                    <button className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                       <Zap size={14} /> TUNE M-RESONANCE
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* 3. Action Hub & SEHTI Matrix */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-950/10 space-y-10 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Atom size={300} className="text-emerald-400" /></div>
              
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                       <Sparkles className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Restoration <span className="text-emerald-400">Cycle</span></h3>
                       <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-widest mt-2">MUGUMO_SACRIFICE_PROTOCOL</p>
                    </div>
                 </div>

                 <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner text-center">
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed px-4">
                      "Inject biological frequency shards to lower soil resistance and trigger immediate precipitation sync."
                    </p>
                    {isNatureAggressive && (
                      <div className="flex items-center justify-center gap-3 py-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase animate-pulse">
                         <AlertTriangle size={14} /> Critical: High Nature Aggression
                      </div>
                    )}
                 </div>
              </div>

              <div className="pt-4 relative z-10">
                 <button 
                   onClick={handleRestoreCycle}
                   disabled={isRestoring}
                   className={`w-full py-8 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-5 ring-8 ring-white/5 ${isNatureAggressive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                 >
                    {isRestoring ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                    {isRestoring ? 'RECALIBRATING...' : isNatureAggressive ? 'INITIATE RITUAL RESTORE' : 'MAINTAIN HARMONY'}
                 </button>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
              <h4 className="text-xl font-black text-white uppercase italic tracking-widest px-4 flex items-center gap-4">
                 <Target size={24} className="text-indigo-400" /> SEHTI <span className="text-indigo-400">Resonance</span>
              </h4>
              <div className="space-y-6">
                 {THRUST_ALIGNMENT.map(t => (
                    <div key={t.name} className="space-y-2 group">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-slate-200 transition-colors">{t.name}</span>
                          <span className="text-xs font-mono font-black text-white">{t.val}%</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                          <div className="h-full rounded-full transition-all duration-[2s]" style={{ width: `${t.val}%`, backgroundColor: t.color }}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
           <div className="glass-card p-8 rounded-[40px] border-emerald-500/40 bg-[#050706] shadow-[0_0_150px_rgba(16,185,129,0.3)] flex items-center gap-8 border-2">
              <div className="w-16 h-16 rounded-full agro-gradient flex items-center justify-center text-white shadow-2xl">
                 <CheckCircle2 size={32} />
              </div>
              <div>
                 <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Consensus <span className="text-emerald-400">Reached.</span></h4>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Shard +50 EAC // Resilience Anchor Stable</p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Sustainability;
