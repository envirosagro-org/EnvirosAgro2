
import React, { useState, useMemo } from 'react';
// Fix: Added missing Recycle import from lucide-react
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
  Recycle
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

const KANBAN_DATA = [
  { id: 'T-1', title: 'Soil Biome Registry', status: 'backlog', thrust: 'Environmental', owner: 'Node_P4', priority: 'High' },
  { id: 'T-2', title: 'Spectral Drone Calibration', status: 'syncing', thrust: 'Technological', owner: 'Stwd_Nairobi', priority: 'Medium' },
  { id: 'T-3', title: 'Community Vetting Hub', status: 'settled', thrust: 'Societal', owner: 'Global_Alpha', priority: 'Low' },
  { id: 'T-4', title: 'Carbon Credit Minting', status: 'syncing', thrust: 'Industry', owner: 'Node_NY_01', priority: 'High' },
];

const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'sigma' | 'kpis' | 'kanban'>('kanban');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sigmaInput, setSigmaInput] = useState('');
  const [sigmaAdvice, setSigmaAdvice] = useState<string | null>(null);
  
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
    const prompt = `Six Sigma Strategy for: ${sigmaInput}`;
    const response = await chatWithAgroExpert(prompt, []);
    setSigmaAdvice(response.text);
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] w-fit border border-white/5 bg-black/40">
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
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-emerald-400">Task Grid</span></h3>
                   <p className="text-slate-500 text-sm font-medium">Distributed task orchestration across regional industrial shards.</p>
                </div>
                <button className="px-8 py-4 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-2">
                   <Plus className="w-4 h-4" /> Initialize Task Node
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
                {['backlog', 'syncing', 'settled'].map(col => (
                  <div key={col} className="glass-card p-6 rounded-[32px] border-white/5 bg-white/[0.01] flex flex-col gap-6">
                     <div className="flex justify-between items-center px-4">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{col}</h4>
                        <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-slate-600">
                           {KANBAN_DATA.filter(t => t.status === col).length}
                        </span>
                     </div>
                     <div className="space-y-4">
                        {KANBAN_DATA.filter(t => t.status === col).map(task => (
                           <div key={task.id} className="glass-card p-6 rounded-[28px] border-white/5 bg-black/40 hover:border-emerald-500/20 transition-all group cursor-grab active:cursor-grabbing">
                              <div className="flex justify-between items-start mb-4">
                                 <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                    task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 
                                    task.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' : 
                                    'bg-slate-500/10 text-slate-500'
                                 }`}>
                                    {task.priority}
                                 </span>
                                 <button className="text-slate-700 hover:text-white transition-colors"><MoreHorizontal size={14} /></button>
                              </div>
                              <h5 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">{task.title}</h5>
                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-6">{task.thrust} Thrust</p>
                              
                              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                                       <User size={12} className="text-slate-500" />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-600">{task.owner}</span>
                                 </div>
                                 <div className="flex items-center gap-1 text-[9px] font-black text-slate-500">
                                    <Clock size={10} /> 12h
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTool === 'sigma' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                   <div className="flex justify-between items-center relative z-10 mb-10">
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
                   <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-8 flex flex-col justify-center text-center group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Scale className="w-48 h-48 text-emerald-400" /></div>
                      <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] relative z-10">Calculated Node Sigma</p>
                      <h3 className="text-8xl font-black text-white font-mono tracking-tighter relative z-10">{sigmaLevel.toFixed(1)}</h3>
                      <div className="space-y-2 relative z-10">
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Process Yield</p>
                         <p className="text-lg font-mono font-black text-emerald-400">99.98%</p>
                      </div>
                   </div>

                   <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                         <Bot className="w-5 h-5 text-indigo-400" />
                         <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Sigma Strategy Oracle</h4>
                      </div>
                      <textarea 
                         value={sigmaInput}
                         onChange={e => setSigmaInput(e.target.value)}
                         placeholder="Explain a process friction..."
                         className="w-full bg-black/60 border border-white/10 rounded-2xl p-5 text-white text-xs h-32 focus:ring-2 focus:ring-indigo-500/40 outline-none resize-none"
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
                <div className="glass-card p-12 rounded-[56px] border-l-8 border-indigo-500 bg-indigo-500/5 animate-in slide-in-from-left-4 duration-500">
                   <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line">
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
                   <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 space-y-4 group hover:border-white/10 transition-all">
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
                       <button className="px-6 py-2 bg-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">REALTIME_SYNC</button>
                    </div>
                 </div>
                 <div className="h-[450px] w-full min-h-0 min-w-0">
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
      `}</style>
    </div>
  );
};

export default ToolsSection;
