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
  ArrowDownCircle,
  Link2,
  BoxSelect,
  Monitor,
  Workflow,
  ChevronRight,
  Maximize,
  AlertCircle,
  Eye,
  Settings,
  ShieldPlus,
  // Added PlusCircle and History (aliased to HistoryIcon) to fix "Cannot find name" errors
  PlusCircle,
  History as HistoryIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { AgroBlock, User, AgroTransaction } from '../types';

interface ExplorerProps {
  blockchain?: AgroBlock[];
  isMining?: boolean;
  onPulse?: (msg: string) => void;
  user?: User;
}

const VALIDATOR_POOL = [
  { id: 'VAL-882', node: 'Environmental_Validator_04', reputation: 98.4, stake: '1.2M EAC', thrust: 'Technological', status: 'ACTIVE', load: 42, up: '99.9%' },
  { id: 'VAL-104', node: 'Societal_Consensus_Node_82', reputation: 99.2, stake: '840K EAC', thrust: 'Societal', status: 'ACTIVE', load: 12, up: '100%' },
  { id: 'VAL-042', node: 'Technological_Auth_Shard_12', reputation: 94.8, stake: '2.5M EAC', thrust: 'Environmental', status: 'ACTIVE', load: 88, up: '98.4%' },
  { id: 'VAL-991', node: 'Industrial_Core_Finalizer', reputation: 99.9, stake: '4.8M EAC', thrust: 'Industry', status: 'SYNCING', load: 64, up: '99.9%' },
  { id: 'VAL-552', node: 'Global_Relay_Primary', reputation: 91.2, stake: '3.2M EAC', thrust: 'Human', status: 'ACTIVE', load: 24, up: '97.2%' },
];

const PULSE_EVENTS = [
  { event: 'REGISTRY_BLOCK_FINALIZED', node: 'VAL-882', data: '0x882...F42A', type: 'system' },
  { event: 'CAPITAL_ESCROW_RELEASED', node: 'VAL-104', data: '14.2K EAC', type: 'commerce' },
  { event: 'BIO_SIGNAL_DRIFT_CORRECTED', node: 'VAL-042', data: 'm=1.42x', type: 'network' },
  { event: 'NEW_STWD_ANCHORED', node: 'VAL-991', data: 'EA-USER-821', type: 'engagement' },
  { event: 'ZK_PROOF_VERIFIED', node: 'VAL-552', data: 'SHA-512_SYNC', type: 'system' },
];

const Explorer: React.FC<ExplorerProps> = ({ blockchain = [], isMining = false, onPulse, user }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'ledger' | 'pulse' | 'consensus'>('blocks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<AgroBlock | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [hashRate, setHashRate] = useState(12.42);
  const [livePulseData, setLivePulseData] = useState<any[]>([]);

  // Simulation: Hashrate drift and Live Chart Data
  useEffect(() => {
    const interval = setInterval(() => {
      setHashRate(prev => Number((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)));
      setLivePulseData(prev => {
        const newVal = 40 + Math.random() * 40;
        const newEntry = { t: new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' }), load: newVal };
        return [...prev, newEntry].slice(-12);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredBlocks = blockchain.filter(b => 
    b.hash.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.validator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allTransactions = useMemo(() => {
    return blockchain.flatMap(b => b.transactions.map(t => ({ 
      ...t, 
      blockHash: b.hash, 
      validator: b.validator, 
      timestamp: b.timestamp 
    })));
  }, [blockchain]);

  const filteredLedger = allTransactions.filter(tx =>
    tx.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-full overflow-hidden pb-20 px-1 md:px-4">
      
      {/* 1. Global Metrology HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
         {[
           { label: 'HASH VELOCITY', val: hashRate, unit: 'TH/s', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/5', progress: (hashRate / 15) * 100 },
           { label: 'BLOCK HEIGHT', val: `#${blockchain.length + 428812}`, unit: 'BLCK', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/5', status: isMining ? 'FINALIZING...' : 'SYNCED' },
           { label: 'QUORUM CONSENSUS', val: '99.98', unit: '%', icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/5', progress: 99.98 },
           { label: 'LEDGER SHARDS', val: allTransactions.length + 1242, unit: 'SHDS', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/5', status: '+12% CYC' },
         ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-4 group hover:border-white/10 transition-all shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><stat.icon size={80} /></div>
               <div className="flex justify-between items-center relative z-10">
                  <p className={`text-[10px] ${stat.color} font-black uppercase tracking-[0.4em]`}>{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color} ${isMining && i === 1 ? 'animate-spin' : ''}`} />
               </div>
               <div className="relative z-10">
                  <h4 className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{stat.val}</h4>
                  <div className="mt-4 flex items-center gap-2">
                     {stat.progress ? (
                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                           <div className={`h-full ${stat.color.replace('text', 'bg')} transition-all duration-[2s]`} style={{ width: `${stat.progress}%` }}></div>
                        </div>
                     ) : (
                        <p className={`text-[9px] font-black uppercase tracking-widest ${stat.status?.includes('FINAL') ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`}>{stat.status}</p>
                     )}
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* 2. Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-6 relative z-20">
        {[
          { id: 'blocks', label: 'Block Shards', icon: Box },
          { id: 'ledger', label: 'Transaction Ledger', icon: Terminal },
          { id: 'consensus', label: 'Validator Registry', icon: Network },
          { id: 'pulse', label: 'Network Pulse', icon: Radio },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[800px] px-4 md:px-0">
        
        {/* --- VIEW: BLOCK SHARDS --- */}
        {activeTab === 'blocks' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-8 px-4">
                 <div className="w-full">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Recent <span className="text-emerald-400">Block Shards</span></h3>
                    <p className="text-slate-500 text-base mt-3 font-medium italic opacity-70">"Immutable data stacks finalized via multi-thrust consensus."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Audit Block Hash or Finalizer..." 
                      className="w-full bg-black border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" 
                    />
                 </div>
              </div>

              <div className="grid gap-6">
                 {filteredBlocks.map((block, i) => (
                    <div 
                      key={block.hash} 
                      onClick={() => setSelectedBlock(block)}
                      className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer relative overflow-hidden bg-black/40 shadow-3xl active:scale-[0.99] duration-300 animate-in slide-in-from-top-4"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                       <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500/60 transition-all"></div>
                       <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors overflow-hidden">
                          <div className="w-full h-[3px] bg-emerald-500/20 absolute top-0 animate-scan opacity-0 group-hover:opacity-100"></div>
                       </div>
                       
                       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                          <div className="flex items-center gap-10 w-full lg:w-auto">
                             <div className="w-24 h-24 rounded-[36px] bg-slate-800 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-all shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                                <Box className="w-12 h-12 text-emerald-400 group-hover:animate-pulse relative z-10" />
                                <div className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-[36px] animate-spin-slow"></div>
                             </div>
                             <div className="space-y-4">
                                <div className="flex items-center gap-6">
                                   <span className="text-white font-mono text-3xl font-black tracking-tighter drop-shadow-sm truncate max-w-[200px] md:max-w-none">{block.hash}</span>
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
                                <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest leading-none">Shard Mass</p>
                                <p className="text-5xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors tracking-tighter leading-none">
                                   {(block.transactions.length * 14.2).toFixed(1)} <span className="text-sm opacity-30 font-sans italic">KB</span>
                                </p>
                             </div>
                             <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-emerald-600 group-hover:text-white transition-all active:scale-90 shadow-xl">
                                <Maximize2 className="w-8 h-8" />
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
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 px-4 gap-8">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Global <span className="text-blue-400">Ledger Stream</span></h3>
                    <p className="text-slate-500 text-base mt-3 font-medium italic opacity-70">"Real-time broadcast of all sharded industrial actions."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="Search ID or Registry Narrative..." 
                      className="w-full bg-black border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono italic shadow-inner" 
                    />
                 </div>
              </div>

              <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-6 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="col-span-2 px-4">Registry Action Shard</span>
                    <span>Action Pillar</span>
                    <span>Origin Node</span>
                    <span>Value Impact</span>
                    <span className="text-right px-4">Ledger Finality</span>
                 </div>
                 <div className="divide-y divide-white/5 h-[650px] overflow-y-auto custom-scrollbar bg-[#050706]">
                    {filteredLedger.map((tx, i) => (
                       <div key={i} onClick={() => setSelectedTx(tx)} className="grid grid-cols-6 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in">
                          <div className="col-span-2 flex items-center gap-10">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                                <Database size={28} />
                             </div>
                             <div>
                                <p className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-blue-400 transition-colors m-0 leading-none">{tx.details}</p>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest">{tx.id}</p>
                             </div>
                          </div>
                          <div>
                             <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-500/20">{tx.type}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono italic">
                             {tx.farmId}
                          </div>
                          <div className="text-3xl font-mono font-black text-white tracking-tighter">
                             {tx.value > 0 ? '+' : ''}{tx.value} <span className="text-xs text-slate-800 font-sans uppercase font-bold">{tx.unit}</span>
                          </div>
                          <div className="flex justify-end pr-8">
                             <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 transition-all scale-90 group-hover:scale-100">
                                <ShieldCheck size={24} />
                             </div>
                          </div>
                       </div>
                    ))}
                    {filteredLedger.length === 0 && (
                      <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                        <Monitor size={120} className="text-slate-600 animate-pulse" />
                        <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">Registry Empty</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: VALIDATOR REGISTRY --- */}
        {activeTab === 'consensus' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-1000">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10 px-6">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Validator <span className="text-indigo-400">Quorum</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Active network nodes maintaining biological finality."</p>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="px-6 py-3 glass-card rounded-full border border-indigo-500/20 bg-indigo-500/5 flex items-center gap-4">
                       <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_#6366f1]"></div>
                       <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest">CENTER_GATE_SYNC_NOMINAL</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                 {VALIDATOR_POOL.map(val => (
                    <div key={val.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between h-[550px] shadow-3xl relative overflow-hidden active:scale-[0.98] duration-500">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><Network size={300} /></div>
                       
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className={`p-6 rounded-[32px] bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all`}>
                             <Monitor size={40} />
                          </div>
                          <div className="text-right">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                val.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                             }`}>{val.status}</span>
                             <p className="text-[10px] text-slate-700 font-mono mt-4 font-black uppercase tracking-widest italic">{val.id}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{val.node.replace(/_/g, ' ')}</h4>
                          <div className="flex items-center gap-4 text-slate-600 group-hover:text-slate-400 transition-colors">
                             <Key size={14} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest italic">{val.thrust} Domain Expert</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-8">
                             <div className="p-6 bg-black/60 rounded-[40px] border border-white/5 space-y-2 group/biom hover:border-indigo-500/20 transition-all shadow-inner">
                                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">Reputation Index</p>
                                <p className="text-3xl font-mono font-black text-white">{val.reputation}%</p>
                             </div>
                             <div className="p-6 bg-black/60 rounded-[40px] border border-white/5 space-y-2 group/biom hover:border-emerald-500/20 transition-all shadow-inner text-right">
                                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest flex items-center justify-end gap-2">Uptime Shard</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">{val.up}</p>
                             </div>
                          </div>
                       </div>

                       <div className="mt-14 pt-10 border-t border-white/5 space-y-6 relative z-10">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">
                             <span>Validator Load</span>
                             <span className="text-white font-mono">{val.load}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                             <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1] transition-all duration-[2s]" style={{ width: `${val.load}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
                 <div className="p-12 border-4 border-dashed border-white/10 rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 opacity-30 hover:opacity-100 transition-opacity group cursor-pointer bg-black/20 h-[550px]">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                       {/* Correctly imported PlusCircle to fix the "Cannot find name" error */}
                       <PlusCircle size={48} />
                    </div>
                    <div className="space-y-4 px-12">
                       <p className="text-2xl font-black text-white uppercase italic tracking-tighter">Initialize Stake Shard</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">"Anchor EAT equity to initialize a new validator node in the industrial quorum."</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: NETWORK PULSE --- */}
        {activeTab === 'pulse' && (
           <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 md:px-0">
                 <div className="lg:col-span-8 glass-card p-14 rounded-[72px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col shadow-3xl group">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent absolute top-0 animate-scan"></div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-10">
                          <div className="p-8 bg-indigo-600 rounded-[32px] shadow-[0_0_80px_#6366f166] border-4 border-white/10 group-hover:rotate-6 transition-transform">
                             <Waves className="w-14 h-14 text-white animate-pulse" />
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Network <span className="text-indigo-400">Heartbeat</span></h3>
                             <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mt-3">EOS_REALTIME_LOAD_MONITOR</p>
                          </div>
                       </div>
                       <div className="text-center md:text-right border-l-4 border-indigo-500/20 pl-10">
                          <p className="text-[12px] text-slate-600 font-black uppercase mb-3 tracking-[0.4em]">Grid Stability</p>
                          <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter leading-none">94<span className="text-4xl font-sans italic ml-1">.2%</span></p>
                       </div>
                    </div>

                    <div className="flex-1 min-h-[500px] w-full relative z-10 p-6 bg-black/40 rounded-[56px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={livePulseData}>
                             <defs>
                                <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="t" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }} />
                             <Area type="monotone" name="Mesh Load" dataKey="load" stroke="#6366f1" strokeWidth={10} fillOpacity={1} fill="url(#colorPulse)" strokeLinecap="round" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-10">
                    <div className="glass-card p-12 rounded-[64px] border-2 border-emerald-500/20 bg-black/40 flex flex-col justify-between shadow-3xl relative overflow-hidden group/events h-full">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/events:scale-110 transition-transform duration-[12s]"><Terminal size={400} className="text-emerald-400" /></div>
                       
                       <div className="space-y-10 relative z-10">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-emerald-600 rounded-[24px] shadow-3xl border-2 border-white/10 group-hover/events:rotate-12 transition-transform">
                                <Terminal size={24} className="text-white" />
                             </div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-widest m-0 leading-none">Event <span className="text-emerald-400">Stream</span></h4>
                          </div>

                          <div className="space-y-6 overflow-y-auto custom-scrollbar-terminal max-h-[500px] pr-4">
                             {PULSE_EVENTS.map((e, idx) => (
                                <div key={idx} className="p-6 bg-black/60 border border-white/5 rounded-3xl space-y-3 group/entry hover:border-emerald-500/30 transition-all shadow-inner">
                                   <div className="flex justify-between items-center">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-widest ${
                                         e.type === 'system' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' : 
                                         e.type === 'commerce' ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 
                                         'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                                      }`}>{e.type}</span>
                                      <span className="text-[8px] font-mono text-slate-700 font-black">{e.node}</span>
                                   </div>
                                   <p className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover/entry:text-emerald-400 transition-colors">{e.event.replace(/_/g, ' ')}</p>
                                   <p className="text-[10px] text-slate-500 font-mono italic">DATA: {e.data}</p>
                                </div>
                             ))}
                          </div>
                       </div>

                       <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
                          <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-xl">EXPORT PULSE ARCHIVE</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- BLOCK DOSSIER MODAL --- */}
      {selectedBlock && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedBlock(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(0,0,0,0.9)] animate-in zoom-in border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-12 border-b border-white/5 bg-emerald-600/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-3xl animate-float border-4 border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <Box size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Block <span className="text-emerald-400">Dossier</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[11px] tracking-[0.4em] uppercase mt-4 italic leading-none">REGISTRY_FINALITY_SYNC_OK</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedBlock(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-2xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar space-y-16 bg-black/40 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <div className="space-y-6">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4 px-2">
                             <Hash size={24} className="text-emerald-400" />
                             Cryptographic Root
                          </h4>
                          <div className="p-10 bg-black rounded-[56px] border border-white/5 shadow-inner group/hash relative overflow-hidden">
                             <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/hash:opacity-100 transition-opacity"></div>
                             <p className="text-emerald-400 text-xl font-mono break-all font-black leading-relaxed tracking-widest relative z-10">
                                {selectedBlock.hash}
                             </p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4 px-2">
                             <Settings size={20} className="text-blue-400" /> Shard Metadata
                          </h4>
                          <div className="space-y-4">
                             {[
                                // Fixed History alias usage to HistoryIcon to resolve "Cannot find name" error
                                { l: 'Previous Hash', v: selectedBlock.prevHash.substring(0, 16) + '...', i: HistoryIcon },
                                { l: 'Validator Node', v: selectedBlock.validator, i: UserIcon },
                                { l: 'Finality Time', v: new Date(selectedBlock.timestamp).toLocaleString(), i: Clock },
                             ].map((m, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[28px] border border-white/5 hover:border-white/20 transition-all">
                                   <div className="flex items-center gap-4">
                                      <m.i size={18} className="text-slate-600" />
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.l}</span>
                                   </div>
                                   <span className="text-sm font-mono font-black text-white">{m.v}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="flex items-center gap-4 px-2 border-b border-white/5 pb-6">
                          <Terminal size={24} className="text-indigo-400" />
                          <h4 className="text-2xl font-black text-white uppercase italic">Transaction Shards ({selectedBlock.transactions.length})</h4>
                       </div>
                       <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar-terminal pr-4">
                          {selectedBlock.transactions.map((tx, i) => (
                             <div key={i} className="p-8 bg-black/60 border border-white/10 rounded-[44px] hover:border-emerald-500/40 transition-all shadow-inner relative group/tx">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover/tx:scale-125 transition-transform"><Database size={40} /></div>
                                <div className="flex justify-between items-start mb-6">
                                   <span className="text-[10px] font-mono font-black text-slate-700 tracking-tighter">#{tx.id}</span>
                                   <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase">{tx.type}</span>
                                </div>
                                <h5 className="text-xl font-black text-white uppercase italic tracking-tight mb-4">{tx.details}</h5>
                                <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                                   <p className="text-[9px] text-slate-600 font-black uppercase italic">{tx.farmId}</p>
                                   <p className="text-2xl font-mono font-black text-emerald-400 tracking-tighter">
                                      {tx.value > 0 ? '+' : ''}{tx.value} <span className="text-xs italic font-sans text-slate-800">{tx.unit}</span>
                                   </p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center shrink-0">
                 <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ring-8 ring-white/5">
                    <Download size={24} /> EXPORT BLOCK SHARD
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- TRANSACTION DOSSIER MODAL --- */}
      {selectedTx && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedTx(null)}></div>
            <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] p-16 shadow-3xl border-2 flex flex-col text-center space-y-12 animate-in zoom-in">
               <div className="space-y-6">
                  <div className="w-24 h-24 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl animate-float">
                     <FileDigit size={48} />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Shard <span className="text-indigo-400">Readout</span></h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase font-black mt-3">LEDGER_HASH: 0x882_TX_OK</p>
                  </div>
               </div>

               <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 text-left space-y-8 shadow-inner">
                  <div className="flex justify-between items-center border-b border-white/5 pb-6">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Narrative</span>
                     <span className="text-white font-black uppercase italic text-sm">{selectedTx.details}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                     <div>
                        <p className="text-[8px] text-slate-700 font-black uppercase mb-1">Impact Value</p>
                        <p className="text-3xl font-mono font-black text-emerald-400">{selectedTx.value} <span className="text-sm font-sans italic text-slate-800 uppercase">{selectedTx.unit}</span></p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] text-slate-700 font-black uppercase mb-1">Thrust Domain</p>
                        <p className="text-xl font-black text-white uppercase italic">{selectedTx.type}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <button onClick={() => setSelectedTx(null)} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl active:scale-95 transition-all ring-8 ring-white/5">CLOSE SHARD</button>
                  <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.6em] px-10">"Permanent Entry. Cryptographically sealed by Node Quorum."</p>
               </div>
            </div>
         </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }

        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Explorer;