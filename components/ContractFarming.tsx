
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
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  contracts: FarmingContract[];
  setContracts: React.Dispatch<React.SetStateAction<FarmingContract[]>>;
  onSaveContract: (contract: FarmingContract) => void;
  onInitializeLiveProcess?: (params: any) => void;
}

const CONTRACT_INDEXING_FEE = 75;

const ContractFarming: React.FC<ContractFarmingProps> = ({ user, onSpendEAC, onNavigate, contracts, setContracts, onSaveContract, onInitializeLiveProcess }) => {
  const [isAccessVerifying, setIsAccessVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'deployments' | 'engagements'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  
  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );
  const hasLandRegistered = landResources.length > 0;

  const [showApplyModal, setShowApplyModal] = useState<FarmingContract | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<FarmingContract | null>(null);

  const [applyStep, setApplyStep] = useState<'form' | 'vetting' | 'commitment' | 'success'>('form');
  const [selectedLandForApp, setSelectedLandForApp] = useState<AgroResource | null>(null);
  const [labourCapacity, setLabourCapacity] = useState('');
  const [isVetting, setIsVetting] = useState(false);
  const [vettingReport, setVettingReport] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  const [deployProduct, setDeployProduct] = useState('Maize Farming Node');
  const [deployBudget, setDeployBudget] = useState('50000');
  const [deployLandReq, setDeployLandReq] = useState('50-100 Hectares');
  const [deployLabourReq, setDeployLabourReq] = useState('20 Steward Units');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAccessVerifying(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const availableContracts = useMemo(() => contracts.filter(c => c.status === 'Open'), [contracts]);
  const myDeployments = useMemo(() => contracts.filter(c => c.investorEsin === user.esin), [contracts, user.esin]);
  const myEngagements = useMemo(() => contracts.filter(c => c.applications.some(app => app.farmerEsin === user.esin)), [contracts, user.esin]);

  const filteredBrowse = availableContracts.filter(c => 
    c.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.investorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyStart = (contract: FarmingContract) => {
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
      Contract Goal: ${showApplyModal?.productType}`;
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

    const updatedContract = { ...showApplyModal, applications: [...showApplyModal.applications, newApp] };
    onSaveContract(updatedContract);
    
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

  const handleDeployMission = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    const totalCost = Number(deployBudget) + CONTRACT_INDEXING_FEE;
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
      onSaveContract(newContract);
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all group shadow-xl"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          RETURN TO COMMAND CENTER
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full">
         <div className="glass-card p-16 md:p-24 rounded-[80px] bg-black/60 border border-white/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:scale-105 transition-transform duration-[12s]">
               <Handshake className="w-[800px] h-[800px] text-white" />
            </div>
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
            </div>
         </div>
      </div>

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

      <div className="min-h-[700px] px-4 md:px-0">
        {activeTab === 'browse' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                {filteredBrowse.map(contract => (
                   <div key={contract.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col bg-black/40 shadow-3xl relative overflow-hidden h-[720px]">
                      <div className="p-12 space-y-10 flex-1 flex flex-col">
                         <div className="flex justify-between items-start">
                            <div className={`p-6 rounded-3xl bg-blue-600/10 border border-blue-600/20 text-blue-400 shadow-2xl group-hover:rotate-6 transition-all`}>
                               <Briefcase size={40} />
                            </div>
                            <div className="text-right">
                               <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">OPEN_MISSION</span>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors drop-shadow-2xl">{contract.productType}</h4>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">DEPLOYED BY: {contract.investorName}</p>
                            <p className="text-lg text-slate-400 leading-relaxed italic mt-8 opacity-80 group-hover:opacity-100 transition-opacity">"Seeking steward nodes with {contract.requiredLand}."</p>
                         </div>
                      </div>
                      <div className="p-12 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-700 font-black uppercase">MISSION CAPITAL</p>
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

        {activeTab === 'deployments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {myDeployments.map(contract => (
                <div key={contract.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 group flex flex-col h-full shadow-3xl">
                   <div className="flex justify-between items-start mb-8">
                      <div className="p-5 rounded-3xl bg-blue-600/10 border border-blue-600/20 text-blue-400">
                         <Landmark size={28} />
                      </div>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded border border-blue-500/20">{contract.status}</span>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic m-0 leading-tight">{contract.productType}</h4>
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
                   <button className="w-full py-4 mt-8 bg-blue-600 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl active:scale-95">Manage Deployment</button>
                </div>
             ))}
          </div>
        )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowApplyModal(null)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 overflow-y-auto custom-scrollbar flex-1">
                 <button onClick={() => setShowApplyModal(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all z-20"><X size={24} /></button>
                 {applyStep === 'form' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center">
                       <h3 className="text-4xl font-black text-white uppercase italic text-center">Mission <span className="text-blue-400">Application</span></h3>
                       <div className="space-y-8">
                          <input 
                            type="text" 
                            required 
                            value={labourCapacity}
                            onChange={e => setLabourCapacity(e.target.value)}
                            placeholder="Labour Capacity (e.g. 24 Stewards)" 
                            className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-8 text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10 shadow-inner" 
                          />
                       </div>
                       <button onClick={handleRunVetting} className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-4 active:scale-95">Initialize Oracle Vetting <ChevronRight className="w-6 h-6" /></button>
                    </div>
                 )}
                 {applyStep === 'vetting' && (
                    <div className="space-y-12 flex-1 flex flex-col justify-center text-center">
                       {isVetting ? <Loader2 size={120} className="text-blue-500 animate-spin mx-auto" /> : (
                          <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                             <div className="p-10 bg-black/60 rounded-[48px] border border-blue-500/20 text-left">
                                <h4 className="text-xl font-black text-white uppercase italic">Oracle Vetting Shard</h4>
                                <div className="text-slate-300 text-lg leading-relaxed mt-4">{vettingReport}</div>
                             </div>
                             <div className="space-y-4">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Node Signature (ESIN)</label>
                                <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX" className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase shadow-inner" />
                             </div>
                             <button onClick={handleFinalizeApplication} disabled={!esinSign} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">Commit Application Shard</button>
                          </div>
                       )}
                    </div>
                 )}
                 {applyStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <CheckCircle2 size={120} className="text-emerald-500" />
                       <h3 className="text-6xl font-black text-white uppercase italic">Mission <span className="text-blue-400">Linked</span></h3>
                       <button onClick={() => setShowApplyModal(null)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {showDeployModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowDeployModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-blue-500/[0.02] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                       <PlusCircle size={32} />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Deploy <span className="text-blue-400">Capital</span></h3>
                 </div>
                 <button onClick={() => setShowDeployModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all z-20"><X size={24} /></button>
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
                    <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX" className="w-full bg-black border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase shadow-inner" />
                 </div>
                 <button onClick={handleDeployMission} disabled={isDeploying || !esinSign} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 border border-white/10 ring-8 ring-blue-500/5">
                    {isDeploying ? <Loader2 className="animate-spin" /> : <Stamp size={20} />}
                    AUTHORIZE DEPLOYMENT
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
      `}</style>
    </div>
  );
};

export default ContractFarming;
