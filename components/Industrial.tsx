
import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Gavel, ShieldCheck, X, Zap, ChevronRight, Loader2, Users2, Users, RefreshCcw, Briefcase, Layers, Database, PlusCircle, Rocket, ArrowLeft, BarChart3, MessageSquare, Video, Mic, Calendar, Target, Heart, Volume2, Plus, Send, Leaf, Dna, Landmark, Sparkles, Cpu, Monitor, Activity, Bookmark, Share2, Trophy, History, TrendingUp, Globe, Star, Clock, UserCheck, Mail, FileText, BadgeAlert, BadgeCheck, Coins, Hammer, GanttChartSquare, Network, ArrowUpRight, TrendingDown, PieChart as PieChartIcon, HardHat, Factory, Boxes, ShieldAlert, ClipboardCheck, ChevronLeft, ArrowRight, Warehouse, Fingerprint, Link2, Shield, Gauge, Satellite, Radio, Signal, CirclePlay, Maximize, ArrowDownUp, LayoutGrid, HeartPulse, Brain, Waves, LineChart as LucideLineChart, Handshake, FileCode, Lock, Eye, Key, CheckCircle2, Bot, Download, Building2, Paperclip, Flame, Image as ImageIcon, Upload, UserPlus, Podcast, FileUp, BadgeDollarSign, Stamp, FileSignature, FileBadge, AlertTriangle, PlaneTakeoff, Terminal, Trello,
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
  Smartphone
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { User, AgroProject, WorkerProfile, ViewState } from '../types';
import { SignalShard } from '../App';
import { runSpecialistDiagnostic } from '../services/geminiService';
import TQMGrid from './TQMGrid';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
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

const MOCK_TENDERS = [
  { id: 'TND-2025-01', facility: 'Omaha Ingest Hub', requirement: 'Bio-Nitrogen Array Installation', budget: 45000, biddable: true, timeRemaining: '24h' },
  { id: 'TND-2025-02', facility: 'Nairobi Seed Vault', requirement: 'Spectral Cold Chain Maintenance', budget: 12500, biddable: true, timeRemaining: '6h' },
];

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000 },
  { id: 'W-02', name: 'Marcus T.', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000 },
  { id: 'W-03', name: 'Elena Rodriguez', skills: ['Permaculture', 'Social Care'], sustainabilityRating: 92, verifiedHours: 1560, isOpenToWork: false, lifetimeEAC: 28000 },
];

const GLOBAL_PERFORMANCE_DATA = [
  { time: 'T-12', yield: 4.2, m_cons: 1.2, ca: 3.8 },
  { time: 'T-10', yield: 4.8, m_cons: 1.3, ca: 4.1 },
  { time: 'T-08', yield: 5.5, m_cons: 1.4, ca: 4.5 },
  { time: 'T-06', yield: 5.2, m_cons: 1.4, ca: 4.8 },
  { time: 'T-04', yield: 6.8, m_cons: 1.5, ca: 5.2 },
  { time: 'T-02', yield: 7.4, m_cons: 1.6, ca: 5.8 },
  { time: 'NOW', yield: 8.2, m_cons: 1.6, ca: 6.4 },
];

type BidStep = 'evaluation' | 'selection' | 'approval' | 'transaction' | 'improvement' | 'development' | 'success';

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, onSendProposal, collectives, setCollectives, 
  onAddProject, onUpdateProject, pendingAction, clearAction, onNavigate 
}) => {
  const [activeView, setActiveView] = useState<'registry' | 'talent' | 'collectives' | 'missions' | 'analytics'>('analytics');
  
  const [selectedCollectiveId, setSelectedCollectiveId] = useState<string | null>(null);
  const currentCollective = collectives.find(c => c.id === selectedCollectiveId);
  
  const [invitingToColId, setInvitingToColId] = useState<string | null>(null);
  const [selectedWorkerForDossier, setSelectedWorkerForDossier] = useState<WorkerProfile | null>(null);
  
  const [showRegisterCollective, setShowRegisterCollective] = useState(false);
  const [showIndustryEntry, setShowIndustryEntry] = useState(false);
  const [showRegisterMission, setShowRegisterMission] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTenderForBid, setSelectedTenderForBid] = useState<any>(null);

  const [dossierStep, setDossierStep] = useState<'profile' | 'draft'>('profile');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [targetMissionId, setTargetMissionId] = useState<string | null>(null);
  const [perfYield, setPerfYield] = useState('100');
  const [perfNote, setPerfNote] = useState('');
  const [perfStep, setPerfStep] = useState<'input' | 'audit' | 'success'>('input');
  const [auditReport, setAuditReport] = useState('');

  const [isContributing, setIsContributing] = useState(false);
  const [contribAmount, setContribAmount] = useState('500');

  const [newColName, setNewColName] = useState('');
  const [newColMission, setNewColMission] = useState('');
  const [newColType, setNewColType] = useState<'Team' | 'Clan' | 'Society'>('Team');
  const [newColRegion, setNewColRegion] = useState(user.location);
  const [chatMessage, setChatMessage] = useState('');

  const [bidValue, setBidValue] = useState('');
  const [esinSign, setEsinSign] = useState('');
  const [bidStep, setBidStep] = useState<BidStep>('evaluation');

  const [facilityName, setFacilityName] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [taxId, setTaxId] = useState('');
  const [hqAddress, setHqAddress] = useState('');
  const [facilityType, setFacilityType] = useState('Processing Hub');
  const [facilityZone, setFacilityZone] = useState('Zone 4');
  const [industryStep, setIndustryStep] = useState<'form' | 'legal' | 'audit_pending'>('form');

  const [missionName, setMissionName] = useState('');
  const [missionGoal, setMissionGoal] = useState('50000');
  const [selectedColForMission, setSelectedColForMission] = useState<string>('');

  useEffect(() => {
    if (!pendingAction) return;

    switch (pendingAction) {
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
    setNewColRegion(user.location);
    setShowRegisterCollective(true);
  };

  const handleOpenNewCampaign = () => {
    setSelectedColForMission('');
    setMissionName('');
    setMissionGoal('50000');
    setShowRegisterMission(true);
  };

  const handleOpenFullDossier = (worker: WorkerProfile) => {
    setSelectedWorkerForDossier(worker);
    setDossierStep('profile');
    setShowDossierModal(true);
  };

  const handleRegisterCollective = () => {
    const isWorker = user.role.toLowerCase().includes('worker') || user.role.toLowerCase().includes('farmer');
    if (!isWorker) {
       alert("ACCESS DENIED: Collective registration requires a verified Agro-Worker/Farmer ESIN node.");
       return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const newCol = {
        id: `COLL-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: newColName,
        adminEsin: user.esin,
        members: [
           { id: user.esin, name: user.name, sustainabilityRating: user.metrics.sustainabilityScore }
        ],
        type: newColType,
        mission: newColMission,
        region: newColRegion,
        resonance: 50,
        objectives: ['Initialize Shard Objectives'],
        signals: [],
        materials: [],
        missionCampaign: {
          active: false,
          title: '',
          target: 0,
          pool: 0,
          isPreAudited: false
        }
      };
      setCollectives([...collectives, newCol]);
      setIsProcessing(false);
      setShowRegisterCollective(false);
      onSpendEAC(200, 'COLLECTIVE_REGISTRATION');
      alert(`GROUP FORMED: ${newColName} node created. Awaiting physical verification of regional resources in ${newColRegion}.`);
    }, 2000);
  };

  const handleRegisterIndustry = () => {
    if (!esinSign || !registrationNo || !legalEntityName) return;
    setIsProcessing(true);
    setTimeout(() => {
       setIsProcessing(false);
       setIndustryStep('audit_pending');
       onSpendEAC(1000, 'INDUSTRY_FACILITY_INGEST');
    }, 2000);
  };

  const advanceBidStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const stages: BidStep[] = ['evaluation', 'selection', 'approval', 'transaction', 'improvement', 'development', 'success'];
      const currentIndex = stages.indexOf(bidStep);
      if (currentIndex < stages.length - 1) {
        setBidStep(stages[currentIndex + 1]);
      }
    }, 1500);
  };

  const handlePlaceBid = () => {
    if (!esinSign || !bidValue) return;
    advanceBidStep();
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedCollectiveId) return;
    const newSignal = { 
        from: user.name, 
        text: chatMessage, 
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'text' 
    };
    setCollectives(prev => prev.map(c => c.id === selectedCollectiveId ? { ...c, signals: [...(c.signals || []), newSignal] } : c));
    setChatMessage('');
  };

  const handleSendContractProposal = (worker: WorkerProfile) => {
    const targetColId = invitingToColId;
    if (!targetColId || !onSendProposal) return;
    const collective = collectives.find(c => c.id === targetColId);
    
    setIsProcessing(true);
    setTimeout(() => {
      onSendProposal({
        type: 'engagement',
        title: 'Collective Shard Proposal',
        message: `DECENTRALIZED_OFFER: ${collective?.name} has formulated a binding contract proposal. Verify the terms to anchor your node and release 50 EAC Registry Reward.`,
        priority: 'high',
        actionLabel: 'Review & Sign Contract',
        actionIcon: FileSignature,
        meta: {
          workerId: worker.id,
          collectiveId: targetColId,
          collectiveName: collective?.name,
          reward: 50,
          mission: collective?.mission,
          adminEsin: collective?.adminEsin
        }
      });
      setIsProcessing(false);
      setInvitingToColId(null);
      setShowDossierModal(false);
      setDossierStep('profile');
      alert(`PROPOSAL TRANSMITTED: Contract shard 0x772_RECRUIT has been broadcast to ${worker.name}. Payout is escrowed until peer verification.`);
    }, 2000);
  };

  const handleInitiateInternalCampaign = () => {
    const targetCol = collectives.find(c => c.id === selectedColForMission);
    if (!targetCol) return;
    const targetGoal = Number(missionGoal);
    setIsProcessing(true);
    setTimeout(() => {
      setCollectives(prev => prev.map(c => c.id === targetCol.id ? {
        ...c,
        missionCampaign: { active: true, title: missionName || 'New Collective Mission', target: targetGoal, pool: 0, isPreAudited: false }
      } : c));
      setIsProcessing(false);
      setShowRegisterMission(false);
      setActiveView('missions');
      alert("CAMPAIGN INITIALIZED: Members can now pool EAC internally. Final public launch requires mandatory Physical Field Audit.");
    }, 1500);
  };

  const handleRequestPreAudit = (colId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setCollectives(prev => prev.map(c => c.id === colId ? {
        ...c,
        missionCampaign: { ...c.missionCampaign, isPreAudited: true }
      } : c));
      setIsProcessing(false);
      alert("PHYSICAL AUDIT COMPLETE: Mission site evaluated by EnvirosAgro. Integrity verified for public registry anchoring and capital requisition.");
    }, 2500);
  };

  const handleContributeToPool = (colId: string) => {
    const targetCol = collectives.find(c => c.id === colId);
    if (!targetCol || !targetCol.missionCampaign) return;
    const amount = Number(contribAmount);
    if (onSpendEAC(amount, `COLLECTIVE_MISSION_CONTRIBUTION_${colId}`)) {
      setCollectives(prev => prev.map(c => c.id === colId ? {
        ...c,
        missionCampaign: { ...c.missionCampaign, pool: c.missionCampaign.pool + amount }
      } : c));
      alert(`SYNERGY ADDED: +${amount} EAC committed to the shard.`);
    }
  };

  const handleAnchorToGlobalRegistry = (colId: string) => {
    if (!onAddProject) return;
    const targetCol = collectives.find(c => c.id === colId);
    if (!targetCol || !targetCol.missionCampaign) return;
    const campaign = targetCol.missionCampaign;
    
    if (!campaign.isPreAudited) {
      alert("PROTOCOL REJECTION: Physical Site Audit Required. Please request a physical evaluation before anchoring to the global registry.");
      return;
    }

    if (campaign.pool < campaign.target * 0.5) {
      alert("PROTOCOL REJECTION: 50% capital collateral lock required. Continue pooling internal EAC shards.");
      return;
    }

    if (targetCol.members.length < MIN_MEMBERS_REQUIRED) {
      alert(`QUORUM ERROR: Minimum ${MIN_MEMBERS_REQUIRED} founding members required to anchor project node.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newProject: AgroProject = {
        id: `PRJ-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: campaign.title,
        adminEsin: targetCol.adminEsin,
        collectiveId: targetCol.id,
        description: targetCol.mission,
        thrust: targetCol.type === 'Team' ? 'Technological' : targetCol.type === 'Clan' ? 'Societal' : 'Environmental',
        status: 'Verification',
        totalCapital: campaign.target,
        fundedAmount: campaign.pool,
        batchesClaimed: 0,
        totalBatches: 10,
        progress: 0,
        roiEstimate: 15,
        collateralLocked: campaign.pool,
        profitsAccrued: 0,
        investorShareRatio: 0.15,
        performanceIndex: 0,
        memberCount: targetCol.members.length,
        isPreAudited: true,
        isPostAudited: false
      };
      onAddProject(newProject);
      setCollectives(prev => prev.map(c => c.id === colId ? {
        ...c,
        missionCampaign: { ...c.missionCampaign, launched: true, linkedProjectId: newProject.id }
      } : c));
      setIsProcessing(false);
      alert(`MISSION ANCHORED: ${newProject.name} is now fundable. Investors can now vouch for this audited node.`);
    }, 2000);
  };

  const handlePerformanceInjection = async () => {
    setPerfStep('audit');
    try {
      const res = await runSpecialistDiagnostic(
        "Industrial Performance",
        `Project Node: ${targetMissionId}. Reported Yield: ${perfYield} Tons. Observations: ${perfNote}. Cross-reference with regional m-Constant stability.`
      );
      setAuditReport(res.text);
      setPerfStep('success');
    } catch (e) {
      alert("Oracle Handshake Failed.");
      setPerfStep('input');
    }
  };

  const commitPerformance = (projectId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPerformanceModal(false);
      alert(`PERFORMANCE ANCHORED: Shard 0x${Math.random().toString(16).substring(2, 8).toUpperCase()} committed to Project ${projectId}. Profit release synchronized.`);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Factory className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] ring-4 ring-white/10 shrink-0">
              <HardHat className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20">EOS_INDUSTRIAL_CLOUD_V4</span>
                 <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Industrial <span className="text-indigo-400">Cloud</span></h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                 The center for institutional scale. Registry facilities, source verified talent, and coordinate social shards for global impact.
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Network Capacity</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">842<span className="text-lg text-emerald-500">K</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Ledger Sync</span>
                 <span className="text-emerald-400">Stable</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* OPERATIONS HUD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
         {[
           { label: 'Form Shard Group', icon: PlusCircle, color: 'bg-emerald-600', action: handleOpenFormGroup, desc: 'Collective Inception' },
           { label: 'New Campaign', icon: Rocket, color: 'bg-indigo-600', action: handleOpenNewCampaign, desc: 'Mission Launch' },
           { label: 'View Full Dossier', icon: UserCheck2, color: 'bg-blue-600', action: () => handleOpenFullDossier(MOCK_WORKERS[0]), desc: 'Verified Registry' },
           { label: 'Register Node', icon: Building2, color: 'bg-amber-600', action: () => { setActiveView('registry'); setIndustryStep('form'); setShowIndustryEntry(true); }, desc: 'Facility Ingest' },
         ].map((op, i) => (
           <button 
             key={i} 
             onClick={op.action}
             className="glass-card p-8 rounded-[40px] border border-white/10 hover:border-white/20 transition-all text-left flex items-center gap-6 group active:scale-95 shadow-xl bg-black/40 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
              <div className={`w-14 h-14 rounded-2xl ${op.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform shrink-0`}>
                 <op.icon className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                 <h4 className="text-white font-black uppercase tracking-widest text-[11px] italic truncate">{op.label}</h4>
                 <p className="text-[8px] text-slate-600 font-bold uppercase mt-1 tracking-widest">{op.desc}</p>
              </div>
           </button>
         ))}
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl">
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
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeView === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeView === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
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
                         <p className="text-[10px] text-slate-600 font-black uppercase">Aggregate Yield</p>
                         <p className="text-4xl font-mono font-black text-white">18.2<span className="text-xl text-emerald-500">%</span></p>
                      </div>
                   </div>

                   <div className="h-[450px] w-full relative z-10 min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <AreaChart data={GLOBAL_PERFORMANCE_DATA}>
                            <defs>
                               <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid #6366f122', borderRadius: '16px', padding: '12px' }} />
                            <Area type="monotone" dataKey="yield" stroke="#818cf8" strokeWidth={6} fillOpacity={1} fill="url(#colorPerf)" />
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
                   <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 text-[10px] text-slate-500 leading-relaxed italic text-center relative z-10">
                      "Real-time sharding allows for 100% transparent ROI tracking across the global industrial mesh."
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeView === 'registry' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Entries <span className="text-amber-500">& Tenders</span></h3>
                   <p className="text-slate-500 text-sm">Industrial node registration and regional contract bidding.</p>
                </div>
                <button onClick={() => { setEsinSign(''); setFacilityName(''); setIndustryStep('form'); setShowIndustryEntry(true); }} className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                   <PlusCircle className="w-5 h-5" /> Register Industry Node
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-10 rounded-[56px] border-white/5 space-y-8 bg-black/40">
                   <h4 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                      <Gavel className="w-6 h-6 text-amber-500" /> Active Tenders
                   </h4>
                   <div className="space-y-6">
                      {MOCK_TENDERS.map(tender => (
                        <div key={tender.id} className="p-8 bg-black/40 rounded-3xl border border-white/5 group hover:border-amber-500/30 transition-all">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h5 className="text-lg font-black text-white uppercase">{tender.facility}</h5>
                                 <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">{tender.id}</p>
                              </div>
                              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/20">{tender.timeRemaining} REMAINING</span>
                           </div>
                           <p className="text-slate-400 text-sm italic mb-8">"{tender.requirement}"</p>
                           <div className="flex justify-between items-end pt-6 border-t border-white/5">
                              <div>
                                 <p className="text-[8px] text-slate-600 font-black uppercase">Contract Value</p>
                                 <p className="text-2xl font-mono font-black text-white">{tender.budget.toLocaleString()} EAC</p>
                              </div>
                              <button 
                                onClick={() => { setSelectedTenderForBid(tender); setBidValue(tender.budget.toString()); setEsinSign(''); setBidStep('evaluation'); setShowBidModal(true); }}
                                className="px-8 py-3 agro-gradient rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:scale-105 transition-all"
                              >
                                Place Bid
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[56px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-10 group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Building2 className="w-80 h-80 text-white" /></div>
                   <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-amber-500/30 transition-colors shadow-2xl relative z-10">
                      <HardHat className="w-10 h-10 text-amber-500" />
                   </div>
                   <div className="space-y-4 max-w-sm relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Facility Ingest</h4>
                      <p className="text-slate-500 text-sm italic leading-relaxed">"Authorized processing hubs, regional warehouses, and spectral labs must register with the Industrial Registry to begin node operations."</p>
                   </div>
                   <button onClick={() => { setIndustryStep('form'); setShowIndustryEntry(true); }} className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all relative z-10">Initialize Flow</button>
                </div>
             </div>
          </div>
        )}

        {activeView === 'talent' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Worker <span className="text-emerald-400">Cloud Registry</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Verified Agro-Workers available for collective contracts.</p>
                </div>
                {invitingToColId && (
                   <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-pulse">
                      <Handshake className="w-5 h-5 text-emerald-400" />
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Recruiting for {collectives.find(c => c.id === invitingToColId)?.name}</p>
                   </div>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_WORKERS.map(worker => (
                  <div key={worker.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-95 duration-300 relative overflow-hidden bg-black/20 shadow-xl">
                     <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                           <span className="text-3xl font-black text-emerald-400">{worker.name[0]}</span>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center justify-end gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-lg font-black font-mono">{worker.sustainabilityRating}%</span>
                           </div>
                           <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">U-SCORE</span>
                        </div>
                     </div>
                     <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-emerald-400 transition-colors mb-2 italic">{worker.name}</h4>
                     <div className="flex flex-wrap gap-2 mb-8">
                        {worker.skills.map(s => <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white/5">{s}</span>)}
                     </div>
                     <div className="space-y-4 mb-10 flex-1">
                        <div className="flex items-center gap-3 text-slate-400">
                           <History className="w-4 h-4 text-emerald-500" />
                           <span className="text-xs font-bold">{worker.verifiedHours.toLocaleString()} Verified Hours</span>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button 
                           onClick={() => handleOpenFullDossier(worker)}
                           className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                        >
                           View Full Dossier
                        </button>
                        {invitingToColId && (
                           <button 
                              onClick={() => handleOpenFullDossier(worker)}
                              className="flex-1 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] font-bold uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-2"
                           >
                              <Handshake className="w-4 h-4" />
                              Draft Proposal
                           </button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeView === 'collectives' && (
           <div className="animate-in fade-in duration-700">
              {selectedCollectiveId && currentCollective ? (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center justify-between border-b border-white/5 pb-8">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setSelectedCollectiveId(null)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all group/back">
                             <ChevronLeft className="w-6 h-6 group-hover/back:-translate-x-1 transition-transform" />
                         </button>
                         <div className="flex items-center gap-6">
                             <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                 <Share2 className="w-10 h-10 text-emerald-400" />
                             </div>
                             <div>
                                 <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">{currentCollective.name}</h3>
                                 <p className="text-emerald-500/60 font-mono text-[10px] tracking-[0.4em] uppercase">{currentCollective.id} // {currentCollective.type.toUpperCase()} // RESONANCE: {currentCollective.resonance}%</p>
                             </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-8 space-y-8">
                         <div className="glass-card p-10 rounded-[56px] border-white/5 bg-black/40 h-[650px] flex flex-col shadow-2xl overflow-hidden relative">
                            <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                            <div className="flex justify-between items-center mb-10 px-4 relative z-10">
                                 <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                                     <MessageSquare className="w-5 h-5 text-emerald-400 animate-pulse" /> Shard <span className="text-emerald-400">Stream</span>
                                 </h4>
                                 <div className="flex gap-4">
                                     <button className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-rose-400 transition-all"><Video className="w-5 h-5" /></button>
                                     <button className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-indigo-400 transition-all"><Podcast className="w-5 h-5" /></button>
                                 </div>
                            </div>
                            <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar p-4 relative z-10">
                                 {currentCollective.signals?.map((sig: any, i: number) => (
                                     <div key={i} className={`flex gap-6 group ${sig.from === user.name ? 'flex-row-reverse' : ''}`}>
                                         <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 shadow-xl">
                                             <span className="text-xs font-black text-emerald-500">{sig.from[0]}</span>
                                         </div>
                                         <div className={`p-6 glass-card rounded-[28px] border-white/5 bg-white/[0.02] max-w-[70%] relative overflow-hidden group-hover:bg-emerald-500/5 transition-colors ${sig.from === user.name ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                                             <div className="flex justify-between items-center gap-6 mb-2">
                                                 <p className="text-[10px] text-slate-500 font-black uppercase">{sig.from}</p>
                                                 <p className="text-[8px] text-slate-700 font-mono">{sig.timestamp}</p>
                                             </div>
                                             <p className="text-slate-300 text-sm italic font-medium leading-relaxed">"{sig.text}"</p>
                                         </div>
                                     </div>
                                 )) || <p className="text-center text-slate-600 py-20 italic">No signals in current shard.</p>}
                            </div>
                            <div className="p-8 border-t border-white/5 relative z-10 flex gap-4">
                                 <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><Paperclip className="w-6 h-6" /></button>
                                 <div className="relative flex-1 group">
                                     <input 
                                         type="text" 
                                         value={chatMessage}
                                         onChange={e => setChatMessage(e.target.value)}
                                         onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                         placeholder="Broadcast signal to members..." 
                                         className="w-full bg-black/60 border border-white/10 rounded-full py-6 pl-10 pr-20 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder:text-slate-800 font-bold italic" 
                                     />
                                     <button onClick={handleSendMessage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                                         <Send className="w-5 h-5" />
                                     </button>
                                 </div>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-4 space-y-8">
                         <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-2xl">
                            <div className="space-y-6 pt-2">
                                 <div className="flex justify-between items-center mb-6">
                                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4" /> Member Registry</h5>
                                    {(currentCollective.adminEsin === user.esin) && (
                                       <button 
                                          onClick={() => { setInvitingToColId(currentCollective.id); setActiveView('talent'); }}
                                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                          title="Add member from Worker Cloud"
                                       >
                                          <UserPlus className="w-4 h-4" />
                                       </button>
                                    )}
                                 </div>
                                 <div className="space-y-4">
                                     {currentCollective.members?.map((m: any) => (
                                         <div key={m.id} className="flex items-center justify-between group">
                                             <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-white/5">{m.name[0]}</div>
                                                 <div>
                                                     <p className="text-xs font-bold text-white uppercase">{m.name}</p>
                                                     <p className="text-[8px] text-slate-600 font-mono">NODE_VERIFIED</p>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-2.5 h-2.5 fill-current" />
                                                <span className="text-[9px] font-mono font-black">{m.sustainabilityRating}%</span>
                                             </div>
                                         </div>
                                     )) || <p className="text-center text-slate-700 italic py-4">No contracted members.</p>}
                                 </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                               <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Shard Objectives</h5>
                               <div className="space-y-3">
                                  {currentCollective.objectives?.map((o: string) => (
                                    <div key={o} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-emerald-500/40 transition-colors">
                                       <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shadow-[0_0_10px_#10b981]"></div>
                                       <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-white transition-colors">{o}</span>
                                    </div>
                                  )) || <p className="text-xs text-slate-700 italic">No objectives set.</p>}
                               </div>
                            </div>

                            {currentCollective.adminEsin === user.esin && !currentCollective.missionCampaign?.active && (
                              <button 
                               onClick={() => { setSelectedColForMission(currentCollective.id); setMissionName(''); setMissionGoal('50000'); setShowRegisterMission(true); }}
                               className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                              >
                                 <Rocket className="w-5 h-5" /> Launch Group Mission
                              </button>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                   <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Social <span className="text-emerald-400">Shard Portal</span></h3>
                         <p className="text-slate-500 text-sm mt-1">Goal-oriented collectives formed by workers.</p>
                      </div>
                      <button onClick={handleOpenFormGroup} className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                         <PlusCircle className="w-5 h-5" /> Form Shard Group
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {collectives.map(col => (
                        <div key={col.id} onClick={() => setSelectedCollectiveId(col.id)} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/20 relative overflow-hidden cursor-pointer">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><Share2 className="w-48 h-48 text-white" /></div>
                           <div className="flex justify-between items-start mb-10 relative z-10">
                              <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center shadow-2xl border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                                 <Share2 className="w-10 h-10 text-emerald-400" />
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
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Resonance: {col.resonance}%</span>
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

        {activeView === 'missions' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-indigo-400">Launchpad</span></h3>
                    <p className="text-slate-500 text-sm mt-1">Manage collective project campaigns and registry anchoring.</p>
                 </div>
                 <button 
                  onClick={handleOpenNewCampaign}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95"
                 >
                    <PlusCircle className="w-5 h-5" /> Initialize New Campaign
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {collectives.filter(c => c.missionCampaign?.active).map(col => {
                   const quorumMet = col.members.length >= MIN_MEMBERS_REQUIRED;
                   const capitalMet = col.missionCampaign.pool >= col.missionCampaign.target * 0.5;
                   const preAudited = col.missionCampaign.isPreAudited;
                   
                   return (
                   <div key={col.id} className={`glass-card p-10 rounded-[56px] border-2 transition-all relative overflow-hidden flex flex-col group ${col.missionCampaign.launched ? 'border-emerald-500/40 bg-emerald-500/[0.02]' : 'border-indigo-500/20 bg-black/40'}`}>
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                         <Rocket className="w-48 h-48 text-white" />
                      </div>
                      
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
                         <div className="text-right flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${col.missionCampaign.launched ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse'}`}>
                               {col.missionCampaign.launched ? 'ANCHORED_LEDGER' : 'INTERNAL_STAGING'}
                            </span>
                            {preAudited && (
                               <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shadow-lg">
                                  <BadgeCheck className="w-3.5 h-3.5" />
                                  <span className="text-[8px] font-black uppercase">Pre-Funding Audited</span>
                               </div>
                            )}
                         </div>
                      </div>

                      <div className="flex-1 space-y-10 relative z-10">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                               <span className="text-slate-500 flex items-center gap-2">
                                  <Users2 className="w-3 h-3 text-blue-400" /> Member Quorum
                               </span>
                               <span className={quorumMet ? 'text-emerald-400' : 'text-blue-400'}>{col.members.length} / {MIN_MEMBERS_REQUIRED} Nodes</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                               <div className={`h-full rounded-full transition-all duration-[2s] shadow-[0_0_20px_rgba(59,130,246,0.3)] ${quorumMet ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(100, (col.members.length / MIN_MEMBERS_REQUIRED) * 100)}%` }}></div>
                            </div>
                         </div>

                         <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                               <span className="text-slate-500 flex items-center gap-2">
                                  <Coins className="w-3 h-3 text-emerald-400" /> Capital Synergy Meter
                               </span>
                               <span className="text-white font-mono">{((col.missionCampaign.pool / col.missionCampaign.target) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                               <div className={`h-full rounded-full transition-all duration-[2s] shadow-[0_0_20px_rgba(59,130,246,0.3)] ${capitalMet ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(100, (col.missionCampaign.pool / col.missionCampaign.target) * 100)}%` }}></div>
                            </div>
                         </div>

                         {!col.missionCampaign.launched ? (
                           <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-4">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2">Inject Capital Shard</label>
                                    <input type="number" value={contribAmount} onChange={e => setContribAmount(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg font-mono outline-none" />
                                 </div>
                                 <div className="flex items-end">
                                    <button onClick={() => handleContributeToPool(col.id)} className="w-full py-4 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3">
                                       <Zap className="w-4 h-4" /> Contribute
                                    </button>
                                 </div>
                              </div>
                              {!preAudited && col.adminEsin === user.esin && (
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex flex-col gap-4">
                                   <div className="flex items-center gap-3">
                                      <HardHat className="w-5 h-5 text-blue-400" />
                                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Physical Evaluation Protocol</p>
                                   </div>
                                   <p className="text-[9px] text-slate-500 leading-relaxed italic">"Our audit team must physically monitor and evaluate the mission site before public registry anchoring."</p>
                                   <button 
                                      onClick={() => handleRequestPreAudit(col.id)}
                                      disabled={isProcessing}
                                      className="w-full py-3 bg-blue-600 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                                   >
                                      {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                                      Request Physical Audit
                                   </button>
                                </div>
                              )}
                           </div>
                         ) : (
                           <div className="p-8 glass-card border-emerald-500/20 bg-emerald-500/5 rounded-3xl space-y-6 shadow-inner">
                             <div className="flex items-center gap-3">
                               <Activity className="w-5 h-5 text-emerald-400" />
                               <h5 className="text-xs font-black text-white uppercase italic">Lifecycle Performance</h5>
                             </div>
                             <p className="text-sm text-slate-400 italic font-medium">Mission synchronized. Inject performance shards to generate EAC profits for the collective.</p>
                             <button 
                               onClick={() => { setTargetMissionId(col.missionCampaign.linkedProjectId); setPerfStep('input'); setShowPerformanceModal(true); }}
                               className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-2"
                             >
                               <Database className="w-4 h-4" /> Inject Performance Shard
                             </button>
                           </div>
                         )}
                      </div>

                      <div className="mt-12 pt-8 border-t border-white/5 relative z-10 flex flex-col sm:flex-row justify-between gap-6">
                         <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl">
                               <Target className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                               <p className="text-[8px] text-slate-600 uppercase font-black">Target Goal</p>
                               <p className="text-xl font-mono font-black text-white">{col.missionCampaign.target.toLocaleString()} EAC</p>
                            </div>
                         </div>
                         {!col.missionCampaign.launched && col.adminEsin === user.esin && (
                           <button 
                            onClick={() => handleAnchorToGlobalRegistry(col.id)} 
                            disabled={!capitalMet || !quorumMet || !preAudited} 
                            className="px-10 py-4 agro-gradient rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl disabled:opacity-30 flex items-center gap-3 transition-all"
                           >
                              {!capitalMet ? <Lock className="w-4 h-4" /> : !quorumMet ? <Users2 className="w-4 h-4" /> : !preAudited ? <ShieldAlert className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                              {!capitalMet ? "AWAITING CAPITAL" : !quorumMet ? "AWAITING QUORUM" : !preAudited ? "AWAITING PRE-AUDIT" : "Anchor Node to Registry"}
                           </button>
                         )}
                         {col.missionCampaign.launched && (
                           <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Anchored & Audited</span>
                           </div>
                         )}
                      </div>
                   </div>
                 )})}
              </div>
           </div>
        )}
      </div>

      {/* -------------------- MODALS -------------------- */}

      {/* 1. Bid Modal (COMPREHENSIVE 6-STAGE WORKFLOW) */}
      {showBidModal && selectedTenderForBid && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowBidModal(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col h-[85vh]">
              
              <div className="p-10 border-b border-white/5 bg-amber-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center shadow-xl border border-amber-400/30">
                       <Gavel className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Procurement <span className="text-amber-500">Lifecycle</span></h3>
                       <p className="text-[10px] text-amber-500/60 font-mono tracking-widest uppercase mt-2">{selectedTenderForBid.id} // STEWARD: {user.name.toUpperCase()}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowBidModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              {/* Progress Terminal */}
              <div className="px-10 py-6 border-b border-white/5 bg-black/40 flex justify-between gap-4 shrink-0">
                 {[
                   { l: 'Evaluation', s: 'evaluation', i: FileSearch },
                   { l: 'Selection', s: 'selection', i: CheckCircle },
                   { l: 'Approval', s: 'approval', i: Stamp },
                   { l: 'Transaction', s: 'transaction', i: Coins },
                   { l: 'Improvement', s: 'improvement', i: BarChart4 },
                   { l: 'Development', s: 'development', i: GraduationCap },
                 ].map((step, i) => {
                    const stages: BidStep[] = ['evaluation', 'selection', 'approval', 'transaction', 'improvement', 'development', 'success'];
                    const currentIdx = stages.indexOf(bidStep);
                    const isActive = step.s === bidStep;
                    const isDone = stages.indexOf(step.s as any) < currentIdx;
                    
                    return (
                      <div key={step.s} className="flex-1 flex flex-col items-center gap-3 group">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/5 text-slate-700'
                         }`}>
                            <step.i className="w-5 h-5" />
                         </div>
                         <span className={`text-[7px] font-black uppercase text-center tracking-widest ${isActive ? 'text-amber-500' : isDone ? 'text-emerald-500' : 'text-slate-800'}`}>{step.l}</span>
                      </div>
                    );
                 })}
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col">
                 {bidStep === 'evaluation' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Initial <span className="text-amber-500">Evaluation</span></h4>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">"Provision your bid value and authorize node metadata extraction for initial automated selection."</p>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Proposed Budget (EAC)</label>
                             <input type="number" value={bidValue} onChange={e => setBidValue(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-3xl font-mono text-emerald-400 outline-none focus:ring-4 focus:ring-amber-500/20 transition-all" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Steward Node Signature</label>
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-mono text-white outline-none focus:ring-4 focus:ring-amber-500/20 transition-all uppercase" />
                          </div>
                       </div>
                       <button onClick={advanceBidStep} disabled={!esinSign || !bidValue || isProcessing} className="w-full max-w-sm mx-auto py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30">
                          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />} INITIALIZE SELECTION
                       </button>
                    </div>
                 )}

                 {bidStep === 'selection' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Selection <span className="text-emerald-400">Confirmation</span></h4>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">"Your node has been shortlisted. Final selection is pending consensus approval."</p>
                       </div>
                       <div className="grid grid-cols-3 gap-6">
                          {[
                            { l: 'Technical Fit', v: '98%', c: 'text-emerald-400' },
                            { l: 'Price Resonance', v: 'Optimal', c: 'text-blue-400' },
                            { l: 'Steward Rep.', v: 'A+', c: 'text-amber-500' },
                          ].map(m => (
                            <div key={m.l} className="p-8 bg-black/60 border border-white/5 rounded-[40px] text-center space-y-2 group hover:border-emerald-500/40 transition-all">
                               <p className="text-[9px] text-slate-600 font-black uppercase">{m.l}</p>
                               <p className={`text-3xl font-mono font-black ${m.c}`}>{m.v}</p>
                            </div>
                          ))}
                       </div>
                       <button onClick={advanceBidStep} className="w-full max-w-xs mx-auto py-6 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all">Advance to Approval Shard</button>
                    </div>
                 )}

                 {bidStep === 'approval' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Multi-Sig <span className="text-indigo-400">Approval</span></h4>
                          <p className="text-slate-400 text-lg font-medium italic">Consensus reached across 14 independent governing nodes.</p>
                       </div>
                       <div className="p-10 bg-indigo-900/10 border border-indigo-500/20 rounded-[56px] space-y-8 relative overflow-hidden text-center">
                          <div className="flex flex-wrap justify-center gap-4">
                             {[...Array(14)].map((_, i) => (
                               <div key={i} className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                  <ShieldCheck size={20} />
                               </div>
                             ))}
                          </div>
                          <p className="text-indigo-400 font-mono text-xs font-black uppercase tracking-widest">Registry Consensus: 100% OK</p>
                       </div>
                       <button onClick={advanceBidStep} className="w-full max-w-sm mx-auto py-8 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:bg-indigo-500 transition-all">Commit Transaction Shard</button>
                    </div>
                 )}

                 {bidStep === 'transaction' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Ledger <span className="text-amber-500">Settlement</span></h4>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-6">
                          <div className="flex justify-between items-center px-4">
                             <p className="text-[10px] text-slate-500 font-black uppercase">Contract Value Lock</p>
                             <p className="text-3xl font-mono font-black text-white">{Number(bidValue).toLocaleString()} EAC</p>
                          </div>
                          <div className="h-px w-full bg-white/5"></div>
                          <p className="text-[10px] font-mono text-emerald-400/60 uppercase text-center font-black">BLOCK_HASH: 0x882_TENDER_SETTLE_{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                       </div>
                       <button onClick={advanceBidStep} className="w-full max-w-md mx-auto py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all">Finalize Improvements Shard</button>
                    </div>
                 )}

                 {bidStep === 'improvement' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Process <span className="text-blue-400">Optimization</span></h4>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="p-8 glass-card border-blue-500/20 bg-blue-500/5 rounded-[40px] space-y-4">
                             <h5 className="text-white font-black uppercase text-xs italic">KPI Shards</h5>
                             <ul className="space-y-2 text-[10px] text-slate-400 font-bold uppercase">
                                <li>• Latency Benchmarking</li>
                                <li>• Energy Efficiency Cycle</li>
                                <li>• Waste Diversion Log</li>
                             </ul>
                          </div>
                          <div className="p-8 glass-card border-emerald-500/20 bg-emerald-500/5 rounded-[40px] flex flex-col items-center justify-center text-center">
                             <TrendingUp className="w-10 h-10 text-emerald-400 mb-2" />
                             <h5 className="text-white font-black uppercase text-xs">Resilience Tuning</h5>
                          </div>
                       </div>
                       <button onClick={advanceBidStep} className="w-full max-w-sm mx-auto py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all">Initialize Development Shard</button>
                    </div>
                 )}

                 {bidStep === 'development' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-4">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Steward <span className="text-amber-500">Scaling</span></h4>
                       </div>
                       <div className="p-10 glass-card rounded-[56px] bg-gradient-to-br from-amber-600/10 via-transparent to-indigo-600/10 grid grid-cols-3 gap-6 text-center">
                          <div><GraduationCap className="mx-auto text-amber-400 mb-2" /><p className="text-[8px] font-black uppercase">Industrial Training</p></div>
                          <div><Coins className="mx-auto text-emerald-400 mb-2" /><p className="text-[8px] font-black uppercase">Liquidity Bridge</p></div>
                          <div><ShieldCheck className="mx-auto text-indigo-400 mb-2" /><p className="text-[8px] font-black uppercase">Consensus Authority</p></div>
                       </div>
                       <button onClick={advanceBidStep} className="w-full max-w-md mx-auto py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all">AUTHORIZE FULL REGISTRY ANCHOR</button>
                    </div>
                 )}

                 {bidStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] font-mono">Registry Finality Hash: 0x882_PROCURE_OK_{Math.random().toString(16).substring(2, 6).toUpperCase()}</p>
                       </div>
                       <button onClick={() => setShowBidModal(false)} className="w-full max-w-sm py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 2. Form Shard Group (Register Collective) */}
      {showRegisterCollective && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterCollective(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12">
                 <button onClick={() => setShowRegisterCollective(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                       <PlusCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Form <span className="text-emerald-400">Shard Group</span></h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Initialize a collective node for shared mission goals and resource sharding.</p>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Collective Alias</label>
                       <input 
                         type="text" 
                         value={newColName} 
                         onChange={e => setNewColName(e.target.value)}
                         placeholder="e.g. Bantu Soil Guardians" 
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Mission Objective</label>
                       <textarea 
                         value={newColMission} 
                         onChange={e => setNewColMission(e.target.value)}
                         placeholder="What is the primary goal of this collective?" 
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white italic outline-none focus:ring-4 focus:ring-emerald-500/20 h-32 resize-none" 
                       />
                    </div>
                 </div>

                 <button 
                  onClick={handleRegisterCollective}
                  disabled={isProcessing || !newColName || !newColMission}
                  className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95 transition-all"
                 >
                    {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                    AUTHORIZE INCEPTION
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 3. Initialize New Campaign (Register Mission) */}
      {showRegisterMission && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowRegisterMission(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12">
                 <button onClick={() => setShowRegisterMission(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl">
                       <Rocket className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Launch <span className="text-indigo-400">Campaign</span></h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Select a group and initialize a mission bounty for public registry sharding.</p>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Select Sponsoring Collective</label>
                       <select 
                         value={selectedColForMission}
                         onChange={e => setSelectedColForMission(e.target.value)}
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-indigo-500/20"
                       >
                          <option value="">Choose Collective Node...</option>
                          {collectives.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Mission Capital Target (EAC)</label>
                       <input 
                         type="number" 
                         value={missionGoal} 
                         onChange={e => setMissionGoal(e.target.value)}
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-2xl font-mono text-emerald-400 focus:ring-4 focus:ring-indigo-500/20 outline-none" 
                       />
                    </div>
                 </div>

                 <button 
                  onClick={handleInitiateInternalCampaign}
                  disabled={isProcessing || !selectedColForMission}
                  className="w-full py-10 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30 active:scale-95 transition-all"
                 >
                    {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                    INITIALIZE MISSION HUB
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 4. View Full Dossier (Steward Profiles) */}
      {showDossierModal && selectedWorkerForDossier && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setShowDossierModal(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[56px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12">
                 <button onClick={() => setShowDossierModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    <div className="w-48 h-48 rounded-[48px] bg-slate-800 border-4 border-white/5 flex items-center justify-center text-8xl font-black text-blue-400 shadow-2xl relative shrink-0">
                       {selectedWorkerForDossier.name[0]}
                       <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-2xl bg-blue-600 border-4 border-[#050706] flex items-center justify-center">
                          <BadgeCheck className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="flex-1 space-y-8 text-center md:text-left">
                       <div>
                          <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">{selectedWorkerForDossier.name}</h2>
                          <p className="text-blue-500 font-mono text-[10px] tracking-[0.4em] uppercase mt-4">STEWARD_DOSSIER // {selectedWorkerForDossier.id} // U-SAT: {selectedWorkerForDossier.sustainabilityRating}%</p>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                          <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Verified Hours</p>
                             <p className="text-2xl font-mono text-white font-black">{selectedWorkerForDossier.verifiedHours.toLocaleString()}</p>
                          </div>
                          <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Lifetime EAC</p>
                             <p className="text-2xl font-mono text-emerald-400 font-black">{selectedWorkerForDossier.lifetimeEAC.toLocaleString()}</p>
                          </div>
                          <div className="p-6 bg-black/40 rounded-3xl border border-white/5 hidden md:block">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Purity Rating</p>
                             <p className="text-2xl font-mono text-indigo-400 font-black">A+</p>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-6">
                          {selectedWorkerForDossier.skills.map(s => (
                             <span key={s} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest">{s}</span>
                          ))}
                       </div>
                    </div>
                 </div>

                 {invitingToColId && (
                    <div className="p-10 glass-card rounded-[48px] bg-blue-600/5 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-10">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
                             <Handshake className="w-8 h-8" />
                          </div>
                          <div className="text-left">
                             <h4 className="text-xl font-bold text-white uppercase italic">Shard Recruit Phase</h4>
                             <p className="text-slate-500 text-xs mt-1">Initialize a binding proposal to anchor this steward to your group.</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleSendContractProposal(selectedWorkerForDossier)}
                         disabled={isProcessing}
                         className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3"
                       >
                          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          TRANSMIT PROPOSAL
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 5. Register Industry Node (Facility Ingest) */}
      {showIndustryEntry && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowIndustryEntry(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12">
                 <button onClick={() => setShowIndustryEntry(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 {industryStep === 'form' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                       <div className="text-center space-y-4">
                          <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl">
                             <Building2 className="w-12 h-12 text-amber-500" />
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Facility <span className="text-amber-500">Ingest</span></h3>
                          <p className="text-slate-400 text-lg">Initialize institutional node registration for industrial facilities.</p>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Entity Legal Name</label>
                             <input 
                               type="text" 
                               value={legalEntityName}
                               onChange={e => setLegalEntityName(e.target.value)}
                               placeholder="e.g. Omaha Processing Shard LLC" 
                               className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-bold focus:ring-4 focus:ring-amber-500/20 outline-none transition-all" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4">Registry Registration No.</label>
                             <input 
                               type="text" 
                               value={registrationNo}
                               onChange={e => setRegistrationNo(e.target.value)}
                               placeholder="REG-XXXX-XXXX" 
                               className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-white font-mono focus:ring-4 focus:ring-amber-500/20 outline-none transition-all" 
                             />
                          </div>
                       </div>

                       <button 
                        onClick={() => setIndustryStep('legal')}
                        disabled={!legalEntityName || !registrationNo}
                        className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"
                       >
                          Proceed to Authentication <ChevronRight className="w-6 h-6" />
                       </button>
                    </div>
                 )}

                 {industryStep === 'legal' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                       <div className="text-center space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Node <span className="text-amber-500">Authentication</span></h3>
                          <p className="text-slate-400 text-lg">Authorize facility ingest with your ESIN signature.</p>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-8">Steward Signature (ESIN)</label>
                          <input 
                             type="text" 
                             value={esinSign}
                             onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-amber-500/20 outline-none transition-all" 
                          />
                       </div>

                       <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[40px] flex items-center gap-6">
                          <ShieldAlert className="w-12 h-12 text-amber-500 shrink-0" />
                          <p className="text-xs text-amber-200/50 font-black uppercase tracking-tight leading-relaxed">
                             INGEST_LOCK: Registry fee of 1,000 EAC will be burned upon signature. Mandatory Physical Audit dispatched within 48h.
                          </p>
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setIndustryStep('form')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                            onClick={handleRegisterIndustry}
                            disabled={isProcessing || !esinSign}
                            className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30 transition-all"
                          >
                             {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Key className="w-6 h-6 fill-current" />}
                             Authorize Ingest Shard
                          </button>
                       </div>
                    </div>
                 )}

                 {industryStep === 'audit_pending' && (
                    <div className="space-y-16 animate-in zoom-in duration-700 text-center py-10 flex flex-col justify-center items-center">
                       <div className="w-48 h-48 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.4)] scale-110 relative group">
                          <HardHat className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-amber-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Ingest <span className="text-amber-500">Provisional</span></h3>
                          <p className="text-slate-400 text-lg italic leading-relaxed max-w-sm mx-auto">"Facility metadata indexed. Standing by for physical node verification and environmental sync."</p>
                       </div>
                       <button onClick={() => setShowIndustryEntry(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Terminal</button>
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
        .agro-gradient-orange { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Industrial;
