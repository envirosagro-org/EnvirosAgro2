
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
  ShieldX
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
  PolarAngleAxis
} from 'recharts';
import { analyzeSocialInfluenza, analyzeTokenzFinance } from '../services/geminiService';

interface SustainabilityProps {
  onAction?: () => void;
}

const Sustainability: React.FC<SustainabilityProps> = ({ onAction }) => {
  const [tab, setTab] = useState<'simulator' | 'social' | 'twin' | 'portal'>('simulator');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [S, setS] = useState(120); 
  const [Dn, setDn] = useState(60); 
  const [In, setIn] = useState(40); 
  const [x, setX] = useState(5);   
  const [r, setR] = useState(1.05); 
  const [n, setN] = useState(5);   
  const [isStatic, setIsStatic] = useState(false);

  const [sidViralLoad, setSidViralLoad] = useState(35);
  const [socialImmunity, setSocialImmunity] = useState(60);
  const [isAnalyzingSID, setIsAnalyzingSID] = useState(false);
  const [sidReport, setSidReport] = useState<string | null>(null);

  const [iotStream, setIotStream] = useState<{ id: string, val: number, status: string }[]>([]);
  const [isRelayActive, setIsRelayActive] = useState(false);
  const [relayFrequency, setRelayFrequency] = useState(432);

  const [isBridgeAuthorized, setIsBridgeAuthorized] = useState(false);
  const [isAuthorizingBridge, setIsAuthorizingBridge] = useState(false);
  const [bridgeLog, setBridgeLog] = useState<string | null>(null);

  const [results, setResults] = useState({ ca: 0, m: 0 });

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

  const handleAuthorizeBridge = async () => {
    setIsAuthorizingBridge(true);
    try {
      const handshakeData = {
        action: 'INSTITUTIONAL_BRIDGE_AUTH',
        node_id: 'NODE-291',
        protocol: 'EOS-3.2-SHARD',
        timestamp: new Date().toISOString()
      };
      const response = await analyzeTokenzFinance(handshakeData);
      setBridgeLog(response.text);
      setIsBridgeAuthorized(true);
    } catch (error) {
      alert("Institutional Handshake Failed. Verify ESIN node status.");
    } finally {
      setIsAuthorizingBridge(false);
    }
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
        {[
          { id: 'simulator', label: 'Framework Simulator' },
          { id: 'social', label: 'SID Remediation (S)' },
          { id: 'twin', label: 'IoT Digital Twin' },
          { id: 'portal', label: 'Evidence Portal' },
        ].map((t) => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            {t.label}
          </button>
        ))}
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
                </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[40px] border-white/5 bg-emerald-500/[0.01] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                   <Binary className="w-32 h-32 text-emerald-500" />
                </div>
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">C(a)™ Growth Projection</h4>
                <div className="h-[250px] w-full min-h-0 min-w-0">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                <Activity className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Resilience m™ Constant</h4>
                <p className="text-7xl font-black text-white font-mono mt-4 tracking-tighter">{results.m.toFixed(2)}</p>
              </div>
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
                 </div>
              </div>
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Viral Load</label>
                       <span className="text-xs font-mono text-rose-500 font-bold">{sidViralLoad}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={sidViralLoad} onChange={e => setSidViralLoad(Number(e.target.value))} className="w-full h-2 bg-rose-950 rounded-lg appearance-none accent-rose-500" />
                 </div>
              </div>
           </div>
           <div className="lg:col-span-2">
              <div className="glass-card p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                   <Dna className="w-4 h-4 text-rose-400" /> Resonance Analysis
                </h4>
                <div className="h-[280px] w-full min-h-0 min-w-0">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sidData}>
                         <PolarGrid stroke="rgba(255,255,255,0.05)" />
                         <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={10} fontStyle="italic" />
                         <Radar name="SID Load" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                         <Radar name="Immunity" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      </ RadarChart>
                   </ResponsiveContainer>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sustainability;
