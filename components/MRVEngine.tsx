import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, CheckCircle2, ShieldCheck, Zap, History, 
  MapPin, Globe, Search, ArrowRight, Gauge, 
  Wind, Droplets, Mountain, Activity, Box,
  Terminal, Database, Radio, Satellite, Info,
  AlertTriangle, FlaskConical, Scan, Fingerprint
} from 'lucide-react';
import { generateMRVReport, verifyMRVReport, getSensorData } from '../services/mrvService';
import { MRVReport, User, LiveAgroProduct } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { SEO } from './SEO';
import { motion, AnimatePresence } from 'motion/react';
import { iotService, TelemetryReading } from '../services/iotService';
import { toast } from 'sonner';

interface MRVEngineProps {
  user: User;
  liveProducts: LiveAgroProduct[];
  onNavigate: any;
  dispatchSignal: any;
}

const MRVEngine: React.FC<MRVEngineProps> = ({ user, liveProducts, onNavigate, dispatchSignal }) => {
  const [reports, setReports] = useState<MRVReport[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [liveTelemetry, setLiveTelemetry] = useState<Record<string, TelemetryReading>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to live telemetry for environmental grounding
    iotService.startSimulation();
    const unsub = iotService.subscribe((reading) => {
      setLiveTelemetry(prev => ({ ...prev, [reading.channel]: reading }));
      setChartData(prev => {
        const newData = [...prev, { name: new Date(reading.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), co2: 380 + Math.random() * 30, moisture: 40 + Math.random() * 20 }];
        return newData.slice(-10);
      });
    });

    return () => { unsub(); };
  }, []);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setProcessingStep(1);
    
    // Simulate multi-step verification protocol
    await new Promise(r => setTimeout(r, 1500));
    setProcessingStep(2);
    await new Promise(r => setTimeout(r, 1500));
    setProcessingStep(3);
    await new Promise(r => setTimeout(r, 1500));
    
    const newReport = generateMRVReport('ASSET-PRIME-01');
    setReports([newReport, ...reports]);
    setIsProcessing(false);
    setProcessingStep(0);
    setActiveReportId(newReport.id);
    
    toast.success('Environmental Shard Finalized. Evidence anchored to registry.');
  };

  const activeReport = useMemo(() => 
    reports.find(r => r.id === activeReportId) || reports[0]
  , [reports, activeReportId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full">
      <SEO title="MRV Engine" description="Measurement, Reporting, and Verification Hub: Verifying environmental impact and carbon sequestration fidelity." />
      
      {/* Protocol Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            MRV <span className="text-emerald-400">Forge</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Environmental_Fidelity_Processor_v4.2</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Activity size={14} className="text-emerald-400 animate-pulse" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Ingest_Rate</p>
                 <p className="text-xs font-black text-white">4.2 GB/s</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <ShieldCheck size={14} className="text-indigo-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Consensus</p>
                 <p className="text-xs font-black text-white">100%</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Evidence Vault Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence_Vault</h3>
              <button className="text-[8px] font-black text-indigo-400 uppercase hover:underline">Sync_All</button>
           </div>
           <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {reports.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-700 opacity-50 border-2 border-dashed border-white/5 rounded-3xl">
                   <Database size={32} className="mb-2" />
                   <p className="text-[8px] font-black uppercase">Shard_List_Empty</p>
                </div>
              ) : (
                reports.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setActiveReportId(r.id)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all group ${activeReportId === r.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl translate-x-1' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="text-[10px] font-black uppercase italic tracking-tighter">Report_{r.id.split('-').pop()}</p>
                           <p className="text-[7px] font-mono opacity-50">{new Date(r.timestamp).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[6px] font-black uppercase ${r.status === 'VERIFIED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>{r.status}</span>
                     </div>
                     <p className="text-[10px] font-bold text-slate-300 font-mono">+{r.carbonCreditsMinted.toFixed(2)} tCO2e</p>
                  </button>
                ))
              )}
           </div>

           <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <Terminal size={16} className="text-slate-500" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-white">Ingest_Terminal</span>
              </div>
              <div className="p-3 bg-black/40 rounded-xl font-mono text-[8px] text-emerald-500/70 space-y-1">
                 <p>{">"} INGESTING_SATELLITE_MESH...</p>
                 <p>{">"} CROSS_REF_GROUND_IOT [OK]</p>
                 <p className="animate-pulse">{">"} READY_FOR_ANCHOR_EXECUTION_</p>
              </div>
           </div>
        </div>

        {/* Tactical Verification Engine */}
        <div className="lg:col-span-2 space-y-6 text-left">
           <div className="glass-card p-10 rounded-[48px] border border-white/10 bg-black/60 relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <Leaf size={160} className="text-emerald-500" />
              </div>

              <div className="mb-10 space-y-2">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                       <FlaskConical size={24} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white italic truncate uppercase tracking-tighter">G-Fidelity_Forge</h3>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic animate-pulse">Awaiting_Hardware_Shard_Handshake...</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Droplets size={12} className="text-blue-400" /> Ground_Hydration
                          </span>
                          <span className="text-[10px] font-black text-white font-mono">4.2%_VAR</span>
                       </div>
                       <div className="h-1 bg-black rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" style={{ width: '64%' }}></div>
                       </div>
                    </div>
                    
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                       <div className="flex items-center justify-between">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                             <Wind size={12} className="text-emerald-400" /> Carbon_Potency
                          </span>
                          <span className="text-[10px] font-black text-white font-mono">15%_GAIN</span>
                       </div>
                       <div className="h-1 bg-black rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '82%' }}></div>
                       </div>
                    </div>
                 </div>

                 <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800')] bg-cover bg-center grayscale opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black to-transparent"></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                       <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 flex items-center justify-center bg-black/40 backdrop-blur-md">
                          <MapPin size={32} className="text-indigo-400 animate-bounce" />
                       </div>
                       <p className="text-[8px] font-black text-white uppercase tracking-widest">GEOFENCE_LOCKED_88.21N</p>
                    </div>
                    
                    {/* Scanning Line */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500/30 animate-scan"></div>
                 </div>
              </div>

              <div className="space-y-6">
                 {isProcessing ? (
                   <div className="w-full space-y-4 animate-in fade-in duration-500">
                      <div className="flex justify-between items-center px-4">
                         <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic tracking-tighter">
                            {processingStep === 1 && "Verifying_Asset_Existence..."}
                            {processingStep === 2 && "Validating_Satellite_Mask..."}
                            {processingStep === 3 && "Finalizing_Evidence_Shard..."}
                         </span>
                         <span className="text-[10px] font-mono text-white">{processingStep * 33}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${processingStep * 33}%` }}></div>
                      </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleGenerate}
                        className="w-full py-6 bg-white text-black hover:bg-slate-200 transition-all rounded-[32px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                      >
                         EXECUTE_VERIFICATION_PROTOCOL <Zap size={18} />
                      </button>
                      <button className="w-full py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] transition-all">MANUAL_AUDIT_OVERRIDE</button>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Atmospheric Fidelity Monitor */}
        <div className="lg:col-span-1 space-y-6 text-left">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <Radio size={16} className="text-indigo-400" /> Atmos_Fidelity
                </h3>
              </div>

              <div className="h-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.length > 0 ? chartData : [{name: '00:00', co2: 380, moisture: 45}]}>
                       <defs>
                          <linearGradient id="colorMRV" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMRV)" />
                       <Tooltip contentStyle={{ background: '#000', border: 'none', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Potency_Index</p>
                       <p className="text-md font-black text-white">0.94</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <p className="text-[7px] font-black text-slate-600 uppercase mb-1">Fidelity_lvl</p>
                       <p className="text-md font-black text-indigo-400">AA+</p>
                    </div>
                 </div>
                 
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                       <Fingerprint size={20} className="text-emerald-400" />
                       <div>
                          <p className="text-[9px] font-black text-white uppercase leading-none">Biometric Origin</p>
                          <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">Verified_via_Bantu_Seed_Mesh</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                 <Satellite size={22} className="text-indigo-400" />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic leading-none">Orbital Sync</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                 Satellite evidence shards sharding into the global ledger every 4 hours.
              </p>
              <div className="pt-3 flex items-center justify-between border-t border-indigo-500/10">
                 <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Next_Sync_Block</span>
                 <span className="text-[9px] font-mono text-indigo-400 font-black">42m_21s</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MRVEngine;
