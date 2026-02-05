
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
import { User, RegisteredUnit, ViewState, WorkerProfile, NotificationType } from '../types';
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
  notify?: (type: NotificationType, title: string, message: string) => void;
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
  pendingAction, clearAction, onNavigate, onInitializeLiveProcess, notify
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
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }

    if (await onSpendEAC(SHARD_REG_FEE, "SOCIAL_SHARD_INITIALIZATION")) {
      setIsProcessingShard(true);
      notify?.('info', 'SHARDING_SYNC', 'Synchronizing new collective shard with registry...');
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
        notify?.('success', 'SHARD_ANCHORED', `Collective ${shardName} successfully sharded to industrial ledger.`);
      }, 2500);
    }
  };

  const handleSubmitBid = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }

    setIsProcessingBid(true);
    notify?.('info', 'BID_INGEST', 'Committing technical bid shard to mission bounty...');
    setTimeout(() => {
      setIsProcessingBid(false);
      setBidStep('success');
      notify?.('success', 'BID_COMMITTED', 'Handshake finalized. Standing by for quorum approval.');
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
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.4em]">Total Industrial Shards</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter leading-none">14.2<span className="text-xl text-amber-500 ml-1 italic">M</span></h4>
           </div>
           <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase">Archive Depth</span>
              <div className="flex items-center gap-2">
                 <TrendingUp size={14} />
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
                 <Activity size={14} />
                 <span className="text-[9px] font-mono text-blue-500 font-bold">OPTIMAL</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
         <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit mx-auto border border-white/5 bg-black/40 shadow-xl px-6">
           {/* Fix: Completed the truncated tab list and closed the component properly. */}
           {[
             { id: 'facilities', label: 'Facilities', icon: Factory },
             { id: 'workers', label: 'Steward Cloud', icon: HardHat },
             { id: 'mesh', label: 'Machine Mesh', icon: Network },
             { id: 'tenders', label: 'Mission Tenders', icon: Hammer },
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setActiveTab(t.id as any)}
               className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <t.icon size={18} /> {t.label}
             </button>
           ))}
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group w-full lg:w-[400px]">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
               <input 
                 type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                 placeholder="Filter Registry Shards..."
                 className="w-full bg-black/60 border border-white/10 rounded-full py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic" 
               />
            </div>
         </div>
      </div>

      <div className="min-h-[850px] relative z-10">
         {activeTab === 'facilities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-10 duration-1000">
               {filteredUnits.map(unit => (
                  <div key={unit.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[480px]">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Factory size={200} className="text-indigo-400" /></div>
                     <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                           <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all">
                              <Factory size={32} />
                           </div>
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${unit.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'}`}>
                              {unit.status}
                           </span>
                        </div>
                        <div>
                           <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-indigo-400 transition-colors drop-shadow-2xl">{unit.name}</h4>
                           <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest italic">{unit.id} // {unit.location}</p>
                        </div>
                     </div>
                     <div className="mt-14 pt-10 border-t border-white/5 space-y-6 relative z-10">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest px-2">
                           <span>Processing Power</span>
                           <span className="text-white font-mono">{unit.efficiency}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                           <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_#6366f1] transition-all duration-[2s]" style={{ width: `${unit.efficiency}%` }}></div>
                        </div>
                        <button className="w-full py-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl">Audit Facility Shard</button>
                     </div>
                  </div>
               ))}
               <div onClick={() => onNavigate('registry_handshake')} className="p-12 border-4 border-dashed border-white/5 rounded-[64px] flex flex-col items-center justify-center text-center space-y-8 opacity-20 hover:opacity-100 transition-opacity group cursor-pointer bg-black/20 h-[480px]">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform"><PlusCircle size={40} /></div>
                  <div className="space-y-4 px-10">
                     <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Pair Physical Facility</p>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Initialize a Registry Handshake to anchor new industrial hardware.</p>
                  </div>
               </div>
            </div>
         )}
         {activeTab !== 'facilities' && (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
               <div className="relative">
                  <Monitor size={120} className="text-slate-600 group-hover:text-indigo-500 transition-colors duration-1000" />
                  <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
               </div>
               <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">{activeTab.toUpperCase()}_TAB_INITIALIZING</p>
            </div>
         )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Industrial;
