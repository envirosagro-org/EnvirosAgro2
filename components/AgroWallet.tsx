
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Zap, ShieldCheck, Clock, RefreshCw, 
  TrendingUp, Coins, History, ChevronRight, X, Loader2, CheckCircle2, 
  Landmark, PlusCircle, ShieldAlert, Globe2, Fingerprint, SmartphoneNfc, 
  Link2, DollarSign, Bot, Repeat, Info, BarChart4, Stamp, Trash2, Gem,
  Activity, Sparkles, Search, Download, Building2, User as UserIcon,
  CreditCard, Binary, ExternalLink, Shield, Lock as LockIcon,
  ArrowRightLeft, ArrowRight, Key, Database, Layers, Target, Waves,
  Cpu, Workflow, ArrowRightCircle, Package, Sprout, Factory, Trophy,
  BadgeCheck, Smartphone, ShieldPlus, Send, MessageSquareCode, FileText,
  BadgeAlert, ArrowDownToLine, Gavel, Receipt, Smartphone as PhoneIcon,
  Mail, ChevronDown
} from 'lucide-react';
import { User, AgroTransaction, ViewState, LinkedProvider, AgroProject } from '../types';
import { analyzeInstitutionalRisk } from '../services/geminiService';
import { initiatePayPalPayout } from '../services/paymentService';

interface AgroWalletProps {
  user: User;
  isGuest: boolean;
  onNavigate: (view: ViewState) => void;
  onUpdateUser: (updatedUser: User) => void;
  onSwap: (eatAmount: number) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  projects?: AgroProject[];
  transactions?: AgroTransaction[];
  notify: any;
  initialSection?: string | null;
}

const AgroWallet: React.FC<AgroWalletProps> = ({ 
  user, isGuest, onNavigate, onUpdateUser, onSwap, onEarnEAC, transactions = [], notify, initialSection
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'treasury' | 'staking' | 'swap' | 'gateway' | 'ledger'>('treasury');
  const [swapAmount, setSwapAmount] = useState('1.0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [isRiskAuditing, setIsRiskAuditing] = useState(false);

  const isResonanceStable = user.metrics.timeConstantTau >= 1.42;

  const handleExecuteSwap = async () => {
    const amount = Number(swapAmount);
    if (amount <= 0 || amount > user.wallet.eatBalance) return;
    
    if (!isResonanceStable) {
      alert("LIQUIDITY_LOCK: m-Constant resonance (1.42x) not maintained. Swap prohibited until node recalibration.");
      return;
    }

    setIsSwapping(true);
    setIsRiskAuditing(true);
    
    try {
      const risk = await analyzeInstitutionalRisk({ esin: user.esin, type: 'EAT_SWAP', amount });
      if (risk.text.includes(' assessment clear')) {
        const ok = await onSwap(amount);
        if (ok) notify({ title: 'SHARD_CONVERTED', message: 'EAT converted to liquid utility.', type: 'success' });
      }
    } finally {
      setIsSwapping(false);
      setIsRiskAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'LIQUID UTILITY (EAC)', val: user.wallet.balance.toLocaleString(), col: 'text-emerald-500', icon: Coins },
          { label: 'EQUITY ASSETS (EAT)', val: user.wallet.eatBalance.toFixed(4), col: 'text-amber-500', icon: Gem },
          { label: 'RESONANCE_STABILITY', val: isResonanceStable ? 'STABLE' : 'DRIFT', col: isResonanceStable ? 'text-emerald-400' : 'text-rose-500', icon: Activity },
          { label: 'GATEWAY_PROTOCOL', val: 'ZK_PAYPAL', col: 'text-blue-400', icon: ShieldCheck },
        ].map((m, i) => (
          <div key={i} className="p-8 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-4 group shadow-3xl">
             <p className={`text-[10px] ${m.col} font-black uppercase tracking-[0.4em]`}>{m.label}</p>
             <h4 className="text-4xl font-mono font-black text-white">{m.val}</h4>
          </div>
        ))}
      </div>

      <div className="flex p-1.5 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 mx-auto lg:mx-0">
        {['treasury', 'gateway', 'staking', 'swap', 'ledger'].map(tab => (
          <button key={tab} onClick={() => setActiveSubTab(tab as any)} className={`px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all ${activeSubTab === tab ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeSubTab === 'swap' && (
         <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700">
            <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-[#020503] shadow-3xl text-center space-y-12 relative overflow-hidden group">
               <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.3)] mx-auto"><ArrowRightLeft size={64} className="text-white" /></div>
               <div className="space-y-4">
                  <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">EQUITY <span className="text-indigo-400">SHARDING</span></h3>
                  <p className="text-slate-500 text-2xl font-medium italic">Liquidation gate for EAT equity shards.</p>
               </div>
               {!isResonanceStable && (
                 <div className="p-6 bg-rose-600/10 border-2 border-rose-500/40 rounded-3xl flex items-center gap-6 animate-pulse">
                    <ShieldAlert className="text-rose-500" />
                    <p className="text-rose-500 font-black text-xs uppercase tracking-widest text-left">Resonance required for sharding: 1.42x. Current: {user.metrics.timeConstantTau}x</p>
                 </div>
               )}
               <div className="max-w-md mx-auto space-y-8">
                  <input type="number" value={swapAmount} onChange={e => setSwapAmount(e.target.value)} className="w-full bg-black border border-white/10 rounded-3xl py-8 text-center text-5xl font-mono font-black text-white outline-none" />
                  <button onClick={handleExecuteSwap} disabled={isSwapping || !isResonanceStable} className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-6 border-4 border-white/10 ring-[24px] ring-white/5 disabled:opacity-20">
                     {isSwapping ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                     {isRiskAuditing ? 'RISK_AUDITING...' : 'AUTHORIZE SHARD CONVERSION'}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AgroWallet;
