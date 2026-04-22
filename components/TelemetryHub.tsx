import React, { useState, useEffect } from 'react';
import { 
  Radio, Plane, MapPin, Activity, Zap, ShieldCheck, 
  Target, Globe, Wind, Droplets, Sun, Thermometer,
  Cpu, Binary, Layers, Network, Gauge, Wifi,
  Bluetooth, Cable, Compass, Signal, ArrowUpRight,
  ChevronRight, Share2, Scan, BarChart3, LineChart
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { iotService } from '../services/iotService';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';

const TelemetryHub: React.FC = () => {
  const [readings, setReadings] = useState<any[]>([]);
  const [activeAsset, setActiveAsset] = useState<string | null>(null);

  useEffect(() => {
    const sub = iotService.subscribe((data: any) => {
      setReadings(prev => [data, ...prev].slice(0, 50));
    });
    return () => { sub(); };
  }, []);

  const chartData = readings.map((r: any, i: number) => ({
    time: i,
    val: r.value,
    opt: r.optimalValue || 0
  })).reverse();

  const devices = [
    { id: 'IOT-ALPHA-01', type: 'SOIL_NODE', location: 'SECTOR_A', status: 'ONLINE', battery: 85, signal: 92 },
    { id: 'DRN-SIGMA-02', type: 'SWARM_ASSET', location: 'VECTOR_B', status: 'IN_FLIGHT', battery: 45, signal: 78 },
    { id: 'IOT-GAIA-03', type: 'WEATHER_STATION', location: 'ZONAL_C', status: 'ONLINE', battery: 98, signal: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full text-left">
      <SEO title="Nexus Telemetry Grid" description="EnvirosAgro Telemetry Hub: Real-time strategic analytics, spatial vectors, and environmental resonance streams." />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Nexus <span className="text-emerald-400">Hub</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">RealTime_Spatial_Telemetry_v7.2</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Signal size={14} className="text-emerald-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Shard_Stream</p>
                 <p className="text-xs font-black text-white">LIVE_12ms</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Compass size={14} className="text-indigo-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Grid_Sync</p>
                 <p className="text-xs font-black text-white">LOCKED</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Asset Vector Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/60 shadow-3xl text-left space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                    <Target size={18} className="text-rose-400" /> Asset_Vectors
                 </h3>
                 <span className="text-[8px] font-mono text-slate-600 uppercase">{devices.length} Units</span>
              </div>
              
              <div className="space-y-4">
                 {devices.map(device => (
                   <button 
                     key={device.id}
                     onClick={() => setActiveAsset(device.id)}
                     className={`w-full p-5 rounded-3xl border text-left transition-all group relative overflow-hidden ${activeAsset === device.id ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                   >
                      <div className="flex justify-between items-start mb-3 relative z-10">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeAsset === device.id ? 'bg-white/20 border-white/20 text-white' : 'bg-white/5 border-white/5 text-slate-600'}`}>
                               {device.type === 'SWARM_ASSET' ? <Plane size={20} /> : <Radio size={20} />}
                            </div>
                            <div>
                               <h4 className="text-xs font-black uppercase italic tracking-widest truncate max-w-[100px]">{device.id}</h4>
                               <p className={`text-[7px] font-mono uppercase ${activeAsset === device.id ? 'text-white/60' : 'text-slate-600'}`}>{device.location}</p>
                            </div>
                         </div>
                         <div className={`w-2 h-2 rounded-full ${device.status === 'ONLINE' || device.status === 'IN_FLIGHT' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`} />
                      </div>
                      
                      <div className="flex justify-between items-center relative z-10">
                         <div className="flex items-center gap-1.5">
                            <Gauge size={12} className="opacity-50" />
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">BAT: {device.battery}%</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <Wifi size={12} className="opacity-50" />
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60">SIGNAL: {device.signal}%</span>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-20 transition-opacity">
                         <ArrowUpRight size={32} />
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                 <Scan size={24} />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic leading-none">Spectrum Discovery</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                 "Automatic discovery of auxiliary hardware shards and mesh bridges via OMNI-BAND scanning."
              </p>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl">INITIATE_SPECTRUM_PROBE</button>
           </div>
        </div>

        {/* Main Analytics Hub */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 shadow-3xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <Activity size={240} className="text-emerald-500" />
              </div>

              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
                       <LineChart size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white italic truncate uppercase tracking-tighter">Resonance_Stream</h3>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Real-Time_Environmental_Fidelity</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-right">
                       <p className="text-[7px] text-slate-500 font-black uppercase">Current_Resonance</p>
                       <p className="text-lg font-black text-white tabular-nums">{readings[0]?.value.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10 mx-2" />
                    <div className="text-right">
                       <p className="text-[7px] text-slate-500 font-black uppercase">Optimal_Baseline</p>
                       <p className="text-lg font-black text-slate-600 tabular-nums">{readings[0]?.optimalValue.toFixed(2) || '0.00'}</p>
                    </div>
                 </div>
              </div>

              <div className="h-72 relative mb-8 z-10">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="time" hide />
                       <YAxis hide domain={['auto', 'auto']} />
                       <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }} />
                       <Area 
                         type="monotone" 
                         dataKey="val" 
                         stroke="#10b981" 
                         strokeWidth={3} 
                         fillOpacity={1} 
                         fill="url(#colorVal)" 
                         animationDuration={300}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="opt" 
                         stroke="#334155" 
                         strokeDasharray="5 5" 
                         fillOpacity={0} 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5 relative z-10">
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                       <Droplets size={16} className="text-blue-400" />
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Hydraulic_Flux</h4>
                    </div>
                    <p className="text-xl font-black text-white tabular-nums">42.1%</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                       <Thermometer size={16} className="text-rose-400" />
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Zonal_Thermal</h4>
                    </div>
                    <p className="text-xl font-black text-white tabular-nums">24.8°C</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                       <Sun size={16} className="text-amber-400" />
                       <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Solar_Resonance</h4>
                    </div>
                    <p className="text-xl font-black text-white tabular-nums">842 W/m²</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-10 rounded-[48px] border border-indigo-500/20 bg-indigo-500/5 space-y-6 shadow-xl text-left">
                 <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-[28px] bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400">
                       <BarChart3 size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-indigo-400 font-black">STABLE</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic leading-none">Cross-Sector Analysis</h4>
                 <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                    "Comparing environmental performance across multiple geographic shards and industrial sectors."
                 </p>
                 <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] text-[9px] font-black uppercase tracking-widest transition-all">GENERATE_COMPARATIVE_REPORT</button>
              </div>

              <div className="glass-card p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-500/5 space-y-6 shadow-xl text-left relative overflow-hidden">
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-[28px] bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
                       <Gauge size={24} />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 font-black">94.2%_EFF</span>
                 </div>
                 <h4 className="text-xl font-black text-white uppercase italic leading-none">Operational Efficiency</h4>
                 <div className="space-y-4 py-2">
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '94%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">
                       "Mesh optimization protocol active. 1.2M hardware actions verified."
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryHub;
