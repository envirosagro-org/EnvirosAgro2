
import React, { useState, useEffect, useRef } from 'react';
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
  Mountain, RotateCcw, Sprout, Router, Trello, Server, Cog, 
  Orbit, Boxes as BoxesIcon, ShieldPlus, Radar, Signal,
  FolderTree, HardDrive, Cpu as CpuIcon, Shield, ChevronDown, Play, Square,
  Menu, List, FileCode, AlertCircle, Trash2, Download,
  Globe, Coins, Cookie, Users, Leaf, HeartPulse, ArrowRight,
  Code2, Link2, Share2, Gem, Landmark, ShieldX, ScanLine,
  MapPin, Dna,
  Fan
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, SignalShard } from '../types';

interface FarmOSProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: any) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
  initialCode?: string | null;
  clearInitialCode?: () => void;
}

const KERNEL_LAYERS = [
  { level: 'USER SPACE', agro: 'EnvirosAgro UI', status: 'ACTIVE', desc: 'Brand Design & Logic Studio', col: 'text-blue-400' },
  { level: 'SYSTEM CALLS', agro: 'agro_irrigate()', status: 'NOMINAL', desc: 'Software-to-Field Bridge', col: 'text-indigo-400' },
  { level: 'AGRO KERNEL', agro: 'THE AGRO CODE', status: 'PROTECTED', desc: 'Energy & Carbon Arbiter', col: 'text-emerald-400' },
  { level: 'BLOCKCHAIN', agro: 'L3 Industrial Ledger', status: 'SYNCED', desc: 'Consensus & Finality Layer', col: 'text-amber-400' },
  { level: 'HARDWARE', agro: 'Physical Assets', status: 'READY', desc: 'Soil, Water, Bots, Life', col: 'text-rose-400' },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onEmitSignal, initialCode, clearInitialCode }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'hardware' | 'scheduler' | 'shell'>('kernel');
  const [bootStatus, setBootStatus] = useState<'OFF' | 'POST' | 'ON'>('ON');
  const [bootProgress, setBootProgress] = useState(100);
  const [shellInput, setShellInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "AGROBOTO_OS_v6.5 kernel loaded.",
    "Registry connection established (0x882A).",
    "Consensus Quorum: 99.98% Synchronized.",
    "Initializing SEHTI Scheduler..."
  ]);

  const [resourceLoad, setResourceLoad] = useState({
    S: 42, E: 65, H: 28, T: 84, I: 55
  });

  const [hardwareHealth, setHardwareHealth] = useState({
    cpu: 45, disk: 12, net: 88, fan: 2100
  });

  const [isExecutingLogic, setIsExecutingLogic] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setActiveTab('shell');
      addLog("External Shard detected. Kernel handshake initialized.", 'info');
    }
  }, [initialCode]);

  useEffect(() => {
    if (bootStatus === 'ON') {
      const metricInterval = setInterval(() => {
        setHardwareHealth(prev => ({
          cpu: Math.min(100, Math.max(10, prev.cpu + (Math.random() * 10 - 5))),
          disk: Math.min(100, prev.disk + 0.01),
          net: Math.min(100, Math.max(10, prev.net + (Math.random() * 4 - 2))),
          fan: Math.floor(2100 + Math.random() * 200)
        }));
      }, 3000);
      return () => clearInterval(metricInterval);
    }
  }, [bootStatus]);

  const handleBoot = () => {
    setBootStatus('POST');
    setBootProgress(0);
    setLogs(["INITIALIZING AGRO-INIT SEQUENCE..."]);
    onEmitSignal({
      type: 'system',
      origin: 'ORACLE',
      title: 'KERNEL_BOOT_INITIALIZED',
      message: `Node ${user.esin} initializing Sycamore OS v6.5 boot sequence.`,
      priority: 'medium',
      actionIcon: 'Power'
    });

    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootStatus('ON');
          return 100;
        }
        if (prev === 20) setLogs(l => [...l, "Checking Soil Integrity... [OK]"]);
        if (prev === 50) setLogs(l => [...l, "Syncing Blockchain Shards... [OK]"]);
        if (prev === 80) setLogs(l => [...l, "Mounting Virtual Asset Registry... [OK]"]);
        return prev + 1;
      });
    }, 40);
  };

  const executeOptimization = async (code: string) => {
    setIsExecutingLogic(true);
    addLog("MOUNTING AGROLANG LOGIC SHARD...", 'info');
    
    onEmitSignal({
      type: 'task',
      origin: 'ORACLE',
      title: 'OS_LOGIC_EXECUTION',
      message: `Kernel executing industrial optimization shard for ${user.esin}.`,
      priority: 'high',
      actionIcon: 'Cpu'
    });

    const lines = code.split('\n').filter(l => l.trim() && !l.startsWith('//'));
    
    for (const line of lines) {
      await new Promise(r => setTimeout(r, 600));
      addLog(`Kernel Execution: ${line.trim().substring(0, 40)}...`, 'info');
      
      if (line.includes('CONSTRAIN')) {
        addLog("Resource boundary enforced.", 'success');
        setResourceLoad(prev => ({ ...prev, S: Math.max(10, prev.S - 5) }));
      }
      if (line.includes('Bio.apply_freq')) {
        addLog("Hardware resonance recalibrated.", 'success');
        setResourceLoad(prev => ({ ...prev, E: Math.min(100, prev.E + 8) }));
      }
      if (line.includes('Bot.swarm_deploy')) {
        addLog("Robot swarm signal transmitted.", 'success');
        setResourceLoad(prev => ({ ...prev, T: Math.min(100, prev.T + 12) }));
      }
      if (line.includes('Net.bridge_external')) {
        addLog("External Ingest Bridge Synchronized.", 'success');
        setResourceLoad(prev => ({ ...prev, I: Math.min(100, prev.I + 15) }));
      }
      if (line.includes('COMMIT_SHARD')) {
        addLog("Finality reached. Shard anchored.", 'success');
        setResourceLoad(prev => ({ ...prev, I: Math.min(100, prev.I + 4) }));
      }
    }

    await new Promise(r => setTimeout(r, 800));
    addLog("OS OPTIMIZATION FINALIZED.", 'success');
    
    onEmitSignal({
      type: 'ledger_anchor',
      origin: 'ORACLE',
      title: 'KERNEL_STATE_SYNC',
      message: `Optimization cycle successful. Regional m-constant boosted.`,
      priority: 'high',
      actionIcon: 'BadgeCheck',
      meta: { target: 'farm_os', ledgerContext: 'INVENTION' }
    });

    setIsExecutingLogic(false);
    if (clearInitialCode) clearInitialCode();
    onEarnEAC(100, 'OS_RESONANCE_TUNING');
  };

  const handleShellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim() || isExecutingLogic) return;
    const cmd = shellInput.toLowerCase().trim();
    setLogs(prev => [`admin@EnvirosAgro:~$ ${shellInput}`, ...prev]);
    
    if (cmd === 'agro-apply-logic' && initialCode) {
      executeOptimization(initialCode);
    } else if (cmd.startsWith('npx ')) {
      const pkg = shellInput.substring(4);
      setIsExecutingLogic(true);
      addLog(`Need to install the following packages: ${pkg}`, 'info');
      await new Promise(r => setTimeout(r, 1200));
      addLog(`Resolving remote shard registry for ${pkg}...`, 'info');
      await new Promise(r => setTimeout(r, 800));
      addLog(`Downloading package: ${pkg}@latest...`, 'info');
      await new Promise(r => setTimeout(r, 1500));
      addLog(`Validating ZK-Signature for ${pkg}... [OK]`, 'success');
      await new Promise(r => setTimeout(r, 600));
      addLog(`Execution initialized for shard ${pkg}.`, 'success');
      
      onEmitSignal({
        type: 'network',
        origin: 'ORACLE',
        title: 'REMOTE_SHARD_EXECUTION',
        message: `Remote package '${pkg}' executed via NPX bridge on Cloudflare node.`,
        priority: 'medium',
        actionIcon: 'Cloud'
      });
      
      setIsExecutingLogic(false);
    } else if (cmd === 'net-sync') {
      addLog("Probing all virtual ingest nodes...", 'info');
      await new Promise(r => setTimeout(r, 1000));
      addLog("Mesh synchronization agile. All packets aligned.", 'success');
    } else if (cmd === 'mesh-finality') {
      addLog("Executing global quorum check...", 'info');
      await new Promise(r => setTimeout(r, 1500));
      addLog("Finality reached at 0x882A. m-Constant updated.", 'success');
    } else if (cmd.startsWith('ingest-status')) {
      addLog("Status of Pipeline L1: ACTIVE", 'info');
      addLog("Status of Relay L2: NOMINAL", 'info');
      addLog("Status of Consensus L3: 100%", 'success');
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'help') {
      addLog("Syscalls: npx <shard>, net-sync, mesh-finality, ingest-status, agro-apply-logic, clear, help", 'info');
    } else {
      addLog(`Unknown syscall: ${cmd}`, 'error');
    }
    setShellInput('');
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [`[${type.toUpperCase()}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-indigo-500/20 bg-indigo-900/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Network size={600} className="text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-[48px] bg-indigo-600 shadow-[0_0_100px_rgba(79,70,229,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Binary size={80} className="text-white relative z-10 animate-pulse" />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-inner italic">EOS_KERNEL_v6.5</span>
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">MESH_STABLE</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Enviros<span className="text-indigo-400">Agro OS</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating the quintuplicate SEHTI pillars. Lean integration of external networks via the Kernel Shell and NPX Shard Bridge."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">QUORUM_SYNC</p>
              {bootStatus === 'ON' ? (
                <>
                  <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">100%</h4>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> FINALIZED
                  </p>
                </>
              ) : (
                <button onClick={handleBoot} className="w-full py-8 bg-indigo-800 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95">BOOT KERNEL</button>
              )}
           </div>
        </div>
      </div>

      {/* Primary Management Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'kernel', label: 'Kernel Layers', icon: Layers },
          { id: 'hardware', label: 'Resource Monitor', icon: CpuIcon },
          { id: 'scheduler', label: 'Thrust Load', icon: Gauge },
          { id: 'shell', label: 'System Shell', icon: Terminal },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        {/* VIEW: KERNEL LAYERS */}
        {activeTab === 'kernel' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
             <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
                <div className="flex items-center gap-6 px-10 mb-6">
                   <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 shadow-xl">
                      <Layers className="w-8 h-8 text-indigo-400" />
                   </div>
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Architecture <span className="text-indigo-400">Stack</span></h3>
                </div>
                <div className="space-y-4">
                   {KERNEL_LAYERS.map((layer, i) => (
                      <div key={i} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex items-center justify-between shadow-3xl border-l-[12px] border-l-indigo-600">
                         <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
                         <div className="flex items-center gap-8 relative z-10">
                            <span className="text-6xl font-black text-slate-800 font-mono italic group-hover:text-indigo-950 transition-colors">0{5-i}</span>
                            <div>
                               <h4 className={`text-3xl font-black uppercase italic m-0 tracking-tighter ${layer.col}`}>{layer.level}</h4>
                               <p className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest leading-none italic">{layer.agro}</p>
                            </div>
                         </div>
                         <div className="text-center max-w-xs hidden xl:block">
                            <p className="text-slate-500 text-base italic font-medium leading-relaxed">"{layer.desc}"</p>
                         </div>
                         <div className="flex items-center gap-4 relative z-10">
                            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{layer.status}</span>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* VIEW: HARDWARE MONITOR */}
        {activeTab === 'hardware' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                    { l: 'CPU_RESONANCE', v: hardwareHealth.cpu, i: CpuIcon, c: 'text-blue-400', u: '%' },
                    { l: 'SHARD_STORAGE', v: hardwareHealth.disk, i: HardDrive, c: 'text-emerald-400', u: '%' },
                    { l: 'MESH_NETWORK', v: hardwareHealth.net, i: Radio, c: 'text-indigo-400', u: 'Mb/s' },
                    { l: 'FAN_VELOCITY', v: hardwareHealth.fan, i: Fan, c: 'text-rose-400', u: 'RPM' },
                 ].map((stat, i) => (
                    <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-6 shadow-xl group hover:border-white/20 transition-all overflow-hidden relative h-[300px] flex flex-col justify-between">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[12s]"><stat.i size={120} /></div>
                       <div className="flex justify-between items-center relative z-10 px-2">
                          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${stat.c}`}>{stat.l}</p>
                          <stat.i size={20} className={stat.c} />
                       </div>
                       <div className="relative z-10">
                          <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none italic">{stat.v.toFixed(0)}<span className="text-xl opacity-30 ml-1 uppercase">{stat.u}</span></h4>
                          <div className="mt-8 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                             <div className={`h-full rounded-full transition-all duration-[3s] ${stat.c.replace('text', 'bg')} shadow-[0_0_15px_currentColor]`} style={{ width: `${Math.min(100, stat.v % 100)}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-12 rounded-[72px] border border-white/5 bg-black/60 shadow-3xl flex flex-col items-center justify-center space-y-12 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
                 <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-float group-hover:rotate-12 transition-transform">
                    <History size={40} className="text-white" />
                 </div>
                 <div className="space-y-4 text-center">
                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">Hardware <span className="text-indigo-400">Finality</span></h4>
                    <p className="text-slate-500 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">"Observing physical node stability to prevent biological packet loss during industrial ingest."</p>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: THRUST LOAD */}
        {activeTab === 'scheduler' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-6">
                 {[
                    { id: 'S', name: 'Societal', color: '#f43f5e', val: resourceLoad.S, i: Users },
                    { id: 'E', name: 'Enviro', color: '#10b981', val: resourceLoad.E, i: Leaf },
                    { id: 'H', name: 'Human', color: '#14b8a6', val: resourceLoad.H, i: HeartPulse },
                    { id: 'T', name: 'Tech', color: '#3b82f6', val: resourceLoad.T, i: CpuIcon },
                    { id: 'I', name: 'Info', color: '#818cf8', val: resourceLoad.I, i: Radio },
                 ].map(m => (
                    <div key={m.id} className="glass-card p-12 rounded-[56px] border-2 border-white/5 flex flex-col items-center text-center space-y-10 shadow-3xl hover:scale-105 transition-all group overflow-hidden bg-black/40 h-[480px] justify-between">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><m.i size={200} style={{ color: m.color }} /></div>
                       <div className="w-24 h-24 rounded-[40px] flex items-center justify-center shadow-3xl relative overflow-hidden group-hover:rotate-6 transition-all border-4 border-white/10" style={{ backgroundColor: `${m.color}10` }}>
                          <m.i size={40} style={{ color: m.color }} />
                          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                       </div>
                       <h5 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-xl">{m.name}</h5>
                       <div className="w-full space-y-6">
                          <p className="text-7xl font-mono font-black text-white tracking-tighter italic">{m.val.toFixed(0)}%</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className={`h-full rounded-full transition-all duration-[3s]`} style={{ width: `${m.val}%`, backgroundColor: m.color, boxShadow: `0 0 25px ${m.color}` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* VIEW: SYSTEM SHELL */}
        {activeTab === 'shell' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-card rounded-[80px] border-2 border-white/10 bg-[#050706] flex flex-col h-[800px] relative overflow-hidden shadow-3xl group">
                 <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none z-0">
                    <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan opacity-20"></div>
                 </div>

                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20 px-14">
                    <div className="flex items-center gap-10">
                       <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl border-4 border-white/10 relative overflow-hidden group/ico">
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          <Terminal size={44} className="relative z-10 group-hover/ico:scale-110 transition-transform" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Kernel <span className="text-emerald-400">Shell</span></h3>
                          <p className="text-emerald-400/60 font-mono text-[11px] uppercase tracking-[0.6em] mt-3 italic">SYSTEM_ADMIN_ACCESS_OK</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="px-6 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest animate-pulse">
                          TERMINAL_STABLE
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 p-14 overflow-y-auto custom-scrollbar-terminal relative z-10 font-mono text-lg text-emerald-400/90 leading-loose bg-black/60 shadow-inner flex flex-col-reverse italic">
                    <div className="space-y-4">
                       {logs.map((log, i) => (
                          <div key={i} className="flex gap-8 animate-in slide-in-from-left-2 duration-300 group/log">
                             <span className="text-emerald-500/20 shrink-0 font-black tracking-tighter">{" >>>"}</span>
                             <span className={`transition-all ${
                                log.includes('success') ? 'text-blue-400 font-black' : 
                                log.includes('error') ? 'text-rose-500 font-black' : 
                                log.includes('INFO') ? 'text-indigo-400 font-bold' : ''
                             }`}>{log}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-12 border-t border-white/5 bg-black/95 relative z-20">
                    {initialCode && !isExecutingLogic && (
                       <div className="mb-10 p-10 bg-indigo-600/10 border-2 border-indigo-500/40 rounded-[56px] flex items-center justify-between shadow-3xl animate-in zoom-in">
                          <div className="flex items-center gap-10">
                             <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl"><Code2 size={32} /></div>
                             <div className="space-y-2">
                                <p className="text-xl font-bold text-white uppercase italic">Logic Shard Buffered</p>
                                <p className="text-slate-500 text-sm italic font-medium">"External optimization script detected. Ready for kernel ingest."</p>
                             </div>
                          </div>
                          <div className="flex gap-6">
                             <button onClick={clearInitialCode} className="p-5 text-slate-600 hover:text-rose-400 transition-colors bg-white/5 rounded-2xl border border-white/5 shadow-lg"><X size={24} /></button>
                             <button 
                               onClick={() => executeOptimization(initialCode)} 
                               className="px-14 py-6 bg-indigo-600 text-white font-black rounded-[32px] text-[13px] uppercase tracking-[0.4em] shadow-[0_0_50px_#6366f166] hover:bg-indigo-500 transition-all active:scale-95 border-2 border-white/10 ring-8 ring-indigo-500/5"
                             >
                                RUN_OPTIMIZE
                             </button>
                          </div>
                       </div>
                    )}
                    <form onSubmit={handleShellSubmit} className="max-w-6xl mx-auto relative group">
                       <div className="absolute left-10 top-1/2 -translate-y-1/2 text-emerald-500/40 font-mono font-black text-xl">$</div>
                       <input 
                         type="text" 
                         value={shellInput}
                         onChange={e => setShellInput(e.target.value)}
                         disabled={isExecutingLogic}
                         placeholder="Enter syscall (e.g. 'npx <shard>', 'net-sync')..."
                         className="w-full bg-black border-2 border-white/10 rounded-[48px] py-10 pl-16 pr-32 text-2xl text-white outline-none font-mono focus:ring-8 focus:ring-emerald-500/10 transition-all shadow-inner placeholder:text-emerald-950 italic" 
                       />
                       <button 
                         type="submit" 
                         className="absolute right-8 top-1/2 -translate-y-1/2 p-7 bg-emerald-600 rounded-[32px] text-white shadow-3xl active:scale-90 transition-all hover:bg-emerald-50 ring-4 ring-emerald-500/10 group-hover:scale-105"
                       >
                          <ArrowRight size={32} />
                       </button>
                    </form>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default FarmOS;
