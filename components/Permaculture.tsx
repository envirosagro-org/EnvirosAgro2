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
  // Added missing Coins and Info imports
  Coins,
  Info
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Radar as RechartsRadar, Tooltip } from 'recharts';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface PermacultureProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

const ZONE_SHARDS = [
  { id: 0, name: 'Zone 0: Core Node', desc: 'The steward center. Focus on internal efficiency, waste-to-energy cycles, and personal m-constant calibration.', icon: UserIcon, tasks: ['Energy Audit', 'SID Self-Remediation', 'Bio-Inflow Monitor'], color: 'text-indigo-400' },
  { id: 1, name: 'Zone 1: Daily Ingest', desc: 'Intensive care shards. Small-scale kitchen garden modules and high-frequency herb nodes.', icon: Sprout, tasks: ['Compost Ingest', 'Seed Starting', 'Daily Moisture Check'], color: 'text-emerald-400' },
  { id: 2, name: 'Zone 2: Semi-Intensive', desc: 'Perennial orchards and poultry nodes. Seasonal maintenance cycle with medium sharding frequency.', icon: Trees, tasks: ['Orchard Pruning', 'Water Catchment', 'Poultry Sync'], color: 'text-teal-400' },
  { id: 3, name: 'Zone 3: Main Crop', desc: 'The industrial core. Large-scale cash crops and pasture sharding for network trade and liquidity.', icon: Wheat, tasks: ['Harvest Ingest', 'Soil Tilling', 'Pest Swarm Scan'], color: 'text-amber-400' },
  { id: 4, name: 'Zone 4: Semi-Wild', desc: 'Managed forests and foraged shards. Minimal interference nodes for timber and long-term EAT growth.', icon: Mountain, tasks: ['Timber Audit', 'Wild Ingest', 'Boundary Repair'], color: 'text-blue-400' },
  { id: 5, name: 'Zone 5: Wilderness', desc: 'The primary oracle. Observation-only nodes to calibrate local biometrics against planetary resonance.', icon: Globe, tasks: ['Resonance Mapping', 'Wildlife Count', 'Erosion Audit'], color: 'text-slate-400' },
];

const COMPANION_DATA = [
  { plant: 'Tomato Shard', partners: ['Basil Shard', 'Marigold Node'], benefit: 'Aromatic Pest Shield', thrust: 'Technological' },
  { plant: 'Maize Shard', partners: ['Bean Shard', 'Squash Node'], benefit: 'Nitrogen Sequestration', thrust: 'Environmental' },
  { plant: 'Bantu Rice', partners: ['Azolla Node', 'Duck Shard'], benefit: 'Circular Nutrient Loop', thrust: 'Societal' },
  { plant: 'Sunflower Node', partners: ['Cucumber Shard'], benefit: 'Vertical Support Structure', thrust: 'Industry' },
];

const Permaculture: React.FC<PermacultureProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'zonation' | 'ethics' | 'companion'>('zonation');
  const [selectedZone, setSelectedZone] = useState(ZONE_SHARDS[1]);
  const [isForgingDesign, setIsForgingDesign] = useState(false);
  const [designAdvice, setDesignAdvice] = useState<string | null>(null);
  const [designTopic, setDesignTopic] = useState('');
  
  const resilienceData = [
    { thrust: 'Zonation', A: 85 },
    { thrust: 'Cyclicity', A: 72 },
    { thrust: 'Ethical', A: 94 },
    { thrust: 'Diversity', A: 68 },
    { thrust: 'Yield', A: 80 },
  ];

  const handleForgePermacultureDesign = async () => {
    if (!designTopic.trim()) return;
    
    const fee = 25;
    if (!await onSpendEAC(fee, `PERMACULTURE_DESIGN_FORGE_${designTopic.toUpperCase()}`)) return;

    setIsForgingDesign(true);
    setDesignAdvice(null);

    try {
      const prompt = `Act as an EnvirosAgro Permaculture Architect. Forge a design shard for: "${designTopic}".
      Apply the 12 Permaculture Principles and the SEHTI framework. 
      Analyze the m-constant resilience and C(a) impact. Provide a technical design report for the registry.
      Format the output with industrial headers like [DESIGN_LOG], [PATTERN_MAP], and [RESILIENCE_VERDICT].`;
      
      const response = await chatWithAgroExpert(prompt, []);
      setDesignAdvice(response.text);
      onEarnEAC(10, 'PERMACULTURE_DESIGN_CONTRIBUTION');
    } catch (e) {
      setDesignAdvice("Oracle Consensus Error: Design handshake failed. Shard corrupted.");
    } finally {
      setIsForgingDesign(false);
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
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">PERMACULTURE_DESIGN_NODE_v5</span>
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Design <span className="text-emerald-400">Resilience</span></h2>
            </div>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic opacity-80 group-hover:opacity-100 transition-opacity">
               "Designing productive agricultural shards that mimic natural planetary resonance. Ethical sharding for 100% sustainable food sovereignty."
            </p>
         </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-2xl px-6 mx-auto lg:mx-0 relative z-20">
        {[
          { id: 'zonation', label: 'Zonation Shards', icon: Layers },
          { id: 'ethics', label: 'Ethical Forge', icon: Scale },
          { id: 'companion', label: 'Companion Oracle', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105 ring-4 ring-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] relative z-10">
        
        {/* --- TAB: ZONATION SHARDS --- */}
        {activeTab === 'zonation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
             {/* Left: Zone Selection */}
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
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

             {/* Right: Zone Detail Dossier */}
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

        {/* --- TAB: ETHICAL FORGE --- */}
        {activeTab === 'ethics' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in zoom-in duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 md:p-14 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Scale size={300} className="text-emerald-400" /></div>
                    <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                       <div className="p-5 bg-emerald-600 rounded-[28px] shadow-3xl group-hover:rotate-12 transition-transform">
                          <Scale className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Ethical <span className="text-emerald-400">Forge</span></h3>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">EOS_DESIGN_SYNTH_v5</p>
                       </div>
                    </div>
                    
                    <div className="space-y-10 relative z-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Design Identity (Objective)</label>
                          <input 
                            type="text" value={designTopic} onChange={e => setDesignTopic(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleForgePermacultureDesign()}
                            placeholder="e.g. Zone 2 Forest Garden..."
                            className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-800 italic"
                          />
                       </div>
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex justify-between items-center shadow-inner group/fee hover:border-emerald-500/30 transition-all">
                          <div className="flex items-center gap-4">
                             <Coins className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                             <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Sharding Fee</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-white">25 <span className="text-sm text-emerald-500">EAC</span></span>
                       </div>
                       <button 
                        onClick={handleForgePermacultureDesign}
                        disabled={isForgingDesign || !designTopic.trim()}
                        className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-6 ring-8 ring-white/5"
                       >
                          {isForgingDesign ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                          {isForgingDesign ? 'SEQUENCING PATTERNS...' : 'FORGE DESIGN SHARD'}
                       </button>
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[56px] border border-blue-500/10 bg-blue-500/5 space-y-8 group shadow-xl">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400 group-hover:rotate-12 transition-transform shadow-inner border border-blue-500/20"><Info size={24} /></div>
                       <h4 className="text-xl font-black text-white uppercase italic m-0">Design <span className="text-blue-400">Rules</span></h4>
                    </div>
                    <p className="text-sm text-slate-400 italic leading-relaxed font-medium">
                       "All design shards must adhere to the 3 Core Ethics: Earth Care, People Care, and Fair Share. Violations result in immediate m-constant recalibration."
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[80px] min-h-[850px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl text-white">
                    {/* Terminal Header */}
                    <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                             <Terminal size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                             <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Architect <span className="text-indigo-400">Oracle</span></h3>
                             <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_DESIGN_LINK // EOS_PROTOCOL_V5</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          {designAdvice && (
                            <button onClick={() => setDesignAdvice(null)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl active:scale-90"><RefreshCw size={20} /></button>
                          )}
                          <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                             <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_SYNC_OK</span>
                          </div>
                       </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar relative z-20">
                       {isForgingDesign ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <div className="w-64 h-64 rounded-full border-8 border-emerald-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.2)]">
                                   <Compass size={100} className="text-emerald-500 animate-spin-slow" />
                                </div>
                                <div className="absolute inset-[-10px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                             </div>
                             <div className="space-y-6">
                                <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">MAPPING ENERGY PATTERNS...</p>
                                <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">EOS_CORE_AUDIT // CHECKING_ZONATION_RELIANCE</p>
                             </div>
                          </div>
                       ) : designAdvice ? (
                          <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 pb-10">
                             <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-white/5 prose prose-invert prose-emerald max-w-none shadow-3xl border-l-[12px] border-l-emerald-600/50 relative overflow-hidden group/shard">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><Atom size={800} className="text-emerald-400" /></div>
                                
                                <div className="flex justify-between items-center mb-12 relative z-10 border-b border-white/5 pb-10">
                                   <div className="flex items-center gap-6">
                                      <Stamp size={40} className="text-emerald-400" />
                                      <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Design Shard Report</h4>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Design Confidence</p>
                                      <p className="text-3xl font-mono font-black text-emerald-400">99.8%</p>
                                   </div>
                                </div>

                                <div className="text-slate-200 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4">
                                   {designAdvice}
                                </div>

                                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                   <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-xl">
                                      <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">RESILIENCE_CERTIFIED</span>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">M-CONSTANT DELTA</p>
                                      <p className="text-3xl font-mono font-black text-white">+0.14x</p>
                                   </div>
                                </div>
                             </div>

                             <div className="flex justify-center gap-10">
                                <button onClick={() => setDesignAdvice(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-8 ring-white/5">
                                   <Stamp size={28} /> ANCHOR TO LEDGER
                                </button>
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                             <div className="relative">
                                <Sparkles size={180} className="text-slate-500 group-hover:text-emerald-500 transition-colors duration-1000" />
                                <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">FORGE_STANDBY</p>
                                <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Inquire with the Architect Oracle to sync design shards</p>
                             </div>
                          </div>
                       )}
                    </div>

                    {/* Scanline Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-10">
                       <div className="w-full h-1/2 bg-gradient-to-b from-emerald-500/20 to-transparent absolute top-0 animate-scan"></div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: COMPANION ORACLE --- */}
        {activeTab === 'companion' && (
           <div className="space-y-16 animate-in slide-in-from-right-4 duration-500 px-4 md:px-0">
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                 <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Companion <span className="text-indigo-400">Registry</span></h3>
                 <p className="text-slate-500 text-2xl font-medium italic opacity-80">"Auditing botanical synergies to maximize regional C(a) constant stability and nutrient flow."</p>
                 <div className="relative group w-full max-w-2xl mx-auto pt-10">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input type="text" placeholder="Lookup biological synergies..." className="w-full bg-black/60 border border-white/10 rounded-[40px] py-8 pl-16 pr-8 text-lg text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                 {COMPANION_DATA.map((shard, i) => (
                    <div key={i} className="glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Binary size={400} /></div>
                       
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 relative z-10 gap-8">
                          <div className="flex items-center gap-8">
                             <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 shadow-2xl group-hover:rotate-6 transition-all">
                                <Layers size={40} />
                             </div>
                             <div>
                                <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors m-0 leading-none">{shard.plant}</h4>
                                <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-3 inline-block">{shard.thrust} Thrust</span>
                             </div>
                          </div>
                          <div className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest shadow-inner">
                             #SHD_SYNC_0{i+1}
                          </div>
                       </div>

                       <div className="space-y-10 relative z-10">
                          <div className="space-y-6">
                             <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] border-b border-white/5 pb-4 px-2">SYNERGISTIC PEERS</p>
                             <div className="flex flex-wrap gap-4 px-2">
                                {shard.partners.map(p => (
                                   <div key={p} className="flex items-center gap-3 px-6 py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-base font-black text-indigo-300 italic group/p hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse group-hover/p:bg-white"></div>
                                      {p}
                                   </div>
                                ))}
                             </div>
                          </div>
                          <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[44px] flex items-center gap-8 shadow-inner group/benefit hover:border-emerald-500/30 transition-all">
                             <div className="p-4 bg-emerald-600 rounded-2xl shadow-3xl text-white group-hover/benefit:rotate-12 transition-transform">
                                <Zap size={32} fill="white" />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Registry Benefit Shard</p>
                                <p className="text-2xl font-black text-emerald-400 uppercase tracking-tight italic m-0 leading-tight">{shard.benefit}</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-14 pt-10 border-t border-white/5 flex gap-4 relative z-10">
                          <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-indigo-600/10 transition-all shadow-xl">Audit Biological Logs</button>
                          <button className="flex-1 py-6 bg-indigo-600 rounded-3xl text-white font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Acquire Synergies</button>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-16 glass-card rounded-[80px] border border-white/10 bg-indigo-600/5 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mx-4 mt-20">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]"><Binary size={800} className="text-indigo-400" /></div>
                 <div className="flex items-center gap-12 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[40px] flex items-center justify-center shadow-3xl border-4 border-white/10 shrink-0">
                       <Sprout size={64} className="text-white animate-bounce" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Biodiversity Sharding</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                          "Promoting high-complexity biological nodes to suppress S-factor decay and maximize node multiplier sustainability."
                       </p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
                    <p className="text-[12px] text-slate-600 font-black uppercase mb-4 tracking-[0.8em]">BIOME_RESONANCE</p>
                    <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">94<span className="text-4xl text-indigo-400 ml-2">%</span></p>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Permaculture;