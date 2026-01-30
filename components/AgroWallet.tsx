
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
  ExternalLink,
  Lock,
  PieChart,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Landmark,
  PlusCircle,
  Pickaxe,
  LockKeyhole,
  ShieldAlert,
  HardHat,
  MapPin,
  BadgeCheck,
  Activity,
  Waves,
  Gauge,
  Binary,
  Cpu,
  RefreshCcw,
  Download,
  ArrowRightLeft,
  Gem,
  Key,
  Sprout,
  Users,
  Upload,
  FileCheck,
  Bot,
  Link,
  Unlink,
  CreditCard,
  Building2,
  Smartphone,
  Globe2,
  Fingerprint,
  SmartphoneNfc,
  WalletCards,
  ArrowUp,
  ArrowDown,
  Link2,
  ShoppingBag,
  Store,
  DollarSign,
  Banknote,
  Repeat,
  Gift,
  Info,
  Trello,
  Briefcase,
  FileSignature,
  Database,
  BarChart4,
  Unlock,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Heart,
  // Added Settings to fix error on line 831
  Settings
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject, FarmingContract } from '../types';

interface AgroWalletProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onUpdateUser?: (updatedUser: User) => void;
  pendingAction?: string | null;
  clearAction?: () => void;
  onSwap: (eatAmount: number) => boolean;
  projects?: AgroProject[];
}

const FOREX_RATES = {
  EAC_USD: 0.0124, 
  EAT_USD: 1.4288, 
  USD_KES: 132.50, 
  EAC_KES: 1.64,   
};

const MOCK_HISTORY: AgroTransaction[] = [
  { id: 'TX-882194', type: 'Reward', farmId: 'ZONE-4-NE', details: 'Reaction Mining: High-Value Review', value: 20.00, unit: 'EAC' },
  { id: 'TX-882193', type: 'TokenzMint', farmId: 'ZONE-4-NE', details: 'Milestone: m-Constant +0.2 improvement', value: 5.42, unit: 'EAT' },
  { id: 'TX-882192', type: 'MarketTrade', farmId: 'ZONE-2-CA', details: 'Purchase: Drone Spectral Pack', value: -450.00, unit: 'EAC' },
  { id: 'TX-G-001', type: 'Gateway_Deposit', farmId: 'GLOBAL-GW', details: 'Fiat Ingest: Linked M-Pesa Shard', value: 1200.00, unit: 'KES' },
];

const REACTION_LEDGER = [
  { id: 'VCH-001', stwd: 'BANTU_04', msg: 'Verified m-constant stability in local node.', val: '+1.5', type: 'Vouch', time: '12m ago' },
  { id: 'VCH-002', stwd: 'STWD_KE', msg: 'Vouched: Verified Purity Shard.', val: '+2.0', type: 'Consensus', time: '2h ago' },
  { id: 'VCH-003', stwd: 'AGRO_X', msg: 'Resonance Sync Successful.', val: '+0.8', type: 'Vouch', time: '5h ago' },
  { id: 'VCH-004', stwd: 'ECO_AUDIT', msg: 'Quality Ingest Validated.', val: '+3.2', type: 'Vouch', time: '8_h ago' },
];

const AgroWallet: React.FC<AgroWalletProps> = ({ user, onNavigate, onUpdateUser, pendingAction, clearAction, onSwap, projects = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'harvest' | 'gateway' | 'projects' | 'history'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [unclaimedEAC, setUnclaimedEAC] = useState(12.45);
  const [harvestCycle, setHarvestCycle] = useState(0);
  
  // Reaction Mining Specific States
  const [pendingVouches, setPendingVouches] = useState(42);
  const [socialResonance, setSocialResonance] = useState(94.2);

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState<'deposit' | 'withdrawal' | null>(null);
  const [showLinkProvider, setShowLinkProvider] = useState(false);
  
  const [swapInputEAT, setSwapInputEAT] = useState('1');
  const [isSwapping, setIsSwapping] = useState(false);
  
  const [gatewayAmount, setGatewayAmount] = useState('1000');
  const [gatewayCurrency, setGatewayCurrency] = useState<'USD' | 'KES'>('KES');
  const [selectedProvider, setSelectedProvider] = useState<LinkedProvider | null>(user.wallet.linkedProviders?.[0] || null);
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<'config' | 'sign' | 'success'>('config');

  // Admin Finance Action States
  const [isRequisitioning, setIsRequisitioning] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubTab === 'harvest') {
      const interval = setInterval(() => {
        setUnclaimedEAC(prev => prev + 0.0012);
        setHarvestCycle(prev => (prev + 1) % 100);
        // Simulate organic growth of social consensus
        if (Math.random() > 0.8) setPendingVouches(p => p + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSubTab]);

  const handleHarvestManual = () => {
    if (unclaimedEAC < 1) return;
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
      setUnclaimedEAC(0);
      setPendingVouches(0);
      setIsClaiming(false);
      alert(`REACTION MINING SUCCESS: ${unclaimedEAC.toFixed(2)} EAC synchronized from social consensus shards.`);
    }, 2000);
  };

  const handleExecuteSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const success = onSwap(Number(swapInputEAT));
      setIsSwapping(false);
      if (success) setShowSwapModal(false);
    }, 2000);
  };

  const handleLinkProvider = () => {
    setIsProcessingGateway(true);
    setTimeout(() => {
      const newProvider: LinkedProvider = {
        id: `LP-${Math.random().toString(36).substring(7).toUpperCase()}`,
        type: 'Mobile',
        name: 'M-Pesa Business Node',
        accountFragment: '...1447',
        status: 'Active',
        lastSync: 'Now'
      };
      
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          wallet: {
            ...user.wallet,
            linkedProviders: [...(user.wallet.linkedProviders || []), newProvider]
          }
        });
      }
      setIsProcessingGateway(false);
      setShowLinkProvider(false);
      setSelectedProvider(newProvider);
    }, 2000);
  };

  // Added resetPortal function to fix "Cannot find name 'resetPortal'" error on line 844
  const resetPortal = () => {
    setGatewayStep('config');
    setShowGatewayModal(null);
    setEsinSign('');
    setIsProcessingGateway(false);
  };

  const handleGatewayAction = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN verification failed.");
      return;
    }
    
    setIsProcessingGateway(true);
    setGatewayStep('sign');
    
    setTimeout(() => {
      const isDeposit = showGatewayModal === 'deposit';
      const fiatAmount = Number(gatewayAmount);
      
      let eacEquivalent = 0;
      if (gatewayCurrency === 'USD') {
        eacEquivalent = fiatAmount / FOREX_RATES.EAC_USD;
      } else {
        eacEquivalent = fiatAmount / FOREX_RATES.EAC_KES;
      }

      if (!isDeposit && user.wallet.balance < eacEquivalent) {
        alert("LIQUIDITY ERROR: Insufficient EAC for withdrawal. Non-withdrawable bonus cannot be bridged out.");
        setIsProcessingGateway(false);
        setGatewayStep('config');
        return;
      }

      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          wallet: {
            ...user.wallet,
            balance: isDeposit ? user.wallet.balance + eacEquivalent : user.wallet.balance - eacEquivalent
          }
        });
      }
      
      setIsProcessingGateway(false);
      setGatewayStep('success');
    }, 3000);
  };

  const handleProjectRequisition = (project: AgroProject) => {
    if (project.adminEsin !== user.esin) return;
    setIsRequisitioning(project.id);
    setTimeout(() => {
      alert(`CAPITAL REQUISITIONED: ${project.fundedAmount} EAC from ${project.name} has been transferred to active industrial operations.`);
      setIsRequisitioning(null);
    }, 2000);
  };

  const totalSpendable = user.wallet.balance + user.wallet.bonusBalance;
  const totalFiatUSD = (totalSpendable * FOREX_RATES.EAC_USD) + (user.wallet.eatBalance * FOREX_RATES.EAT_USD);

  // Filter for items where user is Admin
  const managedProjects = projects.filter(p => p.adminEsin === user.esin);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto">
      
      {/* Dual Token Status HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 glass-card rounded-[32px] bg-emerald-500/5 border-emerald-500/20 text-center space-y-1 shadow-lg">
           <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Total Spendable (Utility)</p>
           <h4 className="text-3xl font-mono font-black text-white">{totalSpendable.toFixed(0)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-yellow-500/5 border-yellow-500/20 text-center space-y-1 shadow-lg">
           <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest leading-none">EAT Gold (Equity)</p>
           <h4 className="text-3xl font-mono font-black text-white">{user.wallet.eatBalance.toFixed(4)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-blue-500/5 border-blue-500/20 text-center space-y-1 shadow-lg">
           <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none">Total Value (USD)</p>
           <h4 className="text-3xl font-mono font-black text-white">${totalFiatUSD.toFixed(2)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-indigo-500/5 border-indigo-500/20 text-center space-y-1 shadow-lg">
           <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none">Institutional Rate</p>
           <h4 className="text-xl font-mono font-black text-white">{user.wallet.exchangeRate.toFixed(2)} <span className="text-[10px]">EAC/EAT</span></h4>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[28px] w-fit border border-white/5 bg-black/40 shadow-sm overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Treasury Node', icon: Wallet },
          { id: 'gateway', label: 'Institutional Bridges', icon: Globe2 },
          { id: 'projects', label: 'Project Financials', icon: Trello },
          { id: 'harvest', label: 'Reaction Harvest', icon: Sparkles },
          { id: 'history', label: 'Registry Ledger', icon: History },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeSubTab === 'overview' && (
          <div className="space-y-8 animate-in slide-in-from-left duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-card p-10 md:p-14 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 agro-gradient opacity-10 blur-[120px] -mr-48 -mt-48"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                    <div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Node Institutional Account</span>
                        <h2 className="text-5xl md:text-8xl font-black text-white mt-6 font-mono tracking-tighter">
                          {totalSpendable.toFixed(0)} <span className="text-3xl font-bold text-emerald-400 italic">EAC</span>
                        </h2>
                        <div className="flex items-center gap-8 mt-8">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-xl">
                              <Gem size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Deflationary Asset</p>
                              <p className="text-2xl font-mono font-black text-yellow-500">{user.wallet.eatBalance.toFixed(4)} EAT</p>
                            </div>
                          </div>
                          <div className="h-10 w-px bg-white/5"></div>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                              <DollarSign size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Fiat Equivalent (KES)</p>
                              <p className="text-2xl font-mono font-black text-blue-400">{(totalFiatUSD * FOREX_RATES.USD_KES).toLocaleString()} KES</p>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button 
                          onClick={() => setShowSwapModal(true)}
                          className="p-6 bg-yellow-500 rounded-[28px] text-black hover:bg-yellow-400 transition-all shadow-xl flex items-center justify-center gap-3 px-10"
                        >
                          <ArrowRightLeft className="w-6 h-6" />
                          <span className="text-sm font-black uppercase tracking-widest">Institutional Swap</span>
                        </button>
                        <p className="text-[9px] text-slate-600 font-black uppercase text-center">Cost: {user.wallet.exchangeRate.toFixed(1)} EAC / 1 EAT</p>
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-10 border-t border-white/5">
                    <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 group hover:border-emerald-500/30 transition-all shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <Coins className="w-4 h-4 text-emerald-400" />
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Withdrawable Utility</p>
                          </div>
                          <TrendingUp className="w-4 h-4 text-emerald-400 opacity-20" />
                        </div>
                        <p className="text-4xl font-mono font-black text-white">{user.wallet.balance.toFixed(0)}</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 group hover:border-emerald-500/5 transition-all shadow-inner">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <Gift className="w-4 h-4 text-emerald-400" />
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Incentive Shards</p>
                          </div>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 opacity-20" />
                        </div>
                        <p className="text-4xl font-mono font-black text-emerald-400">{user.wallet.bonusBalance.toFixed(0)}</p>
                    </div>
                  </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                  <div className="glass-card p-10 rounded-[56px] border-blue-500/20 bg-blue-500/5 space-y-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
                        <Globe2 className="w-48 h-48 text-white" />
                     </div>
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-xl">
                           <Repeat className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Forex <span className="text-blue-400">Registry</span></h4>
                     </div>
                     <div className="space-y-4 relative z-10">
                        {[
                           { pair: 'EAC / USD', rate: FOREX_RATES.EAC_USD, trend: '+1.2%', col: 'text-emerald-400' },
                           { pair: 'EAT / USD', rate: FOREX_RATES.EAT_USD, trend: '+4.8%', col: 'text-yellow-500' },
                           { pair: 'KES / USD', rate: FOREX_RATES.USD_KES, trend: '-0.2%', col: 'text-slate-400', isInverse: true },
                        ].map(f => (
                           <div key={f.pair} className="p-4 bg-black/60 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-blue-500/20 transition-all shadow-sm">
                              <div>
                                 <p className="text-[8px] text-slate-500 font-black uppercase mb-1">{f.pair}</p>
                                 <p className={`text-xl font-mono font-black ${f.col}`}>
                                    {f.isInverse ? f.rate.toFixed(2) : f.rate.toFixed(4)}
                                 </p>
                              </div>
                              <span className={`text-[10px] font-black ${f.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-500'}`}>{f.trend}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 glass-card rounded-[40px] bg-emerald-600/5 border border-emerald-500/20 space-y-4 shadow-md">
                     <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-emerald-400" />
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Non-Withdrawable Incentive</h4>
                     </div>
                     <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic">
                        Your 100 EAC Registration Shard is a gift to help you initialize your node. It cannot be withdrawn to fiat but can be used for any in-app marketplace asset or project vouch.
                     </p>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* --- REACTION HARVEST (Reaction Mining Integrated) --- */}
        {activeSubTab === 'harvest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500 px-4">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/40 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s]"><Sparkles size={500} className="text-emerald-400" /></div>
                
                <div className="relative z-10 space-y-12 w-full">
                   <div className="flex flex-col items-center space-y-6">
                      <div className="w-72 h-72 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center relative group">
                         <div className="absolute inset-4 rounded-full border-2 border-emerald-500/40 animate-spin-slow"></div>
                         <div className="w-56 h-56 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.25)] group-hover:bg-emerald-500/20 transition-all duration-700">
                            <Pickaxe className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                            <p className="text-5xl font-mono font-black text-white tracking-tighter">{unclaimedEAC.toFixed(3)}</p>
                            <p className="text-[11px] text-emerald-500 font-black uppercase tracking-[0.4em] mt-3">MINTABLE REACTION SHARDS</p>
                         </div>
                         <svg className="absolute inset-0 w-72 h-72 transform -rotate-90">
                            <circle cx="144" cy="144" r="135" fill="transparent" stroke="rgba(16,185,129,0.1)" strokeWidth="6" />
                            <circle cx="144" cy="144" r="135" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray={848} strokeDashoffset={848 - (848 * harvestCycle / 100)} strokeLinecap="round" />
                         </svg>
                      </div>
                   </div>

                   <div className="max-w-md mx-auto space-y-4">
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">REACTION <span className="text-emerald-400">MINING HUB</span></h3>
                      <p className="text-slate-400 text-base font-medium italic leading-relaxed">
                        "Consolidating social consensus from Live Farming and Online Garden shards into utility EAC. Social sentiment is a verified industrial data point."
                      </p>
                   </div>

                   <button 
                    onClick={handleHarvestManual}
                    disabled={isClaiming || unclaimedEAC < 0.1}
                    className={`w-full max-w-md py-8 rounded-[40px] font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-6 mx-auto ${
                       unclaimedEAC >= 0.1 ? 'agro-gradient text-white hover:scale-[1.02] active:scale-95 shadow-emerald-900/40' : 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed'
                    }`}
                   >
                      {isClaiming ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                      {isClaiming ? 'ANCHORING SHARDS...' : 'SYNC REACTION CREDITS'}
                   </button>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><ThumbsUp className="w-48 h-48 text-indigo-400" /></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-4 bg-indigo-500 rounded-2xl shadow-2xl">
                         <Users size={28} className="text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">Consensus <span className="text-indigo-400">Registry</span></h4>
                   </div>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 flex justify-between items-center group-hover:border-indigo-500/30 transition-all">
                         <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Pending Vouches</p>
                            <p className="text-3xl font-mono font-black text-white">{pendingVouches}</p>
                         </div>
                         <ThumbsUp className="text-emerald-400 animate-pulse" size={24} />
                      </div>
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 flex justify-between items-center group-hover:border-blue-500/30 transition-all">
                         <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Network Resonance</p>
                            <p className="text-3xl font-mono font-black text-white">{socialResonance}%</p>
                         </div>
                         <Activity className="text-blue-400" size={24} />
                      </div>
                   </div>

                   <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner relative z-10 overflow-hidden">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                         <MessageSquare size={14} className="text-indigo-400" /> Vouch Inflow Ledger
                      </h5>
                      <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                         {REACTION_LEDGER.map((r, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 group/vouch hover:border-indigo-500/40 transition-all">
                               <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">@{r.stwd}</span>
                                  <span className="text-emerald-500 font-mono font-black text-xs">{r.val}</span>
                               </div>
                               <p className="text-[10px] text-slate-400 italic">"{r.msg}"</p>
                               <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2 opacity-50 group-hover/vouch:opacity-100 transition-opacity">
                                  <span className="text-[8px] font-black text-slate-600 uppercase">{r.type}</span>
                                  <span className="text-[8px] font-mono text-slate-700">{r.time}</span>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-amber-500/10 bg-amber-500/[0.02] space-y-4 group">
                   <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-amber-500" />
                      <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Mining Policy</h4>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed italic border-l-2 border-amber-500/20 pl-4">
                      "Reaction Mining translates social consensus into utility value. Consumer sentiment for your industrial output is synthesized into AEC credits based on the volume of verified vouchers."
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* --- PROJECT FINANCIALS --- */}
        {activeSubTab === 'projects' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Project <span className="text-emerald-400">Financials</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Admin view: Manage invested capital and operational requisitions.</p>
                </div>
                <div className="flex gap-4">
                  <div className="p-6 bg-black/40 border border-white/10 rounded-3xl text-center min-w-[140px] shadow-xl">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Managed Capital</p>
                      <p className="text-2xl font-mono font-black text-emerald-400">
                        {managedProjects.reduce((acc, curr) => acc + curr.fundedAmount, 0).toLocaleString()} <span className="text-xs">EAC</span>
                      </p>
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4">
                {managedProjects.length === 0 ? (
                  <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-20 border-2 border-dashed border-white/5 rounded-[48px]">
                      <Trello size={64} className="text-slate-500" />
                      <p className="text-xl font-black uppercase tracking-[0.4em]">No Managed Project Shards</p>
                  </div>
                ) : (
                  managedProjects.map(proj => (
                    <div key={proj.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={160} /></div>
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl group-hover:rotate-6 transition-all">
                             <Trello size={28} />
                          </div>
                          <div className="text-right">
                             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">{proj.status}</span>
                             <p className="text-[10px] text-slate-600 font-mono mt-2 font-black">NODE_ID: {proj.id}</p>
                          </div>
                       </div>
                       
                       <h4 className="text-3xl font-black text-white uppercase italic leading-none group-hover:text-emerald-400 transition-colors mb-6">{proj.name}</h4>
                       
                       <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
                          <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-1 shadow-inner">
                             <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Funded Amount</p>
                             <p className="text-2xl font-mono font-black text-white">{proj.fundedAmount.toLocaleString()} EAC</p>
                          </div>
                          <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-1 shadow-inner">
                             <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Total Goal</p>
                             <p className="text-2xl font-mono font-black text-slate-400">{proj.totalCapital.toLocaleString()} EAC</p>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 flex gap-4 relative z-10">
                          <button 
                            onClick={() => handleProjectRequisition(proj)}
                            disabled={isRequisitioning === proj.id}
                            className="flex-1 py-5 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                          >
                             {isRequisitioning === proj.id ? <Loader2 size={16} className="animate-spin" /> : <ArrowRightLeft size={16} />}
                             Requisition Capital
                          </button>
                          <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                             <BarChart4 size={20} />
                          </button>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

        {activeSubTab === 'gateway' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Institutional <span className="text-indigo-400">Bridges</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Connect external payment networks and manage capital gateways.</p>
                </div>
                <button 
                  onClick={() => setShowLinkProvider(true)}
                  className="px-8 py-4 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95"
                >
                   <Link2 className="w-5 h-5" /> Link Provider Node
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4">
                <div className="lg:col-span-2 space-y-8">
                   <h4 className="text-xl font-bold text-white uppercase tracking-widest px-4">Provider Registry</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(user.wallet.linkedProviders || []).map(lp => (
                        <div key={lp.id} className="p-8 glass-card rounded-[44px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden bg-black/40 shadow-xl">
                           <div className="flex justify-between items-start mb-8">
                              <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-indigo-600/10 transition-colors">
                                 {lp.type === 'Mobile' ? <SmartphoneNfc className="w-8 h-8 text-indigo-400" /> : <Building2 className="w-8 h-8 text-indigo-400" />}
                              </div>
                              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">{lp.status}</span>
                           </div>
                           <h5 className="text-2xl font-black text-white italic tracking-tight">{lp.name}</h5>
                           <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em] mt-2">ACCOUNT: {lp.accountFragment}</p>
                           <div className="pt-8 mt-6 border-t border-white/5 flex justify-between items-center">
                              <p className="text-[9px] text-slate-600 font-bold uppercase">Sync: {lp.lastSync}</p>
                              <button className="text-rose-500 hover:text-rose-400 transition-colors"><Unlink size={16} /></button>
                           </div>
                        </div>
                      ))}
                      {(user.wallet.linkedProviders || []).length === 0 && (
                        <div className="col-span-full py-20 glass-card rounded-[48px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center opacity-40">
                           <WalletCards size={48} className="mb-4 text-slate-600" />
                           <p className="text-lg font-black uppercase tracking-widest">No Linked Gateways</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
                        <Bot className="w-48 h-48 text-indigo-400" />
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                            <Bot className="w-6 h-6 text-indigo-400" />
                         </div>
                         <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Bridge <span className="text-indigo-400">Oracle</span></h4>
                      </div>
                      <p className="text-slate-300 text-sm italic font-medium leading-relaxed border-l-2 border-indigo-500/40 pl-6 relative z-10">
                        "Institutional bridges allow stewards to settle EAC balances directly into local fiat nodes. Current liquidity reserves: <span className="text-indigo-400">STABLE</span>."
                      </p>
                      <div className="grid grid-cols-2 gap-4 relative z-10">
                         <button 
                           onClick={() => { setShowGatewayModal('deposit'); setGatewayStep('config'); }}
                           className="py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl"
                         >
                            <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Deposit Shard
                         </button>
                         <button 
                           onClick={() => { setShowGatewayModal('withdrawal'); setGatewayStep('config'); }}
                           className="py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl"
                         >
                            <ArrowUpRight className="w-4 h-4 text-rose-500" /> Withdraw Shard
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'history' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 px-4">
            <div className="glass-card rounded-[40px] overflow-hidden border border-white/5 bg-black/40 shadow-xl">
               <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <span className="col-span-2">Transaction Shard</span>
                  <span>Type</span>
                  <span>Impact Node</span>
                  <span className="text-right">Ledger Value</span>
               </div>
               <div className="divide-y divide-white/5">
                  {MOCK_HISTORY.map(tx => (
                    <div key={tx.id} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                       <div className="col-span-2 flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                             {tx.value > 0 ? <ArrowDown className="w-5 h-5 text-emerald-400" /> : <ArrowUp className="w-5 h-5 text-rose-400" />}
                          </div>
                          <div>
                             <p className="text-base font-bold text-white uppercase italic truncate group-hover:text-emerald-400 transition-colors">{tx.details}</p>
                             <p className="text-[10px] text-slate-500 font-mono mt-1">{tx.id}</p>
                          </div>
                       </div>
                       <div>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase text-slate-400 rounded-full tracking-widest">{tx.type}</span>
                       </div>
                       <div className="text-xs text-slate-500 font-mono font-bold">{tx.farmId}</div>
                       <div className="text-right">
                          <p className={`text-xl font-mono font-black ${tx.value > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.value > 0 ? '+' : ''}{tx.value.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-tighter">{tx.unit}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 bg-black/80 flex justify-between items-center border-t border-white/5">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Aggregate Registry Depth: 1,424 Shards</p>
                  <button className="flex items-center gap-2 text-[10px] font-black text-emerald-400 hover:text-white transition-all uppercase tracking-[0.3em]">
                    <Download className="w-4 h-4" /> Download Audit Archive
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* SWAP MODAL */}
      {showSwapModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowSwapModal(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] p-10 md:p-14 shadow-3xl text-center space-y-12 animate-in zoom-in duration-300 border-2">
            <button onClick={() => setShowSwapModal(false)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-yellow-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-yellow-500/20 shadow-2xl relative group overflow-hidden">
                <Gem size={48} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Institutional <span className="text-yellow-500">Gold Swap</span></h3>
                <p className="text-slate-400 text-lg mt-4 italic font-medium leading-relaxed">Exchange utility EAC for deflationary EAT equity shards anchored to network m-resilience.</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between px-8">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">EAT Target Amount</span>
                  <span className="text-2xl font-mono font-black text-yellow-500">{swapInputEAT} EAT</span>
                </div>
                <input 
                  type="range" min="0.1" max="10" step="0.1" value={swapInputEAT}
                  onChange={e => setSwapInputEAT(e.target.value)}
                  className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-yellow-500 shadow-inner border border-white/5"
                />
              </div>

              <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-8 shadow-inner">
                <div className="flex justify-between items-center px-4 text-slate-500 font-black text-[10px] uppercase">
                  <span>Current Index Rate</span>
                  <span className="text-white font-mono">{user.wallet.exchangeRate.toFixed(2)} EAC</span>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div className="flex justify-between items-end px-4">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600 font-black uppercase mb-2">Registry Settlement</p>
                    <p className="text-5xl font-mono font-black text-white tracking-tighter">
                      {(Number(swapInputEAT) * user.wallet.exchangeRate).toFixed(0)} <span className="text-xl italic text-emerald-400">EAC</span>
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 shadow-xl">
                    <BadgeCheck size={24} />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleExecuteSwap}
                disabled={isSwapping || (Number(swapInputEAT) * user.wallet.exchangeRate) > user.wallet.balance}
                className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
              >
                {isSwapping ? <Loader2 className="w-8 h-8 animate-spin" /> : <RefreshCw className="w-8 h-8" />}
                {isSwapping ? 'ANCHORING SHARDS...' : 'AUTHORIZE SWAP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GATEWAY MODAL (Deposit/Withdrawal) */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowGatewayModal(null)}></div>
          <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] p-10 md:p-14 shadow-[0_0_150px_rgba(79,70,229,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col min-h-[750px]">
            <button onClick={() => setShowGatewayModal(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={32} /></button>
            
            <div className="flex-1 flex flex-col justify-center">
               {gatewayStep === 'config' && (
                 <div className="space-y-12 animate-in slide-in-from-right-4">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl">
                         {showGatewayModal === 'deposit' ? <ArrowDownLeft size={48} className="text-emerald-400" /> : <ArrowUpRight size={48} className="text-rose-500" />}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">{showGatewayModal === 'deposit' ? 'Fiat Ingest' : 'Fiat Egress'} <span className="text-indigo-400">Bridge</span></h3>
                        <p className="text-slate-400 text-lg italic leading-relaxed max-sm:text-sm max-w-sm mx-auto">"Bridging decentralized utility with legacy financial nodes."</p>
                      </div>
                    </div>

                    <div className="space-y-10">
                       <div className="grid grid-cols-2 gap-6 px-4">
                          <button onClick={() => setGatewayCurrency('KES')} className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${gatewayCurrency === 'KES' ? 'border-indigo-500 bg-indigo-600/10 text-white' : 'border-white/5 bg-black/40 text-slate-600'}`}>
                             <Banknote size={32} />
                             <span className="text-xs font-black uppercase">KES Gateway</span>
                          </button>
                          <button onClick={() => setGatewayCurrency('USD')} className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${gatewayCurrency === 'USD' ? 'border-indigo-500 bg-indigo-600/10 text-white' : 'border-white/5 bg-black/40 text-slate-600'}`}>
                             <Globe2 size={32} />
                             <span className="text-xs font-black uppercase">USD Gateway</span>
                          </button>
                       </div>

                       <div className="space-y-4 px-4">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Payload Value ({gatewayCurrency})</label>
                          <div className="p-10 bg-black/60 rounded-[56px] border border-white/10 flex items-center justify-between shadow-inner">
                             <input 
                               type="number" value={gatewayAmount} onChange={e => setGatewayAmount(e.target.value)}
                               className="bg-transparent text-6xl font-mono font-black text-white outline-none w-full" 
                             />
                             <span className="text-2xl font-black text-indigo-400 italic">{gatewayCurrency}</span>
                          </div>
                       </div>

                       {selectedProvider ? (
                          <div className="mx-4 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[44px] flex justify-between items-center shadow-xl group">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner group-hover:rotate-6 transition-transform">
                                   {selectedProvider.type === 'Mobile' ? <SmartphoneNfc size={28} /> : <Building2 size={28} />}
                                </div>
                                <div>
                                   <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Target Relay Node</p>
                                   <p className="text-xl font-black text-white uppercase italic">{selectedProvider.name}</p>
                                </div>
                             </div>
                             {/* Fixed: Added Settings icon from lucide-react */}
                             <button onClick={() => setShowLinkProvider(true)} className="text-slate-500 hover:text-white p-3"><Settings size={20} /></button>
                          </div>
                       ) : (
                          <button onClick={() => setShowLinkProvider(true)} className="mx-4 py-8 border-4 border-dashed border-white/5 rounded-[44px] text-slate-700 font-black uppercase tracking-widest hover:border-indigo-500/20 hover:text-indigo-400 transition-all flex items-center justify-center gap-4">
                             <PlusCircle size={24} /> Link Gateway Provider
                          </button>
                       )}
                    </div>

                    <button 
                      onClick={gatewayStep === 'success' ? resetPortal : handleGatewayAction}
                      disabled={!selectedProvider || !gatewayAmount}
                      className="mx-4 py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                    >
                       Initialize ZK-Auth Handshake <ChevronRight className="inline ml-2" />
                    </button>
                 </div>
               )}

               {gatewayStep === 'sign' && (
                  <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center flex-1">
                     <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl">
                           <Fingerprint className="w-12 h-12 text-indigo-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-indigo-400">Audit</span></h3>
                     </div>
                     <div className="space-y-4 max-w-md mx-auto w-full">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Node Signature (ESIN)</label>
                        <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                        />
                     </div>
                     <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[44px] flex items-center gap-6 mx-4 shadow-inner">
                        <ShieldAlert className="w-10 h-10 text-indigo-400 shrink-0" />
                        <p className="text-[10px] text-indigo-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic">
                           "Cross-ledger settlement initiated. Non-withdrawable registration shards are excluded from egress protocols. Bridge fee: 0.2%"
                        </p>
                     </div>
                     <button 
                        onClick={handleGatewayAction}
                        disabled={isProcessingGateway || !esinSign}
                        className="mx-4 py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                     >
                        {isProcessingGateway ? <Loader2 className="w-8 h-8 animate-spin" /> : <Lock size={28} className="fill-current" />}
                        {isProcessingGateway ? "ANCHORING BRIDGE..." : "AUTHORIZE SETTLEMENT"}
                     </button>
                  </div>
               )}

               {gatewayStep === 'success' && (
                  <div className="space-y-16 py-10 animate-in zoom-in duration-700 flex-1 flex flex-col justify-center items-center text-center">
                     <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(79,70,229,0.3)] relative group scale-110">
                        <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Bridge <span className="text-emerald-400">Finalized</span></h3>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">SETTLEMENT_HASH: 0xGW_{Math.random().toString(16).substring(2,6).toUpperCase()}_OK</p>
                     </div>
                     <button onClick={() => setShowGatewayModal(null)} className="w-full max-w-sm py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Node</button>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* LINK PROVIDER MODAL */}
      {showLinkProvider && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowLinkProvider(false)}></div>
           <div className="relative z-10 w-full max-md glass-card p-12 rounded-[56px] border border-white/10 bg-[#050706] shadow-3xl text-center space-y-10 border-2">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl animate-float">
                 <Link2 size={40} className="text-indigo-400" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Link <span className="text-indigo-400">Node</span></h3>
                 <p className="text-slate-500 text-sm leading-relaxed">Connect your M-Pesa or Bank account shard to enable institutional capital ingest.</p>
              </div>
              <div className="space-y-4">
                 <button onClick={handleLinkProvider} disabled={isProcessingGateway} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    {isProcessingGateway ? <Loader2 className="animate-spin" /> : <SmartphoneNfc size={20} />} Link M-Pesa Business Node
                 </button>
                 <button className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-3">
                    <Building2 size={20} /> Bank Transfer Node
                 </button>
              </div>
              <button onClick={() => setShowLinkProvider(false)} className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-rose-500">Cancel Protocol</button>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroWallet;
