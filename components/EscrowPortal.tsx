import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, ShieldAlert, Clock, ArrowRight, ShieldCheck, 
  Handshake, Globe, Zap, Cpu, History, AlertTriangle,
  Info, CheckCircle2, ChevronRight, Binary, FileSignature, Box, Search, Wallet
} from 'lucide-react';
import { createEscrowContract, releaseEscrow } from '../services/escrowService';
import { EscrowContract, User } from '../types';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface EscrowPortalProps {
  user: User;
}

const EscrowPortal: React.FC<EscrowPortalProps> = ({ user }) => {
  const [contracts, setContracts] = useState<EscrowContract[]>([
    { 
      id: 'ESC-SHARD-9921', 
      buyerEsin: user.esin, 
      sellerEsin: 'EA-ROBO-9214', 
      amount: 1200, 
      status: 'LOCKED',
      milestones: [
        { id: 'M1', description: 'Design Approval', completed: true },
        { id: 'M2', description: 'Prototype Alpha', completed: false }
      ]
    },
    { 
      id: 'ESC-LAND-1042', 
      buyerEsin: 'EA-GAIA-1104', 
      sellerEsin: user.esin, 
      amount: 5400, 
      status: 'RELEASED',
      milestones: [{ id: 'M3', description: 'Land Verify', completed: true }]
    }
  ]);

  const [activeStep, setActiveStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [newEscrow, setNewEscrow] = useState({ seller: '', amount: 100, desc: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const sc = createEscrowContract(user.esin, newEscrow.seller, newEscrow.amount);
    setContracts([sc, ...contracts]);
    setIsCreating(false);
    toast.success('Escrow Anchor Initialized. Funds sharded across network.');
  };

  const handleRelease = (id: string) => {
    releaseEscrow(id);
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'RELEASED' } : c));
    toast.success('Shard Released. Settlement synchronized.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-24 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Escrow Portal" description="Secure Smart Contract Escrow: Lock funds and automate settlements in the EnvirosAgro blockchain ecosystem." />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
            Quantum <span className="text-indigo-400">Escrow</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Mesh_Settlement_Terminal_v2.0</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <ShieldCheck size={16} className="text-emerald-400" />
              <div className="text-left">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Protocol_Stability</p>
                 <p className="text-xs font-black text-white">99.98%</p>
              </div>
           </div>
           <button 
             onClick={() => setIsCreating(true)}
             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all"
           >
             <Plus size={14} /> Anchor New
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Contracts Feed */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <History size={14} /> Active_Deployment_Feed
              </h3>
              <div className="flex items-center gap-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                 <span>ALL</span>
                 <span className="text-indigo-400 underline decoration-2 underline-offset-4">LOCKED</span>
                 <span>RELEASED</span>
              </div>
           </div>

           <div className="space-y-4">
              {contracts.map(escrow => (
                <div key={escrow.id} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/60 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Binary size={100} className="text-indigo-500" />
                   </div>

                   <div className="flex flex-col md:flex-row justify-between gap-8 mb-8 relative z-10 text-left">
                      <div className="flex items-start gap-5">
                         <div className={`w-14 h-14 rounded-3xl flex items-center justify-center border-2 ${escrow.status === 'LOCKED' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'}`}>
                            {escrow.status === 'LOCKED' ? <Lock size={24} /> : <Unlock size={24} />}
                         </div>
                         <div>
                            <p className="text-[8px] text-slate-500 font-mono tracking-widest leading-none mb-1">{escrow.id}</p>
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Smart_Settlement</h4>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                  <span className="text-[7px] font-black text-slate-300 uppercase underline decoration-indigo-500/30 underline-offset-4">{escrow.buyerEsin}</span>
                               </div>
                               <ArrowRight size={10} className="text-slate-700" />
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                  <span className="text-[7px] font-black text-slate-300 uppercase underline decoration-emerald-500/30 underline-offset-4">{escrow.sellerEsin}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="text-left md:text-right">
                         <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest mb-1">Contract_Value</p>
                         <p className="text-2xl font-black text-white tracking-widest">{escrow.amount}<span className="text-[10px] text-indigo-400 ml-1">EAC</span></p>
                         <span className={`inline-block px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest mt-2 border ${escrow.status === 'LOCKED' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400' : 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'}`}>
                            STATUS: {escrow.status}
                         </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
                      <div className="space-y-4">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={10} className="text-amber-400" /> Verification_Milestones
                         </p>
                         <div className="space-y-3">
                            {escrow.milestones.map(m => (
                              <div key={m.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl">
                                 <span className="text-[9px] font-bold text-slate-300 italic">"{m.description}"</span>
                                 {m.completed ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Clock size={14} className="text-slate-700 animate-pulse" />}
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex flex-col justify-end gap-3">
                         {escrow.status === 'LOCKED' ? (
                           <button 
                             onClick={() => handleRelease(escrow.id)}
                             className="w-full py-4 bg-white text-black hover:bg-slate-200 transition-all rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
                           >
                             EXECUTE_RELEASE_SHARD <Handshake size={16} />
                           </button>
                         ) : (
                           <div className="w-full py-4 bg-white/5 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center italic border border-white/5">
                             SETTLEMENT_FINALIZED
                           </div>
                         )}
                         <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all">VIEW_EXPLORER_LEDGER</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 rounded-[28px] bg-indigo-600/10 border border-indigo-400/20 flex items-center justify-center mx-auto mb-4">
                    <Globe size={32} className="text-indigo-400 animate-spin-slow" />
                 </div>
                 <h3 className="text-lg font-black text-white uppercase italic">Network_Relay</h3>
                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Shard distribution monitoring.</p>
              </div>

              <div className="space-y-4">
                 {[
                   { node: 'Nairobi_Hub_01', health: 98, status: 'Synced' },
                   { node: 'Valencia_Sec_D', health: 94, status: 'Active' },
                   { node: 'Tokyo_Relay_X', health: 99, status: 'Synced' },
                 ].map((node, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${node.health > 95 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{node.node}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 uppercase font-bold">{node.health}%</span>
                   </div>
                 ))}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Collateralization</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-black">150%_OVER</span>
                 </div>
                 <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '85%' }}></div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-amber-500/20 bg-amber-500/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <AlertTriangle size={20} />
                 </div>
                 <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Risk_Analyzer</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-[0.1em] italic">
                 "No active disputes detected in your vector. Handshake consensus remains locked."
              </p>
              <button className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">INITIATE_VOID_DISPUTE</button>
           </div>
        </div>
      </div>

      {/* Create Escrow Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl glass-card rounded-[48px] border border-white/10 bg-[#050706] p-10 space-y-8 relative overflow-hidden"
            >
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Anchor_Asset</h3>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">New_Smart_Settlement_Process</p>
                  </div>
                  <button onClick={() => setIsCreating(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
               </div>

               <form onSubmit={handleCreate} className="space-y-6 relative z-10">
                  <div className="space-y-4">
                     <div className="space-y-2 px-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Counterparty_ESIN</label>
                        <div className="relative">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                           <input 
                             type="text" 
                             required
                             placeholder="EA-ROBO-XXXX" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                             value={newEscrow.seller}
                             onChange={e => setNewEscrow({...newEscrow, seller: e.target.value.toUpperCase()})}
                           />
                        </div>
                     </div>

                     <div className="space-y-2 px-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Settlement_Amount (EAC)</label>
                        <div className="relative">
                           <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
                           <input 
                             type="number" 
                             required
                             placeholder="0.00" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                             value={newEscrow.amount}
                             onChange={e => setNewEscrow({...newEscrow, amount: parseInt(e.target.value)})}
                           />
                        </div>
                     </div>

                     <div className="space-y-2 px-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Contract_Objective</label>
                        <textarea 
                          required
                          placeholder="Describe the asset or service sharding..."
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono h-24"
                          value={newEscrow.desc}
                          onChange={e => setNewEscrow({...newEscrow, desc: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl flex items-start gap-4">
                     <Info className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                     <p className="text-[9px] text-slate-500 italic font-medium leading-relaxed uppercase tracking-widest">
                        Initializing this anchor will lock the specified amount from your EAC Treasury. Unlocking requires cross-node consensus.
                     </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4"
                  >
                     EXECUTE_SMART_ANCHOR <Zap size={18} />
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Plus = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export default EscrowPortal;
