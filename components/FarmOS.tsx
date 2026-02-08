
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
  MapPin, Dna
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '../types';

interface FarmOSProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: any) => void;
  initialCode?: string | null;
  clearInitialCode?: () => void;
}

const KERNEL_LAYERS = [
  { level: 'USER SPACE', agro: 'EnvirosAgro UI', status: 'ACTIVE', desc: 'Brand Design & Logic Studio' },
  { level: 'SYSTEM CALLS', agro: 'agro_irrigate()', status: 'NOMINAL', desc: 'Software-to-Field Bridge' },
  { level: 'AGRO KERNEL', agro: 'THE AGRO CODE', status: 'PROTECTED', desc: 'Energy & Carbon Arbiter' },
  { level: 'BLOCKCHAIN', agro: 'L3 Industrial Ledger', status: 'SYNCED', desc: 'Consensus & Finality Layer' },
  { level: 'HARDWARE', agro: 'Physical Assets', status: 'READY', desc: 'Soil, Water, Bots, Life' },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, initialCode, clearInitialCode }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'assets' | 'blockchain' | 'scheduler' | 'shell'>('kernel');
  const [bootStatus, setBootStatus] = useState<'OFF' | 'POST' | 'ON'>('ON');
  const [bootProgress, setBootProgress] = useState(100);
  
  const [blockHeight, setBlockHeight] = useState(428812);
  const [netHashrate, setNetHashrate] = useState(124.5);
  
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
        setBlockHeight(prev => prev + 1);
        setNetHashrate(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
      }, 5000);
      return () => clearInterval(metricInterval);
    }
  }, [bootStatus]);

  const handleBoot = () => {
    setBootStatus('POST');
    setBootProgress(0);
    setLogs(["INITIALIZING AGRO-INIT SEQUENCE..."]);
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
      if (line.includes('COMMIT_SHARD')) {
        addLog("Finality reached. Shard anchored.", 'success');
        setResourceLoad(prev => ({ ...prev, I: Math.min(100, prev.I + 4) }));
      }
    }

    await new Promise(r => setTimeout(r, 800));
    addLog("OS OPTIMIZATION FINALIZED.", 'success');
    setIsExecutingLogic(false);
    if (clearInitialCode) clearInitialCode();
    onEarnEAC(100, 'OS_RESONANCE_TUNING');
  };

  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim() || isExecutingLogic) return;
    const cmd = shellInput.toLowerCase().trim();
    setLogs(prev => [`admin@EnvirosAgro:~$ ${shellInput}`, ...prev]);
    
    if (cmd === 'agro-apply-logic' && initialCode) {
      executeOptimization(initialCode);
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'help') {
      addLog("Commands: agro-apply-logic, clear, help, sudo blockchain-sync", 'info');
    } else {
      addLog(`Unknown syscall: ${cmd}`, 'error');
    }
    setShellInput('');
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [`[${type.toUpperCase()}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
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
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-inner italic">EOS_KERNEL_MONITOR</span>
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">MESH_STABLE</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Enviros<span className="text-indigo-400">Agro OS</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating the quintuplicate SEHTI pillars. Absolute node orchestration at the binary level."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">QUORUM_SYNC</p>
              {bootStatus === 'ON' ? (
                <>
                  <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">100%</h4>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> FINALIZED
                  </p>
                </>
              ) : (
                <button onClick={handleBoot} className="w-full py-8 bg-indigo-800 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95">BOOT KERNEL</button>
              )}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'kernel', label: 'Kernel Layers', icon: Layers },
          { id: 'scheduler', label: 'Thrust Load', icon: Gauge },
          { id: 'shell', label: 'System Shell', icon: Terminal },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] relative z-10">
        {activeTab === 'kernel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-10 duration-700">
             <div className="lg:col-span-12 space-y-10">
                <div className="flex items-center gap-6 px-4">
                   <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20"><Layers className="w-8 h-8 text-indigo-400" /></div>
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Architecture <span className="text-indigo-400">Stack</span></h3>
                </div>
                <div className="space-y-4">
                   {KERNEL_LAYERS.map((layer, i) => (
                      <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group relative overflow-hidden flex items-center justify-between shadow-2xl border-l-[12px] border-l-indigo-600">
                         <div className="flex items-center gap-8 relative z-10">
                            <span className="text-5xl font-black text-slate-800 font-mono italic">0{5-i}</span>
                            <div>
                               <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-widest">{layer.level}</h4>
                               <p className="text-slate-500 font-bold uppercase text-[10px] mt-2 tracking-widest">{layer.agro}</p>
                            </div>
                         </div>
                         <div className="text-right max-w-xs hidden md:block">
                            <p className="text-slate-400 text-sm italic">"{layer.desc}"</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{layer.status}</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'scheduler' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-6">
                 {[
                    { id: 'S', name: 'Societal', color: '#f43f5e', val: resourceLoad.S, i: Users },
                    { id: 'E', name: 'Enviro', color: '#10b981', val: resourceLoad.E, i: Leaf },
                    { id: 'H', name: 'Health', color: '#14b8a6', val: resourceLoad.H, i: HeartPulse },
                    { id: 'T', name: 'Tech', color: '#3b82f6', val: resourceLoad.T, i: Cpu },
                    { id: 'I', name: 'Info', color: '#818cf8', val: resourceLoad.I, i: Radio },
                 ].map(m => (
                    <div key={m.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 flex flex-col items-center text-center space-y-8 shadow-3xl hover:scale-105 transition-all group overflow-hidden bg-black/40">
                       <div className="w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:rotate-6 transition-all" style={{ backgroundColor: `${m.color}10`, border: `2px solid ${m.color}30` }}>
                          <m.i size={32} style={{ color: m.color }} />
                          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                       </div>
                       <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{m.name}</h5>
                       <div className="w-full space-y-4">
                          <p className="text-5xl font-mono font-black text-white tracking-tighter">{m.val.toFixed(0)}%</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className={`h-full rounded-full transition-all duration-1000`} style={{ width: `${m.val}%`, backgroundColor: m.color, boxShadow: `0 0 15px ${m.color}` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'shell' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-card rounded-[80px] border-2 border-white/10 bg-[#050706] flex flex-col h-[800px] relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 rounded-[28px] bg-emerald-600 flex items-center justify-center text-white shadow-xl">
                          <Terminal size={36} />
                       </div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">System <span className="text-emerald-400">Shell</span></h3>
                    </div>
                 </div>

                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal relative z-10 font-mono text-[14px] text-emerald-400/90 leading-loose bg-black/60 shadow-inner flex flex-col-reverse">
                    <div className="space-y-3">
                       {logs.map((log, i) => (
                          <div key={i} className="flex gap-4">
                             <span className="text-emerald-500/40 shrink-0 font-black">{" >>>"}</span>
                             <span className={log.includes('success') ? 'text-blue-400 font-bold' : log.includes('error') ? 'text-rose-500' : ''}>{log}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 border-t border-white/5 bg-black/90 relative z-20">
                    {initialCode && !isExecutingLogic && (
                       <div className="mb-6 p-8 bg-indigo-600/10 border-2 border-indigo-500/30 rounded-[40px] flex items-center justify-between shadow-2xl">
                          <div className="flex items-center gap-8">
                             <Code2 className="text-indigo-400 w-12 h-12" />
                             <p className="text-base font-medium text-slate-300 italic">"Buffered logic detected. Execute to run optimization cycle."</p>
                          </div>
                          <div className="flex gap-4">
                             <button onClick={clearInitialCode} className="p-4 text-slate-600"><X /></button>
                             <button onClick={() => executeOptimization(initialCode)} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl">RUN_OPTIMIZE</button>
                          </div>
                       </div>
                    )}
                    <form onSubmit={handleShellSubmit} className="max-w-5xl mx-auto relative">
                       <input 
                         type="text" 
                         value={shellInput}
                         onChange={e => setShellInput(e.target.value)}
                         disabled={isExecutingLogic}
                         placeholder="Enter industrial command..."
                         className="w-full bg-white/5 border border-white/10 rounded-[40px] py-10 pl-12 pr-12 text-2xl text-white outline-none font-mono" 
                       />
                       <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-emerald-600 rounded-3xl text-white"><ArrowRight /></button>
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
      `}</style>
    </div>
  );
};

export default FarmOS;
