
import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Sparkles, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello,
  LayoutGrid, ArrowUpRight, ShoppingBag, Radio, Signal, Eye, ChevronRight,
  // Added Gem and Landmark to resolve 'Cannot find name' errors on lines 24 and 150
  Gem, Landmark
} from 'lucide-react';
import { ViewState, User } from '../types';
import IdentityCard from './IdentityCard';

interface DashboardProps {
  onNavigate: (view: ViewState, action?: string | null) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  const FEATURED_MARKET_SHARDS = [
    { id: 'M-1', name: 'Zone 4 Nitrogen Pack', price: 420, icon: Sprout, col: 'text-emerald-400' },
    { id: 'M-2', name: 'Spectral Drone Rental', price: 1200, icon: Bot, col: 'text-blue-400' },
    { id: 'M-3', name: 'Lineage Seed Shard', price: 850, icon: Gem, col: 'text-amber-500' },
    { id: 'M-4', name: 'Purity Audit Vouch', price: 150, icon: ShieldCheck, col: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 max-w-full overflow-hidden pb-20">
      
      {/* 1. Network Pulse Ticker - High Frequency */}
      <div className="glass-card p-2.5 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-md mx-4">
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-4">
        {/* 2. Main Identity & Metrics */}
        <div className="xl:col-span-8">
          <div className="glass-card p-6 md:p-8 rounded-[48px] relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl bg-black/40 border border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-105 transition-transform">
                <Fingerprint className="w-80 h-80 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 items-center pb-8 border-b border-white/5 mb-8">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-[32px] bg-slate-800 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-xl relative ring-1 ring-white/10">
                    {user.name[0]}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-2xl">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none text-white">{user.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{user.role}</p>
                    <div className="flex gap-2 pt-1">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest">{user.wallet.tier}</span>
                       <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest font-mono">NODE_ACTIVE</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600/10 transition-all shadow-xl flex items-center justify-center gap-3">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  Steward Dossier Shard
                </button>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                {[
                  { label: 'EAC Treasury', val: totalBalance.toFixed(0), unit: 'SHARD', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'Growth Index', val: user.metrics.agriculturalCodeU, unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'Resilience', val: user.metrics.timeConstantTau, unit: 'm', icon: Activity, col: 'text-amber-500', progress: 74 },
                  { label: 'Sustainability', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 space-y-3 group/stat hover:border-white/20 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-2 opacity-60">
                       <stat.icon className={`w-4 h-4 ${stat.col}`} />
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className={`text-2xl font-mono font-black tracking-tighter ${stat.col}`}>
                      {stat.val}<span className="text-[10px] ml-1 opacity-30 font-sans">{stat.unit}</span>
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2.5s]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* 3. Oracle Intelligence - Compact Card */}
        <div className="xl:col-span-4">
          <div className="glass-card p-6 md:p-8 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 h-full flex flex-col justify-between group overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:rotate-12 transition-transform duration-700">
                <BrainCircuit className="w-48 h-48 text-indigo-400" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                      <Bot className="w-8 h-8 text-white" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none">Oracle <span className="text-indigo-400">Hub</span></h4>
                      <p className="text-[8px] font-mono text-indigo-400/60 uppercase mt-1">Cognitive_Relay_Active</p>
                   </div>
                </div>
                <div className="p-6 bg-black/60 rounded-[32px] border border-white/10 relative overflow-hidden shadow-inner">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/40"></div>
                   <p className="text-slate-300 text-sm leading-relaxed italic font-medium pl-4">
                     "Your regional m-Constant has optimized by 14.2%. Strategic sharding of Nitrogen assets recommended for Phase 4."
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl mt-6 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Zap className="w-4 h-4 fill-current" /> Initialize Ingest
             </button>
          </div>
        </div>
      </div>

      {/* 4. Operational Nodes - Horizontal Scrolling Carousel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-8">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] italic flex items-center gap-3 text-white">
             <LayoutGrid className="w-5 h-5 text-indigo-500" /> Operational <span className="text-indigo-400">Shards</span>
          </h3>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Scroll to explore</span>
          </div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-2 snap-x">
           {[
             { label: 'EAC Harvest', icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', target: 'wallet', desc: 'MINTING' },
             { label: 'Registry Ledger', icon: History, color: 'text-blue-400', bg: 'bg-blue-500/10', target: 'wallet', desc: 'LEDGER' },
             { label: 'Warehouse Hub', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10', target: 'vendor', desc: 'INVENTORY' },
             { label: 'Mission Tasks', icon: Trello, color: 'text-rose-400', bg: 'bg-rose-500/10', target: 'tools', desc: 'EXECUTION' },
             { label: 'Worker Cloud', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', target: 'industrial', desc: 'TALENT' },
             { label: 'Carbon Sharding', icon: Sprout, color: 'text-teal-400', bg: 'bg-teal-500/10', target: 'impact', desc: 'OFFSET' },
             { label: 'Live Inflow', icon: Signal, color: 'text-pink-400', bg: 'bg-pink-500/10', target: 'live_farming', desc: 'INGEST' },
             { label: 'DAO Gov', icon: Landmark, color: 'text-orange-400', bg: 'bg-orange-500/10', target: 'info', desc: 'VOTE' },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState)}
              className="glass-card p-6 min-w-[240px] md:min-w-[280px] rounded-[40px] border border-white/5 bg-black/40 transition-all text-left flex flex-col gap-6 group active:scale-95 shadow-xl hover:border-indigo-500/20 snap-center"
             >
                <div className={`w-14 h-14 rounded-2xl ${action.bg} flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 ${action.color} border border-white/5`}>
                   <action.icon className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter text-white italic truncate">{action.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{action.desc}</p>
                </div>
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
        {/* 5. Trending Market Shards - Scrolling List */}
        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center px-4 relative z-10">
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-emerald-400" /> Market <span className="text-emerald-400">Trends</span>
            </h3>
            <button onClick={() => onNavigate('economy')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors">View All</button>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-4 snap-x">
             {FEATURED_MARKET_SHARDS.map((shard, i) => (
                <div key={i} className="min-w-[260px] p-8 glass-card rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer snap-center shadow-lg">
                   <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform ${shard.col}`}>
                         <shard.icon size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-700 font-bold">#S-{(882+i).toString()}</span>
                   </div>
                   <h4 className="text-xl font-black text-white leading-tight mb-6 truncate italic">{shard.name}</h4>
                   <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-emerald-400" />
                        <span className="text-2xl font-mono font-black text-white tracking-tighter">{shard.price}</span>
                      </div>
                      <button className="p-3 bg-emerald-600 rounded-xl text-white shadow-xl active:scale-90">
                         <ChevronRight size={18} />
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* 6. Recent Ledger Inflow - Visual Feed */}
        <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center px-4 relative z-10">
            <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-400" /> Ledger <span className="text-indigo-400">Stream</span>
            </h3>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase rounded-lg border border-indigo-500/20">LIVE_DATA</span>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar-dash pr-2">
            {[
              { type: 'Harvest', node: 'Node_Paris_04', val: '+24.5', unit: 'EAC', time: '12m ago', col: 'text-emerald-400' },
              { type: 'Vouch', node: 'Stwd_Nairobi', val: '-150.0', unit: 'EAC', time: '1h ago', col: 'text-rose-400' },
              { type: 'Mint', node: 'Global_Alpha', val: '+1.428', unit: 'EAT', time: '4h ago', col: 'text-yellow-500' },
              { type: 'Sync', node: 'Edge_P4', val: '+5.0', unit: 'EAC', time: '6h ago', col: 'text-blue-400' },
              { type: 'Audit', node: 'Bio_Refinery_8', val: 'A+', unit: 'GRADE', time: '12h ago', col: 'text-indigo-400' },
            ].map((tx, i) => (
              <div key={i} className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex items-center justify-between group hover:border-indigo-500/40 transition-all cursor-pointer">
                 <div className="flex items-center gap-6">
                    <div className="w-1.5 h-8 bg-indigo-500/20 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                    <div>
                       <p className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">{tx.type} Shard</p>
                       <p className="text-[10px] text-slate-500 mt-2 uppercase font-black">{tx.node} // {tx.time}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={`text-xl font-mono font-black ${tx.col}`}>{tx.val}</p>
                    <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">{tx.unit}</p>
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
           <div className="relative z-10 w-full max-w-md space-y-4 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="transform scale-90 sm:scale-100">
                 <IdentityCard user={user} />
              </div>
              <button 
                onClick={() => setShowIdentityCard(false)} 
                className="w-full max-w-[200px] py-4 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all mt-4"
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
      `}</style>
    </div>
  );
};

export default Dashboard;
