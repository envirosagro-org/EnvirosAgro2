import React, { useState, useMemo, useEffect } from 'react';
import { 
  PawPrint, TreePine, Droplets, Mountain, Wind, 
  Activity, Zap, ShieldCheck, Heart, Users, Target, 
  Brain, Scale, Microscope, Binary, Coins, Sparkles, 
  Bot, Loader2, Gauge, FlaskConical, Globe, 
  Layers, Lock, Database, Thermometer, Compass,
  CheckCircle2, AlertCircle, Info, ChevronRight, Fingerprint,
  Sprout, Waves, Cpu, Landmark, ShieldAlert, Dna, 
  Workflow, Factory, Network, History as HistoryIcon, FileSearch, 
  BookOpen, Leaf, X, FileText, SearchCode, Download, 
  Terminal, ArrowRight, Link2, Circle, Bird, Flame, 
  ArrowUpRight, HeartPulse, Radar, Bone, Eye, Settings, 
  Binoculars, MapPin, User as UserIcon, Wheat, 
  ThermometerSun, Timer, TrendingUp, Scan, ClipboardCheck, 
  Stamp, Radio, Signal, Wifi, Satellite, Ship, Fish, 
  CloudRain, Fan, Shield, PlusCircle
} from 'lucide-react';
import { User, ViewState } from '../types';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar as RechartsRadar 
} from 'recharts';
import { chatWithAgroExpert } from '../services/geminiService';

interface NaturalResourcesProps {
  user: User;
  type: ViewState;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const NaturalResources: React.FC<NaturalResourcesProps> = ({ user, type, onEarnEAC, onSpendEAC }) => {
  const [activeInternalTab, setActiveInternalTab] = useState<'overview' | 'ledger' | 'oracle' | 'forge'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [forgeStep, setForgeStep] = useState<'input' | 'sign' | 'success'>('input');
  
  // Real-time stream simulation
  const [stream, setStream] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const entry = {
        id: Math.random().toString(16).substring(2, 6).toUpperCase(),
        time: new Date().toLocaleTimeString(),
        event: 'TELEMETRY_INGEST',
        val: (Math.random() * 100).toFixed(2),
        status: Math.random() > 0.1 ? 'OK' : 'DRIFT'
      };
      setStream(prev => [entry, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getResourceMeta = () => {
    switch (type) {
      case 'animal_world':
        return {
          title: 'Animal World',
          icon: PawPrint,
          color: 'text-amber-500',
          bg: 'bg-amber-500/5',
          border: 'border-amber-500/20',
          formula: 'ASE = (P * S) / H_stress',
          philosophy: 'Animal-Social Equilibrium (ASE).',
          context: 'Livestock as independent economic nodes.',
          metrics: [
            { label: 'Herd Socialism', val: '92%', icon: Users },
            { label: 'Neural Psychology', val: '0.84', icon: Brain },
            { label: 'Metabolic Ingest', val: '98%', icon: Activity },
          ],
          forgeTitle: 'Animal Identity Shard',
          forgeDesc: 'Mint a new biometric identity for an individual animal node.'
        };
      case 'plants_world':
        return {
          title: 'Plants World',
          icon: TreePine,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/5',
          border: 'border-emerald-500/20',
          formula: 'P_res = ∫(E_human * Ca) dt',
          philosophy: 'Phyto-Psychological Resonance (PPR).',
          context: 'Mapping plant socialism and human engagement.',
          metrics: [
            { label: 'Growth Resilience', val: '1.42x', icon: Target },
            { label: 'Steward Sync', val: '99%', icon: Heart },
            { label: 'DNA Shard Integrity', val: '100%', icon: Binary },
          ],
          forgeTitle: 'Botanical Lineage Shard',
          forgeDesc: 'Document and anchor a specific seed lineage into the registry.'
        };
      case 'aqua_portal':
        return {
          title: 'Aqua Portal',
          icon: Droplets,
          color: 'text-blue-500',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/20',
          formula: 'W_eff = m * sqrt(V_storage / D_loss)',
          philosophy: 'Hydraulic Integrity Protocol.',
          context: 'Precision moisture sharding and flow auditing.',
          metrics: [
            { label: 'Flow Velocity', val: '12 L/s', icon: Gauge },
            { label: 'Purity Constant', val: '0.98', icon: FlaskConical },
            { label: 'Storage Shard', val: '84%', icon: Database },
          ],
          forgeTitle: 'Water Purity Shard',
          forgeDesc: 'Verify and register an industrial water source purity report.'
        };
      case 'soil_portal':
        return {
          title: 'Soil Portal',
          icon: Mountain,
          color: 'text-orange-500',
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/20',
          formula: 'S_health = Ca * τ_regen',
          philosophy: 'Biometric Substrate Sharding.',
          context: 'Soil DNA sequencing and nutrient depth audits.',
          metrics: [
            { label: 'Organic Shard', val: '6.2%', icon: Sprout },
            { label: 'Mineral Stability', val: '94%', icon: Layers },
            { label: 'Thermal Depth', val: '22°C', icon: Thermometer },
          ],
          forgeTitle: 'Substrate Health Shard',
          forgeDesc: 'Commit regional soil mineral density data to the ledger.'
        };
      case 'air_portal':
        return {
          title: 'Air Portal',
          icon: Wind,
          color: 'text-sky-400',
          bg: 'bg-sky-400/5',
          border: 'border-sky-400/20',
          formula: 'A_purity = 1 - (SID_load / O2)',
          philosophy: 'Atmospheric Carbon Sharding.',
          context: 'Spectral auditing of gaseous transparency.',
          metrics: [
            { label: 'Oxygen Saturation', val: '21.4%', icon: Activity },
            { label: 'Carbon Shard Density', val: '412 ppm', icon: Binary },
            { label: 'Acoustic Clarity', val: '99%', icon: Waves },
          ],
          forgeTitle: 'Atmospheric Sync Shard',
          forgeDesc: 'Mint carbon sequestration potential based on air quality metrics.'
        };
      default:
        return {
          title: 'Resource Node',
          icon: Globe,
          color: 'text-slate-400',
          bg: 'bg-slate-500/5',
          border: 'border-slate-500/20',
          formula: 'R = MC^2',
          philosophy: 'Resource Continuity.',
          context: 'General resource management.',
          metrics: [],
          forgeTitle: 'Generic Shard',
          forgeDesc: 'Mint a generic resource shard.'
        };
    }
  };

  const meta = getResourceMeta();

  const handleForgeShard = async () => {
    const FEE = 25;
    if (!onSpendEAC(FEE, `${type.toUpperCase()}_FORGE_PROTOCOL`)) return;

    setIsForging(true);
    setForgeStep('sign');
    setIsForging(false);
  };

  const executeMint = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsForging(true);
    try {
      const prompt = `Act as an EnvirosAgro Resource Specialist. Synthesize an industrial shard for ${meta.title}. 
      User Context: ${user.location}, Formula: ${meta.formula}. 
      Provide a technical report for the registry.`;
      const res = await chatWithAgroExpert(prompt, []);
      setForgeResult(res.text);
      setForgeStep('success');
      onEarnEAC(50, `${type.toUpperCase()}_SHARD_MINTED`);
    } catch (e) {
      alert("Registry Sync Error.");
    } finally {
      setIsForging(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4 lg:px-0">
      
      {/* 1. Immersive Hero HUD */}
      <div className={`glass-card p-10 md:p-16 rounded-[64px] border ${meta.border} ${meta.bg} relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl transition-all duration-500`}>
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <meta.icon size={500} />
         </div>
         
         <div className={`w-32 h-32 md:w-48 md:h-48 rounded-[48px] md:rounded-[64px] bg-black/40 border-2 ${meta.border} flex items-center justify-center shadow-3xl shrink-0 group-hover:scale-105 transition-all duration-700 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
            <meta.icon className={`w-16 h-16 md:w-24 md:h-24 ${meta.color} relative z-10 drop-shadow-2xl`} />
         </div>

         <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
            <div className="space-y-2">
               <span className={`px-4 py-1.5 bg-white/5 ${meta.color} text-[10px] font-black uppercase rounded-full tracking-[0.5em] border ${meta.border} shadow-inner`}>
                  EOS_RESOURCE_SHARD_#842
               </span>
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">
                  {meta.title} <span className={meta.color}>Portal</span>
               </h2>
            </div>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic opacity-80 group-hover:opacity-100 transition-opacity">
               "{meta.philosophy} {meta.context}"
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <button 
                onClick={() => setActiveInternalTab('forge')}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-4 transition-all active:scale-95"
               >
                  <PlusCircle size={20} /> Initialize {meta.title} Shard
               </button>
               <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 font-mono text-xl flex items-center gap-4 group cursor-help shadow-inner">
                  <Binary size={20} className={`${meta.color} group-hover:scale-110 transition-transform`} />
                  {meta.formula}
               </div>
            </div>
         </div>
      </div>

      {/* 2. Resource Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'overview', label: 'Telemetry Overview', icon: Activity },
          { id: 'ledger', label: 'Resource Ledger', icon: HistoryIcon },
          { id: 'forge', label: 'Shard Forge', icon: FlaskConical },
          { id: 'oracle', label: 'Resource Oracle', icon: Bot },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveInternalTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Content Areas */}
      <div className="min-h-[700px]">
        {activeInternalTab === 'overview' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {meta.metrics.map((m, i) => (
                       <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-4 group hover:border-emerald-500/20 transition-all shadow-xl">
                          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                             <m.icon className={`w-8 h-8 ${meta.color}`} />
                          </div>
                          <div>
                             <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-2">{m.label}</p>
                             <p className="text-4xl font-mono font-black text-white tracking-tighter">{m.val}</p>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full ${meta.color.replace('text', 'bg')} animate-pulse`} style={{ width: '75%' }}></div>
                          </div>
                       </div>
                    ))}
                 </div>

                 {/* Live Stream Ingest Display */}
                 <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-[#050706] shadow-3xl flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                       <div className="flex items-center gap-4">
                          <Terminal size={20} className={meta.color} />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{type.toUpperCase()} // INGEST_STREAM</span>
                       </div>
                       <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[8px] font-mono text-emerald-400 uppercase font-black tracking-widest">LIVE_DATA_ANCHOR</span>
                       </div>
                    </div>
                    <div className="p-8 font-mono text-[11px] space-y-4 h-[350px] overflow-y-auto custom-scrollbar">
                       {stream.map((log, i) => (
                          <div key={i} className="flex gap-6 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl animate-in slide-in-from-right duration-500">
                             <span className="text-slate-700 w-20 shrink-0 font-bold">[{log.time}]</span>
                             <span className="text-indigo-400 w-32 shrink-0 truncate">[{log.event}]</span>
                             <div className="flex-1 text-slate-300">
                                PACKET: {log.id} // VAL: <span className={log.status === 'OK' ? 'text-emerald-400' : 'text-rose-500'}>{log.val}</span>
                             </div>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${log.status === 'OK' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500 animate-pulse'}`}>{log.status}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Bot size={300} className="text-indigo-400" /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl"><Bot size={32} className="text-white" /></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Pillar <span className="text-indigo-400">Context</span></h4>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/30 pl-10 relative z-10 font-medium">
                       "Current node metrics suggest an optimal {type.replace('_', ' ')} resonance. Maintain C(a) constant stability by anchoring regular field shards."
                    </p>
                    <button onClick={() => setActiveInternalTab('oracle')} className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 relative z-10 active:scale-95 transition-all">
                       <Sparkles className="w-4 h-4" /> Synthesize Advice Shard
                    </button>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                    <div className="flex items-center gap-3">
                       <Info className="w-5 h-5 text-indigo-400" />
                       <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Shard Integrity</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                       "Every telemetry point is cryptographically signed by your node ESIN. Tampering results in an immediate m-constant recalibration event."
                    </p>
                 </div>
              </div>
           </div>
        )}

        {activeInternalTab === 'forge' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><FlaskConical size={500} className="text-indigo-400" /></div>
                
                {forgeStep === 'input' && (
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                     <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center text-white mx-auto shadow-[0_0_80px_rgba(79,70,229,0.3)] group-hover:rotate-12 transition-transform duration-700">
                        <FlaskConical size={64} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-indigo-400">Forge</span></h3>
                        <p className="text-slate-400 text-2xl font-medium max-w-xl mx-auto italic leading-relaxed">"{meta.forgeDesc}"</p>
                     </div>
                     <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center px-4">
                           <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Processing Fee</span>
                           <span className="text-4xl font-mono font-black text-indigo-400">25 <span className="text-lg">EAC</span></span>
                        </div>
                     </div>
                     <button 
                      onClick={handleForgeShard}
                      className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                     >
                        INITIALIZE MINT SEQUENCE
                     </button>
                  </div>
                )}

                {forgeStep === 'sign' && (
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                     <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-3xl">
                           <Fingerprint size={48} className="text-blue-400" />
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Node <span className="text-blue-400">Auth Signature</span></h4>
                        <p className="text-slate-400 text-lg">Sign the shard to commit resources to the ledger.</p>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Admin Signature (ESIN)</label>
                        <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black/60 border border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.1em] focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                        />
                     </div>
                     <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                        <ShieldAlert className="w-12 h-12 text-blue-500 shrink-0" />
                        <p className="text-[10px] text-blue-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic">
                           SHARD_FINALITY: "By signing, you authorize the permanent sharding of this resource data. Fraudulent data results in an immediate m-constant decay factor."
                        </p>
                     </div>
                     <div className="flex gap-6">
                        <button onClick={() => setForgeStep('input')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">Abort Protocol</button>
                        <button 
                          onClick={executeMint}
                          disabled={isForging || !esinSign}
                          className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                        >
                           {isForging ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={32} className="fill-current" />}
                           {isForging ? "MINTING SHARD..." : "AUTHORIZE SETTLEMENT"}
                        </button>
                     </div>
                  </div>
                )}

                {forgeStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center relative z-10">
                     <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.4)] scale-110 relative group">
                        <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-emerald-400">Minted.</span></h3>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em] font-mono">HASH_COMMIT_0x{(Math.random()*1000).toFixed(0)}_FINAL</p>
                     </div>
                     <div className="p-12 bg-black/60 rounded-[64px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-l-emerald-500 relative overflow-hidden text-left group/rep">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/rep:scale-110 transition-transform duration-[10s]"><Database size={200} /></div>
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5 relative z-10">
                           <FileSearch size={24} className="text-emerald-400" />
                           <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Report</h4>
                        </div>
                        <div className="text-slate-300 text-xl leading-loose italic whitespace-pre-line relative z-10">
                           {forgeResult}
                        </div>
                     </div>
                     <button onClick={() => setForgeStep('input')} className="w-full max-w-md py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Forge</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* TAB 3: LEDGER */}
        {activeInternalTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 gap-8 px-4">
                <div className="space-y-2">
                   <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Resource <span className="text-indigo-400">Ledger</span></h3>
                   <p className="text-slate-500 text-xl font-medium italic">"Immutable record of physical resource sharding events."</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3">
                    <Download size={18} /> Export Shard CSV
                  </button>
                </div>
             </div>

             <div className="glass-card rounded-[48px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
                <div className="grid grid-cols-5 p-10 border-b border-white/10 bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                   <span className="col-span-2">Registry Action Shard</span>
                   <span>Pillar Anchor</span>
                   <span>Consensus Node</span>
                   <span className="text-right">Ledger finality</span>
                </div>
                <div className="divide-y divide-white/5 h-[500px] overflow-y-auto custom-scrollbar">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                        <div className="col-span-2 flex items-center gap-8">
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform shadow-inner">
                              <Database size={24} className="text-slate-600 group-hover:text-indigo-400" />
                           </div>
                           <div>
                              <p className="text-xl font-black text-white uppercase italic tracking-tight m-0 leading-none">Resource Shard #{(882 + i * 4).toString()}</p>
                              <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black tracking-widest italic">COMMIT_HASH: 0x882{(Math.random()*100).toFixed(0)}_FINAL</p>
                           </div>
                        </div>
                        <div>
                           <span className={`px-3 py-1 rounded border text-[8px] font-black uppercase ${meta.color} ${meta.border}`}>{meta.title.split(' ')[0]}</span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono italic">
                           Node_Regional_{i}_P4
                        </div>
                        <div className="flex justify-end pr-4">
                           <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shadow-xl group-hover:shadow-emerald-500/40 transition-all scale-90 group-hover:scale-100">
                              <ShieldCheck size={20} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="p-10 border-t border-white/10 bg-black/80 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                   <span>Permanent record. No deletion shards permitted for physical biometrics.</span>
                   <button className="text-indigo-400 hover:text-white transition-colors">Audit Node Integrity</button>
                </div>
             </div>

             <div className="p-16 glass-card rounded-[64px] border border-white/5 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none"><Stamp size={400} /></div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-2 border-white/10 shrink-0">
                       <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Biometric Finality</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-lg:text-sm max-w-lg mx-auto md:mx-0">All {meta.title} resources are immutably sharded. This ensures 100% traceability for all value-added products derived from these biological base layers.</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">TOTAL_RESOURCE_SYNC</p>
                    <p className="text-7xl font-mono font-black text-white tracking-tighter">100%</p>
                 </div>
              </div>
           </div>
        )}

        {activeInternalTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center">
              <div className="p-10 md:p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center gap-12 shadow-3xl group">
                 <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-[10s]"><Bot size={800} className="text-indigo-400" /></div>
                 
                 <div className="relative z-10 space-y-8 w-full">
                    <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] border-4 border-white/10 mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Resource <span className="text-indigo-400">Oracle</span></h3>
                       <p className="text-slate-500 text-2xl font-medium mt-6 italic max-w-2xl mx-auto leading-relaxed">AI-powered scientific analysis and predictive sharding for {meta.title} biometrics.</p>
                    </div>
                 </div>

                 <div className="w-full max-w-3xl relative z-10 space-y-10">
                    <div className="py-20 flex flex-col items-center gap-8 opacity-40">
                       <SearchCode size={120} className="text-slate-600" />
                       <p className="text-xl font-black uppercase tracking-[0.4em]">Oracle Standby</p>
                       <p className="text-sm italic">Initialize a resource audit to identify pathobiological friction in your local node.</p>
                       <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">INITIALIZE ORACLE SWEEP</button>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Added missing default export to resolve import error in App.tsx
export default NaturalResources;