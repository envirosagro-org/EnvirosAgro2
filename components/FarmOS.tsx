import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Binary, Cpu, Zap, Activity, Bot, Database, Terminal, 
  Settings, Loader2, Sparkles, ShieldCheck, Target, 
  RefreshCw, Power, Radio, Gauge, Workflow, Layers,
  ChevronRight, ArrowUpRight, ClipboardList, Scan,
  Wifi, Satellite, Smartphone, Network, History,
  AlertTriangle, ShieldAlert,
  LayoutGrid, SmartphoneNfc, Info, PlusCircle, SearchCode, BadgeCheck, Fingerprint,
  Stamp, Box, Wind, Droplets, Thermometer, Eye, X, Send, BarChart4, CheckCircle2,
  Compass, CloudRain, Heart, TreePine, Waves as WavesIcon, Atom,
  Mountain, RotateCcw, Sprout, Router, Trello, Server, Cog
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, Cell } from 'recharts';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface FarmOSProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
}

const NEURAL_STEPS = [
  "Initializing ML Handshake...",
  "Querying Robotic Ingest Shards...",
  "Sequencing Neural Weights (m-Constant)...",
  "Calibrating Operational Vectors...",
  "Generating Optimization Shard...",
  "Finalizing OS Logic..."
];

const MOCK_ROBOTICS = [
  { id: 'BOT-882-X', name: 'Aero-Scan Drone', type: 'Aerial', status: 'ACTIVE', load: 42, efficiency: 98, sync: 100, color: 'text-blue-400' },
  { id: 'BOT-104-Y', name: 'Terra-Forge Rover', type: 'Ground', status: 'SYNCING', load: 12, efficiency: 74, sync: 85, color: 'text-emerald-400' },
  { id: 'BOT-042-Z', name: 'Bio-Pump Shard', type: 'Infrastructure', status: 'ACTIVE', load: 88, efficiency: 91, sync: 100, color: 'text-indigo-400' },
  { id: 'BOT-991-W', name: 'Spectral Ingester', type: 'Sensor', status: 'IDLE', load: 0, efficiency: 100, sync: 100, color: 'text-slate-500' },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC }) => {
  const [activeTab, setActiveTab] = useState<'scada' | 'robotics' | 'ml_engine' | 'terminal'>('scada');
  const [osSyncLevel, setOsSyncLevel] = useState(0);
  const [dnaAnimation, setDnaAnimation] = useState(0);
  
  // ML Engine States
  const [mlInference, setMlInference] = useState<string | null>(null);
  const [isConsultingEngine, setIsConsultingEngine] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Terminal Logs
  const [logs, setLogs] = useState<string[]>([
    "ENVIROSAGRO_OS_v6.5 kernel loaded.",
    "Registry connection established (0x882A).",
    "Robotic mesh handshake successful.",
    "m-Constant baseline: 8.5 (STABLE)"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOsSyncLevel(prev => (prev < 100 ? prev + 1 : 100));
      setDnaAnimation(prev => (prev + 1) % 360);
    }, 50);

    const logInterval = setInterval(() => {
      const events = [
        "Machine packet sharded to Zone 4.",
        "Acoustic frequency pulse emitted (432Hz).",
        "ML Oracle processed 4.2M telemetry shards.",
        "Robotic rover BOT-104-Y completed sector sweep.",
        "Energy efficiency optimized (+2.4%).",
        "Registry block #428K finalized."
      ];
      const log = `[${new Date().toLocaleTimeString()}] ${events[Math.floor(Math.random() * events.length)]}`;
      setLogs(prev => [log, ...prev].slice(0, 12));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, []);

  const handleConsultEngine = async () => {
    const fee = 10;
    if (!await onSpendEAC(fee, 'FARM_OS_ML_OPTIMIZATION_INGEST')) return;

    setIsConsultingEngine(true);
    setMlInference(null);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < NEURAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const prompt = `Act as the EnvirosAgro OS Machine Learning Engine. Provide a technical optimization shard for the robotic mesh. 
      Analyze current metrics: Node=${user.esin}, m-Constant=${user.metrics.timeConstantTau}, C(a)=${user.metrics.agriculturalCodeU}. 
      Propose 3 machine-level improvements for efficiency. Use EOS framework terminology.`;
      const res = await chatWithAgroExpert(prompt, []);
      setMlInference(res.text);
      onEarnEAC(5, 'ML_ENGINE_CALIBRATION_YIELD');
    } catch (e) {
      setMlInference("Engine synchronization interrupted. Registry timeout.");
    } finally {
      clearInterval(stepInterval);
      setIsConsultingEngine(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* OS Background Matrix */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Network size={1000} className="text-emerald-500" />
      </div>

      {/* 1. OS Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[64px] bg-emerald-700 shadow-[0_0_120px_rgba(16,185,129,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Binary size={96} className="text-white relative z-10 animate-pulse" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[64px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">INDUSTRIAL_OS_CORE</span>
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">ML_ENGINE_ACTIVE</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">FARM <span className="text-emerald-400">OS.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Unified industrial orchestration for robotic swarms and biological systems. Real-time machine learning optimization for maximum planetary resonance."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">OS_BOOT_STATUS</p>
              <h4 className="text-[100px] font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">{osSyncLevel}<span className="text-3xl text-emerald-500 font-sans ml-1">%</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">Registry Integrity Verified</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Processor Heat</span>
                 <span className="text-emerald-400 font-mono">OPTIMAL</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: `${osSyncLevel}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8">
           {[
             { id: 'scada', label: 'Dashboard HUD', icon: LayoutGrid },
             { id: 'robotics', label: 'Machine Mesh', icon: Bot },
             { id: 'ml_engine', label: 'ML Engine Shards', icon: Zap },
             { id: 'terminal', label: 'System Logs', icon: Terminal },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="flex items-center gap-4">
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-3">
               <History size={16} /> Registry Archive
            </button>
            <button className="p-4 bg-emerald-600 rounded-[20px] text-white shadow-xl hover:bg-emerald-500 active:scale-90 transition-all border border-white/10 ring-8 ring-white/5">
               <Settings size={22} />
            </button>
         </div>
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[850px] relative z-10">
        
        {/* VIEW: SCADA DASHBOARD */}
        {activeTab === 'scada' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 space-y-10">
                    <div className="glass-card p-12 rounded-[72px] border border-white/5 bg-black/20 h-[500px] shadow-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={400} /></div>
                       <div className="flex justify-between items-center mb-16 relative z-10 px-4">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                                <Gauge size={32} className="text-white" />
                             </div>
                             <div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Mesh <span className="text-emerald-400">Load Factor</span></h3>
                                <p className="text-[10px] text-slate-500 font-black uppercase mt-3 tracking-widest">REALTIME_PLC_TELEMETRY</p>
                             </div>
                          </div>
                          <div className="text-right border-l border-white/10 pl-8">
                             <p className="text-[10px] text-slate-600 font-black uppercase mb-1">Peak Cycle</p>
                             <p className="text-3xl font-mono font-black text-white italic">94.2%</p>
                          </div>
                       </div>
                       <div className="h-[280px] w-full relative z-10">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={[
                                { t: '0h', val: 42 }, { t: '4h', val: 56 }, { t: '8h', val: 78 }, { t: '12h', val: 94 }, { t: '16h', val: 82 }, { t: '20h', val: 64 }, { t: '24h', val: 48 }
                             ]}>
                                <defs>
                                   <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                <XAxis dataKey="t" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                                <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '15px' }} />
                                <Area type="monotone" name="Inflow Load" dataKey="val" stroke="#10b981" strokeWidth={8} fillOpacity={1} fill="url(#colorLoad)" strokeLinecap="round" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[
                         { l: 'Consensus Quorum', v: '99.98%', i: ShieldCheck, c: 'text-emerald-400' },
                         { l: 'Network Latency', v: '14ms', i: Activity, c: 'text-blue-400' },
                       ].map((s, i) => (
                         <div key={i} className="glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 flex items-center gap-8 shadow-xl group hover:border-emerald-500/20 transition-all">
                            <div className={`p-5 rounded-[28px] bg-white/5 group-hover:rotate-12 transition-transform shadow-inner ${s.c}`}><s.i size={32} /></div>
                            <div>
                               <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{s.l}</p>
                               <p className="text-3xl font-mono font-black text-white">{s.v}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[64px] border border-white/10 bg-indigo-950/10 shadow-3xl h-full flex flex-col relative overflow-hidden group/sys">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Database size={300} className="text-indigo-400" /></div>
                       <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
                          <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><Server size={24} className="text-white" /></div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Mesh <span className="text-indigo-400">Integrity</span></h4>
                       </div>
                       
                       <div className="space-y-8 flex-1 relative z-10">
                          {[
                            { l: 'Auth Density', v: 'High', c: 'text-emerald-400' },
                            { l: 'Shard Redundancy', v: 'x3', c: 'text-blue-400' },
                            { l: 'm-Resonance', v: 'Stable', c: 'text-indigo-400' },
                          ].map(m => (
                            <div key={m.l} className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl border border-white/5">
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.l}</span>
                               <span className={`text-xs font-mono font-black ${m.c}`}>{m.v}</span>
                            </div>
                          ))}
                       </div>

                       <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                          <button className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">INIT_MESH_AUDIT</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: MACHINE MESH (ROBOTICS) */}
        {activeTab === 'robotics' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-1000">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10 px-8">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Robotic <span className="text-blue-400">Unit Mesh</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Real-time orchestration of autonomous agents for effective field sharding."</p>
                 </div>
                 <button className="px-12 py-5 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                    <PlusCircle size={20} /> Pair Robotic Node
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
                 {MOCK_ROBOTICS.map(robot => (
                    <div key={robot.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden">
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 group-hover:rotate-12 transition-transform shadow-inner ${robot.color}`}>
                             <Bot size={32} />
                          </div>
                          <div className="text-right">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                robot.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                robot.status === 'SYNCING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' : 
                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                             }`}>{robot.status}</span>
                             <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">NODE: {robot.id}</p>
                          </div>
                       </div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors leading-none">{robot.name}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{robot.type} Unit</p>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 space-y-6 relative z-10">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                             <span>Effective Output</span>
                             <span className="text-white font-mono">{robot.efficiency}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                             <div className={`h-full bg-blue-600 rounded-full transition-all duration-[2s] shadow-[0_0_15px_#3b82f6]`} style={{ width: `${robot.efficiency}%` }}></div>
                          </div>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-800">
                             <span>Mesh Load: {robot.load}%</span>
                             <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Cog size={14} /></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* VIEW: ML ENGINE SHARDS */}
        {activeTab === 'ml_engine' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-emerald-500/30 bg-black/60 shadow-[0_0_200px_rgba(16,185,129,0.2)] text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Sparkles size={1000} className="text-white" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] border-4 border-white/10 mx-auto group-hover:scale-105 transition-transform duration-700 animate-float relative overflow-hidden">
                       <Bot size={80} className="text-white relative z-10" />
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">ML <span className="text-emerald-400">ENGINE.</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed">
                          "Analyzing sharded robotic telemetry through high-frequency neural pathways to automate industrial excellence and efficient operations."
                       </p>
                    </div>
                 </div>

                 <div className="w-full max-w-3xl mx-auto relative z-10">
                    {!mlInference && !isConsultingEngine ? (
                      <div className="py-24 border-4 border-dashed border-white/10 rounded-[64px] flex flex-col items-center justify-center space-y-12 opacity-30 group/btn hover:opacity-100 transition-all duration-700 bg-black/40">
                         <div className="relative">
                            <Sparkles size={120} className="text-slate-700 group-hover/btn:text-emerald-400 transition-colors duration-1000" />
                            <div className="absolute inset-0 border-4 border-dashed border-emerald-500/20 rounded-full scale-150 animate-spin-slow"></div>
                         </div>
                         <button 
                            onClick={handleConsultEngine}
                            className="px-20 py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all ring-[20px] ring-white/5 border-4 border-white/10"
                         >
                            INITIALIZE ENGINE INFERENCE
                         </button>
                      </div>
                    ) : isConsultingEngine ? (
                      <div className="py-24 flex flex-col items-center justify-center space-y-16 animate-in zoom-in duration-500">
                         <div className="relative">
                            <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Binary size={40} className="text-emerald-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-8">
                            <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0 drop-shadow-lg">{NEURAL_STEPS[currentStepIndex]}</p>
                            <div className="flex justify-center gap-2 pt-4">
                               {[...Array(8)].map((_, i) => (
                                  <div key={i} className="w-2 h-16 bg-emerald-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>
                               ))}
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                         <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-emerald-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[16px] border-l-emerald-600/50 relative overflow-hidden group/shard text-left">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/shard:scale-110 transition-transform duration-[12s] pointer-events-none"><AtomIcon size={800} /></div>
                            
                            <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                               <div className="flex items-center gap-6">
                                  <BadgeCheck size={40} className="text-emerald-400" />
                                  <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Inference Result</h4>
                               </div>
                               <div className="text-right">
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Model Confidence</p>
                                  <p className="text-3xl font-mono font-black text-emerald-400">99.8%</p>
                               </div>
                            </div>

                            <div className="text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l-2 border-white/5">
                               {mlInference}
                            </div>

                            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                               <div className="flex items-center gap-6">
                                  <Fingerprint size={48} className="text-emerald-400" />
                                  <div className="text-left">
                                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">REGISTRY_HASH</p>
                                     <p className="text-xl font-mono text-white">0xΩ_SYNC_OK</p>
                                  </div>
                               </div>
                               <button onClick={() => setMlInference(null)} className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl">Discard Shard</button>
                            </div>
                         </div>
                         <div className="flex justify-center pt-8">
                            <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.6em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-[12px] ring-white/5">
                               <Stamp size={28} /> ANCHOR INFERENCE TO LEDGER
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: SYSTEM TERMINAL (LOGS) */}
        {activeTab === 'terminal' && (
           <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
              <div className="glass-card rounded-[64px] border-2 border-white/10 bg-[#050706] flex flex-col min-h-[750px] relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                          <Terminal size={32} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">System <span className="text-indigo-400">Terminal</span></h3>
                          <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">L2_MACHINE_HANDSHAKE_v4.2</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">INGEST_STABLE</span>
                    </div>
                 </div>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal relative z-10 font-mono text-[13px] text-indigo-400/80 bg-black/40 shadow-inner">
                 {logs.map((log, i) => (
                    <div key={i} className="mb-4 border-b border-white/[0.03] pb-4 flex gap-6 hover:bg-white/[0.02] transition-colors group">
                       <span className="text-slate-700 w-24 shrink-0 font-bold">#0x{(i+882).toString(16).toUpperCase()}</span>
                       <span className="text-indigo-300 group-hover:text-indigo-100 transition-colors italic">{log}</span>
                       <CheckCircle2 size={14} className="ml-auto text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                    </div>
                 ))}
                 <div className="mt-10 pt-10 border-t border-white/10 animate-pulse text-indigo-500 font-black">
                    AWAITING_NEXT_SHARD_INGEST...
                 </div>
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center opacity-30 mt-auto grayscale pointer-events-none">
                 <div className="flex items-center gap-4">
                    <Fingerprint size={28} className="text-slate-400" />
                    <div className="space-y-1">
                       <p className="text-[9px] font-mono uppercase font-black text-slate-500 tracking-widest leading-none">ZK_SNARK_AUTH_ACTIVE</p>
                       <p className="text-lg font-mono font-black text-slate-600 tracking-tighter leading-none">0x882_TERMINAL_SYNC_OK</p>
                    </div>
                 </div>
              </div>
            </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

// Helper component for the background watermark icon
const AtomIcon = ({ size, className }: { size?: number, className?: string }) => (
  <Atom size={size} className={className} />
);

export default FarmOS;