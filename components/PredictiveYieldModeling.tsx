import React, { useState } from 'react';
import { predictYield } from '../services/aiService';
import { Loader2, TrendingUp, Activity, Database, CloudRain } from 'lucide-react';
import { motion } from 'motion/react';

const PredictiveYieldModeling: React.FC = () => {
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const soilData = { ph: 6.5, moisture: 42 }; // Telemetry simulation
      const weatherData = { temp: 24, rainfall: 85 };
      const prediction = await predictYield(crop, soilData, weatherData);
      setResult(prediction);
    } catch (error) {
      setResult('Error establishing neural link for predictive analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 rounded-[48px] border border-indigo-500/20 bg-black/40 text-white space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-[24px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
           <TrendingUp size={24} />
        </div>
        <div>
           <h2 className="text-sm font-black text-white uppercase italic tracking-widest">Predictive_Yield_Modelling</h2>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Industrial_Telemetry_Analysis</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
             <Database size={16} className="text-amber-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SOIL_SYNC:6.5PH</span>
         </div>
         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
             <CloudRain size={16} className="text-blue-400" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WEATHER_UPLINK:85MM</span>
         </div>
      </div>

      <input
        type="text"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="INPUT_CROP_TYPE_ID..."
        className="w-full p-6 rounded-3xl bg-black/20 border border-white/10 text-xs font-black uppercase text-white placeholder:text-slate-600 focus:border-indigo-500 transition-all outline-none"
      />
      
      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full p-6 bg-indigo-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : 'INITIALIZE_PREDICTION_SHARD'}
      </button>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/20"
        >
          <h4 className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-4 flex items-center gap-2">
            <Activity size={12} /> Neural_Oracle_Output
          </h4>
          <p className="text-xs text-slate-300 font-medium leading-relaxed font-mono">{result}</p>
        </motion.div>
      )}
    </div>
  );
};

export default PredictiveYieldModeling;
