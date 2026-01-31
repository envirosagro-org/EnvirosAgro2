import React, { useState, useMemo, useRef } from 'react';
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
  Target
} from 'lucide-react';
import { User, Order, LiveAgroProduct, ViewState } from '../types';

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
  const [isSigning, setIsSigning] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const myOrders = useMemo(() => orders.filter(o => o.customerEsin === user.esin), [orders, user.esin]);
  
  const filteredOrders = useMemo(() => 
    myOrders.filter(o => o.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [myOrders, searchTerm]
  );

  const handleEscrowPayment = (order: Order) => {
    if (onSpendEAC(order.cost, `PROCUREMENT_ESCROW_COMMITMENT_${order.id}`)) {
       onUpdateOrderStatus(order.id, 'PAYMENT_HELD');
       alert("PAYMENT COMMITTED: Capital shard held in Escrow node. Supplier node notified for logistics ingest.");
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
      onUpdateOrderStatus(showGrnModal.id, 'COMPLETED', { isPrnSigned: true });
      setIsSigning(false);
      setShowGrnModal(null);
      alert("SERVICE_RECEIVED_NOTE SIGNED: Registry anchor confirmed. Capital released from escrow to service provider. Cycle complete.");
    }, 2500);
  };

  const getLiveMatch = (order: Order) => {
    return liveProducts.find(p => p.productType.toLowerCase() === order.itemName.toLowerCase());
  };

  const THREAD_NODES = [
    { label: 'GENESIS', d: 'MARKET INGEST', icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/40' },
    { label: 'ESCROW', d: 'CAPITAL SHARDING', icon: Wallet, color: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/40' },
    { label: 'INFLOW', d: 'INDUSTRIAL INGEST', icon: Factory, color: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/40' },
    { label: 'TELEMETRY', d: 'IOT VERIFICATION', icon: Radio, color: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/40' },
    { label: 'AUDIT', d: 'SIGMA TQM CHECK', icon: Microscope, color: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/40' },
    { label: 'SETTLEMENT', d: 'LEDGER ANCHOR', icon: Stamp, color: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/40' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      
      {/* Header HUD - Refined with Screenshot Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
              <ClipboardCheck className="w-[500px] h-[500px] text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-6">
                 <div className="p-5 bg-emerald-600 rounded-[32px] shadow-3xl ring-4 ring-white/10 shrink-0">
                    <ClipboardCheck className="w-12 h-12 text-white" />
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-lg border border-emerald-500/30">TQM SHARD</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TQM <span className="text-emerald-400">Trace Hub</span></h2>
                 </div>
              </div>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic opacity-80 group-hover:opacity-100 transition-opacity">
                "Monitor real-time industrial sharding. Every physical movement from Genesis to Delivery is immutably anchored and synchronized with the Live Processing node."
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
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Consensus Sync</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
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
                    <button onClick={() => onNavigate('economy')} className="px-12 py-5 bg-emerald-600 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-3xl hover:scale-105 transition-all">Go to Market Cloud</button>
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
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                                     <Fingerprint size={12} className="text-indigo-400" /> SHARD: {order.id}
                                  </p>
                               </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                               <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                 order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/20' :
                                 order.status === 'PAYMENT_HELD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/20 animate-pulse' :
                                 order.status === 'DISPATCHED' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20 shadow-indigo-500/20' :
                                 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                               }`}>{order.status.replace(/_/g, ' ')}</span>
                               <p className="text-2xl font-mono font-black text-white leading-none mt-2">{order.cost.toLocaleString()} <span className="text-xs text-emerald-500 italic">EAC</span></p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
                            <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 space-y-6 shadow-inner group/live">
                               <div className="flex justify-between items-center px-2">
                                  <div className="flex items-center gap-3">
                                     <Monitor size={14} className="text-emerald-400" />
                                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Processing</p>
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
                                  <MapPin size={14} className="text-blue-400" />
                                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry Hub</p>
                               </div>
                               <div className="space-y-4">
                                  <div className="flex justify-between items-center px-2">
                                     <span className="text-[10px] font-black text-slate-600 uppercase">Logistic Provider</span>
                                     <span className="text-xs font-black text-white italic truncate max-w-[150px]">{order.logisticsNode || 'Pending Provision'}</span>
                                  </div>
                                  <div className="flex justify-between items-center px-2">
                                     <span className="text-[10px] font-black text-slate-600 uppercase">Tracking Hash</span>
                                     <span className="text-[9px] font-mono font-black text-blue-400 group-hover:text-white transition-colors">{order.trackingHash}</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="mt-auto pt-8 border-t border-white/5 flex gap-4 relative z-10">
                            {order.status === 'ORD_PLACED' && (
                               <div className="flex-1 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-center gap-3">
                                  <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Awaiting Supplier Handshake</span>
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
                                     <p className="text-[8px] text-indigo-400/60 font-black uppercase tracking-widest mt-2">Awaiting Supplier Logistics Commit</p>
                                  </div>
                               </div>
                            )}
                            {order.status === 'DISPATCHED' && (
                               <button 
                                onClick={() => setShowGrnModal(order)}
                                className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
                               >
                                 <FileSignature size={20} /> Sign Settlement Shard
                               </button>
                            )}
                            {order.status === 'COMPLETED' && (
                              <div className="flex-1 py-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center gap-4 shadow-inner">
                                 <BadgeCheck size={24} className="text-emerald-400" />
                                 <div className="text-left">
                                    <p className="text-lg font-black text-emerald-400 uppercase leading-none italic">Cycle Finalized</p>
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-2">Immutable Record Anchored: {new Date(order.timestamp).toLocaleDateString()}</p>
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

        {/* TAB: UNIFIED REGISTRY THREAD - Enhanced for frame fitness with scroll */}
        {activeTab === 'trace' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                   <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl flex flex-wrap justify-center items-center gap-4 m-0 leading-none">
                     UNIFIED <span className="text-emerald-400">REGISTRY THREAD</span>
                   </h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Mapping the promotion logic from Market procurement to Industrial finality."</p>
                </div>

                <div className="relative pt-10 pb-20">
                   {/* Scroll Across Effect Container */}
                   <div className="overflow-x-auto scrollbar-hide pb-10 cursor-grab active:cursor-grabbing" ref={scrollContainerRef}>
                      <div className="relative min-w-[1200px] px-20">
                         {/* Seamless Horizontal Thread Line */}
                         <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/5 -translate-y-1/2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full shadow-[0_0_30px_rgba(16,185,129,0.5)]"></div>
                         </div>

                         <div className="relative flex justify-between gap-12">
                            {THREAD_NODES.map((node, i) => (
                              <div key={i} className="flex flex-col items-center gap-8 relative z-10 group">
                                 {/* Circular Node with High-Fidelity Rendering */}
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

                {/* Promotion Logic Detail Section */}
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
                           "Items in the TQM hub are automatically promoted to the Live Processing node upon Escrow authorization. This link ensures that capital is only released for verified industrial throughput."
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 relative z-10 pt-8">
                         <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-center shadow-inner group-hover:border-indigo-500/20 transition-all">
                            <p className="text-[10px] text-slate-600 font-black uppercase mb-2 tracking-widest">C(A) INDEX VARIANCE</p>
                            <p className="text-4xl font-mono font-black text-white tracking-tighter">±0.04</p>
                         </div>
                         <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-center shadow-inner group-hover:border-emerald-500/20 transition-all">
                            <p className="text-[10px] text-slate-600 font-black uppercase mb-2 tracking-widest">M-CONSTANT DRIFT</p>
                            <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">STABLE</p>
                         </div>
                      </div>
                   </div>

                   <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-8 flex flex-col shadow-3xl relative overflow-hidden">
                      <div className="flex items-center gap-4 px-4 border-b border-white/5 pb-8">
                        <Monitor size={20} className="text-emerald-400" />
                        <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Live Audit Buffer</h4>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                         {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="p-8 bg-black/80 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-emerald-500/20 transition-all shadow-inner">
                               <div className="flex items-center gap-6">
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-emerald-600/10 transition-colors shadow-inner"><Cpu size={24} className="text-emerald-400" /></div>
                                  <div className="text-left">
                                     <p className="text-base font-black text-white uppercase italic leading-none">Telemetry Shard #882_X{i}</p>
                                     <p className="text-[10px] text-slate-600 font-mono font-bold uppercase mt-3 tracking-widest">STATUS: VERIFIED_ZK</p>
                                  </div>
                               </div>
                               <span className="text-xl font-mono text-emerald-400 font-black bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">99.8%</span>
                            </div>
                         ))}
                      </div>
                      <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] text-center shadow-inner relative overflow-hidden group">
                         <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                         <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] relative z-10 flex items-center justify-center gap-5">
                            <ShieldCheck size={24} className="group-hover:scale-110 transition-transform" /> Registry Integrity Locked
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: TQM ORACLE */}
        {activeTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700 text-center">
              <div className="p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-[10s]"><Bot size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-8">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Integrity <span className="text-indigo-400">Oracle</span></h3>
                       <p className="text-slate-500 text-2xl font-medium mt-6 italic max-w-2xl mx-auto leading-relaxed">Analyze the collective truth of your supply chain through high-fidelity industrial consensus.</p>
                    </div>
                 </div>

                 <div className="w-full max-w-2xl relative z-10 space-y-10">
                    <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 shadow-inner group/bubble hover:border-indigo-500/20 transition-all">
                       <p className="text-slate-400 italic text-xl leading-[1.8] font-medium">
                          "Currently auditing Cycle 12 procurement shards. Supply chain resonance is currently <span className="text-emerald-400 font-black">99.9% stable</span>. No drift anomalies detected in the m-constant baseline."
                       </p>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                       <button className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all ring-8 ring-indigo-500/5">
                          RUN MULTI-NODE CONSENSUS SWEEP
                       </button>
                       <p className="text-[11px] text-slate-700 font-black uppercase tracking-[0.6em]">Powered by EOS_CLUSTER_AI_v5.2</p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* GRN SIGNING MODAL */}
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
                    {showGrnModal.itemType.includes('Service') ? 'Service' : 'Goods'} Received <span className="text-emerald-400">Handshake</span>
                 </h3>
                 <p className="text-slate-400 text-lg italic max-sm:text-sm max-w-sm mx-auto leading-relaxed">
                   "Finalize the industrial cycle by signing the digital SRN shard to release capital from Escrow."
                 </p>
              </div>

              <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Shard Identity</span>
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

              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                 <ShieldCheck className="w-12 h-12 text-emerald-400 shrink-0" />
                 <p className="text-[11px] text-emerald-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic leading-loose">
                    TQM_FINALITY: "By signing, you confirm fulfillment and authorize the immediate release of capital shards to the provider node. Transaction committed to permanent ledger."
                 </p>
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

      {/* Floating Bot Helper */}
      <div className="fixed bottom-10 right-10 z-[150] animate-float">
         <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] border-2 border-white/20 relative group cursor-pointer hover:scale-110 transition-transform">
            <Bot size={32} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TQMGrid;