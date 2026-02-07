
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart4, 
  Activity, 
  Zap, 
  Target, 
  RefreshCw, 
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
  Boxes,
  LayoutGrid,
  SmartphoneNfc,
  Info,
  PlusCircle,
  SearchCode as SearchCodeIcon,
  BadgeCheck,
  Fingerprint as FingerprintIcon,
  Cpu,
  Wrench,
  Construction,
  Package,
  HardHat,
  Monitor,
  Radar,
  ArrowUpRight,
  ShieldPlus,
  Factory,
  Terminal,
  BrainCircuit,
  BarChart3,
  Waves,
  FlaskConical,
  Atom,
  ChevronDown,
  PieChart as PieChartIcon
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
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { chatWithAgroExpert } from '../services/geminiService';

interface ToolsSectionProps {
  user: any; 
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC?: (amount: number, reason: string) => void;
  onOpenEvidence: (task: any) => void;
  tasks: any[];
  onSaveTask: (task: any) => void;
  notify: any;
}

const TASK_INGEST_FEE = 10;

const CONTROL_CHART_DATA = [
  { batch: 'B1', val: 62, error: 2 }, { batch: 'B2', val: 65, error: 1 }, { batch: 'B3', val: 61, error: 3 },
  { batch: 'B4', val: 78, error: 8 }, { batch: 'B5', val: 63, error: 2 }, { batch: 'B6', val: 60, error: 1 },
  { batch: 'B7', val: 58, error: 4 }, { batch: 'B8', val: 85, error: 9 }, { batch: 'B9', val: 64, error: 2 },
  { batch: 'B10', val: 61, error: 1 }, { batch: 'B11', val: 62, error: 1 }, { batch: 'B12', val: 63, error: 1 },
];

const KPI_DISTRIBUTION = [
  { name: 'Sequestration', value: 45, color: '#10b981' },
  { name: 'Yield Efficiency', value: 30, color: '#3b82f6' },
  { name: 'Social Resonance', value: 15, color: '#818cf8' },
  { name: 'Tech Uptime', value: 10, color: '#f59e0b' },
];

interface KanbanStage {
  id: string;
  label: string;
  color: string;
  bg: string;
  border: string;
}

const KANBAN_STAGES: KanbanStage[] = [
  { id: 'Inception', label: 'GENESIS INGEST', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
  { id: 'Processing', label: 'INDUSTRIAL FLOW', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'Quality_Audit', label: 'TQM VERIFICATION', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const INDUSTRIAL_ASSETS = [
  { id: 'AST-Drone-01', name: 'SkyScout Spectral Drone', type: 'Aerial Machinery', health: 94, stability: 1.42, lastAudit: '2d ago', status: 'ACTIVE', col: 'text-blue-400' },
  { id: 'AST-Rover-42', name: 'TerraForge Soil Rover', type: 'Ground Unit', health: 62, stability: 0.85, lastAudit: '5h ago', status: 'MAINTENANCE', col: 'text-amber-500' },
  { id: 'AST-Node-88', name: 'Bio-Sync Sensor Array', type: 'IoT Infrastructure', health: 99, stability: 1.68, lastAudit: '12m ago', status: 'ACTIVE', col: 'text-emerald-400' },
  { id: 'AST-Pump-12', name: 'HydraFlow Ingester', type: 'Liquid Logistics', health: 88, stability: 1.15, lastAudit: '1w ago', status: 'STANDBY', col: 'text-indigo-400' },
];

const ToolsSection: React.FC<ToolsSectionProps> = ({ user, onSpendEAC, onEarnEAC, onOpenEvidence, tasks = [], onSaveTask, notify }) => {
  const [activeTool, setActiveTool] = useState<'kanban' | 'resources' | 'sigma' | 'kpis'>('kanban');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
  const [showInitTask, setShowInitTask] = useState(false);
  const [initStep, setInitStep] = useState<'form' | 'sign' | 'minting' | 'success'>('form');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskThrust, setTaskThrust] = useState('Environmental');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [esinSign, setEsinSign] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const [defects, setDefects] = useState(3);
  const [opportunities, setOpportunities] = useState(1000);

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
    const prompt = `Perform a technical Six Sigma analysis for the following agricultural bottleneck: "${sigmaInput}". 
    Provide a multi-stage DMAIC remediation shard. Focus on m-constant stability.`;
    const response = await chatWithAgroExpert(prompt, []);
    setSigmaAdvice(response.text);
    setIsOptimizing(false);
  };

  const handleInitializeTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setInitStep('sign');
  };

  const executeInitShard = async () => {
    if (user && esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    if (!await onSpendEAC(TASK_INGEST_FEE, 'TASK_SHARD_REGISTRATION')) {
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
        seq: 1,
        weight: '0.4 TB',
        confidence: 0
      };
      
      onSaveTask(newShard);
      setIsMinting(false);
      setInitStep('success');
      onEarnEAC?.(5, 'NEW_TASK_SHARD_COMMITTED');
    }, 2500);
  };

  const moveTask = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = { ...task, status: newStatus, confidence: Math.min(100, (task.confidence || 0) + 15) };
    onSaveTask(updated);
    onEarnEAC?.(2, `TASK_SEQUENCE_PROMOTION_${taskId}`);
  };

  const closeTaskModal = () => {
    setShowInitTask(false);
    setInitStep('form');
    setTaskTitle('');
    setEsinSign('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Workflow size={1000} className="text-indigo-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
        <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-2xl px-6">
          {[
            { id: 'kanban', label: 'Ledger Kanban', icon: Workflow },
            { id: 'resources', label: 'Resource Sharding', icon: Boxes },
            { id: 'sigma', label: 'Precision Audit', icon: Target },
            { id: 'kpis', label: 'Performance Matrix', icon: BarChart4 },
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTool(t.id as any)} 
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTool === t.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
           <div className="px-6 py-3 glass-card rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
              <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">INDUSTRIAL_MESH_ACTIVE</span>
           </div>
           <button 
              onClick={() => { setShowInitTask(true); setInitStep('form'); }}
              className="p-4 bg-indigo-600 rounded-2xl text-white shadow-3xl hover:bg-indigo-500 active:scale-90 transition-all border border-white/10"
              title="Mint New Task"
           >
              <Plus size={24} />
           </button>
        </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        {/* Changed activeTab to activeTool to match state variable name */}
        {activeTool === 'kanban' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {KANBAN_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-col gap-10 group/col">
                     <div className={`p-10 rounded-[64px] border-2 bg-black/40 shadow-3xl transition-all duration-700 ${stage.bg} ${stage.border} min-h-[900px] flex flex-col`}>
                        <div className="flex justify-between items-center mb-12 px-2">
                           <div className="flex items-center gap-4">
                              <div className={`w-3.5 h-3.5 rounded-full ${stage.color} animate-pulse shadow-[0_0_15px_currentColor]`}></div>
                              <h4 className={`text-[13px] font-black uppercase tracking-[0.5em] italic ${stage.color}`}>{stage.label}</h4>
                           </div>
                           <span className="px-4 py-1.5 bg-black/60 border border-white/5 rounded-full text-[10px] font-mono text-slate-500 font-black shadow-inner">
                              {tasks.filter(t => t.status === stage.id).length} SHARDS
                           </span>
                        </div>

                        <div className="space-y-8 flex-1">
                           {tasks.filter(t => t.status === stage.id).map(task => (
                              <div key={task.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/80 hover:border-indigo-500/40 transition-all group/task cursor-pointer active:scale-[0.98] shadow-3xl relative overflow-hidden border-l-[12px] border-l-indigo-600">
                                 <div className="absolute inset-0 opacity-[0.02] pointer-events-none"><div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent absolute top-0 animate-scan"></div></div>

                                 <div className="flex justify-between items-start mb-8 relative z-10">
                                    <span className="text-[11px] font-mono font-black text-slate-700 uppercase tracking-tighter">#{task.id}</span>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                       task.priority === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                                       task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                       'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                       {task.priority} Priority
                                    </div>
                                 </div>

                                 <h5 className="text-2xl font-black text-white mb-6 leading-tight tracking-tighter group/task:text-indigo-400 transition-colors uppercase italic drop-shadow-2xl">{task.title}</h5>
                                 
                                 <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-black/60 rounded-3xl border border-white/5 space-y-1 shadow-inner">
                                       <p className="text-[8px] text-slate-600 font-black uppercase">Shard Mass</p>
                                       <p className="text-sm font-mono font-black text-white">{task.weight}</p>
                                    </div>
                                    <div className="p-4 bg-black/60 rounded-3xl border border-white/5 space-y-1 shadow-inner text-right">
                                       <p className="text-[8px] text-slate-600 font-black uppercase">Consensus</p>
                                       <p className="text-sm font-mono font-black text-emerald-400">{task.confidence}%</p>
                                    </div>
                                 </div>

                                 <div className="flex justify-between items-center pt-8 border-t border-white/5 relative z-10">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[11px] font-black text-emerald-400 border border-white/10">
                                          {task.owner ? task.owner[0] : 'U'}
                                       </div>
                                       <span className="text-10px font-black text-slate-500 uppercase tracking-widest">{task.owner}</span>
                                    </div>
                                    <div className="flex gap-3">
                                       <button 
                                         onClick={() => onOpenEvidence(task)}
                                         className="p-4 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all shadow-xl active:scale-90"
                                         title="Anchor Evidence"
                                       >
                                          <Stamp size={20} />
                                       </button>
                                       {idx < KANBAN_STAGES.length - 1 && (
                                         <button 
                                           onClick={() => moveTask(task.id, KANBAN_STAGES[idx+1].id)}
                                           className="p-4 bg-indigo-600 text-white rounded-2xl transition-all shadow-3xl hover:bg-indigo-500 active:scale-90"
                                           title="Promote Shard"
                                         >
                                            <ChevronRight size={20} />
                                         </button>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                           <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] italic">INDUSTRIAL_PIPELINE_STABLE</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Changed activeTab to activeTool to match state variable name */}
        {activeTool === 'resources' && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 px-6 gap-8">
                <div className="space-y-3">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">HARDWARE <span className="text-blue-400">REGISTRY</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Managing physical industrial assets as sharded ledger entries."</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
                    <History size={18} /> Maintenance Logs
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
                {INDUSTRIAL_ASSETS.map(asset => (
                   <div key={asset.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between h-[600px] bg-black/40 shadow-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Construction size={300} className="text-blue-400" /></div>
                      
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all">
                            {asset.id.includes('Drone') ? <Radar size={40} /> : asset.id.includes('Rover') ? <Monitor size={40} /> : asset.id.includes('Pump') ? <Activity size={40} /> : <Database size={40} />}
                         </div>
                         <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                               asset.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                               asset.status === 'MAINTENANCE' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                               'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>{asset.status}</span>
                            <p className="text-[10px] text-slate-700 font-mono mt-4 font-bold uppercase tracking-tighter">{asset.id}</p>
                         </div>
                      </div>

                      <div className="flex-1 space-y-6 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors">{asset.name}</h4>
                         <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">{asset.type}</p>
                         
                         <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-5 bg-black/60 rounded-3xl border border-white/5 space-y-2 shadow-inner group/stat hover:border-white/20 transition-all">
                               <p className="text-[8px] text-slate-500 font-black uppercase">Shard Health</p>
                               <p className={`text-2xl font-mono font-black ${asset.health > 80 ? 'text-emerald-500' : asset.health > 50 ? 'text-amber-500' : 'text-rose-500'}`}>{asset.health}%</p>
                            </div>
                            <div className="p-5 bg-black/60 rounded-3xl border border-white/5 space-y-2 shadow-inner group/stat hover:border-white/20 transition-all">
                               <p className="text-[8px] text-slate-500 font-black uppercase">m-Stability</p>
                               <p className="text-2xl font-mono font-black text-indigo-400">{asset.stability}x</p>
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* Changed activeTab to activeTool to match state variable name */}
        {activeTool === 'sigma' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
                <div className="lg:col-span-8 glass-card p-14 rounded-[72px] border-2 border-white/5 bg-black/60 shadow-3xl relative overflow-hidden flex flex-col group">
                   <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
                      <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan"></div>
                   </div>
                   <div className="flex flex-col md:flex-row justify-between items-center mb-20 relative z-10 px-4 gap-8">
                      <div className="flex items-center gap-8">
                         <div className="p-6 bg-indigo-600 rounded-[32px] shadow-[0_0_50px_#6366f144] group-hover:rotate-6 transition-transform">
                            <Target className="w-12 h-12 text-white" />
                         </div>
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Process <span className="text-indigo-400">Variability</span></h3>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4 italic">EOS_SIX_SIGMA_MONITOR_v4.2</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[500px] w-full relative z-10 p-6 bg-black/40 rounded-[56px] border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={CONTROL_CHART_DATA}>
                            <defs>
                               <linearGradient id="colorSigma" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="batch" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} domain={[40, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }} />
                            <Area type="monotone" name="Process Resonance" dataKey="val" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#colorSigma)" strokeLinecap="round" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8 flex flex-col">
                  <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-950/5 flex flex-col justify-center items-center text-center space-y-12 shadow-3xl relative overflow-hidden flex-1 group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot size={300} className="text-emerald-400" /></div>
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center border-4 border-white/10 shadow-[0_0_80px_rgba(16,185,129,0.3)] relative z-10 animate-float">
                      <Zap size={48} className="text-white fill-current" />
                    </div>
                    <div className="space-y-4 relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Statistical <span className="text-emerald-400">Sigma</span></h4>
                      <p className="text-slate-400 text-lg leading-relaxed italic px-8">"Maintaining high-precision agricultural sharding by minimizing DPMO constants across local nodes."</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 w-full relative z-10 shadow-inner group-hover:border-emerald-400 transition-colors">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Yield Sigma Level</p>
                      <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter leading-none">{sigmaLevel.toFixed(1)}<span className="text-2xl italic font-sans text-emerald-700 ml-1">σ</span></p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Changed activeTab to activeTool to match state variable name */}
        {activeTool === 'kpis' && (
           <div className="space-y-12 animate-in fade-in duration-700 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12 px-6">
                <div className="space-y-3">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">PERFORMANCE <span className="text-emerald-400">MATRIX</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Real-time industrial metrology for sharded process optimization."</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 glass-card p-14 rounded-[72px] border-2 border-white/5 bg-black/60 shadow-3xl relative overflow-hidden flex flex-col group">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden">
                      <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
                   </div>
                   
                   <div className="flex justify-between items-center mb-16 relative z-10 px-4">
                      <div className="flex items-center gap-8">
                         <div className="p-6 bg-emerald-600 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                            <Activity className="w-10 h-10 text-white" />
                         </div>
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Industrial <span className="text-emerald-400">Throughput</span></h3>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">EOS_METROLOGY_v6.5</p>
                         </div>
                      </div>
                      <div className="text-right border-l-4 border-emerald-500/20 pl-8">
                         <p className="text-[11px] text-slate-600 font-black uppercase mb-2 tracking-widest">Global Resonance</p>
                         <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter leading-none drop-shadow-2xl italic">94<span className="text-3xl font-sans italic ml-1">.2%</span></p>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[450px] w-full relative z-10 p-10 bg-black/80 rounded-[56px] border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[
                            { name: 'S-Pillar', val: 82, color: '#f43f5e' },
                            { name: 'E-Pillar', val: 94, color: '#10b981' },
                            { name: 'H-Pillar', val: 76, color: '#14b8a6' },
                            { name: 'T-Pillar', val: 88, color: '#3b82f6' },
                            { name: 'I-Pillar', val: 91, color: '#818cf8' },
                         ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="name" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Bar dataKey="val" radius={[15, 15, 0, 0]} barSize={80}>
                               {[1,2,3,4,5].map((_, i) => (
                                 <Cell key={i} fill={['#f43f5e', '#10b981', '#14b8a6', '#3b82f6', '#818cf8'][i]} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-8">
                   <div className="glass-card p-12 rounded-[64px] border border-indigo-500/20 bg-black/40 flex flex-col items-center justify-center text-center space-y-10 shadow-3xl relative overflow-hidden group/chart flex-1">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><PieChartIcon className="w-80 h-80 text-indigo-400" /></div>
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-4 relative z-10">
                         <Target className="w-8 h-8 text-indigo-400" /> Yield <span className="text-indigo-400">Allocation</span>
                      </h4>
                      <div className="h-80 w-full relative z-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={KPI_DISTRIBUTION} innerRadius={85} outerRadius={125} paddingAngle={8} dataKey="value" stroke="none">
                                  {KPI_DISTRIBUTION.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '16px' }} />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Status</p>
                            <p className="text-4xl font-mono font-black text-white uppercase italic">Optimal</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                         {KPI_DISTRIBUTION.map(t => (
                            <div key={t.name} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.name}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
           </div>
        )}
      </div>

      {showInitTask && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={closeTaskModal}></div>
           <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(99,102,241,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl group relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Workflow size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Initialize <span className="text-indigo-400">Shard</span></h3>
                       <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">CENTER_GATE_INIT // TASK_MINTING</p>
                    </div>
                 </div>
                 <button onClick={closeTaskModal} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar bg-black/40 relative z-10">
                 {initStep === 'form' && (
                    <form onSubmit={handleInitializeTask} className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-8 block">Task Designation (Alias)</label>
                          <div className="relative group">
                             <input 
                               type="text" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                               placeholder="e.g. Spectral Soil Analysis Shard..." 
                               className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 px-12 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-900 shadow-inner italic" 
                             />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-8 block">Registry Thrust</label>
                             <select 
                               value={taskThrust} onChange={e => setTaskThrust(e.target.value)}
                               className="w-full bg-black border border-white/10 rounded-[28px] py-6 px-10 text-xs font-black uppercase text-white appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner cursor-pointer"
                             >
                                <option>Environmental</option>
                                <option>Technological</option>
                                <option>Societal</option>
                                <option>Industry</option>
                                <option>Human</option>
                             </select>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-8 block">Bounty Priority</label>
                             <select 
                               value={taskPriority} onChange={e => setTaskPriority(e.target.value)}
                               className="w-full bg-black border border-white/10 rounded-[28px] py-6 px-10 text-xs font-black uppercase text-white appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner cursor-pointer"
                             >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                             </select>
                          </div>
                       </div>
                       <button type="submit" className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-8 transition-all active:scale-95 border-4 border-white/10 ring-8 ring-white/5">
                          CONTINUE TO SIGNATURE <ChevronRight size={28} />
                       </button>
                    </form>
                 )}

                 {initStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center flex-1">
                       <div className="text-center space-y-8">
                          <div className="w-32 h-32 bg-indigo-500/10 rounded-[44px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl group relative overflow-hidden">
                             <FingerprintIcon size={64} className="text-indigo-400 group-hover:scale-110 transition-transform relative z-10" />
                             <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Node <span className="text-indigo-400">Signature</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic">"Authorize the sharding of this task into the global industrial thread."</p>
                       </div>

                       <div className="space-y-6 max-w-xl mx-auto w-full">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">Admin Signature (ESIN)</label>
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[48px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-6 pt-4 max-w-2xl mx-auto w-full">
                          <button onClick={() => setInitStep('form')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back</button>
                          <button 
                            onClick={executeInitShard}
                            disabled={!esinSign || isMinting}
                            className="flex-[2] py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-8 ring-white/5"
                          >
                             {isMinting ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={10} className="fill-current" />}
                             {isMinting ? "MINTING SHARD..." : "AUTHORIZE MINT"}
                          </button>
                       </div>
                    </div>
                 )}

                 {initStep === 'success' && (
                    <div className="space-y-16 py-10 animate-in zoom-in duration-1000 flex-1 flex flex-col justify-center items-center text-center">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(99,102,241,0.3)] relative group scale-110">
                          <CheckCircle2 size={32} text-white group-hover:scale-110 transition-transform />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-emerald-400">Minted.</span></h3>
                          <p className="text-emerald-500 text-[12px] font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_TASK_OK_SYNC</p>
                       </div>
                       <button onClick={closeTaskModal} className="w-full max-w-lg py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-3xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default ToolsSection;
