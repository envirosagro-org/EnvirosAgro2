
import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Wind, Zap, Globe, Cpu, MapPin, Info, Calculator, RefreshCw, Save, CheckCircle2, Loader2 } from 'lucide-react';

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
  const [n, setN] = useState(3);   // Periods
  const [isStatic, setIsStatic] = useState(false);

  const [results, setResults] = useState({ ca: 0, m: 0 });

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

  const handleSaveScenario = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-left duration-300">
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                Input Parameters
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Static Mode</span>
                <button 
                  onClick={() => setIsStatic(!isStatic)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${isStatic ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isStatic ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Crop Cycle (S) [Days]</label>
                  <input type="number" value={S} onChange={e => setS(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Direct Nature (Dn)</label>
                  <input type="number" value={Dn} onChange={e => setDn(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Indirect Nature (In)</label>
                  <input type="number" value={In} onChange={e => setIn(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Base Factor (x) [1-10]</label>
                  <input type="number" value={x} onChange={e => setX(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Adoption Rate (r)</label>
                  <input type="number" step="0.01" value={r} disabled={isStatic} onChange={e => setR(Number(e.target.value))} className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isStatic && 'opacity-50'}`} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Periods (n)</label>
                  <input type="number" value={n} onChange={e => setN(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex gap-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-200/70 leading-relaxed uppercase font-bold tracking-widest">
                Agricultural Code C(a) measures cumulative sustainability, while m assesses system resilience.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-3xl bg-emerald-500/[0.02]">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tighter">Framework Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 glass-card rounded-2xl border-emerald-500/20 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2">Agro Code C(a)</p>
                  <h4 className="text-4xl font-mono font-bold text-emerald-400">{results.ca.toFixed(2)}</h4>
                </div>
                <div className="p-6 glass-card rounded-2xl border-blue-500/20 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2">Time Constant (m)</p>
                  <h4 className="text-4xl font-mono font-bold text-blue-400">{results.m.toFixed(2)}</h4>
                </div>
              </div>

              <div className="mt-6 p-8 glass-card rounded-3xl text-center relative overflow-hidden bg-gradient-to-t from-emerald-900/10 to-transparent">
                <p className="text-sm text-slate-400 mb-2 font-bold uppercase tracking-widest">Sustainability Resilience</p>
                <h2 className="text-6xl font-black text-white">{Math.min(100, results.m * 10).toFixed(1)}%</h2>
                
                {showSuccess && (
                  <div className="absolute inset-0 bg-[#050706]/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                    <p className="text-white font-bold uppercase tracking-widest text-xs">Scenario Saved to Ledger</p>
                    <p className="text-slate-500 text-[10px] mt-1 font-mono uppercase">Block confirmed: #{(Math.random()*100000).toFixed(0)}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-center gap-4">
                  <button className="p-3 glass-card rounded-xl text-slate-400 hover:text-emerald-400 transition-colors">
                    <RefreshCw className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={handleSaveScenario}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-8 py-3 agro-gradient rounded-xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Synchronizing...' : 'Save Scenario'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8 glass-card rounded-3xl bg-blue-500/5 border-blue-500/20 flex flex-col items-center text-center space-y-4">
               <Zap className="w-10 h-10 text-blue-400" />
               <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Ready to Mint?</h4>
               <p className="text-xs text-slate-500 leading-relaxed">Turn this simulated achievement into real EAC credits by submitting field evidence.</p>
               <button 
                onClick={onAction}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
               >
                 Go to Evidence Portal
               </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in slide-in-from-right duration-300">
          <div className="lg:col-span-3 glass-card rounded-3xl overflow-hidden relative min-h-[500px]">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000')] bg-cover opacity-20"></div>
             <div className="relative z-10 p-8">
                <div className="flex items-center gap-2 mb-8">
                   <MapPin className="text-rose-500 w-5 h-5" />
                   <h3 className="text-xl font-bold text-white tracking-tight uppercase">Digital Twin: Farm Unit #291</h3>
                </div>
                <div className="absolute top-1/4 left-1/3 p-4 glass-card rounded-2xl border-emerald-500/40 backdrop-blur-md shadow-2xl">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">Live Sensor S-01</span>
                   </div>
                   <p className="text-lg font-mono font-bold text-white">64.2% H2O</p>
                   <p className="text-[10px] text-slate-500">Practice Lvl: 8 • m: 12.4</p>
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
               <div key={i} className="glass-card p-5 rounded-3xl flex items-center gap-4 hover:border-white/10 transition-colors group">
                  <div className={`p-3 rounded-2xl bg-white/5 ${s.col} group-hover:scale-110 transition-transform`}>
                     <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{s.label}</p>
                    <p className="text-lg font-mono font-bold text-white">{s.val}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sustainability;
