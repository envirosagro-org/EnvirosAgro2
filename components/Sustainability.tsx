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
  AudioWaveform as WaveformIcon,
  Flame,
  ShieldAlert,
  Dna,
  Heart,
  Brain,
  Microscope,
  Binary,
  Waves
} from 'lucide-react';
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
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { chatWithAgroExpert, diagnoseCropIssue, analyzeSocialInfluenza } from '../services/geminiService';

interface SustainabilityProps {
  onAction?: () => void;
}

const Sustainability: React.FC<SustainabilityProps> = ({ onAction }) => {
  const [tab, setTab] = useState<'simulator' | 'social' | 'twin' | 'portal'>('simulator');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Framework Parameters
  const [S, setS] = useState(120); 
  const [Dn, setDn] = useState(60); 
  const [In, setIn] = useState(40); 
  const [x, setX] = useState(5);   
  const [r, setR] = useState(1.05); 
  const [n, setN] = useState(5);   
  const [isStatic, setIsStatic] = useState(false);

  // Social Influenza States
  const [sidViralLoad, setSidViralLoad] = useState(35);
  const [socialImmunity, setSocialImmunity] = useState(60);
  const [isAnalyzingSID, setIsAnalyzingSID] = useState(false);
  const [sidReport, setSidReport] = useState<string | null>(null);

  // IoT Live Feeds
  const [iotStream, setIotStream] = useState<{ id: string, val: number, status: string }[]>([]);
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [relayFrequency, setRelayFrequency] = useState(432);

  const [results, setResults] = useState({ ca: 0, m: 0 });

  // Calculate current metrics with SID impact
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

  // IoT Stream Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const sensors = [
        { id: 'S-01', val: 64.2 + (Math.random() - 0.5) * 2, status: 'NOMINAL' },
        { id: 'T-82', val: 22.4 + (Math.random() - 0.5), status: 'NOMINAL' },
        { id: 'N-44', val: 412 + (Math.random() - 0.5) * 10, status: 'STABLE' },
      ];
      setIotStream(sensors);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sidData = [
    { subject: 'Language Clarity', A: 100 - sidViralLoad, B: socialImmunity, fullMark: 100 },
    { subject: 'Trust Density', A: 85 - (sidViralLoad/2), B: socialImmunity, fullMark: 100 },
    { subject: 'Trauma Sync', A: 90 - sidViralLoad, B: socialImmunity, fullMark: 100 },
    { subject: 'Soil Environment', A: 95, B: 100 - (sidViralLoad/3), fullMark: 100 },
    { subject: 'Worker Health', A: 80, B: socialImmunity, fullMark: 100 },
  ];

  const runSIDOracle = async () => {
    setIsAnalyzingSID(true);
    const nodeData = { sidViralLoad, socialImmunity, m: results.m, ca: results.ca };
    const response = await analyzeSocialInfluenza(nodeData);
    setSidReport(response.text);
    setIsAnalyzingSID(false);
  };

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
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setTab('simulator')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'simulator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          Framework Simulator
        </button>
        <button 
          onClick={() => setTab('social')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'social' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          SID Remediation (S)
        </button>
        <button 
          onClick={() => setTab('twin')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'twin' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          IoT Digital Twin
        </button>
        <button 
          onClick={() => setTab('portal')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'portal' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
          Evidence Portal
        </button>
      </div>

      {tab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-left duration-300">
          <div className="lg:col-span-1 glass-card p-8 rounded-[40px] space-y-6 border-emerald-500/10 h-fit">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
              <Calculator className="w-5 h-5 text-emerald-400" />
              EOS Parameters
            </h3>
            <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Crop Cycle (S) [Days]</label>
                  <input type="number" value={S} onChange={e => setS(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Nature (Dn)</label>
                    <input type="number" value={Dn} onChange={e => setDn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Nature (In)</label>
                    <input type="number" value={In} onChange={e => setIn(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Base Factor (x)</label>
                  <input type="range" min="1" max="10" value={x} onChange={e => setX(Number(e.target.value))} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  <div className="flex justify-between mt-2 text-[8px] font-black text-slate-600 uppercase">
                     <span>Survival</span>
                     <span>Thriving (x={x})</span>
                     <span>Industrial</span>
                  </div>
                </div>
            </div>
            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-[32px] flex gap-4">
              <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <p className="text-[10px] text-amber-200/50 leading-relaxed uppercase font-black tracking-widest">
                Agricultural Code C(a) is the root metric for asset minting. High Social Influenza Load (S-Thrust) acts as a dampening field on the Base Factor.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[40px] border-white/5 bg-emerald-500/[0.01] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                   <Binary className="w-32 h-32 text-emerald-500" />
                </div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">C(a)™ Growth Projection</h4>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[{period: 'Genesis', ca: 1}, {period: 'P1', ca: results.ca * 0.2}, {period: 'P2', ca: results.ca * 0.5}, {period: 'P3', ca: results.ca}]}>
                      <defs>
                        <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="ca" stroke="#10b981" strokeWidth={4} fill="url(#colorCa)" fillOpacity={1} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="period" stroke="rgba(255,255,255,0.1)" fontSize={10} fontStyle="italic" />
                      <Tooltip contentStyle={{ background: '#050706', border: '1px solid #10b98122', borderRadius: '16px' }} />
                    </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-card p-10 rounded-[40px] border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none group-hover:bg-blue-500/[0.04] transition-colors"></div>
                <Activity className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Resilience m™ Constant</h4>
                <p className="text-7xl font-black text-white font-mono mt-4 tracking-tighter">{results.m.toFixed(2)}</p>
                <div className="mt-6 flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                   <span className="text-[9px] font-black text-blue-400 uppercase">Synchronization Nominal</span>
                </div>
              </div>
            </div>
            <div className="flex gap-6">
               <button 
                onClick={handleSaveScenario}
                disabled={isSaving}
                className="flex-[2] py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                {isSaving ? 'COMMITING TO SHARDS...' : 'Save Registry Scenario'}
              </button>
              <button onClick={() => setTab('portal')} className="flex-1 py-8 glass-card border-white/10 rounded-[32px] text-white font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                 Evidence Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in zoom-in duration-500">
           <div className="lg:col-span-1 glass-card p-10 rounded-[48px] border-rose-500/20 bg-rose-500/5 space-y-8">
              <div className="flex items-center gap-4">
                 <ShieldAlert className="w-10 h-10 text-rose-500" />
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">SID <span className="text-rose-500">Viral Load</span></h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Social Influenza Pathogen Node</p>
                 </div>
              </div>

              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ideological Overcrowding</label>
                       <span className="text-xs font-mono text-rose-500 font-bold">{sidViralLoad}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={sidViralLoad} onChange={e => setSidViralLoad(Number(e.target.value))} className="w-full h-2 bg-rose-950 rounded-lg appearance-none accent-rose-500" />
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Immunity (H-Thrust)</label>
                       <span className="text-xs font-mono text-emerald-400 font-bold">{socialImmunity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={socialImmunity} onChange={e => setSocialImmunity(Number(e.target.value))} className="w-full h-2 bg-emerald-950 rounded-lg appearance-none accent-emerald-500" />
                 </div>
              </div>

              <div className="p-6 bg-black/40 rounded-3xl border border-rose-500/10 space-y-4">
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Physiological Stress Impact</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                       <p className="text-[8px] text-slate-500 uppercase">Hypertension Risk</p>
                       <p className="text-lg font-mono font-bold text-rose-400">{(sidViralLoad * 1.2).toFixed(0)}%</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl text-center">
                       <p className="text-[8px] text-slate-500 uppercase">H-Thrust Mult.</p>
                       <p className="text-lg font-mono font-bold text-emerald-400">{(socialImmunity * 0.01).toFixed(2)}x</p>
                    </div>
                 </div>
              </div>
              
              <div className="glass-card p-6 rounded-3xl border-indigo-500/20 bg-indigo-500/5 space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Radio className={`w-5 h-5 ${isRelayActive ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`} />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">AgroMusika Relay</span>
                    </div>
                    <button 
                      onClick={() => setIsRelayActive(!isRelayActive)}
                      className={`w-10 h-5 rounded-full relative transition-all ${isRelayActive ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                       <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRelayActive ? 'right-1' : 'left-1'}`}></div>
                    </button>
                 </div>
                 {isRelayActive && (
                   <div className="animate-in fade-in zoom-in duration-300 space-y-3">
                      <div className="h-8 flex items-end justify-center gap-1">
                         {[...Array(12)].map((_, i) => (
                           <div key={i} className="w-1 bg-indigo-400 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                         ))}
                      </div>
                      <p className="text-[8px] text-center text-indigo-300 uppercase font-black tracking-widest italic">Mitigating intergenerational trauma: {relayFrequency}Hz</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                       <Dna className="w-4 h-4 text-rose-400" /> Resonance Analysis
                    </h4>
                    <div className="h-[280px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sidData}>
                             <PolarGrid stroke="rgba(255,255,255,0.05)" />
                             <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={10} fontStyle="italic" />
                             <Radar name="SID Load" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                             <Radar name="Immunity" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                          </ RadarChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 justify-center mt-4">
                       <div className="flex items-center gap-2 text-[8px] font-black uppercase text-rose-500">
                          <div className="w-2 h-2 rounded bg-rose-500"></div> Viral Load
                       </div>
                       <div className="flex items-center gap-2 text-[8px] font-black uppercase text-emerald-500">
                          <div className="w-2 h-2 rounded bg-emerald-500"></div> Immunity Node
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-10 rounded-[40px] bg-gradient-to-b from-rose-900/10 to-transparent border-rose-500/20 flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
                       <Flame className="w-40 h-40 text-rose-500" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                          <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center shadow-xl shadow-rose-950/40">
                             <ShieldAlert className="w-8 h-8 text-white" />
                          </div>
                          <div>
                             <h4 className="text-xl font-bold text-white uppercase tracking-tighter italic">SID <span className="text-rose-400">Oracle</span></h4>
                             <span className="text-[10px] text-rose-400 font-black uppercase tracking-widest">EOS_PATHOGEN_INTEL</span>
                          </div>
                       </div>
                       
                       {!sidReport ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-6">
                            <p className="text-slate-400 italic text-lg leading-relaxed">"Analyze the intergenerational impact of social thrust conflicts on node resilience (m)."</p>
                            <button onClick={runSIDOracle} className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95">
                               {isAnalyzingSID ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                               Initialize SID Sweep
                            </button>
                         </div>
                       ) : (
                         <div className="flex-1 space-y-6 flex flex-col overflow-hidden animate-in fade-in duration-700">
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 prose prose-invert prose-rose max-w-none text-slate-300 text-[11px] leading-relaxed italic whitespace-pre-line">
                               {sidReport}
                            </div>
                            <button onClick={() => setSidReport(null)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all">Clear Analysis</button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-10 glass-card rounded-[48px] bg-emerald-500/5 border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-emerald-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-[32px] bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-950/40 group-hover:rotate-12 transition-transform">
                       <Heart className="w-10 h-10 text-white fill-current" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">H-Thrust <span className="text-emerald-400">Optimization</span></h4>
                       <p className="text-slate-400 text-sm font-medium">"High Social Immunity increases C(a)™ efficiency by up to 24%."</p>
                    </div>
                 </div>
                 <div className="flex gap-6 relative z-10">
                    <div className="text-center p-6 glass-card rounded-3xl border-white/5">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Effective x</p>
                       <p className="text-3xl font-mono font-black text-white">{(x * (socialImmunity/100) * (1 - sidViralLoad/200)).toFixed(2)}</p>
                    </div>
                    <div className="text-center p-6 glass-card rounded-3xl border-white/5 bg-emerald-500/10 border-emerald-500/20">
                       <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Resilience</p>
                       <p className="text-3xl font-mono font-black text-emerald-400">{results.m.toFixed(2)}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {tab === 'twin' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right duration-300 pb-20">
          <div className="lg:col-span-3 glass-card rounded-[56px] overflow-hidden relative min-h-[700px] border-white/5 group bg-black">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200')] bg-cover grayscale opacity-20 group-hover:grayscale-0 transition-all duration-1000"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
             
             {/* Map Data Visualization Overlay */}
             <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] border border-emerald-500/20 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 left-1/3 w-[200px] h-[200px] border-2 border-emerald-500/10 rounded-full"></div>
             </div>

             <div className="relative z-10 p-12 space-y-8 h-full flex flex-col">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-rose-500/20 rounded-2xl border border-rose-500/30">
                       <MapPin className="text-rose-500 w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Digital Twin: <span className="text-emerald-400">Node #291</span></h3>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Industrial Ingest Pipeline Active</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <span className="px-4 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> SENSOR_SYNC: 100%
                      </span>
                   </div>
                </div>

                <div className="flex-1 relative">
                   <div className="absolute top-1/4 left-1/3 p-8 glass-card rounded-[40px] border-emerald-500/40 backdrop-blur-3xl shadow-2xl animate-bounce-slow pointer-events-auto cursor-pointer group/sensor">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Live Sensor S-01</span>
                      </div>
                      <div className="space-y-1">
                         <p className="text-5xl font-mono font-black text-white">{iotStream[0]?.val.toFixed(1)}% <span className="text-sm text-slate-500 uppercase">H2O</span></p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Moisture Signature: Stable</p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                         <span className="text-[9px] text-slate-600 font-black uppercase">Shard Release</span>
                         <ChevronRight className="w-4 h-4 text-emerald-500" />
                      </div>
                   </div>

                   <div className="absolute bottom-1/4 right-1/4 p-8 glass-card rounded-[40px] border-blue-500/40 backdrop-blur-3xl shadow-2xl animate-pulse pointer-events-auto cursor-pointer">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Spectral Relay R-04</span>
                      </div>
                      <div className="space-y-1">
                         <p className="text-5xl font-mono font-black text-white">m: {results.m.toFixed(2)}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">C(a)™ Verification: Optimized</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                   <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-2">
                      <p className="text-[9px] text-slate-500 font-black uppercase">Network Latency</p>
                      <p className="text-2xl font-mono font-black text-white">12ms</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-2">
                      <p className="text-[9px] text-slate-500 font-black uppercase">Consensus Mode</p>
                      <p className="text-2xl font-mono font-black text-emerald-400 uppercase">ZK-Rollup</p>
                   </div>
                   <div className="p-6 bg-black/40 border border-white/10 rounded-3xl space-y-2">
                      <p className="text-[9px] text-slate-500 font-black uppercase">Auth Token</p>
                      <p className="text-2xl font-mono font-black text-blue-400 uppercase">ACTIVE_291</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="glass-card p-8 rounded-[40px] space-y-6">
                <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Microscope className="w-5 h-5 text-emerald-400" /> Sensor Registry
                </h4>
                <div className="space-y-4">
                   {iotStream.map((s, i) => (
                     <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex gap-4 items-center">
                           <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-[10px] font-mono text-slate-400 group-hover:text-emerald-400">
                              {s.id}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white uppercase">{s.id === 'S-01' ? 'Moisture' : s.id === 'T-82' ? 'Thermal' : 'Nitrogen'}</p>
                              <p className="text-[8px] text-slate-500 font-bold uppercase">{s.status}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-mono font-black text-white">{s.val.toFixed(1)}</p>
                           <p className="text-[8px] text-emerald-500 font-black">SYNC_OK</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2">
                   <RefreshCw className="w-3 h-3" /> Re-scan Node Array
                </button>
             </div>

             <div className="glass-card p-10 rounded-[48px] bg-indigo-600/5 border-indigo-500/20 flex flex-col justify-center items-center text-center space-y-6 group">
                <div className="relative">
                   <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                   <Cloud className="w-16 h-16 text-indigo-400 relative z-10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Institutional Data</h4>
                   <p className="text-slate-500 text-xs font-medium leading-relaxed italic">"Connect your node to the Global Environmental Shard for predictive risk modeling."</p>
                </div>
                <button className="w-full py-5 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all">
                   Authorize Data Bridge
                </button>
             </div>

             <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-4">
                <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                <p className="text-[9px] text-blue-300 font-black uppercase tracking-widest leading-relaxed">
                   Hardware relay EA-291 verified via ZK-Proof v3.2. Data sovereignty guaranteed.
                </p>
             </div>
          </div>
        </div>
      )}

      {tab === 'portal' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700 pb-20">
           <div className="glass-card rounded-[56px] p-16 bg-gradient-to-br from-indigo-900/20 via-[#050706] to-black border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:rotate-6 transition-transform">
                 <Binary className="w-[500px] h-[500px] text-white" />
              </div>
              
              <div className="w-48 h-48 rounded-[56px] bg-indigo-600 flex items-center justify-center shadow-2xl ring-[16px] ring-white/5 shrink-0 animate-pulse">
                 <Microscope className="w-20 h-20 text-white" />
              </div>

              <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                 <div className="space-y-2">
                    <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20">EOS_EVIDENCE_SYSTEM_V3.2</span>
                    <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">Scientific <span className="text-indigo-400">Evidence Portal</span></h2>
                 </div>
                 <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                    Upload multi-spectral telemetry, soil health records, and regenerative labor logs to mint high-value EAC assets and reputation shards.
                 </p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                    <button 
                      onClick={onAction}
                      className="px-12 py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                    >
                       <Upload className="w-6 h-6 fill-current" /> Initialize Ingest
                    </button>
                    <button className="px-10 py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                       <FileSearch className="w-6 h-6" /> Export Ledger Logs
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 glass-card p-12 rounded-[48px] border-white/5 space-y-10">
                 <div className="flex justify-between items-center border-b border-white/5 pb-8">
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                       <History className="w-6 h-6 text-indigo-400" /> Recent Submissions
                    </h3>
                    <div className="flex gap-2">
                       <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><Filter className="w-4 h-4" /></button>
                       <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white"><Search className="w-4 h-4" /></button>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {[
                      { id: 'SUB-842', type: 'Moisture Audit', val: '+45.00 EAC', status: 'VERIFIED', shard: '0x992B', time: '2m ago' },
                      { id: 'SUB-841', type: 'Soil Ph Record', val: '+12.50 EAC', status: 'VERIFIED', shard: '0x104A', time: '1h ago' },
                      { id: 'SUB-839', type: 'Biomass Log', val: '+84.20 EAC', status: 'COMMITTED', shard: '0x882D', time: '5h ago' },
                      { id: 'SUB-835', type: 'Purity Audit', val: '+140.0 EAC', status: 'VERIFIED', shard: '0x221F', time: '1d ago' },
                    ].map((entry, i) => (
                      <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[40px] group hover:bg-white/[0.03] hover:border-indigo-500/20 transition-all flex items-center justify-between cursor-pointer">
                         <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                               <ShieldCheck className={`w-8 h-8 ${entry.status === 'VERIFIED' ? 'text-emerald-400' : 'text-blue-400'}`} />
                            </div>
                            <div>
                               <p className="text-xl font-black text-white uppercase tracking-tight leading-none mb-2">{entry.type}</p>
                               <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">ID: {entry.id} // SHARD: {entry.shard}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-mono font-black text-emerald-400 mb-1">{entry.val}</p>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{entry.time} // {entry.status}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 <button className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all">
                    Load Older Shards
                 </button>
              </div>

              <div className="space-y-8">
                 <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8 bg-indigo-600/5">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                       <Zap className="w-5 h-5 text-indigo-400" /> Network Stats
                    </h4>
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <p className="text-[10px] text-slate-500 font-black uppercase">Minted via Evidence</p>
                          <p className="text-4xl font-mono font-black text-white">428.5K <span className="text-sm">EAC</span></p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] text-slate-500 font-black uppercase">Audit Success Rate</p>
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[99.2%]"></div>
                             </div>
                             <span className="text-sm font-mono font-black text-emerald-400">99.2%</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/5 space-y-6">
                    <div className="flex items-center gap-3">
                       <AlertCircle className="w-6 h-6 text-amber-500" />
                       <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest leading-none">Integrity Protocol</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                       "All evidence is cross-verified by 12 independent regional validator nodes. False telemetry triggers an automated m™ constant reset and ESIN revocation."
                    </p>
                 </div>

                 <div className="p-10 glass-card rounded-[48px] border-white/5 flex flex-col items-center text-center space-y-6 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center group-hover:rotate-12 transition-transform">
                       <Download className="w-8 h-8 text-slate-500" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-bold text-white uppercase tracking-widest">Compliance Export</h4>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Generate audit-ready PDF shards.</p>
                    </div>
                 </div>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Sustainability;