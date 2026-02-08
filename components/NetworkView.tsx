
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, Server, Activity, ShieldCheck, Network, Zap, 
  Box, Loader2, Signal, Radio, Terminal, Database, 
  Sparkles, Bot, ShieldAlert, Waves, Binary, Lock, Layers,
  ChevronRight, ArrowUpRight, Target, Gauge, Cpu, Workflow,
  // Added Stamp to fix the "Cannot find name 'Stamp'" error on line 232
  Stamp
} from 'lucide-react';
import { auditMeshStability, AIResponse } from '../services/geminiService';

const NetworkView: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState(428);
  const [consensusLevel, setConsensusLevel] = useState(99.9);
  const [latency, setLatency] = useState(14);
  const [lastBlock, setLastBlock] = useState('0x882A_F42');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditVerdict, setAuditVerdict] = useState<AIResponse | null>(null);
  const [meshResonance, setMeshResonance] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
      setConsensusLevel(99.8 + (Math.random() * 0.2));
      setActiveNodes(prev => prev + (Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0));
      setMeshResonance(prev => Math.min(100, Math.max(60, prev + (Math.random() * 4 - 2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const regionalMetrics = [
    { region: 'East Africa Hub', nodes: 142, latency: '8ms', load: 45, status: 'STABLE', sidRisk: 'LOW' },
    { region: 'North America Cluster', nodes: 284, latency: '24ms', load: 62, status: 'HIGH_LOAD', sidRisk: 'MEDIUM' },
    { region: 'Europe Shard', nodes: 92, latency: '18ms', load: 38, status: 'STABLE', sidRisk: 'LOW' },
    { region: 'Asian Ingest Node', nodes: 56, latency: '42ms', load: 88, status: 'AUDITING', sidRisk: 'HIGH' },
  ];

  const handleRunMeshAudit = async () => {
    setIsAuditing(true);
    setAuditVerdict(null);
    try {
      const res = await auditMeshStability({
        total_nodes: activeNodes,
        avg_latency: latency,
        consensus: consensusLevel,
        regional_distribution: regionalMetrics
      });
      setAuditVerdict(res);
    } catch (e) {
      alert("Oracle link timeout.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto px-4">
      
      {/* 1. Global Topology HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Topology Map */}
        <div className="lg:col-span-8 glass-card rounded-[56px] border-indigo-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[700px] shadow-3xl group">
           {/* Kinetic Resonance Background */}
           <div className="absolute inset-0 z-0 overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
             <svg className="w-full h-full opacity-30" viewBox="0 0 1000 500">
                <defs>
                   <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                   </radialGradient>
                </defs>
                {/* Simulated Neural Connections */}
                {[...Array(25)].map((_, i) => (
                  <circle 
                    key={i} 
                    cx={Math.random() * 1000} 
                    cy={Math.random() * 500} 
                    r={Math.random() * 30} 
                    fill="url(#nodeGlow)"
                    className="animate-pulse" 
                    style={{ animationDelay: `${i * 0.5}s`, animationDuration: `${2 + Math.random() * 4}s` }}
                  />
                ))}
             </svg>
           </div>

           {/* Map Visualization Layer */}
           <div className="relative w-full h-full flex items-center justify-center p-12 opacity-80 group-hover:opacity-100 transition-opacity duration-1000 z-10">
             <svg viewBox="0 0 1000 500" className="w-full h-full fill-slate-800/20 stroke-white/5">
                <path d="M150,100 Q200,50 300,100 T500,150 T700,100 T900,150" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="10,5" className="animate-dash" />
                <path d="M200,400 Q400,300 600,400 T900,350" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="5,10" className="animate-dash-reverse" />
                
                {/* Node Clusters */}
                {[
                  { x: 220, y: 180, label: 'AMER_NORTH_C1', risk: 'LOW' },
                  { x: 580, y: 310, label: 'AFRI_EAST_H1', risk: 'LOW' },
                  { x: 490, y: 140, label: 'EURO_WEST_S2', risk: 'LOW' },
                  { x: 780, y: 220, label: 'ASIA_PAC_I4', risk: 'HIGH' },
                  { x: 320, y: 380, label: 'AMER_SOUTH_N1', risk: 'MEDIUM' },
                ].map((p, i) => (
                  <g key={i} className="group/node cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="6" className={p.risk === 'HIGH' ? 'fill-rose-500 shadow-[0_0_15px_#f43f5e]' : p.risk === 'MEDIUM' ? 'fill-amber-500 shadow-[0_0_15px_#f59e0b]' : 'fill-emerald-500 shadow-[0_0_15px_#10b981]'} />
                    <circle cx={p.x} cy={p.y} r="18" className={`${p.risk === 'HIGH' ? 'stroke-rose-500/30 fill-rose-500/5' : 'stroke-emerald-500/30 fill-emerald-500/5'} animate-ping`} style={{ animationDuration: '3s' }} />
                    <text x={p.x + 20} y={p.y + 5} className="fill-slate-500 text-[10px] font-mono font-black uppercase opacity-0 group-hover/node:opacity-100 transition-opacity tracking-widest bg-black/80 px-2">{p.label}</text>
                  </g>
                ))}
             </svg>
           </div>

           {/* High-Fidelity HUD Overlays */}
           <div className="absolute top-10 left-10 p-8 glass-card rounded-[40px] border border-indigo-500/20 bg-black/80 shadow-2xl backdrop-blur-2xl space-y-6 z-20 w-[280px]">
              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Globe className="text-white w-6 h-6 animate-spin-slow" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Global <span className="text-indigo-400">Mesh</span></h3>
                    <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest mt-1">Status: Operational</p>
                 </div>
              </div>
              
              <div className="space-y-4 pt-2">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500 tracking-widest">
                    <span>Mesh Resonance</span>
                    <span className="text-indigo-400 font-mono">{meshResonance.toFixed(1)}Ω</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${meshResonance}%` }}></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group/metric hover:border-indigo-500/30 transition-all">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Peers</p>
                    <p className="text-xl font-mono font-black text-white group-hover/metric:text-indigo-400">{activeNodes}</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group/metric hover:border-indigo-500/30 transition-all">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Latency</p>
                    <p className="text-xl font-mono font-black text-blue-400 group-hover/metric:text-blue-300">{latency}ms</p>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-20">
              <div className="p-6 md:p-8 bg-black/90 backdrop-blur-3xl rounded-[40px] border border-white/10 flex items-center gap-10 shadow-3xl">
                 <div className="p-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
                    <Box className="w-6 h-6 text-emerald-400 animate-pulse" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Latest Shard Finality</p>
                    <p className="text-xl font-mono font-black text-white uppercase tracking-widest leading-none">{lastBlock}</p>
                 </div>
                 <div className="h-10 w-px bg-white/10 hidden md:block" />
                 <div className="hidden lg:block space-y-1">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Auth Method</p>
                    <p className="text-xl font-mono font-black text-emerald-400 italic leading-none flex items-center gap-2">
                       <ShieldCheck size={16} /> ZK_PROVEN
                    </p>
                 </div>
              </div>
              <div className="px-6 py-3 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[32px] flex items-center gap-4 shadow-2xl backdrop-blur-md">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                 <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em]">QUORUM_SYNC_OK</span>
              </div>
           </div>
        </div>

        {/* Right Sidebar: Mesh Audit Engine */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="glass-card p-10 md:p-12 rounded-[56px] border border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-between min-h-[600px] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Network size={400} className="text-indigo-400" /></div>
              
              <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_#6366f166] border-2 border-white/10 group-hover:rotate-12 transition-transform">
                       <Bot size={36} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Stability <span className="text-indigo-400">Oracle</span></h3>
                       <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-3">MESH_TOPOLOGY_AUDITOR_v6</p>
                    </div>
                 </div>

                 {!auditVerdict && !isAuditing ? (
                    <div className="space-y-8">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                             <span>Consensus Maturity</span>
                             <span className="text-emerald-400 font-mono">{consensusLevel.toFixed(2)}%</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                             <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: `${consensusLevel}%` }}></div>
                          </div>
                          <p className="text-[12px] text-slate-400 italic text-center font-medium leading-relaxed px-4">
                            "A global stability sweep will audit all peer nodes for SID drift, m-constant finality, and regional quorum resonance."
                          </p>
                       </div>
                       <button 
                         onClick={handleRunMeshAudit}
                         className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-[12px] ring-indigo-500/5"
                       >
                          <Zap size={20} fill="white" /> RUN STABILITY AUDIT
                       </button>
                    </div>
                 ) : isAuditing ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 size={120} className="text-indigo-500 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center"><Binary size={40} className="text-indigo-400 animate-pulse" /></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">SEQUENCING TOPOLOGY...</p>
                          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">ANALYZING_NODE_ENTROPY // QUORUM_HANDSHAKE</p>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-10">
                       <div className="p-10 bg-black/90 rounded-[48px] border-l-[12px] border-l-indigo-600 border border-white/10 shadow-3xl relative overflow-hidden group/advice">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/advice:scale-110 transition-transform"><Database size={300} /></div>
                          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8 relative z-10">
                             <Target size={24} className="text-indigo-400" />
                             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Stability Shard Verdict</h4>
                          </div>
                          <div className="prose prose-invert max-w-none text-slate-300 text-lg md:text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-8 border-l border-white/5">
                             {auditVerdict.text}
                          </div>
                       </div>
                       <div className="flex justify-center gap-6 relative z-10">
                          <button onClick={() => setAuditVerdict(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl">Discard Shard</button>
                          <button className="px-14 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all active:scale-95 border-2 border-white/10 ring-8 ring-indigo-500/10">
                             <Stamp size={20} /> ANCHOR TO LEDGER
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dash { to { stroke-dashoffset: -100; } }
        .animate-dash { stroke-dasharray: 10; animation: dash 20s linear infinite; }
        .animate-dash-reverse { stroke-dasharray: 10; animation: dash 15s linear infinite reverse; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default NetworkView;
