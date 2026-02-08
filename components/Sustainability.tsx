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
  BadgeCheck, Sun, Download, X, Gavel, KeyRound, Stamp,
  LineChart, Bot,
  // Added FileDigit and ChevronRight to fix errors on lines 212 and 291
  FileDigit, ChevronRight
} from 'lucide-react';
import { analyzeSustainability, AIResponse } from '../services/geminiService';

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
  const [isAuditing, setIsAuditing] = useState(false);
  const [oracleVerdict, setOracleVerdict] = useState<AIResponse | null>(null);

  const currentOmega = useMemo(() => (atmStatic * 0.75) / (soilResonance * 1.2), [atmStatic, soilResonance]);
  const integrityStatus = currentOmega > 1.618 ? 'HIGH' : currentOmega > 1.4 ? 'NOMINAL' : 'FRACTURED';

  useEffect(() => {
    const timer = setInterval(() => {
      setAtmStatic(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(3)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRunDiagnostic = async () => {
    setIsAuditing(true);
    setOracleVerdict(null);
    try {
      const data = {
        node_id: user.esin,
        omega: currentOmega.toFixed(3),
        status: integrityStatus,
        atm_static: atmStatic,
        soil_resonance: soilResonance,
        m_constant: user.metrics.timeConstantTau
      };
      const res = await analyzeSustainability(data);
      setOracleVerdict(res);
    } catch (e) {
      setOracleVerdict({ text: "REGISTRY_TIMEOUT: Could not reach consensus quorum. Manual physical audit recommended." });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleRestoreCycle = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      setSoilResonance(0.82);
      setAtmStatic(1.42);
      setShowSuccess(true);
      if (onMintEAT) onMintEAT(50, 'MUGUMO_RECALIBRATION_SHARD');
      setTimeout(() => setShowSuccess(false), 4000);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 relative max-w-[1400px] mx-auto px-4">
      
      {/* 1. Shard Integrity HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-10 md:p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="relative shrink-0">
              <div className={`w-44 h-44 rounded-[48px] transition-all duration-1000 flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 shadow-3xl ${
                integrityStatus === 'FRACTURED' ? 'bg-rose-900 shadow-rose-900/40' : 'bg-emerald-700 shadow-emerald-900/40'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {integrityStatus === 'FRACTURED' ? <ShieldAlert size={80} className="text-white animate-pulse" /> : <TreePine size={80} className="text-white relative z-10" />}
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-[32px] bg-black/90 border border-white/10 shadow-3xl flex flex-col items-center">
                 <Radio size={20} className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'} animate-pulse mb-1`} />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">ROOT_SYNC</span>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-3">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">HSM_CORE_v6.5</span>
                    <span className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-full tracking-[0.5em] border italic shadow-inner ${
                      integrityStatus === 'FRACTURED' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>STATUS: {integrityStatus}</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Sustainability <span className="text-emerald-400">Shard.</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating the root encryption key of the EnvirosAgro OS. Preventing biological data corruption through industrial resonance auditing."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">Ω_EQUILIBRIUM</p>
              <h4 className={`text-8xl font-mono font-black tracking-tighter leading-none transition-all duration-1000 drop-shadow-2xl ${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'}`}>
                {currentOmega.toFixed(3)}
              </h4>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest">
                 <span>System Permissions</span>
                 <span className={`${integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-400'} font-mono font-black italic`}>
                   {integrityStatus === 'FRACTURED' ? 'RESTRICTED' : 'AUTHORIZED'}
                 </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                 <div className={`h-full rounded-full transition-all duration-[2s] ${integrityStatus === 'FRACTURED' ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'}`} style={{ width: `${Math.min(100, (currentOmega / 2.5) * 100)}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Resonance Oracle & Spectrogram */}
        <div className="lg:col-span-7 space-y-8">
           <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl relative overflow-hidden flex flex-col group min-h-[600px]">
              <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.02] transition-colors"></div>
              
              <div className="flex justify-between items-center mb-12 relative z-10 border-b border-white/5 pb-8">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10 group-hover:rotate-12 transition-transform">
                       <Bot size={32} className="animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Resonance <span className="text-indigo-400">Oracle</span></h3>
                       <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-2 italic">BIO_SPECTRAL_AUDITOR_v4.2</p>
                    </div>
                 </div>
                 {!oracleVerdict && !isAuditing && (
                   <button 
                    onClick={handleRunDiagnostic}
                    className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all active:scale-90 flex items-center gap-3 border border-white/10"
                   >
                      <Zap size={16} fill="white" /> INITIALIZE AUDIT
                   </button>
                 )}
              </div>

              <div className="flex-1 flex flex-col justify-center relative z-10">
                 {isAuditing ? (
                    <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Binary size={40} className="text-indigo-400 animate-pulse" />
                          </div>
                       </div>
                       <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">SEQUENCING SHARD RESONANCE...</p>
                    </div>
                 ) : oracleVerdict ? (
                    <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-6">
                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-indigo-600 relative overflow-hidden group/shard">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><Sparkles size={600} className="text-indigo-400" /></div>
                          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8 relative z-10">
                             <FileDigit size={32} className="text-indigo-400" />
                             <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Diagnostic Shard Report</h4>
                          </div>
                          <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/10">
                             {oracleVerdict.text}
                          </div>
                       </div>
                       <div className="flex justify-center gap-8 relative z-10">
                          <button onClick={() => setOracleVerdict(null)} className="px-14 py-6 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                          <button className="px-24 py-6 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-8 ring-white/5">
                             <Stamp size={28} /> ANCHOR TO LEDGER
                          </button>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-16 py-12 flex flex-col items-center">
                       {/* High-Fidelity Waveform Visualizer */}
                       <div className="flex items-end gap-2 h-48 justify-center w-full max-w-2xl px-10">
                          {[...Array(30)].map((_, i) => (
                             <div 
                               key={i} 
                               className={`flex-1 rounded-full transition-all duration-[2s] ${integrityStatus === 'FRACTURED' ? 'bg-rose-500/40 animate-pulse' : 'bg-emerald-500/40 animate-bounce'}`}
                               style={{ 
                                  height: `${20 + Math.random() * (integrityStatus === 'FRACTURED' ? 40 : 80)}%`,
                                  animationDelay: `${i * 0.08}s`,
                                  animationDuration: `${1 + Math.random()}s`
                               }}
                             ></div>
                          ))}
                       </div>
                       <div className="text-center space-y-4 opacity-30 group-hover:opacity-60 transition-opacity">
                          <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">AWAITING_INGEST</p>
                          <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Perform audit to synchronize planetary biometrics</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right: Decentralized Identity & HSM */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/60 shadow-3xl flex flex-col items-center min-h-[500px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.03)_0%,_transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-[10s]"></div>
              <div className="text-center relative z-10 space-y-4 mb-12">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Mugumo <span className="text-emerald-400">Root DID</span></h3>
                 <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] italic">PROPRIETARY_ENCRYPTION_v6</p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center">
                <DNAHelix progress={100} color={integrityStatus === 'FRACTURED' ? 'text-rose-500' : 'text-emerald-500'} isAggressive={integrityStatus === 'FRACTURED'} />
              </div>

              <div className="pt-10 border-t border-white/5 w-full relative z-10 mt-10">
                 <button className="w-full py-7 bg-white/5 border border-white/10 rounded-[36px] text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-6">
                    <Fingerprint size={24} className="text-indigo-400" /> UNLOCK ROOT HSM
                 </button>
              </div>
           </div>

           {/* System Manifest Card */}
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/20 shadow-3xl group">
              <div className="flex items-center gap-6 mb-10 relative z-10 px-4">
                 <div className="p-4 bg-emerald-600 rounded-[28px] shadow-3xl border-2 border-white/10 group-hover:rotate-6 transition-transform">
                    <Database size={24} className="text-white" />
                 </div>
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-emerald-400">Manifest</span></h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4 relative z-10">
                 {SYSTEM_MANIFEST.map((item, i) => (
                    <div key={i} className="p-6 bg-black/80 rounded-[32px] border-2 border-white/5 shadow-inner group/item hover:border-emerald-500/20 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${item.col} group-hover/item:scale-110 transition-transform`}><item.icon size={20} /></div>
                          <div>
                             <h5 className="text-sm font-black text-white uppercase italic leading-none">{item.component}</h5>
                             <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-2 font-bold italic">{item.logic}</p>
                          </div>
                       </div>
                       <ChevronRight className="text-slate-800 group-hover/item:translate-x-1 group-hover/item:text-emerald-500 transition-all" size={16} />
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Sustainability;