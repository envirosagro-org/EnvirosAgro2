
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
  ShoppingBag
} from 'lucide-react';
import { User, ViewState, Order, VendorProduct } from '../types';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface AgrowildProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
  vendorProducts: VendorProduct[];
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

const BASE_TOURISM_OFFERS = [
  { id: 'TOU-01', title: 'Spectral Birding Safari', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.', supplierEsin: 'EA-TOUR-HUB' },
  { id: 'TOU-02', title: 'Bantu Nature Walk', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.', supplierEsin: 'EA-TOUR-HUB' },
  { id: 'TOU-03', title: 'Night Predator Tracking', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.', supplierEsin: 'EA-TOUR-HUB' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onPlaceOrder, vendorProducts }) => {
  const [activeTab, setActiveTab] = useState<'conservancy' | 'tourism' | 'discovery' | 'documentary'>('conservancy');
  
  // Modals
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [selectedWildlife, setSelectedWildlife] = useState<any | null>(null);

  // Discovery States
  const [discoveryStep, setDiscoveryStep] = useState<'upload' | 'analysis' | 'success'>('upload');
  const [discoveryResult, setDiscoveryResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        supplierEsin: p.supplierEsin
      }));
    return [...BASE_TOURISM_OFFERS, ...dynamicTours];
  }, [vendorProducts]);

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
                  className="px-8 py-4 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> Discover New Plant Shard
                </button>
                <button 
                  onClick={() => onNavigate('vendor')}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Binoculars className="w-5 h-5 text-emerald-400" /> Become a Tour Provider
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
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                   <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest flex items-center gap-2">
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
                <button 
                  onClick={() => onNavigate('vendor')}
                  className="px-8 py-3 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                   <PlusCircle className="w-4 h-4" /> Register Experience Node
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {tourismOffers.map(offer => (
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
                              <span className="text-[10px] font-black">{offer.rating.toFixed(1)}</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">NODE_REF: {offer.id} // DUR: {offer.duration}</p>
                        <p className="text-slate-400 text-sm italic font-medium leading-relaxed flex-1">"{offer.desc}"</p>
                        
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                           <div className="space-y-1">
                              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Shard Bounty</p>
                              <p className="text-2xl font-mono font-black text-emerald-400">{offer.cost} <span className="text-xs">EAC</span></p>
                           </div>
                           <button 
                            onClick={() => handleOrderExperience(offer)}
                            className="p-5 rounded-[28px] bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl hover:scale-110 active:scale-95"
                           >
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
           </div>
        )}
      </div>

      {/* Discovery Modal */}
      {showDiscoveryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowDiscoveryModal(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 space-y-10 min-h-[650px] flex flex-col justify-center">
                 <button onClick={() => setShowDiscoveryModal(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 {discoveryStep === 'upload' && (
                    <div className="space-y-10 text-center animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
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
                          <div className="absolute inset-[-15px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
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
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center justify-between">
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

export default Agrowild;
