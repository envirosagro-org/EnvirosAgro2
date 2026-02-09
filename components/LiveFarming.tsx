
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sprout, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  MapPin, 
  Zap, 
  ThumbsUp, 
  PlusCircle, 
  Monitor, 
  Clock, 
  TrendingUp, 
  Eye, 
  X,
  Upload,
  Bot,
  Factory,
  Package,
  Cpu,
  Layers,
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Terminal, 
  Wifi, 
  Scan, 
  Share2, 
  Sparkles, 
  Gauge,
  Smartphone,
  Wrench,
  SmartphoneNfc,
  ClipboardList,
  Target,
  Plus,
  ArrowUpRight,
  CircleStop,
  Stamp,
  Workflow,
  Radio,
  Fingerprint,
  Info,
  ChevronRight,
  LayoutGrid,
  Trello,
  Boxes,
  LineChart,
  ShoppingCart
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState, AgroResource } from '../types';
import { forecastMarketReadiness } from '../services/geminiService';

interface LiveFarmingProps {
  user: User;
  products: LiveAgroProduct[];
  setProducts: React.Dispatch<React.SetStateAction<LiveAgroProduct[]>>;
  onEarnEAC: (amount: number, reason: string) => void;
  onSaveProduct: (product: LiveAgroProduct) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  notify: any;
}

interface IngestLog {
  id: string;
  sequence: number;
  event: string;
  status: 'SYNCING' | 'COMMITTED' | 'VERIFIED';
  timestamp: string;
}

const INDUSTRIAL_TASK_POOL = [
  { id: 'T-1', title: 'Substrate DNA Sequence', thrust: 'Environmental', duration: '2h', seq: 1 },
  { id: 'T-2', title: 'Spectral Drone Calibration', thrust: 'Technological', duration: '1h', seq: 2 },
  { id: 'T-3', title: 'Yield Shard Finality', thrust: 'Industry', duration: '4h', seq: 3 },
  { id: 'T-4', title: 'Carbon Minting Vouch', thrust: 'Industry', duration: '6h', seq: 4 },
];

const STAGES: LiveAgroProduct['stage'][] = ['Inception', 'Processing', 'Quality_Audit', 'Finalization', 'Market_Ready'];

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, products, setProducts, onEarnEAC, onSaveProduct, onNavigate, notify }) => {
  const [step, setStep] = useState<'registration' | 'verification' | 'terminal' | 'exit'>('terminal');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<LiveAgroProduct | null>(null);
  
  // Registration Form
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Produce' | 'Manufactured' | 'Input'>('Produce');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ingest Logs
  const [ingestLogs, setIngestLogs] = useState<IngestLog[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Vouch/Yield Logic
  const [votedProducts, setVotedProducts] = useState<string[]>([]);
  const hardwareResources = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);

  // AI Forecast
  const [forecastReport, setForecastReport] = useState<string | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ingestLogs]);

  const handleStartRegistration = () => {
    setStep('registration');
    setShowAddModal(true);
  };

  const handleRegisterMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newProduct: LiveAgroProduct = {
        id: `LIVE-${Math.floor(Math.random() * 9000 + 1000)}`,
        stewardEsin: user.esin,
        stewardName: user.name,
        productType: newProductName,
        category: newProductCategory,
        stage: 'Inception',
        progress: 5,
        votes: 0,
        location: user.location,
        timestamp: new Date().toLocaleTimeString(),
        lastUpdate: 'Just now',
        isAuthentic: false,
        auditStatus: 'Awaiting Handshake',
        tasks: [],
        telemetryNodes: [],
        marketStatus: 'Forecasting',
        vouchYieldMultiplier: 1.0
      };
      
      onSaveProduct(newProduct);
      setIsSubmitting(false);
      setStep('verification');
      onEarnEAC(5, 'LIVE_ASSET_METADATA_INGEST');
    }, 1500);
  };

  const handleHandshake = () => {
    if (!products.length) return;
    const current = products[0]; // Simplified for first active
    setIsSubmitting(true);
    setTimeout(() => {
      const updated = { ...current, isAuthentic: true, auditStatus: 'Verified', progress: 15 };
      onSaveProduct(updated);
      setIsSubmitting(false);
      setStep('terminal');
      notify('success', 'REGISTRY_HANDSHAKE_OK', "Physical hardware linked to digital twin.");
    }, 2500);
  };

  const handleVote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product?.isAuthentic) {
      notify('error', 'UNVERIFIED_SHARD', "Assets require physical audit before social vouching.");
      return;
    }
    if (votedProducts.includes(productId)) return;
    
    setVotedProducts([...votedProducts, productId]);
    const updated = { 
      ...product, 
      votes: product.votes + 1,
      vouchYieldMultiplier: (product.vouchYieldMultiplier || 1.0) + 0.05 
    };
    onSaveProduct(updated);
    notify('success', 'VOUCH_RECORDED', `Social energy sharded. Yield multiplier increased.`);
  };

  const handleMarketExit = (product: LiveAgroProduct) => {
    if (product.progress < 100) {
      notify('warning', 'PROCESSING_INCOMPLETE', "Asset must reach 100% processing before Market exit.");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      // Transition logic would normally remove from live_products and add to products
      notify('success', 'MARKET_CLOUD_EXIT', `${product.productType} sharded to Global Market.`);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      setIsSubmitting(false);
      onNavigate('economy');
    }, 3000);
  };

  const runForecastOracle = async (product: LiveAgroProduct) => {
    setIsForecasting(true);
    try {
      const res = await forecastMarketReadiness(product);
      setForecastReport(res.text);
    } catch (e) {
      setForecastReport("Oracle link drift detected. Try again in next cycle.");
    } finally {
      setIsForecasting(false);
    }
  };

  const handleTaskComplete = (product: LiveAgroProduct, taskId: string) => {
    const updatedTasks = [...(product.tasks || []), taskId];
    const newProgress = Math.min(100, product.progress + 20);
    const updated = { 
      ...product, 
      tasks: updatedTasks, 
      progress: newProgress,
      stage: newProgress >= 100 ? 'Market_Ready' : product.stage,
      marketStatus: newProgress >= 100 ? 'Ready' : 'Processing'
    };
    onSaveProduct(updated);
    onEarnEAC(10, `TASK_COMPLETED_${taskId}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Workflow size={1000} className="text-indigo-500" />
      </div>

      {/* 1. Industrial Control HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none">
              <div className="w-full h-[2px] bg-indigo-500/10 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center shrink-0 border-4 border-white/10 relative overflow-hidden group-hover:scale-105 transition-all">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <Factory size={80} className="text-white animate-float" />
              <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
           </div>

           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">INFLOW_CONTROL_v6.5</span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner">ZK_READY</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Live <span className="text-emerald-400">Processing.</span></h2>
              </div>
              <p className="text-slate-500 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl">
                 "Orchestrating industrial transformation cycles. Register physical assets, perform handshakes, and exit to the Market Cloud."
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-6">
                <button 
                  onClick={handleStartRegistration}
                  className="px-12 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10 ring-8 ring-emerald-500/5"
                >
                  <PlusCircle size={24} /> INITIALIZE LIVE PROCESS
                </button>
                <button 
                  onClick={() => onNavigate('economy')}
                  className="px-10 py-6 bg-white/5 border border-white/10 rounded-full text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-all shadow-xl"
                >
                  Market Hub
                </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between items-center text-center relative overflow-hidden shadow-3xl group">
           <div className="space-y-4 relative z-10 w-full">
              <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.6em] mb-4 italic">TOTAL_ACTIVE_SHARDS</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none">{products.length}</h4>
              <div className="flex items-center justify-center gap-3 text-indigo-400 text-[10px] font-black uppercase relative z-10 tracking-widest bg-white/5 py-2 rounded-full mt-6 border border-white/5">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div> EOS_QUORUM_OK
              </div>
           </div>
           <div className="w-full pt-10 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-700">
                 <span>Mesh Load</span>
                 <span className="text-emerald-400 font-mono">1.42x</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '84%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Main Portal Area */}
      <div className="min-h-[850px] relative z-10">
        
        {/* PORTAL VIEW: MANAGEMENT TERMINAL */}
        {step === 'terminal' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             
             {products.length === 0 ? (
               <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group/empty">
                  <div className="relative">
                    <Monitor size={120} className="text-slate-600 group-hover/empty:scale-110 transition-transform duration-[10s]" />
                    <div className="absolute inset-[-40px] border-4 border-dashed border-white/5 rounded-full animate-spin-slow"></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-black text-white uppercase tracking-[0.5em] italic">TERMINAL_OFFLINE</p>
                    <p className="text-sm italic text-slate-500 uppercase tracking-widest font-bold">Initialize an inflow shard to activate industrial processing.</p>
                  </div>
                  <button onClick={handleStartRegistration} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                    <Plus size={18} /> Initialize First Shard
                  </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                  
                  {/* Left Sidebar: Active Shard Directory */}
                  <div className="xl:col-span-4 space-y-8">
                     <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                        <div className="flex items-center justify-between px-4">
                           <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-emerald-400">Inventory</span></h4>
                           <span className="text-[10px] font-mono text-slate-700">{products.length} SHARDS</span>
                        </div>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                           {products.map(p => (
                             <button 
                               key={p.id}
                               onClick={() => setSelectedDossier(p)}
                               className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedDossier?.id === p.id ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl scale-105' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
                             >
                                <div className="flex items-center gap-5">
                                   <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-6 transition-transform ${p.category === 'Produce' ? 'text-emerald-400' : 'text-blue-400'}`}>
                                      {p.category === 'Produce' ? <Sprout size={24} /> : <Factory size={24} />}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black uppercase tracking-tight italic">{p.productType}</p>
                                      <p className="text-[9px] font-mono opacity-60 mt-1 uppercase">{p.id} // {p.progress}%</p>
                                   </div>
                                </div>
                                <ChevronRight size={20} className={`transition-transform duration-500 ${selectedDossier?.id === p.id ? 'rotate-90 text-emerald-400' : 'text-slate-800'}`} />
                             </button>
                           ))}
                        </div>
                     </div>

                     {selectedDossier && (
                       <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-amber-500/[0.03] space-y-8 shadow-xl relative overflow-hidden group/vouch animate-in slide-in-from-left-4">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/vouch:scale-110 transition-transform duration-[12s]"><Zap size={200} className="text-amber-500" /></div>
                          <div className="flex items-center gap-4 relative z-10">
                             <div className="p-3 bg-amber-600 rounded-2xl shadow-xl"><ThumbsUp size={24} className="text-white" /></div>
                             <h4 className="text-xl font-black text-white uppercase italic">Vouch-to-Yield</h4>
                          </div>
                          <div className="space-y-6 relative z-10">
                             <div className="text-center py-6 border-y border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Yield Multiplier (λ)</p>
                                <p className="text-6xl font-mono font-black text-amber-500 tracking-tighter italic">x{selectedDossier.vouchYieldMultiplier?.toFixed(2) || '1.00'}</p>
                             </div>
                             <p className="text-xs text-slate-400 italic leading-relaxed text-center px-4 font-medium">
                                "Every community vouch anchors social energy into the biological shard, increasing the projected EAC harvest."
                             </p>
                             <button 
                               onClick={() => handleVote(selectedDossier.id)}
                               disabled={votedProducts.includes(selectedDossier.id)}
                               className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 border-2 ${votedProducts.includes(selectedDossier.id) ? 'bg-black/40 text-slate-700 border-white/5 cursor-not-allowed' : 'bg-amber-600 text-white hover:bg-amber-500 border-white/10 ring-8 ring-amber-500/5'}`}
                             >
                                {votedProducts.includes(selectedDossier.id) ? 'ALREADY_VOUCHED' : 'COMMIT SOCIAL VOUCH'}
                             </button>
                          </div>
                       </div>
                     )}
                  </div>

                  {/* Right Main Area: SCADA Ingest & Mission Control */}
                  <div className="xl:col-span-8 space-y-10">
                     {selectedDossier ? (
                       <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
                          
                          {/* SCADA Terminal HUD */}
                          <div className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/60 relative overflow-hidden shadow-3xl">
                             <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none overflow-hidden">
                                <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent absolute top-0 animate-scan"></div>
                             </div>
                             
                             <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10 px-4 gap-10">
                                <div className="flex items-center gap-10">
                                   <div className={`p-6 rounded-[32px] bg-blue-600 shadow-2xl group-hover:rotate-6 transition-all border-2 border-white/10`}>
                                      <Activity className="w-12 h-12 text-white animate-pulse" />
                                   </div>
                                   <div>
                                      <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{selectedDossier.productType} <span className="text-blue-400">Live Ingest</span></h3>
                                      <p className="text-slate-500 text-[10px] font-mono tracking-[0.6em] uppercase mt-4">TERMINAL_ID: {selectedDossier.id} // ZK_SECURED</p>
                                   </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-3">
                                   <div className={`px-5 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-mono text-[10px] font-black uppercase animate-pulse shadow-inner`}>
                                      STREAMING_DATA_OK
                                   </div>
                                   <p className="text-xl font-mono font-black text-white">{selectedDossier.progress}% <span className="text-xs text-slate-700 uppercase italic">Progress</span></p>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                {/* Inflow Log Area */}
                                <div className="p-8 bg-black rounded-[48px] border-2 border-white/5 space-y-6 shadow-inner flex flex-col h-[400px]">
                                   <div className="flex justify-between items-center px-4">
                                      <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                         <Terminal size={14} className="text-blue-400" /> Live Signal Ingest
                                      </h5>
                                      <span className="text-[8px] font-mono text-slate-800">L2_DATA_BRIDGE</span>
                                   </div>
                                   <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-3 pr-4">
                                      {[...Array(8)].map((_, i) => (
                                         <div key={i} className="flex gap-6 p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl hover:bg-white/[0.05] transition-colors group/log">
                                            <span className="text-slate-800 w-16 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                                            <span className="flex-1 text-slate-300 group-hover/log:text-white transition-colors italic">PACKET_INGEST_SHARD_{Math.random().toString(16).slice(2,8).toUpperCase()} // ZK_OK</span>
                                            <CheckCircle2 size={14} className="text-emerald-500/30 group-hover/log:text-emerald-400 transition-colors" />
                                         </div>
                                      ))}
                                   </div>
                                   <div className="flex gap-4 pt-4 px-4">
                                      <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all">Download Log</button>
                                      <button className="flex-1 py-3 bg-blue-600 rounded-xl text-white font-black text-[9px] uppercase shadow-lg">Audit Logic</button>
                                   </div>
                                </div>

                                {/* Mission Kanban Shard */}
                                <div className="p-10 glass-card rounded-[48px] border-2 border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl relative overflow-hidden group/mission">
                                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/mission:scale-110 transition-transform duration-[12s]"><Trello size={300} className="text-indigo-400" /></div>
                                   <div className="flex justify-between items-center relative z-10 border-b border-indigo-500/20 pb-4 px-2">
                                      <div className="flex items-center gap-4">
                                         <Trello size={18} className="text-indigo-400" />
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Mission Sharding</h5>
                                      </div>
                                      <span className="text-[9px] font-mono text-indigo-400/60 font-bold">KANBAN_V4</span>
                                   </div>
                                   
                                   <div className="space-y-4 relative z-10 overflow-y-auto max-h-[250px] custom-scrollbar pr-4">
                                      {INDUSTRIAL_TASK_POOL.map(task => {
                                         const isComplete = (selectedDossier.tasks || []).includes(task.id);
                                         return (
                                           <div 
                                             key={task.id} 
                                             onClick={() => !isComplete && handleTaskComplete(selectedDossier, task.id)}
                                             className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group/task ${
                                               isComplete ? 'bg-emerald-600/10 border-emerald-500/30 opacity-60' : 'bg-black/60 border-white/5 hover:border-indigo-400/40 cursor-pointer active:scale-95'
                                             }`}
                                           >
                                              <div className="flex items-center gap-5">
                                                 <div className={`p-3 rounded-xl border-2 transition-all ${isComplete ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-700 group-hover/task:text-indigo-400'}`}>
                                                    {isComplete ? <CheckCircle2 size={18} /> : <Target size={18} />}
                                                 </div>
                                                 <div>
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tight m-0">{task.title}</p>
                                                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">EST_LOAD: {task.duration} // SEQ: {task.seq}</p>
                                                 </div>
                                              </div>
                                              {!isComplete && <ArrowRight size={16} className="text-slate-800 group-hover/task:text-indigo-400 group-hover/task:translate-x-1 transition-all" />}
                                           </div>
                                         );
                                      })}
                                   </div>
                                   
                                   <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] flex items-center justify-between relative z-10 shadow-inner group/fo">
                                      <div className="flex items-center gap-4">
                                         <Bot size={24} className="text-indigo-400 animate-pulse" />
                                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Readiness Forecast</span>
                                      </div>
                                      <button 
                                        onClick={() => runForecastOracle(selectedDossier)}
                                        className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-90"
                                      >
                                         <Sparkles size={16} />
                                      </button>
                                   </div>
                                </div>
                             </div>

                             {/* Market Exit Action Area */}
                             <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                <div className="flex items-center gap-10">
                                   <div className="flex flex-col">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Process Finality</p>
                                      <p className={`text-4xl font-mono font-black ${selectedDossier.progress >= 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                                         {selectedDossier.progress}<span className="text-sm italic font-sans">%</span>
                                      </p>
                                   </div>
                                   <div className="h-14 w-[2px] bg-white/5 hidden md:block"></div>
                                   <div className="flex flex-col">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Market Velocity</p>
                                      <p className="text-4xl font-mono font-black text-indigo-400 tracking-tighter">1.42<span className="text-xs italic font-sans text-indigo-800 ml-1">v</span></p>
                                   </div>
                                </div>
                                
                                <button 
                                   onClick={() => handleMarketExit(selectedDossier)}
                                   disabled={selectedDossier.progress < 100 || isSubmitting}
                                   className={`px-16 py-8 rounded-full font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(0,0,0,0.4)] flex items-center justify-center gap-6 transition-all border-4 border-white/10 ${
                                     selectedDossier.progress >= 100 
                                      ? 'agro-gradient text-white hover:scale-105 active:scale-95 ring-[16px] ring-emerald-500/5' 
                                      : 'bg-white/5 text-slate-800 border-white/5 cursor-not-allowed grayscale'
                                   }`}
                                >
                                   {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShoppingCart size={28} className="fill-current" />}
                                   {isSubmitting ? 'BUFFERING_EXIT...' : 'COMMENCE MARKET EXIT'}
                                </button>
                             </div>
                          </div>

                          {/* Oracle Forecast Bubble */}
                          {forecastReport && (
                            <div className="animate-in slide-in-from-bottom-10 duration-1000 max-w-5xl mx-auto">
                               <div className="p-10 md:p-16 bg-black/90 rounded-[64px] border-2 border-indigo-500/20 shadow-3xl border-l-[20px] border-l-indigo-600 relative overflow-hidden group/forecast">
                                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/forecast:scale-110 transition-transform duration-[15s]"><Sparkles size={600} className="text-indigo-400" /></div>
                                  <div className="flex justify-between items-center mb-12 relative z-10 border-b border-white/5 pb-8">
                                     <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl animate-float">
                                           <Bot size={32} className="animate-pulse" />
                                        </div>
                                        <div>
                                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Strategic Exit Shard</h4>
                                           <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.5em] mt-3 italic">MARKET_CLOUD_PROJECTION_v4</p>
                                        </div>
                                     </div>
                                     <button onClick={() => setForecastReport(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white transition-all active:scale-90"><X size={24}/></button>
                                  </div>
                                  <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/10">
                                     {forecastReport}
                                  </div>
                                  <div className="mt-12 pt-10 border-t border-white/10 flex justify-center relative z-10">
                                     <button onClick={() => setForecastReport(null)} className="px-16 py-6 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">Handshake Acknowledged</button>
                                  </div>
                               </div>
                            </div>
                          )}
                       </div>
                     ) : (
                       <div className="h-[750px] flex flex-col items-center justify-center text-center space-y-12 opacity-10 group/idle">
                          <div className="relative">
                             <Database size={180} className="text-slate-500 group-hover/idle:text-emerald-400 transition-colors duration-1000" />
                             <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-6xl font-black uppercase tracking-[0.5em] text-white italic">SHARD_IDLE</p>
                             <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Select an inflow shard to initialize the terminal</p>
                          </div>
                       </div>
                     )}
                  </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL OVERLAY */}
      {showAddModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowAddModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[80px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-emerald-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 md:w-20 h-16 md:h-20 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={40} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Inflow <span className="text-emerald-400">Ingest</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">STAGE: {step.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 hover:rotate-90 active:scale-90 shadow-2xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 {step === 'registration' && (
                    <form onSubmit={handleRegisterMetadata} className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-2xl font-black text-white uppercase italic">Metadata Ingestion</h4>
                          <p className="text-slate-500 text-base font-medium leading-relaxed italic px-10">"Define the biological or circular properties of the inflow shard."</p>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block">Asset Designation (Name)</label>
                             <input 
                                type="text" required value={newProductName} onChange={e => setNewProductName(e.target.value)}
                                placeholder="e.g. Bantu Maize Shard #42..." 
                                className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                             />
                          </div>
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block">Pillar Category</label>
                             <div className="grid grid-cols-3 gap-4">
                                {['Produce', 'Manufactured', 'Input'].map(cat => (
                                   <button 
                                      key={cat} type="button" onClick={() => setNewProductCategory(cat as any)}
                                      className={`p-6 rounded-[32px] border-2 transition-all text-xs font-black uppercase tracking-widest shadow-xl ${newProductCategory === cat ? 'bg-emerald-600 border-white text-white scale-105 ring-8 ring-emerald-500/5' : 'bg-black/60 border-white/10 text-slate-500 hover:border-white/20'}`}
                                   >
                                      {cat}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                       <button 
                        type="submit"
                        disabled={isSubmitting || !newProductName.trim()}
                        className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                       >
                          {isSubmitting ? <Loader2 size={32} className="animate-spin" /> : <ChevronRight size={32} />}
                          {isSubmitting ? 'MINTING SHARD...' : 'INITIALIZE VERIFICATION'}
                       </button>
                    </form>
                 )}

                 {step === 'verification' && (
                    <div className="space-y-16 animate-in zoom-in duration-1000 flex flex-col items-center justify-center text-center flex-1">
                       <div className="space-y-10">
                          <div className="relative">
                             <div className="w-48 h-48 rounded-[64px] bg-amber-500/10 flex items-center justify-center border-4 border-amber-500/30 shadow-[0_0_120px_rgba(245,158,11,0.2)] animate-pulse">
                                <Fingerprint size={80} className="text-amber-500" />
                             </div>
                             <div className="absolute inset-[-20px] border-2 border-dashed border-amber-400/20 rounded-[80px] animate-spin-slow"></div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Registry <span className="text-amber-500">Handshake</span></h4>
                             <p className="text-slate-400 text-2xl font-medium italic max-w-lg mx-auto leading-relaxed opacity-80">
                                "Synchronizing physical field observations with the AI Studio decentralized ledger."
                             </p>
                          </div>
                       </div>

                       <div className="w-full max-w-md space-y-8">
                          <div className="p-8 bg-black rounded-[48px] border-2 border-white/5 space-y-4 shadow-inner">
                             <div className="flex justify-between items-center px-4">
                                <span className="text-[11px] font-black text-slate-600 uppercase">Handshake ID</span>
                                <span className="text-xs font-mono font-black text-white">0xHS_{Math.random().toString(16).slice(2,8).toUpperCase()}</span>
                             </div>
                             <div className="flex justify-between items-center px-4">
                                <span className="text-[11px] font-black text-slate-600 uppercase">ZK_SESSION</span>
                                <span className="text-xs font-mono font-black text-emerald-400">ENCRYPTED</span>
                             </div>
                          </div>
                          <button 
                             onClick={handleHandshake}
                             disabled={isSubmitting}
                             className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[20px] ring-white/5"
                          >
                             {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Stamp size={24} />}
                             {isSubmitting ? 'ANCHORING...' : 'AUTHORIZE HANDSHAKE'}
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default LiveFarming;
