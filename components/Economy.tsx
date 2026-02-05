import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ShieldCheck, 
  Activity, 
  BadgeCheck, 
  Fingerprint, 
  Globe, 
  Loader2, 
  X, 
  Plus, 
  ShoppingCart, 
  Trash2, 
  Lock, 
  Gem, 
  TrendingUp, 
  Building, 
  Bot,
  Landmark,
  Briefcase,
  Users,
  HardHat,
  Boxes,
  Cpu,
  ShieldPlus,
  Coins,
  ArrowRightCircle,
  LayoutGrid,
  ChevronRight,
  CheckCircle2,
  BarChart3,
  Network,
  ExternalLink,
  Zap,
  ArrowUpRight,
  Target,
  Share2,
  Package,
  Truck,
  Box,
  ArrowLeft,
  ThumbsUp,
  LineChart as LineChartIcon,
  Signal,
  History,
  Terminal,
  FileDigit,
  Waves,
  Stamp,
  ClipboardCheck,
  MoreVertical,
  Monitor,
  Workflow,
  Radio,
  MapPin,
  ArrowRight,
  Wallet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar
} from 'recharts';
import { User, ViewState, Order, VendorProduct, AgroProject, FarmingContract, RegisteredUnit, NotificationType } from '../types';

interface EconomyProps {
  user: User;
  isGuest: boolean;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  vendorProducts: VendorProduct[];
  onPlaceOrder: (order: Partial<Order>) => void;
  projects: AgroProject[];
  contracts: FarmingContract[];
  industrialUnits: RegisteredUnit[];
  onUpdateUser: (user: User) => void;
  notify?: (type: NotificationType, title: string, message: string) => void;
}

const STORE_ASSETS = [
  { id: 'EOS-HW-001', name: 'EOS Core Hardware Node', price: 2500, category: 'Official Store', type: 'Hardware', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400', desc: 'Official EnvirosAgro industrial computing node. Pre-configured for ZK-telemetry.', supplier: 'EA-ORG-CORE' },
  { id: 'EOS-SRV-001', name: 'SEHTI Tier Calibration', price: 500, category: 'Official Store', type: 'Service', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400', desc: 'Official node audit for EAC multipliers and registry vouching.', supplier: 'EA-ORG-CORE' },
  { id: 'EOS-FIN-001', name: 'Treasury Node License', price: 1000, category: 'Official Store', type: 'Finance', thumb: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400', desc: 'Regional capital bridge authorization for fiat ingest.', supplier: 'EA-ORG-CORE' },
];

const FORECAST_DATA = [
  { name: 'Cycle 1', demand: 4200, predicted: 4500, supply: 3800 },
  { name: 'Cycle 2', demand: 4800, predicted: 5100, supply: 4200 },
  { name: 'Cycle 3', demand: 3200, predicted: 3400, supply: 4000 },
  { name: 'Cycle 4', demand: 5900, predicted: 6200, supply: 4800 },
  { name: 'Cycle 5', demand: 7400, predicted: 7800, supply: 6200 },
  { name: 'Cycle 6', demand: 8100, predicted: 8900, supply: 7100 },
];

const EXTERNAL_CHANNELS = [
  { id: 'EXT-AMZ', name: 'Amazon Global', type: 'Consumer Retail', region: 'Global', fee: '15%', status: 'Linked', icon: ShoppingBag, col: 'text-orange-500', health: 99.8 },
  { id: 'EXT-JUM', name: 'Jumia Shard', type: 'Regional Retail', region: 'Africa', fee: '10%', status: 'Active', icon: Truck, col: 'text-blue-500', health: 94.2 },
  { id: 'EXT-ALI', name: 'Alibaba Ingest', type: 'Wholesale B2B', region: 'Asia', fee: '8%', status: 'Awaiting Auth', icon: Box, col: 'text-rose-500', health: 0 },
  { id: 'EXT-SHO', name: 'Shopify Node', type: 'Private Portal', region: 'Custom', fee: '2%', status: 'Linked', icon: LayoutGrid, col: 'text-emerald-500', health: 99.9 },
];

const Economy: React.FC<EconomyProps> = ({ 
  user, isGuest, onSpendEAC, onNavigate, vendorProducts = [], onPlaceOrder, projects = [], contracts = [], industrialUnits = [], notify 
}) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'forecasting' | 'routing'>('catalogue');
  const [cloudFilter, setCloudFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'summary' | 'sign' | 'success'>('summary');
  const [esinSign, setEsinSign] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Price fluctuations simulation
  const [exchangeRates, setExchangeRates] = useState({
    maize: 1.42,
    nitrogen: 0.88,
    carbon: 12.4,
    tech: 42.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates(prev => ({
        maize: Number((prev.maize + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        nitrogen: Number((prev.nitrogen + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        carbon: Number((prev.carbon + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        tech: Number((prev.tech + (Math.random() * 0.5 - 0.25)).toFixed(2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  const combinedCatalogue = useMemo(() => {
    const list: any[] = [];
    vendorProducts.forEach(p => list.push({
      id: p.id, name: p.name, category: 'Vendor Registry', type: p.category, price: p.price,
      provider: p.supplierName, desc: p.description, thumb: p.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400',
      sourceView: 'vendor', raw: p, integrity: 92 + Math.random() * 8
    }));
    contracts.forEach(c => list.push({
      id: c.id, name: c.productType, category: 'Mission Contracts', type: 'Contract', price: 0,
      provider: c.investorName, desc: `Required: ${c.requiredLand}. Budget: ${c.budget} EAC.`,
      thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400',
      sourceView: 'contract_farming', isContract: true, integrity: 100
    }));
    projects.forEach(p => list.push({
      id: p.id, name: p.name, category: 'Investment Shards', type: 'Mission', price: p.totalCapital / (p.totalBatches || 1),
      provider: 'Vetting Registry Node', desc: p.description, thumb: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=400',
      sourceView: 'investor', isInvestment: true, integrity: 98
    }));
    STORE_ASSETS.forEach(a => list.push({ ...a, provider: 'EnvirosAgro HQ', sourceView: 'envirosagro_store', integrity: 100 }));
    industrialUnits.forEach(u => list.push({
      id: u.id, name: u.name, category: 'Industrial Units', type: u.type, price: 0,
      provider: u.location, desc: `Status: ${u.status}. Capacity: ${u.capacity}.`,
      thumb: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=400',
      sourceView: 'industrial', isFacility: true, integrity: 99.9
    }));
    return list;
  }, [vendorProducts, contracts, projects, industrialUnits]);

  const filteredCatalogue = combinedCatalogue.filter(item => {
    const matchesFilter = cloudFilter === 'All' || item.category === cloudFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddToCart = (item: any) => {
    if (item.isContract || item.isFacility || item.isInvestment) {
      onNavigate(item.sourceView);
      return;
    }
    setCart([...cart, { ...item, cartId: Math.random() }]);
    setShowCart(true);
    notify?.('info', 'PROCURE_INGEST', `Buffered ${item.name} into procurement list.`);
  };

  const handleFinalizeCheckout = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }
    setIsFinalizing(true);
    const success = await onSpendEAC(cartTotal, "GLOBAL_MARKET_PROCUREMENT");
    if (success) {
      cart.forEach(item => {
        onPlaceOrder({
          itemId: item.id, itemName: item.name, itemType: item.type, itemImage: item.thumb,
          cost: item.price, supplierEsin: item.supplier || item.raw?.supplierEsin || 'EA-ORG-CORE',
          sourceTab: 'market'
        });
      });
      setCheckoutStep('success');
      setCart([]);
      notify?.('success', 'LEDGER_ANCHORED', 'Market procurements synchronized with industrial thread.');
    }
    setIsFinalizing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Background Matrix Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 1. Industrial Ticker HUD */}
      <div className="flex overflow-x-auto scrollbar-hide gap-6 py-4 border-y border-white/5 bg-black/40 px-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3 shrink-0 pr-6 border-r border-white/10">
           <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ORACLE_FEEDS</span>
        </div>
        {[
          { l: 'MAIZE', v: exchangeRates.maize, d: '+0.01', c: 'text-emerald-400' },
          { l: 'NITROGEN', v: exchangeRates.nitrogen, d: '-0.02', c: 'text-rose-400' },
          { l: 'CARBON', v: exchangeRates.carbon, d: '+0.12', c: 'text-emerald-400' },
          { l: 'TECH_SHARD', v: exchangeRates.tech, d: '+0.45', c: 'text-indigo-400' },
          { l: 'EAC/USD', v: 0.0124, d: 'FIXED', c: 'text-slate-500' },
        ].map((ticker, i) => (
          <div key={i} className="flex items-center gap-4 shrink-0 px-6 py-2 bg-white/[0.02] rounded-2xl border border-white/5 group hover:border-white/20 transition-all cursor-default">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ticker.l}</span>
             <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-black text-white">{ticker.v}</span>
                <span className={`text-[10px] font-mono font-bold ${ticker.c}`}>{ticker.d}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Portal Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-3 glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
              <Globe className="w-96 h-96 text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[64px] bg-emerald-600 shadow-[0_0_120px_rgba(16,185,129,0.3)] flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <ShoppingBag size={96} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[64px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner italic">MULTI_REGISTRY_SYNC_OK</span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">L2_ESCROW_ACTIVE</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">MARKET <br/> <span className="text-emerald-400">CLOUD.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Unified industrial sharding for agricultural assets. Source, procure, and route sustainable value across the global machine mesh."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">AGGREGATE_CAPITAL</p>
              <h4 className="text-8xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">42<span className="text-2xl text-emerald-500 font-sans ml-1">.8M</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">Total EAC Flow / Cycle</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Mesh Stability</span>
                 <span className="text-emerald-400 font-mono">NOMINAL</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '84%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Command Tab Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8">
           <button 
             onClick={() => setShowCart(true)}
             className="relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[28px] text-white font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center gap-4 active:scale-95 group/cart ring-8 ring-emerald-500/5"
           >
              <ShoppingCart size={22} className="group-hover/cart:rotate-12 transition-transform" />
              <span>Procurements ({cart.length})</span>
              {cart.length > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center font-black border-4 border-[#050706] shadow-xl animate-bounce">
                  {cart.length}
                </div>
              )}
           </button>
           {[
             { id: 'catalogue', label: 'Asset Ledger', icon: LayoutGrid },
             { id: 'forecasting', label: 'Demand Matrix', icon: BarChart3 },
             { id: 'routing', label: 'Relay Nodes', icon: Network },
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setActiveTab(t.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <t.icon size={18} /> {t.label}
             </button>
           ))}
         </div>
      </div>

      {/* 4. Content Viewport */}
      <div className="min-h-[900px] relative z-10">
        
        {/* --- VIEW: ASSET LEDGER (CATALOGUE) --- */}
        {activeTab === 'catalogue' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="flex flex-col gap-10 border-b border-white/5 pb-16 px-6">
                <div className="flex flex-col xl:flex-row gap-10 justify-between items-center">
                   <div className="relative flex-1 w-full max-w-4xl group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search global registries by name, category, or ESIN..." 
                        className="w-full bg-black/60 border border-white/10 rounded-[32px] py-7 pl-16 pr-8 text-lg text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 transition-all font-mono italic shadow-inner" 
                      />
                   </div>
                   <div className="flex flex-wrap justify-center gap-4">
                      {['All', 'Vendor Registry', 'Mission Contracts', 'Investment Shards', 'Official Store', 'Industrial Units'].map(cat => (
                         <button 
                           key={cat} 
                           onClick={() => setCloudFilter(cat)}
                           className={`flex items-center gap-3 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-widest border-2 transition-all shrink-0 ${cloudFilter === cat ? 'bg-emerald-600 border-white text-white shadow-3xl scale-105' : 'bg-white/5 border-white/10 text-slate-600 hover:text-white'}`}
                         >
                             {cat}
                         </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-6">
                {filteredCatalogue.map(item => (
                  <div key={item.id} className="glass-card rounded-[72px] overflow-hidden border-2 border-white/5 hover:border-emerald-500/40 transition-all flex flex-col group active:scale-[0.99] duration-500 shadow-3xl bg-black/40 relative">
                     {/* Scanline FX Overlay */}
                     <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity z-10 overflow-hidden">
                        <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent absolute top-0 animate-scan"></div>
                     </div>

                     <div className="h-80 relative overflow-hidden bg-slate-900 shrink-0">
                        <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[12s] opacity-60 grayscale-[0.5] group-hover:grayscale-0" alt={item.name} />
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                           <span className="px-5 py-2 backdrop-blur-3xl rounded-full text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl flex items-center gap-3 bg-black/60 text-white border-white/10 ring-4 ring-white/5">
                             <Stamp size={12} className="text-emerald-400" /> {item.category}
                           </span>
                           <span className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-full w-fit shadow-xl border border-white/10">{item.type}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                     </div>

                     <div className="p-10 flex-1 flex flex-col justify-between relative z-20">
                        <div className="space-y-6">
                           <h4 className="text-3xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0 tracking-tighter drop-shadow-2xl">{item.name}</h4>
                           <p className="text-sm text-slate-400 leading-relaxed italic line-clamp-4 opacity-80 group-hover:opacity-100 transition-opacity">"{item.desc}"</p>
                           <div className="flex items-center gap-4 text-slate-600 group-hover:text-slate-400 transition-colors">
                              <MapPin size={14} className="text-indigo-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest italic">{item.provider}</span>
                           </div>
                        </div>

                        <div className="pt-10 space-y-6">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600 px-2">
                              <span>Shard Integrity</span>
                              <span className="text-emerald-400 font-mono">{(item.integrity || 98.4).toFixed(1)}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div className="h-full rounded-full shadow-[0_0_15px_#10b981] transition-all duration-[3s]" style={{ width: `${item.integrity || 98}%` }}></div>
                           </div>
                        </div>

                        <div className="pt-10 border-t border-white/5 flex items-center justify-between mt-10">
                           <div className="space-y-1">
                              {item.price > 0 ? (
                               <>
                                  <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest leading-none">Entry Shard Fee</p>
                                  <p className="text-4xl font-mono font-black text-white tracking-tighter">{item.price.toFixed(0)} <span className="text-sm text-emerald-500 italic font-sans ml-1">EAC</span></p>
                               </>
                            ) : (
                               <p className="text-2xl font-black text-indigo-400 uppercase italic drop-shadow-lg">Mission Request</p>
                            )}
                           </div>
                           <button 
                              onClick={() => handleAddToCart(item)}
                              className={`p-8 rounded-[36px] text-white shadow-3xl transition-all active:scale-90 border-2 border-white/10 ring-8 ring-white/5 relative group/btn overflow-hidden ${item.isContract || item.isFacility || item.isInvestment ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                              title={item.isContract || item.isFacility || item.isInvestment ? 'Enter Node' : 'Initialize Procurement'}
                           >
                              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                              {item.isContract || item.isFacility || item.isInvestment ? <ArrowRight size={32} className="relative z-10" /> : <Plus size={32} className="relative z-10" />}
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: DEMAND MATRIX (FORECASTING) --- */}
        {activeTab === 'forecasting' && (
          <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000 px-6">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 glass-card p-14 rounded-[72px] border-2 border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col justify-between shadow-3xl group">
                   <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none group-hover:bg-blue-500/[0.03] transition-colors"></div>
                   <div className="flex flex-col xl:flex-row justify-between items-center mb-16 relative z-10 px-6 gap-10">
                      <div className="flex items-center gap-10">
                         <div className="p-8 bg-blue-600 rounded-[32px] shadow-[0_0_80px_#3b82f666] border-4 border-white/10 group-hover:rotate-6 transition-transform">
                            <TrendingUp className="w-14 h-14 text-white" />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">DEMAND <span className="text-blue-400">MATRIX</span></h3>
                            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mt-3">EOS_PREDICTIVE_ORACLE_v4.2</p>
                         </div>
                      </div>
                      <div className="text-center md:text-right border-l-4 border-blue-500/20 pl-10">
                         <p className="text-[12px] text-slate-600 font-black uppercase mb-3 tracking-[0.4em]">Index Momentum</p>
                         <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-2xl leading-none">18.4<span className="text-4xl font-sans italic ml-1">%</span></p>
                      </div>
                   </div>
                   
                   <div className="flex-1 min-h-[500px] w-full relative z-10 p-10 bg-black/60 rounded-[56px] border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={FORECAST_DATA}>
                            <defs>
                               <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }} />
                            <Area type="monotone" name="Registry Inflow" dataKey="demand" stroke="#3b82f6" strokeWidth={8} fillOpacity={1} fill="url(#colorDemand)" strokeLinecap="round" />
                            <Line type="monotone" name="Predictive Shard" dataKey="predicted" stroke="#10b981" strokeWidth={4} strokeDasharray="10 10" dot={{ r: 6, fill: '#10b981', strokeWidth: 4, stroke: '#050706' }} />
                            <Bar name="Actual Supply" dataKey="supply" barSize={40} fill="#1e293b" radius={[10, 10, 0, 0]} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8 flex flex-col justify-between">
                   <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-black/40 flex flex-col justify-center items-center text-center space-y-10 shadow-3xl relative overflow-hidden group/oracle flex-1">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><Bot size={400} className="text-indigo-400" /></div>
                      <div className="w-28 h-28 bg-indigo-600 rounded-[44px] flex items-center justify-center border-4 border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.4)] relative z-10 animate-float">
                         <Bot size={56} className="text-white" />
                      </div>
                      <div className="space-y-6 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Oracle <span className="text-indigo-400">Insights</span></h4>
                         <p className="text-slate-400 text-xl leading-relaxed italic px-8">"Reaction mining indicates peak consumer vouching for Bio-Organic Shards. Demand forecast adjusted to Cycle 6."</p>
                      </div>
                      <div className="p-8 bg-indigo-500/5 rounded-[40px] border border-indigo-500/20 w-[85%] relative z-10 shadow-inner group-hover/oracle:border-indigo-400 transition-colors">
                         <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] mb-3">Confidence Shard</p>
                         <p className="text-6xl font-mono font-black text-indigo-400 tracking-tighter leading-none">92<span className="text-2xl italic font-sans text-indigo-700 ml-1">.4%</span></p>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[48px] border border-amber-500/20 bg-amber-500/5 space-y-6 group/tip">
                      <div className="flex items-center gap-4">
                         <ShieldCheck className="w-8 h-8 text-amber-500 group-hover/tip:scale-110 transition-transform" />
                         <h4 className="text-xl font-black text-white uppercase italic">Market Tip Shard</h4>
                      </div>
                      <p className="text-slate-500 text-sm italic leading-relaxed border-l-2 border-amber-500/20 pl-6">
                         "Short-term scarcity in Zone 4 Nitrogen packs. Recommendation: Anchor existing reserves before Cycle 2 finality."
                      </p>
                   </div>
                </div>
             </div>

             <div className="space-y-10">
                <div className="flex items-center gap-6 px-10">
                   <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                      <ThumbsUp className="text-amber-500 w-6 h-6" />
                   </div>
                   <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">High-Demand <span className="text-amber-500">Live Shards</span></h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                   {[
                    { id: 'PRD-402', name: 'Bio-Organic Fertilizer', vouches: 128, trend: 'UP', integrity: 99.4 },
                    { id: 'PRD-401', name: 'Maize Shards', vouches: 42, trend: 'STABLE', integrity: 98.2 },
                    { id: 'PRD-112', name: 'Water Purity Filters', vouches: 85, trend: 'UP', integrity: 99.9 },
                    { id: 'PRD-091', name: 'Soil DNA Lab Kit', vouches: 212, trend: 'UP', integrity: 100 },
                   ].map(shard => (
                     <div key={shard.id} className="p-10 glass-card border-2 border-white/5 rounded-[56px] bg-black/60 shadow-xl space-y-8 group/s hover:border-amber-500/40 transition-all active:scale-[0.98] duration-300">
                        <div className="flex justify-between items-center">
                           <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-tighter">#{shard.id}</span>
                           <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover/s:scale-110 transition-transform">
                              <TrendingUp size={20} />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <h5 className="text-2xl font-black text-white uppercase italic tracking-tight m-0 group-hover/s:text-amber-400 transition-colors">{shard.name}</h5>
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Integrity: {shard.integrity}%</p>
                        </div>
                        <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 flex justify-between items-center shadow-inner group-hover/s:bg-black transition-colors">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Vouches</span>
                           <span className="text-3xl font-mono font-black text-amber-500 drop-shadow-[0_0_100px_rgba(245,158,11,0.4)]">{shard.vouches}</span>
                        </div>
                        <button className="w-full py-4 bg-white/5 hover:bg-amber-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 shadow-lg">VIEW HEATMAP</button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: RELAY NODES (ROUTING) --- */}
        {activeTab === 'routing' && (
           <div className="space-y-16 animate-in slide-in-from-left-4 duration-500 px-6">
              <div className="glass-card p-16 md:p-20 rounded-[80px] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-20 group shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
                    <Network size={1000} className="text-indigo-400" />
                 </div>
                 <div className="w-48 h-48 rounded-[64px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 shrink-0 relative z-10 animate-pulse">
                    <Share2 className="w-24 h-24 text-white" />
                 </div>
                 <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">MESH_GATEWAY_V6.0</span>
                       <h3 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">RELAY <br/><span className="text-indigo-400">ROUTING</span></h3>
                    </div>
                    <p className="text-slate-400 text-3xl font-medium italic leading-relaxed max-w-4xl">Synchronize industrial production shards with global retail networks through verified e-commerce bridges.</p>
                 </div>
                 <div className="text-center md:text-right relative z-10 hidden xl:block border-l-4 border-indigo-500/20 pl-16">
                    <p className="text-[12px] text-slate-600 font-black uppercase mb-4 tracking-[0.5em] italic">Routed Volume</p>
                    <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">$14.2<span className="text-4xl text-indigo-500 italic font-sans ml-2">M</span></p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 {EXTERNAL_CHANNELS.map(channel => (
                    <div key={channel.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all flex flex-col group shadow-3xl relative overflow-hidden active:scale-[0.98] duration-300 h-[500px]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]">
                          <Network size={200} />
                       </div>
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${channel.col} group-hover:rotate-12 transition-transform shadow-inner`}>
                             <channel.icon size={36} />
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${
                                channel.status === 'Linked' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                channel.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                'bg-rose-500/10 text-rose-700 border-rose-500/20 animate-pulse'
                             }`}>{channel.status}</span>
                             <p className="text-[9px] text-slate-700 font-mono font-black italic">{channel.id}</p>
                          </div>
                       </div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none m-0 group-hover:text-indigo-400 transition-colors">{channel.name}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] italic">{channel.type} // {channel.region}</p>
                       </div>
                       <div className="mt-12 pt-10 border-t border-white/5 space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest leading-none">Bridge Fee</p>
                                <p className="text-2xl font-mono font-black text-white">{channel.fee}</p>
                             </div>
                             <div className="text-right space-y-1">
                                <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest leading-none">Health</p>
                                <p className={`text-2xl font-mono font-black ${channel.health > 90 ? 'text-emerald-500' : 'text-slate-700'}`}>{channel.health}%</p>
                             </div>
                          </div>
                          <button className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl ring-8 ring-white/0 hover:ring-indigo-500/10">
                             {channel.status === 'Linked' ? 'MANAGE_NODE' : 'INITIALIZE_LINK'} <ArrowUpRight size={18} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* --- MODAL: PROCUREMENTS CART --- */}
      {showCart && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowCart(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-2 border-white/10 bg-[#050706] shadow-[0_0_200px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-xl">
                    <ShoppingCart size={28} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Procurement <span className="text-emerald-400">List</span></h3>
                    <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-3">L2_ESCROW_BUFFER_READY</p>
                 </div>
              </div>
              <button onClick={() => setShowCart(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all hover:rotate-90 active:scale-90"><X size={24}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-black/40">
              {cart.map(item => (
                <div key={item.cartId} className="flex items-center gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-[40px] group/item hover:border-emerald-500/20 transition-all shadow-xl">
                  <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-slate-900 flex items-center justify-center border border-white/10 shrink-0 group-hover/item:rotate-3 transition-transform">
                    {item.thumb ? <img src={item.thumb} className="w-full h-full object-cover" alt="" /> : <Cpu size={32} className="text-emerald-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-white font-black text-lg uppercase italic tracking-tight m-0">{item.name}</p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Shard: {item.id} // Cat: {item.category}</p>
                  </div>
                  <div className="text-right pr-4">
                     <p className="text-2xl font-mono font-black text-emerald-400 tracking-tighter">{item.price.toFixed(0)} <span className="text-xs italic text-emerald-700">EAC</span></p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="p-4 bg-white/5 rounded-2xl text-slate-800 hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 shadow-md">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {cart.length === 0 && (
                 <div className="py-24 text-center opacity-10 flex flex-col items-center gap-8">
                    <Box size={120} />
                    <p className="text-4xl font-black uppercase tracking-[0.5em]">BUFFER_EMPTY</p>
                 </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 border-t border-white/10 bg-black/80 space-y-8">
                <div className="flex justify-between items-center px-4">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">AGGREGATE_COMMITMENT</p>
                   <p className="text-5xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">{cartTotal.toFixed(0)} <span className="text-lg text-emerald-400 italic font-sans ml-1">EAC</span></p>
                </div>
                <button 
                  onClick={() => { setShowCart(false); setShowCheckout(true); setCheckoutStep('summary'); }} 
                  className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10"
                >
                  INITIALIZE ESCROW SETTLEMENT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL: SETTLEMENT GATEWAY --- */}
      {showCheckout && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowCheckout(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] p-12 md:p-16 shadow-[0_0_200px_rgba(16,185,129,0.2)] text-center space-y-12 border-2 overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.02] transition-colors"></div>
            
            {checkoutStep === 'summary' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 relative z-10">
                <div className="text-center space-y-6">
                   <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl border-4 border-white/10 animate-float">
                      <Wallet size={48} />
                   </div>
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Settle <span className="text-emerald-400">Capital</span></h3>
                </div>
                
                <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-6 shadow-inner">
                  <div className="flex justify-between text-[11px] text-slate-500 uppercase font-black tracking-widest italic px-4">
                    <span>Aggregate Commit</span>
                    <span className="text-white font-mono">{cartTotal.toFixed(0)} EAC</span>
                  </div>
                  <div className="h-px bg-white/5 w-full"></div>
                  <div className="flex justify-between text-2xl font-black text-emerald-400 px-4">
                    <span>FINAL ESCROW</span>
                    <span className="font-mono tracking-tighter">{cartTotal.toFixed(0)} EAC</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => { setShowCheckout(false); setShowCart(true); }} 
                    className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"
                  >
                    <ArrowLeft size={16} /> Back to Buffer
                  </button>
                  <button onClick={() => setCheckoutStep('sign')} className="flex-[2] py-8 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10">
                    PROCEED TO SIGNATURE <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'sign' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 relative z-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-28 h-28 rounded-[40px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_80px_rgba(99,102,241,0.3)] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                    <Fingerprint size={56} className="relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-indigo-400">Auth Signature</span></h3>
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">STWD_SETTLEMENT_GATEWAY_v5</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-lg mx-auto">
                   <input 
                    type="text" 
                    value={esinSign} 
                    onChange={e => setEsinSign(e.target.value)}
                    placeholder="EA-VVVV-VVVV"
                    className="w-full bg-black border-2 border-white/10 rounded-[40px] py-12 text-center text-5xl font-mono text-white focus:ring-[16px] focus:ring-indigo-500/5 outline-none transition-all uppercase placeholder:text-slate-900 tracking-widest shadow-inner" 
                   />
                </div>

                <div className="space-y-6 pt-4">
                  <button 
                    onClick={handleFinalizeCheckout}
                    disabled={isFinalizing || !esinSign}
                    className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-white/5"
                  >
                    {isFinalizing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Lock size={32} className="fill-current" />}
                    {isFinalizing ? 'ANCHORING SHARD...' : 'AUTHORIZE PROCUREMENT'}
                  </button>
                  <button 
                    onClick={() => setCheckoutStep('summary')} 
                    className="w-full py-4 text-slate-700 font-black text-[10px] uppercase tracking-[0.8em] hover:text-white transition-all flex items-center justify-center gap-3 active:scale-90"
                  >
                    <ArrowLeft size={14} /> Abort_Signature
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="space-y-16 py-12 animate-in zoom-in duration-700 relative z-10 flex flex-col items-center justify-center">
                <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110">
                   <CheckCircle2 className="w-32 h-32 text-white group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-40"></div>
                   <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-6 text-center">
                   <h3 className="text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Ledger <span className="text-emerald-400">Anchored.</span></h3>
                   <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">HASH_COMMIT_0xSETTLE_SYNC_OK</p>
                </div>
                <p className="text-slate-500 text-2xl font-medium italic max-w-xl mx-auto leading-relaxed px-10 border-l-4 border-emerald-500/20">
                   "Transactions successfully sharded to organizational nodes. Monitor lifecycle finality in the **TQM Trace Hub**."
                </p>
                <button onClick={() => setShowCheckout(false)} className="px-24 py-8 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-3xl active:scale-95 ring-8 ring-white/5">Return to Hub</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-3xl { box-shadow: 0 40px 150px -30px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Economy;