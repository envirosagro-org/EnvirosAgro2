
import React, { useState } from 'react';
import { 
  Warehouse, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Truck, 
  CheckCircle2, 
  X, 
  Loader2, 
  Database,
  ArrowRight,
  ShieldCheck, 
  Zap, 
  Info,
  ClipboardList,
  ChevronRight,
  Monitor,
  MapPin,
  ClipboardCheck, 
  HardHat, 
  Coins, 
  Terminal, 
  Fingerprint, 
  Download, 
  Bot, 
  Target,
  Stamp,
  ShieldAlert,
  Leaf,
  Scale,
  Clock,
  Building2,
  PackageSearch,
  CheckCircle,
  FileSignature,
  FileCheck,
  Binary,
  RotateCcw,
  History,
  FlaskConical,
  Key,
  Globe,
  Activity,
  Binoculars,
  CalendarCheck,
  Receipt,
  BadgeDollarSign,
  TrendingUp,
  ArrowUpRight,
  Wallet,
  ArrowDownLeft
} from 'lucide-react';
import { User, Order, LogisticProvider, VendorProduct } from '../types';

interface VendorPortalProps {
  user: User;
  // Fix: changed onSpendEAC to return Promise<boolean> to match async implementation in App.tsx
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  vendorProducts: VendorProduct[];
  onRegisterProduct: (product: VendorProduct) => void;
}

const LOGISTIC_PROVIDERS: LogisticProvider[] = [
  { id: 'LP-GRN-01', name: 'Electric Eco-Rail Shard', mResonance: 1.5, sustainabilityScore: 98, costEAC: 120, speed: '48h', status: 'ACTIVE' },
  { id: 'LP-SKY-02', name: 'Solar Drone Relay', mResonance: 1.2, sustainabilityScore: 85, costEAC: 450, speed: '6h', status: 'ACTIVE' },
  { id: 'LP-IND-03', name: 'Traditional Diesel Hub', mResonance: 0.8, sustainabilityScore: 42, costEAC: 85, speed: '24h', status: 'ACTIVE' },
];

type SupplierType = 'REVERSE_RETURN' | 'RAW_MATERIALS' | 'FINISHED_PRODUCTS' | 'SERVICE_PROVIDER';
type RegStep = 'identification' | 'item_ingest' | 'settlement' | 'audit_protocol' | 'success';

const VendorPortal: React.FC<VendorPortalProps> = ({ user, onSpendEAC, orders = [], onUpdateOrderStatus, vendorProducts = [], onRegisterProduct }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shipments' | 'ledger'>('shipments');
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Supplier Registration State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regStep, setRegStep] = useState<RegStep>('identification');
  const [supplierType, setSupplierType] = useState<SupplierType>('RAW_MATERIALS');
  
  // Item Form State
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<'Seed' | 'Input' | 'Tool' | 'Technology' | 'Logistics' | 'Produce' | 'Service'>('Produce');
  const [itemPrice, setItemPrice] = useState('100');
  const [itemDesc, setItemDesc] = useState('');
  const [esinSign, setEsinSign] = useState('');

  const getSettlementFee = () => {
    switch(supplierType) {
      case 'RAW_MATERIALS': return 100;
      case 'FINISHED_PRODUCTS': return 250;
      case 'REVERSE_RETURN': return 150;
      case 'SERVICE_PROVIDER': return 300;
      default: return 100;
    }
  };

  const handleStartRegistration = () => {
    setRegStep('identification');
    setShowRegisterModal(true);
  };

  // Fix: handleAuthorizeSettlement made async and awaits onSpendEAC to resolve Promise<boolean>
  const handleAuthorizeSettlement = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const fee = getSettlementFee();
    if (await onSpendEAC(fee, `SUPPLIER_REGISTRY_SETTLEMENT_${supplierType}`)) {
      setRegStep('audit_protocol');
    }
  };

  const handleFinalizeRegistry = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newProduct: VendorProduct = {
        id: `VPR-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: itemName,
        description: itemDesc,
        price: Number(itemPrice),
        stock: 100,
        category: itemCategory,
        thrust: 'Industry',
        supplierEsin: user.esin,
        supplierName: user.name,
        supplierType: supplierType,
        status: 'AUTHORIZED',
        timestamp: 'Just now'
      };
      
      onRegisterProduct(newProduct);
      setIsProcessing(false);
      setRegStep('success');
    }, 2500);
  };

  const myIncomingOrders = orders.filter(o => o.supplierEsin === user.esin || o.supplierEsin === 'EA-ORG-CORE' || o.supplierEsin === 'EA-TOUR-HUB');
  const completedOrders = myIncomingOrders.filter(o => o.status === 'COMPLETED');
  const totalEarned = completedOrders.reduce((acc, curr) => acc + curr.cost, 0);
  
  const handleVerifyOrder = (order: Order) => {
    setIsVerifying(order.id);
    setTimeout(() => {
      if (order.itemType.includes('Service')) {
         onUpdateOrderStatus(order.id, 'AVAILABILITY_VERIFIED');
      } else {
         onUpdateOrderStatus(order.id, 'ORD_VERIFIED');
      }
      setIsVerifying(null);
    }, 1500);
  };

  const handleExecuteDispatch = (lp: LogisticProvider) => {
    if (!selectedOrderForDispatch) return;
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateOrderStatus(selectedOrderForDispatch.id, 'DISPATCHED', {
        logisticProviderId: lp.id,
        logisticsNode: lp.name,
        logisticCost: lp.costEAC,
        status: 'DISPATCHED'
      });
      setIsProcessing(false);
      setSelectedOrderForDispatch(null);
    }, 2000);
  };

  const handleServiceArrangement = (order: Order) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateOrderStatus(order.id, 'DISPATCHED', {
        status: 'DISPATCHED',
        logisticsNode: 'On-Site Provision'
      });
      setIsProcessing(false);
      alert("ARRANGEMENTS COMMITTED: Service node initialized for delivery. Customer notified via TQM Hub.");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* Header Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-amber-500/20 bg-amber-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Warehouse className="w-96 h-96 text-amber-500" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.3)] ring-4 ring-white/10 shrink-0">
              <Building2 className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-amber-500/20">VENDOR_REGISTRY_NODE_v5</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Supplier <span className="text-amber-500">Command</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                 Provision your agricultural assets to the global grid. Multi-stage industrial vetting ensures 100% authenticity for all network shards.
              </p>
              <button 
                onClick={handleStartRegistration}
                className="px-12 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto md:ml-0"
              >
                <PlusCircle className="w-6 h-6" /> REGISTER AS SUPPLIER
              </button>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-amber-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Registry Revenue</p>
              <h4 className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">{totalEarned.toFixed(0)} <span className="text-sm font-sans">EAC</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Settlement Rate</span>
                 <span className="text-emerald-400">Stable</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[92%] shadow-[0_0_10px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'shipments', label: 'Inbound Orders', icon: ShoppingCart },
          { id: 'inventory', label: 'Asset Management', icon: Package },
          { id: 'ledger', label: 'Revenue Ledger', icon: BadgeDollarSign },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-xl shadow-amber-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'shipments' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[40px] overflow-hidden border-white/5 bg-black/40 shadow-xl">
                 <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="col-span-2">Procurement Asset</span>
                    <span>Lifecycle Status</span>
                    <span>Customer Node</span>
                    <span className="text-right">Industrial Action</span>
                 </div>
                 <div className="divide-y divide-white/5">
                    {myIncomingOrders.map(order => (
                      <div key={order.id} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group">
                         <div className="col-span-2 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/5 group-hover:scale-105 transition-transform shadow-inner">
                               <img src={order.itemImage || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0" alt="" />
                            </div>
                            <div>
                               <p className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-amber-500 transition-colors italic">{order.itemName}</p>
                               <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase font-bold tracking-tighter">{order.id} // SRC: {order.sourceTab?.toUpperCase() || 'MARKET'}</p>
                            </div>
                         </div>
                         <div>
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-tighter ${
                              order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              order.status === 'PAYMENT_HELD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                              order.status === 'AVAILABILITY_VERIFIED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                              order.status === 'DISPATCHED' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{order.status.replace(/_/g, ' ')}</span>
                         </div>
                         <div className="text-xs text-slate-400 font-mono italic">
                            {order.customerEsin}
                         </div>
                         <div className="text-right">
                            {order.status === 'ORD_PLACED' && (
                              <button 
                                onClick={() => handleVerifyOrder(order)}
                                disabled={isVerifying === order.id}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 ml-auto transition-all active:scale-95"
                              >
                                {isVerifying === order.id ? <Loader2 size={14} className="animate-spin" /> : order.itemType.includes('Service') ? <CalendarCheck size={14} /> : <ShieldCheck size={14} />}
                                {order.itemType.includes('Service') ? 'Confirm Availability' : 'Confirm Stock'}
                              </button>
                            )}
                            {(order.status === 'ORD_VERIFIED' || order.status === 'AVAILABILITY_VERIFIED') && (
                               <div className="flex items-center gap-2 text-amber-500/60 font-black text-[8px] uppercase justify-end px-4">
                                  <Clock size={12} className="animate-pulse" /> Handshake: Awaiting Escrow
                               </div>
                            )}
                            {order.status === 'PAYMENT_HELD' && (
                               order.itemType.includes('Service') ? (
                                  <button 
                                    onClick={() => handleServiceArrangement(order)}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ml-auto"
                                  >
                                    <Binoculars size={14} /> Make Arrangements
                                  </button>
                               ) : (
                                  <button 
                                    onClick={() => setSelectedOrderForDispatch(order)}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ml-auto"
                                  >
                                    <Truck size={14} /> Commit Dispatch
                                  </button>
                               )
                            )}
                            {order.status === 'DISPATCHED' && (
                               <div className="flex items-center gap-2 text-indigo-400/60 font-black text-[8px] uppercase justify-end px-4">
                                  <History size={12} className="animate-pulse" /> Transit: Awaiting GRN Shard
                               </div>
                            )}
                            {order.status === 'COMPLETED' && (
                               <div className="flex items-center gap-3 justify-end text-emerald-400">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cycle Finalized</span>
                                  <CheckCircle size={14} />
                               </div>
                            )}
                         </div>
                      </div>
                    ))}
                    {myIncomingOrders.length === 0 && (
                      <div className="p-32 text-center opacity-20 flex flex-col items-center gap-6">
                        <Monitor size={64} className="text-slate-600" />
                        <p className="text-xl font-black uppercase tracking-[0.4em]">No Inbound Procurement Signals</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'inventory' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Local <span className="text-amber-500">Asset Management</span></h3>
                   <p className="text-slate-500 text-sm mt-2 font-medium">Control the provisioning of your sharded industrial assets.</p>
                </div>
                <button onClick={handleStartRegistration} className="px-8 py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                  <PlusCircle size={20} /> Register New Shard
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                 {vendorProducts.filter(p => p.supplierEsin === user.esin).map(product => (
                    <div key={product.id} className="glass-card p-8 rounded-[48px] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between shadow-xl bg-black/20 group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={160} /></div>
                       <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-4 bg-white/5 rounded-2xl text-amber-500 border border-white/5 shadow-inner group-hover:rotate-6 transition-all">
                                <Package size={24} />
                             </div>
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                                product.status === 'AUTHORIZED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                             }`}>{product.status}</span>
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic leading-tight m-0 tracking-tighter">{product.name}</h4>
                             <p className="text-[9px] text-slate-500 font-mono mt-3 font-bold uppercase tracking-tighter">REGISTRY_ID: {product.id}</p>
                          </div>
                          <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-3 shadow-inner">
                             <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                                <span>Registry Cost</span>
                                <span className="text-white font-mono">{product.price} EAC</span>
                             </div>
                             <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                                <span>Unit Stock</span>
                                <span className="text-emerald-400 font-mono">{product.stock} Units</span>
                             </div>
                          </div>
                       </div>
                       <div className="pt-8 mt-6 border-t border-white/5 flex gap-3 relative z-10">
                          <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all">Audit</button>
                          <button className="flex-1 py-3 bg-amber-600 rounded-xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95">Modify</button>
                       </div>
                    </div>
                 ))}
                 {vendorProducts.filter(p => p.supplierEsin === user.esin).length === 0 && (
                   <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-20 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20">
                     <PackageSearch size={48} className="text-slate-600" />
                     <p className="text-lg font-black uppercase tracking-widest">No Locally Registered Shards</p>
                   </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'ledger' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 px-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-600/5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform"><Activity size={300} className="text-white" /></div>
                   <div className="relative z-10">
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Revenue <span className="text-emerald-400">Diffusion</span></h3>
                      <p className="text-slate-500 text-sm mt-2 italic">Institutional disbursements finalized upon ZK-Audit fulfillment.</p>
                      <div className="mt-12 flex items-baseline gap-4">
                         <p className="text-7xl font-mono font-black text-white tracking-tighter">{totalEarned.toFixed(0)}</p>
                         <p className="text-2xl font-black text-emerald-400 italic uppercase">Total EAC Yielded</p>
                      </div>
                   </div>
                   <div className="relative z-10 flex gap-4 pt-10 border-t border-white/5 mt-10">
                      <button className="px-10 py-5 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                        <Download size={16} /> Export Revenue Shard
                      </button>
                      <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
                        <History size={16} /> Full History
                      </button>
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 flex flex-col shadow-xl">
                   <h4 className="text-lg font-black text-white uppercase tracking-widest italic border-b border-white/5 pb-4">Performance Shards</h4>
                   <div className="flex-1 space-y-6">
                      {[
                        { l: 'Fulfillment Velocity', v: '98%', i: Zap, c: 'text-amber-500' },
                        { l: 'Trust Index', v: '4.9/5', i: ShieldCheck, c: 'text-blue-400' },
                        { l: 'Ledger Accuracy', v: '100%', i: Binary, c: 'text-emerald-400' },
                        { l: 'Audit Clearance', v: 'STABLE', i: ClipboardCheck, c: 'text-indigo-400' },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg bg-white/5 ${s.c} group-hover:scale-110 transition-transform shadow-inner border border-white/5`}><s.i size={16} /></div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{s.l}</span>
                           </div>
                           <span className="text-sm font-mono font-black text-white">{s.v}</span>
                        </div>
                      ))}
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center shadow-inner">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Reputation Delta</p>
                      <p className="text-xl font-mono font-black text-emerald-400">+142 PTS</p>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h4 className="text-xl font-black text-white uppercase italic tracking-widest px-4">Disbursement Shards</h4>
                <div className="glass-card rounded-[40px] overflow-hidden border border-white/5 bg-black/40 shadow-xl">
                   <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="col-span-2">Completed Shard</span>
                      <span>Value EAC</span>
                      <span>Settlement Date</span>
                      <span className="text-right">Registry Auth</span>
                   </div>
                   <div className="divide-y divide-white/5">
                      {completedOrders.map(tx => (
                        <div key={tx.id} className="grid grid-cols-5 p-8 hover:bg-white/[0.02] transition-all items-center group">
                           <div className="col-span-2 flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                 <Receipt size={20} className="text-emerald-400" />
                              </div>
                              <div>
                                 <p className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors italic">{tx.itemName}</p>
                                 <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">{tx.id}</p>
                              </div>
                           </div>
                           <div className="text-lg font-mono font-black text-white">
                              +{tx.cost.toFixed(0)}
                           </div>
                           <div className="text-xs text-slate-500 font-mono">
                              {new Date(tx.timestamp).toLocaleDateString()}
                           </div>
                           <div className="flex justify-end pr-4">
                              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shadow-xl">
                                 <ShieldCheck size={16} />
                              </div>
                           </div>
                        </div>
                      ))}
                      {completedOrders.length === 0 && (
                        <div className="p-20 text-center opacity-30 italic">Awaiting completed procurement handshakes. Disbursement follows digital GRN signature.</div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Industrial Dispatch Modal */}
      {selectedOrderForDispatch && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedOrderForDispatch(null)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-10 md:p-16 space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                          <Truck size={32} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Logistics <span className="text-emerald-400">Ingest</span></h3>
                          <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">ORDER_ID: {selectedOrderForDispatch.id}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedOrderForDispatch(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all border border-white/5 shadow-xl"><X size={24} /></button>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Select Industrial Relay</label>
                       <div className="grid grid-cols-1 gap-4">
                          {LOGISTIC_PROVIDERS.map(lp => (
                             <button 
                                key={lp.id}
                                onClick={() => handleExecuteDispatch(lp)}
                                className="p-8 glass-card border border-white/5 hover:border-emerald-500/30 bg-black/40 rounded-[44px] transition-all flex items-center justify-between group active:scale-95 shadow-xl"
                             >
                                <div className="flex items-center gap-8">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600/10 group-hover:text-emerald-400 transition-all shadow-inner border border-white/10">
                                      {lp.name.includes('Drone') ? <Bot size={28} /> : lp.name.includes('Rail') ? <Building2 size={28} /> : <HardHat size={28} />}
                                   </div>
                                   <div className="text-left">
                                      <p className="text-xl font-bold text-white uppercase italic leading-none">{lp.name}</p>
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-3">Resonance: {lp.mResonance}x // ETA: {lp.speed}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-xl font-mono font-black text-emerald-400">{lp.costEAC} <span className="text-[10px]">EAC</span></p>
                                   <p className="text-[9px] text-slate-700 font-bold uppercase tracking-tighter">Relay Fee</p>
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                    <ShieldAlert className="w-12 h-12 text-blue-500 shrink-0" />
                    <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-tight leading-relaxed text-left italic">
                       LOGISTICS_POLICY: "Selecting a relay node initiates a ZK-Handshake for the tracking shard. Delivery finality requires digital GRN signature from the customer."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowRegisterModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 <div className="flex gap-4 mb-4 shrink-0">
                    {['identification', 'item_ingest', 'settlement', 'audit_protocol', 'success'].map((s, i) => {
                       const stages = ['identification', 'item_ingest', 'settlement', 'audit_protocol', 'success'];
                       const currentIdx = stages.indexOf(regStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-2 rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : i === currentIdx ? 'bg-amber-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-amber-400' : 'text-slate-700'}`}>{s}</span>
                         </div>
                       );
                    })}
                 </div>

                 {regStep === 'identification' && (
                    <div className="space-y-12 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl">
                             <Building2 className="w-12 h-12 text-amber-500" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Supplier <span className="text-amber-500">Identity</span></h3>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-md:text-sm max-w-md mx-auto italic">Select your industrial designation for global registry ingest.</p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          {[
                             { id: 'RAW_MATERIALS', l: 'Raw Materials', i: Leaf, d: 'Seeds, Soils, Bio-Inputs' },
                             { id: 'FINISHED_PRODUCTS', l: 'Value-Added', i: Package, d: 'Processed Goods, Tools' },
                             { id: 'REVERSE_RETURN', l: 'Circular Flow', i: RotateCcw, d: 'Refurbished, Recycled' },
                             { id: 'SERVICE_PROVIDER', l: 'Consultation', i: Binoculars, d: 'Experts, Services, Tours' },
                          ].map(opt => (
                             <button 
                                key={opt.id}
                                onClick={() => setSupplierType(opt.id as SupplierType)}
                                className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 text-center group ${supplierType === opt.id ? 'bg-amber-600/10 border-amber-500 text-amber-400 shadow-xl' : 'bg-black border-white/10 text-slate-500 hover:border-white/20'}`}
                             >
                                <opt.i size={28} className={supplierType === opt.id ? 'text-amber-400' : 'text-slate-700'} />
                                <div className="space-y-1">
                                   <p className="text-xs font-black uppercase leading-none">{opt.l}</p>
                                   <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">{opt.d}</p>
                                </div>
                             </button>
                          ))}
                       </div>

                       <button onClick={() => setRegStep('item_ingest')} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-amber-500 transition-all flex items-center justify-center gap-4 active:scale-95">
                          Continue to Item Ingest <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {regStep === 'item_ingest' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Register <span className="text-amber-500">Asset Shard</span></h3>
                          <p className="text-slate-500 text-sm">Define the technical metadata for your industrial provision.</p>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Alias (Name)</label>
                             <input type="text" required value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Spectral Maize Shards v4" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Pillar Category</label>
                                <select value={itemCategory} onChange={e => setItemCategory(e.target.value as any)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-amber-500/20">
                                   <option>Seed</option>
                                   <option>Input</option>
                                   <option>Tool</option>
                                   <option>Technology</option>
                                   <option>Produce</option>
                                   <option>Service</option>
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Cost (EAC)</label>
                                <input type="number" required value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xl focus:ring-2 focus:ring-amber-500/20 outline-none" />
                             </div>
                          </div>

                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Technical Narrative (Description)</label>
                             <textarea required value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="Describe the sustainability impact and origin..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-amber-500/20 italic" />
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setRegStep('identification')} className="px-10 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button onClick={() => setRegStep('settlement')} className="flex-1 py-8 bg-amber-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] transition-all">Initialize Settlement</button>
                       </div>
                    </div>
                 )}

                 {regStep === 'settlement' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-amber-500">Handshake</span></h3>
                          <p className="text-slate-400 text-sm">Authorize EAC for institutional vetting and node sharding.</p>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 text-center space-y-10 shadow-inner">
                          <div className="flex justify-between items-center px-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Shard Designation</span>
                             <span className="text-xs font-black text-amber-500 uppercase italic">{supplierType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between items-center px-4 border-t border-white/5 pt-6">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Registration Fee</span>
                             <span className="text-4xl font-mono font-black text-emerald-400">{getSettlementFee()} EAC</span>
                          </div>
                          <div className="space-y-4 pt-6">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] text-center mb-4">Confirm Node Signature (ESIN)</p>
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-transparent border-none text-center text-4xl font-mono text-white outline-none uppercase placeholder:text-slate-900 tracking-widest shadow-inner" />
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setRegStep('item_ingest')} className="px-10 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button onClick={handleAuthorizeSettlement} disabled={!esinSign} className="flex-1 py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 disabled:opacity-30 transition-all">AUTHORIZE ANCHOR</button>
                       </div>
                    </div>
                 )}

                 {regStep === 'audit_protocol' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                       <div className="space-y-6">
                          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative group">
                             <HardHat className="w-12 h-12 text-amber-500 animate-bounce" />
                             <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full animate-ping opacity-40"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Physical <span className="text-amber-500">Audit Protocol</span></h3>
                          <p className="text-slate-400 text-lg font-medium italic max-sm:text-sm max-w-sm mx-auto leading-relaxed">
                             "Metadata record committed. HQ Stewards have been dispatched to physically evaluate your infrastructure and certify your provisioning capacity."
                          </p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-4 shadow-inner text-left">
                          {[ 
                             { l: 'Industrial Capacity Audit', i: Scale }, 
                             { l: 'Registry Identity Anchor', i: Fingerprint },
                             { l: 'Shard Compliance Vetting', i: ShieldCheck } 
                          ].map((p, i) => (
                             <div key={i} className="flex items-center gap-4 text-xs font-black text-slate-300 uppercase tracking-widest italic group">
                                <div className="p-2 bg-white/5 rounded-xl text-slate-700 group-hover:text-amber-500 transition-colors"><p.i size={14} /></div> {p.l}
                             </div>
                          ))}
                       </div>
                       <button onClick={handleFinalizeRegistry} disabled={isProcessing} className="w-full py-10 bg-amber-600 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all">
                          {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <ClipboardCheck className="w-8 h-8" />}
                          {isProcessing ? "MINTING SHARD..." : "COMMENCE AUDIT QUEUE"}
                       </button>
                    </div>
                 )}

                 {regStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(217,119,6,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">Asset <span className="text-amber-500">Anchored</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HASH_COMMIT_0x882_SYNC_OK</p>
                       </div>
                       <p className="text-slate-500 text-sm max-sm:text-sm max-w-sm italic leading-relaxed text-center">"Your asset shard is now provisional in the global registry. Standby for physical audit completion to possess the 'Authentic' marker."</p>
                       <button onClick={() => setShowRegisterModal(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command</button>
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default VendorPortal;
