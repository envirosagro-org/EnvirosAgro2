
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Gavel, 
  ShieldCheck, 
  X, 
  Zap, 
  ChevronRight, 
  Loader2, 
  Users2, 
  Users,
  RefreshCcw,
  Briefcase, 
  Layers, 
  Database, 
  PlusCircle, 
  Rocket, 
  ArrowLeft, 
  BarChart3, 
  MessageSquare, 
  Video, 
  Mic, 
  Calendar, 
  Target, 
  Heart, 
  Volume2, 
  Play, 
  Plus, 
  Send, 
  Leaf, 
  Dna,
  Landmark,
  Sparkles,
  Cpu,
  Monitor,
  Activity,
  Bookmark,
  Share2,
  Trophy,
  History,
  TrendingUp,
  Globe,
  Star,
  Clock,
  UserCheck,
  Mail,
  FileText,
  BadgeAlert,
  Coins,
  Hammer,
  GanttChartSquare,
  Network,
  ArrowUpRight,
  TrendingDown,
  PieChart as PieChartIcon,
  HardHat,
  Factory,
  Boxes,
  ShieldAlert,
  ClipboardCheck,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { User, AgroProject, WorkerProfile } from '../types';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const MOCK_COLLECTIVES = [
  { id: 'COLL-01', name: 'Bantu Soil Guardians', members: 142, type: 'Clan', thrust: 'Societal', mission: 'Preserving ancestral composting methods for global shards.', activeEvents: 2, objectives: ['Restore Soil Biome', 'Map Lineage Seeds'], impact: 'High Innovation' },
  { id: 'COLL-02', name: 'Spectral Ingest Team', members: 45, type: 'Team', thrust: 'Technological', mission: 'Optimizing satellite data ingest for semi-arid zones.', activeEvents: 0, objectives: ['Satellite Sync', 'Drone Calibration'], impact: 'Incremental Improvement' },
  { id: 'COLL-03', name: 'Resilience Society', members: 89, type: 'Society', thrust: 'Human', mission: 'Advancing physiological health audits for high-yield stewards.', activeEvents: 1, objectives: ['Steward Longevity', 'Mental Performance'], impact: 'Radical Innovation' },
];

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000 },
  { id: 'W-02', name: 'Marcus T.', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000 },
  { id: 'W-03', name: 'Elena Rodriguez', skills: ['Permaculture', 'Social Care'], sustainabilityRating: 92, verifiedHours: 1560, isOpenToWork: false, lifetimeEAC: 28000 },
];

const INITIAL_PROJECTS: AgroProject[] = [
  { id: 'PRJ-NE-882', name: 'Zone 4 Moisture Array', adminEsin: 'EA-2024-X821-P991', description: 'Scaling sensor depth in Nebraska hubs.', thrust: 'Technological', status: 'Funding', totalCapital: 120000, fundedAmount: 85000, batchesClaimed: 0, totalBatches: 5, progress: 15, roiEstimate: 18.5, collateralLocked: 60000 },
  { id: 'PRJ-KE-104', name: 'Nairobi Heritage Grains', adminEsin: 'EA-2024-X821-P991', description: 'Ancestral lineage seed preservation.', thrust: 'Societal', status: 'Execution', totalCapital: 45000, fundedAmount: 45000, batchesClaimed: 2, totalBatches: 4, progress: 50, roiEstimate: 12.2, collateralLocked: 22500, collectiveId: 'COLL-01' },
  { id: 'PRJ-ES-042', name: 'Valencia Solar Desal', adminEsin: 'EA-2024-E112-S001', description: 'Industrial solar-powered desalination for coastal vineyards.', thrust: 'Industry', status: 'Verification', totalCapital: 250000, fundedAmount: 0, batchesClaimed: 0, totalBatches: 8, progress: 0, roiEstimate: 22.4, collateralLocked: 125000 },
];

const MOCK_TENDERS = [
  { id: 'TND-01', proj: 'PRJ-NE-882', task: 'Deployment: 500 Soil Probes', zone: 'Zone 4', eac: 4500, time: '14h left', bids: 12 },
  { id: 'TND-02', proj: 'PRJ-KE-104', task: 'Genetic Mapping: Lineage Grains', zone: 'Zone 2', eac: 12000, time: '2d left', bids: 4 },
  { id: 'TND-03', proj: 'PRJ-ES-042', task: 'PV Panel Cleaning (Robotic)', zone: 'Global', eac: 2500, time: '6h left', bids: 28 },
];

const ANALYTICS_DATA = [
  { time: 'T-12', nodes: 120, yield: 4.2 },
  { time: 'T-09', nodes: 155, yield: 4.8 },
  { time: 'T-06', nodes: 210, yield: 5.5 },
  { time: 'T-03', nodes: 340, yield: 6.2 },
  { time: 'T-01', nodes: 428, yield: 7.1 },
  { time: 'NOW', nodes: 442, yield: 7.8 },
];

const Industrial: React.FC<IndustrialProps> = ({ user, onSpendEAC }) => {
  const [activeView, setActiveView] = useState<'registry' | 'talent' | 'collectives' | 'auctions' | 'analytics'>('registry');
  const [projects, setProjects] = useState<AgroProject[]>(INITIAL_PROJECTS);
  
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projThrust, setProjThrust] = useState<AgroProject['thrust']>('Technological');
  const [projGoal, setProjGoal] = useState('100000');
  const [projRoi, setProjRoi] = useState('15');
  const [registeringForCollectiveId, setRegisteringForCollectiveId] = useState<string | undefined>(undefined);

  const [showCreateCollective, setShowCreateCollective] = useState(false);
  const [collectiveStep, setCollectiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCollective, setSelectedCollective] = useState<any>(null);
  const [collectivePortalMode, setCollectivePortalMode] = useState<'chat' | 'live' | 'podcast' | 'events' | 'missions'>('chat');

  const [colName, setColName] = useState('');
  const [colType, setColType] = useState('Society');
  const [colObjectives, setColObjectives] = useState('');
  const [colThrust, setColThrust] = useState('Societal');
  const [colImpact, setColImpact] = useState('High Innovation');

  const [pulseLogs, setPulseLogs] = useState<{id: string, text: string, type: string}[]>([]);

  useEffect(() => {
    const messages = [
      "PRJ-NE-882: Batch release authorized by Tokenz node.",
      "New Collective formed: 'Kalahari Moisture Shards'",
      "Tender TND-03: Lowest bid dropped to 2400 EAC",
      "Global Capacity: 842 shards reached.",
      "Vetting Node EA-2024-X: Handshake successful.",
    ];
    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setPulseLogs(prev => [{ id: Math.random().toString(), text: msg, type: 'info' }, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchCollective = (col: any) => {
    setSelectedCollective(col);
    setCollectivePortalMode('chat');
  };

  const handleCreateProjectSubmit = () => {
    const goal = Number(projGoal);
    if (!onSpendEAC(goal * 0.5, 'PROJECT_COLLATERAL_LOCK')) return;

    setIsRegistering(true);
    setTimeout(() => {
      const newProj: AgroProject = {
        id: `PRJ-ID-${Math.random().toString(36).substring(7).toUpperCase()}`,
        name: projName,
        adminEsin: user.esin,
        collectiveId: registeringForCollectiveId,
        description: projDesc,
        thrust: projThrust,
        status: 'Ideation',
        totalCapital: goal,
        fundedAmount: 0,
        batchesClaimed: 0,
        totalBatches: 5,
        progress: 0,
        roiEstimate: Number(projRoi),
        collateralLocked: goal * 0.5
      };
      setProjects([newProj, ...projects]);
      setIsRegistering(false);
      setShowCreateProject(false);
      setRegStep(1);
      setRegisteringForCollectiveId(undefined);
    }, 2000);
  };

  const openCollectiveRegistration = (collectiveId: string) => {
    setRegisteringForCollectiveId(collectiveId);
    setShowCreateProject(true);
    setRegStep(1);
    setProjThrust('Societal');
  };

  const handleCreateCollectiveSubmit = () => {
    const newCol = {
      id: `COLL-${Math.random().toString(36).substring(7).toUpperCase()}`,
      name: colName || 'New Collective',
      members: 1,
      type: colType,
      thrust: colThrust,
      mission: colObjectives.substring(0, 100) + '...',
      activeEvents: 0,
      objectives: colObjectives.split(',').map(o => o.trim()),
      impact: colImpact
    };
    MOCK_COLLECTIVES.push(newCol as any);
    setShowCreateCollective(false);
    setCollectiveStep(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Execution': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Funding': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Verification': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Ideation': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Factory className="w-96 h-96 text-white" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] ring-4 ring-white/10 shrink-0">
                 <HardHat className="w-20 h-20 text-white" />
              </div>
              <div className="space-y-6">
                 <div>
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20">EOS_INDUSTRIAL_LAYER_V3</span>
                    <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Industrial <span className="text-indigo-400">Cloud</span></h2>
                 </div>
                 <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                    Scale high-impact agricultural missions. Source verified talent, form strategic collectives, and secure decentralized industrial registries.
                 </p>
                 <div className="flex flex-wrap gap-6 pt-2">
                    <button 
                      onClick={() => { setShowCreateProject(true); setRegStep(1); setRegisteringForCollectiveId(undefined); }}
                      className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                       <PlusCircle className="w-5 h-5" /> Initialize Mission
                    </button>
                    <button 
                      onClick={() => setActiveView('collectives')}
                      className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3"
                    >
                       <Users2 className="w-5 h-5" /> Social Collectives
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6 flex flex-col h-full">
          <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex-1 flex flex-col justify-center text-center space-y-4">
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Active Missions</p>
             <h4 className="text-6xl font-mono font-black text-white tracking-tighter">{projects.length}</h4>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden w-24 mx-auto">
                <div className="h-full bg-emerald-500 animate-pulse"></div>
             </div>
          </div>
          <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Network Pulse</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
             </div>
             <div className="space-y-3">
                {pulseLogs.map(log => (
                  <div key={log.id} className="flex gap-3 text-[9px] font-bold text-slate-400 italic border-l border-white/10 pl-3">
                    <span className="text-emerald-500 shrink-0">&gt;</span>
                    <span className="truncate">{log.text}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'registry', label: 'Active Missions', icon: Database },
          { id: 'talent', label: 'Worker Cloud', icon: Users2 },
          { id: 'collectives', label: 'Social Shards', icon: Share2 },
          { id: 'auctions', label: 'Tender Grid', icon: Hammer },
          { id: 'analytics', label: 'Global Performance', icon: BarChart3 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveView(tab.id as any); setSelectedCollective(null); }}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeView === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeView === 'registry' && (
          <div className="space-y-10 animate-in slide-in-from-left-6 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map(proj => (
                  <div key={proj.id} className="glass-card p-10 rounded-[56px] border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                         <Rocket className="w-40 h-40 text-white" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-indigo-500/10 transition-colors shadow-2xl">
                              <Rocket className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div>
                              <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-indigo-400 transition-colors">{proj.name}</h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-3 tracking-widest flex items-center gap-2">
                                 {proj.id} <span className="text-slate-800">|</span> {proj.thrust.toUpperCase()}
                              </p>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-xl ${getStatusColor(proj.status)}`}>
                            {proj.status}
                        </span>
                      </div>
                      
                      <div className="flex-1 relative z-10">
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">"{proj.description}"</p>
                        
                        {proj.collectiveId && (
                          <div className="mb-10 flex items-center gap-3 px-4 py-2 bg-emerald-500/5 w-fit rounded-2xl border border-emerald-500/10">
                            <Share2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Collective Mission: {MOCK_COLLECTIVES.find(c => c.id === proj.collectiveId)?.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-8 pt-8 border-t border-white/5 relative z-10">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Target Capital</p>
                              <p className="text-lg font-mono font-black text-white">{proj.totalCapital.toLocaleString()} <span className="text-[10px] text-emerald-500">EAC</span></p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">ROI Predict</p>
                              <p className="text-lg font-mono font-black text-emerald-400">+{proj.roiEstimate}%</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Ledger Sync</p>
                              <p className="text-lg font-mono font-black text-blue-400">{proj.progress}%</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                          <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                              Dossier
                          </button>
                          <button onClick={() => setActiveView('auctions')} className="flex-[2] py-5 bg-indigo-600 rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                              Request Tender <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => { setShowCreateProject(true); setRegStep(1); setRegisteringForCollectiveId(undefined); }}
                  className="glass-card p-10 rounded-[56px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-8 hover:border-indigo-500/40 transition-all group min-h-[450px] active:scale-95"
                >
                   <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors shadow-2xl">
                      <Plus className="w-10 h-10 text-slate-700 group-hover:text-indigo-400" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter">New Industrial Entry</h4>
                      <p className="text-slate-500 text-sm italic max-w-xs mx-auto">Commit capital and anchor a new mission to the global registry.</p>
                   </div>
                </button>
             </div>
          </div>
        )}

        {activeView === 'talent' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white flex items-center gap-4 uppercase tracking-tighter italic">
                   <Users2 className="w-10 h-10 text-emerald-400" /> Talent <span className="text-emerald-400">Ecosystem</span>
                </h3>
                <p className="text-lg text-slate-500 italic max-w-2xl">Verified skilled laborers and industrial agro-architects synchronized via blockchain work history.</p>
              </div>
              <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] rounded-2xl border border-emerald-500/20">
                <UserCheck className="w-4 h-4" /> 84 Active Resource Nodes
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {MOCK_WORKERS.map((worker) => (
                <div key={worker.id} className="glass-card rounded-[56px] p-10 group hover:border-emerald-500/30 transition-all active:scale-[0.98] relative overflow-hidden bg-black/20">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:rotate-12 transition-transform">
                     <Briefcase className="w-32 h-32 text-white" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-10 relative z-10">
                    <div className="flex gap-6 items-center">
                      <div className="w-20 h-20 rounded-[32px] bg-slate-800 border-2 border-white/5 flex items-center justify-center relative shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <span className="text-3xl font-black text-emerald-500">{worker.name.split(' ').map(n => n[0]).join('')}</span>
                        {worker.isOpenToWork && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050706] animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{worker.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {worker.skills.map(s => <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase border border-white/5">{s}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-amber-400 justify-end">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-lg font-black font-mono">{worker.sustainabilityRating}%</span>
                      </div>
                      <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest mt-1">U-SCORE</span>
                    </div>
                  </div>

                  <div className="space-y-5 mb-10 relative z-10">
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-medium p-4 bg-white/5 rounded-3xl border border-white/5">
                      <History className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs uppercase font-bold tracking-widest">{worker.verifiedHours.toLocaleString()} Verified Hours</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-medium p-4 bg-white/5 rounded-3xl border border-white/5">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-xs uppercase font-bold tracking-widest">Steward Rank: Lead Architect</span>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 transition-all border border-white/5">View Dossier</button>
                    <button className="flex-[2] py-5 agro-gradient rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-3 shadow-xl active:scale-95">
                      <Mail className="w-4 h-4" /> Initiate Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'collectives' && (
          <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
            {!selectedCollective ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {MOCK_COLLECTIVES.map(col => (
                   <div key={col.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/40 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                         <Share2 className="w-48 h-48 text-white" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className="w-20 h-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center shadow-2xl border border-emerald-500/20 group-hover:rotate-6 transition-transform">
                            <Share2 className="w-10 h-10 text-emerald-400" />
                         </div>
                         <div className="text-right">
                            <span className="px-4 py-1.5 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-full border border-white/10">{col.type}</span>
                            <p className="text-[10px] text-emerald-500 font-mono mt-3 font-black tracking-widest">{col.members} MEMBERS</p>
                         </div>
                      </div>
                      
                      <div className="flex-1 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-emerald-400 transition-colors italic">{col.name}</h4>
                         <p className="text-slate-400 text-sm italic leading-relaxed mb-10">"{col.mission}"</p>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                               <Calendar className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{col.activeEvents} Active Events</span>
                         </div>
                         <button 
                          onClick={() => handleLaunchCollective(col)}
                          className="p-5 rounded-3xl bg-white/5 hover:bg-emerald-600 text-white transition-all shadow-xl border border-white/10 group/btn active:scale-90"
                         >
                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                 ))}
                 
                 <button 
                  onClick={() => setShowCreateCollective(true)}
                  className="glass-card p-10 rounded-[56px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-8 hover:border-emerald-500/40 transition-all group min-h-[450px] active:scale-95"
                 >
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors shadow-2xl">
                       <Plus className="w-10 h-10 text-slate-700 group-hover:text-indigo-400" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Form Shard Group</h4>
                       <p className="text-slate-500 text-sm italic max-w-xs mx-auto">Create a goal-oriented collective to lead regional missions.</p>
                    </div>
                 </button>
              </div>
            ) : (
              <div className="glass-card rounded-[64px] overflow-hidden min-h-[850px] border-white/10 bg-black/40 flex flex-col lg:flex-row shadow-[0_0_100px_rgba(16,185,129,0.05)]">
                 <div className="w-full lg:w-[400px] border-r border-white/5 p-12 space-y-12 bg-white/[0.01]">
                    <div className="space-y-6">
                       <button onClick={() => setSelectedCollective(null)} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all group/back">
                          <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" /> Leave Terminal
                       </button>
                       <div className="relative group w-24 h-24">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-24 h-24 rounded-[36px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl relative z-10 group-hover:scale-105 transition-transform">
                             <Share2 className="w-12 h-12 text-emerald-400" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">{selectedCollective.name}</h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                             {selectedCollective.type} // {selectedCollective.thrust}
                          </p>
                       </div>
                    </div>

                    <div className="space-y-6 pt-10 border-t border-white/5">
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] px-2">ENGAGEMENT MODES</p>
                       <div className="grid grid-cols-1 gap-4">
                          {[
                            { id: 'chat', label: 'Steward Dialogue', icon: MessageSquare, color: 'hover:text-blue-400' },
                            { id: 'missions', label: 'Collective Missions', icon: Target, color: 'hover:text-emerald-400' },
                            { id: 'live', label: 'Field Video Feed', icon: Video, color: 'hover:text-rose-400' },
                            { id: 'podcast', label: 'Audio Archive', icon: Mic, color: 'hover:text-indigo-400' },
                            { id: 'events', label: 'Event Registry', icon: Calendar, color: 'hover:text-amber-400' },
                          ].map(mode => (
                            <button 
                              key={mode.id}
                              onClick={() => setCollectivePortalMode(mode.id as any)}
                              className={`w-full flex items-center justify-between p-6 rounded-3xl transition-all text-sm font-bold uppercase tracking-widest group/mode ${collectivePortalMode === mode.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40' : 'text-slate-500 bg-white/5 hover:bg-white/10'}`}
                            >
                              <div className="flex items-center gap-4">
                                 <mode.icon className={`w-5 h-5 ${collectivePortalMode === mode.id ? 'text-white' : 'group-hover/mode:scale-110 transition-transform'}`} />
                                 {mode.label}
                              </div>
                              <ChevronRight className={`w-4 h-4 transition-transform ${collectivePortalMode === mode.id ? 'translate-x-1' : 'opacity-0 group-hover/mode:opacity-100'}`} />
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-8">
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">IMPACT ANALYSIS</h4>
                          <div className="p-6 bg-emerald-500/5 rounded-[32px] border border-emerald-500/20">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-2">Innovation Index</p>
                             <p className="text-lg font-black text-emerald-400 uppercase italic tracking-tight">{selectedCollective.impact}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 flex flex-col relative bg-[#050706]">
                    {collectivePortalMode === 'chat' && (
                      <div className="flex-1 flex flex-col p-12 h-full">
                         <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-blue-500/10 rounded-2xl">
                                  <MessageSquare className="w-6 h-6 text-blue-400" />
                               </div>
                               <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Dialogue <span className="text-blue-400">Terminal</span></h4>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                               <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{selectedCollective.members} Stewards Synced</span>
                            </div>
                         </div>
                         <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-6">
                            <div className="flex gap-6">
                               <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-black text-emerald-500 shadow-xl border border-white/5">AS</div>
                               <div className="p-8 bg-white/5 rounded-[40px] rounded-tl-none max-w-xl border border-white/5 shadow-2xl relative">
                                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">@AgroSteward (Registry Lead)</p>
                                  <p className="text-slate-300 leading-relaxed text-lg italic">"Welcome to the terminal. We are currently finalizing the spectral data for the heritage grain release in Zone 2. Does anyone have local soil logs from the last 24h block?"</p>
                               </div>
                            </div>
                            <div className="flex gap-6 flex-row-reverse">
                               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-2xl">ME</div>
                               <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[40px] rounded-tr-none max-w-xl shadow-2xl">
                                  <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">YOU (STWD_{user.esin.split('-')[2]})</p>
                                  <p className="text-slate-300 leading-relaxed text-lg italic">"Uploading my moisture shards now. I-Thrust efficiency is holding steady at 1.42x. Node sync complete."</p>
                               </div>
                            </div>
                         </div>
                         <div className="pt-10 border-t border-white/5 mt-auto">
                            <div className="relative group">
                               <div className="absolute inset-0 bg-indigo-500/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                               <input type="text" placeholder="Share knowledge shard..." className="w-full bg-black/60 border border-white/10 rounded-[40px] py-8 pl-10 pr-24 text-white text-lg focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all relative z-10 placeholder:text-slate-800" />
                               <button className="absolute right-4 top-1/2 -translate-y-1/2 p-6 bg-indigo-600 rounded-full text-white shadow-2xl hover:bg-indigo-500 transition-all z-10 scale-90 active:scale-75 group-hover:rotate-12">
                                  <Send className="w-8 h-8" />
                               </button>
                            </div>
                         </div>
                      </div>
                    )}

                    {collectivePortalMode === 'missions' && (
                      <div className="flex-1 flex flex-col p-12 h-full animate-in slide-in-from-right-6 duration-500">
                         <div className="flex justify-between items-center mb-12 pb-8 border-b border-white/5">
                            <div>
                               <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                                  <Target className="w-10 h-10 text-emerald-400" /> Collective <span className="text-emerald-400">Missions</span>
                               </h4>
                               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Active Strategic Initiatives by {selectedCollective.name}</p>
                            </div>
                            <button 
                              onClick={() => openCollectiveRegistration(selectedCollective.id)}
                              className="px-10 py-5 agro-gradient rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                            >
                               <Rocket className="w-5 h-5" /> Propose Mission Shard
                            </button>
                         </div>
                         
                         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-6">
                            {projects.filter(p => p.collectiveId === selectedCollective.id).length > 0 ? (
                              projects.filter(p => p.collectiveId === selectedCollective.id).map(proj => (
                                <div key={proj.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 group hover:border-emerald-500/30 transition-all shadow-xl">
                                   <div className="flex justify-between items-start mb-8">
                                      <div className="flex items-center gap-6">
                                         <div className="w-16 h-16 rounded-[28px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                                            <Rocket className="w-8 h-8 text-emerald-400" />
                                         </div>
                                         <div>
                                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{proj.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-mono mt-2 tracking-widest">{proj.id} // THRUST: {proj.thrust}</p>
                                         </div>
                                      </div>
                                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-xl ${getStatusColor(proj.status)}`}>
                                         {proj.status}
                                      </span>
                                   </div>
                                   <p className="text-sm text-slate-400 leading-relaxed italic mb-10">"{proj.description}"</p>
                                   <div className="grid grid-cols-3 gap-10 pt-8 border-t border-white/5">
                                      <div className="space-y-1">
                                         <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Active Pool</p>
                                         <p className="text-xl font-mono font-black text-white">{proj.totalCapital.toLocaleString()} EAC</p>
                                      </div>
                                      <div className="space-y-1 text-center">
                                         <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Oracle Yield</p>
                                         <p className="text-xl font-mono font-black text-emerald-400">+{proj.roiEstimate}%</p>
                                      </div>
                                      <div className="space-y-1 text-right">
                                         <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">Registry Sync</p>
                                         <p className="text-xl font-mono font-black text-blue-400">{proj.progress}%</p>
                                      </div>
                                   </div>
                                   <div className="mt-10 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb]" style={{ width: `${proj.progress}%` }}></div>
                                   </div>
                                </div>
                              ))
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 opacity-20 py-20">
                                 <Target className="w-32 h-32 text-slate-700 animate-pulse" />
                                 <div className="max-w-sm mx-auto">
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Empty Archive</h4>
                                    <p className="text-slate-500 text-lg italic mt-4 leading-relaxed">Lead your collective to its first industrial mission. Anchor your proposal to the registry to begin funding.</p>
                                 </div>
                              </div>
                            )}
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'auctions' && (
          <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
             <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-white/5 pb-10">
                <div className="space-y-2">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setActiveView('registry')} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all group/back">
                         <ChevronLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                      </button>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                         <Hammer className="w-10 h-10 text-indigo-400" /> Tender <span className="text-indigo-400">Grid</span>
                      </h3>
                   </div>
                   <p className="text-lg text-slate-500 italic">Competitive procurement cycle for large-scale industrial tasks.</p>
                </div>
                <div className="relative w-full md:w-[450px] group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                   <input type="text" placeholder="Search grid by mission hash..." className="w-full bg-black/60 border border-white/10 rounded-[40px] py-6 pl-16 pr-8 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all text-lg placeholder:text-slate-800" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {MOCK_TENDERS.map((t) => (
                  <div key={t.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-indigo-500/40 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:rotate-12 transition-transform">
                        <GanttChartSquare className="w-48 h-48 text-white" />
                     </div>
                     <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="p-5 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 shadow-2xl group-hover:bg-indigo-500 transition-colors">
                           <Hammer className="w-8 h-8 text-indigo-400 group-hover:text-white" />
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-mono text-slate-600 font-black tracking-widest">{t.id}</span>
                           <p className="text-[9px] text-indigo-400 uppercase font-black mt-2 tracking-[0.2em]">INDUSTRIAL_TASK</p>
                        </div>
                     </div>
                     
                     <div className="flex-1 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight group-hover:text-indigo-400 transition-colors italic">{t.task}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                           <Globe className="w-4 h-4 text-blue-500" /> MISSION: {t.proj} <span className="text-slate-800">|</span> {t.zone}
                        </p>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6 my-10 relative z-10">
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Contract Value</p>
                           <p className="text-2xl font-mono font-black text-white">{t.eac.toLocaleString()} <span className="text-xs text-emerald-500">EAC</span></p>
                        </div>
                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">Cycle Shard</p>
                           <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
                              <p className="text-lg font-black text-white uppercase tracking-tighter">{t.time}</p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-white/5 mt-auto flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                           <Users className="w-4 h-4 text-slate-700" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.bids} ACTIVE BIDS</span>
                        </div>
                        <button className="px-10 py-4 agro-gradient rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all">
                          Initialize Bid
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-white/5 relative overflow-hidden bg-black/40 shadow-2xl">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-8">
                      <div className="flex items-center gap-6">
                         <div className="p-5 bg-indigo-500/10 rounded-[32px] shadow-2xl border border-indigo-500/20">
                            <Activity className="w-10 h-10 text-indigo-400" />
                         </div>
                         <div>
                            <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-indigo-400">Throughput</span></h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Real-time Resource Velocity Index</p>
                         </div>
                      </div>
                      <div className="flex gap-10">
                         <div className="text-right">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Current ROI Avg</p>
                            <p className="text-4xl font-mono font-black text-emerald-400">+15.8%</p>
                         </div>
                         <div className="w-[1px] h-12 bg-white/10 hidden md:block"></div>
                         <div className="text-right">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Global Load</p>
                            <p className="text-4xl font-mono font-black text-blue-400">92.4%</p>
                         </div>
                      </div>
                   </div>

                   <div className="h-[450px] w-full relative z-10 min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <AreaChart data={ANALYTICS_DATA}>
                            <defs>
                               <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} fontStyle="italic" />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip 
                               contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '20px' }}
                               itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                            />
                            <Area type="monotone" dataKey="yield" stroke="#818cf8" strokeWidth={6} fillOpacity={1} fill="url(#colorYield)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Industrial;
