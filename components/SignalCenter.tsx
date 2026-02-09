
import React, { useState, useMemo, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { 
  Signal, Terminal, Search, Zap, ShieldCheck, Activity, 
  BadgeCheck, Fingerprint, Clock, ChevronRight, X, 
  History, ArrowUpRight, Bot, ShieldAlert, Bell, Trash2, 
  Workflow, Target, Circle, Sparkles, ChevronDown, Share2,
  Mail, Smartphone, MessageSquare, Monitor, Send, 
  Layers, Database, Network, Radio,
  SmartphoneNfc, Gavel,
  CalendarDays,
  Loader2,
  ShieldPlus,
  CalendarCheck,
  ZapOff,
  Sun,
  Moon,
  ThermometerSun,
  ListTodo,
  Stamp,
  Coins,
  Wind,
  Box,
  Binary,
  Siren
} from 'lucide-react';
import { User, SignalShard, ViewState } from '../types';

interface SignalCenterProps {
  user: User;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

// Map string icon names to Lucide components
const DynamicIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 18, className = "" }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.MessageSquare;
  return <IconComponent size={size} className={className} />;
};

const SignalCenter: React.FC<SignalCenterProps> = ({ user, signals = [], setSignals, onNavigate, initialSection }) => {
  const [activeView, setActiveView] = useState<'terminal' | 'ledger' | 'jit' | 'topology'>('terminal');
  const [filter, setFilter] = useState<'all' | 'task' | 'system' | 'commerce' | 'pulse' | 'liturgical' | 'ledger_anchor' | 'emergency'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedShardId, setExpandedShardId] = useState<string | null>(null);

  // Vector Routing Logic
  useEffect(() => {
    if (initialSection) {
      setActiveView(initialSection as any);
    }
  }, [initialSection]);

  const [pulseSchedule] = useState([
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
    // In a real backend-driven app, we would update Firestore here
    setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const getLedgerColor = (context: string) => {
    switch(context) {
      case 'TREASURY': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'CARBON': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'REVENUE': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'RESOLUTION': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      case 'INVENTION': return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
      case 'EMERGENCY': return 'text-rose-600 border-rose-500/20 bg-rose-500/5';
      default: return 'text-slate-400 border-white/5 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-1 md:px-4 relative overflow-hidden">
      
      {/* 1. Network Signal HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-8 md:p-12 rounded-[40px] md:rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 md:gap-14 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Network size={500} className="text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] md:rounded-[48px] bg-indigo-700 shadow-2xl flex items-center justify-center ring-4 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Signal className="text-white animate-pulse" size={56} />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[40px] md:rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-3">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] md:text-[9px] font-black uppercase rounded-full tracking-widest border border-indigo-500/20 italic">COMM_TERMINAL_v6.5</span>
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[9px] font-black uppercase rounded-full tracking-widest border border-emerald-500/20 italic text-nowrap">SYNC_OK</span>
                 </div>
                 <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">SIGNAL <span className="text-indigo-400">CORE.</span></h2>
              </div>
              <p className="text-slate-400 text-base md:text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Central communications gateway responsible for the adsorption and cross-channel allocation of industrial signals."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[40px] md:rounded-[48px] border border-white/5 bg-black/40 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-3xl group min-h-[300px]">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-3 relative z-10">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 italic opacity-60">ACTIVE_DISPATCH_LOAD</p>
              <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto flex items-center justify-center">
                 <div className="absolute inset-0 border-6 border-white/5 rounded-full"></div>
                 <div className="absolute inset-0 border-t-6 border-indigo-500 rounded-full animate-spin"></div>
                 <h4 className="text-2xl md:text-3xl font-mono font-black text-white">84<span className="text-xs text-indigo-500 ml-1">%</span></h4>
              </div>
              <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mt-4">All Channels Nominal</p>
           </div>
           <div className="w-full space-y-2 pt-6 border-t border-white/5 relative z-10">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Ledger Finality</span>
                 <span className="text-indigo-400 font-mono italic">SYNCING</span>
              </div>
              <div className="h-0.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" style={{ width: '84%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Operational Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 px-4 relative z-20">
         <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-2xl w-fit border border-white/5 bg-black/40 shadow-xl px-4 overflow-x-auto scrollbar-hide">
           {[
             { id: 'terminal', label: 'Inbound Terminal', icon: Terminal },
             { id: 'ledger', label: 'Global Ledger Feed', icon: History },
             { id: 'jit', label: 'JIT Scheduler', icon: Zap },
             { id: 'topology', label: 'Signal Topology', icon: Network },
           ].map(v => (
             <button 
               key={v.id} 
               onClick={() => setActiveView(v.id as any)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeView === v.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
             >
               <v.icon size={14} /> {v.label}
             </button>
           ))}
         </div>
         
         <div className="relative group w-full lg:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
            <input 
               type="text" 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Filter signals..." 
               className="w-full bg-black/60 border border-white/10 rounded-full py-3 pl-10 pr-6 text-xs text-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono italic shadow-inner"
            />
         </div>
      </div>

      {/* 3. Filter Ribbon */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
         {['all', 'emergency', 'ledger_anchor', 'liturgical', 'task', 'system', 'commerce', 'pulse'].map(f => (
           <button 
             key={f} 
             onClick={() => setFilter(f as any)}
             className={`px-6 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-white text-black border-white' : 'bg-black/60 border-white/5 text-slate-600 hover:text-white'}`}
           >
              {f.toUpperCase()}
           </button>
         ))}
      </div>

      <div className="min-h-[600px] relative z-10 px-4 md:px-0">
         {activeView === 'terminal' || activeView === 'ledger' ? (
           <div className="glass-card rounded-[48px] md:rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col relative">
              <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01] grid grid-cols-12 text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest italic px-10 relative z-10">
                 <div className="col-span-5">Signal Designation</div>
                 <div className="col-span-3 text-center">Origin Node</div>
                 <div className="col-span-2 text-center">Priority</div>
                 <div className="col-span-2 text-right">Actions</div>
              </div>

              <div className="divide-y divide-white/5 bg-[#050706] relative z-10 overflow-y-auto custom-scrollbar h-[650px]">
                 {filteredSignals.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                       <Terminal size={100} className="text-slate-600" />
                       <p className="text-xl font-black uppercase tracking-[0.4em] text-white italic">BUFFER_CLEAR</p>
                    </div>
                 ) : (
                    filteredSignals.map((sig) => {
                      const isExpanded = expandedShardId === sig.id;
                      const isLedger = sig.type === 'ledger_anchor';
                      const isEmergency = sig.type === 'emergency';
                      const ledgerContext = sig.meta?.ledgerContext || 'NONE';
                      const ledgerColor = getLedgerColor(ledgerContext);

                      return (
                        <div key={sig.id} className="animate-in slide-in-from-bottom-1 flex flex-col">
                           <div 
                              onClick={() => setExpandedShardId(isExpanded ? null : sig.id)}
                              className={`grid grid-cols-12 p-8 md:p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer border-l-[8px] ${
                                sig.read ? 'border-transparent opacity-40' : 
                                isEmergency ? 'border-rose-600 animate-pulse bg-rose-500/5' :
                                isLedger ? `border-${ledgerColor.split(' ')[0].replace('text-', '')} ${ledgerColor.split(' ').slice(2).join(' ')}` :
                                sig.priority === 'critical' ? 'border-rose-600 animate-pulse' : 
                                sig.priority === 'high' ? 'border-amber-500' : 'border-indigo-600'
                              }`}
                           >
                              <div className="col-span-5 flex items-center gap-5">
                                 <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-all shrink-0 ${isEmergency ? 'bg-rose-600/10 border-rose-500/30 text-rose-500' : isLedger ? ledgerColor : 'bg-white/5 border-white/10 text-indigo-400'}`}>
                                    <DynamicIcon name={sig.actionIcon || 'MessageSquare'} size={24} />
                                 </div>
                                 <div className="truncate pr-4">
                                    <h4 className="text-sm md:text-lg font-black text-white uppercase italic tracking-tight m-0 leading-none group-hover:text-indigo-400 transition-colors truncate">
                                      {isLedger && <span className="text-[10px] mr-2 opacity-50">[{ledgerContext}]</span>}
                                      {isEmergency && <span className="text-[10px] mr-2 text-rose-500">[ALERT]</span>}
                                      {sig.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 italic mt-2 line-clamp-1 opacity-80 group-hover:opacity-100 font-medium">"{sig.message}"</p>
                                 </div>
                              </div>

                              <div className="col-span-3 text-center">
                                 <span className="text-[9px] font-mono font-black text-slate-600 group-hover:text-white transition-colors">{sig.origin} // {new Date(sig.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>

                              <div className="col-span-2 text-center">
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                                   sig.priority === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                   sig.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                   'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                 }`}>{sig.priority}</span>
                              </div>

                              <div className="col-span-2 text-right pr-4 flex items-center justify-end gap-2">
                                 <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                              </div>
                           </div>

                           {isExpanded && (
                             <div className="p-8 md:p-14 bg-black/80 border-y border-white/5 animate-in slide-in-from-top-2 duration-500 relative overflow-hidden">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                                   <div className="lg:col-span-7 space-y-6">
                                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                         <Workflow className="text-indigo-400 w-4 h-4" />
                                         <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic">Routing_Diagnostic</h5>
                                      </div>
                                      <div className="space-y-4">
                                         {sig.dispatchLayers.map((layer, idx) => (
                                           <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                              <div className="flex items-center gap-4">
                                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${layer.status === 'SENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-700'}`}>
                                                    {layer.channel === 'EMAIL' ? <Mail size={16} /> : layer.channel === 'PHONE' ? <Smartphone size={16} /> : <Monitor size={16} />}
                                                 </div>
                                                 <div>
                                                    <p className="text-[10px] font-black text-white uppercase italic leading-none">{layer.channel}</p>
                                                    <p className="text-[8px] text-slate-600 font-mono mt-1 uppercase tracking-widest">{layer.status}</p>
                                                 </div>
                                              </div>
                                              {layer.status === 'SENT' ? <BadgeCheck size={16} className="text-emerald-500" /> : <Loader2 size={16} className="text-indigo-400 animate-spin" />}
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="lg:col-span-5 space-y-6">
                                      <div className="p-6 rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 shadow-inner group relative overflow-hidden">
                                         <div className="flex items-center gap-3 mb-6 border-b border-indigo-500/20 pb-4 relative z-10">
                                            <Sparkles className="w-4 h-4 text-indigo-400" />
                                            <h5 className="text-[9px] font-black text-white uppercase tracking-widest italic">Oracle Summary</h5>
                                         </div>
                                         <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic font-medium relative z-10">
                                            "{sig.aiRemark}"
                                         </p>
                                      </div>
                                      <div className="flex gap-3">
                                         <button onClick={() => handleResolve(sig.id)} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                            VIEW LEDGER ORIGIN <ChevronRight size={16} />
                                         </button>
                                         <button onClick={() => handleDismiss(sig.id)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-rose-500 transition-all shadow-xl active:scale-90 shrink-0"><History size={20} /></button>
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
           </div>
         ) : null}

         {activeView === 'jit' && (
             <div className="xl:col-span-12 space-y-12 animate-in slide-in-from-top-6 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="glass-card p-12 rounded-[56px] border border-emerald-500/20 bg-emerald-950/10 space-y-10 shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><CalendarDays size={400} className="text-emerald-400" /></div>
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl"><Zap className="w-8 h-8 text-white fill-current" /></div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Just-In-Time <span className="text-emerald-400">Trigger Matrix</span></h3>
                      </div>
                      <div className="space-y-6 relative z-10">
                         <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic border-b border-white/5 pb-4">Upcoming_Resonance_Pulse</h5>
                            <div className="space-y-4">
                               {pulseSchedule.map(p => (
                                  <div key={p.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group/item hover:border-emerald-500/30 transition-all">
                                     <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-indigo-500/20 rounded-full group-hover/item:bg-indigo-500 transition-colors"></div>
                                        <div>
                                           <p className="text-sm font-black text-white uppercase italic leading-none">{p.label}</p>
                                           <p className="text-[8px] text-slate-600 font-mono mt-1 uppercase">{p.type} // TQM_ID: {p.id}</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-lg font-mono font-black text-emerald-400 leading-none">{p.time}</p>
                                        <span className="text-[7px] font-bold text-slate-700 uppercase tracking-widest">{p.status}</span>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="glass-card p-12 rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 space-y-10 shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><ListTodo size={400} className="text-indigo-400" /></div>
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><CalendarCheck className="w-8 h-8 text-white" /></div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Integrated <span className="text-indigo-400">External Shards</span></h3>
                      </div>
                      <div className="space-y-6 relative z-10">
                         <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner min-h-[300px] flex flex-col justify-center items-center text-center">
                            <Bot size={64} className="text-indigo-400 animate-float mb-6 opacity-30" />
                            <p className="text-slate-500 italic text-sm">"Sync Google Calendar via the Agro Calendar bridge to see external JIT tasks here."</p>
                            <button onClick={() => onNavigate('agro_calendar')} className="mt-8 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all">Go to Calendar Bridge</button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeView === 'topology' && (
              <div className="xl:col-span-12 animate-in fade-in duration-1000">
                <div className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 min-h-[600px] flex flex-col items-center justify-center text-center space-y-12 shadow-3xl relative overflow-hidden">
                   <Network size={200} className="text-indigo-500 animate-spin-slow opacity-20" />
                   <div className="space-y-4">
                      <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Signal <span className="text-indigo-400">Topology Map</span></h3>
                      <p className="text-slate-500 text-xl font-medium italic">"Visualizing the real-time routing of sharded information across global relay nodes."</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-center">
                         <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Active Relays</p>
                         <p className="text-3xl font-mono font-black text-white">42</p>
                      </div>
                      <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-center">
                         <p className="text-[10px] text-slate-600 uppercase font-black mb-1">Average Hop</p>
                         <p className="text-3xl font-mono font-black text-indigo-400">1.2ms</p>
                      </div>
                   </div>
                </div>
              </div>
           )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
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
