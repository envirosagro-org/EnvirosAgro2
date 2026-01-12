
import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Sparkles, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello
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

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Network Pulse Ticker - Compacted */}
      <div className="glass-card p-2 rounded-xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-md">
        <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0">
           <Binary className="w-3.5 h-3.5 text-emerald-400" />
           <span className="text-[8px] font-black uppercase tracking-[0.15em] text-emerald-400">Pulse</span>
        </div>
        <div className="flex-1 px-3 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[8px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.2em]">
             Shard #842 Sync'd • Node {user.esin} multiplier active • New Investment vouch committed • Global quorum reached • Block Finalized 0x882A • Latency: 14ms • Consensus: 99.9% •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Main Identity Profile - Density Enhanced */}
        <div className="xl:col-span-8">
          <div className="glass-card p-4 md:p-6 rounded-[32px] relative overflow-hidden group h-full flex flex-col justify-between shadow-xl bg-black/40 border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:scale-105 transition-transform">
                <Fingerprint className="w-64 h-64 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-center pb-4 border-b border-white/5 mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-emerald-400 shadow-lg relative">
                    {user.name[0]}
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-[#050706] shadow-md">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-tight text-white">{user.name}</h3>
                    <p className="text-slate-500 text-xs font-medium">{user.role}</p>
                    <div className="flex gap-1.5 pt-0.5">
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[7px] font-black rounded-md border border-emerald-500/20 uppercase tracking-widest">{user.wallet.tier}</span>
                       <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[7px] font-black rounded-md border border-blue-500/20 uppercase tracking-widest font-mono">NODE_ACTIVE</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="w-full sm:w-auto px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-white hover:bg-emerald-600/10 transition-all shadow-md flex items-center justify-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                  View Identity Shard
                </button>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                {[
                  { label: 'Treasury', val: totalBalance.toFixed(0), unit: 'EAC', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'Growth', val: user.metrics.agriculturalCodeU, unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'Stability', val: user.metrics.timeConstantTau, unit: 'm', icon: Activity, col: 'text-amber-500', progress: 74 },
                  { label: 'System', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1 group/stat hover:border-white/10 transition-all">
                    <div className="flex items-center gap-1.5 opacity-60">
                       <stat.icon className={`w-3 h-3 ${stat.col}`} />
                       <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className={`text-xl font-mono font-black tracking-tighter ${stat.col}`}>
                      {stat.val}<span className="text-[8px] ml-0.5 opacity-30 font-sans">{stat.unit}</span>
                    </p>
                    <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2s]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Intelligence Preview - Compacted */}
        <div className="xl:col-span-4">
          <div className="glass-card p-4 md:p-6 rounded-[32px] border-indigo-500/20 bg-indigo-500/5 h-full flex flex-col justify-between group overflow-hidden relative shadow-xl">
             <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                <BrainCircuit className="w-32 h-32 text-indigo-400" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-indigo-600 rounded-xl shadow-md">
                      <Bot className="w-6 h-6 text-white" />
                   </div>
                   <h4 className="text-lg font-black text-white uppercase tracking-tighter italic leading-none">Oracle <span className="text-indigo-400">Insight</span></h4>
                </div>
                <div className="p-4 bg-black/60 rounded-[20px] border border-white/10 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/30"></div>
                   <p className="text-slate-400 text-xs leading-relaxed italic font-medium pl-3">
                     "Steward node resilience has improved by 14%. New C(a) multipliers initialized for current crop cycle."
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-3.5 agro-gradient rounded-2xl text-white font-black text-[8px] uppercase tracking-widest shadow-lg mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5 fill-current" /> Initialize Oracle
             </button>
          </div>
        </div>
      </div>

      {/* Operational Hub Nodes - High Density Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest italic flex items-center gap-2 text-white">
             <Activity className="w-4 h-4 text-indigo-500" /> Operational <span className="text-indigo-400">Nodes</span>
          </h3>
          <span className="text-[7px] font-mono text-slate-700 uppercase tracking-widest">Network_Map_v4.2</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-1">
           {[
             { label: 'EOS Harvest', icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', target: 'wallet', desc: 'MINT' },
             { label: 'Ledger', icon: History, color: 'text-blue-400', bg: 'bg-blue-500/10', target: 'wallet', desc: 'SYNC' },
             { label: 'Inventory', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10', target: 'vendor', desc: 'ASSET' },
             { label: 'Missions', icon: Trello, color: 'text-rose-400', bg: 'bg-rose-500/10', target: 'tools', desc: 'OPS' },
             { label: 'Talent', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', target: 'industrial', desc: 'CLOUD' },
             { label: 'Carbon', icon: Sprout, color: 'text-teal-400', bg: 'bg-teal-500/10', target: 'impact', desc: 'MINT' },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState)}
              className="glass-card p-3 md:p-5 rounded-[24px] border border-white/5 bg-black/40 transition-all text-left flex flex-col gap-2.5 group active:scale-95 shadow-lg hover:border-emerald-500/20"
             >
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl ${action.bg} flex items-center justify-center transition-all group-hover:rotate-12 ${action.color}`}>
                   <action.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-tight text-white italic truncate block">{action.label}</span>
                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{action.desc}</p>
                </div>
             </button>
           ))}
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
                className="w-full max-w-[200px] py-3 agro-gradient rounded-full text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all mt-2"
              >
                Close Shard
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
