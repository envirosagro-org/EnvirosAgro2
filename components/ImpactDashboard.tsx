import React from 'react';
import { User, SustainabilityMetrics } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Leaf, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface ImpactDashboardProps {
  user: User;
  metrics: SustainabilityMetrics;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ user, metrics }) => {
  const data = [
    { name: 'Agro Code U', value: metrics.agriculturalCodeU },
    { name: 'Time Tau', value: metrics.timeConstantTau },
    { name: 'Sustainability', value: metrics.sustainabilityScore },
    { name: 'Social Immunity', value: metrics.socialImmunity },
    { name: 'Viral Load', value: metrics.viralLoadSID },
    { name: 'Baseline M', value: metrics.baselineM },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Impact <span className="text-emerald-400">Dashboard</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400"><Leaf size={24} /></div>
            <h3 className="text-xl font-bold text-white">Sustainability Score</h3>
          </div>
          <p className="text-4xl font-black text-emerald-400">{metrics.sustainabilityScore.toFixed(2)}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400"><TrendingUp size={24} /></div>
            <h3 className="text-xl font-bold text-white">Social Immunity</h3>
          </div>
          <p className="text-4xl font-black text-indigo-400">{metrics.socialImmunity.toFixed(2)}</p>
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400"><Zap size={24} /></div>
            <h3 className="text-xl font-bold text-white">Agro Code U</h3>
          </div>
          <p className="text-4xl font-black text-amber-400">{metrics.agriculturalCodeU.toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40 h-96">
        <h3 className="text-xl font-bold text-white mb-6">Sustainability Metrics Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
            <Bar dataKey="value" fill="#10b981">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ImpactDashboard;
