import React, { useState, useMemo } from 'react';
import { 
  Signal, 
  Terminal, 
  Search, 
  Filter, 
  Zap, 
  ShieldCheck, 
  Activity, 
  BadgeCheck, 
  Fingerprint, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  History, 
  ArrowUpRight, 
  Briefcase, 
  Target, 
  Bot, 
  ShieldAlert, 
  Bell, 
  Trash2, 
  RotateCcw,
  Workflow,
  Target as TargetIcon,
  Circle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  // Added Share2 to fix the error on line 289
  Share2
} from 'lucide-react';
import { User, SignalShard, ViewState } from '../types';

interface SignalCenterProps {
  user: User;
  signals: SignalShard[];
  setSignals: React.Dispatch<React.SetStateAction<SignalShard[]>>;
  onNavigate: (view: ViewState) => void;
}

const SignalCenter: React.FC<SignalCenterProps> = ({ user, signals = [], setSignals, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'task' | 'system' | 'commerce'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedShardId, setExpandedShardId] = useState<string | null>(null);

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
    if (sig?.meta?.target) {
       onNavigate(sig.meta.target);
    }
  };

  const handleDismiss = (id: string) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const stats = useMemo(() => {
    const unread = signals.filter(s => !s.read).length;
    const tasks = signals.filter(s => s.type === 'task' && !s.meta?.isResolved).length;
    const commerce = signals.filter(s => s.type === 'commerce').length;
    return { unread, tasks, commerce };
  }, [signals]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1500px] mx-auto">
      
      {/* 1. Terminal HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        <div className="lg:col-span-3 glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Signal className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-[48px] bg-indigo-600 shadow-[0_0_80px_rgba(99,102,241,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Signal className="text-white animate-pulse" size={64} />
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">BLOCKCHAIN_SIGNAL_MESH_v6.0</span>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">SIGNAL <span className="text-indigo-400">TERMINAL.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Ingesting high-frequency industrial signals. Resolve task shards using the Tactical Roadmap to maintain node m-constant finality."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-widest mb-2 italic">Active Tasks</p>
              <h4 className="text-8xl font-mono font-black text-indigo-400 tracking-tighter leading-none drop-shadow-2xl italic">{stats.tasks}</h4>
              <div className="flex items-center justify-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mt-4">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Awaiting Roadmap Finality</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Command Hub Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-6">
           {[
             { id: 'all', label: 'All Shards', icon: Terminal },
             { id: 'task', label: 'Actionable Tasks', icon: TargetIcon },
             { id: 'commerce', label: 'Trade Signals', icon: Zap },
             { id: 'system', label: 'Network Alerts', icon: ShieldAlert },
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setFilter(t.id as any)}
               className={`flex items-center gap-4 px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <t.icon size={16} /> {t.label}
             </button>
           ))}
         </div>
         
         <div className="relative group w-full lg:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
            <input 
               type="text" 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               placeholder="Filter signal shards..." 
               className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner placeholder:text-stone-900"
            />
         </div>
      </div>

      {/* 3. Signal Ledger */}
      <div className="px-4">
         <div className="glass-card rounded-[72px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col relative min-h-[600px]">
            <div className="absolute inset-0 pointer-events-none opacity-5">
               <div className="w-full h-[1px] bg-indigo-500 absolute top-0 animate-scan"></div>
            </div>
            
            <div className="p-10 border-b border-white/5 bg-white/[0.01] grid grid-cols-12 text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-14 relative z-10">
               <div className="col-span-5">Signal Designation & Shard ID</div>
               <div className="col-span-2 text-center">Industrial Pillar</div>
               <div className="col-span-2 text-center">Timestamp</div>
               <div className="col-span-3 text-right">Resolution Protocol</div>
            </div>

            <div className="divide-y divide-white/5 bg-[#050706] relative z-10">
               {filteredSignals.length === 0 ? (
                  <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                     <div className="relative">
                        <Terminal size={140} className="text-slate-600 group-hover:text-indigo-400 transition-colors duration-1000" />
                        <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                     </div>
                     <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">SIGNAL_BUFFER_CLEAR</p>
                  </div>
               ) : (
                  filteredSignals.map((sig, i) => {
                    const isExpanded = expandedShardId === sig.id;
                    return (
                      <div key={sig.id} className="animate-in slide-in-from-bottom-2 flex flex-col" style={{ animationDelay: `${i*50}ms` }}>
                        <div 
                          onClick={() => setExpandedShardId(isExpanded ? null : sig.id)}
                          className={`grid grid-cols-12 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer border-l-[12px] ${
                            sig.read ? 'border-transparent opacity-40' : 
                            sig.priority === 'high' ? 'border-rose-600 animate-pulse-slow' : 'border-indigo-600'
                          }`}
                        >
                            <div className="col-span-5 flex items-center gap-10">
                               <div className={`w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6 ${
                                  sig.type === 'task' ? 'text-blue-400' : sig.type === 'commerce' ? 'text-emerald-400' : 'text-slate-500'
                               }`}>
                                  {sig.actionIcon ? <sig.actionIcon size={24} /> : <Terminal size={24} />}
                               </div>
                               <div>
                                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{sig.title}</h4>
                                  <p className="text-sm text-slate-500 italic mt-3 line-clamp-1 opacity-80 group-hover:opacity-100 font-medium">"{sig.message}"</p>
                                  <div className="flex items-center gap-3 mt-2">
                                     <p className="text-[9px] text-slate-700 font-mono font-bold uppercase tracking-widest">{sig.id}</p>
                                     {sig.roadmap && <span className="text-[7px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-black uppercase tracking-widest">Roadmap Attached</span>}
                                  </div>
                               </div>
                            </div>

                            <div className="col-span-2 flex flex-col items-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-inner ${
                                  sig.type === 'task' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                                  sig.type === 'commerce' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' :
                                  'bg-white/5 text-slate-600 border-white/10'
                               }`}>{sig.type}</span>
                            </div>

                            <div className="col-span-2 text-center">
                               <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">{new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>

                            <div className="col-span-3 flex justify-end gap-4 pr-6">
                               {!sig.read && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleDismiss(sig.id); }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl active:scale-90"
                                    title="Archive Shard"
                                  >
                                     <History size={20} />
                                  </button>
                               )}
                               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-700 transition-all">
                                  <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                               </div>
                            </div>
                        </div>

                        {/* EXPANDED ROADMAP & REMARKS VIEW */}
                        {isExpanded && (
                          <div className="p-12 md:px-20 bg-black/80 border-t border-white/5 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                             <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                             
                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                                {/* Tactical Roadmap Visual */}
                                <div className="lg:col-span-7 space-y-10">
                                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                      <Workflow className="text-indigo-400 w-5 h-5" />
                                      <h5 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Tactical_Roadmap_Shard</h5>
                                   </div>
                                   
                                   {sig.roadmap ? (
                                     <div className="space-y-8 relative pl-10">
                                        <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-indigo-500/40 via-blue-500/20 to-transparent"></div>
                                        {sig.roadmap.map((step, idx) => (
                                          <div key={idx} className="flex gap-8 group/step relative">
                                             <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 z-10 transition-all duration-700 bg-black ${
                                               step.status === 'COMPLETED' ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400' :
                                               step.status === 'ACTIVE' ? 'border-indigo-400 shadow-[0_0_20px_#6366f144] text-indigo-400 animate-pulse' :
                                               'border-white/10 text-slate-800'
                                             }`}>
                                                {step.status === 'COMPLETED' ? <BadgeCheck size={20} /> : <div className="text-[10px] font-mono font-black">{idx + 1}</div>}
                                             </div>
                                             <div className="space-y-1">
                                                <h6 className={`text-sm font-black uppercase tracking-widest ${step.status === 'COMPLETED' ? 'text-emerald-400' : step.status === 'ACTIVE' ? 'text-white' : 'text-slate-700'}`}>{step.label}</h6>
                                                <p className="text-xs text-slate-500 italic font-medium">"{step.description}"</p>
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                   ) : (
                                     <p className="text-xs text-slate-700 italic py-10 px-6 border-2 border-dashed border-white/5 rounded-3xl text-center">"Standard system signal. No extended roadmap shards found."</p>
                                   )}
                                </div>

                                {/* Oracle Remarks & Actions */}
                                <div className="lg:col-span-5 space-y-8">
                                   <div className="p-8 rounded-[40px] bg-indigo-500/5 border border-indigo-500/10 shadow-inner group/remark relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/remark:scale-110 transition-transform"><Bot size={120} /></div>
                                      <div className="flex items-center gap-4 mb-6 border-b border-indigo-500/20 pb-4 relative z-10">
                                         <Sparkles className="w-4 h-4 text-indigo-400" />
                                         <h5 className="text-[11px] font-black text-white uppercase tracking-widest italic">Oracle Remark</h5>
                                      </div>
                                      <p className="text-slate-300 text-sm leading-relaxed italic font-medium relative z-10">
                                         "{sig.aiRemark || 'Analyzing node context... Finality is recommended to maintain regional m-constant equilibrium.'}"
                                      </p>
                                   </div>

                                   <div className="space-y-4">
                                      <button 
                                        onClick={() => handleResolve(sig.id)}
                                        className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-3xl transition-all border-4 border-white/10 active:scale-95 flex items-center justify-center gap-3 ring-8 ring-indigo-500/5"
                                      >
                                         <ArrowUpRight size={18} />
                                         {sig.actionLabel || 'EXECUTE_SHARD'}
                                      </button>
                                      
                                      <div className="flex gap-4">
                                         <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                            <HelpCircle size={14} /> Protocol Help
                                         </button>
                                         <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl">
                                            <Share2 size={16} />
                                         </button>
                                      </div>
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

            {/* Terminal Footer */}
            <div className="p-10 border-t border-white/5 bg-black/90 flex justify-between items-center relative z-20">
               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                     <Activity size={14} className="text-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network_Resonance: 94.2%</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <Workflow size={14} className="text-indigo-400" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">L3_Finality: STABLE</span>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <button onClick={() => setSignals([])} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 flex items-center gap-2">
                     <Trash2 size={12} /> PURGE BUFFER
                  </button>
                  <div className="h-4 w-px bg-white/10"></div>
                  <p className="text-[10px] text-slate-700 font-mono font-black italic">ENVIROSAGRO_OS_SIGNAL_CENTER_V6.0</p>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default SignalCenter;