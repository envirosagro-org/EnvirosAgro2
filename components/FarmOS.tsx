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

const DAEMONS = [
  { id: 'tokenz_d', name: 'Capital Appreciation', status: 'RUNNING', pid: 428, load: '2.4%', icon: Coins },
  { id: 'consensus_d', name: 'Validator Quorum', status: 'RUNNING', pid: 991, load: '14.2%', icon: ShieldPlus },
  { id: 'agromusika_player', name: 'Bio-Rhythm Pulse', status: 'RUNNING', pid: 882, load: '1.2%', icon: Radio },
  { id: 'oracle_pulse_d', name: 'External Data Sync', status: 'IDLE', pid: 104, load: '0.0%', icon: Globe },
];

const FarmOS: React.FC<FarmOSProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, initialCode, clearInitialCode }) => {
  const [activeTab, setActiveTab] = useState<'kernel' | 'assets' | 'blockchain' | 'scheduler' | 'shell'>('kernel');
  const [bootStatus, setBootStatus] = useState<'OFF' | 'POST' | 'ON'>('ON');
  const [bootProgress, setBootProgress] = useState(100);
  
  // Blockchain Metrics
  const [blockHeight, setBlockHeight] = useState(428812);
  const [netHashrate, setNetHashrate] = useState(124.5);
  
  // Shell States
  const [shellInput, setShellInput] = useState('');
  const [logs, setLogs] = useState<string[]>([
    "AGROBOTO_OS_v6.5 kernel loaded.",
    "Registry connection established (0x882A).",
    "Consensus Quorum: 99.98% Synchronized.",
    "Total Network Shards: 1,426M Verified.",
    "Mounting /dev/blockchain_ledger... OK",
    "Initializing SEHTI Scheduler..."
  ]);

  // Scheduler Metrics
  const [resourceLoad, setResourceLoad] = useState({
    S: 42, E: 65, H: 28, T: 84, I: 55
  });

  const [isExecutingLogic, setIsExecutingLogic] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setActiveTab('shell');
      addLog("External Shard received from IDE. System optimization mode primed.", 'info');
    }
  }, [initialCode]);

  useEffect(() => {
    if (bootStatus === 'ON') {
      const metricInterval = setInterval(() => {
        setBlockHeight(prev => prev + 1);
        setNetHashrate(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
        setResourceLoad(prev => ({
          S: Math.min(100, Math.max(10, prev.S + (Math.random() * 4 - 2))),
          E: Math.min(100, Math.max(10, prev.E + (Math.random() * 4 - 2))),
          H: Math.min(100, Math.max(10, prev.H + (Math.random() * 4 - 2))),
          T: Math.min(100, Math.max(10, prev.T + (Math.random() * 4 - 2))),
          I: Math.min(100, Math.max(10, prev.I + (Math.random() * 4 - 2))),
        }));
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
    addLog("PARSING AGROLANG SHARD FOR OS OPTIMIZATION...", 'info');
    
    const lines = code.split('\n').filter(l => l.trim() && !l.startsWith('//'));
    
    for (const line of lines) {
      await new Promise(r => setTimeout(r, 800));
      addLog(`Applying optimization: ${line.trim().substring(0, 50)}${line.length > 50 ? '...' : ''}`, 'info');
      
      if (line.includes('CONSTRAIN')) {
        addLog("Registry Constraint validated. Kernel parameter adjusted.", 'success');
        setResourceLoad(prev => ({ ...prev, S: Math.max(10, prev.S - 5) }));
      }
      if (line.includes('Bio.apply_freq')) {
        addLog("Sonic resonance hardware pulse dispatched. Calibrating bio-clock.", 'success');
        setResourceLoad(prev => ({ ...prev, E: Math.min(100, prev.E + 10) }));
      }
      if (line.includes('Bot.swarm_deploy')) {
        addLog("Robot cluster authorized for precision sharding. Mesh load increasing.", 'success');
        setResourceLoad(prev => ({ ...prev, T: Math.min(100, prev.T + 15) }));
      }
      if (line.includes('COMMIT_SHARD')) {
        addLog("Finality anchor committed to L3 ledger. Syncing global state.", 'success');
        setResourceLoad(prev => ({ ...prev, I: Math.min(100, prev.I + 5) }));
      }
    }

    await new Promise(r => setTimeout(r, 1000));
    addLog("OPERATING SYSTEM OPTIMIZATION FINALIZED. M-RESONANCE STABILIZED.", 'success');
    setIsExecutingLogic(false);
    if (clearInitialCode) clearInitialCode();
    onEarnEAC(100, 'OS_PARAMETER_OPTIMIZATION_SYNC');
  };

  const handleShellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shellInput.trim() || isExecutingLogic) return;
    const cmd = shellInput.toLowerCase().trim();
    setLogs(prev => [`admin@EnvirosAgro:~$ ${shellInput}`, ...prev]);
    
    if (cmd === 'agro-apply-logic' || cmd === 'run optimization') {
      if (initialCode) {
        executeOptimization(initialCode);
      } else {
        addLog("Error: No optimization shard buffered. Compile from AgroLang IDE first.", 'error');
      }
    } else if (cmd === 'sudo blockchain-sync') {
      addLog("Fetching latest block from cluster...", 'info');
      addLog(`Block height updated to ${blockHeight + 1}.`, 'success');
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'help') {
      addLog("Available commands: run optimization, sudo blockchain-sync, clear, help", 'info');
    } else {
      addLog(`Command unknown: ${cmd}`, 'error');
    }
    setShellInput('');
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [`[${type.toUpperCase()}] ${msg}`, ...prev]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. System HUD Header */}
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
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-inner italic">EOS_BLOCKCHAIN_MANAGER_v6.5</span>
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">ASSET_CONTROL_SYNCED</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Enviros<span className="text-indigo-400">Agro OS</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Comprehensive node orchestration. Treating soil, water, and tokenized equity as integrated blockchain resources."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic">BLOCKCHAIN_HEIGHT</p>
              {bootStatus === 'ON' ? (
                <>
                  <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">#{blockHeight.toLocaleString()}</h4>
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> QUORUM_STABLE
                  </p>
                </>
              ) : (
                <button onClick={handleBoot} disabled={bootStatus === 'POST'} className="w-full py-8 bg-indigo-800 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 border border-white/10 shadow-2xl">
                  {bootStatus === 'POST' ? <Loader2 className="animate-spin" /> : <Power />}
                  {bootStatus === 'POST' ? 'RE-SYNCING...' : 'INITIALIZE OS'}
                </button>
              )}
           </div>
           {bootStatus === 'POST' && (
             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${bootProgress}%` }}></div>
             </div>
           )}
        </div>
      </div>

      {/* 2. Management Shards Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'kernel', label: 'Kernel Stack', icon: Layers },
          { id: 'assets', label: 'Asset Ledger', icon: Database },
          { id: 'blockchain', label: 'Node Quorum', icon: Network },
          { id: 'scheduler', label: 'SEHTI Priority', icon: Gauge },
          { id: 'shell', label: 'Agro Shell', icon: Terminal },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: ASSET LEDGER --- */}
        {activeTab === 'assets' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700">
             <div className="flex justify-between items-end border-b border-white/5 pb-10 px-8">
                <div className="space-y-4">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Unified <span className="text-indigo-400">Asset Ledger</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic opacity-70">Managing the complete inventory of the EnvirosAgro mesh.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <h4 className="text-2xl font-black text-white uppercase italic px-6 flex items-center gap-4">
                      <HardDrive size={24} className="text-emerald-500" /> Physical Shards
                   </h4>
                   <div className="space-y-4">
                      {[
                        { name: 'Agroboto Swarm #04', type: 'Robotics', status: 'Patrolling', load: '64%', icon: Bot, col: 'text-emerald-400' },
                        { name: 'Zone 4 Moisture Array', type: 'Sensors', status: 'Online', load: '12%', icon: Wifi, col: 'text-emerald-400' },
                        { name: 'Plot LR-4459/Nairobi', type: 'Land Shard', status: 'Audited', load: '100%', icon: MapPin, col: 'text-emerald-400' },
                      ].map((asset, i) => (
                        <div key={i} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 flex items-center justify-between group hover:border-emerald-500/40 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                                 <asset.icon size={24} />
                              </div>
                              <div>
                                 <p className="text-lg font-black text-white uppercase italic leading-none">{asset.name}</p>
                                 <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">{asset.type} // {asset.status}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-mono font-black text-emerald-400">{asset.load}</p>
                              <p className="text-[8px] text-slate-700 font-black uppercase">Utilization</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-2xl font-black text-white uppercase italic px-6 flex items-center gap-4">
                      <Binary size={24} className="text-indigo-400" /> Virtual Shards
                   </h4>
                   <div className="space-y-4">
                      {[
                        { name: 'EAC Reward Treasury', type: 'Utility Token', status: 'Liquid', bal: '124,500', icon: Coins, col: 'text-indigo-400' },
                        { name: 'Maize Resilience DNA', type: 'Genomic Shard', status: 'Anchored', bal: '0x882A', icon: Dna, col: 'text-indigo-400' },
                        { name: 'Bantu Brand Equity', type: 'Equity Token', status: 'Staked', bal: '142.2 EAT', icon: Gem, col: 'text-indigo-400' },
                      ].map((asset, i) => (
                        <div key={i} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                                 <asset.icon size={24} />
                              </div>
                              <div>
                                 <p className="text-lg font-black text-white uppercase italic leading-none">{asset.name}</p>
                                 <p className="text-[9px] text-slate-500 font-bold uppercase mt-2">{asset.type} // {asset.status}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-mono font-black text-indigo-400">{asset.bal}</p>
                              <p className="text-[8px] text-slate-700 font-black uppercase">Ledger Value</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: BLOCKCHAIN QUORUM --- */}
        {activeTab === 'blockchain' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000">
              <div className="p-16 glass-card rounded-[80px] border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]">
                    <Globe size={1000} className="text-white" />
                 </div>
                 
                 <div className="relative shrink-0">
                    <div className="w-64 h-64 bg-indigo-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] ring-[24px] ring-white/5 animate-pulse relative">
                       <Network className="w-28 h-28 text-white" />
                       <div className="absolute inset-[-15px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                    </div>
                 </div>

                 <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner">ZK_CONSENSUS_READY</span>
                       <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">NODE <span className="text-indigo-400">QUORUM</span></h2>
                    </div>
                    <p className="text-slate-400 text-2xl leading-relaxed italic font-medium max-w-3xl">"Monitoring 428 global validator nodes. Proof of Sustainability consensus: ACHIEVED."</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                       {[
                          { l: 'Network Hashrate', v: `${netHashrate} TH/s`, i: Zap, c: 'text-amber-500' },
                          { l: 'Packet Latency', v: '12ms', i: Activity, c: 'text-blue-400' },
                          { l: 'Validator Staking', v: '12.4M EAT', i: Landmark, c: 'text-emerald-400' },
                          { l: 'Quorum Confidence', v: '99.98%', i: ShieldCheck, c: 'text-indigo-400' },
                       ].map((s, idx) => (
                          <div key={idx} className="p-6 bg-black/40 rounded-3xl border border-white/5 shadow-inner group hover:border-indigo-500/20 transition-all text-center">
                             <s.i size={20} className={`${s.c} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                             <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{s.l}</p>
                             <p className="text-xl font-mono font-black text-white">{s.v}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: KERNEL ARCHITECTURE --- */}
        {activeTab === 'kernel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-10 duration-700">
             <div className="lg:col-span-7 space-y-10">
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
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-12 rounded-[64px] border border-indigo-500/20 bg-indigo-950/10 shadow-3xl flex flex-col items-center text-center space-y-10 group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot size={400} className="text-indigo-400" /></div>
                   <div className="w-28 h-28 bg-indigo-600 rounded-[44px] flex items-center justify-center border-4 border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.4)] relative z-10 animate-float">
                      <Settings size={56} className="text-white" />
                   </div>
                   <div className="space-y-6 relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Kernel <span className="text-indigo-400">Settings</span></h4>
                      <p className="text-slate-400 text-xl font-medium italic px-8 opacity-70">Control low-level system calls for the network quorum and virtual asset registry.</p>
                   </div>
                   <div className="grid grid-cols-1 gap-4 w-full relative z-10 px-10">
                      {[
                        { label: 'Auto-Remediation', val: 'ON', col: 'text-emerald-400' },
                        { label: 'Consensus Frequency', val: '50ms', col: 'text-blue-400' },
                        { label: 'Asset Finality Depth', val: '64 BLK', col: 'text-indigo-400' },
                      ].map(s => (
                        <div key={s.label} className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex justify-between items-center shadow-inner group/item hover:border-white/20 transition-all">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                           <span className={`text-sm font-mono font-black ${s.col}`}>{s.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: SEHTI SCHEDULER --- */}
        {activeTab === 'scheduler' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-1000">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-8 gap-10">
                 <div className="space-y-4">
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">SEHTI <span className="text-indigo-400">Scheduler</span></h3>
                    <p className="text-slate-500 text-2xl font-medium italic opacity-70">Managing priority interrupts for the Five Thrusts across the Blockchain.</p>
                 </div>
              </div>

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
                       <div>
                          <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{m.name}</h5>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-3 italic">Pillar Priority</p>
                       </div>
                       <div className="w-full space-y-4">
                          <p className="text-5xl font-mono font-black text-white tracking-tighter">{m.val.toFixed(0)}%</p>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_currentColor]`} style={{ width: `${m.val}%`, backgroundColor: m.color }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: AGRO SHELL (TERMINAL) --- */}
        {activeTab === 'shell' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="glass-card rounded-[80px] border-2 border-white/10 bg-[#050706] flex flex-col h-[800px] relative overflow-hidden shadow-3xl group">
                 {/* Terminal Scanline */}
                 <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
                    <div className="w-full h-[2px] bg-emerald-500 absolute top-0 animate-scan"></div>
                 </div>

                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 rounded-[28px] bg-emerald-600 flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-all">
                          <Terminal size={36} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Agro <span className="text-emerald-400">Shell</span></h3>
                          <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-2">v6.5_BLOCKCHAIN_EDITION // SUDO_AUTH_ACTIVE</p>
                       </div>
                    </div>
                    {initialCode && (
                       <div className="flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
                          <div className="px-6 py-2 bg-indigo-600/20 border border-indigo-500/40 rounded-full flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                             <span className="text-[10px] font-mono text-indigo-400 font-black uppercase tracking-widest">LOGIC_SHARD_BUFFERED</span>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal relative z-10 font-mono text-[14px] text-emerald-400/90 leading-loose bg-black/60 shadow-inner flex flex-col-reverse">
                    <div className="space-y-3">
                       {logs.map((log, i) => (
                          <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300">
                             <span className="text-emerald-500/40 shrink-0 font-black">>>></span>
                             <span className={
                               log.includes('error') ? 'text-rose-500 font-black' : 
                               log.includes('success') ? 'text-blue-400 font-bold' : 
                               log.includes('SHARD') ? 'text-indigo-400 italic' : ''
                             }>{log}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 border-t border-white/5 bg-black/90 relative z-20">
                    {initialCode && !isExecutingLogic && (
                       <div className="mb-6 p-8 bg-indigo-600/10 border-2 border-indigo-500/30 rounded-[40px] animate-in slide-in-from-bottom-2 duration-700 flex items-center justify-between group/code-alert shadow-2xl">
                          <div className="flex items-center gap-8">
                             <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl group-hover/code-alert:rotate-12 transition-transform border border-white/10">
                                <Code2 className="text-white w-8 h-8" />
                             </div>
                             <div>
                                <p className="text-[11px] text-indigo-400 font-black uppercase tracking-widest leading-none mb-3">System Optimization Shard Ready</p>
                                <p className="text-base font-medium text-slate-300 italic max-w-xl">
                                   "Buffered logic detected from the AgroLang IDE. Execute to run a full Operating System optimization cycle."
                                </p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <button onClick={clearInitialCode} className="p-6 bg-white/5 hover:bg-rose-600/20 hover:text-rose-500 rounded-3xl text-slate-600 transition-all border border-transparent hover:border-rose-500/20 shadow-md">
                                <X size={24}/>
                             </button>
                             <button 
                               onClick={() => executeOptimization(initialCode)} 
                               className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-3xl active:scale-95 transition-all border border-white/10 ring-8 ring-indigo-500/5 animate-glow-indigo"
                             >
                               RUN SYSTEM OPTIMIZATION
                             </button>
                          </div>
                       </div>
                    )}

                    <form onSubmit={handleShellSubmit} className="max-w-5xl mx-auto relative group">
                       <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                          <span className="text-emerald-500 font-black text-lg">admin@EnvirosAgro:~$</span>
                       </div>
                       <input 
                         type="text" 
                         value={shellInput}
                         onChange={e => setShellInput(e.target.value)}
                         disabled={isExecutingLogic}
                         placeholder={initialCode ? "Type 'run optimization' to start..." : "Enter agricultural command..."}
                         className="w-full bg-white/5 border border-white/10 rounded-[40px] py-10 pl-64 pr-12 text-2xl text-white focus:outline-none focus:ring-8 focus:ring-emerald-500/10 transition-all placeholder:text-slate-800 italic shadow-inner font-mono disabled:opacity-30" 
                       />
                       <button 
                        type="submit"
                        disabled={isExecutingLogic || !shellInput.trim()}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-emerald-600 rounded-3xl text-white shadow-xl hover:bg-emerald-500 active:scale-90 transition-all border border-white/10 ring-[16px] ring-white/5 group-hover:scale-105 disabled:opacity-20"
                       >
                          {isExecutingLogic ? <Loader2 className="animate-spin" /> : <ArrowRight size={28} />}
                       </button>
                    </form>
                    <div className="mt-8 flex justify-between items-center px-12 opacity-40">
                       <div className="flex items-center gap-4">
                          <Fingerprint size={24} className="text-slate-500" />
                          <p className="text-[9px] font-mono uppercase font-black text-slate-700 tracking-widest">STWD_ID: {user.esin}</p>
                       </div>
                       <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">Proprietary Agro Shell v6.5 // blockchain SECURED</p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        @keyframes glow-indigo {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
        }
        .animate-glow-indigo { animation: glow-indigo 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default FarmOS;