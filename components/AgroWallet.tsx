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
  ShieldPlus,
  Send,
  MessageSquareCode,
  FileText,
  BadgeAlert,
  ArrowDownToLine,
  Gavel,
  Receipt
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject } from '../types';
import { analyzeInstitutionalRisk, consultFinancialOracle, AIResponse } from '../services/geminiService';

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
  initialSection?: string | null;
}

const FOREX_RATES = {
  EAC_USD: 0.0124, 
  EAT_USD: 1.4288, 
  USD_KES: 132.50, 
  EAC_KES: 1.64,   
};

const STAKING_TIERS = [
  { id: 'bronze', label: 'ECOLOGY_STAKE', min: 100, yield: 4.5, period: '30 Cycles', icon: Sprout, col: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', accent: 'emerald' },
  { id: 'silver', label: 'INDUSTRIAL_STAKE', min: 1000, yield: 12.2, period: '90 Cycles', icon: Factory, col: 'text-indigo-400', bg: 'bg-indigo-500/5', border: 'border-indigo-500/20', accent: 'indigo' },
  { id: 'gold', label: 'SOVEREIGN_STAKE', min: 5000, yield: 24.8, period: '360 Cycles', icon: Trophy, col: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20', accent: 'amber' },
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
  notify,
  initialSection
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'treasury' | 'staking' | 'swap' | 'gateway' | 'ledger'>('treasury');
  
  useEffect(() => {
    if (initialSection && ['treasury', 'staking', 'swap', 'gateway', 'ledger'].includes(initialSection)) {
      setActiveSubTab(initialSection as any);
    }
  }, [initialSection]);

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

  // M-Pesa Specific
  const [isMpesaFlow, setIsMpesaFlow] = useState(false);
  const [mpesaStatus, setMpesaStatus] = useState<'IDLE' | 'STK_PUSH' | 'AWAITING_PIN' | 'VERIFIED'>('IDLE');

  // Stripe Specific
  const [isStripeFlow, setIsStripeFlow] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<'IDLE' | 'CREATING_INTENT' | 'CHECKOUT' | 'SUCCESS'>('IDLE');

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

  const handleGatewayProcess = async () => {
    const isMpesa = selectedProvider?.name.toLowerCase().includes('mpesa') || selectedProvider?.type === 'Mobile';
    const isStripe = selectedProvider?.name.toLowerCase().includes('stripe') || selectedProvider?.type === 'Card';
    
    if (isMpesa && showGatewayModal === 'deposit') {
      setIsMpesaFlow(true);
      setMpesaStatus('STK_PUSH');
      // Simulated Oracle Interaction using process_agro_payment tool logic
      await consultFinancialOracle(`Initiate M-Pesa payment for ${gatewayAmount} KES`, {
        phone: selectedProvider?.accountFragment,
        wallet: user.esin
      });
      
      setTimeout(() => setMpesaStatus('AWAITING_PIN'), 2000);
      setTimeout(() => setMpesaStatus('VERIFIED'), 5000);
      setTimeout(() => setGatewayStep('sign'), 6500);
    } else if (isStripe && showGatewayModal === 'deposit') {
      setIsStripeFlow(true);
      setStripeStatus('CREATING_INTENT');
      // Simulated Oracle Interaction using create_stripe_wallet_intent tool logic
      await consultFinancialOracle(`Initialize Stripe payment for ${gatewayAmount} USD`, {
        email: user.email,
        walletId: user.esin
      });
      
      setTimeout(() => setStripeStatus('CHECKOUT'), 2500);
      // Simulating user filling card info
      setTimeout(() => setStripeStatus('SUCCESS'), 6000);
      setTimeout(() => setGatewayStep('sign'), 7500);
    } else {
      setGatewayStep('handoff');
      setTimeout(() => setGatewayStep('external_sync'), 2000);
      setTimeout(() => setGatewayStep('sign'), 4000);
    }
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
      }
      setIsProcessingGateway(false);
      setGatewayStep('success');
    }, 3000);
  };

  const resetPortal = () => {
    setShowGatewayModal(null);
    setGatewayStep('config');
    setActiveSubTab('treasury');
    setIsMpesaFlow(false);
    setMpesaStatus('IDLE');
    setIsStripeFlow(false);
    setStripeStatus('IDLE');
  };

  const totalSpendable = user.wallet.balance + (user.wallet.bonusBalance || 0);
  const totalFiatUSD = (totalSpendable * FOREX_RATES.EAC_USD) + ((user.wallet.eatBalance + (user.wallet.stakedEat || 0)) * FOREX_RATES.EAT_USD);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* HUD: Treasury Metrics */}
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
             </div>
             <div className="lg:col-span-4 space-y-8">
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
        )}

        {/* --- VIEW: EQUITY STAKING --- */}
        {activeSubTab === 'staking' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                <div className="space-y-3">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">EQUITY <span className="text-indigo-400">STAKING</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Locking EAT shards into the validator quorum to secure the industrial mesh."</p>
                </div>
                <div className="p-10 glass-card rounded-[40px] border border-emerald-500/20 bg-emerald-600/5 text-center shadow-xl">
                   <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-3">CURRENT_YIELD</p>
                   <p className="text-6xl font-mono font-black text-white">12.4% <span className="text-sm italic font-sans text-emerald-400">APY</span></p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {STAKING_TIERS.map(tier => (
                   <button 
                     key={tier.id}
                     onClick={() => setSelectedTier(tier)}
                     className={`p-10 rounded-[56px] border-2 transition-all flex flex-col items-center text-center space-y-8 group ${selectedTier.id === tier.id ? `bg-${tier.accent}-600/10 border-${tier.accent}-500 shadow-3xl scale-105 ring-8 ring-${tier.accent}-500/5` : 'bg-black/40 border-white/5 opacity-50 hover:opacity-100'}`}
                   >
                      <div className={`p-6 rounded-3xl ${tier.bg} border ${tier.border} ${tier.col} shadow-inner group-hover:rotate-6 transition-transform`}>
                         <tier.icon size={48} />
                      </div>
                      <div className="space-y-4">
                         <h4 className={`text-2xl font-black uppercase italic ${tier.col}`}>{tier.label}</h4>
                         <div className="space-y-1">
                            <p className="text-5xl font-mono font-black text-white">{tier.yield}%</p>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">ANNUALIZED SHARD YIELD</p>
                         </div>
                      </div>
                      <div className="w-full pt-8 border-t border-white/5 space-y-4">
                         <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-600">Lock Period</span><span className="text-white">{tier.period}</span></div>
                         <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-600">Min Ingest</span><span className="text-white">{tier.min} EAT</span></div>
                      </div>
                   </button>
                ))}
             </div>

             <div className="max-w-4xl mx-auto glass-card p-12 md:p-16 rounded-[80px] border border-white/10 bg-black/60 shadow-3xl space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6 italic">Ingest Quantity (EAT)</label>
                      <input 
                        type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
                        className="w-full bg-black border-2 border-white/10 rounded-[40px] py-8 px-10 text-5xl font-mono font-black text-white focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all shadow-inner" 
                      />
                      <div className="flex justify-between px-6">
                         <span className="text-[10px] font-black text-slate-700 uppercase">Available Buffer</span>
                         <span className="text-[10px] font-black text-emerald-400 uppercase">{user.wallet.eatBalance.toFixed(2)} EAT</span>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6 italic">Signature Auth (ESIN)</label>
                      <input 
                        type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                        placeholder="EA-XXXX-XXXX"
                        className="w-full bg-black border-2 border-white/10 rounded-[40px] py-8 px-10 text-3xl font-mono font-black text-white focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner text-center" 
                      />
                   </div>
                </div>
                <button 
                  onClick={handleExecuteStake}
                  disabled={isStaking || !esinSign}
                  className="w-full py-10 agro-gradient rounded-full text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                >
                   {isStaking ? <Loader2 size={32} className="animate-spin" /> : <Layers size={32} />}
                   {isStaking ? 'ANCHORING EQUITY...' : 'COMMENCE STAKING HANDSHAKE'}
                </button>
             </div>
          </div>
        )}

        {/* Other tabs simplified for brevity in this example... */}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default AgroWallet;