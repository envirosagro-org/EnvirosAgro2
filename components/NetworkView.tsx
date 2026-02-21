
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Globe, Server, Activity, ShieldCheck, Network, Zap, 
  Box, Loader2, Signal, Radio, Terminal, Database, 
  Sparkles, Bot, ShieldAlert, Waves, Binary, Lock, Layers,
  ChevronRight, ArrowUpRight, Target, Gauge, Cpu, Workflow,
  Stamp, Eye, Search, AlertTriangle, Atom, Share2, 
  Fingerprint, Circle, Key, Link2, MapPin, RadioReceiver,
  Settings, Wifi, RefreshCw, BadgeCheck, History,
  TrendingUp, CheckCircle2, ArrowRight,
  Monitor,
  Siren,
  LineChart,
  HeartPulse,
  Crown,
  Trophy,
  User as UserIcon,
  MessageSquare,
  Music,
  Map as MapIcon,
  ThermometerSun
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auditMeshStability, AIResponse } from '../services/geminiService';
import { SycamoreLogo } from '../App';

interface NodeShard {
  id: string;
  x: number;
  y: number;
  m: number;
  ca: number;
  status: 'ACTIVE' | 'AUDITING' | 'DRIFT';
  type: 'validator' | 'ingest' | 'storage';
}

interface RelayShard {
  id: string;
  location: string;
  latency: number;
  throughput: string;
  peers: number;
  load: number;
  status: 'ONLINE' | 'SYNCING';
}

interface MempoolTx {
  hash: string;
  from: string;
  value: string;
  timestamp: string;
  thrust: string;
}

interface PulseRipple {
  id: string;
  originX: number;
  originY: number;
  startTime: number;
}

const STEWARD_REGISTRY = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', x: 25, y: 30, res: 98 },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', x: 75, y: 25, res: 92 },
  { esin: 'EA-ROBO-9214', name: 'Dr. Orion Bot', role: 'Automation Engineer', x: 30, y: 75, res: 95 },
  { esin: 'EA-LILY-0042', name: 'Aesthetic Rose', role: 'Botanical Architect', x: 70, y: 70, res: 99 },
  { esin: 'EA-ROOT-NODE', name: 'Root Quorum', role: 'Central Authority', x: 50, y: 50, res: 100 },
];

const REGIONAL_ALPHA = [
  { id: 'NAI', name: 'Nairobi Hub', region: 'Africa', alpha: 1.82, x: 45, y: 55, color: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'TYO', name: 'Tokyo Node', region: 'Asia', alpha: 1.65, x: 85, y: 35, color: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.4)' },
  { id: 'VAL', name: 'Valencia Shard', region: 'Europe', alpha: 1.48, x: 48, y: 30, color: 'text-rose-400', glow: 'rgba(244, 63, 94, 0.4)' },
  { id: 'OMA', name: 'Omaha Hub', region: 'America', alpha: 1.52, x: 20, y: 35, color: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'SYD', name: 'Sydney Sync', region: 'Oceania', alpha: 1.24, x: 88, y: 80, color: 'text-indigo-400', glow: 'rgba(99, 102, 241, 0.4)' },
];

const NetworkView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'aura' | 'spectral' | 'topology' | 'mempool'>('map');
  const [nodes, setNodes] = useState<NodeShard[]>([]);
  const [relays, setRelays] = useState<RelayShard[]>([]);
  const [mempool, setMempool] = useState<MempoolTx[]>([]);
  const [consensusLevel, setConsensusLevel] = useState(99.98);
  const [latency, setLatency] = useState(14);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditVerdict, setAuditVerdict] = useState<AIResponse | null>(null);
  const [shardsInFlight, setShardsInFlight] = useState<{ id: string; from: string; to: string; progress: number }[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activePulses, setActivePulses] = useState<PulseRipple[]>([]);

  const [propLogs, setPropLogs] = useState<{time: string, msg: string, col: string}[]>([]);

  // Initialize nodes and static data
  useEffect(() => {
    const initialNodes: NodeShard[] = [
      { id: 'ROOT_NODE', x: 50, y: 50, m: 1.618, ca: 1.2, status: 'ACTIVE', type: 'validator' },
      { id: 'AFRI_NODE_04', x: 25, y: 30, m: 1.42, ca: 1.1, status: 'ACTIVE', type: 'ingest' },
      { id: 'EURO_SHARD_82', x: 75, y: 25, m: 1.55, ca: 1.3, status: 'ACTIVE', type: 'ingest' },
      { id: 'AMER_HUB_12', x: 30, y: 75, m: 1.38, ca: 0.9, status: 'AUDITING', type: 'storage' },
      { id: 'ASIA_SYNC_91', x: 70, y: 70, m: 1.48, ca: 1.15, status: 'ACTIVE', type: 'ingest' },
      { id: 'EDGE_P4_882', x: 50, y: 15, m: 1.24, ca: 0.8, status: 'ACTIVE', type: 'ingest' },
    ];

    const initialRelays: RelayShard[] = [
      { id: 'RELAY-01', location: 'Nairobi Ingest', latency: 8, throughput: '1.2 GB/s', peers: 124, load: 45, status: 'ONLINE' },
      { id: 'RELAY-02', location: 'Mombasa Port', latency: 12, throughput: '840 MB/s', peers: 82, load: 12, status: 'ONLINE' },
      { id: 'RELAY-03', location: 'Omaha Hub', latency: 42, throughput: '2.1 GB/s', peers: 310, load: 78, status: 'SYNCING' },
      { id: 'RELAY-04', location: 'Valencia Shard', latency: 14, throughput: '1.5 GB/s', peers: 156, load: 24, status: 'ONLINE' },
    ];

    setNodes(initialNodes);
    setRelays(initialRelays);
  }, []);

  // Simulation loop for network activity
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Shard Movement
      if (nodes.length > 0 && Math.random() > 0.4) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const toIdx = Math.floor(Math.random() * nodes.length);
        if (fromIdx !== toIdx) {
          const shardId = `SHD-${Math.random().toString(36).substring(7).toUpperCase()}`;
          const fromName = nodes[fromIdx].id;
          const toName = nodes[toIdx].id;
          
          setShardsInFlight(prev => [...prev, { 
            id: shardId, 
            from: fromName, 
            to: toName, 
            progress: 0 
          }]);

          setPropLogs(prev => [
            { time: new Date().toLocaleTimeString(), msg: `SHARD_PROPAGATION: ${fromName} -> ${toName}`, col: 'text-blue-400' },
            ...prev
          ].slice(0, 10));
        }
      }

      // 2. Mempool Ingest
      if (Math.random() > 0.7) {
        const newTx: MempoolTx = {
          hash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
          from: nodes[Math.floor(Math.random() * nodes.length)]?.id || 'EXT_NODE',
          value: (Math.random() * 500 + 10).toFixed(1) + ' EAC',
          timestamp: 'Just now',
          thrust: ['Societal', 'Environmental', 'Human', 'Technological', 'Industry'][Math.floor(Math.random() * 5)]
        };
        setMempool(prev => [newTx, ...prev].slice(0, 10));
      }

      // 3. Node Telemetry Drifts
      setNodes(prev => prev.map(n => ({
        ...n,
        m: Number((n.m + (Math.random() * 0.02 - 0.01)).toFixed(3)),
        status: Math.random() > 0.95 ? 'DRIFT' : n.status === 'DRIFT' ? 'ACTIVE' : n.status
      })));

      setLatency(12 + Math.floor(Math.random() * 6));
      setConsensusLevel(99.85 + Math.random() * 0.14);
    }, 2000);

    return () => clearInterval(interval);
  }, [nodes]);

  // Shard Animation Loop
  useEffect(() => {
    let frame: number;
    const loop = () => {
      setShardsInFlight(prev => prev.map(s => ({ ...s, progress: s.progress + 1.5 })).filter(s => s.progress < 100));
      setActivePulses(prev => prev.filter(p => Date.now() - p.startTime < 3000));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleRunMeshAudit = async () => {
    setIsAuditing(true);
    setAuditVerdict(null);
    try {
      const res = await auditMeshStability({
        total_nodes: nodes.length,
        avg_latency: latency,
        consensus: consensusLevel,
        mesh_resonance: nodes.reduce((acc, n) => acc + n.m, 0) / nodes.length
      });
      setAuditVerdict(res);
    } catch (e) {
      alert("Oracle Handshake Timeout.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleBroadcastPulse = (originX: number, originY: number) => {
    const newPulse: PulseRipple = {
      id: `PULSE-${Date.now()}`,
      originX,
      originY,
      startTime: Date.now()
    };
    setActivePulses(prev => [...prev, newPulse]);
    
    setPropLogs(prev => [
      { time: new Date().toLocaleTimeString(), msg: `RESONANCE_PULSE: Broad-spectrum harmony sync initiated.`, col: 'text-rose-400' },
      ...prev
    ].slice(0, 10));
  };

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  const throughputData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `T-${11-i}`,
      load: 40 + Math.random() * 40,
      latency: 10 + Math.random() * 10
    }));
  }, []);

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4 relative">
      
      {/* 1. Network Pulse HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'QUORUM_CONSENSUS', val: `${consensusLevel.toFixed(3)}%`, col: 'text-emerald-400', icon: ShieldCheck },
          { label: 'MESH_LATENCY', val: `${latency}ms`, col: 'text-blue-400', icon: Zap },
          { label: 'ACTIVE_SHARDS', val: (nodes.length * 242).toLocaleString(), col: 'text-indigo-400', icon: Database },
          { label: 'm-CONSTANT_BASE', val: '1.42x', col: 'text-amber-400', icon: Activity },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-6 group hover:border-white/10 transition-all shadow-3xl relative overflow-hidden h-[220px] flex flex-col justify-between">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><m.icon size={120} className={m.col} /></div>
             <div className="space-y-4 relative z-10">
                <p className={`text-[10px] ${m.col} font-black uppercase tracking-[0.5em]`}>{m.label}</p>
                <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{m.val}</h4>
             </div>
             <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-slate-700 uppercase">Registry v6.5</span>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                   <span className="text-[8px] font-mono text-slate-500 font-bold uppercase">Synced</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Primary Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex p-1.5 glass-card rounded-[32px] border border-white/10 bg-black/80 backdrop-blur-3xl shadow-3xl px-8 overflow-x-auto scrollbar-hide w-full lg:w-auto">
           {[
             { id: 'map', label: 'Industrial Map', icon: Globe },
             { id: 'aura', label: 'Aura Map', icon: HeartPulse },
             { id: 'spectral', label: 'Spectral Heatmap', icon: ThermometerSun },
             { id: 'topology', label: 'Topology Shards', icon: Network },
             { id: 'mempool', label: 'Inbound Mempool', icon: Terminal },
           ].map(tab => (
             <button 
               key={tab.id} 
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white'}`}
             >
               <tab.icon size={16} /> {tab.label}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-6">
            <button 
              onClick={handleRunMeshAudit}
              disabled={isAuditing}
              className="px-10 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
            >
               {isAuditing ? <Loader2 size={18} className="animate-spin" /> : <Bot size={18} />}
               STABILITY_AUDIT
            </button>
         </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: INDUSTRIAL MAP --- */}
        {activeTab === 'map' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700">
              <div className="lg:col-span-8 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[750px] shadow-3xl group/map">
                 <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_80%)]"></div>

                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                       <filter id="glow">
                          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                          <feMerge>
                             <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                          </feMerge>
                       </filter>
                    </defs>

                    {/* Shard Transitions */}
                    {shardsInFlight.map(shard => {
                      const fromNode = nodes.find(n => n.id === shard.from);
                      const toNode = nodes.find(n => n.id === shard.to);
                      if (!fromNode || !toNode) return null;
                      const currentX = fromNode.x + (toNode.x - fromNode.x) * (shard.progress / 100);
                      const currentY = fromNode.y + (toNode.y - fromNode.y) * (shard.progress / 100);
                      return (
                        <g key={shard.id} className="animate-in fade-in">
                           <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="rgba(99,102,241,0.1)" strokeWidth="0.2" strokeDasharray="1,1" />
                           <circle cx={currentX} cy={currentY} r="0.6" fill="#6366f1" filter="url(#glow)">
                              <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                           </circle>
                        </g>
                      );
                    })}

                    {/* Nodes */}
                    {nodes.map(node => (
                      <g key={node.id} onClick={() => setSelectedNodeId(node.id)} className="cursor-pointer group/node">
                         <circle cx={node.x} cy={node.y} r="1.8" className={`transition-all duration-700 ${
                           node.status === 'DRIFT' ? 'fill-rose-500 shadow-[0_0_20px_#f43f5e]' : 
                           node.status === 'AUDITING' ? 'fill-amber-500' : 
                           node.id === 'ROOT_NODE' ? 'fill-indigo-400' : 'fill-emerald-400'
                         }`} />
                         <circle cx={node.x} cy={node.y} r="4" className={`stroke-2 fill-transparent transition-all duration-1000 ${
                           node.status === 'DRIFT' ? 'stroke-rose-500/20' : 
                           node.id === 'ROOT_NODE' ? 'stroke-indigo-400/20' : 'stroke-emerald-500/20'
                         } group-hover/node:r-6 animate-pulse`} />
                         {node.status === 'DRIFT' && (
                            <circle cx={node.x} cy={node.y} r="8" className="stroke-rose-500/10 fill-rose-500/5 animate-ping" />
                         )}
                      </g>
                    ))}
                 </svg>

                 <div className="absolute top-12 left-12 space-y-6 z-20 hidden md:block">
                    <div className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/80 shadow-2xl backdrop-blur-3xl w-[320px] space-y-6">
                       <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-float">
                             <SycamoreLogo size={32} className="text-white" />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Consensus <span className="text-indigo-400">Core</span></h4>
                             <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY_FINALIZER_v6</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                             <span>Quorum Resilience</span>
                             <span className="text-emerald-400 font-mono">1.618α</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" style={{ width: '92%' }}></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pt-2">
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Peers</p>
                                <p className="text-xl font-mono font-black text-white">{nodes.length}</p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Load</p>
                                <p className="text-xl font-mono font-black text-blue-400">14%</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {selectedNode && (
                   <div className="absolute bottom-12 left-12 right-12 z-20 animate-in slide-in-from-bottom-8 duration-700">
                      <div className="p-10 glass-card rounded-[56px] border-2 border-white/10 bg-black/90 shadow-3xl flex flex-col md:flex-row items-center justify-between gap-12 group/detail">
                         <div className="flex items-center gap-10">
                            <div className={`w-20 h-20 rounded-[32px] bg-white/5 border-2 flex items-center justify-center transition-all ${
                              selectedNode.status === 'DRIFT' ? 'border-rose-500 text-rose-500' : 'border-emerald-500 text-emerald-400'
                            }`}>
                               <Server size={40} className="animate-pulse" />
                            </div>
                            <div className="text-left space-y-2">
                               <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{selectedNode.id}</h5>
                               <div className="flex items-center gap-6">
                                  <span className="px-4 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase text-slate-500 tracking-widest">{selectedNode.type} NODE</span>
                                  <p className="text-[10px] text-emerald-500 font-mono font-black uppercase flex items-center gap-2">
                                     <Activity size={14} /> m-Constant: {selectedNode.m}
                                  </p>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-8 items-center border-l border-white/5 pl-12 h-20 hidden lg:flex">
                            <div className="text-center">
                               <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Sustainability</p>
                               <p className="text-3xl font-mono font-black text-white">+{selectedNode.ca}<span className="text-sm italic font-sans text-indigo-700"> Ca</span></p>
                            </div>
                            <div className="text-center">
                               <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Node Status</p>
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${
                                 selectedNode.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'
                               }`}>{selectedNode.status}</span>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 hover:text-white transition-all shadow-xl active:scale-90"><Terminal size={32} /></button>
                            <button className="px-16 py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10">
                               MANAGE_NODE <ArrowUpRight size={24} />
                            </button>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="lg:col-span-4 flex flex-col gap-10">
                 <div className="glass-card p-10 md:p-12 rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 flex flex-col justify-between h-full shadow-3xl relative overflow-hidden group/oracle">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><Database size={400} className="text-indigo-400" /></div>
                    
                    <div className="relative z-10 space-y-10">
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover/oracle:rotate-12 transition-transform duration-700">
                             <Bot size={44} className="text-white animate-pulse" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Stability <span className="text-indigo-400">Oracle</span></h3>
                             <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ANALYZER_NODE_#882A</p>
                          </div>
                       </div>

                       {!auditVerdict && !isAuditing ? (
                          <div className="space-y-10 py-10">
                             <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-6 shadow-inner border-l-4 border-l-indigo-600">
                                <p className="text-slate-400 italic text-lg leading-relaxed font-medium">"Initiate a stability sweep to audit shard sequentiality and detect m-constant drift across the industrial quorum."</p>
                             </div>
                             <button 
                               onClick={handleRunMeshAudit}
                               className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5"
                             >
                                <Zap size={24} className="fill-current mr-4" /> RUN STABILITY AUDIT
                             </button>
                          </div>
                       ) : isAuditing ? (
                          <div className="flex flex-col items-center justify-center space-y-12 py-32 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <div className="w-32 h-32 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center"><Binary size={48} className="text-indigo-400 animate-pulse" /></div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">SEQUENCING TOPOLOGY...</p>
                                <p className="text-slate-700 font-mono text-xs uppercase tracking-widest">INGESTING_NODE_ENTROPY // CALC_QUORUM</p>
                             </div>
                          </div>
                       ) : (
                          <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                             <div className="p-10 md:p-14 bg-black/90 rounded-[64px] border border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 relative overflow-hidden group/advice text-left">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Sparkles size={600} className="text-indigo-400" /></div>
                                <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
                                   <BadgeCheck size={44} className="text-indigo-400" />
                                   <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">Audit Verdict</h4>
                                </div>
                                <div className="text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-10 border-l-2 border-white/5">
                                   {auditVerdict?.text}
                                </div>
                                <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                                   <div className="flex items-center gap-6">
                                      <Fingerprint size={48} className="text-indigo-400" />
                                      <div className="text-left">
                                         <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Shard Integrity Hash</p>
                                         <p className="text-xl font-mono text-white italic">0xHS_STABLE_SYNC_OK</p>
                                      </div>
                                   </div>
                                   <button onClick={() => setAuditVerdict(null)} className="px-14 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-white/5">ANCHOR AUDIT</button>
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="p-12 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col items-center justify-center text-center space-y-8 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]"><ShieldCheck size={400} className="text-emerald-400" /></div>
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl border-2 border-white/10 relative z-10">
                       <Stamp size={36} className="text-white" />
                    </div>
                    <div className="space-y-4 relative z-10">
                       <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Absolute <span className="text-emerald-400">Truth</span></h4>
                       <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-sm:text-sm max-w-sm mx-auto">"Eliminating unverified node drift. Every shard in the mesh is anchored in immutable biological logic."</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: AURA MAP (Steward Resonance) --- */}
        {activeTab === 'aura' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700">
              <div className="lg:col-span-8 glass-card rounded-[80px] border-2 border-rose-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[750px] shadow-3xl group/aura">
                 <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_#f43f5e_0%,_transparent_70%)] pointer-events-none"></div>
                 
                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                       <filter id="aura-glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                       </filter>
                    </defs>

                    {/* Resonance Connections */}
                    {STEWARD_REGISTRY.map((s1, i) => 
                       STEWARD_REGISTRY.slice(i+1).map((s2, j) => (
                          <g key={`${s1.esin}-${s2.esin}`}>
                             <line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="rgba(244, 63, 94, 0.05)" strokeWidth="0.3" />
                             <line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="rgba(244, 63, 94, 0.2)" strokeWidth="0.1" strokeDasharray="1,2">
                                <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
                             </line>
                          </g>
                       ))
                    )}

                    {/* Active Pulses */}
                    {activePulses.map(pulse => {
                       const elapsed = (Date.now() - pulse.startTime) / 1000;
                       const radius = elapsed * 40; // Expand over time
                       const opacity = 1 - (elapsed / 3);
                       return (
                          <circle 
                             key={pulse.id}
                             cx={pulse.originX} cy={pulse.originY}
                             r={radius}
                             fill="none"
                             stroke="#f43f5e"
                             strokeWidth="0.5"
                             opacity={opacity}
                          />
                       );
                    })}

                    {/* Steward Aura Nodes */}
                    {STEWARD_REGISTRY.map(steward => (
                       <g key={steward.esin} className="cursor-pointer group/steward" onClick={() => setSelectedNodeId(steward.esin)}>
                          <circle cx={steward.x} cy={steward.y} r="2.5" className="fill-rose-500/20 group-hover/steward:fill-rose-500/40 transition-all" filter="url(#aura-glow)" />
                          <circle cx={steward.x} cy={steward.y} r="0.8" className="fill-white" />
                          <circle cx={steward.x} cy={steward.y} r="5" className="stroke-rose-500/10 fill-transparent animate-pulse-slow" />
                       </g>
                    ))}
                 </svg>

                 <div className="absolute top-12 left-12 p-8 glass-card rounded-[40px] border border-rose-500/20 bg-black/80 backdrop-blur-3xl shadow-2xl w-[320px] space-y-6">
                    <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                       <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-3xl">
                          <HeartPulse size={32} className="animate-pulse" />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Aura <span className="text-rose-500">Resonance</span></h4>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">STEWARD_CONSTELLATION</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Collective Resonance</span>
                          <span className="text-rose-500 font-mono">1.84α</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full bg-rose-500 shadow-[0_0_15px_#f43f5e]" style={{ width: '84%' }}></div>
                       </div>
                    </div>
                 </div>

                 {selectedNodeId && STEWARD_REGISTRY.find(s => s.esin === selectedNodeId) && (
                    <div className="absolute bottom-12 left-12 right-12 z-20 animate-in slide-in-from-bottom-8 duration-700">
                       {(() => {
                          const s = STEWARD_REGISTRY.find(st => st.esin === selectedNodeId)!;
                          return (
                             <div className="p-10 glass-card rounded-[56px] border-2 border-rose-500/20 bg-black/90 shadow-3xl flex flex-col md:flex-row items-center justify-between gap-12 group/st-detail">
                                <div className="flex items-center gap-10">
                                   <div className={`w-20 h-20 rounded-[32px] bg-rose-600/10 border-2 border-rose-500 flex items-center justify-center text-rose-500 transition-transform ${activePulses.some(p => p.originX === s.x) ? 'scale-110' : ''}`}>
                                      <UserIcon size={40} />
                                   </div>
                                   <div className="text-left space-y-2">
                                      <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">{s.name}</h5>
                                      <div className="flex items-center gap-6">
                                         <span className="px-4 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black uppercase text-slate-500 tracking-widest">{s.role}</span>
                                         <p className="text-[10px] text-rose-400 font-mono font-black uppercase flex items-center gap-2">
                                            <HeartPulse size={14} /> Resonance: {s.res}%
                                         </p>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex gap-4">
                                   <button 
                                      onClick={() => handleBroadcastPulse(s.x, s.y)}
                                      className="px-12 py-8 bg-rose-600 hover:bg-rose-500 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all flex items-center gap-4 border-2 border-white/10 ring-8 ring-rose-500/5"
                                   >
                                      <Music size={24} /> HARMONY_PULSE
                                   </button>
                                   <button className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 hover:text-white transition-all shadow-xl active:scale-90"><MessageSquare size={32} /></button>
                                </div>
                             </div>
                          );
                       })()}
                    </div>
                 )}
              </div>

              <div className="lg:col-span-4 space-y-10">
                 <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-rose-950/5 space-y-10 shadow-3xl relative overflow-hidden group/auras">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-5">
                       <Crown size={24} className="text-rose-500" /> Resonance <span className="text-rose-500">Nodes</span>
                    </h4>
                    <div className="space-y-6">
                       {STEWARD_REGISTRY.sort((a,b) => b.res - a.res).map((st, i) => (
                          <div key={st.esin} className="flex items-center justify-between p-5 bg-black/40 rounded-3xl border border-white/5 hover:border-rose-500/30 transition-all group/node-item cursor-pointer" onClick={() => setSelectedNodeId(st.esin)}>
                             <div className="flex items-center gap-5">
                                <span className="text-xl font-mono font-black text-slate-800">0{i+1}</span>
                                <div>
                                   <p className="text-sm font-black text-white uppercase italic">{st.name}</p>
                                   <p className="text-[8px] text-slate-500 uppercase tracking-widest">{st.esin}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-lg font-mono font-black text-rose-500">{st.res}%</p>
                                <p className="text-[7px] text-slate-700 font-black uppercase">α-Sync</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-12 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-600/5 text-center space-y-8 shadow-3xl">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl border border-white/10">
                       <Share2 size={40} className="text-white" />
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Social Finality</h4>
                       <p className="text-slate-500 text-sm font-medium italic px-4 leading-relaxed">"The Aura Map visualizes the biological trust network that anchors the industrial registry."</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SPECTRAL HEATMAP (Alpha Density) --- */}
        {activeTab === 'spectral' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-700">
              <div className="lg:col-span-8 glass-card rounded-[80px] border-2 border-white/5 bg-[#020403] relative overflow-hidden flex items-center justify-center min-h-[750px] shadow-4xl group/spectral">
                 <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_70%)] pointer-events-none"></div>
                 
                 <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                       {REGIONAL_ALPHA.map(region => (
                          <radialGradient key={region.id} id={`grad-${region.id}`} cx="50%" cy="50%" r="50%">
                             <stop offset="0%" stopColor={region.glow.split('(')[0].replace('rgba', 'rgb').replace('0.4', '')} stopOpacity="0.8" />
                             <stop offset="100%" stopColor={region.glow.split('(')[0].replace('rgba', 'rgb').replace('0.4', '')} stopOpacity="0" />
                          </radialGradient>
                       ))}
                    </defs>

                    {/* Regional Heat Blobs */}
                    {REGIONAL_ALPHA.map(region => (
                       <g key={region.id}>
                          <circle 
                             cx={region.x} cy={region.y} 
                             r={region.alpha * 8} 
                             fill={`url(#grad-${region.id})`} 
                             className="animate-pulse-slow"
                          />
                          <circle cx={region.x} cy={region.y} r="0.5" fill="white" opacity="0.5" />
                       </g>
                    ))}
                 </svg>

                 <div className="absolute top-12 left-12 space-y-6 z-20">
                    <div className="p-8 glass-card rounded-[40px] border border-blue-500/20 bg-black/80 backdrop-blur-3xl shadow-2xl w-[320px] space-y-6">
                       <div className="flex items-center gap-5 border-b border-white/5 pb-6">
                          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-3xl">
                             <ThermometerSun size={32} className="animate-pulse" />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Alpha <span className="text-blue-400">Density</span></h4>
                             <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">SPECTRAL_INDEX_v6.5</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                             <span>Peak Global Alpha</span>
                             <span className="text-emerald-400 font-mono">1.82α (NAIROBI)</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className="h-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" style={{ width: '88%' }}></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20 pointer-events-none">
                    <div className="p-8 glass-card rounded-[40px] border border-white/10 bg-black/60 backdrop-blur-md">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Sensor Legend</p>
                       <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                             <span className="text-[8px] font-black text-white uppercase tracking-widest">High Resonance</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                             <span className="text-[8px] font-black text-white uppercase tracking-widest">Active Ingest</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-10">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-10 shadow-3xl relative overflow-hidden group/spectral-list">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-5">
                       <Globe2 size={24} className="text-blue-400" /> Regional <span className="text-blue-400">Yields</span>
                    </h4>
                    <div className="space-y-6">
                       {REGIONAL_ALPHA.sort((a,b) => b.alpha - a.alpha).map((reg, i) => (
                          <div key={reg.id} className="p-6 bg-black/40 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all group/reg-item">
                             <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                   <div className={`p-3 rounded-2xl bg-white/5 ${reg.color}`}>
                                      <MapPin size={16} />
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-white uppercase italic leading-none">{reg.name}</p>
                                      <p className="text-[8px] text-slate-700 font-bold uppercase mt-1.5">{reg.region}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-2xl font-mono font-black text-white leading-none">{reg.alpha}α</p>
                                   <p className="text-[7px] text-blue-500 font-black uppercase mt-1">Density Index</p>
                                </div>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden p-px">
                                <div className={`h-full bg-blue-500 transition-all duration-[3s]`} style={{ width: `${(reg.alpha/2)*100}%` }}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-12 glass-card rounded-[64px] border-amber-500/20 bg-amber-500/[0.03] text-center space-y-8 shadow-3xl">
                    <div className="w-20 h-20 bg-amber-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl border border-white/10">
                       <Zap size={40} className="text-white" />
                    </div>
                    <div className="space-y-3">
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Power Distribution</h4>
                       <p className="text-slate-500 text-sm font-medium italic px-4 leading-relaxed">"The Spectral Heatmap enables the Quorum to rebalance mesh energy toward low-density regions."</p>
                    </div>
                    <button className="w-full py-5 bg-amber-600/10 border border-amber-500/20 text-amber-500 hover:bg-amber-600 hover:text-white rounded-[32px] text-[10px] font-black uppercase tracking-widest transition-all">REBALANCE_ENERGY_SHARDS</button>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: TOPOLOGY SHARDS --- */}
        {activeTab === 'topology' && (
          <div className="animate-in slide-in-from-right-10 duration-700 space-y-12">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Interactive Propagation Terminal */}
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-2 border-white/5 bg-[#050706] shadow-3xl flex flex-col relative overflow-hidden h-[750px]">
                   <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none z-0">
                      <div className="w-full h-full border-2 border-dashed border-blue-500/5 rounded-[64px] animate-pulse"></div>
                   </div>
                   
                   <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8 relative z-10 px-6">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-blue-600 rounded-3xl shadow-xl flex items-center justify-center text-white border border-white/10 group-hover:rotate-12 transition-transform">
                            <Activity size={32} className="animate-pulse" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Propagation <span className="text-blue-400">Monitor</span></h3>
                            <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-3 italic leading-none">SHARD_P2P_ROUTING_v6.5</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="px-6 py-2 bg-black/60 border border-white/10 rounded-full">
                            <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">THROUGHPUT: 1.2 GB/s</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 px-6 font-mono text-[13px] bg-black/20 rounded-[40px] p-8 shadow-inner border border-white/5">
                      {propLogs.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                           <Loader2 size={120} className="text-slate-600 animate-spin" />
                           <p className="text-2xl font-black uppercase tracking-[0.5em] text-white italic">AWAITING_SHARD_ACTIVITY</p>
                        </div>
                      ) : (
                        propLogs.map((log, i) => (
                          <div key={i} className={`flex items-center gap-8 p-5 rounded-2xl border border-white/[0.02] transition-all hover:bg-white/[0.02] animate-in slide-in-from-right-2 ${i === 0 ? 'bg-blue-600/5 border-blue-500/20' : ''}`}>
                             <span className="text-slate-700 font-bold shrink-0">[{log.time}]</span>
                             <span className={`flex-1 font-bold tracking-tight italic ${log.col}`}>{log.msg}</span>
                             <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                                <span className="text-[9px] text-slate-800 font-black uppercase tracking-widest">ACK</span>
                             </div>
                          </div>
                        ))
                      )}
                   </div>

                   <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-3 gap-6 relative z-10 px-4">
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                         <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Avg Hop Time</p>
                         <p className="text-2xl font-mono font-black text-blue-400">1.2ms</p>
                      </div>
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                         <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Active Peers</p>
                         <p className="text-2xl font-mono font-black text-white">{relays.length + 12}</p>
                      </div>
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                         <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Drift Level</p>
                         <p className="text-2xl font-mono font-black text-emerald-400">Low</p>
                      </div>
                   </div>
                </div>

                {/* Right: Metrics & Load Analyzer */}
                <div className="lg:col-span-4 space-y-10">
                   <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-10 shadow-3xl relative overflow-hidden group/m">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/m:scale-110 transition-transform"><LineChart size={400} className="text-blue-400" /></div>
                      <div className="flex items-center gap-5 relative z-10">
                         <div className="p-4 bg-blue-600 rounded-2xl shadow-xl"><TrendingUp size={24} className="text-white" /></div>
                         <h4 className="text-xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Load <span className="text-blue-400">Analytics</span></h4>
                      </div>
                      
                      <div className="h-64 w-full relative z-10 px-2 bg-black/40 rounded-[32px] border border-white/5 p-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={throughputData}>
                               <defs>
                                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                               <XAxis dataKey="time" hide />
                               <YAxis hide />
                               <Area type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>

                      <div className="space-y-4 relative z-10 pt-4 px-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                            <span>Ingest Pressure</span>
                            <span className="text-blue-400 font-mono">62%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                            <div className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6] transition-all duration-1000" style={{ width: '62%' }}></div>
                         </div>
                      </div>
                   </div>

                   <div className="p-12 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/5 text-center space-y-8 shadow-3xl">
                      <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform">
                         <BadgeCheck size={40} className="text-white" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Topology Finality</h4>
                         <p className="text-slate-500 text-sm font-medium italic px-4 leading-relaxed">"The mesh ensures absolute informatic finality by sharding state data across independent relay clusters."</p>
                      </div>
                      <button className="w-full py-5 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">ANALYZE TOPOLOGY SHARDS</button>
                   </div>
                </div>

             </div>
          </div>
        )}

        {/* --- VIEW: INBOUND MEMPOOL --- */}
        {activeTab === 'mempool' && (
          <div className="animate-in slide-in-from-left-10 duration-700 space-y-12 max-w-6xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                <div className="space-y-2">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Unconfirmed <span className="text-amber-500">Mempool</span></h3>
                   <p className="text-slate-500 text-lg md:text-xl font-medium italic opacity-70">"Live ingest of transaction shards awaiting consensus quorum finality."</p>
                </div>
                <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[40px] text-center shadow-2xl min-w-[200px]">
                   <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">TX_PENDING</p>
                   <p className="text-6xl font-mono font-black text-white">{mempool.length}</p>
                </div>
             </div>

             <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12"><History size={600} /></div>
                <div className="grid grid-cols-12 p-10 border-b border-white/10 bg-white/[0.01] text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16 relative z-10">
                   <div className="col-span-5">Tx Hash Shard</div>
                   <div className="col-span-3">Origin Node</div>
                   <div className="col-span-2 text-center">Value</div>
                   <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y divide-white/5 bg-[#050706] relative z-10 min-h-[600px]">
                   {mempool.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center py-40 opacity-10 space-y-8">
                         <Loader2 size={120} className="animate-spin" />
                         <p className="text-3xl font-black uppercase tracking-[0.5em]">BUFFERING_STREAM...</p>
                      </div>
                   ) : (
                      mempool.map((tx, i) => (
                         <div key={tx.hash} className="grid grid-cols-12 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="col-span-5 flex items-center gap-8">
                               <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/20 text-amber-400 group-hover:scale-110 transition-all shadow-inner">
                                  <Binary size={24} />
                               </div>
                               <div>
                                  <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-amber-400 transition-colors m-0">{tx.hash}</p>
                                  <p className="text-[9px] text-slate-700 font-mono mt-2 uppercase font-black tracking-widest italic">{tx.thrust} Thrust</p>
                               </div>
                            </div>
                            <div className="col-span-3">
                               <span className="text-sm font-black text-slate-400 group-hover:text-white transition-colors">{tx.from}</span>
                            </div>
                            <div className="col-span-2 text-center">
                               <p className="text-2xl font-mono font-black text-white">{tx.value}</p>
                            </div>
                            <div className="col-span-2 flex justify-end pr-8 items-center gap-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"></div>
                                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">PENDING</span>
                               </div>
                               <button className="p-4 bg-white/5 rounded-2xl text-slate-800 hover:text-white transition-all"><ArrowUpRight size={18}/></button>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .shadow-4xl { box-shadow: 0 100px 250px -50px rgba(0, 0, 0, 0.98); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default NetworkView;
