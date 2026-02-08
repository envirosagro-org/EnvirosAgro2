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
  Trophy,
  BadgeCheck,
  Smartphone,
  ShieldPlus
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject } from '../types';
import { analyzeInstitutionalRisk, AIResponse } from '../services/geminiService';

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
  notify: any;
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
  transactions = [],
  notify
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'treasury' | 'staking' | 'swap' | 'gateway' | 'ledger'>('treasury');
  
  // Wallet States
  const [showGatewayModal, setShowGatewayModal] = useState<'deposit' | 'withdrawal' | null>(null);
  const [showLinkProvider, setShowLinkProvider] = useState(false);
  
  // Swap State
  const [swapAmountEAC, setSwapAmountEAC] = useState('1000');
  const [isSwapping, setIsSwapping] = useState(false);
  const [riskAudit, setRiskAudit] = useState<AIResponse | null>(null);
  const [isAuditingRisk, setIsAuditingRisk] = useState(false);

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

  const gatewayEacEquivalent = useMemo(() => {
    const val = Number(gatewayAmount) || 0;
    if (gatewayCurrency === 'USD') return val / FOREX_RATES.EAC_USD;
    return val / FOREX_RATES.EAC_KES;
  }, [gatewayAmount, gatewayCurrency]);

  const swapEatYield = useMemo(() => {
    const val = Number(swapAmountEAC) || 0;
    return val / user.wallet.exchangeRate;
  }, [swapAmountEAC, user.wallet.exchangeRate]);

  const handleInitializeSwap = async () => {
    if (!swapAmountEAC || Number(swapAmountEAC) <= 0) return;
    setIsAuditingRisk(true);
    setRiskAudit(null);
    try {
      const res = await analyzeInstitutionalRisk({
        type: 'UTILITY_TO_EQUITY_ANCHOR',
        amount_eac: swapAmountEAC,
        target_eat: swapEatYield,
        m_constant: user.metrics.timeConstantTau,
        esin: user.esin
      });
      setRiskAudit(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditingRisk(false);
    }
  };

  const handleExecuteSwap = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const amountEAC = Number(swapAmountEAC);
    if (user.wallet.balance < amountEAC) {
      alert("LIQUIDITY ERROR: Insufficient EAC for anchoring.");
      return;
    }

    setIsSwapping(true);
    try {
        const eatYield = amountEAC / user.wallet.exchangeRate;
        if (await onSwap(eatYield)) {
          setIsSwapping(false);
          setEsinSign('');
          setRiskAudit(null);
          notify('success', 'ASSET_ANCHORED', "Utility credits converted to Equity gold shards.");
        } else {
          setIsSwapping(false);
        }
    } catch (e) {
        setIsSwapping(false);
    }
  };

  const handleExecuteStake = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const amt = Number(stakeAmount);
    if (user.wallet.eatBalance < amt) {
       alert("EQUITY ERROR: Insufficient EAT for staking.");
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
       setActiveSubTab('treasury');
       notify('success', 'STAKE_COMMITTED', "Equity locked in validator quorum. Passive EAC yield initialized.");
    }, 2500);
  };

  const handleHarvestClaim = () => {
    if (pendingHarvest <= 0) return;
    setIsHarvesting(true);
    setTimeout(() => {
      onClaimSocialHarvest?.();
      setIsHarvesting(false);
      notify('success', 'HARVEST_CLAIMED', `${pendingHarvest} EAC added to liquid utility.`);
    }, 2500);
  };

  const handleGatewayProcess = () => {
    setGatewayStep('handoff');
    setTimeout(() => setGatewayStep('external_sync'), 2000);
    setTimeout(() => setGatewayStep('sign'), 4000);
  };

  const handleFinalizeGateway = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsProcessingGateway(true);
    setTimeout(() => {
      const amt = gatewayEacEquivalent;
      if (showGatewayModal === 'deposit') {
        onEarnEAC(amt, 'EXTERNAL_GATEWAY_DEPOSIT');
      } else {
        // Handle withdrawal logic if needed
      }
      setIsProcessingGateway(false);
      setGatewayStep('success');
    }, 3000);
  };

  // Fix: Added missing resetPortal function to handle return to treasury hub
  const resetPortal = () => {
    setShowGatewayModal(null);
    setGatewayStep('config');
    setActiveSubTab('treasury');
  };

  const totalSpendable = user.wallet.balance + (user.wallet.bonusBalance || 0);
  const totalFiatUSD = (totalSpendable * FOREX_RATES.EAC_USD) + ((user.wallet.eatBalance + (user.wallet.stakedEat || 0)) * FOREX_RATES.EAT_USD);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
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
          </div>
        ))}
      </div>

      {/* 2. Command Hub Tab Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
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
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        {/* --- VIEW: TREASURY COMMAND --- */}
        {activeSubTab === 'treasury' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-12 md:p-16 rounded-[72px] border border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s]"><Wallet size={500} /></div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="text-center md:text-left">
                         <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">STEWARD_TREASURY_v6.5</span>
                         <div className="mt-10 flex flex-col md:flex-row items-baseline gap-6 justify-center md:justify-start">
                            <h2 className="text-8xl md:text-[120px] font-black text-white tracking-tighter uppercase italic m-0 leading-none drop-shadow-2xl">
                               {user.wallet.balance.toLocaleString()}
                            </h2>
                            <span className="text-4xl font-bold text-emerald-500 italic uppercase">Utility EAC</span>
                         </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 max-w-2xl">
                         <button 
                           onClick={() => { setGatewayStep('config'); setShowGatewayModal('deposit'); }}
                           className="flex-1 py-10 agro-gradient rounded-[36px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-emerald-500/5 group"
                         >
                            <ArrowDownLeft size={32} />
                            DEPOSIT INFLOW
                         </button>
                         <button 
                           onClick={() => { setGatewayStep('config'); setShowGatewayModal('withdrawal'); }}
                           className="flex-1 py-10 bg-black/80 border-2 border-white/10 rounded-[36px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95"
                         >
                            <ArrowUpRight size={32} className="text-rose-500" />
                            LIQUIDATE SHARD
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-6 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><SmartphoneNfc size={180} /></div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400">
                            <Link2 size={24} />
                         </div>
                         <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Financial <span className="text-blue-400">Bridges</span></h4>
                      </div>
                      <p className="text-sm text-slate-500 italic relative z-10 font-medium">"{user.wallet.linkedProviders.length} Linked Nodes established for institutional handshakes."</p>
                      <button onClick={() => setActiveSubTab('gateway')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md active:scale-95">Configure Bridges</button>
                   </div>
                   
                   <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-amber-500/5 space-y-6 shadow-xl relative overflow-hidden group/harvest">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/harvest:scale-110 transition-transform"><History size={180} className="text-amber-500" /></div>
                      <div className="flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-4">
                            <div className="p-4 bg-amber-600 rounded-2xl shadow-xl"><Zap size={24} className="text-white fill-current" /></div>
                            <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Social <span className="text-amber-500">Harvest</span></h4>
                         </div>
                         <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[9px] font-black uppercase">Pending_Claim</div>
                      </div>
                      <div className="relative z-10 py-4">
                         <p className="text-5xl font-mono font-black text-white tracking-tighter">{pendingHarvest} <span className="text-lg italic font-sans text-slate-700">EAC</span></p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">Accrued from network resonance</p>
                      </div>
                      <button 
                        onClick={handleHarvestClaim}
                        disabled={pendingHarvest <= 0 || isHarvesting}
                        className="w-full py-5 bg-amber-600 hover:bg-amber-500 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30 relative z-10"
                      >
                         {isHarvesting ? <Loader2 size={18} className="animate-spin" /> : <Stamp size={18} />}
                         {isHarvesting ? 'MINTING_SHARDS...' : 'CLAIM HARVEST'}
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-950/10 flex flex-col items-center text-center space-y-10 shadow-3xl relative overflow-hidden group/oracle">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><Bot size={300} className="text-indigo-400" /></div>
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700 relative z-10 animate-float">
                      <Bot size={48} className="text-white" />
                   </div>
                   <div className="space-y-6 relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Financial <span className="text-indigo-400">Oracle</span></h4>
                      <p className="text-slate-400 text-lg leading-relaxed italic px-6 font-medium">
                         "Node resonance is stable. Recommend sharding 1,000 EAC to EAT equity during current low-volatility cycle."
                      </p>
                   </div>
                   <div className="p-8 bg-black/60 rounded-[40px] border border-indigo-500/20 w-full relative z-10 shadow-inner group-hover/oracle:border-indigo-400 transition-colors">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-3">Profitability Delta</p>
                      <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter leading-none">+12<span className="text-2xl italic font-sans text-emerald-700 ml-1">.4%</span></p>
                    </div>
                   <button onClick={() => setActiveSubTab('swap')} className="relative z-10 w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Apply Recommendation</button>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <History size={20} className="text-slate-500" />
                      <h4 className="text-xl font-black text-white uppercase italic">Registry Snapshot</h4>
                   </div>
                   <div className="space-y-6">
                      {[
                        { l: 'Network Uptime', v: '99.98%', i: Activity, c: 'text-emerald-500' },
                        { l: 'Ledger Finality', v: '12ms', i: Clock, c: 'text-blue-400' },
                      ].map(s => (
                        <div key={s.l} className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <s.i size={14} className={s.c} />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.l}</span>
                           </div>
                           <span className="text-sm font-mono font-black text-white">{s.v}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: EQUITY STAKING --- */}
        {activeSubTab === 'staking' && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 px-4 md:px-0">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12 px-6">
                <div className="space-y-4">
                   <h3 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">EQUITY <span className="text-indigo-400">STAKING</span></h3>
                   <p className="text-slate-500 text-2xl font-medium italic opacity-80">"Securing the global quorum through institutional asset bonding."</p>
                </div>
                <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[48px] text-center shadow-3xl">
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mb-2">Aggregate Staked</p>
                   <p className="text-5xl font-mono font-black text-white">{(user.wallet.stakedEat || 0).toFixed(4)} <span className="text-xl text-indigo-700">EAT</span></p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-6">
                {STAKING_TIERS.map(tier => (
                  <div 
                    key={tier.id} 
                    onClick={() => setSelectedTier(tier)}
                    className={`glass-card p-12 rounded-[72px] border-2 transition-all flex flex-col justify-between h-[650px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300 group ${selectedTier.id === tier.id ? 'border-indigo-500 ring-8 ring-indigo-500/5' : 'border-white/5 hover:border-white/20'}`}
                  >
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><tier.icon size={400} /></div>
                     
                     <div className="space-y-10 relative z-10">
                        <div className="flex justify-between items-start">
                           <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${tier.col} shadow-2xl group-hover:rotate-6 transition-all`}>
                              <tier.icon size={48} />
                           </div>
                           <div className="text-right flex flex-col items-end gap-3">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${tier.id === 'gold' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-glow' : 'bg-white/5 text-slate-500 border-white/10'}`}>{tier.id} Level</span>
                           </div>
                        </div>
                        <div>
                           <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{tier.label.replace('_', ' ')}</h4>
                           <p className="text-[10px] text-slate-600 font-mono font-black uppercase tracking-widest mt-4">LOCK_PERIOD: {tier.period}</p>
                        </div>
                        <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 text-center shadow-inner group/yield">
                           <p className="text-[11px] text-slate-500 uppercase font-black mb-3">Projected Yield</p>
                           <p className={`text-7xl font-mono font-black ${tier.col} tracking-tighter`}>+{tier.yield}<span className="text-2xl italic font-sans ml-1">%</span></p>
                        </div>
                     </div>

                     <div className="relative z-10">
                        <div className="flex justify-between items-center text-xs mb-4 px-2">
                           <span className="text-slate-700 font-black uppercase">Requirement</span>
                           <span className="text-white font-mono">{tier.min} EAT</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${tier.col.replace('text', 'bg')} shadow-[0_0_15px_currentColor]`} style={{ width: `${Math.min(100, (user.wallet.eatBalance / tier.min) * 100)}%` }}></div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="max-w-4xl mx-auto glass-card p-16 rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-[0_50px_150px_rgba(0,0,0,0.9)] space-y-16 animate-in slide-in-from-bottom-10">
                <div className="text-center space-y-4">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Initialize <span className="text-indigo-400">Stake Anchor</span></h3>
                   <p className="text-slate-400 text-xl font-medium italic">Committing {stakeAmount} EAT to the {selectedTier.label.replace('_', ' ')} pool.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                   <div className="p-12 bg-black rounded-[64px] border-2 border-indigo-500/20 shadow-inner group">
                      <label className="text-[11px] font-black text-slate-600 uppercase mb-8 block text-center tracking-[0.4em]">STAKE_AMOUNT (EAT)</label>
                      <input 
                        type="number" 
                        value={stakeAmount} 
                        onChange={e => setStakeAmount(e.target.value)}
                        className="w-full bg-transparent text-center text-8xl font-mono font-black text-white outline-none group-focus-within:text-indigo-400 transition-colors" 
                      />
                   </div>
                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Finalize with Node Signature (ESIN)</label>
                         <input 
                           type="text" 
                           value={esinSign} 
                           onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX" 
                           className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                         />
                      </div>
                      <button 
                        onClick={handleExecuteStake}
                        disabled={isStaking || !esinSign || Number(stakeAmount) < selectedTier.min}
                        className="w-full py-12 agro-gradient rounded-full text-white font-black text-base uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-8 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                      >
                         {isStaking ? <Loader2 className="w-10 h-10 animate-spin" /> : <Stamp size={40} />}
                         {isStaking ? "BONDING ASSET..." : "AUTHORIZE STAKE"}
                      </button>
                   </div>
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
                      <ArrowRightLeft size={80} className="relative z-10" />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Asset <span className="text-indigo-400">Anchoring</span></h3>
                      <p className="text-slate-400 text-2xl font-medium italic">"Converting network utility into sharded institutional equity."</p>
                   </div>

                   {!riskAudit ? (
                      <div className="max-w-2xl mx-auto space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className="p-10 bg-black rounded-[56px] border-2 border-emerald-500/20 shadow-inner group">
                              <label className="text-[11px] font-black text-slate-600 uppercase mb-6 block tracking-widest">Utility Input (EAC)</label>
                              <input 
                                type="number" 
                                value={swapAmountEAC} 
                                onChange={e => setSwapAmountEAC(e.target.value)} 
                                className="w-full bg-transparent text-center text-7xl font-mono font-black text-white outline-none group-focus-within:text-emerald-400 transition-colors" 
                              />
                            </div>
                            <div className="p-10 bg-black rounded-[56px] border-2 border-yellow-500/20 shadow-inner">
                              <label className="text-[11px] font-black text-slate-600 uppercase mb-6 block tracking-widest">Equity Yield (EAT)</label>
                              <p className="text-7xl font-mono font-black text-yellow-500">{swapEatYield.toFixed(4)}</p>
                            </div>
                        </div>
                        <button 
                          onClick={handleInitializeSwap}
                          disabled={isAuditingRisk || !swapAmountEAC}
                          className="w-full py-12 agro-gradient rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-xl flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 border-4 border-white/10 ring-[12px] ring-white/5"
                        >
                           {isAuditingRisk ? <Loader2 className="w-10 h-10 animate-spin" /> : <Bot className="w-10 h-10" />}
                           {isAuditingRisk ? 'RUNNING RISK AUDIT...' : 'INITIALIZE INSTITUTIONAL VETTING'}
                        </button>
                      </div>
                   ) : (
                     <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                        <div className={`p-10 md:p-14 bg-black/80 rounded-[64px] border-2 shadow-3xl border-l-[16px] text-left relative overflow-hidden ${riskAudit.is_compliant ? 'border-emerald-500/20 border-l-emerald-600' : 'border-rose-500/20 border-l-rose-600'}`}>
                           <div className="absolute top-0 right-0 p-8 opacity-[0.03] animate-pulse"><Zap size={200} /></div>
                           <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8 relative z-10">
                              <div className={`p-4 rounded-2xl ${riskAudit.is_compliant ? 'bg-emerald-600/10' : 'bg-rose-600/10'}`}>
                                <ShieldCheck className={riskAudit.is_compliant ? 'text-emerald-400' : 'text-rose-400'} size={32} />
                              </div>
                              <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Oracle Risk Verdict</h4>
                           </div>
                           <div className="text-slate-300 text-2xl leading-[2.1] italic font-medium relative z-10 pl-10 border-l border-white/5">
                              {riskAudit.text}
                           </div>
                        </div>

                        <div className="space-y-10 max-w-xl mx-auto w-full">
                           <div className="space-y-4">
                              <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">Node Signature Auth (ESIN)</label>
                              <input 
                                type="text" 
                                value={esinSign} 
                                onChange={e => setEsinSign(e.target.value)} 
                                placeholder="EA-XXXX-XXXX" 
                                className="w-full bg-black border-2 border-white/10 rounded-[48px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                              />
                           </div>
                           <div className="flex gap-6">
                              <button onClick={() => setRiskAudit(null)} className="flex-1 py-10 bg-white/5 border border-white/10 rounded-[48px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                              <button 
                                onClick={handleExecuteSwap} 
                                disabled={isSwapping || !esinSign} 
                                className="flex-[2] py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_120px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                              >
                                {isSwapping ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={32} />}
                                {isSwapping ? 'MINTING SHARD...' : 'AUTHORIZE ASSET MINT'}
                              </button>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: FINANCIAL BRIDGES (GATEWAY) --- */}
        {/* Fix: Changed activeTab to activeSubTab */}
        {activeSubTab === 'gateway' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 px-6 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">FINANCIAL <span className="text-blue-400">BRIDGES</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Ingesting external capital nodes via secure gateway shards."</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {user.wallet.linkedProviders.map(provider => (
                    <div key={provider.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between h-[550px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Building2 size={300} className="text-blue-500" /></div>
                       
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className={`p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-2xl group-hover:rotate-6 transition-all`}>
                             {provider.type === 'Mobile' ? <Smartphone size={40} /> : <CreditCard size={40} />}
                          </div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest">{provider.type} NODE</span>
                             <p className="text-[10px] text-slate-700 font-mono font-black italic mt-3 uppercase">SYNC_OK</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors drop-shadow-2xl">{provider.name}</h4>
                          <p className="text-xl font-mono font-black text-slate-500 tracking-widest">•••• {provider.accountFragment}</p>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 relative z-10">
                          <button 
                            onClick={() => { setSelectedProvider(provider); setShowGatewayModal('deposit'); }}
                            className="flex-1 py-6 bg-blue-600 rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] text-white shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-90 border border-white/10"
                          >
                             <ArrowDownLeft size={20} /> DEPOSIT
                          </button>
                          <button className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-rose-500 transition-all active:scale-90"><Trash2 size={24} /></button>
                       </div>
                    </div>
                 ))}
                 
                 <button 
                   onClick={() => setShowLinkProvider(true)}
                   className="glass-card p-12 rounded-[72px] border-2 border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-8 opacity-40 group hover:opacity-100 hover:border-blue-500/20 transition-all cursor-pointer shadow-xl h-[550px]"
                 >
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"><PlusCircle size={48} className="text-white" /></div>
                    <div className="space-y-3">
                       <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Bridge Provider</h4>
                       <p className="text-slate-600 text-sm font-bold uppercase tracking-widest max-w-[220px] mx-auto leading-relaxed italic">
                          Link M-Pesa, Bank, or Global Card nodes to authorize financial ingest.
                       </p>
                    </div>
                 </button>
              </div>
           </div>
        )}

        {/* --- VIEW: NODE LEDGER --- */}
        {/* Fix: Changed activeTab to activeSubTab */}
        {activeSubTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 px-8 gap-10">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">NODE <span className="text-emerald-400">LEDGER SHARDS</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Immutable history of value movement and registry anchors."</p>
                 </div>
                 <div className="flex gap-4">
                   <div className="relative group md:w-80">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input type="text" placeholder="Filter Ledger..." className="w-full bg-black border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono shadow-inner" />
                   </div>
                   <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl"><Download size={24} /></button>
                 </div>
              </div>

              <div className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-6 p-10 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                    <span className="col-span-2">Registry Shard & Identifier</span>
                    <span>Action Type</span>
                    <span>Pillar Source</span>
                    <span>Economic Value</span>
                    <span className="text-right">Ledger Auth</span>
                 </div>
                 <div className="divide-y divide-white/5 min-h-[500px] bg-[#050706]">
                    {transactions.length === 0 ? (
                       <div className="py-40 flex flex-col items-center justify-center opacity-10">
                          <History size={120} className="mb-6" />
                          <p className="text-4xl font-black uppercase tracking-[0.5em]">No recorded shards</p>
                       </div>
                    ) : (
                       transactions.map((tx, i) => (
                         <div key={i} className="grid grid-cols-6 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="col-span-2 flex items-center gap-10">
                               <div className="w-16 h-16 rounded-[28px] bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:rotate-6 group-hover:scale-110 transition-all shadow-inner">
                                  <Database size={24} />
                               </div>
                               <div>
                                  <p className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{tx.details}</p>
                                  <p className="text-[10px] text-slate-700 font-mono font-black mt-3 uppercase italic tracking-widest">{tx.id} // BLCK_H_0x{(i*88).toString(16)}</p>
                               </div>
                            </div>
                            <div>
                               <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-500/20 tracking-tighter shadow-lg">{tx.type}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                               {tx.farmId}
                            </div>
                            <div className="text-4xl font-mono font-black text-white tracking-tighter">
                               {tx.value > 0 ? '+' : ''}{tx.value} <span className="text-xs text-slate-700 font-sans uppercase italic">{tx.unit}</span>
                            </div>
                            <div className="flex justify-end pr-8">
                               <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-2xl transition-all scale-90 group-hover:scale-100 ring-4 ring-emerald-500/0 group-hover:ring-emerald-500/5">
                                  <ShieldCheck size={24} />
                               </div>
                            </div>
                         </div>
                       ))
                    )}
                 </div>
                 <div className="p-8 border-t border-white/10 bg-black/80 flex justify-between items-center text-[10px] font-black text-slate-700 uppercase tracking-widest italic">
                    <span className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SYSTEM_INTEGRITY_OK // END_TO_END_ENCRYPTED_SHARDS</span>
                    <span>EOS_v6.5 // ARCHIVE_GATEWAY_NODE</span>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- GATEWAY FLOW MODAL --- */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowGatewayModal(null)}></div>
           <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[80px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(37,99,235,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-blue-500/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_#2563eb44] border-4 border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       {showGatewayModal === 'deposit' ? <ArrowDownLeft size={48} className="text-white relative z-10" /> : <ArrowUpRight size={48} className="text-white relative z-10" />}
                    </div>
                    <div>
                       <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">{showGatewayModal === 'deposit' ? 'Inflow' : 'Outflow'} <span className="text-blue-400">Gateway</span></h3>
                       <p className="text-blue-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">NODE_BRIDGE_PROTOCOL_v5.0</p>
                    </div>
                 </div>
                 <button onClick={() => setShowGatewayModal(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar flex flex-col bg-black/40 relative z-10">
                 {gatewayStep === 'config' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-8 block">Execution Amount ({gatewayCurrency})</label>
                          <div className="relative group">
                             <input 
                               type="number" value={gatewayAmount} onChange={e => setGatewayAmount(e.target.value)}
                               className="w-full bg-black border-2 border-white/10 rounded-[48px] py-12 px-12 text-7xl font-black text-white focus:ring-8 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-900 shadow-inner italic font-mono text-center" 
                             />
                             <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-3">
                                <button onClick={() => setGatewayCurrency('KES')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${gatewayCurrency === 'KES' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>KES</button>
                                <button onClick={() => setGatewayCurrency('USD')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${gatewayCurrency === 'USD' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}>USD</button>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-8 block">Inflow Provider Node</label>
                          <div className="grid grid-cols-1 gap-4">
                             {user.wallet.linkedProviders.length === 0 ? (
                               <div className="p-10 border-2 border-dashed border-white/10 rounded-[40px] text-center space-y-6">
                                  <p className="text-slate-500 italic text-sm">"No providers linked to this registry node."</p>
                                  <button onClick={() => { setShowGatewayModal(null); setShowLinkProvider(true); }} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase rounded-xl border border-white/10 transition-all">LINK_NEW_PROVIDER</button>
                               </div>
                             ) : user.wallet.linkedProviders.map(lp => (
                               <button 
                                 key={lp.id}
                                 onClick={() => setSelectedProvider(lp)}
                                 className={`p-8 rounded-[48px] border-2 transition-all flex items-center justify-between group/provider ${selectedProvider?.id === lp.id ? 'bg-blue-600/10 border-blue-500 shadow-xl' : 'bg-black/60 border-white/5 text-slate-500 hover:border-white/20'}`}
                               >
                                  <div className="flex items-center gap-8">
                                     <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${selectedProvider?.id === lp.id ? 'text-blue-400' : 'text-slate-700'}`}>
                                        <Smartphone size={24} />
                                     </div>
                                     <div className="text-left">
                                        <p className="text-xl font-black text-white uppercase italic leading-none">{lp.name}</p>
                                        <p className="text-[10px] text-slate-600 font-mono mt-3 uppercase tracking-widest font-black">•••• {lp.accountFragment}</p>
                                     </div>
                                  </div>
                                  {selectedProvider?.id === lp.id && <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_#3b82f6]"></div>}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="p-10 bg-black/80 rounded-[56px] border border-white/10 shadow-inner flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="text-center md:text-left space-y-1">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Network Impact</p>
                             <p className="text-4xl font-mono font-black text-emerald-400">+{gatewayEacEquivalent.toFixed(0)} <span className="text-xl italic font-sans text-emerald-800">EAC</span></p>
                          </div>
                          <button 
                            onClick={handleGatewayProcess}
                            disabled={!selectedProvider || !gatewayAmount}
                            className="w-full md:w-auto px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5 disabled:opacity-30"
                          >
                             INITIALIZE HANDSHAKE
                          </button>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'handoff' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <Loader2 size={120} className="text-blue-500 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <ArrowRightCircle className="w-16 h-16 text-blue-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <p className="text-blue-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">REDIRECTING TO PROVIDER...</p>
                          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">GATEWAY_SESSION_v5 // ZK_ENCRYPTED_TUNNEL</p>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'external_sync' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-20px] border-t-8 border-indigo-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-[56px] bg-indigo-600/10 border-2 border-indigo-500/30 flex items-center justify-center shadow-3xl animate-float">
                             <RefreshCw size={64} className="text-indigo-400 animate-spin-slow" />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">EXTERNAL_SYNC_ACTIVE</p>
                          <p className="text-slate-500 text-lg italic max-w-sm mx-auto">"Please authorize the transaction on your external device linked to node **{selectedProvider?.accountFragment}**."</p>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-8">
                          <div className="w-32 h-32 bg-blue-500/10 rounded-[44px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl group relative overflow-hidden">
                             <Fingerprint className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
                             <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Cryptographic <span className="text-blue-400">Anchor</span></h4>
                       </div>

                       <div className="space-y-6 max-w-xl mx-auto w-full">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">INSTITUTIONAL SIGNATURE (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign} 
                             onChange={e => setEsinSign(e.target.value)} 
                             placeholder="EA-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[48px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-blue-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <button 
                         onClick={handleFinalizeGateway}
                         disabled={!esinSign || isProcessingGateway}
                         className="w-full max-w-xl mx-auto py-12 agro-gradient rounded-[56px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(37,99,235,0.4)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                       >
                          {isProcessingGateway ? <Loader2 className="w-10 h-10 animate-spin" /> : <Key className="w-10 h-10 fill-current" />}
                          {isProcessingGateway ? "MINTING SHARD..." : `FINALIZE ${showGatewayModal?.toUpperCase()} SHARD`}
                       </button>
                    </div>
                 )}

                 {gatewayStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 className="w-32 h-32 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Gateway <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_GATE_OK_SYNC</p>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-emerald-500/5 space-y-4 max-w-lg w-full shadow-2xl relative overflow-hidden group/success">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/success:rotate-12 transition-transform duration-[10s]"><Activity size={120} /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-4">
                             <span className="text-slate-500 font-black uppercase tracking-widest italic">Capital Deployment</span>
                             <span className="text-white font-mono font-black text-2xl text-emerald-400">+{gatewayEacEquivalent.toFixed(0)} EAC</span>
                          </div>
                          <div className="h-px w-full bg-white/10"></div>
                          <p className={`text-[10px] text-slate-400 italic px-4 text-center leading-loose`}>"Your gateway shard is now part of the global consensus quorum. Network utility liquidized at node level."</p>
                       </div>
                       <button onClick={resetPortal} className="w-full max-w-md py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Treasury Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes glow { from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.2); } to { box-shadow: 0 0 40px rgba(245, 158, 11, 0.5); } }
        .animate-glow { animation: glow 2s infinite alternate ease-in-out; }
      `}</style>
    </div>
  );
};

export default AgroWallet;