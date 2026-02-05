
import React, { useState, useMemo, useEffect } from 'react';
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
  X, 
  Loader2, 
  CheckCircle2, 
  Landmark, 
  PlusCircle, 
  ShieldAlert, 
  Globe2, 
  Fingerprint, 
  SmartphoneNfc, 
  Link2, 
  DollarSign, 
  Bot,
  Repeat, 
  Info, 
  BarChart4, 
  Stamp, 
  Trash2, 
  Gem,
  Activity,
  Sparkles,
  Search,
  Download, 
  Building2,
  User as UserIcon,
  CreditCard,
  Binary,
  ExternalLink,
  Shield,
  Lock as LockIcon,
  ArrowRightLeft,
  Key,
  Database,
  Layers,
  Target,
  Waves,
  Cpu,
  Workflow,
  ArrowRightCircle,
  Package,
  Sprout,
  Factory,
  Trophy
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject, AgroBlock, NotificationType } from '../types';

interface AgroWalletProps {
  user: User;
  isGuest: boolean;
  onNavigate: (view: ViewState) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onSwap: (eatAmount: number) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onClaimSocialHarvest?: () => void;
  projects?: AgroProject[];
  transactions?: AgroTransaction[];
  blockchain?: AgroBlock[];
  isMining?: boolean;
  notify?: (type: NotificationType, title: string, message: string) => void;
}

const FOREX_RATES = {
  EAC_USD: 0.0124, 
  EAT_USD: 1.4288, 
  USD_KES: 132.50, 
  EAC_KES: 1.64,   
};

const STAKING_TIERS = [
  { id: 'bronze', label: 'ECOLOGY_STAKE', min: 100, yield: 4.5, period: '30 Cycles', icon: Sprout, col: 'text-emerald-400' },
  { id: 'silver', label: 'INDUSTRIAL_STAKE', min: 1000, yield: 12.2, period: '90 Cycles', icon: Factory, col: 'text-indigo-400' },
  { id: 'gold', label: 'SOVEREIGN_STAKE', min: 5000, yield: 24.8, period: '360 Cycles', icon: Trophy, col: 'text-amber-500' },
];

const AgroWallet: React.FC<AgroWalletProps> = ({ 
  user, 
  isGuest,
  onNavigate, 
  onUpdateUser, 
  onSwap, 
  onEarnEAC, 
  onClaimSocialHarvest, 
  projects = [], 
  transactions = [],
  blockchain = [],
  isMining = false,
  notify
}) => {
  const [activeSubTab, setActiveTab] = useState<'treasury' | 'staking' | 'swap' | 'gateway' | 'ledger'>('treasury');
  
  // Wallet States
  const [showGatewayModal, setShowGatewayModal] = useState<'deposit' | 'withdrawal' | null>(null);
  const [showLinkProvider, setShowLinkProvider] = useState(false);
  
  // Swap State
  const [swapAmountEAC, setSwapAmountEAC] = useState('1000');
  const [isSwapping, setIsSwapping] = useState(false);

  // Staking State
  const [stakeAmount, setStakeAmount] = useState('100');
  const [selectedTier, setSelectedTier] = useState(STAKING_TIERS[0]);
  const [isStaking, setIsStaking] = useState(false);

  // Gateway Form States
  const [gatewayAmount, setGatewayAmount] = useState('1000');
  const [gatewayCurrency, setGatewayCurrency] = useState<'USD' | 'KES'>('KES');
  const [selectedProvider, setSelectedProvider] = useState<LinkedProvider | null>(user.wallet.linkedProviders?.[0] || null);
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingGateway, setIsProcessingGateway] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<'config' | 'handoff' | 'external_sync' | 'sign' | 'success'>('config');

  // Harvest States
  const [isHarvesting, setIsHarvesting] = useState(false);
  const pendingHarvest = user.wallet.pendingSocialHarvest || 0;

  // Real-time m-drift simulation
  const [mDrift, setMDrift] = useState(0.02);
  useEffect(() => {
    const interval = setInterval(() => {
      setMDrift(prev => Number((prev + (Math.random() * 0.01 - 0.005)).toFixed(3)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Logic: Calculate EAC equivalent
  const gatewayEacEquivalent = useMemo(() => {
    const val = Number(gatewayAmount) || 0;
    if (gatewayCurrency === 'USD') return val / FOREX_RATES.EAC_USD;
    return val / FOREX_RATES.EAC_KES;
  }, [gatewayAmount, gatewayCurrency]);

  const swapEatYield = useMemo(() => {
    const val = Number(swapAmountEAC) || 0;
    return val / user.wallet.exchangeRate;
  }, [swapAmountEAC, user.wallet.exchangeRate]);

  const handleExecuteSwap = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }
    const amountEAC = Number(swapAmountEAC);
    if (user.wallet.balance < amountEAC) {
      notify?.('error', 'LIQUIDITY_VOID', 'Insufficient utility credits for equity conversion.');
      return;
    }

    setIsSwapping(true);
    try {
        const eatYield = amountEAC / user.wallet.exchangeRate;
        if (await onSwap(eatYield)) {
          setIsSwapping(false);
          setEsinSign('');
          notify?.('success', 'ASSET_ANCHORED', `Converted ${amountEAC} EAC into ${eatYield.toFixed(4)} EAT shards.`);
        } else {
          setIsSwapping(false);
        }
    } catch (e) {
        setIsSwapping(false);
    }
  };

  const handleExecuteStake = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }
    const amt = Number(stakeAmount);
    if (user.wallet.eatBalance < amt) {
       notify?.('error', 'EQUITY_VOID', 'Insufficient equity shards for staking.');
       return;
    }

    setIsStaking(true);
    setTimeout(() => {
       if (onUpdateUser) {
          onUpdateUser({
            ...user,
            wallet: {
              ...user.wallet,
              eatBalance: user.wallet.eatBalance - amt,
              stakedEat: (user.wallet.stakedEat || 0) + amt
            }
          });
       }
       setIsStaking(false);
       setEsinSign('');
       // Fix: use setActiveTab instead of setActiveSubTab to resolve error on line 200
       setActiveTab('treasury');
       notify?.('success', 'STAKE_COMMITTED', `Locked ${amt} EAT in validator quorum. Passive yield cycle active.`);
    }, 2500);
  };

  const handleHarvestClaim = () => {
    if (pendingHarvest <= 0) return;
    setIsHarvesting(true);
    setTimeout(() => {
      onClaimSocialHarvest?.();
      setIsHarvesting(false);
      notify?.('success', 'HARVEST_SYNC', `Released ${pendingHarvest.toFixed(2)} EAC from buffer to liquid treasury.`);
    }, 2500);
  };

  const resetPortal = () => {
    setGatewayStep('config');
    setShowGatewayModal(null);
    setEsinSign('');
    setIsProcessingGateway(false);
  };

  const totalSpendable = user.wallet.balance + (user.wallet.bonusBalance || 0);
  const totalFiatUSD = (totalSpendable * FOREX_RATES.EAC_USD) + ((user.wallet.eatBalance + (user.wallet.stakedEat || 0)) * FOREX_RATES.EAT_USD);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Treasury HUD: Dynamic Resource Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LIQUID UTILITY (EAC)', val: totalSpendable.toLocaleString(), color: 'text-emerald-500', icon: Coins, desc: 'Spendable Network Credits' },
          { label: 'EQUITY ASSETS (EAT)', val: (user.wallet.eatBalance + (user.wallet.stakedEat || 0)).toFixed(4), color: 'text-amber-500', icon: Gem, desc: 'Immutable Asset Shards' },
          { label: 'NODE LIQUIDITY (USD)', val: `$${totalFiatUSD.toLocaleString(undefined, {minimumFractionDigits: 2})}`, color: 'text-blue-400', icon: Globe2, desc: 'Global Market Valuation' },
          { label: 'RESONANCE FACTOR (m)', val: `x${user.wallet.exchangeRate.toFixed(2)}`, color: 'text-indigo-400', icon: Activity, desc: `m-drift: ${mDrift > 0 ? '+' : ''}${mDrift}` },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-card rounded-[40px] bg-black/40 border border-white/5 space-y-6 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><m.icon size={120} className={m.color} /></div>
             <div className="flex justify-between items-center relative z-10">
                <p className={`text-[10px] ${m.color} font-black uppercase tracking-[0.4em]`}>{m.label}</p>
                <div className={`p-2 rounded-xl bg-white/5 ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
             </div>
             <div className="relative z-10">
                <h4 className="text-5xl font-mono font-black text-white tracking-tighter leading-none">{m.val}</h4>
                <p className="text-[9px] text-slate-600 font-bold uppercase mt-4 tracking-widest italic">{m.desc}</p>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                <div className={`h-full ${m.color.replace('text', 'bg')} transition-all duration-[2s]`} style={{ width: '100%' }}></div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Command Hub Tab Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 overflow-x-auto scrollbar-hide snap-x">
          {[
            { id: 'treasury', label: 'Treasury Command', icon: Wallet },
            { id: 'staking', label: 'Equity Staking', icon: Layers },
            { id: 'swap', label: 'Asset Sharding', icon: ArrowRightLeft },
            { id: 'gateway', label: 'Financial Bridges', icon: Link2 },
            { id: 'ledger', label: 'Node Ledger', icon: History },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
           {isMining && (
              <div className="px-6 py-3 glass-card rounded-full border border-amber-500/20 bg-amber-500/5 flex items-center gap-3 animate-pulse">
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">MINING_NEXT_BLOCK...</span>
              </div>
           )}
           {!isGuest && (
             <div className="px-6 py-3 glass-card rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">SECURE_NODE_SYNC</span>
             </div>
           )}
        </div>
      </div>

      <div className="min-h-[800px]">
        {/* --- VIEW: TREASURY COMMAND --- */}
        {activeSubTab === 'treasury' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-12 md:p-16 rounded-[72px] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] group">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s]"><Wallet size={500} /></div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="text-center md:text-left">
                         <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">STEWARD_TREASURY_v6.5</span>
                         <div className="mt-10 flex flex-col md:flex-row items-baseline gap-6 justify-center md:justify-start">
                            <h2 className="text-8xl md:text-[120px] font-black text-white tracking-tighter uppercase italic m-0 leading-none drop-shadow-2xl">
                               {user.wallet.balance.toLocaleString()}
                            </h2>
                            <span className="text-4xl font-bold text-emerald-500 italic uppercase">Utility EAC</span>
                         </div>
                         <p className="text-slate-500 text-2xl font-medium mt-6 italic opacity-80">"Liquid operational credits for grid sharding and resource procurement."</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                         <button 
                           onClick={() => { setShowGatewayModal('deposit'); setGatewayStep('config'); }}
                           className="flex-1 py-10 agro-gradient rounded-[36px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-emerald-500/5 group"
                         >
                            <ArrowDownLeft size={32} className="group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
                            DEPOSIT INFLOW
                         </button>
                         <button 
                           onClick={() => { setShowGatewayModal('withdrawal'); setGatewayStep('config'); }}
                           className="flex-1 py-10 bg-black/80 border-2 border-white/10 rounded-[36px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all hover:bg-black group"
                         >
                            <ArrowUpRight size={32} className="text-rose-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            LIQUIDATE SHARD
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Sparkles size={120} className="text-emerald-400" /></div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4 relative z-10">
                         <Sparkles className="w-6 h-6 text-emerald-400" /> Shard Buffer
                      </h4>
                      <p className="text-slate-500 text-base italic leading-relaxed opacity-80 relative z-10">"Unanchored rewards from peer vouches and reaction mining cycles."</p>
                      <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 flex justify-between items-center shadow-inner relative z-10 group/harvest hover:border-emerald-500/40 transition-colors">
                         <div className="space-y-1">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Pending Shards</p>
                            <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_#10b981]">{pendingHarvest.toFixed(0)}</p>
                         </div>
                         <button 
                           onClick={handleHarvestClaim}
                           disabled={isHarvesting || pendingHarvest <= 0}
                           className="p-8 agro-gradient rounded-[32px] text-white shadow-3xl active:scale-90 transition-all disabled:opacity-20 border-2 border-white/10 ring-8 ring-white/5 group-hover/harvest:scale-110"
                         >
                            {isHarvesting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={32} className="fill-current" />}
                         </button>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Binary size={120} className="text-indigo-400" /></div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4 relative z-10">
                         <Binary className="w-6 h-6 text-indigo-400" /> Equity State
                      </h4>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                            <span>Staked EAT Maturity</span>
                            <span className="text-indigo-400 font-mono">
                               {(user.wallet.stakedEat || 0).toLocaleString()} EAT
                            </span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                            <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: user.wallet.stakedEat ? '100%' : '0%' }}></div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                               <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Passives Generated</p>
                               <p className="text-sm font-mono font-black text-emerald-400">+{((user.wallet.stakedEat || 0) * 0.12).toFixed(1)} EAC</p>
                            </div>
                            <div className="p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                               <p className="text-sm font-mono font-black text-blue-400">{user.wallet.stakedEat ? 'ACTIVE' : 'LOCKED'}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                {/* Equity Node Card */}
                <div className="glass-card p-12 rounded-[72px] border border-yellow-500/20 bg-yellow-500/[0.02] flex flex-col justify-between min-h-[500px] shadow-3xl group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-125 transition-transform duration-[15s] pointer-events-none"><Gem size={600} className="text-yellow-500" /></div>
                   <div className="space-y-10 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="p-5 bg-yellow-500/10 rounded-[28px] border border-yellow-500/20 shadow-2xl">
                            <Gem className="w-12 h-12 text-yellow-500 animate-pulse" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Equity <span className="text-yellow-500">Gold</span></h3>
                            <p className="text-[10px] text-yellow-500/60 font-black uppercase tracking-[0.5em] mt-3">EAT_ASSET_RESERVE</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <p className="text-8xl font-mono font-black text-white leading-none tracking-tighter drop-shadow-2xl italic">{user.wallet.eatBalance.toFixed(4)}</p>
                         <p className="text-slate-400 text-lg font-medium italic opacity-80 leading-relaxed border-l-4 border-yellow-500/20 pl-8">
                           "Sustainable Asset Shards anchored to node resonance."
                         </p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setActiveTab('swap')}
                     className="w-full py-8 bg-white/5 border-2 border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-yellow-500/10 transition-all relative z-10 shadow-3xl active:scale-95 flex items-center justify-center gap-4 group"
                   >
                      MINT EQUITY SHARD
                      <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>

                {/* Network Health Shard */}
                <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                   <div className="flex items-center gap-4 px-2">
                      <Activity className="w-6 h-6 text-blue-400" />
                      <h4 className={`text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] italic`}>Consensus Health</h4>
                   </div>
                   <div className="space-y-6">
                      <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-6">
                        "Your node is currently contributing to the global validation quorum. Registry synchronicity: 100% Nominal."
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                           <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Latency</p>
                           <p className="text-xl font-mono font-black text-white">12ms</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-2xl">
                           <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Node Rank</p>
                           <p className="text-xl font-mono font-black text-emerald-400">MASTER</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: EQUITY STAKING --- */}
        {activeSubTab === 'staking' && (
           <div className="max-w-6xl mx-auto space-y-16 animate-in slide-in-from-right-4 duration-500">
              <div className="text-center space-y-6">
                 <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">STAKING <span className="text-indigo-400">REGISTRY</span></h3>
                 <p className="text-slate-500 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed opacity-80">"Lock your EAT equity shards to secure the network and earn recurrent utility yield."</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {STAKING_TIERS.map(tier => (
                    <div key={tier.id} className={`p-12 glass-card rounded-[64px] border-2 transition-all group flex flex-col h-[580px] bg-black/40 shadow-3xl relative overflow-hidden ${selectedTier.id === tier.id ? 'border-indigo-500 scale-105 ring-8 ring-indigo-500/5' : 'border-white/5 hover:border-white/20'}`} onClick={() => setSelectedTier(tier as any)}>
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[12s]"><tier.icon size={300} /></div>
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${tier.col} shadow-2xl group-hover:rotate-12 transition-transform`}>
                             <tier.icon size={40} />
                          </div>
                          {selectedTier.id === tier.id && <div className="p-2 bg-indigo-500 rounded-full text-white animate-pulse"><CheckCircle2 size={24} /></div>}
                       </div>
                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className={`text-2xl font-black text-white uppercase tracking-widest leading-none ${selectedTier.id === tier.id ? 'text-indigo-400' : ''}`}>{tier.label}</h4>
                          <div className="space-y-8 pt-6">
                             <div>
                                <p className="text-slate-500 font-black uppercase tracking-widest mb-1">Expected APY</p>
                                <p className="text-5xl font-mono font-black text-emerald-400">+{tier.yield}%</p>
                             </div>
                             <div>
                                <p className="text-slate-500 font-black uppercase tracking-widest mb-1">Lockup Period</p>
                                <p className="text-2xl font-bold text-white uppercase italic">{tier.period}</p>
                             </div>
                          </div>
                       </div>
                       <div className="pt-8 border-t border-white/5 relative z-10">
                          <p className="text-slate-700 font-black uppercase tracking-widest">MIN_COMMIT: {tier.min} EAT</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-16 rounded-[80px] border-2 border-indigo-500/30 bg-black/80 shadow-[0_50px_100px_rgba(0,0,0,0.9)] max-w-4xl mx-auto space-y-12 text-center">
                 <div className="space-y-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                       <div className="space-y-3 px-8 text-left flex-1">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Stake Amount (EAT)</label>
                          <input 
                            type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
                            className="w-full bg-transparent text-6xl font-mono font-black text-white outline-none border-b-4 border-indigo-500/20 focus:border-indigo-500 transition-colors py-4"
                          />
                          <p className="text-[10px] text-slate-600 font-bold uppercase mt-4">Available: {user.wallet.eatBalance.toFixed(4)} EAT</p>
                       </div>
                       <div className="h-24 w-px bg-white/5 hidden md:block" />
                       <div className="space-y-3 px-8 text-right flex-1">
                          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-2">Node Auth Signature</p>
                          <input 
                            type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                            placeholder="EA-XXXX-XXXX"
                            className="w-full bg-black border border-white/10 rounded-2xl py-6 text-center text-3xl font-mono text-white tracking-[0.2em] outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-900"
                          />
                       </div>
                    </div>
                    <button 
                      onClick={handleExecuteStake}
                      disabled={isStaking || !esinSign || !stakeAmount}
                      className="w-full py-12 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.6em] shadow-[0_0_120px_rgba(99,102,241,0.4)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                    >
                       {isStaking ? <Loader2 className="w-10 h-10 animate-spin" /> : <LockIcon className="w-10 h-10" />}
                       {isStaking ? 'ANCHORING STAKE...' : 'AUTHORIZE EQUITY STAKE'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: ASSET SHARDING (SWAP) --- */}
        {activeSubTab === 'swap' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-black/80 shadow-[0_50px_150px_rgba(0,0,0,0.9)] text-center space-y-16 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s] pointer-events-none"><Binary size={800} className="text-indigo-400" /></div>
                
                <div className="relative z-10 space-y-12">
                   <div className="w-40 h-40 bg-indigo-600 rounded-[56px] flex items-center justify-center text-white mx-auto shadow-3xl animate-float border-4 border-white/10 relative overflow-hidden group-hover:rotate-6 transition-all">
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                      <ArrowRightLeft size={80} className="relative z-10" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Asset <span className="text-indigo-400">Anchoring</span></h3>
                      <p className="text-slate-400 text-2xl font-medium italic opacity-80">"Converting volatile utility shards into permanent industrial gold."</p>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl mx-auto items-center relative">
                      <div className="p-10 bg-black rounded-[56px] border-2 border-emerald-500/20 shadow-inner group/input relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20"></div>
                         <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-6 block">Utility Input (EAC)</label>
                         <input 
                           type="number" value={swapAmountEAC} onChange={e => setSwapAmountEAC(e.target.value)}
                           className="w-full bg-transparent text-center text-7xl font-mono font-black text-white outline-none placeholder:text-slate-900" 
                           placeholder="0"
                         />
                         <div className="flex justify-between items-center mt-8 px-4">
                            <p className="text-[9px] text-slate-700 font-black uppercase">Steward Balance</p>
                            <p className="text-xs font-mono font-bold text-emerald-500">{user.wallet.balance.toLocaleString()} EAC</p>
                         </div>
                      </div>
                      
                      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                         <div className="w-16 h-16 rounded-full bg-indigo-600 border-4 border-[#050706] flex items-center justify-center text-white shadow-3xl group-hover:scale-125 transition-transform">
                            <ChevronRight size={32} />
                         </div>
                      </div>

                      <div className="p-10 bg-black rounded-[56px] border-2 border-yellow-500/20 shadow-inner relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 opacity-20"></div>
                         <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-6 block">Equity Yield (EAT)</label>
                         <p className="text-7xl font-mono font-black text-yellow-500 tracking-tighter drop-shadow-[0_0_30px_#f59e0b66]">{swapEatYield.toFixed(4)}</p>
                         <div className="flex justify-between items-center mt-8 px-4">
                            <p className="text-[9px] text-slate-700 font-black uppercase">Registry Rate</p>
                            <p className="text-xs font-mono font-bold text-indigo-400">x{user.wallet.exchangeRate.toFixed(2)}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-8 pt-16 border-t border-white/5 max-w-xl mx-auto">
                      <div className="space-y-4">
                         <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block text-center">Node Signature Auth</label>
                         <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX" 
                           className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                         />
                      </div>
                      <button 
                        onClick={handleExecuteSwap}
                        disabled={isSwapping || !esinSign || !swapAmountEAC}
                        className="w-full py-12 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(99,102,241,0.4)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                      >
                         {isSwapping ? <Loader2 className="w-10 h-10 animate-spin" /> : <Key className="w-10 h-10 fill-current" />}
                         {isSwapping ? "ANCHORING ASSET..." : "AUTHORIZE ANCHOR MINT"}
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: FINANCIAL BRIDGES (GATEWAY) --- */}
        {activeSubTab === 'gateway' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="text-center space-y-6">
                <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">CASH FLOW <span className="text-indigo-400">BRIDGES</span></h3>
                <p className="text-slate-500 text-2xl font-medium italic max-w-4xl mx-auto leading-relaxed opacity-80">"Connecting private financial nodes to the global agricultural mesh for seamless capital settlement."</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-10">
                   <div className="flex justify-between items-center px-8 border-b border-white/5 pb-8">
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest italic flex items-center gap-6"><Building2 size={32} className="text-indigo-400" /> Active Flow Nodes</h4>
                      <button onClick={() => setShowLinkProvider(true)} className="px-10 py-4 bg-indigo-600 rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center gap-3 active:scale-95 transition-all border border-white/10"><PlusCircle size={20} /> Link New Node</button>
                   </div>
                   
                   <div className="grid gap-6">
                      {(user.wallet.linkedProviders || []).map(lp => (
                        <div key={lp.id} className="p-10 glass-card rounded-[56px] border-2 border-white/5 hover:border-indigo-500/40 transition-all bg-black/40 shadow-2xl group relative overflow-hidden active:scale-[0.99]">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform pointer-events-none duration-[10s]">
                              {lp.type === 'Mobile' ? <SmartphoneNfc size={400} /> : lp.type === 'Web3' ? <Binary size={400} /> : <Globe2 size={400} />}
                           </div>
                           <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                              <div className="flex items-center gap-10">
                                 <div className="w-24 h-24 rounded-[32px] bg-white/5 border border-white/10 text-indigo-400 shadow-3xl flex items-center justify-center group-hover:rotate-6 transition-all">
                                    {lp.type === 'Mobile' ? <SmartphoneNfc size={48} /> : lp.type === 'Web3' ? <Binary size={48} /> : <Building2 size={48} />}
                                 </div>
                                 <div className="space-y-2">
                                    <h5 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-indigo-400 transition-colors">{lp.name}</h5>
                                    <p className="text-[11px] text-slate-500 font-mono tracking-[0.5em] uppercase font-black">NODE_ID: {lp.accountFragment} // SYNC_OK</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 <div className="flex flex-col items-end gap-3 border-r border-white/5 pr-8">
                                    <button 
                                      onClick={() => { setSelectedProvider(lp); setShowGatewayModal('deposit'); setGatewayStep('config'); }}
                                      className="text-emerald-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
                                    >DEPOSIT <ArrowDownLeft size={16}/></button>
                                    <button 
                                      onClick={() => { setSelectedProvider(lp); setShowGatewayModal('withdrawal'); setGatewayStep('config'); }}
                                      className="text-rose-400 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
                                    >WITHDRAW <ArrowUpRight size={16}/></button>
                                 </div>
                                 <button className="p-4 bg-white/5 rounded-2xl text-slate-800 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20 shadow-inner"><Trash2 size={24} /></button>
                              </div>
                           </div>
                        </div>
                      ))}
                      {(user.wallet.linkedProviders || []).length === 0 && (
                        <div className="py-40 border-4 border-dashed border-white/5 rounded-[80px] text-center opacity-20 flex flex-col items-center justify-center space-y-12 bg-black/20 group hover:opacity-100 transition-opacity">
                           <Link2 size={120} className="text-slate-700" />
                           <p className="text-4xl font-black uppercase tracking-[0.5em] text-white">No Bridge Nodes Paired</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="lg:col-span-5 space-y-10">
                   <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-950/5 flex flex-col items-center justify-center text-center space-y-12 group shadow-3xl relative overflow-hidden h-full">
                      <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] ring-[16px] ring-white/5 relative z-10 group-hover:scale-110 transition-transform duration-700">
                         <ShieldCheck className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-6 relative z-10 max-w-md mx-auto">
                         <h4 className="text-5xl font-black text-white uppercase tracking-tighter m-0 leading-tight">Secure Settlement</h4>
                         <p className="text-slate-400 text-xl italic leading-relaxed opacity-80">
                           "Ecosystem settlements utilize ZK-Rollups to bridge fiat liquidity without revealing node identifies."
                         </p>
                      </div>
                      <div className="grid grid-cols-2 gap-8 w-full max-w-md relative z-10 pt-10 border-t border-white/5">
                         <div className="p-8 bg-black/60 border border-white/10 rounded-[40px] text-center shadow-inner group/met hover:border-emerald-500/30 transition-all">
                            <p className="text-[11px] text-slate-500 uppercase font-black mb-3 tracking-widest">Bridge Latency</p>
                            <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">14<span className="text-sm font-sans italic ml-1">ms</span></p>
                         </div>
                         <div className="p-8 bg-black/60 border border-white/10 rounded-[40px] text-center shadow-inner group/met hover:border-blue-500/30 transition-all">
                            <p className="text-[11px] text-slate-500 uppercase font-black mb-3 tracking-widest">Packet Trust</p>
                            <p className="text-5xl font-mono font-black text-blue-400 tracking-tighter">99<span className="text-sm font-sans italic ml-1">%</span></p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: NODE LEDGER --- */}
        {activeSubTab === 'ledger' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 px-8 gap-10">
                <div className="space-y-4">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-emerald-400">Ledger Shards</span></h3>
                   <p className="text-slate-500 text-2xl font-medium italic opacity-80">"Real-time industrial accounting anchored to the permanent registry."</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-12 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-4">
                    <Download size={24} /> Export Node CSV
                  </button>
                  <button className="p-6 bg-indigo-600 rounded-[28px] text-white shadow-3xl hover:bg-indigo-500 transition-all">
                    <History size={28} />
                  </button>
                </div>
             </div>

             <div className="glass-card rounded-[72px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="grid grid-cols-5 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                   <span className="col-span-2 px-4">Registry Action Shard</span>
                   <span>Value Impact</span>
                   <span>Origin Node</span>
                   <span className="text-right px-4">Ledger Finality</span>
                </div>
                <div className="divide-y divide-white/5 max-h-[800px] overflow-y-auto custom-scrollbar bg-[#050706]">
                   {transactions.map((tx, i) => (
                     <div key={tx.id} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in">
                        <div className="col-span-2 flex items-center gap-10">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all shadow-inner">
                              <Database size={28} className="text-slate-600 group-hover:text-indigo-400" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-2xl font-black text-white uppercase italic tracking-tight m-0 leading-none group-hover:text-indigo-400 transition-colors">{tx.details}</p>
                              <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">{tx.id} // COMMIT_OK</p>
                           </div>
                        </div>
                        <div>
                           <p className={`text-4xl font-mono font-black ${tx.value >= 0 ? 'text-emerald-400' : 'text-rose-500'} tracking-tighter`}>
                               {tx.value >= 0 ? '+' : ''}{tx.value.toFixed(2)} <span className="text-xs italic font-sans text-slate-700 uppercase ml-1">{tx.unit}</span>
                           </p>
                        </div>
                        <div className="text-xs text-slate-500 font-mono italic">
                           {tx.farmId}
                        </div>
                        <div className="flex justify-end pr-8">
                           <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)] group-hover:shadow-emerald-500/40 transition-all scale-90 group-hover:scale-105">
                              <ShieldCheck size={28} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroWallet;
