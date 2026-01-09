
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Zap, 
  Globe, 
  Cpu, 
  MapPin, 
  Info, 
  Calculator, 
  RefreshCw, 
  Save, 
  CheckCircle2, 
  Loader2, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Activity,
  Database,
  Cloud,
  ChevronRight,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Terminal,
  Layers,
  Sparkles,
  Bot,
  Wifi,
  Radio,
  ArrowUpRight,
  Upload,
  Camera,
  ShieldCheck,
  FileSearch,
  History,
  Lock,
  Scan,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  X,
  Flame,
  ShieldAlert,
  Dna,
  Heart,
  Brain,
  Microscope,
  Binary,
  Waves,
  Link as LinkIcon,
  ShieldX,
  Gauge,
  Satellite,
  HardHat,
  Monitor,
  // Added missing Sprout icon
  Sprout
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { analyzeSocialInfluenza } from '../services/geminiService';

interface SustainabilityProps {
  onAction?: () => void;
}

const Sustainability: React.FC<SustainabilityProps> = ({ onAction }) => {
  const [tab, setTab] = useState<'simulator' | 'social' | 'twin' | 'portal'>('twin');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Framework Constants
  const [S, setS] = useState(120); 
  const [Dn, setDn] = useState(60); 
  const [In, setIn] = useState(40); 
  const [x, setX] = useState(5.2);   
  const [r, setR] = useState(1.05); 
  const [n, setN] = useState(5);   
  const [isStatic, setIsStatic] = useState(false);

  // Social Constants
  const [sidViralLoad, setSidViralLoad] = useState(35);
  const [socialImmunity, setSocialImmunity] = useState(60);
  const [isAnalyzingSID, setIsAnalyzingSID] = useState(false);
  const [sidReport, setSidReport] = useState<string | null>(null);

  // IoT Twin States
  const [iotStream, setIotStream] = useState<{ id: string, label: string, val: number, unit: string, status: string, col: string, icon: any }[]>([]);
  const [isRelayActive, setIsRelayActive] = useState(true);
  const [relayFrequency, setRelayFrequency] = useState(432);
  const [signalStrength, setSignalStrength] = useState(92);

  const [results, setResults] = useState({ ca: 0, m: 0 });

  // Calculate Framework Metrics
  useEffect(() => {
    const effectiveX = x * (socialImmunity / 100) * (1 - sidViralLoad / 200);
    let ca = 1;
    if (isStatic) {
      ca = n * effectiveX + 1;
    } else {
      if (Math.abs(r - 1) < 0.0001) {
        ca = n * effectiveX + 1;
      } else {
        ca = effectiveX * ((Math.pow(r, n) - 1) / (r - 1)) + 1;
      }
    }
    const effectiveS = S * (1 + sidViralLoad / 100);
    const m = Math.sqrt((Dn * In * ca) / effectiveS);
    setResults({ ca, m });
  }, [S, Dn, In, x, r, n, isStatic, sidViralLoad, socialImmunity]);

  // Real-time IoT Ingest Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const sensors = [
        { id: 'SM-01', label: 'Soil Moisture', val: 64.2 + (Math.random() - 0.5) * 2, unit: '%', status: 'NOMINAL', col: 'text-blue-400', icon: Droplets },
        { id: 'TP-82', label: 'Core Temp', val: 22.4 + (Math.random() - 0.5), unit: '°C', status: 'STABLE', col: 'text-orange-400', icon: Thermometer },
        { id: 'NT-44', label: 'Nitrogen Shard', val: 412 + (Math.random() - 0.5) * 10, unit: 'ppm', status: 'OPTIMAL', col: 'text-emerald-400', icon: Sprout },
        { id: 'BW-09', label: 'Bio-Wave Res.', val: 432 + (Math.random() - 0.5) * 0.5, unit: 'Hz', status: 'SYNCED', col: 'text-indigo-400', icon: Waves },
      ];
      setIotStream(sensors);
      if (isRelayActive) setSignalStrength(prev => Math.min(100, Math.max(85, prev + (Math.random() - 0.5) * 2)));
    }, 2000);
    return () => clearInterval(interval);
  }, [isRelayActive]);

  const sidRadarData = [
    { subject: 'Language Clarity', A: 100 - sidViralLoad, B: socialImmunity, fullMark: 100 },
    { subject: 'Trust Density', A: 85 - (sidViralLoad/2), B: socialImmunity, fullMark: 100 },
    { subject: 'Trauma Sync', A: 90 - sidViralLoad, B: socialImmunity, fullMark: 100 },
    { subject: 'Soil Environment', A: 95, B: 100 - (sidViralLoad/3), fullMark: 100 },
    { subject: 'Worker Health', A: 80, B: socialImmunity, fullMark: 100 },
  ];

  const runSIDOracle = async () => {
    setIsAnalyzingSID(true);
    setSidReport(null);
    try {
      const nodeData = { sidViralLoad, socialImmunity, m: results.m, ca: results.ca };
      const response = await analyzeSocialInfluenza(nodeData);
      setSidReport(response.text);
    } catch (e) {
      alert("Social Oracle Timeout. Check regional immunity buffer.");
    } finally {
      setIsAnalyzingSID(false);
    }
  };

  // Added handleSaveScenario function
  const handleSaveScenario = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Primary Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'twin', label: 'IoT Digital Twin', icon: Monitor },
          { id: 'simulator', label: 'Framework Simulator', icon: Calculator },
          { id: 'social', label: 'SID Remediation (S)', icon: ShieldX },
          { id: 'portal', label: 'Evidence Portal', icon: Database },
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {tab === 'twin' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Digital Twin Core View */}
               <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-8">
                     <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-500/10 rounded-[32px] shadow-2xl border border-emerald-500/20">
                           <Monitor className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div>
                           <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Digital <span className="text-emerald-400">Twin Hub</span></h3>
                           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Real-time Telemetry Ingest & Synchronization</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="text-right">
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Signal Health</p>
                           <p className="text-3xl font-mono font-black text-emerald-400">{signalStrength.toFixed(1)}%</p>
                        </div>
                        <button 
                          onClick={() => setIsRelayActive(!isRelayActive)}
                          className={`p-5 rounded-3xl transition-all shadow-xl border ${isRelayActive ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-rose-600/10 text-rose-500 border-rose-500/20'}`}
                        >
                           <Wifi className={`w-6 h-6 ${isRelayActive ? 'animate-pulse' : ''}`} />
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12 relative z-10">
                    {iotStream.map(sensor => (
                      <div key={sensor.id} className="p-8 bg-black/60 rounded-[40px] border border-white/10 group hover:border-emerald-500/40 transition-all flex flex-col justify-between h-56">
                         <div className="flex justify-between items-start">
                            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                               <sensor.icon className={`w-6 h-6 ${sensor.col}`} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">{sensor.id}</span>
                         </div>
                         <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{sensor.label}</p>
                            <h4 className="text-4xl font-mono font-black text-white leading-none">
                               {sensor.val.toFixed(2)}<span className="text-sm font-sans ml-1 opacity-40">{sensor.unit}</span>
                            </h4>
                         </div>
                         <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{sensor.status}</span>
                         </div>
                      </div>
                    ))}
                  </div>

                  {/* Satellite Ingest Log */}
                  <div className="p-8 bg-black/60 rounded-[44px] border border-white/10 space-y-6">
                     <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                           <Terminal className="w-4 h-4 text-emerald-500" />
                           <h4 className="text-xs font-black text-white uppercase tracking-widest">Ingest Terminal_Log</h4>
                        </div>
                        <p className="text-[10px] font-mono text-slate-700">TIMESTAMP: {new Date().toLocaleTimeString()}</p>
                     </div>
                     <div className="h-40 overflow-y-auto font-mono text-[10px] text-emerald-500/60 p-6 space-y-2 custom-scrollbar bg-black/40 rounded-3xl">
                        <p>> [INFO] Initializing ZK-Handshake with SAT-EOS-04...</p>
                        <p>> [SUCCESS] Ingest Shard #842 validated.</p>
                        <p>> [DATA] C(a) constant stability check: 1.42x - NOMINAL.</p>
                        <p className="animate-pulse">> [SYNC] Committing moisture shards to local registry...</p>
                        <p className="opacity-40">> [WAIT] Awaiting next orbital relay pass (T-14m)...</p>
                     </div>
                  </div>
               </div>

               {/* Digital Twin Sidebar */}
               <div className="space-y-8">
                  <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 space-y-8 flex flex-col justify-center text-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform">
                        <Satellite className="w-48 h-48 text-emerald-400" />
                     </div>
                     <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em] relative z-10">Total Node U-Score</p>
                     <h3 className="text-7xl font-black text-white font-mono tracking-tighter relative z-10">92.4</h3>
                     <div className="space-y-4 relative z-10">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Registry Sync Level</p>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-24 mx-auto">
                           <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" style={{ width: '92%' }}></div>
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-6">
                     <div className="flex items-center gap-3">
                        <HardHat className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Maintenance Actions</h4>
                     </div>
                     <div className="space-y-4">
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all flex items-center justify-center gap-3">
                           <RefreshCw className="w-4 h-4" /> Calibrate Soil Array
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-600 hover:border-blue-500 transition-all flex items-center justify-center gap-3">
                           <Satellite className="w-4 h-4" /> Request High-Res Scan
                        </button>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all flex items-center justify-center gap-3">
                           <Layers className="w-4 h-4" /> Sync m-Constant
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {tab === 'simulator' && (
          <div className="space-y-10 animate-in slide-in-from-left duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Inputs */}
                <div className="lg:col-span-1 glass-card p-12 rounded-[56px] space-y-10 border-emerald-500/20 bg-emerald-500/5 shadow-2xl">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                        <Calculator className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Parameter <span className="text-emerald-400">Inputs</span></h3>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex justify-between px-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Factor (x)</label>
                           <span className="text-xs font-mono font-bold text-emerald-400">{x.toFixed(2)}</span>
                        </div>
                        <input type="range" min="1" max="10" step="0.1" value={x} onChange={e => setX(Number(e.target.value))} className="w-full h-2 bg-black/60 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between px-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crop Cycle (S) [Days]</label>
                           <span className="text-xs font-mono font-bold text-blue-400">{S}</span>
                        </div>
                        <input type="number" value={S} onChange={e => setS(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white font-mono text-xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all" />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Nature (Dn)</label>
                            <input type="number" value={Dn} onChange={e => setDn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono focus:ring-4 focus:ring-emerald-500/20 outline-none" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Nature (In)</label>
                            <input type="number" value={In} onChange={e => setIn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono focus:ring-4 focus:ring-emerald-500/20 outline-none" />
                         </div>
                      </div>
                   </div>

                   <button 
                    onClick={handleSaveScenario}
                    disabled={isSaving}
                    className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                   >
                      {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {isSaving ? 'Saving...' : 'Save Scenario Shard'}
                   </button>
                   
                   {showSuccess && (
                    <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-xs font-black text-center uppercase tracking-widest animate-in zoom-in">
                      Scenario Shard Synchronized
                    </div>
                   )}
                </div>

                {/* Outputs Visualization */}
                <div className="lg:col-span-2 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col justify-between group">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:rotate-12 transition-transform"><Binary className="w-48 h-48 text-white" /></div>
                         <div>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">Agricultural Code C(a)</p>
                            <h4 className="text-7xl font-mono font-black text-white tracking-tighter">{results.ca.toFixed(2)}</h4>
                         </div>
                         <div className="pt-10 h-40">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                               <AreaChart data={[{p: 'G', v: 1}, {p: 'P1', v: results.ca * 0.4}, {p: 'P2', v: results.ca * 0.7}, {p: 'NOW', v: results.ca}]}>
                                  <defs>
                                     <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                     </linearGradient>
                                  </defs>
                                  <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={6} fill="url(#colorSim)" fillOpacity={1} />
                               </AreaChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 relative overflow-hidden flex flex-col items-center justify-center text-center group">
                         <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:rotate-12 transition-transform"><Activity className="w-48 h-48 text-white" /></div>
                         <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform">
                            <Gauge className="w-12 h-12 text-white" />
                         </div>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Resilience m™ Constant</p>
                         <h4 className="text-7xl font-mono font-black text-white tracking-tighter">{results.m.toFixed(2)}</h4>
                      </div>
                   </div>

                   <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5">
                      <div className="flex gap-8 items-start">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shrink-0">
                            <Info className="w-8 h-8 text-emerald-400" />
                         </div>
                         <div className="space-y-4">
                            <h4 className="text-xl font-bold text-white uppercase tracking-widest italic">Simulation Context</h4>
                            <p className="text-slate-400 leading-loose text-lg italic">
                               "Your current configuration predicts a <span className="text-emerald-400 font-black">12.4% increase</span> in carbon sequestration capacity for the next cycle. Maintaining a m-Constant above 1.5 is recommended for institutional grant eligibility."
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {tab === 'social' && (
          <div className="space-y-10 animate-in zoom-in duration-500 max-w-6xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-500/5 space-y-12">
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-900/40 border border-rose-400/20">
                         <ShieldAlert className="w-10 h-10 text-white" />
                      </div>
                      <div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">SID <span className="text-rose-500">Viral Load</span></h3>
                         <p className="text-rose-400/60 text-[10px] font-black uppercase tracking-widest mt-1">Social Influenza Disease Ingest</p>
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div className="space-y-4">
                         <div className="flex justify-between px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Viral Pathogen Load</label>
                            <span className="text-xl font-mono font-black text-rose-500">{sidViralLoad}%</span>
                         </div>
                         <input type="range" min="0" max="100" value={sidViralLoad} onChange={e => setSidViralLoad(Number(e.target.value))} className="w-full h-3 bg-rose-950 rounded-full appearance-none cursor-pointer accent-rose-500" />
                         <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest pt-2">
                            <span>ZERO_LOAD</span>
                            <span>CRITICAL_THRESHOLD</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between px-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Social Immunity</label>
                            <span className="text-xl font-mono font-black text-emerald-400">{socialImmunity}%</span>
                         </div>
                         <input type="range" min="0" max="100" value={socialImmunity} onChange={e => setSocialImmunity(Number(e.target.value))} className="w-full h-3 bg-emerald-950 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                      </div>
                   </div>

                   <button 
                    onClick={runSIDOracle}
                    disabled={isAnalyzingSID}
                    className="w-full py-8 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-rose-600 hover:border-rose-500 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                   >
                      {isAnalyzingSID ? <Loader2 className="w-6 h-6 animate-spin" /> : <Brain className="w-6 h-6" />}
                      {isAnalyzingSID ? 'SYNCHRONIZING PATHOGENS...' : 'INVOKE SOCIAL ORACLE'}
                   </button>
                </div>

                <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col items-center justify-center">
                   <h4 className="text-xl font-bold text-white uppercase tracking-tighter mb-10 italic flex items-center gap-3 px-2">
                      <Dna className="w-5 h-5 text-rose-400" /> Resonance <span className="text-rose-400">Analysis Shard</span>
                   </h4>
                   <div className="h-[400px] w-full min-h-0 min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sidRadarData}>
                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                            <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={10} fontStyle="italic" />
                            <Radar name="SID Load" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                            <Radar name="Immunity" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                         </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>

             {sidReport && (
               <div className="glass-card p-16 rounded-[64px] border-l-8 border-rose-500 bg-rose-500/5 animate-in slide-in-from-top-6 duration-700 shadow-3xl">
                  <div className="flex items-center gap-6 mb-10 pb-8 border-b border-white/10">
                     <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Sparkles className="w-8 h-8 text-rose-400" />
                     </div>
                     <h4 className="text-3xl font-black text-white uppercase tracking-widest italic">Remediation <span className="text-rose-500">Strategy</span></h4>
                  </div>
                  <div className="prose prose-invert max-w-none text-slate-200 text-xl leading-[2.2] italic whitespace-pre-line border-l-4 border-rose-500/20 pl-12">
                     {sidReport}
                  </div>
                  <div className="mt-12 flex justify-end">
                     <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:text-white transition-all">Export Protocol Shard</button>
                  </div>
               </div>
             )}
          </div>
        )}

        {tab === 'portal' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                      <Database className="w-10 h-10 text-emerald-400" /> Evidence <span className="text-emerald-400">Vault</span>
                   </h3>
                   <p className="text-lg text-slate-500 italic">Immutable scientific shards proving regenerative growth and C(a) integrity.</p>
                </div>
                <button 
                  onClick={onAction}
                  className="px-12 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                >
                   <Upload className="w-6 h-6" /> MINT NEW EVIDENCE
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                  { id: 'SH-882', title: 'Soil Biome Scan', date: '2024.05.12', type: 'Spectral', status: 'VERIFIED', icon: Microscope, col: 'text-blue-400' },
                  { id: 'SH-901', title: 'Hydration Log V2', date: '2024.05.15', type: 'IoT Telemetry', status: 'VERIFIED', icon: Droplets, col: 'text-cyan-400' },
                  { id: 'SH-042', title: 'Carbon Offset Shard', date: '2024.05.18', type: 'Audit Proof', status: 'PENDING', icon: Binary, col: 'text-purple-400' },
                ].map((shard, i) => (
                  <div key={i} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                        <Database className="w-48 h-48 text-white" />
                     </div>
                     <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-emerald-500/10 transition-colors">
                           <shard.icon className={`w-8 h-8 ${shard.col}`} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${shard.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'}`}>
                           {shard.status}
                        </span>
                     </div>
                     <div className="flex-1 relative z-10">
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-emerald-400 transition-colors italic">{shard.title}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-4 tracking-widest uppercase">{shard.id} // TYPE: {shard.type}</p>
                     </div>
                     <div className="pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                           <History className="w-4 h-4 text-slate-600" />
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{shard.date}</span>
                        </div>
                        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-emerald-600 transition-all active:scale-90">
                           <ArrowUpRight className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
                   <ShieldCheck className="w-96 h-96 text-indigo-400" />
                </div>
                <div className="flex items-center gap-10 relative z-10">
                   <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                      <Binary className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Immutable Ledger</h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Your evidence shards are cross-verified by regional validator nodes to maintain framework consensus.</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em]">TOTAL SHARDS</p>
                   <p className="text-7xl font-mono font-black text-white tracking-tighter">42</p>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Sustainability;
