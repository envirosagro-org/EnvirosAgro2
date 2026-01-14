
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
  Dna,
  Workflow,
  ShieldX,
  Target,
  Users2,
  Radiation,
  Waves,
  ZapOff,
  RefreshCw,
  EyeOff,
  Timer,
  Languages,
  School,
  Heart,
  MessageSquare,
  AlertTriangle
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
import { chatWithAgroExpert, analyzeMedia, AIResponse } from '../services/geminiService';

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
  { id: 'PATH-01', name: 'Ideological Overcrowding', load: 82, impact: 'Critical', status: 'ACTIVE', desc: 'Cognitive fatigue leading to reduced empathy and heightened defensiveness.' },
  { id: 'PATH-02', name: 'Intergenerational Trauma', load: 64, impact: 'High', status: 'ANCHORED', desc: 'Transmission of historical fear narratives within family units.' },
  { id: 'PATH-03', name: 'Language Volatility', load: 45, impact: 'Medium', status: 'WARNING', desc: 'Ambiguous or hostile communication vectors destabilizing node trust.' },
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
  
  // SID Factor Stimulation States
  const [transmissionIndex, setTransmissionIndex] = useState(40);
  const [overcrowdingIndex, setOvercrowdingIndex] = useState(30);
  const [languageVolatility, setLanguageVolatility] = useState(25);
  const [socialStress, setSocialStress] = useState(20);
  const [isSimulatingPathogens, setIsSimulatingPathogens] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  // Calculated Immutability Index for SID
  // Logic: Immutability is the depth to which a social pathogen is anchored in the cultural registry.
  const immutabilityIndex = Math.min(100, 
    (transmissionIndex * 0.35) + 
    (overcrowdingIndex * 0.25) + 
    (languageVolatility * 0.20) + 
    (socialStress * 0.20)
  );

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

  const handleStimulateFactors = async () => {
    setIsSimulatingPathogens(true);
    setSimulationReport(null);
    try {
      const prompt = `Perform a technical Pathogenic Factor Stimulation for SID (Social Influenza Disease) Immutability. 
      Simulation Variables:
      - Intergenerational Transmission: ${transmissionIndex}% (Heritage trauma/fear)
      - Ideological Overcrowding: ${overcrowdingIndex}% (Cognitive load/fatigue)
      - Language Volatility: ${languageVolatility}% (Vector communication friction)
      - Social Stress/Disorganization: ${socialStress}% (Environmental/Economic instability)
      
      Tasks:
      1. Calculate the 'Immutability Depth' (Anchoring depth in regional registry).
      2. Explain how these specific variables catalyze permanent trust decay.
      3. Identify potential manifestations at Societal, Family, and Individual levels (referencing SID conceptual framework).
      4. Provide a remediation strategy for a Steward Node.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setSimulationReport(res.text);
    } catch (e) {
      alert("Factor Oracle Handshake Failed.");
    } finally {
      setIsSimulatingPathogens(false);
    }
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
        const res = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', aiQuery || "Perform a full agricultural diagnostic audit on this data shard.");
        responseText = res;
      } else {
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        <div className="lg:col-span-3 glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
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
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 md:ml-4">
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

      <div className="min-h-[700px] px-4">
        {/* --- SID REMEDIATION (S) SECTION --- */}
        {activeTab === 'sid' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-950/10 relative overflow-hidden flex flex-col shadow-3xl group min-h-[500px]">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform"><Radiation size={300} className="text-rose-500" /></div>
                      
                      <div className="flex items-center gap-6 mb-12 relative z-10">
                         <div className="p-5 bg-rose-600 rounded-[32px] shadow-2xl relative group overflow-hidden">
                            <HeartPulse className="w-10 h-10 text-white relative z-10" />
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">SID <span className="text-rose-500">Analyzer</span></h3>
                            <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">SOCIAL_IMMUNITY_v5.0</p>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10 py-10">
                         <div className="w-64 h-64 rounded-full border-4 border-dashed border-rose-500/20 flex flex-col items-center justify-center relative group">
                            <Radiation className="w-16 h-16 text-rose-500/40 group-hover:rotate-180 transition-all duration-1000" />
                            <p className="text-6xl font-mono font-black text-white mt-4 tracking-tighter">{sidLoad}%</p>
                            <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Viral SID Load</p>
                            <div className="absolute inset-[-15px] border-4 border-rose-500/30 rounded-full animate-ping opacity-20"></div>
                         </div>
                         <p className="text-slate-400 text-sm italic font-medium text-center max-w-[220px]">
                           "Detecting sociological friction and pathogenic beliefs in the node grid."
                         </p>
                      </div>

                      <button 
                        onClick={runSIDRemediation}
                        disabled={remediationStep === 'scanning'}
                        className="w-full py-8 agro-gradient-rose rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center justify-center gap-4"
                      >
                         {remediationStep === 'scanning' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {remediationStep === 'scanning' ? 'PURGING PATHOGENS...' : 'INITIALIZE REMEDIATION'}
                      </button>
                   </div>
                   
                   <div className="p-8 glass-card rounded-[40px] bg-indigo-600/5 border-indigo-500/20 space-y-4">
                      <div className="flex items-center gap-3">
                         <Info className="w-4 h-4 text-indigo-400" />
                         <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Social Influenza Disease</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase italic">
                         SID behaves as a complex adaptive system: it mutations across generations and weakens societal immunity (x) multipliers.
                      </p>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-10">
                   {/* PATHOGENIC FACTOR STIMULATOR */}
                   <div className="glass-card p-12 rounded-[64px] border-white/5 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-rose-500/[0.01] pointer-events-none"></div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 relative z-10">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 shadow-xl group-hover:scale-110 transition-transform">
                               <Dna className="w-10 h-10 text-rose-500" />
                            </div>
                            <div>
                               <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter m-0">Pathogenic <span className="text-rose-500">Factor Stimulation</span></h3>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3">Model Factors Leading to Social Shard Immutability</p>
                            </div>
                         </div>
                         <div className="p-6 bg-rose-600/5 border border-rose-500/20 rounded-[32px] text-center min-w-[200px] shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-rose-500 animate-pulse opacity-10" style={{ opacity: (immutabilityIndex / 200) }}></div>
                            <p className="text-[9px] text-rose-400 font-black uppercase mb-1 tracking-widest">Immutability Depth</p>
                            <p className={`text-5xl font-mono font-black ${immutabilityIndex > 60 ? 'text-rose-500' : 'text-amber-500'}`}>{immutabilityIndex.toFixed(1)}%</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                         <div className="space-y-10">
                            <div className="space-y-6">
                               <div className="flex justify-between items-center px-4">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14} className="text-rose-500" /> Intergenerational Transmission</label>
                                  <span className="text-xl font-mono font-black text-white">{transmissionIndex}%</span>
                               </div>
                               <input type="range" min="0" max="100" value={transmissionIndex} onChange={e => setTransmissionIndex(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-600" />
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center px-4">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-amber-500" /> Ideological Overcrowding</label>
                                  <span className="text-xl font-mono font-black text-white">{overcrowdingIndex}%</span>
                               </div>
                               <input type="range" min="0" max="100" value={overcrowdingIndex} onChange={e => setOvercrowdingIndex(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-600" />
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center px-4">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Languages size={14} className="text-blue-500" /> Language Volatility</label>
                                  <span className="text-xl font-mono font-black text-white">{languageVolatility}%</span>
                               </div>
                               <input type="range" min="0" max="100" value={languageVolatility} onChange={e => setLanguageVolatility(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" />
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center px-4">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14} className="text-indigo-400" /> Social Stress Factors</label>
                                  <span className="text-xl font-mono font-black text-white">{socialStress}%</span>
                               </div>
                               <input type="range" min="0" max="100" value={socialStress} onChange={e => setSocialStress(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                            </div>
                            
                            <button 
                              onClick={handleStimulateFactors}
                              disabled={isSimulatingPathogens}
                              className="w-full py-8 agro-gradient-rose rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                            >
                               {isSimulatingPathogens ? <Loader2 className="w-6 h-6 animate-spin" /> : <Waves className="w-6 h-6" />}
                               {isSimulatingPathogens ? 'STIMULATING SOCIAL ARCHIVE...' : 'INITIALIZE FACTOR STIMULATION'}
                            </button>
                         </div>

                         <div className="flex flex-col gap-8 h-full">
                            <div className="flex-1 p-8 bg-black rounded-[48px] border border-white/5 relative overflow-hidden group shadow-inner">
                               <div className="absolute inset-0 pointer-events-none opacity-20">
                                  <div 
                                    className="absolute inset-0 bg-gradient-to-tr from-rose-600/20 via-transparent to-rose-600/20 animate-pulse"
                                    style={{ animationDuration: `${Math.max(1, 10 - immutabilityIndex/10)}s` }}
                                  ></div>
                               </div>
                               <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                                  <SearchCode size={20} className="text-rose-500" />
                                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Immutability Risk Shard</h4>
                               </div>
                               <div className="prose prose-invert max-w-none text-slate-400 text-xs md:text-sm leading-relaxed italic custom-scrollbar overflow-y-auto max-h-[300px] pr-4">
                                  {isSimulatingPathogens ? (
                                     <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                        <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
                                        <p className="text-rose-700 font-bold uppercase tracking-[0.3em] animate-pulse">Handshaking with Oracle...</p>
                                     </div>
                                  ) : simulationReport ? (
                                     <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 whitespace-pre-line">
                                        {simulationReport}
                                     </div>
                                  ) : (
                                     <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center space-y-6">
                                        <Radiation size={48} className="text-white" />
                                        <p className="uppercase tracking-widest font-black text-white">Adjust factors to reveal immutability interpretation.</p>
                                     </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="glass-card p-12 rounded-[64px] border-white/5 bg-black/40 space-y-10 shadow-3xl">
                      <div className="flex justify-between items-center px-4 relative z-10">
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
                            <Users2 className="w-8 h-8 text-rose-500" /> Pathogen <span className="text-rose-500">Registry Shards</span>
                         </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 relative z-10">
                         {SID_PATHOGENS.map(path => (
                           <div key={path.id} className="p-8 glass-card border border-white/5 rounded-[44px] bg-white/[0.01] hover:bg-white/[0.03] transition-all group flex flex-col justify-between shadow-xl">
                              <div className="space-y-4">
                                 <div className="flex justify-between items-start">
                                    <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[8px] font-black uppercase rounded border border-rose-500/20">{path.status}</span>
                                    <span className="text-[10px] font-mono text-slate-700 uppercase font-black">{path.id}</span>
                                 </div>
                                 <h5 className="text-xl font-black text-white uppercase italic group-hover:text-rose-500 transition-colors leading-tight">{path.name}</h5>
                                 <p className="text-[10px] text-slate-500 italic line-clamp-3">"{path.desc}"</p>
                                 <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 pt-2">
                                    <span>Infection Load</span>
                                    <span className="text-rose-400">{path.load}%</span>
                                 </div>
                                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-600 animate-pulse" style={{ width: `${path.load}%` }}></div>
                                 </div>
                              </div>
                              <button className="w-full mt-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-rose-600 group-hover:text-white transition-all">Audit Shard</button>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

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
                   <div className="relative w-80 h-80 flex items-center justify-center">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                      <div className="w-48 h-48 rounded-full border-4 border-emerald-500/40 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.4)] relative group">
                         <Sprout className="w-20 h-20 text-emerald-500 group-hover:scale-110 transition-transform" />
                         <div className="absolute inset-[-20px] border-2 border-dashed border-emerald-500/20 rounded-full animate-spin-slow"></div>
                      </div>
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
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                       <LineChart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">EOS <span className="text-blue-400">Simulator</span></h3>
                       <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Model Agricultural Outcomes</p>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Annual Rainfall (mm)</label>
                          <span className="text-xl font-mono font-black text-white">{simRainfall}</span>
                       </div>
                       <input 
                         type="range" min="0" max="2500" value={simRainfall} 
                         onChange={e => setSimRainfall(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Soil Purity Shard (%)</label>
                          <span className="text-xl font-mono font-black text-white">{simSoil}%</span>
                       </div>
                       <input 
                         type="range" min="0" max="100" value={simSoil} 
                         onChange={e => setSimSoil(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
                       />
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Practice Shard Lvl (1-10)</label>
                          <span className="text-xl font-mono font-black text-white">Lvl {simPractice}</span>
                       </div>
                       <input 
                         type="range" min="1" max="10" value={simPractice} 
                         onChange={e => setSimPractice(Number(e.target.value))}
                         className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500"
                       />
                    </div>
                 </div>

                 <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[32px] flex items-center gap-6">
                    <Info className="w-6 h-6 text-blue-400 shrink-0" />
                    <p className="text-[10px] text-blue-200/50 font-black uppercase italic leading-relaxed">
                       Simulations use the m™ Time Signature logic to calculate potential EAC yield per crop cycle.
                    </p>
                 </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/60 flex flex-col items-center justify-center text-center space-y-4 group">
                       <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                          <Binary className="w-8 h-8 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Predicted C(a)</p>
                          <p className="text-6xl font-mono font-black text-white">{simResult.ca.toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/60 flex flex-col items-center justify-center text-center space-y-4 group">
                       <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                          <Gauge className="w-8 h-8 text-blue-400" />
                       </div>
                       <div>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Predicted m-Resilience</p>
                          <p className="text-6xl font-mono font-black text-white">{simResult.m.toFixed(1)}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center justify-center text-center group shadow-3xl">
                    <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                    <div className="relative z-10 space-y-4">
                       <p className="text-xl font-black text-emerald-400 uppercase tracking-[0.5em] italic">Projected Sustainability Shard</p>
                       <h4 className="text-9xl font-black text-white tracking-tighter drop-shadow-2xl">{simResult.score.toFixed(1)}%</h4>
                       <div className="pt-8">
                          <button className="px-16 py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                             COMMIT SIMULATION TO SHARD
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 3. ENVIROSAGRO AI (ORACLE) */}
        {activeTab === 'eos_ai' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-10 duration-700">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform"><Bot size={300} className="text-emerald-400" /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                          <Bot className="w-8 h-8 text-white" />
                       </div>
                       <h4 className="text-3xl font-black text-white uppercase italic m-0">EOS <span className="text-emerald-400">Oracle</span></h4>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Consultation Query</label>
                          <textarea 
                            value={aiQuery}
                            onChange={e => setAiQuery(e.target.value)}
                            placeholder="Inquire with the EOS Oracle node..."
                            className="w-full bg-black border border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-40 resize-none placeholder:text-slate-900 shadow-inner"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Data Shard Attachment (Image/Doc)</label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-10 border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center cursor-pointer group ${selectedFile ? 'bg-emerald-600/10 border-emerald-500' : 'bg-black border-white/10 hover:border-emerald-500/40'}`}
                          >
                             <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf" />
                             {filePreview ? (
                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                   <img src={filePreview} className="w-full h-full object-cover" alt="Preview" />
                                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <RefreshCw className="w-8 h-8 text-white animate-spin-slow" />
                                   </div>
                                </div>
                             ) : (
                                <>
                                  <FileUp className="w-10 h-10 text-slate-800 group-hover:text-emerald-500 transition-all mb-4" />
                                  <p className="text-xs font-black uppercase text-slate-700 group-hover:text-emerald-400">Upload Reference Shard</p>
                                </>
                             )}
                          </div>
                          {selectedFile && (
                            <button onClick={removeFile} className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-2 hover:text-rose-400 flex items-center gap-1"><Trash2 size={12}/> Discard Shard</button>
                          )}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-6 relative z-10">
                       <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-3">
                             <Coins className="w-5 h-5 text-emerald-400" />
                             <span className="text-sm font-black text-white uppercase">Sync Cost</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-emerald-400">{ORACLE_QUERY_COST} EAC</span>
                       </div>
                       <button 
                        onClick={handleDeepAIQuery}
                        disabled={aiThinking || (!aiQuery.trim() && !fileBase64)}
                        className={`w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 transition-all ${paymentStatus === 'authorizing' ? 'opacity-50' : ''}`}
                       >
                          {aiThinking ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                          {aiThinking ? 'SYTHESIZING...' : paymentStatus === 'authorizing' ? 'AUTHORIZING EAC...' : 'INITIALIZE ORACLE SYNAPSE'}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[600px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                          <Terminal className="w-6 h-6 text-emerald-400" />
                          <span className="text-sm font-black text-white uppercase tracking-widest">Oracle Response Stream</span>
                       </div>
                       {aiResult && (
                          <button onClick={() => setAiResult(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>
                       )}
                    </div>
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10">
                       {!aiResult && !aiThinking ? (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                            <div className="relative">
                               <Monitor size={120} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                               <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                            </div>
                            <div className="space-y-2">
                               <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">ORACLE STANDBY</p>
                               <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Awaiting Industrial Payload</p>
                            </div>
                         </div>
                       ) : aiThinking ? (
                         <div className="h-full flex flex-col items-center justify-center space-y-12">
                            <div className="relative">
                               <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <BrainCircuit className="w-10 h-10 text-emerald-400 animate-pulse" />
                               </div>
                            </div>
                            <div className="space-y-4 text-center">
                               <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Processing Neural Shards...</p>
                               <div className="flex justify-center gap-1.5">
                                 {[...Array(6)].map((_, i) => <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                               </div>
                            </div>
                         </div>
                       ) : (
                         <div className="animate-in slide-in-from-bottom-6 duration-700">
                            <div className="p-10 md:p-16 bg-black/60 rounded-[48px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-l-emerald-500/40 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none"><Database size={400} className="text-white" /></div>
                               <div className="text-slate-300 text-xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10">
                                  {aiResult.text}
                               </div>
                               <div className="mt-12 flex justify-end relative z-10">
                                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center px-8 flex items-center gap-3">
                                     <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VERIFIED_EOS_CONSENSUS</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                       )}
                    </div>
                    {/* Bottom watermark decoration */}
                    <div className="p-10 flex justify-between items-center opacity-30 mt-auto border-t border-white/5 relative z-10 grayscale">
                       <div className="flex items-center gap-3">
                          <Fingerprint size={24} className="text-slate-400" />
                          <span className="text-[11px] font-mono uppercase font-black text-slate-500 tracking-widest">Shard Registry: 0x882_AI_SYNC</span>
                       </div>
                       <Sparkles size={32} className="text-emerald-400" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 5. EVIDENCE PORTAL */}
        {activeTab === 'evidence' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8 px-4">
                 <div>
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Evidence <span className="text-emerald-400">Portal</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic mt-2">"Secure evidence sharding is the bridge between physical actions and ledger rewards."</p>
                 </div>
                 <button 
                  onClick={() => setShowIngestModal(true)}
                  className="px-12 py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                 >
                    <Upload className="w-6 h-6" /> Ingest Field Evidence
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {evidenceList.map(item => (
                    <div key={item.id} className="p-10 glass-card rounded-[56px] border border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col bg-black/40 shadow-2xl relative overflow-hidden active:scale-[0.98]">
                       <div className="flex justify-between items-start mb-10">
                          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                             <FileCheck size={28} className="text-emerald-400" />
                          </div>
                          <div className="text-right">
                             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border tracking-widest ${
                               item.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                             }`}>{item.status}</span>
                             <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-tighter italic">{item.id}</p>
                          </div>
                       </div>
                       <h4 className="text-2xl font-black text-white uppercase italic leading-tight mb-4 group-hover:text-emerald-400 transition-colors m-0">{item.type} Shard</h4>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10">COMMITTED BY: {item.node}</p>
                       <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600">
                             <History size={14} className="text-emerald-400" />
                             <span>SYNCED {item.date.toUpperCase()}</span>
                          </div>
                          <button className="p-3 bg-white/5 rounded-xl text-slate-700 hover:text-white transition-all shadow-xl active:scale-90 border border-white/5"><History size={16} /></button>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-16 glass-card rounded-[64px] border-emerald-500/20 bg-emerald-600/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none"><ShieldCheck size={400} /></div>
                 <div className="flex items-center gap-10 relative z-10">
                    <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-2 border-white/10 shrink-0">
                       <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Zero-Knowledge Evidence</h4>
                       <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md mx-auto md:mx-0">Every upload is cryptographically masked to ensure data privacy while proving physical integrity to the network.</p>
                    </div>
                 </div>
                 <div className="text-center md:text-right relative z-10 shrink-0">
                    <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">TOTAL_DEPOSITED</p>
                    <p className="text-7xl font-mono font-black text-white tracking-tighter">842</p>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- INGEST MODAL --- */}
      {showIngestModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={resetIngest}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-12 md:p-16 space-y-12 min-h-[650px] flex flex-col justify-center">
                 <button onClick={resetIngest} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 {ingestStep === 'upload' && (
                    <div className="space-y-10 text-center animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                          <CloudUpload className="w-12 h-12 text-emerald-400" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Evidence <span className="text-emerald-400">Ingest</span></h3>
                          <p className="text-slate-400 text-lg italic leading-relaxed">Initialize field evidence sharding for registry validation.</p>
                       </div>
                       
                       <div className="space-y-8">
                          <div className="space-y-3 px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">Evidence Category</label>
                             <select value={ingestType} onChange={e => setIngestType(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20">
                                <option>Soil Analysis</option>
                                <option>Drone Multi-Spectral</option>
                                <option>Water Purity Test</option>
                                <option>Plant Health Photo</option>
                             </select>
                          </div>
                          
                          <div 
                             onClick={() => ingestInputRef.current?.click()}
                             className={`p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center cursor-pointer group ${ingestPreview ? 'bg-emerald-600/10 border-emerald-500' : 'bg-black/40 border-white/10 hover:border-emerald-500/40'}`}
                          >
                             <input type="file" ref={ingestInputRef} onChange={handleIngestFileSelect} className="hidden" accept="image/*,application/pdf" />
                             {ingestPreview ? (
                                <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group">
                                   <img src={ingestPreview} className="w-full h-full object-cover" alt="Preview" />
                                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <CheckCircle2 size={48} className="text-emerald-400" />
                                   </div>
                                </div>
                             ) : (
                                <>
                                  <ImageIcon className="w-14 h-14 text-slate-800 group-hover:text-emerald-500 transition-all mb-4" />
                                  <p className="text-xs font-black uppercase text-slate-700 group-hover:text-emerald-400 tracking-widest">Select Shard Shard</p>
                                </>
                             )}
                          </div>
                       </div>
                       
                       <button 
                        onClick={handleRunIngestAudit}
                        disabled={!ingestBase64}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                       >
                          COMMENCE DATA INGEST
                       </button>
                    </div>
                 )}

                 {ingestStep === 'audit' && (
                    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500">
                       <div className="relative">
                          <div className="absolute inset-[-20px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                             <SearchCode className="w-20 h-20 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4 text-center">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Auditing Shard Integrity...</p>
                          <p className="text-slate-600 font-mono text-[10px]">VERIFYING_ZK_PROOF // SYNCING_REGISTRY</p>
                       </div>
                    </div>
                 )}

                 {ingestStep === 'success' && (
                    <div className="space-y-10 animate-in zoom-in duration-700">
                       <div className="p-10 glass-card rounded-[48px] bg-black/60 border-l-8 border-emerald-500 shadow-3xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><FileCheck size={120} className="text-white" /></div>
                          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/5 relative z-10">
                             <Sparkles className="w-6 h-6 text-emerald-400" />
                             <h4 className="text-xl font-black text-white uppercase italic">Audit Verdict</h4>
                          </div>
                          <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line border-l-2 border-white/5 pl-8 font-medium relative z-10">
                             {ingestReport}
                          </div>
                       </div>
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center justify-between shadow-inner">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <ShieldCheck size={24} />
                             </div>
                             <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase">Registry Status</p>
                                <p className="text-2xl font-mono font-black text-emerald-400 uppercase italic">SHARD_VERIFIED</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] text-slate-700 font-mono font-black uppercase mb-1">Audit Hash</p>
                             <span className="text-xs font-mono text-slate-500">0x882_OK_SYNC</span>
                          </div>
                       </div>
                       <button onClick={resetIngest} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Finalize Ingest</button>
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
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
      `}</style>
    </div>
  );
};

export default Intelligence;
