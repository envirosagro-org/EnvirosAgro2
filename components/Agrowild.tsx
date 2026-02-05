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
  Coins,
  Ticket,
  HardHat, 
  Shield, 
  SearchCode, 
  FileSignature, 
  ShoppingBag, 
  Circle, 
  Monitor, 
  Terminal, 
  Fingerprint, 
  Stamp
} from 'lucide-react';
import { User, ViewState, Order, VendorProduct } from '../types';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface AgrowildProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
  vendorProducts: VendorProduct[];
}

const WILDLIFE_NODES = [
  { id: 'WLF-882', name: 'Northern Savannah Corridor', species: 'African Elephant', status: 'Protected', health: 94, tracking: 'ACTIVE', col: 'text-amber-500', population: '1.2K', range: '450 sq km', mResonance: 1.42 },
  { id: 'WLF-104', name: 'Coastal Mangrove Sanctuary', species: 'Hawksbill Turtle', status: 'Endangered', health: 88, tracking: 'STABLE', col: 'text-emerald-500', population: '840', range: '120 sq km', mResonance: 1.15 },
  { id: 'WLF-042', name: 'Alpine Leopard Shard', species: 'Snow Leopard', status: 'Rare', health: 92, tracking: 'LOW_SIGNAL', col: 'text-blue-500', population: '142', range: '800 sq km', mResonance: 1.68 },
];

const BOTANICAL_ARCHIVE = [
  { id: 'FLR-882', name: 'Bantu Sun-Orchid', rarity: 'Extremely Rare', biome: 'Tropical Highlands', features: 'High UV absorption shards.', usage: 'Soil repair catalysis.', mImpact: '+0.12x' },
  { id: 'FLR-104', name: 'Desert Moisture-Vine', rarity: 'Rare', biome: 'Arid Shards', features: 'Deep root telemetry sync.', usage: 'Water table mapping.', mImpact: '+0.08x' },
  { id: 'FLR-042', name: 'Alpine Silver Moss', rarity: 'Vulnerable', biome: 'Glacial Nodes', features: 'Thermal stability buffer.', usage: 'Permafrost protection.', mImpact: '+0.15x' },
];

const BASE_TOURISM_OFFERS = [
  { id: 'TOU-01', title: 'Spectral Birding Safari', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.', supplierEsin: 'EA-TOUR-HUB', node: 'Node_Nairobi_04' },
  { id: 'TOU-02', title: 'Bantu Nature Walk', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.', supplierEsin: 'EA-TOUR-HUB', node: 'Node_Paris_82' },
  { id: 'TOU-03', title: 'Night Predator Tracking', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.', supplierEsin: 'EA-TOUR-HUB', node: 'Node_Tokyo_01' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onPlaceOrder, vendorProducts }) => {
  const [activeTab, setActiveTab] = useState<'conservancy' | 'tourism' | 'discovery' | 'archive'>('conservancy');
  
  // Modals
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState<any | null>(null);
  // Fix: Added missing selectedWildlife state to resolve error on line 281
  const [selectedWildlife, setSelectedWildlife] = useState<any | null>(null);

  // Discovery States
  const [discoveryStep, setDiscoveryStep] = useState<'upload' | 'analysis' | 'consensus' | 'success'>('upload');
  const [discoveryResult, setDiscoveryResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [discoveryId] = useState(`SHD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  const stats = [
    { label: 'Species Tracked', val: '1,284', icon: PawPrint, col: 'text-amber-500' },
    { label: 'Flora Protected', val: '42K Shards', icon: TreePine, col: 'text-emerald-500' },
    { label: 'Eco-Credits Earned', val: '8.4K EAC', icon: Zap, col: 'text-blue-400' },
    { label: 'Wildlife Integrity', val: '92%', icon: ShieldCheck, col: 'text-indigo-400' },
  ];

  // Dynamically derived tourism offers from Vendor Registry
  const tourismOffers = useMemo(() => {
    const dynamicTours = vendorProducts
      .filter(p => p.category === 'Service' && (p.name.toLowerCase().includes('tour') || p.name.toLowerCase().includes('safari') || p.name.toLowerCase().includes('walk')))
      .map(p => ({
        id: p.id,
        title: p.name,
        duration: 'Varies',
        cost: p.price,
        rating: 4.5 + Math.random() * 0.5,
        thumb: p.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400',
        desc: p.description,
        supplierEsin: p.supplierEsin,
        node: 'Partner Node'
      }));
    return [...BASE_TOURISM_OFFERS, ...dynamicTours];
  }, [vendorProducts]);

  const handleDiscoverySubmit = async () => {
    setIsAnalyzing(true);
    setDiscoveryStep('analysis');
    try {
      const res = await runSpecialistDiagnostic("Flora/Fauna Discovery", "Analyze this image shard for species identification and environmental resonance.");
      setDiscoveryResult(res.text);
      setDiscoveryStep('consensus');
    } catch (e) {
      alert("Oracle Handshake Failed.");
      setDiscoveryStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalizeDiscovery = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setDiscoveryStep('success');
    onEarnEAC(50, 'NEW_SPECIES_DISCOVERY_SHARD');
  };

  const handleOrderExperience = (offer: any) => {
    if (confirm(`INITIALIZE PROCUREMENT: Apply for the ${offer.title} for ${offer.cost} EAC? Availability will be verified by the node registrar.`)) {
      onPlaceOrder({
        itemId: offer.id,
        itemName: offer.title,
        itemType: 'Tourism Service',
        itemImage: offer.thumb,
        cost: offer.cost,
        supplierEsin: offer.supplierEsin,
        sourceTab: 'agrowild'
      });
      alert(`APPLICATION COMMITTED: Your request for ${offer.title} has been transmitted to the registrar. Check TQM Hub for the availability handshake.`);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* 1. Industrial Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group shadow-xl"
        >
          <ArrowLeftCircle size={20} className="group-hover:-translate-x-1 transition-transform" />
          RETURN TO COMMAND CENTER
        </button>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-widest">Shard: AGROWILD_CORE_v5.2</span>
          </div>
        </div>
      </div>

      {/* 2. Immersive Hero HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-0">
        <div className="lg:col-span-3 glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
              <PawPrint className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-44 h-44 rounded-[56px] bg-emerald-600 shadow-[0_0_100px_rgba(16,185,129,0.4)] flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <PawPrint size={96} className="text-white animate-float" />
              </div>
              <div className="absolute -bottom-4 -right-4 p-5 glass-card rounded-3xl border border-white/20 bg-black/80 flex flex-col items-center shadow-2xl">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Biodiversity Index</p>
                 <p className="text-2xl font-mono font-black text-emerald-400">92.4%</p>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.6em] border border-emerald-500/20 shadow-inner">CENTER_GATE_WILD_SYNC</span>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Agro<span className="text-emerald-400">wild</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating planetary biodiversity shards. Mapping, protecting, and monetizing the wild heritage of our regional clusters through decentralized stewardship."
              </p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {stats.map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[36px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/30 transition-all shadow-xl">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* 3. Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-2xl px-6">
        {[
          { id: 'conservancy', label: 'Conservancy Hub', icon: ShieldCheck },
          { id: 'tourism', label: 'Wild Tourism', icon: Binoculars },
          { id: 'discovery', label: 'Plant Discovery', icon: Sprout },
          { id: 'archive', label: 'Flora Archive', icon: Database },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105 ring-4 ring-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Main Viewport */}
      <div className="min-h-[800px] px-4 md:px-0">
        
        {/* --- VIEW: CONSERVANCY HUB --- */}
        {activeTab === 'conservancy' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10 px-4">
                 <div>
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">WILDLIFE <span className="text-amber-500">& FLORA HUB</span></h3>
                    <p className="text-slate-500 text-xl font-medium mt-4 italic">"Real-time status of protected regional nodes and biological finality."</p>
                 </div>
                 <div className="p-8 bg-amber-600/5 border border-amber-500/20 rounded-[48px] text-center shadow-2xl">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-1">NETWORK_CONSENSUS</p>
                    <p className="text-4xl font-mono font-black text-white">99.9%</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-8">
                    <h4 className="text-xl font-black text-white uppercase tracking-[0.4em] flex items-center gap-5 px-6 italic">
                       <Target className="w-8 h-8 text-amber-500" /> Active Tracking Shards
                    </h4>
                    <div className="space-y-6">
                       {WILDLIFE_NODES.map(node => (
                          <div 
                             key={node.id} 
                             onClick={() => setSelectedWildlife(node)}
                             className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-amber-500/40 transition-all flex flex-col md:flex-row items-center justify-between shadow-3xl cursor-pointer group active:scale-[0.99] duration-300 bg-black/40 relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Radar size={150} /></div>
                             <div className="flex items-center gap-8 flex-1 relative z-10">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-800 flex items-center justify-center border-2 border-white/10 group-hover:rotate-12 transition-transform shadow-2xl">
                                   <Bird className={`w-10 h-10 ${node.col}`} />
                                </div>
                                <div className="space-y-1">
                                   <h5 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-amber-400 transition-colors">{node.name}</h5>
                                   <p className="text-[11px] text-slate-500 font-bold uppercase mt-3 tracking-widest italic">Species: <span className="text-white">{node.species}</span></p>
                                </div>
                             </div>
                             <div className="text-right border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-10 relative z-10 w-full md:w-auto mt-8 md:mt-0">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                                   node.status === 'Protected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                   {node.status}
                                </span>
                                <p className="text-[10px] text-slate-700 font-mono mt-4 uppercase tracking-widest font-black italic">TRACKING: {node.tracking}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="glass-card p-16 rounded-[80px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col justify-center items-center text-center space-y-12 group shadow-3xl min-h-[600px]">
                    <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
                    <div className="w-32 h-32 rounded-[44px] bg-emerald-600 flex items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.3)] ring-[16px] ring-white/5 relative z-10 group-hover:scale-110 transition-transform duration-700">
                       <ShieldCheck className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-6 relative z-10 max-w-sm mx-auto">
                       <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Biological Consensus</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl mx-auto opacity-80">
                          "Integrating multi-spectral ingest nodes to verify the population density and m-constant stability of regional flora shards."
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full max-w-md relative z-10 pt-10 border-t border-white/5">
                       <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center shadow-inner">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Regional Flora</p>
                          <p className="text-3xl font-mono font-black text-emerald-400">42K+</p>
                       </div>
                       <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 text-center shadow-inner">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Heritage Score</p>
                          <p className="text-3xl font-mono font-black text-indigo-400">9.8/10</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: WILD TOURISM --- */}
        {activeTab === 'tourism' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-4 gap-8">
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">WILD <span className="text-emerald-400">EXPERIENCES</span></h3>
                    <p className="text-slate-500 text-xl font-medium mt-4 italic">"Verified eco-experiences and biological missions sharded for public participation."</p>
                 </div>
                 <button 
                   onClick={() => onNavigate('vendor')}
                   className="px-12 py-5 bg-emerald-600 rounded-[32px] text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_60px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10"
                 >
                    <PlusCircle size={20} /> Register Experience Node
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {tourismOffers.map(offer => (
                    <div key={offer.id} className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 hover:border-emerald-500/30 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/40 shadow-3xl relative">
                       <div className="h-72 relative overflow-hidden shrink-0">
                          <img src={offer.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={offer.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                          <div className="absolute top-8 left-8 flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] backdrop-blur-3xl bg-black/60 px-5 py-2 rounded-full border border-white/10 shadow-2xl">VERIFIED_NODE</span>
                          </div>
                          <div className="absolute bottom-8 right-8">
                             <div className="p-4 bg-emerald-600 rounded-2xl shadow-3xl text-white transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                <Binoculars size={28} />
                             </div>
                          </div>
                       </div>

                       <div className="p-10 flex-1 flex flex-col space-y-6">
                          <div className="flex justify-between items-start">
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tight leading-none m-0 group-hover:text-emerald-400 transition-colors">{offer.title}</h4>
                             <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 px-3 py-1 rounded-lg border border-amber-500/20">
                                <Star size={14} fill="currentColor" />
                                <span className="text-[11px] font-black font-mono">{offer.rating.toFixed(1)}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest border-l-2 border-white/5 pl-4">
                             NODE: {offer.node} // {offer.id}
                          </div>
                          <p className="text-slate-400 text-base italic font-medium leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity">"{offer.desc}"</p>
                          
                          <div className="pt-8 border-t border-white/5 flex items-center justify-between mt-auto">
                             <div className="space-y-1">
                                <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest leading-none">Shard Commitment</p>
                                <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{offer.cost} <span className="text-sm font-sans italic ml-1">EAC</span></p>
                             </div>
                             <button 
                               onClick={() => handleOrderExperience(offer)}
                               className="px-10 py-5 rounded-[28px] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-xl hover:scale-105 active:scale-95 border border-white/10"
                             >
                                INITIALIZE SYNC
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: PLANT DISCOVERY --- */}
        {activeTab === 'discovery' && (
           <div className="max-w-5xl mx-auto space-y-16 animate-in zoom-in duration-500 px-4 md:px-0">
              <div className="glass-card p-16 md:p-24 rounded-[80px] bg-emerald-600/[0.03] border-2 border-emerald-500/20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-3xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s]">
                    <TreePine className="w-[1000px] h-[1000px] text-white" />
                 </div>
                 
                 <div className="relative shrink-0">
                    <div className="w-64 h-64 agro-gradient rounded-full flex flex-col items-center justify-center shadow-[0_0_120px_rgba(16,185,129,0.4)] ring-[24px] ring-white/5 animate-pulse relative">
                       <Sprout className="w-28 h-28 text-white" />
                       <div className="absolute inset-[-15px] border-2 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 p-6 glass-card rounded-[32px] border border-white/20 bg-black/80 shadow-3xl flex flex-col items-center animate-bounce">
                       <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Shard Bounty</p>
                       <p className="text-3xl font-mono font-black text-white">+50 <span className="text-xs">EAC</span></p>
                    </div>
                 </div>

                 <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
                    <div className="space-y-4">
                       <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">SPECIES_MINTING_NODE</span>
                       <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">MINT <span className="text-emerald-400">DISCOVERY</span></h2>
                    </div>
                    <p className="text-slate-300 text-2xl leading-relaxed italic font-medium max-w-2xl mx-auto lg:mx-0 opacity-80">
                       "Identified a rare biological node? Transmit an image shard of the species for spectral identification and registry rewards."
                    </p>
                    <button 
                       onClick={() => { setShowDiscoveryModal(true); setDiscoveryStep('upload'); }}
                       className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 mx-auto lg:mx-0 active:scale-95 transition-all border-4 border-white/10 ring-8 ring-white/5 group"
                    >
                       <Camera className="w-8 h-8 group-hover:rotate-12 transition-transform" /> START DISCOVERY INGEST
                    </button>
                 </div>
              </div>

              {/* Discovery Stats / Ticker */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                    { label: 'Discovery Latency', val: '24ms', icon: Activity, col: 'text-emerald-400' },
                    { label: 'Global Peer Review', val: 'Active', icon: Globe, col: 'text-blue-400' },
                    { label: 'Validation Quorum', val: '99.8%', icon: ShieldCheck, col: 'text-indigo-400' },
                 ].map((s, i) => (
                    <div key={i} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 flex flex-col items-center text-center space-y-4 group hover:border-white/20 transition-all shadow-xl">
                       <s.icon className={`w-8 h-8 ${s.col} group-hover:scale-110 transition-transform`} />
                       <div>
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-2">{s.label}</p>
                          <p className="text-3xl font-mono font-black text-white tracking-tighter">{s.val}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: FLORA ARCHIVE --- */}
        {activeTab === 'archive' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">BOTANICAL <span className="text-emerald-400">ARCHIVE</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic">"The global library of heritage seeds and rare environmental resonance shards."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
                    <input type="text" placeholder="Audit species registry..." className="w-full bg-black/60 border border-white/10 rounded-[40px] py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono italic shadow-inner" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {BOTANICAL_ARCHIVE.map(flora => (
                    <div key={flora.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[500px]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Flower size={300} className="text-emerald-400" /></div>
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-5 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 group-hover:rotate-6 transition-transform shadow-xl">
                                <Sprout size={32} />
                             </div>
                             <div className="text-right">
                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-widest">{flora.rarity}</span>
                                <p className="text-[10px] text-slate-700 font-mono mt-4 font-black italic">{flora.id}</p>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-emerald-400 transition-colors">{flora.name}</h4>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic">{flora.biome}</p>
                          </div>
                          <p className="text-slate-400 text-base leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3">"{flora.features}"</p>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                          <div className="space-y-1">
                             <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">m-Resonance Boost</p>
                             <p className="text-3xl font-mono font-black text-emerald-400 leading-none">{flora.mImpact}</p>
                          </div>
                          <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-emerald-600/10 transition-all shadow-xl">Audit DNA Shard</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* DISCOVERY WORKFLOW MODAL */}
      {showDiscoveryModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowDiscoveryModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_150px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-10 md:p-16 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-float">
                       <Camera size={32} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Discovery <span className="text-emerald-400">Ingest</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3">TARGET_SHARD: {discoveryId}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDiscoveryModal(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 {discoveryStep === 'upload' && (
                    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 flex flex-col justify-center min-h-[400px]">
                       <div className="text-center space-y-6">
                          <h4 className="text-4xl font-black text-white uppercase italic m-0 leading-none">Biological <span className="text-emerald-400">Proof Upload</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic">Upload an image shard of the species for spectral and DNA analysis.</p>
                       </div>
                       <div className="p-20 border-4 border-dashed border-white/10 rounded-[56px] flex flex-col items-center justify-center text-center space-y-8 group/drop bg-black/40 hover:border-emerald-500/40 hover:bg-emerald-500/[0.01] transition-all cursor-pointer shadow-inner">
                          <Upload className="w-14 h-14 text-slate-700 group-hover/drop:text-emerald-400 group-hover/drop:scale-110 transition-all duration-500" />
                          <div>
                             <p className="text-2xl font-black text-white uppercase tracking-widest italic">Select Shard File</p>
                             <p className="text-slate-600 text-xs uppercase font-black tracking-widest mt-2">JPEG / PNG High-Res Required</p>
                          </div>
                       </div>
                       <button 
                         onClick={handleDiscoverySubmit}
                         className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6"
                       >
                          <Zap size={24} className="fill-current" /> INITIALIZE ORACLE ANALYSIS
                       </button>
                    </div>
                 )}

                 {discoveryStep === 'analysis' && (
                    <div className="flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500 min-h-[400px]">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-700 animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Fingerprint className="w-12 h-12 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">DECODING BIOLOGICAL BASE-PAIRS...</p>
                          <p className="text-slate-600 font-mono text-[10px]">EASF_DNA_MATCH // CHECKING_REGISTRY_LOCK</p>
                       </div>
                    </div>
                 )}

                 {discoveryStep === 'consensus' && (
                    <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 flex flex-col justify-center min-h-[400px]">
                       <div className="p-10 bg-black/80 rounded-[56px] border-l-8 border-l-emerald-600 border border-white/10 relative overflow-hidden shadow-3xl">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Sparkles size={250} /></div>
                          <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-6">
                             <Bot size={32} className="text-emerald-400" />
                             <h4 className="text-2xl font-black text-white uppercase italic">Oracle Discovery Report</h4>
                          </div>
                          <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-xl leading-loose italic whitespace-pre-line border-l border-white/5 pl-8 font-medium">
                             {discoveryResult}
                          </div>
                       </div>

                       <div className="space-y-6">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] text-center block">Commit Shard with Node Signature (ESIN)</label>
                          <input 
                            type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                            placeholder="EA-XXXX-XXXX" 
                            className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.1em] outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>

                       <div className="flex gap-6">
                          <button onClick={() => setDiscoveryStep('upload')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                          <button 
                            onClick={handleFinalizeDiscovery}
                            disabled={!esinSign}
                            className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                          >
                             <Stamp size={28} /> AUTHORIZE REGISTRY ANCHOR
                          </button>
                       </div>
                    </div>
                 )}

                 {discoveryStep === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center min-h-[400px]">
                       <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.5)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0">Discovery <span className="text-emerald-400">Anchored.</span></h3>
                          <p className="text-emerald-500 text-sm font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_WILD_SYNC_OK</p>
                       </div>
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[44px] flex items-center justify-between w-full max-w-sm">
                          <div className="flex items-center gap-6">
                             <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl text-white"><Coins size={24} /></div>
                             <div className="text-left">
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Shard Reward</p>
                                <p className="text-2xl font-mono font-black text-white">+50.00 <span className="text-xs italic">EAC</span></p>
                             </div>
                          </div>
                          <BadgeCheck className="w-10 h-10 text-emerald-400" />
                       </div>
                       <button onClick={() => setShowDiscoveryModal(false)} className="w-full max-w-sm py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Portal</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Global Biodiversity Shard Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-emerald-500/10 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mt-32 mx-4 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Globe className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Biodiversity <span className="text-emerald-400">Finality</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 "Securing the global agricultural commons through species sharding and wildlife conservation proofs. Every discovery strengthens our collective m-constant resilience."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">GRID_DENSITY_OK</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Agrowild;