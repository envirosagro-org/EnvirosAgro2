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
  PieChart as PieChartIcon,
  /* Added Maximize2 and Send to fix "Cannot find name" errors on lines 385 and 504 */
  Maximize2,
  Send
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
            /* Fixed: Use imported 'Boxes' instead of unresolved 'BoxesIcon' */
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
                                       <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 shadow-inner group-hover/task:rotate-6 transition-all">
                                          <User size={14} />
                                       </div>
                                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{task.owner}</span>
                                    </div>
                                    <div className="flex gap-2">
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); onOpenEvidence(task); }}
                                          className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all shadow-md active:scale-90"
                                       >
                                          <Upload size={14} />
                                       </button>
                                       {idx < KANBAN_STAGES.length - 1 && (
                                          <button 
                                             onClick={(e) => { e.stopPropagation(); moveTask(task.id, KANBAN_STAGES[idx + 1].id); }}
                                             className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl hover:bg-indigo-500 transition-all active:scale-90"
                                          >
                                             <ChevronRight size={14} />
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTool === 'resources' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {INDUSTRIAL_ASSETS.map((asset) => (
                    <div key={asset.id} className="p-10 glass-card rounded-[64px] border border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col justify-between h-[520px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.98]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[10s]"><Database size={180} /></div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${asset.col} shadow-2xl group-hover:rotate-6 transition-all`}>
                                {asset.type.includes('Aerial') ? <Radar size={32} /> : asset.type.includes('Ground') ? <Workflow size={32} /> : <Database size={32} />}
                             </div>
                             <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest shadow-lg ${
                                asset.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                             }`}>{asset.status}</span>
                          </div>
                          <div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{asset.name}</h4>
                             <p className="text-[10px] text-slate-500 font-mono mt-4 font-bold tracking-widest uppercase italic">{asset.id} // {asset.type}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-black/60 rounded-[36px] border border-white/5 space-y-2 shadow-inner group-hover/card:border-blue-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Node Health</p>
                                <p className="text-3xl font-mono font-black text-white">{asset.health}%</p>
                             </div>
                             <div className="p-6 bg-black/60 rounded-[36px] border border-white/5 space-y-2 shadow-inner group-hover/card:border-emerald-500/20 transition-all text-right">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">m-Factor</p>
                                <p className="text-3xl font-mono font-black text-white">{asset.stability}x</p>
                             </div>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                          <p className="text-[9px] text-slate-700 font-black uppercase italic">Last Audit: {asset.lastAudit}</p>
                          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl active:scale-95"><Maximize2 size={20} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTool === 'sigma' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 md:p-12 rounded-[56px] border border-emerald-500/20 bg-emerald-950/5 space-y-10 shadow-3xl flex flex-col justify-between overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]"><Target size={300} className="text-emerald-400" /></div>
                       <div className="flex items-center gap-6 relative z-10 border-b border-emerald-500/20 pb-8">
                          <div className="p-4 bg-emerald-600 rounded-[28px] shadow-3xl group-hover:rotate-12 transition-transform">
                             <Target size={32} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Precision <span className="text-emerald-400">Sigma</span></h3>
                            <p className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase mt-3">TQM_精度の監査</p>
                          </div>
                       </div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="grid grid-cols-1 gap-6">
                             <div className="group/inp">
                                <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/inp:text-emerald-400 transition-colors">Observed Defects (D)</label><span className="text-xl font-mono text-white font-black">{defects}</span></div>
                                <input type="range" min="0" max="50" step="1" value={defects} onChange={e => setDefects(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner group-hover/inp:h-3 transition-all" />
                             </div>
                             <div className="group/inp">
                                <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/inp:text-emerald-400 transition-colors">Opportunities (O)</label><span className="text-xl font-mono text-white font-black">{opportunities}</span></div>
                                <input type="range" min="100" max="10000" step="100" value={opportunities} onChange={e => setOpportunities(parseInt(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner group-hover/inp:h-3 transition-all" />
                             </div>
                          </div>

                          <div className="p-10 bg-black/60 rounded-[48px] border border-emerald-500/20 shadow-inner text-center space-y-4">
                             <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest italic">CALCULATED_SIGMA_LEVEL</p>
                             <h5 className="text-8xl font-mono font-black text-white tracking-tighter italic drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">{sigmaLevel.toFixed(1)}<span className="text-3xl text-emerald-500 ml-1">σ</span></h5>
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-lg inline-block ${
                                sigmaLevel >= 5 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>
                                {sigmaLevel >= 5 ? 'INDUSTRIAL_SUPREMACY' : 'OPTIMIZATION_REQUIRED'}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-8 flex flex-col gap-8">
                    <div className="glass-card p-12 md:p-14 rounded-[72px] border-2 border-white/5 bg-black/20 flex-1 flex flex-col relative overflow-hidden shadow-3xl">
                       <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                                <Bot size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                             </div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">DMAIC <span className="text-indigo-400">Oracle</span></h4>
                          </div>
                          <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                             <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_STABLE</span>
                          </div>
                       </div>

                       <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-20">
                          {!sigmaAdvice && !isOptimizing ? (
                             <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-10 group">
                                <div className="relative">
                                   <Target size={140} className="text-slate-500 group-hover:text-emerald-400 transition-colors duration-1000" />
                                   <div className="absolute inset-[-40px] border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                                </div>
                                <div className="space-y-4">
                                   <p className="text-5xl font-black uppercase tracking-[0.5em] text-white italic">PRECISION_STANDBY</p>
                                   <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Describe process friction to synthesize advice</p>
                                </div>
                             </div>
                          ) : isOptimizing ? (
                             <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                                <div className="relative">
                                   <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Binary size={40} className="text-indigo-400 animate-pulse" />
                                   </div>
                                </div>
                                <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">SEQUENCING REMEDIATION SHARDS...</p>
                             </div>
                          ) : (
                             <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 flex-1">
                                <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[12px] border-l-indigo-600/50 relative overflow-hidden group/shard">
                                   <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><Target size={600} className="text-indigo-400" /></div>
                                   <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                      {sigmaAdvice}
                                   </div>
                                </div>
                                <div className="flex justify-center gap-10">
                                   <button onClick={() => setSigmaAdvice(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Analysis</button>
                                   <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-8 ring-white/5">
                                      <Stamp size={28} /> ANCHOR TO LEDGER
                                   </button>
                                </div>
                             </div>
                          )}
                       </div>

                       <div className="p-10 border-t border-white/5 bg-black/90 relative z-20 shrink-0">
                          <div className="max-w-5xl mx-auto relative group">
                             <textarea 
                                value={sigmaInput}
                                onChange={e => setSigmaInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSigmaAudit())}
                                placeholder="Describe the industrial friction (e.g. Inflow moisture variance in Zone 4)..."
                                className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 pl-10 pr-28 text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-stone-900 resize-none h-32 shadow-inner italic font-medium" 
                             />
                             <button 
                                onClick={handleSigmaAudit}
                                disabled={isOptimizing || !sigmaInput.trim()}
                                className="absolute right-6 bottom-6 p-6 bg-indigo-600 rounded-[32px] text-white shadow-3xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90 ring-4 ring-indigo-500/5 group-hover:scale-105"
                             >
                                <Send size={28} />
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTool === 'kpis' && (
           <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-14 rounded-[80px] border border-white/5 bg-black/40 shadow-3xl space-y-12 relative overflow-hidden group flex flex-col">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan"></div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-8">
                          <div className="p-6 bg-indigo-600 rounded-[32px] shadow-3xl border border-white/10 group-hover:rotate-6 transition-transform">
                             <BarChart3 className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Process <span className="text-indigo-400">Control Limits</span></h3>
                             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">SHEWHART_ANALYTICS_v4.2</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 min-h-[450px] w-full relative z-10 p-10 bg-black rounded-[64px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CONTROL_CHART_DATA}>
                             <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="batch" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                             <ReferenceLine y={65} stroke="#10b981" strokeDasharray="10 10" label={{ position: 'right', value: 'UCL', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                             <ReferenceLine y={55} stroke="#ef4444" strokeDasharray="10 10" label={{ position: 'right', value: 'LCL', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                             <Area type="monotone" name="Batch Stability" dataKey="val" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#colorVal)" strokeLinecap="round" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-xl flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden flex-1 group">
                       <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-4 relative z-10">
                          <PieChartIcon className="w-8 h-8 text-indigo-400" /> KPI <span className="text-indigo-400">Diffusion</span>
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
                             <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Total</p>
                             <p className="text-4xl font-mono font-black text-white">100%</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                          {KPI_DISTRIBUTION.map(t => (
                             <div key={t.name} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{t.name}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Task Initialization Modal */}
      {showInitTask && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={closeTaskModal}></div>
           <div className="relative z-10 w-full max-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-indigo-500/[0.02] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Initialize <span className="text-indigo-400">Shard</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">KANBAN_INGEST_INIT</p>
                    </div>
                 </div>
                 <button onClick={closeTaskModal} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 {initStep === 'form' && (
                    <form onSubmit={handleInitializeTask} className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Shard Label (Title)</label>
                          <input 
                            type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                            placeholder="e.g. Zone 4 Moisture Calibration..."
                            className="w-full bg-black border border-white/10 rounded-2xl py-6 px-10 text-2xl font-bold text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Pillar Alignment</label>
                             <select value={taskThrust} onChange={e => setTaskThrust(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase text-xs">
                                <option>Environmental</option>
                                <option>Technological</option>
                                <option>Societal</option>
                                <option>Industry</option>
                                <option>Human</option>
                             </select>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Execution Priority</label>
                             <select value={taskPriority} onChange={e => setTaskPriority(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase text-xs">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                             </select>
                          </div>
                       </div>
                       <button type="submit" disabled={!taskTitle.trim()} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10">CONTINUE TO SIGNATURE</button>
                    </form>
                 )}

                 {initStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center flex-1">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative group overflow-hidden">
                             <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                             <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-indigo-400">Signature</span></h4>
                       </div>

                       <div className="p-8 bg-black/60 border border-white/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <Coins size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                             <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Ingest Fee</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-white">10 <span className="text-sm text-emerald-500 italic">EAC</span></span>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">Auth Signature (ESIN)</label>
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.1em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setInitStep('form')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back</button>
                          <button 
                            onClick={executeInitShard}
                            disabled={isMinting || !esinSign}
                            className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                          >
                             {isMinting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={28} className="fill-current" />}
                             {isMinting ? "MINTING SHARD..." : "AUTHORIZE MINT"}
                          </button>
                       </div>
                    </div>
                 )}

                 {initStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.3)] relative group scale-110">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_TASK_OK_SYNC</p>
                       </div>
                       <button onClick={closeTaskModal} className="w-full max-w-md py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ToolsSection;
