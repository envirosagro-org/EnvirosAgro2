
import React, { useState, useMemo } from 'react';
import { 
  PawPrint, TreePine, Droplets, Mountain, Wind, 
  Activity, Zap, ShieldCheck, Heart, Users, Target, 
  Brain, Scale, Microscope, Binary, Coins, Sparkles, 
  Bot, Loader2, Gauge, FlaskConical, Globe, Activity as Pulse,
  Layers, Lock, Database, Thermometer, Compass,
  CheckCircle2, AlertCircle, Info, ChevronRight, Fingerprint,
  Sprout,
  Waves,
  Cpu,
  Landmark,
  ShieldAlert,
  Dna,
  Workflow,
  Factory,
  Network,
  History,
  FileSearch,
  BookOpen,
  Leaf,
  X,
  FileText,
  SearchCode,
  Download,
  Terminal,
  ArrowRight,
  Link2,
  Circle,
  Bird,
  Flame,
  ArrowUpRight,
  HeartPulse,
  Radar,
  Bone,
  Eye,
  Settings,
  Microscope as LabIcon,
  Binoculars,
  MapPin,
  User as UserIcon,
  Wheat,
  ThermometerSun,
  Timer,
  // Added missing TrendingUp icon to fix "Cannot find name 'TrendingUp'" error
  TrendingUp
} from 'lucide-react';
import { User, ViewState } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar as RechartsRadar 
} from 'recharts';
import { runSpecialistDiagnostic, chatWithAgroExpert } from '../services/geminiService';

interface NaturalResourcesProps {
  user: User;
  type: ViewState;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const AG_TYPES = [
  {
    id: 'modern',
    name: 'Modern Agriculture',
    role: 'THE CONTEXT & DRIVER',
    desc: 'The "Agrarian Revolution" shifting from traditional methods to science-driven, data-heavy sharding.',
    domains: ['IOT & AI (REAL-TIME SENSORS)', 'BIOTECH (GENETICS & CRISPR)', 'DIGITAL PLATFORMS (E-COMMERCE)'],
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/5'
  },
  {
    id: 'social',
    name: 'Social Agriculture',
    role: 'THE FOUNDATION',
    desc: 'The sociological study of human-nature interaction. Understanding interdependence before management.',
    domains: ['HISTORICAL & GEOGRAPHICAL', 'CIVIC & ECONOMIC GOVERNANCE', 'SOCIOLOGICAL BEHAVIORS'],
    icon: Users,
    color: 'text-rose-400',
    bg: 'bg-rose-400/5'
  },
  {
    id: 'environmental',
    name: 'Environmental Agriculture',
    role: 'THE STRATEGY',
    desc: 'Proactive mitigation of human impact and enhancement of natural resource resiliency.',
    domains: ['HUMAN IMPACT MITIGATION', 'SUSTAINABLE SOLUTIONS', 'POLITICAL & ETHICAL CONTEXT'],
    icon: Leaf,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/5'
  },
  {
    id: 'health',
    name: 'Health Agriculture',
    role: 'THE OUTCOME',
    desc: 'Integrating practices to enhance the wellbeing of resources and communities as a single system.',
    domains: ['EPIDEMIOLOGY & BIO-SCIENCE', 'HEALTHCARE DELIVERY SYSTEMS', 'INFORMATICS & TREND ANALYSIS'],
    icon: Heart,
    color: 'text-teal-400',
    bg: 'bg-teal-400/5'
  }
];

const LIVESTOCK_OPTIMIZATION_NODES = [
  { id: 'L-882', name: 'Dairy Herd Alpha', type: 'Cattle', optimization: 94, health: 98, thrust: 'Industry', stress: 12, cost: 45 },
  { id: 'L-104', name: 'Bantu Caprine Shard', type: 'Goats', optimization: 82, health: 91, thrust: 'Heritage', stress: 24, cost: 25 },
  { id: 'L-042', name: 'Avian Ingest Hub', type: 'Poultry', optimization: 99, health: 95, thrust: 'Technological', stress: 8, cost: 60 },
];

const CROP_PRODUCTION_NODES = [
  { id: 'CP-001', name: 'Vertical Lettuce Stack', variety: 'Iceberg v4', efficiency: 96, resonance: 0.92, thrust: 'Technological', hydration: 98, harvestEta: '4d' },
  { id: 'CP-442', name: 'Heritage Maize Corridor', variety: 'Bantu Sun-Grain', efficiency: 84, resonance: 0.98, thrust: 'Societal', hydration: 72, harvestEta: '12w' },
  { id: 'CP-882', name: 'Precision Berry Hub', variety: 'Ruby Shard', efficiency: 91, resonance: 0.84, thrust: 'Environmental', hydration: 89, harvestEta: '2w' },
];

const CONSERVATION_THEORIES = [
  { id: 'CT-1', name: 'Island Biogeography Sharding', desc: 'Predicting species richness in fragmented agrarian patches.', method: 'Habitat Corridor Linking' },
  { id: 'CT-2', name: 'Keystone Consensus Protocol', desc: 'Prioritizing nodes that stabilize the regional m-constant.', method: 'Biometric Shielding' },
  { id: 'CT-3', name: 'Bio-Acoustic Metadata Census', desc: 'Non-invasive tracking via 432Hz ambient frequency analysis.', method: 'Sonic Oracle Tracking' },
];

const NaturalResources: React.FC<NaturalResourcesProps> = ({ user, type, onEarnEAC, onSpendEAC }) => {
  const [activeInternalTab, setActiveInternalTab] = useState<'overview' | 'livestock' | 'conservation' | 'crops' | 'botany'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeThrust, setActiveThrust] = useState<string | null>(null);
  const [selectedThrustForAnalysis, setSelectedThrustForAnalysis] = useState<any>(null);
  const [isAnalyzingImpact, setIsAnalyzingImpact] = useState(false);
  const [impactResult, setImpactResult] = useState<string | null>(null);

  // Livestock Diagnostics
  const [selectedHerd, setSelectedHerd] = useState(LIVESTOCK_OPTIMIZATION_NODES[0]);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);

  // Crop Optimization
  const [selectedCrop, setSelectedCrop] = useState(CROP_PRODUCTION_NODES[0]);
  const [isOptimizingCrop, setIsOptimizingCrop] = useState(false);
  const [cropOptimizationShard, setCropOptimizationShard] = useState<string | null>(null);

  // Conservation Simulation
  const [isSimulatingWild, setIsSimulatingWild] = useState(false);
  const [wildResult, setWildResult] = useState<string | null>(null);
  const [selectedTheory, setSelectedTheory] = useState(CONSERVATION_THEORIES[0]);

  const getContent = () => {
    switch (type) {
      case 'animal_world':
        return {
          title: 'Animal World',
          icon: PawPrint,
          color: 'text-amber-500',
          bg: 'bg-amber-500/5',
          border: 'border-amber-500/20',
          formula: 'ASE = (P * S) / H_stress',
          philosophy: 'Animal-Social Equilibrium (ASE). Livestock as independent economic nodes.',
          context: 'Focus on animal socialism, psychological load monitoring, and production sharding.',
          thrust: 'Societal & Human',
          metrics: [
            { label: 'Herd Socialism', val: '92%', icon: Users },
            { label: 'Neural Psychology', val: '0.84', icon: Brain },
            { label: 'Metabolic Ingest', val: '98%', icon: Activity },
          ]
        };
      case 'plants_world':
        return {
          title: 'Plants World',
          icon: TreePine,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/5',
          border: 'border-emerald-500/20',
          formula: 'P_res = ∫(E_human * Ca) dt',
          philosophy: 'Phyto-Psychological Resonance (PPR). Lineage-based Engagement.',
          context: 'Mapping plant socialism and the psychological resonance of human engagement.',
          thrust: 'Environmental & Human',
          metrics: [
            { label: 'Growth Resilience', val: '1.42x', icon: Target },
            { label: 'Steward Sync', val: '99%', icon: Heart },
            { label: 'DNA Shard Integrity', val: '100%', icon: Binary },
          ]
        };
      case 'aqua_portal':
        return {
          title: 'Aqua Portal',
          icon: Droplets,
          color: 'text-blue-500',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/20',
          formula: 'W_eff = m * sqrt(V_storage / D_loss)',
          philosophy: 'Hydraulic Integrity Protocol. Precision Moisture Ingest Sharding.',
          context: 'Essential water management, purity sharding, and flow velocity monitoring.',
          thrust: 'Environmental & Technical',
          metrics: [
            { label: 'Flow Velocity', val: '12 L/s', icon: Gauge },
            { label: 'Purity Constant', val: '0.98', icon: FlaskConical },
            { label: 'Storage Shard', val: '84%', icon: Database },
          ]
        };
      case 'soil_portal':
        return {
          title: 'Soil Portal',
          icon: Mountain,
          color: 'text-orange-500',
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/20',
          formula: 'S_health = Ca * τ_regen',
          philosophy: 'Biometric Substrate Sharding. Soil DNA Sequencing and Purity Audits.',
          context: 'Core soil management, regenerative tilling, and organic shard tracking.',
          thrust: 'Environmental & Technical',
          metrics: [
            { label: 'Organic Shard', val: '6.2%', icon: Sprout },
            { label: 'Mineral Stability', val: '94%', icon: Layers },
            { label: 'Thermal Depth', val: '22°C', icon: Thermometer },
          ]
        };
      case 'air_portal':
        return {
          title: 'Air Portal',
          icon: Wind,
          color: 'text-sky-400',
          bg: 'bg-sky-400/5',
          border: 'border-sky-400/20',
          formula: 'A_purity = 1 - (SID_load / O2)',
          philosophy: 'Atmospheric Carbon Sharding. Gaseous Transparency & Spectral Audits.',
          context: 'Atmospheric management, carbon sequestration mapping, and oxygen saturation.',
          thrust: 'Environmental & Industry',
          metrics: [
            { label: 'Oxygen Saturation', val: '21.4%', icon: Activity },
            { label: 'Carbon Shard Density', val: '412 ppm', icon: Binary },
            { label: 'Acoustic Clarity', val: '99%', icon: Waves },
          ]
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      onEarnEAC(15, `RESOURCE_AUDIT_${type.toUpperCase()}`);
    }, 2000);
  };

  const handleAnalyzeImpact = async (thrust: any) => {
    if (!onSpendEAC(50, `IMPACT_ANALYSIS_${thrust.id.toUpperCase()}`)) return;
    setIsAnalyzingImpact(true);
    setSelectedThrustForAnalysis(thrust);
    setImpactResult(null);
    try {
      const prompt = `EnvirosAgro Impact Analysis: ${content.title} within ${thrust.name}. Evaluate sustainability delta.`;
      const response = await chatWithAgroExpert(prompt, []);
      setImpactResult(response.text);
    } catch (err) {
      alert("Analysis Node Timeout.");
    } finally {
      setIsAnalyzingImpact(false);
    }
  };

  const handleHerdDiagnostic = async () => {
    if (!onSpendEAC(30, `HERD_DIAGNOSTIC_${selectedHerd.id}`)) return;
    setIsRunningDiagnostic(true);
    setDiagnosticReport(null);
    try {
      const prompt = `Act as an EnvirosAgro Livestock Optimization Oracle. Analyze Herd Shard ${selectedHerd.name} (${selectedHerd.type}). 
      Optimization: ${selectedHerd.optimization}%
      Health: ${selectedHerd.health}%
      Stress Index: ${selectedHerd.stress}
      Formula: ${content.formula}
      
      Provide a technical report on:
      1. Feed Conversion Optimization (FCR)
      2. Social Herd Balancing Shards
      3. m-Constant Stability Prediction.`;
      const response = await chatWithAgroExpert(prompt, []);
      setDiagnosticReport(response.text);
    } catch (e) {
      setDiagnosticReport("Handshake Failure: Diagnostic buffer exceeded.");
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const handleCropOptimization = async () => {
    if (!onSpendEAC(35, `CROP_OPTIMIZATION_${selectedCrop.id}`)) return;
    setIsOptimizingCrop(true);
    setCropOptimizationShard(null);
    try {
      const prompt = `Act as an EnvirosAgro Crop Production Specialist. Analyze Crop Shard: ${selectedCrop.name} (${selectedCrop.variety}).
      Efficiency: ${selectedCrop.efficiency}%
      Hydration: ${selectedCrop.hydration}%
      Resonance (P_res): ${selectedCrop.resonance}
      Formula: P_res = ∫(E_human * Ca) dt
      
      Tasks:
      1. Calculate the 'Optimization Delta' required for 100% efficiency.
      2. Provide a technical hydration and nutrient sharding schedule.
      3. Recommend 'Companion Shards' to improve Phyto-Psychological Resonance.`;
      const res = await chatWithAgroExpert(prompt, []);
      setCropOptimizationShard(res.text);
    } catch (e) {
      setCropOptimizationShard("Oracle Handshake Failure: Registry congestion prevented full synthesis.");
    } finally {
      setIsOptimizingCrop(false);
    }
  };

  const handleConservationSim = async () => {
    if (!onSpendEAC(40, `WILD_CONSERVATION_SIM_${selectedTheory.id}`)) return;
    setIsSimulatingWild(true);
    setWildResult(null);
    try {
      const prompt = `EnvirosAgro Wild Conservation Simulator. Execute Theory: ${selectedTheory.name}.
      Technique: ${selectedTheory.method}.
      Context: ${content.title}.
      Provide species richness projections and registry anchor requirements.`;
      const response = await chatWithAgroExpert(prompt, []);
      setWildResult(response.text);
    } catch (e) {
      setWildResult("Simulation interrupted by registry load.");
    } finally {
      setIsSimulatingWild(false);
    }
  };

  const stats = [
    { label: 'Species Tracked', val: '1,284', icon: PawPrint, col: 'text-amber-500' },
    { label: 'Flora Protected', val: '42K Shards', icon: TreePine, col: 'text-emerald-500' },
    { label: 'Eco-Credits Earned', val: '8.4K EAC', icon: Zap, col: 'text-blue-400' },
    { label: 'Wildlife Integrity', val: '92%', icon: TrendingUp, col: 'text-indigo-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4 md:px-0">
      
      {/* Resource Hero */}
      <div className={`glass-card p-10 md:p-16 rounded-[64px] border ${content.border} ${content.bg} relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl transition-all duration-500`}>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <content.icon size={400} />
         </div>
         
         <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[48px] md:rounded-[64px] ${content.bg} border-2 ${content.border} flex items-center justify-center shadow-3xl shrink-0 group-hover:scale-105 transition-all duration-700 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <content.icon className={`w-16 h-16 md:w-24 md:h-24 ${content.color} relative z-10`} />
         </div>

         <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
            <div className="space-y-2">
               <span className={`px-4 py-1.5 bg-white/5 ${content.color} text-[10px] font-black uppercase rounded-full tracking-[0.4em] border ${content.border}`}>
                  {type.replace('_', ' ')} Registry v5.0
               </span>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">
                  {content.title} <span className={content.color}>Portal</span>
               </h2>
            </div>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic">
               "{content.philosophy}"
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <button 
                onClick={handleAudit}
                disabled={isAuditing}
                className={`px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50`}
               >
                  {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {isAuditing ? 'Auditing Registry...' : 'Initialize Portal Audit'}
               </button>
               <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 font-mono text-lg flex items-center gap-4 group cursor-help">
                  <Binary size={20} className={`${content.color} group-hover:scale-110 transition-transform`} />
                  {content.formula}
               </div>
            </div>
         </div>
      </div>

      {/* Internal Portal Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'overview', label: 'Ecosystem Overview', icon: Globe },
          ...(type === 'animal_world' ? [
            { id: 'livestock', label: 'Livestock Optimization', icon: Bone },
            { id: 'conservation', label: 'Wild Conservancy', icon: Binoculars },
          ] : type === 'plants_world' ? [
            { id: 'crops', label: 'Crop Production', icon: Wheat },
            { id: 'botany', label: 'Botanical Science', icon: FlaskConical },
          ] : [])
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveInternalTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {activeInternalTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-4">
             <div className="lg:col-span-2 space-y-12">
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                          <Gauge className={content.color} /> Essential <span className={content.color}>Sub-Shards</span>
                       </h3>
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">EOS_RESOURCE_V5.0</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {content.metrics.map(metric => (
                         <div key={metric.label} className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-6 group hover:border-emerald-500/20 transition-all shadow-xl">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                               <metric.icon className={`w-8 h-8 ${content.color}`} />
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">{metric.label}</p>
                               <p className="text-4xl font-mono font-black text-white tracking-tighter leading-none">{metric.val}</p>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <div className={`h-full ${content.color.replace('text', 'bg')} animate-pulse`} style={{ width: '85%' }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="flex items-center gap-4 px-4 py-8">
                       <div className="flex items-center gap-3">
                          <Link2 className="w-6 h-6 text-indigo-400 rotate-45" />
                          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic m-0">
                             EnvirosAgro™ <span className="text-indigo-400 block ml-10 -mt-2">Thrust Architecture</span>
                          </h2>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {AG_TYPES.map(thrust => (
                          <div 
                            key={thrust.id}
                            onMouseEnter={() => setActiveThrust(thrust.id)}
                            onMouseLeave={() => setActiveThrust(null)}
                            className={`p-10 glass-card rounded-[48px] border-2 transition-all duration-500 group flex flex-col justify-between ${activeThrust === thrust.id ? 'bg-black border-indigo-500/40 shadow-2xl scale-[1.02]' : 'bg-black/40 border-white/5'}`}
                          >
                             <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                   <div className={`w-14 h-14 rounded-2xl ${thrust.bg} flex items-center justify-center border border-white/5 shadow-xl transition-transform group-hover:rotate-6`}>
                                      <thrust.icon className={`w-7 h-7 ${thrust.color}`} />
                                   </div>
                                   <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-mono">TYPE: {thrust.id.toUpperCase()}</span>
                                </div>
                                <div>
                                   <h4 className={`text-2xl font-black uppercase tracking-tight italic ${thrust.color} m-0`}>{thrust.name}</h4>
                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">{thrust.role}</p>
                                </div>
                                <p className="text-sm text-slate-400 italic leading-relaxed opacity-80 group-hover:opacity-100">"{thrust.desc}"</p>
                                
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">KEY DOMAINS</p>
                                   <div className="space-y-3">
                                      {thrust.domains.map(domain => (
                                         <div key={domain} className="flex items-center gap-3">
                                            <Circle className="w-2.5 h-2.5 text-slate-700" strokeWidth={3} />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{domain}</span>
                                         </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                             <button 
                              onClick={() => handleAnalyzeImpact(thrust)}
                              className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-emerald-600/10 hover:text-emerald-400 hover:border-emerald-500/20 transition-all active:scale-95 shadow-xl"
                             >
                              ANALYZE {content.title.toUpperCase()} IMPACT
                             </button>
                          </div>
                       ))}
                    </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot className="w-48 h-48 text-indigo-400" /></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 shadow-2xl">
                         <Bot className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Oracle <span className="text-indigo-400">Context</span></h4>
                   </div>
                   <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/40 pl-8 relative z-10 font-medium">
                      "Strategic analysis suggests a <span className={content.color}>14% surplus</span> in {content.title} sharding. {content.context}"
                   </p>
                   <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4 relative z-10">
                      <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3 h-3" /> SEHTI Integration</h5>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                         The **{content.thrust}** thrusts are primary drivers for {content.title} management. Ensure your node matches the global resonance baseline.
                      </p>
                   </div>
                   <button className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 relative z-10 active:scale-95 transition-all">
                      <Zap className="w-4 h-4 fill-current" /> Run Remediation Protocol
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* --- CROP PRODUCTION SECTION --- */}
        {activeInternalTab === 'crops' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-8 shadow-2xl">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Active <span className="text-emerald-500">Crops</span></h3>
                   <div className="space-y-4">
                      {CROP_PRODUCTION_NODES.map(crop => (
                        <button 
                          key={crop.id}
                          onClick={() => setSelectedCrop(crop)}
                          className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedCrop.id === crop.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                        >
                           <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-black/40 border border-white/5"><Wheat size={18} /></div>
                              <div className="text-left">
                                 <span className="text-sm font-black uppercase block leading-none">{crop.name}</span>
                                 <span className="text-[10px] font-mono opacity-50 uppercase">{crop.variety}</span>
                              </div>
                           </div>
                           <ChevronRight className={`w-5 h-5 transition-transform ${selectedCrop.id === crop.id ? 'rotate-90' : ''}`} />
                        </button>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-xl">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Yield Optimization
                   </h4>
                   <div className="space-y-6">
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Production Efficiency</p>
                         <p className="text-4xl font-mono font-black text-white">{selectedCrop.efficiency}%</p>
                      </div>
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                         <p className="text-[9px] text-slate-500 font-black uppercase mb-1">PPR Sync Index</p>
                         <p className="text-4xl font-mono font-black text-emerald-400">{selectedCrop.resonance}</p>
                      </div>
                   </div>
                   <button 
                    onClick={handleCropOptimization}
                    disabled={isOptimizingCrop}
                    className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                   >
                      {isOptimizingCrop ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      {isOptimizingCrop ? 'OPTIMIZING SHARD...' : 'Initialize Yield Scan'}
                   </button>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[700px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4 text-emerald-500">
                         <Terminal className="w-6 h-6" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Crop Performance Terminal</span>
                      </div>
                      {cropOptimizationShard && <button onClick={() => setCropOptimizationShard(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>}
                   </div>
                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                      {isOptimizingCrop ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 bg-black/60 backdrop-blur-md z-20">
                           <div className="relative">
                              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Sprout className="w-10 h-10 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="text-center space-y-4">
                              <p className="text-emerald-500 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING PHOTOSYNTHESIS...</p>
                              <p className="text-[10px] text-slate-700 font-mono">PPR_SYNC_INIT // CALIBRATING_Ca</p>
                           </div>
                        </div>
                      ) : cropOptimizationShard ? (
                        <div className="animate-in slide-in-from-bottom-10 duration-700">
                           <div className="p-12 md:p-16 bg-black/60 rounded-[64px] border border-emerald-500/20 border-l-8 shadow-inner relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Wheat size={400} className="text-white" /></div>
                              <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-8">
                                 {cropOptimizationShard}
                              </div>
                           </div>
                           <div className="flex justify-center mt-12 gap-6">
                              <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">ANCHOR OPTIMIZATION SHARD</button>
                              <button className="p-8 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all"><Download size={24} /></button>
                           </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                           <Wheat size={120} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                           <div className="space-y-2">
                              <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">CROP ORACLE STANDBY</p>
                              <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Select Crop Node to Forge Optimization Shard</p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- BOTANICAL SCIENCE SECTION --- */}
        {activeInternalTab === 'botany' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col shadow-3xl h-full">
                   <div className="flex justify-between items-center mb-12 relative z-10">
                      <div className="flex items-center gap-6">
                         <div className="p-5 rounded-[28px] bg-emerald-600 shadow-3xl text-white"><FlaskConical size={32} /></div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Phyto-Science <span className="text-emerald-400">Laboratory</span></h3>
                      </div>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-center">
                         <p className="text-[8px] text-slate-500 font-black uppercase mb-1">PPR Stability</p>
                         <p className="text-xl font-mono font-black text-emerald-400">0.98x</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                      <div className="space-y-10">
                         <h4 className="text-xl font-black text-white uppercase italic">Active <span className="text-emerald-400">Experiments</span></h4>
                         <div className="space-y-6">
                            {[
                               { t: 'DNA Purity Sequencer', d: 'Validating Lineage seed code C(a) integrity.', p: 85, c: 'text-indigo-400' },
                               { t: 'Thermal Flux Analysis', d: 'Modeling crop stress under SID-load heat drift.', p: 42, c: 'text-rose-400' },
                               { t: 'Bio-Resonance Bridge', d: 'Syncing plant frequencies with HQ registry.', p: 12, c: 'text-blue-400' },
                            ].map((exp, i) => (
                               <div key={i} className="p-6 bg-black/40 rounded-[32px] border border-white/5 space-y-4 group hover:border-emerald-500/40 transition-all">
                                  <div className="flex justify-between items-center">
                                     <h5 className="text-sm font-black text-white uppercase">{exp.t}</h5>
                                     <span className="text-[10px] font-mono text-emerald-400 font-black">{exp.p}%</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 italic">"{exp.d}"</p>
                                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${exp.p}%` }}></div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="glass-card rounded-[48px] bg-black/60 border border-white/10 p-10 flex flex-col justify-between shadow-inner">
                         <div className="space-y-8">
                            <div className="flex items-center gap-4">
                               <Microscope className="text-emerald-400" />
                               <h4 className="text-xl font-black text-white uppercase italic">Lab Oracle</h4>
                            </div>
                            <p className="text-slate-400 text-sm italic leading-relaxed">
                               "Botanical sharding suggests that **{selectedCrop.variety}** is exhibiting a 14% drift in its growth resonance. Advise initiating a spectrum recalibration in the local node."
                            </p>
                         </div>
                         <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-emerald-600 transition-all shadow-xl">RUN MOLECULAR AUDIT</button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl">
                      <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                         <Dna className="w-6 h-6 text-indigo-400" /> Genetic Shards
                      </h4>
                      <div className="space-y-4">
                         {[
                           { l: 'Phenotype Lock', v: '99%', icon: Lock },
                           { l: 'Yield Scalar', v: '1.42x', icon: TrendingUp },
                           { l: 'Drought Shard', v: 'V4.2', icon: Binary },
                         ].map((m, i) => (
                            <div key={i} className="p-6 bg-black/60 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-indigo-500/40 transition-all">
                               <div className="flex items-center gap-4">
                                  <m.icon className="text-indigo-400" size={18} />
                                  <span className="text-[10px] font-black text-slate-500 uppercase">{m.l}</span>
                               </div>
                               <span className="text-lg font-mono font-black text-white">{m.v}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: LIVESTOCK OPTIMIZATION */}
        {activeInternalTab === 'livestock' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-black/40 space-y-8 shadow-2xl">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Herd <span className="text-amber-500">Inventory</span></h3>
                <div className="space-y-4">
                  {LIVESTOCK_OPTIMIZATION_NODES.map(herd => (
                    <button 
                      key={herd.id}
                      onClick={() => setSelectedHerd(herd)}
                      className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedHerd.id === herd.id ? 'bg-amber-600/10 border-amber-500 text-amber-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5"><Bone size={18} /></div>
                        <div className="text-left">
                          <span className="text-sm font-black uppercase block leading-none">{herd.name}</span>
                          <span className="text-[10px] font-mono opacity-50 uppercase">{herd.type} NODE</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${selectedHerd.id === herd.id ? 'rotate-90' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-10 rounded-[56px] border-amber-500/20 bg-amber-500/5 space-y-8 shadow-xl">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" /> Optimization Dashboard
                 </h4>
                 <div className="space-y-6">
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Production Efficiency</p>
                       <p className="text-4xl font-mono font-black text-white">{selectedHerd.optimization}%</p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Steward Psychology Sync</p>
                       <p className="text-4xl font-mono font-black text-amber-500">0.84</p>
                    </div>
                 </div>
                 <button 
                  onClick={handleHerdDiagnostic}
                  disabled={isRunningDiagnostic}
                  className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                 >
                    {isRunningDiagnostic ? <Loader2 className="w-5 h-5 animate-spin" /> : <Microscope className="w-5 h-5" />}
                    {isRunningDiagnostic ? 'SEQUENCING HERD...' : 'Run Optimization Scan'}
                 </button>
              </div>
            </div>

            <div className="lg:col-span-8">
               <div className="glass-card rounded-[64px] min-h-[700px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                  <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                     <div className="flex items-center gap-4 text-amber-500">
                        <Terminal className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Herd Optimization Terminal</span>
                     </div>
                     {diagnosticReport && <button onClick={() => setDiagnosticReport(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>}
                  </div>
                  <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                    {isRunningDiagnostic ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 bg-black/60 backdrop-blur-md z-20">
                         <div className="relative">
                            <Loader2 className="w-24 h-24 text-amber-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Bone className="w-10 h-10 text-amber-400 animate-pulse" />
                            </div>
                         </div>
                         <div className="text-center space-y-4">
                            <p className="text-amber-500 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING NEURAL RESPONSES...</p>
                            <p className="text-[10px] text-slate-700 font-mono">ASE_SYNC_OK // CALCULATING_LOAD</p>
                         </div>
                      </div>
                    ) : diagnosticReport ? (
                      <div className="animate-in slide-in-from-bottom-10 duration-700">
                         <div className="p-12 md:p-16 bg-black/60 rounded-[64px] border border-amber-500/20 border-l-8 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><ShieldCheck size={400} className="text-white" /></div>
                            <div className="prose prose-invert prose-amber max-w-none text-slate-300 text-xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-8">
                               {diagnosticReport}
                            </div>
                         </div>
                         <div className="flex justify-center mt-12 gap-6">
                            <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">ANCHOR OPTIMIZATION SHARD</button>
                            <button className="p-8 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all"><Download size={24} /></button>
                         </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                         <Activity size={120} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
                         <div className="space-y-2">
                            <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">ORACLE STANDBY</p>
                            <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Select Herd Shard to Initialize Analysis</p>
                         </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- WILD CONSERVANCY SECTION --- */}
        {activeInternalTab === 'conservation' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col shadow-3xl group h-full">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><Binoculars size={400} /></div>
                <div className="flex justify-between items-center mb-12 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="p-5 rounded-[28px] bg-emerald-600 shadow-3xl text-white"><Binoculars size={32} /></div>
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Wild <span className="text-emerald-400">Conservancy Lab</span></h3>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                   <div className="space-y-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Select Conservation Theory</label>
                         <div className="space-y-4">
                            {CONSERVATION_THEORIES.map(theory => (
                               <button 
                                  key={theory.id}
                                  onClick={() => setSelectedTheory(theory)}
                                  className={`w-full p-6 rounded-[32px] border text-left transition-all group/theory ${selectedTheory.id === theory.id ? 'bg-emerald-600 border-emerald-500 shadow-xl scale-[1.02]' : 'bg-black/60 border-white/10 hover:bg-white/5'}`}
                               >
                                  <h5 className={`text-xl font-black uppercase italic ${selectedTheory.id === theory.id ? 'text-white' : 'text-slate-400 group-hover/theory:text-white'}`}>{theory.name}</h5>
                                  <p className={`text-[10px] mt-2 font-medium italic ${selectedTheory.id === theory.id ? 'text-emerald-100' : 'text-slate-600'}`}>"{theory.desc}"</p>
                               </button>
                            ))}
                         </div>
                      </div>
                      <button 
                        onClick={handleConservationSim}
                        disabled={isSimulatingWild}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                      >
                         {isSimulatingWild ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {isSimulatingWild ? 'SIMULATING OUTCOMES...' : 'INITIALIZE THEORY SIM'}
                      </button>
                   </div>

                   <div className="glass-card rounded-[48px] bg-black/60 border border-white/10 p-10 flex flex-col justify-between shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><SearchCode size={200} /></div>
                      <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <Microscope className="text-emerald-400" />
                           <h4 className="text-xl font-black text-white uppercase italic">Theory Results</h4>
                        </div>
                        <div className="prose prose-invert prose-emerald max-w-none text-slate-400 text-sm italic leading-relaxed custom-scrollbar overflow-y-auto max-h-[300px]">
                           {isSimulatingWild ? (
                              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                 <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                 <p className="text-emerald-600 font-bold uppercase tracking-[0.3em] animate-pulse">Consulting Wild Oracle...</p>
                              </div>
                           ) : wildResult ? (
                              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 whitespace-pre-line">
                                 {wildResult}
                              </div>
                           ) : (
                              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center space-y-6">
                                 <Globe size={48} className="text-white" />
                                 <p className="uppercase tracking-widest font-black text-white">Select a theory to model ecological impacts.</p>
                              </div>
                           )}
                        </div>
                      </div>
                      <div className="pt-8 border-t border-white/5 relative z-10">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                            <span>Registry Finality</span>
                            <span className="text-emerald-400">UNANCHORED</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-950/10 space-y-8 shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                       <MapPin className="w-6 h-6 text-indigo-400" /> Conservancy Sharding
                    </h4>
                    <div className="space-y-4">
                       {[
                         { l: 'Habitat Sharding', v: '94%', icon: Layers },
                         { l: 'Species Consensus', v: '82%', icon: Users },
                         { l: 'Genetic Flow', v: '78%', icon: Dna },
                       ].map((m, i) => (
                          <div key={i} className="p-6 bg-black/60 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-indigo-500/40 transition-all">
                             <div className="flex items-center gap-4">
                                <m.icon className="text-indigo-400" size={18} />
                                <span className="text-[10px] font-black text-slate-500 uppercase">{m.l}</span>
                             </div>
                             <span className="text-lg font-mono font-black text-white">{m.v}</span>
                          </div>
                       ))}
                    </div>
                    <button className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                       Vouch Regional Biodiversity
                    </button>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-6 group shadow-lg h-fit">
                    <div className="flex items-center gap-4">
                       <Bot className="w-8 h-8 text-emerald-400" />
                       <h4 className="text-xs font-black text-white uppercase tracking-widest">Wild Oracle Insight</h4>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-emerald-500/20 pl-4">
                       "Current species richness in Northern Savannah is 14% below registry expectations. Advise implementing Theory CT-1 immediately."
                    </p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Impact Analysis Modal */}
      {selectedThrustForAnalysis && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedThrustForAnalysis(null)}></div>
           <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="p-12 md:p-16 space-y-12">
                 <button onClick={() => setSelectedThrustForAnalysis(null)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 <div className="flex items-center gap-8 border-b border-white/5 pb-10">
                    <div className={`w-20 h-20 rounded-[32px] ${selectedThrustForAnalysis.bg} flex items-center justify-center border-2 border-white/5 shadow-2xl`}>
                       <selectedThrustForAnalysis.icon size={40} className={selectedThrustForAnalysis.color} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Impact <span className="text-emerald-400">Analysis</span></h3>
                       <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-3">{content.title} // {selectedThrustForAnalysis.name}</p>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[50vh] pr-4">
                    {isAnalyzingImpact ? (
                       <div className="flex flex-col items-center justify-center py-20 space-y-10 text-center">
                          <div className="relative">
                             <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <SearchCode className="w-6 h-6 text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-emerald-400 font-black text-xl uppercase tracking-[0.6em] animate-pulse italic">Syncing Oracle...</p>
                             <p className="text-slate-600 font-mono text-[10px]">EOS_THRUST_AUDIT_V5.0 // COMMITTING_TO_SHARD</p>
                          </div>
                       </div>
                    ) : impactResult ? (
                       <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                          <div className="p-10 bg-black rounded-[48px] border-l-8 border-emerald-500/40 relative overflow-hidden shadow-inner">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Terminal size={120} /></div>
                             <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l border-white/5 pl-8 font-medium">
                                {impactResult}
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                             <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] text-center space-y-2">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">C(a) Variance</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">+{((Math.random() * 0.5) + 0.1).toFixed(2)}x</p>
                             </div>
                             <div className="p-8 bg-white/5 border border-white/5 rounded-[40px] text-center space-y-2">
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resilience Correlation</p>
                                <p className="text-3xl font-mono font-black text-blue-400">{(Math.random() * 0.9 + 0.1).toFixed(3)}</p>
                             </div>
                          </div>
                       </div>
                    ) : null}
                 </div>

                 {impactResult && (
                    <div className="pt-10 border-t border-white/5 flex gap-6">
                       <button onClick={() => setImpactResult(null)} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">New Audit</button>
                       <button className="flex-[2] py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                          <Download size={16} /> Anchor Analysis Shard
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* FOOTER PERSISTENCE */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Network className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
               <Binary className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Sustainability Framework</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-md">Agriculture is an application of art or science from nature by human beings towards natural resources for sustainability.</p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">WH_IS_AG™ REGISTERED</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter">100%</p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NaturalResources;