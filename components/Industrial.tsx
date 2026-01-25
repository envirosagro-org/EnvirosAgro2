
import React, { useState, useEffect, useRef } from 'react';
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
  Binary
} from 'lucide-react';
import { User, RegisteredUnit, ViewState, WorkerProfile } from '../types';

interface IndustrialProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  collectives: any[];
  setCollectives: React.Dispatch<React.SetStateAction<any[]>>;
  pendingAction?: string | null;
  clearAction?: () => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  industrialUnits: RegisteredUnit[];
  setIndustrialUnits: React.Dispatch<React.SetStateAction<RegisteredUnit[]>>;
}

const MOCK_TENDERS = [
  { id: 'TND-842', facility: 'Omaha Ingest Hub', requirement: 'Bio-Nitrogen Array Installation', budget: 45000, timeRemaining: '24h', thrust: 'Technological', bidders: 12 },
  { id: 'TND-112', facility: 'Nairobi Seed Vault', requirement: 'Spectral Cold Chain Maintenance', budget: 12500, timeRemaining: '6h', thrust: 'Environmental', bidders: 4 },
  { id: 'TND-091', facility: 'Silicon Soil Node', requirement: 'Swarm AI Hub Calibration', budget: 85000, timeRemaining: '12h', thrust: 'Industry', bidders: 28 },
];

const MOCK_WORKERS: WorkerProfile[] = [
  { id: 'W-01', name: 'Dr. Sarah Chen', skills: ['Soil Science', 'Spectral Analysis'], sustainabilityRating: 98, verifiedHours: 2400, isOpenToWork: true, lifetimeEAC: 45000 },
  { id: 'W-02', name: 'Marcus T.', skills: ['Hydroponics', 'IoT Maintenance'], sustainabilityRating: 85, verifiedHours: 820, isOpenToWork: true, lifetimeEAC: 12000 },
  { id: 'W-03', name: 'Elena R.', skills: ['Registry Auth', 'ZK-Proofs'], sustainabilityRating: 94, verifiedHours: 1560, isOpenToWork: true, lifetimeEAC: 31000 },
];

const SHARD_REG_FEE = 100;

const Industrial: React.FC<IndustrialProps> = ({ 
  user, onSpendEAC, collectives, setCollectives, industrialUnits, setIndustrialUnits,
  pendingAction, clearAction, onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<'facilities' | 'workers' | 'shards' | 'tenders'>('facilities');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Shard Registration State
  const [showShardModal, setShowShardModal] = useState(false);
  const [shardStep, setShardStep] = useState<'info' | 'config' | 'sign' | 'success'>('info');
  const [shardName, setShardName] = useState('');
  const [shardMission, setShardMission] = useState('');
  const [shardType, setShardType] = useState('Clan');
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingShard, setIsProcessingShard] = useState(false);

  // Bid Forge State
  const [showBidModal, setShowBidModal] = useState<any>(null);
  const [bidStep, setBidStep] = useState<'form' | 'sign' | 'success'>('form');
  const [bidAmount, setBidAmount] = useState('');
  const [bidApproach, setBidApproach] = useState('');
  const [isProcessingBid, setIsProcessingBid] = useState(false);

  useEffect(() => {
    if (pendingAction === 'REGISTER_NODE') {
      setActiveTab('facilities');
      clearAction?.();
    }
  }, [pendingAction, clearAction]);

  const filteredUnits = industrialUnits.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleRegisterShard = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }

    if (onSpendEAC(SHARD_REG_FEE, "SOCIAL_SHARD_INITIALIZATION")) {
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
        setIsProcessingShard(false);
        setShardStep('success');
      }, 2500);
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for shard registration.");
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
    <div className="h-full flex flex-col space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto overflow-y-auto custom-scrollbar overflow-x-hidden px-4 md:px-0">
      
      {/* 1. Header HUD */}
      <div className="flex flex-col items-center justify-center space-y-6 pt-10 shrink-0">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-8 py-3 bg-black/60 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all group shadow-xl"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          RETURN TO COMMAND CENTER
        </button>
        <div className="text-center space-y-1">
             <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em] leading-none mb-2 italic">INDUSTRIAL VELOCITY</p>
             <div className="flex items-center justify-center gap-4">
                <h2 className="text-3xl font-mono font-black text-indigo-400 tracking-tighter">STABLE_INGEST_99</h2>
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.8)] border border-white/20"></div>
             </div>
        </div>
      </div>

      {/* 2. Aggregate Efficiency Card */}
      <div className="max-w-3xl mx-auto w-full px-4 md:px-0 shrink-0">
        <div className="glass-card p-14 rounded-[64px] border-white/5 bg-black/40 flex flex-col justify-center text-center space-y-10 shadow-3xl relative overflow-hidden">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
           <p className="text-[14px] text-slate-500 font-black uppercase tracking-[0.8em] mb-4 relative z-10 italic opacity-60">AGGREGATE EFFICIENCY</p>
           <h4 className="text-[120px] md:text-[180px] font-mono font-black text-white tracking-tighter relative z-10 leading-none drop-shadow-2xl">94<span className="text-4xl text-indigo-500 ml-1 italic font-bold">%</span></h4>
           <div className="space-y-8 relative z-10 pt-10 px-4 md:px-10">
              <div className="flex justify-between items-center text-[13px] font-black uppercase text-slate-500 tracking-widest italic">
                 <span>MESH LOAD</span>
                 <span className="text-indigo-400 font-bold uppercase tracking-[0.3em]">STABLE</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-[94%] shadow-[0_0_20px_rgba(79,70,229,0.8)]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Horizontal Scroll Section Navigation */}
      <div className="max-w-5xl mx-auto w-full px-4 shrink-0 pb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 p-3 glass-card rounded-full border border-white/10 bg-black/80 shadow-3xl items-center min-w-max">
            {[
              { id: 'facilities', label: 'FACILITIES', icon: Database },
              { id: 'workers', label: 'WORKER CLOUD', icon: Users },
              { id: 'shards', label: 'SOCIAL SHARDS', icon: Share2 },
              { id: 'tenders', label: 'TENDER FORGE', icon: Hammer },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center justify-center gap-4 px-10 py-6 rounded-full text-[13px] font-black uppercase tracking-[0.4em] transition-all whitespace-nowrap italic ${
                    activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_15px_40px_rgba(79,70,229,0.6)] border border-white/20 scale-105' 
                    : 'text-slate-600 hover:text-white'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-700'}`} />
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {/* 4. Main Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 space-y-32 py-12 px-6 max-w-7xl mx-auto w-full">
        
        {/* FACILITIES SECTION */}
        {activeTab === 'facilities' && (
           <div className="space-y-20 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-6">
                 <h3 className="text-6xl md:text-[100px] font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">REGISTERED <span className="text-emerald-500">FACILITIES</span></h3>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-4xl mx-auto leading-relaxed">"Managing the core operational infrastructure nodes of the global industrial mesh network."</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-12 px-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Audit Facility Registry..." 
                      className="w-full bg-black/40 border border-white/10 rounded-[32px] py-5 pl-16 pr-8 text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
                    />
                </div>
                <button className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                    <PlusCircle size={20} /> Register Facility
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full px-4">
                {filteredUnits.map(unit => (
                  <div key={unit.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 flex flex-col md:flex-row justify-between items-center group hover:border-emerald-500/40 transition-all shadow-3xl relative overflow-hidden active:scale-[0.98] duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="flex items-center gap-10 relative z-10 w-full md:w-auto">
                      <div className="w-24 h-24 rounded-[40px] bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-3xl group-hover:rotate-6 transition-transform shrink-0">
                         <Database size={48} />
                      </div>
                      <div>
                        <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none group-hover:text-emerald-400 transition-colors">{unit.name.toUpperCase()}</h4>
                        <p className="text-[11px] text-slate-600 font-black uppercase mt-4 tracking-[0.4em]">{unit.type} NODE // {unit.location.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-12 relative z-10 w-full md:w-auto mt-10 md:mt-0">
                      <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter drop-shadow-2xl">{unit.efficiency}%</p>
                      <span className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em] mt-3 block italic">MESH_LOAD</span>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* WORKER CLOUD SECTION */}
        {activeTab === 'workers' && (
           <div className="space-y-20 w-full animate-in fade-in duration-700">
              <div className="text-center space-y-6">
                 <h3 className="text-6xl md:text-[100px] font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">WORKER <br/><span className="text-blue-500">CLOUD</span></h3>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-4xl mx-auto leading-relaxed">"Access verified professional talent sharded across the permanent network registry."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-4">
                {MOCK_WORKERS.map(worker => (
                  <div key={worker.id} className="p-16 glass-card rounded-[80px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col justify-between min-h-[650px] shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-500">
                     <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-110 transition-transform"><Users size={400} className="text-white" /></div>
                     
                     <div className="space-y-12 relative z-10">
                        <div className="flex justify-between items-start">
                           <div className="w-32 h-32 rounded-[44px] bg-slate-800 flex items-center justify-center font-black text-6xl text-blue-400 border-2 border-white/10 shadow-2xl group-hover:rotate-6 transition-transform">
                              {worker.name[0]}
                           </div>
                           <div className="text-right flex flex-col items-end">
                              <span className="px-6 py-2 bg-blue-500/10 text-blue-400 text-[11px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest italic font-bold">REPUTATION: {worker.sustainabilityRating}%</span>
                              <p className="text-[12px] text-slate-800 font-mono mt-5 uppercase tracking-[0.5em] font-black">{worker.id}</p>
                           </div>
                        </div>
                        <div>
                           <h4 className="text-6xl font-black text-white uppercase italic leading-tight m-0 group-hover:text-blue-400 transition-colors tracking-tighter">{worker.name.toUpperCase()}</h4>
                           <div className="flex flex-wrap gap-4 mt-12">
                             {worker.skills.map(skill => (
                                <span key={skill} className="px-8 py-3 bg-white/5 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-widest border border-white/10 hover:text-white hover:bg-blue-600/10 transition-all">{skill}</span>
                             ))}
                           </div>
                        </div>
                     </div>

                     <div className="pt-12 mt-12 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                           <ShieldCheck size={32} className="text-emerald-400 drop-shadow-[0_0_10px_#10b981]" />
                           <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest italic">{worker.verifiedHours} VERIFIED HOURS</span>
                        </div>
                        <button className="px-14 py-7 bg-white/5 border border-white/10 rounded-[32px] text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-blue-600/10 transition-all shadow-xl">VIEW DOSSIER</button>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* SOCIAL SHARDS SECTION */}
        {activeTab === 'shards' && (
           <div className="space-y-20 w-full animate-in fade-in duration-700">
              <div className="text-center space-y-8">
                 <h3 className="text-6xl md:text-[100px] font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">SOCIAL <span className="text-indigo-500">SHARD REGISTRY</span></h3>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-4xl mx-auto leading-relaxed">"Join decentralized guilds or register a new collective to scale group-based industrial sharding."</p>
                 <div className="pt-10">
                   <button 
                     onClick={() => { setShowShardModal(true); setShardStep('info'); }}
                     className="px-16 py-7 bg-indigo-600 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-4 mx-auto border-2 border-white/10 group"
                   >
                      <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Register New Social Shard
                   </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
                {collectives.map(coll => (
                  <div key={coll.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><Share2 size={300} /></div>
                    <div className="space-y-8 relative z-10">
                       <div className="flex justify-between items-start">
                          <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-xl group-hover:rotate-6 transition-all">
                             <Users size={32} />
                          </div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">{coll.type}</span>
                             <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase tracking-tighter italic">{coll.id}</p>
                          </div>
                       </div>
                       <div>
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-indigo-400 transition-colors">{coll.name.toUpperCase()}</h4>
                          <p className="text-sm text-slate-400 italic mt-6 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{coll.mission}"</p>
                       </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-3">
                          <Activity className="w-5 h-5 text-indigo-400" />
                          <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest italic">Resonance: {coll.resonance}%</span>
                       </div>
                       <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-indigo-600/10 transition-all shadow-xl">VIEW COLLECTIVE</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* TENDERS SECTION */}
        {activeTab === 'tenders' && (
           <div className="space-y-20 w-full animate-in fade-in duration-700">
              <div className="text-center space-y-6">
                 <h3 className="text-6xl md:text-[100px] font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">TENDER <span className="text-rose-500">FORGE</span></h3>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-4xl mx-auto leading-relaxed">"Bidding and execution of high-scale industrial mission shards."</p>
              </div>

              <div className="grid grid-cols-1 gap-8 px-4">
                 {MOCK_TENDERS.map(tender => (
                    <div key={tender.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 hover:border-rose-500/30 transition-all group flex flex-col md:flex-row items-center justify-between shadow-3xl bg-black/40 relative overflow-hidden active:scale-[0.99] duration-500">
                       <div className="flex items-center gap-10 relative z-10 flex-1">
                          <div className="w-24 h-24 rounded-[40px] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-3xl group-hover:rotate-12 transition-transform shrink-0">
                             <Hammer size={40} />
                          </div>
                          <div>
                             <div className="flex items-center gap-4">
                                <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">{tender.requirement.toUpperCase()}</h4>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase">{tender.thrust}</span>
                             </div>
                             <p className="text-[11px] text-slate-600 font-black uppercase mt-4 tracking-[0.4em]">FACILITY: {tender.facility.toUpperCase()} // ID: {tender.id}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-12 relative z-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-12">
                          <div className="text-center md:text-right space-y-1">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Bounty Shard</p>
                             <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{tender.budget.toLocaleString()} EAC</p>
                          </div>
                          <button 
                            onClick={() => { setShowBidModal(tender); setBidStep('form'); }}
                            className="px-12 py-5 bg-rose-600 hover:bg-rose-500 rounded-[32px] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-90"
                          >
                             BID SHARD
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. SOCIAL SHARD REGISTRATION MODAL */}
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

      {/* 2. TENDER FORGE BID MODAL */}
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
                       <div className="w-24 h-24 bg-rose-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-rose-500/20 shadow-3xl">
                          <Fingerprint className="w-12 h-12 text-rose-500" />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Tender <span className="text-rose-500">Handshake</span></h3>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Steward ID (ESIN)</label>
                       <input 
                         type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                         placeholder="EA-XXXX-XXXX-XXXX" 
                         className="w-full bg-black/60 border border-white/10 rounded-[40px] py-8 text-center text-3xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-rose-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                       />
                    </div>
                    <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[40px] flex items-center gap-6 shadow-inner">
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
                       <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">TENDER_SYNC_ID: 0xBID_{(Math.random()*1000).toFixed(0)}_OK</p>
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
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
      `}</style>
    </div>
  );
};

export default Industrial;
