
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, MapPin, Server, Activity, AlertCircle, Shield, Network, Zap, 
  ShieldCheck, Box, Loader2, Signal, Radio, Terminal, Database, 
  ArrowRightCircle, History, Sparkles, Bot, ShieldAlert, Users,
  Waves, Binary, Fingerprint, Lock, Layers, ChevronRight
} from 'lucide-react';
import { auditMeshStability, AIResponse } from '../services/geminiService';

const NetworkView: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState(428);
  const [consensusLevel, setConsensusLevel] = useState(99.9);
  const [latency, setLatency] = useState(14);
  const [lastBlock, setLastBlock] = useState('0x882A_F42');
  
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditVerdict, setAuditVerdict] = useState<AIResponse | null>(null);

  // Kinetic Mesh State
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto">
      
      {/* 1. Global Topology HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Topology Map */}
        <div className="lg:col-span-8 glass-card rounded-[56px] border-emerald-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[700px] shadow-3xl group">
           <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
           
           {/* Kinetic Resonance Background */}
           <div className="absolute inset-0 z-0">
             <svg className="w-full h-full opacity-20" viewBox="0 0 1000 500">
                {[...Array(20)].map((_, i) => (
                  <circle 
                    key={i} 
                    cx={Math.random() * 1000} 
                    cy={Math.random() * 500} 
                    r={Math.random() * 2} 
                    fill="#10b981" 
                    className="animate-pulse" 
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />
                ))}
                {/* Moving connection paths */}
                <path d="M200,150 L550,280 L750,200" stroke="#10b981" strokeWidth="0.5" fill="none" strokeDasharray="5,5" className="animate-dash" />
                <path d="M550,280 L480,120 L750,200" stroke="#3b82f6" strokeWidth="0.5" fill="none" strokeDasharray="8,8" className="animate-dash-reverse" />
             </svg>
           </div>

           {/* Map Visualization */}
           <div className="relative w-full h-full flex items-center justify-center p-12 opacity-80 group-hover:opacity-100 transition-opacity duration-1000 z-10">
             <svg viewBox="0 0 1000 500" className="w-full h-full fill-slate-800/30 stroke-white/5">
                <defs>
                   <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                   </linearGradient>
                </defs>
                <path d="M150,100 Q200,50 300,100 T500,150 T700,100 T900,150" fill="none" stroke="url(#linkGrad)" strokeWidth="1.5" strokeDasharray="10,5" className="animate-dash" />
                
                {/* Node Points */}
                {[
                  { x: 200, y: 150, label: 'NA_CORE', risk: 'LOW' },
                  { x: 550, y: 280, label: 'EA_HUB', risk: 'LOW' },
                  { x: 480, y: 120, label: 'EU_SHARD', risk: 'LOW' },
                  { x: 750, y: 200, label: 'AS_INGEST', risk: 'HIGH' },
                  { x: 300, y: 350, label: 'SA_NODE', risk: 'MEDIUM' },
                ].map((p, i) => (
                  <g key={i} className="group/node cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="5" className={p.risk === 'HIGH' ? 'fill-rose-500' : 'fill-emerald-500'} />
                    <circle cx={p.x} cy={p.y} r="15" className={`${p.risk === 'HIGH' ? 'stroke-rose-500/20 fill-rose-500/5' : 'stroke-emerald-500/20 fill-emerald-500/5'} animate-ping`} style={{ animationDuration: '3s' }} />
                    <text x={p.x + 15} y={p.y + 5} className="fill-slate-500 text-[9px] font-mono font-black uppercase opacity-0 group-hover/node:opacity-100 transition-opacity tracking-widest">{p.label}</text>
                  </g>
                ))}
             </svg>
           </div>

           {/* Floating Info Overlays */}
           <div className="absolute top-10 left-10 p-8 glass-card rounded-[40px] border border-emerald-500/20 bg-black/60 shadow-2xl backdrop-blur-2xl space-y-6 z-20">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Globe className="text-white w-6 h-6 animate-spin-slow" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Mesh <span className="text-emerald-400">Topology</span></h3>
                    <p className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-widest mt-1">RESONANCE: {meshResonance.toFixed(1)}Ω</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                 <div className="group/stat">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Active Peers</p>
                    <p className="text-2xl font-mono font-black text-white group-hover/stat:text-emerald-400 transition-colors">{activeNodes}</p>
                 </div>
                 <div className="group/stat">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Grid Ping</p>
                    <p className="text-2xl font-mono font-black text-blue-400 group-hover/stat:text-blue-300 transition-colors">{latency}ms</p>
                 </div>
              </div>
           </div>

           <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end z-20">
              <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 flex items-center gap-8 shadow-3xl">
                 <div className="p-4 bg-indigo-600/10 rounded-2xl">
                    <Box className="w-6 h-6 text-indigo-400 animate-pulse" />
                 </div>
                 <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Latest Shard Anchor</p>
                    <p className="text-xl font-mono font-black text-white uppercase tracking-widest leading-none mt-2">{lastBlock}</p>
                 </div>
                 <div className="h-12 w-px bg-white/10" />
                 <div className="hidden md:block">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Finality Confidence</p>
                    <p className="text-xl font-mono font-black text-emerald-400 italic leading-none mt-2">ZK_PROVEN</p>
                 </div>
              </div>
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] flex items-center gap-4 shadow-xl">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">SYNC_OK</span>
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
                       <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-3">L3_TOPOLOGY_AUDITOR_v6</p>
                    </div>
                 </div>

                 {!auditVerdict && !isAuditing ? (
                    <div className="space-y-8">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                             <span>Consensus Maturity</span>
                             <span className="text-emerald-400 font-mono">{consensusLevel.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" style={{ width: `${consensusLevel}%` }}></div>
                          </div>
                          <p className="text-[11px] text-slate-400 italic text-center font-medium leading-relaxed">
                            "Initializing a global stability sweep will audit all peer nodes for SID drift and m-constant finality."
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
                    <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 size={120} className="text-indigo-500 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center"><Binary size={40} className="text-indigo-400 animate-pulse" /></div>
                       </div>
                       <p className="text-indigo-400 font-black text-xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING TOPOLOGY...</p>
                    </div>
                 ) : (
                    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                       <div className="p-10 bg-black/80 rounded-[48px] border-l-8 border-l-indigo-600 border border-white/10 shadow-3xl">
                          <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line font-medium border-l border-white/5 pl-8">
                             {auditVerdict.text}
                          </div>
                       </div>
                       <button onClick={() => setAuditVerdict(null)} className="w-full py-4 text-slate-700 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">Discard Audit Shard</button>
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
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .animate-dash {
          stroke-dasharray: 10;
          animation: dash 20s linear infinite;
        }
        .animate-dash-reverse {
          stroke-dasharray: 10;
          animation: dash 15s linear infinite reverse;
        }
      `}</style>
    </div>
  );
};

export default NetworkView;
