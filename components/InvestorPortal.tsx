import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  Handshake, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Zap, 
  Clock, 
  Globe, 
  CheckCircle2, 
  X, 
  Loader2,
  Lock,
  Gem,
  AlertCircle,
  ChevronRight,
  Target,
  LineChart as LineChartIcon,
  Wallet,
  Bot,
  Sparkles,
  Database,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  ArrowDownUp,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
}

const GLOBAL_PROJECT_REGISTRY = [
  { id: 'PRJ-NE-291', name: "Bantu Regenerative Cluster", zone: "Nebraska, US", thrust: "Societal", goal: 500000, funded: 320000, risk: "Low", resilience: "94%", tags: ["Ancestral", "Scalable"], description: "Scaling ancient Bantu irrigation techniques using IoT telemetry." },
  { id: 'PRJ-KE-104', name: "Arid-Zone Moisture Ingest", zone: "Nairobi, KE", thrust: "Technological", goal: 1200000, funded: 150000, risk: "Medium", resilience: "88%", tags: ["IoT", "Water"], description: "Deploying 10,000 moisture sensors across semi-arid smallholdings." },
  { id: 'PRJ-ES-004', name: "Mediterranean Permaculture Society", zone: "Valencia, ES", thrust: "Environmental", goal: 250000, funded: 210000, risk: "Low", resilience: "91%", tags: ["Guilds", "Policy"], description: "A cooperative effort to restore soil biome in coastal vineyards." },
  { id: 'PRJ-BR-092', name: "Amazonia Bio-Registry", zone: "Manaus, BR", thrust: "Informational", goal: 800000, funded: 55000, risk: "High", resilience: "97%", tags: ["Genetics", "Immutable"], description: "Mapping native plant genetics onto the EOS blockchain ledger." },
];

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

const InvestorPortal: React.FC<InvestorPortalProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'form' | 'analysis' | 'signing' | 'success'>('form');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);

  // Analytics Specific States
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecastReport, setForecastReport] = useState<string | null>(null);

  const handleVouchRequest = async (project: any) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    
    const prompt = `Act as an EnvirosAgro Institutional Risk Analyst. Analyze this project for an investor: ${JSON.stringify(project)}. Provide a brief 2-paragraph summary on its EAC yield potential and SEHTI framework alignment.`;
    const response = await chatWithAgroExpert(prompt, []);
    setAiOpinion(response.text);
  };

  const handleRunForecast = async () => {
    setIsForecasting(true);
    const prompt = "Act as the EnvirosAgro Yield Oracle. Based on the current Five Thrusts™ global market data, generate a predictive analytics report for the next 4 quarters. Include expected EAC appreciation, regional high-yield clusters, and risk mitigation strategies for institutional stewards.";
    const response = await chatWithAgroExpert(prompt, []);
    setForecastReport(response.text);
    setIsForecasting(false);
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
      {/* Institutional Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-10 rounded-[40px] border-blue-500/20 bg-blue-500/5 col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-80 h-80 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-tight">Capital <span className="text-blue-400">Commander</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">Your EAC deployments secure the SEHTI pillars across 12 global agricultural zones.</p>
           </div>
           <div className="relative z-10 flex items-center gap-12 mt-10 pt-8 border-t border-white/5">
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Portfolio TVL</p>
                 <h4 className="text-3xl font-mono font-black text-white">42,500 <span className="text-xs text-blue-500">EAC</span></h4>
              </div>
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Realized Yield</p>
                 <h4 className="text-3xl font-mono font-black text-emerald-400">+12.4%</h4>
              </div>
              <button onClick={() => setActiveTab('portfolio')} className="ml-auto p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all shadow-xl group/btn">
                 <ArrowUpRight className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[40px] space-y-6 flex flex-col justify-center text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2 shadow-2xl group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-emerald-400" />
           </div>
           <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">Active Vouch</h3>
              <p className="text-5xl font-black text-white font-mono mt-2">08 <span className="text-sm text-slate-500 uppercase tracking-tighter">NODES</span></p>
           </div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">3 In Vetting Cycle</p>
        </div>

        <div className="glass-card p-10 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-6">
           <LineChartIcon className="w-14 h-14 text-indigo-400 animate-pulse" />
           <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Market Influence</p>
              <h3 className="text-5xl font-black text-white italic tracking-tighter">Top 5%</h3>
           </div>
           <div className="flex gap-2">
              {[0,1,2,3,4].map(i => <div key={i} className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>)}
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 p-1.5 glass-card rounded-[24px] w-fit border border-white/5">
        {[
          { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
          { id: 'portfolio', label: 'Asset Manager', icon: PieChartIcon },
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

      {activeTab === 'opportunities' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input type="text" placeholder="Search project ID or zone..." className="w-full bg-black/60 border border-white/10 rounded-[32px] py-5 pl-16 pr-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-sm placeholder:text-slate-700" />
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 glass-card rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 hover:bg-white/5 transition-all"><Filter className="w-4 h-4" /> Global Filter</button>
              <button className="px-10 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all">Download Prospectus</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {GLOBAL_PROJECT_REGISTRY.map(opp => (
              <div key={opp.id} className="glass-card rounded-[44px] p-10 group border border-white/5 hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden active:scale-95 duration-200">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                   <Target className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-400">
                    {opp.zone}
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tighter">{opp.id}</span>
                </div>
                
                <h4 className="text-3xl font-black text-white mb-3 leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">{opp.name}</h4>
                <div className="flex gap-2 mb-8">
                  {opp.tags.map(t => <span key={t} className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">#{t}</span>)}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed mb-10 flex-1 italic opacity-70 group-hover:opacity-100 transition-opacity">"{opp.description}"</p>

                <div className="space-y-6 mb-10">
                   <div className="flex justify-between items-center py-4 border-b border-white/5">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resilience Predictor</span>
                      <span className="text-sm font-mono font-black text-emerald-400">{opp.resilience}</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-600">Funded Pool</span>
                         <span className="text-blue-400">{((opp.funded / opp.goal) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] transition-all duration-1000" style={{ width: `${(opp.funded / opp.goal) * 100}%` }}></div>
                      </div>
                      <p className="text-[9px] text-center text-slate-700 font-mono">{opp.funded.toLocaleString()} / {opp.goal.toLocaleString()} EAC</p>
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
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-16 rounded-[56px] border-blue-500/20 bg-blue-500/5 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:rotate-6 transition-transform">
                 <PieChartIcon className="w-[600px] h-[600px] text-blue-400" />
              </div>
              
              <div className="w-80 h-80 shrink-0 relative flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-[32px] border-white/5 shadow-inner"></div>
                 <div className="absolute inset-0 rounded-full border-[32px] border-blue-500 border-t-transparent border-l-transparent transform rotate-[45deg] shadow-[0_0_30px_#3b82f644]"></div>
                 <div className="absolute inset-0 rounded-full border-[32px] border-emerald-400 border-b-transparent border-r-transparent transform rotate-[-15deg] shadow-[0_0_30px_#10b98144]"></div>
                 <div className="absolute inset-0 rounded-full border-[32px] border-rose-500 border-t-transparent border-r-transparent transform rotate-[180deg] opacity-40"></div>
                 <div className="flex flex-col items-center relative z-10">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Deployed</p>
                    <h4 className="text-6xl font-black text-white font-mono tracking-tighter">100%</h4>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase mt-4 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active Yielding
                    </span>
                 </div>
              </div>

              <div className="flex-1 space-y-12 relative z-10 w-full">
                 <div>
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Asset <span className="text-blue-400">Distribution</span></h3>
                    <p className="text-slate-400 mt-4 text-xl leading-relaxed max-w-2xl font-medium">Your node capital is currently securing the primary scientific thrusts of the EnvirosAgro ecosystem.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { thrust: 'Technological', share: 45, col: 'bg-blue-500', desc: 'IoT sensor arrays and drone spectral monitoring networks.' },
                      { thrust: 'Societal', share: 30, col: 'bg-rose-500', desc: 'Community heritage hubs and smallholder education.' },
                      { thrust: 'Environmental', share: 15, col: 'bg-emerald-400', desc: 'Carbon credit minting and soil biome restoration.' },
                      { thrust: 'Industry', share: 10, col: 'bg-purple-500', desc: 'Industrial data registries and supply chain shards.' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-6 group cursor-pointer hover:-translate-y-1 transition-transform">
                         <div className={`w-1.5 h-16 ${item.col} rounded-full opacity-30 group-hover:opacity-100 transition-opacity shadow-lg shadow-current`}></div>
                         <div className="flex-1">
                            <div className="flex justify-between items-center w-full mb-2">
                               <p className="text-lg font-black text-white uppercase tracking-tight">{item.thrust}</p>
                               <span className="text-sm font-mono font-bold text-slate-500">{item.share}%</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed italic">"{item.desc}"</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="flex flex-wrap gap-6 pt-6">
                    <button className="flex-1 min-w-[240px] py-6 bg-white/5 border border-white/10 rounded-[32px] text-xs font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 group">
                       <Database className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" /> Export Audit Shard
                    </button>
                    <button className="flex-1 min-w-[240px] py-6 agro-gradient rounded-[32px] text-xs font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                       <ArrowDownUp className="w-5 h-5" /> Rebalance Capital
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Yield Velocity Chart */}
              <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-white/5 space-y-10 relative overflow-hidden bg-black/40">
                 <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                          <LineChartIcon className="w-8 h-8 text-emerald-400" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Yield <span className="text-emerald-400">Velocity</span></h3>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Real-time EAC Accrual Index</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Avg Net ROI</p>
                          <p className="text-2xl font-mono font-black text-emerald-400">+15.82%</p>
                       </div>
                       <div className="h-10 w-[1px] bg-white/10"></div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Market Beta</p>
                          <p className="text-2xl font-mono font-black text-blue-400">0.94</p>
                       </div>
                    </div>
                 </div>

                 <div className="h-[350px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={ANALYTICS_TREND_DATA}>
                          <defs>
                             <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} unit="%" />
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '16px' }}
                             itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorYield)" />
                          <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" strokeDasharray="5 5" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="flex justify-between items-center pt-6 border-t border-white/5 relative z-10">
                    <div className="flex gap-8">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-emerald-500 rounded-full"></div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Steward Yield</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-1 bg-blue-500 rounded-full opacity-50"></div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Volume</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-mono text-slate-700 tracking-tighter">DATA_SYNC_ID: 0x882_YLD_PULSE</p>
                 </div>
              </div>

              {/* Sector Performance Pie */}
              <div className="glass-card p-12 rounded-[56px] border-white/5 flex flex-col items-center bg-black/40">
                 <div className="w-full flex justify-between items-center mb-10">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter italic">Sector <span className="text-blue-400">Alpha</span></h3>
                    <PieChartIcon className="w-6 h-6 text-blue-400" />
                 </div>
                 <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={THRUST_YIELD_ALLOCATION}
                             cx="50%"
                             cy="50%"
                             innerRadius={80}
                             outerRadius={110}
                             paddingAngle={8}
                             dataKey="value"
                             stroke="none"
                          >
                             {THRUST_YIELD_ALLOCATION.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Top Thrust</p>
                       <p className="text-2xl font-black text-white">Societal</p>
                    </div>
                 </div>
                 <div className="w-full space-y-4 mt-10">
                    {THRUST_YIELD_ALLOCATION.map(item => (
                       <div key={item.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-white">{item.value}%</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Regional Heatmap Simulation */}
              <div className="lg:col-span-1 glass-card p-10 rounded-[48px] border-white/5 space-y-8 bg-black/40">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                       <Globe className="w-6 h-6 text-blue-400" /> Regional Hotspots
                    </h3>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div className="space-y-6">
                    {[
                      { zone: 'Nebraska (Zone 4)', roi: '+18.2%', status: 'HIGH_DEMAND', col: 'text-emerald-400' },
                      { zone: 'Nairobi (Zone 2)', roi: '+14.5%', status: 'SCALING', col: 'text-blue-400' },
                      { zone: 'Valencia (Zone 1)', roi: '+9.8%', status: 'STABLE', col: 'text-indigo-400' },
                      { zone: 'Amazonas (Zone 5)', roi: '+22.4%', status: 'CRITICAL_DATA', col: 'text-rose-400' },
                    ].map((loc, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] group hover:bg-white/[0.05] transition-all cursor-pointer">
                         <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-bold text-white">{loc.zone}</p>
                            <span className={`text-lg font-mono font-black ${loc.col}`}>{loc.roi}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${loc.col.replace('text-', 'bg-')}`}></div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{loc.status}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Yield Oracle Prediction Engine */}
              <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-900/5 flex flex-col relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform">
                    <Sparkles className="w-[400px] h-[400px] text-indigo-400" />
                 </div>
                 
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
                       <div className="w-16 h-16 rounded-[28px] bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-950/40">
                          <Bot className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">Predictive <span className="text-indigo-400">Oracle</span></h4>
                          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em]">EOS_YIELD_INTEL_G3</span>
                       </div>
                    </div>

                    {!forecastReport && !isForecasting ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 py-10">
                         <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                            <Activity className="w-24 h-24 text-indigo-400 relative z-10 opacity-40" />
                         </div>
                         <div className="max-w-md mx-auto space-y-4">
                            <h4 className="text-2xl font-bold text-white uppercase tracking-widest">Generate Forward Forecast</h4>
                            <p className="text-slate-400 text-lg italic leading-relaxed">
                               "Invoke the Gemini oracle to synthesize global telemetry shards and historical registry yields for institutional strategy."
                            </p>
                         </div>
                         <button 
                           onClick={handleRunForecast}
                           className="px-16 py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                         >
                            <Zap className="w-6 h-6 fill-current" /> Initialize Yield Sweep
                         </button>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-10 flex flex-col overflow-hidden animate-in fade-in duration-700">
                         <div className="flex-1 overflow-y-auto custom-scrollbar pr-6">
                           {isForecasting ? (
                             <div className="flex flex-col items-center justify-center h-full space-y-8">
                                <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
                                <div className="text-center space-y-2">
                                   <p className="text-emerald-400 font-black text-sm uppercase tracking-[0.4em] animate-pulse">Aggregating Global Yield Shards...</p>
                                   <p className="text-slate-600 font-mono text-[10px]">Processing block 8,821,942 to 8,824,000</p>
                                </div>
                             </div>
                           ) : (
                             <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg italic leading-loose whitespace-pre-line border-l-4 border-indigo-500/20 pl-10 py-4">
                                {forecastReport}
                             </div>
                           )}
                         </div>
                         
                         <div className="flex gap-4 pt-6 border-t border-white/5">
                            <button 
                              onClick={() => setForecastReport(null)}
                              className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                            >
                               Reset Forecast
                            </button>
                            <button className="flex-1 py-5 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3">
                               <CheckCircle2 className="w-4 h-4" /> Download Institutional PDF
                            </button>
                         </div>
                      </div>
                    )}
                    
                    <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-[0.6em]">
                       <span>Status</span>
                       <span className="text-emerald-400 animate-pulse">ORACLE_LINK_OPTIMAL</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Vouch Modal */}
      {isVouching && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[44px] border-blue-500/20 overflow-hidden shadow-[0_0_80px_#3b82f622]">
              <div className="bg-[#050706] p-12 space-y-10 min-h-[550px] flex flex-col">
                 <button onClick={() => setIsVouching(false)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-all">
                   <X className="w-8 h-8" />
                 </button>

                 {vouchStep === 'analysis' && (
                   <div className="space-y-10 animate-in zoom-in duration-300 flex-1">
                      <div className="flex items-center gap-8 border-b border-white/5 pb-10">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-[32px] flex items-center justify-center border border-blue-500/20 shadow-2xl shrink-0">
                           <Zap className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Node Evaluation</h3>
                          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                             Registry Prospectus: {selectedProject?.id}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-10">
                         {aiOpinion ? (
                           <div className="space-y-10 animate-in fade-in duration-500">
                             <div className="p-10 bg-blue-950/10 border-l-4 border-blue-500/40 rounded-3xl space-y-6">
                               <div className="flex items-center gap-3 text-blue-400 font-black uppercase text-[10px] tracking-[0.4em]">
                                 <Bot className="w-5 h-5" /> Institutional Opinion
                               </div>
                               <div className="prose prose-invert prose-blue max-w-none text-slate-300 text-lg italic leading-loose">
                                 {aiOpinion}
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 glass-card rounded-3xl border-white/5 space-y-2 group hover:bg-white/5 transition-all">
                                   <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Project Integrity</p>
                                   <p className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">VERIFIED_98</p>
                                </div>
                                <div className="p-8 glass-card rounded-3xl border-white/5 space-y-2 group hover:bg-white/5 transition-all">
                                   <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Estimated APY</p>
                                   <p className="text-3xl font-mono font-black text-blue-400 tracking-tighter">14.2% Fixed</p>
                                </div>
                             </div>
                             <button 
                              onClick={() => setVouchStep('form')}
                              className="w-full py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                               Continue to Commitment
                             </button>
                           </div>
                         ) : (
                           <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-10">
                              <div className="relative">
                                 <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                                 <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Bot className="w-10 h-10 text-blue-400 animate-pulse" />
                                 </div>
                              </div>
                              <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em] animate-pulse">Running SEHTI Vetting Protocols...</p>
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {vouchStep === 'form' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1">
                      <div className="text-center space-y-4">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Commit <span className="text-blue-400">Capital</span></h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">Securing liquidity for the {selectedProject?.name} protocol.</p>
                      </div>

                      <div className="space-y-10 py-6">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Vouch Amount (EAC)</label>
                            <div className="relative">
                               <input 
                                 type="number"
                                 value={vouchAmount}
                                 onChange={e => setVouchAmount(e.target.value)}
                                 className="w-full bg-black/60 border border-white/10 rounded-[48px] py-16 px-10 text-7xl font-mono text-white focus:outline-none focus:ring-8 focus:ring-blue-500/10 text-center tracking-tighter" 
                               />
                               <div className="absolute right-10 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-2xl">EAC</div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                               {['1000', '5000', '10000', '25000'].map(val => (
                                 <button key={val} onClick={() => setVouchAmount(val)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${vouchAmount === val ? 'bg-blue-600 border-white text-white shadow-xl scale-105' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}>{val}</button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="p-10 bg-blue-500/5 border border-blue-500/10 rounded-[48px] flex items-center gap-10">
                         <div className="w-16 h-16 bg-blue-500/20 rounded-[28px] flex items-center justify-center text-blue-400 shrink-0">
                            <Lock className="w-8 h-8" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-lg font-black text-white uppercase tracking-widest leading-none mb-2">Smart Escrow Locked</h4>
                            <p className="text-xs text-slate-500 leading-relaxed italic">"Your funds will be locked for a 3-month vesting period to ensure project stability and m™ Constant health."</p>
                         </div>
                      </div>

                      <button 
                        onClick={executeVouch}
                        className="w-full py-8 bg-blue-600 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                         <ShieldCheck className="w-6 h-6" /> Execute Digital Vouch
                      </button>
                   </div>
                 )}

                 {vouchStep === 'signing' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12 animate-in zoom-in duration-500 text-center">
                     <div className="relative">
                        <div className="w-48 h-48 rounded-full border-4 border-blue-500/10 flex items-center justify-center">
                           <Handshake className="w-20 h-20 text-blue-400 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 border-t-8 border-blue-500 rounded-full animate-spin"></div>
                     </div>
                     <div className="space-y-6">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Blockchain Settlement</h3>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-xs mx-auto">Authorizing multi-sig allocation from ESIN <span className="text-blue-400 font-mono">{user.esin}</span></p>
                        <div className="flex justify-center gap-3">
                           {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                        </div>
                     </div>
                   </div>
                 )}

                 {vouchStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                      <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                         <CheckCircle2 className="w-20 h-20 text-white" />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Vouch Complete</h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Liquidity Successfully Synchronized // Shard 0x882</p>
                      </div>
                      <div className="w-full glass-card p-12 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-6 text-left">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Transaction Hash</span>
                            <span className="text-emerald-400 font-mono font-bold">0x{Math.random().toString(16).slice(2, 14)}...</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase tracking-widest">Steward Standing</span>
                            <span className="text-white font-black uppercase bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/20">UPGRADED</span>
                         </div>
                      </div>
                      <button onClick={() => setIsVouching(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all">Return to Command Center</button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default InvestorPortal;