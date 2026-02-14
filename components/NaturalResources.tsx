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
  BadgeCheck,
  ThermometerSun, Timer, TrendingUp, Scan, ClipboardCheck, 
  Stamp, Radio, Signal, Wifi, Satellite, Ship, Fish, 
  CloudRain, Fan, Shield, PlusCircle, Atom,
  History,
  FileDown,
  CirclePlus,
  RefreshCw,
  Calculator,
  Gavel,
  ShieldPlus,
  ArrowDownToLine,
  Send,
  // Added Plus to fix "Cannot find name 'Plus'" error on line 583
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, ViewState, MediaShard } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';
import { saveCollectionItem } from '../services/firebaseService';

interface NaturalResourcesProps {
  user: User;
  type: ViewState;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

const NaturalResources: React.FC<NaturalResourcesProps> = ({ user, type, onEarnEAC, onSpendEAC, onNavigate, initialSection }) => {
  const [activeInternalTab, setActiveInternalTab] = useState<'overview' | 'ledger' | 'oracle' | 'forge' | 'sim'>(
    (initialSection as any) || 'overview'
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [forgeStep, setForgeStep] = useState<'input' | 'sign' | 'success'>('input');
  const [oracleQuery, setOracleQuery] = useState('');
  const [oracleReport, setOracleReport] = useState<string | null>(null);
  
  // Simulation Parameter States
  const [p1, setP1] = useState(1.2); 
  const [p2, setP2] = useState(8.5); 
  const [p3, setP3] = useState(0.5); 
  const [isSyncingSim, setIsSyncingSim] = useState(false);

  const [stream, setStream] = useState<any[]>([]);

  // Added downloadReport helper to fix the "Cannot find name 'downloadReport'" error on line 566
  const downloadReport = (content: string, mode: string, typeName: string) => {
    const shardId = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    const report = `
ENVIROSAGRO™ ${typeName.toUpperCase()} SHARD
=================================
REGISTRY_ID: ${shardId}
NODE_AUTH: ${user.esin}
MODE: ${mode}
TIMESTAMP: ${new Date().toISOString()}
ZK_CONSENSUS: VERIFIED (99.9%)

VERDICT:
-------------------
${content}

-------------------
(c) 2025 EA_ROOT_NODE. Secure Shard Finality.
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EA_${typeName}_${mode}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          title: 'ANIMAL WORLD',
          icon: PawPrint,
          color: 'text-amber-500',
          accent: '#f59e0b',
          bg: 'bg-amber-500/5',
          border: 'border-amber-500/20',
          formula: 'ASE = (P * S) / H_stress',
          philosophy: '"Animal-Social Equilibrium (ASE). Livestock as independent economic nodes."',
          metrics: [
            { label: 'HERD SOCIALISM', val: '92%', icon: Users },
            { label: 'NEURAL PSYCHOLOGY', val: '0.84', icon: Brain },
            { label: 'METABOLIC INGEST', val: '98%', icon: Activity },
          ],
          forgeTitle: 'Animal Identity Shard',
          forgeDesc: 'Mint a new biometric identity for an individual animal node.',
          simControls: [
            { label: 'P: Population', val: p1, set: setP1, min: 1, max: 500, step: 1 },
            { label: 'S: Stewardship', val: p2, set: setP2, min: 0.1, max: 2, step: 0.01 },
            { label: 'H: Stress', val: p3, set: setP3, min: 0.01, max: 1, step: 0.01 },
          ],
          ledgerItems: [
            { id: 'SHD-ANI-882', name: 'Bovine Identity Shard', hash: '0x882A_ANI', status: 'VERIFIED' },
            { id: 'SHD-ANI-104', name: 'Avian Ingest Thread', hash: '0x104B_ANI', status: 'AUDITING' },
          ]
        };
      case 'plants_world':
        return {
          title: 'PLANTS WORLD',
          icon: TreePine,
          color: 'text-emerald-500',
          accent: '#10b981',
          bg: 'bg-emerald-500/5',
          border: 'border-emerald-500/20',
          formula: 'P_res = ∫(E_human * Ca) dt',
          philosophy: '"Phyto-Psychological Resonance (PPR). Mapping plant socialism and human engagement."',
          metrics: [
            { label: 'GROWTH RESILIENCE', val: '1.42x', icon: Target },
            { label: 'STEWARD SYNC', val: '99%', icon: Heart },
            { label: 'DNA SHARD INTEGRITY', val: '100%', icon: Binary },
          ],
          forgeTitle: 'Botanical Lineage Shard',
          forgeDesc: 'Document and anchor a specific seed lineage into the registry.',
          simControls: [
            { label: 'E: Engagement', val: p1, set: setP1, min: 0.1, max: 5, step: 0.1 },
            { label: 'Ca: Agro Code', val: p2, set: setP2, min: 1, max: 10, step: 0.1 },
          ],
          ledgerItems: [
            { id: 'SHD-PLA-882', name: 'Bantu Maize DNA Shard', hash: '0x882A_PLA', status: 'VERIFIED' },
            { id: 'SHD-PLA-104', name: 'Fungal Network Shard', hash: '0x104B_PLA', status: 'ARCHIVED' },
          ]
        };
      case 'aqua_portal':
        return {
          title: 'AQUA PORTAL',
          icon: Droplets,
          color: 'text-blue-500',
          accent: '#3b82f6',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/20',
          formula: 'W_eff = m * sqrt(V_storage / D_loss)',
          philosophy: '"Hydraulic Integrity Protocol. Precision moisture sharding and flow auditing."',
          metrics: [
            { label: 'FLOW VELOCITY', val: '12 L/s', icon: Gauge },
            { label: 'PURITY CONSTANT', val: '0.98', icon: FlaskConical },
            { label: 'STORAGE SHARD', val: '84%', icon: Database },
          ],
          forgeTitle: 'Water Purity Shard',
          forgeDesc: 'Verify and register an industrial water source purity report.',
          simControls: [
            { label: 'm: Resilience', val: p1, set: setP1, min: 1, max: 2, step: 0.01 },
            { label: 'V: Storage', val: p2, set: setP2, min: 100, max: 5000, step: 10 },
            { label: 'D: Loss', val: p3, set: setP3, min: 1, max: 100, step: 1 },
          ],
          ledgerItems: [
            { id: 'SHD-H2O-882', name: 'Sector 4 Aquifer Shard', hash: '0x882A_H2O', status: 'VERIFIED' },
            { id: 'SHD-H2O-104', name: 'Desalination Logic Shard', hash: '0x104B_H2O', status: 'ACTIVE' },
          ]
        };
      case 'soil_portal':
        return {
          title: 'SOIL PORTAL',
          icon: Mountain,
          color: 'text-orange-500',
          accent: '#f97316',
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/20',
          formula: 'S_health = Ca * τ_regen',
          philosophy: '"Biometric Substrate Sharding. Soil DNA sequencing and nutrient depth audits."',
          metrics: [
            { label: 'ORGANIC SHARD', val: '6.2%', icon: Sprout },
            { label: 'MINERAL STABILITY', val: '94%', icon: Layers },
            { label: 'THERMAL DEPTH', val: '22°C', icon: Thermometer },
          ],
          forgeTitle: 'Substrate Health Shard',
          forgeDesc: 'Commit regional soil mineral density data to the ledger.',
          simControls: [
            { label: 'Ca: Agro Code', val: p1, set: setP1, min: 1, max: 10, step: 0.1 },
            { label: 'τ: Regen Time', val: p2, set: setP2, min: 1, max: 100, step: 1 },
          ],
          ledgerItems: [
            { id: 'SHD-SOL-882', name: 'Micro-Nutrient Density Shard', hash: '0x882A_SOL', status: 'VERIFIED' },
            { id: 'SHD-SOL-104', name: 'Regen-Tilling Verification', hash: '0x104B_SOL', status: 'VERIFIED' },
          ]
        };
      case 'air_portal':
        return {
          title: 'AIR PORTAL',
          icon: Wind,
          color: 'text-sky-400',
          accent: '#38bdf8',
          bg: 'bg-sky-400/5',
          border: 'border-sky-400/20',
          formula: 'A_purity = 1 - (SID_load / O2)',
          philosophy: '"Atmospheric Carbon Sharding. Spectral auditing of gaseous transparency."',
          metrics: [
            { label: 'OXYGEN SATURATION', val: '21.4%', icon: Activity },
            { label: 'CARBON SHARD DENSITY', val: '412 ppm', icon: Binary },
            { label: 'ACOUSTIC CLARITY', val: '99%', icon: Waves },
          ],
          forgeTitle: 'Atmospheric Sync Shard',
          forgeDesc: 'Mint carbon sequestration potential based on air quality metrics.',
          simControls: [
            { label: 'SID: Viral Load', val: p1, set: setP1, min: 0, max: 100, step: 1 },
            { label: 'O2: Oxygen', val: p2, set: setP2, min: 50, max: 100, step: 1 },
          ],
          ledgerItems: [
            { id: 'SHD-AIR-882', name: 'Zone 4 Particulate Shard', hash: '0x882A_AIR', status: 'VERIFIED' },
            { id: 'SHD-AIR-104', name: 'Carbon Flux Shard', hash: '0x104B_AIR', status: 'ACTIVE' },
          ]
        };
      default:
        return {
          title: 'Resource Node',
          icon: Globe,
          color: 'text-slate-400',
          accent: '#94a3b8',
          bg: 'bg-slate-500/5',
          border: 'border-slate-500/20',
          formula: 'R = MC^2',
          philosophy: 'Resource Continuity.',
          metrics: [],
          forgeTitle: 'Generic Shard',
          forgeDesc: 'Mint a generic resource shard.',
          simControls: [],
          ledgerItems: []
        };
    }
  };

  const meta = getResourceMeta();

  const calculateSimResult = () => {
    switch (type) {
      case 'animal_world': return (p1 * p2) / p3;
      case 'plants_world': return (p1 * p2) * 10; 
      case 'aqua_portal': return p1 * Math.sqrt(p2 / p3);
      case 'soil_portal': return p1 * p2;
      case 'air_portal': return 1 - (p1 / p2);
      default: return 0;
    }
  };

  const simChartData = useMemo(() => {
    const base = calculateSimResult();
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        cycle: `T-${9-i}`,
        val: Number((base * (0.8 + Math.random() * 0.4)).toFixed(2))
      });
    }
    return data;
  }, [p1, p2, p3, type]);

  const handleRunOracleAudit = async () => {
    if (!oracleQuery.trim()) return;
    const fee = 15;
    if (!await onSpendEAC(fee, `${type.toUpperCase()}_ORACLE_DIAGNOSTIC`)) return;

    setIsAuditing(true);
    setOracleReport(null);
    try {
      const prompt = `Act as the EnvirosAgro ${meta.title} Oracle. 
      Execute a diagnostic audit for node ${user.esin}.
      QUERY: "${oracleQuery}"
      CONTEXT: ${user.location}, m-constant=${user.metrics.timeConstantTau}.
      Provide a technical 4-stage remediation shard focused on stabilizing the ${meta.formula} equilibrium.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setOracleReport(res.text);
      onEarnEAC(10, `${type.toUpperCase()}_ORACLE_CONTRIBUTION`);
    } catch (e) {
      setOracleReport("Diagnostic link timeout. Check registry sync.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleStartForge = () => {
    setForgeStep('sign');
  };

  const executeMint = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    
    const FORGE_FEE = 50;
    if (!await onSpendEAC(FORGE_FEE, `FORGING_${meta.forgeTitle.toUpperCase()}`)) return;

    setIsForging(true);
    try {
      const prompt = `Act as an EnvirosAgro Industrial Geneticist. Forge a unique resource shard for ${meta.title}.
      Identity: ${meta.forgeTitle}
      User Node: ${user.esin}
      Location: ${user.location}
      Mathematical Baseline: ${meta.formula}
      Generate a technical registry report anchoring this asset to the planetary grid.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setForgeResult(res.text);
      
      const shard: Partial<MediaShard> = {
        title: `RESOURCE_SHARD: ${meta.title}`,
        type: 'INGEST',
        source: `${meta.title} Portal`,
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}_${type.slice(0, 3).toUpperCase()}`,
        mImpact: (1.42 + Math.random() * 0.1).toFixed(2),
        content: res.text
      };
      
      await saveCollectionItem('media_ledger', shard);
      setForgeStep('success');
      onEarnEAC(25, `${type.toUpperCase()}_SHARD_MINTED`);
    } catch (e) {
      alert("Forge Handshake interrupted.");
    } finally {
      setIsForging(false);
    }
  };

  const handleAnchorSim = async () => {
    setIsSyncingSim(true);
    const fee = 10;
    if (!await onSpendEAC(fee, `SIMULATION_ANCHOR_${type.toUpperCase()}`)) {
      setIsSyncingSim(false);
      return;
    }
    setTimeout(() => {
      setIsSyncingSim(false);
      onEarnEAC(20, 'SIMULATION_VALUATION_BONUS');
      alert("SHARD_ANCHORED: Simulation state committed to the industrial archive.");
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1200px] mx-auto px-4">
      
      {/* 1. Portal Hero HUD */}
      <div className={`glass-card p-12 md:p-20 rounded-[80px] border-2 ${meta.border} bg-black/40 relative overflow-hidden flex flex-col items-center text-center space-y-10 group shadow-3xl`}>
         <div className="absolute inset-0 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none flex items-center justify-center">
            <meta.icon size={800} />
         </div>
         
         <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-black/60 border-2 ${meta.border} flex items-center justify-center shadow-3xl shrink-0 group-hover:scale-105 transition-all duration-700 relative overflow-hidden`}>
            <meta.icon className={`w-14 h-14 md:w-16 md:h-16 ${meta.color} relative z-10 drop-shadow-2xl`} />
         </div>

         <div className="space-y-8 relative z-10 w-full">
            <div className="space-y-4">
               <span className={`px-5 py-1.5 bg-black/40 ${meta.color} text-[10px] font-black uppercase rounded-full tracking-[0.4em] border ${meta.border} shadow-inner`}>
                  EOS_RESOURCE_SHARD_#842
               </span>
               <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                  {meta.title} <br/> <span className="text-white opacity-80">PORTAL</span>
               </h2>
               <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto opacity-90">
                 {meta.philosophy}
               </p>
            </div>

            <div className="flex flex-col items-center gap-8 pt-4">
               <button 
                onClick={() => setActiveInternalTab('forge')}
                className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(99,102,241,0.3)] flex items-center gap-4 transition-all active:scale-95 border-2 border-white/10 ring-8 ring-indigo-500/5"
               >
                  <CirclePlus size={24} /> Initialize {meta.title} Shard
               </button>
               
               <div 
                 onClick={() => setActiveInternalTab('sim')}
                 className="w-full max-w-2xl p-8 bg-black/80 rounded-[40px] border-4 border-double border-indigo-500/30 flex items-center gap-10 group/formula shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] cursor-pointer hover:border-emerald-500/40 transition-all active:scale-95"
               >
                  <div className="flex flex-col items-center gap-1">
                     <Calculator size={24} className="text-amber-500" />
                     <span className="text-[7px] font-black text-amber-500/60 uppercase">SIMULATE</span>
                  </div>
                  <p className="text-2xl md:text-4xl font-mono font-black text-slate-500 flex-1 tracking-widest text-center">
                    {meta.formula}
                  </p>
                  <div className="p-3 bg-white/5 rounded-xl text-slate-700 group-hover/formula:text-emerald-400 transition-colors">
                    <ArrowRight size={24} />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Resource Navigation Tabs */}
      <div className="flex justify-center pt-4">
        <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[32px] bg-black/40 border border-white/5 shadow-xl px-6 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Telemetry Overview', icon: Activity },
            { id: 'sim', label: 'Equation Simulator', icon: Calculator },
            { id: 'ledger', label: 'Resource Ledger', icon: HistoryIcon },
            { id: 'forge', label: 'Shard Forge', icon: FlaskConical },
            { id: 'oracle', label: 'Resource Oracle', icon: Bot },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveInternalTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeInternalTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Operational Content */}
      <div className="min-h-[700px] pt-10">
        
        {/* TAB: OVERVIEW */}
        {activeInternalTab === 'overview' && (
           <div className="space-y-20 animate-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {meta.metrics.map((m, i) => (
                   <div key={i} className="glass-card p-12 rounded-[80px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-10 group hover:border-white/10 transition-all shadow-3xl h-[480px]">
                      <div className="w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-6 group-hover:scale-110 transition-all shadow-inner">
                         <m.icon className={`w-12 h-12 ${meta.color}`} />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em] leading-none mb-4">{m.label}</p>
                         <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none m-0">{m.val}</h4>
                      </div>
                   </div>
                ))}
              </div>

              {/* Terminal Display */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 px-6">
                   <ArrowRight size={24} className={meta.color} />
                   <h4 className="text-xl font-black text-white uppercase italic tracking-widest">{type.replace('_', ' ').toUpperCase()} // INGEST_STREAM</h4>
                   <div className="flex items-center gap-2 ml-auto">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">SYNC_ACTIVE</span>
                   </div>
                </div>
                <div className="glass-card rounded-[56px] border border-white/10 bg-[#050706] p-10 font-mono text-[13px] h-[500px] overflow-y-auto custom-scrollbar shadow-inner relative group">
                   <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none animate-scan"></div>
                   <div className="space-y-8 relative z-10">
                      {stream.map((log, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-16 p-6 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors rounded-3xl group/log animate-in slide-in-from-right-2">
                           <div className="flex gap-6 shrink-0">
                              <span className="text-slate-800 font-bold">[{log.time}]</span>
                              <span className="text-indigo-400 font-bold uppercase italic tracking-widest">[{log.event}]</span>
                           </div>
                           <div className="flex-1 text-slate-300 flex items-center justify-between">
                              <span className="truncate">PACKET: {log.id} // VAL: <span className={log.status === 'OK' ? 'text-emerald-400 font-black' : 'text-rose-500 font-black'}>{log.val}</span></span>
                              <div className={`px-4 py-1 rounded-lg text-[9px] font-black tracking-widest border ${log.status === 'OK' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse'}`}>{log.status}</div>
                           </div>
                        </div>
                      ))}
                      {stream.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
                           <Loader2 size={80} className="animate-spin mb-6" />
                           <p className="text-4xl font-black uppercase tracking-[0.5em]">BUFFER_EMPTY</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* TAB: LEDGER */}
        {activeInternalTab === 'ledger' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="flex justify-between items-end border-b border-white/5 pb-10 px-6 gap-8">
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Resource <span className="text-emerald-400">Ledger</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">"Immutable archive of finalized {meta.title.toLowerCase()} shards."</p>
                 </div>
              </div>
              <div className="glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl">
                 <div className="grid grid-cols-5 p-12 border-b border-white/10 bg-white/[0.01] text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] italic px-16">
                    <span className="col-span-2">Shard Identity</span>
                    <span>Status</span>
                    <span>Registry Hash</span>
                    <span className="text-right">Finality</span>
                 </div>
                 <div className="divide-y divide-white/5 bg-[#050706]">
                    {meta.ledgerItems?.map((item: any, i: number) => (
                       <div key={item.id} className="grid grid-cols-5 p-12 hover:bg-white/[0.02] transition-all items-center group animate-in fade-in">
                          <div className="col-span-2 flex items-center gap-10">
                             <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center group-hover:scale-110 transition-all shadow-inner">
                                <Database size={28} className="text-indigo-400" />
                             </div>
                             <div>
                                <p className="text-2xl font-black text-white uppercase italic leading-none m-0">{item.name}</p>
                                <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{item.id}</p>
                             </div>
                          </div>
                          <div>
                             <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border tracking-widest ${item.status === 'VERIFIED' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-600/10 text-blue-400 border-blue-500/20'}`}>{item.status}</span>
                          </div>
                          <div className="text-sm text-slate-500 font-mono italic">
                             {item.hash}
                          </div>
                          <div className="flex justify-end pr-8">
                             <div className="p-4 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl text-emerald-400 shadow-xl group-hover:scale-110 transition-all">
                                <ShieldCheck size={24} />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* TAB: ORACLE */}
        {activeInternalTab === 'oracle' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-700">
              <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 text-center space-y-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={800} /></div>
                 <div className="relative z-10 space-y-10">
                    <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl mx-auto border-4 border-white/10 group-hover:rotate-12 transition-transform animate-float">
                       <Bot size={64} className="text-white animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter m-0 leading-none">RESOURCE <span className="text-indigo-400">ORACLE</span></h3>
                       <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">"Synthesizing high-frequency remediation shards for {meta.title.toLowerCase()} anomalies."</p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-8">
                       <textarea 
                          value={oracleQuery} 
                          onChange={e => setOracleQuery(e.target.value)}
                          placeholder="Describe the resource anomaly or diagnostic requirement..."
                          className="w-full bg-black/60 border-2 border-white/10 rounded-[40px] p-10 text-white text-lg font-medium italic focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-stone-800"
                       />
                       <button 
                          onClick={handleRunOracleAudit}
                          disabled={isAuditing || !oracleQuery.trim()}
                          className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-20"
                       >
                          {isAuditing ? <Loader2 size={32} className="animate-spin" /> : <Zap size={32} className="fill-current" />}
                          {isAuditing ? 'AUDITING REGISTRY...' : 'COMMENCE DIAGNOSTIC'}
                       </button>
                    </div>
                 </div>
              </div>
              {oracleReport && (
                <div className="animate-in slide-in-from-bottom-10 duration-700">
                   <div className="p-12 md:p-16 bg-black/80 rounded-[80px] border-2 border-emerald-500/20 shadow-3xl border-l-[24px] border-l-emerald-600 relative overflow-hidden group/advice">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/advice:scale-110 transition-transform"><Sparkles size={600} className="text-emerald-400" /></div>
                      <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                         <div className="flex items-center gap-6">
                            <BadgeCheck size={40} className="text-emerald-400" />
                            <h4 className="text-3xl font-black text-white uppercase italic m-0">Audit Verdict</h4>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-black uppercase">Consensus confidence</p>
                            <p className="text-3xl font-mono font-black text-emerald-400">99.8%</p>
                         </div>
                      </div>
                      <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l border-white/5">
                         {oracleReport}
                      </div>
                      <div className="mt-16 flex justify-center gap-8 relative z-10">
                         <button onClick={() => downloadReport(oracleReport || "", "Resource_Audit", meta.title)} className="px-12 py-6 bg-white/5 border-2 border-white/10 rounded-full text-[13px] font-black uppercase text-slate-500 hover:text-white transition-all">DOWNLOAD_SHARD</button>
                         <button onClick={() => {setOracleReport(null); setOracleQuery('');}} className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-[13px] uppercase shadow-xl transition-all">ACKNOWLEDGE FINALITY</button>
                      </div>
                   </div>
                </div>
              )}
           </div>
        )}

        {/* TAB: FORGE */}
        {activeInternalTab === 'forge' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><FlaskConical size={800} className="text-indigo-400" /></div>
                {forgeStep === 'input' && (
                  <div className="space-y-10 relative z-10">
                     <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto animate-float">
                        <Plus size={64} className="text-white" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter m-0">MINT <span className="text-indigo-400">SHARD</span></h3>
                        <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto">"Anchoring a new ${meta.title.toLowerCase()} asset into the decentralized agrarian registry."</p>
                     </div>
                     <div className="p-10 bg-black/60 rounded-[56px] border border-white/10 space-y-8 shadow-inner">
                        <div className="space-y-2">
                           <h5 className="text-xl font-black text-white uppercase italic">{meta.forgeTitle}</h5>
                           <p className="text-slate-500 italic">"{meta.forgeDesc}"</p>
                        </div>
                        <div className="h-px w-full bg-white/5"></div>
                        <div className="flex justify-between items-center px-10">
                           <div className="text-left">
                              <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Forging Fee</p>
                              <p className="text-3xl font-mono font-black text-emerald-400">50 EAC</p>
                           </div>
                           <button onClick={() => setForgeStep('sign')} className="px-16 py-6 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all">INITIALIZE FORGE</button>
                        </div>
                     </div>
                  </div>
                )}

                {forgeStep === 'sign' && (
                  <div className="space-y-12 relative z-10 animate-in slide-in-from-right-10">
                     <div className="text-center space-y-8">
                        <div className="w-32 h-32 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-[44px] flex items-center justify-center mx-auto text-indigo-400 shadow-3xl group relative overflow-hidden">
                           <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                           <Fingerprint size={48} className="relative z-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Node <span className="text-indigo-400">Signature</span></h4>
                     </div>
                     <div className="space-y-4 max-w-xl mx-auto w-full">
                        <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center">Auth Signature (ESIN)</label>
                        <input 
                           type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                           placeholder="EA-XXXX-XXXX-XXXX" 
                           className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                        />
                     </div>
                     <button 
                       onClick={executeMint}
                       disabled={isForging || !esinSign}
                       className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_150px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-10 border-4 border-white/10 ring-[24px] ring-white/5"
                     >
                        {isForging ? <Loader2 size={40} className="animate-spin" /> : <Stamp size={40} className="fill-current" />}
                        {isForging ? "ANCHORING SHARD..." : "AUTHORIZE FORGE"}
                     </button>
                  </div>
                )}

                {forgeStep === 'success' && (
                  <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-10 animate-in zoom-in duration-1000 text-center relative z-10">
                     <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_200px_rgba(16,185,129,0.5)] scale-110 relative group">
                        <CheckCircle2 size={120} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                     </div>
                     <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Shard <span className="text-emerald-400">Forged.</span></h3>
                     <button onClick={() => setForgeStep('input')} className="px-24 py-8 bg-white/5 border border-white/10 rounded-[48px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Forge</button>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* TAB: EQUATION SIMULATOR */}
        {activeInternalTab === 'sim' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="lg:col-span-4 space-y-8">
               <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-8 px-2">
                     <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl">
                        <Settings size={28} className="text-white" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Parameter <span className="text-indigo-400">Sync</span></h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">SHARD_ID: {type.toUpperCase()}_SIM</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     {meta.simControls?.map((ctrl: any, i: number) => (
                        <div key={i} className="space-y-4 group">
                           <div className="flex justify-between items-center px-4">
                              <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest group-hover:text-white transition-colors">{ctrl.label}</label>
                              <span className="text-xl font-mono font-black text-white group-hover:text-emerald-400 transition-all">{ctrl.val}</span>
                           </div>
                           <input 
                              type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} 
                              value={ctrl.val} 
                              onChange={e => ctrl.set(parseFloat(e.target.value))}
                              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500 shadow-inner group-hover:h-3 transition-all" 
                           />
                        </div>
                     ))}
                  </div>

                  <button 
                    onClick={handleAnchorSim}
                    disabled={isSyncingSim}
                    className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 border-4 border-white/10 ring-8 ring-white/5"
                  >
                     {isSyncingSim ? <Loader2 size={24} className="animate-spin" /> : <Stamp size={24} />}
                     {isSyncingSim ? 'ANCHORING SHARD...' : 'ANCHOR SIMULATION'}
                  </button>
               </div>

               <div className={`p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-4 group`}>
                  <div className="flex items-center gap-3">
                     <Info size={16} className="text-blue-400" />
                     <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Simulation Logic</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 italic leading-relaxed">
                     "Tuning these variables locally allows for predictive m-constant forecasting before committing resources to the physical grid."
                  </p>
               </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
               <div className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-[#050706] relative overflow-hidden flex flex-col h-full shadow-3xl">
                  <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
                  
                  <div className="flex justify-between items-center mb-16 relative z-10 px-6">
                     <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl bg-black border-2 border-white/10 flex items-center justify-center ${meta.color} shadow-2xl`}>
                           <Binary size={32} />
                        </div>
                        <div>
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Resonance Coefficient Output</p>
                           <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">{meta.formula}</h4>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-2 italic leading-none">RESULT_VAL</p>
                        <h5 className="text-8xl font-mono font-black text-white leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">{calculateSimResult().toFixed(2)}</h5>
                     </div>
                  </div>

                  <div className="flex-1 w-full relative z-10 p-4 bg-black/40 rounded-[56px] border border-white/5 shadow-inner">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simChartData}>
                           <defs>
                              <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor={meta.accent} stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor={meta.accent} stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                           <XAxis dataKey="cycle" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                           <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                           <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                           <Area type="monotone" name="Projected Equilibrium" dataKey="val" stroke={meta.accent} strokeWidth={8} fillOpacity={1} fill="url(#colorSim)" strokeLinecap="round" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10 px-8">
                     <div className="flex items-center gap-6">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                        <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">SIM_QUORUM_STABLE</span>
                     </div>
                     <p className="text-[10px] text-slate-800 font-mono italic">EOS_MATH_CORE_v6.5 // HANDSHAKE_NOMINAL</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default NaturalResources;