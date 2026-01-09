
import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  BarChart4, 
  Activity, 
  Zap, 
  Target, 
  RefreshCcw, 
  ShieldCheck, 
  Settings, 
  Sparkles, 
  Bot, 
  Loader2, 
  Search, 
  Scale, 
  Dna, 
  Cpu, 
  Factory, 
  LineChart,
  ChevronRight,
  ClipboardList,
  Gauge,
  Layers,
  History,
  AlertCircle,
  TrendingUp,
  Box,
  Binary,
  LayoutGrid,
  Trello,
  Plus,
  ArrowRight,
  CheckCircle2,
  Filter,
  Tag
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { chatWithAgroExpert } from '../services/geminiService';

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62 }, { batch: 'B2', val: 65 }, { batch: 'B3', val: 61 },
  { batch: 'B4', val: 78 }, { batch: 'B5', val: 63 }, { batch: 'B6', val: 60 },
  { batch: 'B7', val: 58 }, { batch: 'B8', val: 85 }, { batch: 'B9', val: 64 },
  { batch: 'B10', val: 61 }, { batch: 'B11', val: 62 }, { batch: 'B12', val: 63 },
];

type KanbanStatus = 'backlog' | 'in-progress' | 'review' | 'done';

interface KanbanTask {
  id: string;
  title: string;
  thrust: 'Societal' | 'Environmental' | 'Human' | 'Technological' | 'Industry';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: KanbanStatus;
}

const INITIAL_TASKS: KanbanTask[] = [
  { id: 'T1', title: 'Soil pH Verification Shard #882', thrust: 'Technological', priority: 'High', status: 'backlog' },
  { id: 'T2', title: 'Ancestral Seed Mapping - Zone 2', thrust: 'Societal', priority: 'Medium', status: 'in-progress' },
  { id: 'T3', title: 'Carbon Offset Audit - Batch #10', thrust: 'Environmental', priority: 'Critical', status: 'in-progress' },
  { id: 'T4', title: 'Worker Wellness Diagnostic', thrust: 'Human', priority: 'Low', status: 'review' },
  { id: 'T5', title: 'Registry Sync v3.2 Patch', thrust: 'Industry', priority: 'Critical', status: 'done' },
];

const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'sigma' | 'kpis' | 'kanban'>('kanban');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
  // Kanban State
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskThrust, setNewTaskThrust] = useState<KanbanTask['thrust']>('Industry');

  // Sigma Level Calculator State
  const [defects, setDefects] = useState(3);
  const [opportunities, setOpportunities] = useState(1000);
  
  const sigmaLevel = useMemo(() => {
    const dpmo = (defects / opportunities) * 1000000;
    if (dpmo <= 3.4) return 6.0;
    if (dpmo <= 233) return 5.0;
    if (dpmo <= 6210) return 4.0;
    if (dpmo <= 66807) return 3.0;
    if (dpmo <= 308537) return 2.0;
    return 1.0;
  }, [defects, opportunities]);

  const NETWORK_KPIS = [
    { label: 'Global C(a) Average', val: '1.42', trend: '+0.04', status: 'Optimal', col: 'text-emerald-400', icon: Target },
    { label: 'Network m™ Stability', val: '12.85', trend: '-0.12', status: 'Stable', col: 'text-blue-400', icon: Activity },
    { label: 'Social Immunity Index', val: '64.2%', trend: '+4.5%', status: 'Rising', col: 'text-rose-400', icon: Dna },
    { label: 'Registry Sync Latency', val: '18ms', trend: '-2ms', status: 'Nominal', col: 'text-indigo-400', icon: Cpu },
    { label: 'Carbon Minting ROI', val: '15.8%', trend: '+1.2%', status: 'V.High', col: 'text-amber-400', icon: Zap },
  ];

  const SIGMA_STAGES = [
    { id: 'D', name: 'Define', desc: 'Scope node sustainability bottlenecks.', col: 'bg-blue-500' },
    { id: 'M', name: 'Measure', desc: 'Collect EOS telemetry data shards.', col: 'bg-emerald-500' },
    { id: 'A', name: 'Analyze', desc: 'Identify variance in C(a) growth.', col: 'bg-indigo-500' },
    { id: 'I', name: 'Improve', desc: 'Optimize m™ resilience variables.', col: 'bg-amber-500' },
    { id: 'C', name: 'Control', desc: 'Immutable ZK-governance checks.', col: 'bg-rose-500' },
  ];

  const handleSigmaAudit = async () => {
    if (!sigmaInput.trim()) return;
    setIsOptimizing(true);
    const prompt = `Act as an EnvirosAgro Six Sigma Master Black Belt. Analyze this process bottleneck: "${sigmaInput}". 
    Provide a detailed technical DMAIC improvement strategy. 
    Include a SIPOC (Supplier, Input, Process, Output, Customer) table description 
    and root-cause identification aligned with the Five Thrusts™ and EOS protocol.`;
    const response = await chatWithAgroExpert(prompt, []);
    setSigmaAdvice(response.text);
    setIsOptimizing(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: KanbanTask = {
      id: `T-${Date.now()}`,
      title: newTaskTitle,
      thrust: newTaskThrust,
      priority: 'Medium',
      status: 'backlog'
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const moveTask = (id: string, newStatus: KanbanStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getThrustColor = (thrust: KanbanTask['thrust']) => {
    switch (thrust) {
      case 'Societal': return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
      case 'Environmental': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
      case 'Human': return 'text-teal-400 border-teal-500/30 bg-teal-500/5';
      case 'Technological': return 'text-blue-400 border-blue-500/30 bg-blue-500/5';
      case 'Industry': return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
    }
  };

  const getPriorityColor = (p: KanbanTask['priority']) => {
    switch (p) {
      case 'Critical': return 'text-rose-500';
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-amber-400';
      case 'Low': return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit mx-auto lg:mx-0">
        <button 
          onClick={() => setActiveTool('kanban')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTool === 'kanban' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <Trello className="w-4 h-4" /> Agro-Kanban
        </button>
        <button 
          onClick={() => setActiveTool('sigma')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTool === 'sigma' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <Scale className="w-4 h-4" /> Six Sigma Ingest
        </button>
        <button 
          onClick={() => setActiveTool('kpis')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTool === 'kpis' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          <BarChart4 className="w-4 h-4" /> Network KPIs
        </button>
      </div>

      {activeTool === 'kanban' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* Kanban Hero */}
           <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 flex flex-col lg:flex-row items-center gap-10">
              <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-2xl shrink-0">
                 <Trello className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1 space-y-2 text-center lg:text-left">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-tight">Agro-Kanban <span className="text-emerald-400">Ledger</span></h2>
                 <p className="text-slate-400 text-lg font-medium">Coordinate decentralized agricultural operations across the Five Thrusts™ in real-time.</p>
              </div>
              <div className="flex gap-4 p-4 bg-black/40 rounded-3xl border border-white/5 items-center">
                 <div className="text-center px-4">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Active</p>
                    <p className="text-xl font-mono font-black text-white">{tasks.filter(t => t.status !== 'done').length}</p>
                 </div>
                 <div className="w-px h-10 bg-white/10"></div>
                 <div className="text-center px-4">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Settled</p>
                    <p className="text-xl font-mono font-black text-emerald-400">{tasks.filter(t => t.status === 'done').length}</p>
                 </div>
              </div>
           </div>

           {/* Task Ingest */}
           <div className="glass-card p-8 rounded-[40px] border-white/5 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="New Operation Title..." 
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-emerald-500/20 outline-none"
                 />
              </div>
              <select 
                value={newTaskThrust}
                onChange={e => setNewTaskThrust(e.target.value as any)}
                className="bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-xs font-black text-white uppercase outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
              >
                 <option>Societal</option>
                 <option>Environmental</option>
                 <option>Human</option>
                 <option>Technological</option>
                 <option>Industry</option>
              </select>
              <button 
                onClick={handleAddTask}
                className="px-10 py-4 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                 <Plus className="w-4 h-4" /> Add Task
              </button>
           </div>

           {/* Kanban Board Columns */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(['backlog', 'in-progress', 'review', 'done'] as KanbanStatus[]).map((colStatus) => (
                <div key={colStatus} className="flex flex-col gap-6">
                   <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${
                           colStatus === 'backlog' ? 'bg-slate-500' :
                           colStatus === 'in-progress' ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' :
                           colStatus === 'review' ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' :
                           'bg-emerald-500 shadow-[0_0_10px_#10b981]'
                         }`}></div>
                         <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                           {colStatus.replace('-', ' ')}
                         </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600">{tasks.filter(t => t.status === colStatus).length}</span>
                   </div>

                   <div className="space-y-4 min-h-[400px]">
                      {tasks.filter(t => t.status === colStatus).map((task) => (
                        <div key={task.id} className="glass-card p-6 rounded-[32px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden flex flex-col gap-4">
                           <div className="flex justify-between items-start">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getThrustColor(task.thrust)}`}>
                                 {task.thrust}
                              </span>
                              <div className="flex gap-1">
                                 {task.status !== 'backlog' && (
                                   <button onClick={() => moveTask(task.id, 
                                     colStatus === 'in-progress' ? 'backlog' :
                                     colStatus === 'review' ? 'in-progress' : 'review'
                                   )} className="p-1 hover:text-white text-slate-700 transition-colors">
                                      <ChevronRight className="w-3 h-3 rotate-180" />
                                   </button>
                                 )}
                                 {task.status !== 'done' && (
                                   <button onClick={() => moveTask(task.id,
                                     colStatus === 'backlog' ? 'in-progress' :
                                     colStatus === 'in-progress' ? 'review' : 'done'
                                   )} className="p-1 hover:text-white text-slate-700 transition-colors">
                                      <ChevronRight className="w-3 h-3" />
                                   </button>
                                 )}
                              </div>
                           </div>

                           <h5 className="text-sm font-bold text-slate-200 leading-relaxed group-hover:text-white transition-colors">{task.title}</h5>

                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1.5">
                                 <AlertCircle className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                                 <span className={`text-[8px] font-black uppercase ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                              </div>
                              <button onClick={() => removeTask(task.id)} className="text-[8px] font-black text-slate-700 hover:text-rose-500 uppercase tracking-widest transition-colors">Abort</button>
                           </div>

                           {colStatus === 'done' && (
                             <div className="absolute top-0 right-0 p-2 text-emerald-500/20 pointer-events-none">
                                <CheckCircle2 className="w-12 h-12" />
                             </div>
                           )}
                        </div>
                      ))}
                      {tasks.filter(t => t.status === colStatus).length === 0 && (
                        <div className="h-full border-2 border-dashed border-white/[0.02] rounded-[32px] flex items-center justify-center">
                           <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Empty Field</p>
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTool === 'sigma' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          {/* Hero Section */}
          <div className="glass-card p-12 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 group">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
                <Factory className="w-80 h-80 text-white" />
             </div>
             <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center shadow-2xl shrink-0 ring-4 ring-white/10">
                <Scale className="w-16 h-16 text-white" />
             </div>
             <div className="flex-1 space-y-4 text-center lg:text-left">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Agro-Sigma <span className="text-indigo-400">Integrated</span></h2>
                <p className="text-slate-400 text-xl font-medium max-w-2xl">Minimize variance in agricultural output and maximize m™ constant stability through rigorous Lean Six Sigma governance.</p>
             </div>
          </div>

          {/* DMAIC Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {SIGMA_STAGES.map((s, idx) => (
              <div key={s.id} className="glass-card p-8 rounded-[32px] border-white/5 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all cursor-default relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
                 <div className={`w-14 h-14 ${s.col} rounded-2xl flex items-center justify-center text-black font-black text-2xl mb-6 shadow-xl relative z-10`}>
                    {s.id}
                 </div>
                 <h4 className="text-lg font-bold text-white mb-2 relative z-10">{s.name}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed relative z-10">{s.desc}</p>
                 {idx < 4 && <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-800"><ChevronRight className="w-8 h-8" /></div>}
              </div>
            ))}
          </div>

          {/* Interactive Calculator & Control Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {/* Sigma Level Calculator */}
              <div className="glass-card p-10 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Gauge className="w-32 h-32 text-emerald-400" /></div>
                 <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3"><Gauge className="w-5 h-5 text-emerald-400" /> Sigma Calculator</h3>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Defects Detected</label>
                          <span className="text-xs font-mono text-white font-bold">{defects}</span>
                       </div>
                       <input type="range" min="0" max="500" value={defects} onChange={e => setDefects(Number(e.target.value))} className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none accent-emerald-500" />
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Total Opportunities</label>
                          <span className="text-xs font-mono text-white font-bold">{opportunities}</span>
                       </div>
                       <input type="range" min="100" max="10000" step="100" value={opportunities} onChange={e => setOpportunities(Number(e.target.value))} className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none accent-emerald-500" />
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                    <div>
                       <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Process Capability</p>
                       <p className="text-4xl font-black text-white font-mono">{sigmaLevel.toFixed(1)} <span className="text-xs text-emerald-500">σ</span></p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${sigmaLevel >= 4 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}`}>
                       {sigmaLevel >= 4 ? 'WORLD CLASS' : 'NEEDS AUDIT'}
                    </div>
                 </div>
              </div>

              {/* Quick Tools Grid */}
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: '5S Audit', icon: Layers, col: 'text-blue-400' },
                   { label: 'Ishikawa', icon: Binary, col: 'text-indigo-400' },
                   { label: 'SIPOC Node', icon: History, col: 'text-amber-400' },
                   { label: 'FMEA Risk', icon: AlertCircle, col: 'text-rose-400' },
                 ].map(t => (
                   <button key={t.label} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 flex flex-col items-center gap-3 group transition-all">
                      <t.icon className={`w-6 h-6 ${t.col} group-hover:scale-110 transition-transform`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            {/* Process Stability Control Chart */}
            <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-white/5 relative overflow-hidden bg-black/40">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-500/10 rounded-xl"><LineChart className="w-6 h-6 text-indigo-400" /></div>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Process <span className="text-indigo-400">Stability Chart</span></h3>
                  </div>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-mono text-slate-500 px-3 py-1 bg-white/5 rounded-full">LCL: 55</span>
                     <span className="text-[10px] font-mono text-slate-500 px-3 py-1 bg-white/5 rounded-full">UCL: 75</span>
                  </div>
               </div>
               <div className="h-80 w-full min-h-0 min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <RechartsLineChart data={CONTROL_CHART_DATA}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                       <XAxis dataKey="batch" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} domain={[40, 100]} />
                       <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                       <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'right', value: 'UCL', fill: '#f43f5e', fontSize: 10 }} />
                       <ReferenceLine y={55} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'right', value: 'LCL', fill: '#f43f5e', fontSize: 10 }} />
                       <ReferenceLine y={65} stroke="#6366f1" strokeOpacity={0.3} label={{ position: 'right', value: 'Mean', fill: '#6366f1', fontSize: 10 }} />
                       <Line type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-8 p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                     Out of Control: Batch B8 detected with abnormal variance (+2.4σ shift). Root cause audit recommended.
                  </p>
               </div>
            </div>
          </div>

          {/* AI Optimizer & Expert Advice */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
             <div className="lg:col-span-1 glass-card p-10 rounded-[40px] border-white/5 space-y-6 flex flex-col">
                <div className="flex items-center gap-3">
                   <Settings className="w-5 h-5 text-indigo-400" />
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Process Bottleneck Audit</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"Describe a process challenge to receive a Gemini-integrated Lean Six Sigma remediation strategy."</p>
                <textarea 
                  value={sigmaInput}
                  onChange={(e) => setSigmaInput(e.target.value)}
                  placeholder="e.g. 'Yield variance in hydro-loop #4 is reducing m-constant stability'..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-white text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none h-48 resize-none flex-1 transition-all"
                />
                <button 
                  onClick={handleSigmaAudit}
                  disabled={isOptimizing || !sigmaInput.trim()}
                  className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                >
                   {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                   {isOptimizing ? "RUNNING SIMULATION..." : "GENERATE SIGMA AUDIT"}
                </button>
             </div>

             <div className="lg:col-span-2 glass-card rounded-[48px] border-indigo-500/20 bg-[#050706] relative overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <Bot className="w-7 h-7 text-indigo-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-tighter italic">Six Sigma <span className="text-indigo-400">Oracle Output</span></h4>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${sigmaAdvice ? 'bg-emerald-500' : 'bg-slate-700 animate-pulse'}`}></div>
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest">GEMINI_3_PRO_ENGINE</span>
                   </div>
                </div>
                
                <div className="flex-1 p-10 relative">
                   {isOptimizing && (
                     <div className="absolute inset-0 bg-[#050706]/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-indigo-400 font-bold text-[10px] mt-4 uppercase tracking-[0.4em] animate-pulse">Deconstructing variance shards...</p>
                     </div>
                   )}

                   {sigmaAdvice ? (
                     <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l-4 border-indigo-500/30 pl-12 animate-in fade-in duration-700">
                        {sigmaAdvice}
                     </div>
                   ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 py-20">
                        <ClipboardList className="w-20 h-20 text-slate-500" />
                        <div className="max-w-sm">
                           <h4 className="text-xl font-bold text-white uppercase mb-2">Awaiting Input</h4>
                           <p className="text-slate-500 italic text-sm">Synchronize with the Six Sigma oracle to generate a structured DMAIC remediation roadmap.</p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTool === 'kpis' && (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-12 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 flex flex-col lg:flex-row items-center gap-12 group">
              <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-2xl shrink-0 ring-4 ring-white/10">
                 <BarChart4 className="w-16 h-16 text-white" />
              </div>
              <div className="flex-1 space-y-4 text-center lg:text-left">
                 <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Registry <span className="text-emerald-400">Benchmarks</span></h2>
                 <p className="text-slate-400 text-xl font-medium">Real-time Key Performance Indicators (KPIs) aggregated from 14,000+ decentralized steward nodes.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {NETWORK_KPIS.map((kpi, i) => (
                <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col items-center text-center group active:scale-95 duration-200">
                   <div className="p-4 bg-white/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <kpi.icon className={`w-8 h-8 ${kpi.col}`} />
                   </div>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
                   <p className="text-3xl font-mono font-black text-white mb-2">{kpi.val}</p>
                   <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{kpi.trend}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{kpi.status}</span>
                   </div>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-white/5 relative overflow-hidden bg-black/40">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                       <LineChart className="w-6 h-6 text-emerald-400" />
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Network <span className="text-emerald-400">Resilience Pulse</span></h3>
                    </div>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-slate-500">SYNC_PERIOD: 24H</span>
                 </div>
                 <div className="h-64 flex items-end justify-between gap-3 px-4">
                    {[35, 65, 45, 85, 55, 95, 75, 60, 80, 90, 100, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/5 rounded-t-xl relative group overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 transition-all duration-1000 group-hover:bg-emerald-400 group-hover:shadow-[0_0_15px_#10b981]" style={{ height: `${h}%` }}></div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-8 px-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.5em]">
                    <span>T-24_NODE</span>
                    <span>T-0_NODE</span>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[48px] bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/20 flex flex-col justify-between items-center text-center group">
                 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/40 shadow-2xl group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Integrity Score</h4>
                    <p className="text-emerald-400 font-mono text-5xl font-black tracking-tighter">99.98%</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Verified by 12,400 independent industrial validator nodes.</p>
                 </div>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-600 transition-all">Download Audit</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ToolsSection;
