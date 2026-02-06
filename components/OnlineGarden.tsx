import React, { useState, useMemo, useEffect } from 'react';
/* Added missing Lucide icons and alias to resolve compilation errors */
import { 
  Flower, Satellite, TrendingUp, Zap, ShieldCheck, Bot, Sparkles, 
  Layers, Droplets, Binary, Target, Globe, Loader2, Lock, Stamp, 
  Fingerprint, Wind, CheckCircle2, Sprout, RefreshCw, Info, Terminal, 
  Users, Factory, Cpu, Waves, Heart, Boxes, ShieldAlert, ArrowUpRight, 
  Activity, Scan, MapPin, Smartphone, Star, ArrowLeftCircle, Wrench, 
  SmartphoneNfc, ClipboardList, Target as TargetIcon, Search, Plus, 
  ArrowRight, Download, Monitor, Signal, Radio, Box, Binary as BinaryIcon,
  Crown, Compass, BadgeCheck, History, Eye, Lightbulb, Map as MapIcon,
  Pickaxe, Database, Wifi, Leaf, Boxes as BoxesIcon
} from 'lucide-react';
import { User, ViewState, AgroResource } from '../types';
import { analyzeMiningYield, chatWithAgroExpert } from '../services/geminiService';

interface OnlineGardenProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  notify: any;
}

/* Updated progression tiers with Pickaxe icon */
const PROGRESSION_TIERS = [
  { level: 1, title: 'Seeder', req: 'Registry Handshake', access: '1 Virtual Shard', icon: Sprout, col: 'text-emerald-400' },
  { level: 2, title: 'Cultivator', req: 'Connect Physical Plot', access: 'Physical Shard + Bridge', icon: MapPin, col: 'text-emerald-500' },
  { level: 3, title: 'Miner', req: 'Pass Carbon Baseline', access: 'Carbon Mining Shard', icon: Pickaxe, col: 'text-amber-500' },
  { level: 4, title: 'Steward', req: '3 Sustainability Protocols', access: 'Multi-Shard Mgmt', icon: ShieldCheck, col: 'text-blue-400' },
  { level: 5, title: 'Super-Agro', req: 'Net-Negative Footprint', access: 'System Governance', icon: Crown, col: 'text-indigo-400' },
];

const SHARD_TYPES = [
  { id: 'physical', label: 'Verified Shard', desc: 'Real-world yield & Carbon Mining', badge: 'PHYSICAL', col: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'virtual', label: 'Sim Shard', desc: 'Strategy testing & Reaction Mining', badge: 'VIRTUAL', col: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, notify }) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'shards' | 'roadmap' | 'mining'>('bridge');
  const [activeShardType, setActiveShardType] = useState<'physical' | 'virtual'>(user.resources?.some(r => r.category === 'LAND') ? 'physical' : 'virtual');
  
  // Telemetry Bridge States
  const [telemetrySource, setTelemetrySource] = useState<'ingest' | 'satellite'>('ingest');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  
  // Mining States
  const [isMining, setIsMining] = useState(false);
  const [miningType, setMiningType] = useState<'carbon' | 'reaction'>('reaction');
  const [miningInference, setMiningInference] = useState<any | null>(null);

  const landResources = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'LAND'),
    [user.resources]
  );
  
  const hasPhysicalLand = landResources.length > 0;
  
  const currentTier = useMemo(() => {
    const score = user.metrics.sustainabilityScore;
    if (score > 90 && hasPhysicalLand) return PROGRESSION_TIERS[4];
    if (score > 75 && hasPhysicalLand) return PROGRESSION_TIERS[3];
    if (hasPhysicalLand && user.wallet.eatBalance > 5) return PROGRESSION_TIERS[2];
    if (hasPhysicalLand) return PROGRESSION_TIERS[1];
    return PROGRESSION_TIERS[0];
  }, [user.metrics.sustainabilityScore, hasPhysicalLand, user.wallet.eatBalance]);

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          onEarnEAC(15, `TELEMETRY_BRIDGE_${telemetrySource.toUpperCase()}_SYNC`);
          notify('success', 'TELEMETRY_SYNCED', `Data from ${telemetrySource.toUpperCase()} layer anchored to twin.`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleStartMining = async (type: 'carbon' | 'reaction') => {
    if (type === 'carbon' && !hasPhysicalLand) {
      notify('error', 'RESTRICTED_ACCESS', "Carbon Mining requires an anchored Physical Shard.");
      return;
    }
    
    setIsMining(true);
    setMiningType(type);
    setMiningInference(null);

    try {
      const data = {
        pressure: type === 'reaction' ? 85 : 12.4, // Mock dynamic values
        type,
        node_id: user.esin,
        m_constant: user.metrics.timeConstantTau
      };
      const res = await analyzeMiningYield(data);
      setMiningInference(res);
      onEarnEAC(type === 'carbon' ? 50 : 25, `${type.toUpperCase()}_MINING_CYCLE_COMPLETE`);
    } catch (e) {
      console.error("Mining Oracle Failure");
    } finally {
      setIsMining(false);
    }
  };

  const orbitalParticles = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      id: i,
      size: 4 + Math.random() * 6,
      duration: 10 + Math.random() * 15,
      delay: -(Math.random() * 10),
      radius: 70 + Math.random() * 100,
      type: i % 3 === 0 ? 'data' : i % 3 === 1 ? 'bio' : 'energy'
    }));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Dashboard HUD: Super-Agro Progression Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
              <div className="w-full h-[2px] bg-indigo-500/10 absolute top-0 animate-scan"></div>
           </div>
           
           <div className="relative shrink-0">
              <div className={`w-44 h-44 rounded-[56px] flex items-center justify-center ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all duration-1000 ${
                activeShardType === 'physical' ? 'bg-emerald-600 shadow-[0_0_100px_rgba(16,185,129,0.4)]' : 'bg-indigo-700 shadow-[0_0_100px_rgba(79,70,229,0.4)]'
              }`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {activeShardType === 'physical' ? <Sprout size={80} className="text-white animate-float" /> : <Monitor size={80} className="text-white animate-pulse" />}
                 <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[56px] animate-spin-slow"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-[32px] border border-white/20 bg-black/80 flex flex-col items-center shadow-3xl">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tier</p>
                 <div className="flex items-center gap-2">
                    <currentTier.icon className={`w-4 h-4 ${currentTier.col}`} />
                    <p className={`text-xl font-black uppercase italic ${currentTier.col}`}>{currentTier.title}</p>
                 </div>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-4">
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border shadow-inner italic ${
                      activeShardType === 'physical' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {activeShardType === 'physical' ? 'PHYSICAL_SHARD_ACTIVE' : 'VIRTUAL_SIM_MODE'}
                    </span>
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner italic">OS_SYNC_v6.5</span>
                 </div>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 drop-shadow-2xl">Online <span className="text-emerald-400">Garden.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating agricultural shards. Every garden is a digital twin or virtual space anchored to the global industrial ledger."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">SHARD_RESONANCE</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">94<span className="text-3xl text-emerald-500 font-sans italic ml-1">.2</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> TELEMETRY_STABLE
              </p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 tracking-widest">
                 <span>Bridge Fidelity</span>
                 <span className="text-emerald-400 font-mono">100%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]" style={{ width: '94%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Management Shard Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-20">
        <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'bridge', label: 'Telemetry Bridge', icon: Monitor },
            { id: 'shards', label: 'Shard Manager', icon: BoxesIcon },
            { id: 'roadmap', label: 'Super-Agro Path', icon: Compass },
            { id: 'mining', label: 'Extraction Node', icon: Zap },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
           {SHARD_TYPES.map(type => (
             <button 
               key={type.id}
               onClick={() => {
                 if (type.id === 'physical' && !hasPhysicalLand) {
                   notify('error', 'ACCESS_DENIED', "Registry Handshake for physical land required.");
                   return;
                 }
                 setActiveShardType(type.id as any);
               }}
               className={`px-6 py-3 rounded-full border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                 activeShardType === type.id 
                  ? 'bg-white text-black border-white shadow-xl' 
                  : 'bg-black/60 border-white/10 text-slate-500 hover:text-white'
               }`}
             >
                {/* Fixed missing icon reference for Database */}
                {type.id === 'physical' ? <Scan size={14} /> : <Database size={14} />}
                {type.badge}
             </button>
           ))}
        </div>
      </div>

      <div className="min-h-[850px] relative z-10 px-2">
        
        {/* --- VIEW: TELEMETRY BRIDGE --- */}
        {activeTab === 'bridge' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-10 duration-1000">
              <div className="lg:col-span-8 space-y-10">
                 <div className="glass-card p-16 rounded-[80px] border-2 border-white/5 bg-black/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px] shadow-3xl group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
                       <div className="w-[500px] h-[500px] border border-dashed border-emerald-500/40 rounded-full animate-spin-slow"></div>
                       <div className="absolute w-[700px] h-[700px] border border-dotted border-blue-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-20 w-full">
                       <div className="relative w-[450px] h-[450px] flex items-center justify-center">
                          <div className={`w-72 h-72 rounded-[80px] border-4 transition-all duration-[2s] shadow-[0_0_200px_current] flex flex-col items-center justify-center relative z-20 ${
                            activeShardType === 'physical' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                          }`}>
                             {activeShardType === 'physical' ? <Satellite size={140} className="animate-pulse" /> : <Binary size={140} className="animate-float" />}
                             <div className="absolute -bottom-10 px-8 py-3 bg-black/80 backdrop-blur-3xl rounded-[28px] text-[11px] font-black uppercase tracking-[0.5em] border border-white/10 shadow-3xl">
                                {syncProgress}% SHARD_SYNC
                             </div>
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
                                className={`absolute rounded-[20px] border-2 flex items-center justify-center shadow-3xl transition-all group-hover:scale-125 ${
                                  p.type === 'bio' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                                  p.type === 'data' ? 'bg-blue-500/10 border-blue-500/20' : 
                                  'bg-indigo-500/10 border-indigo-500/20'
                                }`}
                                style={{
                                  width: `${p.size * 6}px`,
                                  height: `${p.size * 6}px`,
                                  top: '0',
                                  left: '50%',
                                  transform: 'translateX(-50%)'
                                }}
                              >
                                {p.type === 'bio' ? <Sprout size={p.size * 2} className="text-emerald-500" /> : 
                                 p.type === 'data' ? <Satellite size={p.size * 2} className="text-blue-500" /> : 
                                 <Binary size={p.size * 2} className="text-indigo-500" />}
                              </div>
                            </div>
                          ))}
                       </div>

                       <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl justify-center items-center">
                          <div className="p-8 glass-card rounded-[48px] bg-black/80 border border-white/5 flex flex-col items-center gap-6 flex-1 shadow-inner group/bridge">
                             <div className="flex items-center gap-4 border-b border-white/5 pb-4 w-full justify-center">
                                <Radio className="w-5 h-5 text-emerald-400" />
                                <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest italic">Ingest Source</span>
                             </div>
                             <div className="flex gap-4 w-full">
                                {[
                                  // Fixed missing icon reference for Wifi
                                  { id: 'ingest', label: 'Local IoT', icon: Wifi, col: 'blue' },
                                  { id: 'satellite', label: 'Sat Telemetry', icon: Satellite, col: 'indigo' },
                                ].map(s => (
                                  <button 
                                    key={s.id}
                                    onClick={() => setTelemetrySource(s.id as any)}
                                    className={`flex-1 p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 ${
                                      telemetrySource === s.id ? `bg-${s.col}-600/10 border-${s.col}-500 text-${s.col}-400 shadow-xl` : 'bg-white/5 border-white/5 text-slate-700 hover:text-white'
                                    }`}
                                  >
                                    <s.icon size={28} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                                  </button>
                                ))}
                             </div>
                          </div>

                          <button 
                            onClick={handleSyncTelemetry}
                            disabled={isSyncing}
                            className={`px-16 py-10 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 disabled:opacity-50 border-4 border-white/10 ring-[16px] ring-white/5 ${
                              activeShardType === 'physical' ? 'agro-gradient' : 'bg-indigo-700'
                            }`}
                          >
                             {isSyncing ? <Loader2 size={32} className="animate-spin" /> : <RefreshCw size={32} />}
                             {isSyncing ? 'BUFFERING...' : 'SYNC TELEMETRY BRIDGE'}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-10">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Monitor size={300} /></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Terminal size={32} className="text-white" /></div>
                       <h4 className="text-2xl font-black text-white uppercase italic tracking-widest leading-none">Bridge <span className="text-indigo-400">Metrology</span></h4>
                    </div>
                    <div className="space-y-10 relative z-10">
                       {[
                         // Fixed missing icon reference for Leaf
                         { l: 'NDVI Vegetation Index', v: '0.82', i: Leaf, c: 'text-emerald-400', p: 82 },
                         { l: 'Biomass Density (Dn)', v: '14.2 t/ha', i: Binary, c: 'text-blue-400', p: 65 },
                         { l: 'Evapotranspiration', v: '4.2 mm/d', i: Droplets, c: 'text-indigo-400', p: 48 },
                       ].map(t => (
                          <div key={t.l} className="p-8 bg-black/80 rounded-[40px] border border-white/5 group/met hover:border-white/20 transition-all shadow-inner">
                             <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-4">
                                   <div className={`p-3 rounded-xl bg-white/5 ${t.c} shadow-inner group-hover/met:scale-110 transition-transform`}><t.i size={20} /></div>
                                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/met:text-slate-300 transition-colors">{t.l}</span>
                                </div>
                                <p className="text-3xl font-mono font-black text-white">{t.v}</p>
                             </div>
                             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${t.c.replace('text', 'bg')} shadow-[0_0_10px_currentColor] transition-all duration-[2s]`} style={{ width: `${t.p}%` }}></div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[56px] border border-amber-500/20 bg-amber-500/5 space-y-6 group shadow-xl">
                    <div className="flex items-center gap-4">
                       <Bot size={20} className="text-amber-500 animate-pulse" />
                       <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest italic">Satellite Overlay Info</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-amber-500/30 pl-6 font-medium">
                       "If physical local sensors are missing, EnvirosAgro OS auto-fills telemetry gaps via Sentinel/Landsat spectral shards to maintain Roadmap accuracy."
                    </p>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: MASTER PATH (ROADMAP) --- */}
        {activeTab === 'roadmap' && (
           <div className="max-w-[1400px] mx-auto space-y-20 animate-in slide-in-from-bottom-10 duration-1000 px-6">
              <div className="text-center space-y-6">
                 <h3 className="text-6xl md:text-[100px] font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-3xl">MASTER <span className="text-emerald-400">PATH</span></h3>
                 <p className="text-slate-500 text-3xl font-medium italic max-w-4xl mx-auto leading-relaxed">"The comprehensive trajectory towards Super-Agro sovereignty. Scale your agricultural capability."</p>
              </div>

              <div className="relative pt-20 pb-40">
                 <div className="absolute top-[280px] left-10 right-10 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-800 shadow-[0_0_50px_rgba(99,102,241,0.4)]" style={{ width: `${(currentTier.level/5)*100}%` }}></div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
                    {PROGRESSION_TIERS.map((tier) => {
                       const isReached = currentTier.level >= tier.level;
                       const isCurrent = currentTier.level === tier.level;
                       return (
                          <div key={tier.level} className={`flex flex-col items-center gap-12 group transition-all duration-700 ${isReached ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                             <div className={`w-40 h-40 rounded-[56px] border-4 flex items-center justify-center shadow-3xl relative transition-all duration-700 ${
                                isCurrent ? 'bg-indigo-600 border-white scale-125 z-20 ring-[24px] ring-white/5 rotate-6' : 
                                isReached ? 'bg-black/80 border-emerald-500/40' : 'bg-black/20 border-white/5'
                             }`}>
                                <tier.icon className={`w-16 h-16 transition-all duration-700 ${isCurrent ? 'text-white scale-110' : isReached ? tier.col : 'text-slate-800'}`} />
                                {isCurrent && <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-[56px] animate-spin-slow"></div>}
                             </div>

                             <div className={`text-center space-y-4 transition-all duration-700 ${isCurrent ? 'scale-110 -translate-y-4' : ''}`}>
                                <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${tier.col}`}>LVL_{tier.level}</p>
                                <h5 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">{tier.title}</h5>
                                <div className="space-y-2 pt-4">
                                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 items-center">
                                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none">Goal Shard</p>
                                      <p className="text-[11px] text-slate-300 font-bold uppercase italic tracking-tight">{tier.req}</p>
                                   </div>
                                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 items-center">
                                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none">Access Level</p>
                                      <p className="text-[11px] text-slate-300 font-bold uppercase italic tracking-tight">{tier.access}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>

              <div className="p-16 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/5 flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl mx-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none"><Crown size={500} className="text-emerald-400" /></div>
                 <div className="flex items-center gap-12 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-32 h-32 bg-emerald-600 rounded-[44px] flex items-center justify-center shadow-3xl animate-pulse ring-[16px] ring-white/5 shrink-0 border-4 border-white/20">
                       <Lightbulb className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Path to Harvest</h4>
                       <p className="text-slate-300 text-2xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                         "High wind detected via Satellite Telemetry; suggest strengthening windbreak shards in Physical Shard #882 to protect Carbon Mining yields."
                       </p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-16">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-4 tracking-[0.5em] italic">Yield Multiplier</p>
                    <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter">1.42<span className="text-3xl italic">x</span></p>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: EXTRACTION NODE (MINING) --- */}
        {activeTab === 'mining' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-10 duration-700 px-6">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-12 rounded-[72px] border border-amber-500/20 bg-amber-500/[0.02] space-y-12 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[15s]"><Zap size={300} className="text-amber-400" /></div>
                    
                    <div className="flex items-center gap-8 relative z-10 border-b border-white/5 pb-10">
                       <div className="w-20 h-20 bg-amber-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl group-hover:scale-110 transition-transform duration-700">
                          <History size={40} className="fill-current" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Extraction <span className="text-amber-500">Node</span></h3>
                          <p className="text-[11px] text-amber-500/60 font-mono tracking-widest uppercase mt-3">SHARD_YIELD_MINTING_v4</p>
                       </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                       <div className="space-y-6">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Mining Protocol</label>
                             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${miningType === 'carbon' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                {miningType === 'carbon' ? 'CARBON_PROOF' : 'KNOWLEDGE_PROOF'}
                             </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             {[
                               { id: 'reaction', label: 'Reaction Mining', icon: Users, col: 'blue' },
                               { id: 'carbon', label: 'Carbon Mining', icon: Wind, col: 'emerald' },
                             ].map(m => (
                               <button 
                                 key={m.id}
                                 onClick={() => {
                                   if (m.id === 'carbon' && !hasPhysicalLand) {
                                     notify('error', 'RESTRICTED', "Carbon Mining requires a Verified Physical Shard.");
                                     return;
                                   }
                                   setMiningType(m.id as any);
                                 }}
                                 className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 text-center group ${miningType === m.id ? `bg-${m.col}-600/10 border-${m.col}-500 text-${m.col}-400 shadow-xl` : 'bg-black/60 border-white/10 text-slate-500 hover:text-white'}`}
                               >
                                  <m.icon size={28} />
                                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">{m.label}</span>
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="p-10 bg-black/80 rounded-[48px] border border-white/5 space-y-3 text-center shadow-inner relative overflow-hidden">
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] italic">EXTRACTABLE_CREDIT</p>
                          <p className={`text-8xl font-mono font-black tracking-tighter drop-shadow-2xl italic leading-none ${miningType === 'carbon' ? 'text-emerald-400' : 'text-blue-400'}`}>
                             {Math.floor((miningType === 'reaction' ? 85 : 12.4 * 10) * user.metrics.timeConstantTau)}
                             <span className="text-2xl ml-2 font-sans opacity-20">EAC</span>
                          </p>
                       </div>

                       <button 
                        onClick={() => handleStartMining(miningType)}
                        disabled={isMining}
                        className={`w-full py-10 rounded-[44px] text-white font-black text-base uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-8 active:scale-95 disabled:opacity-30 border-4 border-white/10 ring-[16px] ring-white/5 ${
                          miningType === 'carbon' ? 'agro-gradient shadow-emerald-900/30' : 'bg-indigo-700 shadow-indigo-900/30'
                        }`}
                       >
                          {isMining ? <Loader2 size={32} className="animate-spin" /> : <Stamp size={32} className="fill-current" />}
                          {isMining ? 'EXTRACTING SHARDS...' : 'INITIALIZE MINING'}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-8 flex flex-col space-y-10">
                 {/* Live Vouch / Evidence Feed */}
                 <div className="glass-card rounded-[80px] flex-1 border border-white/5 bg-black/40 flex flex-col relative overflow-hidden shadow-3xl group/ledger">
                    <div className="absolute inset-0 pointer-events-none opacity-5 group-hover/ledger:opacity-10 transition-opacity">
                      <div className="w-full h-[1px] bg-amber-500 absolute top-0 animate-scan"></div>
                    </div>
                    
                    <div className="p-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-3xl">
                             <Signal size={32} className="animate-pulse" />
                          </div>
                          <div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Extraction <span className="text-amber-500">Ledger</span></h4>
                             <p className="text-amber-500/60 text-[10px] font-mono tracking-widest uppercase mt-3">REAL_TIME_SIGNAL_SYNC_#882A</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal space-y-8 bg-[#050706]">
                       {isMining ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <Loader2 size={120} className="text-amber-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   {/* Fixed missing icon reference for Database */}
                                   <Database size={40} className="text-amber-400 animate-pulse" />
                                </div>
                             </div>
                             <p className="text-amber-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0 drop-shadow-2xl">MINTING REGISTRY SHARDS...</p>
                          </div>
                       ) : miningInference ? (
                          <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10">
                             <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-amber-500/20 prose prose-invert prose-amber max-w-none shadow-3xl border-l-[16px] border-l-amber-600 relative overflow-hidden group/shard text-left">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/shard:scale-110 transition-transform duration-[12s] pointer-events-none"><Sparkles size={600} className="text-amber-400" /></div>
                                
                                <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                                   <div className="flex items-center gap-8">
                                      <Bot className="w-14 h-14 text-amber-400 animate-pulse" />
                                      <div>
                                         <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Inference Shard</h4>
                                         <p className="text-amber-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-4">MINING_ORACLE_REPORT_v4</p>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Resonance Accuracy</p>
                                      <p className="text-4xl font-mono font-black text-emerald-400">99.8%</p>
                                   </div>
                                </div>

                                <div className="text-slate-300 text-3xl leading-[2.1] italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                   {miningInference.sentiment_shard}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 relative z-10">
                                   <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-3 shadow-inner group/met hover:border-amber-500/20 transition-all">
                                      <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest flex items-center gap-3">
                                         <Target size={14} className="text-amber-500" /> Resonance Index
                                      </p>
                                      <p className="text-5xl font-mono font-black text-white tracking-tighter">{miningInference.resonance_index.toFixed(2)}<span className="text-xl italic text-amber-500 ml-1">x</span></p>
                                   </div>
                                   <div className="p-10 bg-black/60 rounded-[48px] border border-white/5 space-y-3 shadow-inner text-right group/met hover:border-emerald-500/20 transition-all">
                                      <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest flex items-center justify-end gap-3">
                                         Extraction Efficiency <Binary size={14} className="text-emerald-400" />
                                      </p>
                                      <p className="text-5xl font-mono font-black text-white tracking-tighter">{(miningInference.extraction_efficiency * 100).toFixed(0)}<span className="text-xl italic text-emerald-400 ml-1">%</span></p>
                                   </div>
                                </div>
                             </div>

                             <div className="flex justify-center gap-10">
                                <button onClick={() => setMiningInference(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-2 border-white/10 ring-[16px] ring-white/5">
                                   <Stamp size={32} /> ANCHOR MINT TO REGISTRY
                                </button>
                             </div>
                          </div>
                       ) : (
                         <div className="py-20 flex flex-col items-center justify-center text-center space-y-12 opacity-30 group animate-in zoom-in">
                            <BinaryIcon size={120} className="text-slate-600 group-hover:text-emerald-500 transition-colors duration-1000" />
                            <div className="space-y-4">
                               <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">NODE_STANDBY</p>
                               <p className="text-lg font-bold text-slate-700 uppercase tracking-[0.4em]">Awaiting Inflow Sequence Confirmation</p>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SHARD TERMINAL --- */}
        {activeTab === 'shards' && (
           <div className="py-40 text-center opacity-20 flex flex-col items-center gap-12 group animate-in zoom-in duration-500">
              <div className="relative">
                 <BoxesIcon size={140} className="text-slate-600 group-hover:text-emerald-500 transition-colors duration-1000" />
                 <div className="absolute inset-[-40px] border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
              </div>
              <div className="space-y-4">
                 <p className="text-5xl font-black uppercase tracking-[0.8em] text-white italic leading-none">SHARD_TERMINAL</p>
                 <p className="text-2xl font-bold italic text-slate-700 uppercase tracking-[0.4em]">Managing {activeShardType === 'physical' ? landResources.length : 1} active agricultural shards</p>
              </div>
              <button onClick={() => onNavigate('registry_handshake')} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 transition-all">Initialize New Physical Handshake</button>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default OnlineGarden;