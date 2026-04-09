import React, { useEffect, useState } from 'react';
import { Leaf, CheckCircle } from 'lucide-react';
import { generateMRVReport, verifyMRVReport, getSensorData } from '../services/mrvService';
import { MRVReport } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MRVEngine: React.FC = () => {
  const [report, setReport] = useState<MRVReport | null>(null);
  const [sensorData, setSensorData] = useState<any[]>([]);

  useEffect(() => {
    setSensorData(getSensorData('ASSET-01'));
  }, []);

  const handleGenerate = () => {
    setReport(generateMRVReport('ASSET-01'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 max-w-[1400px] mx-auto px-4">
      <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Automated <span className="text-emerald-400">MRV Engine</span></h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <p className="text-slate-400">Real-time carbon verification and reporting.</p>
          <div className="mt-6 flex gap-4">
            <button 
              onClick={handleGenerate}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <CheckCircle size={18} /> Generate Report
            </button>
          </div>
          {report && (
            <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-white/5">
              <p className="text-white">Report ID: {report.id}</p>
              <p className="text-slate-400">Credits: {report.carbonCreditsMinted.toFixed(2)}</p>
              <button 
                onClick={() => verifyMRVReport(report.id)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
              >
                Verify Report
              </button>
            </div>
          )}
        </div>
        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-black/40">
          <h4 className="text-white font-bold mb-4">IoT Sensor Stream</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sensorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
              <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} name="CO2 (ppm)" />
              <Line type="monotone" dataKey="moisture" stroke="#3b82f6" strokeWidth={2} name="Moisture (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MRVEngine;
