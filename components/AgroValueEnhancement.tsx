import React, { useState, useMemo } from 'react';
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
  Wallet,
  Workflow,
  Cpu,
  Boxes,
  ClipboardCheck,
  Network,
  RotateCcw,
  ZapOff,
  Signal,
  BarChart3,
  Waves,
  LayoutGrid,
  Search,
  MessageSquare,
  Dna,
  BoxSelect,
  ShieldPlus,
  Thermometer,
  ShieldAlert,
  // Added Leaf, Droplets, and Wind to imports to fix "Cannot find name" errors on lines 271, 273, and 274
  Leaf,
  Droplets,
  Wind
} from 'lucide-react';
import { User, LiveAgroProduct, Order } from '../types';
import { generateValueEnhancementStrategy, chatWithAgroExpert, decodeAgroGenetics } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Helper component for watermark background
const AtomIcon = ({ size, className }: { size?: number, className?: string }) => (
  <div className={className} style={{ width: size, height: size }}>
     <Binary size={size} />
  </div>
);

// Added NEURAL_STEPS constant to fix "Cannot find name 'NEURAL_STEPS'" error
const NEURAL_STEPS = [
  "Initializing ML Handshake...",
  "Querying Robotic Ingest Shards...",
  "Sequencing Neural Weights (m-Constant)...",
  "Calibrating Operational Vectors...",
  "Generating Optimization Shard...",
  "Finalizing OS Logic..."
];

interface AgroValueEnhancementProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  liveProducts: LiveAgroProduct[];
  orders: Order[];
  onNavigate: (view: any) => void;
}

const AgroValueEnhancement: React.FC<AgroValueEnhancementProps> = ({ 
  user, 
  onSpendEAC, 
  onEarnEAC, 
  liveProducts = [], 
  orders = [],
  onNavigate
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
  // Added currentStepIndex state to fix "Cannot find name 'currentStepIndex'" error
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
      alert("Oracle handshake failed.");
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
      
      // Injecting Resilience and Environment metrics into mock result for UI display
      const enhancedResult = {
        ...result,
        resilience_m: (user.metrics.timeConstantTau * (genomicShard ? 1.15 : 1.0)).toFixed(2),
        env_alignment: envType === 'FIELD' ? 'Low-Energy/High-Acreage' : 'High-Precision/Low-Acreage'
      };
      
      setStrategy(enhancedResult);
      onEarnEAC(10, 'VALUE_ENHANCEMENT_RESEARCH_BONUS');
    } catch (err) {
      alert("Oracle synthesis interrupted. Check node connectivity.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRunOptimization = async (product: LiveAgroProduct) => {
    const fee = 15;
    if (!await onSpendEAC(fee, `PROCESS_OPTIMIZATION_AUDIT_${product.id}`)) return;

    setOptimizingId(product.id);
    setOptReport(null);
    // Added currentStepIndex management and animation interval to fix missing references
    setCurrentStepIndex(0);
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < NEURAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const prompt = `Act as an EOS Industrial Process Engineer. 
      Analyze this live process flow:
      Product: ${product.productType}
      Environment: ${envType}
      Stage: ${product.stage}
      Progress: ${product.progress}%
      Audit Status: ${product.auditStatus}
      Steward Resonance: ${user.metrics.timeConstantTau}
      
      Identify 3 critical bottlenecks in the TQM trace and provide a neural tuning strategy to maximize m-constant resilience and EAC yield.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setOptReport(res.text);
      onEarnEAC(10, 'PROCESS_NEURAL_TUNING_COMPLETE');
    } catch (e) {
      setOptReport("Neural link timeout. Consensus was not reached for this shard.");
    } finally {
      // Clearing step interval and resetting optimizing state
      clearInterval(stepInterval);
      setOptimizingId(null);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-1 md:px-4 relative overflow-hidden">
      
      {/* Background Matrix Decor */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 1. Immersive Hero HUD */}
      <div className="glass-card p-6 md:p-14 rounded-[40px] md:rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-16 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
            <FlaskConical className="w-96 h-96 text-white" />
         </div>
         
         <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[64px] bg-emerald-700 shadow-[0_0_120px_rgba(16,185,129,0.3)] flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Workflow size={64} className="text-white animate-float" />
               <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[32px] md:rounded-[64px] animate-spin-slow"></div>
            </div>
         </div>

         <div className="space-y-4 md:space-y-8 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-2">
               <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20 shadow-inner">VALUE_FORGE_ACTIVE</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20 shadow-inner">DESIGN_RESILIENCE_SYNC</span>
               </div>
               <h2 className="text-4xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">VALUE <span className="text-emerald-400">FORGE.</span></h2>
            </div>
            <p className="text-slate-400 text-sm md:text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
               "Engineering the transition from biomass to sharded economic assets. Integrate genomic data, design resilience, and environmental constraints."
            </p>
         </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 relative z-20">
         <div className="flex flex-wrap gap-2 md:gap-4 p-1.5 glass-card rounded-[24px] md:rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-4 md:px-8">
           {[
             { id: 'synthesis', label: 'Asset Synthesis', icon: FlaskConical },
             { id: 'optimization', label: 'Process Optimization', icon: Zap },
             { id: 'intelligence', label: 'Forge Intelligence', icon: Bot },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 md:gap-4 px-5 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-[24px] text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-2 md:border-b-4 border-emerald-400' : 'text-slate-500 hover:text-white'}`}
             >
               <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="flex items-center gap-4">
            <div className="px-6 py-3 glass-card rounded-full border border-blue-500/20 bg-blue-500/5 flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-[10px] font-mono font-black text-blue-400 uppercase tracking-widest">LIVE_DATA_INGEST_OK</span>
            </div>
         </div>
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* VIEW: ASSET SYNTHESIS (FORGE) */}
        {activeTab === 'synthesis' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-4 space-y-6">
                <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={200} /></div>
                   <div className="flex items-center gap-4 relative z-10 border-b border-white/5 pb-6">
                      <div className="p-4 bg-emerald-600 rounded-[24px] shadow-xl"><Database size={24} className="text-white" /></div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Forge <span className="text-emerald-400">Inflow</span></h3>
                   </div>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="space-y-2 px-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Raw Material Shard</label>
                         <input 
                           type="text" value={material} onChange={e => setMaterial(e.target.value)}
                           placeholder="e.g. Cashew Apples..."
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" 
                         />
                      </div>
                      
                      <div className="space-y-2 px-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environmental Constraint</label>
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

                      <div className="space-y-2 px-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input Mass (kg)</label>
                         <input 
                           type="text" value={weight} onChange={e => setWeight(e.target.value)}
                           placeholder="e.g. 500"
                           className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xl focus:ring-4 focus:ring-emerald-500/10 outline-none" 
                         />
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
                         {genomicShard && (
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in zoom-in">
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Helix Integrity</span>
                                  <span className="text-xs font-mono font-black text-white">{(genomicShard.backbone_integrity * 100).toFixed(0)}%</span>
                               </div>
                               <p className="text-[7px] text-slate-500 italic">"Genomic profile suggests high resonance for thermal stability."</p>
                            </div>
                         )}
                      </div>

                      <button 
                        onClick={handleSynthesis}
                        disabled={isSynthesizing || !material || !weight}
                        className="w-full py-6 md:py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                      >
                         {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot size={20} className="fill-current" />}
                         {isSynthesizing ? 'DESIGNING PROCESS...' : 'INITIALIZE SYNTHESIS'}
                      </button>
                   </div>
                </div>

                <div className="p-8 md:p-10 glass-card rounded-[40px] md:rounded-[56px] border border-blue-500/10 bg-blue-500/5 space-y-6 group shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 group-hover:rotate-12 transition-transform"><ShieldCheck size={24} className="text-blue-400" /></div>
                      <h4 className="text-lg font-black text-white uppercase italic m-0">Design <span className="text-blue-400">Resilience</span></h4>
                   </div>
                   <p className="text-sm text-slate-400 italic leading-relaxed">
                      "Utilizing the m-constant signature to ensure industrial output remains stable under external environmental stress (S)."
                   </p>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[40px] md:rounded-[64px] min-h-[750px] border-2 border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-8 md:p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                         <Terminal className="w-5 h-5 text-emerald-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enhanced Asset Shard Terminal</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-mono font-black text-emerald-400">ORACLE_LINK_STABLE</span>
                      </div>
                   </div>

                   <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
                      {isSynthesizing ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Binary size={40} className="text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">CALCULATING RESILIENCE DELTA...</p>
                              <p className="text-slate-600 font-mono text-[10px]">ENV_SYNC: {envType} // GENOMIC_LOCK: {genomicShard ? 'ACTIVE' : 'NONE'}</p>
                           </div>
                        </div>
                      ) : strategy ? (
                        <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                           <div className="p-10 md:p-16 bg-black/80 rounded-[48px] md:rounded-[64px] border border-emerald-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-emerald-600 relative overflow-hidden group/shard">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><AtomIcon size={600} className="text-emerald-400" /></div>
                              
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 border-b border-white/5 pb-8 gap-6">
                                 <div className="flex items-center gap-6">
                                    <div className="p-4 bg-emerald-600 rounded-3xl"><Activity size={32} className="text-white" /></div>
                                    <div>
                                       <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">{strategy.process_name}</h4>
                                       <p className="text-[9px] text-emerald-500/60 font-black uppercase mt-2 tracking-widest">RESILIENCE_M: {strategy.resilience_m || '1.42'}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                       <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Impact Index</p>
                                       <p className="text-2xl font-mono font-black text-white">{strategy.sustainability_index}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-blue-500/20">
                                       <p className="text-[8px] text-blue-500 font-black uppercase mb-1">Env Type</p>
                                       <p className="text-xs font-mono font-black text-white uppercase">{envType.replace('_', ' ')}</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4">
                                 {strategy.strategy_abstract}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10">
                                 <div className="p-8 bg-black/60 border border-white/5 rounded-[32px] space-y-6">
                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                       <Target size={14} className="text-indigo-400" /> Unit Operations
                                    </h5>
                                    <div className="space-y-3">
                                       {strategy.unit_operations?.map((op: string, idx: number) => (
                                          <div key={idx} className="flex items-center gap-4 group/op">
                                             <span className="text-xs font-mono text-emerald-400">0{idx+1}</span>
                                             <span className="text-sm font-black uppercase text-slate-300 group-hover/op:text-white transition-colors">{op}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="p-8 bg-black/60 border border-white/5 rounded-[32px] space-y-6">
                                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                       <Activity size={14} className="text-blue-400" /> Resilience Prediction
                                    </h5>
                                    <div className="space-y-4">
                                       <div className="flex justify-between items-center text-[9px] font-black text-slate-600 uppercase">
                                          <span>m-Stability Coefficient</span>
                                          <span className="text-white font-mono">{strategy.resilience_m}</span>
                                       </div>
                                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]" style={{ width: `${(parseFloat(strategy.resilience_m)/2.5)*100}%` }}></div>
                                       </div>
                                       <p className="text-[8px] text-slate-500 leading-relaxed italic mt-4">
                                          "Design resilience optimized for {envType} environment. {genomicShard ? 'Genomic audit increases recovery velocity.' : 'Standard recovery velocity.'}"
                                       </p>
                                    </div>
                                 </div>
                              </div>

                              <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                 <div className="flex items-center gap-6">
                                    <Fingerprint size={40} className="text-indigo-400" />
                                    <div className="text-left">
                                       <p className="text-[9px] text-slate-600 font-black uppercase">STRATEGY_HASH</p>
                                       <p className="text-lg font-mono text-white">0x882...FORGE_SYNC</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-4">
                                    <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">Audit Balance</button>
                                    <button className="px-8 py-4 bg-emerald-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                                       <FileCode size={14} /> Export Shard
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-center gap-6 md:gap-10">
                              <button onClick={() => setStrategy(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                              <button className="px-24 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                 <Stamp size={24} /> ANCHOR STRATEGY TO LEDGER
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-20 group">
                           <div className="relative">
                              <FlaskConical size={140} className="text-slate-500 group-hover:text-emerald-400 transition-colors duration-1000" />
                              <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">ENGINE_STANDBY</p>
                              <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Input material context to begin value synthesis</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* VIEW: PROCESS OPTIMIZATION (SCADA SOURCED) */}
        {activeTab === 'optimization' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-1000 px-1 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8 px-6">
                <div className="space-y-3">
                   <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Process <span className="text-blue-400">Optimization</span></h3>
                   <p className="text-slate-500 text-lg md:text-2xl font-medium italic">"Real-time SCADA tuning for high-m-constant resilience."</p>
                </div>
                <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[32px] text-center shadow-xl">
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-1">Active Inflows</p>
                    <p className="text-4xl font-mono font-black text-white">{liveProducts.length}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 {/* Live Flows List */}
                 <div className="lg:col-span-7 space-y-8">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-4 px-6">
                       <Workflow className="w-8 h-8 text-blue-400" /> Active Registry Flows
                    </h4>
                    <div className="grid gap-6">
                       {liveProducts.length === 0 ? (
                         <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                            <ZapOff size={80} className="text-slate-600 animate-pulse" />
                            <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active Inflow Shards Detected.</p>
                            <button onClick={() => onNavigate('live_farming')} className="px-10 py-5 bg-blue-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Initialize Live Process</button>
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
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-500 uppercase">{product.id}</span>
                                     </div>
                                     <div className="flex items-center gap-4 text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                                        <span>Stage: {product.stage.replace(/_/g, ' ')}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                        <span>Progress: {product.progress}%</span>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-6 w-full md:w-auto relative z-10 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                                  <div className="flex-1 space-y-2 min-w-[150px]">
                                     <p className="text-[8px] text-slate-700 font-black uppercase text-center">Node Efficiency</p>
                                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]" style={{ width: `${product.progress}%` }}></div>
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
                            </div>
                         ))
                       )}
                    </div>
                 </div>

                 {/* Optimization Oracle Feed */}
                 <div className="lg:col-span-5 flex flex-col space-y-8">
                    <div className="glass-card rounded-[64px] min-h-[600px] border-2 border-indigo-500/20 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl group">
                       {/* Terminal Scanline */}
                       <div className="absolute inset-0 pointer-events-none opacity-5">
                          <div className="w-full h-[1px] bg-indigo-500 absolute top-0 animate-scan"></div>
                       </div>
                       
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
                          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-emerald-400">
                             <Activity size={24} className="animate-pulse" />
                          </div>
                       </div>

                       <div className="flex-1 p-10 overflow-y-auto custom-scrollbar-terminal relative z-20 flex flex-col">
                          {!optReport && !optimizingId ? (
                             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20">
                                <Target size={100} className="text-slate-500" />
                                <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">ORACLE_STANDBY</p>
                             </div>
                          ) : optimizingId ? (
                             <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                                <div className="relative">
                                   <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Binary size={40} className="text-indigo-400 animate-pulse" />
                                   </div>
                                </div>
                                <div className="space-y-6">
                                   {/* Optimized neural steps display logic implemented with currentStepIndex fix */}
                                   <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0 drop-shadow-lg">{NEURAL_STEPS[currentStepIndex]}</p>
                                   <div className="flex justify-center gap-2 pt-4">
                                      {[...Array(8)].map((_, i) => (
                                         <div key={i} className="w-2 h-16 bg-emerald-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          ) : (
                             <div className="animate-in slide-in-from-bottom-6 duration-700 pb-10">
                                <div className="p-10 md:p-14 bg-black/60 rounded-[48px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-l-indigo-600 relative overflow-hidden group/bubble">
                                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/bubble:scale-110 transition-transform duration-[12s]"><Zap size={400} /></div>
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

        {/* VIEW: FORGE INTELLIGENCE (LATEST RESEARCH) */}
        {activeTab === 'intelligence' && (
           <div className="space-y-12 animate-in fade-in duration-700 px-1 md:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[
                    { t: 'Genomic Ingest', d: 'Analyze biological material at the allele level to maximize output resonance.', i: Dna, c: 'text-blue-400', b: 'bg-blue-600/10' },
                    { t: 'Controlled Environment', d: 'Evaluation of CEA stacks (Hydro/Aero/Vertical) on m-constant growth.', i: BoxSelect, c: 'text-emerald-400', b: 'bg-emerald-600/10' },
                    { t: 'Design Resilience', d: 'Modeling the impact of permaculture patterns on ecosystem durability.', i: Target, c: 'text-indigo-400', b: 'bg-indigo-600/10' },
                 ].map((mod, i) => (
                    <div key={i} className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 space-y-8 group hover:border-white/20 transition-all shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><mod.i size={120} /></div>
                       <div className={`w-16 h-16 rounded-2xl ${mod.b} flex items-center justify-center border border-white/5`}>
                          <mod.i className={`w-8 h-8 ${mod.c}`} />
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{mod.t}</h4>
                          <p className="text-slate-400 text-sm italic leading-relaxed">"{mod.d}"</p>
                       </div>
                       <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2">
                          Access Intelligence Shard <ArrowUpRight size={14} />
                       </button>
                    </div>
                 ))}
              </div>
              <div className="glass-card p-16 rounded-[80px] border border-indigo-500/20 bg-indigo-950/10 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
                    <Target size={800} className="text-indigo-400" />
                 </div>
                 <div className="flex items-center gap-12 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[40px] flex items-center justify-center shadow-3xl border-4 border-white/10 animate-pulse shrink-0">
                       <Bot size={56} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Forge Oracle Logic</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-xl:text-sm max-w-xl">
                          "Integrating multi-thrust scientific data shards to maintain node m-constant finality and planetary resonance."
                       </p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-16">
                    <p className="text-[12px] text-slate-600 font-black uppercase mb-4 tracking-[0.5em] italic">Consensus Sync</p>
                    <p className="text-8xl font-mono font-black text-white tracking-tighter">100<span className="text-2xl text-indigo-500 ml-1">%</span></p>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgroValueEnhancement;