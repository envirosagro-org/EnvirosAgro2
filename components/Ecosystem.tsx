
import React, { useState, useEffect, useMemo } from 'react';
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
  Timer,
  AudioWaveform,
  Podcast,
  MessageSquare,
  ArrowUpRight,
  Stamp,
  Fingerprint,
  Building,
  Key
} from 'lucide-react';
import { User, ViewState } from '../types';
import { runSpecialistDiagnostic, analyzeInstitutionalRisk, calibrateSonicResonance, AIResponse } from '../services/geminiService';

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

  // Tokenz Sub-States
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [tokenzRiskReport, setTokenzRiskReport] = useState<AIResponse | null>(null);

  // Agromusika Sub-States
  const [activeFreq, setActiveFreq] = useState(432);
  const [isGeneratingFreq, setIsGeneratingFreq] = useState(false);
  const [isScanningAcoustics, setIsScanningAcoustics] = useState(false);
  const [sonicCalibration, setSonicCalibration] = useState<string | null>(null);

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

  const handleRunTokenzAudit = async (asset: any) => {
    setIsAnalyzingRisk(true);
    setTokenzRiskReport(null);
    try {
      const res = await analyzeInstitutionalRisk({
        shard_id: asset.id,
        asset_name: asset.asset,
        valuation: asset.value,
        market_apr: asset.apr,
        node_esin: user.esin
      });
      setTokenzRiskReport(res);
    } catch (e) {
      alert("Oracle connection failure.");
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  const handleSonicIngest = async () => {
    setIsScanningAcoustics(true);
    setSonicCalibration(null);
    try {
      const res = await calibrateSonicResonance({
        node: user.esin,
        soil_type: 'Clay-Loam',
        m_constant: user.metrics.timeConstantTau,
        acoustic_noise_floor: '-42dB'
      });
      setSonicCalibration(res.text);
      onDeposit(10, 'Acoustic Ingest Synchronized');
    } catch (e) {
      alert("Sonic Oracle Sync Void.");
    } finally {
      setIsScanningAcoustics(false);
    }
  };

  const handleFreqGen = () => {
    setIsGeneratingFreq(true);
    setTimeout(() => {
      setIsGeneratingFreq(false);
      onDeposit(5, 'Bio-Electric Frequency Pulse');
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
                                   <button 
                                     onClick={() => handleRunTokenzAudit(shard)}
                                     disabled={isAnalyzingRisk}
                                     className="w-full py-4 bg-indigo-800 hover:bg-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3"
                                   >
                                     {isAnalyzingRisk ? <Loader2 className="animate-spin" size={14} /> : <ShieldCheckIcon size={14} />}
                                     {isAnalyzingRisk ? 'AUDITING...' : 'FRACTIONALIZE'}
                                   </button>
                                </div>
                             ))}
                          </div>
                          {tokenzRiskReport && (
                            <div className="mt-10 p-10 glass-card rounded-[48px] border-l-[12px] border-l-indigo-600 bg-indigo-950/5 animate-in slide-in-from-bottom-4">
                               <div className="flex items-center gap-6 mb-6">
                                  <div className="p-3 bg-indigo-600 rounded-xl"><Bot size={24} className="text-white" /></div>
                                  <h4 className="text-xl font-black text-white uppercase italic">Institutional Audit Report</h4>
                               </div>
                               <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l border-white/5 pl-8">
                                  {tokenzRiskReport.text}
                               </div>
                               <div className="mt-8 flex justify-end gap-4">
                                  <button onClick={() => setTokenzRiskReport(null)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 font-black text-[10px] uppercase">Discard</button>
                                  <button className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Anchor to Ledger</button>
                               </div>
                            </div>
                          )}
                       </div>
                    )}

                    {portalTab === 'defi_bridge' && (
                       <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-700">
                          <div className="p-16 glass-card rounded-[64px] border border-indigo-500/20 bg-black/40 space-y-12">
                             <div className="w-24 h-24 bg-indigo-500/10 text-indigo-400 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl animate-float"><ArrowRightLeft size={48} /></div>
                             <div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Liquidity <span className="text-indigo-400">Bridge Hub</span></h3>
                                <p className="text-slate-400 text-xl font-medium mt-4">Swap agricultural equity tokens for stable network liquidity.</p>
                             </div>
                             <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Bridge Pool</p><p className="text-4xl font-mono font-black text-white">1.2M <span className="text-sm">EAT</span></p></div>
                                <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Fee Rate</p><p className="text-4xl font-mono font-black text-emerald-400">0.2%</p></div>
                             </div>
                             <button className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">INITIALIZE BRIDGE SWAP</button>
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
                                <p className="text-slate-400 text-xl font-medium mt-4 italic">Dial in the repair signature for local node soil shards.</p>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-white/5">
                                <div className="space-y-10">
                                   <div className="flex justify-between px-6">
                                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Frequency</span>
                                      <span className="text-4xl font-mono font-black text-emerald-400">{activeFreq} Hz</span>
                                   </div>
                                   <input 
                                     type="range" min="300" max="600" value={activeFreq}
                                     onChange={e => setActiveFreq(Number(e.target.value))}
                                     className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner"
                                   />
                                   <div className="flex justify-between items-center px-4">
                                      <button onClick={handleFreqGen} className="px-10 py-4 bg-emerald-600 rounded-2xl text-white font-black text-[10px] uppercase">Test Signal</button>
                                      {isGeneratingFreq && <AudioWaveform className="text-emerald-500 animate-pulse" />}
                                   </div>
                                </div>
                                <div className="p-8 bg-black/60 rounded-[44px] border border-emerald-500/10 flex flex-col justify-center gap-6">
                                   <button 
                                     onClick={handleSonicIngest}
                                     disabled={isScanningAcoustics}
                                     className="w-full py-5 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:text-white text-slate-400 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-3"
                                   >
                                      {isScanningAcoustics ? <Loader2 className="animate-spin" size={16} /> : <Scan size={16} />}
                                      {isScanningAcoustics ? 'SCANNING ACOUSTICS...' : 'SCAN ACOUSTIC INGEST'}
                                   </button>
                                   {sonicCalibration && (
                                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-left animate-in fade-in">
                                         <p className="text-xs text-slate-300 italic leading-relaxed">{sonicCalibration}</p>
                                      </div>
                                   )}
                                </div>
                             </div>

                             <button 
                               onClick={() => alert("FREQUENCY_ANCHORED: Node m-Constant boosted by +0.05x")}
                               className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                             >
                                <Stamp size={28} /> ANCHOR SONIC SHARD
                             </button>
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
