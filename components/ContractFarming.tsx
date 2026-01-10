
import React, { useState } from 'react';
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
  FileCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle,
  AlertCircle,
  FileDigit,
  Fingerprint
} from 'lucide-react';
import { User, FarmingContract, ContractApplication } from '../types';

interface ContractFarmingProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const MOCK_CONTRACTS: FarmingContract[] = [
  { 
    id: 'CTR-842', 
    investorEsin: 'EA-INV-01', 
    investorName: 'Neo-Agro Capital', 
    productType: 'Maize Farming Node', 
    requiredLand: '50-100 Hectares', 
    requiredLabour: '20 Steward Units', 
    budget: 50000, 
    status: 'Open', 
    applications: [],
    capitalIngested: false
  },
  { 
    id: 'CTR-112', 
    investorEsin: 'EA-INV-02', 
    investorName: 'Global Shard Fund', 
    productType: 'Spectral Wheat Export', 
    requiredLand: '200 Hectares', 
    requiredLabour: '50 Steward Units', 
    budget: 120000, 
    status: 'Auditing', 
    applications: [],
    capitalIngested: true
  },
];

const ContractFarming: React.FC<ContractFarmingProps> = ({ user, onSpendEAC }) => {
  const [contracts, setContracts] = useState<FarmingContract[]>(MOCK_CONTRACTS);
  const [activeTab, setActiveTab] = useState<'browse' | 'invest' | 'applications'>('browse');
  const [showApply, setShowApply] = useState<FarmingContract | null>(null);
  const [showDeploy, setShowDeploy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subStep, setSubStep] = useState<'form' | 'audit' | 'success'>('form');

  // Application Form
  const [landResources, setLandResources] = useState('');
  const [labourCapacity, setLabourCapacity] = useState('');

  // Deploy Form
  const [deployProduct, setDeployProduct] = useState('Maize Farming');
  const [deployBudget, setDeployBudget] = useState('50000');
  const [esinSign, setEsinSign] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setSubStep('audit');
      setIsSubmitting(false);
    }, 2500);
  };

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esinSign) return;
    setIsSubmitting(true);
    setTimeout(() => {
       const newContract: FarmingContract = {
          id: `CTR-${Math.floor(Math.random() * 1000)}`,
          investorEsin: user.esin,
          investorName: user.name,
          productType: deployProduct,
          requiredLand: 'Verification Required',
          requiredLabour: 'Verification Required',
          budget: Number(deployBudget),
          status: 'Open',
          applications: [],
          capitalIngested: false
       };
       setContracts([newContract, ...contracts]);
       setIsSubmitting(false);
       setShowDeploy(false);
       onSpendEAC(Number(deployBudget), 'CONTRACT_CAPITAL_ESCROW');
       alert("MISSION CAPITAL DEPLOYED: Contract initialized. Awaiting steward applications and audit triggers.");
    }, 2000);
  };

  const finalizeApplication = () => {
    if (!showApply) return;
    const newApp: ContractApplication = {
      id: `APP-${Math.floor(Math.random() * 1000)}`,
      farmerEsin: user.esin,
      farmerName: user.name,
      landResources,
      labourCapacity,
      auditStatus: 'Pending',
      paymentEscrowed: showApply.budget * 0.1 // 10% provision for resources
    };
    setContracts(prev => prev.map(c => c.id === showApply.id ? { ...c, status: 'Auditing', applications: [...c.applications, newApp] } : c));
    setSubStep('success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden group flex flex-col md:flex-row items-center gap-12">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Landmark className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)] ring-4 ring-white/10 shrink-0">
              <Handshake className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20">CONTRACT_SETTLEMENT_PORTAL</span>
                 <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Contract <span className="text-blue-400">Farming</span></h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-xl font-medium">
                 Institutional investment meet decentralized stewardship. Investors deploy mission capital; farmers apply with physically-verified resource assets.
              </p>
              <div className="flex gap-4 pt-2">
                 <button 
                  onClick={() => setActiveTab('browse')}
                  className={`px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center gap-3 transition-all ${activeTab === 'browse' ? 'agro-gradient text-white scale-105' : 'bg-white/5 text-slate-500 hover:text-white border border-white/10'}`}
                 >
                    <Search className="w-5 h-5" /> Browse Contracts
                 </button>
                 <button 
                  onClick={() => setShowDeploy(true)}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                    <PlusCircle className="w-5 h-5" /> Deploy Mission Capital
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group">
           <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Total Capital Locked</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">1.2<span className="text-lg text-blue-500">M</span></h4>
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Audit Queue</span>
                 <span className="text-blue-400">Processing</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[45%] shadow-[0_0_10px_#3b82f6]"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contracts.map(contract => (
               <div key={contract.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                  <div className="flex justify-between items-start mb-10 relative z-10">
                     <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 group-hover:rotate-6 transition-transform">
                        <Briefcase className="w-8 h-8 text-blue-400" />
                     </div>
                     <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20 bg-blue-500/5 text-blue-400`}>
                           {contract.status}
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono mt-3 font-black tracking-widest uppercase">{contract.id}</p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 relative z-10">
                     <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{contract.productType}</h4>
                     <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">FUNDED BY: {contract.investorName}</p>
                     
                     <div className="space-y-4 pt-4">
                        <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                              <span>Mission Capital Shard</span>
                              <span className="text-white font-mono text-lg">{contract.budget.toLocaleString()} EAC</span>
                           </div>
                           <div className="h-px bg-white/5 w-full"></div>
                           <div className="space-y-2">
                              <p className="text-[8px] text-slate-600 uppercase font-black">Audit Prerequisites</p>
                              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                                 <Globe className="w-3 h-3 text-blue-500" /> Land: {contract.requiredLand}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                                 <Users2 className="w-3 h-3 text-blue-500" /> Labor: {contract.requiredLabour}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 relative z-10 space-y-4">
                     {contract.status === 'Open' ? (
                        <button 
                          onClick={() => { setShowApply(contract); setSubStep('form'); }}
                          className="w-full py-6 agro-gradient rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                           <FileSignature className="w-4 h-4" /> Apply for Contract
                        </button>
                     ) : (
                        <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center gap-3">
                           <ShieldAlert className="w-4 h-4 text-blue-400 animate-pulse" />
                           <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Awaiting Site Inspection</span>
                        </div>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* MODAL: Apply for Contract */}
      {showApply && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowApply(null)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12 min-h-[650px] flex flex-col">
                 <button onClick={() => setShowApply(null)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 {subStep === 'form' && (
                   <form onSubmit={handleApply} className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-6">
                         <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl">
                            <Briefcase className="w-12 h-12 text-blue-400" />
                         </div>
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Steward <span className="text-blue-400">Application</span></h3>
                         <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Commit your land and labor resources. physical verification required.</p>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Available Land (Hectares/Coordinates)</label>
                            <input 
                              type="text" 
                              required 
                              value={landResources}
                              onChange={e => setLandResources(e.target.value)}
                              placeholder="e.g. 75 Hectares - Zone 4 Relay" 
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-lg font-bold text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800" 
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Labour Capacity (ESIN Units)</label>
                            <input 
                              type="text" 
                              required 
                              value={labourCapacity}
                              onChange={e => setLabourCapacity(e.target.value)}
                              placeholder="e.g. 25 Verified Node Stewards" 
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-lg font-bold text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800" 
                            />
                         </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full py-10 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-4 mt-6">
                         {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileSignature className="w-6 h-6" />}
                         {isSubmitting ? "COMMITING PROPOSAL..." : "INITIALIZE CONTRACT SYNC"}
                      </button>
                   </form>
                 )}

                 {subStep === 'audit' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative">
                             <HardHat className="w-12 h-12 text-amber-500 animate-bounce" />
                             <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full animate-ping"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Physical <span className="text-amber-500">Audit Protocol</span></h3>
                          <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto">"Metadata recorded. The EnvirosAgro Field Team must physically verify your resources to authorize resource ingest."</p>
                       </div>

                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-4">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-white/5 rounded-2xl">
                                <Clock className="w-6 h-6 text-slate-400" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Audit Queue Rank</p>
                                <p className="text-sm font-bold text-white uppercase tracking-widest">PRIORITY_SYNC_#{(Math.random()*100).toFixed(0)}</p>
                             </div>
                          </div>
                       </div>

                       <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-center gap-6">
                          <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                          <p className="text-[10px] text-blue-200/50 font-black uppercase leading-relaxed tracking-tight">
                             INVESTMENT_LOCK: Resource ingest (EAC payout for land/labor) is frozen until physical audit completion.
                          </p>
                       </div>

                       <button 
                        onClick={finalizeApplication}
                        className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center justify-center gap-4 active:scale-95"
                       >
                          <ShieldCheck className="w-6 h-6" /> REQUEST FIELD AUDIT
                       </button>
                    </div>
                 )}

                 {subStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(37,99,235,0.4)] scale-110 relative group">
                         <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-10px] rounded-full border-4 border-blue-500/20 animate-ping"></div>
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Application <span className="text-blue-400">Committed</span></h3>
                         <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Audit Ticket: #CTR-{(Math.random()*10000).toFixed(0)} active.</p>
                      </div>
                      <p className="text-slate-500 text-sm max-w-sm italic leading-relaxed">"Your resource dossier is now indexed. Standby for physical node inspection by EnvirosAgro."</p>
                      <button onClick={() => setShowApply(null)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Portal</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* MODAL: Deploy Mission Capital */}
      {showDeploy && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowDeploy(false)}></div>
            <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] animate-in zoom-in duration-300 border-2">
               <div className="p-16 space-y-12 min-h-[600px] flex flex-col justify-center">
                  <button onClick={() => setShowDeploy(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                  
                  <div className="text-center space-y-6">
                     <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl">
                        <TrendingUp className="w-12 h-12 text-blue-400" />
                     </div>
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Deploy <span className="text-blue-400">Mission Capital</span></h3>
                     <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Register a production target and escrow resources for steward nodes.</p>
                  </div>

                  <form onSubmit={handleDeploy} className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Mission Designation (Product)</label>
                        <input 
                           type="text" 
                           required 
                           value={deployProduct}
                           onChange={e => setDeployProduct(e.target.value)}
                           placeholder="e.g. Maize Production Node" 
                           className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800" 
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Escrow Budget (EAC Capital)</label>
                        <input 
                           type="number" 
                           required 
                           value={deployBudget}
                           onChange={e => setDeployBudget(e.target.value)}
                           className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-3xl font-mono text-emerald-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all" 
                        />
                     </div>
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6 text-center block">ESIN Institutional Signature</label>
                        <div className="relative">
                           <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                           <input 
                              type="text" 
                              required 
                              value={esinSign}
                              onChange={e => setEsinSign(e.target.value)}
                              placeholder="EA-XXXX-XXXX-XXXX"
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 pl-16 pr-10 text-white font-mono uppercase tracking-[0.2em] focus:ring-4 focus:ring-blue-500/40 outline-none transition-all" 
                           />
                        </div>
                     </div>

                     <button type="submit" disabled={isSubmitting || !esinSign} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-6 disabled:opacity-30">
                        {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Database className="w-6 h-6" />}
                        {isSubmitting ? "COMMITING CAPITAL..." : "INITIALIZE MISSION ESCROW"}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default ContractFarming;
