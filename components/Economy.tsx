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
  Wallet, 
  Sparkles, 
  Binary, 
  Scale, 
  Signature, 
  FileSignature,
  Clock
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ComposedChart,
  Line,
  Bar,
  Cell
} from 'recharts';
import { User, ViewState, Order, VendorProduct, AgroProject, FarmingContract, RegisteredUnit } from '../types';
import { predictMarketSentiment, AIResponse } from '../services/geminiService';

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
  notify: any;
}

const DEMAND_DATA = [
  { t: 'C1', market: 420, predicted: 400, resonance: 0.84 },
  { t: 'C2', market: 580, predicted: 550, resonance: 0.92 },
  { t: 'C3', market: 740, predicted: 700, resonance: 0.88 },
  { t: 'C4', market: 920, predicted: 900, resonance: 1.15 },
  { t: 'C5', market: 1100, predicted: 1050, resonance: 1.05 },
  { t: 'C6', market: 1284, predicted: 1250, resonance: 1.42 },
];

const LOGISTICS_NODES = [
  { id: 'RLY-882', name: 'Nairobi Central Shard', load: 42, latency: '8ms', resonance: 1.42, status: 'NOMINAL', color: 'text-emerald-400' },
  { id: 'RLY-104', name: 'Omaha Ingest Hub', load: 68, latency: '24ms', resonance: 1.15, status: 'HIGH_LOAD', color: 'text-blue-400' },
  { id: 'RLY-042', name: 'Valencia Marine Node', load: 12, latency: '14ms', resonance: 1.68, status: 'OPTIMAL', color: 'text-indigo-400' },
];

const Economy: React.FC<EconomyProps> = ({ 
  user, isGuest, onSpendEAC, onNavigate, vendorProducts = [], onPlaceOrder, projects = [], notify 
}) => {
  const [activeTab, setActiveTab] = useState<'catalogue' | 'forecasting' | 'routing'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'signing' | 'success'>('review');
  const [esinSign, setEsinSign] = useState('');
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Sentiment Oracle State
  const [isSyncingSentiment, setIsSyncingSentiment] = useState(false);
  const [sentimentAlpha, setSentimentAlpha] = useState(1.0);
  const [sentimentReport, setSentimentReport] = useState<string | null>(null);

  // Price fluctuations simulation
  const [ticker, setTicker] = useState({
    maize: 1.42, nitrogen: 0.88, carbon: 12.4, tech: 42.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => ({
        maize: Number((prev.maize + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        nitrogen: Number((prev.nitrogen + (Math.random() * 0.02 - 0.01)).toFixed(2)),
        carbon: Number((prev.carbon + (Math.random() * 0.1 - 0.05)).toFixed(2)),
        tech: Number((prev.tech + (Math.random() * 0.5 - 0.25)).toFixed(2))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncSentiment = async () => {
    setIsSyncingSentiment(true);
    try {
      const res = await predictMarketSentiment([]);
      setSentimentAlpha(res.sentiment_alpha || 1.0);
      setSentimentReport(res.text);
      notify('success', 'SENTIMENT_SYNCED', 'Global market resonance alpha recalibrated.');
    } catch (e) {
      notify('error', 'SYNC_FAILED', 'Oracle connection interrupted.');
    } finally {
      setIsSyncingSentiment(false);
    }
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  const combinedCatalogue = useMemo(() => {
    const list: any[] = [];
    vendorProducts.forEach(p => list.push({
      id: p.id, name: p.name, category: p.category, 
      price: Math.ceil(p.price * (sentimentAlpha || 1)),
      provider: p.supplierName, desc: p.description, thumb: p.image || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600',
      type: p.supplierType, status: p.status, esin: p.supplierEsin,
      vouchCount: Math.floor(Math.random() * 50) + 10
    }));
    projects.forEach(p => list.push({
      id: p.id, name: p.name, category: 'Investment Shard', 
      price: Math.ceil((p.totalCapital / p.totalBatches) * (sentimentAlpha || 1)),
      provider: 'Registry Vetting Node', desc: p.description, thumb: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=600',
      type: 'Mission', status: 'AUTHORIZED', esin: p.adminEsin,
      vouchCount: p.memberCount || 0
    }));
    return list;
  }, [vendorProducts, projects, sentimentAlpha]);

  const filteredCatalogue = useMemo(() => 
    combinedCatalogue.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [combinedCatalogue, searchTerm]
  );

  const handleAddToCart = (item: any) => {
    setCart(prev => [...prev, { ...item, cartId: Math.random() }]);
    notify('info', 'ITEM_ADDED', `${item.name} buffered for settlement.`);
  };

  const handleExecuteCheckout = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsFinalizing(true);
    try {
      if (await onSpendEAC(cartTotal, `INDUSTRIAL_SETTLEMENT_BATCH_${cart.length}`)) {
        cart.forEach(item => {
          onPlaceOrder({
            itemId: item.id,
            itemName: item.name,
            itemType: item.category,
            itemImage: item.thumb,
            cost: item.price,
            supplierEsin: item.esin,
            sourceTab: 'market'
          });
        });
        setCheckoutStep('success');
        setCart([]);
        notify('success', 'LEDGER_ANCHORED', 'Trade batch successfully sharded into network ledger.');
      }
    } catch (e) {
      console.error(e);
      notify('error', 'SETTLEMENT_ERROR', 'Consensus failure during finality.');
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Industrial Price HUD */}
      <div className="flex overflow-x-auto scrollbar-hide gap-6 py-5 border-y border-white/5 bg-black/60 px-8 shrink-0 relative z-10 rounded-[32px]">
        <div className="flex items-center gap-4 shrink-0 pr-8 border-r border-white/10">
           <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
           <span className="text-[11px] font-black text-white uppercase tracking-[0.5em] italic">GLOBAL_FEED</span>
        </div>
        {[
          { l: 'MAIZE_INDEX', v: ticker.maize, d: '+0.01', c: 'text-emerald-400' },
          { l: 'NITROGEN_SHARD', v: ticker.nitrogen, d: '-0.02', c: 'text-rose-400' },
          { l: 'CARBON_CREDIT', v: ticker.carbon, d: '+0.12', c: 'text-emerald-400' },
          { l: 'TECH_M_CONSTANT', v: ticker.tech, d: '+0.45', c: 'text-indigo-400' },
          { l: 'MARKET_ALPHA', v: (sentimentAlpha * 100).toFixed(1), d: 'STABLE', c: 'text-blue-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-5 shrink-0 px-8 py-3 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-default group">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{item.l}</span>
             <div className="flex items-center gap-3">
                <span className="text-lg font-mono font-black text-white">{item.v}</span>
                <span className={`text-[10px] font-mono font-black ${item.c} bg-black/40 px-2 py-0.5 rounded`}>{item.d}</span>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Primary Hub HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[72px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Globe className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-56 h-56 rounded-[64px] bg-emerald-600 shadow-[0_0_120px_rgba(16,185,129,0.4)] flex items-center justify-center ring-[12px] ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <ShoppingBag size={110} className="text-white animate-float" />
                 <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[64px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                    <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">MARKET_CLOUD_v6.5</span>
                    <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">TRUST_ALPHA: {sentimentAlpha.toFixed(2)}</span>
                 </div>
                 <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.8] drop-shadow-2xl">TRADING <br/> <span className="text-emerald-400">QUORUM.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating industrial settlements between global supplier nodes and community stewards. Prices are algorithmically weighted by the planetary resonance index."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-6 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.8em] mb-6 italic opacity-60">SENTIMENT_ORACLE</p>
              <button 
                onClick={handleSyncSentiment}
                disabled={isSyncingSentiment}
                className="w-full py-12 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[48px] hover:bg-indigo-600 hover:text-white transition-all group/oracle flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/oracle:opacity-100 transition-opacity animate-pulse"></div>
                 {isSyncingSentiment ? <Loader2 size={64} className="animate-spin text-indigo-400" /> : <Bot size={64} className="text-indigo-400 group-hover/oracle:text-white transition-colors" />}
                 <span className="text-[13px] font-black uppercase tracking-[0.4em] leading-none relative z-10">{isSyncingSentiment ? 'CALCULATING...' : 'RECALIBRATE ALPHA'}</span>
              </button>
           </div>
           {sentimentReport && (
             <div className="p-8 bg-indigo-500/5 rounded-[32px] border border-indigo-500/10 mt-8 animate-in slide-in-from-top-4 text-left shadow-inner">
                <p className="text-[11px] text-indigo-300 italic leading-relaxed font-medium">"{sentimentReport.substring(0, 150)}..."</p>
             </div>
           )}
        </div>
      </div>

      {/* 3. Global Navigation Shards */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[48px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 overflow-x-auto scrollbar-hide">
           {[
             { id: 'catalogue', label: 'Asset Ledger', icon: LayoutGrid },
             { id: 'forecasting', label: 'Demand Matrix', icon: BarChart3 },
             { id: 'routing', label: 'Relay Nodes', icon: Network },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-12 py-6 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-[12px] ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={20} /> {tab.label}
             </button>
           ))}
         </div>

         <div className="flex gap-4">
           <button 
             onClick={() => setShowCheckoutModal(true)}
             disabled={cart.length === 0}
             className="relative px-14 py-6 bg-emerald-600 hover:bg-emerald-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.3em] transition-all shadow-3xl flex items-center gap-6 active:scale-95 disabled:opacity-30 group/cart ring-[12px] ring-emerald-500/5 border-2 border-white/10"
           >
              <ShoppingCart size={24} className="group-hover/cart:rotate-12 transition-transform" />
              <span>Industrial Procurements</span>
              {cart.length > 0 && (
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center font-black border-4 border-[#050706] shadow-2xl animate-bounce text-lg">
                  {cart.length}
                </div>
              )}
           </button>
         </div>
      </div>

      {/* 4. Main Viewport Container */}
      <div className="min-h-[900px] relative z-10">
        
        {/* --- VIEW: ASSET LEDGER (CATALOGUE) --- */}
        {activeTab === 'catalogue' && (
          <div className="space-y-20 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="flex flex-col xl:flex-row justify-between items-center gap-10 border-b border-white/5 pb-20 px-8">
                <div className="relative flex-1 w-full max-w-5xl group">
                   <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-700 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Search Global Registry for Shards, Lineages or Tools..." 
                     className="w-full bg-black/60 border-2 border-white/5 rounded-[48px] py-10 pl-24 pr-12 text-2xl text-white focus:outline-none focus:ring-[16px] focus:ring-emerald-500/5 transition-all font-mono italic shadow-inner placeholder:text-stone-900" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 px-8">
                {filteredCatalogue.map(item => (
                  <div key={item.id} className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 hover:border-emerald-500/40 transition-all flex flex-col group active:scale-[0.99] duration-500 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-black/40 relative">
                     {/* Industrial Holographic FX */}
                     <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity z-10 overflow-hidden">
                        <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/30 via-emerald-500/5 to-transparent absolute top-0 animate-scan"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                     </div>

                     <div className="h-96 relative overflow-hidden bg-slate-900 shrink-0 border-b border-white/5">
                        <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[15s] opacity-50 group-hover:opacity-100 grayscale-[0.5] group-hover:grayscale-0" alt={item.name} />
                        <div className="absolute top-10 left-10 flex flex-col gap-4">
                           <span className="px-6 py-2.5 backdrop-blur-3xl rounded-full text-[11px] font-black uppercase tracking-[0.4em] border shadow-3xl flex items-center gap-4 bg-black/80 text-white border-white/10 ring-4 ring-white/5">
                             <Stamp size={16} className="text-emerald-400" /> {item.category.toUpperCase()}
                           </span>
                        </div>
                        <div className="absolute top-10 right-10">
                           <div className="p-5 bg-blue-600/30 border-2 border-blue-500/40 rounded-3xl backdrop-blur-2xl flex flex-col items-center gap-2 shadow-2xl group-hover:scale-110 transition-all">
                              <Sparkles size={20} className="text-blue-400 animate-pulse" />
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">ALPHA</span>
                              <span className="text-2xl font-mono font-black text-white">{sentimentAlpha.toFixed(2)}</span>
                           </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                     </div>

                     <div className="p-12 flex-1 flex flex-col justify-between relative z-20">
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                              <p className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{item.id} // PILLAR_SYNC</p>
                              {item.status === 'AUTHORIZED' ? (
                                <BadgeCheck className="text-emerald-500 w-7 h-7 shadow-[0_0_20px_#10b98144]" />
                              ) : (
                                <Clock className="text-amber-500 w-7 h-7 animate-pulse" />
                              )}
                           </div>
                           <h4 className="text-4xl font-black text-white uppercase italic leading-[0.9] group-hover:text-emerald-400 transition-colors m-0 tracking-tighter drop-shadow-2xl">{item.name}</h4>
                           <p className="text-base text-slate-500 leading-relaxed italic line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity font-medium">"{item.desc}"</p>
                           
                           <div className="flex items-center gap-6 pt-4">
                              <div className="flex items-center gap-3">
                                 <ThumbsUp size={14} className="text-emerald-500" />
                                 <span className="text-[11px] font-black text-slate-600 uppercase">{item.vouchCount} VOUCHES</span>
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                              <div className="flex items-center gap-3">
                                 <Building size={14} className="text-indigo-400" />
                                 <span className="text-[11px] font-black text-slate-600 uppercase">ORG_CORE</span>
                              </div>
                           </div>
                        </div>

                        <div className="pt-12 border-t border-white/5 flex items-end justify-between mt-12">
                           <div className="space-y-2">
                              <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.4em] leading-none">Settlement Mass</p>
                              <p className="text-5xl font-mono font-black text-white tracking-tighter">{item.price} <span className="text-lg text-emerald-500 italic font-sans ml-1">EAC</span></p>
                           </div>
                           <button 
                              onClick={() => handleAddToCart(item)}
                              className="p-10 rounded-[44px] bg-emerald-600 hover:bg-emerald-500 text-white shadow-3xl transition-all active:scale-90 border-4 border-white/10 ring-[12px] ring-white/5 relative group/btn overflow-hidden"
                           >
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                              <Plus size={44} className="relative z-10" />
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
          <div className="space-y-16 animate-in zoom-in duration-700 px-8">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 glass-card p-16 rounded-[80px] border-2 border-white/5 bg-black/60 shadow-3xl relative overflow-hidden flex flex-col group">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden">
                      <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/10 to-transparent absolute top-0 animate-scan"></div>
                   </div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-center mb-20 relative z-10 px-6 gap-10">
                      <div className="flex items-center gap-10">
                         <div className="w-24 h-24 bg-emerald-600 rounded-[44px] shadow-[0_0_80px_rgba(16,185,129,0.4)] flex items-center justify-center border-4 border-white/10 relative overflow-hidden group-hover:rotate-6 transition-all">
                            <TrendingUp className="w-12 h-12 text-white" />
                         </div>
                         <div>
                            <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Commodity <span className="text-emerald-400">Resonance Matrix</span></h3>
                            <p className="text-slate-600 text-sm font-black uppercase tracking-[0.5em] mt-5 italic">Predictive Sustainability sharding v4.2</p>
                         </div>
                      </div>
                      <div className="text-right border-l-8 border-emerald-500/20 pl-12 py-4">
                         <p className="text-[11px] text-slate-700 font-black uppercase mb-3 tracking-widest">Global Alpha Momentum</p>
                         <p className="text-9xl font-mono font-black text-emerald-400 tracking-tighter leading-none drop-shadow-2xl italic">+18.4%</p>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[550px] w-full relative z-10 p-12 bg-black/80 rounded-[64px] border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={DEMAND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="t" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '24px' }} />
                            <Bar dataKey="market" fill="#10b981" radius={[20, 20, 0, 0]} barSize={80} opacity={0.6} />
                            <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={8} dot={{ r: 10, fill: '#3b82f6', stroke: '#fff', strokeWidth: 5 }} />
                            <Area type="monotone" dataKey="resonance" fill="rgba(99, 102, 241, 0.05)" stroke="none" />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-10 flex flex-col">
                   <div className="glass-card p-12 rounded-[72px] border-2 border-indigo-500/20 bg-indigo-950/10 flex flex-col justify-center items-center text-center space-y-14 shadow-3xl relative overflow-hidden flex-1 group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Bot size={500} className="text-indigo-400" /></div>
                      <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 relative z-10 group-hover:scale-110 transition-transform duration-700 animate-float">
                         <Bot size={70} className="text-white" />
                      </div>
                      <div className="space-y-8 relative z-10">
                         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Price <span className="text-indigo-400">Oracle</span></h4>
                         <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-10">
                            "Sustainability resonance is stable. High-Density (Dn) shards are trending for Cycle 12 finality. Strategic purchase of Nitrogen is advised."
                         </p>
                      </div>
                      <div className="p-12 bg-black/80 rounded-[56px] border-2 border-indigo-500/20 w-[90%] relative z-10 shadow-inner group-hover:border-indigo-400 transition-colors">
                         <p className="text-[11px] text-slate-700 uppercase font-black tracking-[0.5em] mb-4">Sync Confidence</p>
                         <p className="text-8xl font-mono font-black text-indigo-400 tracking-tighter leading-none drop-shadow-2xl">99<span className="text-3xl italic font-sans text-indigo-800 ml-1">.8%</span></p>
                      </div>
                   </div>

                   <div className="p-12 glass-card rounded-[64px] border-2 border-emerald-500/20 bg-emerald-500/5 space-y-10 shadow-xl relative overflow-hidden group/m">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/m:rotate-12 transition-transform duration-1000"><Zap size={200} className="text-emerald-400" /></div>
                      <div className="flex items-center gap-6 relative z-10">
                         <TrendingUp className="w-10 h-10 text-emerald-400" />
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">Market Voids</h4>
                      </div>
                      <p className="text-slate-400 text-lg italic leading-relaxed relative z-10 border-l-[6px] border-emerald-500/20 pl-10 py-2">
                         "Low m-constant variance detected in urban vertical clusters. Immediate opportunity for Nitrogen sharding injection."
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: RELAY NODES (ROUTING) --- */}
        {activeTab === 'routing' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 px-8">
              <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-16">
                 <div className="space-y-6">
                    <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">LOGISTICS <span className="text-indigo-400">MESH</span></h3>
                    <p className="text-slate-500 text-2xl font-medium italic opacity-80">"Mapping the cryptographic and physical pathways of agricultural settlement."</p>
                 </div>
                 <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[56px] text-center shadow-3xl flex flex-col items-center">
                    <p className="text-[11px] text-indigo-400 font-black uppercase tracking-[0.5em] mb-4">Registry Latency</p>
                    <p className="text-7xl font-mono font-black text-white leading-none">12<span className="text-2xl text-indigo-800 italic ml-1">ms</span></p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {LOGISTICS_NODES.map(node => (
                    <div key={node.id} className={`glass-card p-14 rounded-[80px] border-2 transition-all flex flex-col justify-between h-[720px] bg-black/40 shadow-3xl relative overflow-hidden group hover:border-indigo-500/40 active:scale-[0.99] duration-500`}>
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[15s]"><Network size={400} className="text-indigo-400" /></div>
                       
                       <div className="space-y-12 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className={`p-8 rounded-[40px] bg-white/5 border border-white/10 ${node.color} shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all`}>
                                <Truck size={56} />
                             </div>
                             <div className="text-right">
                                <span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase border tracking-widest shadow-lg ${node.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'}`}>{node.status}</span>
                                <p className="text-[12px] text-slate-700 font-mono font-black mt-5 uppercase tracking-widest italic">{node.id}</p>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-[0.9] group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{node.name}</h4>
                             <p className="text-[12px] text-slate-600 font-mono font-black uppercase tracking-widest mt-6 italic">m-Resonance Index: {node.resonance}x</p>
                          </div>
                          <div className="p-12 bg-black/80 rounded-[56px] border border-white/5 space-y-8 shadow-inner group-hover:border-indigo-500/20 transition-all">
                             <div className="flex justify-between items-center text-[12px] font-black uppercase text-slate-600 tracking-widest">
                                <span>Relay Mesh Load</span>
                                <span className="text-white font-mono">{node.load}%</span>
                             </div>
                             <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div className={`h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.8)] transition-all duration-[3s]`} style={{ width: `${node.load}%` }}></div>
                             </div>
                          </div>
                       </div>

                       <div className="relative z-10 pt-12 border-t border-white/5">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-4">
                                <Clock size={20} className="text-slate-600" />
                                <span className="text-3xl font-mono font-black text-white">{node.latency}</span>
                             </div>
                             <button className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-full shadow-2xl transition-all active:scale-90 border border-white/10">INSPECT RELAY</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* 5. CHECKOUT MODAL - Refined to match screenshot mockup exactly */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => { if(checkoutStep!=='success') setShowCheckoutModal(false); }}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_250px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-emerald-600/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_#10b98144] border-4 border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <div className="text-white relative z-10 group-hover:scale-110 transition-transform font-mono text-3xl font-black">01<br/>10</div>
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Procurement <span className="text-emerald-400">Finality</span></h3>
                       <p className="text-emerald-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">ZK_LEDGER_ANCHOR // SESSION: 0x882A_P4</p>
                    </div>
                 </div>
                 {checkoutStep !== 'success' && <button onClick={() => setShowCheckoutModal(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl"><X size={32} /></button>}
              </div>

              <div className="flex gap-4 px-16 pt-8 shrink-0">
                 {['review', 'signing', 'success'].map((s, i) => {
                    const stages = ['review', 'signing', 'success'];
                    const currentIdx = stages.indexOf(checkoutStep);
                    return (
                      <div key={s} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1.5 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]' : 'bg-white/10'}`}></div>
                        <span className={`text-[10px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-emerald-400' : 'text-slate-800'}`}>{s}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar flex flex-col bg-black/40">
                 {checkoutStep === 'review' && (
                    <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 flex-1">
                       <div className="space-y-8">
                          <h4 className="text-[13px] font-black text-slate-600 uppercase tracking-[0.6em] px-6 italic">BUFFERED_SHARDS ({cart.length})</h4>
                          <div className="space-y-6">
                             {cart.map((item, idx) => (
                                <div key={idx} className="p-8 bg-black/90 rounded-[48px] border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all shadow-2xl relative overflow-hidden">
                                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
                                   <div className="flex items-center gap-10 relative z-10">
                                      <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/10 shadow-3xl grayscale group-hover:grayscale-0 transition-all duration-700">
                                         <img src={item.thumb} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <div className="space-y-2">
                                         <p className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{item.name}</p>
                                         <p className="text-[10px] text-slate-600 font-mono font-bold">ID: {item.id} // PILLAR: {item.category.toUpperCase()}</p>
                                      </div>
                                   </div>
                                   <div className="text-right relative z-10">
                                      <p className="text-4xl font-mono font-black text-emerald-400">{item.price} <span className="text-xl">EAC</span></p>
                                      <button 
                                        onClick={() => setCart(cart.filter(i => i.cartId !== item.cartId))}
                                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors mt-3 flex items-center gap-2 ml-auto"
                                      >
                                         <Trash2 size={12} /> REMOVE SHARD
                                      </button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* MOCK-UP SUMMARY SECTION */}
                       <div className="p-14 bg-black rounded-[64px] border-2 border-white/5 shadow-3xl flex flex-col md:flex-row justify-between items-center gap-12 group/total mt-auto relative overflow-hidden">
                          <div className="text-center md:text-left space-y-3 relative z-10">
                             <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em] italic">AGGREGATE LEDGER MASS</p>
                             <div className="flex items-baseline gap-4">
                                <p className="text-9xl font-mono font-black text-white tracking-tighter drop-shadow-2xl">{cartTotal}</p>
                                <span className="text-5xl text-emerald-400 font-black italic">EAC</span>
                             </div>
                          </div>
                       </div>

                       {/* MOCK-UP ACTION BUTTON - WHITE PILL STYLE */}
                       <div className="flex justify-center pt-10">
                          <button 
                            onClick={() => setCheckoutStep('signing')}
                            className="w-full py-12 bg-white rounded-full text-black font-black text-xl uppercase tracking-[0.3em] shadow-[0_0_120px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all border-8 border-indigo-500/20"
                          >
                             AUTHORIZE SHARDING
                          </button>
                       </div>
                    </div>
                 )}

                 {checkoutStep === 'signing' && (
                    <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center items-center text-center">
                       <div className="space-y-12 w-full max-w-2xl mx-auto">
                          <div className="space-y-8">
                             <div className="w-40 h-40 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[56px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative group overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                                <Fingerprint size={80} className="relative z-10 group-hover:scale-110 transition-transform" />
                             </div>
                             <h4 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Steward <span className="text-indigo-400">Signature</span></h4>
                             <p className="text-slate-400 text-2xl font-medium italic max-lg:text-lg max-w-lg mx-auto leading-relaxed opacity-80">"Signing this shard authorizes the transfer of {cartTotal} EAC from node {user.esin} to the supplier quorum."</p>
                          </div>

                          <div className="space-y-8">
                             <input 
                                type="text" 
                                value={esinSign} 
                                onChange={e => setEsinSign(e.target.value)} 
                                placeholder="NODE ESIN AUTHENTICATION" 
                                className="w-full bg-black border-2 border-white/10 rounded-[48px] py-14 text-center text-6xl font-mono text-white tracking-[0.2em] focus:ring-[16px] focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner italic" 
                             />
                             <div className="flex gap-8 px-6">
                                <button onClick={() => setCheckoutStep('review')} className="flex-1 py-10 bg-white/5 border border-white/10 rounded-[48px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back to Ledger</button>
                                <button 
                                  onClick={handleExecuteCheckout} 
                                  disabled={!esinSign || isFinalizing}
                                  className="flex-[2] py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_150px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                                >
                                   {isFinalizing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp className="w-10 h-10 fill-current" />}
                                   {isFinalizing ? "ANCHORING..." : "AUTHORIZE SETTLEMENT"}
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {checkoutStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-24 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-72 h-72 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_250px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 className="w-40 h-40 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-35px] rounded-full border-[6px] border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-8 text-center">
                          <h3 className="text-8xl md:text-9xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Ledger <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-base font-black uppercase tracking-[1em] font-mono mt-8">REGISTRY_HASH: 0x882_TRADE_OK_SYNC</p>
                       </div>
                       <div className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-emerald-500/5 space-y-10 max-w-2xl w-full shadow-3xl relative overflow-hidden group/success">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/success:rotate-12 transition-transform duration-[10s]"><Activity size={150} /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-8">
                             <span className="text-slate-500 font-black uppercase tracking-widest italic text-base">Capital Deployment</span>
                             <span className="text-white font-mono font-black text-5xl text-emerald-400">-{cartTotal} EAC</span>
                          </div>
                          <div className="h-px w-full bg-white/10 relative z-10"></div>
                          <p className="text-xl text-slate-400 italic px-10 text-center leading-loose relative z-10 font-medium">"Your procurement shards are now part of the global consensus quorum. Navigate to the TQM Hub to monitor lifecycle finality."</p>
                       </div>
                       <button onClick={() => { setShowCheckoutModal(false); setCheckoutStep('review'); setActiveTab('catalogue'); }} className="w-full max-w-md py-12 bg-white/5 border-2 border-white/10 rounded-[56px] text-white font-black text-[13px] uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-3xl active:scale-95 ring-[12px] ring-white/5">RETURN TO TRADING HUB</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Economy;