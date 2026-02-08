import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flower2, Music, Heart, Bot, Cookie, Baby, X, Activity, Leaf, Cpu, ArrowRight, ArrowRightLeft, Landmark, Binary, Package, Palette, PencilRuler, Moon, Waves, Radio, ChefHat, BookOpen, Video, FileText, Download, Microscope, User as UserIcon, HeartPulse, Factory, BadgeCheck, ShieldAlert, Zap, Layers, Smartphone, Star, Target, BrainCircuit, Scan, ShieldCheck as ShieldCheckIcon, HandHelping, Users, Search, ClipboardCheck, Globe, Sprout, Monitor, Radar, Gem, Stethoscope, GraduationCap, FileCode, Waves as WavesIcon, Speaker, Ticket, Shield, SearchCode, Flame, Wind, Loader2, TrendingUp, Gauge, Terminal, Satellite, RadioReceiver, Microscope as MicroscopeIcon, Droplets, Play, Battery, Signal, Cog, ZapOff, PlayCircle, BarChart4, Network, AlertCircle, Sparkles, PlusCircle, Coins, Pause, ChevronRight, CheckCircle2, History, RefreshCw, Handshake,
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
  Key,
  ShieldX,
  /* Added missing icons to fix "Cannot find name" errors */
  LayoutGrid,
  Database,
  Box,
  Maximize2
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
  { id: 'juizzycookiez', name: 'Juiezy Cookiez', icon: Cookie, color: 'text-orange-900', accent: 'text-orange-700', bg: 'bg-orange-900/10', desc: 'Artis artisanal Traceability. Solar-dried baked nodes from audited regenerative cycles.', action: 'Recipe Audit', thrust: 'industry', volume: '840K EAC', isLight: true },
];

const Ecosystem: React.FC<EcosystemProps> = ({ user, onDeposit, onUpdateUser, onNavigate }) => {
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [filter, setFilter] = useState<'all' | ThrustType>('all');
  const [portalTab, setPortalTab] = useState<string>('home');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Internal Portal States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AIResponse | null>(null);
  const [telemetryStream, setTelemetryStream] = useState<any[]>([]);

  const filteredBrands = filter === 'all' ? BRANDS : BRANDS.filter(b => b.thrust === filter);

  useEffect(() => {
    if (activeBrand) {
      const interval = setInterval(() => {
        setTelemetryStream(prev => [
          { id: Math.random().toString(36).slice(2, 6).toUpperCase(), time: new Date().toLocaleTimeString(), val: (Math.random() * 100).toFixed(2) },
          ...prev
        ].slice(0, 10));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeBrand]);

  const handlePortalLaunch = (brand: Brand) => {
    setIsSyncing(true);
    setTimeout(() => {
      setActiveBrand(brand);
      setPortalTab('home');
      setIsSyncing(false);
      setAuditResult(null);
    }, 1200);
  };

  const handleRunAudit = async (category: string, desc: string) => {
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const res = await runSpecialistDiagnostic(category, desc);
      setAuditResult(res);
    } catch (e) {
      setAuditResult({ text: "Oracle Handshake Interrupted. Registry sync recommended." });
    } finally {
      setIsAuditing(false);
    }
  };

  const renderBrandPortal = () => {
    if (!activeBrand) return null;
    const accentColor = activeBrand.color.replace('text-', '');

    return (
      <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-3xl animate-in zoom-in duration-500 flex flex-col">
        {/* Portal Header HUD */}
        <div className={`p-8 border-b border-${accentColor}-500/20 bg-${accentColor}-500/5 flex items-center justify-between shrink-0 relative overflow-hidden`}>
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
              <div className={`w-full h-[1px] bg-${accentColor}-500 absolute top-0 animate-scan`}></div>
           </div>
           <div className="flex items-center gap-8 relative z-10">
              <div className={`w-20 h-20 rounded-3xl bg-${accentColor}-600 flex items-center justify-center text-white shadow-3xl border-4 border-white/10 group-hover:rotate-6 transition-transform`}>
                 <activeBrand.icon size={40} />
              </div>
              <div>
                 <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">{activeBrand.name}</h2>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border border-${accentColor}-500/30 bg-${accentColor}-500/10 ${activeBrand.color} tracking-widest`}>
                       THRUST: {activeBrand.thrust}
                    </span>
                 </div>
                 <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-3">REGISTRY_PORTAL // NODE_{user.esin}</p>
              </div>
           </div>
           <button 
             onClick={() => setActiveBrand(null)}
             className={`p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-3xl`}
           >
              <X size={32} />
           </button>
        </div>

        {/* Portal Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
           
           {/* Navigation Sidebar */}
           <div className={`w-full md:w-80 border-r border-${accentColor}-500/10 bg-black/40 p-10 space-y-10 shrink-0`}>
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Portal Ingests</p>
                 {[
                    { id: 'home', label: 'Operational Hub', icon: LayoutGrid },
                    { id: 'telemetry', label: 'Inflow Stream', icon: Activity },
                    { id: 'audit', label: 'Oracle Audit', icon: Bot },
                    { id: 'shards', label: 'Registry Assets', icon: Database },
                 ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => { setPortalTab(tab.id); setAuditResult(null); }}
                      className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${portalTab === tab.id ? `bg-${accentColor}-600 text-white shadow-2xl` : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                       <tab.icon size={18} />
                       <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                    </button>
                 ))}
              </div>

              <div className={`p-8 rounded-[40px] border-2 border-${accentColor}-500/20 bg-${accentColor}-500/5 space-y-6 shadow-xl`}>
                 <div className="flex items-center gap-4">
                    <Activity size={16} className={activeBrand.color} />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Shard Status</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                       <span>Registry Load</span>
                       <span className={activeBrand.color}>NOMINAL</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-${accentColor}-500 animate-pulse`} style={{ width: '84%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-10 md:p-20 bg-black/20">
              
              {/* HUB VIEW */}
              {portalTab === 'home' && (
                <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className={`glass-card p-12 rounded-[64px] border border-white/5 bg-white/[0.01] space-y-10 shadow-3xl relative overflow-hidden group`}>
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Sparkles size={300} /></div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Mission <span className={activeBrand.color}>Abstract</span></h3>
                         <p className="text-slate-400 text-2xl font-medium italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            "{activeBrand.desc}"
                         </p>
                         <div className="pt-10 border-t border-white/5 flex flex-wrap gap-4">
                            <span className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase text-slate-500 tracking-widest">{activeBrand.volume}</span>
                            <span className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase text-slate-500 tracking-widest">ZK_PROVEN</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         {[
                           { l: 'Network APY', v: '+18.4%', i: TrendingUp, c: 'text-emerald-400' },
                           { l: 'Consensus', v: '99.9%', i: ShieldCheckIcon, c: 'text-blue-400' },
                           { l: 'Drift Index', v: '0.002', i: Gauge, c: 'text-indigo-400' },
                           { l: 'Peer Entropy', v: '1.42x', i: Binary, c: 'text-amber-500' },
                         ].map((s, i) => (
                           <div key={i} className="p-8 glass-card rounded-[40px] border border-white/5 bg-black/40 flex flex-col justify-between group hover:border-white/10 transition-all shadow-xl">
                              <div className="p-3 bg-white/5 rounded-2xl w-fit group-hover:rotate-6 transition-all">
                                 <s.i size={20} className={s.c} />
                              </div>
                              <div>
                                 <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-1">{s.l}</p>
                                 <p className="text-3xl font-mono font-black text-white">{s.v}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className={`p-16 rounded-[80px] border-2 border-${accentColor}-500/20 bg-${accentColor}-500/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl group/action`}>
                      <div className="flex items-center gap-10 text-center md:text-left flex-col md:flex-row">
                         <div className={`w-28 h-28 rounded-[40px] bg-${accentColor}-600 flex items-center justify-center shadow-3xl animate-pulse ring-[16px] ring-white/5`}>
                            <Zap size={48} className="text-white fill-current" />
                         </div>
                         <div className="space-y-3">
                            <h4 className="text-4xl font-black text-white uppercase italic m-0">Initialize <span className={activeBrand.color}>{activeBrand.action}</span></h4>
                            <p className="text-slate-400 text-xl font-medium italic">Commence industrial synchronization for this pillar.</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setPortalTab('audit')}
                        className={`px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-${accentColor}-500/10`}
                      >
                         EXECUTE MISSION
                      </button>
                   </div>
                </div>
              )}

              {/* TELEMETRY VIEW */}
              {portalTab === 'telemetry' && (
                <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                   <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4">
                      <div className="space-y-4">
                         <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">TELEMETRY <span className={activeBrand.color}>INFLOW</span></h3>
                         <p className="text-slate-500 text-xl font-medium italic">"M2M synchronization of localized industrial shards."</p>
                      </div>
                      <div className={`px-6 py-2 bg-${accentColor}-500/10 border border-${accentColor}-500/20 rounded-full text-${accentColor}-400 font-mono text-[10px] font-black uppercase animate-pulse`}>
                         STREAM_LIVE_0x882A
                      </div>
                   </div>

                   <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black/60 shadow-3xl overflow-hidden flex flex-col h-[600px]">
                      <div className="p-8 border-b border-white/10 bg-white/5 grid grid-cols-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic px-12">
                         <span>Packet Identifier</span>
                         <span>Time Shard</span>
                         <span>Resonance Value</span>
                         <span className="text-right">Auth Status</span>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050706] p-4">
                         {telemetryStream.map((log, i) => (
                            <div key={i} className="grid grid-cols-4 p-8 hover:bg-white/[0.02] transition-all items-center group animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                               <div className="flex items-center gap-6">
                                  <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${activeBrand.color} group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner`}>
                                     <Binary size={20} />
                                  </div>
                                  <span className="text-sm font-mono font-black text-white tracking-widest">{log.id}</span>
                               </div>
                               <span className="text-xs text-slate-600 font-mono italic">{log.time}</span>
                               <div className="flex items-center gap-3">
                                  <Activity size={14} className={activeBrand.color} />
                                  <span className="text-xl font-mono font-black text-white">{log.val}</span>
                               </div>
                               <div className="flex justify-end pr-4">
                                  <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-[8px] font-black uppercase tracking-widest">COMMITTED</div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}

              {/* ORACLE AUDIT VIEW */}
              {portalTab === 'audit' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500 text-center">
                   <div className={`p-16 md:p-24 glass-card rounded-[80px] border-2 border-${accentColor}-500/20 bg-${accentColor}-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group`}>
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                         <Bot size={800} />
                      </div>
                      
                      <div className="relative z-10 space-y-10 w-full">
                         <div className={`w-32 h-32 rounded-[44px] bg-${accentColor}-600 flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform duration-700 animate-float`}>
                            <Bot size={64} className="text-white animate-pulse" />
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter m-0 leading-none">Institutional <span className={activeBrand.color}>Oracle</span></h3>
                            <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed">"Initializing high-frequency diagnostic for {activeBrand.name} mission shards."</p>
                         </div>

                         {!auditResult && !isAuditing ? (
                            <button 
                               onClick={() => handleRunAudit(activeBrand.name, `Perform a full institutional audit on node ${user.esin} within the ${activeBrand.name} brand context. Align with SEHTI thrust: ${activeBrand.thrust}.`)}
                               className={`w-full max-w-sm py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-${accentColor}-500/5`}
                            >
                               <Zap className="fill-current" />
                               <span className="ml-4">INITIALIZE AUDIT</span>
                            </button>
                         ) : isAuditing ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-10 animate-in zoom-in duration-500">
                               <div className="relative">
                                  <Loader2 size={120} className={`text-${accentColor}-500 animate-spin mx-auto`} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <Sparkles size={40} className={`text-${accentColor}-400 animate-pulse`} />
                                  </div>
                               </div>
                               <p className={`text-${accentColor}-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0`}>SEQUENCING SHARDS...</p>
                            </div>
                         ) : (
                            <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12">
                               <div className={`p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-${accentColor}-500/20 shadow-3xl border-l-[16px] border-l-${accentColor}-600 relative overflow-hidden group/audit text-left`}>
                                  <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-8">
                                     <BadgeCheck size={32} className={`text-${accentColor}-400`} />
                                     <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">Vetting Verdict</h4>
                                  </div>
                                  <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-8 border-l border-white/5">
                                     {auditResult.text}
                                  </div>
                               </div>
                               <div className="flex justify-center gap-8">
                                  <button onClick={() => setAuditResult(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                  <button className={`px-24 py-6 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-[16px] ring-${accentColor}-500/5`}>
                                     <Stamp size={28} /> ANCHOR TO LEDGER
                                  </button>
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              )}

              {/* ASSET SHARDS VIEW */}
              {portalTab === 'shards' && (
                <div className="space-y-12 animate-in slide-in-from-left-8 duration-700">
                   <div className="flex justify-between items-end border-b border-white/5 pb-10 px-4">
                      <div className="space-y-4">
                         <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">REGISTRY <span className={activeBrand.color}>ASSETS</span></h3>
                         <p className="text-slate-500 text-xl font-medium italic">"Audit of provisioned resources sharded through this node."</p>
                      </div>
                      <button className={`px-10 py-5 bg-${accentColor}-600 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-${accentColor}-500 transition-all active:scale-95 flex items-center gap-3`}>
                         <Download size={18} /> Export Registry
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                         <div key={i} className="p-10 glass-card rounded-[56px] border-2 border-white/5 hover:border-white/20 bg-black/40 flex flex-col justify-between h-[450px] relative overflow-hidden group shadow-2xl transition-all">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={200} /></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                               <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${activeBrand.color} shadow-inner group-hover:rotate-12 transition-transform`}>
                                  <Box size={24} />
                               </div>
                               <span className="text-[10px] font-mono text-slate-700 font-black uppercase">SHARD_0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                            </div>
                            <div className="space-y-4 relative z-10">
                               <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Resource Unit #0{i}</h4>
                               <p className="text-xs text-slate-500 font-medium italic leading-relaxed">"Verified biological asset provisioned for the ${activeBrand.name} cycle."</p>
                            </div>
                            <div className="pt-8 border-t border-white/5 mt-auto relative z-10 flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                  <Activity size={14} className="text-emerald-500" />
                                  <span className="text-xs font-mono font-black text-emerald-400">SYNC_OK</span>
                               </div>
                               <button className={`p-4 bg-white/5 rounded-2xl text-slate-500 hover:${activeBrand.color} transition-colors shadow-lg`}><Maximize2 size={18} /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
              )}

           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 overflow-x-hidden relative">
      
      {/* Dynamic Scan FX Background */}
      <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden z-0">
         <div className="w-full h-[1px] bg-emerald-500/10 absolute top-0 animate-scan"></div>
      </div>

      {/* Multiverse Header HUD */}
      <div className="px-4">
        <div className="glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-14 group shadow-3xl z-10 backdrop-blur-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
              <Globe className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] md:rounded-[80px] bg-emerald-600 shadow-[0_0_120px_rgba(16,185,129,0.4)] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Layers size={96} className="text-white animate-float" />
                 <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[56px] md:rounded-[80px] animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 glass-card rounded-[32px] border-2 border-white/20 bg-black/90 flex flex-col items-center shadow-3xl z-20">
                 <Radio size={28} className="text-emerald-400 animate-pulse mb-1" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">CORE_SYNC</span>
              </div>
           </div>

           <div className="space-y-8 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner italic">MULTIVERSE_CORE_v6.5</span>
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-indigo-500/20 shadow-inner italic">QUORUM_VERIFIED</span>
                 </div>
                 <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter italic m-0 leading-[0.85] drop-shadow-2xl">BRAND <br/> <span className="text-emerald-400">MULTIVERSE.</span></h2>
              </div>
              <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "The EnvirosAgro network operates as a synchronized multiverse of specialized pillars. Each brand node provides unique industrial finality to the global agrarian quorum."
              </p>
           </div>
        </div>
      </div>

      {/* Multiverse Navigation Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 relative z-20">
         <div className="flex flex-nowrap gap-4 p-2 glass-card rounded-[40px] border border-white/5 bg-black/40 shadow-2xl overflow-x-auto scrollbar-hide snap-x w-full md:w-auto px-8">
           <button 
             onClick={() => setFilter('all')} 
             className={`px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all snap-center whitespace-nowrap ${filter === 'all' ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
           >
              Multiverse Center
           </button>
           {Object.entries(THRUST_METADATA).map(([key, meta]: [any, any]) => (
             <button 
               key={key} 
               onClick={() => setFilter(key)} 
               className={`flex items-center gap-4 px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all snap-center whitespace-nowrap ${filter === key ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
                <meta.icon size={18} /> {meta.label}
             </button>
           ))}
         </div>
         
         <div className="flex items-center gap-4 px-8 py-4 glass-card rounded-full border border-white/5 bg-black/40 shadow-xl hidden xl:flex">
            <Search className="text-slate-600 w-5 h-5" />
            <input type="text" placeholder="Filter multiverse shards..." className="bg-transparent border-none outline-none text-white font-black text-[10px] uppercase tracking-widest w-40 placeholder:text-slate-800" />
         </div>
      </div>

      {/* Grid of Brand Nodes */}
      <div className="flex md:grid md:grid-cols-2 xl:grid-cols-3 gap-12 px-4 overflow-x-auto md:overflow-visible scrollbar-hide snap-x scroll-across pb-20 relative z-10">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            onClick={() => handlePortalLaunch(brand)} 
            className="min-w-[340px] md:min-w-0 snap-center glass-card p-14 rounded-[80px] group hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col h-[580px] overflow-hidden bg-black/40 shadow-3xl relative active:scale-[0.98] duration-500"
          >
            {/* Background Hologram Shard */}
            <div className={`absolute -bottom-20 -right-20 p-12 opacity-[0.01] group-hover:opacity-[0.05] group-hover:scale-125 transition-all duration-[15s] pointer-events-none ${brand.color}`}>
              <brand.icon size={500} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className={`w-28 h-28 rounded-[40px] ${brand.bg} flex items-center justify-center mb-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 border-2 border-white/5 shadow-3xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-white/10 animate-pulse opacity-0 group-hover:opacity-100"></div>
              <brand.icon className={`w-14 h-14 ${brand.color} relative z-10 drop-shadow-2xl`} />
            </div>
            
            <div className="flex-1 space-y-6 relative z-10">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black text-white uppercase italic leading-none tracking-tighter group-hover:text-emerald-400 transition-colors m-0 drop-shadow-2xl">{brand.name}</h3>
                    <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic mt-3">PILLAR_KEY: {brand.id.toUpperCase()}</p>
                  </div>
                  <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-600 uppercase tracking-widest shadow-inner group-hover:${brand.color} group-hover:border-current transition-colors`}>{brand.thrust}</span>
               </div>
               <p className="text-slate-400 text-xl font-medium mt-10 line-clamp-4 italic leading-relaxed opacity-70 group-hover:opacity-100 transition-all font-sans">
                  "{brand.desc}"
               </p>
            </div>

            <div className="pt-10 border-t border-white/5 flex items-center justify-between text-slate-700 group-hover:text-emerald-400 transition-all relative z-10">
               <div className="flex items-center gap-5">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl">
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /> 
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] italic">SYNC_NODE</span>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-800 uppercase mb-1">AGGREGATE_MASS</p>
                  <span className="text-[12px] font-mono font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors">{brand.volume}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Syncing Overlay */}
      {isSyncing && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
           <div className="relative">
              <Loader2 className="w-32 h-32 text-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="w-12 h-12 text-emerald-400 animate-pulse" />
              </div>
           </div>
           <div className="space-y-4 text-center">
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter animate-pulse">ESTABLISHING <span className="text-emerald-400">HANDSHAKE...</span></h3>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.8em]">ZK_ENCRYPTED_TUNNEL_#0x882A</p>
           </div>
        </div>
      )}

      {/* Brand Portal Renderer */}
      {activeBrand && renderBrandPortal()}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 60px 180px -40px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Ecosystem;