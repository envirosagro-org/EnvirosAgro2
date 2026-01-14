import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Loader2, 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  X, 
  Zap, 
  Briefcase, 
  Database, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Star, 
  HardHat, 
  ShieldAlert, 
  MapPin, 
  ClipboardCheck, 
  Stamp, 
  ArrowRight,
  Activity,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { User } from '../types';

interface NexusCRMProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const INITIAL_SERVICES = [
  { id: 'SRVC-01', name: 'Bio-Compost Delivery', provider: 'Green Soil Nodes', status: 'Verified', category: 'Input Supply', trust: 98, desc: 'Eco-friendly compost delivery with ZK-proven carbon offsets.' },
  { id: 'SRVC-02', name: 'Spectral Drone Auditing', provider: 'SkyScout Inc', status: 'Pending Audit', category: 'Logistics', trust: 75, desc: 'High-altitude multi-spectral soil moisture analysis shards.' },
  { id: 'SRVC-03', name: 'Ancestral Seed Vouching', provider: 'Bantu Heritage', status: 'Verified', category: 'Consultation', trust: 99, desc: 'Verification of lineage-based seed purity and drought resistance.' },
];

const NexusCRM: React.FC<NexusCRMProps> = ({ user, onSpendEAC }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredServices, setRegisteredServices] = useState(INITIAL_SERVICES);
  const [showRegisterService, setShowRegisterService] = useState(false);
  const [regStep, setRegStep] = useState<'form' | 'audit_pending' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Service Registration Form State
  const [serviceName, setServiceName] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Consultation');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !serviceProvider.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newService = {
        id: `SRVC-EXT-${Math.floor(Math.random() * 1000)}`,
        name: serviceName,
        provider: serviceProvider,
        status: 'Pending Audit',
        category: serviceCategory,
        trust: 0,
        desc: serviceDesc
      };
      
      setRegisteredServices([newService, ...registeredServices]);
      setIsSubmitting(false);
      setRegStep('audit_pending');
      onSpendEAC(50, 'AGRO_SERVICE_REGISTRATION_FEE');
    }, 2000);
  };

  const filteredServices = registeredServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.provider.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-0">
      
      {/* Refactored Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="lg:col-span-3 glass-card p-6 md:p-10 rounded-[32px] md:rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-6 md:gap-12 shadow-xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Briefcase className="w-64 h-64 md:w-96 md:h-96 text-white" />
           </div>
           <div className="w-24 h-24 md:w-40 md:h-40 rounded-[24px] md:rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-2xl ring-4 ring-white/10 shrink-0">
              <HeartHandshake className="w-12 h-12 md:w-20 md:h-20 text-white" />
           </div>
           <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-1 md:space-y-2">
                 <span className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[10px] font-black uppercase rounded-full tracking-[0.3em] md:tracking-[0.4em] border border-emerald-500/20">EXTERNAL_AGRO_SERVICES</span>
                 <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Nexus <span className="text-emerald-400">Registry</span></h2>
              </div>
              <p className="text-slate-400 text-sm md:text-xl leading-relaxed max-w-2xl font-medium px-2 md:px-0">
                 Authorized catalog of agricultural services provided by stewards to consumers. Register your service for physical verification and global network sharding.
              </p>
              <button 
                onClick={() => { setShowRegisterService(true); setRegStep('form'); }}
                className="w-full sm:w-auto px-8 py-4 agro-gradient rounded-2xl md:rounded-3xl text-white font-black text-[10px] md:text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3"
              >
                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" /> Register Service Node
              </button>
           </div>
        </div>
        
        <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-lg">
           <div className="space-y-1 relative z-10">
              <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-1">Active Shards</p>
              <h4 className="text-5xl md:text-7xl font-mono font-black text-white tracking-tighter">{registeredServices.length}</h4>
           </div>
           <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase text-slate-600">
                 <span>Verification Hub</span>
                 <span className="text-emerald-400">Syncing</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_100px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Services Interface */}
      <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-1 md:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 border-b border-white/5 pb-6 px-4">
          <div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Agro-Service <span className="text-emerald-400">Directory</span></h3>
              <p className="text-slate-500 text-xs md:text-sm mt-2">Verified consumer-facing nodes sharded across regional clusters.</p>
          </div>
          <div className="relative group w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter services or providers..." 
              className="w-full bg-black/60 border border-white/10 rounded-xl md:rounded-2xl py-3 pl-10 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredServices.map(srv => (
              <div key={srv.id} className="glass-card p-6 md:p-8 rounded-[24px] md:rounded-[44px] border border-white/5 flex flex-col group hover:border-emerald-500/30 transition-all shadow-md bg-black/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-white/10 ${
                      srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                    }`}>
                      {srv.status === 'Verified' ? <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" /> : <Clock className="w-6 h-6 md:w-8 md:h-8" />}
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase border tracking-widest ${
                          srv.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>{srv.status}</span>
                      <div className="flex items-center gap-1">
                          <Star size={10} className="text-emerald-400 fill-current" />
                          <span className="text-[10px] font-mono font-black text-white">{srv.trust}% Trust</span>
                      </div>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <h4 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none">{srv.name}</h4>
                    <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{srv.provider} • {srv.category}</p>
                    <p className="text-xs text-slate-400 leading-relaxed italic mt-4 line-clamp-2">"{srv.desc}"</p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-mono text-slate-700 tracking-tighter uppercase">{srv.id}</span>
                    <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                      View Shard <ArrowRight size={12} />
                    </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* --- REGISTRATION MODAL --- */}
      {showRegisterService && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-2 md:p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterService(false)}></div>
           
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[32px] md:rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              <div className="p-6 md:p-16 space-y-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterService(false)} className="absolute top-6 right-6 md:top-12 md:right-12 p-3 md:p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-5 h-5 md:w-8 md:h-8" /></button>
                 
                 {/* Progress Stepper */}
                 <div className="flex gap-2 md:gap-4 shrink-0">
                    {[
                      { l: 'Metadata', s: 'form' },
                      { l: 'Physical Audit', s: 'audit_pending' },
                      { l: 'Registry Sync', s: 'success' },
                    ].map((step, i) => {
                       const stages = ['form', 'audit_pending', 'success'];
                       const currentIdx = stages.indexOf(regStep);
                       const isActive = i === currentIdx;
                       const isDone = i < currentIdx;
                       return (
                         <div key={step.s} className="flex-1 flex flex-col gap-1 md:gap-2">
                           <div className={`h-1.5 md:h-2 rounded-full transition-all duration-700 ${isDone ? 'bg-emerald-500 shadow-[0_0_100px_#10b981]' : isActive ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[6px] md:text-[8px] font-black uppercase text-center tracking-widest ${isActive ? 'text-emerald-400' : 'text-slate-700'}`}>{step.l}</span>
                         </div>
                       );
                    })}
                 </div>

                 {regStep === 'form' && (
                   <form onSubmit={handleRegisterService} className="space-y-6 md:space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-3">
                         <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                            <PlusCircle className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                         </div>
                         <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0">Service <span className="text-emerald-400">Ingest</span></h3>
                         <p className="text-slate-400 text-xs md:text-lg font-medium leading-relaxed max-w-md mx-auto italic">Any steward can register an external service. Physical audit protocol applies.</p>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Category</label>
                               <select value={serviceCategory} onChange={e => setServiceCategory(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/20">
                                  <option>Input Supply</option>
                                  <option>Logistics</option>
                                  <option>Consultation</option>
                                  <option>Equipment Hire</option>
                                  <option>Processing Node</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">GPS Node (Loc)</label>
                               <input type="text" required value={serviceLocation} onChange={e => setServiceLocation(e.target.value)} placeholder="e.g. Zone 4 Relay" className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Service Designation</label>
                               <input type="text" required value={serviceName} onChange={e => setServiceName(e.target.value)} placeholder="Service Title..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-lg md:text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Provider Entity</label>
                               <input type="text" required value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} placeholder="Legal Entity Name..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Service Narrative</label>
                               <textarea required value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="Brief description of service output..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white h-24 resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 italic" />
                            </div>
                         </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[40px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                         {isSubmitting ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Database className="w-5 h-5 md:w-6 md:h-6" />}
                         {isSubmitting ? "COMMITING SHARD..." : "AUTHORIZE REGISTRY MINT"}
                      </button>
                   </form>
                 )}

                 {regStep === 'audit_pending' && (
                    <div className="flex-1 flex flex-col animate-in slide-in-from-right-6 duration-500 h-full justify-center space-y-10 md:space-y-12">
                       <div className="text-center space-y-4 md:space-y-6">
                          <div className="w-20 h-20 md:w-32 md:h-32 bg-amber-500/10 rounded-[24px] md:rounded-[40px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative group">
                             <HardHat className="w-10 h-10 md:w-16 md:h-16 text-amber-500 animate-bounce" />
                             <div className="absolute inset-0 border-2 md:border-4 border-amber-500/20 rounded-[24px] md:rounded-[40px] animate-ping opacity-40"></div>
                       </div>
                       <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-amber-500">Verification</span></h3>
                       <p className="text-slate-400 text-sm md:text-lg font-medium italic max-sm:text-sm max-w-sm mx-auto leading-relaxed text-center px-4">
                          "Metadata verified. EnvirosAgro team has been dispatched to physically evaluate your agro-service facility and compliance biometrics."
                       </p>
                    </div>

                    <div className="p-6 md:p-8 bg-black/60 rounded-[32px] md:rounded-[48px] border border-white/5 space-y-6 shadow-inner">
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Verification Checklist</h5>
                       <div className="grid grid-cols-1 gap-4">
                          {[
                             { l: 'Premise Verification', i: MapPin },
                             { l: 'Tool Purity Audit', i: ShieldCheck },
                             { l: 'Framework Compliance', i: ClipboardCheck },
                             { l: 'Signature Anchor', i: Stamp },
                          ].map((check, i) => (
                             <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300 italic group">
                                <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 transition-colors">
                                   <check.i size={14} />
                                </div>
                                {check.l}
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-6">
                       <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-blue-500 shrink-0" />
                       <p className="text-[8px] md:text-[10px] text-blue-200/50 font-bold uppercase tracking-widest leading-relaxed text-left">
                          PROVISIONAL_INGEST: Service entry remains 'Pending Audit' until the physical signature is anchored.
                       </p>
                    </div>

                    <button 
                      onClick={() => setRegStep('success')}
                      className="w-full py-6 md:py-10 agro-gradient rounded-2xl md:rounded-[48px] text-white font-black text-xs md:text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 md:gap-4"
                    >
                       {/* Fix: replaced CheckCircle with the imported CheckCircle2 to resolve "Cannot find name" error */}
                       <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> COMMENCE AUDIT QUEUE
                    </button>
                    </div>
                 )}

                 {regStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-10 md:space-y-16 py-6 md:py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 md:w-48 md:h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                         <CheckCircle2 className="w-16 h-16 md:w-24 md:h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                      </div>
                      <div className="space-y-2 md:space-y-4">
                         <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Sync <span className="text-emerald-400">Anchored</span></h3>
                         <p className="text-emerald-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] font-mono">Registry Ticket: #SRVC-EXT-{(Math.random()*1000).toFixed(0)}</p>
                      </div>
                      <div className="w-full glass-card p-6 md:p-12 rounded-3xl md:rounded-[56px] border-white/5 bg-emerald-500/5 space-y-4 md:space-y-6 text-left relative overflow-hidden shadow-xl">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Building2 className="w-24 h-24 md:w-40 md:h-40 text-emerald-400" /></div>
                         <div className="flex justify-between items-center text-[10px] relative z-10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Shard Status</span>
                            <span className="text-white font-mono font-black text-xl md:text-3xl text-amber-500 uppercase italic">Awaiting Audit</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] relative z-10 pt-3 md:pt-4 border-t border-white/10">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Service Node</span>
                            <span className="text-blue-400 font-black uppercase truncate max-w-[200px]">{serviceName}</span>
                         </div>
                      </div>
                      <button onClick={() => { setShowRegisterService(false); setRegStep('form'); }} className="w-full py-6 md:py-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-[40px] text-white font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry Hub</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default NexusCRM;