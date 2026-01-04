
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
  const [isRegisteringProject, setIsRegisteringProject] = useState(false);
  const [projectStep, setProjectStep] = useState<'ideation' | 'analysis' | 'policy' | 'success'>('ideation');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Form State
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCapital, setPCapital] = useState('50000');
  const [pThrust, setPThrust] = useState('Industry');

  const MOCK_PROJECTS: AgroProject[] = [
    { id: 'PRJ-NE-882', name: 'Zone 4 Moisture Array', adminEsin: user.esin, description: 'Scaling sensor depth in Nebraska hubs.', thrust: 'Technological', status: 'Funding', totalCapital: 120000, fundedAmount: 85000, batchesClaimed: 0, totalBatches: 5, progress: 15, roiEstimate: 18.5, collateralLocked: 60000 },
    { id: 'PRJ-KE-104', name: 'Nairobi Heritage Grains', adminEsin: 'EA-2024-X821-P991', description: 'Ancestral lineage seed preservation.', thrust: 'Societal', status: 'Execution', totalCapital: 45000, fundedAmount: 45000, batchesClaimed: 2, totalBatches: 4, progress: 50, roiEstimate: 12.2, collateralLocked: 22500 },
  ];

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
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Layers className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 rounded-[40px] bg-indigo-500 flex items-center justify-center shadow-2xl ring-4 ring-white/10 shrink-0">
                 <Briefcase className="w-16 h-16 text-white" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Industrial <span className="text-indigo-400">Cloud</span></h2>
                 <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                    Coordinate large-scale agricultural projects, source verified talent, and participate in tender auctions for global sustainability missions.
                 </p>
                 <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => setIsRegisteringProject(true)}
                      className="px-8 py-3 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                       <PlusCircle className="w-4 h-4" /> Start Industrial Project
                    </button>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Global Analytics</button>
                 </div>
              </div>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-6 flex flex-col justify-center">
           <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Verified Workers</p>
              <h4 className="text-4xl font-mono font-black text-white">4,281</h4>
           </div>
           <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Open Tenders</p>
              <h4 className="text-4xl font-mono font-black text-indigo-400">12</h4>
           </div>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-left-4 duration-300">
           {MOCK_PROJECTS.map(proj => (
             <div key={proj.id} className="glass-card p-10 rounded-[48px] border-white/5 hover:border-indigo-500/20 transition-all group flex flex-col h-full active:scale-95">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                         <Rocket className="w-7 h-7 text-indigo-400" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{proj.name}</h4>
                         <p className="text-[10px] text-slate-500 font-mono mt-2 tracking-widest">{proj.id} // THRUST: {proj.thrust}</p>
                      </div>
                   </div>
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                      {proj.status}
                   </span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-1 italic">"{proj.description}"</p>

                <div className="space-y-6 pt-8 border-t border-white/5">
                   <div className="grid grid-cols-3 gap-4">
                      <div>
                         <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Capital Goal</p>
                         <p className="text-sm font-mono font-black text-white">{proj.totalCapital.toLocaleString()} EAC</p>
                      </div>
                      <div>
                         <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">ROI Estimate</p>
                         <p className="text-sm font-mono font-black text-emerald-400">+{proj.roiEstimate}%</p>
                      </div>
                      <div>
                         <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">Progress</p>
                         <p className="text-sm font-mono font-black text-blue-400">{proj.progress}%</p>
                      </div>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                   </div>
                   <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      Full Prospectus <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Industrial Project Registration Modal */}
      {isRegisteringProject && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl" onClick={() => setIsRegisteringProject(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card p-1 rounded-[56px] border-indigo-500/20 overflow-hidden shadow-2xl flex flex-col bg-[#050706] max-h-[90vh]">
              
              {/* Header */}
              <div className="p-10 border-b border-white/5 flex items-center justify-between bg-indigo-600/5">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20">
                       <PlusCircle className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Project <span className="text-indigo-400">Initialization</span></h3>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Protocol v3.2 • industrial sync</p>
                    </div>
                 </div>
                 <button onClick={() => setIsRegisteringProject(false)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              {/* Progress Stepper */}
              <div className="px-10 py-6 border-b border-white/5 flex gap-8">
                 {[
                   { id: 'ideation', label: '1. Ideation', active: projectStep === 'ideation' },
                   { id: 'analysis', label: '2. Analysis', active: projectStep === 'analysis' },
                   { id: 'policy', label: '3. Policy', active: projectStep === 'policy' },
                   { id: 'success', label: '4. Success', active: projectStep === 'success' },
                 ].map(s => (
                   <div key={s.id} className={`flex items-center gap-3 transition-opacity ${s.active ? 'opacity-100' : 'opacity-30'}`}>
                      <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-indigo-400' : 'bg-slate-700'}`}></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{s.label}</span>
                   </div>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 {projectStep === 'ideation' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Project Designation</label>
                               <input type="text" value={pName} onChange={e => setPName(e.target.value)} placeholder="e.g. Zone 4 Nebraska Soil Recovery" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Primary SEHTI Thrust</label>
                               <select value={pThrust} onChange={e => setPThrust(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white appearance-none outline-none focus:ring-2 focus:ring-indigo-500/40">
                                  <option>Industry</option>
                                  <option>Technological</option>
                                  <option>Societal</option>
                                  <option>Environmental</option>
                                  <option>Human</option>
                               </select>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Capital Pool Goal (EAC)</label>
                               <input type="number" value={pCapital} onChange={e => setPCapital(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono text-2xl" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Mission Abstract</label>
                               <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Describe the industrial impact and scientific outcomes..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm h-32 resize-none" />
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[32px] flex items-center gap-6">
                         <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                         <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                            "Initial project registration requires a network processing fee of <span className="text-amber-500 font-black">100 EAC</span>. All projects are subject to multi-node verification."
                         </p>
                      </div>

                      <button 
                        onClick={handleStartAnalysis}
                        disabled={!pName || !pDesc || isAnalyzing}
                        className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                         {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {isAnalyzing ? "CONSULTING ORACLE..." : "RUN ROI ANALYSIS"}
                      </button>
                   </div>
                 )}

                 {projectStep === 'analysis' && (
                   <div className="space-y-10 animate-in zoom-in duration-500">
                      <div className="flex items-center gap-6 border-b border-white/5 pb-8 mb-4">
                         <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 shadow-2xl">
                            <Bot className="w-8 h-8 text-blue-400" />
                         </div>
                         <div>
                            <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Oracle ROI Forecast</h4>
                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                               <Sparkles className="w-3 h-3" /> Gemini 3 Pro interpretation
                            </p>
                         </div>
                      </div>

                      <div className="p-10 glass-card rounded-[40px] bg-white/[0.01] border-l-4 border-blue-500/50">
                         <div className="prose prose-invert prose-blue max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line">
                            {aiAnalysis}
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                         <div className="p-8 glass-card rounded-3xl border-white/5 text-center">
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Project Score</p>
                            <p className="text-2xl font-mono font-black text-white">88/100</p>
                         </div>
                         <div className="p-8 glass-card rounded-3xl border-white/5 text-center">
                            <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Vetting Days</p>
                            <p className="text-2xl font-mono font-black text-white">12 Days</p>
                         </div>
                         <div className="p-8 glass-card rounded-3xl border-emerald-500/20 bg-emerald-500/5 text-center">
                            <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">Trust Multiplier</p>
                            <p className="text-2xl font-mono font-black text-emerald-400">1.42x</p>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button onClick={() => setProjectStep('ideation')} className="flex-1 py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Refine Parameters</button>
                         <button onClick={() => setProjectStep('policy')} className="flex-[2] py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                            <ShieldCheck className="w-6 h-6" /> Accept & Proceed
                         </button>
                      </div>
                   </div>
                 )}

                 {projectStep === 'policy' && (
                   <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="text-center space-y-4">
                         <div className="w-20 h-20 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl">
                            <Landmark className="w-10 h-10 text-blue-400" />
                         </div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Batch Release <span className="text-blue-400">Policy</span></h3>
                      </div>

                      <div className="p-10 glass-card rounded-[48px] border-white/5 bg-blue-900/10 space-y-6">
                         <h4 className="text-xl font-bold text-white uppercase tracking-widest">Mandatory Collateral Node</h4>
                         <p className="text-slate-300 leading-relaxed italic">
                            In accordance with the EnvirosAgro Industry standards, large-scale projects require a <span className="text-blue-400 font-bold uppercase">50% Capital Collateral Lock</span>. This ensures node administrator commitment and provides a security pool for investors (vouchers).
                         </p>
                         <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                               <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Required Collateral</p>
                               <p className="text-3xl font-mono font-black text-white">{(Number(pCapital)*0.5).toLocaleString()} <span className="text-xs">EAC</span></p>
                            </div>
                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                               <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Vesting Period</p>
                               <p className="text-3xl font-mono font-black text-white">180 <span className="text-xs">Days</span></p>
                            </div>
                         </div>
                      </div>

                      <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex items-start gap-4">
                         <Info className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                            Failure to maintain the 50% collateral ratio during the 'Funding' stage will result in project revocation and a burn of the initial registration fee.
                         </p>
                      </div>

                      <button onClick={finalizeRegistration} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                         <ShieldCheck className="w-6 h-6 fill-current" /> Sign Project Contract
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
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Enqueued for Global Verification Shard #04</p>
                      </div>
                      <div className="w-full glass-card p-10 rounded-[48px] border-white/5 bg-emerald-500/5 space-y-4 text-left max-w-lg">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Project ID</span>
                            <span className="text-white font-mono font-bold">PRJ-{(Math.random()*1000).toFixed(0)}-ALPHA</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Registry Hash</span>
                            <span className="text-emerald-400 font-mono text-[11px]">0x{Math.random().toString(16).slice(2, 14).toUpperCase()}...</span>
                         </div>
                      </div>
                      <button onClick={() => setIsRegisteringProject(false)} className="w-full max-w-lg py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss Portal</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeView === 'talent' && (
         <div className="lg:col-span-3 space-y-12 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input type="text" placeholder="Search by skill or ESIN..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all text-sm" />
              </div>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4" /> Regional Filter
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { name: "Dr. Marcus Chen", role: "Hydroponics Architect", score: 98.4, hours: 1420, zone: "California, US", tags: ["Expert", "Verified"] },
                 { name: "Seward Amina", role: "Registry Auditor", score: 95.2, hours: 850, zone: "Nairobi, KE", tags: ["Policy", "Auditor"] },
                 { name: "Leonid V.", role: "IoT Array Engineer", score: 89.8, hours: 2100, zone: "Valencia, ES", tags: ["Hardware", "Satellite"] },
               ].map((w, i) => (
                 <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/20 transition-all group relative overflow-hidden flex flex-col h-full active:scale-95 duration-200">
                    <div className="flex items-start justify-between mb-8">
                       <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-[24px] bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-2xl shadow-xl ring-2 ring-white/5">
                             {w.name[0]}
                          </div>
                          <div>
                             <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{w.name}</h4>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{w.role}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-1 text-amber-400">
                             <Star className="w-3 h-3 fill-current" />
                             <span className="text-xs font-black">{w.score}%</span>
                          </div>
                          <p className="text-[7px] text-slate-600 font-black uppercase mt-1">U-Score</p>
                       </div>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                       <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" /> <span>{w.zone}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> <span>{w.hours} Verified Hours</span>
                       </div>
                    </div>

                    <div className="flex gap-3">
                       <button className="flex-1 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">View Dossier</button>
                       <button className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all">
                          <Mail className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default Industrial;
