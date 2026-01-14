
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldPlus, 
  Building, 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  ClipboardCheck, 
  HardHat, 
  Scale, 
  GanttChartSquare, 
  Database, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Bot, 
  Sparkles, 
  Fingerprint, 
  Activity, 
  Search, 
  Clock, 
  Download,
  Users,
  Briefcase,
  History,
  FileCheck,
  Eye,
  Send,
  Stamp,
  Link2,
  // Added missing icon imports
  Info,
  MapPin,
  User as UserIcon,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface IntranetPortalProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

interface AuditTask {
  id: string;
  source: 'Facility Registry' | 'Industrial Inflow' | 'Contract Farming' | 'Circular Return';
  customerEsin: string;
  customerName: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'PENDING' | 'INSPECTION' | 'VERIFIED' | 'REJECTED';
  meta?: any;
}

const MOCK_AUDIT_QUEUE: AuditTask[] = [
  { id: 'ADT-8821', source: 'Facility Registry', customerName: 'Omaha Bio-Refinery', customerEsin: 'EA-OMA-001', title: 'Facility Ingest Verification', priority: 'high', timestamp: '2h ago', status: 'PENDING' },
  { id: 'ADT-9104', source: 'Contract Farming', customerName: 'Bantu Soil Guardians', customerEsin: 'EA-BANTU-01', title: 'Land Resource Audit', priority: 'medium', timestamp: '5h ago', status: 'INSPECTION' },
  { id: 'ADT-4420', source: 'Circular Return', customerName: 'Global Shard Fund', customerEsin: 'EA-INV-02', title: 'Machinery Refurbish Audit', priority: 'low', timestamp: '1d ago', status: 'PENDING' },
  { id: 'ADT-1122', source: 'Industrial Inflow', customerName: 'Neo Harvest', customerEsin: 'EA-2025-W12', title: 'Product Purity Sharding', priority: 'high', timestamp: '3h ago', status: 'PENDING' },
];

const IntranetPortal: React.FC<IntranetPortalProps> = ({ user, onSpendEAC }) => {
  const [authStep, setAuthStep] = useState<'login' | 'pending' | 'success'>('login');
  const [email, setEmail] = useState('');
  const [activeInternalTab, setActiveInternalTab] = useState<'auditing' | 'inspection' | 'compliance' | 'control' | 'tasks'>('auditing');
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [evidenceStep, setEvidenceStep] = useState<'upload' | 'processing' | 'committed'>('upload');
  const [evidenceFile, setEvidenceFile] = useState<string | null>(null);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setAuthStep('pending');
    setTimeout(() => {
      setAuthStep('success');
    }, 3000);
  };

  const handleFinalizeVerification = () => {
    setIsUploadingEvidence(true);
    setEvidenceStep('processing');
    setTimeout(() => {
      setEvidenceStep('committed');
      if (selectedTask) {
        setAuditQueue(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'VERIFIED' } : t));
      }
    }, 2500);
  };

  const [auditQueue, setAuditQueue] = useState(MOCK_AUDIT_QUEUE);

  if (authStep !== 'success') {
    return (
      <div className="min-h-[700px] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-10 rounded-[48px] border-emerald-500/20 bg-black/40 text-center space-y-8 shadow-3xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-2xl">
              <ShieldPlus className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Intranet <span className="text-emerald-400">Hub</span></h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em]">Official Personnel Only</p>
          </div>

          {authStep === 'login' && (
            <form onSubmit={handleRequestAccess} className="space-y-6 animate-in fade-in duration-500">
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Official Email Shard</label>
                  <div className="relative">
                     <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="steward@envirosagro.org"
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" 
                     />
                  </div>
               </div>
               <button type="submit" className="w-full py-6 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  Request HQ Verification <ArrowRight className="w-4 h-4" />
               </button>
               <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                  <Info className="w-4 h-4 text-blue-500 shrink-0" />
                  <p className="text-[8px] text-blue-200/50 font-black uppercase text-left leading-relaxed">Verification link will be transmitted to the primary HQ node for manual audit.</p>
               </div>
            </form>
          )}

          {authStep === 'pending' && (
            <div className="space-y-10 py-10 animate-in zoom-in duration-500">
               <div className="relative">
                  <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Lock className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-widest">Awaiting Registry Sync</h3>
                  <p className="text-slate-500 text-sm italic leading-relaxed">
                     Signal transmitted. Headquarters is currently reviewing your node credentials. This shard will automatically update upon consensus.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* Internal HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-600/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Building className="w-96 h-96 text-white" />
           </div>
           <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] shrink-0 border-4 border-white/10 relative z-10">
              <ShieldCheck className="w-16 h-16 text-white" />
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-white/5 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20">INTERNAL_HQ_PORTAL_STABLE</span>
                 <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Audit <span className="text-emerald-400">Command</span> Center</h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                 Manage global physical verification protocols, verify site biometrics, and authorize commercial sharding for customer nodes.
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <div className="space-y-1 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Pending Audits</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">{auditQueue.filter(t => t.status === 'PENDING').length}</h4>
           </div>
           <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase animate-pulse">
              <AlertTriangle className="w-3 h-3" /> Priority Sync Required
           </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'auditing', label: 'Auditing Queue', icon: ClipboardCheck },
          { id: 'inspection', label: 'Physical Inspection', icon: HardHat },
          { id: 'compliance', label: 'Compliances', icon: Scale },
          { id: 'control', label: 'Internal Control', icon: ShieldAlert },
          { id: 'tasks', label: 'Org Tasks', icon: GanttChartSquare },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveInternalTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeInternalTab === 'auditing' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Registry <span className="text-emerald-400">Audit Shards</span></h3>
                   <p className="text-slate-500 text-sm mt-2 italic">Global incoming signals requiring industrial verification before ledger finality.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                   <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all font-mono"
                   />
                </div>
             </div>

             <div className="grid gap-6">
                {auditQueue.map(task => (
                   <div key={task.id} className={`glass-card p-10 rounded-[48px] border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden bg-black/40 shadow-2xl ${
                      task.status === 'VERIFIED' ? 'border-emerald-500/20 opacity-60' : task.priority === 'high' ? 'border-rose-500/20' : 'border-white/5'
                   }`}>
                      <div className="flex items-center gap-8 w-full md:w-auto">
                         <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center border transition-all ${
                            task.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 group-hover:rotate-6'
                         }`}>
                            <Database className="w-10 h-10" />
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center gap-4">
                               <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic m-0 group-hover:text-emerald-400 transition-colors">{task.title}</h4>
                               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                                  task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                               }`}>{task.priority} Priority</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Building className="w-3 h-3 text-indigo-400" /> {task.source}</span>
                               <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-emerald-500" /> {task.timestamp}</span>
                               <span className="flex items-center gap-2"><Fingerprint className="w-3 h-3 text-blue-400" /> {task.customerEsin}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10">
                         <div className="text-center md:text-right space-y-1">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Customer Node</p>
                            <p className="text-xl font-bold text-white uppercase italic">{task.customerName}</p>
                         </div>
                         <button 
                           onClick={() => { setSelectedTask(task); setIsUploadingEvidence(true); setEvidenceStep('upload'); }}
                           disabled={task.status === 'VERIFIED'}
                           className={`px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-90 ${
                              task.status === 'VERIFIED' ? 'bg-emerald-500 text-white cursor-default' : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-emerald-600 hover:text-white'
                           }`}
                         >
                            {task.status === 'VERIFIED' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            {task.status === 'VERIFIED' ? 'VERIFIED' : 'Process Audit'}
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeInternalTab === 'inspection' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-amber-500/20 bg-amber-500/5 relative overflow-hidden shadow-2xl">
                 <div className="flex justify-between items-center mb-16 relative z-10 px-4">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-2xl">
                          <HardHat className="w-10 h-10 text-amber-500 animate-bounce" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Field <span className="text-amber-500">Inspection Node</span></h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Physical_Biometric_Verify_v2</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col items-center justify-center space-y-12 relative z-10 py-20">
                    <div className="w-80 h-80 rounded-[80px] bg-black/40 border-4 border-dashed border-amber-500/20 flex flex-col items-center justify-center relative group">
                       <Activity className="w-20 h-20 text-amber-500/20 group-hover:scale-110 group-hover:text-amber-500 transition-all duration-700" />
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mt-6">Awaiting Telemetry Ingest</p>
                       <div className="absolute inset-[-10px] border-2 border-amber-500/10 rounded-[90px] animate-spin-slow"></div>
                    </div>
                    <div className="max-w-md text-center space-y-4">
                       <h4 className="text-2xl font-black text-white uppercase italic">Active Regional Dispatch</h4>
                       <p className="text-slate-500 text-base leading-relaxed italic">"Stewards in Zone 4 are currently executing site inspections for 12 pending registry shards."</p>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><MapPin className="w-48 h-48 text-amber-500" /></div>
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3 relative z-10">
                       <MapPin className="w-6 h-6 text-amber-500" /> Dispatch Locations
                    </h4>
                    <div className="space-y-4 relative z-10 pt-4">
                       {['Omaha Relay Hub', 'Nairobi Bio-Center', 'Valencia Coastal Node'].map(loc => (
                          <div key={loc} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-amber-500/20 transition-all">
                             <span className="text-xs font-black text-slate-300 uppercase italic">{loc}</span>
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                          </div>
                       ))}
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                       View Dispatch Shard <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeInternalTab === 'compliance' && (
          <div className="space-y-12 animate-in fade-in duration-500 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 gap-8">
                <div className="space-y-2">
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Internal <span className="text-blue-500">Compliances</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">Standard Operating Procedures (SOP) for EnvirosAgro registry validation.</p>
                </div>
                <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">New Compliance Mandate</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { t: 'Site Purity Protocol v5', d: 'Mandatory soil DNA sequencing before any carbon credit minting.', icon: Scale, status: 'ENFORCED' },
                  { t: 'Logistics Chain v3', d: 'ZK-Proof moisture telemetry required every 15 minutes of transit.', icon: Link2, status: 'ACTIVE' },
                  { t: 'Steward Ethics v1', d: 'Human-thrust behavioral audits for all tier 3+ stewards.', icon: UserIcon, status: 'ENFORCED' },
                  { t: 'Registry Finality v4.2', d: 'Triple-consensus oracle validation for all tender releases.', icon: ShieldCheck, status: 'STABLE' },
                ].map((s, i) => (
                  <div key={i} className="glass-card p-12 rounded-[56px] border-2 border-white/5 bg-white/[0.01] hover:border-blue-500/30 transition-all flex flex-col group justify-between">
                     <div className="space-y-8">
                        <div className="flex justify-between items-start">
                           <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 group-hover:bg-blue-600/10 transition-colors shadow-xl group-hover:rotate-6">
                              <s.icon className="w-10 h-10 text-blue-500" />
                           </div>
                           <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase text-slate-500 rounded-full">{s.status}</span>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase italic leading-none m-0">{s.t}</h4>
                        <p className="text-slate-400 text-lg italic leading-relaxed font-medium">"{s.d}"</p>
                     </div>
                     <button className="w-full mt-12 py-4 bg-black/60 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3">
                        Read Mandate Shard <ArrowRight size={14} />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeInternalTab === 'control' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[64px] border-rose-500/20 bg-rose-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-12 shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] animate-pulse">
                   <ShieldAlert className="w-[500px] h-[500px] text-rose-500" />
                </div>
                
                <div className="relative z-10 space-y-8">
                   <div className="w-32 h-32 bg-rose-600 rounded-[48px] flex items-center justify-center shadow-2xl mx-auto border-4 border-white/10 group hover:rotate-12 transition-transform duration-700">
                      <Scale size={64} className="text-white" />
                   </div>
                   <div>
                      <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Internal <span className="text-rose-500">Control Unit</span></h3>
                      <p className="text-slate-400 text-2xl font-medium mt-6 max-w-2xl mx-auto italic leading-relaxed">
                        "Detecting and remediating node integrity anomalies across the global registry."
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full max-w-3xl relative z-10 pt-10 border-y border-white/5">
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Anomaly Rate</p>
                      <p className="text-4xl font-mono font-black text-rose-500">0.04%</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Registry Lock</p>
                      <p className="text-4xl font-mono font-black text-emerald-400">NOMINAL</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Oracle Trust</p>
                      <p className="text-4xl font-mono font-black text-white">99.9%</p>
                   </div>
                </div>

                <button className="px-16 py-8 agro-gradient-rose rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 hover:scale-105 active:scale-95 transition-all relative z-10">
                   <Zap className="w-8 h-8 fill-current" /> RUN GLOBAL INTEGRITY SWEEP
                </button>
             </div>
          </div>
        )}

        {activeInternalTab === 'tasks' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4 leading-none">
                      <GanttChartSquare className="w-10 h-10 text-emerald-400" /> Organizational <span className="text-emerald-400">Tasks</span>
                   </h3>
                   <p className="text-slate-500 text-lg font-medium italic">HQ internal workflow management and node synchronization backlog.</p>
                </div>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl">
                   <PlusCircle className="w-5 h-5" /> Initialize Org Shard
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Registry Node Ops', 'Seed Preservation Census', 'Satellite Calibration Relay'].map((t, i) => (
                   <div key={i} className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 flex flex-col justify-between group hover:border-emerald-500/40 transition-all shadow-xl">
                      <div className="space-y-6">
                         <div className="flex justify-between items-center">
                            <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors">{t}</h4>
                            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all"><ChevronRight size={18} /></div>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">In Sync // Cycle 12</span>
                         </div>
                      </div>
                      <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-600" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase">3 HQ Stewards</span>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-[10px] font-black text-slate-500">
                            {i*12 + 4}%
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* --- AUDIT EVIDENCE MODAL --- */}
      {isUploadingEvidence && selectedTask && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsUploadingEvidence(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] shadow-[0_0_100px_rgba(16,185,129,0.2)] animate-in zoom-in border-2 overflow-hidden flex flex-col">
              
              <div className="p-10 md:p-16 space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                          <ClipboardCheck size={40} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Evidence <span className="text-emerald-400">Ingest Terminal</span></h3>
                          <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">TARGET_TASK: {selectedTask.id}</p>
                       </div>
                    </div>
                    <button onClick={() => setIsUploadingEvidence(false)} className="p-4 bg-white/5 rounded-full text-slate-600 hover:text-white border border-white/5 transition-all"><X size={24} /></button>
                 </div>

                 {evidenceStep === 'upload' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                             <span>Associated Node</span>
                             <span className="text-white font-mono">{selectedTask.customerEsin}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                             <span>Request Source</span>
                             <span className="text-white">{selectedTask.source}</span>
                          </div>
                       </div>

                       <div 
                         className="p-20 border-4 border-dashed border-white/10 rounded-[56px] flex flex-col items-center justify-center text-center space-y-6 group hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all cursor-pointer bg-black/40"
                         onClick={() => setEvidenceFile('MOCK_FILE_SYNCED')}
                       >
                          {!evidenceFile ? (
                             <>
                                <Upload className="w-14 h-14 text-slate-700 group-hover:text-emerald-400 group-hover:scale-110 transition-all duration-500" />
                                <div className="space-y-2">
                                   <p className="text-xl font-black text-white uppercase tracking-widest italic">Upload Field Evidence</p>
                                   <p className="text-slate-600 text-xs uppercase font-black tracking-widest">Spectral Photos, Soil Reports, Identity Proofs</p>
                                </div>
                             </>
                          ) : (
                             <>
                                <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                                <p className="text-xl font-black text-emerald-400 uppercase italic">Shard Buffer Synchronized</p>
                                <button onClick={(e) => { e.stopPropagation(); setEvidenceFile(null); }} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-rose-500">Remove & Retry</button>
                             </>
                          )}
                       </div>

                       <button 
                         onClick={handleFinalizeVerification}
                         disabled={!evidenceFile}
                         className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                       >
                          <Stamp className="w-8 h-8 fill-current" /> Finalize Verification Anchor
                       </button>
                    </div>
                 )}

                 {evidenceStep === 'processing' && (
                    <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">Anchoring Shard Evidence...</p>
                          <p className="text-slate-600 font-mono text-[10px]">COMMITTING_TO_REGISTRY // ZK_SNARK_AUTH</p>
                       </div>
                    </div>
                 )}

                 {evidenceStep === 'committed' && (
                    <div className="space-y-16 py-10 animate-in zoom-in duration-700 text-center flex-1 flex flex-col justify-center items-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Shard <span className="text-emerald-400">Verified</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] font-mono">Registry Commit Hash: 0x882_VERIFIED_OK</p>
                       </div>
                       <div className="w-full glass-card p-10 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-4 text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Activity className="w-40 h-40 text-emerald-400" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Process Authorized</span>
                             <span className="text-white font-mono font-black text-xl text-emerald-400 uppercase italic">SYNC_STABLE</span>
                          </div>
                          <div className="h-px bg-white/5 w-full"></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Audit Shard ID</span>
                             <span className="text-blue-400 font-mono font-black text-lg">#{selectedTask.id}</span>
                          </div>
                       </div>
                       <button onClick={() => setIsUploadingEvidence(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Center</button>
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
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
      `}</style>
    </div>
  );
};

export default IntranetPortal;
