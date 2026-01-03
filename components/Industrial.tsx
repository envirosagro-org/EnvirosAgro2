
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Truck, 
  Gavel, 
  UserCheck, 
  ShieldCheck, 
  Star, 
  X, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  Cpu, 
  Lock, 
  Activity,
  ChevronRight,
  Loader2,
  FileText,
  Filter,
  Mail,
  Award,
  Users2,
  Briefcase,
  CheckCircle2,
  BadgeCheck,
  TrendingUp,
  Tag,
  Sparkles,
  Layers,
  Database,
  Gem,
  PlusCircle,
  AlertCircle,
  Rocket,
  Landmark,
  ArrowRight,
  /* Added missing icons */
  BarChart3,
  Info,
  Bot
} from 'lucide-react';
import { User, AgroProject } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const Industrial: React.FC<IndustrialProps> = ({ user, onSpendEAC }) => {
  const [activeView, setActiveView] = useState<'registry' | 'talent' | 'auctions'>('registry');
  const [isTalentPortalOpen, setIsTalentPortalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  
  // Project Registry States
  const [isRegisteringProject, setIsRegisteringProject] = useState(false);
  const [projectStep, setProjectStep] = useState<'ideation' | 'analysis' | 'policy' | 'success'>('ideation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Form State
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCapital, setPCapital] = useState('50000');
  const [pThrust, setPThrust] = useState('Technological');

  const MOCK_PROJECTS: AgroProject[] = [
    { id: 'PRJ-NE-882', name: 'Zone 4 Moisture Array', adminEsin: user.esin, description: 'Scaling sensor depth in Nebraska hubs.', thrust: 'Technological', status: 'Funding', totalCapital: 120000, fundedAmount: 85000, batchesClaimed: 0, totalBatches: 5, progress: 15, roiEstimate: 18.5, collateralLocked: 60000 },
    { id: 'PRJ-KE-104', name: 'Nairobi Heritage Grains', adminEsin: 'EA-2024-X821-P991', description: 'Ancestral lineage seed preservation.', thrust: 'Societal', status: 'Execution', totalCapital: 45000, fundedAmount: 45000, batchesClaimed: 2, totalBatches: 4, progress: 50, roiEstimate: 12.2, collateralLocked: 22500 },
  ];

  const canRegister = user.wallet.tier !== 'Seed' && user.isReadyForHire;

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    const prompt = `Act as an EnvirosAgro ROI Analyst. Analyze this project: Name: ${pName}, Thrust: ${pThrust}, Capital: ${pCapital} EAC. Provide a technical ROI forecast and explain its alignment with the Tokenz Batch Release policy (50% collateral required).`;
    const response = await chatWithAgroExpert(prompt, []);
    setAiAnalysis(response.text);
    setIsAnalyzing(false);
    setProjectStep('analysis');
  };

  const finalizeRegistration = () => {
    setProjectStep('success');
    // In a real app, this would push to a global state/DB
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Industrial Command Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[48px] bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20 relative overflow-hidden flex flex-col justify-between group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
              <Database className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                    <Briefcase className="w-8 h-8 text-blue-400" />
                 </div>
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Project <span className="text-blue-400">Registry</span></h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">Verified Workers can register industrial-scale projects. Adhere to Tokenz Batch Policies and 50% collateral requirements.</p>
              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={() => setIsRegisteringProject(true)}
                  disabled={!canRegister}
                  className="px-8 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                 >
                    <PlusCircle className="w-5 h-5" /> Register New Project
                 </button>
                 {!canRegister && (
                   <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-4 rounded-2xl border border-rose-500/20">
                      <AlertCircle className="w-4 h-4" /> Tier 2 + Skill Threshold Required
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[48px] border-white/5 space-y-6 flex flex-col justify-center text-center">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Institutional Capital Pool</p>
           <h3 className="text-5xl font-black text-white tracking-tighter italic">42.5M <span className="text-xl">EAC</span></h3>
           <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Tokenz Smart-Policy Active</p>
              <p className="text-[8px] text-slate-500 mt-1 uppercase">Batch Escrow enforced across all registry entries.</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'registry', label: 'Active Projects', icon: Database },
          { id: 'talent', label: 'Worker Cloud', icon: Users2 },
          { id: 'auctions', label: 'Tender Auctions', icon: Gavel },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'registry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-500">
           {MOCK_PROJECTS.map(proj => (
             <div key={proj.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/20 transition-all group relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                   <Rocket className="w-40 h-40 text-white" />
                </div>
                
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                         <ShieldCheck className="w-7 h-7 text-blue-400" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white leading-none tracking-tight">{proj.name}</h4>
                         <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">{proj.id} // THRUST_{proj.thrust.toUpperCase()}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${proj.status === 'Execution' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                         {proj.status}
                      </span>
                   </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">"{proj.description}"</p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="p-4 bg-white/5 rounded-3xl space-y-1">
                      <p className="text-[9px] text-slate-500 font-black uppercase">Capital Req.</p>
                      <p className="text-xl font-mono font-black text-white">{proj.totalCapital.toLocaleString()} EAC</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-3xl space-y-1">
                      <p className="text-[9px] text-slate-500 font-black uppercase">ROI Est.</p>
                      <p className="text-xl font-mono font-black text-emerald-400">+{proj.roiEstimate}%</p>
                   </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-600">Funding Batches</span>
                         <span className="text-blue-400">{proj.batchesClaimed} / {proj.totalBatches} RELEASED</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-1">
                         {[...Array(proj.totalBatches)].map((_, i) => (
                           <div key={i} className={`h-full flex-1 transition-all ${i < proj.batchesClaimed ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-white/5'}`}></div>
                         ))}
                      </div>
                   </div>

                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Lock className="w-3.5 h-3.5 text-slate-700" />
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Collateral: {proj.collateralLocked.toLocaleString()} EAC</span>
                      </div>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                         Update Evidence <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {activeView === 'talent' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* Legacy talent cloud integrated here */}
           <div className="flex justify-between items-center">
              <h4 className="font-bold text-white flex items-center gap-2 uppercase tracking-tighter text-lg"><BadgeCheck className="w-5 h-5 text-blue-400" /> Top-Rated Nodes</h4>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">LIFETIME SCORE</span>
           </div>
           {/* ... existing worker cards ... */}
        </div>
      )}

      {/* Project Registration Modal */}
      {isRegisteringProject && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setIsRegisteringProject(false)}></div>
           <div className="relative z-10 w-full max-w-4xl h-[85vh] glass-card rounded-[48px] border-blue-500/20 overflow-hidden flex flex-col shadow-2xl bg-[#050706]">
              {/* Modal Header */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-blue-600/5">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                       <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Project <span className="text-blue-400">Initialization</span></h2>
                       <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Authorized as Worker Node
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setIsRegisteringProject(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              {/* Progress Steps UI */}
              <div className="px-10 py-6 border-b border-white/5 bg-white/[0.02] flex justify-between">
                 {[
                   { id: 'ideation', label: 'Ideation', icon: Sparkles },
                   { id: 'analysis', label: 'ROI Analysis', icon: BarChart3 },
                   { id: 'policy', label: 'Tokenz Policy', icon: ShieldCheck },
                   { id: 'success', label: 'Closure Registry', icon: FlagIcon },
                 ].map((step, idx) => (
                   <div key={step.id} className={`flex items-center gap-3 ${idx <= ['ideation', 'analysis', 'policy', 'success'].indexOf(projectStep) ? 'text-blue-400' : 'text-slate-700'}`}>
                      <step.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                      {idx < 3 && <div className="w-12 h-px bg-white/5 mx-4"></div>}
                   </div>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 {projectStep === 'ideation' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Project Designation</label>
                               <input 
                                value={pName}
                                onChange={e => setPName(e.target.value)}
                                type="text" placeholder="e.g. Bantu Hydration Node V2" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" 
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Scientific Thrust</label>
                               <select 
                                value={pThrust}
                                onChange={e => setPThrust(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
                               >
                                  <option>Technological</option>
                                  <option>Societal</option>
                                  <option>Environmental</option>
                                  <option>Informational</option>
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Capital Pool Target (EAC)</label>
                               <input 
                                value={pCapital}
                                onChange={e => setPCapital(e.target.value)}
                                type="number" placeholder="50000" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40" 
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Executive Summary (Ideation)</label>
                            <textarea 
                             value={pDesc}
                             onChange={e => setPDesc(e.target.value)}
                             placeholder="Describe the scientific deliverables and industrial impact..." 
                             className="w-full h-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none"
                            ></textarea>
                         </div>
                      </div>
                      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-start gap-6">
                         <Info className="w-10 h-10 text-blue-400 shrink-0" />
                         <div>
                            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Protocol Verification</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                               Upon submission, Gemini will run an ROI validation sweep. Your admin node must link evidence of "Feasibility" to move to the Funding Registry.
                            </p>
                         </div>
                      </div>
                      <div className="flex justify-end pt-4">
                         <button 
                          onClick={handleStartAnalysis}
                          disabled={!pName || !pDesc || isAnalyzing}
                          className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                         >
                            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {isAnalyzing ? "Calculating ROI..." : "Execute Analysis Sweep"}
                         </button>
                      </div>
                   </div>
                 )}

                 {projectStep === 'analysis' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1">
                      <div className="p-10 glass-card rounded-[40px] bg-white/[0.01] border-l-4 border-blue-500/50">
                         <div className="flex items-center gap-4 mb-6">
                            <Bot className="w-8 h-8 text-blue-400" />
                            <h4 className="text-xl font-bold text-white uppercase tracking-widest">Institutional AI Opinion</h4>
                         </div>
                         <div className="prose prose-invert max-w-none text-slate-300 leading-loose italic whitespace-pre-line text-lg">
                            {aiAnalysis}
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                         <div className="p-6 glass-card rounded-[32px] text-center border-white/5">
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Risk Score</p>
                            <p className="text-2xl font-black text-emerald-400">LOW_02</p>
                         </div>
                         <div className="p-6 glass-card rounded-[32px] text-center border-white/5">
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Batch Yield</p>
                            <p className="text-2xl font-black text-blue-400">12.5%</p>
                         </div>
                         <div className="p-6 glass-card rounded-[32px] text-center border-white/5">
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Audit Path</p>
                            <p className="text-2xl font-black text-amber-400">VERIFIED</p>
                         </div>
                      </div>

                      <div className="flex justify-between items-center pt-8">
                         <button onClick={() => setProjectStep('ideation')} className="px-10 py-5 bg-white/5 text-slate-500 font-black text-xs uppercase tracking-widest rounded-3xl hover:text-white transition-all">Back to Ideation</button>
                         <button 
                          onClick={() => setProjectStep('policy')}
                          className="px-12 py-5 bg-blue-600 rounded-[32px] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all flex items-center gap-3"
                         >
                            Proceed to Funding Policy <ArrowRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 )}

                 {projectStep === 'policy' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-[48px] bg-blue-500/10 border-2 border-blue-500/20 flex items-center justify-center shadow-2xl group">
                         <ShieldCheck className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="text-center max-w-2xl space-y-6">
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Tokenz Compliance Agreement</h3>
                         <p className="text-slate-400 text-lg leading-relaxed italic">
                            "By registering this project, the Steward Node ESIN {user.esin} agrees to lock 50% of the target capital ({Number(pCapital)/2} EAC) as performance collateral. Funds will be disbursed in batches based on verified proof-of-progress."
                         </p>
                         <div className="grid grid-cols-2 gap-4 text-left pt-6">
                            <div className="p-6 bg-white/5 rounded-3xl space-y-2 border border-white/10">
                               <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest">Collateral Path</p>
                               <p className="text-sm font-bold text-white">Registry Escrow (Vesting)</p>
                            </div>
                            <div className="p-6 bg-white/5 rounded-3xl space-y-2 border border-white/10">
                               <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Payout Trigger</p>
                               <p className="text-sm font-bold text-white">Batch Multi-Sig (Oracle)</p>
                            </div>
                         </div>
                      </div>
                      <button 
                        onClick={finalizeRegistration}
                        className="w-full mt-10 py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <ShieldCheck className="w-6 h-6" /> Commit & Sign Registry
                      </button>
                   </div>
                 )}

                 {projectStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                         <CheckCircle2 className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Project Indexed</h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Registry ID: PRJ-NODE-{(Math.random()*1000).toFixed(0)}</p>
                      </div>
                      <div className="w-full glass-card p-10 rounded-[48px] border-white/5 bg-emerald-500/5 space-y-4 text-left max-w-lg">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Blockchain Hash</span>
                            <span className="text-emerald-400 font-mono text-[11px]">0x{Math.random().toString(16).slice(2, 14).toUpperCase()}...</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Batch Escrow</span>
                            <span className="text-white font-bold uppercase">INITIALIZED_TOKENZ_V1</span>
                         </div>
                      </div>
                      <button onClick={() => setIsRegisteringProject(false)} className="w-full max-w-lg py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Return to Registry</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Local Icon fix for Flag
const FlagIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);

export default Industrial;
