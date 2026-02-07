
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
  Filter,
  ShieldCheck, 
  ShieldAlert, 
  SearchCode, 
  HardHat, 
  BadgeCheck, 
  Database, 
  FileText, 
  Download, 
  ChevronRight, 
  Maximize2, 
  Lock, 
  Binary, 
  Terminal, 
  Activity as Pulse, 
  Signal, 
  Wifi, 
  Scan, 
  Maximize, 
  Share2, 
  MessageSquare, 
  Waves, 
  Heart, 
  Sparkles, 
  Gauge,
  Smartphone,
  Star,
  ArrowLeftCircle,
  Wrench,
  SmartphoneNfc,
  ClipboardList,
  Cable,
  Link2,
  Unlink,
  History as HistoryIcon,
  Target,
  Search,
  Plus,
  ArrowUpRight,
  CircleStop,
  Stamp,
  Boxes,
  Workflow,
  Globe,
  Settings,
  MoreVertical,
  AlertCircle,
  Radio,
  Fingerprint,
  Info,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState, AgroResource } from '../types';

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
  { id: 'T-4', title: 'Carbon Minting Vouch', thrust: 'Industry', duration: '6h', seq: 1 },
];

const STAGES: LiveAgroProduct['stage'][] = ['Inception', 'Processing', 'Quality_Audit', 'Finalization', 'Market_Ready'];

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, products, setProducts, onEarnEAC, onSaveProduct, onNavigate, notify }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<LiveAgroProduct | null>(null);
  const [dossierTab, setDossierTab] = useState<'lifecycle' | 'live_inflow' | 'twin' | 'traceability'>('lifecycle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Produce' | 'Manufactured' | 'Input'>('Produce');
  const [auditStep, setAuditStep] = useState<'form' | 'audit_pending' | 'success'>('form');
  
  const [ingestLogs, setIngestLogs] = useState<IngestLog[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [votedProducts, setVotedProducts] = useState<string[]>([]);
  const [showLinkModal, setShowLinkModal] = useState<'task' | 'node' | 'evidence' | null>(null);
  const hardwareResources = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ingestLogs]);

  useEffect(() => {
    let interval: any;
    if (selectedDossier && dossierTab === 'live_inflow') {
      setIsIngesting(true);
      const initialLog: IngestLog = { id: 'LOG-INIT', sequence: 1, event: 'PLC Handshake initialized...', status: 'SYNCING', timestamp: 'NOW' };
      setIngestLogs([initialLog]);

      const events = [
        'Ingesting Telemetry Shard #882',
        'Validating m-Constant Resilience...',
        'ZK-Proof signature verified via EOS Core',
        'Registry block synchronized',
        'Bio-Signal stability check: OK',
        'Committing sequence hash to Industrial Archive',
        'Regional relay sync complete',
        'Consensus reached with Node stewards',
        'Acoustic resonance frequency aligned',
        'Telemetry loop stabilized',
        'Inflow pressure normalized',
        'SCADA terminal synchronized'
      ];

      let step = 0;
      interval = setInterval(() => {
        if (step < events.length) {
          const newLog: IngestLog = {
            id: `LOG-${Date.now()}-${step}`,
            sequence: step + 2,
            event: events[step],
            status: step % 2 === 0 ? 'SYNCING' : 'VERIFIED',
            timestamp: new Date().toLocaleTimeString([], { hour12: false })
          };
          setIngestLogs(prev => [...prev, newLog].slice(-15));
          step++;
        } else {
          setIsIngesting(false);
          step = 0;
        }
      }, 2500);
    } else {
      setIngestLogs([]);
      setIsIngesting(false);
    }
    return () => clearInterval(interval);
  }, [selectedDossier, dossierTab]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newProduct: LiveAgroProduct = {
        id: `PRD-${Math.floor(Math.random() * 9000 + 1000)}`,
        stewardEsin: user.esin,
        stewardName: user.name,
        productType: newProductName,
        category: newProductCategory,
        stage: 'Inception',
        progress: 1,
        votes: 0,
        location: user.location,
        timestamp: new Date().toLocaleTimeString(),
        lastUpdate: 'Just now',
        isAuthentic: false,
        auditStatus: 'Pending',
        tasks: [],
        telemetryNodes: []
      };
      
      onSaveProduct(newProduct);
      setIsSubmitting(false);
      setAuditStep('audit_pending');
      onEarnEAC(10, 'INDUSTRIAL_SHARD_INITIALIZED');
    }, 2000);
  };

  const handlePromoteStage = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentIdx = STAGES.indexOf(product.stage);
    const nextIdx = Math.min(currentIdx + 1, STAGES.length - 1);
    const nextStage = STAGES[nextIdx];
    const newProgress = Math.min(100, product.progress + 25);
    
    if (nextStage !== product.stage) {
      onEarnEAC(20, `INDUSTRIAL_PROMOTION_${nextStage}`);
      notify('info', 'LIFECYCLE_PROMOTED', `${product.productType} moved to ${nextStage.replace(/_/g, ' ')}`);
    }
    
    const updated = { ...product, stage: nextStage, progress: newProgress, lastUpdate: 'Just now' };
    onSaveProduct(updated);
    if (selectedDossier?.id === productId) setSelectedDossier(updated);
  };

  const handleVote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.isAuthentic || votedProducts.includes(productId)) return;
    
    const updated = { ...product, votes: product.votes + 1 };
    onSaveProduct(updated);
    setVotedProducts(prev => [...prev, productId]);
    notify('success', 'VOUCH_RECORDED', `Steward vouch sharded for ${product.productType}.`);
  };

  const handleLinkTask = (taskId: string) => {
    if (!selectedDossier) return;
    const updatedProduct = { ...selectedDossier, tasks: [...(selectedDossier.tasks || []), taskId] };
    onSaveProduct(updatedProduct);
    setSelectedDossier(updatedProduct);
    setShowLinkModal(null);
    onEarnEAC(5, `TASK_LINKED_TO_${selectedDossier.id}`);
  };

  const handleLinkNode = (nodeId: string) => {
    if (!selectedDossier) return;
    const updatedProduct = { ...selectedDossier, telemetryNodes: [...(selectedDossier.telemetryNodes || []), nodeId] };
    onSaveProduct(updatedProduct);
    setSelectedDossier(updatedProduct);
    setShowLinkModal(null);
    onEarnEAC(5, `IOT_NODE_LINKED_TO_${selectedDossier.id}`);
  };

  const handleReactionMining = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.votes === 0) return;
    
    const reward = product.votes * 1.5;
    onEarnEAC(reward, `REACTION_MINING_${productId}`);
    const updated = { ...product, votes: 0 };
    onSaveProduct(updated);
    notify('success', 'REACTION_MINING_SUCCESS', `${reward.toFixed(2)} EAC sharded into node treasury.`);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Workflow size={1000} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
              <div className="w-full h-[2px] bg-indigo-500/10 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0 flex flex-col items-center">
              <div className="w-48 h-48 rounded-[64px] bg-white flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all duration-700 shadow-2xl">
                 <div className="flex flex-col gap-1 items-center">
                    <div className="w-14 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="w-14 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="w-14 h-2 bg-emerald-500 rounded-full"></div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-emerald-950/40 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">INDUSTRIAL_MESH_ACTIVE</span>
                    <span className="px-5 py-2 bg-indigo-950/40 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner">SCADA_V6.0_SYNC</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">INDUSTRIAL <br/> <span className="text-emerald-400">CONTROL.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating industrial sharding through the EOS Machine Mesh. Convert biological inflow into verified market-ready assets with absolute traceability."
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                <button 
                  onClick={() => { setShowAddProduct(true); setAuditStep('form'); }}
                  className="w-full max-w-lg py-10 bg-white rounded-[40px] text-black font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 border-4 border-white/10 relative overflow-hidden"
                >
                  <div className="absolute inset-y-4 inset-x-8 bg-emerald-500 rounded-full flex items-center justify-center gap-4 text-white">
                    <Plus size={28} />
                    INITIALIZE INFLOW SHARD
                  </div>
                </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">AGGREGATE_THROUGHPUT</p>
              <h4 className="text-8xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">
                14<span className="text-2xl text-emerald-500 font-sans ml-1">2K</span>
              </h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> TELEMETRY_STABLE
              </p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>System Load</span>
                 <span className="text-emerald-400 font-mono">NOMINAL</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '84%' }}></div>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-12">
         <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-8 gap-10">
            <div className="space-y-4">
               <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">INFLOW <span className="text-emerald-400">PROCESSING LEDGER</span></h3>
               <p className="text-slate-500 text-xl font-medium italic opacity-70">Real-time SCADA feed of active industrial sharding sequences.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 px-6">
            {products.map(product => (
               <div key={product.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-[0.99] duration-300 bg-black/40 shadow-3xl relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity z-10">
                     <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
                  </div>
                  <div className="flex justify-between items-start mb-12 relative z-20">
                     <div className={`p-6 rounded-3xl border-2 transition-all group-hover:rotate-6 shadow-2xl ${
                        product.category === 'Produce' ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400' :
                        product.category === 'Manufactured' ? 'bg-blue-600/10 border-blue-500/20 text-blue-400' :
                        'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                     }`}>
                        {product.category === 'Produce' ? <Sprout size={36} /> : 
                         product.category === 'Manufactured' ? <Factory size={36} /> : 
                         <Cpu size={36} />}
                     </div>
                     <div className="text-right">
                        <div className="flex items-center justify-end gap-3 mb-3">
                          {product.isAuthentic ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                               <BadgeCheck className="w-4 h-4" />
                               <span className="text-[9px] font-black uppercase tracking-widest">AUTHENTIC</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 animate-pulse">
                               <ShieldAlert className="w-4 h-4" />
                               <span className="text-[9px] font-black uppercase tracking-widest">PENDING_AUDIT</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 bg-black/60 text-slate-400 shadow-inner`}>
                           {product.stage.replace(/_/g, ' ')}
                        </span>
                     </div>
                  </div>
                  <div className="flex-1 space-y-8 relative z-20">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic">{product.category.toUpperCase()}_UNIT</p>
                           <p className="text-[10px] text-slate-700 font-mono font-bold tracking-tighter">#{product.id}</p>
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:text-emerald-400 transition-colors m-0 drop-shadow-2xl">{product.productType}</h4>
                     </div>
                     <div className="flex items-center gap-4 text-slate-400 bg-white/5 p-4 rounded-[28px] border border-white/5 shadow-inner">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest truncate">{product.location}</span>
                     </div>
                  </div>
                  <div className="mt-14 pt-10 border-t border-white/5 flex flex-col gap-8 relative z-20">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${product.isAuthentic ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-800'}`}></div>
                              <span className="text-[12px] font-black text-white uppercase tracking-widest italic">{product.votes} Consumer Vouches</span>
                           </div>
                        </div>
                        {user.esin === product.stewardEsin ? (
                           <button 
                             onClick={() => handleReactionMining(product.id)}
                             disabled={product.votes === 0}
                             className={`p-6 rounded-3xl transition-all shadow-3xl flex items-center justify-center relative overflow-hidden group/btn ${
                               product.votes > 0 ? 'bg-amber-600 text-white hover:scale-110' : 'bg-white/5 text-slate-800 cursor-not-allowed border border-white/5'
                             }`}
                           >
                              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 animate-pulse"></div>
                              <Zap className="w-8 h-8 fill-current relative z-10" />
                           </button>
                        ) : (
                           <button 
                             onClick={() => handleVote(product.id)}
                             disabled={!product.isAuthentic}
                             className={`p-6 rounded-3xl transition-all shadow-3xl flex items-center justify-center relative ${
                               !product.isAuthentic ? 'bg-black/40 text-slate-800 border border-white/5 cursor-not-allowed' :
                               'bg-white/5 text-slate-400 hover:text-white hover:bg-emerald-600/20 border border-white/10'
                             }`}
                           >
                              <ThumbsUp className="w-8 h-8" />
                           </button>
                        )}
                     </div>
                     <div className="flex gap-4">
                        <button 
                           onClick={() => { setSelectedDossier(product); setDossierTab('lifecycle'); }}
                           className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95"
                        >
                           <Terminal size={18} className="text-emerald-400" /> SCADA Dossier
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {selectedDossier && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedDossier(null)}></div>
           <div className="relative z-10 w-full max-w-7xl h-[90vh] glass-card rounded-[80px] border-emerald-500/20 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(0,0,0,0.9)] animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 md:p-16 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative shrink-0 z-10">
                 <button onClick={() => setSelectedDossier(null)} className="absolute top-10 right-10 p-5 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 shadow-2xl hover:rotate-90 active:scale-90"><X size={32} /></button>
                 <div className="flex items-center gap-10">
                    <div className={`w-28 h-28 rounded-[40px] flex items-center justify-center shadow-3xl relative overflow-hidden group/ico ${
                        selectedDossier.category === 'Produce' ? 'bg-emerald-600' : 
                        selectedDossier.category === 'Manufactured' ? 'bg-blue-600' : 'bg-indigo-600'
                    }`}>
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       {selectedDossier.category === 'Produce' ? <Sprout size={56} className="text-white relative z-10 group/ico:scale-110 transition-transform" /> : 
                        selectedDossier.category === 'Manufactured' ? <Factory size={56} className="text-white relative z-10 group/ico:scale-110 transition-transform" /> : 
                        <Cpu size={56} className="text-white relative z-10 group/ico:scale-110 transition-transform" />}
                    </div>
                    <div className="space-y-4">
                       <div className="flex flex-wrap items-center gap-4">
                          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">{selectedDossier.productType}</h2>
                       </div>
                       <p className="text-[11px] text-slate-500 font-mono tracking-[0.5em] uppercase">PLC_SEQUENCE: {selectedDossier.id} // STEWARD: {selectedDossier.stewardName.toUpperCase()}</p>
                    </div>
                 </div>
                 {user.esin === selectedDossier.stewardEsin && (
                    <div className="flex gap-4 relative z-10">
                       <button 
                         onClick={() => setShowLinkModal('evidence')}
                         className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-4 border border-white/10 ring-8 ring-white/5"
                       >
                          <Camera className="w-5 h-5" /> Ingest Physical Evidence
                       </button>
                       <button 
                         onClick={() => setShowLinkModal('task')}
                         className="px-10 py-5 bg-indigo-600/10 border border-indigo-500/30 rounded-3xl text-[11px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-4 shadow-xl active:scale-95"
                       >
                          <Wrench className="w-5 h-5" /> Link PLC Task
                       </button>
                       <button 
                         onClick={() => setShowLinkModal('node')}
                         className="px-10 py-5 bg-blue-600/10 border border-blue-500/30 rounded-3xl text-[11px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-4 shadow-xl active:scale-95"
                       >
                          <SmartphoneNfc className="w-5 h-5" /> Link Ingest Node
                       </button>
                    </div>
                 )}
              </div>

              <div className="flex border-b border-white/5 bg-black/60 shrink-0 z-10 relative">
                 {[
                   { id: 'lifecycle', label: 'Processing Pipeline', icon: Layers, col: 'border-emerald-500 text-emerald-400 bg-emerald-500/5' },
                   { id: 'live_inflow', label: 'Telemetry SCADA', icon: Zap, col: 'border-blue-500 text-blue-400 bg-blue-500/5' },
                 ].map(tab => (
                   <button 
                    key={tab.id}
                    onClick={() => setDossierTab(tab.id as any)}
                    className={`flex-1 py-10 text-[11px] font-black uppercase tracking-[0.5em] transition-all border-b-4 relative overflow-hidden group/tab ${dossierTab === tab.id ? tab.col : 'border-transparent text-slate-600 hover:text-slate-300'}`}
                   >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/tab:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-center gap-4 relative z-10">
                       <tab.icon className={`w-5 h-5 transition-transform duration-500 group-hover/tab:scale-110 ${dossierTab === tab.id ? '' : 'text-slate-700'}`} />
                       {tab.label}
                    </div>
                   </button>
                 ))}
              </div>

              <div className="flex-1 overflow-hidden relative z-10">
                 {dossierTab === 'lifecycle' && (
                   <div className="h-full overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col lg:flex-row gap-20 bg-black/20">
                      <div className="lg:w-7/12 space-y-16">
                         <div className="space-y-12 relative py-4">
                            <div className="absolute left-[35px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-600 to-emerald-500 opacity-20"></div>
                            {[
                               { stage: 'Genesis Ingest', time: selectedDossier.timestamp, desc: 'Initial registry node initialized by steward ESIN signature.', status: 'SIGNED', icon: Database, color: 'text-blue-400' },
                               { stage: 'Physical Audit', time: 'Phase 1 Complete', desc: 'EnvirosAgro field audit team performed site biometric verification.', status: selectedDossier.auditStatus.toUpperCase(), icon: ShieldCheck, color: selectedDossier.isAuthentic ? 'text-emerald-400' : 'text-amber-400' },
                            ].map((step, i) => (
                               <div key={i} className="flex gap-10 relative z-10 group/step">
                                  <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 border-2 transition-all duration-700 bg-[#050706] border-white/10 group-hover/step:border-emerald-500/40 shadow-2xl`}>
                                     <step.icon className={`w-8 h-8 ${step.color} transition-all duration-700 group-hover/step:scale-110`} />
                                  </div>
                                  <div className="flex-1 space-y-3">
                                     <div className="flex justify-between items-center">
                                        <h5 className="text-2xl font-black text-white uppercase italic tracking-tight m-0">{step.stage}</h5>
                                        <div className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase border tracking-[0.2em] shadow-inner ${
                                           step.status === 'VERIFIED' || step.status === 'SIGNED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>{step.status}</div>
                                     </div>
                                     <p className="text-lg text-slate-500 font-medium italic">"{step.desc}"</p>
                                     <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest">{step.time}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="lg:w-5/12 space-y-12">
                         <div className="glass-card p-12 rounded-[64px] bg-emerald-600/5 border-2 border-emerald-500/20 space-y-10 relative overflow-hidden group/oracle shadow-3xl">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><ClipboardList size={400} className="text-emerald-400" /></div>
                            <div className="flex items-center gap-8 relative z-10">
                               <div className="p-5 bg-emerald-600 rounded-3xl shadow-3xl border-2 border-white/10 group-hover/oracle:rotate-12 transition-transform">
                                  <Monitor size={36} className="text-white" />
                               </div>
                               <div>
                                  <h4 className="text-3xl font-black text-white uppercase tracking-widest m-0 italic leading-none">Process <span className="text-emerald-400">Oracle</span></h4>
                                  <p className="text-[10px] text-emerald-400/60 font-black uppercase mt-2 tracking-widest">SEQUENCE_MONITOR_v5.2</p>
                               </div>
                            </div>
                            <div className="relative z-10 border-l-[6px] border-l-emerald-500/40 pl-10 py-4 bg-black/40 rounded-r-[48px] shadow-inner">
                               <p className="text-slate-300 text-xl leading-relaxed italic font-medium">
                                  "The industrial sequence is currently sharding in the <span className="text-indigo-400 font-black">PROCESSING</span> flow. Current node resonance is stable at 1.42x. Ensure all linked physical evidence shards are anchored for TQM compliance."
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}
                 {dossierTab === 'live_inflow' && (
                   <div className="h-full flex flex-col lg:flex-row animate-in fade-in duration-500 overflow-hidden bg-black/40">
                      <div className="flex-1 p-12 md:p-16 overflow-y-auto custom-scrollbar-terminal space-y-10 bg-[#050706] relative">
                         <div className="absolute inset-0 pointer-events-none opacity-5">
                            <div className="w-full h-[1px] bg-blue-500 absolute top-0 animate-scan"></div>
                         </div>
                         <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-white/10 pb-10 gap-8 relative z-10">
                            <div className="flex items-center gap-8">
                               <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_50px_#2563eb44] group-hover:rotate-12 transition-transform">
                                  <Terminal size={40} />
                               </div>
                               <div>
                                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">IoT <span className="text-blue-400">SCADA Stream</span></h3>
                                  <p className="text-blue-400/60 text-[10px] font-mono tracking-[0.4em] uppercase mt-3 italic">L2_DATA_INGEST_CHANNEL_#882</p>
                               </div>
                            </div>
                         </div>
                         <div className="space-y-6 font-mono text-[12px] relative z-10 bg-black/40 p-8 rounded-[48px] shadow-inner border border-white/5">
                            {ingestLogs.length === 0 && (
                               <div className="py-24 text-center opacity-10 flex flex-col items-center gap-8">
                                  <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />
                                  <p className="text-3xl font-black uppercase tracking-[0.8em]">Awaiting Ingest...</p>
                               </div>
                            )}
                            {ingestLogs.map((log) => (
                               <div key={log.id} className="flex gap-10 p-6 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/log rounded-2xl animate-in slide-in-from-right duration-500">
                                  <span className="text-slate-700 w-32 shrink-0 font-black tracking-widest">[{log.timestamp}]</span>
                                  <div className="flex-1 space-y-2">
                                     <span className="text-slate-300 block font-black uppercase tracking-widest group-hover/log:text-white transition-colors">{log.event}</span>
                                  </div>
                                  <div className={`px-5 py-2 rounded-xl text-[10px] h-fit font-black tracking-widest shrink-0 border-2 shadow-2xl transition-all duration-700 ${
                                     log.status === 'VERIFIED' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-600/10 text-blue-400 border-blue-500/20 animate-pulse'
                                  }`}>
                                     {log.status}
                                  </div>
                               </div>
                            ))}
                            <div ref={logEndRef} />
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {showLinkModal === 'evidence' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowLinkModal(null)}></div>
           <div className="relative z-10 w-full max-lg glass-card rounded-[56px] border border-white/10 bg-[#050706] shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[80vh]">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl shadow-xl bg-emerald-600/20 text-emerald-400">
                       <Camera size={24}/>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Link <span className="text-emerald-400">Physical Evidence</span></h3>
                 </div>
                 <button onClick={() => setShowLinkModal(null)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-6 custom-scrollbar bg-black/40">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button 
                        onClick={() => { setShowLinkModal(null); onNavigate('media'); }}
                        className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-emerald-500/40 bg-black/60 flex flex-col items-center text-center space-y-6 transition-all group"
                      >
                         <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                            <Radio size={40} className="animate-pulse" />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-white uppercase italic">Live Broadcast Ingest</h4>
                            <p className="text-slate-500 text-[9px] font-bold uppercase mt-3 tracking-widest">"Anchor physical appearance via direct high-frequency stream."</p>
                         </div>
                      </button>
                      <button 
                        onClick={() => { setShowLinkModal(null); onNavigate('digital_mrv'); }}
                        className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/40 bg-black/60 flex flex-col items-center text-center space-y-6 transition-all group"
                      >
                         <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                            <ImageIcon size={40} />
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-white uppercase italic">Photo Shard Upload</h4>
                            <p className="text-slate-500 text-[9px] font-bold uppercase mt-3 tracking-widest">"Verify site biometrics through ZK-validated field evidence."</p>
                         </div>
                      </button>
                   </div>
              </div>
           </div>
        </div>
      )}

      {showAddProduct && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowAddProduct(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 space-y-12 overflow-y-auto custom-scrollbar flex-1 flex flex-col justify-center bg-black/40">
                 <button onClick={() => setShowAddProduct(false)} className="absolute top-10 right-10 p-5 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 hover:rotate-90"><X size={32} /></button>
                 {auditStep === 'form' && (
                    <form onSubmit={handleAddProduct} className="space-y-12 animate-in slide-in-from-right-6 duration-500">
                       <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-[0_0_80px_rgba(16,185,129,0.3)] animate-float border-4 border-white/10">
                             <Monitor size={48} />
                          </div>
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Initialize <span className="text-emerald-400">Shard</span></h3>
                          <p className="text-slate-500 text-xl font-medium italic">Begin a new industrial sharding cycle for your node output.</p>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-left">Product Alias (Name)</label>
                             <input 
                               type="text" required value={newProductName} onChange={e => setNewProductName(e.target.value)}
                               placeholder="e.g. Bantu Rice Cycle 12..." 
                               className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-900 italic shadow-inner" 
                             />
                          </div>
                          <div className="space-y-3 px-4">
                             <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block text-left">Industrial Category</label>
                             <div className="grid grid-cols-3 gap-4">
                                {['Produce', 'Manufactured', 'Input'].map(cat => (
                                   <button 
                                      key={cat} type="button" onClick={() => setNewProductCategory(cat as any)}
                                      className={`p-6 rounded-[32px] border-2 transition-all text-xs font-black uppercase tracking-widest shadow-xl ${newProductCategory === cat ? 'bg-emerald-600 border-white text-white scale-105 ring-4 ring-emerald-500/10' : 'bg-black/60 border-white/10 text-slate-500'}`}
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
                        className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[12px] ring-white/5"
                       >
                          {isSubmitting ? <Loader2 className="w-10 h-10 animate-spin" /> : <ChevronRight size={32} />}
                          {isSubmitting ? 'MINTING SHARD...' : 'CONTINUE TO PHYSICAL AUDIT'}
                       </button>
                    </form>
                 )}
                 {auditStep === 'audit_pending' && (
                    <div className="space-y-16 animate-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center text-center">
                       <div className="space-y-8">
                          <div className="relative">
                             <div className="w-48 h-48 rounded-[56px] bg-amber-500/10 flex items-center justify-center border-4 border-amber-500/30 shadow-[0_0_100px_rgba(245,158,11,0.2)] animate-pulse">
                                <HardHat size={80} className="text-amber-500" />
                             </div>
                             <div className="absolute inset-[-15px] border-2 border-dashed border-amber-400/20 rounded-[64px] animate-spin-slow"></div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Physical <span className="text-amber-500">Audit Protocol</span></h4>
                             <p className="text-slate-400 text-2xl font-medium italic max-lg:text-sm max-w-lg mx-auto leading-relaxed opacity-80">
                                "Registry handshake successful. EnvirosAgro HQ stewards are currently sharding a physical visit to certify node biometrics."
                             </p>
                          </div>
                       </div>
                       <button 
                        onClick={() => setShowAddProduct(false)}
                        className="w-full py-8 bg-white/5 border-2 border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95 ring-4 ring-white/5"
                       >
                          Return to Pipeline
                       </button>
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
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default LiveFarming;
