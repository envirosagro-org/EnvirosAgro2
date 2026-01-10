
import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  History, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  Lock,
  PieChart,
  BarChart3,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Dna,
  Cpu,
  Globe,
  Sparkles,
  Bot,
  Award,
  Medal,
  Upload,
  Library,
  Flame,
  Search,
  Filter,
  CheckSquare,
  Activity,
  Wifi,
  Download,
  Landmark,
  ArrowRight,
  PlusCircle,
  Pickaxe,
  LockKeyhole,
  ShieldAlert,
  HardHat,
  MapPin,
  BadgeCheck
} from 'lucide-react';
import { User, AgroTransaction, AgroProject, ViewState } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface AgroWalletProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const MOCK_HISTORY: AgroTransaction[] = [
  { id: 'TX-882194', type: 'Reward', farmId: 'ZONE-4-NE', details: 'Contribution: High-Value Soil PDF', value: 20.00, unit: 'EAC' },
  { id: 'TX-882193', type: 'Burn', farmId: 'GLOBAL-NODE', details: 'Boost: Project Visibility (24h)', value: -100.00, unit: 'EAC' },
  { id: 'TX-882192', type: 'MarketTrade', farmId: 'ZONE-2-CA', details: 'Purchase: Drone Spectral Pack', value: -450.00, unit: 'EAC' },
  { id: 'TX-882191', type: 'Harvest', farmId: 'ZONE-1-NY', details: 'Weekly Scientific Harvest Payout', value: 42.50, unit: 'EAC' },
];

const INITIAL_PROJECTS: AgroProject[] = [
  { 
    id: 'PRJ-882', 
    name: 'Nebraska Soil Restoration', 
    adminEsin: 'EA-2025-ABCD-1234', 
    description: 'Institutional scale moisture injection.', 
    thrust: 'Environmental', 
    status: 'Execution', 
    totalCapital: 50000, 
    fundedAmount: 50000, 
    batchesClaimed: 1, 
    totalBatches: 5, 
    progress: 20, 
    roiEstimate: 12, 
    collateralLocked: 25000,
    profitsAccrued: 12000,
    investorShareRatio: 0.15,
    performanceIndex: 85,
    memberCount: 12,
    isPreAudited: true,
    isPostAudited: true
  },
  { 
    id: 'PRJ-104', 
    name: 'Nairobi Ingest Hub', 
    adminEsin: 'EA-2025-ABCD-1234', 
    description: 'IoT array deployment for semi-arid zones.', 
    thrust: 'Technological', 
    status: 'Funding', 
    totalCapital: 120000, 
    fundedAmount: 85000, 
    batchesClaimed: 0, 
    totalBatches: 10, 
    progress: 5, 
    roiEstimate: 18, 
    collateralLocked: 60000,
    profitsAccrued: 0,
    investorShareRatio: 0.15,
    performanceIndex: 0,
    memberCount: 8,
    isPreAudited: true,
    isPostAudited: false
  },
];

const AgroWallet: React.FC<AgroWalletProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'harvest' | 'projects' | 'history'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [unclaimedEAC, setUnclaimedEAC] = useState(12.45);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stateful projects to track claims
  const [activeProjects, setActiveProjects] = useState<AgroProject[]>(INITIAL_PROJECTS);

  // Project Settlement States
  const [selectedProjForClaim, setSelectedProjForClaim] = useState<AgroProject | null>(null);
  const [isSettlingBatch, setIsSettlingBatch] = useState(false);
  const [isRequestingPostAudit, setIsRequestingPostAudit] = useState(false);

  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);
  const nextTierPoints = user.wallet.tier === 'Seed' ? 500 : user.wallet.tier === 'Sprout' ? 2000 : 2000;
  const progressPercent = Math.min(100, (user.wallet.lifetimeEarned / nextTierPoints) * 100);

  // C(a) and m Factor based multiplier
  const multiplier = 1 + (Math.log10(user.metrics.agriculturalCodeU * user.metrics.timeConstantTau + 1) / 5);

  useEffect(() => {
    if (activeSubTab === 'harvest') {
      const interval = setInterval(() => {
        setUnclaimedEAC(prev => prev + 0.001);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSubTab]);

  const handleClaimBatch = (project: AgroProject) => {
    const requiredCollateral = project.totalCapital * 0.5;

    if (totalBalance < requiredCollateral) {
      alert(`INSUFFICIENT COLLATERAL: Tokenz Policy requires you to have at least ${requiredCollateral.toLocaleString()} EAC (50% of total project capital) in your treasury to unlock the next batch.`);
      return;
    }

    if (!project.isPostAudited) {
      alert("POST-ACQUISITION AUDIT REQUIRED: Capital has been requisitioned, but the physical evaluation of resource deployment is pending. Request a physical audit before settling batches.");
      return;
    }

    if (project.batchesClaimed >= project.totalBatches) {
      alert("PROJECT COMPLETE: All batches for this mission have already been settled.");
      return;
    }

    setSelectedProjForClaim(project);
  };

  const handleRequestPostAudit = (projectId: string) => {
    setIsRequestingPostAudit(true);
    setTimeout(() => {
      setActiveProjects(prev => prev.map(p => p.id === projectId ? { ...p, isPostAudited: true } : p));
      setIsRequestingPostAudit(false);
      alert("POST-ACQUISITION AUDIT COMPLETE: Project evaluated. Secure deployment verified. Batch settlement protocols unlocked.");
    }, 2500);
  };

  const executeBatchSettlement = () => {
    if (!selectedProjForClaim || !onUpdateUser) return;
    
    setIsSettlingBatch(true);
    
    setTimeout(() => {
      const batchValue = selectedProjForClaim.totalCapital / selectedProjForClaim.totalBatches;
      const finalReleaseAmount = batchValue * multiplier;

      // 1. Update Project State
      setActiveProjects(prev => prev.map(p => {
        if (p.id === selectedProjForClaim.id) {
          const newClaimed = p.batchesClaimed + 1;
          return {
            ...p,
            batchesClaimed: newClaimed,
            progress: Math.round((newClaimed / p.totalBatches) * 100)
          };
        }
        return p;
      }));

      // 2. Update Global User State
      onUpdateUser({
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance + finalReleaseAmount,
          lifetimeEarned: user.wallet.lifetimeEarned + finalReleaseAmount
        }
      });

      setIsSettlingBatch(false);
      setSelectedProjForClaim(null);
      alert(`BATCH SETTLED: +${finalReleaseAmount.toFixed(2)} EAC has been released from Tokenz Escrow to your node treasury.`);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Treasury & Rep', icon: PieChart },
          { id: 'harvest', label: 'EOS Harvesting', icon: Pickaxe },
          { id: 'projects', label: 'Project Batches', icon: Landmark },
          { id: 'history', label: 'Ledger Logs', icon: History },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-10 rounded-[40px] relative overflow-hidden flex flex-col justify-between border-emerald-500/20 bg-emerald-500/5">
                 <div className="absolute top-0 right-0 w-96 h-96 agro-gradient opacity-10 blur-[120px] -mr-48 -mt-48"></div>
                 <div className="relative z-10 flex justify-between items-start">
                    <div>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Combined Node Liquidity</span>
                       <h2 className="text-6xl font-black text-white mt-4 font-mono tracking-tighter">
                          {totalBalance.toLocaleString()} <span className="text-2xl font-bold text-emerald-500">EAC</span>
                       </h2>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => onNavigate('ecosystem')}
                        className="p-4 bg-emerald-600 rounded-2xl text-white hover:bg-emerald-500 transition-all border border-white/10 shadow-xl flex items-center gap-3 px-6"
                       >
                          <PlusCircle className="w-6 h-6" />
                          <span className="text-xs font-black uppercase tracking-widest">Deposit via Tokenz</span>
                       </button>
                       <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-blue-600 transition-all border border-white/10 shadow-xl"><ArrowDownLeft className="w-6 h-6" /></button>
                    </div>
                 </div>

                 <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                       <div className="flex items-center gap-2 mb-2">
                          <Coins className="w-3 h-3 text-emerald-400" />
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Spendable (Withdraw-ready)</p>
                       </div>
                       <p className="text-2xl font-mono font-black text-white">{user.wallet.balance.toFixed(2)}</p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-amber-500/20">
                       <div className="flex items-center gap-2 mb-2">
                          <LockKeyhole className="w-3 h-3 text-amber-500" />
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Reserved (Investment Only)</p>
                       </div>
                       <p className="text-2xl font-mono font-black text-amber-400">{(user.wallet.bonusBalance || 0).toFixed(2)}</p>
                    </div>
                 </div>

                 <div className="relative z-10 mt-8 flex gap-12 items-center pt-8 border-t border-white/5">
                    <div>
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Node Value</p>
                       <p className="text-lg font-mono font-black text-white">≈ ${(totalBalance * 0.85).toFixed(2)} USD</p>
                    </div>
                    <div className="p-4 bg-emerald-500/10 rounded-2xl flex items-center gap-3">
                       <TrendingUp className="w-5 h-5 text-emerald-400" />
                       <div>
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Sustainability Multiplier</p>
                          <p className="text-xs font-bold text-white">{multiplier.toFixed(4)}x</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 bg-blue-600/5 border-blue-500/20">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-white/5 flex flex-col items-center justify-center">
                       <Medal className="w-10 h-10 text-blue-400 mb-1" />
                       <span className="text-xl font-black text-white">{user.wallet.lifetimeEarned.toFixed(0)}</span>
                    </div>
                    <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
                       <circle cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                       <circle cx="64" cy="64" r="60" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={377} strokeDashoffset={377 - (377 * progressPercent / 100)} className="text-blue-500" />
                    </svg>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{user.wallet.tier} Rank</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Reputation Protocol</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'harvest' && (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-12 rounded-[48px] bg-emerald-600/5 border-emerald-500/20 flex flex-col items-center text-center space-y-8 overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <div className="w-24 h-24 agro-gradient rounded-[32px] flex items-center justify-center shadow-2xl animate-pulse">
                 <Pickaxe className="w-12 h-12 text-white" />
              </div>
              <div className="space-y-4 relative z-10">
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter">EOS <span className="text-emerald-400">Harvesting</span></h2>
                 <p className="text-slate-400 text-lg max-w-xl mx-auto">Your node is currently participating in the decentralized scientific validation harvest. Claim accumulated EAC earned via proof-of-work telemetry validation.</p>
              </div>
              <div className="py-10">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">Pending Accrual</p>
                 <h3 className="text-7xl font-mono font-black text-emerald-400 tracking-tighter">{unclaimedEAC.toFixed(4)} <span className="text-xl text-emerald-600">EAC</span></h3>
              </div>
              <button 
                onClick={() => {
                  setIsClaiming(true);
                  setTimeout(() => {
                    if (onUpdateUser) {
                       onUpdateUser({
                          ...user,
                          wallet: {
                             ...user.wallet,
                             balance: user.wallet.balance + unclaimedEAC,
                             lifetimeEarned: user.wallet.lifetimeEarned + unclaimedEAC
                          }
                       });
                    }
                    alert(`CLAIM SUCCESS: ${unclaimedEAC.toFixed(2)} EAC has been moved to your main treasury.`);
                    setUnclaimedEAC(0);
                    setIsClaiming(false);
                  }, 2000);
                }}
                disabled={isClaiming || unclaimedEAC < 1}
                className="w-full max-w-md py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                 {isClaiming ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                 {isClaiming ? "SYNCING LEDGER..." : "CLAIM HARVEST"}
              </button>
           </div>
        </div>
      )}

      {activeSubTab === 'projects' && (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-12 rounded-[56px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30 shrink-0">
                 <Landmark className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Batch <span className="text-blue-400">Settlement</span></h2>
                 <p className="text-slate-400 text-lg">Claim your investment rewards through batch-release cycles. Tokenz policies apply.</p>
              </div>
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center">
                 <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-1">Policy Lock</p>
                 <p className="text-xs font-bold text-white uppercase">50% Capital Collateral</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {activeProjects.map(proj => (
                <div key={proj.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-blue-500/30 transition-all space-y-8 group relative overflow-hidden bg-black/20">
                   <div className="flex justify-between items-start relative z-10">
                      <div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors italic leading-none">{proj.name}</h4>
                         <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-2">{proj.id} // THRUST: {proj.thrust.toUpperCase()}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                         <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                           Batch {proj.batchesClaimed}/{proj.totalBatches}
                         </span>
                         {proj.isPostAudited ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40">
                               <BadgeCheck size={12} />
                               <span className="text-[8px] font-black uppercase">Post-Audit OK</span>
                            </div>
                         ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/40 animate-pulse">
                               <HardHat size={12} />
                               <span className="text-[8px] font-black uppercase">Post-Acquisition Audit Required</span>
                            </div>
                         )}
                      </div>
                   </div>

                   {!proj.isPostAudited && (
                      <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[40px] space-y-4 animate-pulse">
                         <div className="flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-amber-500" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Capital Deployment Lock</h4>
                         </div>
                         <p className="text-xs text-slate-400 italic leading-relaxed">
                            "Secure investment check: Our team must physically evaluate the deployment of requisitioned capital before batch settlement unlocks."
                         </p>
                         <button 
                            onClick={() => handleRequestPostAudit(proj.id)}
                            disabled={isRequestingPostAudit}
                            className="w-full py-4 bg-amber-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                         >
                            {isRequestingPostAudit ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
                            Request Post-Acquisition Audit
                         </button>
                      </div>
                   )}

                   <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                         <span>Release Progress</span>
                         <span className="text-white">{proj.progress}%</span>
                      </div>
                      <div className="h-4 bg-black/60 rounded-full border border-white/5 overflow-hidden p-1 shadow-inner">
                         <div className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                      </div>
                      <div className="grid grid-cols-5 gap-1 pt-2">
                         {[...Array(proj.totalBatches)].map((_, i) => (
                           <div key={i} className={`h-1 rounded-full ${i < proj.batchesClaimed ? 'bg-emerald-500' : 'bg-white/5'}`}></div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Batch Value</p>
                         <p className="text-xl font-mono font-black text-white">{(proj.totalCapital / proj.totalBatches).toLocaleString()} <span className="text-xs">EAC</span></p>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Est. Yield</p>
                         <p className="text-xl font-mono font-black text-emerald-400">+{proj.roiEstimate}%</p>
                      </div>
                   </div>

                   <button 
                    onClick={() => handleClaimBatch(proj)}
                    disabled={proj.batchesClaimed >= proj.totalBatches || !proj.isPostAudited}
                    className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-[0.3em] hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                   >
                      {proj.batchesClaimed >= proj.totalBatches ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          Project Settled
                        </>
                      ) : !proj.isPostAudited ? (
                        <>
                          <Lock className="w-5 h-5 text-amber-500" />
                          Awaiting Post-Audit Verification
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-5 h-5" />
                          Verify Next Batch Release
                        </>
                      )}
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           <div className="glass-card rounded-[40px] overflow-hidden border-white/5 bg-black/40">
              <div className="p-8 border-b border-white/10 bg-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Transaction Ledger</h4>
                 </div>
                 <div className="flex gap-4">
                    <button className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Search className="w-4 h-4" /></button>
                    <button className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                 </div>
              </div>
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                 {MOCK_HISTORY.map(tx => (
                   <div key={tx.id} className="p-8 hover:bg-white/[0.02] transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                         <div className={`p-4 rounded-2xl ${tx.value > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'} group-hover:scale-110 transition-transform`}>
                            {tx.value > 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                         </div>
                         <div>
                            <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{tx.details}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{tx.id}</p>
                               <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                               <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{tx.type}</p>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-2xl font-mono font-black ${tx.value > 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {tx.value > 0 ? '+' : ''}{tx.value.toFixed(2)} <span className="text-xs">EAC</span>
                         </p>
                         <p className="text-[9px] text-slate-700 font-black uppercase mt-1">VALIDATED_EOS_MAINNET</p>
                      </div>
                   </div>
                 ))}
                 <div className="p-10 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                    End of Local Ledger History Shard
                 </div>
              </div>
           </div>
        </div>
      )}

      {selectedProjForClaim && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setSelectedProjForClaim(null)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-1 rounded-[56px] border-blue-500/20 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-in zoom-in duration-300">
              <div className="p-12 space-y-10 min-h-[600px] flex flex-col justify-center">
                 <button onClick={() => setSelectedProjForClaim(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 <div className="text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24">
                       <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center border border-blue-500/20 shadow-2xl">
                          <History className={`w-12 h-12 text-blue-400 ${isSettlingBatch ? 'animate-spin' : ''}`} />
                       </div>
                       {isSettlingBatch && <div className="absolute inset-0 border-4 border-emerald-500 rounded-[32px] animate-ping opacity-20"></div>}
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Batch <span className="text-blue-400">Settlement</span></h3>
                       <p className="text-slate-400 text-lg font-medium">Authorizing release shard for {selectedProjForClaim.name}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-6">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                          <span className="text-slate-500">Base Release</span>
                          <span className="text-white">{(selectedProjForClaim.totalCapital / selectedProjForClaim.totalBatches).toLocaleString()} EAC</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2 pb-6 border-b border-white/5">
                          <span className="text-emerald-500 flex items-center gap-2">
                             <TrendingUp className="w-3 h-3" /> Multiplier
                          </span>
                          <span className="text-emerald-400 font-mono text-lg">{multiplier.toFixed(4)}x</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em] px-2 pt-2">
                          <span className="text-slate-300">Total Settlement</span>
                          <span className="text-3xl font-mono font-black text-emerald-400">
                             {((selectedProjForClaim.totalCapital / selectedProjForClaim.totalBatches) * multiplier).toFixed(2)} <span className="text-xs">EAC</span>
                          </span>
                       </div>
                    </div>

                    <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-center gap-6">
                       <div className="p-3 bg-amber-500/10 rounded-xl">
                          <ShieldAlert className="w-6 h-6 text-amber-500" />
                       </div>
                       <p className="text-[10px] text-amber-200/50 font-black uppercase leading-relaxed tracking-tight">
                          Tokenz Guard: 50% Capital Collateral ({(selectedProjForClaim.totalCapital * 0.5).toLocaleString()} EAC) verified in node treasury. Signature required to commit settlement.
                       </p>
                    </div>
                 </div>

                 <button 
                  onClick={executeBatchSettlement}
                  disabled={isSettlingBatch}
                  className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30"
                 >
                    {isSettlingBatch ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span>SYNCHRONIZING LEDGER...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-8 h-8" />
                        <span>AUTHORIZE PAYOUT SHARD</span>
                      </>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgroWallet;
