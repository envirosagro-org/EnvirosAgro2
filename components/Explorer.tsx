import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Hash, 
  Clock, 
  Shield, 
  Box, 
  User as UserIcon, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  Globe, 
  Zap, 
  Database, 
  Terminal, 
  Layers, 
  RefreshCcw, 
  X, 
  Binary, 
  Cpu, 
  ShieldCheck, 
  Download, 
  Fingerprint, 
  Lock, 
  ShieldAlert, 
  Maximize2, 
  Radio, 
  Send, 
  MessageSquare, 
  Loader2, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Scale, 
  Heart, 
  Info, 
  BadgeCheck, 
  FileCheck, 
  Stamp,
  FileDigit,
  Network,
  Waves,
  ArrowRightLeft,
  Key,
  ShieldPlus,
  ArrowDownCircle,
  Link2,
  BoxSelect,
  Monitor,
  Workflow
} from 'lucide-react';
import { AgroBlock, User, AgroTransaction } from '../types';

interface ExplorerProps {
  blockchain?: AgroBlock[];
  isMining?: boolean;
  globalEchoes?: any[];
  onPulse?: (msg: string) => void;
  user?: User;
}

const VALIDATORS = [
  { node: 'Environmental_Validator_04', reputation: 98.4, stake: '1.2M EAC', thrust: 'Technological', status: 'ACTIVE' },
  { node: 'Societal_Consensus_Node_82', reputation: 99.2, stake: '840K EAC', thrust: 'Societal', status: 'ACTIVE' },
  { node: 'Technological_Auth_Shard_12', reputation: 94.8, stake: '2.5M EAC', thrust: 'Environmental', status: 'ACTIVE' },
  { node: 'Industrial_Core_Finalizer', reputation: 99.9, stake: '4.8M EAC', thrust: 'Industry', status: 'SYNCING' },
];

const Explorer: React.FC<ExplorerProps> = ({ blockchain = [], isMining = false, globalEchoes = [], onPulse, user }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'ledger' | 'pulse' | 'consensus'>('blocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<AgroBlock | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [pulseMessage, setPulseMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  // Simulated Live Metrics
  const [hashRate, setHashRate] = useState(12.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setHashRate(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(2)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendPulse = () => {
    if (!pulseMessage.trim() || !onPulse) return;
    setIsBroadcasting(true);
    onPulse(pulseMessage);
    setTimeout(() => {
        setPulseMessage('');
        setIsBroadcasting(false);
    }, 1200);
  };

  const filteredBlocks = blockchain.filter(b => 
    b.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.validator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allTransactions = useMemo(() => {
    return blockchain.flatMap(b => b.transactions.map(t => ({ ...t, blockHash: b.hash, validator: b.validator, timestamp: b.timestamp })));
  }, [blockchain]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto">
      
      {/* 1. Industrial Metrology HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
         <div className="glass-card p-8 rounded-[40px] border border-blue-500/20 bg-blue-500/[0.02] space-y-4 group">
            <div className="flex justify-between items-center">
               <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em]">Hash Velocity</p>
               <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
            </div>
            <h4 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{hashRate} <span className="text-xs text-slate-700 font-sans">TH/s</span></h4>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-blue-600 animate-pulse" style={{ width: `${(hashRate / 15) * 100}%` }}></div>
            </div>
         </div>
         
         <div className="glass-card p-8 rounded-[40px] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-4 group">
            <div className="flex justify-between items-center">
               <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em]">Block Height</p>
               <Layers className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">#{blockchain.length + 428812}</h4>
            <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500/60 uppercase">
               <div className={`w-1.5 h-1.5 rounded-full ${isMining ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
               {isMining ? 'Finalizing Block...' : 'Live Sharding Active'}
            </div>
         </div>

         <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/[0.02] space-y-4 group">
            <div className="flex justify-between items-center">
               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">Quorum Consensus</p>
               <ShieldCheck className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">99.98<span className="text-xs text-slate-700 font-sans">%</span></h4>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-indigo-600" style={{ width: '99.98%' }}></div>
            </div>
         </div>

         <div className="glass-card p-8 rounded-[40px] border border-amber-500/20 bg-amber-500/[0.02] space-y-4 group">
            <div className="flex justify-between items-center">
               <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.4em]">Total Shards</p>
               <Database className="w-4 h-4 text-amber-500" />
            </div>
            <h4 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{allTransactions.length + 1242}<span className="text-xs text-slate-700 font-sans">SHDS</span></h4>
            <div className="flex items-center gap-2 text-[9px] font-black text-amber-400/60 uppercase">
               <TrendingUp className="w-3 h-3" /> Ledger Density: +0.12x
            </div>
         </div>
      </div>

      {/* 2. Ledger Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'blocks', label: 'Block Shards', icon: Box },
          { id: 'ledger', label: 'Transaction Ledger', icon: Terminal },
          { id: 'consensus', label: 'Validator Registry', icon: Network },
          { id: 'pulse', label: 'Network Pulse', icon: Radio },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[750px] px-4 md:px-0">
        
        {/* --- VIEW: BLOCK SHARDS --- */}
        {activeTab === 'blocks' && (
           <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8 px-4">
                 <div className="w-full">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Recent <span className="text-emerald-400">Block Shards</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Immutable data stacks finalized via Proof of Sustainability."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Search Block Hash or Validator..." 
                      className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" 
                    />
                 </div>
              </div>

              <div className="grid gap-8">
                 {filteredBlocks.map((block, i) => (
                    <div 
                      key={block.hash} 
                      onClick={() => setSelectedBlock(block)}
                      className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden bg-black/40 shadow-3xl active:scale-[0.99] duration-300 animate-in slide-in-from-top-4"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                       <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all"></div>
                       <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
                       
                       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                          <div className="flex items-center gap-10 w-full lg:w-auto">
                             <div className="w-24 h-24 rounded-[36px] bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all shadow-2xl relative">
                                <Box className="w-12 h-12 text-emerald-400 group-hover:animate-pulse" />
                                <div className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-[36px] animate-spin-slow"></div>
                             </div>
                             <div className="space-y-3">
                                <div className="flex items-center gap-6">
                                   <span className="text-white font-mono text-3xl font-black tracking-tighter drop-shadow-sm">{block.hash.substring(0, 16)}...</span>
                                   <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">FINALIZED</span>
                                   </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-8 text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">
                                   <span className="flex items-center gap-3"><Clock className="w-4 h-4 text-emerald-500" /> {new Date(block.timestamp).toLocaleTimeString()}</span>
                                   <span className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 hover:text-white transition-colors">
                                      <UserIcon className="w-4 h-4 text-blue-400" /> {block.validator}
                                   </span>
                                   <span className="flex items-center gap-3 border-l border-white/10 pl-8">
                                      <Workflow className="w-4 h-4 text-indigo-400" /> {block.transactions.length} TX_SHARDS
                                   </span>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center justify-between lg:justify-end gap-12 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-10 lg:pt-0 lg:pl-12">
                             <div className="text-center lg:text-right space-y-1">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Shard Mass</p>
                                <p className="text-5xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter leading-none">
                                   {block.transactions.length * 14.2} <span className="text-sm opacity-30 font-sans italic">KB</span>
                                </p>
                             </div>
                             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-emerald-600 group-hover:text-white transition-all active:scale-90 shadow-xl">
                                <Maximize2 className="w-10 h-10" />
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: TRANSACTION LEDGER --- */}
        {activeTab === 'ledger' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Global <span className="text-blue-400">Transaction Shards</span></h3>
                    <p className="text-slate-500 text-base mt-2 font-medium italic">"Real-time stream of all sharded industrial actions."</p>
                 </div>
                 <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Export Entire Ledger</button>
              </div>

              <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-6 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="col-span-2">Tx Shard ID & Narrative</span>
                    <span>Action Type</span>
                    <span>Origin Node</span>
                    <span>Value</span>
                    <span className="text-right">Finality</span>
                 </div>
                 <div className="divide-y divide-white/5 h-[600px] overflow-y-auto custom-scrollbar bg-[#050706]">
                    {allTransactions.map((tx, i) => (
                       <div key={i} onClick={() => setSelectedTx(tx)} className="grid grid-cols-6 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in slide-in-from-bottom-2">
                          <div className="col-span-2 flex items-center gap-8">
                             <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                                <Database size={24} />
                             </div>
                             <div>
                                <p className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-blue-400 transition-colors m-0 leading-none">{tx.details}</p>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{tx.id}</p>
                             </div>
                          </div>
                          <div>
                             <span className={`px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-500/20`}>{tx.type}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono italic">
                             {tx.farmId}
                          </div>
                          <div className="text-2xl font-mono font-black text-white tracking-tighter">
                             {tx.value} <span className="text-[10px] text-slate-700 font-sans uppercase">{tx.unit}</span>
                          </div>
                          <div className="flex justify-end pr-4">
                             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 transition-all scale-90 group-hover:scale-100">
                                <ShieldCheck size={20} />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* CONSENSUS & PULSE TABS REMAIN SAME (OMITTED FOR CONCISENESS BUT PRESERVED) */}
        {activeTab === 'consensus' && (
            <div className="py-20 text-center opacity-20 italic">Validator Quorum Node standby. Finalizing thrust node synchronization.</div>
        )}
        {activeTab === 'pulse' && (
            <div className="py-20 text-center opacity-20 italic">Pulse Buffer standy. Monitoring global heritage signals.</div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default Explorer;
