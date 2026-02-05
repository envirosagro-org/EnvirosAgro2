import React, { useState, useMemo, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { User, ViewState } from '../types';
import { 
  Leaf, Activity, Zap, Info, ShieldCheck, Binary, 
  Sprout, TrendingUp, Loader2, Waves, 
  TreePine, Radio, Target, Heart, Atom, Sparkles, RefreshCw, AlertTriangle,
  Gauge, CheckCircle2, Dna, Fingerprint, Microscope, ArrowRight
} from 'lucide-react';

interface SustainabilityProps {
  user: User;
  onAction?: () => void;
  onMintEAT?: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
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
  { name: 'Societal', val: 84, color: '#f43f5e', code: 'G' },
  { name: 'Environmental', val: 96, color: '#10b981', code: 'A' },
  { name: 'Human', val: 78, color: '#14b8a6', code: 'C' },
  { name: 'Technological', val: 92, color: '#3b82f6', code: 'T' },
  { name: 'Industry', val: 88, color: '#818cf8', code: 'I' },
];

const DNAHelix: React.FC<{ progress: number; color: string; isAggressive: boolean }> = ({ progress, color, isAggressive }) => {
  return (
    <div className="relative w-full h-80 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 400" className="w-full h-full opacity-80">
        <defs>
          <linearGradient id="helixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {[...Array(12)].map((_, i) => {
          const y = i * 35;
          const delay = i * 0.2;
          return (
            <g key={i} className="animate-dna-float">
              {/* Strand 1 Node */}
              <circle cx="50" cy={y} r="4" className={`${color} animate-pulse`}>
                <animate 
                  attributeName="cx" 
                  values="50;150;50" 
                  dur={`${isAggressive ? 2 : 4}s`} 
                  begin={`${delay}s`} 
                  repeatCount="indefinite" 
                />
              </circle>
              {/* Strand 2 Node */}
              <circle cx="150" cy={y} r="4" className="text-indigo-400 animate-pulse">
                <animate 
                  attributeName="cx" 
                  values="150;50;150" 
                  dur={`${isAggressive ? 2 : 4}s`} 
                  begin={`${delay}s`} 
                  repeatCount="indefinite" 
                />
              </circle>
              {/* Connector Bar */}
              <line y1={y} y2={y} stroke="currentColor" strokeWidth="1" className="text-white/10">
                <animate attributeName="x1" values="50;150;50" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="x2" values="150;50;150" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </line>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Sustainability: React.FC<SustainabilityProps> = ({ user, onMintEAT, onNavigate }) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [atmStatic, setAtmStatic] = useState(0.88);
  const [soilResonance, setSoilResonance] = useState(0.45);
  const [calibrationPhase, setCalibrationPhase] = useState(0);

  const currentOmega = useMemo(() => (atmStatic * 0.75) / (soilResonance * 1.2), [atmStatic, soilResonance]);
  const isNatureAggressive = currentOmega < 1.618;

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRestoreCycle = () => {
    setIsRestoring(true);
    setCalibrationPhase(1);
    
    // Multi-stage calibration sequence
    setTimeout(() => setCalibrationPhase(2), 1000);
    setTimeout(() => setCalibrationPhase(3), 2000);

    setTimeout(() => {
      setIsRestoring(false);
      setCalibrationPhase(0);
      setSoilResonance(0.82);
      setAtmStatic(1.42);
      setShowSuccess(true);
      if (onMintEAT) onMintEAT(50, 'MUGUMO_HELIX_RECALIBRATION');
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3500);
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
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Mugumo_Sync</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner italic">HELIX_ANCHOR_ACTIVE</span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">Ω_RESONANCE_MONITOR</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">SUSTAINABILITY <span className="text-emerald-400">SHARD.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Maintaining the biological m-constant via the Mugumo DNA Helix. Analyzing helical drift to ensure 100% ecological coherence."
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
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 italic">Target: 1.618 (PHI)</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Helical State</span>
                 <span className={`${isNatureAggressive ? 'text-rose-500 animate-pulse' : 'text-emerald-400'} font-mono`}>
                   {isNatureAggressive ? 'DISSONANT' : 'SYNCED'}
                 </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className={`h-full rounded-full transition-all duration-1000 ${isNatureAggressive ? 'bg-rose-500 shadow-[0_0_20px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_20px_#10b981]'}`} style={{ width: `${(currentOmega / 2.5) * 100}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Mugumo DNA Helix Visualizer */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-3xl relative overflow-hidden group min-h-[600px] flex flex-col items-center">
              <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
              <div className="text-center relative z-10 space-y-4 mb-10">
                <div className="flex items-center justify-center gap-3">
                   <Dna className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Mugumo <span className="text-emerald-400">Helix</span></h3>
                </div>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Genetic_Resonance_Shard</p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <DNAHelix 
                  progress={100} 
                  color={isNatureAggressive ? 'text-rose-500' : 'text-emerald-500'} 
                  isAggressive={isNatureAggressive} 
                />
                
                {/* Overlay Metric Shards */}
                <div className="absolute top-1/4 left-0 p-4 glass-card rounded-2xl border border-white/10 backdrop-blur-xl animate-float">
                   <p className="text-[8px] text-slate-500 font-black uppercase">A: AGRO-BIO</p>
                   <p className="text-xs font-mono font-bold text-white">0x882A</p>
                </div>
                <div className="absolute top-1/3 right-0 p-4 glass-card rounded-2xl border border-white/10 backdrop-blur-xl animate-float" style={{ animationDelay: '-2s' }}>
                   <p className="text-[8px] text-slate-500 font-black uppercase">T: TECH</p>
                   <p className="text-xs font-mono font-bold text-white">0x104T</p>
                </div>
                <div className="absolute bottom-1/4 left-4 p-4 glass-card rounded-2xl border border-white/10 backdrop-blur-xl animate-float" style={{ animationDelay: '-4s' }}>
                   <p className="text-[8px] text-slate-500 font-black uppercase">C: CONSUME</p>
                   <p className="text-xs font-mono font-bold text-white">0x042C</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 w-full relative z-10 text-center">
                 <p className="text-[10px] text-slate-600 font-medium italic mb-6">"Mapping regional biological base-pairs."</p>
                 <button 
                  onClick={() => onNavigate('biotech_hub')}
                  className="w-full py-4 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-emerald-500/20"
                 >
                    <Microscope size={16} /> DECODE GENETIC SHARD <ArrowRight size={14} />
                 </button>
              </div>
           </div>
        </div>

        {/* 3. Resonance History & Calibration */}
        <div className="lg:col-span-8 space-y-10">
           <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-black/20 h-[450px] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Waves size={400} /></div>
              <div className="flex justify-between items-center mb-12 relative z-10 px-4">
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
              
              <div className="flex-1 h-[250px] w-full relative z-10">
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
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-950/10 space-y-10 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Atom size={300} className="text-emerald-400" /></div>
              
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                       <Sparkles className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Mugumo <span className="text-emerald-400">Calibration</span></h3>
                       <p className="text-[10px] text-emerald-400/60 font-black uppercase tracking-widest mt-2">GENETIC_RECALIBRATION_PROTOCOL</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner text-center">
                       <p className="text-slate-400 text-sm italic font-medium leading-relaxed px-4">
                         "Initiating a restoration cycle aligns the local DNA helix with the planetaryPHI frequency to mitigate S-factor drift."
                       </p>
                       {isNatureAggressive && (
                         <div className="flex items-center justify-center gap-3 py-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase animate-pulse">
                            <AlertTriangle size={14} /> Critical: Helical Dissonance
                         </div>
                       )}
                    </div>
                    <div className="relative">
                       <button 
                         onClick={handleRestoreCycle}
                         disabled={isRestoring}
                         className={`w-full py-12 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-5 ring-8 ring-white/5 ${isNatureAggressive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                       >
                          {isRestoring ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                          {isRestoring ? (
                            calibrationPhase === 1 ? 'Sequencing Helix...' :
                            calibrationPhase === 2 ? 'Bonding Shards...' : 'Finalizing Protocol...'
                          ) : isNatureAggressive ? 'RESTORE HARMONY' : 'CALIBRATE HELIX'}
                       </button>
                    </div>
                 </div>
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
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Shard +50 EAC // Helix Sync Stable</p>
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
        @keyframes dna-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-dna-float { animation: dna-float 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Sustainability;
