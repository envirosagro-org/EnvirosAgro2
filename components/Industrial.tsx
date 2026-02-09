import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  PlusCircle, 
  Share2, 
  Hammer, 
  Target as TargetIcon, 
  Users, 
  ShieldCheck, 
  Clock,
  Maximize2,
  Bot,
  Factory,
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
  User as UserIcon,
  CircleDot,
  ArrowUpRight,
  Star,
  Pickaxe,
  UserPlus,
  Handshake
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
import { User, RegisteredUnit, ViewState, WorkerProfile, AgroProject } from '../types';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  collectives: any[];
  setCollectives: React.Dispatch<React.SetStateAction<any[]>>;
  onSaveProject: (project: AgroProject) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  industrialUnits: RegisteredUnit[];
  setIndustrialUnits: React.Dispatch<React.SetStateAction<RegisteredUnit[]>>;
  onInitializeLiveProcess?: (params: any) => void;
  notify: any;
  initialSection?: string | null;
}

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', esin: 'EA-SRH-8821', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000, efficiency: 94, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', location: 'California Hub' },
  { id: 'W-02', name: 'Marcus T.', esin: 'EA-MRC-4420', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000, efficiency: 82, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', location: 'Nairobi Ingest' },
  { id: 'W-03', name: 'Elena R.', esin: 'EA-ELN-0922', skills: ['Registry Auth', 'ZK-Proofs'], sustainabilityRating: 94, verifiedHours: 1560, isOpenToWork: true, lifetimeEAC: 31000, efficiency: 91, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', location: 'Valencia Shard' },
];

const TENDER_BOUNTIES = [
  { id: 'TND-882', title: 'Nairobi Hub Expansion', budget: 125000, deadline: '12d', thrust: 'Industry', difficulty: 'Critical', bidders: 4, desc: 'Provisioning L3 logistics shards for the eastern regional cluster.' },
  { id: 'TND-104', title: 'Solar Ingest Array v4', budget: 45000, deadline: '5d', thrust: 'Technological', difficulty: 'Medium', bidders: 12, desc: 'Calibration of autonomous energy nodes for Zone 2 moisture sensors.' },
  { id: 'TND-042', title: 'Carbon Vault Audit', budget: 15000, deadline: '2d', thrust: 'Environmental', difficulty: 'Standard', bidders: 8, desc: 'Third-party physical verification of bio-char sequestration proofs.' },
];

const SHARD_REG_FEE = 100;

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, collectives, setCollectives, onSaveProject, industrialUnits, setIndustrialUnits, onNavigate, notify, initialSection 
}) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'workers' | 'mesh' | 'tenders'>('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [selectedTender, setSelectedTender] = useState<any | null>(null);
  
  // Vector Routing Logic
  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection as any);
    }
  }, [initialSection]);

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
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingShard, setIsProcessingShard] = useState(false);

  const filteredUnits = industrialUnits.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredWorkers = MOCK_WORKERS.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRegisterShard = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify('error', 'SIGNATURE_MISMATCH', "Node ESIN does not match authenticated steward.");
      return;
    }

    if (await onSpendEAC(SHARD_REG_FEE, "INDUSTRIAL_COLLECTIVE_SHARD_INITIALIZATION")) {
      setIsProcessingShard(true);
      setTimeout(() => {
        const newShard: AgroProject = {
          id: `COLL-${Math.floor(Math.random() * 900 + 100)}`,
          name: shardName,
          adminEsin: user.esin,
          description: shardMission,
          thrust: 'Industry',
          status: 'Ideation',
          totalCapital: 1000,
          fundedAmount: 0,
          batchesClaimed: 0,
          totalBatches: 1,
          progress: 0,
          roiEstimate: 12,
          collateralLocked: 0,
          profitsAccrued: 0,
          investorShareRatio: 0.15,
          performanceIndex: 100,
          memberCount: 1,
          isPreAudited: false,
          isPostAudited: false
        };
        
        onSaveProject(newShard);
        setIsProcessingShard(false);
        setShardStep('success');
        notify('success', 'SHARD_ANCHORED', `Industrial Collective ${shardName} registered to global mesh.`);
      }, 2500);
    }
  };

  const handleBidTender = async (tender: any) => {
    const fee = 50;
    if (await onSpendEAC(fee, `TENDER_BID_DEPOSIT_${tender.id}`)) {
      notify('success', 'BID_COMMITTED', `You have officially bid for ${tender.title}. Sharding session initialized.`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Topology Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Network size={1000} className="text-indigo-500" />
      </div>

      {/* 1. Industrial HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { label: 'Mesh Throughput', val: globalThroughput.toFixed(1), unit: 'GB/s', icon: Network, color: 'text-indigo-400' },
          { label: 'Active Machine Peers', val: activePeers.toLocaleString(), unit: '', icon: Bot, color: 'text-emerald-400' },
          { label: 'Total Industrial Shards', val: '14.2', unit: 'M', icon: Database, color: 'text-amber-400' },
          { label: 'Global Resonance', val: '1.42', unit: 'm', icon: Zap, color: 'text-blue-400' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 flex flex-col justify-between relative overflow-hidden group shadow-2xl h-[280px]">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><m.icon size={120} /></div>
             <div className="space-y-4 relative z-10">
                <p className={`text-[10px] ${m.color} font-black uppercase tracking-[0.5em]`}>{m.label}</p>
                <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">{m.val}<span className={`text-xl ${m.color} ml-1 italic`}>{m.unit}</span></h4>
             </div>
             <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase">Registry V6.5</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${m.color.replace('text', 'bg')} animate-pulse`}></div>
                   <span className={`text-[9px] font-mono ${m.color} font-bold uppercase`}>Streaming</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* 2. Primary Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-6">
           {[
             { id: 'facilities', label: 'Node Registry', icon: Factory },
             { id: 'workers', label: 'Talent Shards', icon: Users },
             { id: 'mesh', label: 'Industrial Mesh', icon: Network },
             { id: 'tenders', label: 'Bounty Manifest', icon: Hammer },
           ].map(tab => (
             <button 
               key={tab.id}
               onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <tab.icon size={18} /> {tab.label}
             </button>
           ))}
         </div>

         <div className="flex items-center gap-6">
            <div className="relative group w-full lg:w-[400px]">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Search registry shards..." 
                 className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner"
               />
            </div>
            <button 
              onClick={() => { setShowShardModal(true); setShardStep('info'); }}
              className="p-5 agro-gradient rounded-2xl text-white shadow-3xl hover:scale-105 active:scale-95 transition-all border border-white/10"
              title="Mint New Industrial Shard"
            >
               <Plus size={24} />
            </button>
         </div>
      </div>

      {/* 3. Tab Viewport */}
      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: NODE REGISTRY --- */}
        {activeTab === 'facilities' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                 {filteredUnits.map(unit => (
                    <div key={unit.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden h-[550px] active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-[12s]"><Box size={300} className="text-white" /></div>
                       
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all shrink-0">
                             <Database size={48} />
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${
                                unit.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                unit.status === 'AUDITING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                                'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>{unit.status}</span>
                             <p className="text-[10px] text-slate-700 font-mono font-black italic tracking-widest">{unit.id}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{unit.name.toUpperCase()}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">{unit.type} // {unit.location}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-8">
                             <div className="p-6 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/val hover:border-emerald-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-2">Efficiency</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">98.2%</p>
                             </div>
                             <div className="p-6 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/val hover:border-indigo-500/20 transition-all text-right">
                                <p className="text-[9px] text-slate-600 font-black uppercase flex items-center justify-end gap-2">Load</p>
                                <p className="text-3xl font-mono font-black text-indigo-400">1.42<span className="text-sm">m</span></p>
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                          <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-md active:scale-95">Inspect Node</button>
                          <button 
                            onClick={() => onNavigate('digital_mrv')}
                            className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-white shadow-3xl active:scale-95 transition-all border border-white/10 ring-8 ring-indigo-500/5"
                          >
                             Audit Shard
                          </button>
                       </div>
                    </div>
                 ))}
                 {filteredUnits.length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 border-2 border-dashed border-white/5 rounded-[64px] bg-black/20">
                       <Database size={80} className="text-slate-600" />
                       <p className="text-2xl font-black uppercase tracking-[0.4em]">No physical industrial nodes paired.</p>
                       <button onClick={() => onNavigate('registry_handshake')} className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">INITIALIZE HANDSHAKE</button>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- VIEW: TALENT SHARDS --- */}
        {activeTab === 'workers' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {filteredWorkers.map(worker => (
                    <div key={worker.id} className="glass-card p-12 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden h-[650px] active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Fingerprint size={300} /></div>
                       
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className="w-24 h-24 rounded-[40px] border-4 border-white/10 bg-slate-800 overflow-hidden shadow-3xl group-hover:scale-105 transition-transform duration-700">
                             <img src={worker.avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">VERIFIED_EXPERT</span>
                             <p className="text-[10px] text-slate-700 font-mono font-bold tracking-widest uppercase italic">{worker.esin}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-6 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{worker.name}</h4>
                          <div className="flex flex-wrap gap-2 pt-2">
                             {worker.skills.map(s => (
                                <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest">{s}</span>
                             ))}
                          </div>
                          <p className="text-slate-400 text-lg italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"Located in {worker.location}. Certified EOS Steward with {worker.verifiedHours} verified industrial hours."</p>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 space-y-8 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-6 bg-black/60 border border-white/5 rounded-[40px] shadow-inner">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Resonance</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">{worker.sustainabilityRating}%</p>
                             </div>
                             <div className="p-6 bg-black/60 border border-white/5 rounded-[40px] shadow-inner text-right">
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-1">Efficiency</p>
                                <p className="text-3xl font-mono font-black text-indigo-400">{worker.efficiency}%</p>
                             </div>
                          </div>
                          <button 
                            onClick={() => setSelectedWorker(worker)}
                            className="w-full py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10 ring-8 ring-white/5"
                          >
                             <UserPlus size={18} /> INITIATE CONTRACT
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: INDUSTRIAL MESH --- */}
        {activeTab === 'mesh' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 flex flex-col items-center justify-center text-center space-y-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-[10s]"></div>
                 <div className="relative w-full h-[600px] flex items-center justify-center">
                    {/* Large Mesh Visualization Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                       <Network size={500} className="text-indigo-400 animate-spin-slow" />
                    </div>
                    <div className="relative z-10 space-y-10">
                       <div className="w-32 h-32 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-[0_0_120px_rgba(79,70,229,0.4)] border-4 border-white/10 mx-auto animate-float relative">
                          <Activity size={64} className="text-white animate-pulse" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">MESH <span className="text-indigo-400">TELEMETRY</span></h3>
                          <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed opacity-80">
                             "Observing machine-to-machine industrial resonance. High fidelity telemetry sharding across all regional clusters."
                          </p>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-10 pt-10 border-t border-white/5">
                          {[
                             { l: 'Consensus Rate', v: '99.98%', c: 'text-emerald-400' },
                             { l: 'L3 Finality', v: '12ms', c: 'text-blue-400' },
                             { l: 'Peer Entropy', v: '0.002', c: 'text-indigo-400' },
                             { l: 'Grid Stability', v: '1.42x', c: 'text-amber-400' },
                          ].map((s, i) => (
                             <div key={i} className="p-6 bg-black/80 rounded-3xl border border-white/10 shadow-inner group/stat hover:border-white/20 transition-all">
                                <p className="text-[10px] text-slate-600 font-black uppercase mb-1">{s.l}</p>
                                <p className={`text-2xl font-mono font-black ${s.c} tracking-tighter`}>{s.v}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
                 <button className="relative z-10 px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-[16px] ring-indigo-500/5 border-2 border-white/10">
                    <Terminal size={24} /> INITIALIZE MESH AUDIT
                 </button>
              </div>
           </div>
        )}

        {/* --- VIEW: BOUNTY MANIFEST (TENDERS) --- */}
        {activeTab === 'tenders' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 px-8 border-b border-white/5 pb-12">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">BOUNTY <span className="text-amber-500">MANIFEST</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-80">Industrial infrastructure projects sharded for node bidding.</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-[32px] text-center shadow-xl">
                       <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em] mb-1">Active Bounties</p>
                       <p className="text-4xl font-mono font-black text-white">42</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {TENDER_BOUNTIES.map(tender => (
                    <div key={tender.id} className="p-12 glass-card rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-amber-500/40 transition-all group flex flex-col justify-between h-[720px] shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Hammer size={300} /></div>
                       
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-6 rounded-3xl bg-amber-600/10 border border-amber-500/20 text-amber-500 shadow-2xl group-hover:rotate-6 transition-all">
                                <TargetIcon size={40} />
                             </div>
                             <div className="text-right flex flex-col items-end gap-3">
                                <span className={`px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20 tracking-widest`}>{tender.difficulty}</span>
                                <p className="text-[10px] text-slate-700 font-mono font-black italic tracking-widest">{tender.id}</p>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-amber-400 transition-colors">{tender.title}</h4>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">Pillar Anchor: {tender.thrust}</p>
                          </div>
                          <p className="text-slate-400 text-lg leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-4">"{tender.desc}"</p>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 space-y-10 relative z-10">
                          <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group/reward">
                             <p className="text-[10px] text-slate-600 font-black uppercase mb-3">Expected Bounty</p>
                             <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-[0_0_15px_#10b981]">
                                {tender.budget.toLocaleString()} <span className="text-2xl italic font-sans text-emerald-700">EAC</span>
                             </p>
                          </div>
                          <div className="flex justify-between items-center px-4">
                             <div className="flex items-center gap-3">
                                <Users size={16} className="text-slate-700" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{tender.bidders} Bids Sharded</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <Clock size={16} className="text-amber-500 animate-pulse" />
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{tender.deadline} Left</span>
                             </div>
                          </div>
                          <button 
                            onClick={() => handleBidTender(tender)}
                            className="w-full py-8 bg-amber-600 hover:bg-amber-500 rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-white/5"
                          >
                             COMMIT BID SHARD
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>

      {/* --- MODAL: SHARD REGISTRATION --- */}
      {showShardModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowShardModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-14 border-b border-white/5 bg-indigo-500/[0.02] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                       <PlusCircle size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Initialize <span className="text-indigo-400">Shard</span></h3>
                       <p className="text-indigo-400/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">INDUSTRIAL_INGEST_INIT</p>
                    </div>
                 </div>
                 <button onClick={() => setShowShardModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all z-20"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 {shardStep === 'info' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Collective Designation (Name)</label>
                          <input 
                            type="text" value={shardName} onChange={e => setShardName(e.target.value)}
                            placeholder="e.g. Neo-Logistics East"
                            className="w-full bg-black border border-white/10 rounded-2xl py-6 px-10 text-2xl font-bold text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Shard Mission Shard (Abstract)</label>
                          <textarea 
                             value={shardMission} onChange={e => setShardMission(e.target.value)}
                             placeholder="Describe the industrial objective..."
                             className="w-full bg-black border border-white/10 rounded-3xl p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-indigo-500/10 outline-none h-40 resize-none placeholder:text-slate-900 shadow-inner"
                          />
                       </div>
                       <button onClick={() => setShardStep('sign')} disabled={!shardName || !shardMission} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 border-4 border-white/10">CONTINUE TO SIGNATURE</button>
                    </div>
                 )}

                 {shardStep === 'sign' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex flex-col justify-center flex-1">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl relative group overflow-hidden">
                             <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                             <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                          </div>
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Node <span className="text-indigo-400">Signature</span></h4>
                       </div>

                       <div className="p-8 bg-black/60 border border-white/10 rounded-[44px] flex justify-between items-center shadow-inner group/fee hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <Coins size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                             <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Initialization Fee</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-white">{SHARD_REG_FEE} <span className="text-sm text-emerald-500 italic">EAC</span></span>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] block text-center">Auth Signature (ESIN)</label>
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX" 
                             className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.1em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setShardStep('info')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Back</button>
                          <button 
                            onClick={handleRegisterShard}
                            disabled={isProcessingShard || !esinSign}
                            className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                          >
                             {isProcessingShard ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={28} className="fill-current" />}
                             {isProcessingShard ? "MINTING SHARD..." : "AUTHORIZE MINT"}
                          </button>
                       </div>
                    </div>
                 )}

                 {shardStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.3)] relative group scale-110">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4 text-center">
                          <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_COLL_OK_SYNC</p>
                       </div>
                       <button onClick={() => setShowShardModal(false)} className="w-full max-w-md py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Command Hub</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: WORKER CONTRACT --- */}
      {selectedWorker && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setSelectedWorker(null)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[32px] overflow-hidden border-2 border-emerald-500 shadow-2xl">
                       <img src={selectedWorker.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Hire <span className="text-emerald-400">Steward Shard</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">TARGET_ESIN: {selectedWorker.esin}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedWorker(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="p-12 space-y-12 flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                 <div className="p-10 bg-black/60 rounded-[48px] border border-emerald-500/20 shadow-inner flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left space-y-2">
                       <p className="text-[10px] text-slate-600 font-black uppercase">Standard Contract Yield</p>
                       <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">1,200<span className="text-xl italic font-sans text-emerald-600/50">EAC</span></p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-3 border-l-4 border-emerald-500/20 pl-10">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Escrow Reliability</p>
                       <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-emerald-500 fill-emerald-500" />)}
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Authorize with Node Signature (ESIN)</label>
                    <input 
                       type="text" placeholder="EA-XXXX-XXXX-XXXX" 
                       className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.1em] outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                    />
                 </div>

                 <button 
                  onClick={() => { setSelectedWorker(null); notify('success', 'CONTRACT_INITIALIZED', "Engagement shard successfully added to active workforce."); }}
                  className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 ring-[16px] ring-emerald-500/5 border-2 border-white/10"
                 >
                    <Handshake size={28} /> COMMENCE ENGAGEMENT
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 120px -20px rgba(0, 0, 0, 0.9); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Industrial;