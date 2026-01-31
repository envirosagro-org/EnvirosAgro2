import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ClipboardCheck, 
  History, 
  Search, 
  ShieldCheck, 
  Activity, 
  FlaskConical, 
  Factory, 
  Loader2, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Bot, 
  Sparkles, 
  MapPin, 
  Package, 
  Truck, 
  Download,
  Binary,
  Microscope,
  Award,
  ChevronLeft,
  ArrowRight,
  Monitor,
  Shield,
  SearchCode,
  Link2,
  Coins,
  Fingerprint,
  Terminal,
  BadgeCheck,
  FileSearch,
  Maximize2,
  Database,
  Stamp,
  FileSignature,
  Wallet,
  Scale,
  Signature,
  Workflow,
  Cpu,
  SmartphoneNfc,
  Wrench,
  Layers,
  LayoutGrid,
  ShoppingBag,
  Radio,
  Target,
  FileText,
  Eye,
  Settings,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Hash,
  Share2,
  RefreshCw,
  Box,
  Binary as BinaryIcon
} from 'lucide-react';
import { User, Order, LiveAgroProduct, ViewState } from '../types';
import { auditProductQuality } from '../services/geminiService';

interface TQMGridProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  liveProducts?: LiveAgroProduct[];
  onNavigate: (view: ViewState) => void;
}

const TQMGrid: React.FC<TQMGridProps> = ({ user, onSpendEAC, orders = [], onUpdateOrderStatus, liveProducts = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'trace' | 'oracle'>('orders');
  const [showGrnModal, setShowGrnModal] = useState<Order | null>(null);
  const [showShardInspector, setShowShardInspector] = useState<Order | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Oracle States
  const [isScanning, setIsScanning] = useState(false);
  const [oracleTarget, setOracleTarget] = useState<Order | null>(null);
  const [oracleReport, setOracleReport] = useState<string | null>(null);

  const myOrders = useMemo(() => orders.filter(o => o.customerEsin === user.esin), [orders, user.esin]);
  
  const filteredOrders = useMemo(() => 
    myOrders.filter(o => o.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [myOrders, searchTerm]
  );

  const handleEscrowPayment = (order: Order) => {
    if (onSpendEAC(order.cost, `PROCUREMENT_ESCROW_COMMITMENT_${order.id}`)) {
       onUpdateOrderStatus(order.id, 'PAYMENT_HELD');
    }
  };

  const handleSignGrn = () => {
    if (!showGrnModal) return;
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      onUpdateOrderStatus(showGrnModal.id, 'COMPLETED', { 
        isPrnSigned: true,
        qualityGrade: ['A+', 'A', 'B+'][Math.floor(Math.random() * 3)]
      });
      setIsSigning(false);
      setShowGrnModal(null);
    }, 2500);
  };

  const invokeIntegritySweep = async (order: Order) => {
    setOracleTarget(order);
    setActiveTab('oracle');
    setIsScanning(true);
    setOracleReport(null);
    
    try {
      // Mock logs for the audit
      const mockLogs = [
        { stage: 'Genesis', status: 'Verified', hash: order.trackingHash },
        { stage: 'Logistics', node: order.logisticsNode || 'Pending', status: order.status },
        { stage: 'Financial', type: 'Escrow', amount: order.cost }
      ];
      
      const res = await auditProductQuality(order.id, mockLogs);
      setOracleReport(res.text);
    } catch (e) {
      setOracleReport("Oracle synchronization error. Manual physical audit recommended for shard integrity.");
    } finally {
      setIsScanning(false);
    }
  };

  const getLiveMatch = (order: Order) => {
    return liveProducts.find(p => p.productType.toLowerCase() === order.itemName.toLowerCase());
  };

  const THREAD_NODES = [
    { label: 'GENESIS', d: 'MARKET INGEST', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/40' },
    { label: 'ESCROW', d: 'CAPITAL SHARDING', icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/40' },
    { label: 'INFLOW', d: 'INDUSTRIAL INGEST', icon: Factory, color: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/40' },
    { label: 'TELEMETRY', d: 'IOT VERIFICATION', icon: Radio, color: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/40' },
    { label: 'AUDIT', d: 'SIGMA TQM CHECK', icon: Microscope, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
    { label: 'SETTLEMENT', d: 'LEDGER ANCHOR', icon: Stamp, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      
      {/* Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
              <ClipboardCheck className="w-[500px] h-[500px] text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 md:w-20 h-16 md:h-20 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
                    <ClipboardCheck className="w-8 md:w-10 h-8 md:h-10 text-white" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-500/30">TQM_CORE_V6</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TQM <span className="text-emerald-400">Trace Hub</span></h2>
                 </div>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl italic opacity-80 group-hover:opacity-100 transition-opacity">
                "Real-time industrial sharding. Map every physical movement from Genesis to Ledger finality with absolute cryptographic transparency."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-8 shadow-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em] mb-2 italic">NETWORK_CONFIDENCE</p>
              <h4 className="text-[100px] font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl">99<span className="text-3xl text-emerald-500 font-sans italic">.9%</span></h4>
           </div>
           <div className="flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full relative z-10 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Consensus Sync</span>
           </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-4">
          {[
            { id: 'orders', label: 'SHIPMENT PIPELINE', icon: Truck },
            { id: 'trace', label: 'INTEGRATED LIFECYCLE', icon: Workflow },
            { id: 'oracle', label: 'INTEGRITY ORACLE', icon: Bot },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative group w-full md:w-96 shrink-0">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
           <input 
             type="text" 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             placeholder="Audit Registry Shards..." 
             className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-inner"
           />
        </div>
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'orders' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                    <Monitor size={80} className="text-slate-600 animate-pulse" />
                    <p className="text-2xl font-black uppercase tracking-[0.5em]">No active procurement signals detected.</p>
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const liveMatch = getLiveMatch(order);
                    return (
                      <div key={order.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col shadow-3xl relative overflow-hidden active:scale-[0.99] duration-500">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[10s]"><Package size={300} /></div>
                         
                         <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="flex items-center gap-8">
                               <div className="w-20 h-20 rounded-[28px] overflow-hidden border-2 border-white/10 group-hover:rotate-3 group-hover:scale-105 transition-all shadow-2xl bg-slate-900">
                                  <img src={order.itemImage || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0" alt="" />
                               </div>
                               <div className="space-y-1">
                                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors">{order.itemName}</h4>
                                  <div className="flex items-center gap-3 mt-3">
                                     <button 
                                      onClick={() => setShowShardInspector(order)}
                                      className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2 hover:text-indigo-400 transition-colors"
                                     >
                                        <Hash size={12} className="text-indigo-400" /> SHARD: {order.id}
                                     </button>
                                  </div>
                               </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                               <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                 order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                 order.status === 'PAYMENT_HELD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                                 order.status === 'DISPATCHED' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' :
                                 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                               }`}>{order.status.replace(/_/g, ' ')}</span>
                               {(order as any).qualityGrade && (
                                 <span className="text-[10px] font-mono font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">GRADE: {(order as any).qualityGrade}</span>
                               )}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                            <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 space-y-6 shadow-inner group/live">
                               <div className="flex justify-between items-center px-2">
                                  <div className="flex items-center gap-3">
                                     <Monitor size={14} className="text-emerald-400" />
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inflow Node</p>
                                  </div>
                                  {liveMatch ? (
                                    <div className="flex items-center gap-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                       <span className="text-[9px] font-black text-emerald-400 uppercase">SYNCED</span>
                                    </div>
                                  ) : (
                                    <span className="text-[9px] font-black text-slate-700 uppercase">IDLE</span>
                                  )}
                               </div>
                               {liveMatch ? (
                                  <div className="space-y-4">
                                     <div className="flex justify-between text-[10px] font-mono font-bold text-white uppercase px-2">
                                        <span>Stage: {liveMatch.stage.replace('_', ' ')}</span>
                                        <span>{liveMatch.progress}%</span>
                                     </div>
                                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${liveMatch.progress}%` }}></div>
                                     </div>
                                  </div>
                               ) : (
                                  <p className="text-[10px] text-slate-700 italic px-2">"Awaiting industrial ingest for live telemetry synchronization."</p>
                                )}
                            </div>

                            <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 space-y-6 shadow-inner">
                               <div className="flex items-center gap-3 px-2">
                                  <Truck size={14} className="text-blue-400" />
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logistics Shard</p>
                               </div>
                               <div className="space-y-4">
                                  <div className="flex justify-between items-center px-2">
                                     <span className="text-[10px] font-black text-slate-600 uppercase">Relay Node</span>
                                     <span className="text-xs font-black text-white italic truncate max-w-[150px]">{order.logisticsNode || 'PENDING'}</span>
                                  </div>
                                  <button 
                                    onClick={() => invokeIntegritySweep(order)}
                                    className="w-full py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-[9px] font-black uppercase text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all"
                                  >
                                    Invoke Integrity Oracle
                                  </button>
                               </div>
                            </div>
                         </div>

                         <div className="mt-auto pt-8 border-t border-white/5 flex gap-4 relative z-10">
                            {order.status === 'ORD_PLACED' && (
                               <div className="flex-1 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-center gap-3">
                                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Awaiting Provider Handshake</span>
                               </div>
                            )}
                            {(order.status === 'ORD_VERIFIED' || order.status === 'AVAILABILITY_VERIFIED') && (
                               <button 
                                onClick={() => handleEscrowPayment(order)}
                                className="flex-1 py-6 bg-blue-600 hover:bg-blue-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4"
                               >
                                 <Wallet size={20} /> Commit Escrow Shard
                               </button>
                            )}
                            {order.status === 'PAYMENT_HELD' && (
                               <div className="flex-1 p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center gap-4">
                                  <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                                  <div className="text-left">
                                     <p className="text-sm font-black text-indigo-400 uppercase leading-none">CAPITAL ESCROWED</p>
                                     <p className="text-[8px] text-indigo-400/60 font-black uppercase tracking-widest mt-2">Awaiting Provider Dispatch Commit</p>
                                  </div>
                               </div>
                            )}
                            {order.status === 'DISPATCHED' && (
                               <button 
                                onClick={() => setShowGrnModal(order)}
                                className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
                               >
                                 <FileSignature size={20} /> Sign Delivery Shard
                               </button>
                            )}
                            {order.status === 'COMPLETED' && (
                              <div className="flex-1 py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center gap-4 shadow-inner">
                                 <BadgeCheck size={24} className="text-emerald-400" />
                                 <div className="text-left">
                                    <p className="text-lg font-black text-emerald-400 uppercase leading-none italic">Cycle Finalized</p>
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-2">Anchored: {new Date(order.timestamp).toLocaleDateString()}</p>
                                 </div>
                                 <button className="p-3 bg-white/5 rounded-xl ml-auto text-slate-500 hover:text-white transition-all"><Download size={16} /></button>
                              </div>
                            )}
                         </div>
                      </div>
                    );
                  })
                )}
              </div>
           </div>
        )}

        {activeTab === 'trace' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                   <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl flex flex-wrap justify-center items-center gap-4 m-0 leading-none">
                     UNIFIED <span className="text-emerald-400">REGISTRY THREAD</span>
                   </h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Mapping the industrial logic from Genesis Ingest to Ledger finality."</p>
                </div>

                <div className="relative pt-10 pb-20">
                   <div className="overflow-x-auto scrollbar-hide pb-10 cursor-grab active:cursor-grabbing" ref={scrollContainerRef}>
                      <div className="relative min-w-[1200px] px-20">
                         <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/5 -translate-y-1/2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full shadow-[0_0_30px_rgba(16,185,129,0.5)]"></div>
                         </div>

                         <div className="relative flex justify-between gap-12">
                            {THREAD_NODES.map((node, i) => (
                              <div key={i} className="flex flex-col items-center gap-8 relative z-10 group">
                                 <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${node.bg} ${node.border} shadow-3xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 ring-[12px] ring-black/60 relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                                    <node.icon className={`w-14 h-14 ${node.color} group-hover:animate-pulse relative z-10`} />
                                 </div>
                                 <div className="text-center space-y-2">
                                    <h5 className={`text-sm font-black uppercase tracking-[0.4em] ${node.color} italic`}>{node.label}</h5>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{node.d}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                   <div className="glass-card p-12 rounded-[56px] border border-indigo-500/20 bg-black/60 shadow-3xl space-y-10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Wrench size={300} /></div>
                      <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                         <div className="p-4 bg-indigo-600 rounded-[28px] shadow-3xl border border-white/10 group-hover:rotate-12 transition-transform">
                            <Activity size={32} className="text-white" />
                         </div>
                         <h4 className="text-4xl font-black text-white uppercase italic tracking-widest m-0 leading-none">PROMOTION <span className="text-indigo-400">LOGIC</span></h4>
                      </div>
                      <div className="relative z-10 border-l-[6px] border-l-indigo-600/50 pl-12 py-4">
                        <p className="text-slate-300 text-2xl md:text-3xl leading-relaxed italic font-medium">
                           "Every sharded asset is promoted through the registry thread only upon successful ZK-Proof verification. Finality requires both consumer and provider node handshake."
                        </p>
                      </div>
                   </div>

                   <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-8 flex flex-col shadow-3xl relative overflow-hidden">
                      <div className="flex items-center gap-4 px-4 border-b border-white/5 pb-8">
                        <Monitor size={20} className="text-emerald-400" />
                        <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Active Audit Streams</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                         {filteredOrders.slice(0, 4).map((order) => (
                            <div key={order.id} className="p-8 bg-black/80 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-emerald-500/20 transition-all shadow-inner">
                               <div className="flex items-center gap-6">
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-emerald-600/10 transition-colors shadow-inner"><Cpu size={24} className="text-emerald-400" /></div>
                                  <div className="text-left">
                                     <p className="text-base font-black text-white uppercase italic leading-none">{order.itemName}</p>
                                     <p className="text-[10px] text-slate-600 font-mono font-bold uppercase mt-3 tracking-widest">STAGE: {order.status}</p>
                                  </div>
                               </div>
                               <button 
                                onClick={() => setActiveTab('orders')}
                                className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
                               >
                                  <ArrowRight size={16} />
                               </button>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700 text-center">
              <div className="p-10 md:p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-[10s]"><Bot size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-8 w-full">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Integrity <span className="text-indigo-400">Oracle</span></h3>
                       <p className="text-slate-500 text-2xl font-medium mt-6 italic max-w-2xl mx-auto leading-relaxed">AI-powered risk auditing and integrity sharding for the supply chain registry.</p>
                    </div>
                 </div>

                 <div className="w-full max-w-3xl relative z-10 space-y-10">
                    {!oracleReport && !isScanning ? (
                      <div className="py-20 flex flex-col items-center gap-8 opacity-40">
                         <SearchCode size={120} className="text-slate-600" />
                         <p className="text-xl font-black uppercase tracking-[0.4em]">Oracle Standby</p>
                         <p className="text-sm italic">Invoke the oracle from the Shipment Pipeline to audit specific shards.</p>
                      </div>
                    ) : isScanning ? (
                      <div className="py-20 flex flex-col items-center gap-12">
                         <div className="relative">
                            <Loader2 size={80} className="text-indigo-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Sparkles className="text-indigo-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING INTEGRITY SHARDS...</p>
                            <p className="text-slate-600 font-mono text-xs">TARGET_ID: {oracleTarget?.id}</p>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-10 animate-in fade-in duration-700">
                         <div className="p-10 md:p-14 bg-black/60 rounded-[64px] border border-white/10 shadow-inner group/bubble hover:border-indigo-500/20 transition-all text-left border-l-8 border-l-indigo-600">
                            <div className="flex items-center gap-4 mb-8">
                               <BadgeCheck className="text-emerald-400" />
                               <h4 className="text-xl font-black text-white uppercase italic">Audit Report Shard</h4>
                            </div>
                            <div className="text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium">
                               {oracleReport}
                            </div>
                         </div>
                         <div className="flex justify-center gap-6">
                            <button onClick={() => setOracleReport(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Clear Stream</button>
                            <button className="px-16 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                               <Download size={18} /> Export Audit
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* SHARD INSPECTOR MODAL */}
      {showShardInspector && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowShardInspector(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                       <Database size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-indigo-400">Inspector</span></h3>
                       <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-2">RAW_BLOCKCHAIN_DATA // {showShardInspector.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowShardInspector(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Registry Root</span>
                             <span className="text-white font-mono text-xs">0x882...F42A</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-500 uppercase">ZK_SNARK_AUTH</span>
                             <span className="text-emerald-400 font-mono text-xs italic">VERIFIED</span>
                          </div>
                          <div className="h-px bg-white/5 w-full"></div>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Shard Weight</span>
                             <span className="text-white font-mono text-xs">14.2 KB</span>
                          </div>
                       </div>

                       <div className="p-8 glass-card rounded-[40px] border border-blue-500/20 bg-blue-500/5 space-y-4">
                          <div className="flex items-center gap-3">
                             <Fingerprint size={16} className="text-blue-400" />
                             <span className="text-[10px] font-black text-white uppercase tracking-widest">Cryptographic Seal</span>
                          </div>
                          <p className="text-[10px] font-mono text-blue-300/60 break-all leading-relaxed">
                             {showShardInspector.trackingHash}{btoa(showShardInspector.customerEsin).substring(0, 100)}
                          </p>
                       </div>
                    </div>

                    <div className="p-8 bg-black rounded-[40px] border border-white/10 space-y-6 flex flex-col">
                       <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                          <Terminal size={18} className="text-emerald-400" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Metadata Payload</h4>
                       </div>
                       <div className="flex-1 font-mono text-[11px] text-emerald-400/80 p-6 bg-black/60 rounded-3xl overflow-y-auto custom-scrollbar-terminal">
                          <pre>
{`{
  "shard_id": "${showShardInspector.id}",
  "itemName": "${showShardInspector.itemName}",
  "cost": ${showShardInspector.cost},
  "customer": "${showShardInspector.customerEsin}",
  "supplier": "${showShardInspector.supplierEsin}",
  "status": "${showShardInspector.status}",
  "zk_session": "EOS_882_A",
  "m_constant": 1.42,
  "telemetry": {
    "sync": true,
    "drift": "±0.01",
    "verified_at": "${showShardInspector.timestamp}"
  }
}`}
                          </pre>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-white/5 flex justify-center gap-6">
                 <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Download Shard Raw</button>
                 <button onClick={() => setShowShardInspector(null)} className="px-12 py-5 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl">Close Inspector</button>
              </div>
           </div>
        </div>
      )}

      {/* GRN MODAL maintained... */}
      {showGrnModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowGrnModal(null)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-12 rounded-[64px] border-emerald-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 space-y-10">
              <button onClick={() => setShowGrnModal(null)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all border border-white/5"><X size={24} /></button>
              <div className="text-center space-y-6">
                 <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                    <Signature className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                 </div>
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">
                    Delivery <span className="text-emerald-400">Handshake</span>
                 </h3>
                 <p className="text-slate-400 text-lg italic max-sm:text-sm max-w-sm mx-auto leading-relaxed">
                   "Finalize the industrial cycle by signing the delivery shard to release capital from Escrow."
                 </p>
              </div>

              <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Identity</span>
                    <span className="text-sm font-mono text-white italic">"{showGrnModal.itemName}"</span>
                 </div>
                 <div className="flex justify-between items-center px-4 pt-6 border-t border-white/5">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Escrow Settlement</span>
                    <span className="text-4xl font-mono font-black text-emerald-400">{showGrnModal.cost} EAC</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] text-center block">Consumer Auth Signature (ESIN)</label>
                 <input 
                  type="text" 
                  value={esinSign}
                  onChange={e => setEsinSign(e.target.value)}
                  placeholder="EA-XXXX-XXXX-XXXX" 
                  className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                 />
              </div>

              <button 
                onClick={handleSignGrn}
                disabled={isSigning || !esinSign}
                className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
              >
                 {isSigning ? <Loader2 className="w-8 h-8 animate-spin" /> : <Signature className="w-8 h-8 fill-current" />}
                 {isSigning ? "ANCHORING SETTLEMENT..." : "FINALIZE SIGNATURE"}
              </button>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }

        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default TQMGrid;