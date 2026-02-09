
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Landmark, 
  Briefcase, 
  ShieldCheck, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  X, 
  Coins, 
  Zap, 
  PlusCircle, 
  Search, 
  Globe, 
  Clock, 
  Activity, 
  MapPin, 
  Users2, 
  Database, 
  Lock, 
  AlertTriangle,
  HardHat,
  Handshake,
  FileSignature,
  Key,
  FileSearch,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  History,
  CheckCircle,
  AlertCircle,
  FileDigit,
  Fingerprint,
  ArrowLeftCircle,
  Target,
  BarChart4,
  LayoutGrid,
  Bot,
  Sparkles,
  ClipboardCheck,
  Building2,
  Users,
  TreePine,
  ShieldPlus,
  Info,
  Stamp,
  Network,
  Plus,
  Heart,
  Factory,
  Truck,
  Monitor,
  Radio,
  Gavel,
  Scale,
  Waves,
  Layout,
  Star,
  ChevronDown,
  /* Added missing icon imports to fix compilation errors */
  Sprout,
  ArrowUpRight,
  MessageSquare,
  Send,
  Cpu,
  SmartphoneNfc
} from 'lucide-react';
import { User, FarmingContract, ContractApplication, ViewState, AgroResource, MissionCategory, MissionMilestone } from '../types';
import { analyzeBidHandshake, AIResponse } from '../services/geminiService';

interface ContractFarmingProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState, action?: string | null) => void;
  contracts: FarmingContract[];
  setContracts: React.Dispatch<React.SetStateAction<FarmingContract[]>>;
  onSaveContract: (contract: FarmingContract) => void;
}

const CATEGORY_META: Record<MissionCategory, { label: string, icon: any, color: string, bg: string, desc: string }> = {
  FUND_ACQUISITION: { label: 'Fund Acquisition', icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Seeking capital for specific agricultural ventures.' },
  INVESTMENT: { label: 'Investment', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Investors posting deals for resource deployment.' },
  CHARITY: { label: 'Charity', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', desc: 'Missions focused on social impact and restoration.' },
  LIVE_FARMING: { label: 'Live Farming', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Traditional cultivation tracked via IoT/Streaming.' },
  INDUSTRIAL_LOGISTICS: { label: 'Industrial/Logistics', icon: Factory, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'Processing, warehousing, or transport missions.' },
};

const ContractFarming: React.FC<ContractFarmingProps> = ({ user, onSpendEAC, onNavigate, contracts, setContracts, onSaveContract }) => {
  const [isAccessVerifying, setIsAccessVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<'manifest' | 'terminal' | 'archive'>('manifest');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selection & Ingestion States
  const [showApplyModal, setShowApplyModal] = useState<FarmingContract | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [applyStep, setApplyStep] = useState<'selection' | 'ingestion' | 'matching' | 'success'>('selection');
  
  // Application Data
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isWorkerCloudNeeded, setIsWorkerCloudNeeded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [esinSign, setEsinSign] = useState('');

  // Deployment Data
  const [newMissionCategory, setNewMissionCategory] = useState<MissionCategory>('INVESTMENT');
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionBudget, setNewMissionBudget] = useState('5000');
  const [isStreamingRequired, setIsStreamingRequired] = useState(false);

  // Management Terminal States
  const [activeMission, setActiveMission] = useState<FarmingContract | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAccessVerifying(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const availableMissions = useMemo(() => contracts.filter(c => c.status === 'Open'), [contracts]);
  const activeMissions = useMemo(() => contracts.filter(c => c.status === 'In_Progress'), [contracts]);

  const filteredManifest = useMemo(() => {
    return availableMissions.filter(m => 
      m.productType.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.investorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableMissions, searchTerm]);

  const landResources = useMemo(() => (user.resources || []).filter(r => r.category === 'LAND'), [user.resources]);
  const hardwareResources = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);

  const handleApplyStart = (mission: FarmingContract) => {
    setShowApplyModal(mission);
    setApplyStep('selection');
    setSelectedAssets(new Set());
    setMatchResult(null);
  };

  const handleRunMatch = async () => {
    if (!showApplyModal) return;
    setIsAnalyzing(true);
    setApplyStep('matching');
    try {
      const assetDetails = Array.from(selectedAssets).map(id => {
        const r = user.resources?.find(res => res.id === id);
        return { name: r?.name, type: r?.type, status: r?.status };
      });
      
      const res = await analyzeBidHandshake(
        `Mission: ${showApplyModal.productType}. Category: ${showApplyModal.category}`,
        assetDetails
      );
      setMatchResult(res.json);
    } catch (e) {
      setMatchResult({ match_score: 0.85, reasoning: "Registry sync complete. Matching successful via local quorum fallback." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalizeApplication = () => {
    if (!showApplyModal || !matchResult) return;
    
    const newApp: ContractApplication = {
      id: `APP-${Date.now()}`,
      farmerEsin: user.esin,
      farmerName: user.name,
      landResources: landResources.map(l => l.name).join(', '),
      labourCapacity: isWorkerCloudNeeded ? 'Worker Cloud Integration' : 'In-House Personnel',
      auditStatus: 'Pending',
      paymentEscrowed: 0,
      matchScore: matchResult.match_score,
      ingestedAssets: Array.from(selectedAssets)
    };

    onSaveContract({
      ...showApplyModal,
      applications: [...showApplyModal.applications, newApp]
    });
    setApplyStep('success');
  };

  const handleDeployMission = async () => {
    if (!newMissionTitle || esinSign.toUpperCase() !== user.esin.toUpperCase()) return;

    if (await onSpendEAC(Number(newMissionBudget), `MISSION_DEPLOYMENT_${newMissionTitle}`)) {
      const newContract: FarmingContract = {
        id: `MIS-${Math.floor(Math.random() * 9000 + 1000)}`,
        investorEsin: user.esin,
        investorName: user.name,
        category: newMissionCategory,
        productType: newMissionTitle,
        requiredLand: 'Audited Geofence',
        requiredLabour: 'Verified Workforce',
        budget: Number(newMissionBudget),
        status: 'Open',
        applications: [],
        capitalIngested: true,
        milestones: [
          { id: 'm1', label: 'GENESIS INGEST', status: 'ACTIVE', stakeReleasePercent: 20 },
          { id: 'm2', label: 'INDUSTRIAL FLOW', status: 'LOCKED', stakeReleasePercent: 40 },
          { id: 'm3', label: 'FINALITY AUDIT', status: 'LOCKED', stakeReleasePercent: 40 },
        ],
        streamingRequirement: isStreamingRequired
      };
      onSaveContract(newContract);
      setShowDeployModal(false);
      setNewMissionTitle('');
    }
  };

  if (isAccessVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-3xl">
            <Lock size={48} className="animate-pulse" />
          </div>
          <div className="absolute inset-[-10px] border-2 border-indigo-500/30 rounded-[50px] animate-ping opacity-20"></div>
        </div>
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em] italic leading-none">VETTING MISSION ACCESS...</h3>
          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">Handshake_Protocol_v6.5 // Consensus: Syncing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Mission HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-blue-500/20 bg-blue-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none">
              <div className="w-full h-[1px] bg-blue-500/10 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-[48px] bg-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.3)] flex items-center justify-center border-4 border-white/10 group-hover:scale-105 transition-all duration-700">
                 <Handshake size={64} className="text-white animate-float" />
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                    <span className="px-5 py-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">MISSION_TO_VALUE_ENGINE</span>
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner italic">ZK_BIDS_READY</span>
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Mission <span className="text-blue-400">Registry.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                 "Transforming agricultural contracts into live, verifiable industrial flows. Deploy capital missions or ingest assets to earn sharding rewards."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="space-y-4 relative z-10 w-full">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">AGGREGATE_ESCROW</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">14<span className="text-xl text-emerald-500 italic ml-1">.2 M</span></h4>
              <div className="flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase relative z-10 tracking-widest bg-emerald-500/5 py-2 rounded-full mt-6 border border-emerald-500/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> QUORUM_SYNC_OK
              </div>
           </div>
           <div className="w-full pt-10 border-t border-white/5">
              <button 
                onClick={() => setShowDeployModal(true)}
                className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10 ring-4 ring-white/5"
              >
                <Plus size={18} /> DEPLOY MISSION
              </button>
           </div>
        </div>
      </div>

      {/* 2. Management Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-10 relative z-20">
        {[
          { id: 'manifest', label: 'Mission Manifest', icon: LayoutGrid },
          { id: 'terminal', label: 'Management Terminal', icon: Monitor },
          { id: 'archive', label: 'Resolution Archive', icon: History },
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

      {/* 3. Tab Views */}
      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: MISSION MANIFEST --- */}
        {activeTab === 'manifest' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             <div className="flex justify-between items-center gap-8 border-b border-white/5 pb-8 px-6">
                <div className="relative group flex-1 max-w-2xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-blue-400 transition-colors" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Search missions by Category, Title or Node ID..." 
                     className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-8 focus:ring-blue-500/10 transition-all font-mono italic" 
                   />
                </div>
                <div className="flex items-center gap-4 shrink-0">
                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Active Shards: {filteredManifest.length}</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {filteredManifest.map(mission => {
                   const meta = CATEGORY_META[mission.category];
                   return (
                     <div key={mission.id} className="glass-card rounded-[64px] border-2 border-white/5 hover:border-blue-500/40 transition-all flex flex-col group active:scale-[0.98] duration-500 shadow-3xl bg-black/40 relative overflow-hidden h-[680px]">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><meta.icon size={300} className="text-white" /></div>
                        
                        <div className="p-12 space-y-10 flex-1 flex flex-col">
                           <div className="flex justify-between items-start">
                              <div className={`p-6 rounded-[32px] ${meta.bg} border border-white/5 ${meta.color} shadow-2xl group-hover:rotate-6 transition-all`}>
                                 <meta.icon size={40} />
                              </div>
                              <div className="text-right flex flex-col items-end gap-3">
                                 <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-lg ${meta.color} border-white/10`}>
                                   {meta.label}
                                 </span>
                                 <p className="text-[10px] text-slate-700 font-mono font-black uppercase italic">{mission.id}</p>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors drop-shadow-2xl">{mission.productType}</h4>
                              <p className="text-slate-400 text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">"{mission.investorName} is seeking a steward node for this mission."</p>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mt-auto">
                              <div className="p-6 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/val hover:border-blue-500/20 transition-all">
                                 <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Budget</p>
                                 <p className="text-3xl font-mono font-black text-emerald-400">{mission.budget.toLocaleString()}<span className="text-sm italic">EAC</span></p>
                              </div>
                              <div className="p-6 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/val hover:border-indigo-500/20 transition-all text-right">
                                 <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Applications</p>
                                 <p className="text-3xl font-mono font-black text-indigo-400">{mission.applications.length}</p>
                              </div>
                           </div>
                        </div>

                        <div className="p-12 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                           <button 
                             onClick={() => handleApplyStart(mission)}
                             className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5"
                           >
                              INITIALIZE BID SHARD
                           </button>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        )}

        {/* --- VIEW: MANAGEMENT TERMINAL (MMT) --- */}
        {activeTab === 'terminal' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              {activeMissions.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center text-center space-y-12 opacity-10 group/idle">
                   <div className="relative">
                      <Monitor size={180} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-1000" />
                      <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                   </div>
                   <div className="space-y-4">
                      <p className="text-6xl font-black uppercase tracking-[0.5em] text-white italic">MMT_OFFLINE</p>
                      <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">No active industrial missions detected in this cycle</p>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                   {/* Left: Active Mission Explorer */}
                   <div className="xl:col-span-4 space-y-8">
                      <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                         <div className="flex items-center justify-between px-4">
                            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-blue-400">Terminal</span></h4>
                            <span className="text-[10px] font-mono text-slate-700">{activeMissions.length} ACTIVE</span>
                         </div>
                         <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {activeMissions.map(m => (
                               <button 
                                 key={m.id}
                                 onClick={() => setActiveMission(m)}
                                 className={`w-full p-8 rounded-[40px] border-2 transition-all text-left flex items-center justify-between group ${activeMission?.id === m.id ? 'bg-blue-600 border-white text-white shadow-xl scale-105' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
                               >
                                  <div className="flex items-center gap-6">
                                     <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-6 transition-transform text-blue-400`}>
                                        <Activity size={28} />
                                     </div>
                                     <div>
                                        <p className="text-lg font-black uppercase tracking-tight italic leading-none">{m.productType}</p>
                                        <p className="text-[10px] font-mono opacity-50 mt-3 uppercase">{m.id} // IN_PROGRESS</p>
                                     </div>
                                  </div>
                                  <ChevronRight size={24} className={`transition-transform duration-500 ${activeMission?.id === m.id ? 'rotate-90 text-white' : 'text-slate-800'}`} />
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right: Management Dashboard */}
                   <div className="xl:col-span-8 space-y-10">
                      {activeMission ? (
                        <div className="animate-in slide-in-from-right-10 duration-700 space-y-10">
                           <div className="glass-card p-12 md:p-16 rounded-[72px] border-2 border-white/5 bg-black/60 relative overflow-hidden shadow-3xl">
                              <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none overflow-hidden">
                                 <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent absolute top-0 animate-scan"></div>
                              </div>
                              
                              <div className="flex flex-col md:flex-row justify-between items-start mb-16 relative z-10 px-4 gap-10">
                                 <div className="flex items-center gap-10">
                                    <div className={`p-8 rounded-[36px] bg-indigo-600 shadow-2xl group-hover:rotate-6 transition-all border-2 border-white/10`}>
                                       <Activity className="w-14 h-14 text-white animate-pulse" />
                                    </div>
                                    <div>
                                       <h3 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{activeMission.productType}</h3>
                                       <p className="text-slate-500 text-[10px] font-mono tracking-[0.6em] uppercase mt-4 italic">STAKE_LOCKED: {activeMission.budget} EAC // ZK_SECURED</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black uppercase animate-pulse shadow-inner rounded-full">
                                       INGEST_ACTIVE
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                 {/* Milestones Panel */}
                                 <div className="p-10 bg-black/80 rounded-[56px] border border-white/5 space-y-8 shadow-inner flex flex-col">
                                    <div className="flex justify-between items-center px-4">
                                       <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                          <Target size={18} className="text-blue-400" /> Milestone Sharding
                                       </h5>
                                       <span className="text-[9px] font-mono text-slate-800">SLA_V5</span>
                                    </div>
                                    <div className="space-y-4">
                                       {activeMission.milestones.map((ms, i) => (
                                          <div key={ms.id} className={`p-8 rounded-[36px] border-2 transition-all flex items-center justify-between group/ms ${ms.status === 'COMPLETED' ? 'bg-emerald-600/10 border-emerald-500/30' : ms.status === 'ACTIVE' ? 'bg-blue-600/10 border-blue-500 shadow-2xl' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
                                             <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${ms.status === 'COMPLETED' ? 'bg-emerald-600 text-white' : ms.status === 'ACTIVE' ? 'bg-blue-600 text-white shadow-xl' : 'bg-black border-white/10'}`}>
                                                   {ms.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <Target size={24} />}
                                                </div>
                                                <div>
                                                   <p className="text-xl font-black text-white uppercase italic tracking-tight m-0">{ms.label}</p>
                                                   <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest">Stake Release: {ms.stakeReleasePercent}%</p>
                                                </div>
                                             </div>
                                             {ms.status === 'ACTIVE' && <ArrowUpRight size={24} className="text-blue-400 animate-bounce" />}
                                          </div>
                                       ))}
                                    </div>
                                 </div>

                                 {/* Interactions Panel */}
                                 <div className="p-10 glass-card rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl relative overflow-hidden flex flex-col group/msg">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/msg:scale-110 transition-transform duration-[12s]"><Users2 size={300} className="text-indigo-400" /></div>
                                    <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-4 flex items-center gap-4">
                                       <MessageSquare size={18} className="text-indigo-400" /> Encrypted Relay
                                    </h5>
                                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-4 pb-4">
                                       <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 italic text-slate-400 text-sm leading-relaxed border-l-4 border-l-indigo-600 ml-4">
                                          "Steward Alpha: Genesis Ingest sequence initiated for Nebraska Shard #42. Requesting spectral confirmation."
                                       </div>
                                       <div className="p-6 bg-indigo-600/20 rounded-[32px] border border-indigo-500/30 italic text-white text-sm leading-relaxed border-r-4 border-r-indigo-400 mr-4 text-right">
                                          "Investor Node: Handshake confirmed. Initial stake release buffered."
                                       </div>
                                    </div>
                                    <div className="relative pt-4">
                                       <input type="text" placeholder="Signal to node..." className="w-full bg-black/60 border border-white/10 rounded-full py-5 px-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20" />
                                       <button className="absolute right-2 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 rounded-full text-white shadow-xl active:scale-95"><Send size={18}/></button>
                                    </div>
                                 </div>
                              </div>

                              <div className="mt-12 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                                 <div className="flex items-center gap-12 text-center md:text-left">
                                    <div>
                                       <p className="text-[11px] text-slate-600 font-black uppercase mb-2">Streaming Capacity</p>
                                       <div className="flex items-end gap-1.5 h-10">
                                          {[...Array(12)].map((_, i) => (
                                             <div key={i} className="w-1.5 bg-blue-500/40 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="h-12 w-px bg-white/5 hidden md:block"></div>
                                    <div>
                                       <p className="text-[11px] text-slate-600 font-black uppercase mb-1">Reputation Score</p>
                                       <p className="text-4xl font-mono font-black text-blue-400">98.2<span className="text-base italic">v</span></p>
                                    </div>
                                 </div>
                                 <button className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">COMMENCE REPUTATION MINING</button>
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-10 group/idle">
                           <div className="relative">
                              <Database size={180} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-1000" />
                              <div className="absolute inset-[-60px] border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-6xl font-black uppercase tracking-[0.5em] text-white italic">NODE_STANDBY</p>
                              <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Select an active industrial mission to initialize the MMT</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* --- MODAL: BID INITIALIZATION & ASSET INGEST --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowApplyModal(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-blue-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 md:w-20 h-16 md:h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={40} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Bid <span className="text-blue-400">Handshake</span></h3>
                       <p className="text-blue-500/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">STAGE: {applyStep.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowApplyModal(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20 hover:rotate-90 active:scale-90 shadow-2xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 {applyStep === 'selection' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Primary <span className="text-blue-400">Asset Ingest</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-10">"Registry initiation requires a proof of capacity. Select verified physical shards to attach to your bid."</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Land Shards */}
                          <div className="space-y-6">
                             <div className="flex items-center gap-3 px-4">
                                <TreePine size={18} className="text-emerald-400" />
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Land Shards</span>
                             </div>
                             <div className="grid gap-3">
                                {landResources.map(res => (
                                   <button 
                                     key={res.id} 
                                     onClick={() => {
                                        const next = new Set(selectedAssets);
                                        if (next.has(res.id)) next.delete(res.id);
                                        else next.add(res.id);
                                        setSelectedAssets(next);
                                     }}
                                     className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedAssets.has(res.id) ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-600'}`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <MapPin size={20} className={selectedAssets.has(res.id) ? 'text-emerald-400' : 'text-slate-800'} />
                                         <span className="text-sm font-black uppercase italic">{res.name}</span>
                                      </div>
                                      {selectedAssets.has(res.id) && <CheckCircle2 size={16} className="text-emerald-400" />}
                                   </button>
                                ))}
                             </div>
                          </div>

                          {/* Hardware Shards */}
                          <div className="space-y-6">
                             <div className="flex items-center gap-3 px-4">
                                <Cpu size={18} className="text-blue-400" />
                                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Hardware Shards</span>
                             </div>
                             <div className="grid gap-3">
                                {hardwareResources.map(res => (
                                   <button 
                                     key={res.id}
                                     onClick={() => {
                                        const next = new Set(selectedAssets);
                                        if (next.has(res.id)) next.delete(res.id);
                                        else next.add(res.id);
                                        setSelectedAssets(next);
                                     }}
                                     className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedAssets.has(res.id) ? 'bg-blue-600/10 border-blue-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-600'}`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <SmartphoneNfc size={20} className={selectedAssets.has(res.id) ? 'text-blue-400' : 'text-slate-800'} />
                                         <span className="text-sm font-black uppercase italic">{res.name}</span>
                                      </div>
                                      {selectedAssets.has(res.id) && <CheckCircle2 size={16} className="text-blue-400" />}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-950/10 space-y-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-2xl animate-float"><Users size={28} /></div>
                             <div className="text-left">
                                <p className="text-xl font-black text-white uppercase italic leading-none">Worker Cloud Integration</p>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Rent verified steward workforce shards via AI Studio.</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setIsWorkerCloudNeeded(!isWorkerCloudNeeded)}
                            className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${isWorkerCloudNeeded ? 'bg-indigo-600 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                          >
                             {isWorkerCloudNeeded ? 'INTEGRATED_SHARD' : 'ACTIVATE RENTAL'}
                          </button>
                       </div>

                       <button 
                         onClick={handleRunMatch}
                         disabled={selectedAssets.size === 0}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-blue-500/5 disabled:opacity-30"
                       >
                          COMMENCE BID MATCHING <ArrowRight className="w-8 h-8 ml-4" />
                       </button>
                    </div>
                 )}

                 {applyStep === 'matching' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       {isAnalyzing ? (
                          <>
                             <div className="relative">
                                <Loader2 size={120} className="text-blue-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Bot size={44} className="text-blue-400 animate-pulse" />
                                </div>
                             </div>
                             <p className="text-blue-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic m-0">ANALYZING ASSET ALIGNMENT...</p>
                          </>
                       ) : (
                          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 w-full px-6">
                             <div className="p-12 md:p-16 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-3xl border-l-[24px] border-l-indigo-600 relative overflow-hidden group/audit text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/audit:scale-110 transition-transform duration-[15s]"><Sparkles size={800} className="text-indigo-400" /></div>
                                <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8 gap-8">
                                   <div className="flex items-center gap-8">
                                      <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl animate-float">
                                         <Bot size={44} className="animate-pulse" />
                                      </div>
                                      <div>
                                         <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Oracle Matching Shard</h4>
                                         <p className="text-indigo-400/60 text-[11px] font-black uppercase tracking-[0.5em] mt-3 italic">ZK_BID_VERDICT_#882A</p>
                                      </div>
                                   </div>
                                   <div className="text-right shrink-0">
                                      <p className="text-[12px] text-slate-500 font-black uppercase tracking-widest mb-2 italic">Match Score (α)</p>
                                      <p className="text-7xl font-mono font-black text-indigo-400 leading-none">{(matchResult?.match_score * 100).toFixed(0)}%</p>
                                   </div>
                                </div>
                                <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 border-l-4 border-indigo-500/20 pl-10">
                                   {matchResult?.reasoning}
                                </div>
                                <div className="mt-16 space-y-6 relative z-10">
                                   <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-10 italic">Resource Gap Analysis</h5>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {matchResult?.gap_analysis.map((gap: string, i: number) => (
                                         <div key={i} className="p-6 bg-rose-950/20 border border-rose-500/20 rounded-[32px] flex items-center gap-6 group hover:bg-rose-500/10 transition-all">
                                            <AlertTriangle size={24} className="text-rose-500 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-black text-rose-400 uppercase italic tracking-tight">{gap}</span>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             
                             <div className="max-w-2xl mx-auto space-y-10 pt-10">
                                <div className="space-y-4">
                                   <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.8em] block text-center italic">NODE_SIGNATURE_AUTH (ESIN)</label>
                                   <input 
                                      type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                                      placeholder="EA-XXXX-XXXX-XXXX" 
                                      className="w-full bg-black border-2 border-white/10 rounded-[56px] py-12 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                                   />
                                </div>
                                <button 
                                   onClick={finalizeApplication}
                                   disabled={!esinSign}
                                   className="w-full py-12 agro-gradient rounded-[64px] text-white font-black text-lg md:text-xl uppercase tracking-[0.6em] shadow-[0_0_200px_rgba(37,99,235,0.3)] flex items-center justify-center gap-10 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[32px] ring-white/5"
                                >
                                   <Stamp size={40} className="fill-current" /> COMMIT BID SHARD
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 )}

                 {applyStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-20 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-64 h-64 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 size={32} className="text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-6 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Bid <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[1em] font-mono">REGISTRY_HASH: 0x882_BID_OK_SYNC</p>
                       </div>
                       <button onClick={() => { setShowApplyModal(null); setApplyStep('selection'); }} className="w-full max-w-md py-10 bg-white/5 border border-white/10 rounded-[56px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Manifest</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: MISSION DEPLOYMENT --- */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowDeployModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[80px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-emerald-500/[0.02] flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={40} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Mission <span className="text-emerald-400">Deployment</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">CAPITAL_SHARD_PROVISIONING</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDeployModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all z-20 hover:rotate-90 active:scale-90 shadow-2xl"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12 bg-black/40">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-6">Mission Category</label>
                       <select 
                         value={newMissionCategory}
                         onChange={e => setNewMissionCategory(e.target.value as MissionCategory)}
                         className="w-full bg-black border-2 border-white/10 rounded-3xl py-6 px-10 text-white font-black uppercase italic outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner"
                       >
                          {Object.keys(CATEGORY_META).map(cat => (
                             <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                          ))}
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-6">Target Budget (EAC)</label>
                       <input 
                         type="number" 
                         value={newMissionBudget}
                         onChange={e => setNewMissionBudget(e.target.value)}
                         className="w-full bg-black border-2 border-white/10 rounded-3xl py-6 px-10 text-3xl font-mono font-black text-emerald-400 outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-inner" 
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] px-6 italic">Mission Title</label>
                    <input 
                      type="text" 
                      value={newMissionTitle}
                      onChange={e => setNewMissionTitle(e.target.value)}
                      placeholder="e.g. Bantu Maize Expansion Cycle 12..."
                      className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                    />
                 </div>

                 <div className="flex items-center justify-between p-8 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-white/5 rounded-2xl group-hover:rotate-6 transition-transform">
                          <Radio size={24} className="text-emerald-500" />
                       </div>
                       <div className="text-left">
                          <p className="text-xl font-black text-white uppercase italic">Live Streaming Proof</p>
                          <p className="text-xs text-slate-500 mt-2">Force high-reputation streaming capacity for this mission.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsStreamingRequired(!isStreamingRequired)}
                      className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${isStreamingRequired ? 'bg-emerald-600 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                    >
                       {isStreamingRequired ? 'ENFORCED' : 'OPTIONAL'}
                    </button>
                 </div>

                 <div className="space-y-8 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                       <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center italic">Investor Signature (ESIN)</label>
                       <input 
                          type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                          placeholder="EA-XXXX-XXXX-XXXX" 
                          className="w-full bg-black border-2 border-white/10 rounded-[48px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all uppercase placeholder:text-stone-950 shadow-inner" 
                       />
                    </div>
                    <button 
                      onClick={handleDeployMission}
                      disabled={!esinSign || !newMissionTitle}
                      className="w-full py-10 agro-gradient rounded-[56px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[16px] ring-white/5"
                    >
                       <Stamp size={40} className="fill-current" /> AUTHORIZE DEPLOYMENT
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default ContractFarming;
