import React, { useState, useEffect } from 'react';
import { 
  Landmark, TrendingUp, ShieldCheck, Handshake, PieChart as PieChartIcon, BarChart3, Search, Filter, ArrowUpRight, Zap, Clock, Globe, CheckCircle2, X, Loader2, Lock, Gem, AlertCircle, ChevronRight, ChevronLeft, Target, LineChart as LineChartIcon, Wallet, Bot, Sparkles, Database, ArrowRight, TrendingDown, Activity, Layers, ArrowDownUp, Cpu, Coins, Share2, FileCheck, ShieldAlert, Sprout,
  RefreshCcw,
  Users
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { User, AgroProject } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
  projects: AgroProject[];
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

const InvestorPortal: React.FC<InvestorPortalProps> = ({ user, onUpdate, projects }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<AgroProject | null>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'form' | 'analysis' | 'signing' | 'success'>('form');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);

  const [isHarvesting, setIsHarvesting] = useState<string | null>(null);

  const [isForecasting, setIsForecasting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.thrust.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVouchRequest = async (project: AgroProject) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    const prompt = `Act as an EnvirosAgro Institutional Risk Analyst. Analyze this project for an investor: ${JSON.stringify(project)}. Provide a brief 2-paragraph summary on its EAC yield potential and SEHTI framework alignment. Mention the profit-sharing model.`;
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
    setVouchStep('signing');
    setTimeout(() => {
      setVouchStep('success');
      const amount = Number(vouchAmount);
      onUpdate({
        ...user,
        wallet: {
          ...user.wallet,
          balance: user.wallet.balance - amount,
          lifetimeEarned: user.wallet.lifetimeEarned + (amount * 0.05)
        }
      });
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Capital <span className="text-blue-400">Commander</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">Manage ROI releases and EAC deployments across the EOS industrial grid.</p>
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

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-1">
        <div className="flex gap-4 p-1 glass-card rounded-[24px] w-fit border border-white/5">
          {[
            { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
            { id: 'portfolio', label: 'ROI Harvest', icon: PieChartIcon },
            { id: 'analytics', label: 'Yield Analytics', icon: BarChart3 },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'opportunities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredProjects.map(opp => (
            <div key={opp.id} className="glass-card rounded-[44px] p-10 group border border-white/5 hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden active:scale-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-400">
                  {opp.thrust} Thrust
                </span>
                <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tighter">{opp.id}</span>
              </div>
              <h4 className="text-3xl font-black text-white mb-3 leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">{opp.name}</h4>
              
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
                      <div className="h-full bg-indigo-500" style={{ width: `${opp.performanceIndex}%` }}></div>
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
                  <div key={proj.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20">
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-5 rounded-[24px] bg-white/5 group-hover:bg-emerald-500/10 transition-colors shadow-xl">
                           <TrendingUp className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="text-right">
                           <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded tracking-widest border border-emerald-500/20">Active Yield</span>
                           <p className="text-[10px] text-slate-600 font-mono mt-2 font-black uppercase tracking-widest">{proj.id}</p>
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
              {projects.filter(p => p.status === 'Execution').length === 0 && (
                <div className="col-span-full py-20 text-center space-y-6 opacity-30">
                   <Activity className="w-16 h-16 mx-auto text-slate-500 animate-pulse" />
                   <div className="space-y-2">
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">No Active Deployments</h4>
                      <p className="text-sm text-slate-500 italic max-w-xs mx-auto">Vouch for execution-ready node projects to begin earning dividends.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-white/5 space-y-10 relative overflow-hidden bg-black/40">
                 <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Yield <span className="text-emerald-400">Velocity</span></h3>
                 </div>
                 <div className="h-[350px] w-full relative z-10 min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                       <AreaChart data={ANALYTICS_TREND_DATA}>
                          <defs>
                             <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #10b98122', borderRadius: '24px' }} />
                          <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorYield)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="glass-card p-12 rounded-[56px] border-white/5 flex flex-col items-center bg-black/40">
                 <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic w-full mb-10">Sector <span className="text-blue-400">Alpha</span></h3>
                 <div className="h-[280px] w-full relative min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                       <PieChart>
                          <Pie data={THRUST_YIELD_ALLOCATION} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                             {THRUST_YIELD_ALLOCATION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      )}

      {isVouching && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[44px] border-blue-500/20 overflow-hidden shadow-[0_0_80px_#3b82f622]">
              <div className="bg-[#050706] p-12 space-y-10 min-h-[550px] flex flex-col justify-center">
                 <button onClick={() => setIsVouching(false)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all">
                   <X className="w-8 h-8" />
                 </button>
                 {vouchStep === 'analysis' && (
                   <div className="space-y-10 animate-in zoom-in duration-300">
                      {aiOpinion ? (
                        <div className="space-y-10">
                          <button onClick={() => setAiOpinion(null)} className="flex items-center gap-2 mb-4 p-2 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all group/back">
                            <ChevronLeft className="w-4 h-4" /> Back
                          </button>
                          <div className="p-10 bg-blue-950/10 border-l-4 border-blue-500/40 rounded-3xl text-slate-300 italic leading-loose">
                            {aiOpinion}
                          </div>
                          <button onClick={() => setVouchStep('form')} className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl">Continue</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-12 space-y-10">
                           <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                           <p className="text-slate-500 text-sm font-black uppercase animate-pulse">Running SEHTI Vetting Protocols...</p>
                        </div>
                      )}
                   </div>
                 )}
                 {vouchStep === 'form' && selectedProject && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <div className="text-center">
                         <h3 className="text-4xl font-black text-white uppercase italic">Commit <span className="text-blue-400">Capital</span></h3>
                         <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest">Project: {selectedProject.name}</p>
                      </div>
                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-center space-y-2">
                         <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Locked Shard Credit</p>
                         <p className="text-2xl font-mono font-black text-white">{selectedProject.collateralLocked.toLocaleString()} EAC (50%)</p>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 text-center block">Institutional Vouch (EAC)</label>
                         <input type="number" value={vouchAmount} onChange={e => setVouchAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[48px] py-16 text-7xl font-mono text-white text-center outline-none focus:ring-4 focus:ring-blue-500/20 transition-all" />
                      </div>
                      <button onClick={executeVouch} className="w-full py-8 bg-blue-600 rounded-[32px] text-white font-black text-sm uppercase shadow-2xl hover:scale-[1.02] transition-all">Execute Digital Vouch</button>
                   </div>
                 )}
                 {vouchStep === 'signing' && (
                   <div className="flex flex-col items-center justify-center space-y-12 py-12 animate-in zoom-in duration-500 text-center">
                     <div className="relative">
                        <div className="w-48 h-48 rounded-full border-4 border-blue-500/10 flex items-center justify-center">
                           <Handshake className="w-20 h-20 text-blue-400 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 border-t-8 border-blue-500 rounded-full animate-spin"></div>
                     </div>
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">Blockchain Settlement</h3>
                   </div>
                 )}
                 {vouchStep === 'success' && (
                   <div className="flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl scale-110">
                         <CheckCircle2 className="w-20 h-20 text-white" />
                      </div>
                      <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Vouch Complete</h3>
                      <button onClick={() => setIsVouching(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase hover:bg-white/10 transition-all">Return</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InvestorPortal;