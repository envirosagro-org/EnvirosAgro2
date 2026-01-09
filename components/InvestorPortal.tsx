
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
  ChevronLeft,
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
  Cpu,
  Coins
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
  Cell
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
        </div>
      </div>

      <div className="flex gap-4 p-1 glass-card rounded-[24px] w-fit border border-white/5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {GLOBAL_PROJECT_REGISTRY.map(opp => (
            <div key={opp.id} className="glass-card rounded-[44px] p-10 group border border-white/5 hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden active:scale-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black uppercase rounded-full tracking-widest border border-white/10 text-slate-400">
                  {opp.zone}
                </span>
                <span className="text-[10px] font-mono text-blue-400 font-bold tracking-tighter">{opp.id}</span>
              </div>
              <h4 className="text-3xl font-black text-white mb-3 leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">{opp.name}</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-10 flex-1 italic opacity-70 group-hover:opacity-100 transition-opacity">"{opp.description}"</p>
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
        <div className="glass-card p-16 rounded-[56px] border-blue-500/20 bg-blue-500/5 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
           <div className="flex-1 space-y-12 relative z-10 w-full">
              <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">Asset <span className="text-blue-400">Distribution</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {[
                   { thrust: 'Technological', share: 45, col: 'bg-blue-500', desc: 'IoT arrays and spectral monitoring.' },
                   { thrust: 'Societal', share: 30, col: 'bg-rose-500', desc: 'Community heritage hubs.' },
                   { thrust: 'Environmental', share: 15, col: 'bg-emerald-400', desc: 'Carbon credit minting.' },
                   { thrust: 'Industry', share: 10, col: 'bg-purple-500', desc: 'Industrial data registries.' },
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-6 group cursor-pointer hover:-translate-y-1 transition-transform">
                      <div className={`w-1.5 h-16 ${item.col} rounded-full`}></div>
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
                 {vouchStep === 'form' && (
                   <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                      <h3 className="text-4xl font-black text-white uppercase text-center italic">Commit <span className="text-blue-400">Capital</span></h3>
                      <input type="number" value={vouchAmount} onChange={e => setVouchAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[48px] py-16 text-7xl font-mono text-white text-center outline-none" />
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
