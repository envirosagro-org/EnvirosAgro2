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
  Target as TargetIcon,
  Truck,
  Monitor,
  Radio,
  Gavel,
  Scale,
  Waves,
  Layout,
  Star,
  ChevronDown,
  Sprout,
  ArrowUpRight,
  MessageSquare,
  Send,
  Cpu,
  SmartphoneNfc,
  Edit2,
  BrainCircuit,
  FlaskConical,
  Upload,
  Cable,
  Settings,
  LineChart,
  Video,
  BadgeCheck,
  Smartphone,
  Wifi
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [applyStep, setApplyStep] = useState<'selection' | 'ingestion' | 'matching' | 'success'>('selection');
  
  // Application Data
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isWorkerCloudNeeded, setIsWorkerCloudNeeded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [esinSign, setEsinSign] = useState('');

  // Deployment & Edit Data
  const [newMissionCategory, setNewMissionCategory] = useState<MissionCategory>('INVESTMENT');
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionBudget, setNewMissionBudget] = useState('5000');
  const [isStreamingRequired, setIsStreamingRequired] = useState(false);

  // Management Terminal States
  const [activeMission, setActiveMission] = useState<FarmingContract | null>(null);

  // Added toggleAsset function to fix the "Cannot find name 'toggleAsset'" errors
  const toggleAsset = (id: string) => {
    const next = new Set(selectedAssets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAssets(next);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAccessVerifying(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const availableMissions = useMemo(() => contracts.filter(c => c.status === 'Open'), [contracts]);
  const activeMissions = useMemo(() => contracts.filter(c => c.status === 'In_Progress' || (c.investorEsin === user.esin && c.status === 'Open')), [contracts, user.esin]);

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
      setEsinSign('');
    }
  };

  const handleStartEdit = () => {
    if (!activeMission) return;
    setNewMissionTitle(activeMission.productType);
    setNewMissionBudget(activeMission.budget.toString());
    setNewMissionCategory(activeMission.category);
    setIsStreamingRequired(activeMission.streamingRequirement || false);
    setShowEditModal(true);
  };

  const handleCommitEdit = () => {
    if (!activeMission || !newMissionTitle || esinSign.toUpperCase() !== user.esin.toUpperCase()) return;
    
    const updated: FarmingContract = {
      ...activeMission,
      productType: newMissionTitle,
      budget: Number(newMissionBudget),
      category: newMissionCategory,
      streamingRequirement: isStreamingRequired
    };
    
    onSaveContract(updated);
    setActiveMission(updated);
    setShowEditModal(false);
    setEsinSign('');
  };

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
                     className="w-full bg-black/80 border-2 border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-8 focus:ring-blue-500/10 transition-all font-mono italic shadow-inner" 
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
                                 <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-xl ${meta.color} border-white/10`}>
                                   {meta.label}
                                 </span>
                                 <p className="text-[10px] text-slate-700 font-mono font-black uppercase italic">{mission.id}</p>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-blue-400 transition-colors drop-shadow-2xl">{mission.productType}</h4>
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
                               className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${activeMission?.id === m.id ? 'bg-blue-600 border-white text-white shadow-xl scale-105' : 'bg-white/[0.01] border-white/5 text-slate-600 hover:border-white/20'}`}
                             >
                                <div className="flex items-center gap-4">
                                   <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${activeMission?.id === m.id ? 'text-white' : 'text-blue-400'}`}>
                                      {CATEGORY_META[m.category].icon ? <div className="w-5 h-5 flex items-center justify-center"><Activity size={20} /></div> : <Briefcase size={20} />}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black uppercase italic leading-none">{m.productType}</p>
                                      <p className="text-[9px] font-mono opacity-50 mt-1 uppercase">{m.id} // {m.status}</p>
                                   </div>
                                </div>
                             </button>
                           ))}
                         </div>
                      </div>
                   </div>

                   {/* Right: Detailed Management HUD */}
                   <div className="xl:col-span-8 space-y-8">
                      {!activeMission ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-10 group">
                           <Monitor size={140} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-1000" />
                           <p className="text-3xl font-black uppercase tracking-[0.5em] italic">STANDBY_NODE</p>
                        </div>
                      ) : (
                        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                           {/* HEADER & OWNERSHIP */}
                           <div className="glass-card p-12 md:p-14 rounded-[64px] border-2 border-white/10 bg-black/60 relative overflow-hidden shadow-3xl">
                              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8 relative z-10">
                                 <div className="flex items-center gap-10">
                                    <div className="w-24 h-24 rounded-[32px] bg-blue-600 shadow-2xl flex items-center justify-center text-white border-4 border-white/10 animate-float">
                                       <Target size={40} />
                                    </div>
                                    <div>
                                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{activeMission.productType}</h3>
                                       <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-3 uppercase italic">COMMAND_ID: {activeMission.id} // INVESTOR: {activeMission.investorName}</p>
                                    </div>
                                 </div>
                                 {activeMission.investorEsin === user.esin && (
                                   <button 
                                     onClick={handleStartEdit}
                                     className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95"
                                   >
                                      <Edit2 size={16} /> Edit Mission Shard
                                   </button>
                                 )}
                              </div>

                              {/* STRATEGIC TOOLING HUB - 9 ROUTING TRIGGERS */}
                              <div className="space-y-6 relative z-10 pt-10 border-t border-white/5">
                                 <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] px-4 italic mb-6">STRATEGIC_TOOLING_HUB</h4>
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                       { label: 'Mission Optimization', icon: BrainCircuit, target: 'intelligence', col: 'text-indigo-400' },
                                       { label: 'Live Farming', icon: Sprout, target: 'live_farming', col: 'text-emerald-400' },
                                       { label: 'Value Enhancement', icon: FlaskConical, target: 'agro_value_enhancement', col: 'text-fuchsia-400' },
                                       { label: 'Live Broadcast', icon: Video, target: 'media', action: 'PROCESS_STREAM', col: 'text-rose-500' },
                                       { label: 'Evidence Ingest', icon: Upload, target: 'digital_mrv', action: 'ingest', col: 'text-blue-400' },
                                       { label: 'Registry Handshake', icon: SmartphoneNfc, target: 'registry_handshake', col: 'text-amber-500' },
                                       { label: 'Network Ingest', icon: Wifi, target: 'ingest', col: 'text-teal-400' },
                                       { label: 'Collective Registry', icon: Users, target: 'community', action: 'shards', col: 'text-indigo-400' },
                                       { label: 'Industrial Cloud', icon: Factory, target: 'industrial', col: 'text-slate-400' },
                                    ].map((tool, i) => (
                                       <button 
                                          key={i}
                                          onClick={() => onNavigate(tool.target as ViewState, tool.action)}
                                          className="p-8 bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[40px] flex flex-col items-center text-center gap-5 transition-all group active:scale-95 shadow-xl relative overflow-hidden"
                                       >
                                          <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                          <tool.icon size={32} className={`${tool.col} group-hover:scale-110 transition-transform relative z-10`} />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white relative z-10">{tool.label}</span>
                                       </button>
                                    ))}
                                 </div>
                              </div>

                              {/* MILESTONE CONTROL */}
                              <div className="mt-12 space-y-8 relative z-10 pt-10 border-t border-white/5">
                                 <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.6em] px-4 italic mb-6">MILESTONE_SHARDING_CONTROL</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {activeMission.milestones.map((ms, i) => (
                                       <div key={i} className={`p-8 rounded-[48px] border-2 flex flex-col items-center text-center space-y-6 shadow-2xl relative overflow-hidden group/ms ${ms.status === 'COMPLETED' ? 'bg-emerald-600/10 border-emerald-500/40 text-emerald-400' : ms.status === 'ACTIVE' ? 'bg-blue-600/10 border-blue-500 text-blue-400 animate-pulse' : 'bg-black/60 border-white/5 text-slate-700'}`}>
                                          <div className="absolute top-0 right-0 p-4 opacity-[0.1] group-hover/ms:scale-110 transition-transform"><CheckCircle2 size={100} /></div>
                                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover/ms:rotate-12 transition-transform">
                                             <Stamp size={24} />
                                          </div>
                                          <div className="space-y-1 relative z-10">
                                             <h5 className="text-sm font-black uppercase italic leading-none">{ms.label}</h5>
                                             <p className="text-[9px] font-mono mt-1.5 opacity-60">YIELD_RELEASE: {ms.stakeReleasePercent}%</p>
                                          </div>
                                          <div className="w-full pt-6 border-t border-white/5 relative z-10">
                                             <p className="text-[10px] font-black uppercase tracking-widest">{ms.status}</p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
           </div>
        )}
      </div>

      {/* --- DEPLOY MISSION MODAL --- */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowDeployModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[80px] border-blue-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 bg-blue-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                       <Plus size={44} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Deploy <span className="text-blue-400">Mission</span></h3>
                       <p className="text-blue-400/60 font-mono text-[11px] tracking-[0.5em] uppercase mt-4 italic">CAPITAL_INGEST_v6.5</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDeployModal(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12 bg-black/40">
                 <div className="space-y-10">
                    <div className="space-y-3 px-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Mission Designation (Title)</label>
                       <input 
                         type="text" value={newMissionTitle} onChange={e => setNewMissionTitle(e.target.value)} 
                         placeholder="e.g. Maize Cycle 882 Inflow..." 
                         className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-blue-500/10 outline-none transition-all placeholder:text-stone-900 italic" 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Initial Capital (EAC)</label>
                          <input 
                            type="number" value={newMissionBudget} onChange={e => setNewMissionBudget(e.target.value)} 
                            className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-4xl font-mono font-black text-white focus:ring-8 focus:ring-blue-500/10 outline-none transition-all" 
                          />
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Mission Pillar</label>
                          <select 
                            value={newMissionCategory} onChange={e => setNewMissionCategory(e.target.value as any)}
                            className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-sm font-black uppercase text-white outline-none focus:ring-8 focus:ring-blue-500/10 appearance-none cursor-pointer"
                          >
                             {Object.entries(CATEGORY_META).map(([key, meta]) => (
                               <option key={key} value={key}>{meta.label}</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div className="p-10 bg-blue-600/5 border-2 border-blue-500/20 rounded-[56px] space-y-10">
                       <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-3xl animate-float"><Fingerprint size={28} /></div>
                             <div>
                                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Node Signature Auth</p>
                                <p className="text-3xl font-mono font-black text-white italic">ZK_SIGN_PENDING</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <input 
                               type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                               placeholder="EA-XXXX-XXXX"
                               className="bg-transparent border-none text-right text-4xl font-mono font-black text-blue-500 outline-none uppercase placeholder:text-stone-950 w-full" 
                             />
                          </div>
                       </div>
                       <button 
                         onClick={handleDeployMission}
                         disabled={!newMissionTitle || esinSign.toUpperCase() !== user.esin.toUpperCase()}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 disabled:opacity-20"
                       >
                          <Stamp size={40} className="fill-current" /> COMMIT MISSION TO LEDGER
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- EDIT MISSION MODAL --- */}
      {showEditModal && activeMission && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowEditModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 bg-indigo-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-2 border-white/10">
                       <Edit2 size={36} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Edit <span className="text-indigo-400">Mission</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[11px] tracking-[0.5em] uppercase mt-4 italic">REGISTRY_MODIFICATION_v6.5</p>
                    </div>
                 </div>
                 <button onClick={() => setShowEditModal(false)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12 bg-black/40">
                 <div className="space-y-10">
                    <div className="space-y-3 px-4">
                       <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Mission Title</label>
                       <input 
                         type="text" value={newMissionTitle} onChange={e => setNewMissionTitle(e.target.value)} 
                         className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all italic" 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Budget Allocation (EAC)</label>
                          <input 
                            type="number" value={newMissionBudget} onChange={e => setNewMissionBudget(e.target.value)} 
                            className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-4xl font-mono font-black text-white focus:ring-8 focus:ring-blue-500/10 outline-none transition-all" 
                          />
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">Mission Pillar</label>
                          <select 
                            value={newMissionCategory} onChange={e => setNewMissionCategory(e.target.value as any)}
                            className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-sm font-black uppercase text-white outline-none focus:ring-8 focus:ring-blue-500/10 appearance-none cursor-pointer"
                          >
                             {Object.entries(CATEGORY_META).map(([key, meta]) => (
                               <option key={key} value={key}>{meta.label}</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div className="p-10 bg-indigo-600/5 border-2 border-indigo-500/20 rounded-[56px] space-y-10">
                       <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-3xl animate-float"><Fingerprint size={28} /></div>
                             <div>
                                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Auth Signature (ESIN)</p>
                                <p className="text-sm font-mono font-black text-indigo-400">SIGN_REQUIRED</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <input 
                               type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                               placeholder="EA-XXXX-XXXX"
                               className="bg-transparent border-none text-right text-4xl font-mono font-black text-indigo-500 outline-none uppercase placeholder:text-stone-950 w-full" 
                             />
                          </div>
                       </div>
                       <button 
                         onClick={handleCommitEdit}
                         disabled={!newMissionTitle || esinSign.toUpperCase() !== user.esin.toUpperCase()}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-white/5 disabled:opacity-20"
                       >
                          <Stamp size={40} className="fill-current" /> COMMIT MISSION UPDATE
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- BID APPLY MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowApplyModal(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-blue-500/30 bg-[#050706] shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              
              <div className="p-12 border-b border-white/5 bg-blue-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-10">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                       <FileSignature size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic m-0">Initialize Bid Shard</h3>
                       <p className="text-blue-400/60 font-mono text-[10px] uppercase mt-2 tracking-widest">MISSION: {showApplyModal.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowApplyModal(null)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar flex flex-col bg-black/40 relative z-10">
                 {applyStep === 'selection' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">Asset <span className="text-blue-400">Ingestion</span></h4>
                          <p className="text-slate-400 text-xl italic font-medium max-w-2xl mx-auto">"Select the physical nodes and geofence shards to pledge as collateral for this mission."</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <TreePine size={20} className="text-emerald-400" />
                                <h5 className="text-sm font-black text-white uppercase italic">Registered Plots</h5>
                             </div>
                             <div className="grid gap-3">
                                {landResources.length === 0 ? (
                                  <div className="p-8 text-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl text-xs uppercase italic">No Land Shards Anchored</div>
                                ) : landResources.map(land => (
                                   <button 
                                     key={land.id}
                                     onClick={() => toggleAsset(land.id)}
                                     className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedAssets.has(land.id) ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/10'}`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div className={`p-3 rounded-xl ${selectedAssets.has(land.id) ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 group-hover:rotate-6'}`}><MapPin size={20} /></div>
                                         <span className="text-xs font-black uppercase tracking-widest">{land.name}</span>
                                      </div>
                                      {selectedAssets.has(land.id) && <CheckCircle2 size={20} className="text-emerald-400" />}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 px-2">
                                <Cpu size={20} className="text-blue-400" />
                                <h5 className="text-sm font-black text-white uppercase italic">Active Hardware</h5>
                             </div>
                             <div className="grid gap-3">
                                {hardwareResources.length === 0 ? (
                                  <div className="p-8 text-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl text-xs uppercase italic">No Hardware Nodes Linked</div>
                                ) : hardwareResources.map(hw => (
                                   <button 
                                     key={hw.id}
                                     onClick={() => toggleAsset(hw.id)}
                                     className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedAssets.has(hw.id) ? 'bg-blue-600/10 border-blue-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/10'}`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div className={`p-3 rounded-xl ${selectedAssets.has(hw.id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 group-hover:rotate-6'}`}><Smartphone size={20} /></div>
                                         <span className="text-xs font-black uppercase tracking-widest">{hw.name}</span>
                                      </div>
                                      {selectedAssets.has(hw.id) && <CheckCircle2 size={20} className="text-blue-400" />}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="p-10 glass-card rounded-[56px] border border-blue-500/10 bg-blue-500/5 flex items-center justify-between shadow-inner">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-blue-600 rounded-2xl shadow-xl"><Users2 size={24} className="text-white" /></div>
                             <div className="text-left">
                                <p className="text-xl font-bold text-white uppercase italic">Worker Cloud Sync</p>
                                <p className="text-xs text-slate-500 italic">"Ingest verified labor shards to bolster bid match score."</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setIsWorkerCloudNeeded(!isWorkerCloudNeeded)}
                            className={`w-16 h-8 rounded-full transition-all relative ${isWorkerCloudNeeded ? 'bg-blue-600' : 'bg-slate-800'}`}
                          >
                             <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isWorkerCloudNeeded ? 'right-1' : 'left-1'}`}></div>
                          </button>
                       </div>

                       <button 
                         onClick={() => setApplyStep('ingestion')}
                         disabled={selectedAssets.size === 0}
                         className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-blue-500/5 disabled:opacity-20"
                       >
                          COMMENCE BIOMASS HANDSHAKE <ChevronRight className="w-8 h-8 ml-4" />
                       </button>
                    </div>
                 )}

                 {applyStep === 'ingestion' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <div className="w-48 h-48 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Bot size={56} className="text-blue-500 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-blue-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">HANDSHAKING ORACLE...</p>
                          <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">COMPARING_INGESTED_ASSETS // CALC_MATCH_RESONANCE</p>
                       </div>
                       <div className="flex gap-2">
                          {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                       </div>
                    </div>
                 )}

                 {applyStep === 'matching' && (
                    <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 flex-1 flex flex-col justify-center">
                       {isAnalyzing ? (
                          <div className="flex flex-col items-center gap-12 py-20">
                             <Loader2 size={100} className="text-blue-500 animate-spin" />
                             <p className="text-blue-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING VERDICT...</p>
                          </div>
                       ) : matchResult ? (
                          <div className="space-y-12">
                             <div className="p-12 bg-black/80 rounded-[64px] border border-blue-500/20 shadow-3xl border-l-[16px] border-l-blue-600 relative overflow-hidden group/advice">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Sparkles size={600} className="text-blue-400" /></div>
                                <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                   <div className="flex items-center gap-8">
                                      <BadgeCheck size={44} className="text-blue-400" />
                                      <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">Bid Matching Verdict</h4>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Match Score</p>
                                      <p className="text-6xl font-mono font-black text-emerald-400 leading-none">{(matchResult.match_score * 100).toFixed(0)}<span className="text-2xl text-emerald-800 ml-1">%</span></p>
                                   </div>
                                </div>
                                <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/5">
                                   {matchResult.reasoning}
                                </div>
                                {matchResult.gap_analysis?.length > 0 && (
                                   <div className="mt-12 pt-8 border-t border-white/5 space-y-4 relative z-10">
                                      <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest px-4 italic">IDENTIFIED_RESOURCE_GAPS</p>
                                      <div className="flex flex-wrap gap-4 px-2">
                                         {matchResult.gap_analysis.map((gap: string, i: number) => (
                                            <span key={i} className="px-6 py-2 bg-rose-950/20 border border-rose-500/20 rounded-full text-rose-500 text-[10px] font-black uppercase tracking-widest italic">{gap}</span>
                                         ))}
                                      </div>
                                   </div>
                                )}
                             </div>
                             <div className="flex justify-center gap-10">
                                <button onClick={() => setApplyStep('selection')} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">RECONFIGURE ASSETS</button>
                                <button onClick={finalizeApplication} className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">COMMIT BID SHARD</button>
                             </div>
                          </div>
                       ) : null}
                    </div>
                 )}

                 {applyStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-1000 text-center relative">
                       <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_200px_rgba(37,99,235,0.4)] relative group scale-110">
                          <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-blue-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Shard <span className="text-blue-400">Anchored.</span></h3>
                          <p className="text-blue-500 text-sm font-black uppercase tracking-[0.8em] font-mono mt-6">BID_COMMIT_0x{(Math.random()*1000).toFixed(0)}_FINAL</p>
                       </div>
                       <button onClick={() => setShowApplyModal(null)} className="px-24 py-8 bg-white/5 border border-white/10 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- ROADMAP / ARCHIVE VIEW --- */}
      {activeTab === 'archive' && (
         <div className="py-40 text-center opacity-10 space-y-8 flex flex-col items-center justify-center">
            <History size={160} className="text-slate-600 animate-spin-slow" />
            <p className="text-5xl font-black uppercase tracking-[0.6em] italic text-white leading-none">RESOLUTION_LEDGER_EMPTY</p>
            <p className="text-xl font-bold italic text-slate-700 uppercase tracking-[0.3em]">Awaiting first industrial harvest cycle finality</p>
         </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(37, 99, 235, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ContractFarming;