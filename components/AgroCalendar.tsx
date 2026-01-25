
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, Clock, Sun, Moon, CloudRain, Snowflake, Wheat, 
  Sprout, Music, Radio, Zap, Heart, ShieldCheck, Landmark, 
  History, Info, ChevronRight, Binary, Target, Activity, 
  Bot, Sparkles, CheckCircle2, Waves, Flame, Timer, 
  Volume2, Play, Pause, RotateCcw, Droplets, User as UserIcon,
  // Added Loader2 to fix error on line 277
  Loader2
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
    name: 'Season of Awakening',
    kikuyu: 'Mbura ya Njahi (Long Rains)',
    months: 'Mar – May',
    biblical: 'Passover & First Fruits',
    formula: 'Dn (Density) Max',
    icon: CloudRain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    music: 'Genesis Hum (432 Hz)',
    state: 'Stomata opening, photosynthesis peak.',
    ritual: 'Seed Blessing with Medicag stims.'
  },
  {
    id: 'resilience',
    name: 'Season of Resilience',
    kikuyu: 'Gathano (Cold Season)',
    months: 'Jun – Aug',
    biblical: 'Shavuot (Pentecost)',
    formula: 'S (Stress) Min',
    icon: Snowflake,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    music: 'Resilience Rhythm (Binaural)',
    state: 'Steady sap flow, structural building.',
    ritual: 'Agroboto Automated Pruning.'
  },
  {
    id: 'ingathering',
    name: 'The Great Ingathering',
    kikuyu: 'Theu (Plentiful Harvest)',
    months: 'Sep – Oct',
    biblical: 'Sukkot (Tabernacles)',
    formula: 'In (Intensity) Max',
    icon: Wheat,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    music: 'Harmonic Orchestral',
    state: 'Peak bio-mass, energy complexity.',
    ritual: 'Tokenization of glory weight.'
  },
  {
    id: 'promise',
    name: 'The Second Rain',
    kikuyu: 'Mbura ya Mwere (Short Rains)',
    months: 'Oct – Dec',
    biblical: 'Advent / Hanukkah',
    formula: 'Ca (Cumulative) Max',
    icon: Sprout,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    music: 'Deep Bass / Ambient',
    state: 'Root focus, soil nutrient lock.',
    ritual: 'Soil Sabbath & Cover Sowing.'
  }
];

const DAILY_OFFICES = [
  { time: '06:00', name: 'The Awakening (Matins)', state: 'Stomata opening', action: 'Sunrise Ramp (tempo up)', icon: Sun, color: 'text-amber-400' },
  { time: '12:00', name: 'The High Sun (Sext)', state: 'Peak transpiration', action: 'Canopy Cooling (white noise)', icon: Flame, color: 'text-rose-500' },
  { time: '18:00', name: 'The Vesper (Evening)', state: 'Sugar transport', action: 'Descent (tempo down)', icon: Moon, color: 'text-indigo-400' },
  { time: '00:00', name: 'The Watch (Vigils)', state: 'Respiration & Repair', action: 'Silence (Listen Only)', icon: Radio, color: 'text-slate-500' },
];

const AgroCalendar: React.FC<AgroCalendarProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSeason, setActiveSeason] = useState(SEASONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleSyncFrequency = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(10, `LITURGICAL_SONIC_SYNC_${activeSeason.id.toUpperCase()}`);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Calendar className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse"></div>
            <Calendar className="w-20 h-20 text-white relative z-10" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">LITURGICAL_REGISTRY_v5.0</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Agro <span className="text-emerald-400">Calendar</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Harmonizing ancestral planting seasons with industrial bio-feedback. The farm is a sanctuary; the data is its liturgy."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Office Tracker */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border-white/5 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden group">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                    <Timer className="w-5 h-5 text-emerald-400" /> Daily <span className="text-emerald-400">Office</span>
                 </h3>
                 <span className="text-xl font-mono font-black text-emerald-400">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              <div className="space-y-8 relative z-10">
                 {DAILY_OFFICES.map(office => {
                   const isCurrent = currentOffice.name === office.name;
                   return (
                     <div key={office.name} className={`p-6 rounded-[32px] border-2 transition-all duration-500 flex items-center gap-6 ${isCurrent ? 'bg-emerald-600/10 border-emerald-500 shadow-2xl scale-105' : 'bg-black/40 border-white/5 opacity-40 grayscale'}`}>
                        <div className={`p-4 rounded-2xl ${isCurrent ? 'bg-emerald-500 shadow-xl' : 'bg-white/5'}`}>
                           <office.icon className={`w-8 h-8 ${isCurrent ? 'text-white' : 'text-slate-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h5 className={`text-sm font-black uppercase tracking-tight truncate ${isCurrent ? 'text-white' : 'text-slate-500'}`}>{office.name}</h5>
                           <p className="text-[10px] text-slate-500 italic mt-1">{office.state}</p>
                           {isCurrent && (
                             <div className="mt-3 flex items-center gap-2 text-[8px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                                <Radio size={10} /> Active Action: {office.action}
                             </div>
                           )}
                        </div>
                     </div>
                   );
                 })}
              </div>

              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] text-center space-y-4">
                 <Bot size={32} className="mx-auto text-emerald-400" />
                 <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic px-4">
                    "The daily rhythm is governed by plant stomata behavior and spectral solar influx."
                 </p>
              </div>
           </div>
        </div>

        {/* Seasonal Shards Grid */}
        <div className="lg:col-span-8 space-y-10">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8 px-4">
              <div>
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Seasonal <span className="text-indigo-400">Shards</span></h3>
                 <p className="text-slate-500 text-sm mt-2 italic">Mapping Kikuyu planting wisdom to Biblical feasts and SEHTI metrics.</p>
              </div>
              <div className="p-4 bg-indigo-600/5 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                 <Landmark className="w-5 h-5 text-indigo-400" />
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocol Sync Status: OK</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SEASONS.map(season => (
                <div 
                  key={season.id} 
                  onClick={() => setActiveSeason(season)}
                  className={`p-10 glass-card rounded-[64px] border-2 transition-all duration-500 group flex flex-col justify-between cursor-pointer active:scale-95 ${activeSeason.id === season.id ? `bg-black ${season.border} shadow-3xl scale-[1.02]` : 'bg-black/20 border-white/5 opacity-60'}`}
                >
                   <div className="space-y-8">
                      <div className="flex justify-between items-start">
                         <div className={`p-5 rounded-3xl ${season.bg} border ${season.border} transition-transform group-hover:rotate-12`}>
                            <season.icon className={`w-8 h-8 ${season.color}`} />
                         </div>
                         <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${season.bg} ${season.border} ${season.color}`}>{season.months}</span>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">{season.name}</h4>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{season.kikuyu}</p>
                      </div>
                      <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-4 shadow-inner">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-slate-600">Biblical Context</span>
                            <span className="text-blue-400">{season.biblical}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span className="text-slate-600">Equation Focus</span>
                            <span className="text-emerald-400">{season.formula}</span>
                         </div>
                      </div>
                   </div>
                   <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                      <button className={`text-[10px] font-black uppercase tracking-widest ${season.color} flex items-center gap-2 hover:translate-x-1 transition-all`}>
                         View Protocol <ChevronRight size={14} />
                      </button>
                      <Binary size={18} className="text-slate-800" />
                   </div>
                </div>
              ))}
           </div>

           {/* Active Ritual Protocol Detail */}
           <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 relative overflow-hidden shadow-3xl group animate-in slide-in-from-right-4 duration-700">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><activeSeason.icon size={400} className={activeSeason.color} /></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                 <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">The <span className={activeSeason.color}>Ritual Protocol</span></h3>
                       <p className="text-slate-400 text-xl font-medium italic">"{activeSeason.ritual}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-black/80 rounded-[44px] border border-white/10 space-y-6 shadow-inner border-l-8 border-l-emerald-500/40">
                          <h5 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3">
                             <Waves className="w-4 h-4" /> Sonic Signature
                          </h5>
                          <p className="text-2xl font-black text-white uppercase italic leading-tight m-0">{activeSeason.music}</p>
                          <p className="text-xs text-slate-500 italic">"Registry confirmed. Sensors are tuned to detect {activeSeason.state}"</p>
                       </div>

                       <div className="flex flex-col items-center justify-center p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[44px] space-y-8 relative overflow-hidden">
                          <div className="absolute inset-0 bg-indigo-500/[0.02] animate-pulse"></div>
                          <div className="flex items-end gap-3 h-20 relative z-10">
                             {[...Array(16)].map((_, i) => (
                               <div 
                                 key={i} 
                                 className={`w-1.5 rounded-full ${isPlaying ? 'bg-indigo-400 animate-bounce' : 'bg-slate-700'}`} 
                                 style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.1}s`, animationDuration: isPlaying ? '0.6s' : '0s' }}
                               ></div>
                             ))}
                          </div>
                          <div className="flex gap-4 relative z-10 w-full">
                             <button 
                               onClick={() => setIsPlaying(!isPlaying)}
                               className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                             >
                                {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? 'PAUSE SIG' : 'TEST SIG'}
                             </button>
                             <button 
                                onClick={handleSyncFrequency}
                                disabled={isSyncing}
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all active:scale-90"
                             >
                                {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Daily Cycle Footer */}
      <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl mt-12">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Landmark className="w-96 h-96 text-emerald-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse ring-[15px] ring-white/5 shrink-0">
               <History className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-4">
               <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Sustainability Credits</h4>
               <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-md:text-sm max-w-lg mx-auto md:mx-0">Stewards earn recurring EAC rewards for adhering to the Liturgical Cycle and maintaining biological resonance.</p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0">
            <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">SYNC_STABILITY</p>
            <p className="text-7xl font-mono font-black text-white tracking-tighter">98<span className="text-3xl text-emerald-400 ml-1">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.7); }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroCalendar;
