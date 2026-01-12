import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Binary, 
  Layers, 
  Microscope, 
  FlaskConical, 
  Scan, 
  AlertCircle, 
  TrendingUp, 
  Droplets, 
  Wind, 
  Sprout, 
  Bot, 
  Key, 
  Lock, 
  Database, 
  Upload, 
  MapPin, 
  X, 
  Loader2, 
  Sparkles, 
  Gauge, 
  Thermometer, 
  Fingerprint, 
  SearchCode, 
  History, 
  FileCheck, 
  Trash2, 
  ChevronRight, 
  LineChart, 
  BarChart4, 
  HeartPulse,
  Radar,
  LucideLineChart,
  CheckCircle2,
  Info,
  ArrowUpRight,
  PlusCircle,
  BrainCircuit,
  Terminal,
  Command,
  MessageSquareShare,
  Atom,
  ImageIcon,
  FileUp,
  FileSearch,
  Paperclip,
  Coins,
  CreditCard,
  Wallet,
  ShieldAlert,
  Flame,
  CloudUpload,
  ClipboardCheck,
  Dna
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar as RechartsRadar 
} from 'recharts';
import { runSpecialistDiagnostic, chatWithAgroExpert, analyzeMedia, AIResponse } from '../services/geminiService';

interface IntelligenceProps {
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

type TabState = 'twin' | 'simulator' | 'sid' | 'evidence' | 'eos_ai';

const MOCK_TELEMETRY = [
  { time: '00:00', val: 62 }, { time: '04:00', val: 65 }, { time: '08:00', val: 68 },
  { time: '12:00', val: 64 }, { time: '16:00', val: 72 }, { time: '20:00', val: 70 },
  { time: '24:00', val: 75 },
];

const SID_PATHOGENS = [
  { id: 'PATH-01', name: 'Ideological Overcrowding', load: 42, impact: 'Medium', status: 'ACTIVE' },
  { id: 'PATH-02', name: 'Trust Shard Decay', load: 12, impact: 'Low', status: 'DORMANT' },
  { id: 'PATH-03', name: 'Registry Feedback Loop', load: 85, impact: 'Critical', status: 'WARNING' },
];

// Payment Constants
const ORACLE_QUERY_COST = 25; // EAC

const Intelligence: React.FC<IntelligenceProps> = ({ userBalance, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<TabState>('twin');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Simulator States
  const [simRainfall, setSimRainfall] = useState(800);
  const [simSoil, setSimSoil] = useState(70);
  const [simPractice, setSimPractice] = useState(5);
  
  // SID States
  const [sidLoad, setSidLoad] = useState(35);
  const [remediationStep, setRemediationStep] = useState<'idle' | 'scanning' | 'complete'>('idle');

  // Evidence States
  const [evidenceList, setEvidenceList] = useState([
    { id: 'SHD-842', type: 'Soil Scan', date: '2h ago', status: 'VERIFIED', node: 'Node_Paris_04' },
    { id: 'SHD-912', type: 'Thermal Map', date: '5h ago', status: 'PENDING', node: 'Stwd_Nairobi' },
  ]);

  // Evidence Ingest Modal State
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingestStep, setIngestStep] = useState<'upload' | 'audit' | 'success'>('upload');
  const [ingestFile, setIngestFile] = useState<File | null>(null);
  const [ingestPreview, setIngestPreview] = useState<string | null>(null);
  const [ingestBase64, setIngestBase64] = useState<string | null>(null);
  const [ingestType, setIngestType] = useState('Soil Analysis');
  const [ingestReport, setIngestReport] = useState<string | null>(null);
  const ingestInputRef = useRef<HTMLInputElement>(null);

  // EOS AI States
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'authorizing' | 'success' | 'failed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateSimulator = () => {
    const ca = (simRainfall * simSoil) / 1000;
    const m = (simPractice * simSoil) / 10;
    return { ca, m, score: Math.min((ca * m) / 5, 100) };
  };

  const simResult = calculateSimulator();

  const runSIDRemediation = () => {
    setRemediationStep('scanning');
    setTimeout(() => {
      setSidLoad(prev => Math.max(prev - 15, 5));
      setRemediationStep('complete');
      onSpendEAC(50, 'SID_REMEDIATION_PROTOCOL');
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFilePreview(base64String);
        setFileBase64(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngestFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIngestFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setIngestPreview(base64String);
        setIngestBase64(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunIngestAudit = async () => {
    if (!ingestBase64) return;
    setIngestStep('audit');
    setIsProcessing(true);
    
    try {
      const result = await analyzeMedia(
        ingestBase64, 
        ingestFile?.type || 'image/jpeg', 
        `Perform an immutable industrial audit on this ${ingestType} shard. Evaluate its impact on C(a) and identify any sustainability anomalies.`
      );
      setIngestReport(result);
      
      // Add to list
      const newShard = {
        id: `SHD-${Math.floor(Math.random() * 900 + 100)}`,
        type: ingestType,
        date: 'Just now',
        status: 'VERIFIED',
        node: 'Local_Node_Sync'
      };
      setEvidenceList([newShard, ...evidenceList]);
      setIngestStep('success');
    } catch (e) {
      alert("Ledger Ingest Failure: Scientific Consensus Interrupted.");
      setIngestStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetIngest = () => {
    setShowIngestModal(false);
    setIngestStep('upload');
    setIngestFile(null);
    setIngestPreview(null);
    setIngestBase64(null);
    setIngestReport(null);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() && !fileBase64) return;
    
    // Payment Step
    setPaymentStatus('authorizing');
    await new Promise(r => setTimeout(r, 1000));

    const paymentSuccessful = onSpendEAC(ORACLE_QUERY_COST, `ORACLE_DEEP_INQUIRY_#${Math.random().toString(36).substring(7)}`);
    
    if (!paymentSuccessful) {
      setPaymentStatus('failed');
      setTimeout(() => setPaymentStatus('idle'), 3000);
      return;
    }

    setPaymentStatus('success');
    setAiThinking(true);
    setAiResult(null);
    
    try {
      let responseText = "";
      
      if (fileBase64) {
        // Use analyzeMedia for multi-modal diagnosis
        const res = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', aiQuery || "Perform a full agricultural diagnostic audit on this data shard.");
        responseText = res;
      } else {
        // Standard chat for text only
        const res = await chatWithAgroExpert(aiQuery, [], true);
        responseText = res.text;
      }
      
      setAiResult({ text: responseText });
    } catch (e) {
      alert("Oracle Congestion: Neural Handshake Interrupted.");
    } finally {
      setAiThinking(false);
      setTimeout(() => setPaymentStatus('idle'), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* Module Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Microscope className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
              <Cpu className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">EOS_SCIENCE_CORE_v4.2</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Science <span className="text-emerald-400">& IoT</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                 Synthesize raw telemetry, run predictive sustainability simulations, and protect node integrity from social pathogens.
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Registry Confidence</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">99.9<span className="text-2xl text-emerald-500">%</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Ledger Sync</span>
                 <span className="text-emerald-400">Locked</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[99%] shadow-[0_0_100px_#10b98144]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Science Hub Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'twin', label: 'IoT Digital Twin', icon: Monitor },
          { id: 'simulator', label: 'Framework Simulator', icon: LineChart },
          { id: 'eos_ai', label: 'EnvirosAgro AI', icon: BrainCircuit },
          { id: 'sid', label: 'SID Remediation (S)', icon: HeartPulse },
          { id: 'evidence', label: 'Evidence Portal', icon: History },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {/* 1. IoT DIGITAL TWIN */}
        {activeTab === 'twin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-left duration-500">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-black/60 relative overflow-hidden flex flex-col shadow-3xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-5 pointer-events-none"></div>
                <div className="flex justify-between items-center mb-12 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-emerald-500/10 rounded-2xl animate-pulse">
                         <Radar className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Live Node <span className="text-emerald-400">Mapping</span></h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase">Shard Sync Status</p>
                      <p className="text-lg font-mono font-black text-emerald-400">STABLE_INGEST_842</p>
                   </div>
                </div>

                <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
                   {/* Centered Node Visual */}
                   <div className="relative w-80 h-80 flex items-center justify-center">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                      <div className="w-48 h-48 rounded-full border-4 border-emerald-500/40 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] relative group">
                         <Sprout className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-20px] border-2 border-dashed border-emerald-500/20 rounded-full animate-spin-slow"></div>
                      </div>
                      
                      {/* Telemetry Dots */}
                      {[
                        { label: 'Moisture', val: '64.2%', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-12', col: 'text-blue-400' },
                        { label: 'Thermal', val: '22.4°C', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-12', col: 'text-amber-500' },
                        { label: 'PH Shard', val: '6.8', pos: 'left-0 top-1/2 -translate-x-16 -translate-y-1/2', col: 'text-emerald-400' },
                        { label: 'm-Resonance', val: '1.42x', pos: 'right-0 top-1/2 translate-x-16 -translate-y-1/2', col: 'text-indigo-400' },
                      ].map(t => (
                        <div key={t.label} className={`absolute ${t.pos} glass-card p-4 rounded-2xl bg-black/80 border border-white/10 text-center space-y-1 min-w-[100px] shadow-2xl`}>
                           <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest leading-none">{t.label}</p>
                           <p className={`text-xl font-mono font-black ${t.col} leading-none`}>{t.val}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/5 relative z-10">
                   {['Spectral Scan', 'IoT Health', 'Resonance Sync', 'Chain Finality'].map(s => (
                     <div key={s} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><Activity size={120} className="text-indigo-400" /></div>
                   <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3 relative z-10">
                      <Activity className="w-6 h-6 text-indigo-400" /> Shard Velocity
                   </h4>
                   <div className="h-64 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={MOCK_TELEMETRY}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: 'none', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="val" stroke="#818cf8" strokeWidth={4} fill="#818cf822" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed relative z-10">
                      "Real-time sharding of environmental telemetry ensures 100% data fidelity for carbon credit minting."
                   </p>
                </div>

                <div className="p-10 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-6">
                   <div className="flex items-center gap-4">
                      <Bot className="w-8 h-8 text-emerald-400" />
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Oracle Node Link</h4>
                   </div>
                   <p className="text-xs text-slate-500 italic leading-relaxed border-l-2 border-emerald-500/20 pl-4">
                      "Steward node #842 resonance is currently 1.42x. Advise performing a nitrogen shard update in Sector 4."
                   </p>
                   <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white/10 transition-all">Initialize Recalibration</button>
                </div>
             </div>
          </div>
        )}

        {/* 2. FRAMEWORK SIMULATOR */}
        {activeTab === 'simulator' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
              <div className="lg:col-span-4 glass-card p-12 rounded-[56px] border-blue-500/20 bg-black/40 space-y-12 shadow-2xl">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-600 rounded-3xl shadow-xl">
                       <Gauge className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic">Simulator <span className="text-blue-400">Inputs</span></h3>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Annual Rainfall (mm)</label>
                          <span className="text-lg font-mono font-black text-blue-400">{simRainfall}mm</span>
                       </div>
                       <input 
                         type="range" min="0" max="2500" value={simRainfall}
                         onChange={e => setSimRainfall(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" 
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Soil Health (%)</label>
                          <span className="text-lg font-mono font-black text-emerald-400">{simSoil}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="100" value={simSoil}
                         onChange={e => setSimSoil(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Practice Lvl (1-10)</label>
                          <span className="text-lg font-mono font-black text-amber-500">Lvl {simPractice}</span>
                       </div>
                       <input 
                         type="range" min="1" max="10" value={simPractice}
                         onChange={e => setSimPractice(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500" 
                       />
                    </div>
                 </div>

                 <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[40px] flex gap-6">
                    <Info className="w-8 h-8 text-blue-500 shrink-0" />
                    <p className="text-[10px] text-blue-300/50 font-black uppercase leading-relaxed tracking-tight">
                       "Adjust parameters to simulate future C(a) growth signatures and m-Constant stability buffers."
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col shadow-3xl">
                 <div className="flex justify-between items-center mb-16 px-4">
                    <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">Projection <span className="text-emerald-400">Ledger</span></h4>
                    <div className="flex gap-10">
                       <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">C(a) Agro Code</p><p className="text-4xl font-mono font-black text-white">{simResult.ca.toFixed(2)}</p></div>
                       <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Resilience (m)</p><p className="text-4xl font-mono font-black text-emerald-400">{simResult.m.toFixed(1)}</p></div>
                    </div>
                 </div>

                 <div className="flex-1 flex flex-col justify-center items-center space-y-12">
                    <div className="relative w-64 h-64 flex items-center justify-center">
                       <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                       <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin-slow opacity-20" style={{ transform: `rotate(${simResult.score * 3.6}deg)` }}></div>
                       <div className="text-center space-y-2">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Sustainability Score</p>
                          <h2 className="text-8xl font-black text-white tracking-tighter">{simResult.score.toFixed(0)}<span className="text-2xl opacity-40">%</span></h2>
                       </div>
                    </div>
                    <button className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                       COMMIT SIMULATION SHARD
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* 3. ENVIROSAGRO AI */}
        {activeTab === 'eos_ai' && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden shadow-3xl">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] animate-pulse">
                      <Atom className="w-96 h-96 text-white" />
                   </div>
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                          <BrainCircuit className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Cognitive <span className="text-emerald-400">Core</span></h3>
                          <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.4em] mt-2">EOS_NEURAL_REASONING_v5</p>
                        </div>
                      </div>
                      
                      <div className="glass-card p-4 rounded-2xl border-emerald-500/20 bg-black/40 flex items-center gap-4 group">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Wallet className="w-5 h-5 text-emerald-400" />
                         </div>
                         <div>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Available Utility</p>
                            <p className="text-xl font-mono font-black text-white">{userBalance.toFixed(0)} <span className="text-xs text-emerald-500">EAC</span></p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-10 relative z-10">
                      <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-8 shadow-inner relative overflow-hidden">
                         <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-4">
                               <Terminal className="w-6 h-6 text-emerald-400" /> Deep Oracle Ingest
                            </h4>
                            <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                               <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
                               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Shard Burn: {ORACLE_QUERY_COST} EAC</span>
                            </div>
                         </div>
                         
                         <div className="space-y-6">
                            <div className="relative">
                               <textarea 
                                 value={aiQuery}
                                 onChange={e => setAiQuery(e.target.value)}
                                 placeholder="Enter industrial scenario or framework query..."
                                 className="w-full bg-black/40 border border-white/10 rounded-3xl p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-40 resize-none placeholder:text-slate-800"
                               />
                               <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                  <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileSelect} 
                                    className="hidden" 
                                    accept="image/*,application/pdf" 
                                  />
                                  <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`p-4 rounded-2xl border transition-all ${selectedFile ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                                    title="Upload Agricultural Shard"
                                  >
                                    <Paperclip className="w-6 h-6" />
                                  </button>
                                  
                                  <div className="relative">
                                    <button 
                                      onClick={handleDeepAIQuery}
                                      disabled={aiThinking || paymentStatus !== 'idle' || (!aiQuery.trim() && !fileBase64)}
                                      className={`px-8 py-5 rounded-[24px] text-white font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-90 disabled:opacity-30 flex items-center gap-4 ${
                                        paymentStatus === 'failed' ? 'bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-500'
                                      }`}
                                    >
                                       {paymentStatus === 'authorizing' ? (
                                         <>
                                           <Loader2 className="w-5 h-5 animate-spin" />
                                           <span>Authorizing Payment...</span>
                                         </>
                                       ) : paymentStatus === 'success' ? (
                                         <>
                                           <CheckCircle2 className="w-5 h-5" />
                                           <span>Payment Anchored</span>
                                         </>
                                       ) : paymentStatus === 'failed' ? (
                                         <>
                                           <ShieldAlert className="w-5 h-5" />
                                           <span>Low Liquidity</span>
                                         </>
                                       ) : (
                                         <>
                                           <Sparkles className="w-5 h-5" />
                                           <span>Initialize (25 EAC)</span>
                                         </>
                                       )}
                                    </button>
                                  </div>
                               </div>
                            </div>

                            {/* File Preview Area */}
                            {filePreview && (
                              <div className="animate-in slide-in-from-left duration-300 p-6 glass-card rounded-[32px] border border-white/10 bg-white/5 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-black">
                                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-white uppercase truncate max-w-[200px]">{selectedFile?.name}</p>
                                    <p className="text-[8px] font-mono text-emerald-500 uppercase">Shard Ready for Ingest</p>
                                  </div>
                                </div>
                                <button onClick={removeFile} className="p-3 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-500/20">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                         </div>
                      </div>

                      {aiResult ? (
                        <div className="animate-in slide-in-from-bottom-6 duration-500 p-10 glass-card rounded-[48px] bg-emerald-600/5 border-l-4 border-emerald-500 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Fingerprint size={120} /></div>
                           <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5">
                              <Sparkles className="w-5 h-5 text-emerald-400" />
                              <h5 className="text-xl font-black text-white uppercase italic">Consensus Synthesis</h5>
                           </div>
                           <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line border-l-2 border-white/5 pl-8 font-medium">
                              {aiResult.text}
                           </p>
                        </div>
                      ) : aiThinking ? (
                        <div className="py-20 flex flex-col items-center gap-10">
                           <div className="relative">
                              <div className="absolute inset-[-15px] border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                              <BrainCircuit className="w-16 h-16 text-emerald-400 animate-pulse" />
                           </div>
                           <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.5em] animate-pulse italic">Traversing Shard History...</p>
                        </div>
                      ) : (
                        <div className="py-20 flex flex-col items-center text-center opacity-20 space-y-6">
                           <Command className="w-12 h-12 text-slate-500" />
                           <p className="text-sm font-black uppercase tracking-[0.4em]">Awaiting Input & Payment</p>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Activity className="w-48 h-48 text-indigo-400" /></div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3 relative z-10">
                         <Zap className="w-6 h-6 text-indigo-400" /> Cognitive <span className="text-indigo-400">Ledger</span>
                      </h4>
                      <div className="space-y-8 relative z-10">
                         {[
                           { l: 'Query Settle', v: '25 EAC', p: 100, col: 'bg-emerald-400' },
                           { l: 'Network Consensus', v: 'Active', p: 98, col: 'bg-blue-400' },
                           { l: 'Node Trust Lock', v: '99.9%', p: 100, col: 'bg-indigo-400' },
                         ].map(m => (
                           <div key={m.l} className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                                 <span>{m.l}</span>
                                 <span className="text-white font-mono">{m.v}</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${m.col} rounded-full`} style={{ width: `${m.p}%` }}></div>
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="pt-6 border-t border-white/5 relative z-10 text-center">
                         <p className="text-[10px] text-slate-500 italic leading-relaxed">
                            "AI deep-queries contribute to regional sustainability multipliers and unlock m-constant bonuses."
                         </p>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[48px] bg-black/40 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 group hover:border-emerald-500/20 transition-all">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                         <Coins className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none m-0">Subscription <span className="text-emerald-400">Node</span></h4>
                      <p className="text-slate-600 text-xs italic">Unlock unlimited Deep Oracle shards for 1,200 EAC per crop cycle.</p>
                      <button className="w-full py-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl text-[9px] font-black uppercase text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all">Commit Subscription</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* 4. SID REMEDIATION (S) */}
        {activeTab === 'sid' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right duration-500">
              <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-950/10 relative overflow-hidden flex flex-col shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><HeartPulse className="w-96 h-96 text-white" /></div>
                 <div className="flex justify-between items-center mb-12 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-rose-600 rounded-3xl shadow-xl shadow-rose-900/40">
                          <HeartPulse className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">SID <span className="text-rose-500">Diagnostic Suite</span></h3>
                          <p className="text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">SOCIAL_INFLUENZA_MONITOR_v3</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-500 font-black uppercase">Node Pathogen Load</p>
                       <p className={`text-4xl font-mono font-black ${sidLoad > 50 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>{sidLoad}%</p>
                    </div>
                 </div>

                 {remediationStep === 'idle' ? (
                   <div className="flex-1 space-y-10 relative z-10 animate-in fade-in duration-700">
                      <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 space-y-8">
                         <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-4 border-b border-white/5 pb-6">
                            <Bot className="w-6 h-6 text-rose-500" /> Pathfinder Audit
                         </h4>
                         <p className="text-slate-400 text-lg leading-relaxed italic font-medium border-l-4 border-rose-500/40 pl-8">
                            "Steward node detected elevated social resonance friction in Zone 4. High SID load inhibits m™ constant recovery cycles. Immediate remediation recommended."
                         </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {SID_PATHOGENS.map(p => (
                            <div key={p.id} className="p-8 bg-black/40 rounded-[40px] border border-white/5 flex justify-between items-center group hover:border-rose-500/30 transition-all">
                               <div className="space-y-1">
                                  <h5 className="text-base font-black text-white uppercase italic">{p.name}</h5>
                                  <p className="text-[10px] text-slate-600 font-mono tracking-widest">{p.id}</p>
                               </div>
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${p.status === 'WARNING' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse' : 'bg-white/5 text-slate-500'}`}>{p.status}</span>
                            </div>
                         ))}
                      </div>
                      <button onClick={runSIDRemediation} className="w-full py-10 agro-gradient-rose rounded-[44px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all">
                         EXECUTE REMEDIATION SHARD (50 EAC)
                      </button>
                   </div>
                 ) : remediationStep === 'scanning' ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-15px] border-t-8 border-rose-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-2xl">
                             <Scan className="w-20 h-20 text-rose-500 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-rose-500 font-black text-xl uppercase tracking-[0.5em] animate-pulse italic">Neutralizing Pathogens...</p>
                          <p className="text-slate-600 font-mono text-[10px]">REBALANCING_SOCIAL_IMMUNITY_NODE_SYNC</p>
                       </div>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
                       <div className="w-48 h-48 agro-gradient-rose rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(244,63,94,0.4)] scale-110 relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-15px] rounded-full border-4 border-rose-500/20 animate-ping opacity-30"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Shard <span className="text-rose-500">Healed</span></h3>
                          <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.5em] font-mono">Registry Finality Hash: 0x882_SID_OK_01</p>
                       </div>
                       <button onClick={() => setRemediationStep('idle')} className="w-full max-w-sm py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Diagnostic Terminal</button>
                    </div>
                 )}
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
                       <ShieldCheck className="w-6 h-6 text-indigo-400" /> Social <span className="text-indigo-400">Immunity (x)</span>
                    </h4>
                    <div className="space-y-6 pt-6">
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 text-center">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Immunity Score</p>
                          <h4 className="text-6xl font-mono font-black text-indigo-400">0.94</h4>
                       </div>
                       <p className="text-xs text-slate-500 font-medium leading-relaxed italic text-center">
                          "High 'x' constant values provide up to 15% resistance to regional SID outbreaks."
                       </p>
                    </div>
                 </div>
                 <div className="p-10 glass-card rounded-[48px] bg-black/40 border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                       <Users2 className="w-8 h-8 text-rose-500" />
                       <h4 className="text-xs font-black text-white uppercase tracking-widest">Community Resonance</h4>
                    </div>
                    <div className="flex gap-1.5 h-16 items-end justify-center">
                       {[...Array(12)].map((_, i) => <div key={i} className="flex-1 bg-rose-500/20 rounded-full animate-bounce" style={{ height: `${20+Math.random()*80}%`, animationDelay: `${i*0.1}s` }}></div>)}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 5. EVIDENCE PORTAL */}
        {activeTab === 'evidence' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10 px-4">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Evidence <span className="text-emerald-400">Registry Portal</span></h3>
                    <p className="text-slate-500 text-lg font-medium italic">Immutable multi-spectral ingest ledger for agricultural data shards.</p>
                 </div>
                 <button 
                  onClick={() => setShowIngestModal(true)}
                  className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all"
                 >
                    <Upload className="w-5 h-5" /> Ingest New Data Shard
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {evidenceList.map(ev => (
                   <div key={ev.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-2xl relative overflow-hidden active:scale-[0.98] duration-300">
                      <div className="flex justify-between items-start mb-10 relative z-10">
                         <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 group-hover:rotate-6 transition-transform shadow-xl">
                            <Binary size={28} className="text-emerald-400" />
                         </div>
                         <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              ev.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                            }`}>{ev.status}</span>
                            <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-tighter italic">{ev.id}</p>
                         </div>
                      </div>
                      <div className="flex-1 space-y-6 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0">{ev.type}</h4>
                         <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Monitor size={14} className="text-slate-400" /> {ev.node}
                         </div>
                         <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 font-mono text-[9px] text-slate-600 italic">
                            HASH: 0x{btoa(ev.id + ev.type).substring(0, 32).toUpperCase()}...
                         </div>
                      </div>
                      <div className="mt-12 pt-8 border-t border-white/5 flex gap-4 relative z-10 justify-between items-center">
                         <p className="text-[10px] font-black text-slate-700 font-mono uppercase">{ev.date}</p>
                         <button className="p-5 rounded-2xl bg-white/5 hover:bg-emerald-600 text-white transition-all shadow-xl active:scale-90 border border-white/10">
                            <ArrowUpRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 ))}
                 
                 <div 
                  onClick={() => setShowIngestModal(true)}
                  className="p-12 border-4 border-dashed border-white/5 rounded-[56px] flex flex-col items-center justify-center text-center space-y-10 group hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all cursor-pointer shadow-inner bg-black/10"
                 >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform"><PlusCircle className="w-10 h-10 text-slate-700 group-hover:text-emerald-400" /></div>
                    <div className="space-y-4">
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">New Ingest Shard</h4>
                       <p className="text-slate-500 text-sm italic max-w-[200px] mx-auto leading-relaxed">Drop spectral logs or soil DNA data to initialize blockchain audit.</p>
                    </div>
                 </div>
              </div>

              <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
                    <Database className="w-96 h-96 text-indigo-400" />
                 </div>
                 <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                       <Binary className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Evidence Integrity Index</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Your evidence fidelity score contributes to your global multiplier and regional node trust.</p>
                    </div>
                 </div>
                 <div className="text-right relative z-10 shrink-0">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-2 border-b border-white/10 pb-4">TOTAL_LEDGER_SHARDS</p>
                    <p className="text-7xl font-mono font-black text-white tracking-tighter">1.2K</p>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* EVIDENCE INGEST MODAL */}
      {showIngestModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={resetIngest}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12 min-h-[650px] flex flex-col justify-center">
                 <button onClick={resetIngest} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 {ingestStep === 'upload' && (
                    <div className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                       <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                             <CloudUpload className="w-12 h-12 text-emerald-400 group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-[32px] animate-ping opacity-30"></div>
                          </div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Ledger <span className="text-emerald-400">Ingest</span></h3>
                          <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Upload multi-spectral field data for an immutable Oracle audit.</p>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Shard Designation</label>
                             <select 
                                value={ingestType}
                                onChange={e => setIngestType(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all appearance-none"
                             >
                                <option>Soil DNA Analysis</option>
                                <option>Spectral Crop Map</option>
                                <option>Thermal Moisture Sync</option>
                                <option>Purity Baseline Test</option>
                             </select>
                          </div>

                          <div 
                            onClick={() => ingestInputRef.current?.click()}
                            className={`p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center text-center cursor-pointer group ${ingestFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/5 bg-black/40 hover:border-emerald-500/20'}`}
                          >
                             <input 
                              type="file" 
                              ref={ingestInputRef} 
                              onChange={handleIngestFileSelect} 
                              className="hidden" 
                              accept="image/*,application/pdf" 
                             />
                             {ingestPreview ? (
                               <div className="space-y-4">
                                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-emerald-500/20 shadow-2xl mx-auto">
                                     <img src={ingestPreview} alt="Shard Preview" className="w-full h-full object-cover" />
                                  </div>
                                  <p className="text-emerald-400 font-bold uppercase text-xs tracking-widest">{ingestFile?.name}</p>
                               </div>
                             ) : (
                               <>
                                  <FileUp className="w-12 h-12 text-slate-700 mb-6 group-hover:text-emerald-400 transition-colors" />
                                  <p className="text-xl font-black text-white uppercase tracking-widest">Select Shard File</p>
                                  <p className="text-slate-600 text-xs mt-2 uppercase font-bold tracking-widest">IMAGE OR RESEARCH DOC</p>
                               </>
                             )}
                          </div>
                       </div>

                       <button 
                         onClick={handleRunIngestAudit}
                         disabled={!ingestBase64 || isProcessing}
                         className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                       >
                          {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                          {isProcessing ? "ANALYZING..." : "INITIALIZE ORACLE AUDIT"}
                       </button>
                    </div>
                 )}

                 {ingestStep === 'audit' && (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-10 text-center animate-in fade-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-15px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                             <Dna className="w-20 h-20 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Scientific <span className="text-emerald-400">Verification</span></h3>
                          <p className="text-emerald-500/60 font-mono text-sm animate-pulse uppercase tracking-[0.4em]">Cross-referencing m-Constant signatures...</p>
                          <p className="text-slate-700 text-[10px] font-mono tracking-widest uppercase mt-4">NODE_TRUST: 99.8% // SHARD_DENSITY: OPTIMAL</p>
                       </div>
                    </div>
                 )}

                 {ingestStep === 'success' && (
                    <div className="space-y-12 animate-in zoom-in duration-700 flex-1 flex flex-col justify-center text-center">
                       <div className="space-y-6">
                          <div className="w-32 h-32 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] mx-auto relative group">
                             <ClipboardCheck className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-[-15px] rounded-full border-4 border-emerald-500/20 animate-ping opacity-30"></div>
                          </div>
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic">Shard <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500/80 text-[10px] font-black uppercase tracking-[0.6em] font-mono">REGISTRY_HASH: 0x772_INGEST_OK_842</p>
                       </div>

                       <div className="p-10 glass-card rounded-[48px] bg-black/60 border-l-4 border-emerald-500 shadow-inner text-left relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02]"><Fingerprint size={120} /></div>
                          <h4 className="text-xl font-black text-white uppercase italic mb-6 flex items-center gap-4">
                             <Sparkles className="w-6 h-6 text-emerald-400" /> Audit Verdict Shard
                          </h4>
                          <div className="max-h-40 overflow-y-auto custom-scrollbar pr-4 italic text-slate-300 leading-loose text-lg font-medium">
                             {ingestReport}
                          </div>
                       </div>

                       <button 
                         onClick={resetIngest}
                         className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95"
                       >
                          Return to Registry Portal
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

const Users2 = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Intelligence;