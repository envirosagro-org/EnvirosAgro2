import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, Binary, TrendingUp, Zap, Loader2, ChevronRight, Info, Database, 
  CheckCircle2, Bot, Activity, Workflow, Cpu, Stamp, Fingerprint, ShieldCheck, 
  Dna, Target, Sparkles, Terminal, Download, FileCode, BadgeCheck, ZapOff,
  BoxSelect, Wind, Droplets, Leaf, Scale, SmartphoneNfc, Factory
} from 'lucide-react';
import { User, LiveAgroProduct, Order } from '../types';
import { generateValueEnhancementStrategy, chatWithAgroExpert, decodeAgroGenetics } from '../services/geminiService';

interface AgroValueEnhancementProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  liveProducts: LiveAgroProduct[];
  orders: Order[];
  onNavigate: (view: any) => void;
}

const NEURAL_STEPS = [
  "Initializing ML Handshake...",
  "Querying Robotic Ingest Shards...",
  "Sequencing Neural Weights (m-Constant)...",
  "Calibrating Operational Vectors...",
  "Generating Optimization Shard...",
  "Finalizing OS Logic..."
];

const AgroValueEnhancement: React.FC<AgroValueEnhancementProps> = ({ 
  user, onSpendEAC, onEarnEAC, liveProducts = [], orders = [], onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'optimization' | 'intelligence'>('synthesis');
  
  // Synthesis States
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState('');
  const [context, setContext] = useState('');
  const [envType, setEnvType] = useState<'FIELD' | 'CEA_HYDRO' | 'CEA_AERO' | 'CEA_VERTICAL'>('FIELD');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [strategy, setStrategy] = useState<any | null>(null);

  // Genetic Decoder States
  const [isDecoding, setIsDecoding] = useState(false);
  const [genomicShard, setGenomicShard] = useState<any | null>(null);

  // Optimization States
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [optReport, setOptReport] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleRunGenomicAudit = async () => {
    if (!material) return alert("INPUT_REQUIRED: Define raw material for genomic sharding.");
    const COST = 20;
    if (!await onSpendEAC(COST, `GENOMIC_PRE_AUDIT_${material.toUpperCase()}`)) return;

    setIsDecoding(true);
    setGenomicShard(null);
    try {
      const mockTelemetry = {
        bio_signal: 0.85,
        tech_status: envType === 'FIELD' ? 0.4 : 0.9,
        market_demand: 0.75,
        gov_integrity: 0.95
      };
      const result = await decodeAgroGenetics(mockTelemetry);
      setGenomicShard(result);
      onEarnEAC(10, 'GENOMIC_DATA_INGEST_OK');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleSynthesis = async () => {
    if (!material || !weight) return;
    const COST = 30;
    if (!await onSpendEAC(COST, `VALUE_ENHANCEMENT_SYNTHESIS_${material.toUpperCase()}`)) return;

    setIsSynthesizing(true);
    setStrategy(null);

    try {
      const fullContext = `Environment: ${envType}. Genomic Status: ${genomicShard?.helix_status || 'Unknown'}. User Notes: ${context}`;
      const result = await generateValueEnhancementStrategy(material, weight, fullContext);
      
      const enhancedResult = {
        ...result,
        resilience_m: (user.metrics.timeConstantTau * (genomicShard ? 1.15 : 1.0)).toFixed(2),
        env_alignment: envType === 'FIELD' ? 'Low-Energy/High-Acreage' : 'High-Precision/Low-Acreage'
      };
      
      setStrategy(enhancedResult);
      onEarnEAC(10, 'VALUE_ENHANCEMENT_RESEARCH_BONUS');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRunOptimization = async (product: LiveAgroProduct) => {
    const fee = 15;
    if (!await onSpendEAC(fee, `PROCESS_OPTIMIZATION_AUDIT_${product.id}`)) return;

    setOptimizingId(product.id);
    setOptReport(null);
    setCurrentStepIndex(0);
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < NEURAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const prompt = `Act as an EOS Industrial Process Engineer. Analyze this live process flow:
      Product: ${product.productType}, Stage: ${product.stage}, Progress: ${product.progress}%.
      Identify bottlenecks and provide a neural tuning strategy to maximize m-constant and APY.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setOptReport(res.text);
      onEarnEAC(10, 'PROCESS_NEURAL_TUNING_COMPLETE');
    } catch (e) {
      setOptReport("Neural link timeout.");
    } finally {
      clearInterval(stepInterval);
      setOptimizingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. VIEW: ASSET SYNTHESIS (FORGE) */}
      {activeTab === 'synthesis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl overflow-hidden group">
                 <div className="flex items-center gap-4 relative z-10 border-b border-white/5 pb-8">
                    <div className="p-4 bg-emerald-600 rounded-[24px] shadow-xl"><Database size={24} className="text-white" /></div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge <span className="text-emerald-400">Inflow</span></h3>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Raw Material Shard</label>
                       <input 
                         type="text" value={material} onChange={e => setMaterial(e.target.value)}
                         placeholder="e.g. Cashew Apples..."
                         className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Environmental Constraint</label>
                       <div className="grid grid-cols-2 gap-2">
                          {[
                             { id: 'FIELD', label: 'Field-Grown', icon: Leaf },
                             { id: 'CEA_VERTICAL', label: 'Vertical Rack', icon: BoxSelect },
                             { id: 'CEA_HYDRO', label: 'Hydro-Mesh', icon: Droplets },
                             { id: 'CEA_AERO', label: 'Aero-Forge', icon: Wind },
                          ].map(env => (
                             <button 
                               key={env.id}
                               onClick={() => setEnvType(env.id as any)}
                               className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-[8px] font-black uppercase transition-all ${envType === env.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                             >
                                <env.icon size={12} /> {env.label}
                             </button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-4">
                       <button 
                         onClick={handleRunGenomicAudit}
                         disabled={isDecoding || !material}
                         className="w-full py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-blue-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600/20 transition-all"
                       >
                          {isDecoding ? <Loader2 size={16} className="animate-spin" /> : <Dna size={16} />}
                          {genomicShard ? 'GENOME_SYNCED' : 'RUN GENOMIC PRE-AUDIT'}
                       </button>
                    </div>

                    <button 
                      onClick={handleSynthesis}
                      disabled={isSynthesizing || !material || !weight}
                      className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                    >
                       {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot size={20} className="fill-current" />}
                       {isSynthesizing ? 'DESIGNING PROCESS...' : 'INITIALIZE SYNTHESIS'}
                    </button>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-8">
              <div className="glass-card rounded-[64px] min-h-[750px] border-2 border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                       <Terminal className="w-5 h-5 text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enhanced Asset Shard Terminal</span>
                    </div>
                 </div>

                 <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                    {isSynthesizing ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                         <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                         <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">CALCULATING RESILIENCE DELTA...</p>
                      </div>
                    ) : strategy ? (
                      <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                         <div className="p-10 md:p-16 bg-black/80 rounded-[48px] md:rounded-[64px] border border-emerald-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/shard">
                            <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10">
                               {strategy.strategy_abstract}
                            </div>
                            <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                               <div className="flex items-center gap-6">
                                  <Fingerprint size={40} className="text-indigo-400" />
                                  <div className="text-left">
                                     <p className="text-[9px] text-slate-600 font-black uppercase">STRATEGY_HASH</p>
                                     <p className="text-lg font-mono text-white">0x882...FORGE_SYNC</p>
                                  </div>
                               </div>
                               <button className="px-24 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5 border-2 border-white/10">
                                  <Stamp size={24} /> ANCHOR STRATEGY TO LEDGER
                               </button>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-20 group">
                         <FlaskConical size={140} className="text-slate-500 group-hover:text-emerald-400 transition-colors duration-1000" />
                         <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Input material context to begin value synthesis</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* VIEW: PROCESS OPTIMIZATION */}
      {activeTab === 'optimization' && (
         <div className="space-y-12 animate-in slide-in-from-right-4 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               <div className="lg:col-span-7 space-y-8">
                  <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4 px-6">
                     <Workflow className="w-8 h-8 text-blue-400" /> Active Registry Flows
                  </h4>
                  <div className="grid gap-6">
                     {liveProducts.length === 0 ? (
                       <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                          <ZapOff size={80} className="text-slate-600 animate-pulse" />
                          <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active Inflow Shards Detected.</p>
                       </div>
                     ) : (
                       liveProducts.map(product => (
                          <div key={product.id} className={`glass-card p-10 rounded-[56px] border-2 transition-all group flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden bg-black/40 shadow-3xl ${optimizingId === product.id ? 'border-blue-500 ring-8 ring-blue-500/5 scale-[1.02]' : 'border-white/5 hover:border-blue-500/20'}`}>
                             <div className="flex items-center gap-8 w-full md:w-auto relative z-10">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-800 border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl group-hover:rotate-6 transition-all">
                                   <Factory size={32} />
                                </div>
                                <div className="space-y-2">
                                   <div className="flex items-center gap-4">
                                      <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors">{product.productType}</h5>
                                   </div>
                                   <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                                      <span>Stage: {product.stage.replace(/_/g, ' ')}</span>
                                      <span>Progress: {product.progress}%</span>
                                   </div>
                                </div>
                             </div>
                             <button 
                               onClick={() => handleRunOptimization(product)}
                               disabled={!!optimizingId}
                               className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-90 disabled:opacity-30"
                             >
                                {optimizingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                Run Tuning
                             </button>
                          </div>
                       ))
                     )}
                  </div>
               </div>

               <div className="lg:col-span-5 flex flex-col space-y-8">
                  <div className="glass-card rounded-[64px] min-h-[600px] border-2 border-indigo-500/20 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl group">
                     <div className="p-10 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0 relative z-20">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center text-white shadow-xl relative overflow-hidden group/bot">
                              <Bot size={32} className="relative z-10 group-hover/bot:scale-110 transition-transform" />
                              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                           </div>
                           <div>
                              <h4 className="text-2xl font-black text-white uppercase italic m-0 leading-none">Resilience <span className="text-indigo-400">Optimization</span></h4>
                              <p className="text-[9px] text-indigo-400/60 font-mono tracking-widest uppercase mt-2">EOS_ML_ENGINE_v6.5</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-20 flex flex-col">
                        {!optReport && !optimizingId ? (
                           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20">
                              <Target size={100} className="text-slate-500" />
                              <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">ORACLE_STANDBY</p>
                           </div>
                        ) : optimizingId ? (
                           <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                              <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                              <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">{NEURAL_STEPS[currentStepIndex]}</p>
                           </div>
                        ) : (
                           <div className="animate-in slide-in-from-bottom-6 duration-700 pb-10">
                              <div className="p-10 md:p-14 bg-black/60 rounded-[48px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-l-indigo-600 relative overflow-hidden group/bubble">
                                 <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                                    <BadgeCheck size={32} className="text-emerald-400" />
                                    <h4 className="text-2xl font-black text-white uppercase italic m-0">Resilience Verdict</h4>
                                 </div>
                                 <div className="text-slate-300 text-lg leading-relaxed italic whitespace-pre-line font-medium border-l-2 border-white/5 pl-8">
                                    {optReport}
                                 </div>
                              </div>
                              <div className="flex justify-center mt-12 gap-6">
                                 <button onClick={() => setOptReport(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Discard</button>
                                 <button className="px-16 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <Stamp size={20} /> Anchor Resilience Shard
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AgroValueEnhancement;