
import React, { useState, useEffect } from 'react';
import { 
  Landmark, TrendingUp, ShieldCheck, PieChart as PieChartIcon, BarChart3, Search, Activity, 
  CheckCircle2, X, Loader2, Gem, ChevronRight, LineChart as LineChartIcon, Bot, Sparkles, 
  Binary, KeyRound, Stamp, Target as TargetIcon, Users, BadgeCheck, Sprout, RefreshCcw, 
  ShieldAlert, Fingerprint, Key, BarChart4, ClipboardCheck, ArrowUpRight, Coins, Wallet
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, AgroProject, ViewState } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  projects: AgroProject[];
  pendingAction?: string | null;
  clearAction?: () => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const ANALYTICS_TREND_DATA = [
  { time: 'T-12', yield: 8.4 }, { time: 'T-10', yield: 9.2 }, { time: 'T-08', yield: 11.5 },
  { time: 'T-06', yield: 10.8 }, { time: 'T-04', yield: 12.4 }, { time: 'T-02', yield: 14.1 },
  { time: 'NOW', yield: 15.8 },
];

const THRUST_YIELD_ALLOCATION = [
  { name: 'Societal', value: 35, color: '#f43f5e' },
  { name: 'Environmental', value: 25, color: '#10b981' },
  { name: 'Human', value: 15, color: '#14b8a6' },
  { name: 'Technological', value: 20, color: '#3b82f6' },
  { name: 'Industry', value: 5, color: '#8b5cf6' },
];

const MOCK_OPPORTUNITIES: Partial<AgroProject>[] = [
  { id: 'OPP-882', name: 'Omaha Western Shard', description: 'Expanding nitrogen sharding capabilities across 500 new hectares of audited no-till land.', thrust: 'Environmental', roiEstimate: 14.2, investorShareRatio: 0.15, memberCount: 12, isPreAudited: true },
  { id: 'OPP-104', name: 'Bantu Seed Vault Node', description: 'Institutional scaling of lineage seed preservation using spectral DNA sharding technology.', thrust: 'Societal', roiEstimate: 18.5, investorShareRatio: 0.25, memberCount: 45, isPreAudited: true },
  { id: 'OPP-042', name: 'Coastal Moisture Relay', description: 'Autonomous aqua-drones for coastal mangrove desalination and carbon sharding.', thrust: 'Technological', roiEstimate: 22.1, investorShareRatio: 0.20, memberCount: 24, isPreAudited: false },
  { id: 'OPP-991', name: 'M-Pesa Gateway Beta', description: 'Secondary financial bridges for decentralized steward payroll nodes.', thrust: 'Industry', roiEstimate: 12.8, investorShareRatio: 0.10, memberCount: 8, isPreAudited: true },
  { id: 'OPP-552', name: 'Altiplano Soil Forge', description: 'Recovering depleted mineral shards in high-altitude agricultural clusters.', thrust: 'Environmental', roiEstimate: 16.4, investorShareRatio: 0.18, memberCount: 15, isPreAudited: true },
  { id: 'OPP-321', name: 'Bio-Resonant Rice Node', description: 'Scaling sonic remediation for bio-electric yield optimization.', thrust: 'Technological', roiEstimate: 24.5, investorShareRatio: 0.30, memberCount: 56, isPreAudited: false },
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ 
  user, onUpdate, onSpendEAC, projects, pendingAction, clearAction, onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<AgroProject | null>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'analysis' | 'physical_proof' | 'signing' | 'success'>('analysis');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [esinSign, setEsinSign] = useState('');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState<string | null>(null);

  const allOpportunities = [...projects, ...MOCK_OPPORTUNITIES.filter(o => !projects.some(p => p.id === o.id))] as AgroProject[];
  const filteredProjects = allOpportunities.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (p.thrust?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleVouchRequest = async (project: AgroProject) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    setAiOpinion(null);
    try {
      const response = await chatWithAgroExpert(`Analyze project ${project.name} for an investor. Focus on EAC potential and SEHTI framework.`, []);
      setAiOpinion(response.text);
    } catch (e) {
      setAiOpinion("Protocol handshake error. Oracle sync timeout.");
    }
  };

  const handleExecuteVouch = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const amount = Number(vouchAmount);
    if (onSpendEAC(amount, `VOUCH_COMMITMENT_${selectedProject?.id}`)) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setVouchStep('success');
      }, 2500);
    }
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
      setIsHarvesting(null);
      alert(`HARVEST SUCCESS: ${claimable.toFixed(0)} EAC dividends anchored to node ${user.esin}.`);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4">
      
      {/* Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-tight m-0">Capital <span className="text-blue-400">Commander</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium italic max-w-md">"Deploying capital shards to scale regenerative m-constant stability and yield."</p>
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

        <div className="glass-card p-10 rounded-[40px] space-y-6 flex flex-col justify-center text-center shadow-xl bg-black/40 relative overflow-hidden group">
           <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-2xl group-hover:scale-110 transition-transform">
              <Activity className="w-10 h-10 text-emerald-400" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest italic">Growth Pulse</h3>
              <p className="text-5xl font-black text-white font-mono mt-2 tracking-tighter">+12.4<span className="text-sm text-slate-500">%</span></p>
           </div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network APY Average</p>
        </div>

        <div className="glass-card p-10 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-6 shadow-xl bg-black/40 relative">
           <LineChartIcon className="w-14 h-14 text-indigo-400 animate-pulse" />
           <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Market Influence</p>
              <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase m-0">Master</h3>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-indigo-500 w-4/5"></div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1.5 glass-card rounded-[32px] w-full md:w-fit border border-white/5 bg-black/40 overflow-x-auto scrollbar-hide shadow-xl">
        {[
          { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
          { id: 'portfolio', label: 'ROI Harvest', icon: PieChartIcon },
          { id: 'analytics', label: 'Yield Analytics', icon: BarChart3 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Viewport */}
      <div className="min-h-[700px]">
        {activeTab === 'opportunities' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="w-full">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Vetting <span className="text-blue-400">Registry</span></h3>
                  <p className="text-slate-500 text-sm mt-2 font-medium italic">"Browse high-integrity mission nodes awaiting capital sharding."</p>
               </div>
               <div className="relative group w-full md:w-[450px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Filter nodes by thrust or ID..." 
                    className="w-full bg-black/60 border border-white/10 rounded-[28px] py-5 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-mono"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProjects.map(opp => (
                  <div key={opp.id} className="glass-card rounded-[64px] p-10 group border-2 border-white/5 hover:border-blue-500/40 transition-all flex flex-col relative overflow-hidden active:scale-[0.98] duration-300 shadow-3xl bg-black/40 min-h-[580px]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><TargetIcon className="w-64 h-64" /></div>
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                      <span className="px-5 py-2 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">
                        {opp.thrust} Thrust
                      </span>
                      {opp.isPreAudited && <BadgeCheck size={24} className="text-emerald-400 drop-shadow-[0_0_10px_#10b981]" />}
                    </div>

                    <div className="flex-1 relative z-10 space-y-6">
                       <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-tight group-hover:text-blue-400 transition-colors">{opp.name}</h4>
                       <p className="text-base text-slate-400 leading-relaxed italic line-clamp-5 opacity-80 group-hover:opacity-100 transition-opacity">"{opp.description}"</p>
                    </div>
                    
                    <div className="space-y-8 mt-10 relative z-10">
                      <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 flex justify-between items-center shadow-inner">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Share</p>
                            <p className="text-3xl font-mono font-black text-emerald-400">{(opp.investorShareRatio * 100).toFixed(0)}%</p>
                         </div>
                         <div className="text-right space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Exp. APY</p>
                            <p className="text-3xl font-mono font-black text-white">+{opp.roiEstimate}%</p>
                         </div>
                      </div>
                    </div>

                    <div className="mt-12 relative z-10">
                       <button 
                          onClick={() => handleVouchRequest(opp as AgroProject)}
                          className="w-full py-8 bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 rounded-[32px] text-xs font-black uppercase tracking-[0.5em] text-white transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
                       >
                          <ShieldCheck className="w-6 h-6" /> INITIALIZE VOUCH
                       </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 px-4 gap-6">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">ROI <span className="text-emerald-400">Harvesting Ledger</span></h3>
                   <p className="text-slate-500 text-sm mt-2 font-medium italic">"Claim accrued EAC dividends from your active mission deployments."</p>
                </div>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 shadow-lg">
                   <RefreshCcw size={14} /> Refresh Node Profits
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.filter(p => p.status === 'Execution').map(proj => {
                  const claimable = proj.profitsAccrued * proj.investorShareRatio;
                  return (
                    <div key={proj.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.98] duration-300">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Binary size={120} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-xl group-hover:rotate-6 transition-all">
                             <TrendingUp size={28} />
                          </div>
                          <div className="text-right">
                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20 tracking-widest">Active Yield</span>
                             <p className="text-[10px] text-slate-600 font-mono mt-3 uppercase tracking-tighter italic">{proj.id}</p>
                          </div>
                       </div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-2xl font-black text-white uppercase italic m-0 leading-tight group-hover:text-emerald-400 transition-colors">{proj.name}</h4>
                          <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-2 text-center shadow-inner">
                             <p className="text-[10px] text-slate-500 uppercase font-black">Claimable Dividends</p>
                             <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">
                                {claimable.toFixed(0)} <span className="text-lg">EAC</span>
                             </p>
                          </div>
                       </div>
                       <button 
                        onClick={() => handleHarvestROI(proj)}
                        disabled={claimable <= 0 || isHarvesting === proj.id}
                        className={`mt-10 w-full py-8 rounded-[32px] text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl transition-all flex items-center justify-center gap-4 ${
                          claimable > 0 ? 'agro-gradient text-white active:scale-95' : 'bg-white/5 text-slate-800 border-white/5 cursor-not-allowed'
                        }`}
                       >
                          {isHarvesting === proj.id ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sprout className="w-6 h-6" />}
                          {isHarvesting === proj.id ? 'SYNCING REWARDS...' : 'HARVEST EAC SHARDS'}
                       </button>
                    </div>
                  );
                })}
                {projects.filter(p => p.status === 'Execution').length === 0 && (
                   <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                      <PieChartIcon size={80} className="text-slate-600 animate-pulse" />
                      <p className="text-2xl font-black uppercase tracking-[0.4em]">No Active ROI Nodes Detected</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 relative overflow-hidden shadow-3xl h-fit min-h-[600px]">
                <div className="flex justify-between items-center mb-16 relative z-10 px-4">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-blue-500/10 rounded-[24px] border border-blue-500/20 shadow-xl">
                      <BarChart4 className="w-10 h-10 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Yield <span className="text-blue-400">Projections</span></h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3">Industrial growth telemetry v4.2</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-2">Global Index</p>
                    <p className="text-7xl font-mono font-black text-emerald-400 tracking-tighter leading-none">18.4<span className="text-2xl ml-1">%</span></p>
                  </div>
                </div>

                <div className="h-[350px] w-full relative z-10">
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
                      <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }} />
                      <Area type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorYield)" strokeLinecap="round" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center justify-center shadow-3xl relative overflow-hidden h-fit min-h-[600px]">
                 <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                 <h4 className="text-2xl font-black text-white uppercase tracking-widest italic mb-12 flex items-center gap-4 relative z-10">
                    <PieChartIcon className="w-8 h-8 text-indigo-400" /> Capital <span className="text-indigo-400">Diffusion</span>
                 </h4>
                 <div className="h-72 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={THRUST_YIELD_ALLOCATION} innerRadius={75} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                          {THRUST_YIELD_ALLOCATION.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '16px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-12 grid grid-cols-2 gap-4 w-full relative z-10">
                    {THRUST_YIELD_ALLOCATION.map(t => (
                      <div key={t.name} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }}></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.name}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vouch Modal */}
      {isVouching && selectedProject && (
        <div className="fixed inset-0 z-[510] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-blue-500/20 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col min-h-[700px]">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-blue-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-blue-900/40">
                       <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="min-w-0">
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 truncate">Vouch <span className="text-blue-400">Mission Node</span></h3>
                       <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-3 truncate">{selectedProject.id} // SECURED_BY_ZK</p>
                    </div>
                 </div>
                 <button onClick={() => setIsVouching(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={28} /></button>
              </div>

              <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar flex flex-col justify-center">
                 {vouchStep === 'analysis' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 relative overflow-hidden border-l-8 border-l-blue-500/50 shadow-inner">
                          <div className="flex items-center gap-4 mb-8">
                             <Bot className="w-8 h-8 text-blue-400" />
                             <h4 className="text-2xl font-black text-white uppercase tracking-widest italic leading-none">Institutional Analysis</h4>
                          </div>
                          {!aiOpinion ? (
                             <div className="flex flex-col items-center py-20 gap-8 text-center">
                                <Loader2 className="w-14 h-14 text-blue-400 animate-spin" />
                                <p className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] animate-pulse italic">Synthesizing Risk Shards...</p>
                             </div>
                          ) : (
                             <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line font-medium border-l border-white/5 pl-10">
                                {aiOpinion}
                             </div>
                          )}
                       </div>

                       <div className="space-y-6">
                          <div className="flex justify-between px-8">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Commitment Shard (EAC)</label>
                             <span className="text-4xl font-mono font-black text-blue-400">{Number(vouchAmount).toLocaleString()}</span>
                          </div>
                          <input 
                            type="range" min="1000" max="100000" step="1000" value={vouchAmount} 
                            onChange={e => setVouchAmount(e.target.value)}
                            className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" 
                          />
                       </div>

                       <button 
                        onClick={() => setVouchStep('physical_proof')}
                        disabled={!aiOpinion}
                        className="w-full py-10 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                       >
                          Verify Physical Proof <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {vouchStep === 'physical_proof' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                       <div className="space-y-6">
                          <div className="w-32 h-32 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative">
                             <ClipboardCheck className="w-14 h-14 text-emerald-400" />
                             <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-[40px] animate-ping opacity-30"></div>
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Physical <span className="text-emerald-400">Verification</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic max-w-sm mx-auto leading-relaxed">
                            "This mission node has been 100% physically verified by the EnvirosAgro Field Audit team. Registry integrity confirmed."
                          </p>
                       </div>
                       <button onClick={() => setVouchStep('signing')} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">Proceed to Signature</button>
                    </div>
                 )}

                 {vouchStep === 'signing' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-32 h-32 bg-blue-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl group">
                             <Fingerprint className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Cryptographic <span className="text-blue-400">Anchor</span></h4>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] px-10 block text-center">Node Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <button 
                         onClick={handleExecuteVouch}
                         disabled={!esinSign || isProcessing}
                         className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                       >
                          {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Key className="w-8 h-8 fill-current" />}
                          {isProcessing ? "MINTING SHARD..." : "COMMIT VOUCH SHARD"}
                       </button>
                    </div>
                 )}

                 {vouchStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Vouch <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_VOUCH_OK_SYNC</p>
                       </div>
                       <button onClick={() => setIsVouching(false)} className="w-full py-10 bg-white/5 border border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry</button>
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
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default InvestorPortal;
