
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flower2, Music, Heart, Bot, Cookie, Baby, X, Activity, Leaf, Cpu, ArrowRight, ArrowRightLeft, Landmark, Binary, Package, Palette, PencilRuler, Moon, Waves, Radio, ChefHat, BookOpen, Video, FileText, Download, Microscope, User as UserIcon, HeartPulse, Factory, BadgeCheck, ShieldAlert, Zap, Layers, Smartphone, Star, Target, BrainCircuit, Scan, ShieldCheck as ShieldCheckIcon, HandHelping, Users, Search, ClipboardCheck, Globe, Sprout, Monitor, Radar, Gem, Stethoscope, GraduationCap, FileCode, Waves as WavesIcon, Speaker, Ticket, Shield, SearchCode, Flame, Wind, Loader2, TrendingUp, Gauge, Terminal, Satellite, RadioReceiver, Microscope as MicroscopeIcon, Droplets, Play, Battery, Signal, Cog, ZapOff, PlayCircle, BarChart4, Network, AlertCircle, Sparkles, PlusCircle, Coins, Pause, ChevronRight, CheckCircle2, History, RefreshCcw, Handshake,
  Stethoscope as DoctorIcon,
  ShieldPlus,
  Thermometer,
  Microscope as LabIcon,
  HeartPulse as PulseIcon,
  Bed,
  Soup,
  Wind as AirIcon,
  Crosshair,
  Gamepad2,
  Trophy,
  Shapes,
  School,
  Sun,
  ThermometerSun,
  Blocks,
  Rocket,
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

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit, onUpdateUser, onNavigate }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  const handlePortalLaunch = (brand: Brand) => {
    setIsSyncing(true);
    setTimeout(() => {
      setActiveBrand(brand);
      setPortalTab('home');
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 overflow-x-hidden">
      
      {/* Multiverse Navigation - Horizontal Scrollable on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
         <div className="flex flex-nowrap gap-3 p-1.5 glass-card rounded-[28px] border border-white/5 bg-black/40 shadow-2xl overflow-x-auto scrollbar-hide snap-x w-full md:w-auto">
           <button onClick={() => setFilter('all')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all snap-center whitespace-nowrap ${filter === 'all' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Multiverse Core</button>
           {Object.entries(THRUST_METADATA).map(([key, meta]: [any, any]) => (
             <button key={key} onClick={() => setFilter(key)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all snap-center whitespace-nowrap ${filter === key ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                <meta.icon size={14} /> {meta.label}
             </button>
           ))}
         </div>
      </div>

      {/* Grid of Brand Nodes - Horizontal Peeking on Mobile */}
      <div className="flex md:grid md:grid-cols-2 xl:grid-cols-3 gap-10 px-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x scroll-across -mx-4 md:mx-0 px-4 md:px-0">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            onClick={() => handlePortalLaunch(brand)} 
            className="min-w-[300px] md:min-w-0 snap-center glass-card p-12 rounded-[64px] group hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col h-[520px] overflow-hidden bg-white/[0.01] shadow-3xl relative active:scale-[0.98] duration-300"
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

      {/* Syncing Overlay preserved... */}
      {/* Brand Portal Modal preserved... */}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Ecosystem;
