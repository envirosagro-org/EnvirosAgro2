import React, { useState, useMemo } from 'react';
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
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { User, ViewState, Order, VendorProduct, AgroProject, FarmingContract, RegisteredUnit, LiveAgroProduct } from '../types';

interface EconomyProps {
  user: User;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onNavigate: (view: ViewState, action?: string | null) => void;
  vendorProducts: VendorProduct[];
  onPlaceOrder: (order: Partial<Order>) => void;
  projects: AgroProject[];
  contracts: FarmingContract[];
  industrialUnits: RegisteredUnit[];
  onUpdateUser: (user: User) => void;
}

const STORE_ASSETS = [
  { id: 'EOS-HW-001', name: 'EOS Core Hardware Node', price: 2500, category: 'Official Store', type: 'Hardware', thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400', desc: 'Official EnvirosAgro industrial computing node.', supplier: 'EA-ORG-CORE' },
  { id: 'EOS-SRV-001', name: 'SEHTI Tier Calibration', price: 500, category: 'Official Store', type: 'Service', thumb: '', desc: 'Official node audit for EAC multipliers.', supplier: 'EA-ORG-CORE' },
  { id: 'EOS-FIN-001', name: 'Treasury Node License', price: 1000, category: 'Official Store', type: 'Finance', thumb: '', desc: 'Regional capital bridge authorization.', supplier: 'EA-ORG-CORE' },
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
  { id: 'EXT-AMZ', name: 'Amazon Global', type: 'Consumer Retail', region: 'Global', fee: '15%', status: 'Linked', icon: ShoppingBag, col: 'text-orange-500' },
  { id: 'EXT-JUM', name: 'Jumia Shard', type: 'Regional Retail', region: 'Africa', fee: '10%', status: 'Active', icon: Truck, col: 'text-blue-500' },
  { id: 'EXT-ALI', name: 'Alibaba Ingest', type: 'Wholesale B2B', region: 'Asia', fee: '8%', status: 'Awaiting Auth', icon: Box, col: 'text-rose-500' },
  { id: 'EXT-SHO', name: 'Shopify Node', type: 'Private Portal', region: 'Custom', fee: '2%', status: 'Linked', icon: LayoutGrid, col: 'text-emerald-500' },
];

const Economy: React.FC<EconomyProps> = ({ 
  user, onSpendEAC, onNavigate, vendorProducts = [], onPlaceOrder, projects = [], contracts = [], industrialUnits = [] 
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

  // Reaction Mining / Demand Logic (Simulated integration from LiveFarming)
  const [highDemandShards] = useState([
    { id: 'PRD-402', name: 'Bio-Organic Fertilizer', vouches: 128, trend: 'UP' },
    { id: 'PRD-401', name: 'Maize Shards', vouches: 42, trend: 'STABLE' },
  ]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  const combinedCatalogue = useMemo(() => {
    const list: any[] = [];
    // 1. Sourcing from Vendor Registry (Marketplace)
    vendorProducts.forEach(p => list.push({
      id: p.id, name: p.name, category: 'Vendor Registry', type: p.category, price: p.price,
      provider: p.supplierName, desc: p.description, thumb: p.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400',
      sourceView: 'vendor', raw: p
    }));
    // 2. Sourcing from Mission Registry (Contract Farming)
    contracts.forEach(c => list.push({
      id: c.id, name: c.productType, category: 'Mission Contracts', type: 'Contract', price: 0,
      provider: c.investorName, desc: `Required: ${c.requiredLand}. Budget: ${c.budget} EAC.`,
      thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400',
      sourceView: 'contract_farming', isContract: true
    }));
    // 3. Sourcing from Vetting Registry (Investment Shards)
    projects.forEach(p => list.push({
      id: p.id, name: p.name, category: 'Investment Shards', type: 'Mission', price: p.totalCapital / (p.totalBatches || 1),
      provider: 'Vetting Registry Node', desc: p.description, thumb: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=400',
      sourceView: 'investor', isInvestment: true
    }));
    // 4. Sourcing from Official HQ Store
    STORE_ASSETS.forEach(a => list.push({ ...a, provider: 'EnvirosAgro HQ', sourceView: 'envirosagro_store' }));
    // 5. Sourcing from Node Registry (Industrial)
    industrialUnits.forEach(u => list.push({
      id: u.id, name: u.name, category: 'Industrial Units', type: u.type, price: 0,
      provider: u.location, desc: `Status: ${u.status}. Capacity: ${u.capacity}.`,
      thumb: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=400',
      sourceView: 'industrial', isFacility: true
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
  };

  const handleFinalCheckout = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsFinalizing(true);
    setTimeout(() => {
      cart.forEach(item => {
        onPlaceOrder({
          itemId: item.id, itemName: item.name, itemType: item.type, itemImage: item.thumb,
          cost: item.price, supplierEsin: item.supplier || item.raw?.supplierEsin || 'EA-ORG-CORE',
          sourceTab: 'market'
        });
      });
      setIsFinalizing(false);
      setCheckoutStep('success');
      setCart([]);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4 relative">
      
      {/* HUD Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 agro-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
             <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Market <span className="text-emerald-400">Cloud</span></h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Unified Multi-Registry Routing Node</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full lg:w-auto">
          <button 
            onClick={() => setShowCart(true)}
            className="relative px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-black text-xs uppercase transition-all shadow-lg flex items-center gap-3"
          >
             <ShoppingCart size={18} />
             <span>Cart ({cart.length})</span>
          </button>
          {[
            { id: 'catalogue', label: 'All Shards', icon: Globe },
            { id: 'forecasting', label: 'Demand Forecasting', icon: BarChart3 },
            { id: 'routing', label: 'E-commerce Routing', icon: Network },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[700px]">
        {activeTab === 'catalogue' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col gap-8 border-b border-white/5 pb-10">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center px-4">
                   <div className="relative flex-1 w-full max-w-2xl group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Filter all registries (e.g. 'hardware', 'contract')..." 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-mono shadow-inner" 
                      />
                   </div>
                </div>
                <div className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-4">
                   {['All', 'Vendor Registry', 'Mission Contracts', 'Investment Shards', 'Official Store', 'Industrial Units'].map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setCloudFilter(cat)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${cloudFilter === cat ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                      >
                          {cat}
                      </button>
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                {filteredCatalogue.map(item => (
                  <div key={item.id} className="glass-card rounded-[48px] overflow-hidden border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col group active:scale-[0.98] duration-300 shadow-2xl bg-black/40 relative">
                     <div className="h-64 relative overflow-hidden bg-slate-900">
                        <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] opacity-60" alt={item.name} />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <span className="px-4 py-1.5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-2xl flex items-center gap-2 bg-black/60 text-white border-white/10">
                             <LayoutGrid size={10} className="text-emerald-400" /> {item.category}
                           </span>
                           <span className="px-3 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase rounded-full w-fit">{item.type}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                     </div>
                     <div className="p-8 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                           <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0 tracking-tighter">{item.name}</h4>
                           <p className="text-[11px] text-slate-400 leading-relaxed italic line-clamp-3">"{item.desc}"</p>
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] italic">Provider: {item.provider}</p>
                        </div>
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-8">
                           <div className="space-y-1">
                              {item.price > 0 ? (
                               <>
                                  <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">Entry Shard Fee</p>
                                  <p className="text-2xl font-mono font-black text-white">{item.price.toFixed(0)} <span className="text-xs text-emerald-500 italic">EAC</span></p>
                               </>
                            ) : (
                               <p className="text-xl font-black text-indigo-400 uppercase italic">Free Application</p>
                            )}
                           </div>
                           <button 
                              onClick={() => handleAddToCart(item)}
                              className={`p-4 rounded-2xl text-white shadow-xl transition-all active:scale-90 ${item.isContract || item.isFacility || item.isInvestment ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                              title={item.isContract || item.isFacility || item.isInvestment ? 'View Node' : 'Add to Cart'}
                           >
                              {item.isContract || item.isFacility || item.isInvestment ? <ArrowRightCircle size={20} /> : <Plus size={20} />}
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                   <div className="flex justify-between items-center mb-10 px-4">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-blue-600 rounded-2xl shadow-xl">
                            <TrendingUp className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Demand <span className="text-blue-400">Forecasting</span></h3>
                            <p className="text-[10px] text-blue-400/60 font-mono tracking-widest uppercase mt-2">EOS_PREDICTIVE_V4.2</p>
                         </div>
                      </div>
                   </div>
                   <div className="h-[400px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={FORECAST_DATA}>
                            <defs>
                               <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                               <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorDemand)" />
                            <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPred)" strokeDasharray="5 5" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-8 shadow-lg">
                   <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-xl">
                      <Bot className="w-10 h-10 text-emerald-400" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white uppercase italic">Market Oracle Insights</h4>
                      <p className="text-slate-400 text-sm leading-relaxed italic px-4">"Reaction mining from Live Processing shards indicates peak consumer vouching for Bio-Organic Shards. Demand forecast adjusted to Cycle 6."</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/5 w-[80%]">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Confidence Score</p>
                      <p className="text-4xl font-mono font-black text-emerald-400">92.4%</p>
                   </div>
                </div>
             </div>

             {/* Live Reaction / Demand Shards Integration */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 px-6">
                   <ThumbsUp className="text-amber-500" />
                   <h4 className="text-xl font-black text-white uppercase italic">High-Demand <span className="text-amber-500">Live Shards</span></h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                   {highDemandShards.map(shard => (
                     <div key={shard.id} className="p-8 glass-card border border-white/5 rounded-[40px] bg-black/60 shadow-xl space-y-6 group hover:border-amber-500/30 transition-all">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{shard.id}</span>
                           <TrendingUp size={16} className="text-emerald-500" />
                        </div>
                        <h5 className="text-xl font-black text-white uppercase italic truncate">{shard.name}</h5>
                        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex justify-between items-center shadow-inner">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Live Vouches</span>
                           <span className="text-2xl font-mono font-black text-amber-500">{shard.vouches}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'routing' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500 px-4">
              <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700"><Network size={400} /></div>
                 <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/10 relative z-10">
                    <Share2 className="w-16 h-16 text-white animate-pulse" />
                 </div>
                 <div className="space-y-4 relative z-10 text-center md:text-left">
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">External <span className="text-indigo-400">Bridge Routing</span></h3>
                    <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl mx-auto md:mx-0">Synchronize your industrial production shards with global consumer retail networks through authorized e-commerce bridges.</p>
                 </div>
                 <div className="ml-auto relative z-10 hidden lg:block text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total Routed Volume</p>
                    <p className="text-4xl font-mono font-black text-white">$14.2M</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {EXTERNAL_CHANNELS.map(channel => (
                    <div key={channel.id} className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all flex flex-col group shadow-xl">
                       <div className="flex justify-between items-start mb-8">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${channel.col} group-hover:scale-110 transition-transform shadow-inner`}>
                             <channel.icon size={28} />
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase border tracking-widest ${
                             channel.status === 'Linked' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                             channel.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                             'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
                          }`}>{channel.status}</span>
                       </div>
                       <div className="flex-1 space-y-2">
                          <h4 className="text-2xl font-black text-white uppercase tracking-tight italic m-0">{channel.name}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{channel.type} // {channel.region}</p>
                       </div>
                       <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-4">
                          <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                             <span>Bridge Fee</span>
                             <span className="text-white font-mono">{channel.fee}</span>
                          </div>
                          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                             {channel.status === 'Linked' ? 'Manage Node' : 'Initialize Link'} <ArrowUpRight size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {showCart && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="relative z-10 w-full max-w-lg glass-card rounded-[40px] border border-white/10 bg-[#0B0F0D] shadow-3xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <ShoppingCart className="text-emerald-400" /> Procurement List
              </h3>
              <button onClick={() => setShowCart(false)} className="p-2 text-slate-500 hover:text-white"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.cartId} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                    {item.thumb ? <img src={item.thumb} className="w-full h-full object-cover" alt="" /> : <Cpu size={24} className="text-emerald-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm uppercase italic">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-black">{item.category}</p>
                  </div>
                  <p className="text-emerald-400 font-mono font-bold">{item.price.toFixed(0)} EAC</p>
                  <button onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))} className="p-2 text-slate-700 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {cart.length === 0 && <p className="text-center text-slate-600 py-10 italic">No assets in cart.</p>}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-center text-xl font-black text-white">
                  <span>TOTAL COMMITMENT</span>
                  <span className="text-emerald-400 font-mono">{cartTotal.toFixed(0)} EAC</span>
                </div>
                <button onClick={() => { setShowCart(false); setShowCheckout(true); setCheckoutStep('summary'); }} className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl">
                  INITIALIZE SETTLEMENT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl"></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[56px] border-emerald-500/30 bg-[#050706] p-12 shadow-3xl text-center space-y-10">
            {checkoutStep === 'summary' && (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-4xl font-black text-white uppercase italic">Settle <span className="text-emerald-400">Capital</span></h3>
                <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                  <div className="flex justify-between text-xs text-slate-500 uppercase font-black">
                    <span>Aggregate Commit</span>
                    <span className="text-white font-mono">{cartTotal.toFixed(0)} EAC</span>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex justify-between text-lg font-black text-emerald-400">
                    <span>FINAL ESCROW</span>
                    <span>{cartTotal.toFixed(0)} EAC</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setShowCheckout(false); setShowCart(true); }} 
                    className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back to List
                  </button>
                  <button onClick={() => setCheckoutStep('sign')} className="flex-[2] py-6 bg-emerald-600 hover:bg-emerald-500 rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-xl">
                    PROCEED TO SIGNATURE
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'sign' && (
              <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-[32px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Fingerprint size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase italic">Node <span className="text-indigo-400">Auth</span></h3>
                </div>
                <input 
                  type="text" 
                  value={esinSign} 
                  onChange={e => setEsinSign(e.target.value)}
                  placeholder="ENTER ESIN SIGNATURE"
                  className="w-full bg-black border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 tracking-widest shadow-inner" 
                />
                <div className="space-y-4">
                  <button 
                    onClick={handleFinalCheckout}
                    disabled={isFinalizing || !esinSign}
                    className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                  >
                    {isFinalizing ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
                    {isFinalizing ? 'ANCHORING SHARD...' : 'AUTHORIZE PROCUREMENT'}
                  </button>
                  <button 
                    onClick={() => setCheckoutStep('summary')} 
                    className="w-full py-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Back to Summary
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="space-y-12 py-10 animate-in zoom-in duration-500">
                <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-3xl mx-auto">
                   <CheckCircle2 className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-5xl font-black text-white uppercase italic">Ledger <span className="text-emerald-400">Updated</span></h3>
                <p className="text-slate-500">Transactions committed to registry nodes.</p>
                <button onClick={() => setShowCheckout(false)} className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest">Return to Market</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Economy;