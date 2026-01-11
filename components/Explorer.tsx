
import React, { useState, useEffect } from 'react';
import { Search, Hash, Clock, Shield, Box, User, ArrowUpRight, CheckCircle2, Activity, Globe, Zap, Database, Terminal, Layers, RefreshCcw, X, Binary, Cpu, ShieldCheck, Download, Fingerprint, Lock, ShieldAlert, Maximize2 } from 'lucide-react';
import { AgroBlock } from '../types';

const mockBlocks: AgroBlock[] = [
  {
    hash: '0x8f2d...91c3',
    prevHash: '0x12a5...33d1',
    timestamp: '2 mins ago',
    validator: 'Node_Paris_04',
    status: 'Confirmed',
    transactions: [
      { id: 'tx1', type: 'CarbonMint', farmId: 'FR-882', details: 'Regenerative Tilling Credits', value: 14.2, unit: 'CO2e' }
    ]
  },
  {
    hash: '0x33e1...bb20',
    prevHash: '0x8f2d...91c3',
    timestamp: '12 mins ago',
    validator: 'Node_SF_12',
    status: 'Confirmed',
    transactions: [
      { id: 'tx2', type: 'Harvest', farmId: 'US-291', details: 'Organic Corn Yield Log', value: 12500, unit: 'kg' }
    ]
  },
  {
    hash: '0xab82...0092',
    prevHash: '0x33e1...bb20',
    timestamp: '24 mins ago',
    validator: 'Node_Tokyo_01',
    status: 'Confirmed',
    transactions: [
      { id: 'tx3', type: 'Audit', farmId: 'JP-92', details: 'Soil pH Verification', value: 6.8, unit: 'pH' }
    ]
  }
];

const Explorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeShard, setActiveShard] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<AgroBlock | null>(null);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto">
      {/* Network Pulse Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
               <Database className="w-80 h-80 text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
               <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] shrink-0">
                  <Globe className="w-12 h-12 text-white" />
               </div>
               <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Network <span className="text-emerald-400">Registry Pulse</span></h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                     Live view of the EnvirosAgro™ decentralized ledger. Immutable sharding for every regenerative action committed globally.
                  </p>
               </div>
            </div>
         </div>
         
         <div className="lg:col-span-4 glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Block Density</p>
               <h3 className="text-5xl font-black text-white font-mono tracking-tighter">8,421</h3>
            </div>
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">SYNC_STABLE_NODES</span>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
          <input 
            type="text"
            placeholder="Search by Block Hash, TxID or Farm ID..."
            className="w-full bg-black/60 border border-white/10 rounded-[32px] py-5 pl-16 pr-8 text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 font-mono tracking-widest text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[32px] text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 shadow-lg">
            Filter Shards
          </button>
          <button className="p-5 bg-emerald-600 rounded-[32px] text-white shadow-2xl hover:bg-emerald-500 transition-all active:scale-95">
             <RefreshCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {mockBlocks.map((block) => (
          <div 
            key={block.hash} 
            onClick={() => setSelectedBlock(block)}
            className="glass-card rounded-[44px] p-10 border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden bg-black/40 shadow-2xl active:scale-[0.99] duration-300"
            onMouseEnter={() => setActiveShard(block.hash)}
            onMouseLeave={() => setActiveShard(null)}
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex items-center gap-8 w-full lg:w-auto">
                <div className={`w-20 h-20 rounded-[28px] bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all shadow-xl ${activeShard === block.hash ? 'scale-110 border-emerald-500/40' : ''}`}>
                  <Box className="w-10 h-10 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-mono text-2xl font-black tracking-tighter drop-shadow-sm">{block.hash}</span>
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                       <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> {block.timestamp}</span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full"><User className="w-4 h-4 text-blue-400" /> {block.validator}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-10 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">
                <div className="text-center lg:text-right space-y-1">
                   <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Ledger Impact</p>
                  <p className="text-4xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter leading-none">
                    {block.transactions[0].value.toLocaleString()} <span className="text-sm opacity-40 font-sans">{block.transactions[0].unit}</span>
                  </p>
                  <p className="text-[9px] text-emerald-500/60 font-black uppercase tracking-widest">
                    {block.transactions[0].type} SHARD
                  </p>
                </div>
                <div className="p-5 bg-white/5 rounded-[24px] border border-white/10 group-hover:bg-emerald-600 group-hover:text-white transition-all active:scale-90">
                   <Maximize2 className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-2">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3 text-emerald-400" /> Farm Registry ID</p>
                <p className="text-sm font-mono text-white font-bold tracking-widest">{block.transactions[0].farmId}</p>
              </div>
              <div className="md:col-span-2 p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-2">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2"><Terminal className="w-3 h-3 text-indigo-400" /> Transaction Narrative</p>
                <p className="text-sm text-slate-400 font-medium italic">"{block.transactions[0].details}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 pt-10">
        <button className="text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 group">
           <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
           Synchronize Archive Shards
        </button>
        <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Final Registry Block: 0x821...F2A (Cycle 12)</p>
      </div>

      {/* Shard Inspector Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedBlock(null)}></div>
           <div className="relative z-10 w-full max-w-4xl h-fit glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 md:p-16 space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-3xl shrink-0 group-hover:rotate-6 transition-transform">
                          <Box className="w-12 h-12 text-white" />
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Shard <span className="text-emerald-400">Inspector</span></h3>
                          <p className="text-emerald-500/60 font-mono text-xs tracking-widest uppercase mt-3">LEDGER_BLOCK // {selectedBlock.hash}</p>
                       </div>
                    </div>
                    <button onClick={() => setSelectedBlock(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-6">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                             <span className="text-slate-500">Validation Node</span>
                             <span className="text-white font-mono">{selectedBlock.validator}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                             <span className="text-slate-500">Block Height</span>
                             <span className="text-white font-mono">#428,812_A</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                             <span className="text-slate-500">Block Weight</span>
                             <span className="text-emerald-400 font-mono">1.24 MB</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2 pt-4 border-t border-white/5">
                             <span className="text-slate-500">Network Consensus</span>
                             <span className="text-emerald-400 font-black">100% OK</span>
                          </div>
                       </div>

                       <div className="p-8 glass-card rounded-[40px] border-blue-500/20 bg-blue-500/5 space-y-4">
                          <div className="flex items-center gap-3">
                             <Fingerprint className="w-5 h-5 text-blue-400" />
                             <h4 className="text-[10px] font-black text-white uppercase tracking-widest">ZK-Proof Signature</h4>
                          </div>
                          <p className="text-[10px] font-mono text-blue-400/60 break-all leading-relaxed">
                             0x{btoa(selectedBlock.hash + selectedBlock.validator).substring(0, 128).toUpperCase()}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-6 h-full flex flex-col">
                          <div className="flex items-center gap-3">
                             <Terminal className="w-5 h-5 text-indigo-400" />
                             <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Steward Trace Shards</h4>
                          </div>
                          <div className="flex-1 overflow-y-auto custom-scrollbar-terminal space-y-3 pr-4 font-mono text-[9px]">
                             <p className="text-slate-500"><span className="text-indigo-400">[SYSTEM]</span> HANDSHAKE_INIT_882</p>
                             <p className="text-slate-500"><span className="text-emerald-400">[AUTH]</span> ZK_SNARK_SUCCESS</p>
                             <p className="text-slate-500"><span className="text-blue-400">[DATA]</span> PACKET_INGEST: {selectedBlock.transactions[0].value} {selectedBlock.transactions[0].unit}</p>
                             <p className="text-slate-500"><span className="text-amber-400">[ORACLE]</span> C(a)_INDEX_SYNC_OK</p>
                             <p className="text-slate-500"><span className="text-emerald-400">[LEDGER]</span> HASH_COMMIT_0x772</p>
                          </div>
                          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3">
                             <Download className="w-4 h-4" /> Download Raw Shard
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[32px] flex items-center gap-6">
                    <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
                    <p className="text-[10px] text-emerald-200/50 font-black uppercase leading-relaxed tracking-widest">
                       This shard is immutably anchored to the global EnvirosAgro registry. Any tampering with node telemetry results in immediate multiplier slashing.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Explorer;
