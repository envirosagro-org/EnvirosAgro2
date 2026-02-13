
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
    { id: 'rec-1', title: 'OPTIMIZE M-CONSTANT', priority: 'High', icon: TrendingUp, target: 'intelligence', col: 'text-blue-400', desc: 'Regional stability below 1.42x. Initiate remediation shard.' },
    { id: 'rec-2', title: 'DIVERSIFY CROP DNA', priority: 'Medium', icon: Binary, target: 'biotech_hub', col: 'text-emerald-400', desc: 'Market demand for Bantu Rice surging. Forge new genetic shard.' },
    { id: 'rec-3', title: 'AUDIT FIELD PROOFS', priority: 'Critical', icon: ShieldAlert, target: 'tqm', col: 'text-rose-500', desc: '3 shipments awaiting digital GRN signature.' },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 w-full overflow-x-hidden pb-12 px-2">
      
      {/* Network Pulse Ticker */}
      <div className="glass-card p-1.5 rounded-lg border-emerald-500/20 bg-emerald-500/5 flex items-center overflow-hidden shadow-sm shrink-0">
        <div className="flex items-center gap-1.5 px-2 border-r border-white/10 shrink-0">
           <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
           <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-400 whitespace-nowrap">NETWORK_PULSE</span>
        </div>
        <div className="flex-1 px-3 overflow-hidden">
           <div className="whitespace-nowrap animate-marquee text-[7px] text-emerald-400/80 font-mono font-black uppercase tracking-[0.3em]">
             {isMining ? 'NEURAL_FINALITY_SEQUENCE_ACTIVE • MINING_BLOCK_HASH_COMMIT • ' : ''}
             {blockchain.length > 0 ? `Latest Block: ${blockchain[0].hash.substring(0, 12)}... by ${blockchain[0].validator} • ` : ''}
             REGISTRY SYNCHRONIZED. NO ANOMALIES DETECTED. • {new Date().toISOString().split('T')[0]} • NODE {user.esin} MULTIPLIER ACTIVE • SYCAMORE CONSENSUS ACHIEVED • 
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Main Identity & Metrics */}
        <div className="xl:col-span-8">
          <div className="glass-card p-6 md:p-10 rounded-[32px] md:rounded-[40px] relative overflow-hidden group h-full flex flex-col justify-between shadow-2xl bg-black/40 border border-white/5">
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none group-hover:scale-105 transition-transform duration-[10s]">
                <SycamoreLogo size={300} className="text-white" />
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-6 items-center pb-8 border-b border-white/5 mb-8">
                <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left w-full">
                  <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center text-xl font-black shadow-2xl relative ring-4 ring-white/10 shrink-0">
                    {user.name[0]}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-[#050706] shadow-2xl">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 w-full overflow-hidden">
                    <div className="flex items-center justify-center sm:justify-start gap-3">
                       <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none text-white break-words">
                        {user.name.toUpperCase()}
                      </h3>
                      <div className="px-2 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/30 text-[6px] font-black text-emerald-400 animate-pulse">ACTIVE</div>
                    </div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{user.role}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[6px] font-black rounded border border-emerald-500/20 uppercase tracking-[0.3em] shadow-inner">{user.wallet.tier.toUpperCase()} TIER</span>
                       <span className={`px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[6px] font-black rounded border border-blue-500/20 uppercase tracking-[0.3em] font-mono shadow-inner ${isMining ? 'animate-pulse' : ''}`}>{isMining ? 'SYNCING' : 'NODE_SYNCED'}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => onNavigate('profile', 'dossier')} 
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[7px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all shadow-xl flex items-center justify-center gap-2 shrink-0"
                >
                  <Fingerprint className="w-3 h-3 text-emerald-400" />
                  STEWARD DOSSIER
                </button>
             </div>

             <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'TREASURY', val: totalBalance.toFixed(0), unit: 'SHRD', icon: Coins, col: 'text-emerald-400', progress: 85 },
                  { label: 'GROWTH', val: user.metrics.agriculturalCodeU.toFixed(1), unit: 'C(a)', icon: Binary, col: 'text-blue-400', progress: 62 },
                  { label: 'HEIGHT', val: blockchain.length + 4281, unit: 'BLCK', icon: Activity, col: 'text-amber-500', progress: 100 },
                  { label: 'HEALTH', val: user.metrics.sustainabilityScore, unit: '%', icon: Sprout, col: 'text-emerald-500', progress: user.metrics.sustainabilityScore },
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-black/60 rounded-[24px] border border-white/5 space-y-2 group/stat hover:border-white/20 transition-all shadow-inner overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                       <stat.icon className={`w-2.5 h-2.5 ${stat.col} opacity-40`} />
                       <p className="text-[7px] text-slate-700 font-black uppercase tracking-[0.3em] truncate">{stat.label}</p>
                    </div>
                    <p className={`text-2xl font-mono font-black text-white tracking-tighter ${stat.col} leading-none truncate`}>
                      {stat.val}<span className="text-[8px] ml-1 opacity-20 font-sans font-medium uppercase">{stat.unit}</span>
                    </p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-3">
                       <div className={`h-full ${stat.col.replace('text', 'bg')} transition-all duration-[2.5s]`} style={{ width: `${stat.progress}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Oracle Hub */}
        <div className="xl:col-span-4">
          <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/5 bg-black/40 h-full flex flex-col justify-between group overflow-hidden relative shadow-2xl min-h-[250px]">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <BrainCircuit className="w-32 h-32 text-white" />
             </div>
             <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-2xl flex items-center justify-center border border-white/5 shrink-0">
                      {isMining ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Bot className="w-5 h-5 text-white" />}
                   </div>
                   <div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic leading-none m-0">ORACLE <span className="text-indigo-400">HUB</span></h4>
                      <p className="text-[7px] font-mono text-indigo-400/60 font-bold uppercase mt-1 tracking-widest leading-none">{isMining ? 'PROCESSING' : 'RELAY_ACTIVE'}</p>
                   </div>
                </div>
                <div className="p-4 bg-black/80 rounded-2xl border border-white/5 shadow-inner border-l-4 border-l-indigo-600/50">
                   <p className="text-slate-300 text-[11px] leading-relaxed italic font-medium">
                     {isMining ? '"Finalizing ledger commit. Quorum confirmed."' : '"Regional m-Constant optimized by 14.2%. Strategic sharding recommended."'}
                   </p>
                </div>
             </div>
             <button onClick={() => onNavigate('intelligence', 'eos_ai')} className="relative z-10 w-full py-4 agro-gradient rounded-2xl text-white font-black text-[9px] uppercase tracking-[0.3em] shadow-xl mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                <Zap className="w-3.5 h-3.5 fill-current" /> INITIALIZE INGEST
             </button>
          </div>
        </div>
      </div>

      {/* Strategic Path */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-2 text-slate-500">
             <Target className="w-4 h-4 text-emerald-400" /> STRATEGIC <span className="text-emerald-400">PATH</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
           {RECOMMENDATIONS.map((rec) => (
             <div key={rec.id} className="glass-card p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 bg-black/60 shadow-xl group hover:border-indigo-500/20 transition-all flex flex-col justify-between min-h-[180px]">
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${rec.col} shadow-inner group-hover:scale-110 transition-transform`}>
                         <rec.icon size={16} />
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[6px] font-black uppercase border tracking-[0.2em] ${
                         rec.priority === 'High' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 
                         rec.priority === 'Critical' ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 animate-pulse' : 
                         'bg-emerald-600/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {rec.priority}
                      </span>
                   </div>
                   <h4 className="text-sm font-black text-white uppercase italic tracking-widest leading-none m-0">{rec.title}</h4>
                   <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{rec.desc}"</p>
                </div>
                <button 
                  onClick={() => onNavigate(rec.target as ViewState)}
                  className="w-full py-2.5 mt-4 bg-white/5 border border-white/10 rounded-xl text-[7px] font-black uppercase tracking-[0.3em] text-slate-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                   EXECUTE STRATEGY <ArrowRight size={10} />
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
