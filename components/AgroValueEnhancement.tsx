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
  X,
  Activity,
  Layers,
  Stamp,
  Fingerprint,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { User } from '../types';
import { generateValueEnhancementStrategy } from '../services/geminiService';

interface AgroValueEnhancementProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
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
    if (!await onSpendEAC(COST, `VALUE_ENHANCEMENT_SYNTHESIS_${material.toUpperCase()}`)) return;

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
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl text-white">
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
        <div className="lg:col-span-4 space-y-8 text-white">
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group">
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
                      placeholder="e.g. Cashew Apples..."
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
                 <button 
                  onClick={handleSynthesis}
                  disabled={isSynthesizing || !material || !weight}
                  className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30"
                 >
                    {isSynthesizing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Bot className="w-8 h-8 fill-current" />}
                    {isSynthesizing ? 'DESIGNING PROCESS...' : 'INITIALIZE ENHANCEMENT'}
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8">
           <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl text-white">
              <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                 <div className="flex items-center gap-4 text-emerald-400">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enhancement Terminal</span>
                 </div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                 {isSynthesizing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 py-20 text-center bg-black/60 backdrop-blur-md z-20">
                       <Loader2 size={64} className="text-emerald-500 animate-spin" />
                       <p className="text-emerald-400 font-black text-2xl animate-pulse italic">FORGING PROCESS SHARD...</p>
                    </div>
                 ) : strategy ? (
                    <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-12">
                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert max-w-none shadow-3xl border-l-8 border-l-emerald-500 relative overflow-hidden">
                          <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">{strategy.process_name}</h4>
                          <p className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium mt-10">{strategy.strategy_abstract}</p>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20">
                       <Microscope size={140} className="text-slate-500" />
                       <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">ENGINE STANDBY</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default AgroValueEnhancement;