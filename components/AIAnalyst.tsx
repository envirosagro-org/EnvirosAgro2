import React, { useState, useMemo } from 'react';
import { 
  Brain, Activity, TrendingUp, Zap, ShieldCheck, Microscope, 
  BarChart3, PieChart, Info, AlertTriangle, ChevronRight, 
  Search, Filter, Download, Share2, Target, Globe, Cpu,
  Loader2, Sparkles, Database, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell
} from 'recharts';
import { User, AgroResource } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useRegistryStore } from '../store/registryStore';

interface AIAnalystProps {
  user: User;
  onNavigate: (view: any) => void;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ user, onNavigate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'IDLE' | 'SCANNING' | 'MODELING' | 'DONE'>('IDLE');
  const [reportType, setReportType] = useState<'OVERVIEW' | 'TECHNICAL' | 'PREDICTIVE'>('OVERVIEW');

  const liveProducts = useRegistryStore(state => state.liveProducts);
  const carbonCredits = useRegistryStore(state => state.carbonCredits);
  const tasks = useRegistryStore(state => state.tasks);
  const mediaShards = useRegistryStore(state => state.mediaShards);

  const totalYield = useMemo(() => liveProducts.length * 450, [liveProducts]); // Mocked yield calculation
  const totalCO2 = useMemo(() => carbonCredits.reduce((acc, c) => acc + c.amount, 0), [carbonCredits]);
  const activeTaskCount = useMemo(() => tasks.filter(t => t.status !== 'Completed').length, [tasks]);

  const systemHealthData = [
    { subject: 'Mesh Stability', A: 85, full: 100 },
    { subject: 'Soil Health', A: 70, full: 100 },
    { subject: 'IoT Uptime', A: 92, full: 100 },
    { subject: 'Yield Efficiency', A: 65, full: 100 },
    { subject: 'Resource Flow', A: 88, full: 100 },
    { subject: 'Ledger Integrity', A: 98, full: 100 },
  ];

  const predictiveYieldData = [
    { name: 'Month 1', yield: 4000, target: 4500 },
    { name: 'Month 2', yield: 3000, target: 4600 },
    { name: 'Month 3', yield: 2000, target: 4700 },
    { name: 'Month 4', yield: 2780, target: 4800 },
    { name: 'Month 5', yield: 1890, target: 4900 },
    { name: 'Month 6', yield: 2390, target: 5000 },
    { name: 'Month 7', yield: 3490, target: 5100 },
  ];

  const handleRunDeepAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisPhase('SCANNING');
    await new Promise(r => setTimeout(r, 2000));
    setAnalysisPhase('MODELING');
    await new Promise(r => setTimeout(r, 2500));
    setAnalysisPhase('DONE');
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative">
      
      {/* 1. ARCHITECTURAL HUD */}
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 group shadow-4xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[20s] pointer-events-none">
            <Brain size={800} className="text-white" />
         </div>
         
         <div className="relative shrink-0">
            <div className="w-48 h-48 rounded-[56px] bg-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.4)] ring-8 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700 active:scale-95 cursor-pointer">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Brain size={96} className="text-white animate-float relative z-10" />
               <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[56px] animate-spin-slow"></div>
            </div>
         </div>

         <div className="space-y-6 relative z-10 text-center lg:text-left flex-1">
            <div className="space-y-2">
               <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-3">
                  <span className="px-5 py-2 bg-black/40 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/30 shadow-inner italic">AI_SPECIALIST_v8.2</span>
                  <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">INTELLIGENCE_LAYER_ACTIVE</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-tight drop-shadow-3xl">
                 Industrial <span className="text-indigo-400">Analyst.</span>
               </h2>
            </div>
            <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
               "Cross-referencing biological telemetry with ledger throughput. Leveraging neural clusters to predict yield fluctuations and optimize resource distribution."
            </p>
         </div>

         <div className="flex flex-col gap-6 shrink-0 w-full lg:w-auto">
            <button 
              onClick={handleRunDeepAnalysis}
              disabled={isAnalyzing}
              className="px-10 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[40px] font-black text-xs uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[20px] ring-white/5 active:scale-95 disabled:opacity-50"
            >
               {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="fill-current" />}
               {isAnalyzing ? 'Scanning Shards...' : 'Run Deep Audit'}
            </button>
            <div className="flex justify-between gap-4">
               <div className="flex-1 p-6 glass-card rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Active Tasks</span>
                  <span className="text-2xl font-mono font-black text-white">{activeTaskCount}</span>
               </div>
               <div className="flex-1 p-6 glass-card rounded-3xl border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Data Nodes</span>
                  <span className="text-2xl font-mono font-black text-indigo-400">{mediaShards.length + liveProducts.length}+</span>
               </div>
            </div>
         </div>
      </div>

      {/* 2. ANALYTICAL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: System Health Radar */}
        <div className="lg:col-span-5 space-y-10">
           <div className="glass-card p-12 rounded-[72px] border-2 border-indigo-500/20 bg-black/40 h-full flex flex-col relative overflow-hidden shadow-4xl group/radar">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none group-hover/radar:scale-110 transition-transform duration-[10s]"></div>
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">System <span className="text-indigo-400">Equilibrium</span></h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">REAL_TIME_NODE_BALANCE</p>
                 </div>
                 <Layers size={32} className="text-slate-700 group-hover/radar:rotate-12 transition-transform" />
              </div>

              <div className="flex-1 min-h-[400px] relative z-10 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={systemHealthData}>
                     <PolarGrid stroke="#334155" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                     <Radar
                       name="System"
                       dataKey="A"
                       stroke="#6366f1"
                       fill="#6366f1"
                       fillOpacity={0.6}
                     />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                       itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Core Stability</p>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-indigo-500" />
                    </div>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Optimization Delta</p>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '12%' }} className="h-full bg-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Predictive & Logic Cards */}
        <div className="lg:col-span-7 space-y-10">
           {/* Active Analysis Feed */}
           <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl space-y-8 relative overflow-hidden group/feed">
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                       <Activity size={24} />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Predictive <span className="text-indigo-400">Trajectory</span></h4>
                 </div>
                 <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all"><Filter size={16} /></button>
              </div>

              <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={predictiveYieldData}>
                     <defs>
                       <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
                     />
                     <Area type="monotone" dataKey="yield" stroke="#6366f1" fillOpacity={1} fill="url(#colorYield)" />
                     <Area type="monotone" dataKey="target" stroke="#10b981" strokeDasharray="5 5" fill="transparent" />
                   </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                 {[
                   { label: 'Forecast', value: '+12%', icon: TrendingUp, color: 'text-emerald-400' },
                   { label: 'Latency', value: '42ms', icon: Zap, color: 'text-blue-400' },
                   { label: 'Security', value: 'Alpha', icon: ShieldCheck, color: 'text-indigo-400' }
                 ].map((stat, i) => (
                   <div key={i} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center gap-5 group/stat hover:bg-white/5 transition-all">
                      <div className={`p-3 rounded-xl bg-black border border-white/5 ${stat.color}`}>
                         <stat.icon size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{stat.label}</span>
                        <span className={`text-xl font-mono font-black ${stat.color}`}>{stat.value}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Specialist Recommendations */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/60 shadow-xl group/card relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/card:scale-125 transition-transform"><Target size={160} /></div>
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                       <Target size={24} className="text-amber-500" />
                       <h5 className="text-xl font-black text-white uppercase italic tracking-tighter">Strategic Gap</h5>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed italic opacity-70 group-hover/card:opacity-100 transition-opacity">
                       "Biological node cluster in Zone D shows a 15% efficiency lag compared to neighboring sectors. Recommend recalibrating soil moisture thresholds."
                    </p>
                    <button className="flex items-center gap-3 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                       RECALIBRATE_AUTO <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/60 shadow-xl group/card relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/card:scale-125 transition-transform"><Globe size={160} /></div>
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                       <Globe size={24} className="text-indigo-400" />
                       <h5 className="text-xl font-black text-white uppercase italic tracking-tighter">Market Pulse</h5>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed italic opacity-70 group-hover/card:opacity-100 transition-opacity">
                       "EAT token liquidity in the secondary registry is trending upward. Ideal window for sharding surplus assets into the open marketplace."
                    </p>
                    <button onClick={() => onNavigate('marketplace')} className="flex items-center gap-3 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                       GOTO_MARKETPLACE <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Specialist Console */}
           <div className="glass-card p-8 rounded-[48px] border border-indigo-500/20 bg-indigo-950/20 flex items-center justify-between gap-10 group/console">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-[24px] bg-indigo-600 flex items-center justify-center text-white shadow-xl relative overflow-hidden">
                    <Microscope size={28} className="relative z-10 animate-float" />
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 </div>
                 <div className="text-left space-y-1">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest m-0 leading-none">AI_CONSULTANT_IDLE</p>
                    <h5 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Ready for Deep Shard Audit</h5>
                 </div>
              </div>
              <button 
                onClick={handleRunDeepAnalysis}
                className="px-8 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-slate-200 active:scale-95 transition-all"
              >
                Trigger Ingest
              </button>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.98); }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-scan { animation: scan 3s linear infinite; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
      `}</style>
    </div>
  );
};

export default AIAnalyst;
