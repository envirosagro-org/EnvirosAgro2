import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, Globe, Activity, Cpu, Sparkles, Binary, 
  Coins, Users, ArrowRight, BrainCircuit, Bot, 
  TrendingUp, Fingerprint, Lock, Sprout, Briefcase, Database, Wallet, Pickaxe, History, Package, Trello,
  LayoutGrid, ArrowUpRight, ShoppingBag, Radio, Signal, Eye, ChevronRight,
  Gem, Landmark, PlayCircle, BookOpen, Lightbulb, CheckCircle2,
  AlertCircle, Target, Waves, ShieldAlert, UserPlus, AlertTriangle,
  Loader2
} from 'lucide-react';
import { ViewState, User, Order, AgroBlock } from '../types';
import IdentityCard from './IdentityCard';
import { SycamoreLogo } from '../App';

interface DashboardProps {
  onNavigate: (view: ViewState, action?: string | null) => void;
  user: User;
  isGuest: boolean;
  orders?: Order[];
  blockchain?: AgroBlock[];
  isMining?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, isGuest, orders = [], blockchain = [], isMining = false }) => {
  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const totalBalance = user.wallet.balance + (user.wallet.bonusBalance || 0);

  const RECOMMENDATIONS = [
    { id: 'rec-1', title: 'Optimize m-Constant', priority: 'High', icon: TrendingUp, target: 'intelligence', col: 'text-blue-400', desc: 'Your regional stability is below 1.42x. Initiate a remediation shard.' },
    { id: 'rec-2', title: 'Diversify Crop DNA', priority: 'Medium', icon: Binary, target: 'biotech_hub', col: 'text-emerald-400', desc: 'Market demand for Bantu Rice is surging. Forge a new genetic shard.' },
    { id: 'rec-3', title: 'Audit Field Proofs', priority: 'Critical', icon: ShieldAlert, target: 'tqm', col: 'text-rose-500', desc: '3 shipments are awaiting your digital GRN signature.' },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 w-full overflow-x-hidden pb-20">
      
      {/* Network Pulse Ticker - High Frequency */}
      <div className="glass-card p-2.5 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-md shrink-0">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 shrink-0">
           <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 whitespace-nowrap">Live Pulse</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[9px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.3em]">
             {isMining ? 'NEURAL_FINALITY_SEQUENCE_ACTIVE • MINING_BLOCK_HASH_COMMIT • ' : ''}
             {blockchain.length > 0 ? `Latest Block: ${blockchain[0].hash.substring(0, 12)}... by ${blockchain[0].validator} • ` : ''}
             Node {user.esin} multiplier active • Sycamore consensus achieved • Global quorum reached • Block Finalized 0x882A • Latency: 14ms • Consensus: 99.9% • New Carbon Credits minted in Zone 2 • m-Constant stability optimized •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
        {/* Main Identity & Metrics */}
        <div className="xl:col-span-8">
          <div className="glass-card p-6 md:p-12 rounded-[40px] md:rounded-[56px] relative overflow-hidden group h-full flex flex-col justify-between shadow-3xl bg-black/40 border border-white/5">
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none group-hover:scale-105 transition-transform duration-[10s]">
                <SycamoreLogo size={600} className="text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 md:gap-8 items-center pb-8 md:pb-12 border-b border-white/5 mb-8 md:mb-10">
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center text-center sm:text-left">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[36px] bg-white text-slate-900 flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl relative ring-4 ring-white/10 shrink-0">
                    {user.name[0]}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-500 flex items-center justify-center border-4 border-[#050706] shadow-2xl">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-white break-words">{user.name.toUpperCase()}</h3>
                    <p className="text-slate-500 text-sm md:text-lg font-medium italic">{user.role}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] md:text-[9px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest shadow-inner whitespace-nowrap">{user.wallet.tier.toUpperCase()} TIER</span>
                       <span className={`px-3 py-1 bg-blue-500/10 text-blue-400 text-[8px] md:text-[9px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest font-mono shadow-inner whitespace-nowrap ${isMining ? 'animate-pulse' : ''}`}>{isMining ? 'SYNCING_BLOCK' : 'NODE_ACTIVE'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowIdentityCard(true)} className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-5 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-3">
                  <Fingerprint className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  Steward Dossier
                </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
                {[
                  { label: 'EAC Treasury', val: totalBalance.toFixed(0), unit: 'SHRD', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'Growth Index', val: user.metrics.agriculturalCodeU, unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'Network Height', val: blockchain.length + 428812, unit: 'BLCK', icon: Activity, col: 'text-amber-500', progress: 100 },
                  { label: 'Sustainability', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-6 md:p-8 bg-black/60 rounded-[32px] md:rounded-[44px] border border-white/5 space-y-3 md:space-y-4 group/stat hover:border-white/20 hover:bg-white/[0.04] transition-all shadow-inner">
                    <div className="flex items-center gap-3">
                       <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.col} opacity-40`} />
                       <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </div>
                    <p className={`text-3xl md:text-4xl font-mono font-black text-white tracking-tighter ${stat.col} leading-none`}>
                      {stat.val}<span className="text-[10px] ml-1 opacity-20 font-sans font-medium uppercase">{stat.unit}</span>
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-2 md:mt-4">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2.5s] shadow-[0_0_10px_current]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Hub */}
        <div className="xl:col-span-4">
          <div className="glass-card p-8 md:p-10 rounded-[40px] md:rounded-[56px] border border-white/5 bg-black/40 h-full flex flex-col justify-between group overflow-hidden relative shadow-3xl min-h-[400px]">
             <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:rotate-12 transition-transform duration-700">
                <BrainCircuit className="w-48 h-48 md:w-64 md:h-64 text-white" />
             </div>
             <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex items-center gap-4 md:gap-6">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-[24px] md:rounded-[32px] shadow-2xl flex items-center justify-center border-4 border-white/5 relative shrink-0">
                      {isMining ? <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin" /> : <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />}
                   </div>
                   <div>
                      <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Oracle <span className="text-indigo-400">Hub</span></h4>
                      <p className="text-[10px] font-mono text-indigo-400 font-bold uppercase mt-2 tracking-widest">{isMining ? 'PROCESSING_SHARD' : 'Cognitive_Relay_Active'}</p>
                   </div>
                </div>
                <div className="p-6 md:p-10 bg-black/80 rounded-[32px] md:rounded-[44px] border border-white/10 relative overflow-hidden shadow-inner border-l-[8px] md:border-l-[12px] border-l-indigo-600/50">
                   <p className="text-slate-300 text-sm md:text-xl leading-relaxed italic font-medium">
                     {isMining ? '"Finalizing ledger commit 0x... Registry quorum confirmed."' : '"Your regional m-Constant has optimized by 14.2%. Strategic sharding of Nitrogen assets recommended for Phase 4."'}
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-5 md:py-8 agro-gradient rounded-3xl md:rounded-[40px] text-white font-black text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] shadow-3xl mt-8 md:mt-10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Zap className="w-4 h-4 md:w-6 md:h-6 fill-current" /> INITIALIZE INGEST
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8 pt-6">
        <div className="flex items-center justify-between px-6 md:px-10">
          <h3 className="text-sm md:text-lg font-black uppercase tracking-[0.4em] md:tracking-[0.5em] italic flex items-center gap-3 md:gap-4 text-white">
             <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-amber-500" /> Strategic <span className="text-emerald-400">Path</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-6 md:px-10">
           {RECOMMENDATIONS.map((rec) => (
             <div key={rec.id} className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-white/5 bg-black/60 shadow-xl group hover:border-indigo-500/20 transition-all flex flex-col justify-between min-h-[320px]">
                <div className="space-y-4 md:space-y-6">
                   <div className="flex justify-between items-start">
                      <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 ${rec.col} shadow-inner`}>
                         <rec.icon size={24} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase border tracking-widest ${
                         rec.priority === 'High' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                         rec.priority === 'Critical' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                         'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {rec.priority}
                      </span>
                   </div>
                   <h4 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">{rec.title}</h4>
                   <p className="text-xs md:text-sm text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100">"{rec.desc}"</p>
                </div>
                <button 
                  onClick={() => onNavigate(rec.target as ViewState)}
                  className="w-full py-4 mt-6 md:mt-8 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                   Execute Strategy <ArrowRight size={14} />
                </button>
             </div>
           ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .shadow-3xl { box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.6); }
      `}</style>
    </div>
  );
};

export default Dashboard;