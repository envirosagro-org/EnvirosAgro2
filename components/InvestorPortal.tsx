import React, { useState, useEffect } from 'react';
import { 
  Landmark, TrendingUp, ShieldCheck, Handshake, PieChart as PieChartIcon, BarChart3, Search, Filter, ArrowUpRight, Zap, Clock, Globe, CheckCircle2, X, Loader2, Lock, Gem, AlertCircle, ChevronRight, ChevronLeft, Target, LineChart as LineChartIcon, Wallet, Bot, Sparkles, Database, ArrowRight, TrendingDown, Activity, Layers, ArrowDownUp, Cpu, Coins, Share2, FileCheck, ShieldAlert, Sprout,
  RefreshCcw,
  Users,
  BadgeCheck,
  Star,
  Fingerprint,
  Key,
  Download,
  BarChart4,
  Info,
  ExternalLink,
  ClipboardCheck,
  HardHat,
  Smartphone,
  Eye,
  MessageSquare,
  // Fix: added Binary icon to resolve "Cannot find name 'Binary'" error on line 359
  Binary
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { User, AgroProject } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
  projects: AgroProject[];
  pendingAction?: string | null;
  clearAction?: () => void;
}

const ANALYTICS_TREND_DATA = [
  { time: 'T-12', yield: 8.4, volume: 1200 },
  { time: 'T-10', yield: 9.2, volume: 1500 },
  { time: 'T-08', yield: 11.5, volume: 2200 },
  { time: 'T-06', yield: 10.8, volume: 2800 },
  { time: 'T-04', yield: 12.4, volume: 3500 },
  { time: 'T-02', yield: 14.1, volume: 4100 },
  { time: 'NOW', yield: 15.8, volume: 4800 },
];

const THRUST_YIELD_ALLOCATION = [
  { name: 'Societal', value: 35, color: '#f43f5e' },
  { name: 'Environmental', value: 25, color: '#10b981' },
  { name: 'Human', value: 15, color: '#14b8a6' },
  { name: 'Technological', value: 20, color: '#3b82f6' },
  { name: 'Industry', value: 5, color: '#8b5cf6' },
];

const RECENT_ACTIVITY_SHARDS = [
  { id: 'ACT-001', type: 'VOUCH', node: 'Node_Paris_04', amount: '2,500 EAC', time: '2m ago', col: 'text-emerald-400' },
  { id: 'ACT-002', type: 'MINT', node: 'Stwd_Nairobi', amount: '1.42 EAT', time: '12m ago', col: 'text-yellow-500' },
  { id: 'ACT-003', type: 'HARVEST', node: 'Global_Alpha', amount: '842 EAC', time: '45m ago', col: 'text-blue-400' },
  { id: 'ACT-004', type: 'REQUISITION', node: 'Neo_Harvest', amount: '12,000 EAC', time: '1h ago', col: 'text-rose-400' },
  { id: 'ACT-005', type: 'SWAP', node: 'Silicon_Soil', amount: '42.5 EAT', time: '3h ago', col: 'text-indigo-400' },
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ user, onUpdate, projects, pendingAction, clearAction }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<AgroProject | null>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'analysis' | 'physical_proof' | 'signing' | 'success'>('analysis');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [esinSign, setEsinSign] = useState('');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [isHarvesting, setIsHarvesting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle deep-linking from Dashboard
  useEffect(() => {
    if (pendingAction === 'OPEN_VOUCH') {
      setActiveTab('opportunities');
      if (projects.length > 0) handleVouchRequest(projects[0]);
      clearAction?.();
    } else if (pendingAction === 'VIEW_ANALYTICS') {
      setActiveTab('analytics');
      clearAction?.();
    }
  }, [pendingAction, projects, clearAction]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.thrust.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVouchRequest = async (project: AgroProject) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    setAiOpinion(null);
    const prompt = `Act as an EnvirosAgro Institutional Risk Analyst. Analyze this project for an investor: ${JSON.stringify(project)}. Provide a brief 2-paragraph summary on its EAC yield potential and SEHTI framework alignment. Focus on investor security and risk shards. Mention the importance of physical verification.`;
    const response = await chatWithAgroExpert(prompt, []);
    setAiOpinion(response.text);
  };

  const handleHarvestROI = (project: AgroProject) => {
    const claimable = project.profitsAccrued * project.investorShareRatio;
    if (claimable <= 0) return;

    setIsHarvesting(project.id);
    setTimeout(() => {
      onUpdate({
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance + claimable,
          lifetimeEarned: user.wallet.lifetimeEarned + claimable
        }
      });
      alert(`ROI HARVESTED: +${claimable.toFixed(0)} EAC released to your treasury node.`);
      setIsHarvesting(null);
    }, 2500);
  };

  const executeVouch = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN verification failed.");
      return;
    }
    const amount = Number(vouchAmount);
    if (user.wallet.balance < amount) {
      alert("LIQUIDITY ERROR: Insufficient EAC in treasury.");
      return;
    }

    setVouchStep('signing');
    setTimeout(() => {
      setVouchStep('success');
      onUpdate({
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance - amount,
          lifetimeEarned: user.wallet.lifetimeEarned + (amount * 0.05) // Earn reputation for vouching
        }
      });
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* 1. Global Activity Shards - New Horizontal Scroll Section */}
      <div className="px-4">
        <div className="glass-card p-4 rounded-3xl border-blue-500/20 bg-blue-500/5 flex items-center overflow-hidden shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
          <div className="flex items-center gap-3 shrink-0 px-6 border-r border-white/5 relative z-10">
            <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">LIVE_ACTIVITY_SHARDS</span>
          </div>
          <div className="flex-1 px-6 overflow-hidden relative z-10">
            <div className="flex gap-12 animate-marquee hover:pause-marquee whitespace-nowrap items-center">
              {RECENT_ACTIVITY_SHARDS.concat(RECENT_ACTIVITY_SHARDS).map((shard, idx) => (
                <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full ${shard.col} animate-glow`}></div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                    {shard.type}: {shard.amount} <span className="text-slate-600 font-normal">at</span> {shard.node}
                  </span>
                  <span className="text-[8px] text-slate-700 font-black">{shard.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Investor HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        <div className="glass-card p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Capital <span className="text-blue-400">Commander</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed max-md:text-sm font-medium">Manage ROI releases and EAC deployments across the EOS industrial grid.</p>
           </div>
           <div className="relative z-10 flex items-center gap-12 mt-10 pt-8 border-t border-white/5">
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Portfolio TVL</p>
                 <h4 className="text-3xl font-mono font-black text-white">42,500 <span className="text-xs text-blue-500">EAC</span></h4>
              </div>
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Claimable ROI</p>
                 <h4 className="text-3xl font-mono font-black text-emerald-400">+1,420 <span className="text-xs">EAC</span></h4>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[40px] space-y-6 flex flex-col justify-center text-center relative overflow-hidden group shadow-xl">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-2xl group-hover:scale-110 transition-transform">
              <Activity className="w-10 h-10 text-emerald-400" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Growth Pulse</h3>
              <p className="text-5xl font-black text-white font-mono mt-2">+12.4<span className="text-sm text-slate-500 uppercase tracking-tighter">%</span></p>
           </div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Real-time Yield Metric</p>
        </div>

        <div className="glass-card p-10 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-6 shadow-xl">
           <LineChartIcon className="w-14 h-14 text-indigo-400 animate-pulse" />
           <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Market Influence</p>
              <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Master</h3>
           </div>
        </div>
      </div>

      {/* 3. Section Navigation - Horizontal Scrollable on Mobile */}
      <div className="px-4">
        <div className="flex gap-4 p-1.5 glass-card rounded-[32px] w-full md:w-fit border border-white/5 bg-black/40 overflow-x-auto scrollbar-hide snap-x shadow-xl">
          {[
            { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
            { id: 'portfolio', label: 'ROI Harvest', icon: PieChartIcon },
            { id: 'analytics', label: 'Yield Analytics', icon: BarChart3 },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap snap-start ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tab Views with Card Scrolling */}
      <div className="min-h-[700px]">
        {activeTab === 'opportunities' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-6">
               <div className="w-full">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Vetting <span className="text-blue-400">Registry</span></h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Browse high-integrity mission nodes awaiting capital sharding.</p>
               </div>
               <div className="relative group w-full md:w-[450px] shrink-0">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Filter by title, node ID or thrust..." 
                    className="w-full bg-black/60 border border-white/10 rounded-[28px] py-5 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-mono"
                  />
               </div>
            </div>

            <div className="relative">
               {/* Main Card Scroll Area */}
               <div className="flex gap-8 overflow-x-auto scrollbar-hide px-8 pb-14 snap-x snap-mandatory pt-2">
                  {filteredProjects.length === 0 ? (
                    <div className="w-full py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-30 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                        <Gem size={80} className="text-slate-600 animate-pulse" />
                        <div className="space-y-2">
                          <p className="text-2xl font-black uppercase tracking-[0.4em]">No Registry Shards Found</p>
                          <p className="text-sm italic">"Try adjusting your filters or node designation search."</p>
                        </div>
                    </div>
                  ) : (
                    filteredProjects.map(opp => (
                      <div key={opp.id} className="min-w-[340px] md:min-w-[450px] glass-card rounded-[64px] p-12 group border-2 border-white/5 hover:border-blue-500/40 transition-all flex flex-col relative overflow-hidden active:scale-[0.98] duration-300 snap-center shadow-3xl bg-black/40">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><Target className="w-64 h-64" /></div>
                        
                        <div className="flex items-center justify-between mb-10 relative z-10">
                          <span className="px-5 py-2 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">
                            {opp.thrust} Thrust
                          </span>
                          <div className="flex items-center gap-3">
                             {opp.isPreAudited && (
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shadow-xl" title="Pre-Funding Audit Verified">
                                   <BadgeCheck size={18} />
                                </div>
                             )}
                             <span className="text-[11px] font-mono text-blue-400 font-black tracking-tighter uppercase">{opp.id}</span>
                          </div>
                        </div>

                        <div className="flex-1 relative z-10 space-y-6">
                           <h4 className="text-4xl font-black text-white leading-tight tracking-tighter group-hover:text-blue-400 transition-colors italic uppercase m-0">{opp.name}</h4>
                           <div className="flex items-center gap-3">
                              <Users className="w-4 h-4 text-indigo-400" />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Founders: <span className="text-white font-mono text-sm">{opp.memberCount}</span></span>
                           </div>
                           <p className="text-base text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">"{opp.description}"</p>
                        </div>
                        
                        <div className="space-y-8 mt-10 relative z-10">
                          <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 flex justify-between items-center shadow-inner">
                             <div className="space-y-1">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Investor Ratio</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">{(opp.investorShareRatio * 100).toFixed(0)}%</p>
                             </div>
                             <div className="text-right space-y-1">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Exp. APY</p>
                                <p className="text-3xl font-mono font-black text-white">+{opp.roiEstimate}%</p>
                             </div>
                          </div>
                          <div className="space-y-4 px-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <span>Registry Performance Index</span>
                                <span className="text-white font-mono">{opp.performanceIndex}%</span>
                             </div>
                             <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <div className="h-full bg-blue-600 rounded-full shadow-[0_0_20px_#3b82f6] transition-all duration-[2s]" style={{ width: `${opp.performanceIndex}%` }}></div>
                             </div>
                          </div>
                        </div>

                        <div className="mt-12 relative z-10">
                           <button 
                              onClick={() => handleVouchRequest(opp)}
                              className="w-full py-8 bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 rounded-[32px] text-xs font-black uppercase tracking-[0.5em] text-white transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
                           >
                              <ShieldCheck className="w-6 h-6" /> INITIALIZE VOUCH
                           </button>
                        </div>
                      </div>
                    ))
                  )}
               </div>
               {/* Visual Scroll Hints */}
               <div className="absolute top-1/2 left-0 w-32 h-[80%] bg-gradient-to-r from-[#050706] to-transparent pointer-events-none -translate-y-1/2 opacity-80"></div>
               <div className="absolute top-1/2 right-0 w-32 h-[80%] bg-gradient-to-l from-[#050706] to-transparent pointer-events-none -translate-y-1/2 opacity-80"></div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 px-8 gap-6">
                <div className="w-full">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">ROI <span className="text-emerald-400">Harvesting Ledger</span></h3>
                   <p className="text-slate-500 text-sm font-medium mt-2 italic">Claim claimable EAC dividends from your active project deployments.</p>
                </div>
                <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-[24px] text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 shrink-0 hover:text-white hover:bg-white/10 transition-all shadow-xl active:scale-95">
                   <RefreshCcw className="w-4 h-4" /> Sync Shard Profits
                </button>
             </div>

             <div className="relative">
                <div className="flex gap-8 overflow-x-auto scrollbar-hide px-8 pb-14 snap-x snap-mandatory pt-2">
                  {projects.filter(p => p.status === 'Execution').length === 0 ? (
                      <div className="w-full py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                          <PieChartIcon size={80} className="text-slate-600 animate-spin-slow" />
                          <div className="space-y-2">
                             <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active ROI Shards</p>
                             <p className="text-sm italic">"Initialized projects in execution phase will appear here for harvesting."</p>
                          </div>
                      </div>
                  ) : (
                    projects.filter(p => p.status === 'Execution').map(proj => {
                      const claimable = proj.profitsAccrued * proj.investorShareRatio;
                      return (
                        <div key={proj.id} className="min-w-[340px] md:min-w-[450px] glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-emerald-500/40 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/30 shadow-3xl snap-center">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Binary className="w-64 h-64" /></div>
                          
                          <div className="flex justify-between items-start mb-10 relative z-10">
                              <div className="p-6 rounded-[28px] bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-2xl border border-white/10 group-hover:rotate-6 transition-all">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                              </div>
                              <div className="text-right flex flex-col items-end gap-3">
                                <span className={`px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full tracking-[0.3em] border border-emerald-500/20`}>Active Yield Node</span>
                                <div className="flex gap-2">
                                    {proj.isPreAudited && <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-lg" title="Pre-Funding Audited"><BadgeCheck size={14} /></div>}
                                    {proj.isPostAudited && <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/30 shadow-lg" title="Post-Acquisition Audited"><ShieldCheck size={14} /></div>}
                                </div>
                              </div>
                          </div>
                          
                          <div className="flex-1 space-y-6 relative z-10">
                              <h4 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight italic group-hover:text-emerald-400 transition-colors m-0 leading-none">{proj.name}</h4>
                              <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest">Shard Signature: 0x{proj.id.replace('-', '_')}</p>
                              
                              <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-8 shadow-inner">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                    <span className="text-slate-500">Aggregate Profits</span>
                                    <span className="text-white font-mono text-xl">{proj.profitsAccrued.toLocaleString()} EAC</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2 pb-8 border-b border-white/5">
                                    <span className="text-slate-500">Network Share ({(proj.investorShareRatio * 100).toFixed(0)}%)</span>
                                    <span className="text-emerald-400 font-mono text-xl">{claimable.toLocaleString()} EAC</span>
                                </div>
                                <div className="flex justify-between items-center px-2 pt-2">
                                    <div className="space-y-1">
                                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Claimable Shards</p>
                                       <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">
                                          {claimable.toFixed(0)}<span className="text-xl ml-1">EAC</span>
                                       </p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                       <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
                                    </div>
                                </div>
                              </div>
                          </div>

                          <div className="mt-12 relative z-10">
                              <button 
                                onClick={() => handleHarvestROI(proj)}
                                disabled={claimable <= 0 || isHarvesting === proj.id}
                                className={`w-full py-8 rounded-[32px] text-[11px] font-black uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-5 shadow-3xl ${
                                  claimable > 0 
                                  ? 'agro-gradient text-white shadow-emerald-900/40 hover:scale-[1.02] active:scale-95' 
                                  : 'bg-white/5 text-slate-800 border border-white/5 cursor-not-allowed'
                                }`}
                              >
                                {isHarvesting === proj.id ? (
                                  <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>SYNCHRONIZING REWARDS...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sprout className="w-6 h-6" />
                                    <span>HARVEST EAC SHARDS</span>
                                  </>
                                )}
                              </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="absolute top-1/2 left-0 w-32 h-[80%] bg-gradient-to-r from-[#050706] to-transparent pointer-events-none -translate-y-1/2 opacity-80"></div>
                <div className="absolute top-1/2 right-0 w-32 h-[80%] bg-gradient-to-l from-[#050706] to-transparent pointer-events-none -translate-y-1/2 opacity-80"></div>
             </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Trend Chart */}
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 relative overflow-hidden shadow-3xl">
                <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none"></div>
                <div className="flex justify-between items-center relative z-10 mb-12 px-4">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-500/10 rounded-[28px] border border-blue-500/20 shadow-2xl group hover:rotate-6 transition-all">
                      <BarChart4 className="w-10 h-10 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Yield <span className="text-blue-400">Projections</span></h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        Rolling network performance telemetry
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest mb-2">Global APY Index</p>
                    <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">18.4<span className="text-2xl ml-1">%</span></p>
                  </div>
                </div>

                <div className="h-[450px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ANALYTICS_TREND_DATA}>
                      <defs>
                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px' }}
                        itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorYield)" strokeLinecap="round" />
                      <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" strokeDasharray="6 6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Allocation Breakdown */}
              <div className="lg:col-span-4 glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-3xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Target className="w-64 h-64 text-white" /></div>
                 <h4 className="text-2xl font-black text-white uppercase tracking-widest italic mb-12 relative z-10 flex items-center gap-4">
                    <PieChartIcon className="w-7 h-7 text-indigo-400" /> Capital <span className="text-indigo-400">Diffusion</span>
                 </h4>
                 <div className="h-72 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={THRUST_YIELD_ALLOCATION} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                          {THRUST_YIELD_ALLOCATION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-12 grid grid-cols-2 gap-6 w-full relative z-10">
                    {THRUST_YIELD_ALLOCATION.map(t => (
                      <div key={t.name} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 group hover:border-white/20 transition-all">
                         <div className="w-3 h-3 rounded-full shadow-[0_0_10px_current]" style={{ color: t.color, backgroundColor: t.color }}></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">{t.name}</span>
                            <span className="text-lg font-mono font-black text-white">{t.value}%</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { label: 'Network Liquidity', val: '840M EAC', icon: Coins, color: 'text-emerald-400' },
                 { label: 'Active Vouchers', val: '14.2K Nodes', icon: Users, color: 'text-blue-400' },
                 { label: 'Trust Equilibrium', val: '0.942 AR_V', icon: Activity, color: 'text-indigo-400' },
               ].map((stat, i) => (
                 <div key={i} className="glass-card p-10 rounded-[48px] border-2 border-white/5 flex items-center gap-10 group hover:border-white/20 transition-all shadow-2xl bg-black/40">
                    <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all shadow-3xl border border-white/10 group-hover:rotate-6">
                       <stat.icon className={`w-10 h-10 ${stat.color}`} />
                    </div>
                    <div>
                       <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                       <p className="text-4xl font-mono font-black text-white tracking-tighter">{stat.val}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistence Modal - Audit Report UI */}
      {isVouching && selectedProject && (
        <div className="fixed inset-0 z-[510] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-blue-500/20 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col min-h-[650px]">
              
              <div className="p-12 border-b border-white/5 bg-blue-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-900/40">
                       <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0">
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 truncate">Vouch <span className="text-blue-400">Mission Node</span></h3>
                       <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-3 truncate">PROTOCOL: EA_VETTING_v4 // {selectedProject.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsVouching(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
                 {vouchStep === 'analysis' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 relative overflow-hidden border-l-8 border-l-blue-500/50 shadow-inner">
                          <div className="flex items-center gap-4 mb-8">
                             <Bot className="w-8 h-8 text-blue-400" />
                             <h4 className="text-2xl font-black text-white uppercase tracking-widest italic leading-none">Institutional Analysis</h4>
                          </div>
                          {!aiOpinion ? (
                             <div className="flex flex-col items-center py-14 gap-8">
                                <Loader2 className="w-14 h-14 text-blue-400 animate-spin" />
                                <p className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] animate-pulse italic">Synthesizing Risk Shards...</p>
                             </div>
                          ) : (
                             <div className="prose prose-invert max-w-none text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium border-l-2 border-white/5 pl-12">
                                {aiOpinion}
                             </div>
                          )}
                       </div>

                       <div className="space-y-6">
                          <div className="flex justify-between px-8">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Capital Vouch Multiplier</label>
                             <span className="text-3xl font-mono font-black text-blue-400">{Number(vouchAmount).toLocaleString()} <span className="text-xs">EAC</span></span>
                          </div>
                          <input 
                            type="range" min="1000" max="100000" step="1000" value={vouchAmount} 
                            onChange={e => setVouchAmount(e.target.value)}
                            className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" 
                          />
                       </div>

                       <button 
                        onClick={() => setVouchStep('physical_proof')}
                        disabled={!aiOpinion}
                        className="w-full py-10 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                       >
                          Verify Physical Proof <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {vouchStep === 'physical_proof' && (
                   <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                      <div className="space-y-6">
                        <div className="w-32 h-32 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                           <ClipboardCheck className="w-14 h-14 text-emerald-400 group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-[40px] animate-ping opacity-30"></div>
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-emerald-400">Authenticity Proof</span></h4>
                        <p className="text-slate-400 text-xl leading-relaxed max-sm:text-sm max-w-sm mx-auto italic font-medium">
                           This mission node has been 100% physically verified by the EnvirosAgro Audit Team at the specified GPS shard.
                        </p>
                      </div>

                      <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-8 shadow-inner text-left">
                        <div className="flex justify-between items-center px-6 border-b border-white/5 pb-6">
                           <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Audit Shard ID</span>
                           <span className="text-lg font-mono text-emerald-400 font-black">EA_AUD_#{(Math.random()*1000).toFixed(0)}_SEC</span>
                        </div>
                        <div className="flex justify-between items-center px-6">
                           <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Verification Block</span>
                           <span className="text-lg font-mono text-white">2024.12.12 // SYNC_OK</span>
                        </div>
                        <div className="flex justify-between items-center px-6">
                           <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Biometric Anchor</span>
                           <div className="flex items-center gap-3">
                              <span className="text-lg font-mono text-emerald-400 font-black uppercase">MATCH_OK</span>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-6">
                         <button onClick={() => setVouchStep('analysis')} className="px-10 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95">Back</button>
                         <button 
                            onClick={() => setVouchStep('signing')}
                            className="flex-1 py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95"
                         >
                            <ShieldCheck className="w-8 h-8" /> Proceed to Signature
                         </button>
                      </div>
                   </div>
                 )}

                 {vouchStep === 'signing' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-32 h-32 bg-blue-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl group">
                             <Fingerprint className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Cryptographic <span className="text-blue-400">Registry Anchor</span></h4>
                          <p className="text-slate-400 text-xl font-medium leading-relaxed max-md:text-sm max-w-md mx-auto italic">Enter your ESIN signature to commit capital shards to the global grid.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] px-10 block text-center">Node Authority Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.3em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="p-10 bg-amber-500/5 border border-amber-500/10 rounded-[56px] flex items-center gap-10 shadow-inner">
                          <ShieldAlert className="w-14 h-14 text-amber-500 shrink-0" />
                          <p className="text-sm text-amber-200/50 font-black uppercase tracking-widest leading-relaxed">
                             ESCROW_LOCK: Vouching commits {Number(vouchAmount).toLocaleString()} EAC. Assets are frozen until mission batch finalization.
                          </p>
                       </div>

                       <div className="flex gap-6">
                          <button onClick={() => setVouchStep('physical_proof')} className="px-10 py-10 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95">Back</button>
                          <button 
                            onClick={executeVouch}
                            disabled={!esinSign}
                            className="flex-1 py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                          >
                             <Key className="w-8 h-8 fill-current" /> COMMIT VOUCH SHARD
                          </button>
                       </div>
                    </div>
                 )}

                 {vouchStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic">Vouch <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_VOUCH_OK_SYNC</p>
                       </div>
                       <div className="w-full glass-card p-14 rounded-[64px] border-white/5 bg-emerald-500/5 space-y-8 text-left relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Activity className="w-56 h-56 text-emerald-400" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-4">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Committed Capital</span>
                             <span className="text-white font-mono font-black text-4xl text-emerald-400">-{Number(vouchAmount).toLocaleString()} EAC</span>
                          </div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-4 pt-6 border-t border-white/10">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Reputation Gained</span>
                             <span className="text-blue-400 font-mono font-black text-4xl">+{Math.floor(Number(vouchAmount) * 0.05)} PTS</span>
                          </div>
                       </div>
                       <button onClick={() => setIsVouching(false)} className="w-full py-10 bg-white/5 border border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Vetting Registry</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .pause-marquee:hover { animation-play-state: paused; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-glow { animation: glow 2s ease-in-out infinite alternate; }
        @keyframes glow { from { opacity: 0.4; box-shadow: 0 0 5px currentColor; } to { opacity: 1; box-shadow: 0 0 15px currentColor; } }
      `}</style>
    </div>
  );
};

export default InvestorPortal;
