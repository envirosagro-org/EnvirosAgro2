
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
    notify('info', 'ITEM_ADDED', `${item.name} buffered.`);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-1 md:px-4 relative overflow-hidden">
      
      {/* 1. Industrial Price HUD */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 py-4 border-y border-white/5 bg-black/60 px-4 shrink-0 relative z-10 rounded-2xl scroll-across snap-x">
        <div className="flex items-center gap-3 shrink-0 pr-4 border-r border-white/10 sticky left-0 bg-black/60 backdrop-blur-md z-20">
           <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
           <span className="text-[9px] font-black text-white uppercase tracking-widest italic">GLOBAL_FEED</span>
        </div>
        {[
          { l: 'MAIZE_INDEX', v: ticker.maize, d: '+0.01', c: 'text-emerald-400' },
          { l: 'NITROGEN_SHARD', v: ticker.nitrogen, d: '-0.02', c: 'text-rose-400' },
          { l: 'CARBON_CREDIT', v: ticker.carbon, d: '+0.12', c: 'text-emerald-400' },
          { l: 'TECH_M_CONSTANT', v: ticker.tech, d: '+0.45', c: 'text-indigo-400' },
          { l: 'MARKET_ALPHA', v: (sentimentAlpha * 100).toFixed(1), d: 'STABLE', c: 'text-blue-400' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 shrink-0 px-5 py-2.5 bg-white/[0.03] rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-default group snap-center">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">{item.l}</span>
             <div className="flex items-center gap-2">
                <span className="text-base font-mono font-black text-white">{item.v}</span>
                <span className={`text-[8px] font-mono font-black ${item.c} bg-black/40 px-1.5 py-0.5 rounded`}>{item.d}</span>
             </div>
          </div>
        ))}
      </div>

      {/* HUD Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 px-4">
        <div className="lg:col-span-8 glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Globe className="w-[500px] h-[500px] text-white" />
           </div>
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] md:rounded-[56px] bg-emerald-600 shadow-2xl flex items-center justify-center ring-4 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <ShoppingBag size={64} className="text-white animate-float" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[40px] md:rounded-[56px] animate-spin-slow"></div>
              </div>
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-3">
                 <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20 italic">MARKET_CLOUD_v6.5</span>
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase rounded-full tracking-widest border border-indigo-500/20 italic">ALPHA: {sentimentAlpha.toFixed(2)}</span>
                 </div>
                 <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">TRADING <br/> <span className="text-emerald-400">QUORUM.</span></h2>
              </div>
              <p className="text-slate-400 text-sm md:text-lg font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating industrial settlements between global supplier nodes and community stewards."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-8 rounded-[40px] md:rounded-[48px] border-2 border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group min-h-[300px]">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 italic opacity-60">SENTIMENT_ORACLE</p>
              <button 
                onClick={handleSyncSentiment}
                disabled={isSyncingSentiment}
                className="w-full py-8 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] hover:bg-indigo-600 hover:text-white transition-all group/oracle flex flex-col items-center gap-4 shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/oracle:opacity-100 transition-opacity animate-pulse"></div>
                 {isSyncingSentiment ? <Loader2 size={32} className="animate-spin text-indigo-400" /> : <Bot size={32} className="text-indigo-400 group-hover/oracle:text-white transition-colors" />}
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none relative z-10">{isSyncingSentiment ? 'CALCULATING' : 'RECALIBRATE'}</span>
              </button>
           </div>
           {sentimentReport && (
             <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 mt-4 animate-in slide-in-from-top-4 text-left shadow-inner">
                <p className="text-[9px] text-indigo-300 italic leading-relaxed font-medium line-clamp-2">"{sentimentReport.substring(0, 100)}..."</p>
             </div>
           )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4">
         <div className="flex flex-wrap md:flex-nowrap gap-2 p-1 glass-card rounded-[32px] w-full md:w-fit border border-white/5 bg-black/40 shadow-xl px-4 md:px-6 overflow-x-auto scrollbar-hide snap-x">
           {[
             { id: 'catalogue', label: 'Asset Ledger', icon: LayoutGrid },
             { id: 'forecasting', label: 'Demand Matrix', icon: BarChart3 },
             { id: 'routing', label: 'Relay Nodes', icon: Network },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 md:px-8 py-3 rounded-[24px] text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-center ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-2 border-indigo-400 ring-4 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={14} /> {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="min-h-[600px] relative z-10">
        
        {/* --- VIEW: ASSET LEDGER --- */}
        {activeTab === 'catalogue' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-1000">
             <div className="flex flex-col xl:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 px-8">
                <div className="relative flex-1 w-full max-w-2xl group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Search Global Registry..." 
                     className="w-full bg-black/60 border-2 border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner placeholder:text-stone-900" 
                   />
                </div>
             </div>

             <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-8 overflow-x-auto md:overflow-visible scrollbar-hide snap-x scroll-across -mx-4 md:mx-0">
                {filteredCatalogue.map(item => (
                  <div key={item.id} className="min-w-[280px] md:min-w-0 snap-center glass-card rounded-[64px] overflow-hidden border-2 border-white/5 hover:border-emerald-500/40 transition-all flex flex-col group active:scale-[0.99] duration-500 shadow-xl bg-black/40 relative h-full">
                     <div className="h-64 relative overflow-hidden bg-slate-900 shrink-0 border-b border-white/5">
                        <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s] opacity-50 group-hover:opacity-100" alt={item.name} />
                        <div className="absolute top-6 left-6">
                           <span className="px-4 py-1.5 backdrop-blur-3xl rounded-full text-[8px] font-black uppercase tracking-widest border shadow-xl flex items-center gap-2 bg-black/80 text-white border-white/10">
                             <Stamp size={12} className="text-emerald-400" /> {item.category.toUpperCase()}
                           </span>
                        </div>
                        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                           <div className="p-3 bg-blue-600/30 border border-blue-500/40 rounded-2xl backdrop-blur-2xl flex flex-col items-center gap-1 shadow-2xl">
                              <span className="text-[7px] font-black text-blue-400 uppercase leading-none">ALPHA</span>
                              <span className="text-sm font-mono font-black text-white">{sentimentAlpha.toFixed(2)}</span>
                           </div>
                           {item.status === 'AUTHORIZED' ? <BadgeCheck className="text-emerald-500 w-6 h-6" /> : <Clock className="text-amber-500 w-6 h-6 animate-pulse" />}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                     </div>

                     <div className="p-8 flex-1 flex flex-col justify-between relative z-20">
                        <div className="space-y-5">
                           <p className="text-[8px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{item.id}</p>
                           <h4 className="text-xl font-black text-white uppercase italic leading-none group-hover:text-emerald-400 transition-colors m-0 tracking-tighter truncate">{item.name}</h4>
                           <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity font-medium">"{item.desc}"</p>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex items-end justify-between mt-8">
                           <div className="space-y-1">
                              <p className="text-[8px] text-slate-800 font-black uppercase tracking-widest leading-none">Settlement</p>
                              <p className="text-3xl font-mono font-black text-white tracking-tighter">{item.price}<span className="text-sm text-emerald-500 italic font-sans ml-1">EAC</span></p>
                           </div>
                           <button onClick={() => handleAddToCart(item)} className="p-5 rounded-[28px] bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition-all active:scale-90 border border-white/10 group/btn">
                              <Plus size={24} className="relative z-10" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- VIEW: DEMAND MATRIX --- */}
        {activeTab === 'forecasting' && (
          <div className="space-y-12 animate-in zoom-in duration-500 px-8">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 relative overflow-hidden shadow-3xl flex flex-col">
                   <div className="flex flex-col md:flex-row justify-between items-center mb-12 relative z-10 gap-8">
                      <div className="flex items-center gap-6">
                         <div className="p-5 bg-indigo-600 rounded-[28px] shadow-xl"><TrendingUp className="w-8 h-8 text-white" /></div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Market <span className="text-indigo-400">Momentum</span></h3>
                            <p className="text-[10px] text-slate-600 font-black uppercase mt-2 italic">Predictive Sustainability Sharding</p>
                         </div>
                      </div>
                      <div className="text-right border-l-4 border-indigo-500/20 pl-8">
                         <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Global Index</p>
                         <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter leading-none">+18.4%</p>
                      </div>
                   </div>
                   <div className="h-[450px] w-full bg-black/40 rounded-[48px] p-8 border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={DEMAND_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="t" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Bar dataKey="market" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} opacity={0.6} />
                            <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
                         </ComposedChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border border-white/5 bg-black/60 flex flex-col items-center justify-center text-center space-y-8 shadow-xl">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-3xl animate-float"><Bot size={32} className="text-white" /></div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black text-white uppercase italic m-0">Price Oracle</h4>
                      <p className="text-[11px] text-slate-400 italic px-4 leading-relaxed">"Sustainability resonance is stable. High-Density (Dn) shards are trending for Cycle 12 finality."</p>
                   </div>
                   <div className="p-8 bg-black/80 rounded-[40px] border border-indigo-500/20 w-full shadow-inner">
                      <p className="text-[9px] text-slate-700 uppercase font-black mb-2">Oracle Sync</p>
                      <p className="text-5xl font-mono font-black text-indigo-400 tracking-tighter leading-none italic">99<span className="text-xl">.8%</span></p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: RELAY NODES --- */}
        {activeTab === 'routing' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {LOGISTICS_NODES.map(node => (
                   <div key={node.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col h-[480px] shadow-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Network size={200} /></div>
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${node.color} shadow-xl group-hover:rotate-6 transition-transform`}>
                            <Truck size={32} />
                         </div>
                         <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest ${node.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'}`}>{node.status}</span>
                            <p className="text-[9px] text-slate-700 font-mono mt-3 font-black uppercase">{node.id}</p>
                         </div>
                      </div>
                      <div className="flex-1 space-y-4 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{node.name}</h4>
                         <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest italic">m-Resonance Index: {node.resonance}x</p>
                         <div className="pt-6 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest px-2">
                               <span>Mesh Load</span>
                               <span className="text-white font-mono">{node.load}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                               <div className="h-full bg-indigo-500 rounded-full transition-all duration-[2s]" style={{ width: `${node.load}%` }}></div>
                            </div>
                         </div>
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-3">
                            <Clock size={14} className="text-slate-600" />
                            <span className="text-xl font-mono font-black text-white">{node.latency}</span>
                         </div>
                         <button className="px-10 py-4 bg-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white shadow-xl active:scale-90">Inspect Relay</button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.9); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Economy;
