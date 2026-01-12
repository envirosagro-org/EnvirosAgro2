import React, { useState } from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Wind, 
  Globe, 
  Zap, 
  History, 
  ShieldCheck, 
  Database, 
  Activity, 
  ArrowUpRight, 
  Cloud, 
  Sprout, 
  Waves, 
  Binary, 
  BadgeCheck,
  CheckCircle2,
  Search,
  Download,
  Target,
  BarChart4,
  Heart,
  ChevronRight,
  ArrowLeftCircle,
  Gauge,
  // Added missing Bot icon import
  Bot
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from 'recharts';
import { User, ViewState } from '../types';

interface ImpactProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const CARBON_LEDGER_DATA = [
  { id: 'CBL-842-1', type: 'Sequestration', amount: 14.2, unit: 'tCO2e', status: 'VERIFIED', node: 'Node_Paris_04', date: '2h ago', method: 'Regen-Tilling' },
  { id: 'CBL-842-2', type: 'Reduction', amount: 8.5, unit: 'tCO2e', status: 'AUDITING', node: 'Stwd_Nairobi', date: '5h ago', method: 'Solar-Ingest' },
  { id: 'CBL-842-3', type: 'Offset', amount: 124.0, unit: 'tCO2e', status: 'VERIFIED', node: 'Global_Alpha', date: '1d ago', method: 'Bantu-Compost' },
];

const THRUST_IMPACT_DATA = [
  { thrust: 'Societal', val: 82, full: 100 },
  { thrust: 'Enviro', val: 94, full: 100 },
  { thrust: 'Human', val: 76, full: 100 },
  { thrust: 'Tech', val: 88, full: 100 },
  { thrust: 'Industry', val: 91, full: 100 },
];

const GROWTH_CHART_DATA = [
  { month: 'Jan', carbon: 420, water: 1200 },
  { month: 'Feb', carbon: 580, water: 1500 },
  { month: 'Mar', carbon: 740, water: 1300 },
  { month: 'Apr', carbon: 920, water: 1800 },
  { month: 'May', carbon: 1100, water: 2200 },
  { month: 'Jun', carbon: 1284, water: 2500 },
];

const SDG_ALIGNMENT = [
  { id: 2, name: 'Zero Hunger', progress: 84, color: 'bg-amber-600' },
  { id: 13, name: 'Climate Action', progress: 92, color: 'bg-emerald-600' },
  { id: 15, name: 'Life on Land', progress: 78, color: 'bg-green-600' },
  { id: 9, name: 'Industry & Innovation', progress: 95, color: 'bg-blue-600' },
];

const Impact: React.FC<ImpactProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'whole' | 'carbon' | 'thrusts'>('whole');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto">
      
      {/* Header Segment */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
           <Globe className="w-64 h-64 text-white" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
           <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-900/20">
              <TrendingUp className="w-10 h-10 text-white" />
           </div>
           <div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Whole <span className="text-emerald-400">Impact</span></h2>
              <p className="text-slate-500 text-sm md:text-lg font-medium italic mt-1">Quantifying the global regenerative heartbeat.</p>
           </div>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
           <button onClick={() => setActiveTab('carbon')} className="flex-1 md:flex-none px-8 py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Access Carbon Ledger</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[28px] w-fit mx-auto lg:mx-0 border dark:border-white/5 bg-black/5 dark:bg-black/40 shadow-sm">
        {[
          { id: 'whole', label: 'Network Vitality', icon: Globe },
          { id: 'carbon', label: 'Carbon Shards', icon: Wind },
          { id: 'thrusts', label: 'Thrust Resonance', icon: Target },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'whole' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-left duration-500">
             <div className="lg:col-span-8 glass-card p-8 md:p-12 rounded-[56px] border dark:border-white/5 bg-white dark:bg-black/40 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-center mb-10 px-4">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                         <Activity className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black dark:text-white text-slate-900 uppercase tracking-tighter italic">Sequestration <span className="text-emerald-400">Velocity</span></h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-black uppercase">Aggregate Growth</p>
                      <p className="text-3xl font-mono font-black text-emerald-400">+22.4%</p>
                   </div>
                </div>

                <div className="h-[400px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={GROWTH_CHART_DATA}>
                         <defs>
                            <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                         <XAxis dataKey="month" stroke="rgba(128,128,128,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                         <YAxis stroke="rgba(128,128,128,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                         <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                         <Area type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorImpact)" strokeLinecap="round" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-8 rounded-[48px] border dark:border-white/5 bg-white dark:bg-black/40 space-y-8 shadow-sm">
                   <h4 className="text-xs font-black dark:text-slate-400 text-slate-600 uppercase tracking-widest border-b dark:border-white/5 border-slate-100 pb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" /> SDG Alignment
                   </h4>
                   <div className="space-y-6">
                      {SDG_ALIGNMENT.map(goal => (
                         <div key={goal.id} className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                               <span>{goal.name}</span>
                               <span className="text-emerald-500 font-mono">{goal.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${goal.color} rounded-full transition-all duration-1000`} style={{ width: `${goal.progress}%` }}></div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[48px] dark:bg-emerald-600/5 bg-emerald-50 border border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-4 group">
                   <Sprout className="w-12 h-12 text-emerald-500 group-hover:scale-110 transition-transform" />
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Network Vitality</p>
                   <h4 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter">Healthy Biome</h4>
                   <p className="text-xs text-slate-500 italic">"Registry detected 14% improvement in regional soil resonance."</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'carbon' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
             <div className="glass-card rounded-[40px] overflow-hidden border dark:border-white/5 border-slate-200 bg-white dark:bg-black/40 shadow-sm">
                <div className="grid grid-cols-4 md:grid-cols-6 p-8 border-b dark:border-white/10 border-slate-200 bg-slate-50 dark:bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                   <span className="col-span-2">Shard Ledger ID</span>
                   <span className="hidden md:block">Method</span>
                   <span>Value</span>
                   <span>Node</span>
                   <span className="text-right">Consensus</span>
                </div>
                <div className="divide-y dark:divide-white/5 divide-slate-200">
                   {CARBON_LEDGER_DATA.map(entry => (
                     <div key={entry.id} className="grid grid-cols-4 md:grid-cols-6 p-8 items-center hover:bg-emerald-500/5 transition-all group">
                        <div className="col-span-2 flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="font-mono text-xs dark:text-white text-slate-900 font-bold">{entry.id}</span>
                        </div>
                        <div className="hidden md:block">
                           <span className="px-3 py-1 dark:bg-white/5 bg-slate-100 dark:border-white/5 border-slate-200 border rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">{entry.method}</span>
                        </div>
                        <div>
                           <p className="text-lg font-mono font-black text-emerald-500">{entry.amount} <span className="text-[10px] text-slate-500">t</span></p>
                        </div>
                        <div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight truncate block max-w-[100px]">{entry.node}</span>
                        </div>
                        <div className="text-right">
                           <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded-full border border-emerald-500/20">{entry.status}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-8 bg-slate-50 dark:bg-white/5 flex justify-between items-center px-12 border-t dark:border-white/10 border-slate-200">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Mitigation: <span className="dark:text-white text-slate-900">147.2 tCO2e</span></p>
                   <button className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:translate-x-1 transition-all">Sync global ledger <ChevronRight className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'thrusts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
             <div className="lg:col-span-7 glass-card p-10 rounded-[56px] border dark:border-white/5 bg-white dark:bg-black/40 flex flex-col items-center justify-center shadow-sm relative overflow-hidden min-h-[600px]">
                <div className="absolute top-0 left-0 p-8 opacity-[0.03]"><Target className="w-64 h-64 text-emerald-500" /></div>
                <div className="relative z-10 w-full text-center space-y-12">
                   <div>
                      <h4 className="text-3xl font-black dark:text-white text-slate-900 uppercase tracking-tighter italic">Pillar <span className="text-indigo-400">Resonance</span></h4>
                      <p className="text-slate-500 text-lg italic mt-2">Impact distribution across the EOS Pillars.</p>
                   </div>
                   
                   <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={THRUST_IMPACT_DATA}>
                            <PolarGrid stroke="rgba(128,128,128,0.2)" />
                            <PolarAngleAxis dataKey="thrust" stroke="rgba(128,128,128,0.6)" fontSize={11} fontStyle="italic" />
                            <Radar name="Impact Progress" dataKey="val" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '16px' }} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 dark:bg-indigo-900/5 bg-indigo-50 space-y-8 shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500 rounded-2xl shadow-xl">
                         <Bot className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black dark:text-white text-slate-900 uppercase italic">Impact <span className="text-indigo-500">Oracle</span></h4>
                   </div>
                   <p className="dark:text-slate-300 text-slate-600 text-lg leading-relaxed italic border-l-4 border-indigo-500/30 pl-8 font-medium">
                      "Strategic analysis suggests a <span className="text-emerald-500 font-bold">14% surplus</span> in Environmental sharding. Advise re-allocating social energy to the Human (H) pillar."
                   </p>
                   <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                      <Zap className="w-4 h-4 fill-current" /> Run Remediation
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="p-10 glass-card rounded-[40px] border dark:border-white/5 bg-white dark:bg-black/40 text-center group hover:bg-emerald-500/5 transition-all">
                      <Leaf className="w-8 h-8 text-emerald-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">E-Impact</p>
                      <h5 className="text-3xl font-mono font-black dark:text-white text-slate-900">94%</h5>
                   </div>
                   <div className="p-10 glass-card rounded-[40px] border dark:border-white/5 bg-white dark:bg-black/40 text-center group hover:bg-rose-500/5 transition-all">
                      <Heart className="w-8 h-8 text-rose-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">S-Impact</p>
                      <h5 className="text-3xl font-mono font-black dark:text-white text-slate-900">82%</h5>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Persistence Footer */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-sm">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <ShieldCheck className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
               <Binary className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Immutable Ledger Impact</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Every gram of offset is verified via ZK-Proof consensus across 64 global scientific nodes.</p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">TOTAL_ECO_SHARDS</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter">42,882</p>
         </div>
      </div>

    </div>
  );
};

export default Impact;