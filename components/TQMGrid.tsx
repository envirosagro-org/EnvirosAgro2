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
import { User, Order, LiveAgroProduct, ViewState, SignalShard } from '../types';
import { auditProductQuality } from '../services/geminiService';

interface TQMGridProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  liveProducts?: LiveAgroProduct[];
  onNavigate: (view: ViewState) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  initialSection?: string | null;
}

const TQMGrid: React.FC<TQMGridProps> = ({ user, onSpendEAC, orders = [], onUpdateOrderStatus, liveProducts = [], onNavigate, onEmitSignal, initialSection }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'trace' | 'oracle'>('orders');
  const [showGrnModal, setShowGrnModal] = useState<Order | null>(null);
  const [showShardInspector, setShowShardInspector] = useState<Order | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Vector Routing Logic
  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

  // Oracle States
  const [isScanning, setIsScanning] = useState(false);
  const [oracleTarget, setOracleTarget] = useState<Order | null>(null);
  const [oracleReport, setOracleReport] = useState<string | null>(null);

  const myOrders = useMemo(() => orders.filter(o => o.customerEsin === user.esin), [orders, user.esin]);
  
  const filteredOrders = useMemo(() => 
    myOrders.filter(o => o.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [myOrders, searchTerm]
  );

  const handleEscrowPayment = async (order: Order) => {
    if (await onSpendEAC(order.cost, `PROCUREMENT_ESCROW_COMMITMENT_${order.id}`)) {
       onUpdateOrderStatus(order.id, 'PAYMENT_HELD');
       
       onEmitSignal({
         type: 'ledger_anchor',
         origin: 'TRACE',
         title: 'ESCROW_COMMITMENT',
         message: `Industrial capital shard ${order.cost} EAC locked in escrow for ${order.itemName}.`,
         priority: 'medium',
         actionIcon: 'Wallet',
         meta: { target: 'tqm', ledgerContext: 'REVENUE' }
       });
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
      const grade = ['A+', 'A', 'B+'][Math.floor(Math.random() * 3)];
      onUpdateOrderStatus(showGrnModal.id, 'COMPLETED', { 
        isPrnSigned: true,
        qualityGrade: grade
      });
      
      onEmitSignal({
        type: 'ledger_anchor',
        origin: 'TRACE',
        title: 'CYCLE_FINALITY_REACHED',
        message: `Steward ${user.name} signed delivery shard for ${showGrnModal.itemName}. Grade: ${grade}.`,
        priority: 'high',
        actionIcon: 'Stamp',
        meta: { target: 'tqm', ledgerContext: 'TRACE' }
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
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
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
                                 order.status === 'AVAILABILITY_VERIFIED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
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
                                        <div className="h-full bg-emerald-500 shadow-[0_0_100px_#10b981]" style={{ width: `${liveMatch.progress}%` }}></div>
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

        {/* Trace Tab listening for initialSection */}
        {activeTab === 'trace' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="max-w-6xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                   <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl flex flex-wrap justify-center items-center gap-4 m-0 leading-none">
                     UNIFIED <span className="text-emerald-400">REGISTRY THREAD</span>
                   </h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Mapping the industrial logic from Genesis Ingest to Ledger finality."</p>
                </div>
                {/* Visual timeline components simplified for this example... */}
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
      `}</style>
    </div>
  );
};

export default TQMGrid;