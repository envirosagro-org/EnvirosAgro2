import React, { useState } from 'react';
import { predictYield } from '../services/aiService';
import { Loader2, TrendingUp } from 'lucide-react';

const PredictiveYieldModeling: React.FC = () => {
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      // Mock data for now, in a real app this would come from sensors/database
      const soilData = { ph: 6.5, moisture: 40 };
      const weatherData = { temp: 25, rainfall: 100 };
      const prediction = await predictYield(crop, soilData, weatherData);
      setResult(prediction);
    } catch (error) {
      setResult('Error predicting yield.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 glass-card rounded-3xl border border-white/10 bg-black/40 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp /> Predictive Yield Modeling
      </h2>
      <input
        type="text"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="Enter crop type..."
        className="w-full p-3 rounded-xl bg-white/10 border border-white/20 mb-4"
      />
      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Predict Yield'}
      </button>
      {result && (
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

export default PredictiveYieldModeling;
