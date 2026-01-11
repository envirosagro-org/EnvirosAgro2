
import React, { useState, useEffect, useMemo } from 'react';
import { 
  PawPrint, 
  TreePine, 
  Binoculars, 
  Map as MapIcon, 
  Camera, 
  Film, 
  ShieldCheck, 
  Activity, 
  PlusCircle, 
  Zap, 
  ChevronRight, 
  X, 
  Loader2, 
  ArrowUpRight, 
  Globe, 
  Sparkles, 
  Bot, 
  Waves, 
  Compass, 
  Heart, 
  ArrowLeftCircle,
  Bird,
  Mountain,
  Flower,
  Dna,
  Play,
  Maximize,
  Clock,
  ExternalLink,
  Target,
  BadgeCheck,
  History,
  TrendingUp,
  MapPin,
  Sprout,
  Download,
  Upload,
  Info,
  Radar,
  LocateFixed,
  Database,
  Search,
  Eye,
  MessageSquare,
  Thermometer,
  ShieldAlert,
  Calendar,
  Layers,
  Smartphone,
  Star,
  CheckCircle2,
  ArrowRight,
  Users,
  Coins
} from 'lucide-react';
import { User, ViewState } from '../types';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface AgrowildProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

const WILDLIFE_NODES = [
  { id: 'WLF-01', name: 'Northern Savannah Corridor', species: 'African Elephant', status: 'Protected', health: 94, tracking: 'ACTIVE', col: 'text-amber-500', population: '1.2K', range: '450 sq km' },
  { id: 'WLF-02', name: 'Coastal Mangrove Sanctuary', species: 'Hawksbill Turtle', status: 'Endangered', health: 88, tracking: 'STABLE', col: 'text-emerald-500', population: '840', range: '120 sq km' },
  { id: 'WLF-03', name: 'Alpine Leopard Shard', species: 'Snow Leopard', status: 'Rare', health: 92, tracking: 'LOW_SIGNAL', col: 'text-blue-500', population: '142', range: '800 sq km' },
];

const BOTANICAL_ARCHIVE = [
  { id: 'FLR-882', name: 'Bantu Sun-Orchid', rarity: 'Extremely Rare', biome: 'Tropical Highlands', features: 'High UV absorption shards.', usage: 'Soil repair catalysis.' },
  { id: 'FLR-104', name: 'Desert Moisture-Vine', rarity: 'Rare', biome: 'Arid Shards', features: 'Deep root telemetry sync.', usage: 'Water table mapping.' },
  { id: 'FLR-042', name: 'Alpine Silver Moss', rarity: 'Vulnerable', biome: 'Glacial Nodes', features: 'Thermal stability buffer.', usage: 'Permafrost protection.' },
];

const TOURISM_OFFERS = [
  { id: 'TOU-01', title: 'Spectral Birding Safari', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.' },
  { id: 'TOU-02', title: 'Bantu Nature Walk', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.' },
  { id: 'TOU-03', title: 'Night Predator Tracking', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.' },
];

const TRENDING_SHARDS = [
  { id: 'TS-01', title: 'The Great Savannah Migration Shard', author: '@wild_watcher', engagement: '14.2K', type: 'Video', col: 'text-amber-500' },
  { id: 'TS-02', title: 'Rare Orchid Bloom Log: Zone 8', author: '@steward_lyra', engagement: '8.4K', type: 'Discovery', col: 'text-pink-500' },
  { id: 'TS-03', title: 'Mangrove Restoration Pulse', author: '@eco_node', engagement: '12.1K', type: 'Audit', col: 'text-emerald-500' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'conservancy' | 'tourism' | 'discovery' | 'documentary'>('conservancy');
  
  // Modals
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showTrendingModal, setShowTrendingModal] = useState(false);
  const [selectedWildlife, setSelectedWildlife] = useState<any | null>(null);

  // Discovery/Mapping Process States
  const [discoveryStep, setDiscoveryStep] = useState<'upload' | 'analysis' | 'success'>('upload');
  const [mappingStep, setMappingStep] = useState<'scan' | 'sync' | 'success'>('scan');
  const [discoveryResult, setDiscoveryResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const stats = [
    { label: 'Species Tracked', val: '1,284', icon: PawPrint, col: 'text-amber-500' },
    { label: 'Flora Protected', val: '42K Shards', icon: TreePine, col: 'text-emerald-500' },
    { label: 'Eco-Credits Earned', val: '8.4K EAC', icon: Zap, col: 'text-blue-400' },
    { label: 'Wildlife Integrity', val: '92%', icon: ShieldCheck, col: 'text-indigo-400' },
  ];

  const handleDiscoverySubmit = async () => {
    setIsAnalyzing(true);
    setDiscoveryStep('analysis');
    try {
      const res = await runSpecialistDiagnostic("Flora/Fauna Discovery", "Analyze this image shard for species identification and environmental resonance.");
      setDiscoveryResult(res.text);
      setDiscoveryStep('success');
      onEarnEAC(50, 'NEW_SPECIES_DISCOVERY_SHARD');
    } catch (e) {
      alert("Oracle Handshake Failed.");
      setDiscoveryStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMappingPulse = () => {
    setMappingStep('scan');
    setShowMappingModal(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 2;
      setScanProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setMappingStep('sync');
        setTimeout(() => {
          setMappingStep('success');
          onEarnEAC(25, 'WILDERNESS_MAPPING_PULSE');
        }, 1500);
      }
    }, 50);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
      {/* Back Button */}
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-widest">Shard: AGROWILD_CORE</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <PawPrint className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <PawPrint className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">AGROWILD_BIODIVERSITY_V4</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Agro<span className="text-emerald-400">wild</span> Portal</h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                 Where sustainable stewardship meets wild preservation. Tracking species, protecting rare flora, and documenting the heartbeat of our planet.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                <button 
                  onClick={() => { setShowDiscoveryModal(true); setDiscoveryStep('upload'); }}
                  className="px-8 py-4 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> Discover New Plant Shard
                </button>
                <button 
                  onClick={() => setActiveTab('tourism')}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Binoculars className="w-5 h-5 text-emerald-400" /> Book Nature Walk
                </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {stats.map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/20 transition-all shadow-lg">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'conservancy', label: 'Conservancy Hub', icon: ShieldCheck },
          { id: 'tourism', label: 'Wild Tourism', icon: Binoculars },
          { id: 'discovery', label: 'Plant Discovery', icon: Sprout },
          { id: 'documentary', label: 'Wild Docu-Archive', icon: Film },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Sections */}
      <div className="min-h-[700px]">
        {activeTab === 'conservancy' && (
          <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Wildlife <span className="text-amber-500">& Flora Conservancy</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Real-time status of protected regional nodes and ecosystem health.</p>
                </div>
                <div className="flex gap-3">
                   <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Consensus Verified
                   </span>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <h4 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 px-4">
                      <Target className="w-6 h-6 text-amber-500" /> Active Tracking Nodes
                   </h4>
                   <div className="space-y-6">
                      {WILDLIFE_NODES.map(node => (
                        <div 
                          key={node.id} 
                          onClick={() => setSelectedWildlife(node)}
                          className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-amber-500/30 transition-all flex items-center justify-between shadow-xl cursor-pointer group active:scale-[0.98]"
                        >
                           <div className="flex items-center gap-6">
                              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-amber-500/10 group-hover:rotate-6 transition-all">
                                 <Bird className={`w-8 h-8 ${node.col}`} />
                              </div>
                              <div>
                                 <h5 className="text-xl font-black text-white uppercase italic tracking-tight">{node.name}</h5>
                                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Species Focus: <span className="text-slate-300">{node.species}</span></p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                 node.status === 'Protected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                 {node.status}
                              </span>
                              <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-tighter italic">TRACKING: {node.tracking}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col justify-center items-center text-center space-y-10 group shadow-3xl">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] ring-4 ring-white/10 relative z-10 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-12 h-12 text-white" />
                   </div>
                   <div className="space-y-4 relative z-10 max-w-sm mx-auto">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Flora Registry</h4>
                      <p className="text-slate-400 text-lg italic leading-relaxed">
                        "Documenting 12,000+ species of heritage seeds and rare wild flora to secure the future biome resilience."
                      </p>
                   </div>
                   <button 
                     onClick={() => setShowArchiveModal(true)}
                     className="w-full max-w-xs py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl relative z-10 active:scale-95"
                   >
                      Explore Botanical Archive
                   </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'tourism' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
                <div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Wild Life <span className="text-emerald-400">Tourism Hub</span></h3>
                   <p className="text-slate-500 text-sm mt-1">Verified eco-experiences and nature walks within protected regional zones.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {TOURISM_OFFERS.map(offer => (
                  <div key={offer.id} className="glass-card rounded-[48px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/40 shadow-2xl relative">
                     <div className="h-64 relative overflow-hidden shrink-0">
                        <img src={offer.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" alt={offer.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-md bg-black/60 px-3 py-1 rounded-full border border-white/10">STWD_GUIDED</span>
                        </div>
                     </div>

                     <div className="p-10 flex-1 flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                           <h4 className="text-2xl font-black text-white uppercase tracking-tight italic leading-none">{offer.title}</h4>
                           <div className="flex items-center gap-1 text-amber-500">
                              <BadgeCheck className="w-4 h-4" />
                              <span className="text-[10px] font-black">{offer.rating}</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">NODE_REF: {offer.id} // DUR: {offer.duration}</p>
                        <p className="text-slate-400 text-sm italic font-medium leading-relaxed flex-1">"{offer.desc}"</p>
                        
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Shard Bounty</p>
                              <p className="text-2xl font-mono font-black text-emerald-400">{offer.cost} EAC</p>
                           </div>
                           <button className="p-5 rounded-[28px] bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl hover:scale-110 active:scale-95">
                              <Binoculars className="w-6 h-6" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'discovery' && (
           <div className="space-y-12 animate-in zoom-in duration-500">
              <div className="glass-card p-16 rounded-[64px] bg-emerald-600/5 border border-emerald-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
                    <TreePine className="w-96 h-96 text-white" />
                 </div>
                 
                 <div className="w-64 h-64 agro-gradient rounded-full flex flex-col items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.3)] ring-[20px] ring-white/5 shrink-0 animate-pulse relative">
                    <Sprout className="w-24 h-24 text-white" />
                    <div className="absolute inset-[-10px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                 </div>

                 <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                    <div className="space-y-2">
                       <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">SPECIES_MINTING_NODE</span>
                       <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Discover <span className="text-emerald-400">Rare Flora</span></h2>
                    </div>
                    <p className="text-slate-300 text-2xl leading-relaxed italic font-medium max-w-2xl mx-auto lg:mx-0">
                       Found a rare plant? Initialize an image shard and let the Agrowild Oracle identify it for registry rewards.
                    </p>
                    <button 
                       onClick={() => { setShowDiscoveryModal(true); setDiscoveryStep('upload'); }}
                       className="px-12 py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 mx-auto lg:mx-0 active:scale-95 transition-all"
                    >
                       <Camera className="w-6 h-6" /> MINT DISCOVERY SHARD
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 space-y-8 group">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                          <History className="w-6 h-6 text-emerald-400" /> Recent Discovery Shards
                       </h4>
                       <span className="text-[10px] font-mono text-slate-700 tracking-tighter">DATA_SYNC: 12H_BLOCK</span>
                    </div>
                    <div className="space-y-6">
                       {[
                         { name: 'Red-Vein Lily Shard', location: 'Zone 4 Hub', time: '1h ago', status: 'Verified', eac: '+50' },
                         { name: 'Heritage Vine Node', location: 'Zone 8 KE', time: '4h ago', status: 'Pending Audit', eac: '+0' },
                       ].map((disc, i) => (
                         <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 group-hover:border-emerald-500/20 transition-all flex items-center justify-between">
                            <div className="flex items-center gap-6">
                               <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5 text-emerald-500">
                                  <Flower className="w-6 h-6" />
                               </div>
                               <div>
                                  <h5 className="text-lg font-black text-white italic">{disc.name}</h5>
                                  <p className="text-[9px] text-slate-500 uppercase font-black">{disc.location} // {disc.time}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-mono font-black text-emerald-400">{disc.eac} EAC</p>
                               <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{disc.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="glass-card p-12 rounded-[56px] bg-blue-600/5 border-blue-500/20 flex flex-col justify-center items-center text-center space-y-10 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/[0.02] animate-pulse"></div>
                    <div className="w-24 h-24 bg-blue-500/20 rounded-[32px] flex items-center justify-center border border-blue-500/40 shadow-2xl relative z-10">
                       <Compass className="w-12 h-12 text-blue-400" />
                    </div>
                    <div className="space-y-4 relative z-10 max-w-xs mx-auto">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Map Wilderness</h4>
                       <p className="text-slate-400 text-lg italic leading-relaxed font-medium">Contribute to the global wild-map by tagging untamed nodes and eco-corridors.</p>
                    </div>
                    <button 
                      onClick={handleMappingPulse}
                      className="w-full max-w-[280px] py-5 bg-blue-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-500 transition-all relative z-10 active:scale-95"
                    >
                       INITIALIZE MAPPING PULSE
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'documentary' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10 px-4">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4 leading-none">
                       <Film className="w-10 h-10 text-emerald-400" /> Wild <span className="text-emerald-400">Docu-Archive</span>
                    </h3>
                    <p className="text-lg text-slate-500 italic font-medium">Educational documentaries and high-fidelity field reports from Agrowild nodes.</p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setShowTrendingModal(true)}
                      className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Trending Shards
                    </button>
                    <button className="px-8 py-3 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Newest Posts</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {[
                   { title: 'The Last Corridor', thumb: 'https://images.unsplash.com/photo-1516422317184-268d71010020?q=80&w=800', dur: '45:00', author: 'AgroWild Production', tags: ['Savannah', 'Elephant Tracking'], plays: '1.2K' },
                   { title: 'Mangrove Resilience', thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', dur: '22:00', author: 'Coastal Sanctuary', tags: ['Mangrove', 'Turtles'], plays: '842' },
                 ].map((doc, i) => (
                   <div key={i} className="glass-card rounded-[56px] overflow-hidden group border border-white/5 hover:border-emerald-500/30 transition-all relative">
                      <div className="h-80 relative overflow-hidden">
                         <img src={doc.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={doc.title} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black shadow-3xl hover:scale-110 active:scale-95 transition-all">
                               <Play className="w-10 h-10 fill-current translate-x-1" />
                            </button>
                         </div>
                         <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                            <div className="space-y-2">
                               <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">{doc.title}</h4>
                               <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">BY {doc.author}</p>
                            </div>
                            <div className="flex gap-4">
                               <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/10">{doc.dur}</span>
                            </div>
                         </div>
                      </div>
                      <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-8 bg-white/[0.01]">
                         <div className="flex gap-3">
                            {doc.tags.map(t => <span key={t} className="px-4 py-1.5 bg-black/40 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest border border-white/5">#{t}</span>)}
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 text-slate-500 font-black text-[10px]">
                               <TrendingUp size={16} /> {doc.plays} PLAYS
                            </div>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90">
                               <Download size={20} />
                            </button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 1. Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowMappingModal(false)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-blue-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              
              <div className="p-12 border-b border-white/5 bg-blue-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center shadow-2xl">
                       <Radar className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Mapping <span className="text-blue-400">Pulse</span></h3>
                       <p className="text-[10px] text-blue-500/60 font-mono tracking-widest uppercase mt-2">EOS_SPATIAL_SCAN // ACTIVE_NODE_INGEST</p>
                    </div>
                 </div>
                 <button onClick={() => setShowMappingModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 p-12 flex flex-col justify-center items-center space-y-12">
                 {mappingStep === 'scan' && (
                    <div className="space-y-12 text-center w-full max-w-lg">
                       <div className="relative h-80 rounded-[48px] bg-black/60 border border-blue-500/20 overflow-hidden group">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/20 rounded-full flex items-center justify-center">
                             <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                             <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"></div>
                          </div>
                          <div 
                            className="absolute bottom-0 left-0 h-1 bg-blue-500/40 shadow-[0_0_20px_#3b82f6]" 
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-blue-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Scanning Wilderness Shards...</p>
                          <p className="text-slate-600 font-mono text-[10px]">{scanProgress}% COMPLETE // SECTOR_8_KE</p>
                       </div>
                    </div>
                 )}

                 {mappingStep === 'sync' && (
                    <div className="flex flex-col items-center space-y-10 animate-in fade-in duration-500">
                       <Loader2 className="w-20 h-20 text-blue-400 animate-spin" />
                       <p className="text-white font-black text-lg uppercase tracking-widest">Anchoring Spatial Ledger...</p>
                    </div>
                 )}

                 {mappingStep === 'success' && (
                    <div className="flex flex-col items-center text-center space-y-10 animate-in zoom-in duration-700">
                       <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                          <CheckCircle2 className="w-20 h-20 text-white" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-4xl font-black text-white uppercase tracking-tighter">Wilderness Shard Anchored</h4>
                          <p className="text-slate-400 text-lg">Registry Reward: <span className="text-emerald-400 font-black">+25 EAC</span> released to your node.</p>
                       </div>
                       <button onClick={() => setShowMappingModal(false)} className="px-12 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl">Return to Portal</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 2. Botanical Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowArchiveModal(false)}></div>
           <div className="relative z-10 w-full max-w-5xl h-[85vh] glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-[28px] flex items-center justify-center shadow-2xl">
                       <BookOpenCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Botanical <span className="text-emerald-400">Archive</span></h3>
                       <p className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase mt-2">EOS_HERITAGE_SEED_REGISTRY // v4.2</p>
                    </div>
                 </div>
                 <button onClick={() => setShowArchiveModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BOTANICAL_ARCHIVE.map(plant => (
                      <div key={plant.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-orange-500/30 transition-all flex flex-col group relative overflow-hidden bg-black/40 shadow-xl">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                            <Flower className="w-40 h-40 text-white" />
                         </div>
                         <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                               <Flower className="w-8 h-8" />
                            </div>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">
                               {plant.id}
                            </span>
                         </div>
                         <h4 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2 group-hover:text-pink-400 transition-colors leading-none m-0">{plant.name}</h4>
                         <p className="text-orange-400 text-[10px] font-bold uppercase mb-6">{plant.rarity}</p>
                         
                         <div className="space-y-4 mb-8 flex-1">
                            <div className="flex justify-between text-[10px] uppercase font-black">
                               <span className="text-slate-600">Biome Shard</span>
                               <span className="text-white">{plant.biome}</span>
                            </div>
                            <div className="flex justify-between text-[10px] uppercase font-black">
                               <span className="text-slate-600">Primary Usage</span>
                               <span className="text-emerald-400">{plant.usage}</span>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                            <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                               View DNA Shard <ArrowRight size={14} />
                            </button>
                            <Download size={16} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Trending Shard Modal */}
      {showTrendingModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowTrendingModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col h-fit max-h-[80vh]">
              <div className="p-12 border-b border-white/5 bg-emerald-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-600 rounded-[28px] flex items-center justify-center shadow-2xl">
                       <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Trending <span className="text-emerald-400">Shards</span></h3>
                       <p className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase mt-2">GLOBAL_ENGAGEMENT_SYNC // LIVE</p>
                    </div>
                 </div>
                 <button onClick={() => setShowTrendingModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar space-y-6">
                 {TRENDING_SHARDS.map(shard => (
                    <div key={shard.id} className="p-8 glass-card border border-white/5 rounded-[40px] hover:bg-white/[0.02] transition-all group flex items-center justify-between cursor-pointer active:scale-[0.99]">
                       <div className="flex items-center gap-8">
                          <div className={`p-5 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform ${shard.col}`}>
                             {shard.type === 'Video' ? <Film size={28} /> : shard.type === 'Discovery' ? <Sprout size={28} /> : <Activity size={28} />}
                          </div>
                          <div>
                             <h4 className="text-xl font-bold text-white uppercase tracking-tight italic leading-none">{shard.title}</h4>
                             <p className="text-[10px] text-slate-500 mt-2 uppercase font-black">{shard.author} • {shard.type} Shard</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-2 justify-end text-emerald-400 font-mono font-black text-xl mb-1">
                             <Zap size={18} fill="currentColor" /> {shard.engagement}
                          </div>
                          <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">NETWORK_PULSE</span>
                       </div>
                    </div>
                 ))}
                 <button className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Sync More Shards</button>
              </div>
           </div>
        </div>
      )}

      {/* 4. Wildlife Dossier Modal */}
      {selectedWildlife && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedWildlife(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-amber-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              
              <div className="p-12 border-b border-white/5 bg-amber-500/[0.02] flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-amber-600 rounded-[32px] flex items-center justify-center shadow-3xl">
                       <PawPrint className="w-10 h-10 text-white" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">{selectedWildlife.species} <span className="text-amber-500">Dossier</span></h3>
                       <p className="text-[10px] text-amber-500/60 font-mono tracking-widest uppercase mt-3">NODE_ID: {selectedWildlife.id} // REGISTRY_SECURED</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedWildlife(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
              </div>

              <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-12">
                 <div className="lg:w-1/2 space-y-10">
                    <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-8 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity className="w-48 h-48 text-white" /></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3 relative z-10">
                          <Activity className="w-5 h-5 text-amber-500" /> Biometric Sync
                       </h4>
                       <div className="grid grid-cols-2 gap-6 relative z-10">
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Health Index</p>
                             <p className="text-3xl font-mono font-black text-emerald-400">{selectedWildlife.health}%</p>
                          </div>
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                             <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Registry Signal</p>
                             <p className="text-3xl font-mono font-black text-blue-400">NOMINAL</p>
                          </div>
                       </div>
                       <div className="space-y-4 pt-4 relative z-10">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                             <span>Node Integrity Buffer</span>
                             <span className="text-white">Active</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-amber-500 animate-pulse shadow-[0_0_15px_#f59e0b]" style={{ width: '92%' }}></div>
                          </div>
                       </div>
                    </div>

                    <div className="p-10 glass-card rounded-[48px] bg-blue-600/5 border border-blue-500/20 space-y-4">
                       <div className="flex items-center gap-3">
                          <MapPin className="w-6 h-6 text-blue-400" />
                          <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Geospatial Range</h4>
                       </div>
                       <p className="text-slate-400 text-lg italic leading-relaxed font-medium pl-9 border-l-2 border-blue-500/20">
                          This species shard actively monitors {selectedWildlife.range} within the {selectedWildlife.name}.
                       </p>
                    </div>
                 </div>

                 <div className="lg:w-1/2 space-y-8">
                    <div className="p-10 glass-card rounded-[48px] bg-white/[0.01] border border-white/5 space-y-10">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5 pb-6">Population Shards</h4>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                                <Users size={28} className="text-amber-500" />
                             </div>
                             <div>
                                <p className="text-4xl font-mono font-black text-white">{selectedWildlife.population}</p>
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">EST_RESONANCE_LOAD</p>
                             </div>
                          </div>
                          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                             <p className="text-[8px] text-emerald-500 font-black uppercase mb-1">Status</p>
                             <p className="text-xs font-black text-white uppercase tracking-widest">{selectedWildlife.status}</p>
                          </div>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[32px] border border-white/5 space-y-4">
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><History size={12} /> Registry Feed</h5>
                          <div className="space-y-3 font-mono text-[9px]">
                             <p className="text-slate-600 italic">>> PACKET_INGEST: 2024.12.12_14:20</p>
                             <p className="text-emerald-500">>> SIGNAL_MATCH_ZK_PROOF: SUCCESS</p>
                             <p className="text-slate-600 italic">>> COMMITTING_TELEMETRY: SHARD_V4</p>
                          </div>
                       </div>
                    </div>
                    <button className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
                       <ShieldCheck className="w-6 h-6" /> Anchor Audit Sign-off
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Discovery Modal */}
      {showDiscoveryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowDiscoveryModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 space-y-10 min-h-[650px] flex flex-col justify-center">
                 <button onClick={() => setShowDiscoveryModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X className="w-8 h-8" /></button>
                 
                 {discoveryStep === 'upload' && (
                    <div className="space-y-10 text-center animate-in slide-in-from-right-4 duration-500">
                       <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                          <Camera className="w-12 h-12 text-emerald-400" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Flora <span className="text-emerald-400">Discovery</span></h3>
                          <p className="text-slate-400 text-lg">Upload an image shard to identify species and earn registry EAC rewards.</p>
                       </div>
                       <div className="p-12 border-4 border-dashed border-white/5 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all">
                          <Upload className="w-12 h-12 text-slate-600 mb-6" />
                          <p className="text-xl font-black text-white uppercase tracking-widest">Select Image Shard</p>
                       </div>
                       <button onClick={handleDiscoverySubmit} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl">Initialize Oracle Analysis</button>
                    </div>
                 )}

                 {discoveryStep === 'analysis' && (
                    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-10px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                             <Dna className="w-20 h-20 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4 text-center">
                          <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Sequencing DNA Shard...</p>
                          <p className="text-slate-600 font-mono text-[10px]">EOS_BOTANICAL_MATCH_v3.2</p>
                       </div>
                    </div>
                 )}

                 {discoveryStep === 'success' && (
                    <div className="space-y-10 animate-in zoom-in duration-700">
                       <div className="p-10 glass-card rounded-[48px] bg-white/[0.01] border-l-8 border-emerald-500/50 shadow-3xl">
                          <h4 className="text-2xl font-black text-white uppercase italic mb-6 flex items-center gap-3">
                             <Sparkles className="w-6 h-6 text-emerald-400" /> Oracle Result
                          </h4>
                          <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line border-l-2 border-white/5 pl-8 font-medium">
                             {discoveryResult}
                          </div>
                       </div>
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <Coins size={24} />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase">Registry Reward</p>
                                <p className="text-2xl font-mono font-black text-white">+50 EAC</p>
                             </div>
                          </div>
                          <BadgeCheck className="w-10 h-10 text-emerald-400" />
                       </div>
                       <button onClick={() => setShowDiscoveryModal(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 shadow-xl">Return to Portal</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Research Patent Vault */}
      <div className="p-16 glass-card rounded-[64px] border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Smartphone className="w-96 h-96 text-amber-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10">
            <div className="w-32 h-32 bg-amber-600 rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
               <Layers className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">AgroInPDF <span className="text-amber-500">Patent Vault</span></h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Research shards with {" > "} 90% Community Consensus graduate into official Industrial Inventions.</p>
            </div>
         </div>
         <div className="text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em]">TOTAL REGISTERED</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter">14</p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

interface BookOpenCheckProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const BookOpenCheck: React.FC<BookOpenCheckProps> = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Agrowild;
