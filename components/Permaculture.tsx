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
  // Added missing icons and aliased User to UserIcon to avoid conflict with User type
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
  X
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface PermacultureProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const ZONE_SHARDS = [
  // Fix: Used UserIcon instead of User to refer to the lucide component instead of the type
  { id: 0, name: 'Zone 0: Core Node', desc: 'The steward center. Focus on internal efficiency and personal m-constant.', icon: UserIcon, tasks: ['Energy Audit', 'SID Self-Remediation'], color: 'text-indigo-400' },
  { id: 1, name: 'Zone 1: Daily Ingest', desc: 'Intensive care. Small-scale kitchen garden shards and high-frequency needs.', icon: Sprout, tasks: ['Compost Ingest', 'Seed Starting'], color: 'text-emerald-400' },
  { id: 2, name: 'Zone 2: Semi-Intensive', desc: 'Perennial orchards and poultry nodes. Seasonal maintenance cycle.', icon: Trees, tasks: ['Orchard Pruning', 'Water Catchment'], color: 'text-teal-400' },
  { id: 3, name: 'Zone 3: Main Crop', desc: 'The industrial core. Cash crops and pasture sharding for network trade.', icon: Wheat, tasks: ['Harvest Ingest', 'Soil Tilling'], color: 'text-amber-400' },
  { id: 4, name: 'Zone 4: Semi-Wild', desc: 'Managed forests and foraged shards. Minimal interference nodes.', icon: Mountain, tasks: ['Timber Audit', 'Wild Ingest'], color: 'text-blue-400' },
  { id: 5, name: 'Zone 5: Wilderness', desc: 'The primary oracle. Observation-only nodes to calibrate planetary resonance.', icon: Globe, tasks: ['Resonance Mapping', 'Wildlife Count'], color: 'text-slate-400' },
];

const COMPANION_DATA = [
  { plant: 'Tomato Shard', partners: ['Basil Shard', 'Marigold Node'], benefit: 'Pest Resistance', thrust: 'Technological' },
  { plant: 'Maize Shard', partners: ['Bean Shard', 'Squash Node'], benefit: 'Nitrogen Sequestration', thrust: 'Environmental' },
  { plant: 'Bantu Rice', partners: ['Azolla Node'], benefit: 'M-Constant Stability', thrust: 'Societal' },
];

const Permaculture: React.FC<PermacultureProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'zonation' | 'ethics' | 'companion'>('zonation');
  const [selectedZone, setSelectedZone] = useState(ZONE_SHARDS[1]);
  const [isForgingDesign, setIsForgingDesign] = useState(false);
  const [designAdvice, setDesignAdvice] = useState<string | null>(null);
  const [designTopic, setDesignTopic] = useState('');
  
  // Recharts Data
  const resilienceData = [
    { thrust: 'Zonation', A: 85, fullMark: 100 },
    { thrust: 'Cyclicity', A: 72, fullMark: 100 },
    { thrust: 'Ethical', A: 94, fullMark: 100 },
    { thrust: 'Diversity', A: 68, fullMark: 100 },
    { thrust: 'Yield', A: 80, fullMark: 100 },
  ];

  const handleForgePermacultureDesign = async () => {
    if (!designTopic.trim()) return;
    setIsForgingDesign(true);
    setDesignAdvice(null);

    const fee = 25;
    if (!onSpendEAC(fee, `PERMACULTURE_DESIGN_FORGE_${designTopic.toUpperCase()}`)) {
      setIsForgingDesign(false);
      return;
    }

    try {
      const prompt = `Act as an EnvirosAgro Permaculture Architect. Forge a design shard for: ${designTopic}.
      Apply the 12 Permaculture Principles and the SEHTI framework. 
      Analyze the m-constant resilience and C(a) impact. Provide a technical design report.`;
      const response = await chatWithAgroExpert(prompt, []);
      setDesignAdvice(response.text);
      onEarnEAC(10, 'PERMACULTURE_DESIGN_CONTRIBUTION');
    } catch (e) {
      setDesignAdvice("Oracle Consensus Error: Design handshake failed.");
    } finally {
      setIsForgingDesign(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Hero */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
            <Compass className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
            <Compass className="w-20 h-20 text-white animate-spin-slow" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">PERMACULTURE_HUB_V5</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Design <span className="text-emerald-400">Resilience</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Consciously designing productive agricultural shards that mimic natural planetary resonance. Ethical sharding for 100% sustainability."
            </p>
         </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { l: 'Design Yield', v: '1.84x', i: TrendingUp, c: 'text-emerald-400' },
          { l: 'Ethical Score', v: '98/100', i: ShieldCheck, c: 'text-blue-400' },
          { l: 'Zonation Sync', v: 'Active', i: Layers, c: 'text-indigo-400' },
          { l: 'Closed-Loop', v: '92%', i: RefreshCw, c: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-8 rounded-[40px] border-white/5 bg-black/40 flex items-center gap-6 shadow-xl group hover:border-emerald-500/20 transition-all">
             <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform"><s.i size={20} className={s.c} /></div>
             <div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{s.l}</p>
                <p className="text-2xl font-mono font-black text-white">{s.v}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'zonation', label: 'Zonation Shards', icon: Layers },
          { id: 'ethics', label: 'Ethical Forge', icon: Scale },
          { id: 'companion', label: 'Companion Oracle', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {/* TAB: ZONATION SHARDS */}
        {activeTab === 'zonation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
             <div className="lg:col-span-5 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Zonation <span className="text-emerald-400">Ledger</span></h3>
                   <div className="space-y-4">
                      {ZONE_SHARDS.map(zone => (
                        <button 
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedZone.id === zone.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${zone.color}`}><zone.icon size={20} /></div>
                              <span className="text-sm font-black uppercase">{zone.name}</span>
                           </div>
                           <ChevronRight className={`w-5 h-5 transition-transform ${selectedZone.id === zone.id ? 'rotate-90' : ''}`} />
                        </button>
                      ))}
                   </div>
                </div>

                <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center justify-center shadow-xl">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Design Resilience Radar</h4>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resilienceData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="thrust" stroke="#64748b" fontSize={10} fontStyle="italic" />
                            <Radar name="Resilience" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 h-full flex flex-col relative overflow-hidden shadow-3xl group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><selectedZone.icon size={300} className={selectedZone.color} /></div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="space-y-4">
                         <span className={`px-4 py-1.5 bg-white/5 ${selectedZone.color} text-[10px] font-black uppercase rounded-full border border-white/10`}>ZONE_DETAIL_SHARD</span>
                         <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">{selectedZone.name}</h3>
                         <p className="text-slate-400 text-2xl font-medium italic max-w-2xl leading-relaxed">"{selectedZone.desc}"</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner group-hover:border-emerald-500/20 transition-all">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                               <PlusCircle className="w-4 h-4 text-emerald-400" /> Maintenance Shards
                            </h5>
                            <div className="space-y-3">
                               {selectedZone.tasks.map(task => (
                                  <div key={task} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group/task hover:bg-emerald-600/10 transition-all cursor-pointer">
                                     <Circle className="w-2 h-2 text-emerald-500" />
                                     <span className="text-xs font-bold text-slate-300 group-hover/task:text-white uppercase">{task}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-6 shadow-inner">
                            <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                               <History className="w-4 h-4 text-indigo-400" /> Zone Metrics
                            </h5>
                            <div className="space-y-6">
                               {[
                                  { l: 'Frequency', v: 'High (Daily)', p: 95 },
                                  { l: 'Energy Sink', v: 'Low (Self-Sustaining)', p: 32 },
                               ].map(m => (
                                  <div key={m.l} className="space-y-2">
                                     <div className="flex justify-between text-[9px] font-black uppercase">
                                        <span className="text-slate-600">{m.l}</span>
                                        <span className="text-white">{m.v}</span>
                                     </div>
                                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: `${m.p}%` }}></div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 flex gap-4">
                         <button className="flex-1 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Authorize Ingest</button>
                         <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><Download size={20} /></button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ETHICAL FORGE */}
        {activeTab === 'ethics' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-10 shadow-2xl">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl"><Scale className="w-8 h-8 text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Ethical <span className="text-emerald-400">Forge</span></h3>
                    </div>
                    
                    <div className="space-y-6">
                       <div className="space-y-2 px-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Design Identity</label>
                          <input 
                            type="text" value={designTopic} onChange={e => setDesignTopic(e.target.value)}
                            placeholder="e.g. Zone 2 Orchard Restoration..."
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-emerald-500/10"
                          />
                       </div>
                       <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-500 uppercase">Sharding Cost</span>
                          <span className="text-lg font-mono font-black text-emerald-400">25 EAC</span>
                       </div>
                       <button 
                        onClick={handleForgePermacultureDesign}
                        disabled={isForgingDesign || !designTopic.trim()}
                        className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-30"
                       >
                          {isForgingDesign ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                          {isForgingDesign ? 'Synthesizing Patterns...' : 'Forge Ethical Shard'}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {[
                      { l: 'Earth Care', d: 'Prioritize biometrics over industrial yield.', i: Mountain, col: 'text-emerald-400' },
                      { l: 'People Care', d: 'Mitigate SID load through communal sharding.', i: Users, col: 'text-indigo-400' },
                      { l: 'Fair Share', d: 'Distribute EAC surplus to under-performing nodes.', i: Handshake, col: 'text-amber-500' },
                    ].map(eth => (
                      <div key={eth.l} className="p-8 glass-card border border-white/5 rounded-[40px] bg-black/40 flex items-center gap-6 shadow-lg">
                         <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner"><eth.i size={24} className={eth.col} /></div>
                         <div>
                            <h5 className="text-sm font-black uppercase text-white tracking-tight">{eth.l}</h5>
                            <p className="text-[10px] text-slate-500 italic mt-1 leading-relaxed">"{eth.d}"</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[600px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Bot className="w-6 h-6 text-emerald-400" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architect Oracle Response</span>
                       </div>
                       {designAdvice && <button onClick={() => setDesignAdvice(null)} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-500 hover:text-white transition-all"><X size={18} /></button>}
                    </div>
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                       {isForgingDesign ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-10 bg-black/60 backdrop-blur-md z-20 text-center">
                             <div className="relative">
                                <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Compass className="w-10 h-10 text-emerald-400 animate-pulse" />
                                </div>
                             </div>
                             <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic px-10">MAPPING ENERGY PATTERNS...</p>
                          </div>
                       ) : designAdvice ? (
                          <div className="animate-in slide-in-from-bottom-10 duration-700">
                             <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 relative overflow-hidden shadow-inner border-l-8 border-l-emerald-500">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Trees className="w-96 h-96 text-white" /></div>
                                <div className="prose prose-emerald prose-xl text-slate-300 leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-8">
                                   {designAdvice}
                                </div>
                             </div>
                             <div className="flex justify-center mt-12">
                                <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">ANCHOR DESIGN TO REGISTRY</button>
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                             <Sparkles size={120} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                             <div className="space-y-2">
                                <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">FORGE STANDBY</p>
                                <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Enter Design Context to Sync Oracle</p>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB: COMPANION ORACLE */}
        {activeTab === 'companion' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8 px-4">
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Companion <span className="text-indigo-400">Sharding Oracle</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic mt-2">Discover botanical synergies to maximize regional C(a) constant stability.</p>
                 </div>
                 <div className="relative group w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input type="text" placeholder="Lookup botanical shards..." className="w-full bg-black/60 border border-white/10 rounded-full py-4 pl-14 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono italic shadow-inner" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {COMPANION_DATA.map((shard, i) => (
                    <div key={i} className="glass-card p-10 rounded-[56px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all shadow-3xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Trees size={160} /></div>
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-xl group-hover:rotate-12 transition-all">
                             <Layers size={28} />
                          </div>
                          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest">{shard.thrust} Thrust</span>
                       </div>
                       <div className="space-y-6 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-indigo-400 transition-colors">{shard.plant}</h4>
                          <div className="space-y-4">
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">SYNERGISTIC PEERS</p>
                             <div className="flex flex-wrap gap-2">
                                {shard.partners.map(p => (
                                   <span key={p} className="px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-xs font-bold text-indigo-300 italic">{p}</span>
                                ))}
                             </div>
                          </div>
                          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center gap-4 shadow-inner">
                             <Zap className="w-5 h-5 text-emerald-400" />
                             <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Benefit Shard</p>
                                <p className="text-sm font-black text-emerald-400 uppercase tracking-tight">{shard.benefit}</p>
                             </div>
                          </div>
                       </div>
                       <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-500 hover:text-white hover:bg-indigo-600/20 transition-all">Acquire Synergies</button>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Permaculture;