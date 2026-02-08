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
  // Added BadgeCheck to fix the error on line 499
  BadgeCheck,
  ThermometerSun, Timer, TrendingUp, Scan, ClipboardCheck, 
  Stamp, Radio, Signal, Wifi, Satellite, Ship, Fish, 
  CloudRain, Fan, Shield, PlusCircle, Atom,
  History,
  FileDown
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, RadarChart, PolarGrid, 
  PolarAngleAxis, Radar as RechartsRadar 
} from 'recharts';
import { chatWithAgroExpert } from '../services/geminiService';
// Fix: Added missing imports for User and ViewState
import { User, ViewState } from '../types';

interface NaturalResourcesProps {
  user: User;
  type: ViewState;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
}

const NaturalResources: React.FC<NaturalResourcesProps> = ({ user, type, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeInternalTab, setActiveInternalTab] = useState<'overview' | 'ledger' | 'oracle' | 'forge'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [forgeStep, setForgeStep] = useState<'input' | 'sign' | 'success'>('input');
  const [oracleQuery, setOracleQuery] = useState('');
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  
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
      setStream(prev => [entry, ...prev].slice(0, 8));
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
    if (!await onSpendEAC(FEE, `${type.toUpperCase()}_FORGE_PROTOCOL`)) return;
    setForgeStep('sign');
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
      Provide a technical report for the registry and identify potential m-constant optimization paths.`;
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

  const handleOracleAudit = async () => {
    if (!oracleQuery.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, `${type.toUpperCase()}_ORACLE_DIAGNOSTIC`)) return;

    setIsAuditing(true);
    setOracleReport(null);
    try {
      const prompt = `EnvirosAgro ${meta.title} Oracle. 
      Analyze query: "${oracleQuery}"
      Context: ${user.location}, m-constant=${user.metrics.timeConstantTau}.
      Return technical diagnostic shard.`;
      const res = await chatWithAgroExpert(prompt, []);
      setOracleReport(res.text);
    } catch (e) {
      setOracleReport("Diagnostic link timeout.");
    } finally {
      setIsAuditing(false);
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

         <div className="flex-1 space-y-6 text-center md:text-left flex-1">
            <div className="space-y-2">
               <span className={`px-4 py-1.5 bg-white/5 ${meta.color} text-[10px] font-black uppercase rounded-full tracking-[0.5em] border ${meta.border} shadow-inner`}>
                  EOS_RESOURCE_SHARD_#842
               </span>
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                  {meta.title} <span className={meta.color}>Portal</span>
               </h2>
            </div>
            <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
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
                       </div>
                    ))}
                 </div>

                 {/* Live Stream Ingest Display */}
                 <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-[#050706] shadow-3xl flex flex-col">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                       <div className="flex items-center gap-4">
                          <Terminal className={meta.color} />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{type.toUpperCase()} // INGEST_STREAM</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[8px] font-mono text-emerald-400">SYNC_ACTIVE</span>
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
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Bot size={300} className="text-indigo-400" /></div>
                    <div className="flex items-center gap-4 relative z-10 border-b border-white/5 pb-8">
                       <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl"><Bot size={32} className="text-white" /></div>
                       <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Pillar <span className="text-indigo-400">Context</span></h4>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/30 pl-10 relative z-10 font-medium">
                       "Current node metrics suggest an optimal {type.replace('_', ' ')} resonance. Finalizing L3 anchor will trigger EAC rewards."
                    </p>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 relative z-10">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                          <span>Resonance Confidence</span>
                          <span className="text-emerald-400">99.8%</span>
                       </div>
                       <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" style={{ width: '99%' }}></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeInternalTab === 'ledger' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end border-b border-white/5 pb-8 px-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Archive <span className="text-emerald-400">Ledger</span></h3>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all"><FileDown size={16} /> Export CSV</button>
              </div>
            </div>
            <div className="glass-card rounded-[56px] overflow-hidden border border-white/5 bg-black/40 shadow-3xl">
              <div className="grid grid-cols-5 p-8 border-b border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="col-span-2">Shard Identity</span>
                <span>Type</span>
                <span>Delta</span>
                <span className="text-right">Finality</span>
              </div>
              <div className="divide-y divide-white/5 bg-[#050706]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 p-10 hover:bg-white/[0.02] transition-all items-center group cursor-pointer">
                    <div className="col-span-2 flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-inner group-hover:rotate-6 transition-all">
                        <History size={20} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white uppercase italic m-0">Shard_0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-700 font-mono">12:0{i} PM // SYNC_OK</p>
                      </div>
                    </div>
                    <div>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-slate-500 uppercase">{type.split('_')[0]}</span>
                    </div>
                    <div className="text-emerald-400 font-mono font-black">+0.{Math.floor(Math.random() * 9)}x</div>
                    <div className="flex justify-end pr-4">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-xl">
                        <ShieldCheck size={18} />
                      </div>
                    </div>
                  </div>
                ))}
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
                     <div className="w-32 h-32 bg-indigo-600 rounded-[48px] flex items-center justify-center text-white mx-auto shadow-[0_0_80px_rgba(79,70,229,0.3)]">
                        <FlaskConical size={64} />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-indigo-400">Forge</span></h3>
                        <p className="text-slate-400 text-2xl font-medium max-w-xl mx-auto italic leading-relaxed">"{meta.forgeDesc}"</p>
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
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-4">
                     <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-indigo-600/10 rounded-[32px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl group relative overflow-hidden">
                           <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-indigo-400">Signature</span></h4>
                     </div>
                     <div className="max-w-md mx-auto space-y-8">
                        <input 
                          type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                          placeholder="SIGN WITH ESIN"
                          className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white outline-none focus:border-indigo-500/40 focus:ring-8 focus:ring-indigo-500/5 transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                        />
                        <button 
                          onClick={executeMint}
                          disabled={isForging || !esinSign}
                          className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(59,130,246,0.3)] active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                        >
                           {isForging ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={24} />}
                           {isForging ? 'MINTING SHARD...' : 'AUTHORIZE MINT'}
                        </button>
                     </div>
                  </div>
                )}

                {forgeStep === 'success' && (
                  <div className="space-y-12 relative z-10 animate-in zoom-in duration-700 flex flex-col items-center">
                     <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_150px_rgba(16,185,129,0.4)] relative group scale-110 mb-8">
                        <CheckCircle2 size={100} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-[-20px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                     </div>
                     <div className="space-y-4 text-center">
                        <h3 className="text-7xl font-black text-white uppercase tracking-tighter m-0 leading-none">Shard <span className="text-emerald-400">Anchored.</span></h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4">Registry Hash: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                     </div>
                     <button onClick={() => { setForgeStep('input'); setForgeResult(null); }} className="px-24 py-8 bg-white/5 border-2 border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Forge</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {activeInternalTab === 'oracle' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700 text-center text-white">
              <div className="p-16 glass-card rounded-[64px] border border-indigo-500/20 bg-indigo-950/5 shadow-3xl relative overflow-hidden flex flex-col items-center text-center space-y-12 group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Bot size={400} className="text-indigo-400" /></div>
                 
                 <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 relative z-10 group-hover:rotate-12 transition-transform duration-700">
                    <Bot size={56} className="text-white animate-pulse" />
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter m-0 leading-none">Diagnostic <span className="text-indigo-400">Oracle</span></h3>
                    <p className="text-slate-400 text-xl font-medium italic max-w-2xl mx-auto">"Inquire with the specialist AI for industrial remediation shards specific to this node."</p>
                 </div>

                 <div className="w-full max-w-2xl relative z-10 space-y-8">
                    <textarea 
                      value={oracleQuery}
                      onChange={e => setOracleQuery(e.target.value)}
                      placeholder="Input diagnostic request..."
                      className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none h-32 resize-none shadow-inner placeholder:text-stone-800"
                    />
                    <button 
                      onClick={handleOracleAudit}
                      disabled={isAuditing || !oracleQuery.trim()}
                      className="w-full py-8 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl active:scale-95 transition-all disabled:opacity-30 border-2 border-white/10 flex items-center justify-center gap-4"
                    >
                       {isAuditing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles size={24} />}
                       {isAuditing ? 'CONSULTING ORACLE...' : 'INITIALIZE AUDIT'}
                    </button>
                 </div>

                 {oracleReport && (
                    <div className="animate-in slide-in-from-bottom-6 duration-700 w-full text-left">
                       <div className="p-10 md:p-14 bg-black/80 rounded-[56px] border-l-8 border-l-indigo-600 border border-indigo-500/20 shadow-3xl relative overflow-hidden group/audit">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/audit:scale-110 transition-transform"><Database size={300} /></div>
                          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                             <div className="flex items-center gap-4">
                                <BadgeCheck className="text-emerald-400" />
                                <h4 className="text-xl font-black text-white uppercase italic">Audit Shard Report</h4>
                             </div>
                             <button onClick={() => setOracleReport(null)} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
                          </div>
                          <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed italic whitespace-pre-line border-l border-white/5 pl-8">
                             {oracleReport}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default NaturalResources;