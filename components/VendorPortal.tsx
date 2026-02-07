
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
  ArrowDownLeft,
  Trash2,
  Edit2,
  MoreVertical,
  Plus,
  BadgeCheck
} from 'lucide-react';
import { User, Order, LogisticProvider, VendorProduct } from '../types';

// Fixed: Defined missing RegStep and SupplierType types
type RegStep = 'identification' | 'item_ingest' | 'settlement' | 'audit_protocol' | 'success';
type SupplierType = 'REVERSE_RETURN' | 'RAW_MATERIALS' | 'FINISHED_PRODUCTS' | 'SERVICE_PROVIDER';

interface VendorPortalProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], meta?: any) => void;
  vendorProducts: VendorProduct[];
  onRegisterProduct: (product: VendorProduct) => void;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProduct?: (product: VendorProduct) => void;
  onCommitToLive?: (product: VendorProduct) => void;
}

const VendorPortal: React.FC<VendorPortalProps> = ({ 
  user, onSpendEAC, orders = [], onUpdateOrderStatus, vendorProducts = [], onRegisterProduct, onDeleteProduct, onUpdateProduct, onCommitToLive 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'shipments' | 'ledger'>('inventory');
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

  // Modify State
  const [modifyingProduct, setModifyingProduct] = useState<VendorProduct | null>(null);

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

  const handleSaveModification = () => {
    if (modifyingProduct && onUpdateProduct) {
      onUpdateProduct(modifyingProduct);
      setModifyingProduct(null);
    }
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

  const handleTriggerLiveProcessing = (product: VendorProduct) => {
    if (confirm(`INITIALIZE LIVE PROCESSING: Committing ${product.name} to the industrial SCADA flow for TQM verification. Audit fee: 50 EAC. Continue?`)) {
      onCommitToLive?.(product);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* 1. Header Segment - Matches Screenshot */}
      <div className="glass-card p-10 md:p-16 rounded-[64px] border border-amber-500/20 bg-black/40 relative overflow-hidden flex flex-col items-center text-center space-y-8 shadow-3xl">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
         <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-6 transition-transform">
            <Building2 className="w-[800px] h-[800px] text-white" />
         </div>
         
         <div className="w-40 h-40 rounded-[48px] bg-white flex items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.1)] relative z-10 border-4 border-white/5 overflow-hidden group/logo">
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-100 to-white animate-pulse"></div>
            <div className="flex flex-col gap-1 items-center relative z-20">
               <div className="w-14 h-2 bg-amber-600 rounded-full"></div>
               <div className="w-14 h-2 bg-amber-600 rounded-full"></div>
               <div className="w-14 h-2 bg-amber-600 rounded-full"></div>
            </div>
         </div>

         <div className="space-y-4 relative z-10 max-w-4xl">
            <div className="space-y-2">
               <span className="px-5 py-2 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full tracking-[0.6em] border border-amber-500/20">VENDOR_REGISTRY_NODE_v5</span>
               <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">SUPPLIER <span className="text-amber-500">COMMAND</span></h2>
            </div>
            <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
               Provision your agricultural assets to the global grid. Multi-stage industrial vetting ensures 100% authenticity for all network shards.
            </p>
            <div className="flex justify-center gap-6 pt-6">
               <button 
                onClick={handleStartRegistration}
                className="px-16 py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center gap-6 active:scale-95 transition-all border-2 border-white/10 ring-[12px] ring-emerald-500/5"
               >
                  <PlusCircle size={28} /> REGISTER AS SUPPLIER
               </button>
            </div>
         </div>
      </div>

      {/* 2. Registry Revenue Dashboard Item */}
      <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 flex flex-col md:flex-row justify-between items-center text-center md:text-left shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.02)_0%,_transparent_70%)] pointer-events-none"></div>
         <div className="space-y-2 relative z-10 flex flex-col items-center md:items-start flex-1">
            <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em] mb-4">REGISTRY REVENUE</p>
            <div className="flex items-baseline gap-6">
               <h4 className="text-[100px] font-mono font-black text-white leading-none tracking-tighter italic">{totalEarned.toFixed(0)}</h4>
               <span className="text-4xl font-bold text-emerald-500 italic uppercase">EAC</span>
            </div>
         </div>
         <div className="w-full md:w-auto mt-10 md:mt-0 flex flex-col items-center md:items-end gap-6 relative z-10 flex-1">
            <div className="flex justify-between items-center w-full max-w-[300px] text-[11px] font-black uppercase text-slate-600 px-4">
               <span>SETTLEMENT RATE</span>
               <span className="text-emerald-500">STABLE</span>
            </div>
            <div className="h-2 w-full max-w-[400px] bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
               <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '92%' }}></div>
            </div>
         </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'shipments', label: 'INBOUND ORDERS', icon: ShoppingCart },
            { id: 'inventory', label: 'ASSET MANAGEMENT', icon: Package },
            { id: 'ledger', label: 'REVENUE LEDGER', icon: BadgeDollarSign },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-2xl scale-105 border-b-4 border-amber-400 ring-8 ring-amber-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Content */}
      <div className="min-h-[800px] relative z-10">
        {activeTab === 'shipments' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 gap-6">
                {myIncomingOrders.map(order => (
                  <div key={order.id} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 hover:bg-black/60 transition-all group flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl">
                     <div className="flex items-center gap-8 flex-1">
                        <div className="w-20 h-20 rounded-[28px] overflow-hidden border-2 border-white/10 shrink-0 group-hover:rotate-3 transition-transform shadow-2xl bg-slate-900">
                           <img src={order.itemImage || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=200'} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0" alt="" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-amber-500 transition-colors">{order.itemName}</h4>
                           <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-3">ORDER_ID: {order.id} // ORIGIN: {order.customerEsin}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-12 border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-12 w-full md:w-auto">
                        <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3 min-w-[150px]">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                             order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             order.status === 'PAYMENT_HELD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                             order.status === 'DISPATCHED' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' :
                             'bg-amber-500/10 text-amber-400 border-amber-500/20'
                           }`}>{order.status.replace(/_/g, ' ')}</span>
                           <p className="text-[9px] text-slate-700 font-black uppercase">LIFECYCLE_STAGE</p>
                        </div>
                        <div className="flex gap-4">
                           {order.status === 'ORD_PLACED' && (
                              <button onClick={() => handleVerifyOrder(order)} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-3xl text-white shadow-2xl active:scale-90 transition-all flex items-center gap-4 border border-white/10">
                                 {isVerifying === order.id ? <Loader2 className="animate-spin" /> : <ShieldCheck size={24}/>}
                                 <span className="text-[10px] font-black uppercase">Verify</span>
                              </button>
                           )}
                           <button className="p-6 bg-white/5 rounded-3xl text-slate-500 hover:text-white transition-all"><MoreVertical size={24}/></button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === 'inventory' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex justify-between items-center px-4">
                 <div className="space-y-2">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0">LOCAL <span className="text-amber-500">ASSET MANAGEMENT</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">Control the provisioning of your sharded industrial assets.</p>
                 </div>
                 <button 
                  onClick={handleStartRegistration}
                  className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all ring-8 ring-emerald-500/5 border border-white/10"
                 >
                    <Plus size={20} /> REGISTER NEW SHARD
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {vendorProducts.filter(p => p.supplierEsin === user.esin).map(product => (
                    <div key={product.id} className="p-10 glass-card rounded-[64px] border-2 border-white/10 bg-black/40 hover:border-amber-500/40 transition-all flex flex-col group active:scale-[0.99] duration-300 shadow-3xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Package size={400} className="text-white" /></div>
                       
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="flex items-center gap-8">
                             <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 shadow-3xl group-hover:rotate-6 transition-transform relative overflow-hidden">
                                <div className="absolute inset-0 bg-amber-500/5 animate-pulse"></div>
                                <Package size={48} className="relative z-10" />
                             </div>
                             <div className="space-y-1">
                                <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-amber-500 transition-colors drop-shadow-2xl">{product.name}</h4>
                                <p className="text-[11px] text-slate-700 font-mono font-black uppercase mt-3 tracking-widest">REGISTRY_ID: {product.id}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <div className="px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] font-black text-[10px] uppercase tracking-widest">AUTHORIZED</div>
                          </div>
                       </div>

                       <div className="p-10 bg-black/60 rounded-[56px] border border-white/10 shadow-inner relative z-10 space-y-10 group/metrics">
                          <div className="flex justify-between items-center px-4">
                             <div className="space-y-1">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">REGISTRY COST</p>
                                <p className="text-4xl font-mono font-black text-white tracking-tighter">{product.price.toLocaleString()} <span className="text-sm font-sans italic text-slate-500 ml-1">EAC</span></p>
                             </div>
                             <div className="h-16 w-px bg-white/10"></div>
                             <div className="text-right space-y-1">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">UNIT STOCK</p>
                                <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{product.stock} <span className="text-sm font-sans italic text-emerald-700 ml-1">UNITS</span></p>
                             </div>
                          </div>
                       </div>

                       <div className="mt-14 pt-10 border-t border-white/5 flex flex-wrap gap-4 relative z-10">
                          <button 
                            onClick={() => handleTriggerLiveProcessing(product)}
                            className="flex-1 py-6 bg-white/5 border-2 border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-3xl active:scale-95"
                          >
                             AUDIT
                          </button>
                          <button 
                            onClick={() => setModifyingProduct(product)}
                            className="flex-1 py-6 bg-amber-600 hover:bg-amber-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(217,119,6,0.3)] active:scale-95 transition-all border-2 border-white/10 ring-8 ring-white/5"
                          >
                             MODIFY
                          </button>
                          <button 
                            onClick={() => onDeleteProduct?.(product.id)}
                            className="p-6 bg-rose-600/10 border-2 border-rose-500/30 rounded-full text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-90"
                            title="Purge Shard"
                          >
                             <Trash2 size={24} />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 <div 
                   onClick={handleStartRegistration}
                   className="p-12 glass-card rounded-[80px] border-4 border-dashed border-white/5 bg-white/[0.01] hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 transition-all flex flex-col items-center justify-center text-center space-y-10 group cursor-pointer shadow-inner h-[620px] opacity-40 hover:opacity-100"
                 >
                    <div className="w-32 h-32 rounded-full bg-slate-900 border-2 border-white/5 flex items-center justify-center text-white shadow-3xl group-hover:scale-110 group-hover:rotate-12 transition-all">
                       <Plus size={64} className="group-hover:animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">REGISTER NEW SHARD</h4>
                       <p className="text-slate-600 text-base font-bold uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed italic">
                          "Provision a new industrial asset into the global agricultural mesh."
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'ledger' && (
           <div className="space-y-12 animate-in fade-in duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="p-12 glass-card rounded-[64px] bg-emerald-600/5 border-2 border-emerald-500/20 shadow-3xl relative overflow-hidden flex flex-col justify-between h-[450px] group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Stamp size={400} /></div>
                    <div className="space-y-6 relative z-10">
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Global <span className="text-emerald-400">Revenue Sharding</span></h3>
                       <p className="text-slate-500 text-xl font-medium italic leading-relaxed max-lg:text-sm max-w-lg">"Registry settlements finalized via ZK-Audits and physical handshakes."</p>
                    </div>
                    <div className="flex items-baseline gap-6 relative z-10">
                       <p className="text-[100px] font-mono font-black text-white leading-none tracking-tighter italic">{totalEarned.toFixed(0)}</p>
                       <p className="text-3xl font-black text-emerald-500 italic uppercase">EAC YIELDED</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    {[
                       { l: 'Ledger Accuracy', v: '100%', i: Binary, c: 'text-blue-400' },
                       { l: 'Audit Score', v: 'A+', i: BadgeCheck, c: 'text-emerald-400' },
                       { l: 'Escrow Flow', v: 'High', i: Wallet, c: 'text-amber-500' },
                       { l: 'Node Trust', v: '99.8%', i: ShieldCheck, c: 'text-indigo-400' },
                    ].map((stat, i) => (
                       <div key={i} className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between group hover:border-indigo-500/30 transition-all shadow-xl">
                          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 w-fit ${stat.c} group-hover:scale-110 transition-transform shadow-inner`}><stat.i size={24} /></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">{stat.l}</p>
                             <p className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{stat.v}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- MODAL: MODIFY ASSET --- */}
      {modifyingProduct && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setModifyingProduct(null)}></div>
           <div className="relative z-10 w-full max-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 flex justify-between items-center bg-indigo-500/[0.02]">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-3xl animate-float">
                       <Edit2 size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Modify <span className="text-indigo-400">Shard</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[10px] uppercase mt-3">TARGET_ID: {modifyingProduct.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setModifyingProduct(null)} className="p-5 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-black/40 space-y-10">
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4 block text-left">Asset Designation (Name)</label>
                    <input 
                      type="text" value={modifyingProduct.name} 
                      onChange={e => setModifyingProduct({...modifyingProduct, name: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-3xl py-6 px-10 text-xl font-bold text-white outline-none focus:ring-4 focus:ring-indigo-500/10 italic shadow-inner" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4 block text-left">Registry Cost</label>
                       <input 
                         type="number" value={modifyingProduct.price} 
                         onChange={e => setModifyingProduct({...modifyingProduct, price: Number(e.target.value)})}
                         className="w-full bg-black border border-white/10 rounded-3xl py-6 px-10 text-xl font-mono font-black text-indigo-400 outline-none" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest px-4 block text-left">Unit Stock</label>
                       <input 
                         type="number" value={modifyingProduct.stock} 
                         onChange={e => setModifyingProduct({...modifyingProduct, stock: Number(e.target.value)})}
                         className="w-full bg-black border border-white/10 rounded-3xl py-6 px-10 text-xl font-mono font-black text-emerald-400 outline-none" 
                       />
                    </div>
                 </div>
                 <button 
                  onClick={handleSaveModification}
                  className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                 >
                    ANCHOR MODIFIED SHARD
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Supplier Registration Workflow maintained... */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowRegisterModal(false)}></div>
           <div className="relative z-10 w-full max-xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 <div className="flex gap-4 mb-4 shrink-0">
                    {['identification', 'item_ingest', 'settlement', 'audit_protocol', 'success'].map((s, i) => {
                       const stages = ['identification', 'item_ingest', 'settlement', 'audit_protocol', 'success'];
                       const currentIdx = stages.indexOf(regStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-1.5 rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : i === currentIdx ? 'bg-amber-400 animate-pulse' : 'bg-white/10'}`}></div>
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
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Supplier <span className="text-amber-500">Identity</span></h3>
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

                       <button onClick={() => setRegStep('item_ingest')} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-amber-50 transition-all flex items-center justify-center gap-4 active:scale-95">
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
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 block text-left">Registry Alias (Name)</label>
                             <input type="text" required value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Spectral Maize Shards v4" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2 text-left">
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
                             <div className="space-y-2 text-left">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Cost (EAC)</label>
                                <input type="number" required value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xl focus:ring-2 focus:ring-amber-500/20 outline-none" />
                             </div>
                          </div>

                          <div className="space-y-2 text-left">
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
                          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl"><Coins className="w-10 h-10 text-emerald-400" /></div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Registry <span className="text-indigo-400">Handshake</span></h3>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 text-center space-y-10 shadow-inner">
                          <div className="flex justify-between items-center px-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Designation</span>
                             <span className="text-xs font-black text-amber-500 uppercase italic">{supplierType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between items-center px-4 border-t border-white/5 pt-6">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Registration Fee</span>
                             <span className="text-4xl font-mono font-black text-emerald-400">{getSettlementFee()} EAC</span>
                          </div>
                          <div className="space-y-4 pt-6">
                             <p className="text-[10px] text-slate-600 font-black uppercase text-center tracking-[0.4em] mb-4">Confirm Node Signature (ESIN)</p>
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
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .shadow-3xl { box-shadow: 0 40px 150px -30px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default VendorPortal;
