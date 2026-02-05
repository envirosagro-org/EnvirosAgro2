import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Server, Activity, AlertCircle, Shield, Network, Zap, ShieldCheck, Box, Loader2, Signal, Radio, Terminal, Database, ArrowRightCircle, History } from 'lucide-react';

const NetworkView: React.FC = () => {
  const [activeNodes, setActiveNodes] = useState(428);
  const [consensusLevel, setConsensusLevel] = useState(99.9);
  const [latency, setLatency] = useState(14);
  const [lastBlock, setLastBlock] = useState('0x882A_F42');
  
  // Real-time animation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
      setConsensusLevel(99.8 + (Math.random() * 0.2));
      setActiveNodes(prev => prev + (Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const regionalMetrics = [
    { region: 'East Africa Hub', nodes: 142, latency: '8ms', load: 45, status: 'STABLE' },
    { region: 'North America Cluster', nodes: 284, latency: '24ms', load: 62, status: 'HIGH_LOAD' },
    { region: 'Europe Shard', nodes: 92, latency: '18ms', load: 38, status: 'STABLE' },
    { region: 'Asian Ingest Node', nodes: 56, latency: '42ms', load: 88, status: 'AUDITING' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto">
      
      {/* 1. Global Topology HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Topology Map */}
        <div className="lg:col-span-8 glass-card rounded-[56px] border-emerald-500/20 bg-[#050706] relative overflow-hidden flex items-center justify-center min-h-[600px] shadow-3xl group">
           <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
           
           {/* Stylized World Map SVG */}
           <div className="relative w-full h-full flex items-center justify-center p-12 opacity-60 group-hover:opacity-100 transition-opacity duration-1000">
             <svg viewBox="0 0 1000 500" className="w-full h-full fill-slate-800/30 stroke-white/5">
                <path d="M150,100 Q200,50 300,100 T500,150 T700,100 T900,150" fill="none" strokeWidth="1" strokeDasharray="5,5" />
                {/* Node Points */}
                {[
                  { x: 200, y: 150, label: 'NA_CORE' },
                  { x: 550, y: 280, label: 'EA_HUB' },
                  { x: 480, y: 120, label: 'EU_SHARD' },
                  { x: 750, y: 200, label: 'AS_INGEST' },
                  { x: 300, y: 350, label: 'SA_NODE' },
                ].map((p, i) => (
                  <g key={i} className="group/node cursor-pointer">
                    <circle cx={p.x} cy={p.y} r="4" className="fill-emerald-500 animate-pulse" />
                    <circle cx={p.x} cy={p.y} r="12" className="stroke-emerald-500/20 fill-emerald-500/5 animate-ping" />
                    <text x={p.x + 10} y={p.y + 5} className="fill-slate-600 text-[10px] font-mono font-black uppercase opacity-0 group-hover/node:opacity-100 transition-opacity">{p.label}</text>
                  </g>
                ))}
             </svg>
           </div>

           {/* Floating Info Overlay */}
           <div className="absolute top-10 left-10 p-8 glass-card rounded-[40px] border border-emerald-500/20 bg-black/60 shadow-2xl backdrop-blur-2xl space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Globe className="text-white w-6 h-6 animate-spin-slow" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Global <span className="text-emerald-400">Topology</span></h3>
                    <p className="text-[9px] text-slate-500 font-mono font-black uppercase tracking-widest mt-1">MESH_PROTOCOL_v5.2</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                 <div>
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Active Peers</p>
                    <p className="text-2xl font-mono font-black text-white">{activeNodes}</p>
                 </div>
                 <div>
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Network Latency</p>
                    <p className="text-2xl font-mono font-black text-emerald-400">{latency}ms</p>
                 </div>
              </div>
           </div>

           {/* Live Block Pulse Bottom Overlay */}
           <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 flex items-center gap-6 shadow-inner">
                 <div className="p-3 bg-indigo-600/10 rounded-xl">
                    <Box className="w-5 h-5 text-indigo-400" />
                 </div>
                 <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase">Latest Block Shard</p>
                    <p className="text-lg font-mono font-black text-white uppercase tracking-widest">{lastBlock}</p>
                 </div>
                 <div className="h-10 w-px bg-white/10" />
                 <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase">Block Finality</p>
                    <p className="text-lg font-mono font-black text-emerald-400 italic">SECURE</p>
                 </div>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">CENTER_GATE_SYNC_OK</span>
              </div>
           </div>
        </div>

        {/* Right Sidebar: Consensus Engine */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-between min-h-[600px] shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Network size={300} className="text-indigo-400" /></div>
              
              <div className="space-y-10 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-3xl border-2 border-white/10">
                       <Zap className="w-8 h-8 text-white fill-current" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Consensus <span className="text-indigo-400">Engine</span></h3>
                       <p className="text-[10px] text-indigo-400/60 font-black uppercase tracking-widest mt-2">Proof of Sustainability (PoS)</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                          <span>Network Quorum</span>
                          <span className="text-emerald-400 font-mono">{consensusLevel.toFixed(1)}%</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" style={{ width: `${consensusLevel}%` }}></div>
                       </div>
                       <p className="text-[11px] text-slate-400 italic text-center font-medium">"PoS protocol weighing block validity based on node m-constant and C(a) growth signatures."</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-black/40 border border-white/10 rounded-[32px] text-center space-y-1 shadow-xl">
                          <p className="text-[8px] text-slate-600 font-black uppercase">Validation Hash</p>
                          <p className="text-xl font-mono font-black text-white">SHA-512</p>
                       </div>
                       <div className="p-6 bg-black/40 border border-white/10 rounded-[32px] text-center space-y-1 shadow-xl">
                          <p className="text-[8px] text-slate-600 font-black uppercase">ZK-Proof Rate</p>
                          <p className="text-xl font-mono font-black text-blue-400">12K/s</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 relative z-10">
                 <button className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                    <Terminal size={18} /> INITIALIZE NETWORK AUDIT
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Regional Cluster Metrics */}
      <div className="space-y-8 px-4">
         <div className="flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Database size={20} className="text-indigo-400" />
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Regional <span className="text-indigo-400">Cluster Shards</span></h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
               <History className="w-3 h-3 text-slate-600" />
               <span className="text-[10px] font-mono text-slate-600 uppercase">Last Global Sync: 14s ago</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regionalMetrics.map((region, i) => (
               <div key={i} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="space-y-8 relative z-10">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner border border-white/10">
                           <MapPin size={24} className="text-indigo-400" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                           region.status === 'STABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                           region.status === 'HIGH_LOAD' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                           'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        }`}>{region.status}</span>
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{region.region}</h4>
                        <p className="text-[10px] text-slate-600 font-black uppercase mt-4 tracking-widest italic">{region.nodes} Active Nodes</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <p className="text-[8px] text-slate-700 font-black uppercase">Node Ping</p>
                           <p className="text-xl font-mono font-black text-white">{region.latency}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] text-slate-700 font-black uppercase">Grid Load</p>
                           <p className="text-xl font-mono font-black text-white">{region.load}%</p>
                        </div>
                     </div>
                  </div>
                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
                        Sync Shard <ArrowRightCircle size={14} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 3. Proof of Sustainability Shard Section */}
      <div className="p-16 glass-card rounded-[80px] border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-12 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <ShieldCheck className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">NETWORK <span className="text-emerald-400">INTEGRITY</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 Decentralized governance through biological proof. Every block in the EnvirosAgro blockchain represents a confirmed transition towards planetary sustainability.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">CONSENSUS_QUORUM</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          0% { top: -10px; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default NetworkView;