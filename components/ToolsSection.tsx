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
  ShieldAlert,
  Coins,
  FileText,
  Upload,
  Workflow,
  Network,
  ArrowRightCircle,
  ArrowDownCircle,
  ArrowLeftCircle,
  Stamp,
  Boxes
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
  user?: any; 
  onSpendEAC: (amount: number, reason: string) => boolean;
  // Added onEarnEAC to props to fix 'Cannot find name' error
  onEarnEAC?: (amount: number, reason: string) => void;
  onOpenEvidence: (task: any) => void;
  pendingAction?: string | null;
  clearAction?: () => void;
}

const TASK_INGEST_FEE = 10;

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62 }, { batch: 'B2', val: 65 }, { batch: 'B3', val: 61 },
  { batch: 'B4', val: 78 }, { batch: 'B5', val: 63 }, { batch: 'B6', val: 60 },
  { batch: 'B7', val: 58 }, { batch: 'B8', val: 85 }, { batch: 'B9', val: 64 },
  { batch: 'B10', val: 61 }, { batch: 'B11', val: 62 }, { batch: 'B12', val: 63 },
];

const KANBAN_STAGES = [
  { id: 'Inception', label: 'GENESIS INGEST', color: 'text-slate-500', bg: 'bg-slate-500/10' },
  { id: 'Processing', label: 'INDUSTRIAL FLOW', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'Quality_Audit', label: 'TQM VERIFICATION', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const INITIAL_KANBAN = [
  { id: 'T-1', title: 'Substrate DNA Sequence', status: 'Inception', thrust: 'Environmental', owner: 'Node_P4', priority: 'High', seq: 1 },
  { id: 'T-2', title: 'Spectral Drone Calibration', status: 'Processing', thrust: 'Technological', owner: 'Stwd_Nairobi', priority: 'Medium', seq: 2 },
  { id: 'T-3', title: 'Yield Shard Finality', status: 'Quality_Audit', thrust: 'Industry', owner: 'Global_Alpha', priority: 'Low', seq: 3 },
  { id: 'T-4', title: 'Carbon Minting Vouch', status: 'Inception', thrust: 'Industry', owner: 'Node_NY_01', priority: 'High', seq: 1 },
];

// Destructured onEarnEAC from props
const ToolsSection: React.FC<ToolsSectionProps> = ({ user, onSpendEAC, onEarnEAC, onOpenEvidence, pendingAction, clearAction }) => {
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

    if (!onSpendEAC(TASK_INGEST_FEE, 'TASK_SHARD_REGISTRATION')) {
      alert("LIQUIDITY ERROR: Insufficient EAC for task registration fee.");
      return;
    }
    
    setInitStep('minting');
    setIsMinting(true);
    
    setTimeout(() => {
      const newShard = {
        id: `T-${Math.floor(Math.random() * 9000 + 1000)}`,
        title: taskTitle,
        status: 'Inception',
        thrust: taskThrust,
        owner: user?.name || 'Local_Node',
        priority: taskPriority,
        seq: 1
      };
      
      setKanbanData([newShard, ...kanbanData]);
      setIsMinting(false);
      setInitStep('success');
    }, 2500);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    setKanbanData(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    // onEarnEAC is now available from props and can be called safely
    onEarnEAC?.(2, `TASK_SEQUENCE_PROMOTION_${taskId}`);
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
          { id: 'kanban', label: 'Ledger Kanban', icon: Workflow },
          { id: 'sigma', label: 'Six Sigma Audit', icon: Target },
          { id: 'kpis', label: 'Performance Analytics', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTool(t.id as any)} 
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTool === t.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeTool === 'kanban' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-4">
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                         <Workflow className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Task <span className="text-indigo-400">Sharding Ledger</span></h3>
                   </div>
                   <p className="text-slate-500 text-lg font-medium italic">Tasks sharded through industrial routing and processing sequences.</p>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={() => { setShowInitTask(true); setInitStep('form'); }}
                    className="px-8 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2 active:scale-95 transition-all ring-4 ring-indigo-500/10"
                   >
                      <Plus className="w-4 h-4" /> Mint Task Shard
                   </button>
                </div>
             </div>

             {/* KANBAN BOARD WITH SEQUENCE ROUTING */}
             <div className="relative">
                {/* Visual Sequence Line */}
                <div className="absolute top-[100px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-slate-800 via-blue-600 to-emerald-600 hidden md:block opacity-20"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full relative z-10">
                   {KANBAN_STAGES.map((stage, idx) => (
                     <div key={stage.id} className="flex flex-col gap-8 min-h-[600px] group/col">
                        <div className={`p-8 rounded-[40px] border-2 bg-black/40 shadow-2xl transition-all duration-500 ${stage.bg} border-white/5 group-hover/col:border-indigo-500/20`}>
                           <div className="flex justify-between items-center mb-10">
                              <div className="flex items-center gap-3">
                                 <div className={`w-3 h-3 rounded-full ${stage.color} animate-pulse`}></div>
                                 <h4 className={`text-[12px] font-black uppercase tracking-[0.4em] italic ${stage.color}`}>{stage.label}</h4>
                              </div>
                              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-slate-500 font-black">
                                 {kanbanData.filter(t => t.status === stage.id).length} SHARDS
                              </span>
                           </div>

                           <div className="space-y-6">
                              {kanbanData.filter(t => t.status === stage.id).map(task => (
                                 <div key={task.id} className="glass-card p-6 rounded-[32px] border border-white/5 bg-black/60 hover:border-white/20 transition-all group/task cursor-pointer active:scale-[0.98] shadow-lg animate-in fade-in slide-in-from-top-2 border-l-4 border-l-indigo-500">
                                    <div className="flex justify-between items-start mb-6">
                                       <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-tighter">#{task.id}</span>
                                       <div className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                                          task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                                          task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                                          'bg-blue-500/10 text-blue-500'
                                       }`}>
                                          {task.priority}
                                       </div>
                                    </div>
                                    <h5 className="text-lg font-black text-white mb-4 leading-tight tracking-tight group-hover/task:text-indigo-400 transition-colors uppercase italic">{task.title}</h5>
                                    
                                    <div className="flex items-center gap-2 mb-6">
                                       <Layers className="w-3 h-3 text-slate-700" />
                                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Routing: {task.thrust}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                       <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black text-emerald-400">
                                             {task.owner[0]}
                                          </div>
                                          <span className="text-[8px] font-bold text-slate-500 uppercase">{task.owner}</span>
                                       </div>
                                       <div className="flex gap-2">
                                          {idx < KANBAN_STAGES.length - 1 && (
                                            <button 
                                              onClick={() => moveTask(task.id, KANBAN_STAGES[idx+1].id)}
                                              className="p-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                                              title="Promote Sequence"
                                            >
                                               <ChevronRight size={14} />
                                            </button>
                                          )}
                                          <button 
                                            onClick={() => onOpenEvidence(task)}
                                            className="p-2 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                            title="Attach Proof"
                                          >
                                             <Stamp size={14} />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                              {kanbanData.filter(t => t.status === stage.id).length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/5 rounded-[40px] space-y-4">
                                   <Boxes size={48} />
                                   <p className="text-[10px] font-black uppercase tracking-widest">Empty Shard Rack</p>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Ledger Info Footer */}
             <div className="p-12 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/[0.02] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
                   <Network className="w-[800px] h-[800px] text-emerald-400" />
                </div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                   <div className="w-32 h-32 agro-gradient rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5 shrink-0 border-2 border-white/10">
                      <Binary className="w-14 h-14 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Process Routing Sync</h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-xl:text-sm max-w-xl">
                        "Every task sharded on the ledger follows the industrial processing sequence. Completion triggers automated state transition for associated products."
                      </p>
                   </div>
                </div>
                <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-16">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">SEQUENCE_INTEGRITY</p>
                   <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter">100%</p>
                </div>
             </div>
          </div>
        )}

        {/* ... Sigma and KPIs tabs maintained from original file ... */}
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
                   <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-8 flex flex-col items-center justify-center text-center space-y-4 group relative overflow-hidden shadow-xl">
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
                        className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-30 active:scale-90 transition-all shadow-xl"
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

      {/* Initialize Task Shard Modal */}
      {showInitTask && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={closeTaskModal}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)] animate-in zoom-in duration-300 border-2">
                <div className="p-16 space-y-12 min-h-[600px] flex flex-col justify-center">
                   <button onClick={closeTaskModal} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
                   
                   {initStep === 'form' && (
                     <form onSubmit={handleInitializeTask} className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-6">
                           <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl">
                              <Workflow className="w-12 h-12 text-indigo-400" />
                           </div>
                           <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-indigo-400">Ledger Shard</span></h3>
                           <p className="text-slate-400 text-lg font-medium leading-relaxed max-md:text-sm max-w-md mx-auto">Commit a new industrial processing task to the distributed kanban ledger.</p>
                        </div>

                        <div className="space-y-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Task Shard Alias</label>
                              <input 
                                type="text" 
                                required 
                                value={taskTitle}
                                onChange={e => setTaskTitle(e.target.value)}
                                placeholder="e.g. Spectral Nitrogen Audit" 
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-8 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800" 
                              />
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Pillar</label>
                                 <select 
                                  value={taskThrust}
                                  onChange={e => setTaskThrust(e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                                 >
                                    <option>Environmental</option>
                                    <option>Technological</option>
                                    <option>Societal</option>
                                    <option>Human</option>
                                    <option>Industry</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Priority</label>
                                 <select 
                                  value={taskPriority}
                                  onChange={e => setTaskPriority(e.target.value)}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                                 >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        <button type="submit" className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                           Authorize Metadata Ingest <ChevronRight size={20} />
                        </button>
                     </form>
                   )}

                   {initStep === 'sign' && (
                      <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                         <div className="text-center space-y-6">
                            <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                               <Fingerprint className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                               <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[32px] animate-ping opacity-30"></div>
                            </div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Node <span className="text-indigo-400">Signature</span></h3>
                            <p className="text-slate-400 text-lg">Anchor this task to the Genesis processing sequence.</p>
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Steward ID (ESIN)</label>
                            <input 
                               type="text" 
                               value={esinSign}
                               onChange={e => setEsinSign(e.target.value)}
                               placeholder="EA-XXXX-XXXX-XXXX" 
                               className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                            />
                         </div>

                         <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-center justify-between shadow-inner">
                            <div className="flex items-center gap-4">
                               <Coins className="text-indigo-400" />
                               <span className="text-xs font-black text-white uppercase tracking-widest">Ingest Fee</span>
                            </div>
                            <span className="text-xl font-mono font-black text-indigo-400">{TASK_INGEST_FEE} EAC</span>
                         </div>

                         <div className="flex gap-4">
                            <button onClick={() => setInitStep('form')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                            <button 
                               onClick={executeInitShard}
                               disabled={!esinSign}
                               className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                            >
                               <Key className="w-6 h-6 fill-current" /> Authorize Shard Mint
                            </button>
                         </div>
                      </div>
                   )}

                   {initStep === 'minting' && (
                      <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in fade-in duration-500">
                         <div className="relative">
                            <div className="absolute inset-[-15px] border-t-8 border-indigo-500 rounded-full animate-spin"></div>
                            <div className="w-48 h-48 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl">
                               <RefreshCcw className="w-20 h-20 text-indigo-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Minting Ledger Shard...</p>
                            <p className="text-slate-600 font-mono text-[10px]">EOS_TASK_COMMIT_#{(Math.random()*1000).toFixed(0)}</p>
                         </div>
                      </div>
                   )}

                   {initStep === 'success' && (
                     <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                        <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                           <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-emerald-400">Committed.</span></h3>
                           <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.5em] font-mono">Registry Hash: 0x882_TASK_OK_SYNC</p>
                        </div>
                        <button onClick={closeTaskModal} className="w-full max-w-sm py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Ledger Grid</button>
                     </div>
                   )}
                </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
      `}</style>
    </div>
  );
};

export default ToolsSection;