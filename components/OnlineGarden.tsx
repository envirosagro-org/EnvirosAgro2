
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Flower, Satellite, Map as MapIcon, TrendingUp, Zap, ShieldCheck, Bot, Sparkles, 
  ChevronRight, Layers, CloudSun, Droplets, Thermometer, Binary, Target, History, 
  PlusCircle, ArrowLeftCircle, Database, SearchCode, Globe, Loader2, Lock, Stamp, 
  Fingerprint, Wind, CircleDot, CheckCircle2, Sprout, RefreshCw, Info, Terminal, 
  Users, Building2, Factory, Cpu, Waves, Heart, Boxes, ShieldAlert, ArrowUpRight, 
  ClipboardCheck, Activity, Scan, Wallet, PawPrint, Mountain, FileUp, Camera, 
  RotateCcw, BadgeCheck, ChevronLeft, ChevronRight as ChevronRightIcon, Timer, 
  LayoutGrid, Trophy, HardHat, Coins, Compass, Scale, Trees, MessageSquare, 
  ThumbsUp, Flame, ArrowRight, X, LifeBuoy, Handshake, Landmark, Signal, 
  ShieldPlus, Radiation, AlertTriangle, Monitor, Download, Sun, Crown as CrownIcon,
  // Fix: Added Workflow icon import to resolve "Cannot find name" error on line 159
  Workflow
} from 'lucide-react';
import { User, ViewState, NotificationType } from '../types';
import { chatWithAgroExpert, analyzeMiningYield } from '../services/geminiService';

interface OnlineGardenProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onNavigate: (view: ViewState) => void;
  notify?: (type: NotificationType, title: string, message: string) => void;
}

const Crown = ({ size, className }: { size?: number, className?: string }) => <CrownIcon size={size} className={className} />;

const SEEDING_STEPS = [
  { id: 'seeding', label: '1. SEEDING', icon: PlusCircle, desc: 'Initialize Resource Shard' },
  { id: 'care', label: '2. CARE', icon: Heart, desc: 'Maintain Resonance' },
  { id: 'harvest', label: '3. HARVEST', icon: Trophy, desc: 'Collect Yield' },
  { id: 'worker', label: '4. MASTER', icon: Crown, desc: 'Industrial Authority' },
];

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate, notify }) => {
  const [activeTab, setActiveTab] = useState<'twin' | 'seeding_program' | 'roadmap' | 'mining'>('twin');
  const [seedingPhase, setSeedingPhase] = useState<'seeding' | 'care' | 'harvest' | 'worker'>('seeding');
  const [esinSign, setEsinSign] = useState('');
  
  // Twin States
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  
  // Mining States
  const [reactionPressure, setReactionPressure] = useState(72);
  const [sentimentAlpha, setSentimentAlpha] = useState(1.24);
  const [isMining, setIsMining] = useState(false);
  const [miningInference, setMiningInference] = useState<any | null>(null);
  const [isMinterAuthOpen, setIsMinterAuthOpen] = useState(false);
  const [vouchFeed] = useState([
    { id: 1, user: 'Master_Bantu', type: 'Vouch', value: '+1.2', time: '2m ago' },
    { id: 2, user: 'Gaia_Stwd', type: 'Heart', value: '+0.5', time: '5m ago' },
    { id: 3, user: 'Neo_Seed', type: 'Zap', value: '+2.0', time: '12m ago' },
  ]);

  // Seeding States
  const [isGeofencing, setIsGeofencing] = useState(false);
  const [geofenceLocked, setGeofenceLocked] = useState(false);
  const [resonance, setResonance] = useState(78);

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
    setSyncProgress(0);
    notify?.('info', 'TWIN_SYNC_INIT', 'Establishing high-frequency mirror link...');
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          onEarnEAC(5, 'UNIVERSAL_TWIN_SYNC');
          notify?.('success', 'TWIN_SYNC_FINAL', 'Universal mirror node aligned with ground telemetry.');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleRunMiningAudit = async () => {
    setIsMining(true);
    setMiningInference(null);
    notify?.('info', 'MINING_AUDIT_START', 'Oracle analyzing social reaction shards...');
    try {
      const data = {
        pressure: reactionPressure,
        alpha: sentimentAlpha,
        node_id: user.esin,
        m_constant: user.metrics.timeConstantTau
      };
      const res = await analyzeMiningYield(data);
      setMiningInference(res);
      notify?.('success', 'AUDIT_COMPLETE', 'Yield potential sharded. Signature required for extraction.');
    } catch (e) {
      notify?.('error', 'ORACLE_OFFLINE', 'Mining audit failed. Check node stability.');
    } finally {
      setIsMining(false);
    }
  };

  const handleStartGeofence = () => {
    setIsGeofencing(true);
    notify?.('info', 'GEOFENCE_INIT', 'Awaiting satellite authority handshake...');
    setTimeout(() => {
      setIsGeofencing(false);
      setGeofenceLocked(true);
      onEarnEAC(10, 'GEOFENCE_SHARD_ANCHOR');
      notify?.('success', 'GEOFENCE_LOCKED', 'Physical plot anchored to global registry geofence.');
    }, 3000);
  };

  const executeExtraction = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      notify?.('error', 'SIGNATURE_VOID', 'Node signature mismatch.');
      return;
    }
    setIsMining(true);
    notify?.('info', 'MINTING_SHARD', 'Finalizing value extraction sequence...');
    setTimeout(() => {
      const reward = Math.floor(reactionPressure * sentimentAlpha * user.metrics.timeConstantTau);
      onEarnEAC(reward, 'REACTION_HARVEST_EXTRACTION_SUCCESS');
      notify?.('success', 'EXTRACT_SYNC', `Successfully extracted ${reward} EAC shards from social resonance.`);
      setIsMining(false);
      setIsMinterAuthOpen(false);
      setReactionPressure(0);
      setMiningInference(null);
    }, 3000);
  };

  const orbitalParticles = useMemo(() => {
    return [...Array(14)].map((_, i) => ({
      id: i,
      size: 4 + Math.random() * 8,
      duration: 15 + Math.random() * 25,
      delay: -(Math.random() * 30),
      radius: 70 + Math.random() * 80,
      type: i % 3 === 0 ? 'bio' : i % 3 === 1 ? 'ind' : 'sys'
    }));
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1500px] mx-auto">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Workflow size={1000} className="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Globe className="w-[500px] h-[500px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className={`w-44 h-44 rounded-[56px] ${hasPhysicalLand ? 'bg-emerald-600 shadow-[0_0_80px_rgba(16,185,129,0.3)]' : 'bg-indigo-600 shadow-[0_0_80px_rgba(99,102,241,0.3)]'} flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700`}>
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 {hasPhysicalLand ? <Sprout size={80} className="text-white animate-spin-slow" /> : <Layers size={80} className="text-white animate-float" />}
              </div>
              <div className="absolute -bottom-4 -right-4 p-5 glass-card rounded-3xl border border-white/20 bg-black/80 flex flex-col items-center shadow-2xl">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Mirror Integrity</p>
                 <p className={`text-2xl font-mono font-black ${dossierStrength > 70 ? 'text-emerald-400' : 'text-indigo-400'}`}>{dossierStrength}%</p>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">
                    {hasPhysicalLand ? 'BIO_ANCHORED_MIRROR' : 'CONCEPTUAL_MESH_MIRROR'}
                 </span>
                 <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Online <span className="text-emerald-400">Garden</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-2xl opacity-80">
                 "Your decentralized landmass registry. Map physical biometrics, automate care cycles, and mine social resonance shards."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none group-hover:bg-emerald-500/[0.03] transition-colors"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Registry Shards</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter italic">842</h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Sync Latency</span>
                 <span className="text-emerald-400 font-mono">14ms</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '100%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Portal Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-2xl px-6 mx-auto lg:mx-4 relative z-20">
        {[
          { id: 'twin', label: 'Universal Twin', icon: Monitor },
          { id: 'seeding_program', label: 'Seeding Protocol', icon: Sprout },
          { id: 'roadmap', label: 'Master Path', icon: Compass },
          { id: 'mining', label: 'Reaction Mining', icon: Zap },
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

      <div className="min-h-[700px] px-4 relative z-10">
        
        {/* --- TAB: UNIVERSAL TWIN --- */}
        {activeTab === 'twin' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
              <div className="lg:col-span-8 space-y-10">
                 <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] shadow-3xl group">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                       <div className="w-[400px] h-[400px] border border-dashed border-emerald-500/40 rounded-full animate-spin-slow"></div>
                       <div className="absolute w-[600px] h-[600px] border border-dotted border-blue-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                       <div className="absolute w-[800px] h-[800px] border border-dashed border-indigo-500/10 rounded-full animate-spin-slow"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-16 w-full">
                       <div className="relative w-96 h-96 flex items-center justify-center">
                          <div className={`w-64 h-64 rounded-[64px] border-4 transition-all duration-[2s] shadow-[0_0_150px_current] flex flex-col items-center justify-center ${hasPhysicalLand ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-indigo-500/20 border-indigo-500 text-indigo-400'}`}>
                             {hasPhysicalLand ? <Sprout size={120} className="animate-pulse" /> : <Binary size={120} className="animate-float" />}
                             <div className="mt-4 px-4 py-1.5 bg-black/60 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                {syncProgress}% SYNC
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
                                className={`absolute rounded-xl border flex items-center justify-center shadow-lg transition-all group-hover:scale-125 ${p.type === 'bio' ? 'bg-emerald-500/10 border-emerald-500/20' : p.type === 'ind' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}
                                style={{
                                  width: `${p.size * 3}px`,
                                  height: `${p.size * 3}px`,
                                  top: '0',
                                  left: '50%',
                                  transform: 'translateX(-50%)'
                                }}
                              >
                                {p.type === 'bio' ? <Sprout size={p.size} className="text-emerald-500" /> : 
                                 p.type === 'ind' ? <Factory size={p.size} className="text-blue-500" /> : 
                                 <Activity size={p.size} className="text-amber-500" />}
                              </div>
                            </div>
                          ))}
                       </div>

                       <div className="text-center space-y-4">
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Global <span className={hasPhysicalLand ? 'text-emerald-400' : 'text-indigo-400'}>Resonance Node</span></h3>
                          <p className="text-slate-400 text-xl font-medium italic opacity-70">"Consolidating field biometrics and industrial telemetry."</p>
                       </div>

                       <div className="flex gap-6 w-full max-w-2xl">
                          <button 
                            onClick={handleSyncTelemetry}
                            disabled={isSyncing}
                            className={`flex-[3] py-8 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-50 ${hasPhysicalLand ? 'agro-gradient' : 'bg-indigo-600 shadow-indigo-900/40'}`}
                          >
                             {isSyncing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                             {isSyncing ? 'INGESTING TELEMETRY...' : 'INITIALIZE REGISTRY SYNC'}
                          </button>
                          <button className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all shadow-xl flex items-center justify-center">
                             <Download size={24} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-4">
                       <Terminal className="w-6 h-6 text-emerald-400" /> Bio-Metric <span className="text-emerald-400">Stream</span>
                    </h4>
                    <div className="space-y-6">
                       {[
                         { l: 'Soil Purity Shard', v: '98.4%', i: Mountain, c: 'text-emerald-400' },
                         { l: 'Moisture Sink', v: '64.2%', i: Droplets, c: 'text-blue-400' },
                         { l: 'm-Constant Drift', v: '±0.02', i: History, c: 'text-indigo-400' },
                       ].map(t => (
                          <div key={t.l} className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex justify-between items-center group hover:border-white/20 transition-all shadow-inner">
                             <div className="flex items-center gap-4">
                                <t.i className={`w-5 h-5 ${t.c} opacity-40 group-hover:opacity-100`} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.l}</span>
                             </div>
                             <p className={`text-2xl font-mono font-black text-white`}>{t.v}</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border border-rose-500/10 bg-rose-500/[0.02] space-y-6 group">
                    <div className="flex items-center gap-3">
                       <Radiation size={20} className="text-rose-500 animate-pulse" />
                       <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest italic">Anomaly Watch</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-rose-500/20 pl-6">
                       "No biological pathogens or SID interference detected in the current mirror cycle."
                    </p>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: SEEDING PROTOCOL (GEOFENCE) --- */}
        {activeTab === 'seeding_program' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-700">
              <div className="flex justify-between items-center gap-6 px-4">
                 {SEEDING_STEPS.map((s) => (
                    <button 
                      key={s.id} 
                      onClick={() => setSeedingPhase(s.id as any)} 
                      className={`flex-1 p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 ${seedingPhase === s.id ? 'bg-emerald-600/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105' : 'bg-black border-white/5 text-slate-600 opacity-60'}`}
                    >
                       <s.icon size={32} className={seedingPhase === s.id ? 'text-emerald-400' : 'text-slate-700'} />
                       <span className="text-[11px] font-black uppercase tracking-[0.2em]">{s.label}</span>
                    </button>
                 ))}
              </div>

              <div className="p-16 glass-card rounded-[80px] border-2 border-white/10 bg-black/60 shadow-3xl text-center relative overflow-hidden min-h-[550px] flex flex-col items-center justify-center">
                 {seedingPhase === 'seeding' && (
                    <div className="space-y-12 animate-in slide-in-from-bottom-4 w-full max-w-2xl">
                       <div className="space-y-4">
                          <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Phase 1: <span className="text-emerald-400">Initialize Shard</span></h4>
                          <p className="text-slate-500 text-xl font-medium italic">"Acquire geofence lock to anchor your resource mass to the ledger."</p>
                       </div>
                       
                       <div className="p-10 bg-black/80 rounded-[48px] border border-white/5 space-y-10 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 bg-emerald-500/[0.02] animate-scan pointer-events-none"></div>
                          <div className="flex justify-center gap-10">
                             <div className="space-y-2">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">GPS_X_SHARD</p>
                                <p className="text-3xl font-mono font-black text-white">{geofenceLocked ? '-1.29' : '??.??'}</p>
                             </div>
                             <div className="w-px h-16 bg-white/10"></div>
                             <div className="space-y-2">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">GPS_Y_SHARD</p>
                                <p className="text-3xl font-mono font-black text-white">{geofenceLocked ? '36.82' : '??.??'}</p>
                             </div>
                          </div>
                          <button 
                            onClick={handleStartGeofence}
                            disabled={isGeofencing || geofenceLocked}
                            className={`w-full py-8 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl transition-all ${geofenceLocked ? 'bg-emerald-900/40 text-emerald-500 border border-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}`}
                          >
                             {isGeofencing ? <Loader2 size={24} className="animate-spin mx-auto" /> : geofenceLocked ? 'GEOFENCE_SHARD_LOCKED' : 'AUTHORIZE GEOLOCK HANDSHAKE'}
                          </button>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] block">Admin Signature (ESIN)</label>
                          <input 
                            type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                            placeholder="EA-VVVV-VVVV" 
                            className="w-full bg-black border border-white/10 rounded-[32px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>
                    </div>
                 )}

                 {seedingPhase === 'care' && (
                    <div className="space-y-12 animate-in zoom-in duration-500">
                       <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">Phase 2: <span className="text-indigo-400">Resonance Sync</span></h4>
                       <div className="flex items-center justify-center gap-12">
                          <div className="p-12 rounded-[56px] bg-black/60 border border-white/10 shadow-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                             <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-10">Current Resonance</p>
                             <p className="text-9xl font-mono font-black text-white tracking-tighter">{resonance}%</p>
                             <div className="mt-10 h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]`} style={{ width: `${resonance}%` }}></div>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <button onClick={() => { setResonance(Math.min(100, resonance + 2)); notify?.('info', 'RES_SYNC', 'Moisture shard optimized.'); }} className="w-24 h-24 rounded-[32px] bg-emerald-600 text-white flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all"><Droplets size={40} /></button>
                             <button onClick={() => { setResonance(Math.min(100, resonance + 3)); notify?.('info', 'RES_SYNC', 'Solar ingest maximized.'); }} className="w-24 h-24 rounded-[32px] bg-amber-600 text-white flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all"><Sun size={40} /></button>
                             <button onClick={() => { setResonance(Math.min(100, resonance + 1)); notify?.('info', 'RES_SYNC', 'Atmospheric flow aligned.'); }} className="w-24 h-24 rounded-[32px] bg-blue-600 text-white flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all"><Wind size={40} /></button>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* --- TAB: REACTION MINING --- */}
        {activeTab === 'mining' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-700">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-amber-500/20 bg-amber-500/[0.02] space-y-10 shadow-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s]"><Zap size={300} className="text-amber-400" /></div>
                    
                    <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                       <div className="w-16 h-16 bg-amber-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                          <Activity size={32} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Mining <span className="text-amber-500">Control</span></h3>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2">REACTION_PRESSURE_V4</p>
                       </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reaction Pressure</label>
                             <span className="text-2xl font-mono font-black text-white">{reactionPressure} <span className="text-xs italic text-slate-600">RP</span></span>
                          </div>
                          <div className="h-4 bg-black rounded-full border border-white/10 p-1 overflow-hidden shadow-inner relative">
                             <div className={`h-full bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600 shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-1000 ${reactionPressure > 80 ? 'animate-heat' : ''}`} style={{ width: `${reactionPressure}%` }}></div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} className="text-indigo-400" /> Sentiment (α)</label>
                             <span className="text-2xl font-mono font-black text-indigo-400">x{sentimentAlpha}</span>
                          </div>
                       </div>

                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-2 text-center shadow-inner relative overflow-hidden">
                          {reactionPressure > 80 && <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>}
                          <p className="text-[10px] text-slate-500 uppercase font-black">Estimated Mint Yield</p>
                          <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">
                             {Math.floor(reactionPressure * sentimentAlpha * user.metrics.timeConstantTau)} <span className="text-lg font-black italic">EAC</span>
                          </p>
                       </div>

                       <button 
                        onClick={handleRunMiningAudit}
                        disabled={isMining || reactionPressure === 0}
                        className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-30"
                       >
                          {isMining ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp size={28} className="fill-current" />}
                          {isMining ? 'SYNTHESIZING YIELD...' : 'INITIALIZE MINING SWEEP'}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-8 flex flex-col space-y-10">
                 {/* Live Vouch Feed */}
                 <div className="glass-card rounded-[64px] flex-1 border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-4">
                          <Signal size={24} className="text-emerald-400 animate-pulse" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white italic">Live Resonance Shards</span>
                       </div>
                       <span className="px-4 py-1 bg-black/60 rounded-full text-[9px] font-mono text-emerald-500 border border-emerald-500/20">NODE_{user.esin.split('-')[1] || 'STWD'}</span>
                    </div>

                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal space-y-6 bg-[#050706]">
                       {!miningInference && !isMining ? (
                         <div className="space-y-6">
                            {vouchFeed.map(v => (
                               <div key={v.id} className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/10 rounded-[32px] animate-in slide-in-from-right duration-500">
                                  <div className="flex items-center gap-6">
                                     <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 shadow-inner">
                                        {v.type === 'Zap' ? <Zap size={20} /> : v.type === 'Heart' ? <Heart size={20} /> : <ThumbsUp size={20} />}
                                     </div>
                                     <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">{v.user}</p>
                                        <p className="text-[9px] text-slate-600 font-mono mt-1">{v.type} packet received</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-xl font-mono font-black text-emerald-400">{v.value} EAC</p>
                                     <p className="text-[8px] text-slate-700 font-black uppercase">{v.time}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                       ) : isMining ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-12">
                             <Loader2 size={48} className="text-amber-500 animate-spin" />
                             <p className="text-amber-500 font-black text-2xl uppercase tracking-[0.5em] animate-pulse italic">EXTRACTING RESONANCE...</p>
                          </div>
                       ) : (
                          <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-10">
                             <div className="p-12 bg-black/80 rounded-[64px] border-l-8 border-l-amber-600 border border-white/10 relative overflow-hidden shadow-3xl">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-[10s]"><Activity size={600} className="text-white" /></div>
                                <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-8">
                                   <Bot size={120} className="text-amber-400" />
                                   <div>
                                      <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Inference Shard</h4>
                                      <p className="text-amber-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">MINING_ORACLE_REPORT</p>
                                   </div>
                                </div>
                                <div className="text-slate-300 text-2xl leading-relaxed italic border-l-4 border-amber-600/40 pl-10 font-medium relative z-10">
                                   {miningInference.sentiment_shard}
                                </div>
                                <div className="grid grid-cols-2 gap-8 mt-12 relative z-10">
                                   <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Resonance Index</p>
                                      <p className="text-4xl font-mono font-black text-indigo-400">{miningInference.resonance_index.toFixed(2)}x</p>
                                   </div>
                                   <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-2 shadow-inner text-right">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Extraction Efficiency</p>
                                      <p className="text-4xl font-mono font-black text-emerald-400">{(miningInference.extraction_efficiency * 100).toFixed(0)}%</p>
                                   </div>
                                </div>
                             </div>
                             <div className="flex justify-center gap-8">
                                <button onClick={() => setMiningInference(null)} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Analysis</button>
                                <button onClick={() => setIsMinterAuthOpen(true)} className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-2 border-white/10 ring-8 ring-white/5">
                                   AUTHORIZE MINT
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: MASTER PATH (ROADMAP) --- */}
        {activeTab === 'roadmap' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500 text-center">
              <div className="p-20 glass-card rounded-[80px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center justify-center space-y-12 shadow-3xl group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s]"><Compass size={500} className="text-indigo-400" /></div>
                 <div className="w-32 h-32 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.3)] border-4 border-white/10 relative z-10 animate-float">
                    <Trophy size={64} className="text-white" />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Steward <span className="text-indigo-400">Sovereignty</span></h3>
                    <p className="text-slate-400 text-2xl font-medium italic">"Mapping your trajectory from Seed Steward to Industrial Master."</p>
                 </div>
                 <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative z-10 py-10 border-y border-white/5">
                    <div className="p-8 bg-black/60 rounded-[40px] border border-indigo-500/20 shadow-inner">
                       <p className="text-[11px] text-slate-500 font-black uppercase mb-1">Path Progression</p>
                       <p className="text-6xl font-mono font-black text-white tracking-tighter">{dossierStrength}%</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 shadow-inner">
                       <p className="text-[11px] text-slate-500 font-black uppercase mb-1">Reputation Shards</p>
                       <p className="text-6xl font-mono font-black text-emerald-400">{user.wallet.lifetimeEarned.toFixed(0)}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setActiveTab('seeding_program')}
                  className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 relative z-10"
                 >
                    CONTINUE SEEDING PROTOCOL
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* MINTER AUTH MODAL */}
      {isMinterAuthOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in" onClick={() => setIsMinterAuthOpen(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-16 rounded-[64px] border-2 border-amber-500/30 bg-[#050706] text-center space-y-12 shadow-3xl">
              <div className="space-y-6">
                 <div className="w-24 h-24 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-amber-500/20 shadow-2xl relative group">
                    <Fingerprint className="w-12 h-12 text-amber-500 group-hover:scale-110 transition-transform" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic m-0">Mining <span className="text-amber-500">Authorization</span></h3>
                    <p className="text-slate-400 text-lg italic leading-relaxed">"Sign to anchor the extracted value shard to your node treasury."</p>
                 </div>
              </div>
              <div className="space-y-6">
                 <input 
                   type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                   placeholder="EA-XXXX-XXXX" 
                   className="w-full bg-black border border-white/10 rounded-[32px] py-8 text-center text-4xl font-mono text-white outline-none focus:ring-4 focus:ring-amber-500/20 transition-all uppercase placeholder:text-slate-900 shadow-inner tracking-widest" 
                 />
                 <button onClick={executeExtraction} className="w-full py-10 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95">AUTHORIZE EXTRACTION</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default OnlineGarden;
