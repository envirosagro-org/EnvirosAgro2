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
  AlertTriangle,
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
  Info
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider } from '../types';

interface AgroWalletProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onUpdateUser?: (updatedUser: User) => void;
  pendingAction?: string | null;
  clearAction?: () => void;
  onSwap: (eatAmount: number) => boolean;
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

const AgroWallet: React.FC<AgroWalletProps> = ({ user, onNavigate, onUpdateUser, pendingAction, clearAction, onSwap }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'harvest' | 'gateway' | 'history'>('overview');
  const [isClaiming, setIsClaiming] = useState(false);
  const [unclaimedEAC, setUnclaimedEAC] = useState(12.45);
  const [harvestCycle, setHarvestCycle] = useState(0);
  
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

  useEffect(() => {
    if (activeSubTab === 'harvest') {
      const interval = setInterval(() => {
        setUnclaimedEAC(prev => prev + 0.0012);
        setHarvestCycle(prev => (prev + 1) % 100);
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
      setIsClaiming(false);
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

  const totalSpendable = user.wallet.balance + user.wallet.bonusBalance;
  const totalFiatUSD = (totalSpendable * FOREX_RATES.EAC_USD) + (user.wallet.eatBalance * FOREX_RATES.EAT_USD);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto">
      
      {/* Dual Token Status HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 glass-card rounded-[32px] bg-emerald-500/5 border-emerald-500/20 text-center space-y-1">
           <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">Total Spendable (Utility)</p>
           <h4 className="text-3xl font-mono font-black text-white">{totalSpendable.toFixed(0)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-yellow-500/5 border-yellow-500/20 text-center space-y-1">
           <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest leading-none">EAT Gold (Equity)</p>
           <h4 className="text-3xl font-mono font-black text-white">{user.wallet.eatBalance.toFixed(4)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-blue-500/5 border-blue-500/20 text-center space-y-1">
           <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none">Total Value (USD)</p>
           <h4 className="text-3xl font-mono font-black text-white">${totalFiatUSD.toFixed(2)}</h4>
        </div>
        <div className="p-6 glass-card rounded-[32px] bg-indigo-500/5 border-indigo-500/20 text-center space-y-1">
           <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest leading-none">Institutional Rate</p>
           <h4 className="text-xl font-mono font-black text-white">{user.wallet.exchangeRate.toFixed(2)} <span className="text-[10px]">EAC/EAT</span></h4>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[28px] w-fit border border-white/5 bg-black/40 shadow-sm">
        {[
          { id: 'overview', label: 'Treasury Node', icon: Wallet },
          { id: 'gateway', label: 'Institutional Bridges', icon: Globe2 },
          { id: 'harvest', label: 'Reaction Harvest', icon: Pickaxe },
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
                    <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <Coins className="w-4 h-4 text-emerald-400" />
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Withdrawable Utility</p>
                          </div>
                          <TrendingUp className="w-4 h-4 text-emerald-400 opacity-20" />
                        </div>
                        <p className="text-4xl font-mono font-black text-white">{user.wallet.balance.toFixed(0)}</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 group hover:border-emerald-500/5 transition-all">
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
                           <div key={f.pair} className="p-4 bg-black/60 rounded-2xl border border-white/5 flex justify-between items-center group-hover:border-blue-500/20 transition-all">
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

                  <div className="p-8 glass-card rounded-[40px] bg-emerald-600/5 border border-emerald-500/20 space-y-4">
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

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                   <h4 className="text-xl font-bold text-white uppercase tracking-widest px-4">Provider Registry</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(user.wallet.linkedProviders || []).map(lp => (
                        <div key={lp.id} className="p-8 glass-card rounded-[44px] border border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden bg-black/40">
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
                   <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Bot className="w-48 h-48 text-indigo-400" /></div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                            <Bot className="w-6 h-6 text-indigo-400" />
                         </div>
                         <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Bridge <span className="text-indigo-400">Oracle</span></h4>
                      </div>
                      <p className="text-slate-300 text-sm italic font-medium leading-relaxed border-l-2 border-indigo-500/40 pl-6 relative z-10">
                        "Your current m-Constant allows for a 1.2% reduction in gateway sharding fees. Sync external KES or USD shards for immediate utility."
                      </p>
                      <div className="flex gap-4 relative z-10 pt-4">
                         <button 
                          onClick={() => setShowGatewayModal('deposit')}
                          className="flex-1 py-4 agro-gradient rounded-2xl text-[10px] font-black uppercase text-white shadow-xl active:scale-95"
                         >
                            Ingest Capital
                         </button>
                         <button 
                          onClick={() => setShowGatewayModal('withdrawal')}
                          className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white/10 active:scale-95"
                         >
                            Release Funds
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'harvest' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/40 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-3xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none"></div>
                
                <div className="relative z-10 space-y-10 w-full">
                   <div className="flex flex-col items-center space-y-4">
                      <div className="w-64 h-64 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center relative group">
                         <div className="absolute inset-4 rounded-full border-2 border-emerald-500/40 animate-spin-slow"></div>
                         <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex flex-col items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.2)] group-hover:bg-emerald-500/20 transition-all duration-700">
                            <Pickaxe className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                            <p className="text-4xl font-mono font-black text-white tracking-tighter">{unclaimedEAC.toFixed(3)}</p>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Unsettled EAC (Utility)</p>
                         </div>
                         <svg className="absolute inset-0 w-64 h-64 transform -rotate-90">
                            <circle cx="128" cy="128" r="120" fill="transparent" stroke="rgba(16,185,129,0.1)" strokeWidth="4" />
                            <circle cx="128" cy="128" r="120" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={754} strokeDashoffset={754 - (754 * harvestCycle / 100)} strokeLinecap="round" />
                         </svg>
                      </div>
                   </div>

                   <button 
                    onClick={handleHarvestManual}
                    disabled={isClaiming || unclaimedEAC < 0.1}
                    className={`w-full max-w-md py-8 rounded-[40px] font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-6 mx-auto ${
                       unclaimedEAC >= 0.1 ? 'agro-gradient text-white hover:scale-[1.02] active:scale-95 shadow-emerald-900/40' : 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed'
                    }`}
                   >
                      {isClaiming ? <Loader2 className="w-8 h-8 animate-spin" /> : <RefreshCw className="w-8 h-8" />}
                      {isClaiming ? 'SIGNING LEDGER...' : 'SYNC REACTION CREDITS'}
                   </button>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Binary className="w-48 h-48 text-indigo-400" /></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-4 bg-indigo-500 rounded-2xl shadow-2xl">
                         <Gauge className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic">Impact <span className="text-indigo-400">Minting</span></h4>
                   </div>
                   <div className="space-y-6 relative z-10">
                      <p className="text-slate-400 text-sm italic font-medium leading-relaxed pl-6 border-l-2 border-indigo-500/30">
                        "Improve your m™ Constant to mint deflationary EAT. Current baseline: <span className="text-yellow-500 font-bold">{user.metrics.baselineM.toFixed(2)}</span>."
                      </p>
                      <button onClick={() => onNavigate('sustainability')} className="w-full py-5 bg-yellow-500 rounded-3xl text-[10px] font-black text-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 relative z-10 active:scale-95 shadow-xl">
                         <Sprout className="w-4 h-4" /> Improve Sustainability
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeSubTab === 'history' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="glass-card rounded-[40px] overflow-hidden border border-white/5 bg-black/40 shadow-xl">
                <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <span className="col-span-2">Transaction Shard</span>
                   <span>Asset Unit</span>
                   <span className="text-right">Value Delta</span>
                   <span className="text-right">Registry Auth</span>
                </div>
                <div className="divide-y divide-white/5">
                   {MOCK_HISTORY.map(tx => (
                     <div key={tx.id} className="grid grid-cols-5 p-8 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                        <div className="col-span-2 flex items-center gap-6">
                           <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <Binary className={`w-6 h-6 ${tx.unit === 'EAT' ? 'text-yellow-500' : tx.unit === 'EAC' ? 'text-emerald-400' : 'text-blue-400'}`} />
                           </div>
                           <div>
                              <p className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{tx.details}</p>
                              <p className="text-[10px] text-slate-600 font-mono mt-1 font-black uppercase">{tx.id}</p>
                           </div>
                        </div>
                        <div>
                           <span className={`px-3 py-1 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.unit === 'EAT' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-400'}`}>{tx.unit}</span>
                        </div>
                        <div className="text-right">
                           <p className={`text-xl font-mono font-black ${tx.value > 0 ? (tx.unit === 'EAT' ? 'text-yellow-500' : 'text-emerald-400') : 'text-rose-500'}`}>
                              {tx.value > 0 ? '+' : ''}{tx.value.toFixed(tx.unit === 'EAT' ? 4 : 1)}
                           </p>
                        </div>
                        <div className="flex justify-end pr-4">
                           <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shadow-xl">
                              <ShieldCheck size={16} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Bridge Modals */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowGatewayModal(null)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-10 rounded-[56px] border-indigo-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="space-y-8 py-4">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${showGatewayModal === 'deposit' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                          {showGatewayModal === 'deposit' ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{showGatewayModal} <span className="text-indigo-400">Shard</span></h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Institutional Bridge Relay</p>
                       </div>
                    </div>
                    <button onClick={() => setShowGatewayModal(null)} className="p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X size={20} /></button>
                 </div>

                 {gatewayStep === 'config' && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Select Linked Provider</label>
                          <div className="grid grid-cols-1 gap-3">
                             {(user.wallet.linkedProviders || []).map(lp => (
                                <button 
                                  key={lp.id}
                                  onClick={() => setSelectedProvider(lp)}
                                  className={`p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedProvider?.id === lp.id ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-black border-white/5 text-slate-500 hover:bg-white/5'}`}
                                >
                                   <div className="flex items-center gap-4">
                                      {lp.type === 'Mobile' ? <Smartphone size={20} /> : <Building2 size={20} />}
                                      <div className="text-left">
                                         <p className="text-sm font-black uppercase">{lp.name}</p>
                                         <p className="text-[10px] font-mono">{lp.accountFragment}</p>
                                      </div>
                                   </div>
                                   {selectedProvider?.id === lp.id && <CheckCircle2 size={20} />}
                                </button>
                             ))}
                             <button 
                               onClick={() => { setShowLinkProvider(true); setShowGatewayModal(null); }}
                               className="p-4 rounded-[28px] border-2 border-dashed border-white/10 text-slate-700 flex items-center justify-center gap-3 hover:border-white/20 transition-all"
                             >
                                <PlusCircle size={18} /> <span className="text-[10px] font-black uppercase">Add New Node</span>
                             </button>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fiat Capital Shard</label>
                             <div className="flex p-1 bg-black rounded-xl border border-white/5">
                                {['KES', 'USD'].map(c => (
                                   <button 
                                      key={c} 
                                      onClick={() => setGatewayCurrency(c as any)}
                                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${gatewayCurrency === c ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-white'}`}
                                   >
                                      {c}
                                   </button>
                                ))}
                             </div>
                          </div>
                          <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 flex items-center justify-between group overflow-hidden">
                             <input 
                              type="number" 
                              value={gatewayAmount}
                              onChange={e => setGatewayAmount(e.target.value)}
                              className="bg-transparent text-5xl font-mono font-black text-white outline-none w-full"
                             />
                             <span className="text-xl font-black text-blue-400">{gatewayCurrency}</span>
                          </div>
                          
                          {/* Conversion Estimate */}
                          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <Repeat className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black text-slate-500 uppercase">Estimated Inflow</span>
                             </div>
                             <p className="text-xl font-mono font-black text-emerald-400">
                                {showGatewayModal === 'deposit' ? '+' : '-'}
                                {(Number(gatewayAmount) / (gatewayCurrency === 'USD' ? FOREX_RATES.EAC_USD : FOREX_RATES.EAC_KES)).toFixed(0)}
                                <span className="text-xs ml-1">EAC</span>
                             </p>
                          </div>
                       </div>

                       <button 
                        onClick={() => setGatewayStep('sign')}
                        disabled={!selectedProvider || !gatewayAmount}
                        className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                       >
                          Proceed to Authentication <ChevronRight size={20} />
                       </button>
                    </div>
                 )}

                 {gatewayStep === 'sign' && (
                    <div className="space-y-10 animate-in slide-in-from-right duration-300 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative">
                             <Fingerprint className="w-10 h-10 text-indigo-400" />
                             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[32px] animate-ping opacity-30"></div>
                          </div>
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Signature <span className="text-indigo-400">Required</span></h4>
                          <p className="text-slate-400 text-lg font-medium italic">Sign the gateway shard with your ESIN node signature.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Steward Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900" 
                          />
                       </div>

                       <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-center gap-6">
                          <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                          <p className="text-[10px] text-blue-200/50 font-black uppercase leading-relaxed tracking-tight text-left">
                             INGEST_SYNC: Value will be locked until the external bridge confirms settlement (typically 12-24h).
                          </p>
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setGatewayStep('config')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                             onClick={handleGatewayAction}
                             disabled={isProcessingGateway || !esinSign}
                             className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                          >
                             {isProcessingGateway ? <Loader2 className="w-8 h-8 animate-spin" /> : <Key className="w-6 h-6 fill-current" />}
                             {isProcessingGateway ? "Syncing Shard..." : `Authorize ${showGatewayModal}`}
                          </button>
                       </div>
                    </div>
                 )}

                 {gatewayStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Shard <span className="text-emerald-400">Settled</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Hash commit: 0xGW_SETTLE_{(Math.random()*1000).toFixed(0)} locked.</p>
                       </div>
                       <button onClick={() => setShowGatewayModal(null)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Treasury</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Swap Modal (Modified for Fiat Estimates) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setShowSwapModal(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-12 rounded-[56px] border-yellow-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="space-y-10 py-4 flex flex-col min-h-[500px]">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-yellow-600 flex items-center justify-center text-black shadow-xl">
                          <ArrowRightLeft size={32} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Institutional <span className="text-yellow-500">Swap</span></h3>
                          <p className="text-slate-500 text-[10px] font-black uppercase mt-2 tracking-widest">Converting Utility to Equity Shards</p>
                       </div>
                    </div>
                    <button onClick={() => setShowSwapModal(false)} className="p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all"><X size={20} /></button>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="space-y-4">
                       <div className="flex justify-between px-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mint EAT (Equity)</span>
                          <span className="text-[10px] font-black text-slate-700 uppercase">Balance: {user.wallet.eatBalance.toFixed(4)} EAT</span>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 flex items-center justify-between group overflow-hidden">
                          <input 
                            type="number" 
                            value={swapInputEAT}
                            onChange={e => setSwapInputEAT(e.target.value)}
                            className="bg-transparent text-5xl font-mono font-black text-white outline-none w-full"
                          />
                          <span className="text-xl font-black text-yellow-500 italic">EAT</span>
                       </div>
                    </div>

                    <div className="flex justify-center relative py-2">
                       <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-lg relative z-10">
                          <ArrowDown size={20} className="text-yellow-500" />
                       </div>
                       <div className="absolute inset-0 flex items-center">
                          <div className="h-px w-full bg-white/5"></div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between px-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spend EAC (Utility)</span>
                          <span className="text-[10px] font-black text-slate-700 uppercase">Balance: {totalSpendable.toFixed(0)} EAC</span>
                       </div>
                       <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 flex items-center justify-between opacity-80">
                          <p className="text-4xl font-mono font-black text-emerald-500">
                             {(Number(swapInputEAT) * user.wallet.exchangeRate).toFixed(0)}
                          </p>
                          <span className="text-xl font-black text-emerald-400 italic">EAC</span>
                       </div>
                    </div>
                    
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <Activity size={16} className="text-blue-400" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">Net USD Impact</span>
                       </div>
                       <p className="text-lg font-mono font-black text-white">+${(Number(swapInputEAT) * FOREX_RATES.EAT_USD).toFixed(2)}</p>
                    </div>
                 </div>

                 <button 
                  onClick={handleExecuteSwap}
                  disabled={isSwapping || Number(swapInputEAT) <= 0}
                  className="w-full py-8 bg-yellow-600 rounded-[32px] text-black font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                 >
                    {isSwapping ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                    {isSwapping ? "AUTHORIZING SWAP..." : "CONFIRM INSTITUTIONAL SWAP"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Link Provider Modal */}
      {showLinkProvider && (
        <div className="fixed inset-0 z-[610] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-2xl" onClick={() => setShowLinkProvider(false)}></div>
           <div className="relative z-10 w-full max-w-md glass-card p-12 rounded-[56px] border-indigo-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 text-center space-y-10">
              <div className="w-24 h-24 bg-indigo-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group overflow-hidden">
                 <Link className="w-10 h-10 text-indigo-400 group-hover:rotate-12 transition-transform" />
                 <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
              </div>
              <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Provider <span className="text-indigo-400">Sync</span></h3>
                 <p className="text-slate-400 text-lg font-medium italic mt-6 leading-relaxed">
                   Link your external financial identity to the EOS registry.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-3 gap-3">
                    {['Mobile', 'Bank', 'Web3'].map(p => (
                       <div key={p} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-indigo-500/40 cursor-pointer transition-all">
                          {p === 'Mobile' ? <Smartphone size={16} className="mx-auto mb-2" /> : p === 'Bank' ? <Building2 size={16} className="mx-auto mb-2" /> : <Activity size={16} className="mx-auto mb-2" />}
                          {p}
                       </div>
                    ))}
                 </div>
                 <div className="space-y-2 text-left px-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Provider Handle/UID</label>
                    <input type="text" placeholder="07XX XXX XXX" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-8 text-white font-mono text-center text-xl tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/20" />
                 </div>
              </div>

              <button 
                onClick={handleLinkProvider}
                disabled={isProcessingGateway}
                className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                 {isProcessingGateway ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                 {isProcessingGateway ? 'AUTHENTICATING...' : 'AUTHORIZE HANDSHAKE'}
              </button>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgroWallet;