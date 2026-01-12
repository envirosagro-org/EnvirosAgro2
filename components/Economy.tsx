
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  Upload, 
  Award, 
  Coins, 
  TrendingUp, 
  BarChart3, 
  Search, 
  Filter, 
  Tag, 
  ArrowUpRight, 
  Info,
  Clock,
  ShieldCheck,
  LayoutGrid,
  Wallet,
  Activity,
  Key,
  X,
  Loader2,
  Gem,
  ArrowRightLeft,
  Lock,
  Landmark,
  ShieldAlert,
  Binary,
  Sprout,
  Pickaxe,
  FileCheck,
  Database,
  ArrowRight,
  Package,
  HardHat,
  BadgeCheck,
  Fingerprint,
  Mic,
  Volume2,
  Sparkles,
  SearchCode,
  CheckCircle2,
  RefreshCw,
  Box,
  MapPin, // Added missing MapPin import
  Terminal
} from 'lucide-react';
import { User, ViewState } from '../types';

interface EconomyProps {
  user: User;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const MARKET_ITEMS = [
  { id: 'M-01', name: 'Certified Organic Maize Shard', category: 'Produce', price: 850, stock: '12 Tons', grade: 'A+', location: 'Zone 4 NE', thumb: 'https://images.unsplash.com/photo-1551727041-5b347d65b633?q=80&w=400' },
  { id: 'M-02', name: 'IoT Multi-Spectral Soil Probe', category: 'Hardware', price: 1200, stock: '4 Units', grade: 'Industrial', location: 'Global Ingest', thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400' },
  { id: 'M-03', name: 'Regen-Nitrogen Bio-Input', category: 'Inputs', price: 450, stock: '500 kg', grade: 'A', location: 'Nairobi Hub', thumb: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=400' },
  { id: 'M-04', name: 'Aesthetic Lily Seed Lineage', category: 'Produce', price: 120, stock: '25 Units', grade: 'S-Tier', location: 'Celestial Shard', thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400' },
];

const Economy: React.FC<EconomyProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'market' | 'mining'>('market');
  const [marketFilter, setMarketFilter] = useState('All');
  
  // Mining States
  const [isMining, setIsMining] = useState(false);
  const [miningPulse, setMiningPulse] = useState(0);
  const [pendingShard, setPendingShard] = useState<any>(null);
  const [miningLog, setMiningLog] = useState<string[]>([]);
  const [miningStats, setMiningStats] = useState({ hashed: 124, rewarded: 42.5 });

  const filteredMarket = marketFilter === 'All' ? MARKET_ITEMS : MARKET_ITEMS.filter(i => i.category === marketFilter);

  const handlePurchase = (item: any) => {
    if (onSpendEAC(item.price, `MARKET_PURCHASE_${item.id}`)) {
      alert(`ACQUISITION SUCCESS: Asset ${item.id} has been anchored to your node inventory.`);
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1500px] mx-auto">
      
      {/* Header Segment */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
             <Coins className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">Market & <span className="text-emerald-400">Mining Hub</span></h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Steward Utility Index: {user.metrics.timeConstantTau.toFixed(2)}m</p>
          </div>
        </div>
        <div className="flex gap-4 p-1 glass-card rounded-2xl bg-black/40 border border-white/5 shadow-xl">
          {[
            { id: 'finance', label: 'Treasury', icon: Landmark },
            { id: 'market', label: 'Marketplace', icon: ShoppingBag },
            { id: 'mining', label: 'Mining', icon: Pickaxe },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><Coins size={240} /></div>
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
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform"><Gem size={240} /></div>
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

          <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden shadow-3xl text-center space-y-8">
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
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 px-4">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Search className="w-5 h-5 text-slate-400" />
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {['All', 'Produce', 'Hardware', 'Inputs'].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setMarketFilter(f)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${marketFilter === f ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                      >
                         {f}
                      </button>
                    ))}
                 </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                 <ShieldCheck className="w-5 h-5 text-emerald-400" />
                 <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">100% Physically Audited</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredMarket.map(item => (
                <div key={item.id} className="glass-card rounded-[44px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group active:scale-[0.98] duration-300 shadow-xl bg-black/40">
                   <div className="h-56 relative overflow-hidden shrink-0">
                      <img src={item.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[6s]" alt={item.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">{item.category}</span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                         <div className="p-3 bg-emerald-500/20 backdrop-blur-md rounded-2xl border border-emerald-500/40 shadow-xl">
                            <p className="text-[8px] text-emerald-400 font-black uppercase leading-none mb-1">Quality Grade</p>
                            <p className="text-2xl font-black text-white leading-none">{item.grade}</p>
                         </div>
                      </div>
                   </div>

                   <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                         <h4 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors leading-tight italic">{item.name}</h4>
                         <div className="flex items-center gap-2 text-slate-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{item.location} // IN-STOCK: {item.stock}</span>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Inflow Price</p>
                            <p className="text-3xl font-mono font-black text-white">{item.price.toLocaleString()} <span className="text-sm text-emerald-500">EAC</span></p>
                         </div>
                         <button 
                           onClick={() => handlePurchase(item)}
                           className="p-5 bg-emerald-600 rounded-[28px] text-white shadow-2xl hover:bg-emerald-500 active:scale-90 transition-all border border-white/10"
                         >
                            <ShoppingBag className="w-6 h-6" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'mining' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
           <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-12">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                       <Pickaxe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Reaction <span className="text-emerald-400">Mining Console</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.4em] uppercase mt-2">VALIDATOR_NODE_#842 // STABLE_INGEST</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Mining Power</p>
                    <p className="text-2xl font-mono font-black text-white">1.42 TH/s</p>
                 </div>
              </div>

              <div className="flex-1 bg-black/60 rounded-[48px] border border-white/10 p-10 flex flex-col gap-10 relative overflow-hidden shadow-inner">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><Database size={240} /></div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-6 space-y-4 font-mono text-[10px]">
                    {miningLog.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                         <Terminal size={48} />
                         <p className="uppercase tracking-[0.5em] font-black">Waiting for initiation...</p>
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
                    <button 
                      onClick={startMiningCycle}
                      disabled={isMining}
                      className={`w-full py-8 rounded-[32px] text-sm font-black uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-6 ${isMining ? 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed' : 'agro-gradient text-white hover:scale-[1.02] active:scale-95 shadow-emerald-900/40'}`}
                    >
                       {isMining ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                       {isMining ? "FORGING SHARD..." : "INITIALIZE MINTING HANDSHAKE"}
                    </button>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Binary className="w-48 h-48 text-indigo-400" /></div>
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

              <div className="p-8 glass-card rounded-[40px] border-amber-500/20 bg-amber-500/5 flex items-center gap-6 group">
                 <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-xl shrink-0 group-hover:rotate-12 transition-transform"><ShieldAlert size={24} /></div>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-tight">
                    "Mining rewards are calculated via the Reaction Index. Validate community shards to maintain your daily minting quota."
                 </p>
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
      `}</style>
    </div>
  );
};

export default Economy;
