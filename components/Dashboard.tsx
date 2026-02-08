
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
    { id: 'rec-1', title: 'Optimize m-Constant', priority: 'High', icon: TrendingUp, target: 'intelligence', col: 'text-blue-400', desc: 'Regional stability below 1.42x. Initiate remediation shard.' },
    { id: 'rec-2', title: 'Diversify Crop DNA', priority: 'Medium', icon: Binary, target: 'biotech_hub', col: 'text-emerald-400', desc: 'Market demand for Bantu Rice surging. Forge new genetic shard.' },
    { id: 'rec-3', title: 'Audit Field Proofs', priority: 'Critical', icon: ShieldAlert, target: 'tqm', col: 'text-rose-500', desc: '3 shipments awaiting digital GRN signature.' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 w-full overflow-x-hidden pb-12">
      
      {/* Network Pulse Ticker */}
      <div className="glass-card p-2 rounded-xl border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-md shrink-0">
        <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0">
           <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
           <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400 whitespace-nowrap">Live Pulse</span>
        </div>
        <div className="flex-1 px-3 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[8px] text-emerald-400/80 font-mono font-black uppercase tracking-widest">
             {isMining ? 'NEURAL_FINALITY_SEQUENCE_ACTIVE • MINING_BLOCK_HASH_COMMIT • ' : ''}
             {blockchain.length > 0 ? `Latest Block: ${blockchain[0].hash.substring(0, 12)}... by ${blockchain[0].validator} • ` : ''}
             Node {user.esin} multiplier active • Sycamore consensus achieved • Global quorum reached • Block Finalized 0x882A • Latency: 14ms • Consensus: 99.9% • New Carbon Credits minted in Zone 2 • m-Constant stability optimized •
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Identity & Metrics */}
        <div className="xl:col-span-8">
          <div className="glass-card p-6 md:p-8 rounded-[40px] relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl bg-black/40 border border-white/5">
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none group-hover:scale-105 transition-transform duration-[10s]">
                <SycamoreLogo size={300} className="text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 items-center pb-6 border-b border-white/5 mb-6">
                <div className="flex flex-col sm:flex-row gap-5 items-center text-center sm:text-left w-full">
                  <div className="w-16 h-16 rounded-[24px] bg-white text-slate-900 flex items-center justify-center text-xl font-black shadow-2xl relative ring-4 ring-white/10 shrink-0">
                    {user.name[0]}
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-[#050706] shadow-2xl">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1 w-full overflow-hidden">
                    <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none text-white break-words">
                      {user.name.toUpperCase()}
                    </h3>
                    <p className="text-slate-500 text-[10px] font-medium italic">{user.role}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[7px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest shadow-inner">{user.wallet.tier.toUpperCase()} TIER</span>
                       <span className={`px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[7px] font-black rounded-lg border border-blue-500/20 uppercase tracking-widest font-mono shadow-inner ${isMining ? 'animate-pulse' : ''}`}>{isMining ? 'SYNCING' : 'ACTIVE'}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowIdentityCard(true)} 
                  className="w-full sm:w-auto px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-3 shrink-0"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                  Steward Dossier
                </button>
             </div>

             <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
                {[
                  { label: 'Treasury', val: totalBalance.toFixed(0), unit: 'SHRD', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'Growth', val: user.metrics.agriculturalCodeU.toFixed(1), unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'Height', val: blockchain.length + 4281, unit: 'BLCK', icon: Activity, col: 'text-amber-500', progress: 100 },
                  { label: 'Health', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-black/60 rounded-[28px] border border-white/5 space-y-2 group/stat hover:border-white/20 transition-all shadow-inner overflow-hidden">
                    <div className="flex items-center gap-2">
                       <stat.icon className={`w-3 h-3 ${stat.col} opacity-40`} />
                       <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest truncate">{stat.label}</p>
                    </div>
                    <p className={`text-xl font-mono font-black text-white tracking-tighter ${stat.col} leading-none truncate`}>
                      {stat.val}<span className="text-[8px] ml-1 opacity-20 font-sans font-medium uppercase">{stat.unit}</span>
                    </p>
                    <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mt-2">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2.5s]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Hub */}
        <div className="xl:col-span-4">
          <div className="glass-card p-6 md:p-8 rounded-[40px] border border-white/5 bg-black/40 h-full flex flex-col justify-between group overflow-hidden relative shadow-2xl min-h-[250px]">
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <BrainCircuit className="w-24 h-24 text-white" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-indigo-600 shadow-2xl flex items-center justify-center border-2 border-white/5 shrink-0">
                      {isMining ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Bot className="w-6 h-6 text-white" />}
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tighter italic leading-none m-0">Oracle <span className="text-indigo-400">Hub</span></h4>
                      <p className="text-[7px] font-mono text-indigo-400 font-bold uppercase mt-1 tracking-widest">{isMining ? 'PROCESSING' : 'Relay_Active'}</p>
                   </div>
                </div>
                <div className="p-4 bg-black/80 rounded-2xl border border-white/10 shadow-inner border-l-4 border-l-indigo-600/50">
                   <p className="text-slate-300 text-xs leading-relaxed italic font-medium">
                     {isMining ? '"Finalizing ledger commit. Quorum confirmed."' : '"Regional m-Constant optimized by 14.2%. Strategic sharding recommended."'}
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence')} className="relative z-10 w-full py-4 agro-gradient rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Zap className="w-4 h-4 fill-current" /> INITIALIZE INGEST
             </button>
          </div>
        </div>
      </div>

      {/* Strategic Path */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2 text-white/80">
             <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic <span className="text-emerald-400">Path</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
           {RECOMMENDATIONS.map((rec) => (
             <div key={rec.id} className="glass-card p-6 md:p-8 rounded-[40px] border border-white/5 bg-black/60 shadow-xl group hover:border-indigo-500/20 transition-all flex flex-col justify-between min-h-[200px]">
                <div className="space-y-3">
                   <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${rec.col} shadow-inner`}>
                         <rec.icon size={16} />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase border tracking-widest ${
                         rec.priority === 'High' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                         rec.priority === 'Critical' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                         'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {rec.priority}
                      </span>
                   </div>
                   <h4 className="text-base font-black text-white uppercase italic tracking-tight leading-tight">{rec.title}</h4>
                   <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{rec.desc}"</p>
                </div>
                <button 
                  onClick={() => onNavigate(rec.target as ViewState)}
                  className="w-full py-3 mt-4 bg-white/5 border border-white/10 rounded-xl text-[7px] font-black uppercase tracking-widest text-slate-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                   Execute Strategy <ArrowRight size={10} />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
