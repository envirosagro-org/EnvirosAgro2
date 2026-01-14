
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Gavel, ShieldCheck, X, Zap, ChevronRight, Loader2, Users2, Users, RefreshCcw, Briefcase, Layers, Database, PlusCircle, Rocket, ArrowLeft, BarChart3, MessageSquare, Video, Mic, Calendar, Target, Heart, Volume2, Plus, Send, Leaf, Dna, Landmark, Sparkles, Cpu, Monitor, Activity, Bookmark, Share2, Trophy, History, TrendingUp, Globe, Star, Clock, UserCheck, Mail, FileText, BadgeAlert, BadgeCheck, Coins, Hammer, GanttChartSquare, Network, ArrowUpRight, TrendingDown, PieChart as PieChartIcon, HardHat, Factory, Boxes, ShieldAlert, ClipboardCheck, ChevronLeft, ArrowRight, Warehouse, Fingerprint, Link2, Shield, Gauge, Satellite, Radio, Signal, CirclePlay, Maximize, ArrowDownUp, LayoutGrid, HeartPulse, Brain, Waves, LineChart as LucideLineChart, Handshake, FileCode, Lock, Eye, Key, CheckCircle2, Bot, Download, Building2, Paperclip, Flame, ImageIcon, Upload, UserPlus, Podcast, FileUp, FlaskConical, BadgeDollarSign, Stamp, FileSignature, FileBadge, AlertTriangle, PlaneTakeoff, Terminal, Trello,
  SearchCode,
  Microscope,
  UserCheck2,
  LockKeyhole,
  Building,
  Scale,
  ArrowLeftCircle,
  FileSearch,
  CheckCircle,
  BarChart4,
  GraduationCap,
  Info,
  Smartphone,
  Settings,
  ShieldX,
  Trash2,
  EyeOff,
  UserMinus,
  ToggleLeft,
  ToggleRight,
  ClipboardList,
  Filter,
  UserCog,
  FilePlus,
  Unlock,
  DollarSign
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { User, AgroProject, WorkerProfile, ViewState, ProjectTask } from '../types';
import { SignalShard } from '../App';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSendProposal?: (signal: Omit<SignalShard, 'id' | 'timestamp' | 'read'>) => void;
  collectives: any[];
  setCollectives: React.Dispatch<React.SetStateAction<any[]>>;
  onAddProject?: (project: AgroProject) => void;
  onUpdateProject?: (project: AgroProject) => void;
  pendingAction?: string | null;
  clearAction?: () => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const MIN_MEMBERS_REQUIRED = 3;
const PROJECT_ANCHOR_FEE = 150;
const FACILITY_INGEST_FEE = 1000;
const COLLECTIVE_REG_FEE = 200;
const CONTRACT_DRAFT_FEE = 50;

const MOCK_TENDERS = [
  { id: 'TND-2025-01', facility: 'Omaha Ingest Hub', requirement: 'Bio-Nitrogen Array Installation', budget: 45000, biddable: true, timeRemaining: '24h' },
  { id: 'TND-2025-02', facility: 'Nairobi Seed Vault', requirement: 'Spectral Cold Chain Maintenance', budget: 12500, biddable: true, timeRemaining: '6h' },
];

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', skills: ['Soil Science', 'Spectral Analysis', 'Nitrogen Sharding'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000 },
  { id: 'W-02', name: 'Marcus T.', skills: ['Hydroponics', 'IoT Maintenance', 'Drone Fleet Op'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000 },
  { id: 'W-03', name: 'Elena Rodriguez', skills: ['Permaculture', 'Social Care', 'Bantu Heritage'], sustainabilityRating: 92, verifiedHours: 1560, isOpenToWork: false, lifetimeEAC: 28000 },
  { id: 'W-04', name: 'John Doe', skills: ['Precision Tilling', 'Satellite Ingest'], sustainabilityRating: 78, verifiedHours: 450, isOpenToWork: true, lifetimeEAC: 5000 },
  { id: 'W-05', name: 'Steward Nairobi', skills: ['Lineage Seed Curation', 'Registry Audit'], sustainabilityRating: 99, verifiedHours: 5200, isOpenToWork: true, lifetimeEAC: 124000 },
];

const GLOBAL_PERFORMANCE_DATA = [
  { time: 'T-12', yield: 4.2, m_cons: 1.2, ca: 3.8 },
  { time: 'T-10', yield: 4.8, m_cons: 1.3, ca: 4.1 },
  { time: 'T-08', yield: 5.5, m_cons: 1.4, ca: 4.5 },
  { time: 'T-06', yield: 5.2, m_cons: 1.4, ca: 4.8 },
  { time: 'T-04', yield: 6.8, m_cons: 1.5, ca: 5.2 },
  { time: 'T-02', yield: 14.1, m_cons: 1.6, ca: 5.8 },
  { time: 'NOW', yield: 18.2, m_cons: 1.6, ca: 6.4 },
];

type BidStep = 'evaluation' | 'selection' | 'approval' | 'transaction' | 'improvement' | 'development' | 'success';

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, onEarnEAC, onSendProposal, collectives, setCollectives, 
  onAddProject, onUpdateProject, pendingAction, clearAction, onNavigate 
}) => {
  const [activeView, setActiveView] = useState<'registry' | 'talent' | 'collectives' | 'missions' | 'analytics'>('analytics');
  
  const [selectedCollectiveId, setSelectedCollectiveId] = useState<string | null>(null);
  const [internalColTab, setInternalColTab] = useState<'stream' | 'missions' | 'tasks' | 'members' | 'settings'>('stream');
  const currentCollective = collectives.find(c => c.id === selectedCollectiveId);
  
  const [invitingToColId, setInvitingToColId] = useState<string | null>(null);
  const [selectedWorkerForDossier, setSelectedWorkerForDossier] = useState<WorkerProfile | null>(null);
  const [isDossierLoading, setIsDossierLoading] = useState(false);
  
  const [showRegisterCollective, setShowRegisterCollective] = useState(false);
  const [showIndustryEntry, setShowIndustryEntry] = useState(false);
  const [showRegisterMission, setShowRegisterMission] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTenderForBid, setSelectedTenderForBid] = useState<any>(null);

  const [dossierStep, setDossierStep] = useState<'profile' | 'contract_config' | 'sign' | 'protocol' | 'success'>('profile');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [targetMissionId, setTargetMissionId] = useState<string | null>(null);

  const [newColName, setNewColName] = useState('');
  const [newColMission, setNewColMission] = useState('');
  const [newColObjectives, setNewColObjectives] = useState('');
  const [newColType, setNewColType] = useState<'Team' | 'Clan' | 'Society'>('Team');
  const [newColRegion, setNewColRegion] = useState(user.location);
  const [chatMessage, setChatMessage] = useState('');
  const [colRegStep, setColRegStep] = useState<'form' | 'payment' | 'protocol' | 'success'>('form');

  const [bidValue, setBidValue] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [bidStep, setBidStep] = useState<BidStep>('evaluation');

  const [legalEntityName, setLegalEntityName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [industryStep, setIndustryStep] = useState<'form' | 'payment' | 'protocol' | 'success'>('form');

  const [missionName, setMissionName] = useState('');
  const [missionGoal, setMissionGoal] = useState('50000');
  const [selectedColForMission, setSelectedColForMission] = useState<string>('');
  const [missionRegStep, setMissionRegStep] = useState<'config' | 'payment' | 'protocol' | 'success'>('config');

  // Task Registration State
  const [showTaskReg, setShowTaskReg] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskThrust, setNewTaskThrust] = useState('Technological');

  // Talent Filter States
  const [talentSearch, setTalentSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Skills');

  const isAdmin = currentCollective?.adminEsin === user.esin;

  useEffect(() => {
    if (!pendingAction) return;

    switch (pendingAction) {
      case 'OPEN_REGISTRY':
        setActiveView('registry');
        break;
      case 'OPEN_TALENT':
        setActiveView('talent');
        break;
      case 'VIEW_PERFORMANCE':
        setActiveView('analytics');
        break;
      case 'FORM_COLLECTIVE':
        setActiveView('collectives');
        handleOpenFormGroup();
        break;
      case 'REGISTER_NODE':
        setActiveView('registry');
        setIndustryStep('form');
        setShowIndustryEntry(true);
        break;
      case 'PLACE_BID':
        setActiveView('registry');
        if (MOCK_TENDERS.length > 0) {
          setSelectedTenderForBid(MOCK_TENDERS[0]);
          setBidValue(MOCK_TENDERS[0].budget.toString());
          setBidStep('evaluation');
          setShowBidModal(true);
        }
        break;
      case 'LAUNCH_MISSION':
        setActiveView('missions');
        handleOpenNewCampaign();
        break;
      case 'VIEW_DOSSIER':
        setActiveView('talent');
        handleOpenFullDossier(MOCK_WORKERS[0]);
        break;
    }

    if (clearAction) clearAction();
  }, [pendingAction, clearAction]);

  const handleOpenFormGroup = () => {
    setNewColName('');
    setNewColMission('');
    setNewColObjectives('');
    setNewColRegion(user.location);
    setColRegStep('form');
    setShowRegisterCollective(true);
  };

  const handleOpenNewCampaign = () => {
    setSelectedColForMission(selectedCollectiveId || '');
    setMissionName('');
    setMissionGoal('50000');
    setMissionRegStep('config');
    setShowRegisterMission(true);
  };

  const handleOpenFullDossier = (worker: WorkerProfile) => {
    setIsDossierLoading(true);
    setSelectedWorkerForDossier(worker);
    setDossierStep('profile');
    setShowDossierModal(true);
    setTimeout(() => setIsDossierLoading(false), 800);
  };

  const handleAuthorizeCollectivePayment = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN verification failed.");
      return;
    }
    if (onSpendEAC(COLLECTIVE_REG_FEE, 'COLLECTIVE_REGISTRATION_FEE')) {
      setColRegStep('protocol');
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for registration.");
    }
  };

  const handleFinalizeCollective = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newCol = {
        id: `COLL-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: newColName,
        adminEsin: user.esin,
        members: [{ id: user.esin, name: user.name, sustainabilityRating: user.metrics.sustainabilityScore }],
        type: newColType,
        mission: newColMission,
        region: newColRegion,
        resonance: 50,
        objectives: newColObjectives.split('\n').filter(o => o.trim()),
        signals: [],
        recruitmentActive: true,
        publicVisible: true,
        missionCampaign: { active: false, title: '', target: 0, pool: 0, isPreAudited: false }
      };
      setCollectives([...collectives, newCol]);
      setIsProcessing(false);
      setColRegStep('success');
    }, 2000);
  };

  const handleRegisterIndustryPayment = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN verification failed.");
      return;
    }
    if (onSpendEAC(FACILITY_INGEST_FEE, 'INDUSTRY_FACILITY_INGEST_FEE')) {
      setIndustryStep('protocol');
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for facility ingest.");
    }
  };

  const handleFinalizeIndustry = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIndustryStep('success');
    }, 2000);
  };

  const handleRegisterMissionPayment = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: ESIN verification failed.");
      return;
    }
    setMissionRegStep('protocol');
  };

  const handleFinalizeMission = () => {
    const targetCol = collectives.find(c => c.id === selectedColForMission);
    if (!targetCol) return;
    setIsProcessing(true);
    setTimeout(() => {
      setCollectives(prev => prev.map(c => c.id === targetCol.id ? {
        ...c,
        missionCampaign: { 
          active: true, 
          title: missionName || 'New Collective Mission', 
          target: Number(missionGoal), 
          pool: 0, 
          isPreAudited: false,
          savingsPool: 0,
          returnsPool: 0,
          tasks: [] 
        }
      } : c));
      setIsProcessing(false);
      setMissionRegStep('success');
    }, 1500);
  };

  const handleTaskRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    // Process registry fee for task
    if (!onSpendEAC(10, `TASK_REGISTRY_${newTaskTitle}`)) return;

    const newTask: ProjectTask = {
      id: `TSK-${Math.random().toString(36).substring(7).toUpperCase()}`,
      title: newTaskTitle,
      status: 'Backlog',
      thrust: newTaskThrust,
      esinSign: user.esin
    };

    setCollectives(prev => prev.map(c => c.id === selectedCollectiveId ? {
      ...c,
      missionCampaign: {
        ...c.missionCampaign,
        tasks: [...(c.missionCampaign.tasks || []), newTask]
      }
    } : c));

    setNewTaskTitle('');
    setShowTaskReg(false);
    alert("TASK ANCHORED: Shard committed to industrial ledger.");
  };

  const handleDeleteCollective = () => {
    if (!isAdmin) return;
    if (confirm("DANGER: This will permanently wipe this social shard from the registry. Proceed?")) {
      setCollectives(prev => prev.filter(c => c.id !== selectedCollectiveId));
      setSelectedCollectiveId(null);
    }
  };

  const handleSendMessageLocal = () => {
    if (!chatMessage.trim() || !selectedCollectiveId) return;
    const newSignal = { from: user.name, text: chatMessage, timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: 'text' };
    setCollectives(prev => prev.map(c => c.id === selectedCollectiveId ? { ...c, signals: [...(c.signals || []), newSignal] } : c));
    setChatMessage('');
  };

  const filteredWorkers = MOCK_WORKERS.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(talentSearch.toLowerCase()) || 
                          w.skills.some(s => s.toLowerCase().includes(talentSearch.toLowerCase()));
    const matchesSkill = skillFilter === 'All Skills' || w.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  const allSkills = Array.from(new Set(MOCK_WORKERS.flatMap(w => w.skills)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
      {/* HUD & Utility Header */}
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-indigo-400 font-black uppercase tracking-widest">Shard: INDUSTRIAL_CORE</span>
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
        </div>
      </div>

      {/* Main Feature Navigation - Horizontally Scrollable on Mobile */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 p-1.5 glass-card rounded-[32px] w-full overflow-x-auto scrollbar-hide border border-white/5 bg-black/40 shadow-xl snap-x">
          {[
            { id: 'analytics', label: 'Global Performance', icon: BarChart3 },
            { id: 'registry', label: 'Industrial Registry', icon: Building2 },
            { id: 'talent', label: 'Worker Cloud', icon: Users2 },
            { id: 'collectives', label: 'Social Shard Portal', icon: Share2 },
            { id: 'missions', label: 'Mission Launchpad', icon: Rocket },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveView(tab.id as any); setSelectedCollectiveId(null); setInvitingToColId(null); }}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start ${activeView === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[700px]">
        {/* Missions View - Launchpad */}
        {activeView === 'missions' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 px-4 gap-6">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-indigo-400">Launchpad</span></h3>
                    <p className="text-slate-500 text-sm mt-1">Initialize campaigns and follow physical verification protocols for global anchoring.</p>
                 </div>
                 <button onClick={handleOpenNewCampaign} className="w-full md:w-auto px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                    <PlusCircle size={20} /> Initialize New Campaign
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {collectives.filter(c => c.missionCampaign?.active).map(col => {
                   const quorumMet = (col.members || []).length >= MIN_MEMBERS_REQUIRED;
                   const capitalMet = (col.missionCampaign?.pool || 0) >= (col.missionCampaign?.target || 0) * 0.5;
                   
                   return (
                   <div key={col.id} onClick={() => { setSelectedCollectiveId(col.id); setInternalColTab('missions'); }} className={`glass-card p-10 rounded-[56px] border-2 transition-all relative overflow-hidden flex flex-col group cursor-pointer ${col.missionCampaign.launched ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-indigo-500/20 bg-black/40'}`}>
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-3xl ${col.missionCampaign.launched ? 'bg-emerald-500' : 'bg-indigo-600'} shadow-xl`}>
                               <PlaneTakeoff className="w-10 h-10 text-white" />
                            </div>
                            <div>
                               <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{col.missionCampaign.title}</h4>
                               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Originated by {col.name}</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 space-y-10 relative z-10">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                               <span className="text-slate-500 flex items-center gap-2"><Users2 className="w-3 h-3 text-blue-400" /> Member Quorum</span>
                               <span className={quorumMet ? 'text-emerald-400' : 'text-blue-400'}>{(col.members || []).length} / {MIN_MEMBERS_REQUIRED} Nodes</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                               <div className={`h-full rounded-full transition-all duration-[2s] shadow-[0_0_20px_rgba(59,130,246,0.3)] ${quorumMet ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, ((col.members || []).length / MIN_MEMBERS_REQUIRED) * 100)}%` }}></div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                               <span className="text-slate-500 flex items-center gap-2"><Coins className="w-3 h-3 text-emerald-400" /> Capital Synergy Meter</span>
                               <span className="text-white font-mono">{((col.missionCampaign.pool / col.missionCampaign.target) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                               <div className={`h-full rounded-full transition-all duration-[2s] shadow-[0_0_20px_rgba(59,130,246,0.3)] ${capitalMet ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(100, (col.missionCampaign.pool / col.missionCampaign.target) * 100)}%` }}></div>
                            </div>
                         </div>
                      </div>
                   </div>
                 )})}
              </div>
           </div>
        )}

        {/* Collectives View - Shard Portal */}
        {activeView === 'collectives' && (
           <div className="animate-in fade-in duration-700">
              {selectedCollectiveId && currentCollective ? (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 px-4">
                   <div className="flex flex-col xl:flex-row items-center justify-between border-b border-white/5 pb-8 gap-6">
                      <div className="flex items-center gap-4 w-full xl:w-auto">
                         <button onClick={() => setSelectedCollectiveId(null)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all group/back">
                             <ChevronLeft className="w-6 h-6 group-hover/back:-translate-x-1 transition-transform" />
                         </button>
                         <div className="flex items-center gap-6">
                             <div className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] md:rounded-[32px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                 <Share2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                             </div>
                             <div>
                                 <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none truncate max-w-[200px] md:max-w-none">{currentCollective.name}</h3>
                                 <p className="text-emerald-500/60 font-mono text-[8px] md:text-[10px] tracking-[0.4em] uppercase mt-2">{currentCollective.id} // {currentCollective.type.toUpperCase()}</p>
                             </div>
                         </div>
                      </div>
                      
                      {/* Horizontal Scrolling Sub-navigation for Collective */}
                      <div className="relative w-full xl:w-auto">
                        <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl gap-2 overflow-x-auto scrollbar-hide snap-x">
                           {[
                             { id: 'stream', label: 'Stream', icon: MessageSquare },
                             { id: 'missions', label: 'Missions', icon: Rocket },
                             { id: 'tasks', label: 'Task Shards', icon: Trello },
                             { id: 'members', label: 'Nodes', icon: Users },
                             { id: 'settings', label: 'Governance', icon: Settings }
                           ].map(t => (
                             <button key={t.id} onClick={() => setInternalColTab(t.id as any)} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap snap-start ${internalColTab === t.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                               <t.icon size={14} /> {t.label}
                             </button>
                           ))}
                        </div>
                      </div>
                   </div>

                   {/* Mission Sub-tab inside Collective */}
                   {internalColTab === 'missions' && (
                     <div className="space-y-10 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-2xl font-black text-white uppercase italic">Shard <span className="text-indigo-400">Missions</span></h4>
                           {isAdmin && !currentCollective.missionCampaign?.active && (
                              <button onClick={handleOpenNewCampaign} className="px-6 py-2 bg-indigo-600 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">Launch New Mission</button>
                           )}
                        </div>
                        {currentCollective.missionCampaign?.active ? (
                           <div className="glass-card p-12 rounded-[64px] border border-white/10 bg-black/40 relative overflow-hidden flex flex-col md:flex-row items-center gap-14 group text-center md:text-left">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Rocket size={240} /></div>
                              <div className="w-32 h-32 rounded-[40px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl shrink-0"><Rocket size={56} /></div>
                              <div className="flex-1 space-y-4">
                                 <h5 className="text-4xl font-black text-white uppercase italic">{currentCollective.missionCampaign.title}</h5>
                                 <p className="text-slate-400 text-lg leading-relaxed italic max-w-2xl mx-auto md:mx-0">"{currentCollective.mission}"</p>
                                 <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                       <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Funding Pool</p>
                                       <div className="flex items-center justify-center md:justify-start gap-4">
                                          <p className="text-3xl font-mono font-black text-white">{currentCollective.missionCampaign.pool.toLocaleString()} <span className="text-xs text-indigo-400">EAC</span></p>
                                          <span className="text-[10px] text-slate-600 font-bold">Target: {currentCollective.missionCampaign.target.toLocaleString()}</span>
                                       </div>
                                    </div>
                                    <div>
                                       <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Audit Status</p>
                                       <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${currentCollective.missionCampaign.isPreAudited ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                          {currentCollective.missionCampaign.isPreAudited ? 'Verified Progress' : 'Awaiting Progress Validation'}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="py-20 text-center space-y-8 opacity-40 border-2 border-dashed border-white/5 rounded-[48px] bg-black/20">
                              <Rocket size={48} className="mx-auto" />
                              <div className="space-y-2">
                                 <p className="text-lg font-black uppercase tracking-widest text-white">No Active Mission Shard</p>
                                 <p className="text-xs text-slate-500 italic">Initialize a campaign to start sharding returns for your node.</p>
                              </div>
                              {isAdmin && (
                                 <button onClick={handleOpenNewCampaign} className="px-8 py-3 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Launch Mission Shard</button>
                              )}
                           </div>
                        )}
                     </div>
                   )}

                   {internalColTab === 'stream' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-8">
                           <div className="glass-card p-6 md:p-10 rounded-[40px] md:rounded-[56px] border-white/5 bg-black/40 h-[650px] flex flex-col shadow-2xl overflow-hidden relative">
                              <div className="flex justify-between items-center mb-6 md:mb-10 px-2 md:px-4 relative z-10">
                                   <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                                       <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-pulse" /> Shard <span className="text-emerald-400">Stream</span>
                                   </h4>
                              </div>
                              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar p-2 md:p-4 relative z-10">
                                   {currentCollective.signals?.map((sig: any, i: number) => (
                                       <div key={i} className={`flex gap-4 md:gap-6 group ${sig.from === user.name ? 'flex-row-reverse' : ''}`}>
                                           <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 shadow-xl">
                                               <span className="text-[10px] md:text-xs font-black text-emerald-500">{sig.from[0]}</span>
                                           </div>
                                           <div className={`p-4 md:p-6 glass-card rounded-[24px] md:rounded-[28px] border-white/5 bg-white/[0.02] max-w-[85%] md:max-w-[70%] relative overflow-hidden ${sig.from === user.name ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                               <div className="flex justify-between items-center gap-4 md:gap-6 mb-2">
                                                   <p className="text-[8px] md:text-[10px] text-slate-500 font-black uppercase">{sig.from}</p>
                                                   <p className="text-[6px] md:text-[8px] text-slate-700 font-mono">{sig.timestamp}</p>
                                               </div>
                                               <p className="text-slate-300 text-xs md:text-sm italic font-medium leading-relaxed">"{sig.text}"</p>
                                           </div>
                                       </div>
                                   )) || <p className="text-center text-slate-600 py-20 italic">No signals in current shard.</p>}
                              </div>
                              <div className="p-4 md:p-8 border-t border-white/5 relative z-10 flex gap-4">
                                   <div className="relative flex-1 group">
                                       <input type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessageLocal()} placeholder="Broadcast signal..." className="w-full bg-black/60 border border-white/10 rounded-full py-4 md:py-6 pl-6 md:pl-10 pr-16 md:pr-20 text-sm md:text-base text-white placeholder:text-slate-800 font-bold italic focus:outline-none" />
                                       <button onClick={handleSendMessageLocal} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-emerald-600 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all"><Send className="w-4 h-4 md:w-5 md:h-5" /></button>
                                   </div>
                              </div>
                           </div>
                        </div>
                        <div className="lg:col-span-4 space-y-8">
                           <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-2xl">
                              <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 px-2"><Target className="w-4 h-4" /> Main Agenda</h5>
                              <div className="space-y-3 px-2">
                                 {currentCollective.objectives?.map((o: string) => (
                                   <div key={o} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-emerald-500/40 transition-colors">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shadow-[0_0_10px_#10b981]"></div>
                                      <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-white transition-colors">{o}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </div>
                   )}
                   {internalColTab === 'tasks' && (
                      <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-2xl font-black text-white uppercase italic">Task <span className="text-indigo-400">Ledger</span></h4>
                           {isAdmin && (
                              <button onClick={() => setShowTaskReg(true)} className="px-6 py-2 bg-emerald-600 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">Register Task</button>
                           )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {currentCollective.missionCampaign?.tasks?.map((task: ProjectTask) => (
                              <div key={task.id} className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 space-y-6">
                                 <div className="flex justify-between items-start">
                                    <div className="p-3 bg-white/5 rounded-xl text-indigo-400"><ClipboardList size={20} /></div>
                                    <span className="px-3 py-1 bg-white/5 text-[8px] font-black uppercase text-slate-500 rounded border border-white/10">{task.status}</span>
                                 </div>
                                 <h5 className="text-lg font-black text-white italic">{task.title}</h5>
                                 <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-slate-700">{task.id}</span>
                                    <span className="text-[8px] font-black uppercase text-indigo-400">{task.thrust}</span>
                                 </div>
                              </div>
                           ))}
                           {(!currentCollective.missionCampaign?.tasks || currentCollective.missionCampaign.tasks.length === 0) && (
                              <div className="col-span-full py-20 text-center opacity-20 italic">No tasks indexed for this mission.</div>
                           )}
                        </div>
                      </div>
                   )}
                   {internalColTab === 'members' && (
                      <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4">
                           <h4 className="text-2xl font-black text-white uppercase italic">Steward <span className="text-indigo-400">Nodes</span></h4>
                           {isAdmin && (
                              <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">Invite Node</button>
                           )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {currentCollective.members?.map((member: any) => (
                              <div key={member.id} className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 flex items-center gap-6">
                                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-emerald-500">{member.name[0]}</div>
                                 <div>
                                    <h5 className="text-lg font-black text-white italic">{member.name}</h5>
                                    <p className="text-[10px] text-slate-500 font-mono">{member.id}</p>
                                 </div>
                                 <div className="ml-auto text-right">
                                    <p className="text-emerald-500 font-black font-mono text-xs">{member.sustainabilityRating}%</p>
                                    <p className="text-[7px] text-slate-700 font-black uppercase">EOS_SR</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </div>
                   )}
                   {internalColTab === 'settings' && (
                      <div className="max-w-2xl mx-auto space-y-12 animate-in zoom-in duration-500 py-10">
                        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-black/40 space-y-10">
                           <h4 className="text-2xl font-black text-white uppercase italic border-b border-white/5 pb-6">Governance Settings</h4>
                           <div className="space-y-8">
                              <div className="flex justify-between items-center">
                                 <div>
                                    <p className="text-white font-bold uppercase text-sm">Public Visibility</p>
                                    <p className="text-xs text-slate-500 italic">Allow node discovery on global registry.</p>
                                 </div>
                                 <button className="w-14 h-8 bg-emerald-600 rounded-full relative p-1"><div className="w-6 h-6 bg-white rounded-full absolute right-1"></div></button>
                              </div>
                              <div className="flex justify-between items-center">
                                 <div>
                                    <p className="text-white font-bold uppercase text-sm">Recruitment Sharding</p>
                                    <p className="text-xs text-slate-500 italic">Enable automatic ESIN vouching protocols.</p>
                                 </div>
                                 <button className="w-14 h-8 bg-slate-800 rounded-full relative p-1"><div className="w-6 h-6 bg-slate-600 rounded-full absolute left-1"></div></button>
                              </div>
                           </div>
                           {isAdmin && (
                              <div className="pt-10 border-t border-white/5">
                                 <button onClick={handleDeleteCollective} className="w-full py-4 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">TERMINATE SOCIAL SHARD</button>
                              </div>
                           )}
                        </div>
                      </div>
                   )}
                </div>
              ) : (
                <div className="space-y-10 animate-in fade-in duration-700 px-4">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 px-4 gap-6">
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Social <span className="text-emerald-400">Shard Portal</span></h3>
                         <p className="text-slate-500 text-sm mt-1">Goal-oriented collectives sharded for sustainable impact.</p>
                      </div>
                      <button onClick={handleOpenFormGroup} className="w-full md:w-auto px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                         <PlusCircle size={20} /> Form Shard Group
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {collectives.map(col => (
                        <div key={col.id} onClick={() => { setSelectedCollectiveId(col.id); setInternalColTab('stream'); }} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/20 relative overflow-hidden cursor-pointer">
                           <div className="flex justify-between items-start mb-10 relative z-10">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] bg-emerald-500/10 flex items-center justify-center shadow-2xl border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                                 <Share2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                              </div>
                              <div className="text-right">
                                 <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-full border border-white/10">{col.type}</span>
                                 <p className="text-[10px] text-emerald-500 font-mono mt-3 font-black tracking-widest uppercase">{(col.members || []).length} MEMBERS</p>
                              </div>
                           </div>
                           <div className="flex-1 relative z-10">
                              <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors italic leading-tight">{col.name}</h4>
                              <p className="text-slate-400 text-sm italic leading-relaxed mb-10 line-clamp-3">"{col.mission}"</p>
                           </div>
                           <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-3">
                                 <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]`}></div>
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic leading-none">Resonance: {col.resonance}%</span>
                              </div>
                              <button className="p-5 rounded-[28px] bg-white/5 hover:bg-emerald-600 text-white transition-all shadow-xl group/btn border border-white/5">
                                 <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        )}

        {/* Global Analytics Implementation */}
        {activeView === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500 px-4">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                   <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                   <div className="flex justify-between items-center relative z-10 mb-12 px-4">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-indigo-500/10 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-indigo-400" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-indigo-400">Vitality Velocity</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Steward Interaction Index (Rolling 12T)</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Aggregate Yield</p>
                         <p className="text-4xl font-mono font-black text-white">18.2<span className="text-xl text-emerald-500">%</span></p>
                      </div>
                   </div>

                   <div className="h-[450px] w-full relative z-10 min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <AreaChart data={GLOBAL_PERFORMANCE_DATA}>
                            <defs>
                               <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #6366f122', borderRadius: '16px', padding: '12px' }} />
                            <Area type="monotone" dataKey="yield" stroke="#6366f1" strokeWidth={6} fillOpacity={1} fill="url(#colorPerf)" />
                            <Area type="monotone" dataKey="m_cons" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="4 4" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 glass-card p-10 rounded-[56px] border-white/5 bg-black/40 flex flex-col shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                      <LucideLineChart className="w-64 h-64 text-white" />
                   </div>
                   <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-10 italic flex items-center gap-3 px-2 relative z-10">
                      <Layers className="w-5 h-5 text-indigo-400" /> Shard <span className="text-indigo-400">Diffusion</span>
                   </h3>
                   <div className="flex-1 min-h-0 min-w-0 relative z-10 space-y-8">
                      {[
                        { label: 'Network Liquidity', val: '840M EAC', icon: Coins, col: 'text-emerald-400' },
                        { label: 'Active Missions', val: '142 Nodes', icon: Rocket, col: 'text-blue-400' },
                        { label: 'Consensus Rate', val: '99.8%', icon: ShieldCheck, col: 'text-indigo-400' },
                      ].map((item, i) => (
                        <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                           <div className="flex items-center gap-4">
                              <item.icon className={`w-5 h-5 ${item.col}`} />
                              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                           </div>
                           <span className="text-xl font-mono font-black text-white">{item.val}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Industrial Registry View */}
        {activeView === 'registry' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Industrial <span className="text-indigo-400">Facility Registry</span></h3>
                    <p className="text-slate-500 text-sm mt-2">Verified secondary industry processing nodes and infrastructure assets.</p>
                 </div>
                 <button onClick={() => { setShowIndustryEntry(true); setIndustryStep('form'); }} className="w-full md:w-auto px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <PlusCircle size={20} /> Register Facility Node
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {MOCK_TENDERS.map(tender => (
                    <div key={tender.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-indigo-500/40 transition-all flex flex-col group bg-black/40 shadow-2xl">
                       <div className="flex justify-between items-start mb-8">
                          <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><Building2 size={28} /></div>
                          <div className="text-right">
                             <span className={`px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded border border-amber-500/20 animate-pulse`}>TENDER_OPEN</span>
                             <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase font-black">{tender.id}</p>
                          </div>
                       </div>
                       <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-indigo-400 transition-colors mb-4">{tender.facility}</h4>
                       <p className="text-xs text-slate-400 leading-relaxed italic mb-8">"{tender.requirement}"</p>
                       
                       <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                          <div>
                             <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Max Budget</p>
                             <p className="text-2xl font-mono font-black text-emerald-400">{tender.budget.toLocaleString()} EAC</p>
                          </div>
                          <button 
                            onClick={() => { setSelectedTenderForBid(tender); setBidValue(tender.budget.toString()); setBidStep('evaluation'); setShowBidModal(true); }}
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all active:scale-90 shadow-lg"
                          >
                            Place Bid
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Worker Cloud View */}
        {activeView === 'talent' && (
           <div className="space-y-10 animate-in slide-in-from-left-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Global <span className="text-indigo-400">Worker Cloud</span></h3>
                    <p className="text-slate-500 text-sm mt-2">Verified professional steward nodes available for mission sharding.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:w-80">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                       <input 
                         type="text" 
                         value={talentSearch}
                         onChange={e => setTalentSearch(e.target.value)}
                         placeholder="Search talent shards..." 
                         className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" 
                       />
                    </div>
                    <select 
                      value={skillFilter} 
                      onChange={e => setSkillFilter(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-2xl px-6 py-3 text-xs text-white font-black uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                       <option>All Skills</option>
                       {allSkills.map(s => <option key={s}>{s}</option>)}
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {filteredWorkers.map(worker => (
                    <div key={worker.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col h-full bg-black/40 shadow-2xl relative overflow-hidden active:scale-[0.98] duration-300">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Fingerprint size={160} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="w-16 h-16 rounded-[24px] bg-slate-800 flex items-center justify-center text-2xl font-black text-indigo-400 shadow-xl border border-white/5 group-hover:rotate-6 transition-transform">{worker.name[0]}</div>
                          <div className="text-right">
                             <div className="flex items-center justify-end gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${worker.isOpenToWork ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_100px_current]`}></div>
                                <span className="text-[10px] font-black uppercase text-white tracking-widest">{worker.isOpenToWork ? 'AVAILABLE' : 'OOS'}</span>
                             </div>
                             <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase font-black">{worker.id}</p>
                          </div>
                       </div>
                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors leading-none italic">{worker.name}</h4>
                          <div className="flex flex-wrap gap-2">
                             {worker.skills.map(s => (
                                <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-colors">{s}</span>
                             ))}
                          </div>
                          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Reputation Score</p>
                                <p className="text-xl font-mono font-black text-emerald-400">{worker.sustainabilityRating}%</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Verified Hours</p>
                                <p className="text-xl font-mono font-black text-white">{worker.verifiedHours}h</p>
                             </div>
                          </div>
                       </div>
                       <div className="mt-12 flex gap-4 relative z-10">
                          <button 
                            onClick={() => handleOpenFullDossier(worker)}
                            className="flex-1 py-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-90"
                          >
                             View Dossier
                          </button>
                          <button className="p-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white shadow-xl active:scale-90 transition-all"><Mail size={18} /></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Facility Node Registration Modal */}
      {showIndustryEntry && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowIndustryEntry(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
             <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <button onClick={() => setShowIndustryEntry(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                
                {/* Stepper */}
                <div className="flex gap-4 mb-4 shrink-0">
                    {['form', 'payment', 'protocol', 'success'].map((s, i) => {
                       const stages = ['form', 'payment', 'protocol', 'success'];
                       const currentIdx = stages.indexOf(industryStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-2 rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : i === currentIdx ? 'bg-indigo-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
                         </div>
                       );
                    })}
                 </div>

                {industryStep === 'form' && (
                  <form onSubmit={(e) => { e.preventDefault(); setIndustryStep('payment'); }} className="space-y-8 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-4">
                       <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20">
                          <Building2 className="w-10 h-10 text-indigo-400" />
                       </div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Facility <span className="text-indigo-400">Node Ingest</span></h3>
                       <p className="text-slate-400 text-sm">Synchronize industrial processing infrastructure with the EOS registry.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Entity Legal Handle</label>
                          <input type="text" required value={legalEntityName} onChange={e => setLegalEntityName(e.target.value)} placeholder="e.g. Nairobi Bio-Refinery Corp" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-800 shadow-inner" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Registration No.</label>
                          <input type="text" required value={registrationNo} onChange={e => setRegistrationNo(e.target.value)} placeholder="0x_REG_XXXX_XXXX" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                       </div>
                    </div>

                    <button type="submit" className="w-full py-8 bg-indigo-600 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
                       Proceed to Settlement <ChevronRight className="w-5 h-5" />
                    </button>
                  </form>
                )}

                {industryStep === 'payment' && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-4">
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Facility <span className="text-indigo-400">Handshake Settlement</span></h3>
                       <p className="text-slate-400 text-sm italic">Authorize {FACILITY_INGEST_FEE} EAC for infrastructure anchoring.</p>
                    </div>
                    <div className="p-8 bg-black/40 rounded-[44px] border border-white/10 text-center">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Confirm Node Signature (ESIN)</p>
                       <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-transparent border-none text-center text-4xl font-mono text-emerald-400 outline-none uppercase shadow-inner" />
                    </div>
                    <button onClick={handleRegisterIndustryPayment} disabled={!esinSign} className="w-full py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">AUTHORIZE FACILITY SYNC</button>
                  </div>
                )}

                {industryStep === 'protocol' && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-6">
                       <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                          <HardHat className="w-12 h-12 text-indigo-400 animate-bounce" />
                          <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-ping opacity-40"></div>
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-indigo-400">Audit Protocol</span></h3>
                       <p className="text-slate-400 text-lg font-medium italic max-sm:text-sm max-w-sm mx-auto text-center">"Metadata record committed. Our team has been dispatched to physically evaluate the infrastructure biometrics."</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[48px] border border-white/5 space-y-4 shadow-inner">
                       {[ { l: 'Asset Structural Audit', i: Building }, { l: 'Purity Handshake Sync', i: FlaskConical }, { l: 'Industrial Safety Vouch', i: ShieldCheck } ].map((p, i) => (
                          <div key={i} className="flex items-center gap-4 text-xs font-black text-slate-300 uppercase tracking-widest italic group">
                             <div className="p-2 bg-white/5 rounded-xl text-slate-700 group-hover:text-indigo-500 transition-colors"><p.i size={14} /></div> {p.l}
                          </div>
                       ))}
                    </div>
                    <button onClick={handleFinalizeIndustry} className="w-full py-8 bg-indigo-600 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                       <CheckCircle2 size={20} /> COMMENCE AUDIT QUEUE
                    </button>
                  </div>
                )}

                {industryStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                    <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.4)] scale-110 relative group">
                       <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Facility <span className="text-indigo-400">Provisional</span></h3>
                       <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">FACILITY_REG #{(Math.random()*1000).toFixed(0)} committed.</p>
                    </div>
                    <button onClick={() => setShowIndustryEntry(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* 2. Worker Dossier Modal */}
      {showDossierModal && selectedWorkerForDossier && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowDossierModal(false)}></div>
          <div className="relative z-10 w-full max-w-4xl h-[85vh] glass-card rounded-[64px] border-indigo-500/20 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
             <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shrink-0">
                <button onClick={() => setShowDossierModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-[32px] bg-slate-800 flex items-center justify-center text-5xl font-black text-indigo-400 shadow-3xl border border-white/10">
                      {selectedWorkerForDossier.name[0]}
                   </div>
                   <div>
                      <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">{selectedWorkerForDossier.name}</h2>
                      <p className="text-indigo-400 text-[10px] font-mono tracking-[0.4em] uppercase mt-4">VERIFIED_STEWARD // ID: {selectedWorkerForDossier.id}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                   <div className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Trust Status: OPTIMAL</span>
                   </div>
                   <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase">LAST_ACTIVITY: 2H AGO</p>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-10">
                      <div className="space-y-6">
                         <h4 className="text-xl font-black text-white uppercase italic border-b border-white/5 pb-4">Professional Shards</h4>
                         <div className="flex flex-wrap gap-3">
                            {selectedWorkerForDossier.skills.map(s => (
                               <span key={s} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest">{s}</span>
                            ))}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-center space-y-2 group hover:border-indigo-500/20 transition-all">
                            <p className="text-[10px] text-slate-500 uppercase font-black">Verified Inflow</p>
                            <p className="text-4xl font-mono font-black text-white">{selectedWorkerForDossier.verifiedHours}<span className="text-sm">H</span></p>
                         </div>
                         <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-center space-y-2 group hover:border-emerald-500/20 transition-all">
                            <p className="text-[10px] text-slate-500 uppercase font-black">Reputation</p>
                            <p className="text-4xl font-mono font-black text-emerald-400">{selectedWorkerForDossier.sustainabilityRating}%</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div className="glass-card p-10 rounded-[48px] bg-indigo-600/5 border-indigo-500/20 space-y-8 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot size={120} className="text-indigo-400" /></div>
                         <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-4">
                            <Zap className="w-6 h-6 text-indigo-400" /> Oracle AI Feedback
                         </h4>
                         <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/40 pl-8">
                            "Steward {selectedWorkerForDossier.name} demonstrates exceptional m-Constant stability in precision agriculture. High correlation with technical (T) and industrial (I) thrusts."
                         </p>
                      </div>
                      <div className="space-y-4">
                         <button className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                            <Handshake className="w-6 h-6" /> Initialize Binding Vouch
                         </button>
                         <button className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Download Full Dossier Shard</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 3. Bidding Modal */}
      {showBidModal && selectedTenderForBid && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowBidModal(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
             <div className="p-16 space-y-12 min-h-[600px] flex flex-col justify-center">
                <button onClick={() => setShowBidModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                
                {bidStep === 'evaluation' && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-6">
                       <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                          <Gavel className="w-12 h-12 text-indigo-400" />
                          <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-ping opacity-30"></div>
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Tender <span className="text-indigo-400">Bid Shard</span></h3>
                       <p className="text-slate-400 text-lg italic leading-relaxed">Submitting bid for {selectedTenderForBid.facility} requirement.</p>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <div className="flex justify-between px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EAC Resource Bid</label>
                             <span className="text-xs font-mono font-bold text-slate-400">Max Budget: {selectedTenderForBid.budget}</span>
                          </div>
                          <div className="p-8 bg-black/60 rounded-[44px] border border-white/10 flex items-center justify-between group overflow-hidden shadow-inner">
                             <input type="number" value={bidValue} onChange={e => setBidValue(e.target.value)} className="bg-transparent text-5xl font-mono font-black text-white outline-none w-full" />
                             <span className="text-xl font-black text-emerald-400">EAC</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Signature Authority (ESIN)</label>
                          <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 text-center text-2xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900" />
                       </div>
                    </div>

                    <button onClick={() => { setBidStep('success'); onEarnEAC?.(0, 'TENDER_BID_SUBMITTED'); }} disabled={!esinSign || !bidValue} className="w-full py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">COMMIT BID SHARD</button>
                  </div>
                )}

                {bidStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                    <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.4)] scale-110 relative group">
                       <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Bid <span className="text-indigo-400">Anchored</span></h3>
                       <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Consensus Queue: #{(Math.random()*100).toFixed(0)}</p>
                    </div>
                    <button onClick={() => setShowBidModal(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Registry</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Initialize Mission Modal (Social Collective) */}
      {showRegisterMission && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterMission(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterMission(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 {/* Protocol Stepper */}
                 <div className="flex gap-4 mb-4 shrink-0">
                    {['config', 'payment', 'protocol', 'success'].map((s, i) => {
                       const stages = ['config', 'payment', 'protocol', 'success'];
                       const currentIdx = stages.indexOf(missionRegStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-2 rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : i === currentIdx ? 'bg-indigo-400 animate-pulse shadow-[0_0_15px_#818cf8]' : 'bg-white/10'}`}></div>
                           <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-indigo-400' : 'text-slate-700'}`}>{s}</span>
                         </div>
                       );
                    })}
                 </div>

                 {missionRegStep === 'config' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                             <Rocket className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-ping opacity-30"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center">Launch <span className="text-indigo-400">Campaign Node</span></h3>
                          <p className="text-slate-400 text-lg italic text-center max-w-sm mx-auto">Define industrial campaign goals and link to a backing Collective Node.</p>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Backing Collective Node</label>
                             <select value={selectedColForMission} onChange={e => setSelectedColForMission(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-500/20">
                                <option value="">Select Sponsoring Shard...</option>
                                {collectives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Mission Shard Title</label>
                             <input type="text" value={missionName} onChange={e => setMissionName(e.target.value)} placeholder="e.g. Bantu Soil Restoration" className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none placeholder:text-slate-800" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4">Registry Capital Target (EAC)</label>
                             <input type="number" value={missionGoal} onChange={e => setMissionGoal(e.target.value)} placeholder="50000" className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-3xl font-mono text-emerald-400 focus:ring-4 focus:ring-emerald-500/20 outline-none" />
                          </div>
                       </div>
                       <button onClick={() => setMissionRegStep('payment')} disabled={!selectedColForMission || !missionName} className="w-full py-8 bg-indigo-600 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          Continue to Capital Settlement <ChevronRight size={20} />
                       </button>
                    </div>
                 )}

                 {missionRegStep === 'payment' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Registry <span className="text-indigo-400">Anchor Settlement</span></h3>
                          <p className="text-slate-400 text-lg italic text-center max-sm:text-sm max-w-sm mx-auto">Authorize registry fees to anchor your mission shard to the EOS ledger.</p>
                       </div>
                       <div className="p-10 bg-black/40 rounded-[44px] border border-white/10 text-center space-y-6">
                          <div className="flex justify-between items-center px-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase">Indexing Shard Fee</span>
                             <span className="text-2xl font-mono font-black text-emerald-400">{PROJECT_ANCHOR_FEE} EAC</span>
                          </div>
                          <div className="h-px bg-white/5 w-full"></div>
                          <div className="space-y-4">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">Node Signature Authorization</p>
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-transparent border-none text-center text-4xl font-mono text-white outline-none uppercase placeholder:text-slate-900 tracking-widest" />
                          </div>
                       </div>
                       <button onClick={handleRegisterMissionPayment} disabled={!esinSign} className="w-full py-10 bg-indigo-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                          <Key size={24} fill="currentColor" /> AUTHORIZE MISSION REGISTRY
                       </button>
                    </div>
                 )}

                 {missionRegStep === 'protocol' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-indigo-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                             <SearchCode className="w-12 h-12 text-indigo-400 animate-bounce" />
                             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[40px] animate-ping opacity-30"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-indigo-400">Audit Dispatch</span></h3>
                          <p className="text-slate-400 text-lg leading-relaxed max-sm:text-sm max-w-sm mx-auto text-center italic">
                             "Settlement confirmed. EnvirosAgro team has been dispatched to {user.location} to verify project site biometrics before capital release."
                          </p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-4 shadow-inner">
                          {[ 
                             { l: 'Geospatial Site Mapping', i: MapPin }, 
                             { l: 'Asset Integrity Protocol', i: ShieldCheck }, 
                             { l: 'Steward Identity Anchor', i: CheckCircle }
                          ].map((p, i) => (
                             <div key={i} className="flex items-center gap-6 text-sm font-black text-slate-300 uppercase tracking-widest italic group">
                                <div className="p-3 bg-white/5 rounded-2xl text-slate-700 group-hover:text-indigo-500 transition-colors"><p.i size={18} /></div> {p.l}
                             </div>
                          ))}
                       </div>
                       <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-center gap-6">
                          <ShieldAlert className="w-8 h-8 text-blue-500 shrink-0" />
                          <p className="text-[10px] text-blue-200/50 font-black uppercase leading-relaxed tracking-tight">
                             REGISTRY_LOCK_PROVISIONAL: Mission will remain in 'Pending Verification' until field stewards anchor the final physical audit signature.
                          </p>
                       </div>
                       <button onClick={handleFinalizeMission} className="w-full py-8 bg-blue-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4">
                          <ClipboardCheck size={24} /> COMMENCE AUDIT QUEUE
                       </button>
                    </div>
                 )}

                 {missionRegStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-indigo-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-indigo-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] font-mono">Registry Hash: 0x882_MSN_OK_{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                       </div>
                       <div className="w-full glass-card p-10 rounded-[56px] border-white/5 bg-indigo-500/5 space-y-4 text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Database className="w-40 h-40 text-indigo-400" /></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Shard Status</span>
                             <span className="text-white font-mono font-black text-xl text-amber-500 uppercase italic">Awaiting Field Audit</span>
                          </div>
                          <div className="h-px bg-white/5 w-full"></div>
                          <div className="flex justify-between items-center text-xs relative z-10 px-2">
                             <span className="text-slate-500 font-black uppercase tracking-widest">Audit Ticket</span>
                             <span className="text-blue-400 font-mono font-black text-lg">#EA-TKT-{(Math.random()*100).toFixed(0)}</span>
                          </div>
                       </div>
                       <button onClick={() => setShowRegisterMission(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Task Registration Modal */}
      {showTaskReg && (
         <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowTaskReg(false)}></div>
            <div className="relative z-10 w-full max-w-lg glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
               <div className="p-12 space-y-10 flex flex-col justify-center">
                  <button onClick={() => setShowTaskReg(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                  <div className="text-center space-y-4">
                     <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20">
                        <FilePlus className="w-10 h-10 text-emerald-400" />
                     </div>
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Register <span className="text-emerald-400">Task Node</span></h3>
                     <p className="text-slate-400 text-lg italic leading-relaxed text-center">Define a specific task shard for this project's industrial ledger.</p>
                  </div>
                  <form onSubmit={handleTaskRegistration} className="space-y-6">
                     <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Task Shard Description" className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-xl font-bold text-white outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" />
                     <select value={newTaskThrust} onChange={e => setNewTaskThrust(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-3xl py-6 px-10 text-white font-bold appearance-none outline-none shadow-inner">
                        <option>Technological</option>
                        <option>Environmental</option>
                        <option>Societal</option>
                        <option>Human</option>
                        <option>Industry</option>
                     </select>
                     <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Registry Fee</span>
                        <span className="text-lg font-mono font-black text-emerald-400">10 EAC</span>
                     </div>
                     <button type="submit" disabled={!newTaskTitle.trim()} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">COMMIT TASK SHARD</button>
                  </form>
               </div>
            </div>
         </div>
      )}

      {/* Collective Registration Modal */}
      {showRegisterCollective && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterCollective(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 space-y-12 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                 <button onClick={() => setShowRegisterCollective(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 <div className="flex gap-4 mb-4 shrink-0">
                    {['form', 'payment', 'protocol', 'success'].map((s, i) => {
                       const stages = ['form', 'payment', 'protocol', 'success'];
                       const currentIdx = stages.indexOf(colRegStep);
                       return (
                         <div key={s} className="flex-1 flex flex-col gap-2">
                           <div className={`h-2 rounded-full transition-all duration-700 ${i < currentIdx ? 'bg-emerald-500 shadow-[0_0_100px_#10b981]' : i === currentIdx ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`}></div>
                           <span className={`text-[7px] font-black uppercase text-center tracking-widest ${i === currentIdx ? 'text-emerald-400' : 'text-slate-700'}`}>{s}</span>
                         </div>
                       );
                    })}
                 </div>

                 {colRegStep === 'form' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <Share2 className="w-12 h-12 text-emerald-400 mx-auto" />
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Collective <span className="text-emerald-400">Registry</span></h3>
                          <p className="text-slate-400 text-lg italic leading-relaxed text-center">Initialize a social shard group for unified agricultural impact.</p>
                       </div>
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <input type="text" value={newColName} onChange={e => setNewColName(e.target.value)} placeholder="Collective Alias" className="w-full bg-black/60 border border-white/10 rounded-3xl py-4 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none shadow-inner" />
                             <select value={newColType} onChange={e => setNewColType(e.target.value as any)} className="bg-black/60 border border-white/10 rounded-3xl py-4 px-10 text-white font-bold appearance-none outline-none shadow-inner">
                                <option>Team</option>
                                <option>Clan</option>
                                <option>Society</option>
                             </select>
                          </div>
                          <textarea value={newColMission} onChange={e => setNewColMission(e.target.value)} placeholder="Mission Narrative (Objective)" className="w-full bg-black/60 border border-white/10 rounded-3xl py-4 px-10 text-white italic h-24 resize-none outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" />
                          <textarea value={newColObjectives} onChange={e => setNewColObjectives(e.target.value)} placeholder="Main Agendas (Line separated)" className="w-full bg-black/60 border border-white/10 rounded-3xl py-4 px-10 text-white italic h-24 resize-none outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" />
                       </div>
                       <button onClick={() => setColRegStep('payment')} disabled={!newColName || !newColMission} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Proceed to Payment</button>
                    </div>
                 )}

                 {colRegStep === 'payment' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-emerald-400">Payment</span></h3>
                          <p className="text-slate-400 text-lg italic">Authorize {COLLECTIVE_REG_FEE} EAC for collective registration.</p>
                       </div>
                       <div className="p-8 bg-black/40 rounded-[44px] border border-white/10 text-center">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Confirm Node Signature</p>
                          <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-transparent border-none text-center text-4xl font-mono text-emerald-400 outline-none uppercase shadow-inner" />
                       </div>
                       <button onClick={handleAuthorizeCollectivePayment} disabled={!esinSign} className="w-full py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">AUTHORIZE COLLECTIVE PAYMENT</button>
                    </div>
                 )}

                 {colRegStep === 'protocol' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                             <ClipboardList className="w-12 h-12 text-emerald-400 animate-bounce" />
                             <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[40px] animate-ping opacity-30"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 text-center leading-none">Physical <span className="text-emerald-400">Verification Protocol</span></h3>
                          <p className="text-slate-400 text-lg leading-relaxed max-sm:text-sm max-w-sm mx-auto text-center italic">"The EnvirosAgro team must physically verify the collective members and regional resource capacity before global anchoring."</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-4 shadow-inner">
                          {[ { l: 'Member Quorum Verification', i: Users }, { l: 'Regional Resource Mapping', i: MapPin }, { l: 'Social Shard Vouching', i: Handshake }].map((p, i) => (
                             <div key={i} className="flex items-center gap-4 text-xs font-black text-slate-300 uppercase tracking-widest italic group">
                                <div className="p-2 bg-white/5 rounded-xl text-slate-700 group-hover:text-emerald-400 transition-colors"><p.i size={14} /></div> {p.l}
                             </div>
                          ))}
                       </div>
                       <button onClick={handleFinalizeCollective} className="w-full py-8 bg-emerald-600 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          <CheckCircle2 size={20} /> COMMENCE AUDIT QUEUE
                       </button>
                    </div>
                 )}

                 {colRegStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic text-center">Collective <span className="text-emerald-400">Provisional</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">COLL_REG #{(Math.random()*1000).toFixed(0)} committed.</p>
                       </div>
                       <button onClick={() => setShowRegisterCollective(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Terminal</button>
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
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Industrial;
