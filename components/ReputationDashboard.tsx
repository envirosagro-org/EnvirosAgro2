import React, { useEffect, useState, useMemo } from 'react';
import { 
  Award, Zap, ShieldCheck, Star, Users, 
  TrendingUp, BarChart3, Globe, Activity, 
  History, CheckCircle2, ChevronRight, 
  ArrowUpRight, Heart, MessageSquare, 
  Target, Sparkles, Medal, BadgeCheck,
  SmartphoneNfc, Cpu, Binary
} from 'lucide-react';
import { getReputationEvents, calculateReputation, getReputationHistory } from '../services/reputationService';
import { ReputationEvent, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface ReputationDashboardProps {
  user: User;
}

const ReputationDashboard: React.FC<ReputationDashboardProps> = ({ user }) => {
  const [events, setEvents] = useState<ReputationEvent[]>([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [activeVector, setActiveVector] = useState<'all' | 'social' | 'industrial' | 'environmental'>('all');

  useEffect(() => {
    const evs = getReputationEvents(user.esin);
    setEvents(evs);
    setScore(calculateReputation(evs));
    setHistory(getReputationHistory(user.esin));
  }, [user.esin]);

  const radarData = [
    { subject: 'Social', A: 120, fullMark: 150 },
    { subject: 'Industrial', A: 98, fullMark: 150 },
    { subject: 'Enviro', A: 86, fullMark: 150 },
    { subject: 'Data', A: 99, fullMark: 150 },
    { subject: 'Ethical', A: 85, fullMark: 150 },
  ];

  const badges = [
    { id: 'B1', title: 'Network Pioneer', icon: Globe, color: 'text-indigo-400', date: 'Jan 2024' },
    { id: 'B2', title: 'Carbon Guardian', icon: ShieldCheck, color: 'text-emerald-400', date: 'Feb 2024' },
    { id: 'B3', title: 'Hyper-Liquidity', icon: Zap, color: 'text-amber-400', date: 'Mar 2024' },
    { id: 'B4', title: 'Consensus Oracle', icon: Cpu, color: 'text-rose-400', date: 'Apr 2024' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Reputation Engine" description="Steward Resonance Terminal: Tracking social proof, contribution fidelity, and network-wide reputation shards." />
      
      {/* resonance Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Steward <span className="text-amber-400">Resonance</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Social_Proof_Protocol_v3.1</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Star size={14} className="text-amber-400 animate-pulse" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Shard_Status</p>
                 <p className="text-xs font-black text-white">ELITE_STWD</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Award size={14} className="text-indigo-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Global_Rank</p>
                 <p className="text-xs font-black text-white">#142</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Resonance Core */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-amber-500/20 bg-black/60 shadow-3xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <Binary size={100} className="text-amber-500" />
              </div>

              <div className="w-32 h-32 rounded-full border-4 border-amber-500/20 flex items-center justify-center relative mb-6">
                 <div className="absolute inset-0 border-t-4 border-amber-500 rounded-full animate-spin"></div>
                 <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-white tracking-widest leading-none">{Math.floor(score/10)}</span>
                    <span className="text-[8px] font-black text-amber-500 uppercase mt-1">RES_LVL</span>
                 </div>
              </div>

              <div className="space-y-1 mb-8">
                 <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{user.name}</h3>
                 <p className="text-[8px] text-slate-500 font-mono tracking-widest">{user.esin}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Impact Points</p>
                    <p className="text-md font-black text-white">{score}</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Trust Score</p>
                    <p className="text-md font-black text-emerald-400">9.8</p>
                 </div>
              </div>

              <button className="w-full py-4 mt-8 bg-amber-600 hover:bg-amber-500 text-white rounded-[24px] font-black text-[9px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
                 CLAIM_RESONANCE_EAC <Zap size={14} />
              </button>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-4 shadow-3xl">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <History size={14} /> Recent_Vouches
              </h3>
              <div className="space-y-3">
                 {[
                   { from: 'EA-ROBO-9214', msg: 'Precise data ingestion shard.', time: '2m ago' },
                   { from: 'EA-GAIA-1104', msg: 'Resilient node maintenance.', time: '1h ago' },
                 ].map((v, i) => (
                   <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 text-left">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[7px] font-black text-amber-400 italic">{v.from}</span>
                         <span className="text-[6px] text-slate-600 font-bold">{v.time}</span>
                      </div>
                      <p className="text-[9px] text-slate-300 italic font-medium leading-relaxed">"{v.msg}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Middle Column: Analytics & Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl text-left">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" /> Contribution_History
                 </h3>
                 <div className="flex items-center gap-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                    <span>1D</span>
                    <span className="text-amber-400 underline decoration-2 underline-offset-4">1M</span>
                    <span>1Y</span>
                 </div>
              </div>

              <div className="h-64 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                       <defs>
                          <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" hide />
                       <YAxis hide />
                       <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }} />
                       <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRep)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/5">
                 <div className="space-y-4">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Vector_Distribution</p>
                    <div className="h-44 relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                             <PolarGrid stroke="#334155" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                             <Radar name="Resonance" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Shard_Achievements</p>
                    <div className="grid grid-cols-2 gap-3">
                       {badges.map(badge => (
                         <div key={badge.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center text-center group cursor-pointer hover:bg-white/10 transition-all">
                            <badge.icon size={20} className={`${badge.color} mb-2 group-hover:scale-125 transition-transform`} />
                            <p className="text-[8px] text-white font-black uppercase tracking-tighter leading-tight mb-1">{badge.title}</p>
                            <p className="text-[6px] text-slate-600 font-bold uppercase">{badge.date}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl text-left">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <BadgeCheck size={28} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase italic">Consensus Oracle</h4>
                    <p className="text-[9px] text-slate-500 font-bold mt-1 leading-relaxed uppercase tracking-widest">
                       "You have reached enough resonance for Oracle status. You can now verify higher-tier environmental shards."
                    </p>
                 </div>
              </div>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">CLAIM_ORACLE_RIGHTS</button>
           </div>
        </div>

        {/* Right Column: Event Feed */}
        <div className="lg:col-span-1 space-y-6 text-left">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-6 shadow-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <Activity size={16} className="text-emerald-400" /> Event_Feed
                </h3>
              </div>

              <div className="space-y-4">
                 {events.map((event, i) => (
                   <div key={event.id} className="relative pl-6 pb-6 last:pb-0 border-l border-white/5">
                      <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                      <div className="space-y-1">
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-white uppercase tracking-tighter">{event.type}</span>
                            <span className="text-[7px] text-emerald-400 font-black">+{event.points}</span>
                         </div>
                         <p className="text-[7px] text-slate-600 font-mono tracking-widest uppercase truncate">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                   </div>
                 ))}
                 {events.length === 0 && (
                   <p className="text-center py-10 text-[8px] text-slate-700 italic font-black uppercase tracking-widest">No recent resonance flux.</p>
                 )}
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-2xl text-[8px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                 DOWNLOAD_TRUST_REPORT <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-amber-500/20 bg-amber-500/5 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                 <SmartphoneNfc size={22} className="text-amber-400" />
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase italic leading-none mb-2">Social Handshake</h4>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                    Tap with another Steward's shard to exchange resonance and verify physical proximity.
                 </p>
              </div>
              <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">INITIALIZE_TAP_HANDSHAKE</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationDashboard;
