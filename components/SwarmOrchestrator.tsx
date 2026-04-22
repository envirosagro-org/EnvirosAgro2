import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plane, Radio, Battery, Gauge, MapPin, Search, 
  Wind, Navigation, ShieldCheck, Zap, History, 
  ChevronRight, ArrowRight, Signal, Terminal, 
  Cpu, Target, Loader2, Play, Square, Settings2,
  Compass, Globe, Satellite
} from 'lucide-react';
import { getDroneMissions, updateDroneMission, getDroneTelemetry } from '../services/droneService';
import { DroneMission, User } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { iotService, TelemetryReading } from '../services/iotService';
import { toast } from 'sonner';

interface SwarmOrchestratorProps {
  user: User;
}

const SwarmOrchestrator: React.FC<SwarmOrchestratorProps> = ({ user }) => {
  const [missions, setMissions] = useState<DroneMission[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);
  const [liveTelemetry, setLiveTelemetry] = useState<Record<string, TelemetryReading>>({});
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    setMissions(getDroneMissions());
    
    // Subscribe to live telemetry
    iotService.startSimulation();
    const unsub = iotService.subscribe((reading) => {
      setLiveTelemetry(prev => ({ ...prev, [reading.channel]: reading }));
    });

    return () => { unsub(); };
  }, []);

  const activeMission = useMemo(() => 
    missions.find(m => m.id === selectedMissionId) || missions[0]
  , [missions, selectedMissionId]);

  const handleStartMission = (id: string) => {
    setIsDeploying(true);
    setTimeout(() => {
      updateDroneMission(id, 'IN_PROGRESS');
      setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'IN_PROGRESS' } : m));
      setIsDeploying(false);
      toast.success('Swarm Vector Engaged. Hardware shards communicating.');
    }, 2000);
  };

  const handleStopMission = (id: string) => {
    updateDroneMission(id, 'IDLE');
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'IDLE' } : m));
    toast.info('Mission Aborted. Units returning to cradle.');
  };

  // Mock radar data for "Mesh Coverage"
  const radarData = [
    { subject: 'Signal', A: 120, fullMark: 150 },
    { subject: 'Battery', A: 98, fullMark: 150 },
    { subject: 'Sync', A: 86, fullMark: 150 },
    { subject: 'Speed', A: 99, fullMark: 150 },
    { subject: 'Alt', A: 85, fullMark: 150 },
    { subject: 'Relay', A: 65, fullMark: 150 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="Swarm Orchestrator" description="Swarm Command Terminal: Manage autonomous drone fleets for hyper-precision agriculture and industrial monitoring." />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Swarm <span className="text-indigo-400">Command</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Orchestrator_v8.4 [Steward_Auth_Level_02]</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Signal size={14} className="text-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Mesh_Relay</p>
                 <p className="text-xs font-black text-white">ORBIT_LOCKED</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Satellite size={14} className="text-indigo-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Latency</p>
                 <p className="text-xs font-black text-white">4ms</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Fleet Registry Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet_Registry</h3>
              <button className="text-[8px] font-black text-indigo-400 uppercase hover:underline">Register_New</button>
           </div>
           <div className="space-y-3">
              {missions.map(mission => (
                <button 
                  key={mission.id}
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={`w-full p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${selectedMissionId === mission.id || (!selectedMissionId && mission.id === activeMission?.id) ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl translate-x-1' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                >
                   <div className="flex justify-between items-start mb-2 relative z-10 text-left">
                      <div className="flex items-center gap-3">
                         <Plane size={18} className={mission.status === 'IN_PROGRESS' ? 'animate-bounce text-emerald-400' : 'text-slate-500'} />
                         <div>
                            <p className="text-md font-black uppercase italic tracking-tighter">Vector_{mission.id.split('-').pop()}</p>
                            <p className="text-[7px] font-mono opacity-50 uppercase">{mission.zone} • {mission.droneIds.length} Units</p>
                         </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${mission.status === 'IN_PROGRESS' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></div>
                   </div>
                   <div className="relative z-10 flex justify-between items-center text-left">
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Status: {mission.status}</span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                </button>
              ))}
           </div>

           <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <Settings2 size={16} className="text-slate-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white">Global_Constraints</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[8px] text-slate-500 uppercase font-black">Battery_Floor</span>
                    <span className="text-[10px] font-mono text-white">20%</span>
                 </div>
                 <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '20%' }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Tactical Map & Deployment Hub */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 relative overflow-hidden shadow-3xl text-left">
              {/* Fake Map Shard */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2)_0%,transparent_70%)]"></div>
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              </div>

              <div className="flex justify-between items-center mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                       <Navigation size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic truncate uppercase">Mission_{activeMission?.id.split('-').pop()}</h3>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active_Zone: {activeMission?.zone || 'Unmapped'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Vector_Flow</p>
                       <p className="text-sm font-black text-emerald-400 font-mono tracking-tighter">98.4%_SYNC</p>
                    </div>
                 </div>
              </div>

              <div className="aspect-video bg-white/5 rounded-[32px] border border-white/5 mb-10 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20"></div>
                 <div className="absolute inset-0 border-[32px] border-black/40"></div>
                 
                 {/* Scanning Effect */}
                 <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500/30 animate-scan"></div>
                 
                 {/* Drone Markers */}
                 <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full border-2 border-indigo-500/60 flex items-center justify-center animate-pulse">
                    <div className="w-1 h-1 bg-indigo-400 rounded-full"></div>
                 </div>
                 <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full border-2 border-emerald-500/40 flex items-center justify-center animate-ping">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                 </div>

                 <div className="relative z-10 space-y-4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center backdrop-blur-md bg-black/40">
                       <Compass size={40} className="text-indigo-400 animate-spin-slow" />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic shadow-2xl">Awaiting_Vector_Engagement</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                 {activeMission?.status === 'IDLE' ? (
                   <button 
                     onClick={() => handleStartMission(activeMission.id)}
                     disabled={isDeploying}
                     className="w-full py-6 bg-white text-black hover:bg-slate-200 transition-all rounded-[32px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                   >
                     {isDeploying ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} ENGAGE_SWARM_VECTOR
                   </button>
                 ) : (
                   <button 
                     onClick={() => handleStopMission(activeMission.id)}
                     className="w-full py-6 bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all rounded-[32px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 active:scale-95"
                   >
                     <Square size={18} /> ABORT_FLIGHT_PATH
                   </button>
                 )}
                 <button className="w-full py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] transition-all">VIEW_FLIGHT_LEDGER</button>
              </div>
           </div>
        </div>

        {/* Real-time Telemetry Analytics */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <Target size={16} className="text-indigo-400" /> Vector_Health
                </h3>
              </div>

              <div className="h-56 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="#334155" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 8, fontWeight: 'bold' }} />
                       <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                       <Radar name="Vector A" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>

              <div className="space-y-4 font-mono">
                 {[
                   { label: 'Altitude', val: `${liveTelemetry.SHARD_VELOCITY?.value.toFixed(1) || '0.0'}m`, unit: 'MSL' },
                   { label: 'Air Speed', val: '24.2', unit: 'km/h' },
                   { label: 'Pitch/Roll', val: '1.2° / -0.4°', unit: 'DEG' },
                   { label: 'Mesh Relays', val: '12', unit: 'NODES' },
                 ].map((stat, i) => (
                   <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-2xl">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</span>
                      <p className="text-xs font-black text-white">{stat.val} <span className="text-[8px] text-slate-600 font-bold">{stat.unit}</span></p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                 <Cpu size={22} className="text-emerald-400" />
              </div>
              <div>
                 <h4 className="text-sm font-black text-white uppercase italic leading-none mb-2">AI Pilot Shard</h4>
                 <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                    "Analyzing spectral anomalies in the canopy. Adjusting flight vectors for multi-spectral normalization."
                 </p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-emerald-500/20">
                 <span className="text-[7px] font-black text-emerald-600 uppercase">Resonance Status</span>
                 <span className="text-[8px] font-mono text-emerald-400 font-black tracking-widest">STABLE_98%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SwarmOrchestrator;
