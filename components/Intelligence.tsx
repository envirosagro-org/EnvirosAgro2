
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Monitor, Cpu, Activity, Zap, ShieldCheck, Binary, Layers, Microscope, FlaskConical, Scan, 
  AlertCircle, TrendingUp, Droplets, Wind, Sprout, Bot, Key, Lock, Database, Upload, 
  MapPin, X, Loader2, Sparkles, Gauge, Thermometer, Fingerprint, SearchCode, History, 
  FileCheck, Trash2, ChevronRight, LineChart, BarChart4, HeartPulse, Radar, 
  CheckCircle2, Info, ArrowUpRight, PlusCircle, BrainCircuit, 
  Terminal, Command, MessageSquareShare, Atom, ImageIcon, FileUp, FileSearch, 
  Paperclip, Coins, CreditCard, Wallet, ShieldAlert, Flame, CloudUpload, 
  ClipboardCheck, Dna, Workflow, ShieldX, Target, Users2, Radiation, Waves, 
  ZapOff, RefreshCw, EyeOff, Timer, Languages, School, Heart, MessageSquare, 
  AlertTriangle, Play, RotateCcw, Mountain, FileDown, Scale, Stamp, Satellite, 
  Wifi, Radio, Unlink, SmartphoneNfc, BoxSelect, Boxes, Maximize2, Smartphone, Send,
  Brain, Network, FileDigit,
  Settings, Download, Globe, Camera,
  Box, Database as Disk, ShieldCheck as VerifiedIcon,
  Globe2, ExternalLink,
  ScanLine,
  BadgeCheck,
  LayoutGrid,
  ClipboardList,
  Waves as WaveIcon,
  HardDrive
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar } from 'recharts';
import { chatWithAgroExpert, AIResponse, searchAgroTrends, runSimulationAnalysis, analyzeMedia } from '../services/geminiService';
import { User, AgroResource, ViewState, MediaShard } from '../types';
import { backupTelemetryShard, fetchTelemetryBackup, saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from '../App';

interface IntelligenceProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onOpenEvidence?: () => void;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
}

type TabState = 'hub' | 'twin' | 'simulator' | 'sid' | 'evidence' | 'eos_ai' | 'telemetry' | 'trends';
type OracleMode = 'BIO_DIAGNOSTIC' | 'SPECTRAL_AUDIT' | 'GENOMIC_INQUIRY' | 'SOIL_REMEDIATION';

const ORACLE_QUERY_COST = 25;
const SID_SCAN_COST = 40;

const NEURAL_STEPS = [
  "Inflow Detected. Buffering Shard...",
  "Analyzing Spectral Pigments...",
  "Querying Biological Knowledge Shards...",
  "Sequencing Multi-Thrust Neurals...",
  "Identifying Anomaly Vectors...",
  "Synthesizing Diagnostic Verdict..."
];

const SID_STEPS = [
  "Initializing Particle Filter...",
  "Calibrating Bio-Aura Shards...",
  "Detecting Dissonant Frequencies...",
  "Mapping Viral Footprint...",
  "Calculating SID Saturation..."
];

const Intelligence: React.FC<IntelligenceProps> = ({ user, onEarnEAC, onSpendEAC, onOpenEvidence, onNavigate, initialSection }) => {
  const [activeTab, setActiveTab] = useState<TabState>(initialSection as TabState || 'hub');
  
  // Vector Routing Logic
  useEffect(() => {
    if (initialSection && initialSection !== activeTab) {
      setActiveTab(initialSection as TabState);
    }
  }, [initialSection]);

  // General Archiving Logic
  const [archivedShards, setArchivedShards] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  const anchorToLedger = async (content: string, type: string, mode: string) => {
    const shardKey = `${type}_${mode}_${content.substring(0, 20)}`;
    if (archivedShards.has(shardKey)) return;
    
    setIsArchiving(shardKey);
    try {
      const shardHash = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
      const newShard: Partial<MediaShard> = {
        title: `${type.toUpperCase()}: ${mode.replace('_', ' ')}`,
        type: 'ORACLE',
        source: 'Science Oracle',
        author: user.name,
        authorEsin: user.esin,
        timestamp: new Date().toISOString(),
        hash: shardHash,
        mImpact: (1.42 + Math.random() * 0.1).toFixed(2),
        size: `${(content.length / 1024).toFixed(1)} KB`,
        content: content
      };
      
      await saveCollectionItem('media_ledger', newShard);
      setArchivedShards(prev => new Set(prev).add(shardKey));
      onEarnEAC(20, `LEDGER_ANCHOR_${type.toUpperCase()}_SUCCESS`);
    } catch (e) {
      alert("LEDGER_FAILURE: Verification node timeout.");
    } finally {
      setIsArchiving(null);
    }
  };

  // --- IOT TELEMETRY STATES ---
  const hardwareNodes = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'HARDWARE'),
    [user.resources]
  );
  const [selectedIotNode, setSelectedIotNode] = useState<AgroResource | null>(hardwareNodes[0] || null);
  const [telemetryLogs, setTelemetryLogs] = useState<{timestamp: string, metric: string, value: string}[]>([]);

  useEffect(() => {
    const restore = async () => {
      if (telemetryLogs.length === 0 && user) {
        const backup = await fetchTelemetryBackup(user.esin);
        if (backup?.logs) setTelemetryLogs(backup.logs);
      }
    };
    restore();
  }, [user, telemetryLogs.length]);

  useEffect(() => {
    if (activeTab === 'telemetry' || activeTab === 'hub' || activeTab === 'twin') {
      const interval = setInterval(() => {
        const metrics = ['Temperature', 'Soil Purity', 'm-Constant Drift', 'Photosynthetic Flux'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * 100).toFixed(2);
        const newLog = { timestamp: new Date().toLocaleTimeString(), metric, value };
        setTelemetryLogs(prev => {
           const updated = [newLog, ...prev].slice(0, 8);
           if (user && selectedIotNode) backupTelemetryShard(user.esin, { logs: updated, node: selectedIotNode.id });
           return updated;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedIotNode, user]);

  // --- DIGITAL TWIN ---
  const [isTwinSyncing, setIsTwinSyncing] = useState(false);
  const [twinResonance, setTwinResonance] = useState(94.2);
  const [activeModel, setActiveModel] = useState<'soil' | 'crop' | 'energy'>('soil');

  const handleTwinRefresh = () => {
    setIsTwinSyncing(true);
    setTimeout(() => {
      setTwinResonance(94 + Math.random() * 5);
      setIsTwinSyncing(false);
      onEarnEAC(5, 'TWIN_MODEL_CALIBRATION');
    }, 2000);
  };

  // --- SIMULATOR ---
  const [x_immunity, setXImmunity] = useState(0.85); 
  const [r_resonance, setRResonance] = useState(1.12);
  const [n_cycles, setNCycles] = useState(12);
  const [dn_density, setDnDensity] = useState(0.92);
  const [in_intensity, setInIntensity] = useState(0.78);
  const [s_stress, setSStress] = useState(0.12);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  const calculateCa = (n: number) => r_resonance === 1 ? x_immunity * n + 1 : x_immunity * ((Math.pow(r_resonance, n) - 1) / (r_resonance - 1)) + 1;
  const calculateM = (ca: number) => Math.sqrt((dn_density * in_intensity * ca) / Math.max(s_stress, 0.01));

  const simProjectionData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= n_cycles; i++) {
      const ca = calculateCa(i);
      const m = calculateM(ca);
      data.push({ cycle: i, ca: Number(ca.toFixed(2)), m: Number(m.toFixed(2)), score: Math.min(100, (m * 10)) });
    }
    return data;
  }, [x_immunity, r_resonance, n_cycles, dn_density, in_intensity, s_stress]);

  const handleRunFullSimulation = async () => {
    if (!await onSpendEAC(50, 'FULL_SUSTAINABILITY_SIMULATION_INGEST')) return;
    setIsRunningSimulation(true);
    setSimulationReport(null);
    try {
      const simData = {
        ca: simProjectionData[n_cycles].ca,
        m: simProjectionData[n_cycles].m,
        immunity: x_immunity,
        stress: s_stress,
        cycles: n_cycles
      };
      const res = await runSimulationAnalysis(simData);
      setSimulationReport(res.text);
    } catch (e) {
      setSimulationReport("SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion.");
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // --- SID SCANNER ---
  const [isSidScanning, setIsSidScanning] = useState(false);
  const [sidResult, setSidResult] = useState<AIResponse | null>(null);
  const [sidTargetNode, setSidTargetNode] = useState<AgroResource | null>(user.resources?.[0] || null);
  const [sidStepIndex, setSidStepIndex] = useState(0);
  const [sidStressFactor, setSidStressFactor] = useState(0.12);

  const handleRunSidScan = async () => {
    if (isSidScanning) return;
    if (!await onSpendEAC(SID_SCAN_COST, 'SID_VIRAL_LOAD_SCAN')) return;

    setIsSidScanning(true);
    setSidResult(null);
    setSidStepIndex(0);

    const stepInterval = setInterval(() => {
      setSidStepIndex(prev => (prev < SID_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const prompt = `Act as an EnvirosAgro Bio-Security Auditor. Perform a SID (Social/Systemic Integrated Deficit) Scan for:
      Target Node: ${sidTargetNode?.name || 'GENERIC'} (${sidTargetNode?.id || 'EXT'})
      Environmental Stress (S): ${sidStressFactor}
      m-Constant Baseline: ${user.metrics.timeConstantTau}
      
      Identify viral loads in the bio-signal (dissonance) and provide a technical remediation shard. 
      Calculate a SID Saturation Index (0.0 to 1.0). Format as a technical report.`;
      
      const response = await chatWithAgroExpert(prompt, []);
      setSidResult(response);
      onEarnEAC(20, 'SID_DIAGNOSTIC_INGEST_OK');
    } catch (e) {
      setSidResult({ text: "SYSTEM_ERROR: SID buffer parity failed. Oracle link severed." });
    } finally {
      clearInterval(stepInterval);
      setIsSidScanning(false);
    }
  };

  // --- SCIENCE ORACLE (EOS AI) MULTIMODAL ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [oracleMode, setOracleMode] = useState<OracleMode>('BIO_DIAGNOSTIC');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // File Ingest
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>('image/jpeg');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const oracleFileInputRef = useRef<HTMLInputElement>(null);

  const handleOracleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedFile(base64String);
        setFileMime(file.type);
        setFileBase64(base64String.split(',')[1]);
        setAiResult(null); 
        onEarnEAC(5, 'ORACLE_DATA_BUFFERED');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearOracleBuffer = () => {
    setUploadedFile(null);
    setFileBase64(null);
    setAiResult(null);
    if (oracleFileInputRef.current) oracleFileInputRef.current.value = '';
  };

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() || aiThinking) return;
    if (!uploadedFile) {
        alert("INGEST_REQUIRED: The Science Oracle requires agricultural data (images/docs) to perform a diagnostic audit.");
        return;
    }
    
    if (!await onSpendEAC(ORACLE_QUERY_COST, "ORACLE_DIAGNOSTIC_INQUIRY")) return;
    
    setAiThinking(true);
    setAiResult(null);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < NEURAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 1000);

    try {
      const technicalPrompt = `Act as the EnvirosAgro Science Oracle. 
      MODE: ${oracleMode}
      USER QUERY: "${aiQuery}"
      
      STEPS:
      1. Identify exactly what is being shown in the uploaded data shard.
      2. If it is a disease or anomaly, provide a scientific identification.
      3. Map this to the EnvirosAgro Sustainability Framework (EOS).
      4. Provide a 4-stage technical remediation shard.`;

      const responseText = await analyzeMedia(fileBase64!, fileMime, technicalPrompt);
      setAiResult({ text: responseText });
      onEarnEAC(10, "ORACLE_DIAGNOSTIC_FINALIZED");
    } catch (e) {
      setAiResult({ text: "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion." });
    } finally {
      clearInterval(stepInterval);
      setAiThinking(false);
    }
  };

  // --- TREND INGEST ---
  const [isIngestingTrends, setIsIngestingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<AIResponse | null>(null);

  const handleIngestTrends = async () => {
    setIsIngestingTrends(true);
    setTrendsResult(null);
    try {
      const query = "latest innovations in regenerative farming practices and blockchain integration for carbon credit tracking 2025";
      const res = await searchAgroTrends(query);
      setTrendsResult(res);
      onEarnEAC(10, "GLOBAL_TREND_INGEST_OK");
    } catch (e) {
      setTrendsResult({ text: "SYSTEM_ERROR: Oracle link interrupted. Shard integrity could not be verified due to internal congestion." });
    } finally {
      setIsIngestingTrends(false);
    }
  };

  // --- EVIDENCE VAULT LOGIC ---
  const [isSyncingEvidence, setIsSyncingEvidence] = useState(false);
  const [evidenceLedger, setEvidenceLedger] = useState([
    { id: 'EV-882-A', type: 'Spectral Shard', node: 'Node_Paris_04', date: '2d ago', status: 'VERIFIED', col: 'text-emerald-400' },
    { id: 'EV-104-B', type: 'Biometric Log', node: 'Stwd_Nairobi', date: '5h ago', status: 'AUDITING', col: 'text-blue-400' },
    { id: 'EV-042-C', type: 'IoT Telemetry', node: 'Global_Alpha', date: '1d ago', status: 'VERIFIED', col: 'text-indigo-400' },
  ]);

  const handleEvidenceSync = () => {
    setIsSyncingEvidence(true);
    setTimeout(() => {
      setIsSyncingEvidence(false);
      onEarnEAC(5, 'VAULT_LEDGER_SYNCHRONIZED');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto px-4">
      
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Microscope className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
              <Cpu className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-4 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">EOS_SCIENCE_ORACLE_V6</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Science <span className="text-emerald-400">& Intelligence</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Executing technical sharding and biological simulation protocols for node {user.esin}."
              </p>
           </div>
        </div>
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 relative z-10">Node Ingest Status</p>
           <h4 className="text-6xl font-mono font-black text-white tracking-tighter relative z-10 leading-none">99<span className="text-xl text-emerald-500 italic">.9</span></h4>
           <div className="flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase relative z-10 tracking-widest border border-emerald-500/20 bg-emerald-500/5 py-2 px-4 rounded-full shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div> ACTIVE_SYNC
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit border border-white/5 bg-black/40 shadow-xl mx-auto lg:mx-0">
        {[
          { id: 'hub', name: 'Master Hub', icon: LayoutGrid },
          { id: 'twin', name: 'Digital Twin', icon: Box },
          { id: 'simulator', name: 'EOS Simulator', icon: Cpu },
          { id: 'trends', name: 'Trend Ingest', icon: TrendingUp },
          { id: 'telemetry', name: 'IoT Telemetry', icon: Wifi },
          { id: 'eos_ai', name: 'Science Oracle', icon: Bot },
          { id: 'sid', name: 'SID Scanner', icon: Radiation },
          { id: 'evidence', name: 'Evidence Vault', icon: CloudUpload },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <t.icon className="w-4 h-4" /> {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">

        {/* --- VIEW: MASTER HUB (Consolidated View) --- */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
             {/* SIMULATOR MINI SHARD */}
             <div onClick={() => setActiveTab('simulator')} className="glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col h-[480px] justify-between shadow-xl">
                <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><Cpu size={32} /></div>
                   <span className="text-[10px] font-black text-slate-700 uppercase">Physics Engine</span>
                </div>
                <div className="space-y-4">
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">EOS Simulator</h4>
                   <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={simProjectionData.slice(-10)}>
                            <Area type="monotone" dataKey="score" stroke="#10b981" fill="#10b98110" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <span className="text-[9px] font-black text-emerald-400">SYNC_NOMINAL</span>
                   <ChevronRight size={20} className="text-slate-800" />
                </div>
             </div>

             {/* SID SCANNER MINI SHARD */}
             <div onClick={() => setActiveTab('sid')} className="glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 hover:border-rose-500/30 transition-all group flex flex-col h-[480px] justify-between shadow-xl">
                <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:rotate-12 transition-transform"><Radiation size={32} /></div>
                   <span className="text-[10px] font-black text-slate-700 uppercase">Bio-Security</span>
                </div>
                <div className="space-y-4 text-center">
                   <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">SID Scanner</h4>
                   <p className="text-4xl font-mono font-black text-rose-500">0.42<span className="text-lg italic ml-1">μ</span></p>
                   <p className="text-[9px] text-slate-500 uppercase tracking-widest">Viral Load Constant</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <span className="text-[9px] font-black text-rose-400 italic">DETECTING_ANOMALIES...</span>
                   <ChevronRight size={20} className="text-slate-800" />
                </div>
             </div>

             {/* TELEMETRY MINI SHARD */}
             <div onClick={() => setActiveTab('telemetry')} className="glass-card p-10 rounded-[64px] border border-white/5 bg-black/40 hover:border-blue-500/30 transition-all group flex flex-col h-[480px] justify-between shadow-xl">
                <div className="flex justify-between items-start">
                   <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform"><Wifi size={32} /></div>
                   <span className="text-[10px] font-black text-slate-700 uppercase">IoT Ingest</span>
                </div>
                <div className="space-y-4 font-mono text-[10px] text-slate-500 overflow-hidden">
                   {telemetryLogs.slice(0, 4).map((log, i) => (
                      <div key={i} className="flex justify-between border-b border-white/5 pb-2">
                         <span>[{log.metric}]</span>
                         <span className="text-white">{log.value}</span>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <span className="text-[9px] font-black text-blue-400 uppercase">Pipeline_Active</span>
                   <ChevronRight size={20} className="text-slate-800" />
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: DIGITAL TWIN --- */}
        {activeTab === 'twin' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
              <div className="lg:col-span-8 flex flex-col space-y-8">
                 <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black overflow-hidden relative group min-h-[550px] shadow-3xl flex flex-col items-center justify-center">
                    <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
                    
                    {isTwinSyncing ? (
                       <div className="flex flex-col items-center justify-center space-y-10 py-20 text-center animate-in zoom-in">
                          <div className="relative">
                             <div className="w-48 h-48 rounded-full border-t-4 border-emerald-500 animate-spin"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <RefreshCw size={48} className="text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">RECALIBRATING_TWIN...</p>
                       </div>
                    ) : (
                       <div className="relative z-10 w-full h-full flex flex-col items-center justify-center space-y-12 py-10">
                          {/* 3D-ish CSS Grid Visualization */}
                          <div className="relative w-full max-w-2xl aspect-video perspective-1000 perspective-origin-top group-hover:scale-105 transition-all duration-[3s]">
                             <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-[64px] bg-emerald-500/[0.02] shadow-[0_0_80px_rgba(16,185,129,0.1)] transform rotateX(60deg) translateZ(0)">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
                                   {[...Array(144)].map((_, i) => (
                                      <div key={i} className="border-[0.5px] border-emerald-500/10 transition-colors hover:bg-emerald-500/20"></div>
                                   ))}
                                </div>
                                {/* Shard Markers */}
                                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping delay-500"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600/40 rounded-full animate-pulse border-2 border-indigo-400"></div>
                             </div>
                             {/* Floating Elements */}
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-3xl animate-float">
                                <div className="flex items-center gap-4">
                                   <Activity className="text-emerald-400 animate-pulse" />
                                   <span className="text-xs font-mono font-black text-white uppercase italic">Twin_Stability: {twinResonance.toFixed(1)}%</span>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                             {[
                                { id: 'soil', l: 'Substrate', icon: Mountain, color: 'text-orange-500' },
                                { id: 'crop', l: 'Phyto-Resonance', icon: Sprout, color: 'text-emerald-400' },
                                { id: 'energy', l: 'Thermodynamics', icon: Zap, color: 'text-blue-400' },
                             ].map(m => (
                                <button 
                                   key={m.id}
                                   onClick={() => setActiveModel(m.id as any)}
                                   className={`p-6 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 group/btn ${activeModel === m.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-700 hover:border-white/10'}`}
                                >
                                   <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${m.color} group-hover/btn:rotate-12 transition-transform shadow-inner`}>
                                      <m.icon size={24} />
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-widest">{m.l}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="p-10 glass-card rounded-[64px] border border-emerald-500/10 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl group">
                    <div className="flex items-center gap-8 text-center md:text-left">
                       <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-3xl group-hover:rotate-6 transition-transform">
                          <History size={28} className="text-white" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-white uppercase italic">Calibration Shard</h4>
                          <p className="text-slate-500 text-sm font-medium italic leading-relaxed">Update the digital twin logic based on the latest regional m-constant drift.</p>
                       </div>
                    </div>
                    <button 
                      onClick={handleTwinRefresh}
                      disabled={isTwinSyncing}
                      className="px-10 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white/10"
                    >
                       {isTwinSyncing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                       CALIBRATE TWIN
                    </button>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group/stats">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/stats:scale-110 transition-transform duration-[10s]"><Activity size={200} /></div>
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                       <LineChart className="text-blue-400 w-6 h-6" />
                       <h3 className="text-lg font-black text-white uppercase italic tracking-widest">Model <span className="text-blue-400">Resonance</span></h3>
                    </div>
                    
                    <div className="space-y-8 relative z-10">
                       {[
                         { l: 'Fidelity', v: '0.998α', p: 98, c: 'bg-emerald-500' },
                         { l: 'Latency', v: '14ms', p: 88, c: 'bg-blue-500' },
                         { l: 'Compute Load', v: 'Low', p: 12, c: 'bg-indigo-500' },
                       ].map(s => (
                          <div key={s.l} className="space-y-3">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 px-2">
                                <span>{s.l}</span>
                                <span className="text-white font-mono">{s.v}</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div className={`h-full rounded-full transition-all duration-[2s] ${s.c} shadow-[0_0_10px_currentColor]`} style={{ width: `${s.p}%` }}></div>
                             </div>
                          </div>
                       ))}
                    </div>

                    <div className="p-6 bg-blue-600/5 rounded-[32px] border border-blue-500/20">
                       <p className="text-[10px] text-blue-300 italic leading-relaxed text-center font-medium uppercase tracking-tight">
                          "Predictive twin modeling reduces operational stress (S) by 18.4%."
                       </p>
                    </div>
                 </div>

                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-6 shadow-xl">
                    <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 italic">
                       <HardDrive size={14} className="text-indigo-400" /> Twin Artifacts
                    </h5>
                    <div className="space-y-3">
                       {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/20 transition-all cursor-pointer">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/5 text-slate-700 group-hover:text-indigo-400"><Database size={14} /></div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase italic">SHARD_REVISION_v{i}.0</span>
                             </div>
                             <Download size={14} className="text-slate-800 group-hover:text-white" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: SID SCANNER --- */}
        {activeTab === 'sid' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
              {/* Left Column: Scanner Parameters */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-rose-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-rose-500/[0.01] pointer-events-none"></div>
                    <div className="flex items-center gap-4 border-b border-white/5 pb-8 relative z-10">
                       <div className="p-4 bg-rose-600 rounded-3xl shadow-xl flex items-center justify-center text-white border-2 border-white/10 group-hover:rotate-6 transition-transform">
                          <Radiation size={32} className="animate-pulse" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">SID <span className="text-rose-500">Scanner</span></h3>
                          <p className="text-rose-400/60 text-[10px] font-mono tracking-widest uppercase mt-2">VIRAL_LOAD_PROTOCOL</p>
                       </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 italic">Target Ingest Shard</label>
                          <div className="grid grid-cols-1 gap-3">
                             {(user.resources || []).length > 0 ? (
                               user.resources?.map(res => (
                                 <button 
                                   key={res.id}
                                   onClick={() => setSidTargetNode(res)}
                                   className={`p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${sidTargetNode?.id === res.id ? 'bg-rose-600/10 border-rose-500 shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                                 >
                                    <div className="flex items-center gap-4">
                                       <div className={`p-2.5 rounded-xl transition-all ${sidTargetNode?.id === res.id ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-800'}`}>
                                          {res.category === 'LAND' ? <Sprout size={16} /> : <Cpu size={16} />}
                                       </div>
                                       <span className={`text-[11px] font-black uppercase tracking-widest ${sidTargetNode?.id === res.id ? 'text-white' : ''}`}>{res.name}</span>
                                    </div>
                                    <ChevronRight size={14} className={sidTargetNode?.id === res.id ? 'text-rose-500' : 'text-slate-900'} />
                                 </button>
                               ))
                             ) : (
                               <div className="p-8 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/5 opacity-40">
                                  <p className="text-[9px] font-black uppercase">No Active Nodes Found</p>
                               </div>
                             )}
                          </div>
                       </div>

                       <div className="space-y-4 group">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors italic">S (Stress) Constant</label>
                             <span className="text-xl font-mono font-black text-white group-hover:text-rose-500 transition-all">{sidStressFactor}</span>
                          </div>
                          <input 
                            type="range" min="0.01" max="1.0" step="0.01" value={sidStressFactor} 
                            onChange={e => setSidStressFactor(parseFloat(e.target.value))}
                            className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-600 shadow-inner group-hover:h-3 transition-all" 
                          />
                       </div>

                       <button 
                         onClick={handleRunSidScan}
                         disabled={isSidScanning || !sidTargetNode}
                         className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 border-2 border-white/10 ring-8 ring-rose-500/5 group/scan"
                       >
                          {isSidScanning ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <Scan className="w-8 h-8 mx-auto group-hover/scan:rotate-12 transition-transform" />}
                          <p className="mt-4">{isSidScanning ? 'ANALYZING VIRAL LOAD...' : 'INITIALIZE SID SCAN'}</p>
                       </button>
                    </div>
                 </div>
              </div>

              {/* Right Column: Diagnostic Output */}
              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[850px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
                       <div className="w-full h-[3px] bg-rose-500/40 absolute top-0 animate-scan"></div>
                    </div>
                    
                    <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20 px-14">
                       <div className="flex items-center gap-10">
                          <div className="w-16 h-16 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-xl relative overflow-hidden group/ico">
                             <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                             <Bot size={32} className="group-hover/ico:scale-110 transition-transform relative z-10" />
                          </div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Diagnostic <span className="text-rose-500">Verdict Shard</span></h3>
                             <p className="text-rose-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_VIRAL_SYNC // {sidTargetNode?.id || 'EXTERNAL_NODE'}</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20">
                       {!sidResult && !isSidScanning ? (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-20 group">
                             <div className="relative">
                                <Radiation size={180} className="text-slate-500 group-hover:text-rose-500 transition-colors duration-1000" />
                                <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                             </div>
                             <div className="space-y-4">
                                <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">SCANNER_IDLE</p>
                                <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Initialize a SID scan to map systemic deficits</p>
                             </div>
                          </div>
                       ) : isSidScanning ? (
                          <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <Loader2 size={120} className="text-rose-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Activity size={48} className="text-rose-400 animate-pulse" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                <p className="text-rose-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">
                                   {SID_STEPS[sidStepIndex]}
                                </p>
                             </div>
                          </div>
                       ) : (
                          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 pb-10">
                             <div className="p-12 md:p-16 bg-black/80 rounded-[80px] border-2 border-rose-500/20 prose prose-invert prose-rose max-w-none shadow-3xl border-l-[12px] border-l-rose-600 relative overflow-hidden group/shard">
                                <div className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-8 border-l border-white/10">
                                   {sidResult?.text}
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: EVIDENCE VAULT (High Fidelity Ingest) --- */}
        {activeTab === 'evidence' && (
           <div className="space-y-10 animate-in zoom-in duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 <div className="lg:col-span-1 space-y-8">
                    <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-2xl">
                       <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                          <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl text-white"><CloudUpload size={28} /></div>
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Vault <span className="text-emerald-400">Control</span></h3>
                       </div>
                       <div className="space-y-4">
                          <button onClick={handleEvidenceSync} disabled={isSyncingEvidence} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                             {isSyncingEvidence ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                             Sync Evidence Shards
                          </button>
                          <button onClick={onOpenEvidence} className="w-full py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest">New Field Proof</button>
                       </div>
                    </div>
                 </div>

                 <div className="lg:col-span-3 glass-card rounded-[64px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col relative min-h-[600px]">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <Database size={24} className="text-emerald-400" />
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest m-0">Biological Evidence Ledger</h4>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5 bg-[#050706]">
                       {evidenceLedger.map((ev, i) => (
                          <div key={i} className="p-10 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                             <div className="flex items-center gap-8">
                                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${ev.col} shadow-inner group-hover:scale-110 transition-transform`}><ImageIcon size={24} /></div>
                                <div>
                                   <h5 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight leading-none group-hover:text-emerald-400 transition-colors">{ev.type}</h5>
                                   <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black italic">{ev.id} // {ev.node}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-10">
                                <span className="text-[10px] font-mono text-slate-600 uppercase italic">{ev.date}</span>
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase border tracking-widest shadow-xl ${ev.status === 'VERIFIED' ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-600/10 text-blue-400 border-blue-500/20 animate-pulse'}`}>{ev.status}</span>
                                <button className="p-4 bg-white/5 rounded-2xl text-slate-700 hover:text-white transition-all active:scale-90"><ChevronRight size={20} /></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                   <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 shadow-xl"><Cpu size={24} /></div>
                   <h3 className="font-black text-white uppercase text-sm tracking-widest italic">EOS Physics Core</h3>
                </div>
                <div className="space-y-8">
                  <div className="group">
                    <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Resonance (r)</label><span className="text-xs font-mono text-emerald-400 font-black">{r_resonance}</span></div>
                    <input type="range" min="1" max="1.5" step="0.01" value={r_resonance} onChange={e => setRResonance(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                  </div>
                  <div className="group">
                    <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Intensity (In)</label><span className="text-xs font-mono text-blue-400 font-black">{in_intensity}</span></div>
                    <input type="range" min="0" max="1" step="0.01" value={in_intensity} onChange={e => setInIntensity(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" />
                  </div>
                  <div className="group">
                    <div className="flex justify-between px-2 mb-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Stress (S)</label><span className="text-xs font-mono text-rose-500 font-black">{s_stress}</span></div>
                    <input type="range" min="0.01" max="0.5" step="0.01" value={s_stress} onChange={e => setSStress(parseFloat(e.target.value))} className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-inner" />
                  </div>
                </div>
                <button onClick={handleRunFullSimulation} disabled={isRunningSimulation} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 border-4 border-white/10 ring-8 ring-white/5">
                  {isRunningSimulation ? <Loader2 className="animate-spin" /> : <Zap size={20} className="fill-current" />} RUN ENGINE
                </button>
              </div>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 h-[500px] shadow-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simProjectionData}>
                    <Area type="monotone" name="Sustainability Index" dataKey="score" stroke="#10b981" strokeWidth={5} fill="#10b98110" />
                    <Area type="monotone" name="Resilience Factor (m)" dataKey="m" stroke="#3b82f6" strokeWidth={3} fill="#3b82f605" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {simulationReport && (
                <div className={`p-10 glass-card border-l-8 transition-colors duration-500 animate-in slide-in-from-left-6 shadow-xl relative overflow-hidden ${simulationReport.includes('SYSTEM_ERROR') ? 'border-rose-600 bg-rose-950/20' : 'border-emerald-500 bg-emerald-500/[0.02]'}`}>
                  <p className="text-slate-300 text-lg italic leading-relaxed whitespace-pre-line font-medium">{simulationReport}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- VIEW: TELEMETRY (Ingest) --- */}
        {activeTab === 'telemetry' && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
              <div className="lg:col-span-1 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase italic px-4 flex items-center gap-4"><Disk size={20} className="text-blue-400" /> Active Nodes</h3>
                    <div className="space-y-4">
                       {hardwareNodes.length === 0 ? (
                         <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4"><Smartphone size={48} className="text-slate-600" /><p className="text-[10px] font-black uppercase tracking-widest">No Paired Hardware</p></div>
                       ) : hardwareNodes.map(n => (
                         <button key={n.id} onClick={() => setSelectedIotNode(n)} className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedIotNode?.id === n.id ? 'bg-blue-600 border-white text-white shadow-xl scale-105' : 'bg-black border-white/5 text-slate-700 hover:border-blue-500/20 hover:bg-blue-500/5'}`}>
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl transition-all ${selectedIotNode?.id === n.id ? 'bg-white/10' : 'bg-white/5'}`}><Smartphone size={20} /></div>
                               <div><p className="text-xs font-black uppercase tracking-widest">{n.name}</p><p className="text-[9px] font-mono opacity-60 mt-1">{n.id}</p></div>
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-3 glass-card p-12 rounded-[64px] bg-[#050706] border-2 border-white/5 flex flex-col shadow-3xl min-h-[650px] relative overflow-hidden">
                 <div className="flex-1 space-y-4 font-mono text-[11px] overflow-y-auto custom-scrollbar relative z-10 bg-black/40 rounded-[48px] p-8 shadow-inner">
                    {telemetryLogs.map((log, i) => (
                      <div key={i} className="flex gap-10 p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group animate-in slide-in-from-right-2">
                        <span className="text-slate-700 w-24 shrink-0 font-bold">[{log.timestamp}]</span>
                        <span className="text-blue-400 w-40 shrink-0 font-bold uppercase italic tracking-widest">[{log.metric}]</span>
                        <div className="flex-1 text-slate-300">PACKET_VAL: <span className="text-emerald-400 font-black">{log.value}</span> // ZK_SESSION: SYNC_A882</div>
                        <CheckCircle2 size={16} className="text-emerald-500/40" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: TREND INGEST --- */}
        {activeTab === 'trends' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
             {!trendsResult && !isIngestingTrends ? (
                <div className="text-center space-y-10 relative z-10 py-20">
                   <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto group-hover:scale-110 transition-transform"><TrendingUp size={64} className="text-white" /></div>
                   <div className="space-y-4">
                      <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Trend <span className="text-indigo-400">Ingest</span></h3>
                      <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">"Synchronizing global mesh search grounding."</p>
                   </div>
                   <button onClick={handleIngestTrends} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 border-2 border-white/10">
                      <Globe2 size={24} /> INITIALIZE TREND SYNC
                   </button>
                </div>
             ) : isIngestingTrends ? (
                <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in fade-in"><Loader2 size={120} className="text-indigo-500 animate-spin" /><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">CRAWLING GLOBAL SHARDS...</p></div>
             ) : (
                <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10 w-full px-6 py-10">
                   <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-indigo-600 relative overflow-hidden group/shard">
                      <div className="text-slate-300 text-xl md:text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/5">{trendsResult?.text}</div>
                      {trendsResult?.sources && (
                        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {trendsResult.sources.map((s, i) => (
                              <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/link hover:border-indigo-500/40 transition-all">
                                 <div className="flex items-center gap-4"><Globe size={18} className="text-indigo-400" /><span className="text-xs font-black text-slate-300 uppercase italic truncate">{s.web?.title || 'Registry Shard'}</span></div>
                                 <ExternalLink size={14} className="text-slate-700 group-hover/link:text-indigo-400 transition-all" />
                              </a>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
             )}
           </div>
        )}

        {/* --- VIEW: SCIENCE ORACLE (EOS AI) --- */}
        {activeTab === 'eos_ai' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden group">
                       <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8"><Bot size={32} className="text-indigo-400" /><h3 className="text-2xl font-black text-white uppercase italic">Inquiry <span className="text-indigo-400">Control</span></h3></div>
                       <div className="space-y-4">
                          {['BIO_DIAGNOSTIC', 'SPECTRAL_AUDIT', 'GENOMIC_INQUIRY', 'SOIL_REMEDIATION'].map(mode => (
                             <button key={mode} onClick={() => setOracleMode(mode as OracleMode)} className={`flex items-center justify-between p-5 rounded-[28px] border-2 transition-all w-full ${oracleMode === mode ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}>
                                <span className="text-[11px] font-black uppercase tracking-widest">{mode.replace('_', ' ')}</span>
                                {oracleMode === mode && <CheckCircle2 size={16} className="text-indigo-400" />}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="lg:col-span-8 flex flex-col">
                    <div className="glass-card rounded-[64px] min-h-[650px] border-2 border-white/5 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                       <div className="flex-1 p-12 overflow-y-auto custom-scrollbar flex flex-col">
                          {!uploadedFile && !aiThinking && (
                             <div onClick={() => oracleFileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center text-center space-y-12 border-4 border-dashed border-white/10 rounded-[64px] bg-black/40 group cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all duration-700">
                                <input type="file" ref={oracleFileInputRef} onChange={handleOracleFileSelect} className="hidden" accept="image/*" />
                                <Camera size={48} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                                <p className="text-2xl font-black text-white uppercase italic">Ingest Diagnostic Shard</p>
                             </div>
                          )}
                          {uploadedFile && !aiResult && !aiThinking && (
                             <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in zoom-in">
                                <div className="relative w-full max-w-md aspect-square rounded-[48px] overflow-hidden border-2 border-indigo-500/20"><img src={uploadedFile} className="w-full h-full object-cover" alt="Upload" /><button onClick={clearOracleBuffer} className="absolute top-6 right-6 p-4 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-colors"><X size={24} /></button></div>
                                <div className="w-full max-w-md relative"><input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDeepAIQuery()} placeholder="Input inquiry for the Oracle..." className="w-full bg-black border-2 border-white/10 rounded-full py-6 pl-8 pr-20 text-white outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all font-medium" /><button onClick={handleDeepAIQuery} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 rounded-full text-white shadow-xl hover:bg-indigo-500 transition-all"><Send size={20} /></button></div>
                             </div>
                          )}
                          {aiThinking && (
                             <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in"><div className="w-48 h-48 rounded-full border-t-4 border-indigo-500 animate-spin"></div><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic m-0">{NEURAL_STEPS[currentStepIndex]}</p></div>
                          )}
                          {aiResult && (
                             <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12 pb-10 flex-1">
                                <div className="p-10 md:p-16 bg-black/80 rounded-[64px] border-l-[16px] border-l-indigo-600 border border-indigo-500/20 shadow-3xl text-left relative overflow-hidden group/advice"><div className="prose prose-invert max-w-none text-slate-300 text-xl md:text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-8 border-l border-white/5">{aiResult.text}</div></div>
                                <div className="flex justify-center"><button onClick={clearOracleBuffer} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">New Inquiry</button></div>
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .agro-gradient-rose { background: linear-gradient(135deg, #be123c 0%, #f43f5e 100%); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Intelligence;
