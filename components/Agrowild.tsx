import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PawPrint, 
  TreePine, 
  Binoculars, 
  Globe, 
  PlusCircle, 
  ChevronRight, 
  X, 
  Search, 
  Database,
  BadgeCheck,
  ShieldCheck,
  Activity,
  Zap,
  ArrowUpRight,
  Star,
  MapPin,
  Camera,
  Sprout,
  ShieldPlus,
  Compass,
  History,
  TrendingUp,
  Waves,
  LayoutGrid,
  FileSearch,
  Download,
  Box,
  Fingerprint,
  Target,
  // Added Binary to fix the error on line 289
  Binary
} from 'lucide-react';
import { User, ViewState, Order, VendorProduct } from '../types';

interface AgrowildProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
  onPlaceOrder: (order: Partial<Order>) => void;
  vendorProducts: VendorProduct[];
}

const AGROWILD_TABS = [
  { id: 'conservancy', label: 'CONSERVANCY', icon: ShieldCheck },
  { id: 'tourism', label: 'ECO-TOURISM', icon: Binoculars },
  { id: 'discovery', label: 'DISCOVERY', icon: Sprout },
  { id: 'archive', label: 'ARCHIVE', icon: Database },
];

const BASE_TOURISM_OFFERS = [
  { id: 'TOU-01', title: 'SPECTRAL BIRDING SAFARI', duration: '4h', cost: 150, rating: 4.9, thumb: 'https://images.unsplash.com/photo-1549336573-19965159074d?q=80&w=400', desc: 'Guided multi-spectral binocular tour focusing on rare migratory shards.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_NAIROBI_04' },
  { id: 'TOU-02', title: 'BANTU NATURE WALK', duration: '2h', cost: 50, rating: 4.8, thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400', desc: 'Ancestral botanical walk through lineage forests and moisture hubs.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_PARIS_82' },
  { id: 'TOU-03', title: 'NIGHT PREDATOR TRACKING', duration: '6h', cost: 300, rating: 5.0, thumb: 'https://images.unsplash.com/photo-1557406230-ceddd547a61d?q=80&w=400', desc: 'Thermal ingest mission to monitor nocturnal carnivore health and load.', supplierEsin: 'EA-TOUR-HUB', node: 'NODE_TOKYO_01' },
];

const Agrowild: React.FC<AgrowildProps> = ({ user, onSpendEAC, onEarnEAC, onNavigate, onPlaceOrder, vendorProducts }) => {
  const [activeTab, setActiveTab] = useState<string>('conservancy');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamically derived tourism offers
  const tourismOffers = useMemo(() => {
    const dynamicTours = vendorProducts
      .filter(p => p.category === 'Service' && (p.name.toLowerCase().includes('tour') || p.name.toLowerCase().includes('safari')))
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

  const scrollToSection = (tabId: string) => {
    if (!scrollContainerRef.current) return;
    const index = AGROWILD_TABS.findIndex(t => t.id === tabId);
    const container = scrollContainerRef.current;
    container.scrollTo({
      left: container.clientWidth * index,
      behavior: 'smooth'
    });
    setActiveTab(tabId);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (AGROWILD_TABS[index] && activeTab !== AGROWILD_TABS[index].id) {
      setActiveTab(AGROWILD_TABS[index].id);
    }
  };

  const handleOrderExperience = (offer: any) => {
    if (confirm(`INITIALIZE PROCUREMENT: Apply for the ${offer.title} for ${offer.cost} EAC?`)) {
      onPlaceOrder({
        itemId: offer.id,
        itemName: offer.title,
        itemType: 'Tourism Service',
        itemImage: offer.thumb,
        cost: offer.cost,
        supplierEsin: offer.supplierEsin,
        sourceTab: 'agrowild'
      });
      alert(`APPLICATION COMMITTED. Check TQM Hub.`);
    }
  };

  const activeIndex = AGROWILD_TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto relative h-screen flex flex-col">
      
      {/* 1. HUD Header - Fixed Height */}
      <div className="px-4 shrink-0">
        <div className="glass-card p-6 md:p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex items-center gap-8 group shadow-2xl">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
              <Globe className="w-96 h-96 text-white" />
           </div>
           
           {/* Section Progress Bar */}
           <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_#10b981]" 
                style={{ width: `${((activeIndex + 1) / AGROWILD_TABS.length) * 100}%` }}
              ></div>
           </div>

           <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-emerald-600 flex items-center justify-center shadow-2xl shrink-0 border-2 border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <Globe className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin-slow relative z-10" />
           </div>
           
           <div className="space-y-1 flex-1 text-left relative z-10">
              <div className="flex items-center gap-3">
                 <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic m-0">Biological <span className="text-emerald-400">Finality.</span></h2>
                 <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">AGROWILD_v6</span>
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-medium italic opacity-80 max-w-xl">
                 "Managing protected regional nodes and biological sharding protocols across the global wildland quorum."
              </p>
           </div>
        </div>
      </div>

      {/* 2. Navigation Shards */}
      <div className="px-4 shrink-0">
        <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[24px] w-full md:w-fit border border-white/5 bg-black/40 shadow-xl px-4 md:px-6">
          {AGROWILD_TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content Area - Horizontal Slider */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto flex snap-x snap-mandatory scrollbar-hide bg-black/10 mx-4 rounded-[48px] border border-white/5"
      >
        
        {/* SECTION: CONSERVANCY */}
        <section id="wild-conservancy" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-10">
           <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
              <div className="space-y-2">
                 <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGIONAL <span className="text-emerald-400">NODES</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic">"Protected biological clusters sharded for m-constant stability."</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-[9px] font-black uppercase">GRID_PROTECTED</div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'CON-01', name: 'Mugumo Ancient Shard', status: 'UNTOUCHABLE', resonance: 1.618, col: 'text-emerald-400' },
                { id: 'CON-02', name: 'Nairobi Inflow Forest', status: 'AUDITING', resonance: 1.42, col: 'text-blue-400' },
                { id: 'CON-03', name: 'Valencia Marine Node', status: 'ACTIVE', resonance: 1.55, col: 'text-indigo-400' },
              ].map((node, i) => (
                <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[450px] relative overflow-hidden group shadow-2xl transition-all">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><TreePine size={200} /></div>
                   <div className="flex justify-between items-start relative z-10">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${node.col} shadow-inner group-hover:rotate-6 transition-all`}>
                         <ShieldPlus size={28} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${node.status === 'UNTOUCHABLE' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                        {node.status}
                      </span>
                   </div>
                   <div className="space-y-3 relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors">{node.name}</h4>
                      <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{node.id}</p>
                   </div>
                   <div className="pt-10 border-t border-white/5 relative z-10 flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[9px] text-slate-700 font-black uppercase">Resonance</p>
                         <p className="text-4xl font-mono font-black text-white">{node.resonance}<span className="text-sm text-emerald-500 italic">m</span></p>
                      </div>
                      <button className="p-4 bg-white/5 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl active:scale-90"><Activity size={24} /></button>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* SECTION: ECO-TOURISM */}
        <section id="wild-tourism" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-10">
           <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
              <div className="space-y-2">
                 <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">TOURISM <span className="text-blue-400">SHARDS</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic">"Experiential ingest missions within verified biological nodes."</p>
              </div>
              <div className="relative group w-full md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                 <input type="text" placeholder="Filter Experiences..." className="w-full bg-black/60 border border-white/10 rounded-full py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {tourismOffers.map(offer => (
                 <div key={offer.id} className="glass-card rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all flex flex-col group active:scale-[0.99] duration-300 shadow-3xl bg-black/40 relative overflow-hidden h-[650px]">
                    <div className="h-64 relative overflow-hidden shrink-0">
                       <img src={offer.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[0.3] group-hover:grayscale-0" alt={offer.title} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                       <div className="absolute top-6 right-6 p-5 bg-blue-600 rounded-[28px] shadow-3xl text-white group-hover:rotate-12 transition-transform">
                          <Binoculars size={28} />
                       </div>
                       <div className="absolute bottom-6 left-6">
                          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-[9px] font-black uppercase tracking-widest">{offer.duration} Mission</span>
                       </div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col space-y-6">
                       <div className="flex justify-between items-start">
                          <div className="space-y-2">
                             <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors drop-shadow-2xl">{offer.title}</h4>
                             <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic leading-none">ID: {offer.id}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/20">
                             <Star size={12} fill="currentColor" />
                             <span className="text-[10px] font-black font-mono">{offer.rating.toFixed(1)}</span>
                          </div>
                       </div>
                       <p className="text-base text-slate-400 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3 font-medium">"{offer.desc}"</p>
                       <div className="pt-10 border-t border-white/5 flex items-end justify-between mt-auto relative z-10">
                          <div className="space-y-1">
                             <p className="text-[9px] text-slate-800 font-black uppercase tracking-widest leading-none">Entry Commitment</p>
                             <p className="text-4xl font-mono font-black text-white tracking-tighter">{offer.cost}<span className="text-base text-blue-400 italic font-sans ml-1">EAC</span></p>
                          </div>
                          <button 
                            onClick={() => handleOrderExperience(offer)}
                            className="p-8 rounded-[36px] bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_50px_rgba(37,99,235,0.4)] active:scale-90 transition-all border-4 border-white/10 ring-8 ring-blue-500/5 group/btn"
                          >
                             <ChevronRight size={32} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* SECTION: DISCOVERY */}
        <section id="wild-discovery" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-12">
           <div className="max-w-5xl mx-auto space-y-16 py-12 text-center">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-[56px] bg-emerald-600/10 border-4 border-emerald-500/40 flex items-center justify-center mx-auto shadow-3xl animate-float">
                 <Sprout size={80} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-[0.85] drop-shadow-2xl">BOTANICAL <br/><span className="text-emerald-400">DISCOVERY.</span></h2>
                 <p className="text-slate-400 text-2xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                    "Mapping pre-symptomatic bio-signatures to detect planetary stress before m-constant decay."
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                 {[
                    { l: 'Species Mapping', v: '12.4K', i: Globe, c: 'text-blue-400' },
                    { l: 'DNA Shards', v: '1.2M', i: Binary, c: 'text-indigo-400' },
                    { l: 'Resonance Depth', v: 'x1.42', i: Activity, c: 'text-emerald-400' },
                 ].map((s, i) => (
                    <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-4 shadow-xl group hover:border-emerald-500/30 transition-all">
                       <s.i size={32} className={`${s.c} group-hover:scale-110 transition-transform`} />
                       <div className="space-y-1">
                          <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.2em]">{s.l}</p>
                          <p className="text-4xl font-mono font-black text-white">{s.v}</p>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-emerald-500/5">INITIALIZE SPECTRAL SCAN</button>
           </div>
        </section>

        {/* SECTION: ARCHIVE */}
        <section id="wild-archive" className="min-w-full h-full snap-start overflow-y-auto custom-scrollbar p-6 md:p-12 space-y-10">
           <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4">
              <div className="space-y-2">
                 <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">BIOLOGICAL <span className="text-indigo-400">ARCHIVE</span></h3>
                 <p className="text-slate-600 text-lg font-medium italic">"Immutable registry of biological data shards anchored to the global mesh."</p>
              </div>
              <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-md">
                 <Download size={16} /> Export Shard Index
              </button>
           </div>

           <div className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl">
              <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-10">
                 <span className="col-span-2">Archive Shard Designation</span>
                 <span>Pillar Anchor</span>
                 <span>Finality Date</span>
                 <span className="text-right">Ledger Auth</span>
              </div>
              <div className="divide-y divide-white/5 bg-[#050706]">
                 {[
                   { id: 'SHD-BIO-001', name: 'Zone 4 Moisture Alpha', type: 'Environmental', date: '2d ago', hash: '0x882_SYNC' },
                   { id: 'SHD-BIO-042', name: 'Nairobi Inflow Shard', type: 'Industrial', date: '5h ago', hash: '0x104_SYNC' },
                   { id: 'SHD-BIO-091', name: 'Lineage Seed DNA', type: 'Heritage', date: '1w ago', hash: '0x042_SYNC' },
                   { id: 'SHD-BIO-112', name: 'Thermal Vector Map', type: 'Technological', date: '12m ago', hash: '0x991_SYNC' },
                 ].map((shard, i) => (
                    <div key={i} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group cursor-pointer animate-in fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                       <div className="col-span-2 flex items-center gap-8">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                             <Database size={28} />
                          </div>
                          <div className="space-y-2">
                             <p className="text-xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-indigo-400 transition-colors">{shard.name}</p>
                             <p className="text-[10px] text-slate-700 font-mono font-black mt-2 uppercase tracking-tighter italic">{shard.id} // HASH: {shard.hash}</p>
                          </div>
                       </div>
                       <div>
                          <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-400 text-[9px] font-black uppercase rounded-lg border border-indigo-500/20">{shard.type}</span>
                       </div>
                       <div className="text-xs text-slate-500 font-mono italic">{shard.date}</div>
                       <div className="flex justify-end pr-4">
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-2xl transition-all scale-90 group-hover:scale-100 ring-4 ring-emerald-500/0 group-hover:ring-emerald-500/5">
                             <ShieldCheck size={24} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.1); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.9); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Agrowild;