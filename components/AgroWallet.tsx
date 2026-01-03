
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
  ArrowRight
} from 'lucide-react';
import { User, AgroTransaction, AgroProject } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface AgroWalletProps {
  user: User;
}

const MOCK_HISTORY: AgroTransaction[] = [
  { id: 'TX-882194', type: 'Reward', farmId: 'ZONE-4-NE', details: 'Contribution: High-Value Soil PDF', value: 20.00, unit: 'EAC' },
  { id: 'TX-882193', type: 'Burn', farmId: 'GLOBAL-NODE', details: 'Boost: Project Visibility (24h)', value: -100.00, unit: 'EAC' },
  { id: 'TX-882192', type: 'MarketTrade', farmId: 'ZONE-2-CA', details: 'Purchase: Drone Spectral Pack', value: -450.00, unit: 'EAC' },
  { id: 'TX-882191', type: 'Harvest', farmId: 'ZONE-1-NY', details: 'Weekly Scientific Harvest Payout', value: 42.50, unit: 'EAC' },
];

const AgroWallet: React.FC<AgroWalletProps> = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'harvest' | 'projects' | 'history'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [unclaimedEAC, setUnclaimedEAC] = useState(12.45);
  const [searchTerm, setSearchTerm] = useState('');

  // Project Settlement States
  const [selectedProjForClaim, setSelectedProjForClaim] = useState<AgroProject | null>(null);
  const [isSettlingBatch, setIsSettlingBatch] = useState(false);

  const nextTierPoints = user.wallet.tier === 'Seed' ? 500 : user.wallet.tier === 'Sprout' ? 2000 : 2000;
  const progressPercent = Math.min(100, (user.wallet.lifetimeEarned / nextTierPoints) * 100);

  useEffect(() => {
    if (activeSubTab === 'harvest') {
      const interval = setInterval(() => {
        setUnclaimedEAC(prev => prev + 0.001);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSubTab]);

  const handleClaimBatch = (project: AgroProject) => {
    const batchSize = (project.totalCapital / project.totalBatches);
    const requiredCollateral = project.totalCapital * 0.5;

    if (user.wallet.balance < requiredCollateral) {
      alert(`INSUFFICIENT COLLATERAL: Tokenz Policy requires you to have at least ${requiredCollateral.toLocaleString()} EAC (50% of total project capital) in your treasury to unlock the next batch.`);
      return;
    }

    setSelectedProjForClaim(project);
  };

  const executeBatchSettlement = () => {
    setIsSettlingBatch(true);
    setTimeout(() => {
      alert(`BATCH SETTLED: EAC has been released from Tokenz Escrow to your node treasury. Project progress updated to Stage ${selectedProjForClaim!.batchesClaimed + 1}.`);
      setIsSettlingBatch(false);
      setSelectedProjForClaim(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Wallet Navigation */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Treasury & Rep', icon: PieChart },
          { id: 'harvest', label: 'EOS Harvesting', icon: Zap },
          { id: 'projects', label: 'Project Batches', icon: Landmark },
          { id: 'history', label: 'Ledger Logs', icon: History },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Spendable Liquidity</span>
                       <h2 className="text-6xl font-black text-white mt-4 font-mono tracking-tighter">
                          {user.wallet.balance.toLocaleString()} <span className="text-2xl font-bold text-emerald-500">EAC</span>
                       </h2>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-emerald-600 transition-all border border-white/10 shadow-xl"><ArrowUpRight className="w-6 h-6" /></button>
                       <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-blue-600 transition-all border border-white/10 shadow-xl"><ArrowDownLeft className="w-6 h-6" /></button>
                    </div>
                 </div>
                 <div className="relative z-10 mt-12 flex gap-12 items-center pt-8 border-t border-white/5">
                    <div>
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Node Value</p>
                       <p className="text-lg font-mono font-black text-white">≈ ${(user.wallet.balance * 0.85).toFixed(2)} USD</p>
                    </div>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6 bg-blue-600/5 border-blue-500/20">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-white/5 flex flex-col items-center justify-center">
                       <Medal className="w-10 h-10 text-blue-400 mb-1" />
                       <span className="text-xl font-black text-white">{user.wallet.lifetimeEarned}</span>
                    </div>
                    <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
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

      {activeSubTab === 'projects' && (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-12 rounded-[48px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center border border-blue-500/30 shrink-0">
                 <Landmark className="w-10 h-10 text-blue-400" />
              </div>
              <div className="flex-1 space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Batch <span className="text-blue-400">Settlement</span></h2>
                 <p className="text-slate-400 text-lg">Claim your investment rewards through batch-release cycles. Tokenz policies apply.</p>
              </div>
              <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
                 <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">50% Capital Collateral Required</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'PRJ-NE-882', name: 'Zone 4 Moisture Array', thrust: 'Technological', totalCapital: 120000, batchesClaimed: 0, totalBatches: 5, status: 'Funding' },
                { id: 'PRJ-SELF-001', name: 'Personal Greenhouse Sync', thrust: 'Technological', totalCapital: 25000, batchesClaimed: 1, totalBatches: 4, status: 'Execution' },
              ].map(proj => (
                <div key={proj.id} className="glass-card p-8 rounded-[40px] border border-white/5 space-y-8 group hover:border-blue-500/30 transition-all">
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-xl font-bold text-white uppercase tracking-tight">{proj.name}</h4>
                         <span className="text-[10px] font-mono text-slate-500">{proj.id}</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                         <Layers className="w-5 h-5 text-blue-400" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                         <span>Batch Lock: {proj.totalCapital / proj.totalBatches} EAC</span>
                         <span>{proj.batchesClaimed} / {proj.totalBatches} Unlocked</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex gap-1">
                         {[...Array(proj.totalBatches)].map((_, i) => (
                           <div key={i} className={`h-full flex-1 ${i < proj.batchesClaimed ? 'bg-blue-500' : 'bg-white/5'}`}></div>
                         ))}
                      </div>
                   </div>

                   <button 
                    onClick={() => handleClaimBatch(proj as any)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                   >
                      <Zap className="w-4 h-4" /> Initialize Batch Claim
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Batch Settlement Modal */}
      {selectedProjForClaim && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setSelectedProjForClaim(null)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-1 rounded-[44px] border-blue-500/20 overflow-hidden">
              <div className="bg-[#050706] p-12 space-y-8 flex flex-col items-center text-center">
                 <button onClick={() => setSelectedProjForClaim(null)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                 </button>

                 <div className="w-24 h-24 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-2xl">
                    <ShieldCheck className="w-12 h-12 text-blue-400" />
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Settlement Policy</h3>
                    <p className="text-slate-400 text-sm italic">
                       Confirm batch release of <span className="text-blue-400 font-bold">{(selectedProjForClaim.totalCapital / selectedProjForClaim.totalBatches).toLocaleString()} EAC</span>.
                    </p>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4 text-left">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold uppercase">Collateral Verified</span>
                          <span className="text-emerald-400 font-black">PASS</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 font-bold uppercase">Registry Link</span>
                          <span className="text-white font-mono">{selectedProjForClaim.id}</span>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={executeBatchSettlement}
                  disabled={isSettlingBatch}
                  className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {isSettlingBatch ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                    {isSettlingBatch ? "EXECUTING POLICY..." : "SIGN BATCH RELEASE"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ... history subtab as constant ... */}
    </div>
  );
};

export default AgroWallet;
