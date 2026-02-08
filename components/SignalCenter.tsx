
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Signal, Terminal, Search, Zap, ShieldCheck, Activity, 
  BadgeCheck, Fingerprint, Clock, ChevronRight, X, 
  History, ArrowUpRight, Bot, ShieldAlert, Bell, Trash2, 
  Workflow, Target, Circle, Sparkles, ChevronDown, Share2,
  Mail, Smartphone, MessageSquare, Monitor, Send, 
  Layers, Database, Network, Workflow as FlowIcon, Radio,
  SmartphoneNfc, Gavel,
  // Added missing icons to resolve errors
  CalendarDays,
  Loader2,
  ShieldPlus
} from 'lucide-react';
import { User, SignalShard, ViewState } from '../types';

interface SignalCenterProps {
  user: User;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  onNavigate: (view: ViewState) => void;
}

const SignalCenter: React.FC<SignalCenterProps> = ({ user, signals = [], setSignals, onNavigate }) => {
  const [activeView, setActiveView] = useState<'terminal' | 'planner' | 'topology'>('terminal');
  const [filter, setFilter] = useState<'all' | 'task' | 'system' | 'commerce' | 'pulse'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedShardId, setExpandedShardId] = useState<string | null>(null);

  // Auto-scrolling for Live Pulse Planning
  const [pulseSchedule, setPulseSchedule] = useState([
    { id: 'P1', label: 'EAC MINT QUORUM', time: 'T+4m', status: 'WAITING', type: 'CORE' },
    { id: 'P2', label: 'SABBATH RECALIBRATION', time: 'T+12m', status: 'PLANNED', type: 'LAW' },
    { id: 'P3', label: 'ZONE 4 SPECTRAL SYNC', time: 'T+24m', status: 'PLANNED', type: 'IOT' },
    { id: 'P4', label: 'MARKET ALPHA RE-SYNC', time: 'T+42m', status: 'PLANNED', type: 'ECO' },
  ]);

  const filteredSignals = useMemo(() => {
    return signals.filter(s => {
      const matchesFilter = filter === 'all' || s.type === filter;
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [signals, filter, searchTerm]);

  const handleResolve = (id: string) => {
    const sig = signals.find(s => s.id === id);
    if (sig?.meta?.target) onNavigate(sig.meta.target);
  };

  const handleDismiss = (id: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const channelStats = [
    { label: 'Internal Inbox', status: 'ONLINE', icon: Mail, col: 'text-emerald-400', load: 12 },
    { label: 'External Email', status: 'READY', icon: Send, col: 'text-blue-400', load: 8 },
    { label: 'Mobile SMS Node', status: 'STANDBY', icon: Smartphone, col: 'text-indigo-400', load: 0 },
    { label: 'Public Pulse', status: 'BROADCASTING', icon: Radio, col: 'text-rose-500', load: 100 },
    { label: 'P2P Signal', status: 'ENCRYPTED', icon: SmartphoneNfc, col: 'text-amber-500', load: 42 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Network Signal HUD - Technical Mastermind View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Network size={800} className="text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-44 h-44 rounded-[56px] bg-indigo-700 shadow-[0_0_120px_rgba(99,102,241,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Signal className="text-white animate-pulse" size={80} />
                 <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[56px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">ROBUST_COMMUNICATION_TERMINAL_v6.5</span>
                    <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">CONSOLIDATED_SYNC_OK</span>
                 </div>
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">SIGNAL <span className="text-indigo-400">CORE.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Central communications gateway responsible for the adsorption and cross-channel allocation of industrial signals. Maintaining node transparency via just-in-time delivery shards."
              </p>
           </div>
        </div>

        {/* Global Dispatch Status - Circular/Scroll UI */}
        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">ACTIVE_DISPATCH_LOAD</p>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                 <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
                 <div className="absolute inset-0 border-t-8 border-indigo-500 rounded-full animate-spin"></div>
                 <h4 className="text-4xl font-mono font-black text-white">84<span className="text-sm text-indigo-500 ml-1">%</span></h4>
              </div>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-6">All Channels Nominal</p>
           </div>
           <div className="w-full space-y-3 pt-8 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Ledger Finality</span>
                 <span className="text-indigo-400 font-mono italic">SYNCING</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner p-px">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: '84%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Scroll Across Channel HUD */}
      <div className="space-y-6">
         <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-8 italic">COMMUNICATION_CHANNELS_MONITOR</h4>
         <div className="flex overflow-x-auto scrollbar-hide snap-x scroll-across gap-6 px-4 md:px-0">
            {channelStats.map((chan, i) => (
              <div key={i} className="min-w-[280px] snap-center glass-card p-8 rounded-[44px] border-white/5 bg-black/60 shadow-2xl flex items-center justify-between group hover:border-white/10 transition-all active:scale-[0.98]">
                 <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${chan.col} group-hover:rotate-6 transition-all`}>
                       <chan.icon size={24} />
                    </div>
                    <div>
                       <h5 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">{chan.label}</h5>
                       <p className={`text-[9px] font-mono font-bold mt-2 uppercase tracking-widest ${chan.col}`}>{chan.status}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Shard Load</p>
                    <p className="text-2xl font-mono font-black text-white">{chan.load}%</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* 3. Main Operational Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 relative z-20">
         {/* LEFT: Central Ledger View */}
         <div className="xl:col-span-8 space-y-10">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 px-8">
               <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/60 shadow-xl px-4">
                 {[
                   { id: 'terminal', label: 'Signal Terminal', icon: Terminal },
                   { id: 'planner', label: 'Pulse Planner', icon: CalendarDays },
                   { id: 'topology', label: 'Logic Topology', icon: Network },
                 ].map(v => (
                   <button 
                     key={v.id} 
                     onClick={() => setActiveView(v.id as any)}
                     className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === v.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
                   >
                     <v.icon size={16} /> {v.label}
                   </button>
                 ))}
               </div>
               
               <div className="relative group w-full lg:w-[400px]">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Filter signal shards..." 
                     className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono italic shadow-inner"
                  />
               </div>
            </div>

            {activeView === 'terminal' && (
              <div className="glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col relative min-h-[700px]">
                 <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                    <div className="w-full h-[1px] bg-indigo-500 absolute top-0 animate-scan"></div>
                 </div>
                 
                 <div className="p-10 border-b border-white/5 bg-white/[0.01] grid grid-cols-12 text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-14 relative z-10">
                    <div className="col-span-5">Signal Allocation & Shard ID</div>
                    <div className="col-span-3 text-center">Dispatch Topology</div>
                    <div className="col-span-2 text-center">Latency</div>
                    <div className="col-span-2 text-right">Status</div>
                 </div>

                 <div className="divide-y divide-white/5 bg-[#050706] relative z-10 overflow-y-auto custom-scrollbar h-[600px]">
                    {filteredSignals.length === 0 ? (
                       <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 opacity-20">
                          <Terminal size={140} className="text-slate-600" />
                          <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">SIGNAL_BUFFER_CLEAR</p>
                       </div>
                    ) : (
                       filteredSignals.map((sig) => {
                         const isExpanded = expandedShardId === sig.id;
                         return (
                           <div key={sig.id} className="animate-in slide-in-from-bottom-2 flex flex-col">
                              <div 
                                 onClick={() => setExpandedShardId(isExpanded ? null : sig.id)}
                                 className={`grid grid-cols-12 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer border-l-[12px] ${
                                   sig.read ? 'border-transparent opacity-40' : 
                                   sig.priority === 'critical' ? 'border-rose-600 animate-pulse' : 
                                   sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-600'
                                 }`}
                              >
                                 <div className="col-span-5 flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                       {sig.actionIcon ? <sig.actionIcon size={24} /> : <MessageSquare size={24} />}
                                    </div>
                                    <div>
                                       <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{sig.title}</h4>
                                       <p className="text-sm text-slate-500 italic mt-3 line-clamp-1 opacity-80 group-hover:opacity-100 font-medium">"{sig.message}"</p>
                                    </div>
                                 </div>

                                 <div className="col-span-3 flex justify-center gap-3">
                                    {sig.dispatchLayers.map((layer, idx) => (
                                       <div key={idx} className={`p-2.5 rounded-xl border transition-all ${layer.status === 'SENT' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-800'}`} title={`${layer.channel}: ${layer.status}`}>
                                          {layer.channel === 'EMAIL' ? <Mail size={14} /> : 
                                           layer.channel === 'PHONE' ? <Smartphone size={14} /> :
                                           layer.channel === 'INBOX' ? <Database size={14} /> : <Monitor size={14} />}
                                       </div>
                                    ))}
                                 </div>

                                 <div className="col-span-2 text-center">
                                    <p className="text-sm font-mono font-black text-indigo-400">14ms</p>
                                 </div>

                                 <div className="col-span-2 text-right pr-6 flex items-center justify-end gap-3">
                                    <span className="text-[10px] font-black text-slate-700 font-mono uppercase italic">{sig.id}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                                 </div>
                              </div>

                              {isExpanded && (
                                <div className="p-12 md:px-24 bg-black/80 border-y border-white/5 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                                   <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                                      <div className="lg:col-span-7 space-y-10">
                                         <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                            <Workflow className="text-indigo-400 w-5 h-5" />
                                            <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Routing_Diagnostic_Shard</h5>
                                         </div>
                                         <div className="space-y-6">
                                            {sig.dispatchLayers.map((layer, idx) => (
                                              <div key={idx} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-white/20 transition-all">
                                                 <div className="flex items-center gap-6">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${layer.status === 'SENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-700'}`}>
                                                       {layer.channel === 'EMAIL' ? <Mail size={20} /> : layer.channel === 'PHONE' ? <Smartphone size={20} /> : <Monitor size={20} />}
                                                    </div>
                                                    <div>
                                                       <p className="text-sm font-black text-white uppercase italic leading-none">{layer.channel} Channel</p>
                                                       <p className="text-[10px] text-slate-600 font-mono mt-2 uppercase tracking-widest">{layer.status} @ {layer.timestamp}</p>
                                                    </div>
                                                 </div>
                                                 {layer.status === 'SENT' ? <BadgeCheck size={20} className="text-emerald-500" /> : <Loader2 size={20} className="text-indigo-400 animate-spin" />}
                                              </div>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="lg:col-span-5 space-y-8">
                                         <div className="p-10 rounded-[48px] bg-indigo-500/5 border border-indigo-500/10 shadow-inner group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot size={200} /></div>
                                            <div className="flex items-center gap-4 mb-8 border-b border-indigo-500/20 pb-6 relative z-10">
                                               <Sparkles className="w-5 h-5 text-indigo-400" />
                                               <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Core Oracle Remark</h5>
                                            </div>
                                            <p className="text-slate-300 text-xl leading-relaxed italic font-medium relative z-10">
                                               "{sig.aiRemark}"
                                            </p>
                                         </div>
                                         <div className="flex gap-4">
                                            <button onClick={() => handleResolve(sig.id)} className="flex-1 py-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[40px] font-black text-sm uppercase tracking-[0.4em] shadow-3xl transition-all border-4 border-white/10 active:scale-95 flex items-center justify-center gap-4 ring-8 ring-indigo-500/5">
                                               RESOLVE_SHARD <ChevronRight size={24} />
                                            </button>
                                            <button onClick={() => handleDismiss(sig.id)} className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-700 hover:text-rose-500 transition-all shadow-xl active:scale-90"><History size={32} /></button>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                              )}
                           </div>
                         );
                       })
                    )}
                 </div>

                 <div className="p-10 border-t border-white/5 bg-black/90 flex justify-between items-center relative z-20 shrink-0">
                    <div className="flex items-center gap-10">
                       <div className="flex items-center gap-3">
                          <Activity size={18} className="text-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Network_Resonance: 94.2%</span>
                       </div>
                       <div className="flex items-center gap-3 border-l border-white/10 pl-10">
                          <Workflow size={18} className="text-indigo-400" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Just-In-Time_Allocation: Active</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <button onClick={() => setSignals([])} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 flex items-center gap-3 px-6 py-3 rounded-full bg-rose-600/5 border border-rose-500/20 transition-all">
                          <Trash2 size={16} /> PURGE BUFFER
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {activeView === 'planner' && (
              <div className="glass-card rounded-[80px] p-12 md:p-20 border-2 border-indigo-500/20 bg-indigo-950/5 shadow-3xl text-center space-y-16 animate-in zoom-in duration-700 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><History size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.4)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                       <Target size={56} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">LIVE <span className="text-indigo-400">PULSE PLANNER</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto opacity-80">
                          "Strategizing the network heartbeat. Planning multi-channel signal pulses to ensure planetary synchronization across all steward nodes."
                       </p>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-white/5">
                       {pulseSchedule.map((pulse, i) => (
                         <div key={pulse.id} className="p-8 bg-black/60 rounded-[48px] border-2 border-white/5 flex items-center justify-between group/pulse hover:border-indigo-500/40 transition-all shadow-inner">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover/pulse:scale-110 transition-all shadow-xl">
                                  <div className="text-lg font-mono font-black italic">{pulse.id}</div>
                               </div>
                               <div className="text-left">
                                  <h5 className="text-xl font-black text-white uppercase italic leading-none">{pulse.label}</h5>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">TIER: {pulse.type} // {pulse.time}</p>
                               </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl ${
                               pulse.status === 'WAITING' ? 'bg-amber-600/10 text-amber-500 border-amber-500/20 animate-pulse' : 'bg-white/5 text-slate-700 border-white/5'
                            }`}>{pulse.status}</div>
                         </div>
                       ))}
                    </div>

                    <button className="px-24 py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all ring-[16px] ring-white/5 border-2 border-white/10">INITIALIZE NEW PULSE SHARD</button>
                 </div>
              </div>
            )}
         </div>

         {/* RIGHT: Operational Meta Shard */}
         <div className="xl:col-span-4 space-y-10">
            <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col justify-center items-center text-center space-y-12 shadow-3xl relative overflow-hidden group/oracle">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><Bot size={350} className="text-indigo-400" /></div>
               <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 relative z-10 animate-float">
                  <Bot size={48} className="text-white animate-pulse" />
               </div>
               <div className="space-y-6 relative z-10">
                  <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Dispatcher <span className="text-indigo-400">Oracle</span></h4>
                  <p className="text-slate-400 text-xl leading-relaxed italic px-8 font-medium">
                     "Allocating information shards based on node load and regional m-constant drift. Communication latency currently at absolute minimum."
                  </p>
               </div>
               <div className="p-10 bg-black/60 rounded-[56px] border-2 border-indigo-500/20 w-full relative z-10 shadow-inner group-hover/oracle:border-indigo-400 transition-colors">
                  <p className="text-[11px] text-slate-700 uppercase font-black tracking-[0.5em] mb-4">Adsorption Efficiency</p>
                  <p className="text-8xl font-mono font-black text-indigo-400 tracking-tighter leading-none drop-shadow-2xl">99<span className="text-2xl italic font-sans text-indigo-700 ml-1">.8%</span></p>
               </div>
            </div>

            <div className="p-12 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/5 space-y-10 shadow-xl relative overflow-hidden group/integrity">
               <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/integrity:rotate-12 transition-transform duration-1000"><ShieldCheck size={250} className="text-emerald-400" /></div>
               <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-emerald-600 rounded-2xl shadow-3xl"><ShieldPlus size={24} className="text-white" /></div>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-widest">Signal Integrity</h4>
               </div>
               <p className="text-slate-400 text-lg italic leading-relaxed relative z-10 border-l-[8px] border-emerald-500/30 pl-10">
                  "Every signal is cryptographically bound to a SEHTI pillar, ensuring authentic information sharding across the ecosystem."
               </p>
               <button className="relative z-10 w-full py-5 bg-black/60 hover:bg-emerald-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest transition-all border border-white/10">Audit Communication Ledger</button>
            </div>
         </div>
      </div>

      <style>{`
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

export default SignalCenter;
