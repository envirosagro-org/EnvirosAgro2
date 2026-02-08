
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

  // Sentiment Oracle State
  const [isSyncingSentiment, setIsSyncingSentiment] = useState(false);
  const [sentimentAlpha, setSentimentAlpha] = useState(1.0);
  const [sentimentReport, setSentimentReport] = useState<string | null>(null);

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1700px] mx-auto px-1 md:px-4 relative overflow-hidden">
      
      {/* 1. HUD Section - Standardized Hero Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 px-4">
        <div className="lg:col-span-8 glass-card p-8 md:p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-2xl">
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-[32px] bg-emerald-600 shadow-2xl flex items-center justify-center ring-4 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <ShoppingBag size={48} className="text-white animate-float" />
              </div>
           </div>
           <div className="space-y-3 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20 italic">MARKET_CLOUD_v6.5</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Trading <span className="text-emerald-400">Quorum.</span></h2>
              </div>
              <p className="text-slate-400 text-sm md:text-base font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Orchestrating industrial settlements between supplier nodes and stewards."
              </p>
           </div>
        </div>

        <div className="lg:col-span-4 glass-card p-8 rounded-[40px] border-2 border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group min-h-[250px]">
           <div className="space-y-3 relative z-10">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2 italic opacity-60">SENTIMENT_ORACLE</p>
              <button 
                onClick={handleSyncSentiment}
                disabled={isSyncingSentiment}
                className="w-full py-6 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[28px] hover:bg-indigo-600 hover:text-white transition-all group/oracle flex flex-col items-center gap-2 shadow-xl"
              >
                 {isSyncingSentiment ? <Loader2 size={24} className="animate-spin text-indigo-400" /> : <Bot size={24} className="text-indigo-400 group-hover/oracle:text-white transition-colors" />}
                 <span className="text-[9px] font-black uppercase tracking-widest">{isSyncingSentiment ? 'CALCULATING' : 'RECALIBRATE ALPHA'}</span>
              </button>
           </div>
           {sentimentReport && (
             <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10 mt-2 text-left shadow-inner">
                <p className="text-[8px] text-indigo-300 italic line-clamp-2">"{sentimentReport.substring(0, 100)}..."</p>
             </div>
           )}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4">
         <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[24px] w-full md:w-fit border border-white/5 bg-black/40 shadow-xl px-6 overflow-x-auto scrollbar-hide">
           {[
             { id: 'catalogue', label: 'Asset Ledger', icon: LayoutGrid },
             { id: 'forecasting', label: 'Demand Matrix', icon: BarChart3 },
             { id: 'routing', label: 'Relay Nodes', icon: Network },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
             >
               <tab.icon size={12} /> {tab.label}
             </button>
           ))}
         </div>
         <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Global Registry..." 
              className="w-full bg-black/60 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-mono italic shadow-inner" 
            />
         </div>
      </div>

      <div className="min-h-[500px] relative z-10">
        {/* VIEW: ASSET LEDGER */}
        {activeTab === 'catalogue' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
             {filteredCatalogue.map(item => (
               <div key={item.id} className="glass-card rounded-[40px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group shadow-xl bg-black/40 relative">
                  <div className="h-52 relative overflow-hidden bg-slate-900 shrink-0 border-b border-white/5">
                     <img src={item.thumb} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000" alt={item.name} />
                     <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 backdrop-blur-md rounded-lg text-[7px] font-black uppercase tracking-widest border bg-black/60 text-white border-white/10 flex items-center gap-1.5">
                          <Stamp size={10} className="text-emerald-400" /> {item.category.toUpperCase()}
                        </span>
                     </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                     <div className="space-y-3">
                        <p className="text-[7px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{item.id}</p>
                        <h4 className="text-lg font-black text-white uppercase italic leading-none group-hover:text-emerald-400 transition-colors m-0 tracking-tighter truncate">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed italic line-clamp-2 opacity-80 font-medium">"{item.desc}"</p>
                     </div>

                     <div className="pt-6 border-t border-white/5 flex items-end justify-between mt-6">
                        <div className="space-y-1">
                           <p className="text-[8px] text-slate-800 font-black uppercase tracking-widest leading-none">Settlement</p>
                           <p className="text-2xl font-mono font-black text-white tracking-tighter">{item.price}<span className="text-[10px] text-emerald-500 italic font-sans ml-1">EAC</span></p>
                        </div>
                        <button onClick={() => handleAddToCart(item)} className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-90 border border-white/10">
                           <Plus size={20} />
                        </button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* Other tabs simplified... */}
        {activeTab === 'forecasting' && (
          <div className="px-4 space-y-8 animate-in zoom-in duration-500">
             <div className="glass-card p-10 rounded-[40px] border border-white/5 bg-black/40 shadow-xl flex flex-col h-[500px]">
                <h3 className="text-xl font-black text-white uppercase italic tracking-widest mb-10">Predictive Demand Sharding</h3>
                <div className="flex-1 w-full">
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
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .shadow-3xl { box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.9); }
      `}</style>
    </div>
  );
};

export default Economy;
