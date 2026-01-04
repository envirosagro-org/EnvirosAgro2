
import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  Handshake, 
  PieChart, 
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
  LineChart,
  Wallet,
  /* Added missing Bot icon */
  Bot
} from 'lucide-react';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
}

// Mock Registry of Community Projects awaiting funding
const GLOBAL_PROJECT_REGISTRY = [
  { id: 'PRJ-NE-291', name: "Bantu Regenerative Cluster", zone: "Nebraska, US", thrust: "Societal", goal: 500000, funded: 320000, risk: "Low", resilience: "94%", tags: ["Ancestral", "Scalable"], description: "Scaling ancient Bantu irrigation techniques using IoT telemetry." },
  { id: 'PRJ-KE-104', name: "Arid-Zone Moisture Ingest", zone: "Nairobi, KE", thrust: "Technological", goal: 1200000, funded: 150000, risk: "Medium", resilience: "88%", tags: ["IoT", "Water"], description: "Deploying 10,000 moisture sensors across semi-arid smallholdings." },
  { id: 'PRJ-ES-004', name: "Mediterranean Permaculture Society", zone: "Valencia, ES", thrust: "Environmental", goal: 250000, funded: 210000, risk: "Low", resilience: "91%", tags: ["Guilds", "Policy"], description: "A cooperative effort to restore soil biome in coastal vineyards." },
  { id: 'PRJ-BR-092', name: "Amazonia Bio-Registry", zone: "Manaus, BR", thrust: "Informational", goal: 800000, funded: 55000, risk: "High", resilience: "97%", tags: ["Genetics", "Immutable"], description: "Mapping native plant genetics onto the EOS blockchain ledger." },
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ user, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'form' | 'analysis' | 'signing' | 'success'>('form');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);

  const handleVouchRequest = async (project: any) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    
    // Use Gemini to analyze the project for the investor
    const prompt = `Act as an EnvirosAgro Institutional Risk Analyst. Analyze this project for an investor: ${JSON.stringify(project)}. Provide a brief 2-paragraph summary on its EAC yield potential and SEHTI framework alignment.`;
    const response = await chatWithAgroExpert(prompt, []);
    setAiOpinion(response.text);
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
          lifetimeEarned: user.wallet.lifetimeEarned + (amount * 0.05) // Referral/Staking bonus simulation
        }
      });
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Institutional Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-card p-8 rounded-[40px] border-blue-500/20 bg-blue-500/5 col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
              <Landmark className="w-64 h-64 text-blue-400" />
           </div>
           <div className="relative z-10 space-y-4">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded tracking-widest border border-blue-500/20">Institutional Node</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Capital <span className="text-blue-400">Commander</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">Your EAC deployments secure the SEHTI pillars across 12 global agricultural zones.</p>
           </div>
           <div className="relative z-10 flex items-center gap-12 mt-10 pt-8 border-t border-white/5">
              <div>
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Portfolio TVL</p>
                 <h4 className="text-2xl font-mono font-black text-white">42,500 <span className="text-xs text-blue-500">EAC</span></h4>
              </div>
              <div>
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Realized Yield</p>
                 <h4 className="text-2xl font-mono font-black text-emerald-400">+12.4%</h4>
              </div>
              <button onClick={() => setActiveTab('portfolio')} className="ml-auto p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all">
                 <ArrowUpRight className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[40px] space-y-4 flex flex-col justify-center text-center">
           <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
              <Zap className="w-8 h-8 text-emerald-400" />
           </div>
           <h3 className="text-xl font-bold text-white uppercase tracking-widest">Active Vouch</h3>
           <p className="text-3xl font-black text-white font-mono">08 <span className="text-xs text-slate-500">NODES</span></p>
           <p className="text-[10px] text-slate-600 font-bold uppercase">3 In Vetting Cycle</p>
        </div>

        <div className="glass-card p-8 rounded-[40px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-4">
           <LineChart className="w-10 h-10 text-indigo-400" />
           <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Market Influence</p>
           <h3 className="text-4xl font-black text-white italic">Top 5%</h3>
           <div className="flex gap-1">
              {[0,1,2,3,4].map(i => <div key={i} className="w-1 h-3 bg-emerald-500 rounded-full"></div>)}
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'opportunities', label: 'Vetting Registry', icon: Gem },
          { id: 'portfolio', label: 'Asset Manager', icon: PieChart },
          { id: 'analytics', label: 'Yield Analytics', icon: BarChart3 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'opportunities' && (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input type="text" placeholder="Search project ID or zone..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm" />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 glass-card rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:bg-white/5 transition-all"><Filter className="w-4 h-4" /> Global Filter</button>
              <button className="px-8 py-3 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all">Download Prospectus</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {GLOBAL_PROJECT_REGISTRY.map(opp => (
              <div key={opp.id} className="glass-card rounded-[40px] p-8 group border border-white/5 hover:border-blue-500/30 transition-all flex flex-col relative overflow-hidden active:scale-95 duration-200">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Target className="w-24 h-24 text-white" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-white/5 text-[9px] font-black uppercase rounded tracking-widest border border-white/10 text-slate-400">
                    {opp.zone}
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 font-bold">{opp.id}</span>
                </div>
                
                <h4 className="text-2xl font-black text-white mb-2 leading-tight tracking-tighter group-hover:text-blue-400 transition-colors">{opp.name}</h4>
                <div className="flex gap-2 mb-6">
                  {opp.tags.map(t => <span key={t} className="text-[8px] font-black uppercase tracking-tighter text-slate-500 bg-white/5 px-2 py-0.5 rounded">#{t}</span>)}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-8 flex-1 italic line-clamp-2">"{opp.description}"</p>

                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Resilience Predictor</span>
                      <span className="text-xs font-bold text-emerald-400">{opp.resilience}</span>
                   </div>
                   <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-slate-500">Capital Pool</span>
                         <span className="text-blue-400">{opp.funded.toLocaleString()} / {opp.goal.toLocaleString()} EAC</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(opp.funded / opp.goal) * 100}%` }}></div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => handleVouchRequest(opp)}
                  className="w-full py-5 bg-white/5 border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 rounded-3xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl flex items-center justify-center gap-2"
                >
                   <ShieldCheck className="w-4 h-4" /> Vouch Capital
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           <div className="glass-card p-12 rounded-[48px] border-blue-500/20 bg-blue-500/5 flex flex-col lg:row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <PieChart className="w-80 h-80 text-blue-400" />
              </div>
              
              <div className="w-64 h-64 shrink-0 relative flex items-center justify-center">
                 <div className="absolute inset-0 rounded-full border-[20px] border-white/5"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-blue-500 border-t-transparent border-l-transparent transform rotate-[45deg]"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-emerald-400 border-b-transparent border-r-transparent transform rotate-[-15deg]"></div>
                 <div className="absolute inset-0 rounded-full border-[20px] border-amber-400 border-t-transparent border-r-transparent transform rotate-[180deg] opacity-40"></div>
                 <div className="flex flex-col items-center">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Assets</p>
                    <h4 className="text-4xl font-black text-white">100%</h4>
                 </div>
              </div>

              <div className="flex-1 space-y-10 relative z-10 w-full">
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Diversification <span className="text-blue-400">Log</span></h3>
                    <p className="text-slate-400 mt-2 text-lg">Your capital is securing multiple scientific thrusts of the EOS Framework.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { thrust: 'Technological', share: 45, col: 'bg-blue-500', desc: 'IoT arrays and drone monitoring networks.' },
                      { thrust: 'Societal', share: 30, col: 'bg-emerald-400', desc: 'Community hubs and heritage farming education.' },
                      { thrust: 'Environmental', share: 15, col: 'bg-amber-400', desc: 'Carbon credit minting and soil restoration.' },
                      { thrust: 'Informational', share: 10, col: 'bg-indigo-400', desc: 'Data registries and supply chain blockchain nodes.' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                         <div className={`w-1 h-12 ${item.col} rounded-full opacity-40 group-hover:opacity-100 transition-opacity`}></div>
                         <div>
                            <div className="flex justify-between items-center w-full mb-1">
                               <p className="text-sm font-bold text-white uppercase">{item.thrust}</p>
                               <span className="text-xs font-mono text-slate-500">{item.share}%</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="flex gap-4">
                    <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                       Export Audit Trail
                    </button>
                    <button className="flex-1 py-5 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl shadow-emerald-900/40 hover:scale-[1.02] transition-all">
                       Rebalance Portfolio
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Vouch Modal */}
      {isVouching && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[44px] border-blue-500/20 overflow-hidden">
              <div className="bg-[#050706] p-12 space-y-8 min-h-[550px] flex flex-col">
                 <button onClick={() => setIsVouching(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                 </button>

                 {vouchStep === 'analysis' && (
                   <div className="space-y-8 animate-in zoom-in duration-300 flex-1">
                      <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-[28px] flex items-center justify-center border border-blue-500/20 shadow-2xl">
                           <Zap className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Node Evaluation</h3>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Reviewing Prospectus: {selectedProject?.id}</p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-6">
                         {aiOpinion ? (
                           <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                               <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                 <AlertCircle className="w-4 h-4" /> AI Analyst Opinion
                               </div>
                               <div className="prose prose-invert prose-blue max-w-none text-slate-300 text-sm italic leading-relaxed">
                                 {aiOpinion}
                               </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 glass-card rounded-2xl border-white/5">
                                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Project Integrity</p>
                                   <p className="text-lg font-mono font-bold text-emerald-400">VERIFIED_98</p>
                                </div>
                                <div className="p-5 glass-card rounded-2xl border-white/5">
                                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Est. APY</p>
                                   <p className="text-lg font-mono font-bold text-blue-400">14.2% Fixed</p>
                                </div>
                             </div>
                             <button 
                              onClick={() => setVouchStep('form')}
                              className="w-full py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                               Continue to Commitment
                             </button>
                           </div>
                         ) : (
                           <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-6">
                              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] animate-pulse">Running SEHTI Vetting Protocols...</p>
                           </div>
                         )}
                      </div>
                   </div>
                 )}

                 {vouchStep === 'form' && (
                   <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 flex-1">
                      <div className="text-center space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Commit Capital</h3>
                        <p className="text-slate-500 text-sm font-medium">Securing liquidity for {selectedProject?.name}</p>
                      </div>

                      <div className="space-y-6 py-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Vouch Amount (EAC)</label>
                            <input 
                              type="number"
                              value={vouchAmount}
                              onChange={e => setVouchAmount(e.target.value)}
                              className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 px-10 text-6xl font-mono text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-center" 
                            />
                            <div className="flex justify-center gap-4 mt-4">
                               {['1000', '5000', '10000', '25000'].map(val => (
                                 <button key={val} onClick={() => setVouchAmount(val)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vouchAmount === val ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{val}</button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-6">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                            <Lock className="w-6 h-6" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-xs font-bold text-white">Smart Escrow Initialized</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">Your funds will be locked for a 3-month vesting period to ensure project stability.</p>
                         </div>
                      </div>

                      <button 
                        onClick={executeVouch}
                        className="w-full py-6 bg-blue-600 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         <ShieldCheck className="w-5 h-5" /> Execute Digital Vouch
                      </button>
                   </div>
                 )}

                 {vouchStep === 'signing' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12 animate-in zoom-in duration-500 text-center">
                     <div className="relative">
                        <div className="w-40 h-40 rounded-full border-4 border-blue-500/10 flex items-center justify-center">
                           <Handshake className="w-16 h-16 text-blue-400 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Blockchain Settlement</h3>
                        <p className="text-slate-500 text-sm font-medium">Authorizing multi-sig allocation from ESIN {user.esin}</p>
                        <div className="flex justify-center gap-2">
                           {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                        </div>
                     </div>
                   </div>
                 )}

                 {vouchStep === 'success' && (
                   <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-6 animate-in zoom-in duration-700 text-center">
                      <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 scale-110">
                         <CheckCircle2 className="w-16 h-16 text-white" />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Vouch Complete</h3>
                         <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Liquidity Successfully Synchronized</p>
                      </div>
                      <div className="w-full glass-card p-10 rounded-[48px] border-white/5 bg-emerald-500/5 space-y-4">
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Transaction Hash</span>
                            <span className="text-emerald-400 font-mono text-[11px]">0x{Math.random().toString(16).slice(2, 14)}...</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-black uppercase">Steward Standing</span>
                            <span className="text-white font-bold uppercase">REPUTATION_UPGRADE_PENDING</span>
                         </div>
                      </div>
                      <button onClick={() => setIsVouching(false)} className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Return to Command Center</button>
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
