
import React, { useState, useEffect } from 'react';
// Added RefreshCcw to imports
import { Search, Hash, Clock, Shield, Box, User, ArrowUpRight, CheckCircle2, Activity, Globe, Zap, Database, Terminal, Layers, RefreshCcw } from 'lucide-react';
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
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Network <span className="text-emerald-400">Registry Pulse</span></h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                     Live view of the EnvirosAgro™ decentralized ledger. Immutable sharding for every regenerative action committed globally.
                  </p>
               </div>
            </div>
         </div>
         
         <div className="lg:col-span-4 glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6">
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
             {/* RefreshCcw correctly used here after being added to imports */}
             <RefreshCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {mockBlocks.map((block) => (
          <div 
            key={block.hash} 
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
                   <ArrowUpRight className="w-8 h-8" />
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Explorer;
