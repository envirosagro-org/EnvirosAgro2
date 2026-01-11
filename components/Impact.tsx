import React, { useState, useMemo } from 'react';
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
  Flame, 
  Binary, 
  BadgeCheck,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Info,
  Layers,
  Sparkles,
  Bot,
  Lock,
  Eye,
  ArrowRight,
  Target,
  BarChart4,
  Heart,
  Cpu,
  Factory,
  Users,
  Dna,
  ArrowLeftCircle,
  Timer,
  /* Added Gauge and ChevronRight to fix 'Cannot find name' errors */
  Gauge,
  ChevronRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
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
  { id: 'CBL-842-4', type: 'Sequestration', amount: 4.8, unit: 'tCO2e', status: 'VERIFIED', node: 'Eco_Relay_P4', date: '3d ago', method: 'Wait-Less-Irrigation' },
  { id: 'CBL-842-5', type: 'Audit Proof', amount: 0.0, unit: 'tCO2e', status: 'VERIFIED', node: 'Valencia_Hub', date: '4d ago', method: 'Audit-Vouch' },
];

const THRUST_IMPACT_DATA = [
  { thrust: 'Societal', val: 82, full: 100, color: '#f43f5e' },
  { thrust: 'Enviro', val: 94, full: 100, color: '#10b981' },
  { thrust: 'Human', val: 76, full: 100, color: '#14b8a6' },
  { thrust: 'Tech', val: 88, full: 100, color: '#3b82f6' },
  { thrust: 'Industry', val: 91, full: 100, color: '#8b5cf6' },
];

const GROWTH_CHART_DATA = [
  { month: 'Jan', carbon: 420, water: 1200, social: 85 },
  { month: 'Feb', carbon: 580, water: 1500, social: 88 },
  { month: 'Mar', carbon: 740, water: 1300, social: 92 },
  { month: 'Apr', carbon: 920, water: 1800, social: 94 },
  { month: 'May', carbon: 1100, water: 2200, social: 96 },
  { month: 'Jun', carbon: 1284, water: 2500, social: 98 },
];

const SDG_ALIGNMENT = [
  { id: 2, name: 'Zero Hunger', progress: 84, color: 'bg-amber-600' },
  { id: 13, name: 'Climate Action', progress: 92, color: 'bg-emerald-600' },
  { id: 15, name: 'Life on Land', progress: 78, color: 'bg-green-600' },
  { id: 9, name: 'Industry & Innovation', progress: 95, color: 'bg-blue-600' },
];

const Impact: React.FC<ImpactProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'whole' | 'carbon' | 'thrusts'>('whole');
  const [searchTerm, setSearchTerm] = useState('');

  const summaryStats = [
    { label: 'Net Carbon Negative', val: '14.2K tCO2e', icon: Wind, col: 'text-blue-400' },
    /* Fix: Gauge is now imported */
    { label: 'Resource Efficiency', val: '+42%', icon: Gauge, col: 'text-emerald-400' },
    { label: 'Steward Wellness', val: 'A+', icon: Heart, col: 'text-rose-400' },
    { label: 'Trust Equilibrium', val: '0.98', icon: ShieldCheck, col: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
      {/* Registry Context */}
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[8px] text-slate-600 font-black uppercase">Consensus Status</p>
            <p className="text-[10px] font-mono font-bold text-emerald-400">GLOBAL_SYNC_OK</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Impact Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Globe className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.4)] ring-4 ring-white/10 shrink-0 animate-float">
              <TrendingUp className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">EOS_IMPACT_MATRIX_v4.2</span>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none mt-2">Whole <span className="text-emerald-400">Impact</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium italic">
                 Quantifying the tangible pulse of the EnvirosAgro™ network. From carbon sharding to social trust remediation, witness the global regenerative transformation.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                <button 
                  onClick={() => setActiveTab('carbon')}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-gap-3 active:scale-95 hover:shadow-emerald-500/20"
                >
                  <Wind className="w-5 h-5" /> Access Carbon Ledger
                </button>
                <button 
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-emerald-400" /> Export Shard Data
                </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {summaryStats.map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/20 transition-all shadow-lg active:scale-95">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Segment Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'whole', label: 'Ecosystem Vitality', icon: Globe },
          { id: 'carbon', label: 'Carbon Ledger', icon: Wind },
          { id: 'thrusts', label: 'Thrust Analysis', icon: Target },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">
        {activeTab === 'whole' && (
          <div className="space-y-12 animate-in slide-in-from-left-6 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   <div className="flex justify-between items-center mb-12 relative z-10 px-4">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-xl">
                            <Activity className="w-10 h-10 text-emerald-400" />
                         </div>
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Regeneration <span className="text-emerald-400">Velocity</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2 font-mono">Network-wide Sequestration Metrics</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Growth Factor</p>
                         <p className="text-5xl font-mono font-black text-white">+22.4<span className="text-2xl text-emerald-500">%</span></p>
                      </div>
                   </div>

                   <div className="h-[480px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={GROWTH_CHART_DATA}>
                            <defs>
                               <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                               <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px' }} />
                            <Area type="monotone" dataKey="carbon" stroke="#10b981" strokeWidth={8} fillOpacity={1} fill="url(#colorCarbon)" strokeLinecap="round" />
                            <Area type="monotone" dataKey="social" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSocial)" strokeDasharray="5 5" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[48px] bg-emerald-600/5 border-emerald-500/20 flex flex-col items-center justify-center text-center space-y-10 group relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse"></div>
                      <div className="w-24 h-24 bg-emerald-500/20 rounded-[32px] flex items-center justify-center border border-emerald-500/40 shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                         <Sprout className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div className="space-y-4 relative z-10">
                         <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Soil Health Pulse</h4>
                         <p className="text-slate-400 text-lg italic leading-relaxed font-medium">Aggregate network soil resilience has improved by <span className="text-emerald-400 font-bold">18.4%</span> across 4,281 registry nodes.</p>
                      </div>
                      <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl relative z-10 active:scale-95">View Spatial Health Map</button>
                   </div>

                   <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 shadow-2xl">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4 flex items-center gap-2">
                         <Target className="w-4 h-4 text-indigo-400" /> SDG Alignment Progress
                      </h4>
                      <div className="space-y-6">
                         {SDG_ALIGNMENT.map(goal => (
                            <div key={goal.id} className="space-y-3 group/goal">
                               <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                                  <span className="group-hover/goal:text-white transition-colors">{goal.id}. {goal.name}</span>
                                  <span className="text-white font-mono">{goal.progress}%</span>
                               </div>
                               <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                  <div className={`h-full ${goal.color} rounded-full transition-all duration-1000 shadow-xl`} style={{ width: `${goal.progress}%` }}></div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Live Impact Stream */}
             <div className="glass-card p-12 rounded-[64px] border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10 px-4">
                   <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                      <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Live <span className="text-blue-400">Impact Ticker</span></h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                      { msg: "Batch #402 Carbon Proof Verified", node: "Zone 4 NE", time: "2m ago", type: "Success" },
                      { msg: "Ancestral Seed Shard Anchored", node: "Bantu Clan", time: "14m ago", type: "Discovery" },
                      { msg: "Registry Resonance Spike: 1.42x", node: "Global Core", time: "1h ago", type: "System" },
                      { msg: "New Sequestration Milestone: 14K t", node: "Network", time: "2h ago", type: "Achievement" },
                   ].map((event, i) => (
                      <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-[32px] group hover:border-blue-500/40 transition-all cursor-crosshair">
                         <div className="flex justify-between items-center mb-4">
                            <span className="text-[8px] font-black text-slate-600 uppercase font-mono">{event.time}</span>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         </div>
                         <p className="text-sm font-bold text-white mb-2 leading-tight italic group-hover:text-blue-400 transition-colors">"{event.msg}"</p>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{event.node}</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'carbon' && (
          <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 px-4">
                <div className="space-y-3">
                   <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
                      Carbon <span className="text-emerald-400">Footprint Ledger</span>
                   </h3>
                   <p className="text-slate-400 text-xl font-medium italic">Immutable scientific registry of network-wide carbon minting and mitigation shards.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="relative group flex-1 md:w-96">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input 
                        type="text" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by Ledger ID, Node or Method..." 
                        className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 pl-16 pr-8 text-sm text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 font-mono tracking-widest"
                      />
                   </div>
                </div>
             </div>

             <div className="glass-card rounded-[64px] overflow-hidden border-white/5 bg-black/40 shadow-3xl">
                <div className="overflow-x-auto custom-scrollbar">
                   <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                         <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Shard Ledger ID</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Operation Type</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Verified Node</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Scientific Method</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Impact Value</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest">Consensus</th>
                            <th className="p-10 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Ledger Age</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {CARBON_LEDGER_DATA.map(entry => (
                           <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer active:bg-white/[0.05]">
                              <td className="p-10">
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="font-mono text-sm text-white font-black group-hover:text-emerald-400 transition-colors">{entry.id}</span>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter italic">{entry.type}</span>
                              </td>
                              <td className="p-10">
                                 <div className="flex items-center gap-3">
                                    <Database className="w-4 h-4 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{entry.node}</span>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{entry.method}</span>
                              </td>
                              <td className="p-10">
                                 <div className="flex items-center gap-3">
                                    <p className="text-2xl font-mono font-black text-white leading-none">{entry.amount} <span className="text-[11px] text-slate-600 font-sans">{entry.unit}</span></p>
                                 </div>
                              </td>
                              <td className="p-10">
                                 <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${
                                   entry.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                                 }`}>
                                    {entry.status}
                                 </span>
                              </td>
                              <td className="p-10 text-right">
                                 <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-slate-500 font-mono font-bold">{entry.date}</span>
                                    <p className="text-[8px] text-slate-800 font-black uppercase">Finality Block #{(Math.random()*1000).toFixed(0)}</p>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-10 bg-white/5 border-t border-white/10 flex justify-between items-center px-12">
                   <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">Total Ecosystem Carbon Sharded: <span className="text-white">14.2K tCO2e</span></p>
                   {/* Fix: ChevronRight is now imported */}
                   <button className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-all group">
                      Sync with Global Registry <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'thrusts' && (
           <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-7 glass-card p-12 rounded-[64px] border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-3xl relative overflow-hidden min-h-[600px]">
                    <div className="absolute top-0 left-0 p-12 opacity-[0.03]"><Target className="w-80 h-80 text-white" /></div>
                    <div className="relative z-10 w-full text-center space-y-12">
                       <div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Pillar <span className="text-indigo-400">Resonance</span></h4>
                          <p className="text-slate-500 text-lg italic mt-4">Cross-thrust impact distribution across the five EOS pillars.</p>
                       </div>
                       
                       <div className="h-[450px] w-full min-h-0 min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={THRUST_IMPACT_DATA}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="thrust" stroke="rgba(255,255,255,0.4)" fontSize={11} fontStyle="italic" />
                                <Radar name="Impact Progress" dataKey="val" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                                <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' }} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-5 space-y-8">
                    <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-900/5 space-y-10 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Sparkles className="w-48 h-48 text-indigo-400" /></div>
                       <div className="flex items-center gap-6 relative z-10">
                          <div className="p-4 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                             <Bot className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic">Impact <span className="text-indigo-400">Oracle Sync</span></h4>
                             <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">High-Fidelity Framework Analysis</p>
                          </div>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none shadow-inner">
                          <p className="text-slate-300 text-lg leading-relaxed italic font-medium border-l-4 border-indigo-500/40 pl-8">
                             "Strategic analysis indicates a <span className="text-emerald-400 font-bold">14.2% surplus</span> in Environmental (E) thrust sharding. Advise redirecting social energy to the Human (H) pillar to remediate regional wellness gaps."
                          </p>
                       </div>
                       <button className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          <Zap className="w-5 h-5 fill-current" /> Initialize Remediation Shard
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-10 glass-card rounded-[44px] border-emerald-500/20 bg-emerald-500/5 text-center group hover:bg-emerald-500/10 transition-all">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                             <Leaf className="w-8 h-8 text-emerald-400" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-black uppercase mb-1">E-Impact</p>
                          <h5 className="text-3xl font-mono font-black text-white">94<span className="text-sm opacity-40">%</span></h5>
                       </div>
                       <div className="p-10 glass-card rounded-[44px] border-rose-500/20 bg-rose-500/5 text-center group hover:bg-rose-500/10 transition-all">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                             <Heart className="w-8 h-8 text-rose-400" />
                          </div>
                          <p className="text-[10px] text-slate-500 font-black uppercase mb-1">S-Impact</p>
                          <h5 className="text-3xl font-mono font-black text-white">82<span className="text-sm opacity-40">%</span></h5>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Global Persistence Footer */}
      <div className="p-20 glass-card rounded-[80px] border-emerald-500/30 bg-emerald-950/5 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <ShieldCheck className="w-[600px] h-[600px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-14 relative z-10 text-center lg:text-left flex-col lg:flex-row">
            <div className="w-40 h-40 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] ring-[30px] ring-white/5 animate-pulse group cursor-pointer hover:scale-105 transition-transform duration-700">
               <Binary className="w-20 h-20 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div className="space-y-6">
               <div className="space-y-2">
                  <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Immutable Ledger <span className="text-emerald-400">Impact</span></h4>
                  <p className="text-emerald-500/60 font-mono text-[11px] tracking-[0.6em] uppercase">Blockchain Finality Verified</p>
               </div>
               <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-xl">
                  Every gram of carbon offset is proven via multi-sig consensus across 64 global scientific validator nodes.
               </p>
               <div className="flex gap-10 pt-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-3">
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transparency Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Lock className="w-5 h-5 text-blue-500" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cryptographic Proof</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="text-center lg:text-right relative z-10 shrink-0 space-y-2">
            <p className="text-[13px] text-slate-600 font-black uppercase mb-4 tracking-[0.8em] px-2 border-b border-white/10 pb-6">TOTAL_ECO_SHARDS_ANCHORED</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">42,882</p>
            <div className="flex items-center justify-center lg:justify-end gap-3 mt-6">
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
               <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node Sync: Nominal</span>
            </div>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Impact;