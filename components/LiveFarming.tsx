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
  Target
} from 'lucide-react';
import { User, LiveAgroProduct, ViewState, AgroResource } from '../types';

interface LiveFarmingProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

interface IngestLog {
  id: string;
  sequence: number;
  event: string;
  status: 'SYNCING' | 'COMMITTED' | 'VERIFIED';
  timestamp: string;
}

// Simulated Task Shards available for linking
const INDUSTRIAL_TASK_POOL = [
  { id: 'T-882', title: 'Substrate Sterilization', thrust: 'Technological', duration: '2h' },
  { id: 'T-104', title: 'Lineage DNA Handshake', thrust: 'Societal', duration: '1h' },
  { id: 'T-042', title: 'Bio-Electric Pulse Calibration', thrust: 'Environmental', duration: '4h' },
  { id: 'T-991', title: 'Thermal Ingest Audit', thrust: 'Industry', duration: '6h' },
];

const MOCK_LIVE_PRODUCTS: LiveAgroProduct[] = [
  { 
    id: 'PRD-401', 
    stewardEsin: 'EA-2024-X1', 
    stewardName: 'Sarah’s Organic', 
    productType: 'Maize Shards', 
    category: 'Produce',
    stage: 'Processing', 
    progress: 15, 
    votes: 42, 
    location: 'Zone 4, Nebraska', 
    timestamp: '2d ago', 
    lastUpdate: '10m ago',
    isAuthentic: true,
    auditStatus: 'Verified',
    tasks: ['T-882', 'T-104'],
    telemetryNodes: []
  },
  { 
    id: 'PRD-402', 
    stewardEsin: 'EA-2024-X2', 
    stewardName: 'BioFix Industrial', 
    productType: 'Bio-Organic Fertilizer', 
    category: 'Manufactured',
    stage: 'Quality_Audit', 
    progress: 85, 
    votes: 128, 
    location: 'Nairobi, KE Hub', 
    timestamp: '2w ago', 
    lastUpdate: '10m ago',
    isAuthentic: true,
    auditStatus: 'Verified',
    tasks: ['T-042'],
    telemetryNodes: ['NODE-01']
  },
  { 
    id: 'PRD-007', 
    stewardEsin: 'EA-2025-W12', 
    stewardName: 'Neo Harvest', 
    productType: 'Genetic Cotton', 
    category: 'Produce',
    stage: 'Inception', 
    progress: 5, 
    votes: 12, 
    location: 'Zone 1, NY', 
    timestamp: '1h ago', 
    lastUpdate: '10m ago',
    isAuthentic: false,
    auditStatus: 'Pending',
    tasks: [],
    telemetryNodes: []
  },
];

const LiveFarming: React.FC<LiveFarmingProps> = ({ user, onEarnEAC, onNavigate }) => {
  const [products, setProducts] = useState<LiveAgroProduct[]>(MOCK_LIVE_PRODUCTS);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<LiveAgroProduct | null>(null);
  const [dossierTab, setDossierTab] = useState<'lifecycle' | 'live_inflow' | 'twin'>('lifecycle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'Produce' | 'Manufactured' | 'Input'>('Produce');
  const [auditStep, setAuditStep] = useState<'form' | 'audit_pending' | 'success'>('form');
  
  const [ingestLogs, setIngestLogs] = useState<IngestLog[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const [votedProducts, setVotedProducts] = useState<string[]>([]);

  // Linking States
  const [showLinkModal, setShowLinkModal] = useState<'task' | 'node' | null>(null);
  const hardwareResources = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ingestLogs]);

  useEffect(() => {
    let interval: any;
    if (selectedDossier && dossierTab === 'live_inflow') {
      setIsIngesting(true);
      const initialLog: IngestLog = { id: 'LOG-INIT', sequence: 1, event: 'Live Telemetry handshaking...', status: 'SYNCING', timestamp: 'NOW' };
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
        'Telemetry loop stabilized'
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
          setIngestLogs(prev => [...prev, newLog].slice(-12));
          step++;
        } else {
          setIsIngesting(false);
          // Loop logs for visual effect
          step = 0;
        }
      }, 3000);
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
        id: `PRD-${Math.floor(Math.random() * 1000)}`,
        stewardEsin: user.esin,
        stewardName: user.name,
        productType: newProductName,
        category: newProductCategory,
        stage: 'Inception',
        progress: 1,
        votes: 0,
        location: user.location,
        timestamp: 'Just now',
        lastUpdate: 'Now',
        isAuthentic: false,
        auditStatus: 'Pending',
        tasks: [],
        telemetryNodes: []
      };
      setProducts([newProduct, ...products]);
      setIsSubmitting(false);
      setAuditStep('audit_pending');
      onEarnEAC(5, 'LIVE_PRODUCT_INITIALIZATION');
    }, 2000);
  };

  const handleVote = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product?.isAuthentic) {
      alert("RESTRICTED: Consumers can only vote for products marked 'Authentic' via Physical Audit.");
      return;
    }
    if (votedProducts.includes(productId)) return;
    setVotedProducts([...votedProducts, productId]);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, votes: p.votes + 1 } : p));
  };

  const handleLinkTask = (taskId: string) => {
    if (!selectedDossier) return;
    const updatedProduct = { ...selectedDossier, tasks: [...(selectedDossier.tasks || []), taskId] };
    setProducts(prev => prev.map(p => p.id === selectedDossier.id ? updatedProduct : p));
    setSelectedDossier(updatedProduct);
    setShowLinkModal(null);
    onEarnEAC(5, `TASK_LINKED_TO_${selectedDossier.id}`);
  };

  const handleLinkNode = (nodeId: string) => {
    if (!selectedDossier) return;
    const updatedProduct = { ...selectedDossier, telemetryNodes: [...(selectedDossier.telemetryNodes || []), nodeId] };
    setProducts(prev => prev.map(p => p.id === selectedDossier.id ? updatedProduct : p));
    setSelectedDossier(updatedProduct);
    setShowLinkModal(null);
    onEarnEAC(5, `IOT_NODE_LINKED_TO_${selectedDossier.id}`);
  };

  const handleReactionMining = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || product.votes === 0) return;
    
    const reward = product.votes * 0.5;
    onEarnEAC(reward, `REACTION_MINING_${productId}`);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, votes: 0 } : p));
    alert(`REACTION MINING SUCCESS: ${reward.toFixed(2)} EAC sharded into your node treasury based on ${product.votes} consumer vouches.`);
  };

  const orbitalParticles = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      size: 4 + Math.random() * 6,
      duration: 10 + Math.random() * 20,
      delay: -(Math.random() * 20),
      radius: 60 + Math.random() * 40
    }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-widest">Shard: PRODUCT_INGEST</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Layers className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <Monitor className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">LIVE_INDUSTRIAL_INFLOW</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Product <span className="text-emerald-400">Processing</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                 Broadcast your production cycle. Synchronize <span className="text-emerald-400 font-bold underline">Industrial Tools</span> and <span className="text-blue-400 font-bold underline">IoT Telemetry</span> for end-to-end traceability.
              </p>
              <button 
                onClick={() => { setShowAddProduct(true); setAuditStep('form'); }}
                className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto md:ml-0"
              >
                <PlusCircle className="w-5 h-5" /> Initialize Product Shard
              </button>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Total Node Yield</p>
              <h4 className="text-7xl md:text-7xl font-mono font-black text-white tracking-tighter">1.4<span className="text-lg text-emerald-500">M</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Consumer Demand</span>
                 <span className="text-emerald-400">High</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[84%] shadow-[0_0_10px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-10">
         <div className="flex justify-between items-center border-b border-white/5 pb-8 px-4">
            <div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Industrial <span className="text-emerald-400">Inflow Pipeline</span></h3>
               <p className="text-slate-500 text-sm mt-2 font-medium italic">Active processing shards with linked IoT and Task telemetry.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
               <div key={product.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                  <div className="flex justify-between items-start mb-10 relative z-10">
                     <div className={`p-5 rounded-3xl border transition-all group-hover:rotate-6 ${
                        product.category === 'Produce' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        product.category === 'Manufactured' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                     }`}>
                        {product.category === 'Produce' ? <Sprout className="w-8 h-8" /> : 
                         product.category === 'Manufactured' ? <Factory className="w-8 h-8" /> : 
                         <Cpu className="w-8 h-8" />}
                     </div>
                     <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          {product.isAuthentic ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shadow-[0_0_100px_#10b981]">
                               <BadgeCheck className="w-3.5 h-3.5" />
                               <span className="text-[8px] font-black uppercase">Authentic</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/40 animate-pulse">
                               <ShieldAlert className="w-3.5 h-3.5" />
                               <span className="text-[8px] font-black uppercase">Pending Audit</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400`}>
                           {product.stage.replace(/_/g, ' ')}
                        </span>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 relative z-10">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">{product.category} Category</p>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{product.productType}</h4>
                     </div>
                     <div className="flex items-center gap-3 text-slate-400">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{product.location}</span>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1 group-hover:border-blue-500/20 transition-all">
                           <p className="text-[8px] text-slate-600 font-black uppercase">Linked IoT</p>
                           <div className="flex items-center gap-2">
                              <SmartphoneNfc size={12} className="text-blue-400" />
                              <span className="text-xs font-mono font-black text-white">{product.telemetryNodes?.length || 0} Nodes</span>
                           </div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-1 group-hover:border-indigo-500/20 transition-all">
                           <p className="text-[8px] text-slate-600 font-black uppercase">Industrial Tasks</p>
                           <div className="flex items-center gap-2">
                              <Wrench size={12} className="text-indigo-400" />
                              <span className="text-xs font-mono font-black text-white">{product.tasks?.length || 0} Shards</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-slate-500 italic">Processing Completion</span>
                           <span className="text-white font-mono">{product.progress}%</span>
                        </div>
                        <div className="h-4 bg-black/40 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner">
                           <div className={`h-full rounded-full shadow-2xl transition-all duration-[2s] ${
                              product.category === 'Produce' ? 'agro-gradient' : 'bg-blue-600'
                           }`} style={{ width: `${product.progress}%` }}></div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-6 relative z-10">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${product.isAuthentic ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{product.votes} Consumer Votes</span>
                           </div>
                           <p className="text-[8px] text-slate-600 font-black uppercase ml-5">Voucher Score: {product.isAuthentic ? 'Active' : 'Locked'}</p>
                        </div>
                        {user.esin === product.stewardEsin ? (
                           <button 
                             onClick={() => handleReactionMining(product.id)}
                             disabled={product.votes === 0}
                             className={`p-4 rounded-2xl transition-all shadow-xl flex items-center gap-2 ${
                               product.votes > 0 ? 'bg-amber-600 text-white animate-glow' : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                             }`}
                           >
                              <Zap className="w-5 h-5 fill-current" />
                              <span className="text-[10px] font-black uppercase">Mine Reactions</span>
                           </button>
                        ) : (
                           <button 
                             onClick={() => handleVote(product.id)}
                             disabled={votedProducts.includes(product.id) || !product.isAuthentic}
                             className={`p-4 rounded-2xl transition-all shadow-xl flex items-center gap-2 ${
                               !product.isAuthentic ? 'bg-black/40 text-slate-800 border border-white/5 cursor-not-allowed' :
                               votedProducts.includes(product.id) ? 'bg-emerald-600 text-white' : 
                               'bg-white/5 text-slate-400 hover:text-white hover:bg-emerald-600/10 border border-white/10'
                             }`}
                           >
                              <ThumbsUp className="w-5 h-5" />
                              <span className="text-[10px] font-black uppercase">{votedProducts.includes(product.id) ? 'Vouched' : 'Vouch'}</span>
                           </button>
                        )}
                     </div>
                     <button 
                        onClick={() => { setSelectedDossier(product); setDossierTab('lifecycle'); }}
                        className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                     >
                        <Eye className="w-4 h-4" /> View Technical Dossier
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Technical Dossier Modal */}
      {selectedDossier && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedDossier(null)}></div>
           <div className="relative z-10 w-full max-w-6xl h-[90vh] glass-card rounded-[64px] border-emerald-500/20 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative shrink-0">
                 <button onClick={() => setSelectedDossier(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 <div className="flex items-center gap-8">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center shadow-3xl ${
                        selectedDossier.category === 'Produce' ? 'bg-emerald-600' : 
                        selectedDossier.category === 'Manufactured' ? 'bg-blue-600' : 'bg-amber-600'
                    }`}>
                       {selectedDossier.category === 'Produce' ? <Sprout className="w-12 h-12 text-white" /> : 
                        selectedDossier.category === 'Manufactured' ? <Factory className="w-12 h-12 text-white" /> : 
                        <Cpu className="w-12 h-12 text-white" />}
                    </div>
                    <div>
                       <div className="flex items-center gap-3">
                          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">{selectedDossier.productType}</h2>
                          {selectedDossier.isAuthentic ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shadow-[0_0_10px_#10b981]">
                               <BadgeCheck className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Authentic</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/40">
                               <ShieldAlert className="w-4 h-4" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Provisional Shard</span>
                            </div>
                          )}
                       </div>
                       <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase mt-4">TECHNICAL_DOSSIER // {selectedDossier.id} // STEWARD: {selectedDossier.stewardName.toUpperCase()}</p>
                    </div>
                 </div>

                 {user.esin === selectedDossier.stewardEsin && (
                    <div className="flex gap-4">
                       <button 
                         onClick={() => setShowLinkModal('task')}
                         className="px-8 py-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3"
                       >
                          <Wrench className="w-4 h-4" /> Link Task Shard
                       </button>
                       <button 
                         onClick={() => setShowLinkModal('node')}
                         className="px-8 py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3"
                       >
                          <SmartphoneNfc className="w-4 h-4" /> Link IoT Node
                       </button>
                    </div>
                 )}
              </div>

              <div className="flex border-b border-white/5 bg-white/[0.02] shrink-0">
                 <button 
                  onClick={() => setDossierTab('lifecycle')}
                  className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${dossierTab === 'lifecycle' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                 >
                    <div className="flex items-center justify-center gap-3">
                       <Layers className="w-4 h-4" /> Sequence Shards
                    </div>
                 </button>
                 <button 
                  onClick={() => setDossierTab('live_inflow')}
                  className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${dossierTab === 'live_inflow' ? 'border-blue-500 text-white bg-blue-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                 >
                    <div className="flex items-center justify-center gap-3">
                       <Zap className="w-4 h-4" /> Live Inflow (IoT)
                    </div>
                 </button>
                 <button 
                  onClick={() => setDossierTab('twin')}
                  className={`flex-1 py-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all border-b-4 ${dossierTab === 'twin' ? 'border-emerald-500 text-white bg-emerald-500/5' : 'border-transparent text-slate-500 hover:text-white'}`}
                 >
                    <div className="flex items-center justify-center gap-3">
                       <Sparkles className="w-4 h-4" /> Digital Twin
                    </div>
                 </button>
              </div>

              <div className="flex-1 overflow-hidden">
                 {dossierTab === 'lifecycle' && (
                   <div className="h-full overflow-y-auto p-10 md:p-14 custom-scrollbar flex flex-col lg:flex-row gap-14">
                      <div className="lg:w-7/12 space-y-12">
                         <div className="space-y-8 relative py-4">
                            <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-white/5"></div>
                            
                            {/* Static Baseline Steps */}
                            {[
                               { stage: 'Genesis Ingest', time: selectedDossier.timestamp, desc: 'Initial registry node initialized by steward ESIN.', status: 'SIGNED', icon: Database, color: 'text-blue-400' },
                               { stage: 'Physical Audit', time: '1d ago', desc: 'EnvirosAgro field team performed site inspection and verified biometrics.', status: selectedDossier.auditStatus.toUpperCase(), icon: ShieldCheck, color: selectedDossier.isAuthentic ? 'text-emerald-400' : 'text-amber-400' },
                            ].map((step, i) => (
                               <div key={i} className="flex gap-8 relative z-10 group">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all bg-[#050706] border-white/10 text-white group-hover:border-emerald-500/40`}>
                                     <step.icon className={`w-6 h-6 ${step.color}`} />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                     <div className="flex justify-between items-center">
                                        <h5 className="text-lg font-black text-white uppercase tracking-tight italic">{step.stage}</h5>
                                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded border ${
                                           step.status === 'VERIFIED' || step.status === 'SIGNED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>{step.status}</span>
                                     </div>
                                     <p className="text-xs text-slate-500 font-medium italic">"{step.desc}"</p>
                                     <p className="text-[9px] text-slate-700 font-mono font-black uppercase tracking-widest">{step.time}</p>
                                  </div>
                               </div>
                            ))}

                            {/* Dynamic Task Shards */}
                            {(selectedDossier.tasks || []).map((taskId, i) => {
                               const task = INDUSTRIAL_TASK_POOL.find(t => t.id === taskId) || { title: 'Unknown Task', thrust: 'General', duration: 'N/A' };
                               return (
                                 <div key={taskId} className="flex gap-8 relative z-10 group animate-in slide-in-from-left duration-500">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all bg-indigo-900/10 border-indigo-500/20 group-hover:border-indigo-400">
                                       <Wrench className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                       <div className="flex justify-between items-center">
                                          <h5 className="text-lg font-black text-white uppercase tracking-tight italic">{task.title}</h5>
                                          <span className="text-[8px] font-black uppercase px-2 py-1 rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">INDUSTRIAL_TASK</span>
                                       </div>
                                       <p className="text-xs text-slate-500 font-medium italic">"{task.thrust} Thrust shard processing cycle."</p>
                                       <p className="text-[9px] text-indigo-500/60 font-mono font-black uppercase tracking-widest">DURATION: {task.duration} // SYNC_ACTIVE</p>
                                    </div>
                                 </div>
                               );
                            })}

                            <div className="flex gap-8 relative z-10 opacity-40 grayscale">
                               <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 bg-black border-white/5 text-slate-800">
                                  <Lock className="w-6 h-6" />
                               </div>
                               <div className="flex-1 space-y-2">
                                  <h5 className="text-lg font-black text-slate-700 uppercase tracking-tight italic">Market Release Shard</h5>
                                  <p className="text-xs text-slate-800 italic">"Awaiting final quality batch release for commercial sharding."</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="lg:w-5/12 space-y-10">
                         <div className="glass-card p-10 rounded-[48px] bg-emerald-600/5 border border-emerald-500/20 space-y-8 relative overflow-hidden group/trace">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/trace:scale-110 transition-transform duration-[10s]"><ClipboardList size={300} className="text-emerald-400" /></div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl"><Monitor size={24} className="text-white" /></div>
                               <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Traceability <span className="text-emerald-400">Oracle</span></h4>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-emerald-500/40 pl-6 relative z-10">
                               "Industrial task sharding increases m-constant stability by 12% per verified sequence. Current processing reliability: <span className="text-emerald-400 font-black">STABLE</span>."
                            </p>
                            <div className="pt-4 border-t border-white/5 relative z-10">
                               <div className="flex justify-between items-center px-2">
                                  <span className="text-[10px] font-black text-slate-600 uppercase">Sequence Integrity</span>
                                  <span className="text-xl font-mono font-black text-emerald-400">99.8%</span>
                               </div>
                            </div>
                         </div>

                         <div className="p-8 glass-card rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-6">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                               <Target size={14} /> Industrial Metrics
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center">
                                  <p className="text-[8px] text-slate-500 uppercase font-black">C(a) Index</p>
                                  <p className="text-2xl font-mono font-black text-white">1.84</p>
                               </div>
                               <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center">
                                  <p className="text-[8px] text-slate-500 uppercase font-black">m-Resilience</p>
                                  <p className="text-2xl font-mono font-black text-emerald-400">1.42x</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {dossierTab === 'live_inflow' && (
                   <div className="h-full flex flex-col lg:flex-row animate-in fade-in duration-500 overflow-hidden bg-black/40">
                      <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar-terminal space-y-8 bg-[#050706]">
                         <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Terminal size={24} /></div>
                               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">IoT <span className="text-blue-400">Telemetry Stream</span></h3>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                               <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">INGEST_ACTIVE</span>
                            </div>
                         </div>

                         <div className="space-y-4 font-mono text-[11px]">
                            {ingestLogs.map((log) => (
                               <div key={log.id} className="flex gap-8 p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group rounded-xl">
                                  <span className="text-slate-700 w-24 shrink-0 font-bold">[{log.timestamp}]</span>
                                  <span className="text-blue-400 w-8 shrink-0">#{log.sequence}</span>
                                  <div className="flex-1 space-y-2">
                                     <span className="text-slate-300 block font-bold uppercase tracking-tight">{log.event}</span>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-[9px] h-fit font-black tracking-widest shrink-0 border ${
                                     log.status === 'VERIFIED' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse'
                                  }`}>{log.status}</span>
                               </div>
                            ))}
                            <div ref={logEndRef} />
                         </div>
                      </div>

                      <div className="w-full lg:w-[450px] p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-10 border-l border-white/5 bg-black/60">
                         <div className="space-y-6">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                               <SmartphoneNfc className="w-5 h-5 text-blue-400" /> Linked Nodes
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                               {(selectedDossier.telemetryNodes || []).length === 0 ? (
                                 <div className="py-12 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <Wifi size={32} className="text-slate-600" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Physical Nodes Linked</p>
                                    {user.esin === selectedDossier.stewardEsin && (
                                      <button 
                                        onClick={() => setShowLinkModal('node')}
                                        className="text-blue-400 font-bold text-[9px] uppercase underline underline-offset-4"
                                      >
                                         INITIALIZE HANDSHAKE
                                      </button>
                                    )}
                                 </div>
                               ) : (
                                 (selectedDossier.telemetryNodes || []).map(nodeId => {
                                    const node = hardwareResources.find(r => r.id === nodeId);
                                    return (
                                       <div key={nodeId} className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-[32px] flex justify-between items-center animate-in zoom-in">
                                          <div className="flex items-center gap-4">
                                             <Smartphone size={20} className="text-blue-400" />
                                             <div className="text-left">
                                                <p className="text-sm font-black text-white uppercase italic leading-none">{node?.name || 'IoT Sensor P4'}</p>
                                                <p className="text-[8px] text-slate-500 font-mono mt-2">{nodeId}</p>
                                             </div>
                                          </div>
                                          <ShieldCheck size={18} className="text-emerald-400" />
                                       </div>
                                    );
                                 })
                               )}
                            </div>
                         </div>

                         <div className="p-8 glass-card rounded-[40px] border border-blue-500/10 bg-blue-500/5 space-y-6">
                            <div className="flex items-center gap-3">
                               <Activity className="w-5 h-5 text-blue-400" />
                               <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Flow Index</h4>
                            </div>
                            <div className="flex items-end gap-1.5 h-16 justify-center">
                               {[...Array(16)].map((_, i) => (
                                 <div key={i} className="flex-1 bg-blue-500/40 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                               ))}
                            </div>
                            <p className="text-[10px] text-slate-500 italic text-center">"Telemetry flow stabilized at 1.2 GB/y bandwidth sharding."</p>
                         </div>

                         {user.esin === selectedDossier.stewardEsin && (
                           <button 
                             onClick={() => setShowLinkModal('node')}
                             className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                           >
                              <Link2 size={16} /> Link New Hardware Node
                           </button>
                         )}
                      </div>
                   </div>
                 )}

                 {dossierTab === 'twin' && (
                   <div className="h-full flex flex-col lg:flex-row animate-in fade-in zoom-in duration-500 overflow-hidden bg-black/40">
                      <div className="flex-1 relative flex items-center justify-center overflow-hidden border-r border-white/5 min-h-[400px]">
                         <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                         
                         <div className="relative w-96 h-96 flex items-center justify-center">
                            <div className={`absolute w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-[0_0_100px_current] transition-all duration-[2s] ${selectedDossier.isAuthentic ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'}`}>
                               <Waves className="w-16 h-16 animate-pulse" />
                               {!selectedDossier.isAuthentic && (
                                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap bg-amber-500/90 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                                    <ShieldAlert size={14} /> Physical Verification Pending
                                 </div>
                               )}
                            </div>

                            {orbitalParticles.map((p) => (
                              <div 
                                key={p.id}
                                className="absolute"
                                style={{
                                  width: `${p.radius * 2}px`,
                                  height: `${p.radius * 2}px`,
                                  animation: `spin ${p.duration}s linear infinite`,
                                  animationDelay: `${p.delay}s`
                                }}
                              >
                                <div 
                                  className={`absolute rounded-lg border flex items-center justify-center shadow-lg transition-colors ${selectedDossier.isAuthentic ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}
                                  style={{
                                    width: `${p.size}px`,
                                    height: `${p.size}px`,
                                    top: '0',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                  }}
                                >
                                  {p.id % 3 === 0 ? <ThumbsUp size={p.size/2} className="text-emerald-500" /> : 
                                   p.id % 3 === 1 ? <Database size={p.size/2} className="text-blue-500" /> : 
                                   <Heart size={p.size/2} className="text-rose-500" />}
                                </div>
                              </div>
                            ))}

                            <div className="absolute w-[600px] h-[600px] border border-white/[0.02] rounded-full"></div>
                            <div className="absolute w-[400px] h-[400px] border border-white/[0.03] rounded-full"></div>
                            <div className="absolute w-[200px] h-[200px] border border-white/[0.05] rounded-full"></div>
                         </div>

                         <div className="absolute top-10 left-10 p-6 glass-card rounded-[32px] border-emerald-500/20 bg-black/60 space-y-4">
                            <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                               <Signal className="w-3 h-3" /> Live Shard Pulse
                            </h5>
                            <div className="h-1.5 w-48 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 animate-pulse w-[92%]"></div>
                            </div>
                            <p className="text-[9px] text-slate-500 font-mono">RESONANCE_FREQ: 1.42x_STABLE</p>
                         </div>

                         <div className="absolute bottom-10 right-10 p-6 glass-card rounded-[32px] border-indigo-500/20 bg-black/60 text-right space-y-4">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-end gap-2">
                               Interaction Hub <Smartphone className="w-3 h-3" />
                            </h5>
                            <p className="text-2xl font-mono font-black text-white">{selectedDossier.votes} SHARDS</p>
                            <p className="text-[9px] text-slate-600 font-black uppercase">Consensus Established</p>
                         </div>
                      </div>

                      <div className="w-full lg:w-[450px] p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-10">
                         <div className="space-y-6">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                               <Activity className="w-5 h-5 text-emerald-400" /> Sentiment Ledger
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                               {[
                                 { label: 'Network Trust', val: '94%', icon: ShieldCheck, col: 'text-emerald-400' },
                                 { label: 'Quality Vouch', val: '8.2/10', icon: Star, col: 'text-amber-500' },
                                 { label: 'Social Vitality', val: 'HIGH', icon: Heart, col: 'text-rose-400' },
                               ].map((m, i) => (
                                 <div key={i} className="p-6 bg-white/[0.02] border border-white/10 rounded-3xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                       <m.icon className={`w-5 h-5 ${m.col}`} />
                                       <span className="text-xs font-black text-slate-400 uppercase">{m.label}</span>
                                    </div>
                                    <span className="text-xl font-mono font-black text-white">{m.val}</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-6 pt-6 border-t border-white/5">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                               <MessageSquare className="w-5 h-5 text-indigo-400" /> Interaction Feed
                            </h4>
                            <div className="space-y-4">
                               {[
                                 { user: 'BANTU_STWD', text: 'Verified m-constant stability in local node.', time: '12m ago', type: 'Vouch' },
                                 { user: 'ECO_AUDIT_NY', text: 'Spectral signature matches registry A+ tier.', time: '2h ago', type: 'Audit' },
                                 { user: 'VITAL_FARM_04', text: 'Shard interaction reward released.', time: '5h ago', type: 'Credit' },
                               ].map((log, i) => (
                                 <div key={i} className="p-6 bg-black rounded-3xl border border-white/5 space-y-3 group hover:border-indigo-500/20 transition-all">
                                    <div className="flex justify-between items-center">
                                       <span className="text-[10px] font-black text-indigo-400 uppercase">{log.user}</span>
                                       <span className="text-[8px] text-slate-600 font-mono font-bold uppercase">{log.type}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic">"{log.text}"</p>
                                    <p className="text-[8px] text-slate-700 font-black uppercase text-right">{log.time}</p>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-8 glass-card rounded-[40px] border-emerald-500/10 bg-emerald-500/5 text-center space-y-4">
                            <Bot className="w-8 h-8 text-emerald-400 mx-auto" />
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">
                               "Digital Twin interactions are audited by the Consumer Sentiment Oracle to ensure verified feedback loops."
                            </p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                 <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">Node Link: 0x881_DIAG_EOS_FINAL</p>
                 <button className="text-emerald-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    {dossierTab === 'twin' ? 'Sync Twin Telemetry' : 'Request Data Shard'} <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Initialize Product Shard Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowAddProduct(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12 flex flex-col min-h-[600px]">
                 <button onClick={() => setShowAddProduct(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 {auditStep === 'form' && (
                    <div className="animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6 mb-10">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                             <Package className="w-12 h-12 text-emerald-400" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-emerald-400">Processing</span></h3>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Register a raw product or industrial tool for live network sharding.</p>
                       </div>

                       <form onSubmit={handleAddProduct} className="space-y-10">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Product Designation</label>
                             <input 
                               type="text" 
                               required 
                               value={newProductName}
                               onChange={e => setNewProductName(e.target.value)}
                               placeholder="e.g. Maize Shards, Organic Feed..." 
                               className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800" 
                             />
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Category Anchor</label>
                             <div className="grid grid-cols-3 gap-3">
                                {['Produce', 'Manufactured', 'Input'].map(cat => (
                                   <button 
                                      key={cat} 
                                      type="button"
                                      onClick={() => setNewProductCategory(cat as any)}
                                      className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${newProductCategory === cat ? 'bg-emerald-600 border-white text-black shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                   >
                                      {cat}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[40px] flex items-center gap-6">
                             <ShieldAlert className="w-10 h-10 text-amber-500 shrink-0" />
                             <p className="text-[10px] text-amber-200/50 font-bold uppercase tracking-widest leading-relaxed text-left">
                                AUDIT_REQ: Newly initialized products require a Physical Field Audit before being marked 'Authentic'.
                             </p>
                          </div>

                          <button type="submit" disabled={isSubmitting || !newProductName} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                             {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <PlusCircle className="w-6 h-6" />}
                             {isSubmitting ? "COMMITING SHARD..." : "AUTHORIZE LIVE REGISTRY"}
                          </button>
                       </form>
                    </div>
                 )}

                 {auditStep === 'audit_pending' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <div className="w-48 h-48 rounded-full border-8 border-amber-500/10 flex items-center justify-center shadow-2xl">
                             <HardHat className="w-20 h-20 text-amber-500 animate-bounce" />
                          </div>
                          <div className="absolute inset-[-10px] border-4 border-amber-500/20 rounded-full animate-ping"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic text-center">Physical <span className="text-amber-500 text-center">Verification Pending</span></h3>
                          <p className="text-slate-400 text-lg font-medium italic max-sm:text-sm max-w-sm mx-auto leading-relaxed">"Product initialized. EnvirosAgro team has been dispatched for a site audit to verify authenticity."</p>
                       </div>
                       <div className="p-6 bg-white/5 border border-white/10 rounded-3xl w-full max-sm:max-w-sm">
                          <div className="flex items-center gap-4 text-left">
                             <Clock className="w-6 h-6 text-amber-400" />
                             <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Audit Window</p>
                                <p className="text-sm font-bold text-white uppercase tracking-widest">24 - 48 Hours</p>
                             </div>
                          </div>
                       </div>
                       <button onClick={() => setShowAddProduct(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl">Return to Terminal</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* LINK SHARD MODAL (Tasks or IoT Nodes) */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowLinkModal(null)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card rounded-[56px] border border-white/10 bg-[#050706] shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[80vh]">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${showLinkModal === 'task' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-blue-600/20 text-blue-400'}`}>
                       {showLinkModal === 'task' ? <Wrench size={24} /> : <SmartphoneNfc size={24} />}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Link <span className={showLinkModal === 'task' ? 'text-indigo-400' : 'text-blue-400'}>{showLinkModal === 'task' ? 'Industrial Task' : 'IoT Node'}</span></h3>
                 </div>
                 <button onClick={() => setShowLinkModal(null)} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                 {showLinkModal === 'task' ? (
                   <div className="space-y-4">
                      {INDUSTRIAL_TASK_POOL.map(task => (
                        <button 
                          key={task.id}
                          onClick={() => handleLinkTask(task.id)}
                          className="w-full p-6 bg-black border border-white/10 rounded-[32px] hover:border-indigo-500/40 transition-all flex items-center justify-between group active:scale-[0.98]"
                        >
                           <div className="flex items-center gap-6">
                              <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500 group-hover:text-white transition-all"><ClipboardList size={18} /></div>
                              <div className="text-left">
                                 <p className="text-lg font-black text-white uppercase italic leading-none">{task.title}</p>
                                 <p className="text-[9px] text-slate-600 font-mono mt-2">{task.id} // {task.thrust}</p>
                              </div>
                           </div>
                           <PlusCircle className="text-slate-700 group-hover:text-indigo-400" size={20} />
                        </button>
                      ))}
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {hardwareResources.length === 0 ? (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                           <ShieldAlert size={48} className="text-slate-600" />
                           <p className="text-xs font-black uppercase tracking-widest">No Hardware Registry Found</p>
                        </div>
                      ) : (
                        hardwareResources.map(node => (
                           <button 
                             key={node.id}
                             onClick={() => handleLinkNode(node.id)}
                             className="w-full p-6 bg-black border border-white/10 rounded-[32px] hover:border-blue-500/40 transition-all flex items-center justify-between group active:scale-[0.98]"
                           >
                              <div className="flex items-center gap-6">
                                 <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all"><Cpu size={18} /></div>
                                 <div className="text-left">
                                    <p className="text-lg font-black text-white uppercase italic leading-none">{node.name}</p>
                                    <p className="text-[9px] text-slate-600 font-mono mt-2">{node.id} // {node.type}</p>
                                 </div>
                              </div>
                              <Link2 className="text-slate-700 group-hover:text-blue-400" size={20} />
                           </button>
                        ))
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default LiveFarming;