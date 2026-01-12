import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart4, 
  Activity, 
  Zap, 
  Target, 
  RefreshCcw, 
  Settings, 
  Sparkles, 
  Bot, 
  Loader2, 
  Search, 
  Scale, 
  Binary, 
  LineChart,
  ChevronRight,
  ClipboardList,
  Gauge,
  Layers,
  History,
  AlertCircle,
  TrendingUp,
  Trello,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  MoreHorizontal,
  Recycle,
  Database,
  SearchCode,
  X,
  Fingerprint,
  Key,
  ShieldCheck,
  ShieldAlert
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

interface ToolsSectionProps {
  user?: any; // Added user prop for ESIN verification
  pendingAction?: string | null;
  clearAction?: () => void;
}

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62 }, { batch: 'B2', val: 65 }, { batch: 'B3', val: 61 },
  { batch: 'B4', val: 78 }, { batch: 'B5', val: 63 }, { batch: 'B6', val: 60 },
  { batch: 'B7', val: 58 }, { batch: 'B8', val: 85 }, { batch: 'B9', val: 64 },
  { batch: 'B10', val: 61 }, { batch: 'B11', val: 62 }, { batch: 'B12', val: 63 },
];

const INITIAL_KANBAN = [
  { id: 'T-1', title: 'Soil Biome Registry', status: 'backlog', thrust: 'Environmental', owner: 'Node_P4', priority: 'High' },
  { id: 'T-2', title: 'Spectral Drone Calibration', status: 'syncing', thrust: 'Technological', owner: 'Stwd_Nairobi', priority: 'Medium' },
  { id: 'T-3', title: 'Community Vetting Hub', status: 'settled', thrust: 'Societal', owner: 'Global_Alpha', priority: 'Low' },
  { id: 'T-4', title: 'Carbon Credit Minting', status: 'syncing', thrust: 'Industry', owner: 'Node_NY_01', priority: 'High' },
];

const ToolsSection: React.FC<ToolsSectionProps> = ({ user, pendingAction, clearAction }) => {
  const [activeTool, setActiveTool] = useState<'sigma' | 'kpis' | 'kanban'>('kanban');
  const [kanbanData, setKanbanData] = useState(INITIAL_KANBAN);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
  // Initialize Shard Modal States
  const [showInitTask, setShowInitTask] = useState(false);
  const [initStep, setInitStep] = useState<'form' | 'sign' | 'minting' | 'success'>('form');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskThrust, setTaskThrust] = useState('Environmental');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [esinSign, setEsinSign] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const [defects, setDefects] = useState(3);
  const [opportunities, setOpportunities] = useState(1000);

  useEffect(() => {
    if (pendingAction === 'OPEN_TASKS') {
      setActiveTool('kanban');
      clearAction?.();
    }
  }, [pendingAction, clearAction]);
  
  const sigmaLevel = useMemo(() => {
    const dpmo = (defects / opportunities) * 1000000;
    if (dpmo <= 3.4) return 6.0;
    if (dpmo <= 233) return 5.0;
    if (dpmo <= 6210) return 4.0;
    if (dpmo <= 66807) return 3.0;
    return 1.0;
  }, [defects, opportunities]);

  const handleSigmaAudit = async () => {
    if (!sigmaInput.trim()) return;
    setIsOptimizing(true);
    const prompt = `Six Sigma Strategy for: ${sigmaInput}`;
    const response = await chatWithAgroExpert(prompt, []);
    setSigmaAdvice(response.text);
    setIsOptimizing(false);
  };

  const handleInitializeTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setInitStep('sign');
  };

  const executeInitShard = () => {
    if (user && esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN node mismatch.");
      return;
    }
    
    setInitStep('minting');
    setIsMinting(true);
    
    setTimeout(() => {
      const newShard = {
        id: `T-${kanbanData.length + 1}`,
        title: taskTitle,
        status: 'backlog',
        thrust: taskThrust,
        owner: user?.name || 'Local_Node',
        priority: taskPriority
      };
      
      setKanbanData([newShard, ...kanbanData]);
      setIsMinting(false);
      setInitStep('success');
    }, 2500);
  };

  const closeTaskModal = () => {
    setShowInitTask(false);
    setInitStep('form');
    setTaskTitle('');
    setEsinSign('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] w-fit border border-white/5 bg-black/40 mx-auto lg:mx-0">
        {[
          { id: 'kanban', label: 'Mission Tasks', icon: Trello },
          { id: 'sigma', label: 'Six Sigma Audit', icon: Target },
          { id: 'kpis', label: 'Performance Analytics', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTool(t.id as any)} 
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === t.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTool === 'kanban' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Mission <span className="text-emerald-400">Task Node Grid</span></h3>
                   <p className="text-slate-500 text-lg font-medium italic">Distributed task orchestration across regional industrial shards.</p>
                </div>
                <div className="flex gap-4">
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input type="text" placeholder="Filter task shards..." className="bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
                   </div>
                   <button 
                    onClick={() => { setShowInitTask(true); setInitStep('form'); }}
                    className="px-8 py-4 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                   >
                      <Plus className="w-4 h-4" /> Initialize Shard
                   </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                {['backlog', 'syncing', 'settled'].map(col => (
                  <div key={col} className="glass-card p-8 rounded-[48px] border-white/5 bg-black/20 flex flex-col gap-8 shadow-2xl relative overflow-hidden group/col">
                     <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent opacity-0 group-hover/col:opacity-100 transition-opacity"></div>
                     <div className="flex justify-between items-center px-4 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${col === 'backlog' ? 'bg-slate-600' : col === 'syncing' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                           <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic">{col}</h4>
                        </div>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-slate-500 font-black">
                           {kanbanData.filter(t => t.status === col).length} SHARDS
                        </span>
                     </div>
                     <div className="space-y-6 relative z-10 flex-1">
                        {kanbanData.filter(t => t.status === col).map(task => (
                           <div key={task.id} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/60 hover:border-emerald-500/40 transition-all group/task cursor-pointer active:scale-[0.98] shadow-lg animate-in fade-in slide-in-from-top-2">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                                       task.priority === 'High' ? 'text-rose-500' : 
                                       task.priority === 'Medium' ? 'text-amber-500' : 
                                       'text-blue-500'
                                    }`}>
                                       {task.priority} Priority
                                    </span>
                                 </div>
                                 <button className="text-slate-800 hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
                              </div>
                              <h5 className="text-xl font-black text-white mb-2 leading-tight tracking-tight group-hover/task:text-emerald-400 transition-colors italic">{task.title}</h5>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-8">{task.thrust} Thrust</p>
                              
                              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover/task:bg-emerald-500/10 transition-colors">
                                       <User size={14} className="text-slate-600 group-hover/task:text-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-tight">{task.owner}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded-lg">
                                    <Clock size={12} className="text-indigo-400" /> 12h_SYNC
                                 </div>
                              </div>
                           </div>
                        ))}
                        {kanbanData.filter(t => t.status === col).length === 0 && (
                          <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-10 space-y-4">
                             <Layers size={48} />
                             <p className="text-[10px] font-black uppercase tracking-widest">No active shards in this node</p>
                          </div>
                        )}
                     </div>
                     <button 
                      onClick={() => { setShowInitTask(true); setInitStep('form'); }}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 mt-4"
                     >
                        <Plus size={14} /> Add Task Shard
                     </button>
                  </div>
                ))}
             </div>

             <div className="p-12 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
                   <Database className="w-96 h-96 text-indigo-400" />
                </div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                   <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                      <Binary className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Distributed Task Ledger</h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Every task commitment is signed and hashed into the local node shard for accountability.</p>
                   </div>
                </div>
                <div className="text-center md:text-right relative z-10 shrink-0">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">TOTAL_SYNC_TASKS</p>
                   <p className="text-7xl font-mono font-black text-white tracking-tighter">{kanbanData.length}</p>
                </div>
             </div>
          </div>
        )}

        {/* --- MODALS --- */}
        
        {/* 1. Initialize Task Shard Modal */}
        {showInitTask && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={closeTaskModal}></div>
             <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2">
                <div className="p-16 space-y-12 min-h-[600px] flex flex-col justify-center">
                   <button onClick={closeTaskModal} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                   
                   {initStep === 'form' && (
                     <form onSubmit={handleInitializeTask} className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-6">
                           <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                              <Trello className="w-12 h-12 text-emerald-400" />
                           </div>
                           <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-emerald-400">Task Shard</span></h3>
                           <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Commit a new mission objective to the regional task node grid.</p>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Task Narrative</label>
                              <input 
                                type="text" 
                                required 
                                value={taskTitle}
                                onChange={e => setTaskTitle(e.target.value)}
                                placeholder="What needs to be achieved?" 
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-8 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800" 
                              />
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Pillar Anchor</label>
                                 <select 
                                  value={taskThrust}
                                  onChange={e => setTaskThrust(e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                                 >
                                    <option>Environmental</option>
                                    <option>Technological</option>
                                    <option>Societal</option>
                                    <option>Industry</option>
                                    <option>Human</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Priority</label>
                                 <select 
                                  value={taskPriority}
                                  onChange={e => setTaskPriority(e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20"
                                 >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        <button type="submit" className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                           Sign Task Proposal <ChevronRight className="w-4 h-4" />
                        </button>
                     </form>
                   )}

                   {initStep === 'sign' && (
                     <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-6">
                           <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl relative">
                              <Fingerprint className="w-12 h-12 text-blue-400" />
                              <div className="absolute inset-0 border-2 border-blue-500/20 rounded-[32px] animate-ping opacity-30"></div>
                           </div>
                           <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Cryptographic <span className="text-blue-400">Anchor</span></h3>
                           <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto leading-relaxed">
                              "Sign the task shard with your ESIN node signature to commit it to the industrial archive."
                           </p>
                        </div>

                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-8 text-center block">Steward Signature (ESIN)</label>
                           <input 
                              type="text" 
                              value={esinSign}
                              onChange={e => setEsinSign(e.target.value)}
                              placeholder="EA-XXXX-XXXX-XXXX" 
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-900" 
                           />
                        </div>

                        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-center gap-6">
                           <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                           <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-widest leading-relaxed">
                              REGISTRY_COMMIT: Task metadata will be hashed and mirrored to 64 global validator nodes. 
                           </p>
                        </div>

                        <div className="flex gap-4">
                           <button onClick={() => setInitStep('form')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                           <button 
                             onClick={executeInitShard}
                             disabled={!esinSign}
                             className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                           >
                              <Key className="w-6 h-6 fill-current" /> Initialize Shard
                           </button>
                        </div>
                     </div>
                   )}

                   {initStep === 'minting' && (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in fade-in duration-500">
                        <div className="relative">
                           <div className="absolute inset-[-15px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                           <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                              <Bot className="w-20 h-20 text-emerald-400 animate-pulse" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Minting <span className="text-emerald-400">Shard</span></h3>
                           <p className="text-emerald-500/60 font-mono text-sm animate-pulse uppercase tracking-[0.4em]">Propagating to global registry...</p>
                        </div>
                     </div>
                   )}

                   {initStep === 'success' && (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                        <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                           <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                        </div>
                        <div className="space-y-4 text-center">
                           <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Shard <span className="text-emerald-400">Settled</span></h3>
                           <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Hash commit: 0x{(Math.random()*1000000).toFixed(0).padStart(6, '0')} locked.</p>
                        </div>
                        <button onClick={closeTaskModal} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Grid</button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {activeTool === 'sigma' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                   <div className="flex justify-between items-center relative z-10 mb-10 px-4">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-indigo-500/10 rounded-2xl">
                            <Target className="w-8 h-8 text-indigo-400" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Control <span className="text-indigo-400">Chart</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Batch Variability Index</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-slate-600 font-black uppercase">Standard Dev</p>
                         <p className="text-2xl font-mono font-black text-white">σ 1.42</p>
                      </div>
                   </div>

                   <div className="h-[400px] w-full relative z-10 min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <RechartsLineChart data={CONTROL_CHART_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="batch" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[40, 100]} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <ReferenceLine y={80} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'UCL', position: 'right', fill: '#f43f5e', fontSize: 10 }} />
                            <ReferenceLine y={65} stroke="#10b981" strokeWidth={2} label={{ value: 'Target', position: 'right', fill: '#10b981', fontSize: 10 }} />
                            <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'LCL', position: 'right', fill: '#f43f5e', fontSize: 10 }} />
                            <Line type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={6} dot={{ fill: '#6366f1', strokeWidth: 4, r: 6 }} activeDot={{ r: 10, strokeWidth: 0 }} />
                         </RechartsLineChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-8 flex flex-col justify-center text-center group relative overflow-hidden shadow-xl">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Scale className="w-48 h-48 text-emerald-400" /></div>
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] relative z-10">Calculated Node Sigma</p>
                      <h3 className="text-8xl font-black text-white font-mono tracking-tighter relative z-10">{sigmaLevel.toFixed(1)}</h3>
                      <div className="space-y-2 relative z-10">
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Process Yield</p>
                         <p className="text-lg font-mono font-black text-emerald-400">99.98%</p>
                      </div>
                   </div>

                   <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-6 shadow-xl bg-black/40">
                      <div className="flex items-center gap-3">
                         <Bot className="w-5 h-5 text-indigo-400" />
                         <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Sigma Strategy Oracle</h4>
                      </div>
                      <textarea 
                         value={sigmaInput}
                         onChange={e => setSigmaInput(e.target.value)}
                         placeholder="Explain a process friction..."
                         className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white text-xs h-32 focus:ring-2 focus:ring-indigo-500/40 outline-none resize-none placeholder:text-slate-800 italic"
                      />
                      <button 
                        onClick={handleSigmaAudit}
                        disabled={isOptimizing || !sigmaInput.trim()}
                        className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30 active:scale-95 transition-all shadow-xl"
                      >
                         {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {isOptimizing ? 'SYNTHESIZING...' : 'GENERATE STRATEGY'}
                      </button>
                   </div>
                </div>
             </div>

             {sigmaAdvice && (
                <div className="glass-card p-12 rounded-[56px] border-l-8 border-indigo-500 bg-indigo-500/5 animate-in slide-in-from-left-4 duration-500 shadow-3xl">
                   <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line border-l-2 border-white/5 pl-8 font-medium">
                      {sigmaAdvice}
                   </div>
                </div>
             )}
          </div>
        )}

        {activeTool === 'kpis' && (
           <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { l: 'Energy efficiency', v: '92%', t: '+2.4%', icon: Zap, col: 'text-amber-400' },
                   { l: 'Resource reuse', v: '88%', t: '+4.1%', icon: Recycle, col: 'text-emerald-400' },
                   { l: 'Worker wellness', v: '95%', t: '+0.8%', icon: Activity, col: 'text-rose-400' },
                   { l: 'Data accuracy', v: '99.9%', t: '+0.1%', icon: Binary, col: 'text-blue-400' },
                 ].map((kpi, i) => (
                   <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-4 group hover:border-white/10 transition-all shadow-xl">
                      <div className="flex justify-between items-start">
                         <div className={`p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors`}>
                            <kpi.icon className={`w-5 h-5 ${kpi.col}`} />
                         </div>
                         <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                            <TrendingUp size={12} /> {kpi.t}
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.l}</p>
                         <h4 className="text-3xl font-mono font-black text-white">{kpi.v}</h4>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="glass-card p-12 rounded-[64px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                 <div className="flex justify-between items-center relative z-10 mb-12">
                    <div className="flex items-center gap-4">
                       <BarChart4 className="w-8 h-8 text-emerald-400" />
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-emerald-400">Vitality Map</span></h3>
                    </div>
                    <div className="flex gap-4">
                       <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">REALTIME_SYNC</button>
                    </div>
                 </div>
                 <div className="h-[450px] w-full min-h-0 min-w-0 relative z-10">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                       <AreaChart data={[35, 65, 45, 85, 55, 95, 75, 60, 80, 90, 100, 85].map((v, i) => ({ i: `T-${12-i}`, v }))}>
                          <defs>
                             <linearGradient id="colorKPI" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="i" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #10b98122', borderRadius: '24px' }} />
                          <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorKPI)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ToolsSection;