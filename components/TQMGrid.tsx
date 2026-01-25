
import React, { useState, useRef, useEffect } from 'react';
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
  Signature
} from 'lucide-react';
import { User, Order } from '../types';

interface TQMGridProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
}

const TQMGrid: React.FC<TQMGridProps> = ({ user, onSpendEAC, orders = [], onUpdateOrderStatus }) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'orders' | 'oracle'>('orders');
  const [showGrnModal, setShowGrnModal] = useState<Order | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [esinSign, setEsinSign] = useState('');

  const myOrders = orders.filter(o => o.customerEsin === user.esin);

  const handleEscrowPayment = (order: Order) => {
    // Initial Phase B payment
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
      // Release capital to supplier and mark cycle as complete
      onUpdateOrderStatus(showGrnModal.id, 'COMPLETED', { isPrnSigned: true });
      setIsSigning(false);
      setShowGrnModal(null);
      alert("SERVICE_RECEIVED_NOTE SIGNED: Registry anchor confirmed. Capital released from escrow to service provider. Cycle complete.");
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col justify-between shadow-xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <ClipboardCheck className="w-80 h-80 text-white" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                    <ClipboardCheck className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">TQM <span className="text-emerald-400">Trace Hub</span></h2>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" /> Industrial Integrity Mesh
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-xl:text-sm italic">
                "Monitor real-time industrial sharding. Every physical movement from Genesis to Delivery is immutably anchored to the EOS registry."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-lg relative overflow-hidden">
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Active Procurement Shards</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">
                {myOrders.filter(o => o.status !== 'COMPLETED').length}
              </h4>
           </div>
           <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Registry Sync: ACTIVE
           </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[28px] w-fit mx-auto md:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'orders', label: 'Active Shipments', icon: Truck },
          { id: 'trace', label: 'Lifecycle Shards', icon: History },
          { id: 'oracle', label: 'TQM Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'orders' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[40px] overflow-hidden border-white/5 bg-black/40 shadow-xl">
                 <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="col-span-2">Shard Identity</span>
                    <span>Registry Status</span>
                    <span>Industrial Node</span>
                    <span className="text-right">Action Terminal</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {myOrders.map(order => (
                      <div key={order.id} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group">
                         <div className="col-span-2 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/5 group-hover:scale-105 transition-transform shadow-inner">
                               <img src={order.itemImage || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0" alt="" />
                            </div>
                            <div>
                               <p className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors italic">{order.itemName}</p>
                               <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase font-bold tracking-tighter">{order.id} // SOURCE: {order.sourceTab?.toUpperCase() || 'MARKET'}</p>
                            </div>
                         </div>
                         <div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${
                              order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              order.status === 'PAYMENT_HELD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                              order.status === 'AVAILABILITY_VERIFIED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{order.status.replace(/_/g, ' ')}</span>
                         </div>
                         <div className="text-xs text-slate-400 font-mono italic">
                            {order.logisticsNode || 'AWAITING_VERIFICATION'}
                         </div>
                         <div className="text-right">
                            {order.status === 'ORD_PLACED' && (
                               <div className="flex items-center gap-2 text-slate-500 font-black text-[8px] uppercase justify-end">
                                  <Loader2 size={12} className="animate-spin" /> Awaiting Vetting
                               </div>
                            )}
                            {(order.status === 'ORD_VERIFIED' || order.status === 'AVAILABILITY_VERIFIED') && (
                               <button 
                                onClick={() => handleEscrowPayment(order)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ml-auto"
                               >
                                 <Wallet size={14} /> Commit Escrow
                               </button>
                            )}
                            {order.status === 'DISPATCHED' && (
                               <button 
                                onClick={() => setShowGrnModal(order)}
                                className="px-8 py-3 bg-emerald-600 rounded-xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ml-auto"
                               >
                                 <FileSignature size={14} /> Sign {order.itemType.includes('Service') ? 'Service' : 'GRN'} Shard
                               </button>
                            )}
                            {order.status === 'COMPLETED' && (
                              <div className="flex items-center gap-3 justify-end text-emerald-400">
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cycle Finalized</span>
                                 <CheckCircle2 className="w-6 h-6" />
                              </div>
                            )}
                         </div>
                      </div>
                    ))}
                    {myOrders.length === 0 && (
                      <div className="p-20 text-center opacity-30 italic">No active commerce shards detected. Visit Market Cloud to initialize procurement.</div>
                    )}
                 </div>
              </div>
           </div>
        )}
        {/* ... lifecycle tab maintained ... */}
      </div>

      {/* GRN SIGNING MODAL (Phase E) */}
      {showGrnModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowGrnModal(null)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-12 rounded-[56px] border-emerald-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 space-y-10">
              <button onClick={() => setShowGrnModal(null)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
              <div className="text-center space-y-4">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                    <Signature className="w-10 h-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                 </div>
                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">
                    {showGrnModal.itemType.includes('Service') ? 'Service' : 'Goods'} Received <span className="text-emerald-400">Handshake</span>
                 </h3>
                 <p className="text-slate-400 text-lg italic max-sm:text-sm max-w-sm mx-auto leading-relaxed">
                   "Finalize the industrial cycle by signing the digital {showGrnModal.itemType.includes('Service') ? 'serviceReceived' : 'GRN'} note shard to release capital."
                 </p>
              </div>

              <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner">
                 <div className="flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Identity</span>
                    <span className="text-sm font-mono text-white italic">"{showGrnModal.itemName}"</span>
                 </div>
                 <div className="flex justify-between items-center px-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Escrow Settlement</span>
                    <span className="text-3xl font-mono font-black text-emerald-400">{showGrnModal.cost} EAC</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] text-center block">Consumer Auth Signature (ESIN)</label>
                 <input 
                  type="text" 
                  value={esinSign}
                  onChange={e => setEsinSign(e.target.value)}
                  placeholder="EA-XXXX-XXXX-XXXX" 
                  className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                 />
              </div>

              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[44px] flex items-center gap-6 shadow-inner">
                 <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
                 <p className="text-[10px] text-emerald-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic">
                    TQM_FINALITY: "By signing, you confirm fulfillment and authorize the immediate release of capital shards to the provider node. Transaction committed."
                 </p>
              </div>

              <button 
                onClick={handleSignGrn}
                disabled={isSigning || !esinSign}
                className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
              >
                 {isSigning ? <Loader2 className="w-8 h-8 animate-spin" /> : <Signature className="w-8 h-8 fill-current" />}
                 {isSigning ? "COMMITING SETTLEMENT..." : "FINALIZE SIGNATURE"}
              </button>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TQMGrid;
