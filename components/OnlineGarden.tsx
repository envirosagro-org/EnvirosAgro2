
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flower, 
  Satellite, 
  Map as MapIcon, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  CloudSun, 
  Droplets, 
  Thermometer, 
  Binary, 
  Target, 
  History, 
  PlusCircle, 
  ArrowLeftCircle,
  Database,
  SearchCode,
  Globe,
  Loader2,
  Lock,
  Stamp,
  Fingerprint,
  Wind,
  CircleDot,
  CheckCircle2, 
  Sprout, 
  RefreshCw, 
  Info, 
  Terminal, 
  Users, 
  Building2, 
  Factory, 
  Cpu, 
  Waves, 
  Heart, 
  Boxes, 
  ShieldAlert, 
  ArrowUpRight, 
  ClipboardList, 
  Activity, 
  Scan, 
  Wallet, 
  PawPrint, 
  Mountain, 
  FileUp, 
  Camera, 
  RotateCcw, 
  BadgeCheck, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon, 
  Timer, 
  LayoutGrid, 
  Trophy,
  HardHat,
  // Added Coins to resolve the ReferenceError
  Coins
} from 'lucide-react';
import { User, ViewState, AgroResource } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface OnlineGardenProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onNavigate: (view: ViewState) => void;
}

const STEWARD_ROLES = [
  { id: 'industrial', name: 'Industrial Steward', icon: Factory, desc: 'Focus on processing, logistics, and value enhancement shards.' },
  { id: 'biological', name: 'Biological Steward', icon: Sprout, desc: 'Focus on field telemetry, crop health, and soil DNA.' },
  { id: 'hybrid', name: 'Phygital Steward', icon: Zap, desc: 'Synchronizing physical land with advanced industrial flows.' },
];

const SEEDING_STEPS = [
  { id: 'seeding', label: '1. SEEDING', icon: PlusCircle, desc: 'Initialize Resource Shard' },
  { id: 'care', label: '2. CARE', icon: Heart, desc: 'Maintain Resonance' },
  { id: 'harvest', label: '3. HARVEST', icon: Trophy, desc: 'Collect Yield' },
  { id: 'worker', label: '4. AGRO WORKER', icon: HardHat, desc: 'Professional Mastery' },
];

const RESOURCE_TYPES = [
  { id: 'plant', label: 'Plant Shard', icon: Sprout, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'animal', label: 'Animal Node', icon: PawPrint, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'water', label: 'Aqua Sink', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'soil', label: 'Soil Forge', icon: Mountain, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { id: 'air', label: 'Air Buffer', icon: Wind, color: 'text-sky-400', bg: 'bg-sky-500/10' },
];

const MOCK_TELEM = [
  { label: 'Plant Resonance', val: '1.42x', status: 'STABLE', col: 'text-emerald-400' },
  { label: 'Soil DNA Index', val: '0.98', status: 'NOMINAL', col: 'text-blue-400' },
  { label: 'Carbon Shard', val: '412ppm', status: 'SYNCING', col: 'text-indigo-400' },
];

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'twin' | 'seeding_program' | 'roadmap' | 'mining'>('twin');
  const [seedingPhase, setSeedingPhase] = useState<'seeding' | 'care' | 'harvest' | 'worker'>('seeding');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('plant');
  
  // Seeding Form States
  const [isProcessing, setIsProcessing] = useState(false);
  const [seedingSuccess, setSeedingSuccess] = useState(false);
  const [esinSign, setEsinSign] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isForgingRoadmap, setIsForgingRoadmap] = useState(false);
  const [roadmapShard, setRoadmapShard] = useState<string | null>(null);

  // Animal Specific Ingest
  const [animalBiodata, setAnimalBiodata] = useState('');
  const [isIngestingAnimal, setIsIngestingAnimal] = useState(false);

  // Care phase states
  const [careCycles, setCareCycles] = useState(0);
  const [resonance, setResonance] = useState(75);

  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );
  
  const hasPhysicalLand = landResources.length > 0;
  
  const dossierStrength = useMemo(() => {
    let base = 20; 
    if (hasPhysicalLand) base += 40;
    const skillCount = Object.keys(user.skills || {}).length;
    base += Math.min(skillCount * 5, 40);
    return base;
  }, [hasPhysicalLand, user.skills]);

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(5, 'UNIVERSAL_TWIN_SYNC');
      alert("REGISTRY SYNC COMPLETE: Node telemetry consolidated across industrial shards.");
    }, 2000);
  };

  const handleGenerateRoadmap = async () => {
    setIsForgingRoadmap(true);
    setRoadmapShard(null);
    try {
      const prompt = `Act as an EnvirosAgro Career Oracle. Analyze my stewardship profile:
      Dossier Strength: ${dossierStrength}%
      Physical Land: ${hasPhysicalLand ? 'Verified' : 'None'}
      Role: Biological Steward
      
      Provide a strategic roadmap shard to help me achieve Agro Worker status. Focus on app contributions and SEHTI alignment.`;
      const res = await chatWithAgroExpert(prompt, []);
      setRoadmapShard(res.text);
    } catch (e) {
      setRoadmapShard("Oracle connection failed. Registry sync required.");
    } finally {
      setIsForgingRoadmap(false);
    }
  };

  const handleSeedResource = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSeedingSuccess(true);
      onEarnEAC(10, `RESOURCE_SEED_INIT_${selectedResourceType.toUpperCase()}`);
    }, 2000);
  };

  const handleCareAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCareCycles(prev => prev + 1);
      setResonance(prev => Math.min(100, prev + 5));
      onEarnEAC(2, 'RESOURCE_CARE_SYNC');
    }, 1500);
  };

  const handleFinalHarvest = () => {
    if (resonance < 90) {
      alert("HARVEST_DENIED: Resonance must be > 90%. Execute more CARE actions.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSeedingPhase('worker');
      onEarnEAC(100, 'HARVEST_CYCLE_COMPLETE');
      alert("HARVEST SUCCESSFUL: Resource sharded and value anchored. You have progressed toward AGRO WORKER status.");
    }, 3000);
  };

  const orbitalParticles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      size: 4 + Math.random() * 8,
      duration: 15 + Math.random() * 25,
      delay: -(Math.random() * 30),
      radius: 80 + Math.random() * 60,
      type: i % 3 === 0 ? 'bio' : i % 3 === 1 ? 'ind' : 'sys'
    }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* Header HUD */}
      <div className="flex justify-between items-center px-4">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-emerald-600/10 transition-all group"
        >
          <ArrowLeftCircle className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Return to Command Center
        </button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-emerald-400 font-black uppercase tracking-widest">Shard: PRODUCT_INGEST</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s] pointer-events-none">
              <Globe className="w-96 h-96 text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className={`w-40 h-40 rounded-[48px] ${hasPhysicalLand ? 'bg-emerald-600 shadow-[0_0_80px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 shadow-[0_0_80px_rgba(99,102,241,0.3)]'} flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden transition-all duration-1000`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {hasPhysicalLand ? <Flower className="w-20 h-20 text-white animate-spin-slow" /> : <Boxes className="w-20 h-20 text-white animate-float" />}
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-2xl border border-white/20 bg-black/80 flex flex-col items-center">
                 <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Dossier Strength</p>
                 <p className={`text-xl font-mono font-black ${dossierStrength > 50 ? 'text-emerald-400' : 'text-indigo-400'}`}>{dossierStrength}%</p>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">
                    {hasPhysicalLand ? 'BIO_ANCHORED_SHARD' : 'CONCEPTUAL_WORK_SHARD'}
                 </span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Online <span className="text-emerald-400">Garden</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl italic leading-relaxed">
                 "Your Universal Registry Landmass. Consolidating every industrial action and biological vouch into a single Digital Twin of your stewardship."
              </p>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:justify-between">
           {[
             { label: 'EAC Yielded', val: user.wallet.lifetimeEarned, icon: Coins, col: 'text-emerald-400' },
             { label: 'Care Cycles', val: careCycles, icon: Heart, col: 'text-rose-500' },
             { label: 'Mining Stats', val: resonance + '%', icon: Zap, col: 'text-amber-500' },
             { label: 'Registry Rank', val: 'Steward', icon: ShieldCheck, col: 'text-blue-400' },
           ].map((s, i) => (
             <div key={i} className="glass-card p-6 rounded-[32px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-2 group hover:border-emerald-500/20 transition-all shadow-lg">
                <s.icon className={`w-6 h-6 ${s.col} group-hover:scale-110 transition-transform`} />
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{s.label}</p>
                <p className="text-xl font-black text-white font-mono">{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-1.5 glass-card rounded-[32px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-xl px-4 mx-auto lg:mx-0">
        {[
          { id: 'twin', label: 'Universal Twin', icon: Satellite },
          { id: 'seeding_program', label: 'Seeding Program', icon: Sprout },
          { id: 'roadmap', label: 'Steward Roadmap', icon: MapIcon },
          { id: 'mining', label: 'Value Mining', icon: Zap },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">
        {/* --- TAB: SEEDING PROGRAM --- */}
        {activeTab === 'seeding_program' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
             {/* SEEDING PROGRESS TRACKER - Scrollable for small frames */}
             <div className="flex overflow-x-auto scrollbar-hide py-4 px-2 gap-4">
                {SEEDING_STEPS.map((s, i) => (
                  <div 
                    key={s.id} 
                    className={`flex-1 min-w-[200px] glass-card p-6 rounded-[32px] border-2 transition-all duration-700 flex flex-col items-center text-center gap-4 ${
                      seedingPhase === s.id ? 'border-emerald-500 bg-emerald-500/10 shadow-xl scale-105' : 'border-white/5 bg-black/40 opacity-40'
                    }`}
                  >
                     <div className={`p-4 rounded-2xl ${seedingPhase === s.id ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                        <s.icon size={24} className="text-white" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">{s.label}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic">{s.desc}</p>
                     </div>
                     {i < SEEDING_STEPS.length - 1 && (
                       <div className="w-full h-1 bg-white/5 rounded-full mt-2">
                          <div className={`h-full bg-emerald-500 transition-all duration-1000 ${seedingPhase === s.id ? 'w-1/2 animate-pulse' : ''}`}></div>
                       </div>
                     )}
                  </div>
                ))}
             </div>

             {/* SEEDING CONTENT */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                   {/* PHASE 1: SEEDING FORM */}
                   {seedingPhase === 'seeding' && !seedingSuccess && (
                      <div className="glass-card p-12 rounded-[56px] border border-white/10 bg-black/40 shadow-3xl space-y-10 animate-in slide-in-from-bottom-8">
                         <div className="flex items-center gap-6">
                            <div className="p-5 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20"><PlusCircle size={32} className="text-emerald-400" /></div>
                            <div>
                               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Initialize <span className="text-emerald-400">Resource Shard</span></h3>
                               <p className="text-slate-500 text-sm mt-2">"Seeding is the first industrial step in the lifecycle of a natural asset."</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {RESOURCE_TYPES.map(res => (
                               <button 
                                 key={res.id} 
                                 onClick={() => setSelectedResourceType(res.id)}
                                 className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 ${
                                   selectedResourceType === res.id ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-xl' : 'border-white/5 bg-black/40 text-slate-600'
                                 }`}
                               >
                                  <res.icon size={28} className={selectedResourceType === res.id ? res.color : 'text-slate-800'} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{res.label}</span>
                               </button>
                            ))}
                         </div>

                         {selectedResourceType === 'animal' && (
                           <div className="p-8 bg-black/60 rounded-[44px] border border-amber-500/20 space-y-6 animate-in zoom-in">
                              <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                 <Database size={20} className="text-amber-500" />
                                 <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Animal Biodata Ingest</h4>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Biometric Payload (Age, Species, Health Shard)</label>
                                 <textarea 
                                    value={animalBiodata}
                                    onChange={e => setAnimalBiodata(e.target.value)}
                                    placeholder="Enter animal technical specs or past health registry hash..."
                                    className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white text-xs h-32 outline-none focus:ring-4 focus:ring-amber-500/10 italic shadow-inner"
                                 />
                                 <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-3">
                                       <FileUp size={16} /> Attach Biometric Photo
                                    </button>
                                 </div>
                              </div>
                           </div>
                         )}

                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] block text-center">Node Auth Signature (ESIN)</label>
                               <input 
                                 type="text" 
                                 value={esinSign}
                                 onChange={e => setEsinSign(e.target.value)}
                                 placeholder="EA-XXXX-XXXX-XXXX"
                                 className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all uppercase placeholder:text-slate-900 tracking-widest shadow-inner" 
                               />
                            </div>
                            <button 
                              onClick={handleSeedResource}
                              disabled={isProcessing || !esinSign}
                              className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all"
                            >
                               {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8" />}
                               {isProcessing ? 'SYNCHRONIZING REGISTRY...' : 'AUTHORIZE SEEDING HANDSHAKE'}
                            </button>
                         </div>
                      </div>
                   )}

                   {seedingSuccess && seedingPhase === 'seeding' && (
                      <div className="glass-card p-16 rounded-[64px] border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in">
                         <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-3xl scale-110 relative">
                            <CheckCircle2 size={96} className="text-white animate-pulse" />
                            <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">Shard <span className="text-emerald-400">Anchored</span></h3>
                            <p className="text-slate-400 text-xl font-medium italic">"Seeding protocol complete. Resource now provisional in registry."</p>
                         </div>
                         <button 
                           onClick={() => { setSeedingPhase('care'); setSeedingSuccess(false); }}
                           className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 transition-all"
                         >
                            MOVE TO CARE PHASE
                         </button>
                      </div>
                   )}

                   {/* PHASE 2: CARE */}
                   {seedingPhase === 'care' && (
                      <div className="space-y-10 animate-in slide-in-from-right-4">
                         <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-black/60 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Heart size={300} className="text-rose-500" /></div>
                            <div className="flex items-center gap-6 relative z-10 mb-12">
                               <div className="w-20 h-20 bg-rose-600/10 rounded-[32px] flex items-center justify-center border border-rose-500/20 shadow-xl group-hover:rotate-6 transition-transform">
                                  <Heart size={40} className="text-rose-500 fill-current" />
                               </div>
                               <div>
                                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Resource <span className="text-rose-500">Care Lab</span></h3>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Active Cycle Support: Njahi Season</p>
                               </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                               <div className="space-y-8">
                                  <div className="p-10 bg-black/80 rounded-[48px] border border-white/10 space-y-6 shadow-inner text-center">
                                     <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em]">Shard Resonance</p>
                                     <h5 className="text-9xl font-mono font-black text-emerald-400 tracking-tighter">{resonance}%</h5>
                                     <div className="h-2 bg-white/5 rounded-full overflow-hidden w-full">
                                        <div className="h-full bg-emerald-500 transition-all duration-[2s] shadow-[0_0_20px_#10b981]" style={{ width: `${resonance}%` }}></div>
                                     </div>
                                  </div>
                                  <div className="flex justify-between items-center px-4 text-slate-600 font-black text-[10px] uppercase">
                                     <span>Verified Care Cycles</span>
                                     <span className="text-white font-mono">{careCycles} / 10</span>
                                  </div>
                               </div>

                               <div className="space-y-8 flex flex-col justify-center">
                                  <div className="p-8 bg-white/5 rounded-[44px] border border-white/10 shadow-xl space-y-4 group/action hover:border-emerald-500/30 transition-all">
                                     <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-white uppercase italic">Bio-Sync care</h4>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover/action:scale-110 transition-transform"><RefreshCw size={20} /></div>
                                     </div>
                                     <p className="text-xs text-slate-500 italic">"Manual telemetry upload or acoustic calibration to reduce stress (S)."</p>
                                     <button 
                                       onClick={handleCareAction}
                                       disabled={isProcessing}
                                       className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
                                     >
                                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} fill="currentColor" />}
                                        INITIALIZE CARE SHARD
                                     </button>
                                  </div>
                                  {resonance >= 90 && (
                                     <div className="p-8 bg-blue-600/10 border border-blue-500/30 rounded-[44px] animate-in slide-in-from-bottom-2 text-center space-y-4">
                                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Resonance Peak Reached</p>
                                        <button 
                                          onClick={() => setSeedingPhase('harvest')}
                                          className="w-full py-6 bg-blue-600 hover:bg-blue-500 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all"
                                        >
                                           PROCEED TO HARVEST
                                        </button>
                                     </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   )}

                   {/* PHASE 3: HARVEST */}
                   {seedingPhase === 'harvest' && (
                      <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700">
                         <div className="p-16 glass-card rounded-[80px] border border-emerald-500/30 bg-emerald-950/10 shadow-3xl text-center space-y-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><Trophy size={500} className="text-emerald-400" /></div>
                            
                            <div className="relative z-10 space-y-8">
                               <div className="w-32 h-32 bg-emerald-600 rounded-[48px] flex items-center justify-center text-white mx-auto shadow-[0_0_80px_rgba(16,185,129,0.4)] animate-float">
                                  <Trophy size={64} />
                               </div>
                               <div>
                                  <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">HARVEST <span className="text-emerald-400">SYNC</span></h3>
                                  <p className="text-slate-400 text-2xl font-medium mt-4 italic">"Consolidating biological growth into sharded economic utility."</p>
                               </div>
                            </div>

                            <div className="p-12 bg-black/80 rounded-[64px] border border-white/5 grid grid-cols-2 gap-12 relative z-10 shadow-inner">
                               <div className="text-center space-y-2 border-r border-white/5">
                                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Quality Factor (Ca)</p>
                                  <p className="text-5xl font-mono font-black text-white">1.84x</p>
                               </div>
                               <div className="text-center space-y-2">
                                  <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">EAC Bounty Shard</p>
                                  <p className="text-5xl font-mono font-black text-emerald-400">+100</p>
                               </div>
                            </div>

                            <button 
                              onClick={handleFinalHarvest}
                              disabled={isProcessing}
                              className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center justify-center gap-6 ring-8 ring-white/5"
                            >
                               {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Target size={80} />}
                               {isProcessing ? 'FINALIZING LEDGER...' : 'AUTHORIZE FINAL HARVEST'}
                            </button>
                         </div>
                      </div>
                   )}

                   {/* PHASE 4: AGRO WORKER */}
                   {seedingPhase === 'worker' && (
                      <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-1000">
                         <div className="p-20 glass-card rounded-[80px] border border-blue-500/20 bg-blue-950/5 relative overflow-hidden group shadow-3xl text-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1600')] bg-cover opacity-5"></div>
                            <div className="w-40 h-40 bg-blue-600 rounded-[56px] flex items-center justify-center text-white mx-auto shadow-3xl relative z-10 ring-[20px] ring-white/5">
                               <HardHat size={80} />
                            </div>
                            <div className="space-y-6 relative z-10 mt-12">
                               <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0">AGRO <span className="text-blue-400 underline">WORKER</span></h2>
                               <p className="text-2xl text-slate-400 font-medium italic max-w-2xl mx-auto leading-relaxed">"You have successfully navigated the seeder-to-harvest pipeline. You are now certified for high-tier industrial mission sharding."</p>
                            </div>
                            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto relative z-10 pt-16 border-t border-white/10 mt-16">
                               {[
                                 { l: 'Mastery', v: 'Lvl 1', i: BadgeCheck, c: 'text-blue-400' },
                                 { l: 'Trust Index', v: '99.9%', i: ShieldCheck, c: 'text-emerald-400' },
                                 { l: 'Node Rank', v: 'Master', i: Trophy, c: 'text-amber-500' },
                               ].map((m, i) => (
                                 <div key={i} className="space-y-2">
                                    <m.i size={24} className={`${m.c} mx-auto mb-2`} />
                                    <p className="text-4xl font-mono font-black text-white tracking-tighter">{m.v}</p>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{m.l}</p>
                                 </div>
                               ))}
                            </div>
                            <div className="mt-20 flex flex-wrap justify-center gap-8 relative z-10">
                               <button 
                                 onClick={() => onNavigate('industrial')}
                                 className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/20"
                               >
                                  ENTER INDUSTRIAL CLOUD
                               </button>
                               <button 
                                 onClick={() => { setSeedingPhase('seeding'); setSeedingSuccess(false); }}
                                 className="px-12 py-8 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl"
                               >
                                  Begin New Shard Lifecycle
                               </button>
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                <div className="lg:col-span-4 space-y-10">
                   <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/10 space-y-10 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Info size={250} className="text-blue-400" /></div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-3 bg-blue-500 rounded-2xl shadow-xl"><Info size={24} className="text-white" /></div>
                         <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Program <span className="text-blue-400">Logic</span></h4>
                      </div>
                      <div className="space-y-8 relative z-10">
                         <div className="p-6 bg-black/60 rounded-[40px] border border-white/5 shadow-inner">
                            <p className="text-sm text-slate-400 italic leading-relaxed">
                               "The Seeding Program is the primary onboarding bridge for new stewards. Navigate the lifecycle of resource care to unlock professional industrial tiers."
                            </p>
                         </div>
                         <div className="space-y-6">
                            {[
                               { label: 'Seeding', desc: 'Initialize biometric registry', icon: PlusCircle, c: 'text-emerald-500' },
                               { label: 'Care', desc: 'Maintain resonance frequency', icon: Heart, c: 'text-rose-500' },
                               { label: 'Harvest', desc: 'Fractionalize growth value', icon: Target, c: 'text-amber-500' },
                            ].map((l, i) => (
                               <div key={i} className="flex items-center gap-6 group/item cursor-help">
                                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${l.c} group-hover/item:scale-110 transition-transform`}><l.icon size={16} /></div>
                                  <div>
                                     <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{l.label}</p>
                                     <p className="text-[8px] text-slate-600 font-bold uppercase">{l.desc}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                      <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                         <Users size={16} className="text-indigo-400" /> Peer Activity
                      </h5>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-emerald-500">S</div>
                                  <div>
                                     <p className="text-xs font-black text-white uppercase italic truncate">Steward_{i*14}</p>
                                     <p className="text-[8px] text-slate-600 font-mono">Harvest Shard #882_X</p>
                                  </div>
                               </div>
                               <span className="text-[9px] font-mono font-black text-emerald-400">+50 EAC</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'twin' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-500">
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] shadow-3xl group">
                 <div className={`absolute inset-0 transition-all duration-[2s] bg-cover opacity-10 grayscale group-hover:grayscale-0 ${hasPhysicalLand ? "bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600')]" : "bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=1600')]"}`}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                 
                 <div className="relative z-10 flex flex-col items-center gap-12 w-full">
                    <div className="relative w-96 h-96 flex items-center justify-center">
                       <div className="absolute inset-0 border-4 border-dashed border-white/5 rounded-full animate-spin-slow"></div>
                       <div className={`w-56 h-56 rounded-[64px] flex items-center justify-center shadow-[0_0_100px_current] border-2 transition-all duration-[2s] ${hasPhysicalLand ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-indigo-500/20 border-indigo-500 text-indigo-400'}`}>
                          {hasPhysicalLand ? <Flower size={96} className="animate-pulse" /> : <Boxes size={96} className="animate-float" />}
                          {!hasPhysicalLand && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap bg-indigo-500/90 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl">
                               <ShieldAlert size={12} /> Conceptual Shard Active
                            </div>
                          )}
                       </div>
                       
                       {orbitalParticles.map((p) => (
                         <div 
                           key={p.id}
                           className="absolute"
                           style={{
                             width: `${p.radius * 2}px`,
                             height: `${p.radius * 2}px`,
                             animation: `spin ${p.duration}s linear infinite`,
                             animationDelay: `${p.delay}s`
                           }}
                         >
                           <div 
                             className={`absolute rounded-xl border flex items-center justify-center shadow-lg transition-all group-hover:scale-125 ${p.type === 'bio' ? 'bg-emerald-500/10 border-emerald-500/20' : p.type === 'ind' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}
                             style={{
                               width: `${p.size * 5}px`,
                               height: `${p.size * 5}px`,
                               top: '0',
                               left: '50%',
                               transform: 'translateX(-50%)'
                             }}
                             title={`${p.type.toUpperCase()} Contribution`}
                           >
                             {p.type === 'bio' ? <Sprout size={p.size * 2} className="text-emerald-500" /> : 
                              p.type === 'ind' ? <Factory size={p.size * 2} className="text-blue-500" /> : 
                              <Activity size={p.size * 2} className="text-amber-500" />}
                           </div>
                         </div>
                       ))}
                    </div>

                    <div className="text-center space-y-4">
                       <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Consolidated <span className={hasPhysicalLand ? 'text-emerald-400' : 'text-indigo-400'}>{hasPhysicalLand ? 'Bio-Shard' : 'Industrial Shard'}</span></h3>
                       <p className="text-slate-400 text-xl font-medium italic">"Consolidating work from Live Farming, TQM, and Marketplace nodes."</p>
                    </div>

                    <button 
                      onClick={handleSyncTelemetry}
                      disabled={isSyncing}
                      className={`px-16 py-8 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-6 disabled:opacity-50 ${hasPhysicalLand ? 'agro-gradient' : 'bg-indigo-600 shadow-indigo-900/40'}`}
                    >
                       {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                       {isSyncing ? 'SYNCING NETWORK...' : 'INITIALIZE REGISTRY SYNC'}
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-4">
                       <Terminal className="w-6 h-6 text-indigo-400" /> Unified <span className="text-indigo-400">HUD</span>
                    </h4>
                    <div className="space-y-6">
                       {MOCK_TELEM.map(t => (
                          <div key={t.label} className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-white/20 transition-all shadow-inner">
                             <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">{t.label}</p>
                                <p className={`text-2xl font-mono font-black ${t.col}`}>{t.val}</p>
                             </div>
                             <span className="text-[8px] font-black text-slate-700 bg-white/5 px-2 py-1 rounded uppercase tracking-widest">{t.status}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-amber-500/10 bg-amber-500/[0.02] space-y-6 group">
                    <div className="flex items-center gap-3">
                       <Info className="w-5 h-5 text-amber-500" />
                       <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Universal Land Sharding</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100">
                       "All users have access to an Online Garden. It represents your virtual footprint on the EnvirosAgro blockchain. Consolidate your work here to build your Dossier Strength."
                    </p>
                 </div>
                 
                 <button onClick={() => onNavigate('registry_handshake')} className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-slate-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl">
                    <Fingerprint size={16} /> Strengthen Dossier Integrity
                 </button>
              </div>
           </div>
        )}

        {activeTab === 'roadmap' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500 px-4">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-10 shadow-2xl">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                          <MapIcon className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Forge <span className="text-emerald-400">Path</span></h3>
                    </div>
                    
                    <div className="space-y-4 p-6 bg-black/60 rounded-3xl border border-white/10 shadow-inner">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4 px-2">Active Steward Role</p>
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-emerald-400">
                             <Sprout size={24} />
                          </div>
                          <div>
                             <p className="text-lg font-black text-white uppercase italic">Biological Steward</p>
                             <p className="text-[10px] text-slate-600 font-mono">Dossier Quality: {dossierStrength}%</p>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handleGenerateRoadmap}
                      disabled={isForgingRoadmap}
                      className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                    >
                       {isForgingRoadmap ? <Loader2 className="w-6 h-6 animate-spin" /> : <Bot className="w-6 h-6 fill-current" />}
                       {isForgingRoadmap ? 'CONSULTING ORACLE...' : 'GENERATE ROADMAP SHARD'}
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-4 text-emerald-400">
                          <Terminal className="w-6 h-6 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Steward Guidance Terminal</span>
                       </div>
                    </div>

                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                       {!roadmapShard && !isForgingRoadmap ? (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                             <div className="relative">
                                <MapIcon size={140} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                             </div>
                             <div className="space-y-2">
                                <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">ORACLE STANDBY</p>
                                <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Forge Roadmap to Synchronize App Contributions</p>
                             </div>
                          </div>
                       ) : isForgingRoadmap ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
                                </div>
                             </div>
                             <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">CONSOLIDATING WORK LOGS...</p>
                          </div>
                       ) : (
                          <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12 pb-10">
                             <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert prose-emerald max-w-none shadow-3xl border-l-8 border-l-emerald-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform"><Database size={300} /></div>
                                <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-6">
                                   <Bot className="w-10 h-10 text-emerald-400" />
                                   <div>
                                      <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Universal Oracle Verdict</h4>
                                      <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mt-1">CONSOLIDATED_WORK_PATH</p>
                                   </div>
                                </div>
                                <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10">
                                   {roadmapShard}
                                </div>
                             </div>
                             <div className="flex justify-center gap-6">
                                <button className="px-20 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                   <Stamp className="w-6 h-6" /> ANCHOR WORK LEDGER
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'mining' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className={`glass-card p-14 rounded-[64px] border-2 flex flex-col justify-between shadow-3xl relative overflow-hidden group transition-all duration-700 ${dossierStrength > 50 ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-white/5 bg-black/40 grayscale'}`}>
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform"><Wind size={400} className="text-emerald-400" /></div>
                    <div className="space-y-8 relative z-10">
                       <div className="flex justify-between items-start">
                          <div className="p-5 rounded-[28px] bg-emerald-600 text-white shadow-3xl"><TrendingUp size={40} /></div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">CARBON_MINT_v1</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Carbon <span className="text-emerald-400">Minting</span></h3>
                          <p className="text-slate-400 text-xl font-medium leading-relaxed italic">"Prove regenerative field work via satellite verification to mint EAC credits."</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => onNavigate('digital_mrv')}
                      className="w-full py-8 mt-12 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                       <Scan size={24} fill="currentColor" />
                       EXECUTE CARBON MINT
                    </button>
                 </div>

                 <div className="glass-card p-14 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-500/[0.03] flex flex-col justify-between shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform"><Sparkles size={400} className="text-indigo-400" /></div>
                    <div className="space-y-8 relative z-10">
                       <div className="flex justify-between items-start">
                          <div className="p-5 rounded-[28px] bg-indigo-600 text-white shadow-3xl"><Sparkles size={40} /></div>
                          <div className="text-right">
                             <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20">REACTION_MINT_v1</span>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Reaction <span className="text-indigo-400">Mining</span></h3>
                          <p className="text-slate-400 text-xl font-medium leading-relaxed italic">"Valuing data validation, peer-vouching, and industrial knowledge sharding."</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 shadow-inner">
                          <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                             <span>Consensus Shards</span>
                             <span className="text-white font-mono">14 Active</span>
                          </div>
                          <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" style={{ width: '45%' }}></div>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => onNavigate('wallet')}
                      className="w-full py-8 mt-12 bg-indigo-800 hover:bg-indigo-700 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                       <Wallet size={24} />
                       MINT SOCIAL YIELD
                    </button>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Footer / Sovereignty Shard */}
      <div className="p-16 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mt-20 mx-4">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s]">
            <Globe className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Fingerprint size={20} className="text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">THE SHARDED <span className="text-emerald-400">GARDEN</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 Bridging every form of agricultural effort—from the lab to the factory to the field—into a single, sovereign landmass of value.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">NODE_SYNC_VELOCITY</p>
            <p className="text-9xl font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OnlineGarden;