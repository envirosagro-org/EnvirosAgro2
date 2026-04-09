import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';
import { getDroneMissions, updateDroneMission, getDroneTelemetry } from '../services/droneService';
import { DroneMission } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SwarmOrchestrator: React.FC = () => {
  const [missions, setMissions] = useState<DroneMission[]>([]);
  const [telemetry, setTelemetry] = useState<any[]>([]);

  useEffect(() => {
    setMissions(getDroneMissions());
  }, []);

  const handleSelectMission = (missionId: string) => {
    setTelemetry(getDroneTelemetry(missionId));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Swarm <span className="text-emerald-400">Orchestrator</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <p className="text-slate-400">Drone swarm management interface.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {missions.map(mission => (
              <div key={mission.id} className="p-6 bg-black/20 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold flex items-center gap-2"><Plane /> Mission {mission.id}</h4>
                <p className="text-slate-500 text-sm">Status: {mission.status}</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => updateDroneMission(mission.id, 'IN_PROGRESS')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700"
                  >
                    Start
                  </button>
                  <button 
                    onClick={() => handleSelectMission(mission.id)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-600"
                  >
                    Telemetry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <h4 className="text-white font-bold mb-4">Telemetry Stream</h4>
          {telemetry.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                <Line type="monotone" dataKey="battery" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-500 text-sm">Select a mission to view telemetry.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwarmOrchestrator;
