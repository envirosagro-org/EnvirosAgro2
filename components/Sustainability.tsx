
import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, ViewState 
} from '../types';
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

const SYSTEM_MANIFEST = [
  { component: 'Genesis Block', logic: 'System Boot Identity', trad: 'Sacred founding of land', icon: Landmark, col: 'text-indigo-400' },
  { component: 'Entropy Source', logic: 'Bio-Data (Agro Musika)', trad: 'The "rhythm" of environment', icon: Waves, col: 'text-emerald-400' },
  { component: 'Access Control', logic: 'Role-Based Permissions', trad: 'Council of Elders', icon: ShieldPlus, col: 'text-blue-400' },
  { component: 'Validation', logic: 'Proof of Sustainability (PoS)', trad: 'Health of the Mugumo Tree', icon: BadgeCheck, col: 'text-amber-400' },
];

const DNAHelix: React.FC<{ progress: number; color: string; isAggressive: boolean }> = ({ progress, color, isAggressive }) => {
  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 400" className="w-full h-full opacity-80">
        {[...Array(12)].map((_, i) => {
          const y = i * 35;
          const delay = i * 0.2;
          return (
            <g key={i}>
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

  const [hsmLocked, setHsmLocked] = useState(true);
  const [isHsmSyncing, setIsHsmSyncing] = useState(false);

  const currentOmega = useMemo(() => (atmStatic * 0.75) / (soilResonance * 1.2), [atmStatic, soilResonance]);
  const integrityStatus = currentOmega > 1.618 ? 'HIGH' : currentOmega > 1.4 ? 'NOMINAL' : 'FRACTURED';

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 relative">
      
      {/* 1. Shard Integrity HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-8 md:p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-2xl">
           <div className="relative shrink-0">
              <div className={`w-36 h-36 rounded-[40px] transition-all duration-1000 flex items-center justify-center ring-4 ring-white/5 relative overflow-hidden group-hover:scale-105 shadow-xl ${
                integrityStatus === 'FRACTURED' ? 'bg-rose-900' : 'bg-emerald-700'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {integrityStatus === 'FRACTURED' ? <ShieldAlert size={60} className="text-white animate-pulse" /> : <TreePine size={60} className="text-white relative z-10" />}
              </div>
              <div className="absolute -bottom-3 -right-3 p-3 glass-card rounded-2xl bg-black/80 flex flex-col items-center">
                 <Radio size={16} className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'} animate-pulse mb-1`} />
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none">HSM_SYNC</span>
              </div>
           </div>

           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 italic">HSM_CORE_v3.0</span>
                    <span className={`px-3 py-1 text-[8px] font-black uppercase rounded-full tracking-[0.4em] border italic ${
                      integrityStatus === 'FRACTURED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>STATUS: {integrityStatus}</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Sustainability <span className="text-emerald-400">Shard.</span></h2>
              </div>
              <p className="text-slate-400 text-base md:text-lg font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Root encryption key of EnvirosAgro OS. Prevents data corruption by unsustainable practices."
              </p>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group">
           <div className="space-y-2 relative z-10">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.5em] mb-2 italic">Ω_EQUILIBRIUM</p>
              <h4 className={`text-6xl font-mono font-black tracking-tighter leading-none transition-colors ${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {currentOmega.toFixed(3)}
              </h4>
           </div>
           <div className="space-y-4 relative z-10 pt-6 border-t border-white/5 mt-6">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600 tracking-widest">
                 <span>System Access</span>
                 <span className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'} font-mono`}>
                   {integrityStatus === 'FRACTURED' ? 'READ_ONLY' : 'EXECUTION_OK'}
                 </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px">
                 <div className={`h-full rounded-full transition-all duration-1000 ${integrityStatus === 'FRACTURED' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (currentOmega / 2.5) * 100)}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Decentralized Identity */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-black/60 shadow-xl flex flex-col items-center min-h-[450px]">
              <div className="text-center relative z-10 space-y-2 mb-8">
                 <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Mugumo <span className="text-emerald-400">Root DID</span></h3>
                 <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em]">Proprietary_Encryption_Roots</p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center">
                <DNAHelix progress={100} color={integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-500'} isAggressive={integrityStatus === 'FRACTURED'} />
              </div>

              <div className="pt-6 border-t border-white/5 w-full relative z-10">
                 {hsmLocked ? (
                   <button 
                     onClick={unlockHsm}
                     disabled={isHsmSyncing}
                     className="w-full py-5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 border border-indigo-500/20 shadow-xl"
                   >
                      {isHsmSyncing ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                      {isHsmSyncing ? 'SYNCING...' : 'UNLOCK ROOT HSM'}
                   </button>
                 ) : (
                   <button className="w-full py-5 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                      <Download size={14} /> EXPORT IDENTITY SHARD
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* 3. System Manifest */}
        <div className="lg:col-span-7 space-y-8">
           <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/20 shadow-xl group">
              <div className="flex justify-between items-center mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl"><Database size={24} className="text-white" /></div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">System <span className="text-emerald-400">Manifest</span></h3>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                 {SYSTEM_MANIFEST.map((item, i) => (
                    <div key={i} className="p-6 bg-black/60 rounded-[32px] border border-white/10 shadow-inner group hover:border-emerald-500/20 transition-all flex items-center gap-4">
                       <item.icon size={20} className={item.col} />
                       <div>
                          <h5 className="text-sm font-black text-white uppercase italic leading-none">{item.component}</h5>
                          <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1.5 font-medium">{item.logic}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* 4. Restoration Script */}
           <div className={`glass-card p-10 rounded-[48px] border-2 transition-all duration-1000 shadow-xl relative overflow-hidden ${
              integrityStatus === 'FRACTURED' ? 'border-rose-500/30 bg-rose-950/10' : 'border-emerald-500/10 bg-emerald-950/10'
           }`}>
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-xl border border-white/10 ${integrityStatus === 'FRACTURED' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                       <Sparkles size={20} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Restoration <span className={integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'}>Script</span></h3>
                 </div>
                 <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-6 shadow-inner text-left">
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                      {integrityStatus === 'FRACTURED' ? (
                        <>CRITICAL: Deploying <span className="text-rose-400 font-black">MedicAg</span> shards to remediate biometrics.</>
                      ) : (
                        <>NOMINAL: Perfect resonance. Minting multipliers active.</>
                      )}
                    </p>
                    <button 
                      onClick={handleRestoreCycle}
                      disabled={isRestoring}
                      className={`w-full py-5 rounded-[24px] text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${integrityStatus === 'FRACTURED' ? 'bg-rose-600' : 'bg-emerald-600'}`}
                    >
                       {isRestoring ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                       {isRestoring ? 'CALIBRATING...' : 'RECALIBRATE HSM'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Sustainability;
