import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  PlusCircle, 
  Share2, 
  Hammer, 
  ArrowLeft, 
  Target, 
  Users, 
  ShieldCheck, 
  Clock,
  Maximize2,
  Bot,
  Factory,
  MoreVertical,
  Activity,
  ArrowRightCircle,
  Briefcase,
  LayoutGrid,
  ChevronRight,
  Zap,
  HardHat,
  Search,
  X,
  Loader2,
  Fingerprint,
  Lock,
  CheckCircle2,
  Coins,
  ShieldAlert,
  ArrowRight,
  Stamp,
  Binary,
  Network,
  Cpu,
  SmartphoneNfc,
  Monitor,
  Workflow,
  Globe,
  Gauge,
  History,
  Terminal,
  Layers,
  Box,
  Radar,
  Radio,
  TrendingUp,
  MapPin,
  Plus,
  BadgeCheck,
  User as UserIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar as RechartsRadar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis
} from 'recharts';
import { User, RegisteredUnit, ViewState, WorkerProfile } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  collectives: any[];
  setCollectives: React.Dispatch<React.SetStateAction<any[]>>;
  pendingAction?: string | null;
  clearAction?: () => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  industrialUnits: RegisteredUnit[];
  setIndustrialUnits: React.Dispatch<React.SetStateAction<RegisteredUnit[]>>;
  onInitializeLiveProcess?: (params: any) => void;
}

const MOCK_TENDERS = [
  { id: 'TND-842', facility: 'Omaha Ingest Hub', requirement: 'Bio-Nitrogen Array Installation', budget: 45000, timeRemaining: '24h', thrust: 'Technological', bidders: 12, reqShards: ['TECH_LV4', 'ZK_AUTH_V5'] },
  { id: 'TND-112', facility: 'Nairobi Seed Vault', requirement: 'Spectral Cold Chain Maintenance', budget: 12500, timeRemaining: '6h', thrust: 'Environmental', bidders: 4, reqShards: ['BIO_INGEST_V2'] },
  { id: 'TND-091', facility: 'Silicon Soil Node', requirement: 'Swarm AI Hub Calibration', budget: 85000, timeRemaining: '12h', thrust: 'Industry', bidders: 28, reqShards: ['AI_ORACLE_LINK', 'MAINFRAME_V6'] },
];

const MOCK_WORKERS: (WorkerProfile & { efficiency: number })[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000, efficiency: 94 },
  { id: 'W-02', name: 'Marcus T.', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000, efficiency: 82 },
  { id: 'W-03', name: 'Elena R.', skills: ['Registry Auth', 'ZK-Proofs'], sustainabilityRating: 94, verifiedHours: 1560, isOpenToWork: true, lifetimeEAC: 31000, efficiency: 91 },
];

const SPARKLINE_DATA = [
  { time: 'T1', load: 42 }, { time: 'T2', load: 56 }, { time: 'T3', load: 48 },
  { time: 'T4', load: 72 }, { time: 'T5', load: 64 }, { time: 'T6', load: 92 },
  { time: 'T7', load: 88 },
];

const SHARD_REG_FEE = 100;

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, collectives, setCollectives, industrialUnits, setIndustrialUnits,
  pendingAction, clearAction, onNavigate, onInitializeLiveProcess 
}) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'workers' | 'mesh' | 'tenders'>('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [globalThroughput, setGlobalThroughput] = useState(142.8);
  const [activePeers, setActivePeers] = useState(1242);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalThroughput(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
      setActivePeers(prev => prev + (Math.random() > 0.8 ? 1 : Math.random() > 0.9 ? -1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [showShardModal, setShowShardModal] = useState(false);
  const [shardStep, setShardStep] = useState<'info' | 'config' | 'sign' | 'success'>('info');
  const [shardName, setShardName] = useState('');
  const [shardMission, setShardMission] = useState('');
  const [shardType, setShardType] = useState('Clan');
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingShard, setIsProcessingShard] = useState(false);

  const [showBidModal, setShowBidModal] = useState<any>(null);
  const [bidStep, setBidStep] = useState<'form' | 'sign' | 'success'>('form');
  const [bidAmount, setBidAmount] = useState('');
  const [bidApproach, setBidApproach] = useState('');
  const [isProcessingBid, setIsProcessingBid] = useState(false);

  const filteredUnits = industrialUnits.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRegisterShard = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    if (await onSpendEAC(SHARD_REG_FEE, "SOCIAL_SHARD_INITIALIZATION")) {
      setIsProcessingShard(true);
      setTimeout(() => {
        const newShard = {
          id: `COLL-${Math.floor(Math.random() * 900 + 100)}`,
          name: shardName,
          adminEsin: user.esin,
          members: [{ id: user.esin, name: user.name, sustainabilityRating: user.metrics.sustainabilityScore }],
          type: shardType,
          mission: shardMission,
          resonance: 100,
          objectives: ['Sync Registry', 'Onboard Stewards']
        };
        setCollectives([newShard, ...collectives]);
        
        if (onInitializeLiveProcess) {
          onInitializeLiveProcess({
            title: `Shard Mission: ${shardName}`,
            category: 'Manufactured',
            stewardName: user.name,
            stewardEsin: user.esin,
            location: user.location
          });
        }

        setIsProcessingShard(false);
        setShardStep('success');
      }, 2500);
    }
  };

  const handleSubmitBid = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    setIsProcessingBid(true);
    setTimeout(() => {
      setIsProcessingBid(false);
      setBidStep('success');
    }, 2500);
  };

  const closeModals = () => {
    setShowShardModal(false);
    setShowBidModal(null);
    setShardStep('info');
    setBidStep('form');
    setEsinSign('');
    setShardName('');
    setShardMission('');
    setBidAmount('');
    setBidApproach('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Network size={1000} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Network size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em]">Mesh Throughput</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{globalThroughput.toFixed(1)}<span className="text-xl text-indigo-500 ml-1 italic">GB/s</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Registry V5.2</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                 <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Streaming</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Bot size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.5em]">Active Machine Peers</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{activePeers.toLocaleString()}</h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Node Consensus</span>
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-400" />
                 <span className="text-[9px] font-mono text-emerald-500 font-bold">100% OK</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.5em]">Total Industrial Shards</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">14.2<span className="text-xl text-amber-500 ml-1 italic">M</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Archive Depth</span>
              <div className="flex items-center gap-2">
                 <TrendingUp size={14} className="text-amber-400" />
                 <span className="text-[9px] font-mono text-amber-400 font-bold">+12% CYC</span>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-blue-500/20 bg-blue-500/[0.03] flex flex-col justify-between relative overflow-hidden group shadow-2xl h-[280px]">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Zap size={120} /></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.5em]">Global Resonance</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">1.42<span className="text-xl text-blue-500 ml-1 italic">m</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Avg Stability</span>
              <div className="flex items-center gap-2">
                 <Activity size={14} className="text-blue-400" />
                 <span className="text-[9px] font-mono text-blue-500 font-bold">OPTIMAL</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit border border-white/5 bg-black/40 shadow-xl px-6">
           {[
             { id: 'facilities', label: 'Node Registry', icon: Factory },
             { id: 'workers', label: 'Talent Shards', icon: Users },
             { id: 'mesh', label: 'Industrial Mesh', icon: Network },
             { id: 'tenders', label: 'Bounty Manifest', icon: Hammer },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>
         
         <div className="relative group w-full lg:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Mesh Node or Protocol ID..." 
              className="w-full bg-black/60 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner"
            />
         </div>
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {activeTab === 'facilities' && (
           <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                 {filteredUnits.map(unit => (
                    <div key={unit.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden active:scale-[0.99] duration-500 min-h-[500px]">
                       <div className="absolute inset-0 pointer-events-none opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                          <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent absolute top-0 animate-scan"></div>
                       </div>
                       
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all shrink-0">
                             <Database size={48} />
                          </div>
                          <div className="text-right">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                unit.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                unit.status === 'AUDITING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>{unit.status}</span>
                             <p className="text-[10px] text-slate-700 font-mono mt-4 font-black uppercase tracking-widest">{unit.id}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0 tracking-tighter">{unit.name.toUpperCase()}</h4>
                          <div className="flex items-center gap-4 text-slate-500">
                             <MapPin size={14} className="text-indigo-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{unit.type} // {unit.location}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-10">
                             <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 space-y-2 shadow-inner group/stat hover:border-indigo-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase">Mesh Load</p>
                                <p className="text-3xl font-mono font-black text-white">{unit.efficiency}%</p>
                             </div>
                             <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 space-y-2 shadow-inner group/stat hover:border-emerald-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase">Sync Integrity</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">99.8%</p>
                             </div>
                          </div>

                          <div className="h-24 w-full bg-white/[0.01] rounded-3xl mt-6 p-4 border border-white/5 group-hover:border-indigo-500/10 transition-all overflow-hidden">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SPARKLINE_DATA}>
                                   <Area type="monotone" dataKey="load" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                                </AreaChart>
                             </ResponsiveContainer>
                          </div>
                       </div>

                       <div className="mt-10 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                          <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-md">Audit Node</button>
                          <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[9px] font-black uppercase text-white shadow-xl active:scale-95 transition-all">Command</button>
                       </div>
                    </div>
                 ))}
                 <div className="p-12 border-4 border-dashed border-white/10 rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 opacity-30 hover:opacity-100 transition-opacity group cursor-pointer bg-black/20">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                       <Plus size={40} />
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-black text-white uppercase italic">Pair Infrastructure</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest px-10">Anchor a new physical facility node to the global registry.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'workers' && (
           <div className="space-y-20 w-full animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {MOCK_WORKERS.map(worker => (
                    <div key={worker.id} className="p-12 glass-card rounded-[80px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col md:flex-row gap-12 min-h-[500px] shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-500">
                       <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><Users size={400} className="text-white" /></div>
                       
                       <div className="w-full md:w-1/3 flex flex-col items-center justify-center space-y-8 relative z-10 border-r border-white/5 pr-4 md:pr-10">
                          <div className="w-40 h-40 rounded-[56px] bg-slate-800 flex items-center justify-center font-black text-8xl text-blue-400 border-2 border-white/10 shadow-2xl group-hover:rotate-6 transition-transform overflow-hidden relative">
                             <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
                             {worker.name[0]}
                          </div>
                          <div className="text-center space-y-1">
                             <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-blue-400 transition-colors">{worker.name.split(' ')[0]}</h4>
                             <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">{worker.id}</p>
                          </div>
                          <div className="flex gap-2">
                             <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase rounded-full border border-blue-500/20">REPUTATION: {worker.sustainabilityRating}%</span>
                          </div>
                       </div>

                       <div className="flex-1 space-y-10 relative z-10">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Skill Matrix</p>
                                <div className="flex flex-wrap gap-3">
                                   {worker.skills.map(skill => (
                                      <span key={skill} className="px-6 py-2 bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/10 hover:text-white transition-all shadow-inner">{skill}</span>
                                   ))}
                                </div>
                             </div>
                             <div className="text-right space-y-1">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Efficiency Shard</p>
                                <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">{worker.efficiency}%</p>
                             </div>
                          </div>

                          <div className="h-48 w-full bg-white/[0.01] rounded-[40px] p-6 border border-white/5 relative group/radar">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                   { subject: 'Agronomy', A: worker.efficiency },
                                   { subject: 'Tech', A: 70 },
                                   { subject: 'Resilience', A: worker.sustainabilityRating },
                                   { subject: 'Output', A: 90 },
                                   { subject: 'Social', A: 85 },
                                ]}>
                                   <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                   <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontStyle="italic" />
                                   <RechartsRadar name="Talent" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                                </RadarChart>
                             </ResponsiveContainer>
                          </div>

                          <div className="flex items-center justify-between pt-8 border-t border-white/5">
                             <div className="flex items-center gap-4">
                                <ShieldCheck size={28} className="text-emerald-400 drop-shadow-[0_0_10px_#10b98144]" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{worker.verifiedHours} HOURS ANCHORED</span>
                             </div>
                             <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 border border-white/10">Request Lease Shard</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'mesh' && (
           <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="glass-card p-16 md:p-24 rounded-[80px] bg-indigo-600/[0.03] border-2 border-indigo-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-20 shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s]"><Globe size={1000} className="text-white" /></div>
                 
                 <div className="relative shrink-0">
                    <div className="w-80 h-80 bg-indigo-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] ring-[24px] ring-white/5 animate-pulse relative">
                       <Radio className="w-32 h-32 text-white" />
                       <div className="absolute inset-[-15px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                       <div className="absolute inset-[-40px] border-2 border-dotted border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                    </div>
                 </div>

                 <div className="flex-1 space-y-10 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">L2_TOPOLOGY_MONITOR_v1</span>
                       <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">GLOBAL <br/><span className="text-indigo-400">MACHINE MESH</span></h2>
                    </div>
                    <p className="text-slate-400 text-2xl leading-relaxed italic font-medium max-w-3xl opacity-80">
                       "Visualizing the real-time interconnectivity of sharded industrial nodes. Every pulse represents a ZK-verified packet settlement across the peer grid."
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                       {[
                          { l: 'Validator Peers', v: '428', i: ShieldCheck, c: 'text-emerald-400' },
                          { l: 'Mesh Latency', v: '12ms', i: Activity, c: 'text-blue-400' },
                          { l: 'Grid Density', v: '0.84', i: Target, c: 'text-indigo-400' },
                          { l: 'Consensus Rate', v: '99.9%', i: BadgeCheck, c: 'text-amber-500' },
                       ].map((s, idx) => (
                          <div key={idx} className="p-6 bg-black/40 rounded-3xl border border-white/5 shadow-inner group hover:border-indigo-500/20 transition-all text-center">
                             <s.i size={20} className={`${s.c} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                             <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{s.l}</p>
                             <p className="text-xl font-mono font-black text-white">{s.v}</p>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/20 shadow-inner">
                 <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.8em] mb-12 text-center italic">REAL_TIME_NODE_MATRIX_INGEST</h4>
                 <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-20 gap-3 md:gap-4">
                    {[...Array(120)].map((_, i) => {
                       const status = Math.random() > 0.9 ? 'error' : Math.random() > 0.8 ? 'sync' : 'active';
                       return (
                          <div 
                             key={i} 
                             className={`aspect-square rounded-lg border transition-all duration-[3s] relative group/node cursor-help ${
                                status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                status === 'sync' ? 'bg-indigo-500/10 border-indigo-500/20 animate-pulse' :
                                'bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                             }`}
                             title={`NODE_ID: 0x${(i+1000).toString(16).toUpperCase()}`}
                          >
                             <div className={`absolute inset-0 rounded-lg animate-ping opacity-10 ${status === 'active' ? 'bg-emerald-500' : status === 'sync' ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity z-10 bg-black/90 rounded-lg">
                                <span className="text-[6px] font-mono text-white">#0x{(i+1000).toString(16).toUpperCase()}</span>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'tenders' && (
           <div className="space-y-20 w-full animate-in slide-in-from-right-10 duration-700">
              <div className="grid grid-cols-1 gap-8">
                 {MOCK_TENDERS.map(tender => (
                    <div key={tender.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 hover:border-rose-500/30 transition-all group flex flex-col md:flex-row items-center justify-between shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-500">
                       <div className="absolute inset-0 bg-rose-500/[0.01] pointer-events-none group-hover:bg-rose-500/[0.03] transition-colors"></div>
                       <div className="flex items-center gap-10 relative z-10 flex-1">
                          <div className="w-28 h-28 rounded-[40px] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-3xl group-hover:rotate-12 transition-transform shrink-0">
                             <Hammer size={48} />
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-6">
                                <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">{tender.requirement.toUpperCase()}</h4>
                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{tender.thrust}</span>
                             </div>
                             <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em] italic">FACILITY: <span className="text-slate-300">{tender.facility.toUpperCase()}</span> // MISSION_ID: <span className="text-slate-300 font-mono">{tender.id}</span></p>
                             
                             <div className="flex flex-wrap gap-3 pt-2">
                                {tender.reqShards.map(shard => (
                                   <div key={shard} className="flex items-center gap-2 px-4 py-1.5 bg-black/60 border border-white/5 rounded-xl text-[9px] font-mono font-black text-rose-400 group-hover:border-rose-500/40 transition-all shadow-inner">
                                      <Lock size={10} /> {shard}
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-12 relative z-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-16 mt-10 md:mt-0">
                          <div className="text-center md:text-right space-y-2">
                             <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest italic leading-none">Capital Bounty</p>
                             <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">{tender.budget.toLocaleString()} <span className="text-xs font-sans italic text-slate-700">EAC</span></p>
                             <div className="flex items-center justify-center md:justify-end gap-3 text-[10px] font-black text-slate-500 uppercase">
                                <Users size={14} className="text-rose-500" /> {tender.bidders} Bidders Sharded
                             </div>
                          </div>
                          <button 
                            onClick={() => { setShowBidModal(tender); setBidStep('form'); }}
                            className="px-14 py-7 bg-rose-600 hover:bg-rose-500 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4 active:scale-90 border border-white/10 ring-8 ring-white/5 transition-all"
                          >
                             FORGE BID <ChevronRight size={20} />
                          </button>
                       </div>
                    </div>
                 ))}
                 <div className="py-20 text-center opacity-20 border-2 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center space-y-6">
                    <History size={64} className="text-slate-600" />
                    <p className="text-xl font-black uppercase tracking-[0.8em]">End of Active Manifest</p>
                 </div>
              </div>
           </div>
        )}
      </div>

      {showShardModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={closeModals}></div>
          <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(79,70,229,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
            <div className="p-10 md:p-14 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                     <Share2 size={32} />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-indigo-400">Registration</span></h3>
                     <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">CENTER_GATE_INIT // SOCIAL_SHARDING</p>
                  </div>
               </div>
               <button onClick={closeModals} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
               {shardStep === 'info' && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Shard Designation (Name)</label>
                       <input 
                         type="text" value={shardName} onChange={e => setShardName(e.target.value)}
                         placeholder="e.g. Bantu Soil Guardians..." 
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Mission Narrative</label>
                       <textarea 
                         value={shardMission} onChange={e => setShardMission(e.target.value)}
                         placeholder="Describe the core sharding objective of this collective..." 
                         className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-sm italic text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800 h-32 resize-none" 
                       />
                    </div>
                    <button onClick={() => setShardStep('config')} disabled={!shardName || !shardMission} className="w-full py-8 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all disabled:opacity-30">CONFIGURE PARAMETERS <ChevronRight className="inline ml-2" /></button>
                 </div>
               )}

               {shardStep === 'config' && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6 text-center block">Stewardship Type</label>
                       <div className="grid grid-cols-3 gap-4">
                          {['Clan', 'Guild', 'Union'].map(type => (
                             <button 
                                key={type} onClick={() => setShardType(type)}
                                className={`p-6 rounded-3xl border transition-all text-xs font-black uppercase tracking-widest ${shardType === type ? 'bg-indigo-600 text-white border-white' : 'bg-black/60 border-white/10 text-slate-500'}`}
                             >
                                {type}
                             </button>
                          ))}
                       </div>
                    </div>
                    <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[44px] flex items-center gap-6 shadow-inner">
                       <ShieldAlert className="w-10 h-10 text-indigo-400 shrink-0" />
                       <p className="text-[10px] text-indigo-200/50 font-black uppercase tracking-tight leading-relaxed text-left italic">
                          "Registering a new shard anchors your node as the Primary Admin. You will be responsible for members m-constant verification."
                       </p>
                    </div>
                    <button onClick={() => setShardStep('sign')} className="w-full py-8 bg-indigo-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">PROCEED TO SIGNATURE</button>
                 </div>
               )}

               {shardStep === 'sign' && (
                 <div className="space-y-12 animate-in slide-in-from-right-4 flex flex-col justify-center flex-1">
                    <div className="text-center space-y-6">
                       <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-3xl">
                          <Fingerprint className="w-12 h-12 text-indigo-400" />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-indigo-400">Anchor</span></h3>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Admin Signature (ESIN)</label>
                       <input 
                         type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                         placeholder="EA-XXXX-XXXX-XXXX" 
                         className="w-full bg-black/60 border border-white/10 rounded-[40px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                       />
                    </div>
                    <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex justify-between items-center shadow-inner">
                       <div className="flex items-center gap-4">
                          <Coins className="text-indigo-400" />
                          <span className="text-xs font-black text-white uppercase tracking-widest">Registration Fee</span>
                       </div>
                       <span className="text-xl font-mono font-black text-emerald-400">{SHARD_REG_FEE} EAC</span>
                    </div>
                    <button 
                      onClick={handleRegisterShard}
                      disabled={isProcessingShard || !esinSign}
                      className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
                    >
                       {isProcessingShard ? <Loader2 className="w-8 h-8 animate-spin" /> : <Lock className="w-8 h-8 fill-current" />}
                       {isProcessingShard ? "MINTING SHARD..." : "AUTHORIZE SETTLEMENT"}
                    </button>
                 </div>
               )}

               {shardStep === 'success' && (
                 <div className="space-y-16 py-10 animate-in zoom-in duration-700 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(79,70,229,0.3)] relative group">
                       <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-[-15px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-emerald-400">Anchored</span></h3>
                       <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x{(Math.random()*1000).toFixed(0)}_SYNC_OK</p>
                    </div>
                    <button onClick={closeModals} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">RETURN TO HUB</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {showBidModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={closeModals}></div>
          <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[64px] border-rose-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(244,63,94,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
            <div className="p-10 md:p-14 border-b border-white/5 bg-rose-500/[0.02] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                     <Hammer size={32} />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Bid <span className="text-rose-500">Forge</span></h3>
                     <p className="text-rose-500/60 text-[10px] font-mono tracking-widest uppercase mt-3">MISSION_NODE // {showBidModal.id}</p>
                  </div>
               </div>
               <button onClick={closeModals} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
               {bidStep === 'form' && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="p-8 bg-black/60 rounded-[48px] border border-white/10 space-y-6 shadow-inner relative overflow-hidden">
                       <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Requirement Shard</h4>
                       <p className="text-2xl font-black text-white uppercase italic leading-tight">"{showBidModal.requirement}"</p>
                       <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <span className="text-[9px] font-black text-slate-700 uppercase">Max Budget</span>
                          <span className="text-xl font-mono font-black text-emerald-400">{showBidModal.budget.toLocaleString()} EAC</span>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Proposed Shard Fee (Your Bid)</label>
                          <div className="p-6 bg-black/60 rounded-[32px] border border-white/10 flex items-center justify-between">
                             <input 
                               type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                               placeholder="0" 
                               className="bg-transparent text-5xl font-mono font-black text-white outline-none w-full" 
                             />
                             <span className="text-xl font-black text-emerald-400 italic">EAC</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-6">Technical Execution Approach</label>
                          <textarea 
                             value={bidApproach} onChange={e => setBidApproach(e.target.value)}
                             placeholder="Briefly describe your industrial methodology for this shard..." 
                             className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-sm italic text-white focus:ring-4 focus:ring-rose-500/20 outline-none h-32 resize-none" 
                          />
                       </div>
                    </div>
                    <button onClick={() => setBidStep('sign')} disabled={!bidAmount || !bidApproach} className="w-full py-8 bg-rose-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all disabled:opacity-30">PROCEED TO SIGNATURE <ChevronRight className="inline ml-2" /></button>
                 </div>
               )}

               {bidStep === 'sign' && (
                 <div className="space-y-12 animate-in slide-in-from-right-4 flex flex-col justify-center flex-1">
                    <div className="text-center space-y-6">
                       <div className="w-24 h-24 bg-rose-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xl">
                          <Fingerprint className="w-12 h-12 text-rose-500" />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Tender <span className="text-rose-500">Handshake</span></h3>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Steward ID (ESIN)</label>
                       <input 
                         type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                         placeholder="EA-XXXX-XXXX-XXXX" 
                         className="w-full bg-black/60 border border-white/10 rounded-[40px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-rose-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                       />
                    </div>
                    <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[44px] flex items-center gap-6 shadow-inner">
                       <ShieldAlert className="w-10 h-10 text-rose-500 shrink-0" />
                       <p className="text-[10px] text-rose-200/50 font-black uppercase tracking-tight leading-relaxed text-left italic">
                          "Bidding commits your node to immediate availability sharding. Retracting a bid after acceptance results in m-constant slashing."
                       </p>
                    </div>
                    <button 
                      onClick={handleSubmitBid}
                      disabled={isProcessingBid || !esinSign}
                      className="w-full py-10 bg-rose-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
                    >
                       {isProcessingBid ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8 fill-current" />}
                       {isProcessingBid ? "COMMITTING BID..." : "AUTHORIZE BID SHARD"}
                    </button>
                 </div>
               )}

               {bidStep === 'success' && (
                 <div className="space-y-16 py-10 animate-in zoom-in duration-700 flex-1 flex flex-col justify-center items-center text-center">
                    <div className="w-48 h-48 agro-gradient-rose rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(244,63,94,0.3)] relative group">
                       <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-[-15px] border-4 border-rose-500/20 rounded-full animate-ping"></div>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Bid <span className="text-rose-500">Placed</span></h3>
                       <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">TENDER_SYNC_ID: 0xBID_{(Math.random()*100).toFixed(0)}_OK</p>
                    </div>
                    <button onClick={closeModals} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">RETURN TO FORGE</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.9); }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
        @keyframes scan { from { top: -10px; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Industrial;