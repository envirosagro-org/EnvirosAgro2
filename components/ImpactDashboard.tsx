import React from 'react';
import { User, SustainabilityMetrics, Mission } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { 
  Leaf, TrendingUp, ShieldCheck, Zap, Globe, Target, 
  Activity, Award, Sparkles, BarChart3, Binary, CloudRain,
  Mountain, Wind, Droplets, Sun, Briefcase, History
} from 'lucide-react';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';

interface ImpactDashboardProps {
  user: User;
  metrics: SustainabilityMetrics;
  missions?: Mission[];
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ user, metrics, missions = [] }) => {
  if (!metrics) {
    return (
      <div className="p-20 flex flex-col items-center justify-center text-slate-700 opacity-50 border-2 border-dashed border-white/5 rounded-[40px] animate-in fade-in duration-700">
         <Activity size={64} className="mb-4 animate-pulse" />
         <p className="text-xs font-black uppercase tracking-[0.5em]">No_Impact_Telemetry_Detected</p>
      </div>
    );
  }

  const chartData = [
    { name: 'U-Code', value: metrics.agriculturalCodeU, full: 100 },
    { name: 'Tau-Time', value: metrics.timeConstantTau, full: 100 },
    { name: 'Sustain', value: metrics.sustainabilityScore, full: 100 },
    { name: 'Social', value: metrics.socialImmunity, full: 100 },
    { name: 'Viral', value: metrics.viralLoadSID, full: 100 },
    { name: 'Base-M', value: metrics.baselineM, full: 100 },
  ];

  const barData = [
    { name: 'Mon', impact: 45 },
    { name: 'Tue', impact: 52 },
    { name: 'Wed', impact: 48 },
    { name: 'Thu', impact: 61 },
    { name: 'Fri', impact: 55 },
    { name: 'Sat', impact: 67 },
    { name: 'Sun', impact: 72 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Impact Analytics" description="EnvirosAgro Impact Dashboard: Visualizing your environmental, social, and industrial sustainability metrics." />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Impact <span className="text-emerald-400">Ledger</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Strategic_Sustainability_Matrix_v4.2</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Globe size={14} className="text-emerald-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Shard_Reach</p>
                 <p className="text-xs font-black text-white">GLOBAL-04</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Sparkles size={14} className="text-amber-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Rank</p>
                 <p className="text-xs font-black text-white">GOLDEN_STEWARD</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Core KPIs */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-8 rounded-[40px] border border-emerald-500/20 bg-black/60 shadow-3xl relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <Leaf size={100} className="text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-6">
                 <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sustainability_Score</p>
                    <div className="flex items-end gap-2">
                       <h3 className="text-5xl font-black text-white italic tracking-tighter">{metrics.sustainabilityScore.toFixed(1)}</h3>
                       <p className="text-xs text-emerald-400 font-black mb-1.5 uppercase">Alpha</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Social Immunity</p>
                       <p className="text-md font-black text-indigo-400">{metrics.socialImmunity.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Viral Load</p>
                       <p className="text-md font-black text-rose-400">{metrics.viralLoadSID.toFixed(2)}</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black text-[9px] uppercase tracking-[0.2em] shadow-xl transition-all">GENERATE_AUDIT_DOC</button>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-6 shadow-3xl text-left">
              <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                 <Target size={16} className="text-indigo-400" /> Vector_Analytic
              </h3>
              <div className="h-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                       <PolarGrid stroke="#334155" />
                       <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                       <Radar name="Metrics" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency Threshold</span>
                    <span className="text-[10px] font-mono text-white font-black">94.2%</span>
                 </div>
                 <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '94%' }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Analytics Hub */}
        <div className="lg:col-span-2 space-y-6 text-left">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <BarChart3 size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tighter">Contribution_Flux</h3>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Shard_Emission_Reductions</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[8px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">
                    <span className="text-emerald-400 underline underline-offset-8 decoration-2">WEEKLY</span>
                    <span>MONTHLY</span>
                    <span>TOTAL</span>
                 </div>
              </div>

              <div className="h-64 relative mb-8">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                       <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }} />
                       <Bar dataKey="impact" radius={[8, 8, 0, 0]}>
                          {barData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#6366f1'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                          <Zap size={16} />
                       </div>
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Energy_Shard_Alpha</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                       "Optimizing the energy frequency for your local mesh nodes. Stability verified."
                    </p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                          <ShieldCheck size={16} />
                       </div>
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Consensus_Handshake</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                       "Verified by 12 independent oracles in the Kenya-Delta region. High resonance achieved."
                    </p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <History size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-indigo-400 font-black">ACTIVE_FLOW</span>
                 </div>
                 <h4 className="text-sm font-black text-white uppercase italic leading-none">Milestone Explorer</h4>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                    Discover your path to legendary Steward status through strategic environmental missions.
                 </p>
                 <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">VIEW_MILESTONE_TREE</button>
              </div>

              <div className="glass-card p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/5 space-y-4 shadow-xl">
                 <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                       <CloudRain size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-blue-400 font-black">92%_OPTIMAL</span>
                 </div>
                 <h4 className="text-sm font-black text-white uppercase italic leading-none">Resource Nexus</h4>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                    Monitor natural resource availability and replenishment rates across your managed zones.
                 </p>
                 <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">OPEN_RESOURCE_MAP</button>
              </div>
           </div>
        </div>

        {/* Right Dashboard Sidebar */}
        <div className="lg:col-span-1 space-y-6 text-left">
           <div className="glass-card p-10 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl">
              <div className="text-center space-y-2">
                 <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center justify-center gap-2">
                    <Award size={18} className="text-amber-400" /> Shard_Awards
                 </h3>
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Legacy_of_the_Enviro_Mesh</p>
              </div>

              <div className="space-y-6">
                 {[
                   { id: 'S1', title: 'Carbon Guardian', icon: ShieldCheck, color: 'text-emerald-400', level: 'MAX' },
                   { id: 'S2', title: 'Soil Architect', icon: Mountain, color: 'text-amber-400', level: 'LVL_04' },
                   { id: 'S3', title: 'Atmospheric Sage', icon: Wind, color: 'text-blue-400', level: 'LVL_02' },
                 ].map((award, i) => (
                   <div key={award.id} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${award.color} border border-white/5 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                         <award.icon size={22} />
                      </div>
                      <div className="min-w-0">
                         <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate">{award.title}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 w-12 bg-black rounded-full overflow-hidden">
                               <div className={`h-full ${award.color.replace('text-', 'bg-')}`} style={{ width: award.level === 'MAX' ? '100%' : '40%' }}></div>
                            </div>
                            <span className="text-[7px] font-black text-slate-500 uppercase">{award.level}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                 <button className="text-[8px] font-black text-indigo-400 uppercase tracking-widest hover:underline">Browse_All_Certificates</button>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <Binary size={26} />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic leading-none">Impact Minting</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                 Convert your verified impact shards into tradeable EAC tokens and legacy collectibles.
              </p>
              <button className="w-full py-4 bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">COMMENCE_MINTING_FLOW</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;
