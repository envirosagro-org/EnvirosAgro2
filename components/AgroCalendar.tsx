
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
  BadgeCheck,
  ExternalLink,
  MapPin,
  Cloud,
  ThermometerSun,
  RefreshCw,
  ShieldAlert,
  Gavel
} from 'lucide-react';
import { User } from '../types';
import { getWeatherForecast, AIResponse } from '../services/geminiService';

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
    freq: '432',
    isSabbath: false
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
    freq: '528',
    isSabbath: true
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
    freq: '639',
    isSabbath: false
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
    freq: '396',
    isSabbath: true
  }
];

const DAILY_OFFICES = [
  { id: 'awakening', time: '06:00', name: 'Awakening', liturgical: 'Matins', state: 'Stomata opening.', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { id: 'sext', time: '12:00', name: 'Sext', liturgical: 'High Sun', state: 'Peak transpiration.', icon: Sun, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'vesper', time: '18:00', name: 'Vesper', liturgical: 'Evening', state: 'Stomata closing.', icon: Sunset, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
  { id: 'watch', time: '00:00', name: 'The Watch', liturgical: 'Vigils', state: 'Molecular repair.', icon: Moon, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
];

const AgroCalendar: React.FC<AgroCalendarProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeSeason, setActiveSeason] = useState<typeof SEASONS[0] | null>(null);
  const [activeOffice, setActiveOffice] = useState<typeof DAILY_OFFICES[0] | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<AIResponse | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchWeather();
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await getWeatherForecast(user.location);
      setWeatherData(data);
    } catch (e) {
      console.error("Weather ingest failed");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const currentOffice = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return DAILY_OFFICES[0];
    if (hour >= 12 && hour < 18) return DAILY_OFFICES[1];
    if (hour >= 18 && hour < 24) return DAILY_OFFICES[2];
    return DAILY_OFFICES[3];
  }, [currentTime]);

  const handleSyncLiturgy = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onEarnEAC(10, 'LITURGICAL_ORACLE_SYNC');
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-32 max-w-[1400px] mx-auto relative">
      
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

      {/* Sabbath Alert Section */}
      {SEASONS.find(s => s.isSabbath && s.months.includes(currentTime.toLocaleString('en-US', { month: 'short' }).toUpperCase())) && (
        <div className="px-4 animate-in slide-in-from-top-6 duration-700">
           <div className="p-8 rounded-[48px] bg-rose-950/20 border-2 border-rose-500/30 flex items-center gap-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Gavel size={200} className="text-rose-500" /></div>
              <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center shadow-3xl shrink-0 border-2 border-white/10 relative z-10">
                 <ShieldAlert size={40} className="text-white animate-pulse" />
              </div>
              <div className="flex-1 relative z-10">
                 <h4 className="text-2xl font-black text-rose-500 uppercase italic tracking-widest">SABBATH_PROTOCOL_ACTIVE</h4>
                 <p className="text-slate-300 text-lg italic mt-2">"The soil is currently in a restorative fallow cycle. Intensive industrial sharding is restricted to maintain m-constant integrity."</p>
              </div>
              <div className="shrink-0 relative z-10">
                 <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">Acknowledge Constraint</button>
              </div>
           </div>
        </div>
      )}

      {/* Weather Telemetry maintained... */}
      <div className="px-4 relative z-10">
        <div className="glass-card p-10 rounded-[56px] border-blue-500/20 bg-blue-500/[0.02] shadow-3xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Cloud className="w-80 h-80 text-blue-400" /></div>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 border-b border-white/5 pb-8 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="p-4 bg-blue-600 rounded-[28px] shadow-2xl">
                    <ThermometerSun className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Atmospheric <span className="text-blue-400">Telemetry Ingest</span></h3>
                 </div>
              </div>
              <button onClick={fetchWeather} disabled={isLoadingWeather} className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-all">
                {isLoadingWeather ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {isLoadingWeather ? 'SYNCING...' : 'Refresh'}
              </button>
           </div>
           {weatherData && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-12 p-10 bg-black/60 rounded-[48px] border border-white/10 shadow-inner relative overflow-hidden group/text">
                    <div className="prose prose-invert prose-blue max-w-none text-slate-300 text-xl leading-relaxed italic whitespace-pre-line border-l-4 border-blue-500/40 pl-10 font-medium relative z-10">
                       {weatherData.text}
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 relative z-10">
        {SEASONS.map((season) => (
          <div key={season.id} className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/60 shadow-3xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div className={`p-5 rounded-3xl ${season.bg} border ${season.border} group-hover:rotate-6 transition-all shadow-2xl`}>
                <season.icon className={`w-10 h-10 ${season.color}`} />
              </div>
              <div className="flex gap-2">
                 {season.isSabbath && <span className="px-3 py-1 bg-rose-600 text-white text-[8px] font-black uppercase rounded-lg shadow-xl">FALLOW_CYCLE</span>}
                 <span className={`px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest ${season.color}`}>{season.months}</span>
              </div>
            </div>
            <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">{season.name}</h3>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-4 flex items-center gap-3">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
               {season.kikuyu}
            </p>
            <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
               <button onClick={() => setActiveSeason(season)} className={`text-[11px] font-black uppercase tracking-[0.4em] flex items-center gap-4 transition-all ${season.color} hover:text-white`}>
                  View Full Protocol <ChevronRight size={16} />
               </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.7); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes scan { 0% { top: -100%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgroCalendar;
