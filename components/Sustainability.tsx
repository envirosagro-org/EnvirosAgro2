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
  Gauge, CheckCircle2, Dna, Fingerprint, Microscope, ArrowRight,
  ShieldAlert, Lock, Key, ShieldPlus, Database, History, 
  CloudRain, Wind, Scale, Landmark, Boxes, Workflow, 
  Eye, Monitor, AlertCircle, Terminal, Cpu,
  BadgeCheck, Sun, Download, X, Gavel, KeyRound
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

const SYSTEM_MANIFEST = [
  { component: 'Genesis Block', logic: 'System Boot Identity', trad: 'Sacred founding of land', icon: Landmark, col: 'text-indigo-400' },
  { component: 'Entropy Source', logic: 'Bio-Data (Agro Musika)', trad: 'The "rhythm" of environment', icon: Waves, col: 'text-emerald-400' },
  { component: 'Access Control', logic: 'Role-Based Permissions', trad: 'Council of Elders', icon: ShieldPlus, col: 'text-blue-400' },
  { component: 'Validation', logic: 'Proof of Sustainability (PoS)', trad: 'Health of the Mugumo Tree', icon: BadgeCheck, col: 'text-amber-400' },
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
              <circle cx="50" cy={y} r="4" className={`${color} animate-pulse`}>
                <animate attributeName="cx" values="50;150;50" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
              <circle cx="150" cy={y} r="4" className="text-indigo-400 animate-pulse">
                <animate attributeName="cx" values="150;50;150" dur={`${isAggressive ? 2 : 4}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
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

  // Shard HSM states
  const [hsmLocked, setHsmLocked] = useState(true);
  const [isHsmSyncing, setIsHsmSyncing] = useState(false);
  const [hsmEntropy, setHsmEntropy] = useState<string[]>([]);

  const currentOmega = useMemo(() => (atmStatic * 0.75) / (soilResonance * 1.2), [atmStatic, soilResonance]);
  const isNatureAggressive = currentOmega < 1.618;
  const integrityStatus = currentOmega > 1.618 ? 'HIGH' : currentOmega > 1.4 ? 'NOMINAL' : 'FRACTURED';

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
      if (hsmLocked) {
        setHsmEntropy(prev => [...prev, `0x${Math.random().toString(16).slice(2, 6)}`].slice(-4));
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [hsmLocked]);

  const handleRestoreCycle = () => {
    setIsRestoring(true);
    setCalibrationPhase(1);
    
    setTimeout(() => setCalibrationPhase(2), 1000);
    setTimeout(() => setCalibrationPhase(3), 2000);

    setTimeout(() => {
      setIsRestoring(false);
      setCalibrationPhase(0);
      setSoilResonance(0.82);
      setAtmStatic(1.42);
      setShowSuccess(true);
      if (onMintEAT) onMintEAT(50, 'MUGUMO_RECALIBRATION_SHARD');
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3500);
  };

  const unlockHsm = () => {
    setIsHsmSyncing(true);
    setTimeout(() => {
      setHsmLocked(false);
      setIsHsmSyncing(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
      
      {/* 1. Shard Integrity Meter HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${integrityStatus === 'FRACTURED' ? 'opacity-20' : 'opacity-0'}`}>
              <div className="w-full h-full bg-rose-950/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className={`w-48 h-48 rounded-[64px] transition-all duration-1000 flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 shadow-3xl ${
                integrityStatus === 'FRACTURED' ? 'bg-rose-900 shadow-[0_0_80px_rgba(244,63,94,0.4)]' : 'bg-emerald-700 shadow-[0_0_100px_rgba(16,185,129,0.4)]'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {integrityStatus === 'FRACTURED' ? <ShieldAlert size={80} className="text-white animate-pulse" /> : <TreePine size={80} className="text-white relative z-10" />}
                 <div className={`absolute inset-0 border-2 border-dashed rounded-[64px] animate-spin-slow ${integrityStatus === 'FRACTURED' ? 'border-rose-400/40' : 'border-white/20'}`}></div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-2xl border border-white/20 bg-black/80 flex flex-col items-center shadow-2xl">
                 <Radio size={20} className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'} animate-pulse mb-1`} />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">HSM_SYNC</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">HSM_ENCRYPTION_v3.0</span>
                    <span className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border shadow-inner italic ${
                      integrityStatus === 'FRACTURED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>SHARD_STATUS: {integrityStatus}</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Sustainability <span className="text-emerald-400">Shard.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Acting as the root encryption key of the EnvirosAgro OS. Inspired by the Mugumo tree, this shard prevents corruption by unsustainable practices."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">Ω_EQUILIBRIUM</p>
              <h4 className={`text-8xl font-mono font-black tracking-tighter leading-none drop-shadow-2xl italic transition-colors ${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {currentOmega.toFixed(3)}
              </h4>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-4 italic">Baseline Tolerance: 1.618</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>System Access</span>
                 <span className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500 animate-pulse font-black' : 'text-emerald-400'} font-mono`}>
                   {integrityStatus === 'FRACTURED' ? 'READ_ONLY_MODE' : 'FULL_EXECUTION_ACTIVE'}
                 </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className={`h-full rounded-full transition-all duration-1000 ${integrityStatus === 'FRACTURED' ? 'bg-rose-500 shadow-[0_0_20px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_20px_#10b981]'}`} style={{ width: `${Math.min(100, (currentOmega / 2.5) * 100)}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. The Mugumo Root: Decentralized Identity (DID) */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-3xl relative overflow-hidden group min-h-[650px] flex flex-col items-center">
              <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
              <div className="text-center relative z-10 space-y-4 mb-10">
                <div className="flex items-center justify-center gap-3">
                   <Fingerprint className="w-8 h-8 text-emerald-400 animate-pulse" />
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-widest">Mugumo <span className="text-emerald-400">Root DID</span></h3>
                </div>
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Proprietary_Encryption_Roots</p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                <DNAHelix progress={100} color={integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-500'} isAggressive={integrityStatus === 'FRACTURED'} />
                
                {/* Public Key: The Canopy */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in fade-in duration-1000">
                   <div className="px-6 py-4 glass-card rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/10 shadow-2xl flex items-center gap-4">
                      <Sun size={24} className="text-emerald-400" />
                      <div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Public Key: The Canopy</p>
                         <p className="text-sm font-mono font-bold text-white uppercase">Visible Sustainability Metrics</p>
                      </div>
                   </div>
                   <div className="w-[1px] h-16 bg-gradient-to-b from-emerald-500/40 to-transparent"></div>
                </div>

                {/* Private Key: The Roots */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center animate-in fade-in duration-1000 delay-500">
                   <div className="w-[1px] h-16 bg-gradient-to-t from-indigo-500/40 to-transparent"></div>
                   <div className={`px-6 py-4 glass-card rounded-3xl border-2 border-indigo-500/30 bg-indigo-500/10 shadow-2xl flex items-center gap-4 transition-all ${hsmLocked ? 'blur-md grayscale' : ''}`}>
                      <KeyRound size={24} className="text-indigo-400" />
                      <div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Private Key: The Roots</p>
                         <p className="text-sm font-mono font-bold text-white uppercase">Agro-Genetic & Microbial Code</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 w-full relative z-10">
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-6 bg-black/80 rounded-3xl border border-white/5 shadow-inner group/canopy hover:border-emerald-500/30 transition-all">
                       <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Public Canopy Shard</p>
                       <span className="text-[10px] text-emerald-400 font-mono italic">Yield, Carbon Credits, Vouch Shards</span>
                    </div>
                    <div className="p-6 bg-black/80 rounded-3xl border border-white/5 shadow-inner group/roots hover:border-indigo-500/30 transition-all">
                       <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Private Root Shard</p>
                       <span className="text-[10px] text-indigo-400 font-mono italic">Proprietary DNA, Soil Analytics</span>
                    </div>
                 </div>
                 {hsmLocked ? (
                   <button 
                     onClick={unlockHsm}
                     disabled={isHsmSyncing}
                     className="w-full py-6 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 border border-indigo-500/20 shadow-xl ring-8 ring-white/0 hover:ring-indigo-500/5"
                   >
                      {isHsmSyncing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                      {isHsmSyncing ? 'CONSULTING ELDERS...' : 'UNLOCK PRIVATE ROOT HSM'}
                   </button>
                 ) : (
                   <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                         <Download size={16} /> EXPORT IDENTITY SHARD
                      </button>
                      <button onClick={() => setHsmLocked(true)} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-rose-500 transition-colors"><X size={16}/></button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* 3. System Manifest: The Shard Specification */}
        <div className="lg:col-span-7 space-y-10">
           <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Scale size={400} /></div>
              <div className="flex justify-between items-center mb-12 relative z-10 px-4">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl border-4 border-white/10">
                       <Database size={32} className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-emerald-400">Manifest</span></h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase mt-3 tracking-widest">HSM_SPECIFICATION_SHARD</p>
                    </div>
                 </div>
                 <div className="text-right border-l border-white/10 pl-8">
                    <p className="text-[10px] text-slate-600 font-black uppercase mb-1">VERIFICATION QUORUM</p>
                    <p className="text-3xl font-mono font-black text-white italic">ELDERS_OK</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                 {SYSTEM_MANIFEST.map((item, i) => (
                    <div key={i} className="p-8 bg-black/60 rounded-[40px] border border-white/10 shadow-inner group/item hover:border-emerald-500/20 transition-all flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-6">
                          <div className={`p-4 rounded-2xl bg-white/5 ${item.col} shadow-xl group-hover/item:rotate-6 transition-transform`}>
                             <item.icon size={24} />
                          </div>
                          <span className="text-[8px] font-mono text-slate-700 font-black uppercase tracking-[0.4em]">SHARD_MANIFEST_0{i+1}</span>
                       </div>
                       <div className="space-y-4">
                          <div>
                             <h5 className="text-xl font-black text-white uppercase italic leading-none">{item.component}</h5>
                             <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2">{item.logic}</p>
                          </div>
                          <div className="h-px bg-white/5 w-full"></div>
                          <p className="text-xs text-slate-500 italic opacity-80 group-hover/item:opacity-100">"Agikuyu Tradition Equivalent: {item.trad}"</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* 4. Restoration Script: The medicag brand Protocol */}
           <div className={`glass-card p-12 rounded-[64px] border-2 transition-all duration-1000 shadow-3xl relative overflow-hidden group ${
              integrityStatus === 'FRACTURED' ? 'border-rose-500/30 bg-rose-950/10' : 'border-emerald-500/10 bg-emerald-950/10'
           }`}>
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Cpu size={300} className={integrityStatus === 'FRACTURED' ? 'text-rose-400' : 'text-emerald-400'} /></div>
              
              <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform ${integrityStatus === 'FRACTURED' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                       <Sparkles className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Restoration <span className={integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'}>Script</span></h3>
                       <p className="text-code text-slate-500 font-black uppercase tracking-widest mt-2">AUTOMATED_REMEDIATION_PROTOCOL</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="p-10 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner text-left">
                       <p className="text-slate-400 text-xl italic font-medium leading-relaxed">
                         {integrityStatus === 'FRACTURED' ? (
                           <>CRITICAL_ALERT: Your node is in **Read-Only Mode**. Deploying <span className="text-rose-400 font-black">medicag brand</span> remediation shards to reset soil biometrics and social immunity.</>
                         ) : (
                           <>SYSTEM_NOMINAL: Perfect resonance with the environment. Growth Tokens generated via the <span className="text-emerald-400 font-black">medicag brand</span> integrity audit.</>
                         )}
                       </p>
                       <div className="flex gap-3">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border ${
                             integrityStatus === 'FRACTURED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>MEDICAG_BRAND_ARMED</span>
                          <span className="px-4 py-1.5 bg-white/5 text-[8px] font-black uppercase rounded-full border border-white/10 text-slate-500">ZK_SESSION_SECURE</span>
                       </div>
                    </div>
                    <div className="relative">
                       <button 
                         onClick={handleRestoreCycle}
                         disabled={isRestoring}
                         className={`w-full py-12 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-6 ring-8 ring-white/5 border-4 border-white/10 ${integrityStatus === 'FRACTURED' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40 animate-glow-rose' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 group-hover:scale-105'}`}
                       >
                          {isRestoring ? <Loader2 size={24} className="animate-spin" /> : integrityStatus === 'FRACTURED' ? <Zap size={24} className="fill-current" /> : <RefreshCw size={24} />}
                          {isRestoring ? (
                            calibrationPhase === 1 ? 'Hashing State...' :
                            calibrationPhase === 2 ? 'Bonding Shards...' : 'Anchoring Proof...'
                          ) : integrityStatus === 'FRACTURED' ? 'DEPLOY REMEDIATION' : 'RECALIBRATE HSM'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 5. Success Overlay */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 duration-500">
           <div className="glass-card p-10 rounded-[48px] border-emerald-500/40 bg-[#050706] shadow-[0_0_150px_rgba(16,185,129,0.3)] flex items-center gap-10 border-2">
              <div className="w-20 h-20 rounded-full agro-gradient flex items-center justify-center text-white shadow-2xl relative overflow-hidden">
                 <CheckCircle2 size(40) />
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              </div>
              <div>
                 <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Ledger <span className="text-emerald-400">Resonant.</span></h4>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Growth Token Generated // HSM Quorum Active</p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dna-float {
          0%, 100 { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-dna-float { animation: dna-float 4s ease-in-out infinite; }
        @keyframes glow-rose {
          0%, 100% { box-shadow: 0 0 20px rgba(244, 63, 94, 0.4); }
          50% { box-shadow: 0 0 50px rgba(244, 63, 94, 0.7); }
        }
        .animate-glow-rose { animation: glow-rose 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Sustainability;
