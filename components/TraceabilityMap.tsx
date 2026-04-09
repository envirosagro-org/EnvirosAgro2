import React from 'react';
import { Truck, MapPin, Package, CheckCircle2 } from 'lucide-react';

const TraceabilityMap: React.FC = () => {
  const steps = [
    { id: 1, title: 'Harvest', location: 'Nairobi Shard', date: '2026-04-01', status: 'COMPLETED' },
    { id: 2, title: 'Processing', location: 'Logistics Hub A', date: '2026-04-03', status: 'COMPLETED' },
    { id: 3, title: 'Transport', location: 'Eco-Rail', date: '2026-04-05', status: 'IN_TRANSIT' },
    { id: 4, title: 'Delivery', location: 'Consumer Node', date: '2026-04-10', status: 'PENDING' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Traceability <span className="text-blue-400">Journey Map</span></h2>
      
      <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-8 relative">
            {index !== steps.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-white/10"></div>
            )}
            <div className={`p-4 rounded-full ${step.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {step.status === 'COMPLETED' ? <CheckCircle2 size={24} /> : <Package size={24} />}
            </div>
            <div className="flex-1 glass-card p-6 rounded-2xl border border-white/5 bg-black/20">
              <h4 className="text-xl font-bold text-white">{step.title}</h4>
              <p className="text-slate-400 text-sm flex items-center gap-2"><MapPin size={14} /> {step.location}</p>
              <p className="text-slate-500 text-xs mt-1">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraceabilityMap;
