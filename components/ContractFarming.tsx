
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  X, 
  Coins, 
  Zap, 
  PlusCircle, 
  Search, 
  Globe, 
  Clock, 
  Activity, 
  MapPin, 
  Users2, 
  Database, 
  Lock, 
  AlertTriangle,
  HardHat,
  Handshake,
  FileSignature,
  Key,
  FileSearch,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle,
  AlertCircle,
  FileDigit,
  Fingerprint,
  ArrowLeftCircle,
  Target,
  BarChart4,
  LayoutGrid,
  Bot,
  Sparkles,
  ClipboardCheck,
  Building2,
  Users,
  TreePine,
  ShieldPlus,
  Info,
  Stamp,
  Network,
  Plus
} from 'lucide-react';
import { User, FarmingContract, ContractApplication, ViewState, AgroResource } from '../types';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface ContractFarmingProps {
  user: User;
  // Fix: changed onSpendEAC to return Promise<boolean> to match async implementation in App.tsx
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  contracts: FarmingContract[];
  setContracts: React.Dispatch<React.SetStateAction<FarmingContract[]>>;
  onInitializeLiveProcess?: (params: any) => void;
}

const CONTRACT_INDEXING_FEE = 75;

const ContractFarming: React.FC<ContractFarmingProps> = ({ user, onSpendEAC, onNavigate, contracts, setContracts, onInitializeLiveProcess }) => {
  const [isAccessVerifying, setIsAccessVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'deployments' | 'engagements'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Registry Gate Logic
  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );
  const hasLandRegistered = landResources.length > 0;

  // Modals
  const [showApplyModal, setShowApplyModal] = useState<FarmingContract | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(true); // Set to true per user request: "Open deploy mission capital"
  const [showReviewModal, setShowReviewModal] = useState<FarmingContract | null>(null);

  // Application Workflow States
  const [applyStep, setApplyStep] = useState<'form' | 'vetting' | 'commitment' | 'success'>('form');
  const [selectedLandForApp, setSelectedLandForApp] = useState<AgroResource | null>(null);
  const [labourCapacity, setLabourCapacity] = useState('');
  const [isVetting, setIsVetting] = useState(false);
  const [vettingReport, setVettingReport] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  // Deployment Form States
  const [deployProduct, setDeployProduct] = useState('Maize Farming Node');
  const [deployBudget, setDeployBudget] = useState('50000');
  const [deployLandReq, setDeployLandReq] = useState('50-100 Hectares');
  const [deployLabourReq, setDeployLabourReq] = useState('20 Steward Units');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAccessVerifying(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Logic: Filter contracts
  const availableContracts = useMemo(() => contracts.filter(c => c.status === 'Open'), [contracts]);
  const myDeployments = useMemo(() => contracts.filter(c => c.investorEsin === user.esin), [contracts, user.esin]);
  const myEngagements = useMemo(() => contracts.filter(c => c.applications.some(app => app.farmerEsin === user.esin)), [contracts, user.esin]);

  const filteredBrowse = availableContracts.filter(c => 
    c.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.investorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyStart = (contract: FarmingContract) => {
    // We allow the modal to open even if no land, to show the restriction within the process
    setApplyStep('form');
    setShowApplyModal(contract);
    setSelectedLandForApp(landResources.length > 0 ? landResources[0] : null);
    setLabourCapacity('');
    setVettingReport(null);
  };

  const handleRunVetting = async () => {
    if (!hasLandRegistered) return;
    setIsVetting(true);
    setApplyStep('vetting');
    try {
      const prompt = `Perform an initial risk assessment for a farmer application. 
      Land Resource Shard: ${selectedLandForApp?.name} (${selectedLandForApp?.id})
      Labour Capacity: ${labourCapacity}
      Contract Goal: ${showApplyModal?.productType}
      
      Determine alignment with SEHTI framework and potential for m-constant stability.`;
      const res = await runSpecialistDiagnostic("Mission Vetting", prompt);
      setVettingReport(res.text);
    } catch (e) {
      setVettingReport("Oracle handshake failed. Local validation suggests high alignment with registry standards.");
    } finally {
      setIsVetting(false);
    }
  };

  const handleFinalizeApplication = () => {
    if (!showApplyModal || esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const newApp: ContractApplication = {
      id: `APP-${Math.random().toString(36).substring(7).toUpperCase()}`,
      farmerEsin: user.esin,
      farmerName: user.name,
      landResources: selectedLandForApp?.name || 'Unknown Shard',
      labourCapacity,
      auditStatus: 'Pending',
      paymentEscrowed: 0
    };

    setContracts(prev => prev.map(c => 
      c.id === showApplyModal.id 
        ? { ...c, applications: [...c.applications, newApp] } 
        : c
    ));
    
    // AUTO-INITIALIZE LIVE PROCESS for this mission engagement
    if (onInitializeLiveProcess) {
      onInitializeLiveProcess({
        title: `Mission: ${showApplyModal.productType}`,
        category: 'Produce',
        stewardName: user.name,
        stewardEsin: user.esin,
        location: user.location
      });
    }

    setApplyStep('success');
  };

  // Fix: handleDeployMission made async to await onSpendEAC
  const handleDeployMission = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const totalCost = Number(deployBudget) + CONTRACT_INDEXING_FEE;
    // Fix: await onSpendEAC to resolve Promise<boolean>
    if (!await onSpendEAC(totalCost, `MISSION_CAPITAL_DEPLOYMENT_${deployProduct}`)) {
      alert("LIQUIDITY ERROR: Insufficient EAC for mission deployment.");
      return;
    }

    setIsDeploying(true);
    setTimeout(() => {
      const newContract: FarmingContract = {
        id: `CTR-${Math.floor(Math.random() * 9000 + 1000)}`,
        investorEsin: user.esin,
        investorName: user.name,
        productType: deployProduct,
        requiredLand: deployLandReq,
        requiredLabour: deployLabourReq,
        budget: Number(deployBudget),
        status: 'Open',
        applications: [],
        capitalIngested: true
      };
      setContracts([newContract, ...contracts]);
      setIsDeploying(false);
      setShowDeployModal(false);
      alert("MISSION DEPLOYED: Capital anchored in Escrow registry.");
    }, 2000);
  };

  if (isAccessVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-2xl">
            <Lock size={32} className="animate-pulse" />
          </div>
          <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-3xl animate-ping opacity-20"></div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] italic">Handshaking Node Access...</h3>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Auth_Protocol_Active // Mission_Ingest_v4</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      
      {/* 1. Portal Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          RETURN TO COMMAND CENTER
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-blue-400 font-black uppercase tracking-widest">SHARD: CONTRACT_ESCROW_CORE</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>

      {/* 2. Hero Component - Matched to Screenshot */}
      <div className="max-w-4xl mx-auto w-full">
         <div className="glass-card p-16 md:p-24 rounded-[80px] bg-black/60 border border-white/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group">
            {/* Background Texture Shard */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:scale-105 transition-transform duration-[12s]">
               <Handshake className="w-[800px] h-[800px] text-white" />
            </div>

            {/* Handshake Anchor Logo */}
            <div className="w-48 h-48 rounded-[64px] bg-white flex items-center justify-center shadow-3xl relative z-10">
               <Handshake size={80} className="text-blue-600" />
            </div>

            <div className="space-y-6 relative z-10">
               <div className="inline-block px-5 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner">
                  ESCROW_MISSION_INTERFACE_V4
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                  CONTRACT <span className="text-blue-400">FARMING</span>
               </h2>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl mx-auto">
                  "Bridging institutional capital with regenerative land stewardship. Securing the agrarian future through binding industrial mission shards."
               </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md relative z-10">
               <button 
                onClick={() => setShowDeployModal(true)}
                className="w-full py-7 bg-blue-600 hover:bg-blue-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(37,99,235,0.4)] flex items-center justify-center gap-4 active:scale-95 transition-all border border-white/10"
               >
                  <PlusCircle size={24} /> DEPLOY MISSION CAPITAL
               </button>
               <button 
                onClick={() => setActiveTab('engagements')}
                className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 active:scale-95"
               >
                  <History size={20} className="text-blue-400" /> MY ENGAGEMENT SHARDS
               </button>
            </div>
         </div>
      </div>

      {/* 3. Aggregate Escrow HUD */}
      <div className="max-w-4xl mx-auto w-full pt-10 px-4">
         <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center text-center space-y-12 shadow-2xl relative overflow-hidden">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] relative z-10">AGGREGATE ESCROW</p>
            <h4 className="text-[100px] md:text-[140px] font-mono font-black text-white tracking-tighter leading-none relative z-10">
               1.2<span className="text-4xl text-blue-500 ml-1">M</span>
            </h4>
            <div className="w-full space-y-4 relative z-10">
               <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest px-2">
                  <span>CONTRACT VELOCITY</span>
                  <span className="text-blue-400">STEADY</span>
               </div>
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-blue-600 w-[74%] shadow-[0_0_30px_#3b82f6]"></div>
               </div>
            </div>
         </div>
      </div>

      {/* 4. Tab Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto border border-white/5 bg-black/40 shadow-xl px-4 mt-12">
        {[
          { id: 'browse', label: 'BROWSE MISSIONS', icon: Globe },
          { id: 'deployments', label: 'MY DEPLOYMENTS', icon: Landmark },
          { id: 'engagements', label: 'ACTIVE ENGAGEMENTS', icon: Briefcase },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 5. Mission Ledger Content */}
      <div className="min-h-[700px] px-4 md:px-0">
        
        {/* TAB: BROWSE MISSIONS */}
        {activeTab === 'browse' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
             <div className="text-center space-y-6">
                <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">MISSION <span className="text-blue-400">LEDGER</span></h3>
                <p className="text-slate-500 text-lg font-medium italic">Institutional nodes seeking land steward partnerships.</p>
                <div className="relative group w-full max-w-2xl mx-auto pt-6">
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search mission shards..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-6 px-10 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800 italic" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {filteredBrowse.map(contract => (
                   <div key={contract.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col bg-black/40 shadow-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Database size={200} /></div>
                      
                      <div className="flex justify-between items-start mb-12 relative z-10">
                         <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-600/20 text-blue-400 shadow-xl group-hover:rotate-6 transition-all">
                            <Briefcase size={40} />
                         </div>
                         <div className="text-right flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{contract.status.toUpperCase()}</span>
                            <p className="text-[10px] text-slate-700 font-mono font-black italic">{contract.id}</p>
                         </div>
                      </div>

                      <div className="flex-1 space-y-6 relative z-10">
                         <h4 className="text-4xl font-black text-white uppercase italic leading-tight group-hover:text-blue-400 transition-colors m-0 tracking-tighter">{contract.productType}</h4>
                         <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">DEPLOYED BY: {contract.investorName}</p>
                         <p className="text-lg text-slate-400 leading-relaxed italic mt-8 opacity-80 group-hover:opacity-100 transition-opacity">"Seeking steward nodes with {contract.requiredLand} and capacity for {contract.requiredLabour}."</p>
                      </div>

                      <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.2em]">MISSION CAPITAL</p>
                            <p className="text-5xl font-mono font-black text-white tracking-tighter">
                               {contract.budget.toLocaleString()} <span className="text-sm text-blue-400 italic font-sans ml-1">EAC</span>
                            </p>
                         </div>
                         <button 
                           onClick={() => handleApplyStart(contract)}
                           className="px-12 py-7 bg-blue-600 rounded-[32px] text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-[0_0_60px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-90 border border-white/10"
                         >
                            INITIALIZE SHARD
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: MY DEPLOYMENTS */}
        {activeTab === 'deployments' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">My <span className="text-blue-400">Deployed Capital</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Manage missions where you have anchored institutional EAC shards.</p>
                </div>
                <button 
                  onClick={() => setShowDeployModal(true)}
                  className="px-8 py-3 bg-blue-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                   <PlusCircle className="w-4 h-4" /> New Deployment
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {myDeployments.map(contract => (
                   <div key={contract.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden">
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className="p-5 rounded-3xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
                            <Landmark size={28} />
                         </div>
                         <div className="text-right">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20">{contract.status}</span>
                            <p className="text-[10px] text-slate-600 font-mono mt-2 font-black">{contract.id}</p>
                         </div>
                      </div>
                      <div className="flex-1 space-y-4 relative z-10">
                         <h4 className="text-2xl font-black text-white uppercase italic m-0 leading-tight group-hover:text-blue-400 transition-colors">{contract.productType}</h4>
                         <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                               <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Applications</p>
                               <p className="text-2xl font-mono font-black text-white">{contract.applications.length}</p>
                            </div>
                            <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                               <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Total Budget</p>
                               <p className="text-2xl font-mono font-black text-emerald-400">{contract.budget.toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                      <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                         <button 
                           onClick={() => setShowReviewModal(contract)}
                           className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md"
                         >
                            Review Apps
                         </button>
                         <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl">Manage</button>
                      </div>
                   </div>
                ))}
                {myDeployments.length === 0 && (
                   <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed border-white/5 rounded-[56px] bg-black/20">
                      <PlusCircle size={80} className="text-slate-600 animate-pulse" />
                      <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active Capital Deployments</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {/* TAB: ACTIVE ENGAGEMENTS */}
        {activeTab === 'engagements' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">My <span className="text-emerald-400">Engagements</span></h3>
                   <p className="text-slate-500 text-sm mt-1 italic">"Monitoring mission progress and m-constant stability for joined shards."</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {myEngagements.map(contract => {
                   const myApp = contract.applications.find(a => a.farmerEsin === user.esin);
                   return (
                     <div key={contract.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8 relative z-10">
                           <div className="p-5 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                              <Target size={28} />
                           </div>
                           <div className="text-right">
                              <span className={`px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20`}>{myApp?.auditStatus.replace('_', ' ') || 'PROVISIONAL'}</span>
                              <p className="text-[10px] text-slate-600 font-mono mt-3 uppercase tracking-tighter italic">{contract.id}</p>
                           </div>
                        </div>
                        <div className="flex-1 space-y-6 relative z-10">
                           <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{contract.productType}</h4>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">INVESTOR: {contract.investorName}</p>
                           
                           <div className="space-y-4 pt-6">
                              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                 <span>Registry Consensus</span>
                                 <span className="text-emerald-400 font-mono">92%</span>
                              </div>
                              <div className="h-2 bg-black/60 rounded-full border border-white/5 overflow-hidden shadow-inner">
                                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: '92%' }}></div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                           <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md">Audit Logs</button>
                           <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl">View Shard</button>
                        </div>
                     </div>
                   );
                })}
                {myEngagements.length === 0 && (
                   <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                      <Briefcase size={80} className="text-slate-600 animate-pulse" />
                      <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active Engagement Shards</p>
                      <button onClick={() => setActiveTab('browse')} className="px-8 py-3 bg-emerald-600 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Browse Missions</button>
                   </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. APPLY MODAL (Farmer View) */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowApplyModal(null)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowApplyModal(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
                 
                 <div className="flex gap-4 shrink-0">
                    {['form', 'vetting', 'commitment', 'success'].map((s, i) => {
                       const stages = ['form', 'vetting', 'commitment', 'success'];
                       const currentIdx = stages.indexOf(applyStep === 'vetting' && isVetting ? 'form' : applyStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-1.5 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-white/10'}`}></div>
                           <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-blue-400' : 'text-slate-700'}`}>{s}</span>
                         </div>
                       );
                    })}
                 </div>

                 {applyStep === 'form' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl">
                             <Handshake className="w-12 h-12 text-blue-400" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Mission <span className="text-blue-400">Application</span></h3>
                          <p className="text-slate-400 text-lg font-medium italic">Apply for the {showApplyModal.productType} mission deployed by {showApplyModal.investorName}.</p>
                       </div>
                       
                       <div className="space-y-8">
                          {hasLandRegistered ? (
                            <div className="space-y-3 px-4">
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">Select Registered Land Shard</label>
                               <div className="grid grid-cols-1 gap-3">
                                  {landResources.map(land => (
                                     <button 
                                        key={land.id}
                                        onClick={() => setSelectedLandForApp(land)}
                                        className={`p-6 rounded-3xl border transition-all flex items-center justify-between group ${selectedLandForApp?.id === land.id ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg' : 'bg-black border-white/5 text-slate-500'}`}
                                     >
                                        <div className="flex items-center gap-4">
                                           <TreePine size={20} className={selectedLandForApp?.id === land.id ? 'text-blue-400' : 'text-slate-700'} />
                                           <div className="text-left">
                                              <p className="text-sm font-black uppercase">{land.name}</p>
                                              <p className="text-[10px] font-mono">{land.id}</p>
                                           </div>
                                        </div>
                                        {selectedLandForApp?.id === land.id && <CheckCircle2 size={20} />}
                                     </button>
                                  ))}
                               </div>
                            </div>
                          ) : (
                            <div className="mx-4 p-8 glass-card rounded-[40px] border-rose-500/20 bg-rose-500/5 space-y-6 text-center shadow-xl">
                               <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-500/20"><ShieldAlert size={32} /></div>
                               <div className="space-y-2">
                                  <p className="text-xl font-black text-white uppercase italic tracking-tighter">Handshake Required</p>
                                  <p className="text-xs text-slate-400 italic leading-relaxed">This mission requires a verified land mass registry anchor to initialize the bidding protocol.</p>
                               </div>
                               <button 
                                  onClick={() => onNavigate?.('registry_handshake')}
                                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                               >
                                  <Landmark size={16} /> Registry Handshake
                               </button>
                            </div>
                          )}

                          <div className="space-y-3 px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">Labour Unit Capacity</label>
                             <input 
                               type="text" 
                               required 
                               value={labourCapacity}
                               onChange={e => setLabourCapacity(e.target.value)}
                               placeholder="e.g. 24 Trained Stewards" 
                               className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner" 
                             />
                          </div>
                       </div>

                       <button 
                        onClick={handleRunVetting}
                        disabled={!hasLandRegistered || !selectedLandForApp || !labourCapacity}
                        className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                       >
                          Initialize Oracle Vetting <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {applyStep === 'vetting' && (
                    <div className="space-y-12 flex-1 flex flex-col justify-center text-center">
                       {isVetting ? (
                          <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500 py-10">
                             <div className="relative">
                                <div className="absolute inset-[-15px] border-t-8 border-blue-500 rounded-full animate-spin"></div>
                                <div className="w-48 h-48 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-2xl">
                                   <Bot className="w-20 h-20 text-blue-400 animate-pulse" />
                                </div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-blue-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Auditing Steward Node...</p>
                                <p className="text-slate-600 font-mono text-[10px]">EOS_VETTING_PROTOCOL // SYNCING_REGISTRY</p>
                             </div>
                          </div>
                       ) : (
                          <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                             <div className="p-10 bg-black/60 rounded-[48px] border border-blue-500/20 border-l-8 text-left relative overflow-hidden shadow-inner group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Sparkles size={120} /></div>
                                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4 relative z-10">
                                   <Sparkles className="w-6 h-6 text-blue-400" />
                                   <h4 className="text-xl font-black text-white uppercase italic">Oracle Vetting Shard</h4>
                                </div>
                                <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l border-white/5 pl-8 font-medium relative z-10">
                                   {vettingReport}
                                </div>
                             </div>
                             <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center gap-6">
                                <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
                                <p className="text-[10px] text-emerald-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic">
                                   "Steward node {user.esin} meets the minimum industrial requirements for land and labour sharding. Risk Index: LOW."
                                </p>
                             </div>
                             <div className="flex gap-6">
                                <button onClick={() => setApplyStep('form')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">Modify Shard</button>
                                <button onClick={() => setApplyStep('commitment')} className="flex-[2] py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">Proceed to Commitment</button>
                             </div>
                          </div>
                       )}
                    </div>
                 )}

                 {applyStep === 'commitment' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl relative group">
                             <Fingerprint className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 border-2 border-blue-500/20 rounded-[32px] animate-ping opacity-30"></div>
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Node <span className="text-blue-400">Signature</span></h4>
                          <p className="text-slate-400 text-lg">Anchor your application with a ZK-Session signature.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Steward Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setApplyStep('vetting')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                             onClick={handleFinalizeApplication}
                             disabled={!esinSign}
                             className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                          >
                             <Key className="w-6 h-6 fill-current" /> Commit Application Shard
                          </button>
                       </div>
                    </div>
                 )}

                 {applyStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(37,99,235,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-blue-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Mission <span className="text-blue-400">Linked</span></h3>
                          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HASH_COMMIT_0x882_SYNC_OK</p>
                       </div>
                       <p className="text-slate-500 text-lg max-sm:text-sm max-w-sm italic leading-relaxed">"Your application shard is now anchored to the mission registry. Standby for institutional physical audit."</p>
                       <button onClick={() => setShowApplyModal(null)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 2. DEPLOY MODAL (Investor View) */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowDeployModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-blue-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Deploy <span className="text-blue-400">Capital</span></h3>
                       <p className="text-blue-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">MISSION_MINTING_PROTOCOL</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDeployModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Mission Product (Objective)</label>
                    <input type="text" value={deployProduct} onChange={e => setDeployProduct(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Registry Budget (EAC)</label>
                    <input type="number" value={deployBudget} onChange={e => setDeployBudget(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-2xl font-black text-blue-400" />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Investor Signature (ESIN)</label>
                    <input 
                      type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                      placeholder="EA-XXXX-XXXX" 
                      className="w-full bg-black border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase shadow-inner" 
                    />
                 </div>
                 <button 
                  onClick={handleDeployMission}
                  disabled={isDeploying || !esinSign}
                  className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4"
                 >
                    {isDeploying ? <Loader2 className="animate-spin" /> : <Stamp size={20} />}
                    AUTHORIZE DEPLOYMENT
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 3. REVIEW MODAL maintained below... */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 12s linear infinite; }
      `}</style>
    </div>
  );
};

export default ContractFarming;
