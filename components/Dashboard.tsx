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
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Network Pulse Ticker */}
      <div className="glass-card p-4 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4 px-8 border-r border-white/10 shrink-0">
           <Binary className="w-6 h-6 text-emerald-400" />
           <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Registry Pulse</span>
        </div>
        <div className="flex-1 px-8 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-xs text-emerald-400/80 font-mono font-black uppercase tracking-[0.4em]">
             Shard #842 Sync'd • Node {user.esin} multiplier active • New Investment vouch committed • Global quorum reached • Block Finalized 0x882A •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Identity Profile - Desktop Layout */}
        <div className="xl:col-span-8">
          <div className="glass-card p-12 rounded-[64px] relative overflow-hidden group h-full flex flex-col justify-between shadow-3xl bg-black/40 border border-white/5">
             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                <Fingerprint className="w-96 h-96 text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10 items-center pb-12 border-b border-white/5 mb-10">
                <div className="flex gap-8 items-center">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-800 flex items-center justify-center text-5xl font-black text-emerald-400 shadow-2xl relative">
                    {user.name[0]}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-xl">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-white">{user.name}</h3>
                    <p className="text-slate-500 text-lg font-medium">{user.role} // {user.location}</p>
                    <div className="flex gap-3 pt-2">
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase tracking-[0.4em]">{user.wallet.tier} NODE</span>
                       <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/20 uppercase tracking-[0.4em] font-mono">AUTH_VERIFIED</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-emerald-600/10 transition-all shadow-xl active:scale-95 flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-emerald-400" />
                  View Registry Shard
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                {[
                  { label: 'Network Treasury', val: totalBalance.toFixed(0), unit: 'EAC', icon: Coins, col: 'text-emerald-400' },
                  { label: 'C(a) Growth Index', val: user.metrics.agriculturalCodeU, unit: '', icon: Binary, col: 'text-blue-400' },
                  { label: 'm-Factor Stability', val: user.metrics.timeConstantTau, unit: '', icon: Activity, col: 'text-amber-500' },
                  { label: 'System U-Score', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-3 group/stat">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] group-hover/stat:text-white transition-colors">{stat.label}</p>
                    <p className={`text-4xl font-mono font-black tracking-tighter ${stat.col}`}>
                      {stat.val}<span className="text-sm ml-1 opacity-40 font-sans">{stat.unit}</span>
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
          <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 h-full flex flex-col justify-between group overflow-hidden relative shadow-3xl">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-[1s]">
                <BrainCircuit className="w-64 h-64 text-indigo-400" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-5">
                   <div className="p-5 bg-indigo-600 rounded-3xl shadow-2xl">
                      <Bot className="w-10 h-10 text-white" />
                   </div>
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Oracle <span className="text-indigo-400">Insight</span></h4>
                </div>
                <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 shadow-inner">
                   <p className="text-slate-300 text-xl leading-relaxed italic font-medium border-l-4 border-indigo-500/40 pl-8">
                     "Steward node resilience has improved by 14%. New C(a) multipliers initialized for this crop cycle."
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-indigo-900/40 flex items-center justify-center gap-4 mt-10 hover:scale-[1.02] active:scale-95 transition-all">
                <Zap className="w-6 h-6 fill-current" /> Initialize Session
             </button>
          </div>
        </div>
      </div>

      {/* Operational Hub Nodes */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black uppercase tracking-[0.4em] italic flex items-center gap-4 text-white px-4">
           <Activity className="w-8 h-8 text-indigo-500" /> Operational <span className="text-indigo-400">Node Hub</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-8 px-2">
           {[
             { label: 'EOS Harvest', icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10', target: 'wallet', desc: 'Sync Shards' },
             { label: 'Registry Ledger', icon: History, color: 'text-blue-400', bg: 'bg-blue-500/10', target: 'wallet', desc: 'Immutable Logs' },
             { label: 'Inventory Nodes', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10', target: 'vendor', desc: 'Asset Registry' },
             { label: 'Mission Grid', icon: Trello, color: 'text-rose-400', bg: 'bg-rose-500/10', target: 'tools', desc: 'Coordinate' },
             { label: 'Steward Cloud', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', target: 'industrial', desc: 'Verified Talent' },
             { label: 'Carbon Ledger', icon: Sprout, color: 'text-teal-400', bg: 'bg-teal-500/10', target: 'impact', desc: 'Offset Shards' },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState)}
              className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 transition-all text-left flex flex-col gap-6 group active:scale-95 shadow-2xl hover:border-emerald-500/20"
             >
                <div className={`w-16 h-16 rounded-[24px] ${action.bg} flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 ${action.color}`}>
                   <action.icon className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-black uppercase tracking-tight text-white italic leading-tight">{action.label}</span>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{action.desc}</p>
                </div>
                <div className="mt-auto flex justify-end">
                   <div className="p-3 rounded-xl bg-white/5 group-hover:bg-emerald-600 transition-all group-hover:text-white">
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                   </div>
                </div>
             </button>
           ))}
        </div>
      </div>

      {showIdentityCard && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-8">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 w-full max-w-2xl space-y-10 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="scale-125 md:scale-150">
                 <IdentityCard user={user} />
              </div>
              <button 
                onClick={() => setShowIdentityCard(false)} 
                className="w-full max-w-md py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl active:scale-95 transition-all mt-10"
              >
                Sync with Command Node
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;