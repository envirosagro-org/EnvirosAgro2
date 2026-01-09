import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Zap, Globe, Activity, HeartPulse, Cpu, Sparkles, Binary, 
  CreditCard, Layers, Coins, Users, Heart, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, AtSign, Share2, Youtube, Twitter, HelpCircle, Send, Pin, Linkedin,
  Rocket, PlusCircle, Gavel, Building2, Share, ShieldAlert, UserCheck, Handshake,
  LayoutGrid, Video
} from 'lucide-react';
import { ViewState, User } from '../types';
import IdentityCard from './IdentityCard';

interface DashboardProps {
  onNavigate: (view: ViewState, action?: string | null) => void;
  user: User;
}

const GlobalNetworkVisual: React.FC<{ userLoc: string }> = ({ userLoc }) => {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const initialNodes = [
      { id: 1, x: 20, y: 30, size: 8, label: 'Shard_Paris', active: true },
      { id: 2, x: 70, y: 25, size: 12, label: 'Shard_Nairobi', active: true },
      { id: 3, x: 45, y: 55, size: 16, label: 'Your_Node', active: true, isCurrent: true },
      { id: 4, x: 85, y: 80, size: 10, label: 'Shard_Sydney', active: true },
      { id: 5, x: 15, y: 75, size: 9, label: 'Shard_Amazon', active: false },
    ];
    setNodes(initialNodes);
  }, []);

  return (
    <div className="relative w-full h-[300px] lg:h-full min-h-[400px] overflow-hidden glass-card rounded-[40px] border border-emerald-500/10 flex items-center justify-center group bg-slate-50 dark:bg-black/40 shadow-2xl text-slate-900 dark:text-slate-100">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 dark:opacity-30"></div>
      
      {/* Dynamic Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((target, j) => (
            node.active && target.active && (
              <line 
                key={`${i}-${j}`}
                x1={`${node.x}%`} y1={`${node.y}%`}
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke="#10b981" strokeWidth="0.5" strokeDasharray="4,4"
                className="animate-pulse-slow"
              />
            )
          ))
        )}
      </svg>

      {/* Node Markers */}
      {nodes.map(node => (
        <div 
          key={node.id} 
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group/node"
        >
          <div className="relative">
            {node.active && (
              <div className={`absolute inset-[-10px] rounded-full animate-ping opacity-20 ${node.isCurrent ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
            )}
            <div className={`rounded-full border-2 transition-all duration-500 shadow-2xl cursor-crosshair ${
              node.isCurrent ? 'bg-emerald-500 border-white scale-125 z-20 shadow-emerald-500/50' : 
              node.active ? 'bg-blue-600 border-white/20' : 'bg-slate-800 border-white/5 opacity-30'
            } group-hover/node:scale-150`}
            style={{ width: `${node.size}px`, height: `${node.size}px` }}
            ></div>
            
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none whitespace-nowrap z-30 scale-75 md:scale-100">
               <div className="dark:bg-slate-900 bg-white border border-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-black dark:text-white text-slate-900 uppercase tracking-widest shadow-xl">
                 {node.label} {node.isCurrent && '(YOU)'}
               </div>
            </div>
          </div>
        </div>
      ))}

      {/* UI Overlays */}
      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Network Consensus: 100%</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <div className="glass-card p-3 rounded-2xl border-emerald-500/10 flex items-center gap-3 bg-white/50 dark:bg-black/50">
          <Globe className="w-4 h-4 text-emerald-500" />
          <div className="text-left">
            <p className="text-[7px] text-slate-500 font-black uppercase leading-none mb-1">Node Anchor</p>
            <p className="text-[9px] font-bold dark:text-white text-slate-900 uppercase truncate max-w-[100px]">{userLoc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Global Experience Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Profile Identity Command */}
        <div className="lg:col-span-8">
          <div className="glass-card p-6 md:p-12 rounded-[40px] md:rounded-[56px] relative overflow-hidden group h-full flex flex-col justify-between dark:bg-black/20 bg-white shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.05] to-transparent pointer-events-none"></div>
             <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-center pb-8 border-b border-slate-200 dark:border-white/5 mb-8">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-[32px] md:rounded-[40px] bg-slate-800 dark:bg-slate-700 border-2 border-white/5 flex items-center justify-center text-4xl md:text-5xl font-black text-emerald-400 shadow-2xl relative">
                    {user.name[0]}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-white dark:border-[#050706]">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none dark:text-white text-slate-900">{user.name}</h3>
                    <p className="text-slate-500 text-sm md:text-lg font-medium">{user.role} • {user.location}</p>
                    <div className="flex gap-2 pt-2">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">{user.wallet.tier} Node</span>
                       <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[9px] font-black rounded-full border border-blue-500/20 uppercase tracking-widest font-mono">AUTH_OK_256</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowIdentityCard(true)}
                  className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-[28px] text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-slate-900 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all shadow-lg active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  ID Shard
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 relative z-10">
                {[
                  { label: 'Treasury', val: totalBalance.toLocaleString(), unit: 'EAC', icon: Coins, col: 'text-emerald-500' },
                  { label: 'C(a) Index', val: user.metrics.agriculturalCodeU, unit: '', icon: Binary, col: 'text-blue-500' },
                  { label: 'm-Factor', val: user.metrics.timeConstantTau, unit: '', icon: Activity, col: 'text-amber-500' },
                  { label: 'U-Score', val: user.metrics.sustainabilityScore, unit: '%', icon: HeartPulse, col: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                       <stat.icon className={`w-3 h-3 ${stat.col}`} />
                       <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{stat.label}</p>
                    </div>
                    <p className="text-2xl md:text-4xl font-mono font-black tracking-tighter dark:text-white text-slate-900">
                      {stat.val}<span className="text-[10px] md:text-xs ml-1 opacity-40 font-sans">{stat.unit}</span>
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Global Visualization Column */}
        <div className="lg:col-span-4">
           <GlobalNetworkVisual userLoc={user.location} />
        </div>
      </div>

      {/* Industrial Quick Launchpad (Requested Features Enhanced) */}
      <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10 px-2 relative z-10">
           <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] italic flex items-center gap-4 dark:text-white text-slate-900">
              <Building2 className="w-6 h-6 text-indigo-400" /> Industrial <span className="text-indigo-400">Launchpad</span>
           </h3>
           <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-indigo-500/50 font-black uppercase tracking-widest">Shard Priority: High</span>
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
           {[
             { label: 'Form Shard Group', icon: PlusCircle, color: 'text-emerald-400', desc: 'Initialize Collective Node', target: 'industrial', action: 'FORM_COLLECTIVE', priority: true },
             { label: 'New Mission Campaign', icon: Rocket, color: 'text-indigo-400', desc: 'Initialize Scaling Shard', target: 'industrial', action: 'LAUNCH_MISSION', priority: true },
             { label: 'View Full Dossier', icon: UserCheck, color: 'text-teal-400', desc: 'Steward Registry Audit', target: 'industrial', action: 'VIEW_DOSSIER', priority: true },
             { label: 'Register Node', icon: Building2, color: 'text-amber-400', desc: 'Industry Facility Entry', target: 'industrial', action: 'REGISTER_NODE', priority: false },
             { label: 'Place Auction Bid', icon: Gavel, color: 'text-blue-400', desc: 'Tender Ingress Portal', target: 'industrial', action: 'PLACE_BID', priority: false },
           ].map((action, i) => (
             <button 
              key={i} 
              onClick={() => onNavigate(action.target as ViewState, action.action)}
              className={`glass-card p-8 rounded-[32px] border transition-all text-left flex flex-col gap-4 group active:scale-95 shadow-xl relative overflow-hidden ${action.priority ? 'border-indigo-500/40 bg-white/5' : 'border-white/5 hover:border-indigo-500/30 hover:bg-white/5'}`}
             >
                {action.priority && (
                  <div className="absolute -top-1 -right-1 w-12 h-12 bg-indigo-500/10 rotate-45 flex items-end justify-center pb-1">
                     <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl bg-slate-900 border border-white/5 group-hover:scale-110 transition-transform ${action.color}`}>
                   <action.icon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 dark:text-white text-slate-900">{action.label}</span>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">{action.desc}</p>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center">
                   <div className="flex gap-1">
                      {[0,1,2].map(dot => <div key={dot} className={`w-1 h-1 rounded-full ${action.priority ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>)}
                   </div>
                   <ArrowRight className={`w-4 h-4 transition-all ${action.priority ? 'text-indigo-400 translate-x-0' : 'text-slate-700'} group-hover:translate-x-1`} />
                </div>
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* SEHTI Strategy Core */}
        <div className="lg:col-span-2 glass-card p-8 md:p-12 rounded-[40px] border-emerald-500/10 dark:bg-white/[0.01] bg-white relative overflow-hidden group shadow-2xl">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <Layers className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic dark:text-white text-slate-900">SEHTI™ <span className="text-emerald-400">Analysis Shard</span></h3>
              </div>
              <span className="hidden sm:block text-[9px] font-mono text-slate-500 font-black uppercase tracking-widest">Framework v3.2.1-Final</span>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                 {[
                   { char: 'S', label: 'Societal', val: 85, color: 'bg-rose-500' },
                   { char: 'E', label: 'Environmental', val: 92, color: 'bg-emerald-500' },
                   { char: 'H', label: 'Human', val: 78, color: 'bg-blue-400' },
                 ].map((t) => (
                   <div key={t.char} className="space-y-2 group/row">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                           <span className={`w-6 h-6 flex items-center justify-center rounded-lg ${t.color} text-white text-[10px]`}>{t.char}</span>
                           <span className="text-slate-500 dark:group-hover/row:text-white group-hover/row:text-slate-900 transition-colors">{t.label}</span>
                        </span>
                        <span className="font-mono dark:text-white text-slate-900">{t.val}%</span>
                     </div>
                     <div className="h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${t.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]`} style={{ width: `${t.val}%` }}></div>
                     </div>
                   </div>
                 ))}
              </div>
              <div className="space-y-6">
                 {[
                   { char: 'T', label: 'Technological', val: 95, color: 'bg-indigo-500' },
                   { char: 'I', label: 'Industry', val: 88, color: 'bg-purple-500' },
                 ].map((t) => (
                   <div key={t.char} className="space-y-2 group/row">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                           <span className={`w-6 h-6 flex items-center justify-center rounded-lg ${t.color} text-white text-[10px]`}>{t.char}</span>
                           <span className="text-slate-500 dark:group-hover/row:text-white group-hover/row:text-slate-900 transition-colors">{t.label}</span>
                        </span>
                        <span className="font-mono dark:text-white text-slate-900">{t.val}%</span>
                     </div>
                     <div className="h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${t.color} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]`} style={{ width: `${t.val}%` }}></div>
                     </div>
                   </div>
                 ))}
                 <button 
                  onClick={() => onNavigate('intelligence')}
                  className="mt-4 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-[28px] w-full flex items-center justify-between group hover:bg-emerald-500/10 transition-colors"
                 >
                    <div className="flex items-center gap-3">
                       <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                       <div className="text-left">
                          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Oracle Insights</p>
                          <p className="text-[11px] font-bold dark:text-slate-400 text-slate-600 truncate">Improve I-Thrust Ledger Density</p>
                       </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>

        {/* Neural Oracle Module */}
        <div className="glass-card p-10 rounded-[40px] border-indigo-500/20 dark:bg-indigo-950/[0.03] bg-white flex flex-col justify-between group overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-48 h-48 text-indigo-400" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500 transition-colors">
                    <Bot className="w-7 h-7 text-indigo-400 group-hover:text-white" />
                 </div>
                 <div>
                    <h4 className="text-xl font-black uppercase tracking-widest italic dark:text-white text-slate-900">Oracle <span className="text-indigo-400">Node</span></h4>
                    <span className="text-[9px] font-mono text-indigo-500/60 uppercase font-black tracking-widest">Active_Session_ID: 0x882</span>
                 </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic font-medium">
                "Spectral telemetry indicates a 14.2% rise in soil moisture retention for your regional shard. Vouching protocols updated."
              </p>
           </div>
           <button 
            onClick={() => onNavigate('intelligence')}
            className="relative z-10 w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-8"
           >
              <Zap className="w-4 h-4 fill-current" /> Initialize Session
           </button>
        </div>
      </div>

      {/* Global External Environment Nodes */}
      <div className="glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-slate-200 dark:border-white/5 dark:bg-white/[0.01] bg-white relative overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center mb-10 px-2">
           <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.3em] italic flex items-center gap-4 dark:text-white text-slate-900">
              <Globe className="w-6 h-6 text-blue-500" /> External <span className="text-blue-500">Shards</span>
           </h3>
           <p className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Network Environments</p>
        </div>
        
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
           {[
             { label: 'X Node', icon: Twitter, url: 'https://x.com/EnvirosAgro', color: 'text-blue-400' },
             { label: 'YouTube', icon: Youtube, url: 'https://youtube.com/@envirosagro', color: 'text-red-500' },
             { label: 'TikTok', icon: Video, url: 'https://www.tiktok.com/@envirosagro', color: 'text-pink-500' },
             { label: 'Quora', icon: HelpCircle, url: 'https://www.quora.com/profile/EnvirosAgro', color: 'text-red-600' },
             { label: 'Telegram', icon: Send, url: 'https://t.me/EnvirosAgro', color: 'text-sky-400' },
             { label: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/company/modern-agrarian-revolution', color: 'text-blue-600' },
           ].map((link, i) => (
             <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-6 rounded-[32px] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-center flex flex-col items-center gap-4 group active:scale-95 shadow-sm dark:shadow-none"
             >
                <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-white/5 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none ${link.color}`}>
                   <link.icon className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 dark:text-white text-slate-900">{link.label}</span>
             </a>
           ))}
        </div>
      </div>

      {/* ID Shard Overlay */}
      {showIdentityCard && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setShowIdentityCard(false)}></div>
           <div className="relative z-10 w-full max-lg:max-w-lg space-y-6 flex flex-col items-center animate-in zoom-in duration-300">
              <div className="text-center space-y-2 mb-2">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Steward <span className="text-emerald-400">Identity</span></h2>
                 <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.4em] uppercase">Blockchain Anchor Secured</p>
              </div>
              <IdentityCard user={user} />
              <button 
                onClick={() => setShowIdentityCard(false)} 
                className="w-full max-w-xs py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Sync Dossier & Exit
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;