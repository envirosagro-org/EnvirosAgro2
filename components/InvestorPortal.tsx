
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
  HardHat
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
  }, [pendingAction]);

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Investor Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Capital <span className="text-blue-400">Commander</span></h2>
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

        <div className="glass-card p-10 rounded-[40px] space-y-6 flex flex-col justify-center text-center relative overflow-hidden group">
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

        <div className="glass-card p-10 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-6">
           <LineChartIcon className="w-14 h-14 text-indigo-400 animate-pulse" />
           <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Market Influence</p>
              <h3 className="text-5xl font-black text-white italic tracking-tighter">Master</h3>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit border border-white/5 bg-black/40">
        {[
          { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
          { id: 'portfolio', label: 'ROI Harvest', icon: PieChartIcon },
          { id: 'analytics', label: 'Yield Analytics', icon: BarChart3 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'opportunities' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div className="flex justify-between items-center px-4 border-b border-white/5 pb-6">
             <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Vetting <span className="text-blue-400">Registry</span></h3>
                <p className="text-slate-500 text-sm">Validated mission nodes awaiting capital sharding.</p>
             </div>
             <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter nodes..." 
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProjects.map(opp => (
              <div key={opp.id} className="glass-card rounded-[44px] p-10 group border border-white/5 hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden active:scale-[0.98] duration-200">
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-400">
                    {opp.thrust} Thrust
                  </span>
                  <div className="flex items-center gap-2">
                     {opp.isPreAudited && (
                        <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/40" title="Pre-Funding Audit Verified">
                           <BadgeCheck size={14} />
                        </div>
                     )}
                     <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tighter">{opp.id}</span>
                  </div>
                </div>
                <h4 className="text-3xl font-black text-white mb-3 leading-tight tracking-tighter group-hover:text-blue-400 transition-colors italic">{opp.name}</h4>
                
                <div className="flex items-center gap-2 mb-6">
                   <Users className="w-3.5 h-3.5 text-blue-400" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Founding Nodes: <span className="text-white font-mono">{opp.memberCount}</span></span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1 italic opacity-70">"{opp.description}"</p>
                
                <div className="space-y-6 mb-8">
                  <div className="p-4 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center">
                     <div>
                        <p className="text-[8px] text-slate-500 font-black uppercase">ROI Ratio</p>
                        <p className="text-lg font-mono font-black text-emerald-400">{(opp.investorShareRatio * 100).toFixed(0)}%</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-black uppercase">Est. Annual</p>
                        <p className="text-lg font-mono font-black text-white">+{opp.roiEstimate}%</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                        <span>Performance Index</span>
                        <span className="text-white">{opp.performanceIndex}%</span>
                     </div>
                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${opp.performanceIndex}%` }}></div>
                     </div>
                  </div>
                </div>

                <button 
                  onClick={() => handleVouchRequest(opp)}
                  className="w-full py-6 bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <ShieldCheck className="w-5 h-5" /> Vouch Node
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
              <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">ROI <span className="text-emerald-400">Harvesting Ledger</span></h3>
                 <p className="text-slate-500 text-sm font-medium">Claim claimable EAC dividends from your active project deployments.</p>
              </div>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <RefreshCcw className="w-4 h-4" /> Sync Shard Profits
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.filter(p => p.status === 'Execution').map(proj => {
                 const claimable = proj.profitsAccrued * proj.investorShareRatio;
                 return (
                  <div key={proj.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-5 rounded-[24px] bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-xl">
                           <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                           <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded tracking-widest border border-emerald-500/20">Active Yield</span>
                           <div className="flex gap-1.5">
                              {proj.isPreAudited && <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/40" title="Pre-Funding Audited"><BadgeCheck size={10} /></div>}
                              {proj.isPostAudited && <div className="p-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/40" title="Post-Acquisition Audited"><ShieldCheck size={10} /></div>}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex-1 space-y-6 relative z-10">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight italic group-hover:text-emerald-400 transition-colors m-0">{proj.name}</h4>
                        
                        <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-6">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                              <span className="text-slate-500">Project Profits</span>
                              <span className="text-white font-mono">{proj.profitsAccrued.toLocaleString()} EAC</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2 pb-6 border-b border-white/5">
                              <span className="text-slate-500">Investor Share ({(proj.investorShareRatio * 100).toFixed(0)}%)</span>
                              <span className="text-emerald-400 font-mono text-lg">{claimable.toLocaleString()} EAC</span>
                           </div>
                           <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.2em] px-2 pt-2">
                              <span className="text-slate-300">Claimable Dividends</span>
                              <span className="text-3xl font-mono font-black text-emerald-400">
                                 {claimable.toFixed(0)} <span className="text-xs">EAC</span>
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 mt-4 border-t border-white/5 relative z-10">
                        <button 
                          onClick={() => handleHarvestROI(proj)}
                          disabled={claimable <= 0 || isHarvesting === proj.id}
                          className={`w-full py-6 rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl ${
                            claimable > 0 
                             ? 'agro-gradient text-white shadow-emerald-900/40 hover:scale-105 active:scale-95' 
                             : 'bg-white/5 text-slate-700 border border-white/10 cursor-not-allowed'
                          }`}
                        >
                           {isHarvesting === proj.id ? (
                             <>
                               <Loader2 className="w-5 h-5 animate-spin" />
                               <span>MINTING ROI SHARDS...</span>
                             </>
                           ) : (
                             <>
                               <Sprout className="w-5 h-5" />
                               <span>HARVEST DIVIDENDS</span>
                             </>
                           )}
                        </button>
                     </div>
                  </div>
                 );
              })}
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-12 animate-in zoom-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Trend Chart */}
            <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none"></div>
              <div className="flex justify-between items-center relative z-10 mb-12 px-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-xl">
                    <BarChart4 className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Yield <span className="text-blue-400">Projections</span></h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Rolling network performance telemetry</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Global APY Index</p>
                  <p className="text-4xl font-mono font-black text-emerald-400">18.4<span className="text-xl">%</span></p>
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
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }} />
                    <Area type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorYield)" />
                    <Area type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Target className="w-64 h-64 text-white" /></div>
               <h4 className="text-xl font-bold text-white uppercase tracking-widest italic mb-10 relative z-10 flex items-center gap-3">
                  <PieChartIcon className="w-5 h-5 text-indigo-400" /> Capital <span className="text-indigo-400">Diffusion</span>
               </h4>
               <div className="h-64 w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={THRUST_YIELD_ALLOCATION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {THRUST_YIELD_ALLOCATION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-10 grid grid-cols-2 gap-4 w-full relative z-10">
                  {THRUST_YIELD_ALLOCATION.map(t => (
                    <div key={t.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-500 uppercase">{t.name}</span>
                          <span className="text-xs font-mono font-bold text-white">{t.value}%</span>
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
               <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 flex items-center gap-8 group hover:bg-white/[0.02] transition-all shadow-xl">
                  <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                     <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                     <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                     <p className="text-2xl font-mono font-black text-white">{stat.val}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Vouch Modal */}
      {isVouching && selectedProject && (
        <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-blue-500/20 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col min-h-[600px]">
              
              <div className="p-12 border-b border-white/5 bg-blue-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-900/40">
                       <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Vouch <span className="text-blue-400">Mission Node</span></h3>
                       <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-2">PROTOCOL: EA_VETTING_v4 // {selectedProject.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsVouching(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
                 {vouchStep === 'analysis' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/10 relative overflow-hidden border-l-4 border-l-blue-500/50">
                          <div className="flex items-center gap-3 mb-6">
                             <Bot className="w-6 h-6 text-blue-400" />
                             <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Institutional Analysis</h4>
                          </div>
                          {!aiOpinion ? (
                             <div className="flex flex-col items-center py-10 gap-6">
                                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                                <p className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse italic">Synthesizing Risk Shards...</p>
                             </div>
                          ) : (
                             <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line font-medium border-l-2 border-white/5 pl-8">
                                {aiOpinion}
                             </div>
                          )}
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between px-6">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capital Vouch Amount</label>
                             <span className="text-xl font-mono font-black text-blue-400">{Number(vouchAmount).toLocaleString()} EAC</span>
                          </div>
                          <input 
                            type="range" min="1000" max="100000" step="1000" value={vouchAmount} 
                            onChange={e => setVouchAmount(e.target.value)}
                            className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" 
                          />
                       </div>

                       <button 
                        onClick={() => setVouchStep('physical_proof')}
                        disabled={!aiOpinion}
                        className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                       >
                          Verify Physical Proof <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {vouchStep === 'physical_proof' && (
                   <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative">
                           <ClipboardCheck className="w-12 h-12 text-emerald-400" />
                           <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[32px] animate-ping"></div>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Physical <span className="text-emerald-400">Authenticity Proof</span></h4>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm mx-auto italic">
                           This mission node has been 100% physically verified by the EnvirosAgro Audit Team.
                        </p>
                      </div>

                      <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6">
                        <div className="flex justify-between items-center px-4 border-b border-white/5 pb-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Audit ID</span>
                           <span className="text-xs font-mono text-emerald-400 font-black">EA_AUD_#{(Math.random()*1000).toFixed(0)}_SEC</span>
                        </div>
                        <div className="flex justify-between items-center px-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Verification Date</span>
                           <span className="text-xs font-mono text-white">2024.12.12</span>
                        </div>
                        <div className="flex justify-between items-center px-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Biometric Sync</span>
                           <span className="text-xs font-mono text-emerald-400 font-black">MATCH_OK</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                         <button onClick={() => setVouchStep('analysis')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                         <button 
                            onClick={() => setVouchStep('signing')}
                            className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                         >
                            <ShieldCheck className="w-6 h-6" /> Proceed to Signing
                         </button>
                      </div>
                   </div>
                 )}

                 {vouchStep === 'signing' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl">
                             <Fingerprint className="w-12 h-12 text-blue-400" />
                          </div>
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Cryptographic <span className="text-blue-400">Anchor</span></h4>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Enter your ESIN signature to commit capital to the industrial registry.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-8">Signature Authority (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase" 
                          />
                       </div>

                       <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[40px] flex items-center gap-8">
                          <ShieldAlert className="w-12 h-12 text-amber-500 shrink-0" />
                          <p className="text-xs text-amber-200/50 font-black uppercase tracking-tight leading-relaxed">
                             ESCROW_LOCK: Vouching commits {vouchAmount} EAC to the mission pool. Capital will be locked until the first batch settlement trigger.
                          </p>
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setVouchStep('physical_proof')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                            onClick={executeVouch}
                            disabled={!esinSign}
                            className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                          >
                             <Key className="w-6 h-6 fill-current" /> Commit Vouch Shard
                          </button>
                       </div>
                    </div>
                 )}

                 {vouchStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Vouch <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] font-mono">Registry Hash: 0x882_VOUCH_{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                       </div>
                       <div className="w-full glass-card p-12 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-6 text-left relative overflow-hidden shadow-xl">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Activity className="w-40 h-40 text-emerald-400" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Committed Capital</span>
                             <span className="text-white font-mono font-black text-3xl text-emerald-400">-{vouchAmount} EAC</span>
                          </div>
                          <div className="flex justify-between items-center text-xs relative z-10">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Reputation Gained</span>
                             <span className="text-blue-400 font-mono font-black text-3xl">+{Math.floor(Number(vouchAmount) * 0.05)} PTS</span>
                          </div>
                       </div>
                       <button onClick={() => setIsVouching(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry</button>
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
      `}</style>
    </div>
  );
};

export default InvestorPortal;
