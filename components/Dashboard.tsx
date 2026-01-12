
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
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Network Pulse Ticker */}
      <div className="glass-card p-3 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 px-4 border-r border-white/10 shrink-0">
           <Binary className="w-4 h-4 text-emerald-400" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Ledger Pulse</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[9px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.3em]">
             Shard #842 Sync'd • Node {user.esin} multiplier active • New Investment vouch committed • Global quorum reached • Block Finalized 0x882A •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Identity Profile */}
        <div className="xl:col-span-8">
          <div className="glass-card p-6 md:p-10 rounded-[48px] relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl bg-black/40 border border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:scale-105 transition-transform">
                <Fingerprint className="w-80 h-80 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 items-center pb-8 border-b border-white/5 mb-8">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-[28px] bg-slate-800 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-xl relative">
                    {user.name[0]}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-lg">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none text-white">{user.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">{user.role}</p>
                    <div className="flex gap-2 pt-1">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest">{user.wallet.tier}</span>
                       <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest font-mono">AUTH</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-emerald-600/10 transition-all shadow-lg flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" />
                  View Shard
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {[
                  { label: 'Treasury', val: totalBalance.toFixed(0), unit: 'EAC', icon: Coins, col: 'text-emerald-400' },
                  { label: 'Growth', val: user.metrics.agriculturalCodeU, unit: 'C(a)', icon: Binary, col: 'text-blue-400' },
                  { label: 'Stability', val: user.metrics.timeConstantTau, unit: 'm', icon: Activity, col: 'text-amber-500' },
                  { label: 'System', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2 group/stat">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-2xl md:text-3xl font-mono font-black tracking-tighter ${stat.col}`}>
                      {stat.val}<span className="text-[10px] ml-1 opacity-30 font-sans">{stat.unit}</span>
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2s]`} style={{ width: '70%' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Intelligence Preview */}
        <div className="xl:col-span-4">
          <div className="glass-card p-6 md:p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 h-full flex flex-col justify-between group overflow-hidden relative shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <BrainCircuit className="w-48 h-48 text-indigo-400" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                      <Bot className="w-8 h-8 text-white" />
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-indigo-400">Insight</span></h4>
                </div>
                <div className="p-6 bg-black/60 rounded-[32px] border border-white/10">
                   <p className="text-slate-300 text-sm leading-relaxed italic font-medium border-l-3 border-indigo-500/40 pl-6">
                     "Steward node resilience has improved by 14%. New C(a) multipliers initialized."
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-6 agro-gradient rounded-[32px] text-white font-black text-[10px] uppercase tracking-widest shadow-xl mt-8 hover:scale-[1.02] active:scale-95 transition-all">
                <Zap className="w-5 h-5 fill-current" /> Initialize Session
             </button>
          </div>
        </div>
      </div>

      {/* Operational Hub Nodes */}
      <div className="space-y-6">
        <h3 className="text-lg font-black uppercase tracking-widest italic flex items-center gap-3 text-white px-2">
           <Activity className="w-6 h-6 text-indigo-500" /> Operational <span className="text-indigo-400">Nodes</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 px-2">
           {[
             { label: 'EOS Harvest', icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', target: 'wallet', desc: 'Sync' },
             { label: 'Ledger', icon: History, color: 'text-blue-400', bg: 'bg-blue-500/10', target: 'wallet', desc: 'Logs' },
             { label: 'Inventory', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10', target: 'vendor', desc: 'Asset' },
             { label: 'Missions', icon: Trello, color: 'text-rose-400', bg: 'bg-rose-500/10', target: 'tools', desc: 'Tasks' },
             { label: 'Talent', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', target: 'industrial', desc: 'Cloud' },
             { label: 'Carbon', icon: Sprout, color: 'text-teal-400', bg: 'bg-teal-500/10', target: 'impact', desc: 'Mint' },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState)}
              className="glass-card p-6 rounded-[32px] border border-white/5 bg-black/40 transition-all text-left flex flex-col gap-4 group active:scale-95 shadow-xl hover:border-emerald-500/20"
             >
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center transition-all group-hover:rotate-12 ${action.color}`}>
                   <action.icon className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-black uppercase tracking-tight text-white italic truncate block">{action.label}</span>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{action.desc}</p>
                </div>
             </button>
           ))}
        </div>
      </div>

      {showIdentityCard && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-md" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 w-full max-w-lg space-y-6 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="scale-110 md:scale-125">
                 <IdentityCard user={user} />
              </div>
              <button 
                onClick={() => setShowIdentityCard(false)} 
                className="w-full max-w-sm py-6 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all mt-6"
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
