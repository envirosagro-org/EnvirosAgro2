import React, { useState } from 'react';
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
  // Added Leaf import to fix line 64 error
  Leaf
} from 'lucide-react';
import { User, ViewState } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar 
} from 'recharts';

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
    role: 'The Context & Driver',
    desc: 'The "Agrarian Revolution" shifting from traditional methods to science-driven, data-heavy sharding.',
    domains: ['IoT & AI (Real-time Sensors)', 'Biotech (Genetics & CRISPR)', 'Digital Platforms (E-Commerce)'],
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/5'
  },
  {
    id: 'social',
    name: 'Social Agriculture',
    role: 'The Foundation',
    desc: 'The sociological study of human-nature interaction. Understanding interdependence before management.',
    domains: ['Historical & Geographical', 'Civic & Economic Governance', 'Sociological Behaviors'],
    icon: Users,
    color: 'text-rose-400',
    bg: 'bg-rose-400/5'
  },
  {
    id: 'environmental',
    name: 'Environmental Agriculture',
    role: 'The Strategy',
    desc: 'Proactive mitigation of human impact and enhancement of natural resource resiliency.',
    domains: ['Human Impact Mitigation', 'Sustainable Solutions', 'Political & Ethical Context'],
    // Fix: Leaf icon correctly imported now
    icon: Leaf,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/5'
  },
  {
    id: 'health',
    name: 'Health Agriculture',
    role: 'The Outcome',
    desc: 'Integrating practices to enhance the wellbeing of resources and communities as a single system.',
    domains: ['Epidemiology & Bio-Science', 'Healthcare Delivery Systems', 'Informatics & Trend Analysis'],
    icon: Heart,
    color: 'text-teal-400',
    bg: 'bg-teal-400/5'
  },
  {
    id: 'technical',
    name: 'Technical Agriculture',
    role: 'The Enabler',
    desc: 'Hard skills bridging biological needs and engineering solutions through applied expertise.',
    domains: ['IT & Cyber (Cloud Computing)', 'Engineering & Trades (Automation)', 'Design & Media Communication'],
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'bg-blue-400/5'
  },
  {
    id: 'industrial',
    name: 'Industrial Agriculture',
    role: 'The Execution',
    desc: 'Responsible transformation of raw materials into finished goods via advanced methodologies.',
    domains: ['Manufacturing & Construction', 'Supply Chain Optimization', 'Waste & Byproduct Management'],
    icon: Factory,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/5'
  }
];

const NaturalResources: React.FC<NaturalResourcesProps> = ({ user, type, onEarnEAC, onSpendEAC }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeThrust, setActiveThrust] = useState<string | null>(null);

  const getContent = () => {
    switch (type) {
      case 'animal_world':
        return {
          title: 'Animal World',
          icon: PawPrint,
          color: 'text-amber-500',
          bg: 'bg-amber-500/5',
          border: 'border-amber-500/20',
          formula: 'A_soc = (P * S) / H_stress',
          philosophy: 'Animal-Social Equilibrium (ASE). Livestock as independent economic nodes.',
          context: 'Focus on animal socialism, psychological load monitoring, and production sharding.',
          // Added thrust property to resolve line 336 error
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
          // Added thrust property to resolve line 336 error
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
          // Added thrust property to resolve line 336 error
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
          // Added thrust property to resolve line 336 error
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
          // Added thrust property to resolve line 336 error
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
      alert(`REGISTRY_SYNC: ${content.title} shard verified. +15 EAC settlement committed.`);
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4 md:px-0">
      
      {/* Resource Hero */}
      <div className={`glass-card p-10 md:p-16 rounded-[64px] border ${content.border} ${content.bg} relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl`}>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s]">
            <content.icon size={400} />
         </div>
         
         <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[48px] md:rounded-[64px] ${content.bg} border-2 ${content.border} flex items-center justify-center shadow-3xl shrink-0 group-hover:scale-105 transition-all duration-700`}>
            <content.icon className={`w-16 h-16 md:w-24 md:h-24 ${content.color}`} />
         </div>

         <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
            <div className="space-y-2">
               <span className={`px-4 py-1.5 bg-white/5 ${content.color} text-[10px] font-black uppercase rounded-full tracking-[0.4em] border ${content.border}`}>
                  {type.replace('_', ' ')} Registry
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
               <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 font-mono text-lg flex items-center gap-4">
                  <Binary size={20} className={content.color} />
                  {content.formula}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Essential Metrics Grid */}
         <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                      <Gauge className={content.color} /> Essential <span className={content.color}>Sub-Shards</span>
                   </h3>
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">EOS_RESOURCE_v5.0</span>
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

            {/* TYPES OF AGRICULTURE FRAMEWORK */}
            <div className="space-y-10">
                <div className="flex items-center justify-between px-4 border-b border-white/5 pb-6">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-widest flex items-center gap-4">
                      <Workflow className="text-indigo-400" /> EnvirosAgro™ <span className="text-indigo-400">Thrust Architecture</span>
                   </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {AG_TYPES.map(thrust => (
                      <div 
                        key={thrust.id}
                        onMouseEnter={() => setActiveThrust(thrust.id)}
                        onMouseLeave={() => setActiveThrust(null)}
                        className={`p-10 glass-card rounded-[48px] border transition-all duration-500 group flex flex-col justify-between ${activeThrust === thrust.id ? 'bg-indigo-950/20 border-indigo-500/40 shadow-2xl scale-[1.02]' : 'bg-black/40 border-white/5'}`}
                      >
                         <div className="space-y-6">
                            <div className="flex justify-between items-start">
                               <div className={`w-14 h-14 rounded-2xl ${thrust.bg} flex items-center justify-center border border-white/5 shadow-xl transition-transform group-hover:rotate-6`}>
                                  <thrust.icon className={`w-7 h-7 ${thrust.color}`} />
                               </div>
                               <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Type: {thrust.id}</span>
                            </div>
                            <div>
                               <h4 className={`text-xl font-black uppercase tracking-tight italic ${thrust.color}`}>{thrust.name}</h4>
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{thrust.role}</p>
                            </div>
                            <p className="text-sm text-slate-400 italic leading-relaxed">"{thrust.desc}"</p>
                            
                            <div className="space-y-3 pt-4 border-t border-white/5">
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Key Domains</p>
                               {thrust.domains.map(domain => (
                                  <div key={domain} className="flex items-center gap-3">
                                     <CheckCircle2 className="w-3 h-3 text-emerald-500 opacity-40" />
                                     <span className="text-[10px] font-medium text-slate-500 uppercase">{domain}</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                         <button className="w-full mt-8 py-3 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:bg-white/10 group-hover:text-white transition-all">Analyze {content.title} Impact</button>
                      </div>
                   ))}
                </div>
            </div>
         </div>

         {/* Side Context & Controls */}
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
                     {/* Fix: Property 'thrust' added to content in getContent() to resolve line 336 error */}
                     The **{content.thrust}** thrusts are primary drivers for {content.title} management. Ensure your node matches the global resonance baseline.
                  </p>
               </div>
               <button className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 relative z-10 active:scale-95 transition-all">
                  <Zap className="w-4 h-4 fill-current" /> Run Remediation Protocol
               </button>
            </div>

            <div className="p-10 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-10 shadow-lg">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5 pb-4">Social Resonance Shards</h4>
               <div className="space-y-6">
                  {[
                     { label: 'Steward Engagement', val: 94 },
                     { label: 'Industrial Vetting', val: 82 },
                     { label: 'Registry Confidence', val: 99 },
                  ].map(r => (
                     <div key={r.label} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-600">
                           <span>{r.label}</span>
                           <span className="text-white">{r.val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <div className={`h-full ${content.color.replace('text', 'bg')} rounded-full`} style={{ width: `${r.val}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-8 glass-card rounded-[40px] border-emerald-500/20 bg-emerald-600/5 flex items-center gap-6 group hover:bg-emerald-600/10 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform"><Sparkles size={20} /></div>
               <p className="text-[10px] text-emerald-300/80 font-black uppercase tracking-widest leading-relaxed">
                  Every interaction with this resource node earns EAC sharding rewards based on **m™ constant** performance and **WhatIsAG™** adherence.
               </p>
            </div>
         </div>
      </div>

      {/* FOOTER PERSISTENCE */}
      <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Network className="w-96 h-96 text-indigo-400" />
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
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

interface DnaIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const DnaIcon: React.FC<DnaIconProps> = ({ size = 24, ...props }) => (
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
    <path d="M2 15c6.667-1.667 13.333-1.667 20 0" />
    <path d="M9 22c1.444-4.222 2.889-8.444 4.333-12.667" />
    <path d="M2 9c6.667 1.667 13.333 1.667 20 0" />
    <path d="M15 2c-1.444 4.222-2.889 8.444-4.333 12.667" />
    <path d="m11.5 6.5 1 1" />
    <path d="m14 11 1 1" />
    <path d="m15.5 16.5 1 1" />
    <path d="m10 18.5-1-1" />
    <path d="m7.5 14-1-1" />
    <path d="m8.5 4 1 1" />
  </svg>
);

export default NaturalResources;