import React, { useState, useEffect, useMemo } from 'react';
import { 
  Binary, Cpu, Zap, Activity, Bot, Database, Terminal, 
  Settings, Loader2, Sparkles, ShieldCheck, Target, 
  RefreshCw, Power, Radio, Gauge, Workflow, Layers,
  ChevronRight, ArrowUpRight, ClipboardList, Scan,
  Wifi, Satellite, Smartphone, Network, History,
  AlertTriangle, ShieldAlert,
  // Added missing icon imports to fix 'Cannot find name' errors
  LayoutGrid, SmartphoneNfc, Info, PlusCircle, SearchCode, BadgeCheck, Fingerprint
} from 'lucide-react';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface FarmOSProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
}

const AUTOMATION_NODES = [
  { id: 'AUT-882', name: 'Irrigation Shard', status: 'ACTIVE', progress: 64, type: 'Moisture Control', icon: Zap, col: 'text-blue-400' },
  { id: 'AUT-104', name: 'Nutrient Relay', status: 'STANDBY', progress: 0, type: 'Bio-Input Delivery', icon: Activity, col: 'text-emerald-400' },
  { id: 'AUT-042', name: 'Security Perimeter', status: 'ACTIVE', progress: 98, type: 'Intrusion Detection', icon: ShieldCheck, col: 'text-rose-400' },
  { id: 'AUT-991', name: 'Spectral Scanner', status: 'SYNCING', progress: 42, type: 'Pathogen Sweep', icon: Scan, col: 'text-indigo-400' },
];

const ROBOTIC_UNITS = [
  { id: 'BOT-A1', type: 'Aerial Drone', battery: 82, signal: 94, task: 'Mapping Zone 4', status: 'OPERATIONAL' },
  { id: 'BOT-T2', type: 'Terra Rover', battery: 14, signal: 98, task: 'Charging', status: 'CRITICAL_BATT' },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'automation' | 'ml_oracle' | 'robotics'>('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isProcessingAutomation, setIsProcessingAutomation] = useState<string | null>(null);
  
  // ML Engine States
  const [mlInference, setMlInference] = useState<string | null>(null);
  const [isConsultingEngine, setIsConsultingEngine] = useState(false);

  // OS Integration Animation
  const [osSyncLevel, setOsSyncLevel] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOsSyncLevel(prev => (prev < 100 ? prev + 1 : 100));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleConsultEngine = async () => {
    setIsConsultingEngine(true);
    setMlInference(null);
    try {
      const prompt = `Act as the EnvirosAgro OS Machine Learning Engine. Provide an automated feedback shard for a farm manager. 
      Analyze node metrics: C(a)=${user.metrics.agriculturalCodeU}, m=${user.metrics.timeConstantTau}. 
      Propose 3 automated process improvements based on the SEHTI framework.`;
      const res = await chatWithAgroExpert(prompt, []);
      setMlInference(res.text);
      onEarnEAC(5, 'ML_ENGINE_CALIBRATION_INGEST');
    } catch (e) {
      setMlInference("Engine synchronization interrupted. Registry timeout.");
    } finally {
      setIsConsultingEngine(false);
    }
  };

  const handleToggleAutomation = (nodeId: string) => {
    setIsProcessingAutomation(nodeId);
    setTimeout(() => {
      setIsProcessingAutomation(null);
      alert(`AUTOMATION COMMAND SENT: Shard ${nodeId} state updated via Registry Handshake.`);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* 1. Industrial OS Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s]">
              <Binary className="w-[500px] h-[500px] text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.3)] ring-4 ring-white/10 shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <Cpu className="w-20 h-20 text-white relative z-10 group-hover:scale-110 transition-transform" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner">FARM_OS_PROTOCOL_STABLE</span>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Farm <span className="text-indigo-400">OS</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
                 "Advanced industrial management tool. Automating physical farm processes through the **EnvirosAgro ML Engine** bridge."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Integration Sync</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">{osSyncLevel}<span className="text-2xl text-indigo-500">%</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Engine Response</span>
                 <span className="text-indigo-400 font-bold">STABLE</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 animate-pulse" style={{ width: `${osSyncLevel}%` }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Primary OS Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 md:ml-4">
        {[
          { id: 'dashboard', label: 'Automation HUD', icon: LayoutGrid },
          { id: 'automation', label: 'Process Control', icon: Workflow },
          { id: 'ml_oracle', label: 'ML Engine Shards', icon: Bot },
          { id: 'robotics', label: 'Robotic Units', icon: Satellite },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Operational Content Areas */}
      <div className="min-h-[750px] px-4 md:px-0">
        
        {/* --- OS DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
              <div className="lg:col-span-8 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-2xl group hover:border-emerald-500/40 transition-all">
                       <div className="flex justify-between items-center">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                             <Gauge size={32} />
                          </div>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">Operational Efficiency</span>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">94<span className="text-emerald-500 text-lg ml-1">%</span></h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automation Coverage</p>
                       </div>
                    </div>
                    <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-500/5 space-y-8 shadow-2xl group hover:border-blue-500/40 transition-all">
                       <div className="flex justify-between items-center">
                          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                             <RefreshCw size={32} className="animate-spin-slow" />
                          </div>
                          <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20">ML Sync Loop</span>
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">2.4<span className="text-blue-400 text-lg ml-1">ms</span></h4>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Command Latency Shard</p>
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-[#050706] shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Terminal size={300} /></div>
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative z-10">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                          <Terminal className="w-6 h-6 text-indigo-400" /> OS_AUTOLOG_STREAM
                       </h3>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                          <span className="text-[9px] font-mono text-slate-600">INGEST_ACTIVE</span>
                       </div>
                    </div>
                    <div className="space-y-4 font-mono text-[11px] h-[300px] overflow-y-auto custom-scrollbar-terminal pr-4 relative z-10">
                       <p className="text-indigo-400">[08:42:11] INITIALIZING FARM_OS PROTOCOL_v1.0</p>
                       <p className="text-slate-500">[08:42:14] SYNCING WITH ENVIROSAGRO_ML_ENGINE...</p>
                       <p className="text-emerald-500">[08:42:15] HANDSHAKE_SUCCESS: REGISTRY_LINKED</p>
                       <p className="text-slate-600">[08:42:22] INGESTING SOIL_MOISTURE SHARD FROM NODE_P4</p>
                       <p className="text-blue-400">[08:42:25] ML_ENGINE: OPTIMIZING IRRIGATION FREQUENCY (Δ=0.14)</p>
                       <p className="text-slate-500">[08:42:28] COMMAND_TRANSMITTED: VALVE_CLUSTER_B_OPEN_30S</p>
                       <p className="text-indigo-400">[08:42:32] ROBOTIC_UNIT_BOT-A1: COMMENCING ZONE_4 SCAN</p>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 space-y-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Smartphone size={300} className="text-indigo-400" /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><SmartphoneNfc className="w-6 h-6 text-white" /></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-widest italic">OS <span className="text-indigo-400">Bridge</span></h4>
                    </div>
                    <div className="space-y-6 relative z-10">
                       <p className="text-slate-300 text-sm italic font-medium leading-relaxed border-l-2 border-indigo-500/40 pl-6">
                          "Farm OS integrates directly with your hardware nodes. Granting full command autonomy to the EnvirosAgro ML engine optimizes resource consumption (S)."
                       </p>
                       <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                          <Power size={16} /> Link System Autonomy
                       </button>
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                    <div className="flex items-center gap-3">
                       <Info className="w-5 h-5 text-blue-400" />
                       <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic text-center">Protocol Integrity</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">
                       Automation commands are signed by the EnvirosAgro ZK-SNARK protocol to prevent unauthorized robotic interference.
                    </p>
                 </div>
              </div>
           </div>
        )}

        {/* --- PROCESS AUTOMATION TAB --- */}
        {activeTab === 'automation' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 px-4">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Automation <span className="text-indigo-400">Nodes</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Decentralized control of physical farm processes via sharded command packets."</p>
                 </div>
                 <button className="px-8 py-4 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <PlusCircle size={20} /> Register Automation Shard
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                 {AUTOMATION_NODES.map(node => (
                    <div key={node.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between h-[450px] relative overflow-hidden bg-black/20 shadow-xl">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Workflow size={200} /></div>
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-12 transition-all shadow-inner ${node.col}`}>
                                <node.icon size={28} />
                             </div>
                             <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                                  node.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                  node.status === 'SYNCING' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse' : 
                                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>{node.status}</span>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase tracking-tighter italic font-black">{node.id}</p>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{node.name}</h4>
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-2">{node.type}</p>
                          </div>
                          <div className="space-y-3 pt-6 border-t border-white/5">
                             <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                <span>Output Load</span>
                                <span className="text-white font-mono">{node.progress}%</span>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-[2s] ${node.status === 'ACTIVE' ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-slate-700'}`} style={{ width: `${node.progress}%` }}></div>
                             </div>
                          </div>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                          <button 
                             onClick={() => handleToggleAutomation(node.id)}
                             disabled={isProcessingAutomation === node.id}
                             className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase transition-all shadow-md flex items-center justify-center gap-2 ${node.status === 'ACTIVE' ? 'bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white' : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}
                          >
                             {isProcessingAutomation === node.id ? <Loader2 size={12} className="animate-spin" /> : <Power size={12} />}
                             {node.status === 'ACTIVE' ? 'TERMINATE' : 'INITIALIZE'}
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- ML ENGINE FEEDBACK TAB --- */}
        {activeTab === 'ml_oracle' && (
           <div className="max-w-[1400px] mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="p-16 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-[10s]"><Bot size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-8 text-center">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Machine Learning <span className="text-indigo-400">Engine</span></h3>
                       <p className="text-slate-500 text-2xl font-medium mt-6 italic max-w-2xl mx-auto leading-relaxed">Synthesizing real-time industrial telemetry into automated process remediation shards.</p>
                    </div>
                 </div>

                 <div className="w-full max-w-4xl relative z-10 space-y-10">
                    {!mlInference && !isConsultingEngine ? (
                      <div className="py-20 flex flex-col items-center gap-8 opacity-40">
                         <SearchCode size={120} className="text-slate-600" />
                         <p className="text-xl font-black uppercase tracking-[0.4em]">Engine Standby</p>
                         <button 
                           onClick={handleConsultEngine}
                           className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                         >
                            <Zap size={20} fill="currentColor" /> INITIALIZE INFERENCE SWEEP
                         </button>
                      </div>
                    ) : isConsultingEngine ? (
                      <div className="py-20 flex flex-col items-center gap-12">
                         <div className="relative">
                            <Loader2 size={80} className="text-indigo-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Sparkles className="text-indigo-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="space-y-4 text-center">
                            <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">PROCESSING REGISTRY NEURALS...</p>
                            <p className="text-slate-600 font-mono text-xs uppercase">TARGET_NODE_ESIN: {user.esin}</p>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-10 animate-in fade-in duration-700">
                         <div className="p-10 md:p-14 bg-black/60 rounded-[64px] border border-white/10 shadow-inner group/bubble hover:border-indigo-500/20 transition-all text-left border-l-8 border-l-indigo-600 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Database size={400} /></div>
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                               <BadgeCheck className="text-emerald-400" />
                               <h4 className="text-xl font-black text-white uppercase italic">Inference Shard Report</h4>
                            </div>
                            <div className="text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium relative z-10">
                               {mlInference}
                            </div>
                         </div>
                         <div className="flex justify-center gap-6">
                            <button onClick={() => setMlInference(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Discard Shard</button>
                            <button className="px-16 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                               <RefreshCw size={18} /> Re-Calculate Delta
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- ROBOTICS INTEGRATION TAB --- */}
        {activeTab === 'robotics' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                       <Bot className="w-10 h-10 text-blue-400" /> Robotic <span className="text-blue-400">Unit Registry</span>
                    </h3>
                    <p className="text-slate-500 text-lg font-medium italic">Monitor and command autonomous industrial units sharded to your local cluster.</p>
                 </div>
                 <button className="px-8 py-4 bg-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                    <PlusCircle size={20} /> Pair New Unit
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {ROBOTIC_UNITS.map(bot => (
                    <div key={bot.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/60 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col shadow-3xl active:scale-[0.99] duration-300">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Satellite size={300} className="text-white" /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-xl group-hover:rotate-6 transition-all">
                                {bot.type.includes('Drone') ? <Satellite size={32} /> : <Bot size={32} />}
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{bot.id}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{bot.type}</p>
                             </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${
                             bot.status === 'OPERATIONAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                          }`}>{bot.status.replace('_', ' ')}</span>
                       </div>

                       <div className="space-y-8 relative z-10">
                          <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 shadow-inner">
                             <div className="flex items-center gap-4 mb-4">
                                <Activity size={16} className="text-blue-400" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Task Shard</span>
                             </div>
                             <p className="text-lg font-black text-white uppercase italic">"{bot.task}"</p>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                   <span className="flex items-center gap-2"><Smartphone size={12} /> Battery</span>
                                   <span className={bot.battery < 20 ? 'text-rose-500' : 'text-white'}>{bot.battery}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                   <div className={`h-full transition-all duration-[2s] ${bot.battery < 20 ? 'bg-rose-600' : 'bg-blue-600'}`} style={{ width: `${bot.battery}%` }}></div>
                                </div>
                             </div>
                             <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                   <span className="flex items-center gap-2"><Wifi size={12} /> Signal</span>
                                   <span className="text-white">{bot.signal}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500" style={{ width: `${bot.signal}%` }}></div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 relative z-10">
                          <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">Manual Override</button>
                          <button className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl">Return to Base</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* 4. Persistence Shard Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-indigo-500/20 bg-indigo-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-20 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
            <ShieldCheck className="w-[1000px] h-[1000px] text-indigo-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-indigo-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Fingerprint className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">OS <span className="text-indigo-400">SOVEREIGNTY</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 Farm OS leverages machine learning telemetry to automate the industrial promotion thread. Every automated action is immutably anchored.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">AUTOMATION_QUORUM</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-indigo-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default FarmOS;
