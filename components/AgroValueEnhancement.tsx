
import React, { useState } from 'react';
import { 
  FlaskConical, 
  Binary, 
  TrendingUp, 
  Recycle, 
  Zap, 
  Loader2, 
  ChevronRight, 
  Info, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Gauge,
  Bot,
  Microscope,
  Box,
  Flame,
  ArrowUpRight,
  FileCode,
  Sparkles,
  Download,
  Terminal,
  Target,
  BadgeCheck,
  Factory,
  // Fix: Adding missing icon imports from lucide-react
  X,
  Activity,
  Layers,
  Stamp,
  Fingerprint,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';
import { generateValueEnhancementStrategy } from '../services/geminiService';

interface AgroValueEnhancementProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
}

const AgroValueEnhancement: React.FC<AgroValueEnhancementProps> = ({ user, onSpendEAC, onEarnEAC }) => {
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [context, setContext] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [strategy, setStrategy] = useState<any | null>(null);

  const handleSynthesis = async () => {
    if (!material || !weight) return;
    
    const COST = 30;
    if (!onSpendEAC(COST, `VALUE_ENHANCEMENT_SYNTHESIS_${material.toUpperCase()}`)) return;

    setIsSynthesizing(true);
    setStrategy(null);

    try {
      const result = await generateValueEnhancementStrategy(material, weight, context);
      setStrategy(result);
      onEarnEAC(10, 'VALUE_ENHANCEMENT_RESEARCH_BONUS');
    } catch (err) {
      alert("Oracle synthesis interrupted. Check node connectivity.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <FlaskConical className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
            <FlaskConical className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">VALUE_ENHANCEMENT_ENGINE_v1</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Agro <span className="text-emerald-400">Enhancement</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Designing industrial conversion processes to mint value from agricultural waste. Engineering the transition from biomass to sharded economic assets."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Control Area */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Binary size={250} className="text-emerald-400" /></div>
              
              <div className="flex items-center gap-4 relative z-10">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Database className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge <span className="text-emerald-400">Inflow</span></h3>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Raw Material Source</label>
                    <input 
                      type="text" value={material} onChange={e => setMaterial(e.target.value)}
                      placeholder="e.g. Cashew Apples, Rice Husks..."
                      className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-800" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Material Mass (kg/L)</label>
                    <input 
                      type="text" value={weight} onChange={e => setWeight(e.target.value)}
                      placeholder="e.g. 500kg"
                      className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-800" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Market Context / Goals</label>
                    <textarea 
                      value={context} onChange={e => setContext(e.target.value)}
                      placeholder="e.g. Current market for ethanol is high, focus on circularity..."
                      className="w-full bg-black border border-white/10 rounded-3xl p-6 text-white text-sm font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none h-32 resize-none placeholder:text-slate-800 shadow-inner"
                    />
                 </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-6 relative z-10">
                 <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-3">
                       <Zap className="w-5 h-5 text-amber-500" />
                       <span className="text-sm font-black text-white uppercase">Synthesis Cost</span>
                    </div>
                    <span className="text-2xl font-mono font-black text-emerald-400">30 EAC</span>
                 </div>
                 <button 
                  onClick={handleSynthesis}
                  disabled={isSynthesizing || !material || !weight}
                  className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30"
                 >
                    {isSynthesizing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Bot className="w-8 h-8 fill-current" />}
                    {isSynthesizing ? 'DESIGNING PROCESS...' : 'INITIALIZE ENHANCEMENT SHARD'}
                 </button>
              </div>
           </div>

           <div className="p-10 glass-card rounded-[48px] border border-blue-500/10 bg-blue-500/5 space-y-6 group">
              <div className="flex items-center gap-3">
                 <Info className="w-5 h-5 text-blue-400" />
                 <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Engineering Logic</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100">
                 "The EnvirosAgro Engine applies thermodynamics and green chemistry to convert waste into sharded assets. Every process must possess an EVA score > 1.0."
              </p>
           </div>
        </div>

        {/* Display Area */}
        <div className="lg:col-span-8">
           <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
              <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                 <div className="flex items-center gap-4 text-emerald-400">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enhancement Terminal</span>
                 </div>
                 {strategy && (
                    // Fix: Added X icon import
                    <button onClick={() => setStrategy(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>
                 )}
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                 {!strategy && !isSynthesizing ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                       <div className="relative">
                          <Microscope size={140} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                          <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">ENGINE STANDBY</p>
                          <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Awaiting Industrial Payload & Context</p>
                       </div>
                    </div>
                 ) : isSynthesizing ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Factory className="w-10 h-10 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">FORGING PROCESS SHARD...</p>
                          <div className="flex justify-center gap-1.5 pt-6">
                             {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-12 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-12 pb-10">
                       {/* Strategy Report */}
                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert prose-emerald max-w-none shadow-3xl border-l-8 border-l-emerald-500 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform"><Sparkles size={300} /></div>
                          <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-6">
                             <Bot className="w-10 h-10 text-emerald-400" />
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">{strategy.process_name}</h4>
                                <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mt-1">INDUSTRIAL_ENHANCEMENT_STRATEGY</p>
                             </div>
                          </div>

                          <div className="space-y-10 relative z-10">
                             <div className="space-y-4">
                                <h5 className="text-lg font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                                   <Target size={18} className="text-emerald-400" /> Executive Shard
                                </h5>
                                <p className="text-slate-300 text-xl leading-relaxed italic font-medium">"{strategy.strategy_abstract}"</p>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6 p-8 bg-white/[0.02] rounded-[40px] border border-white/5">
                                   <h6 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                                      <Terminal size={14} /> Unit Operations
                                   </h6>
                                   <ul className="space-y-3">
                                      {strategy.unit_operations.map((op: string, idx: number) => (
                                         <li key={idx} className="flex items-center gap-3 text-sm text-slate-400">
                                            <span className="text-[10px] font-mono text-emerald-500/40">0{idx+1}</span>
                                            {op}
                                         </li>
                                      ))}
                                   </ul>
                                </div>

                                <div className="space-y-6 p-8 bg-white/[0.02] rounded-[40px] border border-white/5">
                                   <h6 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                      {/* Fix: Added Activity icon import */}
                                      <Activity size={14} /> Mass Balance
                                   </h6>
                                   <div className="space-y-4">
                                      <div className="flex justify-between text-xs">
                                         <span className="text-slate-500">Input Payload</span>
                                         <span className="text-white font-mono">{strategy.mass_balance.input}</span>
                                      </div>
                                      <div className="h-px bg-white/5 w-full"></div>
                                      <div className="space-y-2">
                                         {strategy.mass_balance.outputs.map((out: string, idx: number) => (
                                            <div key={idx} className="flex justify-between text-xs">
                                               <span className="text-emerald-500 font-bold">Output 0{idx+1}</span>
                                               <span className="text-slate-300">{out}</span>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </div>

                             {/* Metrics HUD */}
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="p-6 bg-black rounded-3xl border border-white/10 text-center space-y-1 shadow-inner group/stat hover:border-emerald-500/40 transition-all">
                                   <p className="text-[8px] text-slate-500 uppercase font-black">EVA Score</p>
                                   <p className="text-3xl font-mono font-black text-emerald-400">{strategy.financial_delta.eva_score.toFixed(1)}x</p>
                                </div>
                                <div className="p-6 bg-black rounded-3xl border border-white/10 text-center space-y-1 shadow-inner group/stat hover:border-indigo-500/40 transition-all">
                                   <p className="text-[8px] text-slate-500 uppercase font-black">Sustain. Index</p>
                                   <p className="text-3xl font-mono font-black text-indigo-400">{strategy.sustainability_index.toFixed(1)}</p>
                                </div>
                                <div className="p-6 bg-black rounded-3xl border border-white/10 text-center space-y-1 shadow-inner group/stat hover:border-blue-500/40 transition-all">
                                   <p className="text-[8px] text-slate-500 uppercase font-black">Enhanced Val</p>
                                   <p className="text-3xl font-mono font-black text-white">${strategy.financial_delta.enhanced_value_est}</p>
                                </div>
                                <div className="p-6 bg-black rounded-3xl border border-white/10 text-center space-y-1 shadow-inner group/stat hover:border-amber-500/40 transition-all">
                                   <p className="text-[8px] text-slate-500 uppercase font-black">Raw Yield</p>
                                   <p className="text-3xl font-mono font-black text-slate-400">${strategy.financial_delta.raw_value_est}</p>
                                </div>
                             </div>

                             <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                   {/* Fix: Added Layers icon import */}
                                   <Layers size={24} />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">SEHTI Impact Audit</p>
                                   <p className="text-sm text-slate-400 italic leading-relaxed">{strategy.sehti_impact}</p>
                                </div>
                             </div>
                          </div>

                          <div className="mt-16 flex flex-col md:flex-row justify-center gap-6 relative z-10">
                             <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                {/* Fix: Added Stamp icon import */}
                                <Stamp className="w-8 h-8" /> ANCHOR ENHANCEMENT SHARD
                             </button>
                             <button className="p-8 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all"><Download size={24} /></button>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center opacity-30 mt-auto">
                 <div className="flex items-center gap-4">
                    {/* Fix: Added Fingerprint icon import */}
                    <Fingerprint size={28} className="text-slate-400" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-mono uppercase font-black text-slate-500 tracking-widest leading-none">REGISTRY_SYNC: ACTIVE_HANDSHAKE</p>
                       <p className="text-lg font-mono font-black text-slate-600 tracking-tighter leading-none">0x882_VALUE_ENHANCE_SYNC</p>
                    </div>
                 </div>
                 <Gauge size={40} className="text-emerald-400" />
              </div>
           </div>
        </div>
      </div>

      {/* Global Persistence Shard Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mt-32 mx-4 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
            {/* Fix: Added ShieldCheck icon import */}
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               {/* Fix: Added Fingerprint icon import */}
               <Fingerprint className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Value <span className="text-emerald-400">Multiplication</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 Converting agricultural waste into high-value shards minimizes environmental stress (S) while exponentially increasing node utility (EAC).
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">ENHANCEMENT_QUORUM</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AgroValueEnhancement;
