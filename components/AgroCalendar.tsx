
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Sun, Moon, CloudRain, Snowflake, Wheat, 
  Sprout, Music, Radio, Zap, Heart, ShieldCheck, Landmark, 
  History, Info, ChevronRight, Binary, Target, Activity, 
  Bot, Sparkles, CheckCircle2, Waves, Flame, Timer, 
  Play, Pause, RotateCcw, Droplets,
  Loader2,
  X,
  FileText,
  ArrowRight,
  Database,
  TrendingUp,
  Sunrise,
  Sunset,
  Ear,
  Wind,
  BadgeCheck
} from 'lucide-react';
import { User } from '../types';

interface AgroCalendarProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const SEASONS = [
  {
    id: 'awakening',
    index: '01',
    name: 'Season of Awakening',
    kikuyu: 'Mbura ya Njahi (Long Rains)',
    months: 'MAR – MAY',
    biblical: 'PASSOVER & FIRST FRUITS',
    formula: 'DN (DENSITY) MAX',
    icon: CloudRain,
    color: 'text-emerald-400',
    accent: 'emerald',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    music: 'Genesis Hum (432 Hz)',
    state: 'Stomata opening, photosynthesis peak.',
    ritual: 'Seed Blessing with Medicag stims.',
    freq: '432'
  },
  {
    id: 'resilience',
    index: '02',
    name: 'Season of Resilience',
    kikuyu: 'Gathano (Cold Season)',
    months: 'JUN – AUG',
    biblical: 'SHAVUOT (PENTECOST)',
    formula: 'S (STRESS) MIN',
    icon: Snowflake,
    color: 'text-blue-400',
    accent: 'blue',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    music: 'Resilience Rhythm (Binaural)',
    state: 'Steady sap flow, structural building.',
    ritual: 'Agroboto Automated Pruning.',
    freq: '528'
  },
  {
    id: 'ingathering',
    index: '03',
    name: 'The Great Ingathering',
    kikuyu: 'Theu (Plentiful Harvest)',
    months: 'SEP – OCT',
    biblical: 'SUKKOT (TABERNACLES)',
    formula: 'IN (INTENSITY) MAX',
    icon: Wheat,
    color: 'text-amber-400',
    accent: 'amber',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    music: 'Harmonic Orchestral',
    state: 'Peak bio-mass, energy complexity.',
    ritual: 'Tokenization of glory weight.',
    freq: '639'
  },
  {
    id: 'promise',
    index: '04',
    name: 'The Second Rain',
    kikuyu: 'Mbura ya Mwere (Short Rains)',
    months: 'OCT – DEC',
    biblical: 'ADVENT / HANUKKAH',
    formula: 'CA (CUMULATIVE) MAX',
    icon: Sprout,
    color: 'text-indigo-400',
    accent: 'indigo',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    music: 'Deep Bass / Ambient',
    state: 'Root focus, soil nutrient lock.',
    ritual: 'Soil Sabbath & Cover Sowing.',
    freq: '396'
  }
];

const DAILY_OFFICES = [
  { 
    id: 'awakening',
    time: '06:00', 
    name: 'Awakening', 
    liturgical: 'Matins',
    state: 'Stomata opening, photosynthesis starts.', 
    sonicShard: 'Sunrise Ramp',
    sonicDesc: 'Increasing tempo & 432Hz root stimulation.',
    icon: Sunrise, 
    color: 'text-amber-400',
    accent: 'amber',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20'
  },
  { 
    id: 'sext',
    time: '12:00', 
    name: 'Sext', 
    liturgical: 'High Sun',
    state: 'Peak transpiration. Thermal stress potential.', 
    sonicShard: 'Canopy Cooling',
    sonicDesc: 'Acoustic white noise & evaporative resonance.',
    icon: Sun, 
    color: 'text-orange-500',
    accent: 'orange',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20'
  },
  { 
    id: 'vesper',
    time: '18:00', 
    name: 'Vesper', 
    liturgical: 'Evening',
    state: 'Stomata closing. Sugar transport to roots.', 
    sonicShard: 'Descent Protocol',
    sonicDesc: 'Decreasing tempo & grounding bass frequencies.',
    icon: Sunset, 
    color: 'text-indigo-400',
    accent: 'indigo',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20'
  },
  { 
    id: 'watch',
    time: '00:00', 
    name: 'The Watch', 
    liturgical: 'Vigils',
    state: 'Respiration and molecular repair cycle.', 
    sonicShard: 'Silence Buffer',
    sonicDesc: 'Passive sensor listening mode. No active audio.',
    icon: Moon, 
    color: 'text-slate-400',
    accent: 'slate',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20'
  },
];

const AgroCalendar: React.FC<AgroCalendarProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeSeason, setActiveSeason] = useState<typeof SEASONS[0] | null>(null);
  const [activeOffice, setActiveOffice] = useState<typeof DAILY_OFFICES[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentOffice = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return DAILY_OFFICES[0];
    if (hour >= 12 && hour < 18) return DAILY_OFFICES[1];
    if (hour >= 18 && hour < 24) return DAILY_OFFICES[2];
    return DAILY_OFFICES[3];
  }, [currentTime]);

  const handleSyncFrequency = (shardId: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(10, `LITURGICAL_SONIC_SYNC_${shardId.toUpperCase()}`);
    }, 2000);
  };

  const getThemeColor = () => {
    if (currentOffice.id === 'awakening') return 'rgba(245, 158, 11, 0.1)';
    if (currentOffice.id === 'sext') return 'rgba(249, 115, 22, 0.1)';
    if (currentOffice.id === 'vesper') return 'rgba(99, 102, 241, 0.1)';
    return 'rgba(100, 116, 139, 0.1)';
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32 max-w-[1400px] mx-auto relative">
      
      {/* Background Atmospheric Glow */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 transition-all duration-[3s] blur-[150px] z-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${getThemeColor()}, transparent 70%)` }}
      />

      {/* 1. Enhanced Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/[0.03] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl mx-4 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Clock className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-28 h-28 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-pulse ring-[15px] ring-white/5 shrink-0">
               <Calendar className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Liturgical <span className="text-emerald-400">Registry</span></h2>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                 Synchronizing ancestral agricultural wisdom with the **Agro Musika** daily office and seasonal Equation focuses.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">CURRENT_UTC_TIME</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
         </div>
      </div>

      {/* 2. Daily Routine Shards */}
      <div className="space-y-8 px-4 relative z-10">
        <div className="flex items-center justify-between px-6">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Timer className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Daily <span className="text-indigo-400">Routine Shards</span></h3>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">REALTIME_OFFICE_SYNC</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {DAILY_OFFICES.map((office) => {
             const isCurrent = currentOffice.id === office.id;
             return (
               <div 
                 key={office.id}
                 onClick={() => setActiveOffice(office)}
                 className={`p-10 glass-card rounded-[56px] border-2 transition-all duration-700 cursor-pointer group relative overflow-hidden flex flex-col justify-between ${
                   isCurrent 
                   ? `${office.border} bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)] scale-[1.03] ring-4 ring-white/5` 
                   : 'border-white/5 bg-black/40 opacity-40 hover:opacity-80 hover:scale-[1.01]'
                 }`}
               >
                  <div className="space-y-8 relative z-10">
                     <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl ${office.bg} border ${office.border} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 shadow-lg`}>
                           <office.icon className={`w-8 h-8 ${office.color}`} />
                        </div>
                        <span className={`text-[11px] font-mono font-black py-1 px-3 rounded-lg border border-white/5 bg-white/5 ${isCurrent ? office.color : 'text-slate-700'}`}>
                           {office.time}
                        </span>
                     </div>

                     <div>
                        <h4 className={`text-3xl font-black text-white uppercase italic tracking-tighter m-0 transition-colors ${isCurrent ? office.color : 'text-slate-500'}`}>{office.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{office.liturgical} Office</p>
                     </div>

                     <div className={`p-6 rounded-[32px] border transition-all duration-700 shadow-inner ${isCurrent ? 'bg-black/60 border-white/10' : 'bg-black/20 border-transparent opacity-50'}`}>
                        <div className="flex items-center gap-3 mb-4">
                           <Zap className={`w-3.5 h-3.5 ${office.color} opacity-60`} />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sonic Shard</p>
                        </div>
                        <p className="text-sm font-black text-white uppercase italic leading-tight">{office.sonicShard}</p>
                        <p className="text-[9px] text-slate-600 leading-relaxed italic mt-2 line-clamp-2">"{office.sonicDesc}"</p>
                     </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-2">
                        {isCurrent && <div className={`w-2 h-2 rounded-full animate-pulse ${office.color.replace('text', 'bg')}`}></div>}
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? office.color : 'text-slate-800'}`}>
                           {isCurrent ? 'ACTIVE_SYNC' : 'STANDBY'}
                        </span>
                     </div>
                     <ChevronRight size={16} className={`transition-transform duration-500 group-hover:translate-x-1 ${isCurrent ? office.color : 'text-slate-900'}`} />
                  </div>
               </div>
             );
           })}
        </div>
      </div>

      {/* 3. Seasonal Registry Grid */}
      <div className="space-y-8 px-4 relative z-10">
        <div className="flex items-center justify-between px-6">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Seasonal <span className="text-emerald-400">Equation Shards</span></h3>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry Loop: NJAHI_MWERE_CYCLES</span>
              <History size={14} className="text-slate-600" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SEASONS.map((season) => (
            <div 
              key={season.id} 
              className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/60 shadow-3xl relative overflow-hidden group hover:border-white/20 transition-all active:scale-[0.99] duration-500"
            >
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`p-5 rounded-3xl ${season.bg} border ${season.border} group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                  <season.icon className={`w-10 h-10 ${season.color}`} />
                </div>
                <span className={`px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest transition-colors group-hover:text-white ${season.color}`}>
                  {season.months}
                </span>
              </div>

              <div className="space-y-3 mb-10 relative z-10">
                <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:scale-[1.02] transition-transform origin-left duration-700">
                  {season.name}
                </h3>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500/40`} />
                  {season.kikuyu}
                </p>
              </div>

              <div className="p-10 bg-black/40 rounded-[40px] border border-white/5 space-y-8 shadow-inner relative z-10 group-hover:bg-black/60 transition-all">
                 <div className="flex justify-between items-center text-[11px] font-black uppercase group-hover:translate-x-1 transition-transform">
                    <span className="text-slate-600 tracking-[0.2em]">Biblical Context</span>
                    <span className="text-blue-400 font-mono tracking-widest">{season.biblical}</span>
                 </div>
                 <div className="w-full h-px bg-white/5"></div>
                 <div className="flex justify-between items-center text-[11px] font-black uppercase group-hover:-translate-x-1 transition-transform">
                    <span className="text-slate-600 tracking-[0.2em]">Equation Focus</span>
                    <span className="text-emerald-400 font-mono tracking-widest">{season.formula}</span>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
                <button 
                  onClick={() => setActiveSeason(season)}
                  className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 group/link transition-all ${season.color} hover:text-white`}
                >
                  View Full Protocol <ChevronRight size={16} className="group-hover/link:translate-x-2 transition-transform duration-300" />
                </button>
                <div className="text-right">
                  <p className="text-[11px] font-mono text-slate-800 font-black tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                    REGISTRY_SHARD_{season.index} / 12
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Global Alignment Shard Footer */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl mx-4 mt-12 z-10 backdrop-blur-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
            <Landmark className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse ring-[15px] ring-white/5 shrink-0">
               <ShieldCheck className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Liturgical Alignment</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-lg mx-auto md:mx-0">
                 Synchronize node actions with the biological liturgical year to earn recurrent EAC rewards and boost local C(a) constants.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">SYNC_RELIABILITY</p>
            <p className="text-8xl font-mono font-black text-white tracking-tighter">100<span className="text-4xl text-emerald-400 ml-1">%</span></p>
         </div>
      </div>

      {/* 5. Daily Office Detail Modal */}
      {activeOffice && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-8 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setActiveOffice(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-2 bg-[#050706] shadow-3xl animate-in zoom-in duration-500 border-white/20 flex flex-col max-h-[90vh]">
              
              <div className="p-12 border-b border-white/5 flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-8">
                    <div className={`w-24 h-24 rounded-[36px] flex items-center justify-center shadow-3xl ${activeOffice.bg} border ${activeOffice.border}`}>
                       <activeOffice.icon className={`w-12 h-12 ${activeOffice.color}`} />
                    </div>
                    <div>
                       <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Daily <span className={activeOffice.color}>Office Shard</span></h3>
                       <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase mt-4 flex items-center gap-3">
                          <Binary size={14} className={activeOffice.color} />
                          {activeOffice.id.toUpperCase()}_OFFICE // SYNC_TIME: {activeOffice.time}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setActiveOffice(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90 hover:rotate-90"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-16 custom-scrollbar space-y-12 bg-black/40 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <div className="space-y-6">
                          <div className="flex items-center gap-3 px-2">
                             <Target size={18} className={activeOffice.color} />
                             <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Plant Bio-State</h4>
                          </div>
                          <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 shadow-inner group/state">
                             <p className="text-slate-300 text-xl italic leading-relaxed font-medium border-l-4 border-emerald-500/40 pl-10 group-hover/state:text-white transition-colors">
                                "{activeOffice.state}"
                             </p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h5 className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-3 px-4 ${activeOffice.color}`}>
                             <Ear className="w-4 h-4" /> Sonic Action Shard
                          </h5>
                          <div className={`p-8 rounded-3xl border shadow-inner transition-all duration-700 ${activeOffice.bg} ${activeOffice.border}`}>
                             <p className="text-3xl font-black text-white uppercase italic m-0 leading-tight">{activeOffice.sonicShard}</p>
                             <p className="text-sm text-slate-500 italic mt-3">"Registry confirmed. Playing {activeOffice.sonicShard} logic..."</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-12">
                       <div className="space-y-6">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3">
                             <Waves className={`w-6 h-6 ${activeOffice.color}`} /> Musika Frequency
                          </h4>
                          <div className={`p-12 glass-card border rounded-[56px] flex flex-col items-center text-center space-y-10 relative overflow-hidden group shadow-2xl ${activeOffice.border} bg-black/40`}>
                             <div className={`absolute inset-0 opacity-5 animate-pulse ${activeOffice.bg}`} />
                             <div className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-3xl relative z-10 group-hover:scale-110 transition-transform ${activeOffice.bg.replace('10', '80')}`}>
                                <Music className="w-12 h-12" />
                             </div>
                             
                             <div className="flex items-end gap-3 h-24 relative z-10">
                                {[...Array(24)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-2 rounded-full transition-all duration-500 ${isPlaying ? activeOffice.color.replace('text', 'bg') + ' animate-bounce shadow-[0_0_15px_current]' : 'bg-slate-800'}`} 
                                    style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s`, animationDuration: '0.6s' }}
                                  />
                                ))}
                             </div>

                             <div className="flex gap-4 w-full relative z-10">
                                <button 
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className={`flex-[2] py-5 rounded-[32px] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 ${isPlaying ? 'bg-rose-600' : `${activeOffice.bg.replace('10', '80')} hover:scale-[1.02]`}`}
                                >
                                   {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="translate-x-0.5" />} 
                                   {isPlaying ? 'PAUSE SIGNAL' : 'TEST SIGNAL'}
                                </button>
                                <button 
                                  onClick={() => handleSyncFrequency(activeOffice.id)}
                                  disabled={isSyncing}
                                  className="flex-1 p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-90 flex items-center justify-center"
                                >
                                   {isSyncing ? <Loader2 size={24} className="animate-spin text-emerald-400" /> : <RotateCcw size={24} />}
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center shrink-0">
                 <button 
                  onClick={() => { setActiveOffice(null); setIsPlaying(false); }}
                  className="px-24 py-7 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                 >
                    <CheckCircle2 size={20} /> Sync Office to Registry
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* 6. Seasonal Detail Modal */}
      {activeSeason && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-8 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setActiveSeason(null)}></div>
           <div className={`relative z-10 w-full max-w-4xl glass-card rounded-[64px] border-2 bg-[#050706] shadow-3xl animate-in zoom-in duration-500 border-white/20 flex flex-col max-h-[90vh]`}>
              
              <div className="p-12 border-b border-white/5 flex justify-between items-center shrink-0 relative z-10">
                 <div className="flex items-center gap-8">
                    <div className={`w-24 h-24 rounded-[36px] flex items-center justify-center shadow-3xl ${activeSeason.bg} border ${activeSeason.border}`}>
                       <activeSeason.icon className={`w-12 h-12 ${activeSeason.color}`} />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Protocol <span className={activeSeason.color}>Shard</span></h3>
                       <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase mt-4 flex items-center gap-3">
                          <Binary size={14} className={activeSeason.color} />
                          {activeSeason.id.toUpperCase()}_INIT // CYCLE_12 // {activeSeason.formula}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setActiveSeason(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all active:scale-90 hover:rotate-90"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar space-y-16 bg-black/20 relative z-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                       <div className="space-y-6">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4 px-2">
                             <FileText size={24} className={activeSeason.color} />
                             Ritual Protocol
                          </h4>
                          <div className="p-12 bg-black/60 rounded-[56px] border border-white/5 shadow-inner group/rit">
                             <p className="text-slate-300 text-2xl md:text-3xl italic leading-relaxed font-medium border-l-8 border-emerald-500/40 pl-12 transition-all duration-700 group-hover/rit:text-white">
                                "{activeSeason.ritual}"
                             </p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h5 className={`text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 px-6`}>
                             <Target className={`w-4 h-4 ${activeSeason.color}`} /> Primary Pillars
                          </h5>
                          <div className="space-y-4">
                             {[
                                { l: 'Bio-Resonance', v: '98.2%', i: Activity },
                                { l: 'Registry Depth', v: '124 Shards', i: Database },
                                { l: 'Yield Forecast', v: '+18.4%', i: TrendingUp },
                             ].map((m, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[28px] border border-white/5 hover:border-white/20 transition-all">
                                   <div className="flex items-center gap-4">
                                      <m.i size={18} className={activeSeason.color} />
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.l}</span>
                                   </div>
                                   <span className="text-lg font-mono font-black text-white">{m.v}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-12">
                       <div className="space-y-6">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                             <Waves className={`w-6 h-6 ${activeSeason.color}`} /> Sonic Blueprint
                          </h4>
                          <div className={`p-12 glass-card rounded-[64px] border border-white/5 bg-black/40 flex flex-col items-center text-center space-y-10 relative overflow-hidden group shadow-3xl`}>
                             <div className={`absolute inset-0 opacity-[0.03] animate-pulse ${activeSeason.bg}`} />
                             <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-3xl relative z-10 transition-transform duration-[2s] group-hover:scale-110 ${activeSeason.bg.replace('10', '90')}`}>
                                <Music className="w-14 h-14" />
                             </div>
                             <div className="space-y-3 relative z-10">
                                <p className="text-3xl font-black text-white uppercase italic drop-shadow-lg">{activeSeason.music}</p>
                                <p className={`text-[11px] font-mono tracking-widest font-black uppercase ${activeSeason.color}`}>{activeSeason.freq} HZ_CENTER_CHANNEL</p>
                             </div>
                             
                             <div className="flex items-end gap-3 h-20 relative z-10">
                                {[...Array(20)].map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-2 rounded-full transition-all duration-700 ${isPlaying ? activeSeason.color.replace('text', 'bg') + ' animate-bounce shadow-[0_0_20px_current]' : 'bg-slate-900'}`} 
                                    style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.08}s`, animationDuration: '0.7s' }}
                                  />
                                ))}
                             </div>

                             <div className="flex gap-4 w-full relative z-10">
                                <button 
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className={`flex-[2] py-6 rounded-[32px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-5 transition-all active:scale-95 ${isPlaying ? 'bg-rose-600' : `${activeSeason.bg.replace('10', '90')} hover:scale-[1.02]`}`}
                                >
                                   {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="translate-x-0.5" />} 
                                   {isPlaying ? 'ABORT SIG' : 'START SIG'}
                                </button>
                                <button 
                                  onClick={() => handleSyncFrequency(activeSeason.id)}
                                  disabled={isSyncing}
                                  className="flex-1 p-6 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all flex items-center justify-center"
                                >
                                   {isSyncing ? <Loader2 size={24} className={`animate-spin ${activeSeason.color}`} /> : <RotateCcw size={24} />}
                                </button>
                             </div>
                          </div>
                       </div>

                       <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[48px] flex items-center gap-8 shadow-inner group">
                          <Bot className="w-12 h-12 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
                             "Registry calibration for {activeSeason.name} protocol minimizes regional stress (S) and optimizes m-constant resilience across your local node cluster."
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-12 border-t border-white/5 bg-white/[0.01] flex justify-center shrink-0">
                 <button 
                  onClick={() => { setActiveSeason(null); setIsPlaying(false); }}
                  className="px-32 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ring-8 ring-white/5"
                 >
                    <BadgeCheck size={24} /> Acknowledge & Anchor Shard
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.7); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroCalendar;
