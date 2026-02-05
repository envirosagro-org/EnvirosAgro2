import React, { useState, useEffect, useMemo } from 'react';
import { 
  Landmark, TrendingUp, ShieldCheck, PieChart as PieChartIcon, BarChart3, Search, Activity, 
  CheckCircle2, X, Loader2, Gem, ChevronRight, LineChart as LineChartIcon, Bot, Sparkles, 
  Binary, KeyRound, Stamp, Target as TargetIcon, Users, BadgeCheck, Sprout, RefreshCcw, 
  ShieldAlert, Fingerprint, Key, BarChart4, ClipboardCheck, ArrowUpRight, Coins, Wallet,
  Layers, Database, Terminal, Microscope, Zap, Globe, Gauge, ShieldPlus, ArrowDownToLine,
  LayoutGrid, Network, Boxes, FileSearch, Monitor,
  Briefcase, MapPin, Smartphone, User as UserIcon,
  // Added more icons for the fixed harvest rendering
  Workflow, ArrowRightCircle, History, Package
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { User, AgroProject, ViewState } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface InvestorPortalProps {
  user: User;
  onUpdate: (user: User) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  projects: AgroProject[];
  pendingAction?: string | null;
  clearAction?: () => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const ANALYTICS_TREND_DATA = [
  { time: 'T-12', yield: 8.4, volume: 420 }, { time: 'T-10', yield: 9.2, volume: 510 }, 
  { time: 'T-08', yield: 11.5, volume: 640 }, { time: 'T-06', yield: 10.8, volume: 580 }, 
  { time: 'T-04', yield: 12.4, volume: 720 }, { time: 'T-02', yield: 14.1, volume: 850 },
  { time: 'NOW', yield: 15.8, volume: 920 },
];

const THRUST_YIELD_ALLOCATION = [
  { name: 'Societal', value: 35, color: '#f43f5e' },
  { name: 'Environmental', value: 25, color: '#10b981' },
  { name: 'Human', value: 15, color: '#14b8a6' },
  { name: 'Technological', value: 20, color: '#3b82f6' },
  { name: 'Industry', value: 5, color: '#8b5cf6' },
];

// Enhanced project cards with technical biometrics
const MOCK_OPPORTUNITIES: (Partial<AgroProject> & { mFactor: number, caIndex: number, auditIntegrity: number, shardWeight: string })[] = [
  { id: 'OPP-882', name: 'Omaha Western Shard', description: 'Expanding nitrogen sharding capabilities across 500 new hectares of audited no-till land.', thrust: 'Environmental', roiEstimate: 14.2, investorShareRatio: 0.15, memberCount: 12, isPreAudited: true, mFactor: 1.42, caIndex: 1.84, auditIntegrity: 98, shardWeight: '12.4 TB', profitsAccrued: 4500 },
  { id: 'OPP-104', name: 'Bantu Seed Vault Node', description: 'Institutional scaling of lineage seed preservation using spectral DNA sharding technology.', thrust: 'Societal', roiEstimate: 18.5, investorShareRatio: 0.25, memberCount: 45, isPreAudited: true, mFactor: 1.68, caIndex: 2.12, auditIntegrity: 99, shardWeight: '45.8 TB', profitsAccrued: 8200 },
  { id: 'OPP-042', name: 'Coastal Moisture Relay', description: 'Autonomous aqua-drones for coastal mangrove desalination and carbon sharding.', thrust: 'Technological', roiEstimate: 22.1, investorShareRatio: 0.20, memberCount: 24, isPreAudited: false, mFactor: 1.15, caIndex: 1.42, auditIntegrity: 84, shardWeight: '8.2 TB', profitsAccrued: 2400 },
  { id: 'OPP-991', name: 'M-Pesa Gateway Beta', description: 'Secondary financial bridges for decentralized steward payroll nodes.', thrust: 'Industry', roiEstimate: 12.8, investorShareRatio: 0.10, memberCount: 8, isPreAudited: true, mFactor: 1.22, caIndex: 1.10, auditIntegrity: 96, shardWeight: '2.4 TB', profitsAccrued: 1200 },
  { id: 'OPP-552', name: 'Altiplano Soil Forge', description: 'Recovering depleted mineral shards in high-altitude agricultural clusters.', thrust: 'Environmental', roiEstimate: 16.4, investorShareRatio: 0.18, memberCount: 15, isPreAudited: true, mFactor: 1.54, caIndex: 1.65, auditIntegrity: 92, shardWeight: '18.1 TB', profitsAccrued: 3300 },
  { id: 'OPP-321', name: 'Bio-Resonant Rice Node', description: 'Scaling sonic remediation for bio-electric yield optimization.', thrust: 'Technological', roiEstimate: 24.5, investorShareRatio: 0.30, memberCount: 56, isPreAudited: false, mFactor: 1.88, caIndex: 2.45, auditIntegrity: 88, shardWeight: '52.4 TB', profitsAccrued: 11000 },
];

const InvestorPortal: React.FC<InvestorPortalProps> = ({ 
  user, onUpdate, onSpendEAC, projects, pendingAction, clearAction, onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'portfolio' | 'analytics' | 'consensus'>('opportunities');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isVouching, setIsVouching] = useState(false);
  const [vouchStep, setVouchStep] = useState<'analysis' | 'manifest' | 'physical_proof' | 'signing' | 'success'>('analysis');
  const [vouchAmount, setVouchAmount] = useState('5000');
  const [esinSign, setEsinSign] = useState('');
  const [aiOpinion, setAiOpinion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState<string | null>(null);
  
  // Session-based list of IDs the user has vouched for
  const [vouchedIds, setVouchedIds] = useState<Set<string>>(new Set());

  // Real-time network metrics simulation
  const [netLiquidity, setNetLiquidity] = useState(142.8);
  const [consensusQuorum, setConsensusQuorum] = useState(99.98);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetLiquidity(prev => Number((prev + (Math.random() * 0.2 - 0.1)).toFixed(1)));
      setConsensusQuorum(prev => Math.min(100, Number((prev + (Math.random() * 0.01 - 0.005)).toFixed(2))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const allOpportunities = useMemo(() => {
    const existingIds = new Set(projects.map(p => p.id));
    return [
      ...projects.map(p => ({ ...p, mFactor: 1.42, caIndex: 1.84, auditIntegrity: 98, shardWeight: '12.4 TB' })), 
      ...MOCK_OPPORTUNITIES.filter(o => !existingIds.has(o.id as string))
    ] as any[];
  }, [projects]);

  const filteredProjects = allOpportunities.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (p.thrust?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Consolidated Portfolio List
  const portfolioList = useMemo(() => {
    const mainList = projects.filter(p => p.status === 'Execution');
    const sessionVouches = MOCK_OPPORTUNITIES.filter(o => vouchedIds.has(o.id as string));
    return [...mainList, ...sessionVouches];
  }, [projects, vouchedIds]);

  const handleVouchRequest = async (project: any) => {
    setSelectedProject(project);
    setVouchStep('analysis');
    setIsVouching(true);
    setAiOpinion(null);
    try {
      const response = await chatWithAgroExpert(`Act as the Capital Oracle. Perform a deep institutional analysis on project ${project.name} for an institutional investor. Evaluate the risk based on its m-constant (${project.mFactor}), C(a) Index (${project.caIndex}), and Thrust alignment (${project.thrust}). Provide a technical ESG-plus verdict.`, []);
      setAiOpinion(response.text);
    } catch (e) {
      setAiOpinion("Protocol handshake error. Oracle sync timeout. Registry fallback active.");
    }
  };

  const handleExecuteVouch = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    const amount = Number(vouchAmount);
    if (await onSpendEAC(amount, `VOUCH_COMMITMENT_${selectedProject?.id}`)) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setVouchStep('success');
        setVouchedIds(prev => new Set(prev).add(selectedProject.id));
      }, 2500);
    }
  };

  const handleHarvestROI = (project: any) => {
    const claimable = (project.profitsAccrued || 1000) * (project.investorShareRatio || 0.15);
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Network size={1000} className="text-blue-500" />
      </div>

      {/* 1. Institutional Metrology HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-10 rounded-[48px] border-blue-500/20 bg-blue-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Landmark size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Network Liquidity</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter">${netLiquidity.toFixed(1)}<span className="text-xl text-blue-500 ml-1 italic">M</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry TVL</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-blue-400 font-bold">STABLE</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><TargetIcon size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Consensus Quorum</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter">{consensusQuorum.toFixed(2)}<span className="text-xl text-emerald-500 ml-1 italic">%</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Node Reliability</span>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-400" />
                 <span className="text-[9px] font-mono text-emerald-500 font-bold">SECURE</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Global Resonance</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter">1.42<span className="text-xl text-indigo-500 ml-1 italic">m</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Avg Stability</span>
              <div className="flex items-center gap-2">
                 <TrendingUp size={14} className="text-indigo-400" />
                 <span className="text-[9px] font-mono text-indigo-400 font-bold">+0.12x</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.5em]">Capital Flow</p>
              <h4 className="text-5xl font-mono font-black text-white tracking-tighter">12.4<span className="text-xl text-amber-500 ml-1 italic">K</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Daily Shards</span>
              <div className="flex items-center gap-2 text-amber-500">
                 <Zap size={14} fill="currentColor" />
                 <span className="text-[9px] font-mono font-bold uppercase">Active Ingest</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Command Hub Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-6">
           {[
             { id: 'opportunities', label: 'Vetting Registry', icon: FileSearch },
             { id: 'portfolio', label: 'ROI Harvest', icon: Sprout },
             { id: 'analytics', label: 'Yield Analytics', icon: BarChart4 },
             { id: 'consensus', label: 'Node Quorum', icon: Network },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xl scale-105 border-b-4 border-blue-400 ring-8 ring-blue-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="relative group w-full lg:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Mission ID or Registry Node..." 
              className="w-full bg-black/60 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-mono italic shadow-inner"
            />
         </div>
      </div>

      {/* 3. Main Viewport */}
      <div className="min-h-[850px] relative z-10">
        
        {activeTab === 'opportunities' && (
          <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredProjects.map(opp => (
                   <div key={opp.id} className="glass-card rounded-[64px] border-2 border-white/5 hover:border-blue-500/40 transition-all flex flex-col group active:scale-[0.98] duration-300 shadow-3xl bg-black/40 relative overflow-hidden h-[720px]">
                      {/* Industrial Scanline Overlay */}
                      <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none overflow-hidden">
                         <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent absolute top-0 animate-scan"></div>
                      </div>
                      
                      <div className="p-12 space-y-10 flex-1 flex flex-col">
                         <div className="flex justify-between items-start">
                            <div className={`p-6 rounded-[32px] bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-2xl group-hover:rotate-6 transition-all`}>
                               <Briefcase size={40} />
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                               <div className="flex items-center gap-2">
                                  <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest">{opp.thrust} THRUST</span>
                               </div>
                               <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{opp.id}</p>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors drop-shadow-2xl">{opp.name}</h4>
                            <p className="text-slate-400 text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">"{opp.description}"</p>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-6 bg-black/60 rounded-[40px] border border-white/5 space-y-2 group/biom hover:border-blue-500/20 transition-all shadow-inner">
                               <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Activity size={10} className="text-indigo-400" /> m-Constant
                               </p>
                               <p className="text-3xl font-mono font-black text-white">{opp.mFactor}<span className="text-sm text-indigo-500 ml-1">m</span></p>
                            </div>
                            <div className="p-6 bg-black/60 rounded-[40px] border border-white/5 space-y-2 group/biom hover:border-emerald-500/20 transition-all shadow-inner text-right">
                               <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest flex items-center justify-end gap-2">
                                  C(a) Index <Binary size={10} className="text-emerald-400" />
                               </p>
                               <p className="text-3xl font-mono font-black text-white">{opp.caIndex}<span className="text-sm text-emerald-500 ml-1">Ca</span></p>
                            </div>
                         </div>

                         <div className="space-y-6 pt-10 mt-auto border-t border-white/5">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                               <span>Audit Integrity Shard</span>
                               <span className="text-emerald-400 font-mono">{opp.auditIntegrity}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                               <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] transition-all duration-[2s]" style={{ width: `${opp.auditIntegrity}%` }}></div>
                            </div>
                         </div>
                      </div>

                      <div className="p-12 border-t border-white/5 bg-white/[0.01] flex items-center justify-between group-hover:bg-blue-600/5 transition-all">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-none">Target Yield (APY)</p>
                            <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">+{opp.roiEstimate}<span className="text-sm font-sans italic ml-1">%</span></p>
                         </div>
                         <button 
                           onClick={() => handleVouchRequest(opp)}
                           className="p-8 bg-blue-600 rounded-[36px] text-white shadow-2xl hover:bg-blue-500 active:scale-90 transition-all border border-white/10 ring-8 ring-white/5 relative group/btn overflow-hidden"
                         >
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                            <ShieldCheck size={32} className="relative z-10" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
             <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12 px-6">
                <div className="space-y-3">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">CAPITAL <span className="text-emerald-400">HARVEST</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Liquidating accrued mission dividends into liquid EAC shards."</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl">
                    <History size={18} /> Dividend Archive
                  </button>
                  <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center gap-4 active:scale-95 transition-all ring-8 ring-white/5">
                    <RefreshCcw size={20} /> SYNC ALL NODES
                  </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {portfolioList.map(proj => {
                   const claimable = (proj.profitsAccrued || 1000) * (proj.investorShareRatio || 0.15);
                   return (
                     <div key={proj.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[680px] bg-black/40 shadow-3xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Sprout size={300} className="text-emerald-400" /></div>
                        
                        <div className="flex justify-between items-start mb-12 relative z-10">
                           <div className="p-6 rounded-[32px] bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 shadow-2xl group-hover:rotate-6 transition-all">
                              <Gem size={40} />
                           </div>
                           <div className="text-right">
                              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">ACTIVE_YIELD</span>
                              <p className="text-[10px] text-slate-700 font-mono mt-3 font-bold">{proj.id}</p>
                           </div>
                        </div>

                        <div className="flex-1 space-y-8 relative z-10">
                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors">{proj.name}</h4>
                           
                           <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-2 text-center shadow-inner relative overflow-hidden group/reward">
                              <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/reward:opacity-100 transition-opacity"></div>
                              <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mb-4">CLAIMABLE DIVIDENDS</p>
                              <p className="text-7xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-2xl">
                                 {claimable.toFixed(0)} <span className="text-2xl italic font-sans text-emerald-600/50">EAC</span>
                              </p>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex flex-col gap-2">
                                 <p className="text-[9px] text-slate-500 font-black uppercase">Yield Delta</p>
                                 <div className="flex items-center gap-2 text-emerald-400">
                                    <TrendingUp size={16} />
                                    <span className="text-xl font-mono font-black">+14.2%</span>
                                 </div>
                              </div>
                              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 flex flex-col gap-2">
                                 <p className="text-[9px] text-slate-500 font-black uppercase">Node Load</p>
                                 <div className="flex items-center gap-2 text-blue-400">
                                    <Activity size={16} />
                                    <span className="text-xl font-mono font-black">98.4%</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleHarvestROI(proj)}
                          disabled={claimable <= 0 || isHarvesting === proj.id}
                          className={`mt-12 w-full py-10 rounded-[40px] text-[13px] font-black uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-6 border-2 ${
                            claimable > 0 ? 'agro-gradient text-white border-white/10 active:scale-95 ring-8 ring-emerald-500/5' : 'bg-white/5 text-slate-800 border-white/5 cursor-not-allowed'
                          }`}
                        >
                           {isHarvesting === proj.id ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8" />}
                           {isHarvesting === proj.id ? 'ANCHORING...' : 'HARVEST SHARDS'}
                        </button>
                     </div>
                   );
                })}
                {portfolioList.length === 0 && (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                    <div className="relative">
                      <History size={120} className="text-slate-600 group-hover:text-emerald-500 transition-colors duration-700" />
                      <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-black text-white uppercase tracking-[0.4em]">Registry Empty</p>
                      <p className="text-sm italic text-slate-500 uppercase tracking-widest font-bold">Vouch for missions to begin accruing dividends.</p>
                    </div>
                    <button onClick={() => setActiveTab('opportunities')} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                      <ArrowRightCircle size={18} /> BROWSE VETTING REGISTRY
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-14 rounded-[64px] border border-white/5 bg-black/60 shadow-3xl relative overflow-hidden flex flex-col group">
                   <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none overflow-hidden">
                      <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent absolute top-0 animate-scan"></div>
                   </div>
                   <div className="flex flex-col md:flex-row justify-between items-center mb-20 relative z-10 px-4 gap-8">
                      <div className="flex items-center gap-8">
                         <div className="p-6 bg-blue-600 rounded-[32px] shadow-[0_0_50px_#2563eb44]">
                            <BarChart4 className="w-10 h-10 text-white" />
                         </div>
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Industrial <span className="text-blue-400">Growth</span></h3>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">Multi-Thrust Yield Telemetry v4.2</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] text-slate-600 font-black uppercase mb-2">Global Index Momentum</p>
                         <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter leading-none drop-shadow-2xl">18.4<span className="text-3xl italic font-sans">%</span></p>
                      </div>
                   </div>

                   <div className="flex-1 min-h-[450px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={ANALYTICS_TREND_DATA}>
                            <defs>
                               <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                            <Area type="monotone" name="Yield Alpha" dataKey="yield" stroke="#3b82f6" strokeWidth={8} fillOpacity={1} fill="url(#colorYield)" strokeLinecap="round" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8 flex flex-col">
                   <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-xl flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden flex-1 group">
                      <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none group-hover:bg-indigo-500/[0.03] transition-colors"></div>
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-4 relative z-10">
                         <PieChartIcon className="w-8 h-8 text-indigo-400" /> Capital <span className="text-indigo-400">Diffusion</span>
                      </h4>
                      <div className="h-80 w-full relative z-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie data={THRUST_YIELD_ALLOCATION} innerRadius={85} outerRadius={125} paddingAngle={8} dataKey="value" stroke="none">
                                  {THRUST_YIELD_ALLOCATION.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '16px' }} />
                            </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Optimal</p>
                            <p className="text-4xl font-mono font-black text-white">100%</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full relative z-10">
                         {THRUST_YIELD_ALLOCATION.map(t => (
                            <div key={t.name} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }}></div>
                               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t.name}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[48px] border border-amber-500/20 bg-amber-500/5 space-y-6 shadow-xl relative overflow-hidden group/risk">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/risk:rotate-12 transition-transform duration-700"><ShieldAlert size={100} className="text-amber-500" /></div>
                      <div className="flex items-center gap-4 relative z-10">
                         <ShieldAlert className="w-8 h-8 text-amber-500" />
                         <h4 className="text-xl font-black text-white uppercase italic">Risk <span className="text-amber-500">Oracle</span></h4>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed italic relative z-10 border-l-2 border-amber-500/20 pl-6">
                         "Global yield volatility suppressed by 12% due to high-m-constant redundancy in Zone 4 Clusters."
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'consensus' && (
           <div className="max-w-5xl mx-auto space-y-16 animate-in zoom-in duration-500 px-4 md:px-0">
              <div className="glass-card p-16 md:p-24 rounded-[80px] bg-indigo-600/[0.03] border-2 border-indigo-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]">
                    <Network className="w-[1000px] h-[1000px] text-white" />
                 </div>
                 
                 <div className="relative shrink-0">
                    <div className="w-64 h-64 bg-indigo-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] ring-[24px] ring-white/5 animate-pulse relative">
                       <ShieldPlus className="w-28 h-28 text-white" />
                       <div className="absolute inset-[-15px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 p-6 glass-card rounded-[32px] border border-white/20 bg-black/80 shadow-3xl flex flex-col items-center animate-bounce">
                       <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Network Quorum</p>
                       <p className="text-3xl font-mono font-black text-white">100%</p>
                    </div>
                 </div>

                 <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner">ZK_CONSENSUS_PROTOCOL</span>
                       <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">NODE <span className="text-indigo-400">QUORUM</span></h2>
                    </div>
                    <p className="text-slate-300 text-2xl leading-relaxed italic font-medium max-w-2xl mx-auto lg:mx-0 opacity-80">
                       "Every mission investment and vouch is validated by a decentralized quorum of peer nodes. Finality is achieved through Zero-Knowledge Proofs (ZKP) of sustainable impact."
                    </p>
                    <button 
                       className="px-16 py-8 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(99,102,241,0.3)] flex items-center justify-center gap-6 mx-auto lg:mx-0 active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5 group"
                    >
                       <Terminal className="w-8 h-8 group-hover:rotate-12 transition-transform" /> INITIALIZE NODE AUDIT
                    </button>
                 </div>
              </div>

              {/* Consensus Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { label: 'Validator Latency', val: '12ms', icon: Activity, col: 'text-emerald-400' },
                    { label: 'Proof Density', val: '8.4M/s', icon: Globe, col: 'text-blue-400' },
                    { label: 'System Uptime', val: '100%', icon: ShieldCheck, col: 'text-indigo-400' },
                 ].map((s, i) => (
                    <div key={i} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 flex flex-col items-center text-center space-y-4 group hover:border-white/20 transition-all shadow-xl">
                       <s.icon className={`w-8 h-8 ${s.col} group-hover:scale-110 transition-transform`} />
                       <div>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-2">{s.label}</p>
                          <p className="text-3xl font-mono font-black text-white tracking-tighter">{s.val}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* --- MODAL: INSTITUTIONAL VETTING --- */}
      {isVouching && selectedProject && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsVouching(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(37,99,235,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[95vh]">
              
              <div className="p-12 md:p-16 border-b border-white/5 bg-blue-500/[0.01] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-[0_0_80px_#2563eb44] border-4 border-white/10 relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                       <TargetIcon size={48} className="text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Institutional <span className="text-blue-400">Vetting</span></h3>
                       <p className="text-blue-400/60 text-[11px] font-mono tracking-[0.5em] uppercase mt-4 italic leading-none">TARGET_SHARD // {selectedProject.id} // SECURED_BY_ZK</p>
                    </div>
                 </div>
                 <button onClick={() => setIsVouching(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90"><X size={32} /></button>
              </div>

              <div className="flex gap-4 px-16 pt-8 shrink-0">
                 {['analysis', 'manifest', 'physical_proof', 'signing', 'success'].map((s, i) => {
                    const stages = ['analysis', 'manifest', 'physical_proof', 'signing', 'success'];
                    const currentIdx = stages.indexOf(vouchStep);
                    return (
                      <div key={s} className="flex-1 flex flex-col gap-2">
                        <div className={`h-2 rounded-full transition-all duration-700 ${i <= currentIdx ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' : 'bg-white/10'}`}></div>
                        <span className={`text-[8px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-blue-400' : 'text-slate-700'}`}>{s}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar flex flex-col bg-black/40">
                 {vouchStep === 'analysis' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-white/10 relative overflow-hidden border-l-[12px] border-l-blue-600 shadow-3xl">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[15s] pointer-events-none"><Sparkles size={600} className="text-blue-500" /></div>
                          <div className="flex items-center gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
                             <Bot className="w-12 h-12 text-blue-400 animate-pulse" />
                             <h4 className="text-3xl font-black text-white uppercase tracking-widest italic leading-none">Oracle Sentiment Report</h4>
                          </div>
                          {!aiOpinion ? (
                             <div className="flex flex-col items-center py-24 gap-10 text-center">
                                <div className="relative">
                                  <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <TargetIcon className="w-8 h-8 text-blue-400 animate-pulse" />
                                  </div>
                                </div>
                                <p className="text-blue-500 font-black text-lg uppercase tracking-[0.6em] animate-pulse italic">Sequencing Risk Shards...</p>
                             </div>
                          ) : (
                             <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium border-l border-white/5 pl-12 relative z-10">
                                {aiOpinion}
                             </div>
                          )}
                       </div>

                       <div className="space-y-8 max-w-2xl mx-auto w-full">
                          <div className="flex justify-between px-10">
                             <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Commitment Weight (EAC)</label>
                             <span className="text-5xl font-mono font-black text-blue-400 drop-shadow-[0_0_15px_#3b82f6]">{Number(vouchAmount).toLocaleString()}</span>
                          </div>
                          <input 
                            type="range" min="1000" max="100000" step="1000" value={vouchAmount} 
                            onChange={e => setVouchAmount(e.target.value)}
                            className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" 
                          />
                       </div>

                       <button 
                        onClick={() => setVouchStep('manifest')}
                        disabled={!aiOpinion}
                        className="w-full py-12 bg-blue-600 hover:bg-blue-500 rounded-[48px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(37,99,235,0.3)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-8 ring-white/5"
                       >
                          PROCEED TO SHARD MANIFEST <ChevronRight className="w-8 h-8" />
                       </button>
                    </div>
                 )}

                 {vouchStep === 'manifest' && (
                   <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                      <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl">
                           <Boxes size={48} />
                        </div>
                        <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Shard <span className="text-blue-400">Manifest</span></h4>
                        <p className="text-slate-400 text-xl italic">"Decomposing the mission node into constituent verified resources."</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
                         {[
                           { l: 'LAND_MASS', v: 'Verified Geofence', i: MapPin, s: 'STABLE' },
                           { l: 'HARDWARE_NODES', v: '12 Active IoT Shards', i: Smartphone, s: 'SYNCED' },
                           { l: 'STEWARD_DOMAIN', v: 'Verified Lv. 4 Lead', i: UserIcon, s: 'AUTH_OK' },
                           { l: 'DATA_MASS', v: selectedProject.shardWeight, i: Database, s: 'NOMINAL' },
                         ].map((m, i) => (
                            <div key={i} className="p-8 glass-card bg-white/[0.02] border border-white/10 rounded-[40px] flex items-center justify-between group hover:bg-blue-600/5 transition-all">
                               <div className="flex items-center gap-6">
                                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:rotate-6 transition-transform"><m.i size={24} className="text-blue-400" /></div>
                                  <div>
                                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{m.l}</p>
                                     <p className="text-lg font-bold text-white uppercase italic mt-1">{m.v}</p>
                                  </div>
                               </div>
                               <span className="text-[8px] font-mono font-black text-emerald-500 uppercase">{m.s}</span>
                            </div>
                         ))}
                      </div>

                      <button onClick={() => setVouchStep('physical_proof')} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">VALIDATE PHYSICAL PROOF</button>
                   </div>
                 )}

                 {vouchStep === 'physical_proof' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center text-center">
                       <div className="space-y-8">
                          <div className="w-40 h-40 bg-emerald-500/10 rounded-[48px] flex items-center justify-center mx-auto border-4 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.3)] relative">
                             <ClipboardCheck className="w-20 h-20 text-emerald-400" />
                             <div className="absolute inset-[-20px] border-4 border-emerald-500/20 rounded-[64px] animate-ping opacity-30"></div>
                          </div>
                          <h4 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Physical <span className="text-emerald-400">Verification</span></h4>
                          <p className="text-slate-400 text-2xl font-medium italic max-w-xl mx-auto leading-relaxed">
                            "This mission node has been 100% physically verified by the EnvirosAgro Field Audit team. Registry integrity shard confirmed as authentic."
                          </p>
                       </div>
                       <button onClick={() => setVouchStep('signing')} className="w-full max-w-xl mx-auto py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all ring-8 ring-white/5 border-4 border-white/10">PROCEED TO SIGNATURE <ArrowUpRight size={24} /></button>
                    </div>
                 )}

                 {vouchStep === 'signing' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-8">
                          <div className="w-32 h-32 bg-blue-500/10 rounded-[44px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl group relative overflow-hidden">
                             <Fingerprint className="w-16 h-16 text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
                             <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none m-0">Cryptographic <span className="text-blue-400">Anchor</span></h4>
                       </div>

                       <div className="space-y-6 max-w-xl mx-auto w-full">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">INSTITUTIONAL SIGNATURE (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[48px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-blue-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <button 
                         onClick={handleExecuteVouch}
                         disabled={!esinSign || isProcessing}
                         className="w-full max-w-xl mx-auto py-12 agro-gradient rounded-[56px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_150px_rgba(37,99,235,0.4)] flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                       >
                          {isProcessing ? <Loader2 className="w-10 h-10 animate-spin" /> : <Key className="w-10 h-10 fill-current" />}
                          {isProcessing ? "MINTING SHARD..." : "COMMIT CAPITAL SHARD"}
                       </button>
                    </div>
                 )}

                 {vouchStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 className="w-32 h-32 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Vouch <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_VOUCH_OK_SYNC</p>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-emerald-500/5 space-y-4 max-w-lg w-full shadow-2xl relative overflow-hidden group/success">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/success:rotate-12 transition-transform duration-[10s]"><Activity size={120} /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-4">
                             <span className="text-slate-500 font-black uppercase tracking-widest italic">Capital Deployment</span>
                             <span className="text-white font-mono font-black text-2xl text-emerald-400">-{vouchAmount} EAC</span>
                          </div>
                          <div className="h-px w-full bg-white/10"></div>
                          <p className={`text-[10px] text-slate-400 italic px-4 text-center leading-loose`}>"Your commitment shard is now part of the global consensus quorum. Revenue sharding initialized for Cycle 12."</p>
                       </div>
                       <button onClick={() => { setIsVouching(false); setActiveTab('portfolio'); }} className="w-full max-w-md py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">GO TO HARVEST HUB</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default InvestorPortal;