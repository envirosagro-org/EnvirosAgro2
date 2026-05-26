import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plane, Radio, Battery, Gauge, MapPin, Search, 
  Wind, Navigation, ShieldCheck, Zap, History, 
  ChevronRight, ArrowRight, Signal, Terminal, 
  Cpu, Target, Loader2, Play, Square, Settings2,
  Compass, Globe, Satellite
} from 'lucide-react';
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

  // Agrobot Task Scheduler & Path Vectors State
  interface AgrobotTask {
    id: string;
    botId: string;
    task: string;
    type: 'Tilling' | 'Planting' | 'Sensing' | 'Seeding';
    coordinates: { x: number; y: number }[];
    status: 'SCHEDULED' | 'RUNNING' | 'COMPLETED';
    gcodeHex: string;
  }

  const [schedulerTasks, setSchedulerTasks] = useState<AgrobotTask[]>([
    { id: 'TSK-01', botId: 'BOT-VECTOR-A', task: 'Till & Aerate Bantu Seed Zone 5A', type: 'Tilling', coordinates: [{ x: 50, y: 120 }, { x: 120, y: 180 }, { x: 200, y: 150 }], status: 'SCHEDULED', gcodeHex: 'G21 G90; G1 X50 Y120 F1200; G1 X120 Y180; G1 X200 Y150;' },
    { id: 'TSK-02', botId: 'BOT-VECTOR-B', task: 'Plant Indigenous Bantu Sorghum Seeds', type: 'Seeding', coordinates: [{ x: 80, y: 240 }, { x: 140, y: 310 }, { x: 260, y: 280 }], status: 'SCHEDULED', gcodeHex: 'G21 G90; G1 X80 Y240 F1000; G1 X140 Y310; M08; M09;' },
    { id: 'TSK-03', botId: 'BOT-VECTOR-C', task: 'Multi-Spectral Health Scan Corridor 12C', type: 'Sensing', coordinates: [{ x: 180, y: 90 }, { x: 220, y: 140 }, { x: 340, y: 200 }], status: 'RUNNING', gcodeHex: 'M106 S255; G1 X180 Y90 F1500; G1 X220 Y140; G1 X340 Y200; M107;' },
  ]);

  const [activeTaskId, setActiveTaskId] = useState<string>('TSK-01');
  const [hardwarePushingId, setHardwarePushingId] = useState<string | null>(null);
  const [hardwareTerminal, setHardwareTerminal] = useState<string[]>([
    'Agrobot Hardware Controller online.',
    'Ready for sequence injection.'
  ]);

  const activeTask = useMemo(() => 
    schedulerTasks.find(t => t.id === activeTaskId) || schedulerTasks[0]
  , [schedulerTasks, activeTaskId]);

  const handleTransmitTaskToHost = (task: AgrobotTask) => {
    setHardwarePushingId(task.id);
    setHardwareTerminal(prev => [...prev, `[INIT] Injecting sequence ${task.id} to G-code buffer...`]);

    const codeLogs = [
      `[REGIST] Allocating memory register: G90 (Absolute Coordinates)`,
      `[HARDWARE] Commencing driver spin-lock...`,
      `[DRIVE] Transmitting coordinates: ${JSON.stringify(task.coordinates)}`,
      `[BUFFER] Written: ${task.gcodeHex}`,
      `[CONNEC] Handshake OK. Steps verification sum match: 0xF8419B`,
      `[OK] Sequence executed on local physical agrobot controller.`
    ];

    codeLogs.forEach((log, index) => {
      setTimeout(() => {
        setHardwareTerminal(prev => [...prev, log]);
        if (index === codeLogs.length - 1) {
          setHardwarePushingId(null);
          setSchedulerTasks(prev => 
            prev.map(t => t.id === task.id ? { ...t, status: 'RUNNING' } : t)
          );
          toast.success(`Task ${task.id} successfully initiated on hardware controller.`, {
            style: { background: '#090d16', border: '1px solid #10b981', color: '#10b981' }
          });
        }
      }, (index + 1) * 700);
    });
  };

  useEffect(() => {
    setMissions(iotService.getDroneMissions());
    
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
      iotService.updateDroneMission(id, 'IN_PROGRESS');
      setMissions(prev => prev.map(m => m.id === id ? { ...m, status: 'IN_PROGRESS' } : m));
      setIsDeploying(false);
      toast.success('Swarm Vector Engaged. Hardware shards communicating.');
    }, 2000);
  };

  const handleStopMission = (id: string) => {
    iotService.updateDroneMission(id, 'IDLE');
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

      {/* --- NEW SECTION: AGROBOT SWARM PATH SCHEDULING GRID --- */}
      <div className="border-t border-white/5 pt-12 mt-12 space-y-8 text-left animate-in fade-in duration-500">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 border-b border-white/5">
            <div>
               <h3 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter m-0 font-sans">
                  Agrobot <span className="text-emerald-400 font-bold">Task Scheduler & Route Vectors</span>
               </h3>
               <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest leading-none mt-2">SUB_UNIT: ROTATION_SCHEDULING_CONTROLLERS // NO_TELEMETRY_MOCK</p>
            </div>
            <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-full uppercase tracking-widest font-sans inline-block">
               DRIVE_SYS_CONNECTED
            </span>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Main Interactive Task Table */}
            <div className="lg:col-span-2 space-y-6">
               <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-6 shadow-3xl">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                     <span className="text-xs font-black text-white uppercase tracking-widest font-sans block font-bold">Queue of Regional Rotations</span>
                     <span className="text-[8px] text-slate-500 font-mono block font-bold">{schedulerTasks.length} Operations Loaded</span>
                  </div>

                  <div className="space-y-4">
                     {schedulerTasks.map(task => {
                        const isSelected = task.id === activeTaskId;
                        return (
                           <div
                              key={task.id}
                              onClick={() => setActiveTaskId(task.id)}
                              className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                                 isSelected 
                                    ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-lg' 
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-400'
                              }`}
                           >
                              <div className="space-y-2 flex-grow text-left">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-mono font-black text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase font-bold">
                                       {task.id}
                                    </span>
                                    <span className={`text-[8px] font-sans font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                       task.type === 'Tilling' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                       task.type === 'Seeding' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                       task.type === 'Sensing' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    }`}>
                                       {task.type}
                                    </span>
                                 </div>
                                 <h4 className="text-sm font-black text-white uppercase italic tracking-tight m-0 leading-tight block">
                                    {task.task}
                                 </h4>
                                 <p className="text-[9px] font-mono text-slate-500 leading-none block">
                                    Assigned: {task.botId} • Coordinates: {task.coordinates.map(c => `(${c.x}, ${c.y})`).join(' → ')}
                                 </p>
                              </div>

                              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-none border-white/10 pt-3 md:pt-0">
                                 <div className="text-right">
                                    <p className="text-[7px] text-slate-600 font-mono leading-none uppercase">Status</p>
                                    <span className={`text-[9px] font-mono font-black uppercase block mt-1 ${
                                       task.status === 'RUNNING' ? 'text-amber-400 animate-pulse' :
                                       task.status === 'COMPLETED' ? 'text-emerald-400' : 'text-slate-500'
                                    }`}>
                                       {task.status}
                                    </span>
                                 </div>
                                 
                                 <button
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       handleTransmitTaskToHost(task);
                                    }}
                                    disabled={task.status !== 'SCHEDULED' || hardwarePushingId !== null}
                                    className="px-6 py-3.5 bg-white hover:bg-slate-200 disabled:opacity-35 disabled:hover:bg-white rounded-xl text-black font-black text-[9px] uppercase tracking-wider transition-all shadow-md active:scale-95"
                                 >
                                    {hardwarePushingId === task.id ? 'TRANSMITTING...' : 'INJECT_COORD'}
                                 </button>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Path Overlays & Steppers console */}
            <div className="space-y-6 text-left">
               <div className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-6 shadow-3xl flex flex-col justify-between">
                  <div className="border-b border-white/5 pb-4">
                     <h4 className="text-xs font-black text-white uppercase tracking-widest font-sans">Route Vector Overlay</h4>
                     <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">AXIS_X & AXIS_Y PHYSICAL GRID</p>
                  </div>

                  {/* SVG Path Canvas */}
                  <div className="aspect-video bg-neutral-950 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center p-4 shadow-inner">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                     
                     {/* Draw line sequence */}
                     <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 400 400">
                        {activeTask?.coordinates && (
                           <>
                              {/* Path Vector Line */}
                              <polyline
                                 fill="none"
                                 stroke="#818cf8"
                                 strokeWidth="3"
                                 strokeDasharray="5,5"
                                 points={activeTask.coordinates.map(c => `${c.x},${c.y}`).join(' ')}
                                 className="animate-pulse"
                              />
                              {/* Glowing node coordinates points */}
                              {activeTask.coordinates.map((c, idx) => (
                                 <g key={idx}>
                                    <circle cx={c.x} cy={c.y} r="6" className="fill-indigo-400 stroke-black stroke-2" />
                                    <circle cx={c.x} cy={c.y} r="12" className="fill-none stroke-indigo-500/40 stroke-1 animate-pulse" />
                                    <text x={c.x + 8} y={c.y + 4} fill="#64748b" className="text-[8px] font-mono leading-none font-bold">
                                       Pt_{idx + 1} ({c.x},{c.y})
                                    </text>
                                 </g>
                              ))}
                           </>
                        )}
                     </svg>

                     <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/85 border border-white/10 rounded-lg text-[7px] text-indigo-400 font-mono leading-none animate-pulse">
                        TASK_ID: {activeTask?.id || 'NULL'}
                     </div>
                  </div>

                  {/* Physical Hardware Steppers Log Console */}
                  <div className="space-y-3 font-mono">
                     <p className="text-[9px] font-sans font-black text-slate-500 uppercase tracking-widest italic leading-none">Direct G-code Injection Buffer</p>
                     
                     <div className="bg-slate-950 p-4 rounded-xl border border-white/5 min-h-[140px] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-1.5 text-[8px] text-indigo-400 leading-tight overflow-y-auto max-h-[120px] scrollbar-hide font-mono">
                           {hardwareTerminal.map((log, idx) => (
                              <p key={idx} className="truncate select-all leading-none">&gt; {log}</p>
                           ))}
                        </div>
                        {activeTask?.gcodeHex && (
                           <div className="pt-2 border-t border-white/5 mt-2 bg-transparent">
                              <p className="text-[6px] text-slate-600 uppercase font-black font-sans leading-none mb-1">Raw Stepper Sequence Register</p>
                              <p className="text-[8px] text-slate-500 font-mono break-all leading-none">{activeTask.gcodeHex}</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default SwarmOrchestrator;
