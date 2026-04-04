import React, { useState, useMemo } from 'react';
import { Plot } from '../services/spatialService';
import { User } from '../types';
import { TrendingUp, Leaf, Zap, ShieldCheck, Info, ChevronRight, BarChart3, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface PredictiveYieldProps {
  user: User;
  plot: Plot;
}

const STRATEGIES = [
  { id: 'BAU', name: 'Business as Usual', color: '#94a3b8', multiplier: 1.0, description: 'Standard industrial farming practices.' },
  { id: 'REGEN', name: 'Regenerative Agriculture', color: '#10b981', multiplier: 2.4, description: 'No-till, cover cropping, and diverse rotations.' },
  { id: 'AGRO', name: 'Agroforestry Integration', color: '#3b82f6', multiplier: 3.8, description: 'Integrating trees and shrubs into crop systems.' },
  { id: 'BIO', name: 'Biochar & Soil Inoculants', color: '#d946ef', multiplier: 4.5, description: 'Advanced soil amendments for carbon fixation.' }
];

const PredictiveYield: React.FC<PredictiveYieldProps> = ({ user, plot }) => {
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[1]);
  const [years, setYears] = useState(10);

  const projectionData = useMemo(() => {
    const data = [];
    let currentCarbon = 120; // Base carbon stock (tonnes/ha)
    for (let i = 0; i <= years; i++) {
      const annualSequestration = (2.5 + Math.random() * 0.5) * selectedStrategy.multiplier;
      currentCarbon += annualSequestration;
      data.push({
        year: 2026 + i,
        carbon: currentCarbon,
        credits: currentCarbon * 0.85 // EAC conversion rate
      });
    }
    return data;
  }, [selectedStrategy, years]);

  const totalCredits = projectionData[projectionData.length - 1].credits - projectionData[0].credits;

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Target className="text-emerald-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Predictive Carbon Oracle</h3>
            <p className="text-xs font-mono text-emerald-400">Plot: {plot.name} | {plot.id?.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
          {[5, 10, 20].map(y => (
            <button 
              key={y}
              onClick={() => setYears(y)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${years === y ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
            >
              {y}Y
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Strategy Selection */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Select Strategy</h4>
          <div className="space-y-3">
            {STRATEGIES.map(strategy => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy)}
                className={`w-full p-4 rounded-2xl border transition-all text-left group ${selectedStrategy.id === strategy.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-black text-white uppercase tracking-tight">{strategy.name}</div>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: strategy.color }} />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                  {strategy.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Projection Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <TrendingUp size={16} className="text-emerald-400 mb-2" />
              <div className="text-2xl font-black text-white">+{totalCredits.toFixed(0)}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Est. EAC Yield</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <Leaf size={16} className="text-blue-400 mb-2" />
              <div className="text-2xl font-black text-white">{(totalCredits * 1.2).toFixed(1)}t</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">CO2 Sequestered</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <Zap size={16} className="text-amber-400 mb-2" />
              <div className="text-2xl font-black text-white">{(selectedStrategy.multiplier).toFixed(1)}x</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Efficiency</div>
            </div>
          </div>

          <div className="h-64 w-full bg-black/20 rounded-3xl border border-white/5 p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedStrategy.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={selectedStrategy.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="carbon" 
                  stroke={selectedStrategy.color} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCarbon)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
            <Info className="text-blue-400" size={18} />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Projections are based on historical soil data and local climate models. Actual yields may vary based on implementation precision and environmental factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveYield;
