import React, { useState } from 'react';
import { Award, TrendingUp, ShieldCheck, Zap, Bell, Clock, Briefcase, Database, LayoutGrid, Layers, CreditCard, X, Globe } from 'lucide-react';
import { ViewState, User } from '../types';
import IdentityCard from './IdentityCard';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Section: Agro-Identity & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-8 rounded-[40px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-white/10 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-2xl relative overflow-hidden group/pfp">
                {user.name[0]}
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/pfp:opacity-100 transition-opacity"></div>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-white tracking-tight">{user.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{user.role} • {user.location}</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded uppercase tracking-widest border border-emerald-500/20">{user.wallet.tier} Tier</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded uppercase tracking-widest border border-blue-500/20">ESIN: {user.esin.split('-')[2]}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button 
                onClick={() => setShowIdentityCard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all group"
              >
                <CreditCard className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                View Identity Card
              </button>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-emerald-400 font-black tracking-widest">ACTIVE SESSION</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Lifetime EAC</p>
              <p className="text-2xl font-mono font-black text-white">{user.wallet.lifetimeEarned.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">C(a)™ Agro Code</p>
              <p className="text-2xl font-mono font-black text-emerald-400">{user.metrics.sustainabilityScore}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">m™ Constant</p>
              <p className="text-2xl font-mono font-black text-blue-400">{user.metrics.timeConstantTau}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-[40px]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-400" />
              Ecosystem Pulse
            </h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded tracking-widest">3 NODES</span>
          </div>
          <div className="space-y-4">
            {[
              { icon: Zap, text: "ESIN verified on EOS Mainnet", time: "2m ago", color: "text-amber-400" },
              { icon: Briefcase, text: "New yield protocol for your zone", time: "15m ago", color: "text-blue-400" },
              { icon: ShieldCheck, text: "Registry signature confirmed", time: "1h ago", color: "text-emerald-400" },
            ].map((n, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white/[0.02] rounded-3xl group cursor-pointer hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                <div className={`p-2 rounded-xl bg-white/5 shrink-0 ${n.color}`}>
                   <n.icon className={`w-4 h-4 mt-0.5`} />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-bold leading-tight">{n.text}</p>
                  <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-1 font-mono uppercase tracking-widest"><Clock className="w-3 h-3" /> {n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ID Card Modal */}
      {showIdentityCard && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 space-y-8 flex flex-col items-center">
              <div className="text-center space-y-2 mb-4">
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Steward Identification</h2>
                 <p className="text-emerald-500 font-mono text-sm tracking-[0.3em]">ENVIROSAGRO™ SOCIAL IDENTITY</p>
              </div>
              <IdentityCard user={user} />
              <div className="flex gap-4">
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <Database className="w-4 h-4" /> Download PGP Key
                 </button>
                 <button onClick={() => setShowIdentityCard(false)} className="px-8 py-3 bg-emerald-600 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-105 transition-all">
                    Close Portal
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Five Thrusts™ Integration Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[40px] border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.02] to-transparent">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Five Thrusts™ Index</h3>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified by ESIN</span>
          </div>
          
          <div className="space-y-6">
            {[
              { letter: 'S', label: 'Societal', val: 85, col: 'bg-red-400' },
              { letter: 'E', label: 'Environmental', val: 92, col: 'bg-pink-400' },
              { letter: 'H', label: 'Human', val: 78, col: 'bg-teal-400' },
              { letter: 'T', label: 'Technological', val: 95, col: 'bg-blue-400' },
              { letter: 'I', label: 'Industry', val: 88, col: 'bg-emerald-400' },
            ].map((t) => (
              <div key={t.label} className="group">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black text-black ${t.col}`}>
                      {t.letter}
                    </span>
                    <span className="text-slate-300">{t.label}</span>
                  </div>
                  <span className="text-slate-500 font-mono">{t.val}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${t.col} transition-all duration-1000 group-hover:opacity-80`} style={{ width: `${t.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] bg-indigo-500/[0.02] flex flex-col justify-center border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="text-center space-y-4 relative z-10">
             <div className="w-24 h-24 agro-gradient rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-2 group">
                <TrendingUp className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
             </div>
             <h3 className="text-3xl font-black text-white tracking-tighter">92.4% Resilience</h3>
             <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
               Steward <span className="text-white">{user.name}</span>, your Five Thrusts™ integration is currently yielding a <span className="text-emerald-400">1.2x EAC multiplier</span>.
             </p>
             <button 
              onClick={() => onNavigate('ecosystem')}
              className="mt-6 px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-widest transition-all shadow-xl"
             >
               Optimize Performance
             </button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "C(a)™ Simulator", icon: Zap, color: "bg-emerald-500", target: 'sustainability' as ViewState },
          { label: "Identity Registry", icon: CreditCard, color: "bg-blue-500", target: 'info' as ViewState },
          { label: "Industrial Cloud", icon: Briefcase, color: "bg-purple-500", target: 'industrial' as ViewState },
          { label: "Registry Database", icon: Database, color: "bg-amber-500", target: 'explorer' as ViewState },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => onNavigate(item.target)}
            className="glass-card p-8 rounded-[32px] hover:border-white/10 transition-all cursor-pointer group active:scale-95"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} bg-opacity-20 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
              <item.icon className={`w-7 h-7 ${item.color.replace('bg-', 'text-')}`} />
            </div>
            <h4 className="font-black text-white text-xs uppercase tracking-widest">{item.label}</h4>
            <p className="text-[9px] text-slate-600 mt-2 uppercase font-bold tracking-widest flex items-center gap-1">Open Module <Clock className="w-3 h-3" /></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;