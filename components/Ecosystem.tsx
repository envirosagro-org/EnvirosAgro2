import React, { useState, useEffect } from 'react';
import { 
  Flower2, Music, Heart, Bot, Cookie, Baby, X, Activity, Leaf, Cpu, ArrowRight, ArrowRightLeft, Landmark, Binary, Package, Palette, PencilRuler, Moon, Waves, Radio, ChefHat, BookOpen, Video, FileText, Download, Microscope, User as UserIcon, HeartPulse, Factory, BadgeCheck, ShieldAlert, Zap, Layers, Smartphone, Star, Target, BrainCircuit, Scan, ShieldCheck as ShieldCheckIcon, HandHelping, Users, Search, ClipboardCheck, Globe, Sprout, Monitor, Radar, Gem, Stethoscope, GraduationCap, FileCode, Waves as WavesIcon, Speaker, Ticket, Shield, SearchCode, Flame, Wind, Loader2, TrendingUp, Gauge, Terminal, Satellite, RadioReceiver, Microscope as MicroscopeIcon, Droplets, Play, Battery, Signal, Cog, ZapOff, PlayCircle, BarChart4, Network, AlertCircle, Sparkles, PlusCircle, Coins, Pause, ChevronRight, CheckCircle2, History, RefreshCcw, Handshake,
  // MedicAg Icons
  Stethoscope as DoctorIcon,
  ShieldPlus,
  Thermometer,
  Microscope as LabIcon,
  HeartPulse as PulseIcon,
  Bed,
  Soup,
  Wind as AirIcon,
  Crosshair,
  // AgroJunior Icons
  Gamepad2,
  Trophy,
  Shapes,
  School,
  Sun,
  ThermometerSun,
  Blocks,
  Rocket,
  // New Brand Specific Icons
  Scale,
  CloudRain,
  Eye,
  FileDigit,
  Music2,
  Volume2,
  Film,
  Boxes,
  Compass,
  Layout,
  Crown,
  Coffee,
  FlameKindling,
  Timer
} from 'lucide-react';
import { User, ViewState } from '../types';
import { runSpecialistDiagnostic } from '../services/geminiService';

interface EcosystemProps {
  user: User;
  onDeposit: (amount: number, reason: string) => void;
  onUpdateUser: (user: User) => void;
  onNavigate: (view: ViewState, action?: string | null) => void;
}

type ThrustType = 'societal' | 'environmental' | 'human' | 'technological' | 'industry';

interface Brand {
  id: string;
  name: string;
  icon: any;
  color: string;
  accent: string;
  bg: string;
  desc: string;
  action: string;
  thrust: ThrustType;
  volume: string;
  isLight?: boolean;
}

const THRUST_METADATA: Record<ThrustType, { label: string; icon: any; color: string }> = {
  societal: { label: 'Societal', icon: Heart, color: 'text-rose-700' },
  environmental: { label: 'Environmental', icon: Leaf, color: 'text-emerald-700' },
  human: { label: 'Human', icon: UserIcon, color: 'text-teal-700' },
  technological: { label: 'Technological', icon: Cpu, color: 'text-slate-600' },
  industry: { label: 'Industry', icon: Landmark, color: 'text-indigo-800' },
};

const BRANDS: Brand[] = [
  { id: 'agroboto', name: 'Agroboto', icon: Bot, color: 'text-slate-500', accent: 'text-slate-400', bg: 'bg-slate-500/10', desc: 'Autonomous intelligence. Swarm-based precision farming and robotic terra-mapping.', action: 'Fleet Ingest', thrust: 'technological', volume: '1.8K BOTS' },
  { id: 'medicag', name: 'MedicAg', icon: HeartPulse, color: 'text-teal-600', accent: 'text-teal-500', bg: 'bg-teal-600/10', desc: 'Earth-wellness triage. Clinical audits for soil, steward, and animal health shards.', action: 'Health Audit', thrust: 'human', volume: '8.2K CLINICS', isLight: true },
  { id: 'junior', name: 'AgroJunior', icon: Baby, color: 'text-amber-700', accent: 'text-amber-600', bg: 'bg-amber-700/10', desc: 'STEM-driven growth. Virtual garden twins and agricultural play for the next generation.', action: 'Adventure Start', thrust: 'human', volume: '12.4K JUNIORS', isLight: true },
  { id: 'love4agro', name: 'Love4Agro', icon: Heart, color: 'text-rose-800', accent: 'text-rose-700', bg: 'bg-rose-800/10', desc: 'Empathy in agriculture. Bio-electric community resonance and steward vouching.', action: 'Willingness Audit', thrust: 'societal', volume: '24.2K WILLING', isLight: true },
  { id: 'tokenz', name: 'Tokenz', icon: Landmark, color: 'text-indigo-900', accent: 'text-indigo-700', bg: 'bg-indigo-900/10', desc: 'Institutional DeFi. RWA sharding and liquidity bridges for sustainable assets.', action: 'Institutional Sync', thrust: 'industry', volume: '$ENVZ: 1.42' },
  { id: 'lilies', name: 'Lilies Around', icon: Flower2, color: 'text-fuchsia-900', accent: 'text-fuchsia-700', bg: 'bg-fuchsia-900/10', desc: 'Aesthetic Floriculture. Merging botanical architecture with celestial planting.', action: 'Aesthetic Audit', thrust: 'environmental', volume: '1.2M EAC', isLight: true },
  { id: 'agromusika', name: 'AgroMusika', icon: Music, color: 'text-emerald-800', accent: 'text-emerald-600', bg: 'bg-emerald-800/10', desc: 'Bio-Electric Frequencies. Sonic remediation and soil molecular repair through sound.', action: 'Frequency Audit', thrust: 'technological', volume: '4.8M EAC' },
  { id: 'agroinpdf', name: 'AgroInPDF', icon: BookOpen, color: 'text-cyan-900', accent: 'text-cyan-700', bg: 'bg-cyan-900/10', desc: 'Immutable Knowledge. Scientific whitepapers and documented industrial archives.', action: 'Knowledge Sync', thrust: 'industry', volume: '12.4K SHARDS' },
  { id: 'juizzycookiez', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-orange-900', accent: 'text-orange-700', bg: 'bg-orange-900/10', desc: 'Artisanal Traceability. Solar-dried baked nodes from audited regenerative cycles.', action: 'Recipe Audit', thrust: 'industry', volume: '840K EAC', isLight: true },
];

const MOCK_BOTS = [
  { id: 'BOT-882-A', type: 'Aerial Drone', battery: 84, signal: 98, status: 'Patrolling', zone: 'Zone 4 NE' },
  { id: 'BOT-401-B', type: 'Terra Rover', battery: 42, signal: 92, status: 'Charging', zone: 'Sector 2' },
  { id: 'BOT-112-X', type: 'Seed Ingester', battery: 95, signal: 85, status: 'Active', zone: 'Zone 1 Hub' },
  { id: 'BOT-091-Y', type: 'Spectral Scout', battery: 12, signal: 10, status: 'Low Signal', zone: 'Edge Cluster' },
];

const MOCK_MISSIONS = [
  { id: 'MSN-24-01', title: 'Spectral Mapping: Zone 4', progress: 65, units: 12, status: 'Active', bounty: '1,200 EAC' },
  { id: 'MSN-24-02', title: 'Autonomous Weeding Cycle', progress: 88, units: 45, status: 'Finalizing', bounty: '4,500 EAC' },
  { id: 'MSN-24-03', title: 'Soil Ingest #882 Verification', progress: 12, units: 3, status: 'Initializing', bounty: '850 EAC' },
];

const MOCK_CLINICS = [
  { id: 'CLN-NE-01', name: 'Omaha Soil Sanatorium', type: 'Biological', patients: 142, status: 'OPERATIONAL', health: 98, zone: 'Zone 4' },
  { id: 'CLN-NRB-82', name: 'Nairobi Bio-Audit Center', type: 'Human/Animal', patients: 850, status: 'HIGH_LOAD', health: 92, zone: 'Zone 2' },
  { id: 'CLN-VAL-42', name: 'Valencia Marine Triage', type: 'Environmental', patients: 24, status: 'OPERATIONAL', health: 99, zone: 'Zone 1' },
];

const MOCK_EXPERIMENTS = [
  { id: 'LAB-01', title: 'The Sun Power Mystery', category: 'Energy', progress: 85, difficulty: 'Easy', reward: 'Solar Shard' },
  { id: 'LAB-02', title: 'Soil DNA Sharding', category: 'Biology', progress: 42, difficulty: 'Medium', reward: 'Genome Key' },
  { id: 'LAB-03', title: 'Robo-Pollinator Math', category: 'Robotics', progress: 12, difficulty: 'Hard', reward: 'Bot Brain' },
];

const MOCK_BADGES = [
  { id: 'BDG-1', name: 'Seed Planter', icon: Sprout, earned: true, date: '2024.11.02', level: 'Bronze' },
  { id: 'BDG-2', name: 'Water Wizard', icon: Droplets, earned: true, date: '2024.12.10', level: 'Silver' },
  { id: 'BDG-3', name: 'Sun Catcher', icon: Sun, earned: false, progress: 80, level: 'Gold' },
  { id: 'BDG-4', name: 'Bot Commander', icon: Bot, earned: false, progress: 15, level: 'Platinum' },
];

const MOCK_SHARDS_TOKENZ = [
  { id: 'SHD-882', asset: 'Omaha West Farm', value: 420000, supply: 1000, price: 420, apr: 12.4, risk: 'Low' },
  { id: 'SHD-104', asset: 'Nairobi Grain Silo B', value: 125000, supply: 500, price: 250, apr: 18.2, risk: 'Medium' },
  { id: 'SHD-042', asset: 'Solar Ingester Fleet 01', value: 850000, supply: 2000, price: 425, apr: 22.5, risk: 'High' },
];

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit, onUpdateUser, onNavigate }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [isSyncing, setIsSyncing] = useState(false);

  // Agroboto Sub-States
  const [swarmResonance, setSwarmResonance] = useState(88.4);
  const [isOptimizingSwarm, setIsOptimizingSwarm] = useState(false);

  // MedicAg Sub-States
  const [triageInput, setTriageInput] = useState('');
  const [triageResult, setTriageResult] = useState<string | null>(null);
  const [isTriaging, setIsTriaging] = useState(false);

  // AgroJunior Sub-States
  const [twinSyncing, setTwinSyncing] = useState(false);
  const [twinHealth, setTwinHealth] = useState(94);

  // Love4Agro Sub-States
  const [willingnessScore, setWillingnessScore] = useState(72);
  const [isCommittingWillingness, setIsCommittingWillingness] = useState(false);

  // Agromusika Sub-States
  const [activeFreq, setActiveFreq] = useState(432);
  const [isGeneratingFreq, setIsGeneratingFreq] = useState(false);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  const handlePortalLaunch = (brand: Brand) => {
    setIsSyncing(true);
    setTimeout(() => {
      setActiveBrand(brand);
      setPortalTab('home');
      setIsSyncing(false);
    }, 1200);
  };

  const handleSwarmOptimize = () => {
    setIsOptimizingSwarm(true);
    setTimeout(() => {
      setSwarmResonance(99.2);
      setIsOptimizingSwarm(false);
    }, 3000);
  };

  const handleTriage = async () => {
    if (!triageInput.trim()) return;
    setIsTriaging(true);
    setTriageResult(null);
    try {
      const res = await runSpecialistDiagnostic("Triage", `Diagnostic Request: ${triageInput}. Context: Clinical health shard for earth wellness.`);
      setTriageResult(res.text);
    } catch (e) {
      alert("Triage Oracle Handshake Failed.");
    } finally {
      setIsTriaging(false);
    }
  };

  const handleTwinSync = () => {
    setTwinSyncing(true);
    setTimeout(() => {
      setTwinHealth(98);
      setTwinSyncing(false);
    }, 2500);
  };

  const handleCommitWillingness = () => {
    setIsCommittingWillingness(true);
    setTimeout(() => {
      setWillingnessScore(85);
      setIsCommittingWillingness(false);
      onDeposit(10, 'Willingness Shard Committed');
    }, 2000);
  };

  const handleFreqGen = () => {
    setIsGeneratingFreq(true);
    setTimeout(() => {
      setIsGeneratingFreq(false);
    }, 4000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      
      {/* Multiverse Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
         <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[28px] border border-white/5 bg-black/40 shadow-2xl">
           <button onClick={() => setFilter('all')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Multiverse Core</button>
           {Object.entries(THRUST_METADATA).map(([key, meta]: [any, any]) => (
             <button key={key} onClick={() => setFilter(key)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${filter === key ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <meta.icon size={14} /> {meta.label}
             </button>
           ))}
         </div>
      </div>

      {/* Grid of Brand Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 px-4">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            onClick={() => handlePortalLaunch(brand)} 
            className="glass-card p-12 rounded-[64px] group hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col h-[520px] overflow-hidden bg-white/[0.01] shadow-3xl relative active:scale-[0.98] duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className={`w-24 h-24 rounded-[32px] ${brand.bg} flex items-center justify-center mb-10 group-hover:rotate-6 group-hover:scale-105 transition-all duration-700 border border-white/5 shadow-2xl`}>
              <brand.icon className={`w-12 h-12 ${brand.color}`} />
            </div>
            <div className="flex-1 space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:text-emerald-400 transition-colors">{brand.name}</h3>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-600 uppercase tracking-widest">{brand.thrust}</span>
               </div>
               <p className="text-slate-400 text-lg font-medium mt-6 line-clamp-3 italic leading-relaxed opacity-70 group-hover:opacity-100 transition-all">"{brand.desc}"</p>
            </div>
            <div className="pt-8 border-t border-white/5 flex items-center justify-between text-slate-600 group-hover:text-emerald-400 transition-all">
               <div className="flex items-center gap-4">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /> 
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Sync</span>
               </div>
               <span className="text-[10px] font-mono font-black text-slate-800 uppercase">{brand.volume}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-[1000] bg-[#050706]/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
           <div className="relative">
              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Binary className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
           </div>
           <p className="text-emerald-400 font-black text-2xl uppercase tracking-[1em] animate-pulse italic">Syncing Shard...</p>
        </div>
      )}

      {/* Expanded Brand Portal Modal */}
      {activeBrand && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 lg:p-12 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl" onClick={() => setActiveBrand(null)}></div>
          <div className={`relative w-full max-w-[1700px] h-full glass-card rounded-[64px] md:rounded-[80px] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)] border border-white/10 ${activeBrand.isLight ? 'bg-stone-50' : 'bg-[#050706]'}`}>
            
            {/* Modal Header */}
            <div className={`p-10 md:p-14 border-b border-white/5 flex justify-between items-center shrink-0 ${activeBrand.isLight ? 'bg-stone-100/40' : 'bg-white/[0.02]'}`}>
               <div className="flex items-center gap-8 md:gap-12">
                  <div className={`w-20 h-20 md:w-28 md:h-28 rounded-[32px] md:rounded-[40px] flex items-center justify-center shadow-3xl border border-white/10 ${activeBrand.bg}`}>
                     <activeBrand.icon className={`w-10 h-10 md:w-14 md:h-14 ${activeBrand.color}`} />
                  </div>
                  <div className="space-y-2">
                    <h2 className={`text-4xl md:text-6xl font-black uppercase italic m-0 tracking-tighter ${activeBrand.isLight ? 'text-stone-900' : 'text-white'}`}>
                      {activeBrand.name} <span className={activeBrand.accent}>Multiverse</span>
                    </h2>
                    <p className={`text-[10px] font-mono tracking-[0.5em] uppercase ${activeBrand.isLight ? 'text-stone-500' : 'text-slate-500'}`}>SHARD_REGISTRY_v4.2 // OS_SYNC_STABLE // AGRO_BOT_INIT</p>
                  </div>
               </div>
               <button onClick={() => setActiveBrand(null)} className="p-4 md:p-6 bg-white/5 rounded-full text-slate-500 hover:text-rose-500 transition-all hover:rotate-90 border border-white/5 shadow-2xl"><X size={32} /></button>
            </div>

            {/* Modal Tab Navigation */}
            <div className={`flex border-b border-white/5 shrink-0 overflow-x-auto scrollbar-hide ${activeBrand.isLight ? 'bg-stone-100' : 'bg-black/40'}`}>
               {(
                 activeBrand.id === 'agroboto' ? ['home', 'fleet_command', 'swarm_ai', 'missions'] :
                 activeBrand.id === 'medicag' ? ['home', 'clinical_hub', 'ai_triage', 'hospitality'] :
                 activeBrand.id === 'junior' ? ['home', 'stem_garden', 'badges', 'virtual_twin'] :
                 activeBrand.id === 'love4agro' ? ['home', 'willingness', 'vouches', 'heartbeat'] :
                 activeBrand.id === 'tokenz' ? ['home', 'swa_sharding', 'defi_bridge', 'dao_hub'] :
                 activeBrand.id === 'lilies' ? ['home', 'architecture', 'astrology', 'boutique'] :
                 activeBrand.id === 'agromusika' ? ['home', 'resonance_lab', 'sonic_repair', 'frequencies'] :
                 activeBrand.id === 'agroinpdf' ? ['home', 'docu_vault', 'knowledge_shards', 'cinema'] :
                 ['home', 'recipe_ledger', 'batch_audit', 'bakery_node']
               ).map(t => (
                 <button 
                   key={t} 
                   onClick={() => setPortalTab(t)}
                   className={`flex-1 min-w-[200px] py-8 text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-[6px] ${portalTab === t ? `border-current ${activeBrand.accent} bg-white/5` : 'border-transparent text-slate-500'}`}
                 >
                   {t.replace(/_/g, ' ')}
                 </button>
               ))}
            </div>

            {/* Portal Content Area */}
            <div className={`flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar ${activeBrand.isLight ? 'bg-white' : 'bg-black/40'}`}>
               
               {/* 1. AGROBOTO CONTENT (DARK) */}
               {activeBrand.id === 'agroboto' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    
                    {portalTab === 'home' && (
                      <>
                        <div className="relative rounded-[64px] overflow-hidden min-h-[500px] flex items-center border border-white/5 bg-slate-900/40 shadow-3xl group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600')] bg-cover opacity-10 grayscale group-hover:grayscale-0 transition-all duration-[12s]"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                          <div className="relative z-10 p-16 md:p-24 space-y-10 max-w-4xl">
                            <span className="px-5 py-2 bg-slate-500/10 text-slate-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-white/10 shadow-2xl">ROBOTICS_CORE_v4.2</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">AUTONOMOUS <br/> <span className="text-slate-500">INTELLIGENCE.</span></h2>
                            <p className="text-slate-400 text-2xl font-medium italic leading-relaxed">Scaling sustainable agriculture through 24/7 robotic swarms and predictive EOS analytics.</p>
                            <button onClick={() => setPortalTab('fleet_command')} className="px-12 py-6 bg-slate-700 hover:bg-slate-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all">DEPLOY FLEET</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          {[
                            { t: 'Drone Swarms', d: 'Aerial spectral mapping and precision seed sharding.', i: Radar, c: 'text-slate-400' },
                            { t: 'Terra Rovers', d: 'Autonomous ground units for weeding and soil DNA sampling.', i: Smartphone, c: 'text-teal-500' },
                            { t: 'Fleet Logic', d: 'Cloud-synced coordinate system for multi-node deployments.', i: BrainCircuit, c: 'text-indigo-600' },
                          ].map((f, i) => (
                            <div key={i} className="p-10 glass-card rounded-[48px] border border-white/5 space-y-8 group hover:border-slate-500/40 transition-all bg-black/40">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all border border-white/5 shadow-xl"><f.i size={32} className={f.c} /></div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{f.t}</h4>
                                <p className="text-slate-500 text-base leading-relaxed italic opacity-80 group-hover:opacity-100 group-hover:text-slate-300">"{f.d}"</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {portalTab === 'fleet_command' && (
                      <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4">
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Active <span className="text-slate-400">Fleet Units</span></h3>
                           <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">Provision New Node</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                           {MOCK_BOTS.map(bot => (
                             <div key={bot.id} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/60 space-y-8 group hover:border-slate-500/40 transition-all">
                                <div className="flex justify-between items-start">
                                   <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform border border-white/5 shadow-inner">
                                      {bot.type.includes('Drone') ? <Satellite className="text-slate-400" /> : <Radar className="text-teal-400" />}
                                   </div>
                                   <div className="text-right">
                                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                        bot.status === 'Patrolling' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                        bot.status === 'Charging' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      }`}>{bot.status}</span>
                                      <p className="text-[10px] text-slate-500 font-mono mt-2 font-black">{bot.id}</p>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <h5 className="text-xl font-black text-white uppercase italic leading-none">{bot.type}</h5>
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{bot.zone}</p>
                                   </div>
                                   <div className="space-y-3">
                                      <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-500">
                                         <span className="flex items-center gap-1"><Battery size={10} /> Energy Shard</span>
                                         <span className={bot.battery < 20 ? 'text-rose-500' : 'text-emerald-500'}>{bot.battery}%</span>
                                      </div>
                                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                         <div className={`h-full ${bot.battery < 20 ? 'bg-rose-600' : 'bg-emerald-600'}`} style={{ width: `${bot.battery}%` }}></div>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase">
                                      <Signal size={12} className="text-blue-500" /> Signal Integrity: {bot.signal}%
                                   </div>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex gap-3">
                                   <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase text-slate-400 transition-all border border-white/10">Manual Link</button>
                                   <button className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-[9px] font-black uppercase text-white transition-all shadow-lg">Calibrate</button>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {portalTab === 'swarm_ai' && (
                      <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
                        <div className="glass-card p-16 rounded-[64px] border border-indigo-500/20 bg-indigo-950/10 flex flex-col items-center text-center space-y-10 shadow-3xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><BrainCircuit size={400} className="text-indigo-400" /></div>
                           <div className="w-32 h-32 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.3)] border-4 border-white/10 relative z-10">
                              <Network size={64} className="text-white animate-pulse" />
                           </div>
                           <div className="space-y-4 relative z-10">
                              <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Swarm <span className="text-indigo-400">Consensus</span></h3>
                              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">Collective machine intelligence optimizing regional C(a) growth signatures across all industrial nodes.</p>
                           </div>
                           <div className="grid grid-cols-3 gap-8 w-full max-w-3xl relative z-10 py-10 border-y border-white/5">
                              <div>
                                 <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Synapse Load</p>
                                 <p className="text-4xl font-mono font-black text-white">12.4 <span className="text-sm">PF</span></p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Consensus Depth</p>
                                 <p className="text-4xl font-mono font-black text-indigo-400">{swarmResonance.toFixed(1)}%</p>
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Latency Shard</p>
                                 <p className="text-4xl font-mono font-black text-emerald-400">2ms</p>
                              </div>
                           </div>
                           <button 
                             onClick={handleSwarmOptimize}
                             disabled={isOptimizingSwarm}
                             className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all relative z-10 disabled:opacity-50"
                           >
                              {isOptimizingSwarm ? <Loader2 className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8 fill-current" />}
                              {isOptimizingSwarm ? 'Optimizing Neural Mesh...' : 'TUNE SWARM RESONANCE'}
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 flex items-center gap-8">
                              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600"><Bot size={32} /></div>
                              <div>
                                 <h4 className="text-xl font-black text-white uppercase italic">Active Clusters</h4>
                                 <p className="text-sm text-slate-500 mt-2 italic">"Swarm nodes currently synchronized in real-time."</p>
                              </div>
                              <span className="text-2xl font-mono font-black text-indigo-400 ml-auto">142</span>
                           </div>
                           <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 flex items-center gap-8">
                              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-600"><AlertCircle size={32} /></div>
                              <div>
                                 <h4 className="text-xl font-black text-white uppercase italic">Anomaly Buffer</h4>
                                 <p className="text-sm text-slate-500 mt-2 italic">"Prevention protocols for robotic SID load."</p>
                              </div>
                              <span className="text-2xl font-mono font-black text-emerald-400 ml-auto">SAFE</span>
                           </div>
                        </div>
                      </div>
                    )}

                    {portalTab === 'missions' && (
                      <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 px-4">
                           <div className="space-y-2">
                              <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Mission <span className="text-emerald-400">Control Ledger</span></h3>
                              <p className="text-slate-500 text-lg font-medium italic">Assign industrial bounties and track autonomous task fulfillment shards.</p>
                           </div>
                           <button className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                              <PlusCircle size={20} /> Deploy New Mission Shard
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                           {MOCK_MISSIONS.map(msn => (
                             <div key={msn.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 bg-black/40 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Target size={120} className="text-white" /></div>
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                   <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:rotate-12 transition-transform">
                                      <Zap size={28} className="text-emerald-400" />
                                   </div>
                                   <div className="text-right">
                                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                        msn.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                        msn.status === 'Initializing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      }`}>{msn.status}</span>
                                      <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-tighter italic">{msn.id}</p>
                                   </div>
                                </div>
                                <div className="flex-1 space-y-6 relative z-10">
                                   <h4 className="text-3xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0">{msn.title}</h4>
                                   <div className="flex gap-6 items-center">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                         <Bot size={14} className="text-slate-400" /> {msn.units} Units
                                      </div>
                                      <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                         <Coins size={14} className="text-emerald-500" /> {msn.bounty}
                                      </div>
                                   </div>
                                   <div className="space-y-3 pt-4">
                                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                         <span>Fulfillment Progress</span>
                                         <span className="text-white font-mono">{msn.progress}%</span>
                                      </div>
                                      <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                         <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] transition-all duration-[2s]" style={{ width: `${msn.progress}%` }}></div>
                                      </div>
                                   </div>
                                </div>
                                <div className="mt-12 pt-8 border-t border-white/5 flex gap-4 relative z-10">
                                   <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 transition-all border border-white/10">Abort</button>
                                   <button className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest transition-all shadow-xl active:scale-90">View Live Feed</button>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
               )}

               {/* 2. MEDICAG CONTENT (LIGHT) */}
               {activeBrand.id === 'medicag' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    
                    {portalTab === 'home' && (
                      <>
                        <div className="relative rounded-[64px] overflow-hidden min-h-[500px] flex items-center border border-teal-500/10 bg-teal-50 shadow-2xl group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600')] bg-cover opacity-5"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
                          <div className="relative z-10 p-16 md:p-24 space-y-10 max-w-4xl">
                             <span className="px-5 py-2 bg-teal-500/10 text-teal-700 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-teal-200">CLINICAL_NODE_v4.2</span>
                             <h2 className="text-6xl md:text-8xl font-black text-stone-900 leading-[0.85] tracking-tighter uppercase italic">TOTAL <span className="text-teal-700">WELLNESS</span> FOR EARTH.</h2>
                             <p className="text-stone-600 text-2xl font-medium italic leading-relaxed">Ecological healthcare, hospital coordination, and steward wellness audits anchored to the industrial ledger.</p>
                             <button onClick={() => setPortalTab('ai_triage')} className="px-12 py-6 bg-teal-800 hover:bg-teal-700 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center gap-4">
                                <Stethoscope size={20} /> INITIALIZE AI TRIAGE
                             </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          {[
                            { t: 'Soil MRI', d: 'Microbial Resonance Imaging to diagnose soil fatigue.', i: LabIcon, c: 'text-teal-700' },
                            { t: 'Steward Care', d: 'Healthcare shards for farmers and industrial units.', i: PulseIcon, c: 'text-rose-800' },
                            { t: 'Animal Triage', d: 'Livestock diagnostics and zoonotic monitoring.', i: Activity, c: 'text-stone-600' },
                          ].map((f, i) => (
                             <div key={i} className="p-10 bg-stone-100/50 rounded-[48px] border border-stone-200 space-y-8 group hover:border-teal-700/40 transition-all shadow-lg">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center group-hover:scale-110 transition-all shadow-md border border-stone-100"><f.i size={32} className={f.c} /></div>
                                <h4 className="text-2xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">{f.t}</h4>
                                <p className="text-stone-500 text-base leading-relaxed italic opacity-80 group-hover:opacity-100">"{f.d}"</p>
                             </div>
                          ))}
                        </div>
                      </>
                    )}

                    {portalTab === 'clinical_hub' && (
                       <div className="space-y-12 animate-in fade-in duration-500">
                          <div className="flex justify-between items-center px-4">
                             <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic">Clinical <span className="text-teal-700">Hub Registry</span></h3>
                             <div className="flex items-center gap-4">
                                <div className="p-4 bg-stone-100 border border-stone-200 rounded-2xl text-center">
                                   <p className="text-[8px] text-stone-500 font-black uppercase mb-1">Network Capacity</p>
                                   <p className="text-xl font-mono font-black text-teal-700">14.2 GB/y</p>
                                </div>
                             </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                             {MOCK_CLINICS.map(clinic => (
                               <div key={clinic.id} className="p-10 bg-white border border-stone-200 rounded-[56px] shadow-xl group hover:border-teal-600/40 transition-all relative overflow-hidden flex flex-col">
                                  <div className="flex justify-between items-start mb-8">
                                     <div className="p-4 bg-stone-100 rounded-2xl group-hover:bg-teal-50 transition-colors">
                                        <ShieldPlus className="w-8 h-8 text-teal-700" />
                                     </div>
                                     <div className="text-right">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                                           clinic.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>{clinic.status}</span>
                                        <p className="text-[10px] text-stone-400 font-mono mt-2 font-black">{clinic.id}</p>
                                     </div>
                                  </div>
                                  <div className="flex-1 space-y-4">
                                     <h4 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight m-0">{clinic.name}</h4>
                                     <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">{clinic.type} Clinical Node // {clinic.zone}</p>
                                     <div className="grid grid-cols-2 gap-4 mt-8">
                                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                           <p className="text-[8px] text-stone-400 font-black uppercase mb-1">Active Shards</p>
                                           <p className="text-xl font-mono font-black text-teal-700">{clinic.patients}</p>
                                        </div>
                                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                           <p className="text-[8px] text-stone-400 font-black uppercase mb-1">Health Metric</p>
                                           <p className="text-xl font-mono font-black text-emerald-600">{clinic.health}%</p>
                                        </div>
                                     </div>
                                  </div>
                                  <div className="mt-8 pt-8 border-t border-stone-100 flex gap-4">
                                     <button className="flex-1 py-4 bg-stone-100 hover:bg-stone-200 rounded-2xl text-[9px] font-black uppercase text-stone-600 transition-all">Audit Logs</button>
                                     <button className="flex-1 py-4 bg-teal-700 hover:bg-teal-600 rounded-2xl text-[9px] font-black uppercase text-white shadow-lg transition-all">Sync Hub</button>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'ai_triage' && (
                       <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
                          <div className="p-16 bg-white border border-teal-500/20 rounded-[64px] shadow-3xl text-center space-y-12 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Crosshair size={400} className="text-teal-700" /></div>
                             <div className="space-y-6 relative z-10">
                                <div className="w-24 h-24 bg-teal-700 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float">
                                   <Stethoscope size={48} />
                                </div>
                                <div>
                                   <h3 className="text-5xl font-black text-stone-900 uppercase tracking-tighter italic m-0">AI <span className="text-teal-700">Triage Shard</span></h3>
                                   <p className="text-stone-500 text-xl font-medium mt-4 italic max-w-xl mx-auto">Input biological or environmental symptoms to synthesize a diagnostic remediation shard.</p>
                                </div>
                             </div>

                             {!triageResult && !isTriaging ? (
                               <div className="space-y-10 relative z-10 animate-in fade-in duration-700">
                                  <div className="space-y-4">
                                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-4 block text-left">Describe the Pathology</label>
                                     <textarea 
                                       value={triageInput}
                                       onChange={e => setTriageInput(e.target.value)}
                                       placeholder="e.g. Yellowing leaves in Sector 4 with high moisture latency..."
                                       className="w-full bg-stone-50 border border-stone-200 rounded-[32px] p-8 text-stone-900 text-lg font-medium italic focus:ring-4 focus:ring-teal-500/10 outline-none transition-all h-48 resize-none placeholder:text-stone-300 shadow-inner"
                                     />
                                  </div>
                                  <div className="flex flex-col items-center gap-6">
                                     <button 
                                       onClick={handleTriage}
                                       disabled={!triageInput.trim()}
                                       className="px-16 py-8 bg-teal-800 hover:bg-teal-700 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center gap-4 disabled:opacity-30"
                                     >
                                        <Zap className="w-6 h-6 fill-current" /> INITIALIZE TRIAGE
                                     </button>
                                     <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest flex items-center gap-2">
                                        <Coins size={12} /> Registry Bounty: 25 EAC
                                     </p>
                                  </div>
                               </div>
                             ) : isTriaging ? (
                                <div className="flex flex-col items-center space-y-12 py-10">
                                   <div className="relative">
                                      <Loader2 className="w-24 h-24 text-teal-700 animate-spin" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                         <PulseIcon className="w-10 h-10 text-teal-500 animate-pulse" />
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      <p className="text-teal-700 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Synthesizing Diagnostic...</p>
                                   </div>
                                </div>
                             ) : (
                                <div className="text-left space-y-12 animate-in fade-in duration-700 pb-10">
                                   <div className="p-12 bg-stone-50 rounded-[48px] border border-stone-200 shadow-inner relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Thermometer size={200} /></div>
                                      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-stone-200">
                                         <Sparkles className="w-6 h-6 text-teal-700" />
                                         <h4 className="text-xl font-black text-stone-900 uppercase italic">Oracle Verdict</h4>
                                      </div>
                                      <div className="prose prose-stone max-w-none text-stone-700 text-lg leading-loose italic whitespace-pre-line border-l-4 border-teal-700/20 pl-8 font-medium">
                                         {triageResult}
                                      </div>
                                   </div>
                                   <div className="flex justify-center gap-6">
                                      <button onClick={() => setTriageResult(null)} className="px-12 py-6 bg-stone-100 hover:bg-stone-200 rounded-3xl text-[11px] font-black uppercase tracking-widest text-stone-600 transition-all">Discard</button>
                                      <button className="px-16 py-6 bg-teal-800 hover:bg-teal-700 rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95">Anchor Diagnostic</button>
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                    )}

                    {portalTab === 'hospitality' && (
                       <div className="space-y-16 animate-in slide-in-from-right-10 duration-700">
                          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-stone-200 pb-12 px-4">
                             <div className="space-y-2">
                                <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">Steward <span className="text-teal-700">Hospitality</span></h3>
                                <p className="text-stone-500 text-lg font-medium italic">Wellness nodes and recovery shards for the network’s agrarian workforce.</p>
                             </div>
                             <button className="px-10 py-5 bg-teal-800 hover:bg-teal-700 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95">Book Wellness Shard</button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                             {[
                               { t: 'Bio-Sync Recovery', d: 'Neuro-feedback sessions for high-load stewards.', i: BrainCircuit, c: 'text-teal-700' },
                               { t: 'Nutrient Kitchen', d: 'Industrial-grade meals sharded for microbiome health.', i: Soup, c: 'text-amber-700' },
                               { t: 'Restorative Pods', d: 'Sleep-cycle optimization and SID trauma clearing.', i: Bed, c: 'text-blue-700' },
                             ].map((s, i) => (
                               <div key={i} className="p-12 bg-white border border-stone-200 rounded-[56px] shadow-xl group hover:border-teal-600/40 transition-all flex flex-col items-center text-center">
                                  <div className="w-20 h-20 bg-stone-50 rounded-[32px] flex items-center justify-center mb-8 group-hover:rotate-6 group-hover:scale-110 transition-all border border-stone-100 shadow-md">
                                     <s.i size={32} className={s.c} />
                                  </div>
                                  <h4 className="text-2xl font-black text-stone-900 uppercase italic tracking-tighter m-0">{s.t}</h4>
                                  <p className="text-stone-500 text-base italic leading-relaxed mt-4">"{s.d}"</p>
                                  <button className="w-full py-4 mt-8 bg-stone-100 hover:bg-teal-700 hover:text-white rounded-2xl text-[9px] font-black uppercase text-stone-500 transition-all shadow-sm">Initialize Session</button>
                               </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
               )}

               {/* 3. AGROJUNIOR CONTENT (LIGHT) */}
               {activeBrand.id === 'junior' && (
                 <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    
                    {portalTab === 'home' && (
                      <>
                        <div className="p-16 md:p-24 rounded-[64px] bg-stone-100 border border-amber-200 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-12 opacity-5"><GraduationCap size={400} className="text-amber-900" /></div>
                          <div className="w-56 h-56 md:w-72 md:h-72 bg-amber-700 rounded-[48px] md:rounded-[64px] flex items-center justify-center text-white shadow-3xl relative z-10 animate-float">
                              <Baby size={120} />
                          </div>
                          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                              <h2 className="text-5xl md:text-7xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">THE FUTURE IS <span className="text-amber-700 underline">GROWING.</span></h2>
                              <p className="text-2xl text-stone-600 font-medium italic">Empowering the next generation of agrarians through STEM-based play and virtual garden twins.</p>
                              <button onClick={() => setPortalTab('stem_garden')} className="px-16 py-8 bg-amber-800 hover:bg-amber-700 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">START ADVENTURE</button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          {['Seed Stage', 'Watering Cycle', 'Sun Power', 'Harvest Hero'].map((s, i) => (
                              <div key={s} className="p-10 bg-stone-50 border border-stone-200 rounded-[40px] text-center space-y-6 shadow-md group hover:border-amber-700 transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto text-amber-800 group-hover:scale-110 transition-transform"><Star size={28} /></div>
                                <h4 className="text-xl font-black uppercase text-stone-800 tracking-tight">{s}</h4>
                                <div className="h-2 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-amber-700" style={{ width: `${(i+1)*25}%` }}></div></div>
                              </div>
                          ))}
                        </div>
                      </>
                    )}

                    {portalTab === 'stem_garden' && (
                      <div className="space-y-12 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center px-4">
                           <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">STEM <span className="text-amber-700">Garden Labs</span></h3>
                           <div className="flex items-center gap-4">
                              <span className="px-3 py-1 bg-amber-500/10 text-amber-700 text-[10px] font-black uppercase rounded-full border border-amber-200 tracking-widest">3 Labs Active</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                           {MOCK_EXPERIMENTS.map(exp => (
                              <div key={exp.id} className="p-10 bg-white border border-stone-200 rounded-[56px] shadow-xl group hover:border-amber-600 transition-all flex flex-col relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform"><Shapes size={120} className="text-amber-700" /></div>
                                 <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="p-4 bg-stone-100 rounded-2xl group-hover:bg-amber-50 transition-colors">
                                       <School className="w-8 h-8 text-amber-700" />
                                    </div>
                                    <span className="px-3 py-1 bg-stone-100 text-stone-500 text-[8px] font-black uppercase rounded border border-stone-200">{exp.difficulty}</span>
                                 </div>
                                 <div className="flex-1 space-y-4 relative z-10">
                                    <h4 className="text-2xl font-black text-stone-900 uppercase italic tracking-tight m-0">{exp.title}</h4>
                                    <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">{exp.category} Shard // REWARD: {exp.reward}</p>
                                    <div className="pt-6 space-y-3">
                                       <div className="flex justify-between items-center text-[9px] font-black uppercase text-stone-500">
                                          <span>Experiment Progress</span>
                                          <span className="text-amber-700">{exp.progress}%</span>
                                       </div>
                                       <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-amber-600" style={{ width: `${exp.progress}%` }}></div>
                                       </div>
                                    </div>
                                 </div>
                                 <button className="mt-10 py-4 bg-amber-700 hover:bg-amber-600 rounded-2xl text-[9px] font-black uppercase text-white shadow-lg transition-all relative z-10">Initialize Lab Session</button>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {portalTab === 'badges' && (
                      <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
                        <div className="flex justify-between items-center px-4">
                           <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic">Achievement <span className="text-amber-700">Vault</span></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                           {MOCK_BADGES.map(badge => (
                              <div key={badge.id} className={`p-10 rounded-[56px] border flex flex-col items-center text-center space-y-6 transition-all group ${
                                 badge.earned ? 'bg-white border-amber-200 shadow-xl' : 'bg-stone-50 border-stone-200 grayscale opacity-60'
                              }`}>
                                 <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner relative transition-transform duration-500 group-hover:scale-110 ${
                                    badge.earned ? 'bg-amber-100' : 'bg-stone-200'
                                 }`}>
                                    <badge.icon size={48} className={badge.earned ? 'text-amber-700' : 'text-stone-400'} />
                                    {badge.earned && <div className="absolute inset-0 border-2 border-dashed border-amber-400/40 rounded-full animate-spin-slow"></div>}
                                 </div>
                                 <div>
                                    <h4 className="text-xl font-black text-stone-900 uppercase italic leading-none">{badge.name}</h4>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase mt-2 tracking-widest">{badge.level} Class Shard</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}

                    {portalTab === 'virtual_twin' && (
                      <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
                        <div className="p-16 bg-white border border-amber-500/20 rounded-[64px] shadow-3xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-amber-50/[0.02] pointer-events-none"></div>
                           <div className="w-64 h-64 bg-amber-700 rounded-[48px] flex items-center justify-center text-white shadow-3xl shrink-0 animate-float relative overflow-hidden">
                              <Monitor size={100} />
                              <div className="absolute inset-0 border-4 border-white/10 rounded-[48px] animate-pulse"></div>
                           </div>
                           <div className="flex-1 space-y-8 text-center md:text-left">
                              <div>
                                 <h3 className="text-5xl font-black text-stone-900 uppercase tracking-tighter italic m-0 leading-none">Garden <span className="text-amber-700">Digital Twin</span></h3>
                                 <p className="text-stone-500 text-xl font-medium mt-4 italic">"Simulating regional C(a) growth signatures for safe STEM play."</p>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="p-5 bg-stone-50 border border-stone-100 rounded-3xl">
                                    <p className="text-[8px] text-stone-400 font-black uppercase mb-1 flex items-center gap-2"><ThermometerSun size={10} /> Sunlight Index</p>
                                    <p className="text-2xl font-mono font-black text-stone-900">8.2 / 10</p>
                                 </div>
                                 <div className="p-5 bg-stone-50 border border-stone-100 rounded-3xl">
                                    <p className="text-[8px] text-stone-400 font-black uppercase mb-1 flex items-center gap-2"><Droplets size={10} /> Moisture Sink</p>
                                    <p className="text-2xl font-mono font-black text-teal-600">{twinHealth}%</p>
                                 </div>
                              </div>
                              <button 
                                onClick={handleTwinSync}
                                disabled={twinSyncing}
                                className="w-full py-6 bg-amber-800 hover:bg-amber-700 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                              >
                                 {twinSyncing ? <Loader2 className="w-24 h-24 animate-spin" /> : <RefreshCcw size={24} />}
                                 {twinSyncing ? 'Syncing Simulation...' : 'SYNC WITH REGISTRY NODE'}
                              </button>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
               )}

               {/* 4. LOVE4AGRO CONTENT (LIGHT) */}
               {activeBrand.id === 'love4agro' && (
                 <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                      <div className="max-w-[1400px] mx-auto space-y-24 text-center">
                        <div className="p-16 md:p-24 rounded-[64px] bg-stone-50 border border-rose-200 space-y-12 relative overflow-hidden shadow-xl">
                          <div className="w-40 h-40 md:w-56 md:h-56 bg-rose-800 rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_80px_rgba(159,18,57,0.2)] animate-pulse">
                              <Heart size={80} fill="currentColor" />
                          </div>
                          <h2 className="text-6xl md:text-8xl font-black text-stone-900 uppercase tracking-tighter italic m-0">IGNITING <span className="text-rose-800">WILLINGNESS.</span></h2>
                          <p className="text-3xl text-stone-500 max-w-3xl mx-auto italic font-medium">Building agricultural empathy through digital care protocols and community vouching.</p>
                          <div className="flex justify-center gap-6 pt-6">
                              <button onClick={() => setPortalTab('willingness')} className="px-12 py-6 bg-rose-900 hover:bg-rose-800 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">START WILLINGNESS AUDIT</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {portalTab === 'willingness' && (
                       <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-500">
                          <div className="p-16 bg-white border border-rose-200 rounded-[64px] shadow-3xl space-y-10">
                             <div className="w-24 h-24 bg-rose-100 text-rose-800 rounded-[32px] flex items-center justify-center mx-auto shadow-xl"><Scale size={48} /></div>
                             <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter italic m-0">Bio-Social <span className="text-rose-800">Alignment</span></h3>
                             <p className="text-stone-500 text-xl font-medium leading-relaxed">Adjust your societal energy output to match community consensus needs.</p>
                             
                             <div className="space-y-6 pt-10">
                                <div className="flex justify-between px-4">
                                   <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Willingness Multiplier</span>
                                   <span className="text-2xl font-mono font-black text-rose-800">{willingnessScore}%</span>
                                </div>
                                <input 
                                  type="range" min="0" max="100" value={willingnessScore}
                                  onChange={e => setWillingnessScore(Number(e.target.value))}
                                  className="w-full h-4 bg-stone-100 rounded-full appearance-none cursor-pointer accent-rose-800"
                                />
                             </div>

                             <button 
                               onClick={handleCommitWillingness}
                               disabled={isCommittingWillingness}
                               className="w-full py-8 bg-rose-800 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                             >
                                {isCommittingWillingness ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheckIcon className="w-6 h-6" />}
                                COMMIT ENERGY SHARD
                             </button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'vouches' && (
                      <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
                         <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter italic border-b border-stone-200 pb-6">Trust <span className="text-rose-800">Ledger</span></h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {['Steward Alpha', 'Green Root Node', 'Maize Master 04'].map((s, i) => (
                               <div key={i} className="p-10 bg-white border border-rose-200 rounded-[48px] shadow-xl space-y-6 group hover:border-rose-800/30 transition-all">
                                  <div className="flex justify-between items-start">
                                     <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-rose-800 group-hover:rotate-12 transition-transform">{s[0]}</div>
                                     <span className="text-[10px] font-mono text-stone-400">#EA-{(882 + i * 4).toString()}</span>
                                  </div>
                                  <h4 className="text-2xl font-black text-stone-900 uppercase tracking-tight">{s}</h4>
                                  <button className="w-full py-4 bg-rose-800 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg">VOUCH STEWARD</button>
                               </div>
                            ))}
                         </div>
                      </div>
                    )}

                    {portalTab === 'heartbeat' && (
                      <div className="p-12 md:p-20 bg-stone-100 border border-stone-200 rounded-[64px] space-y-10 shadow-lg animate-in zoom-in duration-700">
                        <h4 className="text-2xl font-black uppercase text-stone-800 tracking-[0.4em] flex items-center justify-center gap-4"><Activity className="text-rose-800" /> Bio-Electric Community Pulse</h4>
                        <div className="flex items-end gap-3 h-48 justify-center max-w-4xl mx-auto">
                           {[...Array(30)].map((_, i) => (
                              <div key={i} className="flex-1 bg-rose-800/80 rounded-full animate-bounce" style={{ height: `${20 + Math.sin(i * 0.4) * 60}%`, animationDelay: `${i * 0.05}s` }}></div>
                           ))}
                        </div>
                        <div className="text-center pt-10">
                           <p className="text-stone-500 italic text-xl">"Current network resonance: Optimal. Community willingness at 92.4%."</p>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               {/* 5. TOKENZ CONTENT (DARK) */}
               {activeBrand.id === 'tokenz' && (
                 <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div className="p-12 md:p-16 rounded-[64px] bg-indigo-950/20 border border-indigo-500/20 space-y-10 flex flex-col justify-between shadow-3xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Gem size={300} className="text-white" /></div>
                             <div className="space-y-8 relative z-10">
                                <div className="w-16 h-16 bg-indigo-900 rounded-2xl flex items-center justify-center text-white shadow-xl border border-white/5"><Landmark size={32} /></div>
                                <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter italic m-0">FINANCING THE <span className="text-indigo-500 underline">FUTURE.</span></h2>
                                <p className="text-xl text-slate-400 font-medium italic">Decentralized RWA sharding and institutional liquidity for audited farm clusters.</p>
                             </div>
                             <button onClick={() => setPortalTab('swa_sharding')} className="w-full py-8 bg-indigo-800 hover:bg-indigo-700 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all">INITIALIZE FINANCIAL SYNC</button>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                             {[
                                { l: 'Total Sharded Value', v: '$428M', i: Binary, c: 'text-indigo-500' },
                                { l: 'Active Stakers', v: '12.4K', i: Users, c: 'text-slate-400' },
                                { l: 'Node Yield %', v: '18.4%', i: TrendingUp, c: 'text-emerald-600' },
                                { l: 'DAO Shards', v: '42 Active', i: FileCode, c: 'text-rose-800' },
                             ].map((stat, i) => (
                                <div key={i} className="p-8 bg-black/60 border border-white/5 rounded-[40px] shadow-xl flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                                   <div className={`p-4 rounded-xl bg-white/5 w-fit ${stat.c} mb-6 group-hover:scale-110 transition-transform`}><stat.i size={24} /></div>
                                   <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.l}</p><p className="text-3xl font-mono font-black text-white leading-none">{stat.v}</p></div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'swa_sharding' && (
                       <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">RWA <span className="text-indigo-400">Sharding Console</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {MOCK_SHARDS_TOKENZ.map(shard => (
                                <div key={shard.id} className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 shadow-xl space-y-6 group hover:border-indigo-500/40 transition-all">
                                   <div className="flex justify-between items-start">
                                      <div className="p-4 bg-white/5 rounded-2xl text-indigo-400"><Boxes size={28} /></div>
                                      <span className="text-[10px] font-mono text-slate-500">{shard.id}</span>
                                   </div>
                                   <h4 className="text-2xl font-black text-white uppercase italic truncate">{shard.asset}</h4>
                                   <div className="space-y-4">
                                      <div className="flex justify-between items-center text-xs">
                                         <span className="text-slate-500 font-bold uppercase">Token Price</span>
                                         <span className="text-white font-mono">{shard.price} EAC</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                         <span className="text-slate-500 font-bold uppercase">APR Yield</span>
                                         <span className="text-emerald-400 font-mono">+{shard.apr}%</span>
                                      </div>
                                   </div>
                                   <button className="w-full py-4 bg-indigo-800 hover:bg-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">FRACTIONALIZE</button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'defi_bridge' && (
                       <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-700">
                          <div className="p-16 glass-card rounded-[64px] border border-indigo-500/20 bg-black/40 space-y-12">
                             {/* Fix: Added ArrowRightLeft to imports to resolve Cannot find name error */}
                             <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl animate-float"><ArrowRightLeft size={48} /></div>
                             <div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Liquidity <span className="text-indigo-400">Bridge Hub</span></h3>
                                <p className="text-slate-400 text-xl font-medium mt-4">Swap agricultural equity tokens for stable network liquidity.</p>
                             </div>
                             <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Bridge Pool</p><p className="text-4xl font-mono font-black text-white">1.2M <span className="text-sm">EAT</span></p></div>
                                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Fee Rate</p><p className="text-4xl font-mono font-black text-emerald-400">0.2%</p></div>
                             </div>
                             <button className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">INITIALIZE BRIDGE SWAP</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'dao_hub' && (
                       <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Governance <span className="text-indigo-400">DAO Console</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {[
                                { t: 'Protocol Upgrade v4.3', desc: 'Implement automated SID slashing thresholds.', vote: '64%', status: 'Active' },
                                { t: 'Treasury Re-allocation', desc: 'Move 5M EAC to Kenyan regional soil shards.', vote: '92%', status: 'Active' },
                             ].map((v, i) => (
                                <div key={i} className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                                   <div className="flex justify-between items-start">
                                      <h4 className="text-2xl font-black text-white uppercase italic">{v.t}</h4>
                                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-500/20">{v.status}</span>
                                   </div>
                                   <p className="text-slate-400 text-sm italic">"{v.desc}"</p>
                                   <div className="space-y-3 pt-6">
                                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                                         <span>Consensus Progress</span>
                                         <span>{v.vote}</span>
                                      </div>
                                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                         <div className="h-full bg-indigo-500" style={{ width: v.vote }}></div>
                                      </div>
                                   </div>
                                   <div className="flex gap-4 pt-4">
                                      <button className="flex-1 py-4 bg-emerald-600 rounded-2xl text-[9px] font-black uppercase text-white shadow-lg">Cast FOR</button>
                                      <button className="flex-1 py-4 bg-rose-600 rounded-2xl text-[9px] font-black uppercase text-white shadow-lg">Cast AGAINST</button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
               )}

               {/* 6. LILIES AROUND CONTENT (LIGHT) */}
               {activeBrand.id === 'lilies' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                       <div className="p-16 md:p-24 rounded-[64px] bg-white border border-fuchsia-200 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-12 opacity-5"><Crown size={400} className="text-fuchsia-900" /></div>
                          <div className="w-56 h-56 md:w-72 md:h-72 bg-fuchsia-800 rounded-[48px] md:rounded-[64px] flex items-center justify-center text-white shadow-3xl relative z-10 animate-float">
                              <Flower2 size={120} />
                          </div>
                          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                              <h2 className="text-5xl md:text-7xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">AESTHETIC <span className="text-fuchsia-700 underline">REVOLUTION.</span></h2>
                              <p className="text-2xl text-stone-600 font-medium italic">Architectural floriculture merging botanical design with celestial planting logic.</p>
                              <button onClick={() => setPortalTab('architecture')} className="px-16 py-8 bg-fuchsia-900 hover:bg-fuchsia-800 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">EXPLORE DESIGN STUDIO</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'architecture' && (
                       <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic border-b border-stone-200 pb-6">Botanical <span className="text-fuchsia-800">Architecture</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             {[
                                { t: 'Lily Grid v1', d: 'Symmetrical arrangement optimized for pollinator ingest.', i: Layout },
                                { t: 'Celestial Arc', d: 'Planting curve following lunar shadow telemetry.', i: Compass },
                             ].map((a, i) => (
                                <div key={i} className="p-12 bg-stone-50 border border-stone-200 rounded-[56px] shadow-xl space-y-8 group hover:border-fuchsia-800/30 transition-all flex items-center gap-10">
                                   <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-fuchsia-800 shadow-md border border-stone-100"><a.i size={40} /></div>
                                   <div className="space-y-2">
                                      <h4 className="text-2xl font-black text-stone-900 uppercase italic">{a.t}</h4>
                                      <p className="text-stone-500 italic text-lg">"{a.d}"</p>
                                      <button className="text-[10px] font-black text-fuchsia-700 uppercase tracking-widest mt-4">Draft Blueprint Shard</button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'astrology' && (
                       <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-500">
                          <div className="p-16 bg-stone-50 border border-fuchsia-200 rounded-[64px] shadow-3xl space-y-10 relative overflow-hidden">
                             <div className="absolute inset-0 opacity-[0.03]"><Moon size={400} className="text-fuchsia-900" /></div>
                             <div className="w-24 h-24 bg-fuchsia-100 text-fuchsia-800 rounded-[32px] flex items-center justify-center mx-auto shadow-xl relative z-10"><Moon size={48} /></div>
                             <div className="relative z-10">
                                <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter italic m-0">Celestial <span className="text-fuchsia-800">Planting Sync</span></h3>
                                <p className="text-stone-500 text-xl font-medium mt-4">Synchronize your node with planetary alignment shards for 1.2x C(a) growth.</p>
                             </div>
                             <div className="p-10 bg-white rounded-[40px] border border-stone-100 shadow-inner space-y-6 relative z-10">
                                <div className="flex justify-between items-center px-4">
                                   <span className="text-xs font-black text-stone-400 uppercase">Current Lunar Phase</span>
                                   <span className="text-xl font-black text-fuchsia-800 italic">Waxing Gibbous</span>
                                </div>
                                <div className="h-px bg-stone-100 w-full"></div>
                                <div className="flex justify-between items-center px-4">
                                   <span className="text-xs font-black text-stone-400 uppercase">Optimal Planting</span>
                                   <span className="text-xl font-black text-emerald-600 italic">NOW ACTIVE</span>
                                </div>
                             </div>
                             <button className="w-full py-8 bg-fuchsia-900 text-white rounded-[40px] text-xs font-black uppercase tracking-[0.5em] shadow-2xl relative z-10 active:scale-95">ANCHOR CELESTIAL PROTOCOL</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'boutique' && (
                       <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                          <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic border-b border-stone-200 pb-6">Floral <span className="text-fuchsia-800">Boutique</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                             {['Midnight Lily Shard', 'Solar Orchid Node', 'Bantu Petal v4', 'Aura Fern'].map((b, i) => (
                                <div key={i} className="p-8 bg-white border border-stone-100 rounded-[44px] shadow-lg group hover:border-fuchsia-300 transition-all flex flex-col items-center text-center space-y-6">
                                   <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center text-fuchsia-800 group-hover:scale-110 transition-transform shadow-inner"><Flower2 size={64} /></div>
                                   <h4 className="text-xl font-black text-stone-900 uppercase tracking-tight">{b}</h4>
                                   <p className="text-[10px] text-stone-400 font-mono font-black uppercase">PRICE: {(250 + i * 50)} EAC</p>
                                   <button className="w-full py-3 bg-fuchsia-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-md">ACQUIRE ASSET</button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
               )}

               {/* 7. AGROMUSIKA CONTENT (DARK) */}
               {activeBrand.id === 'agromusika' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                       <div className="relative rounded-[64px] overflow-hidden min-h-[500px] flex items-center border border-emerald-500/20 bg-emerald-950/10 shadow-3xl group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1600')] bg-cover opacity-10 grayscale group-hover:grayscale-0 transition-all duration-[12s]"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                          <div className="relative z-10 p-16 md:p-24 space-y-10 max-w-4xl">
                            <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20">SONIC_CORE_v4.2</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">SONIC <br/> <span className="text-emerald-500">REMEDIATION.</span></h2>
                            <p className="text-slate-400 text-2xl font-medium italic leading-relaxed">Repairing soil biometrics and plant wellness through high-fidelity bio-electric frequency sharding.</p>
                            <button onClick={() => setPortalTab('resonance_lab')} className="px-12 py-6 bg-emerald-800 hover:bg-emerald-700 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all">INITIALIZE SONIC SWEEP</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'resonance_lab' && (
                       <div className="max-w-5xl mx-auto space-y-12 text-center animate-in zoom-in duration-500">
                          <div className="p-16 glass-card rounded-[64px] border border-emerald-500/20 bg-black/40 space-y-12">
                             <div className="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl animate-float"><WavesIcon size={48} /></div>
                             <div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Frequency <span className="text-emerald-400">Generator</span></h3>
                                <p className="text-slate-400 text-xl font-medium mt-4 italic">Dial in the 432Hz repair signature for local node soil shards.</p>
                             </div>
                             <div className="space-y-10 py-10 border-y border-white/5">
                                <div className="flex justify-between px-6">
                                   <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Frequency</span>
                                   <span className="text-4xl font-mono font-black text-emerald-400">{activeFreq} Hz</span>
                                </div>
                                <input 
                                  type="range" min="300" max="600" value={activeFreq}
                                  onChange={e => setActiveFreq(Number(e.target.value))}
                                  className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner"
                                />
                             </div>
                             <button 
                               onClick={handleFreqGen}
                               disabled={isGeneratingFreq}
                               className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
                             >
                                {isGeneratingFreq ? <Loader2 className="w-8 h-8 animate-spin" /> : <PlayCircle className="w-8 h-8" />}
                                {isGeneratingFreq ? 'GENERATING REPAIR FIELD...' : 'INITIALIZE FREQUENCY SHARD'}
                             </button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'sonic_repair' && (
                       <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Repair <span className="text-emerald-400">Diagnostic Logs</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {[
                                { t: 'Soil De-compaction', d: 'Using low-frequency resonance to break up clay shards.', status: 'SUCCESS', node: 'Node_Paris_04' },
                                { t: 'Micro-biome Stimulation', d: 'Stimulating microbial activity via 432Hz pulses.', status: 'SYNCING', node: 'Stwd_Nairobi' },
                             ].map((r, i) => (
                                <div key={i} className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6 group hover:border-emerald-500/40 transition-all">
                                   <div className="flex justify-between items-start">
                                      <h4 className="text-2xl font-black text-white uppercase italic">{r.t}</h4>
                                      <span className={`px-3 py-1 rounded border text-[8px] font-black uppercase ${r.status === 'SUCCESS' ? 'text-emerald-400 border-emerald-500/20' : 'text-blue-400 border-blue-500/20'}`}>{r.status}</span>
                                   </div>
                                   <p className="text-slate-400 text-lg font-medium italic leading-relaxed">"{r.d}"</p>
                                   <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                      <p className="text-[9px] text-slate-600 font-mono font-black uppercase">{r.node}</p>
                                      <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><History size={16} /></button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'frequencies' && (
                       <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Bio-Electric <span className="text-emerald-400">Archive</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                             {['Growth_v1', 'Root_Sync', 'Carbon_Lock', 'Flow_Signature'].map((f, i) => (
                                <div key={i} className="p-8 glass-card border border-white/5 rounded-[44px] hover:bg-white/5 transition-all text-center space-y-6 group cursor-pointer">
                                   <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-110 transition-transform"><Music2 size={32} /></div>
                                   <h4 className="text-xl font-bold text-white uppercase tracking-tight">{f}</h4>
                                   <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full"><div className="h-full bg-emerald-500 w-1/3"></div></div>
                                   <button className="w-full py-3 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest group-hover:bg-emerald-600 transition-colors">LOAD SHARD</button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
               )}

               {/* 8. AGROINPDF CONTENT (DARK) */}
               {activeBrand.id === 'agroinpdf' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                       <div className="p-16 md:p-24 rounded-[64px] bg-cyan-950/20 border border-cyan-500/20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-3xl">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><BookOpen size={400} className="text-cyan-400" /></div>
                          <div className="w-56 h-56 md:w-72 md:h-72 bg-cyan-800 rounded-[48px] md:rounded-[64px] flex items-center justify-center text-white shadow-3xl relative z-10 animate-float">
                              <BookOpen size={120} />
                          </div>
                          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                              <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">IMMUTABLE <span className="text-cyan-400 underline">KNOWLEDGE.</span></h2>
                              <p className="text-2xl text-slate-400 font-medium italic leading-relaxed">Securing the world's agricultural wisdom into decentralized industrial shards.</p>
                              <button onClick={() => setPortalTab('docu_vault')} className="px-16 py-8 bg-cyan-900 hover:bg-cyan-800 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">ACCESS DOCU-VAULT</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'docu_vault' && (
                       <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Immutable <span className="text-cyan-400">Scientific Archive</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {[
                                { t: 'The C(a) Manual', author: 'EOS Governance', status: 'Registered' },
                                { t: 'Regen-Nitrogen Whitepaper', author: 'MedicAg Labs', status: 'Verified' },
                                { t: 'Bantu Lineage Seeds Census', author: 'Heritage Steward Alpha', status: 'Draft' },
                             ].map((d, i) => (
                                <div key={i} className="p-10 glass-card border border-white/5 rounded-[48px] shadow-xl group hover:border-cyan-500/40 transition-all flex flex-col justify-between h-[350px]">
                                   <div className="space-y-6">
                                      <div className="flex justify-between items-start">
                                         <div className="p-4 bg-white/5 rounded-2xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-xl"><FileText size={28} /></div>
                                         <span className="px-3 py-1 bg-white/5 text-[8px] font-black uppercase text-slate-500 rounded border border-white/10">{d.status}</span>
                                      </div>
                                      <h4 className="text-2xl font-black text-white uppercase italic leading-tight group-hover:text-cyan-400 transition-colors">{d.t}</h4>
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">AUTHOR: {d.author}</p>
                                   </div>
                                   <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest group-hover:bg-cyan-900 transition-all flex items-center justify-center gap-2">
                                      <Download size={14} /> Download Shard
                                   </button>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'knowledge_shards' && (
                       <div className="space-y-12 animate-in zoom-in duration-500">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Knowledge <span className="text-cyan-400">Micro-Shards</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                             {['Soil DNA', 'Spectral Math', 'IoT Auth', 'Bio-Waves', 'Thrust SE', 'Thrust HT', 'Thrust I', 'DAO 101'].map((s, i) => (
                                <div key={i} className="p-8 glass-card border border-white/5 rounded-[40px] text-center space-y-6 group hover:border-cyan-500/40 transition-all cursor-pointer">
                                   <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl"><Zap size={28} /></div>
                                   <h4 className="text-lg font-black text-white uppercase tracking-tight">{s}</h4>
                                   <p className="text-[9px] text-slate-600 font-black uppercase">5 min shard</p>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'cinema' && (
                       <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-b border-white/10 pb-6">Industrial <span className="text-cyan-400">Documentary Cinema</span></h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                             {[
                                { t: 'Legacy of the Seed', thumb: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800', views: '14.2K' },
                                { t: 'Silicon Soil: Zone 4', thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800', views: '8.4K' },
                             ].map((c, i) => (
                                <div key={i} className="glass-card rounded-[56px] overflow-hidden group border border-white/5 hover:border-cyan-500/30 transition-all relative">
                                   <div className="h-80 relative overflow-hidden">
                                      <img src={c.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={c.t} />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-black shadow-3xl hover:scale-110 active:scale-95 transition-all"><Play size={40} className="fill-current translate-x-1" /></button>
                                      </div>
                                      <div className="absolute bottom-10 left-10 space-y-2">
                                         <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">{c.t}</h4>
                                         <div className="flex items-center gap-4 text-slate-500 font-black text-[10px]">
                                            <Eye size={16} /> {c.views} VIEWS
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
               )}

               {/* 9. JUIEZY COOKIEZ CONTENT (LIGHT) */}
               {activeBrand.id === 'juizzycookiez' && (
                  <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-700">
                    {portalTab === 'home' && (
                       <div className="p-16 md:p-24 rounded-[64px] bg-white border border-orange-200 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-12 opacity-5"><Coffee size={400} className="text-orange-900" /></div>
                          <div className="w-56 h-56 md:w-72 md:h-72 bg-orange-700 rounded-[48px] md:rounded-[64px] flex items-center justify-center text-white shadow-3xl relative z-10 animate-float">
                              <Cookie size={120} />
                          </div>
                          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                              <h2 className="text-5xl md:text-7xl font-black text-stone-900 uppercase tracking-tighter italic leading-none">THE REGEN <span className="text-orange-700 underline">COOKIE.</span></h2>
                              <p className="text-2xl text-stone-600 font-medium italic">Traceable artisanal baking shards sourced from 100% physically audited regenerative cycles.</p>
                              <button onClick={() => setPortalTab('recipe_ledger')} className="px-16 py-8 bg-orange-800 hover:bg-orange-700 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">VIEW RECIPE LEDGER</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'recipe_ledger' && (
                       <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                          <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic border-b border-stone-200 pb-6">Immutable <span className="text-orange-800">Recipe Shards</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                             {[
                                { t: 'Omaha Oats v3', d: 'High m-constant grain formula with regenerative honey.', status: 'Audited' },
                                { t: 'Lineage Cocoa Shard', d: 'Single-node cocoa sharded for 100% purity.', status: 'Verified' },
                             ].map((r, i) => (
                                <div key={i} className="p-12 bg-stone-50 border border-stone-200 rounded-[56px] shadow-xl space-y-8 group hover:border-orange-800/30 transition-all">
                                   <div className="flex justify-between items-start">
                                      <div className="p-4 bg-white rounded-2xl text-orange-800 shadow-md border border-stone-100"><FileDigit size={32} /></div>
                                      <span className="px-3 py-1 bg-white border border-stone-200 text-[8px] font-black uppercase text-stone-500 rounded-full">{r.status}</span>
                                   </div>
                                   <h4 className="text-2xl font-black text-stone-900 uppercase italic leading-none">{r.t}</h4>
                                   <p className="text-stone-500 italic text-lg">"{r.d}"</p>
                                   <div className="pt-6 border-t border-stone-100 flex justify-between items-center">
                                      <span className="text-[10px] font-mono text-stone-400">HASH: 0x882_RECIPE_{i}</span>
                                      <button className="text-orange-800 font-black text-[10px] uppercase tracking-widest">Open Formula</button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}

                    {portalTab === 'batch_audit' && (
                       <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-500">
                          <div className="p-16 bg-white border border-orange-200 rounded-[64px] shadow-3xl space-y-10 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Activity size={400} className="text-orange-900" /></div>
                             <div className="w-24 h-24 bg-orange-100 text-orange-800 rounded-[32px] flex items-center justify-center mx-auto shadow-xl relative z-10"><ClipboardCheck size={48} /></div>
                             <div className="relative z-10">
                                <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter italic m-0">Batch <span className="text-orange-800">Traceability Audit</span></h3>
                                <p className="text-stone-500 text-xl font-medium mt-4">Trace your cookie batch ID directly to the farm node biometrics.</p>
                             </div>
                             <div className="relative z-10 max-w-lg mx-auto">
                                <input type="text" placeholder="Enter Batch Shard ID (e.g. COOK-882)..." className="w-full bg-stone-50 border border-stone-200 rounded-full py-6 px-10 text-xl font-mono text-orange-800 outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-center" />
                             </div>
                             <button className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl relative z-10 active:scale-95">INITIALIZE AUDIT TRACE</button>
                          </div>
                       </div>
                    )}

                    {portalTab === 'bakery_node' && (
                       <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                          <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter italic border-b border-stone-200 pb-6">Live <span className="text-orange-800">Bakery Pod Monitor</span></h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {[
                                { id: 'POD-01', t: 'Omaha Solar Pod', temp: '220°C', load: 'HIGH', health: 98 },
                                { id: 'POD-02', t: 'Nairobi Ingest Pod', temp: '215°C', load: 'NOMINAL', health: 94 },
                                { id: 'POD-03', t: 'California Shard Pod', temp: '180°C', load: 'IDLE', health: 100 },
                             ].map((p, i) => (
                                <div key={i} className="p-10 bg-white border border-stone-100 rounded-[56px] shadow-lg space-y-8 relative overflow-hidden group hover:border-orange-400 transition-all">
                                   <div className="flex justify-between items-center">
                                      <h4 className="text-2xl font-black text-stone-900 uppercase italic leading-none">{p.id}</h4>
                                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                   </div>
                                   <div className="flex items-center gap-6">
                                      <div className="p-4 bg-orange-50 text-orange-800 rounded-2xl shadow-sm"><FlameKindling size={28} /></div>
                                      <div>
                                         <p className="text-[10px] text-stone-400 font-black uppercase mb-1">Thermal Sync</p>
                                         <p className="text-3xl font-mono font-black text-stone-900">{p.temp}</p>
                                      </div>
                                   </div>
                                   <div className="space-y-4 pt-6 border-t border-stone-50">
                                      <div className="flex justify-between text-[9px] font-black uppercase text-stone-500">
                                         <span>Node Load: {p.load}</span>
                                         <span>Health: {p.health}%</span>
                                      </div>
                                      <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                                         <div className="h-full bg-orange-700" style={{ width: `${p.health}%` }}></div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
               )}

               {/* Default Node Placeholder */}
               {!portalTab.includes('home') && !['agroboto', 'medicag', 'junior', 'love4agro', 'tokenz', 'lilies', 'agromusika', 'agroinpdf', 'juizzycookiez'].includes(activeBrand.id) && (
                 <div className="h-full flex flex-col items-center justify-center py-40 opacity-20 animate-in fade-in duration-1000">
                    <Monitor size={120} className={activeBrand.isLight ? 'text-stone-900' : 'text-slate-500'} />
                    <p className={`text-2xl font-black uppercase tracking-[0.8em] mt-10 ${activeBrand.isLight ? 'text-stone-900' : 'text-white'}`}>
                       {portalTab.replace(/_/g, ' ')} Node Initializing
                    </p>
                 </div>
               )}

            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Ecosystem;