
import React, { useState, useMemo, useEffect } from 'react';
// Added missing icon imports (Award, Download, Fingerprint) to resolve compilation errors
import { 
  Scale, Calculator, Coins, TrendingUp, TrendingDown, 
  ShieldCheck, Activity, Target, Zap, Bot, Sparkles, 
  Loader2, ArrowRight, Gauge, History, Database, 
  Layers, Binary, Landmark, Briefcase, Workflow,
  FileDigit, PieChart, BarChart4, ChevronRight, 
  ArrowUpRight, Info, ShieldAlert, BadgeCheck, 
  Gavel, Stamp, SearchCode, DollarSign,
  Award, Download, Fingerprint
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RechartsPie, Pie
} from 'recharts';
import { User, ShardCostCalibration } from '../types';
import { getFullCostAudit, calibrateShardCost } from '../services/costAccountingService';
import { chatWithAgroExpert } from '../services/geminiService';

interface CostAccountingProps {
  user: User;
  onNavigate: (view: any) => void;
  notify: any;
}

const COST_DISTRIBUTION = [
  { name: 'Environmental_Sync', value: 40, color: '#10b981' },
  { name: 'Registry_Handshake', value: 25, color: '#3b82f6' },
  { name: 'Oracle_Consult', value: 20, color: '#6366f1' },
  { name: 'Mesh_Propagate', value: 15, color: '#f59e0b' },
];

const CostAccounting: React.FC<CostAccountingProps> = ({ user, onNavigate, notify }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [oracleAdvice, setOracleAdvice] = useState<string | null>(null);
  
  const audit = useMemo(() => getFullCostAudit(100, user.metrics), [user.metrics]);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setOracleAdvice(null);
    try {
      const prompt = `Act as the EnvirosAgro Cost Accounting Oracle. Analyze node ${user.esin} metrics:
      m-constant: ${audit.mConstant}
      Ca-AgroCode: ${user.metrics.agriculturalCodeU}
      Sustainability Score: ${user.metrics.sustainabilityScore}
      
      Calculate the "Economic Resistance Shard". Identify cost centers that are leaking energy. 
      Propose a 3-stage sharding strategy to reduce procurement overhead by 15%.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setOracleAdvice(res.text);
    } catch (e) {
      setOracleAdvice("Handshake Interrupted. Registry drift detected in Cost Center Alpha.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4">
      
      {/* 1. Industrial Cost HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'NODE_OVERHEAD_BASE', val: audit.calibratedCost, unit: 'EAC', col: 'text-rose-400', icon: TrendingDown, desc: 'Calibrated Sharding Fee' },
          { label: 'MINTING_POTENTIAL', val: audit.finalYield, unit: 'EAC', col: 'text-emerald-400', icon: TrendingUp, desc: 'Resonance-Weighted Yield' },
          { label: 'STRESS_PENALTY', val: audit.stressPenalty, unit: '%', col: 'text-amber-500', icon: ShieldAlert, desc: 'Efficiency Tax' },
          { label: 'RESONANCE_BONUS', val: audit.sehtiBonus, unit: '%', col: 'text-blue-400', icon: Award, desc: 'Thrust Multiplier' },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-card rounded-[48px] bg-black/40 border border-white/5 flex flex-col justify-between h-[240px] group hover:border-white/10 transition-all shadow-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><m.icon size={120} /></div>
             <div className="space-y-4 relative z-10">
                <p className={`text-[10px] ${m.col} font-black uppercase tracking-[0.5em]`}>{m.label}</p>
                <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{m.val}<span className="text-xl opacity-30 ml-1 italic">{m.unit}</span></h4>
                <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest">"{m.desc}"</p>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Main Logic Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Left: Shard Cost Matrix */}
         <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-[#050706] relative overflow-hidden shadow-3xl group">
               <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
               <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10 px-4">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-float">
                        <Scale size={40} />
                     </div>
                     <div>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Cost <span className="text-indigo-400">Centers</span></h3>
                        <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.6em] uppercase mt-4 italic">SHARD_ACCOUNTING_v1.0</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">M-Resonance Context</p>
                     <p className="text-4xl font-mono font-black text-emerald-400 leading-none mt-2">{audit.mConstant.toFixed(3)}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10 px-4">
                  <div className="space-y-8">
                     <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                        <Calculator size={24} className="text-indigo-500" /> Shard Price Calibrator
                     </h4>
                     <div className="space-y-6">
                        {[
                           { l: 'Base Protocol Cost', v: '100 EAC', b: 'bg-slate-800' },
                           { l: 'Resonance Calibration', v: `-${( (1 - (1/audit.mConstant)) * 100).toFixed(1)}%`, b: 'bg-emerald-600/20 text-emerald-400' },
                           { l: 'Network Load Factor', v: '+5%', b: 'bg-rose-600/10 text-rose-500' },
                        ].map((item, i) => (
                           <div key={i} className={`p-6 rounded-3xl flex justify-between items-center border border-white/5 ${item.b}`}>
                              <span className="text-xs font-black uppercase text-slate-400">{item.l}</span>
                              <span className="text-lg font-mono font-black">{item.v}</span>
                           </div>
                        ))}
                        <div className="p-10 bg-indigo-600 rounded-[44px] shadow-[0_0_100px_rgba(99,102,241,0.3)] text-center space-y-2 border-4 border-white/10 group-hover:scale-105 transition-all">
                           <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">FINALIZED_SHARD_COST</p>
                           <p className="text-7xl font-mono font-black text-white tracking-tighter">{audit.calibratedCost} <span className="text-xl">EAC</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 h-full flex flex-col">
                     <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                        <Activity size={24} className="text-emerald-500" /> Utility Distribution
                     </h4>
                     <div className="flex-1 bg-black/40 rounded-[48px] border border-white/5 p-6 shadow-inner">
                        <ResponsiveContainer width="100%" height="100%">
                           <RechartsPie>
                              <Pie
                                 data={COST_DISTRIBUTION}
                                 innerRadius={60}
                                 outerRadius={100}
                                 paddingAngle={8}
                                 dataKey="value"
                              >
                                 {COST_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                 ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                           </RechartsPie>
                        </ResponsiveContainer>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        {COST_DISTRIBUTION.map(c => (
                           <div key={c.name} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></div>
                              <span className="text-[8px] font-black uppercase text-slate-600 truncate">{c.name}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 px-4">
                  <div className="flex items-center gap-6">
                     <Stamp size={40} className="text-indigo-400" />
                     <div className="text-left">
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Accounting Shard ID</p>
                        <p className="text-lg font-mono text-white">0xHS_COST_#{(Math.random()*1000).toFixed(0)}</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="px-10 py-5 bg-white/5 border-2 border-white/10 rounded-full text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Download size={20} /> Download Ledger
                     </button>
                     <button className="px-16 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-white/5">
                        <Stamp size={20} /> COMMENCE SETTLEMENT
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Right: AI Cost Advisor */}
         <div className="lg:col-span-4 space-y-8 h-full flex flex-col">
            <div className="glass-card p-12 rounded-[56px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden shadow-3xl flex flex-col flex-1 group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Bot size={400} /></div>
               
               <div className="relative z-10 space-y-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-6 border-b border-indigo-500/20 pb-8">
                     <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center text-white border-2 border-white/10 group-hover:rotate-12 transition-transform">
                        <Bot size={32} className="animate-pulse" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Supply Chain <span className="text-indigo-400">Advisor</span></h3>
                        <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-2 italic leading-none">ORACLE_COST_AUDIT</p>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 py-4">
                     {!oracleAdvice && !isAuditing ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group/idle">
                           <Database size={80} className="text-slate-600 group-hover/idle:text-indigo-400 transition-colors duration-1000" />
                           <p className="text-xl font-black uppercase tracking-[0.4em] text-white italic">ORACLE_STANDBY</p>
                        </div>
                     ) : isAuditing ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-10 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 size={100} className="text-indigo-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Fingerprint size={40} className="text-indigo-400 animate-pulse" />
                              </div>
                           </div>
                           <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">AUDITING_REGISTRY...</p>
                        </div>
                     ) : (
                        <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-10">
                           <div className="p-8 bg-black/80 rounded-[48px] border border-indigo-500/20 shadow-inner border-l-8 border-l-indigo-600 relative overflow-hidden group/text">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/text:scale-125 transition-transform duration-[15s]"><Sparkles size={200} /></div>
                              <div className="text-slate-300 text-lg leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4">
                                 {oracleAdvice}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="pt-8 border-t border-indigo-500/10">
                    <button 
                      onClick={handleRunAudit}
                      disabled={isAuditing}
                      className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5 relative z-10 group/btn"
                    >
                       {isAuditing ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <Zap size={28} className="mx-auto group-hover/btn:rotate-12 transition-transform" />}
                       <p className="mt-4">{isAuditing ? 'CALCULATING DRIFT...' : 'RUN COST AUDIT'}</p>
                    </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Optimized Supply Chain Sharding */}
      <div className="p-16 md:p-20 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <Layers className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-32 h-32 md:w-44 md:h-44 bg-emerald-600 rounded-[44px] flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] animate-pulse ring-[24px] ring-white/5 shrink-0 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Stamp size={80} className="text-white relative z-20 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">COST <span className="text-emerald-400">FINALITY</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-3xl opacity-80">
                 "Cost accounting in the mesh ensures that liquidity follows resonance. By sharding expenses based on real-time $m$ and $C_a$ constants, we eliminate the inflation of unverified industrial labor."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-16 hidden xl:block">
            <p className="text-[16px] text-slate-600 font-black uppercase mb-8 tracking-[0.8em] border-b border-white/10 pb-6">NETWORK_EQUILIBRIUM</p>
            <p className="text-[140px] font-mono font-black text-white tracking-tighter leading-none m-0">1.42<span className="text-4xl text-emerald-400 ml-2">μ</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default CostAccounting;
