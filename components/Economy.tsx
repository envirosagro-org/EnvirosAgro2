import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  Coins, 
  TrendingUp, 
  Search, 
  Filter, 
  Tag, 
  ArrowUpRight, 
  ShieldCheck, 
  Wallet, 
  Activity, 
  Gem, 
  ArrowRightLeft, 
  Landmark, 
  Pickaxe, 
  Database, 
  ArrowRight, 
  Package, 
  BadgeCheck, 
  Fingerprint, 
  Sparkles, 
  SearchCode, 
  CheckCircle2, 
  RefreshCw, 
  Box, 
  MapPin, 
  Terminal,
  HeartHandshake,
  Rocket,
  Recycle,
  Briefcase,
  Binoculars,
  Store,
  ExternalLink,
  Cpu,
  Loader2,
  Globe,
  Star,
  Binary,
  ShieldAlert,
  LineChart as LineChartIcon,
  BarChart3,
  BarChart4,
  ArrowDownUp,
  History,
  TrendingDown,
  Scale,
  Target,
  /* Fix: Added Bot icon to the imports to resolve the 'Cannot find name Bot' error on line 486 */
  Bot
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { User, ViewState } from '../types';
import { predictMarketTrends, AIResponse } from '../services/geminiService';

interface EconomyProps {
  user: User;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const CLOUD_CATALOGUE = [
  { id: 'SRV-882', name: 'Soil DNA Sequencing Service', source: 'Nexus CRM', category: 'Services', price: 250, provider: 'Bantu Labs', trust: 98, thumb: 'https://images.unsplash.com/photo-1579152128802-e95b9b1ad75a?q=80&w=400', verified: true },
  { id: 'PRD-104', name: 'Precision N-P-K Sensor Array', source: 'Vendor Registry', category: 'Products', price: 1200, provider: 'Silicon Soil', stock: '12 Units', verified: true, thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400' },
  { id: 'MSN-042', name: 'Bantu Soil Restoration Shard', source: 'Collectives', category: 'Missions', price: 500, provider: 'Soil Guardians', progress: 42, bounty: '5,000 EAC', verified: true, thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400' },
  { id: 'CIR-091', name: 'Refurbished Spectral Drone v2', source: 'Circular Grid', category: 'Circular', price: 850, provider: 'Eco-Recycle Hub', condition: 'Certified', verified: true, thumb: 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=400' },
  { id: 'CTR-221', name: 'Maize Export Growth Contract', source: 'Contract Farming', category: 'Contracts', price: 5000, provider: 'Global Grain Fund', duration: '6 Months', verified: true, thumb: 'https://images.unsplash.com/photo-1551727041-5b347d65b633?q=80&w=400' },
  { id: 'WLD-442', name: 'Savannah Midnight Safari Shard', source: 'Agro Wild', category: 'Tourism', price: 150, provider: 'WildWatchers', duration: '4 Hours', verified: true, thumb: 'https://images.unsplash.com/photo-1516422317184-268d71010020?q=80&w=400' },
  { id: 'OFF-001', name: 'Institutional EAC Utility Bridge', source: 'EnvirosAgro Store', category: 'Official', price: 100, provider: 'EnvirosAgro', desc: 'Official network bridge license.', verified: true, thumb: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400' },
  { id: 'EXT-991', name: 'Bio-Polymer Mulch Roll', source: 'External E-commerce', category: 'External', price: 45, provider: 'Amazon Agro', link: 'https://amazon.com', verified: false, thumb: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400' },
];

const FORECAST_CHART_DATA = [
  { time: 'T-6', demand: 420, supply: 380 },
  { time: 'T-5', demand: 450, supply: 410 },
  { time: 'T-4', demand: 580, supply: 440 },
  { time: 'T-3', demand: 720, supply: 500 },
  { time: 'T-2', demand: 850, supply: 520 },
  { time: 'T-1', demand: 940, supply: 580 },
  { time: 'NOW', demand: 1100, supply: 620 },
];

const FORECAST_FEE = 25;

const Economy: React.FC<EconomyProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'market' | 'mining' | 'forecasting'>('market');
  const [cloudFilter, setCloudFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mining States
  const [isMining, setIsMining] = useState(false);
  const [miningPulse, setMiningPulse] = useState(0);
  const [miningLog, setMiningLog] = useState<string[]>([]);
  const [miningStats, setMiningStats] = useState({ hashed: 124, rewarded: 42.5 });

  // Forecasting States
  const [forecastCrop, setForecastCrop] = useState('Maize');
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastResult, setForecastResult] = useState<AIResponse | null>(null);

  const categories = [
    { id: 'All', icon: Globe },
    { id: 'Services', icon: HeartHandshake },
    { id: 'Products', icon: Package },
    { id: 'Missions', icon: Rocket },
    { id: 'Circular', icon: Recycle },
    { id: 'Contracts', icon: Briefcase },
    { id: 'Tourism', icon: Binoculars },
    { id: 'Official', icon: Store },
    { id: 'External', icon: ShoppingBag },
  ];

  const filteredCatalogue = CLOUD_CATALOGUE.filter(item => {
    const matchesFilter = cloudFilter === 'All' || item.category === cloudFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handlePurchase = (item: any) => {
    if (item.category === 'External') {
       window.open(item.link, '_blank');
       return;
    }
    if (onSpendEAC(item.price, `CLOUD_ACQUISITION_${item.id}`)) {
      alert(`SYNC SUCCESS: ${item.name} from ${item.source} has been anchored to node ${user.esin}.`);
    }
  };

  const startMiningCycle = () => {
    if (isMining) return;
    setIsMining(true);
    setMiningLog(["Handshake initialized...", "Locating unverified network shards..."]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setMiningPulse(progress);
      if (progress === 30) setMiningLog(prev => [...prev, "Syncing ESIN with regional relay..."]);
      if (progress === 60) setMiningLog(prev => [...prev, "Validation quorum reached. Minting EAC..."]);
      if (progress === 90) setMiningLog(prev => [...prev, "Committing hash to Ledger..."]);
      if (progress >= 100) {
        clearInterval(interval);
        setIsMining(false);
        setMiningPulse(0);
        setMiningStats(prev => ({ hashed: prev.hashed + 1, rewarded: prev.rewarded + 1.5 }));
        if (onEarnEAC) onEarnEAC(1.5, 'REACTION_MINING_REWARD');
        setMiningLog(prev => [...prev, "BLOCK FINALIZED: +1.5 EAC Reward Released."]);
      }
    }, 150);
  };

  const handleInitializeForecast = async () => {
    if (!forecastCrop.trim()) return;
    
    // Spend Fee for AI Oracle
    if (!onSpendEAC(FORECAST_FEE, `MARKET_FORECAST_${forecastCrop.toUpperCase()}`)) {
      alert("LIQUIDITY ERROR: Insufficient EAC for forecasting handshake.");
      return;
    }

    setIsForecasting(true);
    setForecastResult(null);

    try {
      const res = await predictMarketTrends(forecastCrop);
      setForecastResult(res);
    } catch (e) {
      alert("Oracle Error: Neural Shard Congestion.");
    } finally {
      setIsForecasting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-1 md:px-0">
      
      {/* Header with Cloud Branding */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 agro-gradient rounded-2xl flex items-center justify-center text-white shadow-xl">
             <Globe className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic m-0">Market <span className="text-emerald-400">Cloud</span></h1>
            <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">EnvirosAgro™ Unified Commerce Mesh</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-4 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full md:w-auto overflow-x-auto scrollbar-hide">
          {[
            { id: 'finance', label: 'Treasury', icon: Landmark },
            { id: 'market', label: 'Market Cloud', icon: Globe },
            { id: 'mining', label: 'Mining Console', icon: Pickaxe },
            { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none text-white"><Coins size={240} /></div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                    <Coins className="w-8 h-8 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">Utility Shard</span>
               </div>
               <div className="space-y-2 relative z-10">
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em]">EAC Cash Balance</p>
                  <h3 className="text-6xl font-mono font-black text-white">{user.wallet.balance.toFixed(0)} <span className="text-xl text-emerald-500">EAC</span></h3>
               </div>
            </div>

            <div className="glass-card p-10 rounded-[48px] border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none text-white"><Gem size={240} /></div>
               <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="p-4 bg-yellow-600 rounded-3xl shadow-xl">
                    <Gem className="w-8 h-8 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase rounded-full border border-yellow-500/20 tracking-widest">Equity Shard</span>
               </div>
               <div className="space-y-2 relative z-10">
                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em]">EAT Gold Balance</p>
                  <h3 className="text-6xl font-mono font-black text-white">{user.wallet.eatBalance.toFixed(4)} <span className="text-xl text-yellow-500">EAT</span></h3>
               </div>
            </div>
          </div>

          <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden shadow-3xl text-center space-y-8 mx-4">
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Personalized Bridge Multiplier</h3>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto italic font-medium leading-relaxed">"Your buying power is linked to your m™ Constant. Improve your farm's resilience to unlock deeper utility rates."</p>
             <div className="flex justify-center gap-12 pt-4">
                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Utility Index</p><p className="text-4xl font-mono font-black text-emerald-400">{(600 / user.wallet.exchangeRate).toFixed(1)}x</p></div>
                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Bridge Rate</p><p className="text-4xl font-mono font-black text-white">{user.wallet.exchangeRate.toFixed(1)}</p></div>
             </div>
             <button onClick={() => onNavigate('wallet')} className="px-12 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 mx-auto active:scale-95">
                <ArrowRightLeft className="w-5 h-5" /> Open Treasury Node
             </button>
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col gap-6 border-b border-white/5 pb-8 px-2 md:px-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                 <div className="relative flex-1 w-full max-w-2xl group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search Market Cloud Shards (Services, Products, Projects)..." 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all font-mono" 
                    />
                 </div>
                 <div className="flex items-center gap-3 px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <p className="text-[8px] md:text-[10px] text-emerald-400 font-black uppercase tracking-widest">Aggregate Physical Verification Active</p>
                 </div>
              </div>

              <div className="flex overflow-x-auto scrollbar-hide gap-3 py-2 -mx-2 px-2">
                 {categories.map(cat => (
                   <button 
                     key={cat.id} 
                     onClick={() => setCloudFilter(cat.id)}
                     className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${cloudFilter === cat.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                   >
                      <cat.icon size={14} /> {cat.id}
                   </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-2 md:px-4">
              {filteredCatalogue.map(item => (
                <div key={item.id} className="glass-card rounded-[32px] md:rounded-[44px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group active:scale-[0.98] duration-300 shadow-xl bg-black/40">
                   <div className="h-48 md:h-56 relative overflow-hidden shrink-0">
                      <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[6s]" alt={item.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/10">{item.source}</span>
                      </div>
                      {item.verified && (
                        <div className="absolute top-4 right-4">
                           <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-xl">
                              <BadgeCheck size={14} className="text-emerald-400" />
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between items-start">
                            <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-tight italic truncate max-w-[70%] m-0">{item.name}</h4>
                            <span className="text-[10px] font-mono font-black text-slate-700">{item.id}</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-500">
                            {item.category === 'Services' ? <HeartHandshake size={12} className="text-rose-400" /> : 
                             item.category === 'Tourism' ? <Binoculars size={12} className="text-amber-400" /> :
                             <Activity size={12} className="text-emerald-400" />}
                            <span className="text-[9px] font-black uppercase tracking-widest truncate">{item.provider}</span>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="space-y-0.5">
                            <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Protocol Bounty</p>
                            <p className="text-2xl font-mono font-black text-white">{item.price.toLocaleString()} <span className="text-xs text-emerald-500">EAC</span></p>
                         </div>
                         <button 
                           onClick={() => handlePurchase(item)}
                           className={`p-4 md:p-5 rounded-[20px] md:rounded-[28px] transition-all border border-white/10 shadow-xl active:scale-90 ${
                              item.category === 'External' ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                           }`}
                         >
                            {item.category === 'External' ? <ExternalLink size={20} /> : <ShoppingBag size={20} />}
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'mining' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500 px-4">
           <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                       <Pickaxe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic m-0">Reaction <span className="text-emerald-400">Mining Console</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.4em] uppercase mt-2">VALIDATOR_NODE_#842 // STABLE_INGEST</p>
                    </div>
                 </div>
                 <div className="text-left sm:text-right">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Mining Power</p>
                    <p className="text-2xl font-mono font-black text-white">1.42 TH/s</p>
                 </div>
              </div>
              <div className="flex-1 bg-black/60 rounded-[48px] border border-white/10 p-6 md:p-10 flex flex-col gap-10 relative overflow-hidden shadow-inner min-h-[300px]">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-white"><Database size={240} /></div>
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 space-y-4 font-mono text-[10px]">
                    {miningLog.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                         <Terminal size={48} className="text-white" />
                         <p className="uppercase tracking-[0.5em] font-black text-white">Waiting for initiation...</p>
                      </div>
                    ) : (
                      miningLog.map((log, i) => (
                        <div key={i} className="flex gap-4 animate-in slide-in-from-left duration-300">
                           <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                           <span className={log.includes('REWARD') ? 'text-emerald-400 font-black' : 'text-slate-400'}>{log}</span>
                        </div>
                      ))
                    )}
                 </div>
                 <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex justify-between items-center px-4">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Cycle Progress</p>
                       <span className="text-xs font-mono text-emerald-400">{miningPulse}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                       <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] transition-all duration-300" style={{ width: `${miningPulse}%` }}></div>
                    </div>
                    <button onClick={startMiningCycle} disabled={isMining} className={`w-full py-8 rounded-[32px] text-sm font-black uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-6 mx-auto ${isMining ? 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed' : 'agro-gradient text-white hover:scale-[1.02] active:scale-95 shadow-emerald-900/40'}`}>
                       {isMining ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                       {isMining ? "FORGING SHARD..." : "INITIALIZE MINTING HANDSHAKE"}
                    </button>
                 </div>
              </div>
           </div>
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform text-indigo-400"><Binary className="w-48 h-48" /></div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                       <Activity className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Mining <span className="text-indigo-400">Stats</span></h4>
                 </div>
                 <div className="space-y-6 relative z-10">
                    <div className="p-6 bg-black/60 rounded-3xl border border-white/5">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Shards Validated</p>
                       <p className="text-4xl font-mono font-black text-white">{miningStats.hashed}</p>
                    </div>
                    <div className="p-6 bg-black/60 rounded-3xl border border-white/5">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">EAC Rewards Minted</p>
                       <p className="text-4xl font-mono font-black text-emerald-400">+{miningStats.rewarded.toFixed(1)}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- NEW SECTION: DEMAND AND SUPPLY FORECASTING --- */}
      {activeTab === 'forecasting' && (
        <div className="space-y-10 animate-in zoom-in duration-500 px-4">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Forecast Console */}
              <div className="lg:col-span-7 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                 <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                 <div className="relative z-10 flex justify-between items-center mb-10 px-4">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-900/40">
                          <TrendingUp className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Demand & <span className="text-indigo-400">Supply Oracle</span></h3>
                          <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-2">NEURAL_PREDICTION_v5.0 // EOS_CORE</p>
                       </div>
                    </div>
                 </div>

                 <div className="h-[400px] w-full relative z-10 min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={FORECAST_CHART_DATA}>
                          <defs>
                             <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #818cf822', borderRadius: '16px' }} />
                          <Area type="monotone" dataKey="demand" stroke="#818cf8" strokeWidth={5} fillOpacity={1} fill="url(#colorDemand)" />
                          <Area type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorSupply)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 pt-8 mt-10 border-t border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(129,140,248,0.5)]"></div>
                       <div><p className="text-[8px] text-slate-500 font-black uppercase">Market Demand Index</p><p className="text-xl font-mono font-black text-white">UPWARD_DELTA</p></div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                       <div><p className="text-[8px] text-slate-500 font-black uppercase">Network Supply Shard</p><p className="text-xl font-mono font-black text-white">CONSTRAINED</p></div>
                    </div>
                 </div>
              </div>

              {/* AI Prediction Sidebar */}
              <div className="lg:col-span-5 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform text-white"><Sparkles size={160} /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-3 bg-indigo-500 rounded-2xl shadow-xl">
                          <Bot className="w-6 h-6 text-white" />
                       </div>
                       <h4 className="text-xl font-black text-white uppercase italic">Neural <span className="text-indigo-400">Forecaster</span></h4>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Commodity Shard</label>
                          <div className="relative">
                             <input 
                               type="text" 
                               value={forecastCrop}
                               onChange={e => setForecastCrop(e.target.value)}
                               placeholder="e.g. Maize, Soil Shards, Water Credits..." 
                               className="w-full bg-black/60 border border-white/10 rounded-[24px] py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-inner"
                             />
                             <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-[8px] font-black text-slate-700 uppercase">FEE: {FORECAST_FEE} EAC</span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={handleInitializeForecast}
                         disabled={!forecastCrop.trim() || isForecasting}
                         className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                       >
                          {isForecasting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                          {isForecasting ? 'ANALYZING MARKET MESH...' : 'INITIALIZE PREDICTION'}
                       </button>
                    </div>

                    {forecastResult ? (
                       <div className="animate-in slide-in-from-top-6 duration-700 p-8 glass-card rounded-[40px] bg-indigo-900/20 border-l-4 border-indigo-400 shadow-2xl relative overflow-hidden">
                          <div className="absolute bottom-0 right-0 p-4 opacity-5 text-white"><SearchCode size={80} /></div>
                          <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <CheckCircle2 size={12} /> Oracle Consensus Reach
                          </h5>
                          <div className="prose prose-invert max-w-none text-slate-300 text-sm italic leading-loose font-medium border-l-2 border-white/5 pl-6">
                             {forecastResult.text}
                          </div>
                       </div>
                    ) : isForecasting ? (
                       <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                          <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                          <p className="text-xs font-black uppercase tracking-[0.4em] text-white animate-pulse">Syncing Price Shards...</p>
                       </div>
                    ) : (
                       <div className="p-10 border-2 border-dashed border-white/10 rounded-[48px] flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                          <BarChart4 size={48} className="text-white" />
                          <p className="text-sm font-black uppercase tracking-[0.4em] text-white">Enter Asset Identity to Forecast</p>
                       </div>
                    )}
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-6 group">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xs font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-3">
                          <Target className="w-5 h-5" /> ROI ALERT
                       </h4>
                       <span className="text-[9px] font-black text-emerald-600 uppercase border border-emerald-500/20 px-2 py-0.5 rounded">AUTO_SYNC</span>
                    </div>
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                       "Regional imbalance detected in Zone 4. High demand for **Regen-Phosphate** expected in next cycle. Early sharding recommended for 14% yield optimization."
                    </p>
                    <div className="h-px bg-white/5 w-full"></div>
                    <button onClick={() => onNavigate('investor')} className="w-full text-center text-emerald-400 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest flex items-center justify-center gap-2">
                       Explore Investment Nodes <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default Economy;