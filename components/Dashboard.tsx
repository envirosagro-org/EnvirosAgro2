import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, ShieldCheck, Zap, Bell, Clock, Briefcase, Database, LayoutGrid, Layers, CreditCard, X, Globe, Activity, HeartPulse, Cpu, Sparkles, Binary, Lock, ShieldAlert, Coins, Users, Leaf, Heart, ArrowRight, BrainCircuit, Bot, Cable, ArrowUpRight, Share2, Youtube, Twitter, Facebook, Linkedin, AtSign, Send, Pin, HelpCircle, Cloud, Wind } from 'lucide-react';
import { ViewState, User } from '../types';
import IdentityCard from './IdentityCard';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  user: User;
}

const OFFICIAL_LINKS = [
  { label: 'Threads', icon: AtSign, url: 'https://www.threads.com/@envirosagro', color: 'text-white' },
  { label: 'TikTok', icon: Share2, url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', color: 'text-pink-500' },
  { label: 'YouTube', icon: Youtube, url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', color: 'text-red-500' },
  { label: 'X Node', icon: Twitter, url: 'https://x.com/EnvirosAgro', color: 'text-blue-400' },
  { label: 'Quora', icon: HelpCircle, url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', color: 'text-red-600' },
  { label: 'Telegram', icon: Send, url: 'https://t.me/EnvirosAgro', color: 'text-sky-400' },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const [livePulse, setLivePulse] = useState(64);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse(60 + Math.random() * 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Top Section: Status & Network Health */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] relative overflow-hidden group border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.02] via-transparent to-transparent">
          <div className="absolute inset-0 shimmer opacity-[0.03] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-80 h-80 agro-gradient opacity-[0.05] blur-[100px] -mr-40 -mt-40 group-hover:opacity-10 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12 border-b border-white/5 pb-12">
            <div className="flex gap-10 items-center">
              <div className="relative group/pfp">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-110 opacity-0 group-hover/pfp:opacity-100 transition-all"></div>
                <div className="w-32 h-32 rounded-[40px] bg-slate-800 border-4 border-white/5 flex items-center justify-center text-5xl font-black text-emerald-400 shadow-2xl relative overflow-hidden group-hover/pfp:rotate-3 transition-transform duration-500">
                  {user.name[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-xl group-hover/pfp:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic">{user.name}</h3>
                  <p className="text-slate-500 text-lg font-medium mt-1">{user.role} • {user.location}</p>
                </div>
                <div className="flex gap-4">
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-[0.3em] border border-emerald-500/20">{user.wallet.tier} Steward</span>
                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.3em] border border-blue-500/20">NODE_{user.esin.split('-')[3]}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowIdentityCard(true)}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl group"
              >
                <CreditCard className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
                Dossier Identification
              </button>
              <div className="flex items-center gap-4 px-6 py-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                <span className="text-[9px] text-emerald-400 font-black tracking-[0.4em]">REGISTRY_SYNC_LIVE</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Coins className="w-3 h-3" /> Node Capital
              </p>
              <p className="text-3xl font-mono font-black text-white">{user.wallet.balance.toLocaleString()} <span className="text-sm text-emerald-500">EAC</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Binary className="w-3 h-3" /> C(a)™ Index
              </p>
              <p className="text-3xl font-mono font-black text-emerald-400">{user.metrics.agriculturalCodeU}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Activity className="w-3 h-3" /> m™ Constant
              </p>
              <p className="text-3xl font-mono font-black text-blue-400">{user.metrics.timeConstantTau}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <HeartPulse className="w-3 h-3" /> Resilience
              </p>
              <p className="text-3xl font-mono font-black text-white">{user.metrics.sustainabilityScore}%</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] flex flex-col justify-center border-white/5 relative overflow-hidden bg-black/20 group">
           <div className="absolute inset-0 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.05] transition-colors"></div>
           <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-center">
                 <h4 className="font-black text-white text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-emerald-400" /> Registry Pulse
                 </h4>
                 <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
              </div>
              <div className="h-40 flex items-end gap-2 px-2 pt-6">
                 {[40, 55, 45, 75, 50, 60, 85, 65, 45, 95, 100, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
                       <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 rounded-t-lg transition-all duration-1000 group-hover:bg-emerald-400" style={{ height: `${h}%` }}></div>
                    </div>
                 ))}
              </div>
              <div className="flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-widest">
                 <span>T-24H</span>
                 <span className="text-emerald-500 animate-pulse">Syncing Shard...</span>
                 <span>LIVE</span>
              </div>
           </div>
        </div>
      </div>

      {/* Community Environment Integration */}
      <div className="glass-card p-10 rounded-[56px] border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 px-2">
           <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] italic flex items-center gap-4">
              <Globe className="w-6 h-6 text-blue-400" /> Community <span className="text-blue-400">Environments</span>
           </h3>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">External Network Shards</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
           {OFFICIAL_LINKS.map((link, i) => (
             <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-6 rounded-3xl border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-center flex flex-col items-center gap-3 group active:scale-95"
             >
                <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors shadow-xl ${link.color}`}>
                   <link.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-60 group-hover:opacity-100">{link.label}</span>
             </a>
           ))}
        </div>
      </div>

      {/* ID Card Modal */}
      {showIdentityCard && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 space-y-8 flex flex-col items-center">
              <div className="text-center space-y-2 mb-4">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Steward <span className="text-emerald-400">Registry</span></h2>
                 <p className="text-emerald-500/60 font-mono text-xs tracking-[0.4em] uppercase">Identity Verification Anchor</p>
              </div>
              <IdentityCard user={user} />
              <div className="flex gap-6">
                 <button className="px-12 py-4 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center gap-3">
                    <Database className="w-4 h-4" /> Download Key Shard
                 </button>
                 <button onClick={() => setShowIdentityCard(false)} className="px-12 py-4 bg-emerald-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all">
                    Return to Center
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Core Logic Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/10 bg-black/40 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
           <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20">
                    <Layers className="w-8 h-8 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Five Thrusts™ <span className="text-emerald-400">Optimization</span></h3>
              </div>
              <span className="text-[10px] font-mono text-slate-700 font-black uppercase tracking-[0.2em]">EOS_V3.2_CORE</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 {[
                   { letter: 'S', label: 'Societal', val: 85, col: 'bg-rose-500', icon: Users },
                   { letter: 'E', label: 'Environmental', val: 92, col: 'bg-pink-500', icon: Leaf },
                   { letter: 'H', label: 'Human', val: 78, col: 'bg-teal-500', icon: Heart },
                 ].map((t) => (
                   <div key={t.label} className="group/thrust">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                        <div className="flex items-center gap-4">
                           <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-black font-black text-sm ${t.col} shadow-lg shadow-current opacity-40 group-hover/thrust:opacity-100 transition-opacity`}>
                             {t.letter}
                           </span>
                           <span className="text-slate-300 group-hover/thrust:text-white transition-colors">{t.label}</span>
                        </div>
                        <span className="text-slate-500 font-mono">{t.val}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ml-14">
                       <div className={`h-full ${t.col} transition-all duration-1000 group-hover/thrust:opacity-80`} style={{ width: `${t.val}%` }}></div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="space-y-8">
                 {[
                   { letter: 'T', label: 'Technological', val: 95, col: 'bg-blue-500', icon: Cpu },
                   { letter: 'I', label: 'Industry', val: 88, col: 'bg-emerald-500', icon: Database },
                 ].map((t) => (
                   <div key={t.label} className="group/thrust">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                        <div className="flex items-center gap-4">
                           <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-black font-black text-sm ${t.col} shadow-lg shadow-current opacity-40 group-hover/thrust:opacity-100 transition-opacity`}>
                             {t.letter}
                           </span>
                           <span className="text-slate-300 group-hover/thrust:text-white transition-colors">{t.label}</span>
                        </div>
                        <span className="text-slate-500 font-mono">{t.val}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden ml-14">
                       <div className={`h-full ${t.col} transition-all duration-1000 group-hover/thrust:opacity-80`} style={{ width: `${t.val}%` }}></div>
                     </div>
                   </div>
                 ))}
                 <div className="mt-6 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center gap-6 group hover:bg-emerald-500/10 transition-colors cursor-pointer" onClick={() => onNavigate('ecosystem')}>
                    <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Thrust Recommendation</p>
                       <p className="text-xs text-slate-500 italic">"Boost H-Thrust via MedicAg protocols to increase worker yield."</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-500" />
                 </div>
              </div>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[56px] border-white/5 bg-indigo-950/10 relative overflow-hidden group flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-64 h-64 text-indigo-400" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-indigo-500/20 rounded-3xl border border-indigo-500/30 shadow-2xl">
                    <Bot className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Oracle <span className="text-indigo-400">Node</span></h4>
                    <span className="text-[10px] text-indigo-500/60 font-black uppercase">GEMINI_3_PRO_ACTIVE</span>
                 </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">"Registry analysis indicates a 4.2% shift in regional moisture resilience. Recommended shard lock: 0x882_NE."</p>
           </div>
           <button 
            onClick={() => onNavigate('intelligence')}
            className="relative z-10 w-full py-6 agro-gradient rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center justify-center gap-4"
           >
              <Zap className="w-5 h-5 fill-current" /> Initialize Session
           </button>
        </div>
      </div>

      {/* Industrial Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "C(a)™ Simulator", desc: "Scientific Growth Modeling", icon: Binary, color: "text-emerald-400", bg: "bg-emerald-500/10", target: 'sustainability' as ViewState },
          { label: "Registry Database", desc: "Shard Ledger Explorer", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10", target: 'explorer' as ViewState },
          { label: "Industrial Ingest", desc: "Hardware Data Pipeline", icon: Cable, color: "text-indigo-400", bg: "bg-indigo-500/10", target: 'ingest' as ViewState },
          { label: "Governance Docs", desc: "SEHTI Protocol Manual", icon: ShieldAlert, color: "text-rose-400", bg: "bg-rose-500/10", target: 'info' as ViewState },
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => onNavigate(item.target)}
            className="glass-card p-10 rounded-[44px] border-white/5 hover:border-white/20 transition-all cursor-pointer group active:scale-[0.98] duration-300 relative overflow-hidden"
          >
            <div className={`absolute -right-4 -bottom-4 p-8 opacity-[0.03] group-hover:scale-110 transition-transform ${item.color}`}>
               <item.icon className="w-32 h-32" />
            </div>
            <div className={`w-16 h-16 rounded-[28px] ${item.bg} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-6 transition-transform`}>
              <item.icon className={`w-8 h-8 ${item.color}`} />
            </div>
            <h4 className="font-black text-white text-xl uppercase tracking-tighter italic mb-2 group-hover:text-emerald-400 transition-colors">{item.label}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/5">
               <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Access Node</span>
               <ArrowUpRight className="w-3 h-3 text-slate-700 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;