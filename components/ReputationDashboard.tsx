import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { getReputationEvents, calculateReputation, getReputationHistory } from '../services/reputationService';
import { ReputationEvent } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReputationDashboard: React.FC = () => {
  const [events, setEvents] = useState<ReputationEvent[]>([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const evs = getReputationEvents('STEW-01');
    setEvents(evs);
    setScore(calculateReputation(evs));
    setHistory(getReputationHistory('STEW-01'));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Reputation & <span className="text-emerald-400">Incentive Engine</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <p className="text-slate-400">Track steward contributions and rewards.</p>
          <div className="mt-6 flex items-center gap-4">
            <Award className="text-amber-400" size={48} />
            <div>
              <p className="text-2xl font-black text-white">{score} <span className="text-sm text-slate-500">EAC</span></p>
              <p className="text-slate-400">Total Reputation Score</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <h4 className="text-white font-bold mb-4">Reputation Growth</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Area type="monotone" dataKey="score" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReputationDashboard;
