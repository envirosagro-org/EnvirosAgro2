import React from 'react';
import { Radio, Plane, MapPin, Activity } from 'lucide-react';

const TelemetryHub: React.FC = () => {
  const devices = [
    { id: 'IOT-01', type: 'Soil Sensor', location: 'Zone A', status: 'ONLINE', battery: 85 },
    { id: 'DRN-02', type: 'Drone', location: 'Zone B', status: 'IN_FLIGHT', battery: 45 },
    { id: 'IOT-03', type: 'Weather Station', location: 'Zone C', status: 'ONLINE', battery: 92 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Spatial <span className="text-emerald-400">Telemetry Hub</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {devices.map(device => (
          <div key={device.id} className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                {device.type === 'Drone' ? <Plane size={24} /> : <Radio size={24} />}
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black ${device.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {device.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{device.type}</h3>
            <p className="text-slate-400 text-sm flex items-center gap-2"><MapPin size={14} /> {device.location}</p>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Activity size={14} /> Battery: {device.battery}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryHub;
