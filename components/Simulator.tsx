import React, { useState, useEffect } from 'react';
// Added Activity icon to imports to fix error on line 119
import { Info, Calculator, Zap, Save, RefreshCw, Activity } from 'lucide-react';
import { calculateAgroCode, calculateMConstant, calculateSustainabilityScore } from '../systemFunctions';

const Simulator: React.FC = () => {
  const [rainfall, setRainfall] = useState(800);
  const [soilHealth, setSoilHealth] = useState(70);
  const [practiceLevel, setPracticeLevel] = useState(5);
  const [stress, setStress] = useState(0.12);
  const [results, setResults] = useState({ u: 0, m: 0, score: 0 });

  const calculateEOSMetrics = () => {
    // Mapping: Rainfall -> Intensity, SoilHealth -> Cumulative Stewardship (Ca), PracticeLevel -> Density (Dn)
    // Normalized inputs
    const dn = practiceLevel / 10;
    const in_val = rainfall / 2500;
    const ca = soilHealth / 10;
    
    const m = calculateMConstant(dn, in_val, ca, stress);
    const score = calculateSustainabilityScore(m);
    
    setResults({ 
      u: ca, // Using Ca as the primary agricultural code index for the simulator display
      m, 
      score 
    });
  };

  useEffect(() => {
    calculateEOSMetrics();
  }, [rainfall, soilHealth, practiceLevel, stress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-8 rounded-3xl space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <Calculator className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase italic">Sustainability Inputs</h3>
            <p className="text-sm text-slate-500 italic">Tune parameters to simulate node resonance</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Intensity (Rainfall mm)</label>
              <span className="text-sm font-mono text-emerald-400 font-black">{rainfall}mm</span>
            </div>
            <input 
              type="range" min="0" max="2500" value={rainfall}
              onChange={(e) => setRainfall(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Stewardship (Soil Health %)</label>
              <span className="text-sm font-mono text-blue-400 font-black">{soilHealth}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={soilHealth}
              onChange={(e) => setSoilHealth(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Density (Regen Level 1-10)</label>
              <span className="text-sm font-mono text-amber-400 font-black">Lvl {practiceLevel}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={practiceLevel}
              onChange={(e) => setPracticeLevel(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="group">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest group-hover:text-rose-500 transition-colors">Degradation Stress (S)</label>
              <span className="text-sm font-mono text-rose-500 font-black">{stress.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0.01" max="1.0" step="0.01" value={stress}
              onChange={(e) => setStress(Number(e.target.value))}
              className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        <div className="p-6 bg-indigo-950/10 border border-indigo-500/20 rounded-[32px] flex gap-4 shadow-inner">
          <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-200/50 leading-relaxed uppercase font-black italic">
            "The m-Constant represents the fundamental resonance of a local node. Synchronizing these variables allows the Oracle to forecast industrial yield multipliers."
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-[48px] bg-black/60 border-2 border-white/5 shadow-3xl">
          <h3 className="text-sm font-black text-slate-600 mb-8 uppercase tracking-[0.4em] italic px-4">Derived_Registry_Metrics</h3>
          <div className="grid grid-cols-2 gap-6 px-4">
            <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 text-center group hover:border-emerald-500/20 transition-all shadow-inner">
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-4">Agro Code (Ca)</p>
              <h4 className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">{results.u.toFixed(1)}</h4>
            </div>
            <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 text-center group hover:border-blue-500/20 transition-all shadow-inner">
              <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest mb-4">m-Constant</p>
              <h4 className="text-5xl font-mono font-black text-blue-400 tracking-tighter">{results.m.toFixed(3)}</h4>
            </div>
          </div>

          <div className="mt-10 p-12 glass-card rounded-[56px] text-center relative overflow-hidden border border-white/5 group/score">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/score:scale-125 transition-transform duration-[10s]"><Activity size={300} /></div>
            <div className="relative z-10 space-y-6">
              <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.6em] italic">VITALITY_SCORE_PREDICTION</p>
              <h2 className="text-9xl font-black text-white italic tracking-tighter m-0">{results.score.toFixed(0)}<span className="text-3xl text-emerald-500">%</span></h2>
              <div className="flex justify-center pt-4">
                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl transition-all duration-700 ${results.score > 70 ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30 animate-pulse' : 'bg-rose-950/20 text-rose-500 border-rose-500/30'}`}>
                  {results.score > 70 ? 'OPTIMAL_RESONANCE' : 'FRACTURED_ALIGNMENT_SYNC_REQUIRED'}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-80"></div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
            <RefreshCw className="w-4 h-4" /> RE-SYNC PARAMETERS
          </button>
          <button className="flex-1 py-6 agro-gradient rounded-[32px] text-white font-black text-[10px] uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10 ring-8 ring-white/5">
            <Zap className="w-4 h-4 fill-current" /> ANCHOR TO LEDGER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulator;