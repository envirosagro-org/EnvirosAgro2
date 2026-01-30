
import React, { useState, useEffect, useMemo } from 'react';
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
  Wallet
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

const MOCK_TELEM = [
  { label: 'Network Contribution', val: 'Level 14', status: 'ACTIVE', col: 'text-indigo-400' },
  { label: 'Work Resonance', val: '0.92', status: 'NOMINAL', col: 'text-emerald-400' },
  { label: 'Ledger Depth', val: '42 Shards', status: 'SYNCED', col: 'text-blue-400' },
  { label: 'Pathogen Risk', val: 'Low', status: 'SAFE', col: 'text-amber-400' },
];

const OnlineGarden: React.FC<OnlineGardenProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'twin' | 'roadmap' | 'mining' | 'registry'>('twin');
  const [selectedRole, setSelectedRole] = useState<string>(user.role.toLowerCase().includes('farmer') ? 'biological' : 'industrial');
  const [isSyncing, setIsSyncing] = useState(false);
  const [roadmapShard, setRoadmapShard] = useState<string | null>(null);
  const [isForgingRoadmap, setIsForgingRoadmap] = useState(false);
  
  // Interaction states for navigation triggers
  const [isNavigatingMRV, setIsNavigatingMRV] = useState(false);
  const [isNavigatingWallet, setIsNavigatingWallet] = useState(false);

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

  const activeRoleData = useMemo(() => {
    return STEWARD_ROLES.find(r => r.id === selectedRole) || STEWARD_ROLES[0];
  }, [selectedRole]);

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(5, 'GARDEN_SHARD_RESONANCE_SYNC');
    }, 2000);
  };

  const handleGenerateRoadmap = async () => {
    setIsForgingRoadmap(true);
    setRoadmapShard(null);

    try {
      const prompt = `Act as an EnvirosAgro Strategic Advisor. Generate a Universal Garden Roadmap for a ${selectedRole} steward.
      Context: This steward consolidates all app work (TQM, Industrial, Bio) into this Digital Twin.
      Physical Land Anchor: ${hasPhysicalLand ? 'Verified' : 'Conceptual'}
      Metrics: C(a)=${user.metrics.agriculturalCodeU}, m-constant=${user.metrics.timeConstantTau}
      
      Prescribe 3 actions to increase "Dossier Strength" and network resonance.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setRoadmapShard(res.text);
    } catch (e) {
      setRoadmapShard("Oracle Handshake Failure: Registry sync interrupted.");
    } finally {
      setIsForgingRoadmap(false);
    }
  };

  const handleInitializeCarbonPipeline = () => {
    if (dossierStrength < 50) {
      alert("RESTRICTED: Carbon Mining requires a Physical Land Anchor (Dossier Strength > 50%). Register a plot via Registry Handshake first.");
      return;
    }
    
    setIsNavigatingMRV(true);
    setTimeout(() => {
      onNavigate('digital_mrv');
    }, 800);
  };

  const handleInitializeReactionHarvest = () => {
    setIsNavigatingWallet(true);
    setTimeout(() => {
      onNavigate('wallet');
    }, 800);
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
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'twin', label: 'Universal Twin', icon: Satellite },
          { id: 'roadmap', label: 'Steward Roadmap', icon: MapIcon },
          { id: 'mining', label: 'Value Mining', icon: Zap },
          { id: 'registry', label: 'Role Calibration', icon: Database },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">
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
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4 px-2">Active Steward Type</p>
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-emerald-400">
                             {(() => {
                                const RoleIcon = activeRoleData.icon;
                                return <RoleIcon size={24} />;
                             })()}
                          </div>
                          <div>
                             <p className="text-lg font-black text-white uppercase italic">{activeRoleData.name}</p>
                             <p className="text-[10px] text-slate-600 font-mono">Dossier Quality: {dossierStrength}%</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl space-y-4">
                       <div className="flex items-center gap-3">
                          <Activity size={14} className="text-blue-400" />
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Network Inflow</p>
                       </div>
                       <p className="text-xs text-slate-400 italic">"Consolidating 12 un-anchored task shards from Live Farming and 2 registry vouches from Community Hub."</p>
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
                    {dossierStrength <= 50 && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                         <div className="p-8 glass-card rounded-3xl border border-white/20 bg-black/90 text-center space-y-4 max-w-xs shadow-3xl">
                            <Lock className="w-10 h-10 text-rose-500 mx-auto" />
                            <h4 className="text-lg font-black text-white uppercase italic">Mining Locked</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Dossier Strength &lt; 50%. Link a physical land resource to unlock carbon sharding.</p>
                            <button onClick={() => onNavigate('registry_handshake')} className="text-emerald-400 text-[10px] font-black uppercase underline decoration-emerald-500/40">Anchor Plot Now</button>
                         </div>
                      </div>
                    )}
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
                      onClick={handleInitializeCarbonPipeline}
                      disabled={isNavigatingMRV}
                      className="w-full py-8 mt-12 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                       {isNavigatingMRV ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6 fill-current" />}
                       {isNavigatingMRV ? 'INITIALIZING MRV...' : 'EXECUTE CARBON MINT'}
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
                      onClick={handleInitializeReactionHarvest}
                      disabled={isNavigatingWallet}
                      className="w-full py-8 mt-12 bg-indigo-800 hover:bg-indigo-700 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                       {isNavigatingWallet ? <Loader2 size={24} className="animate-spin" /> : <Wallet size={24} />}
                       {isNavigatingWallet ? 'ACCESSING TREASURY...' : 'MINT SOCIAL YIELD'}
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'registry' && (
           <div className="space-y-12 animate-in fade-in duration-500 px-4">
              <div className="text-center space-y-4">
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Steward <span className="text-emerald-400">Calibration</span></h3>
                 <p className="text-slate-500 text-lg italic max-w-2xl mx-auto">Calibrate your node role to optimize the Oracle's guidance for your specific agricultural work.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {STEWARD_ROLES.map(role => (
                    <div key={role.id} className={`p-10 glass-card rounded-[56px] border-2 transition-all flex flex-col items-center text-center space-y-8 group relative overflow-hidden ${selectedRole === role.id ? 'border-emerald-500 bg-emerald-600/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-black/40'}`}>
                       <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center shadow-3xl transition-transform group-hover:scale-110 ${selectedRole === role.id ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-700'}`}>
                          {(() => {
                             const RoleIcon = role.icon;
                             return <RoleIcon size={48} />;
                          })()}
                       </div>
                       <div className="space-y-4 flex-1">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{role.name}</h4>
                          <p className="text-sm text-slate-500 italic font-medium leading-relaxed opacity-80">"{role.desc}"</p>
                       </div>
                       <button 
                         onClick={() => setSelectedRole(role.id)}
                         className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedRole === role.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 border border-white/10 text-slate-500 hover:text-white'
                         }`}
                       >
                          {selectedRole === role.id ? 'ACTIVE_CALIBRATION' : 'ACTIVATE ROLE'}
                       </button>
                    </div>
                 ))}
              </div>

              <div className="p-12 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between shadow-2xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 p-8 opacity-[0.05]"><Fingerprint size={300} /></div>
                  <div className="flex items-center gap-10 relative z-10">
                     <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-3xl"><ShieldCheck size={40} /></div>
                     <div className="space-y-2">
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Registry Handshake</h4>
                        <p className="text-slate-400 text-xl font-medium italic">Already have physical land? Link it to permanently anchor your Bio-Shard.</p>
                     </div>
                  </div>
                  <button onClick={() => onNavigate('registry_handshake')} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl relative z-10">
                     Initialize Handshake
                  </button>
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
            <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Fingerprint className="w-20 h-20 text-white" />
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
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default OnlineGarden;
