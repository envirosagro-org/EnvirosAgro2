import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Mountain, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Search, 
  PlusCircle, 
  ArrowRight, 
  Loader2, 
  Activity, 
  Target, 
  Heart, 
  Scale, 
  Trees, 
  Sun, 
  CloudRain, 
  Binary, 
  FileText,
  BadgeCheck,
  History,
  Trash2,
  RefreshCw,
  Droplets,
  Microscope,
  BoxSelect,
  User as UserIcon,
  Sprout,
  Wheat,
  Globe,
  TrendingUp,
  ChevronRight,
  Circle,
  Download,
  Users,
  Handshake,
  X,
  Stamp,
  Terminal,
  Map as MapIcon,
  Atom,
  Wind,
  Coins,
  Info,
  Flower2,
  Crown,
  Layout,
  Star,
  Wand2,
  ShieldAlert,
  ArrowUpRight,
  Flame,
  CircleDot,
  Fingerprint,
  /* Added missing icon imports to fix compilation errors */
  ClipboardCheck,
  CheckCircle2
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RechartsRadar, Tooltip } from 'recharts';
import { User, ViewState } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface PermacultureProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
}

const ZONE_SHARDS = [
  { id: 0, name: 'Zone 0: Core Node', desc: 'The steward center. Focus on internal efficiency, waste-to-energy cycles, and personal m-constant calibration.', icon: UserIcon, tasks: ['Energy Audit', 'SID Self-Remediation', 'Bio-Inflow Monitor'], color: 'text-indigo-400', theme: 'indigo' },
  { id: 1, name: 'Zone 1: Daily Ingest', desc: 'Intensive care shards. Small-scale kitchen garden modules and high-frequency herb nodes.', icon: Sprout, tasks: ['Compost Ingest', 'Seed Starting', 'Daily Moisture Check'], color: 'text-emerald-400', theme: 'emerald' },
  { id: 2, name: 'Zone 2: Semi-Intensive', desc: 'Perennial orchards and poultry nodes. Seasonal maintenance cycle with medium sharding frequency.', icon: Trees, tasks: ['Orchard Pruning', 'Water Catchment', 'Poultry Sync'], color: 'text-teal-400', theme: 'teal' },
  { id: 3, name: 'Zone 3: Main Crop', desc: 'The industrial core. Large-scale cash crops and pasture sharding for network trade and liquidity.', icon: Wheat, tasks: ['Harvest Ingest', 'Soil Tilling', 'Pest Swarm Scan'], color: 'text-amber-400', theme: 'amber' },
  { id: 4, name: 'Zone 4: Semi-Wild', desc: 'Managed forests and foraged shards. Minimal interference nodes for timber and long-term EAT growth.', icon: Mountain, tasks: ['Timber Audit', 'Wild Ingest', 'Boundary Repair'], color: 'text-blue-400', theme: 'blue' },
  { id: 5, name: 'Zone 5: Wilderness', desc: 'The primary oracle. Observation-only nodes to calibrate local biometrics against planetary resonance.', icon: Globe, tasks: ['Resonance Mapping', 'Wildlife Count', 'Erosion Audit'], color: 'text-slate-400', theme: 'slate' },
];

const LILIES_BLUEPRINTS = [
  { id: 'L-01', name: 'Symmetrical Lily Grid', complexity: 0.92, resonance: 'High', thrust: 'Industry', desc: 'Formal geometric sharding for industrial floral exports.' },
  { id: 'L-02', name: 'Celestial Arc Shard', complexity: 0.84, resonance: 'Extreme', thrust: 'Environmental', desc: 'Planting patterns synchronized with lunar shadow telemetry.' },
  { id: 'L-03', name: 'Fractal Hedge Buffer', complexity: 0.78, resonance: 'Optimal', thrust: 'Technological', desc: 'Self-similar botanical scaffolding for robotic navigation.' },
];

const PERMACULTURE_ETHICS = [
  { id: 'earth', name: 'Earth Care', desc: 'Provisioning resources to ensure biological continuity.', icon: Globe, color: 'text-emerald-400' },
  { id: 'people', name: 'People Care', desc: 'Mitigating SID through equitable social sharding.', icon: Users, color: 'text-blue-400' },
  { id: 'fair', name: 'Fair Share', desc: 'Distributing surplus energy back into the mesh.', icon: Scale, color: 'text-amber-500' },
];

const Permaculture: React.FC<PermacultureProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'zonation' | 'ethics' | 'lilies' | 'companion'>('zonation');
  const [selectedZone, setSelectedZone] = useState(ZONE_SHARDS[1]);
  
  // Forging states
  const [isForging, setIsForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [inputTopic, setInputTopic] = useState('');

  // Companion states
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [companionGuild, setCompanionGuild] = useState<any | null>(null);

  const resilienceData = [
    { thrust: 'Zonation', A: 85 },
    { thrust: 'Cyclicity', A: 72 },
    { thrust: 'Ethical', A: 94 },
    { thrust: 'Aesthetic', A: 88 },
    { thrust: 'Yield', A: 80 },
  ];

  const handleRunForge = async (mode: 'aesthetic' | 'ethical' | 'synergy') => {
    const contextMap = {
      aesthetic: { fee: 40, prompt: "Act as a Lilies Around Botanical Architect. Forge an aesthetic design shard using Symmetry, Celestial Arcs, and Fractal Buffers." },
      ethical: { fee: 25, prompt: "Act as a SEHTI Compliance Officer. Audit this design against Earth Care, People Care, and Fair Share. Provide an ethical sharding report." },
      synergy: { fee: 15, prompt: "Act as a Biological Oracle. Find plant companions for the following crop to maximize C(a) and minimize S (Stress)." }
    };

    const config = contextMap[mode];
    if (!inputTopic.trim() && mode !== 'synergy') return;
    if (mode === 'synergy' && !primaryCrop.trim()) return;

    if (!await onSpendEAC(config.fee, `PERMACULTURE_${mode.toUpperCase()}_FORGE`)) return;

    setIsForging(true);
    setForgeResult(null);
    setCompanionGuild(null);

    try {
      const topic = mode === 'synergy' ? primaryCrop : inputTopic;
      const res = await chatWithAgroExpert(`${config.prompt} Target: "${topic}".`, []);
      
      if (mode === 'synergy') setCompanionGuild(res.text);
      else setForgeResult(res.text);
      
      onEarnEAC(config.fee / 2, `FORGE_CONTRIBUTION_${mode.toUpperCase()}`);
    } catch (e) {
      setForgeResult("Oracle consensus failure. Shard lost in buffer.");
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto px-4">
      
      {/* 1. Portal Hero HUD */}
      <div className="glass-card p-12 md:p-16 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Compass className="w-[600px] h-[600px] text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Compass className="w-20 h-20 text-white animate-spin-slow relative z-10" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
            <div className="space-y-2">
               <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-2">
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">PERMACULTURE_DESIGN_NODE</span>
                  <span className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-fuchsia-500/20 shadow-inner">LILIES_AROUND_CERTIFIED</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Design <span className="text-emerald-400">Resilience</span></h2>
            </div>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
               "Designing productive agricultural shards that mimic natural planetary resonance. Integrating Lilies Around aesthetic protocols for botanical architecture."
            </p>
         </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-6 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'zonation', label: 'Zonation Shards', icon: Layers },
          { id: 'lilies', label: 'Lilies Around', icon: Flower2 },
          { id: 'ethics', label: 'Ethical Forge', icon: Scale },
          { id: 'companion', label: 'Companion Oracle', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); setForgeResult(null); setInputTopic(''); }}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105 ring-4 ring-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] relative z-10">
        
        {/* --- VIEW: ZONATION SHARDS --- */}
        {activeTab === 'zonation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                         <Layers size={24} />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Zonation <span className="text-emerald-400">Registry</span></h3>
                   </div>
                   <div className="space-y-4">
                      {ZONE_SHARDS.map(zone => (
                        <button 
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedZone.id === zone.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-xl scale-105' : 'bg-black/40 border-white/5 text-slate-500 hover:border-emerald-500/20'}`}
                        >
                           <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl transition-all ${selectedZone.id === zone.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white/5 group-hover:rotate-6'} ${zone.color}`}><zone.icon size={24} /></div>
                              <span className="text-lg font-black uppercase text-white tracking-tight italic">{zone.name}</span>
                           </div>
                           <ChevronRight className={`w-6 h-6 transition-transform ${selectedZone.id === zone.id ? 'rotate-90 text-emerald-400' : 'text-slate-800'}`} />
                        </button>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 relative z-10">RESILIENCE_RADAR_MAP</h4>
                   <div className="h-72 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resilienceData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="thrust" stroke="#64748b" fontSize={10} fontStyle="italic" />
                            <RechartsRadar name="Resilience" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,185,129,0.2)', borderRadius: '16px' }} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/20 h-full flex flex-col relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.04] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                      <selectedZone.icon size={600} className={selectedZone.color} />
                   </div>
                   
                   <div className="relative z-10 space-y-16">
                      <div className="space-y-6">
                         <span className={`px-5 py-2 bg-white/5 ${selectedZone.color} text-[11px] font-black uppercase rounded-full border border-white/10 tracking-widest shadow-inner`}>ZONE_DETAIL_SHARD_0{selectedZone.id}</span>
                         <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">{selectedZone.name}</h3>
                         <p className="text-slate-400 text-2xl font-medium italic max-w-2xl leading-relaxed border-l-4 border-white/10 pl-10">"{selectedZone.desc}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-8 shadow-inner group/tasks hover:border-emerald-500/20 transition-all">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <Target size={16} className="text-emerald-400" /> Maintenance Shards
                            </h5>
                            <div className="space-y-4">
                               {selectedZone.tasks.map((task, i) => (
                                  <div key={i} className="flex items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 group-hover/tasks:bg-emerald-600/5 transition-all cursor-pointer">
                                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                                     <span className="text-sm font-black text-slate-300 uppercase italic tracking-tight">{task}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-10 bg-black/60 rounded-[56px] border border-white/5 space-y-10 shadow-inner text-white">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-4 px-2">
                               <History size={16} className="text-indigo-400" /> Zone Telemetry
                            </h5>
                            <div className="space-y-8">
                               {[
                                  { l: 'Visit Frequency', v: selectedZone.id === 0 ? 'CONSTANT' : selectedZone.id === 1 ? 'DAILY' : selectedZone.id === 3 ? 'WEEKLY' : 'SEASONAL', p: 100 - (selectedZone.id * 15) },
                                  { l: 'Industrial Yield', v: selectedZone.id === 3 ? 'PEAK' : 'STABLE', p: 60 + Math.random() * 30 },
                               ].map(m => (
                                  <div key={m.l} className="space-y-3">
                                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-600">{m.l}</span>
                                        <span className="text-white font-mono">{m.v}</span>
                                     </div>
                                     <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${m.p}%` }}></div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                         <button className="flex-1 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border border-white/10">
                            <MapIcon size={20} /> SYNC GEOFENCE
                         </button>
                         <button className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all shadow-xl group/down">
                            <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: LILIES AROUND --- */}
        {activeTab === 'lilies' && (
           <div className="space-y-12 animate-in zoom-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {LILIES_BLUEPRINTS.map(bp => (
                    <div key={bp.id} className="glass-card p-10 rounded-[56px] border-2 border-white/5 hover:border-fuchsia-500/40 transition-all group flex flex-col justify-between h-[480px] bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[10s]"><Flower2 size={250} className="text-fuchsia-400" /></div>
                       <div className="space-y-8 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="p-5 rounded-3xl bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 shadow-xl group-hover:rotate-6 transition-all">
                                <Layout size={32} />
                             </div>
                             <div className="text-right">
                                <span className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-black uppercase rounded-full border border-fuchsia-500/20 tracking-widest">AESTHETIC_SHARD</span>
                                <p className="text-[10px] text-slate-700 font-mono mt-4 font-black uppercase">{bp.id}</p>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-fuchsia-400 transition-colors">{bp.name}</h4>
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">Pillar Anchor: {bp.thrust}</p>
                          </div>
                          <p className="text-slate-400 text-base leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{bp.desc}"</p>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                          <div className="space-y-1">
                             <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Complexity Index</p>
                             <p className="text-3xl font-mono font-black text-fuchsia-400 leading-none">{bp.complexity}</p>
                          </div>
                          <button className="px-10 py-5 bg-fuchsia-900 hover:bg-fuchsia-800 rounded-[28px] text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all">LOAD BLUEPRINT</button>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-fuchsia-500/30 bg-fuchsia-950/10 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Crown size={600} className="text-fuchsia-400" /></div>
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-fuchsia-800 flex items-center justify-center shadow-[0_0_100px_rgba(162,28,175,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12">
                       <Flower2 size={56} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">AESTHETIC <span className="text-fuchsia-400">FORGE</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto opacity-80">
                          "Integrating Lilies Around botanical architecture with permaculture zonation. Forge designs that optimize for both beauty and bio-resonance."
                       </p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-8">
                       <textarea 
                          value={inputTopic} 
                          onChange={e => setInputTopic(e.target.value)}
                          placeholder="Describe the aesthetic botanical architecture (e.g. Symmetrical lily garden synchronized with North-Gate sunrise)..."
                          className="w-full bg-black/60 border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-fuchsia-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-800"
                       />
                       <button 
                          onClick={() => handleRunForge('aesthetic')}
                          disabled={isForging || !inputTopic.trim()}
                          className="px-20 py-8 bg-fuchsia-800 hover:bg-fuchsia-700 rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_80px_rgba(162,28,175,0.4)] hover:scale-105 active:scale-95 transition-all ring-8 ring-white/5 border-2 border-white/10"
                       >
                          {isForging ? <Loader2 size={24} className="animate-spin" /> : <Wand2 size={24} />}
                          <span className="ml-4">{isForging ? 'SEQUENCING AESTHETIC...' : 'INITIALIZE LILIES FORGE'}</span>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: ETHICAL FORGE --- */}
        {activeTab === 'ethics' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {PERMACULTURE_ETHICS.map(eth => (
                    <div key={eth.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col items-center text-center space-y-6 group hover:border-emerald-500/30 transition-all shadow-xl">
                       <div className={`p-6 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform ${eth.color}`}>
                          <eth.icon size={48} />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-widest">{eth.name}</h4>
                          <p className="text-slate-500 italic text-sm">"{eth.desc}"</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-16 glass-card rounded-[80px] border-2 border-blue-500/20 bg-blue-950/5 relative overflow-hidden shadow-3xl text-center space-y-10 group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Scale size={600} className="text-blue-400" /></div>
                 <div className="relative z-10 space-y-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform">
                       <ShieldCheck size={48} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">SEHTI <span className="text-blue-400">Compliance Audit</span></h3>
                       <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto">"Evaluating design shards against the quintuplicate pillar system to ensure 100% ecosystem transparency."</p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-6">
                       <textarea 
                          value={inputTopic} 
                          onChange={e => setInputTopic(e.target.value)}
                          placeholder="Describe the design pillar or resource allocation strategy for ethical sharding..."
                          className="w-full bg-black/60 border border-white/10 rounded-[32px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-blue-500/5 transition-all outline-none h-40 resize-none shadow-inner placeholder:text-stone-800"
                       />
                       <button 
                          onClick={() => handleRunForge('ethical')}
                          disabled={isForging || !inputTopic.trim()}
                          className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4"
                       >
                          {isForging ? <Loader2 size={24} className="animate-spin" /> : <ClipboardCheck size={24} />}
                          {isForging ? 'AUDITING COMPLIANCE...' : 'INITIALIZE ETHICAL AUDIT'}
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: COMPANION ORACLE --- */}
        {activeTab === 'companion' && (
           <div className="space-y-12 animate-in zoom-in duration-700 max-w-5xl mx-auto">
              <div className="p-16 md:p-20 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-500/[0.02] shadow-3xl text-center space-y-12 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none"><Microscope size={600} className="text-emerald-400" /></div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 bg-emerald-600 rounded-[44px] flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform">
                       <Sprout size={56} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Guild <span className="text-emerald-400">Oracle</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-3xl mx-auto opacity-80">
                          "Discover biological synergies between natural resources. Forge guilds that maximize regional C(a) density while suppressing stress pathogens."
                       </p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-6">
                       <div className="relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                          <input 
                             type="text" 
                             value={primaryCrop}
                             onChange={e => setPrimaryCrop(e.target.value)}
                             onKeyDown={e => e.key === 'Enter' && handleRunForge('synergy')}
                             placeholder="Search for primary crop (e.g. Bantu Maize)..."
                             className="w-full bg-black/60 border border-white/10 rounded-full py-6 pl-16 pr-8 text-xl text-white font-medium italic focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none shadow-inner placeholder:text-stone-900"
                          />
                       </div>
                       <button 
                          onClick={() => handleRunForge('synergy')}
                          disabled={isForging || !primaryCrop.trim()}
                          className="w-full py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5"
                       >
                          {isForging ? <Loader2 size={24} className="animate-spin" /> : <Binary size={24} />}
                          {isForging ? 'DECODING SYNERGIES...' : 'FORGE BIOLOGICAL GUILD'}
                       </button>
                    </div>
                 </div>
              </div>

              {companionGuild && (
                 <div className="animate-in slide-in-from-bottom-10 duration-700">
                    <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 shadow-3xl border-l-[16px] border-l-emerald-600 relative overflow-hidden group/advice">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Sparkles size={600} className="text-emerald-400" /></div>
                       <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                          <div className="flex items-center gap-6">
                             <CheckCircle2 size={32} className="text-emerald-400" />
                             <h4 className="text-3xl font-black text-white uppercase italic m-0">Biological Synergy Report</h4>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Guild Confidence</p>
                             <p className="text-2xl font-mono font-black text-emerald-400">99.8%</p>
                          </div>
                       </div>
                       <div className="text-slate-300 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                          {companionGuild}
                       </div>
                       <div className="mt-16 flex justify-center gap-6 relative z-10 pt-10 border-t border-white/5">
                          <button onClick={() => setCompanionGuild(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard Shard</button>
                          <button className="px-16 py-6 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                             <Stamp size={20} /> Anchor to Knowledge Ledger
                          </button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        )}
      </div>

      {/* Result Shard Display (for aesthetic/ethical forge) */}
      {forgeResult && (
        <div className="animate-in slide-in-from-bottom-10 duration-700 pb-20">
           <div className={`p-12 md:p-20 rounded-[80px] border-2 bg-black/80 prose prose-invert max-w-none shadow-3xl border-l-[16px] relative overflow-hidden group/advice ${activeTab === 'lilies' ? 'border-fuchsia-500/20 border-l-fuchsia-600' : 'border-emerald-500/20 border-l-emerald-600'}`}>
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/advice:scale-110 transition-transform duration-[15s]"><Sparkles size={600} className={activeTab === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'} /></div>
              <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                 <div className="flex items-center gap-8">
                    {activeTab === 'lilies' ? <Flower2 className="w-12 h-12 text-fuchsia-400" /> : <Activity className="w-12 h-12 text-emerald-400" />}
                    <h4 className="text-4xl font-black text-white uppercase italic m-0">Forge Analysis Verdict</h4>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Resilience Alpha</p>
                    <p className={`text-4xl font-mono font-black ${activeTab === 'lilies' ? 'text-fuchsia-400' : 'text-emerald-400'}`}>0.98</p>
                 </div>
              </div>
              <div className={`text-slate-300 text-3xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10`}>
                 {forgeResult}
              </div>
              <div className="mt-20 flex justify-center gap-10 relative z-10 pt-10 border-t border-white/5">
                 <button onClick={() => setForgeResult(null)} className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-3xl">Discard Shard</button>
                 <button className={`px-24 py-8 rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-[12px] ring-white/5 ${activeTab === 'lilies' ? 'bg-fuchsia-800' : 'agro-gradient'}`}>
                    <Stamp size={28} /> ANCHOR TO REGISTRY
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Permaculture;