
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
  Stamp,
  Plus
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
  { id: 'TOU-01', title: 'SPECTRAL BIRDING SAFARI', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_NAIROBI_04' },
  { id: 'TOU-02', title: 'BANTU NATURE WALK', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_PARIS_82' },
  { id: 'TOU-03', title: 'NIGHT PREDATOR TRACKING', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_TOKYO_01' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onPlaceOrder, vendorProducts }) => {
  const [activeTab, setActiveTab] = useState<'conservancy' | 'tourism' | 'discovery' | 'archive'>('conservancy');
  
  // Modals
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState<any | null>(null);
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
        title: p.name.toUpperCase(),
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
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 md:px-0 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Globe size={1000} className="text-emerald-500" />
      </div>

      {/* Primary Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-4 glass-card rounded-[48px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black shadow-2xl px-8 relative z-20">
        {[
          { id: 'conservancy', label: 'CONSERVANCY HUB', icon: ShieldCheck },
          { id: 'tourism', label: 'WILD TOURISM', icon: Binoculars },
          { id: 'discovery', label: 'PLANT DISCOVERY', icon: Sprout },
          { id: 'archive', label: 'FLORA ARCHIVE', icon: Database },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* --- VIEW: WILD TOURISM (Screenshot Redesign) --- */}
        {activeTab === 'tourism' && (
           <div className="space-y-16 animate-in slide-in-from-right-4 duration-700">
              <div className="flex flex-col items-center text-center space-y-6">
                 <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">
                   WILD <span className="text-emerald-400">EXPERIENCES</span>
                 </h2>
                 <p className="text-slate-500 text-xl font-medium italic opacity-80 px-6 max-w-3xl">
                   "Verified eco-experiences and biological missions sharded for public participation."
                 </p>
                 <button 
                   onClick={() => onNavigate('vendor')}
                   className="mt-6 px-16 py-8 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-sm uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-[16px] ring-emerald-500/5"
                 >
                    <PlusCircle size={32} /> REGISTER EXPERIENCE NODE
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto px-4">
                 {tourismOffers.map(offer => (
                    <div key={offer.id} className="glass-card rounded-[64px] border-2 border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group active:scale-[0.99] duration-500 bg-black/40 shadow-3xl relative overflow-hidden">
                       <div className="h-96 relative overflow-hidden shrink-0">
                          <img src={offer.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s] grayscale-[0.2] group-hover:grayscale-0" alt={offer.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                          <div className="absolute top-10 left-10 flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] backdrop-blur-3xl bg-black/60 px-6 py-2 rounded-full border border-white/10 shadow-2xl">VERIFIED_NODE</span>
                          </div>
                          {/* Binoculars Badge - as shown in screenshot */}
                          <div className="absolute bottom-10 right-10">
                             <div className="p-5 bg-emerald-500 rounded-3xl shadow-3xl text-black">
                                <Binoculars size={40} />
                             </div>
                          </div>
                       </div>

                       <div className="p-12 flex-1 flex flex-col space-y-8">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 group-hover:text-emerald-400 transition-colors drop-shadow-2xl leading-none">{offer.title}</h4>
                                <p className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-[0.3em] mt-5">NODE: {offer.node} // {offer.id}</p>
                             </div>
                             <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 shadow-xl">
                                <Star size={16} fill="currentColor" />
                                <span className="text-[13px] font-black font-mono">{offer.rating.toFixed(1)}</span>
                             </div>
                          </div>
                          <p className="text-xl text-slate-400 italic leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">"{offer.desc}"</p>
                          
                          <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-end justify-between mt-auto gap-8">
                             <div className="space-y-2 text-center sm:text-left">
                                <p className="text-[10px] text-slate-800 font-black uppercase tracking-[0.3em] leading-none">Shard Commitment</p>
                                <p className="text-5xl font-mono font-black text-white tracking-tighter m-0">{offer.cost} <span className="text-lg text-emerald-400 italic font-sans ml-1">EAC</span></p>
                             </div>
                             <div className="relative group/btn w-full sm:w-auto">
                                <button 
                                  onClick={() => handleOrderExperience(offer)}
                                  className="w-full sm:w-auto px-16 py-8 rounded-[36px] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.4em] transition-all shadow-3xl active:scale-90 border-2 border-white/10"
                                >
                                   INITIALIZE SYNC
                                </button>
                                <div className="absolute inset-[-8px] border-2 border-indigo-400/40 rounded-[44px] pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Conservancy Hub preserved... */}
        {activeTab === 'conservancy' && (
           <div className="space-y-12 animate-in slide-in-from-left-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
                 <div>
                    <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">WILDLIFE <span className="text-amber-500">& FLORA HUB</span></h3>
                    <p className="text-slate-500 text-xl font-medium mt-4 italic opacity-70">"Real-time status of protected regional nodes and biological finality."</p>
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
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-lg ${
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

        {/* Discovery and Archive preserved... */}
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
           </div>
        )}
      </div>

      {/* Discovery Modal preserved... */}
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
                 "Every data shard anchored to the EnvirosAgro registry is a verified contribution to planetary restoration. Sovereignty achieved through biological transparency."
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l-2 border-white/5 pl-20 hidden xl:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">GRID_DENSITY_OK</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
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
