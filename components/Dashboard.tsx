
import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Sparkles, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello,
  LayoutGrid, ArrowUpRight, ShoppingBag, Radio, Signal, Eye, ChevronRight,
  Gem, Landmark
} from 'lucide-react';
import { ViewState, User, Order } from '../types';
import IdentityCard from './IdentityCard';

interface DashboardProps {
  onNavigate: (view: ViewState, action?: string | null) => void;
  user: User;
  orders?: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, orders = [] }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  const FEATURED_MARKET_SHARDS = [
    { id: 'M-1', name: 'Zone 4 Nitrogen Pack', price: 420, icon: Sprout, col: 'text-emerald-400' },
    { id: 'M-2', name: 'Spectral Drone Rental', price: 1200, icon: Bot, col: 'text-blue-400' },
    { id: 'M-3', name: 'Lineage Seed Shard', price: 850, icon: Gem, col: 'text-amber-500' },
    { id: 'M-4', name: 'Purity Audit Vouch', price: 150, icon: ShieldCheck, col: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden pb-20 px-1 md:px-4">
      
      {/* 1. Network Pulse Ticker - High Frequency */}
      <div className="glass-card p-2.5 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-md">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 shrink-0">
           <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Live Pulse</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[9px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.3em]">
             Shard #842 Sync'd • Node {user.esin} multiplier active • New Investment vouch committed • Global quorum reached • Block Finalized 0x882A • Latency: 14ms • Consensus: 99.9% • New Carbon Credits minted in Zone 2 • m-Constant stability optimized •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 2. Main Identity & Metrics - Updated to match screenshot */}
        <div className="xl:col-span-8">
          <div className="glass-card p-8 md:p-12 rounded-[56px] relative overflow-hidden group h-full flex flex-col justify-between shadow-3xl bg-black/40 border border-white/5">
             {/* Fingerprint decorative background from screenshot */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none group-hover:scale-105 transition-transform duration-[10s]">
                <Fingerprint className="w-[600px] h-[600px] text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-8 items-center pb-12 border-b border-white/5 mb-10">
                <div className="flex gap-8 items-center">
                  <div className="w-24 h-24 rounded-[36px] bg-white text-slate-900 flex items-center justify-center text-5xl font-black shadow-2xl relative ring-4 ring-white/10">
                    {user.name[0]}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-2xl">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-white">{user.name.toUpperCase()}</h3>
                    <p className="text-slate-500 text-lg font-medium italic">{user.role}</p>
                    <div className="flex gap-3 pt-1">
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-xl border border-emerald-500/20 uppercase tracking-widest shadow-inner">{user.wallet.tier.toUpperCase()}</span>
                       <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-xl border border-blue-500/20 uppercase tracking-widest font-mono shadow-inner">NODE_ACTIVE</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-4">
                  <Fingerprint className="w-5 h-5 text-emerald-400" />
                  Steward Dossier Shard
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {[
                  { label: 'EAC Treasury', val: totalBalance.toFixed(0), unit: 'SHARD', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'Growth Index', val: user.metrics.agriculturalCodeU, unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'Resilience', val: user.metrics.timeConstantTau, unit: 'm', icon: Activity, col: 'text-amber-500', progress: 74 },
                  { label: 'Sustainability', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-4 group/stat hover:border-white/20 hover:bg-white/[0.04] transition-all shadow-inner">
                    <div className="flex items-center gap-3">
                       <stat.icon className={`w-5 h-5 ${stat.col} opacity-40`} />
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className={`text-4xl font-mono font-black tracking-tighter ${stat.col} leading-none`}>
                      {stat.val}<span className="text-xs ml-1 opacity-20 font-sans font-medium uppercase">{stat.unit}</span>
                    </p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2.5s] shadow-[0_0_10px_current]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. Oracle Hub - Updated to match screenshot */}
        <div className="xl:col-span-4">
          <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 h-full flex flex-col justify-between group overflow-hidden relative shadow-3xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:rotate-12 transition-transform duration-700">
                <BrainCircuit className="w-64 h-64 text-white" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-indigo-600 rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-white/5">
                      <Bot className="w-10 h-10 text-white" />
                   </div>
                   <div>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Oracle <span className="text-indigo-400">Hub</span></h4>
                      <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase mt-2 tracking-widest">Cognitive_Relay_Active</p>
                   </div>
                </div>
                <div className="p-10 bg-black/80 rounded-[44px] border border-white/10 relative overflow-hidden shadow-inner border-l-[12px] border-l-indigo-600/50">
                   <p className="text-slate-300 text-xl leading-relaxed italic font-medium">
                     "Your regional m-Constant has optimized by 14.2%. Strategic sharding of Nitrogen assets recommended for Phase 4."
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl mt-10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                <Zap className="w-6 h-6 fill-current" /> INITIALIZE INGEST
             </button>
          </div>
        </div>
      </div>

      {/* 4. Operational Shards - Updated with screenshot aesthetics */}
      <div className="space-y-8 pt-6">
        <div className="flex items-center justify-between px-10">
          <h3 className="text-base md:text-lg font-black uppercase tracking-[0.5em] italic flex items-center gap-4 text-white">
             <LayoutGrid className="w-6 h-6 text-slate-700" /> Operational <span className="text-indigo-400">Shards</span>
          </h3>
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
             <span className="text-[10px] font-mono text-slate-700 uppercase font-black tracking-widest">Scroll to explore</span>
          </div>
        </div>
        
        <div className="flex gap-8 overflow-x-auto scrollbar-hide px-10 py-2 snap-x">
           {[
             { label: 'EAC Harvest', icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', target: 'wallet', desc: 'MINTING' },
             { label: 'Registry Ledger', icon: History, color: 'text-blue-400', bg: 'bg-blue-500/10', target: 'wallet', desc: 'LEDGER' },
             { label: 'Market Cloud', icon: ShoppingBag, color: 'text-amber-400', bg: 'bg-amber-500/10', target: 'economy', desc: 'TRADING' },
             { label: 'Worker Cloud', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', target: 'industrial', desc: 'TALENT' },
             { label: 'Mission Launchpad', icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10', target: 'industrial', desc: 'EXECUTION' },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState)}
              className="glass-card p-10 min-w-[300px] md:min-w-[360px] rounded-[56px] border border-white/5 bg-black/40 transition-all text-left flex flex-col gap-10 group active:scale-[0.98] shadow-2xl hover:border-indigo-500/20 snap-center relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`w-20 h-20 rounded-[28px] ${action.bg} flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 ${action.color} border border-white/5 shadow-xl`}>
                   <action.icon className="w-10 h-10" />
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black uppercase tracking-tighter text-white italic truncate">{action.label.toUpperCase()}</span>
                    <ArrowUpRight className="w-6 h-6 text-slate-800 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs font-black text-slate-700 uppercase tracking-[0.4em]">{action.desc}</p>
                </div>
             </button>
           ))}
        </div>
      </div>

      {/* 5. Market Trends & Ledger Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden">
          <div className="flex justify-between items-center px-4 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-5">
              <ShoppingBag className="w-7 h-7 text-emerald-400" /> Market <span className="text-emerald-400">Trends</span>
            </h3>
            <button onClick={() => onNavigate('economy')} className="text-[11px] font-black text-slate-600 hover:text-white uppercase transition-colors tracking-widest">View All</button>
          </div>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide px-2 py-4 snap-x">
             {FEATURED_MARKET_SHARDS.map((shard, i) => (
                <div key={i} className="min-w-[320px] p-10 glass-card rounded-[48px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer snap-center shadow-xl">
                   <div className="flex justify-between items-start mb-10">
                      <div className={`p-5 rounded-3xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform ${shard.col}`}>
                         <shard.icon size={32} />
                      </div>
                      <span className="text-xs font-mono text-slate-800 font-bold">#S-{(882+i).toString()}</span>
                   </div>
                   <h4 className="text-2xl font-black text-white leading-tight mb-8 truncate italic tracking-tight">{shard.name}</h4>
                   <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-emerald-400 opacity-40" />
                        <span className="text-4xl font-mono font-black text-white tracking-tighter">{shard.price}</span>
                      </div>
                      <button className="p-4 bg-emerald-600 rounded-2xl text-white shadow-3xl hover:bg-emerald-500 active:scale-90 transition-all">
                         <ChevronRight size={24} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-indigo-500/20 bg-indigo-500/5 space-y-12 shadow-3xl relative overflow-hidden">
          <div className="flex justify-between items-center px-4 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-5">
              <Database className="w-7 h-7 text-indigo-400" /> Ledger <span className="text-indigo-400">Stream</span>
            </h3>
            <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 shadow-inner">LIVE_DATA</span>
          </div>

          <div className="space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar-dash pr-4">
            {[
              { type: 'Harvest', node: 'Node_Paris_04', val: '+24.5', unit: 'EAC', time: '12m ago', col: 'text-emerald-400' },
              { type: 'Vouch', node: 'Stwd_Nairobi', val: '-150.0', unit: 'EAC', time: '1h ago', col: 'text-rose-400' },
              { type: 'Mint', node: 'Global_Alpha', val: '+1.42', unit: 'EAT', time: '4h ago', col: 'text-yellow-500' },
              { type: 'Sync', node: 'Edge_P4', val: '+5.0', unit: 'EAC', time: '6h ago', col: 'text-blue-400' },
            ].map((tx, i) => (
              <div key={i} className="p-8 bg-black/80 rounded-[40px] border border-white/5 flex items-center justify-between group hover:border-indigo-500/40 transition-all cursor-pointer shadow-xl">
                 <div className="flex items-center gap-8">
                    <div className="w-2 h-12 bg-indigo-600/30 rounded-full group-hover:bg-indigo-500 transition-all"></div>
                    <div>
                       <p className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{tx.type} Shard</p>
                       <p className="text-[10px] text-slate-600 mt-3 uppercase font-black tracking-widest font-mono">{tx.node.toUpperCase()} // {tx.time.toUpperCase()}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={`text-2xl font-mono font-black ${tx.col} tracking-tighter`}>{tx.val}</p>
                    <p className="text-[9px] text-slate-800 font-bold uppercase tracking-[0.4em]">{tx.unit}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identity Shard Modal Overlay */}
      {showIdentityCard && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-sm" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 w-full max-w-md space-y-6 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="transform scale-90 sm:scale-100 shadow-[0_0_150px_rgba(16,185,129,0.2)]">
                 <IdentityCard user={user} />
              </div>
              <button 
                onClick={() => setShowIdentityCard(false)} 
                className="w-full max-w-[240px] py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all mt-4"
              >
                Close Dossier
              </button>
           </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar-dash::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-dash::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6); }
      `}</style>
    </div>
  );
};

export default Dashboard;
