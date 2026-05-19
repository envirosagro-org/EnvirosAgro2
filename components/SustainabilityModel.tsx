import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Leaf, Droplets, Sun, Wind } from 'lucide-react';

// Simulated data generator for the sustainability model
const generateSustainabilityData = (timeframe: number) => {
  const data = [];
  for (let i = 0; i < timeframe; i++) {
    data.push({
      time: `Month ${i + 1}`,
      soilHealth: Math.floor(60 + Math.random() * 30),
      carbonCapture: Math.floor(40 + Math.random() * 20),
      waterRetention: Math.floor(50 + Math.random() * 40),
    });
  }
  return data;
};

export const SustainabilityModel: React.FC = () => {
  const [timeframe, setTimeframe] = useState(12);
  const data = useMemo(() => generateSustainabilityData(timeframe), [timeframe]);

  return (
    <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 shadow-2xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Sustainability Simulation</h2>
        <select 
          className="bg-white/5 border border-white/20 rounded-full px-6 py-2 text-white text-xs font-black uppercase tracking-widest outline-none"
          value={timeframe}
          onChange={(e) => setTimeframe(Number(e.target.value))}
        >
          <option value={6}>6 Months</option>
          <option value={12}>1 Year</option>
          <option value={24}>2 Years</option>
        </select>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Area type="monotone" dataKey="soilHealth" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Area type="monotone" dataKey="carbonCapture" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="waterRetention" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { title: "Soil Health", value: data[data.length - 1].soilHealth, icon: Leaf, color: "text-emerald-400" },
          { title: "Carbon Capture", value: data[data.length - 1].carbonCapture, icon: Wind, color: "text-blue-400" },
          { title: "Water Retention", value: data[data.length - 1].waterRetention, icon: Droplets, color: "text-amber-400" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4">
            <item.icon className={item.color} size={32} />
            <div className="text-4xl font-black text-white">{item.value}%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
