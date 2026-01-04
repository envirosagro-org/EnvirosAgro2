
import React, { useState, useEffect, useMemo } from 'react';
import { Droplets, Thermometer, Wind, Zap, Globe, Cpu, MapPin, Info, Calculator, RefreshCw, Save, CheckCircle2, Loader2, BarChart3, LineChart as LineChartIcon, Activity } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface SustainabilityProps {
  onAction?: () => void;
}

const Sustainability: React.FC<SustainabilityProps> = ({ onAction }) => {
  const [tab, setTab] = useState<'simulator' | 'twin'>('simulator');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Framework Parameters
  const [S, setS] = useState(120); // Crop Cycle Requirement
  const [Dn, setDn] = useState(60); // Direct Nature Factor
  const [In, setIn] = useState(40); // Indirect Nature Factor
  const [x, setX] = useState(5);   // Agricultural Base Factor
  const [r, setR] = useState(1.05); // Growth Rate
  const [n, setN] = useState(5);   // Periods (Increased for better charting)
  const [isStatic, setIsStatic] = useState(false);

  const [results, setResults] = useState({ ca: 0, m: 0 });

  // Calculate current metrics
  useEffect(() => {
    let ca = 1;
    if (isStatic) {
      ca = n * x + 1;
    } else {
      if (Math.abs(r - 1) < 0.0001) {
        ca = n * x + 1;
      } else {
        ca = x * ((Math.pow(r, n) - 1) / (r - 1)) + 1;
      }
    }
    const m = Math.sqrt((Dn * In * ca) / S);
    setResults({ ca, m });
  }, [S, Dn, In, x, r, n, isStatic]);

  // Generate data for C(a) growth visualization
  const growthData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= Math.max(n, 10); i++) {
      let ca_val = 1;
      if (isStatic) {
        ca_val = i * x + 1;
      } else {
        if (Math.abs(r - 1) < 0.0001) {
          ca_val = i * x + 1;
        } else {
          ca_val = x * ((Math.pow(r, i) - 1) / (r - 1)) + 1;
        }
      }
      data.push({ period: `P${i}`, ca: Number(ca_val.toFixed(2)) });
    }
    return data;
  }, [x, r, n, isStatic]);

  // Resilience Gauge Data
  const resilienceScore = Math.min(100, results.m * 10);
  const gaugeData = [
    { value: resilienceScore },
    { value: 100 - resilienceScore }
  ];

  const handleSaveScenario = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-4 p-1 glass-card rounded-2xl w-fit">
        <button 
          onClick={() => setTab('simulator')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'simulator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          Framework Simulator
        </button>
        <button 
          onClick={() => setTab('twin')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'twin' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          IoT Digital Twin
        </button>
      </div>

      {tab === 'simulator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left duration-300">
          
          {/* Input Panel */}
          <div className="lg:col-span-1 glass-card p-8 rounded-[40px] space-y-6 border-emerald-500/10 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                Parameters
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Static Mode</span>
                <button 
                  onClick={() => setIsStatic(!isStatic)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${isStatic ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isStatic ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Crop Cycle (S) [Days]</label>
                  <input type="number" value={S} onChange={e => setS(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Nature (Dn)</label>
                    <input type="number" value={Dn} onChange={e => setDn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Nature (In)</label>
                    <input type="number" value={In} onChange={e => setIn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Base Factor (x)</label>
                  <input type="range" min="1" max="10" value={x} onChange={e => setX(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-2" />
                  <div className="flex justify-between text-[10px] text-emerald-500/60 font-mono"><span>LVL 1</span><span>LVL {x}</span><span>LVL 10</span></div>
                </div>
                {!isStatic && (
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Adoption Rate (r)</label>
                    <input type="number" step="0.01" value={r} onChange={e => setR(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Periods (n)</label>
                  <input type="number" value={n} onChange={e => setN(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-3 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex gap-3 mt-4">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[9px] text-amber-200/50 leading-relaxed uppercase font-black tracking-widest">
                Agricultural Code C(a) measures cumulative sustainability, while m assesses system resilience.
              </p>
            </div>
          </div>
          
          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Agro Code Growth Chart */}
              <div className="glass-card p-8 rounded-[40px] border-white/5 bg-emerald-500/[0.01]">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <LineChartIcon className="w-4 h-4 text-emerald-400" /> C(a) Growth Projection
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-500/60 uppercase">Node: {results.ca.toFixed(2)}</span>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="period" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="ca" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCa)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resilience Gauge */}
              <div className="glass-card p-8 rounded-[40px] border-white/5 bg-blue-500/[0.01] flex flex-col items-center justify-center relative">
                <div className="absolute top-8 left-8">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" /> Resilience (m)
                  </h4>
                </div>
                <div className="h-[200px] w-full flex items-center justify-center mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        <Cell key="resilience" fill={resilienceScore > 70 ? "#10b981" : "#3b82f6"} />
                        <Cell key="empty" fill="rgba(255,255,255,0.05)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-4xl font-black text-white tracking-tighter">{resilienceScore.toFixed(1)}%</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Efficiency</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Metrics Output */}
            <div className="glass-card p-10 rounded-[48px] bg-emerald-500/[0.02] border-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
                <Zap className="w-40 h-40 text-emerald-400" />
              </div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-10 col-span-2">
                  <div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">Sustainability <span className="text-emerald-400">Resilience</span></h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">Your system resilience factor <span className="text-white font-bold">(m)</span> is currently optimized for <span className="text-emerald-400 font-bold">{S} day cycles</span>.</p>
                  </div>

                  <div className="flex gap-4">
                    <button className="p-4 glass-card rounded-2xl text-slate-400 hover:text-emerald-400 transition-all hover:bg-white/5 active:scale-95">
                      <RefreshCw className={`w-6 h-6 ${isSaving ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                      onClick={handleSaveScenario}
                      disabled={isSaving}
                      className="flex-1 flex items-center justify-center gap-3 px-12 py-5 agro-gradient rounded-2xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                      {isSaving ? 'Syncing Shards...' : 'Save Registry Scenario'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                   <div className="p-6 glass-card rounded-3xl border-emerald-500/20 text-center group hover:bg-emerald-500/5 transition-all">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Agro Code C(a)</p>
                      <h4 className="text-5xl font-black text-white font-mono group-hover:scale-110 transition-transform">{results.ca.toFixed(2)}</h4>
                   </div>
                   <div className="p-6 glass-card rounded-3xl border-blue-500/20 text-center group hover:bg-blue-500/5 transition-all">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Time Constant (m)</p>
                      <h4 className="text-5xl font-black text-white font-mono group-hover:scale-110 transition-transform">{results.m.toFixed(2)}</h4>
                   </div>
                </div>
              </div>

              {showSuccess && (
                <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in duration-500 z-30">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/40">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-white uppercase tracking-tighter">Commit Success</p>
                  <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest tracking-[0.2em]">Transaction Confirmed // Shard 0x882</p>
                </div>
              )}
            </div>

            {/* Call to action */}
            <div className="p-10 glass-card rounded-[40px] bg-indigo-500/5 border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-3xl bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-900/40 group-hover:rotate-12 transition-transform">
                    <Zap className="w-8 h-8 text-white fill-current" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-2xl font-bold text-white uppercase tracking-tighter">Ready to Mint Assets?</h4>
                    <p className="text-slate-400 text-sm italic">"Turn simulated resilience into certified blockchain equity."</p>
                 </div>
               </div>
               <button 
                onClick={onAction}
                className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-xl"
               >
                 Evidence Portal
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-right duration-300 pb-20">
          <div className="lg:col-span-3 glass-card rounded-[48px] overflow-hidden relative min-h-[600px] border-white/5">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200')] bg-cover grayscale opacity-20 group-hover:grayscale-0 transition-all duration-1000"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
             
             <div className="relative z-10 p-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-rose-500/20 rounded-xl border border-rose-500/30">
                    <MapPin className="text-rose-500 w-5 h-5" />
                   </div>
                   <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">Digital Twin: <span className="text-emerald-400">Node #291</span></h3>
                </div>
                
                {/* Floating Telemetry Tags */}
                <div className="absolute top-1/4 left-1/3 p-6 glass-card rounded-3xl border-emerald-500/40 backdrop-blur-xl shadow-2xl animate-bounce-slow">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Sensor S-01</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-mono font-black text-white">64.2% <span className="text-xs text-slate-500 uppercase">H2O</span></p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Thrust Sync: Active</p>
                   </div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 p-6 glass-card rounded-3xl border-blue-500/40 backdrop-blur-xl shadow-2xl animate-pulse">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Spectral Relay R-04</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-mono font-black text-white">m: 12.4</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Code Verification: Stable</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="space-y-4">
             {[
               { icon: Droplets, label: "Soil Moisture", val: "64.2%", col: "text-blue-400" },
               { icon: Zap, label: "Nitrogen Level", val: "Optimal", col: "text-emerald-400" },
               { icon: Thermometer, label: "Soil Temp", val: "22.4°C", col: "text-amber-400" },
               { icon: Wind, label: "Air Quality", val: "94/100", col: "text-teal-400" },
             ].map((s, i) => (
               <div key={i} className="glass-card p-6 rounded-[32px] flex items-center gap-6 hover:bg-white/[0.03] transition-all group border-white/5 active:scale-95 cursor-pointer">
                  <div className={`p-4 rounded-2xl bg-white/5 ${s.col} group-hover:scale-110 transition-transform group-hover:rotate-6`}>
                     <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{s.label}</p>
                    <p className="text-xl font-mono font-black text-white mt-1">{s.val}</p>
                  </div>
               </div>
             ))}

             <div className="glass-card p-8 rounded-[40px] bg-emerald-500/5 border-emerald-500/10 flex flex-col justify-center items-center text-center space-y-4 mt-8">
                <BarChart3 className="w-10 h-10 text-emerald-400" />
                <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Full Analytics</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-widest">Connect to institutional dataset for Zone 4 comparative audit.</p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                  Open Data Cloud
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-bounce-slow {
          animation: bounce 6s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Sustainability;
