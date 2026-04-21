import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Monitor, Cpu, Activity, Zap, ShieldCheck, Binary, Layers, Microscope, FlaskConical, Scan, 
  AlertCircle, TrendingUp, Droplets, Wind, Sprout, Database, Upload, 
  MapPin, X, Loader2, Leaf, Gauge, Fingerprint, SearchCode, History, 
  ChevronRight, LineChart, HeartPulse, Radar, 
  CheckCircle2, Info, ArrowUpRight, BrainCircuit, Clock,
  Terminal, Atom, ImageIcon, FileSearch, 
  Coins, ShieldAlert, CloudUpload, 
  ClipboardCheck, Dna, Workflow, Target, Waves, 
  RefreshCw, Radiation, BoxSelect, Maximize2, Smartphone, Send, Languages,
  Brain, Network, FileDigit, Settings, Download, Globe, Camera,
  Box, Database as Disk, Globe2, ExternalLink,
  ScanLine, BadgeCheck, LayoutGrid, ClipboardList,
  HardDrive, Stamp, FileText,
  // Added missing icons to fix component crash
  Wifi, Play, Mountain
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { chatWithAgroLang, analyzeSustainability, AgroLangResponse, searchAgroTrends, runSimulationAnalysis, analyzeMedia } from '../services/agroLangService';
import { User, AgroResource, ViewState, MediaShard } from '../types';
import { useEvidenceIngest } from '../hooks/useEvidenceIngest';
import { HenIcon } from './Icons';

// Fixed: Removed non-existent exports backupTelemetryShard and fetchTelemetryBackup
import { saveCollectionItem } from '../services/firebaseService';
import { SycamoreLogo } from './Icons';
import { generateQuickHash } from '../systemFunctions';
import { SEO } from './SEO';
import { SectionTabs } from './SectionTabs';
import { AIAssistant } from './AIAssistant';

interface IntelligenceProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onOpenEvidence?: () => void;
  onNavigate: (view: ViewState) => void;
  initialSection?: string | null;
  onEmitSignal?: (signal: any) => void;
}

type TabState = 'hub' | 'twin' | 'simulator' | 'trends' | 'telemetry' | 'eos_agro_lang' | 'sid' | 'evidence' | 'acoustic' | 'yield_matrix' | 'relay' | 'lattice' | 'ar_shard' | 'pos_verif';
type OracleMode = 'BIO_DIAGNOSTIC' | 'SPECTRAL_AUDIT' | 'GENOMIC_INQUIRY' | 'SOIL_REMEDIATION';

const ORACLE_QUERY_COST = 25;
const SID_SCAN_COST = 40;
const BATCH_AUDIT_COST = 100;

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

const FORECAST_DATA = [
  { cycle: 'C1', actual: 45, predicted: 48 },
  { cycle: 'C2', actual: 52, predicted: 55 },
  { cycle: 'C3', actual: 48, predicted: 50 },
  { cycle: 'C4', actual: 61, predicted: 65 },
  { cycle: 'C5', actual: 55, predicted: 58 },
  { cycle: 'C6', actual: 67, predicted: 72 },
  { cycle: 'C7', predicted: 78 },
  { cycle: 'C8', predicted: 84 },
];

const Intelligence: React.FC<IntelligenceProps> = ({ user, onEarnEAC, onSpendEAC, onOpenEvidence, onNavigate, initialSection, onEmitSignal }) => {
  const { ingestEvidence, isUploading, uploadProgress } = useEvidenceIngest(user);
  const [activeTab, setActiveTab] = useState<TabState>(initialSection as TabState || 'hub');
  const [archivedShards, setArchivedShards] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  // Vector Routing Logic
  useEffect(() => {
    if (initialSection && initialSection !== activeTab) {
      setActiveTab(initialSection as TabState);
    }
  }, [initialSection]);

  const anchorToLedger = async (content: string, type: string, mode: string) => {
    const shardKey = `${type}_${mode}_${content.substring(0, 20)}`;
    if (archivedShards.has(shardKey)) return;
    
    setIsArchiving(shardKey);
    try {
      const shardHash = `0x${generateQuickHash()}`;
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
      setArchivedShards(prev => {
        const next = new Set(prev);
        next.add(shardKey);
        return next;
      });
      onEarnEAC(20, `LEDGER_ANCHOR_${type.toUpperCase()}_SUCCESS`);
    } catch (e) {
      console.error("Ledger anchor failed", e);
    } finally {
      setIsArchiving(null);
    }
  };

  const downloadReport = (content: string, title: string, category: string) => {
    const report = `ENVIROSAGRO™ ${category.toUpperCase()} REPORT\nTITLE: ${title}\nNODE: ${user.esin}\nDATE: ${new Date().toISOString()}\n\n${content}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- BATCH AUDIT STANDS ---
  const [isBatchAuditing, setIsBatchAuditing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<Record<string, number>>({
    twin: 0, physics: 0, trends: 0, telemetry: 0, sid: 0
  });
  const [masterVerdict, setMasterVerdict] = useState<string | null>(null);

  const handleStartBatchAudit = async () => {
    if (!await onSpendEAC(BATCH_AUDIT_COST, 'MASTER_INTELLIGENCE_QUORUM_SYNC')) return;
    
    setIsBatchAuditing(true);
    setMasterVerdict(null);
    setBatchProgress({ twin: 0, physics: 0, trends: 0, telemetry: 0, sid: 0 });

    const shardKeys = ['twin', 'physics', 'trends', 'telemetry', 'sid'];
    shardKeys.forEach((key, i) => {
      const interval = setInterval(() => {
        setBatchProgress(prev => {
          const newVal = Math.min(100, prev[key] + Math.random() * 15);
          if (newVal === 100) clearInterval(interval);
          return { ...prev, [key]: newVal };
        });
      }, 300 + Math.random() * 500);
    });

    await new Promise(resolve => setTimeout(resolve, 6000));

    try {
      const prompt = `Perform a master synthesis of all intelligence shards for Node ${user.esin}. Provide a high-level strategic industrial directive.`;
      const response = await chatWithAgroLang(prompt, []);
      setMasterVerdict(response.text);
      onEarnEAC(100, 'MASTER_INTELLIGENCE_QUORUM_SYNC_YIELD');
      
      if (onEmitSignal) {
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'INTELLIGENCE_HUB',
          title: 'MASTER_QUORUM_SYNC',
          message: 'Master intelligence synthesis complete. Strategic directive broadcasted.',
          priority: 'high'
        });
      }
    } catch (e) {
      setMasterVerdict("MASTER_SYNC_ERROR: Quorum not reached.");
    } finally {
      setIsBatchAuditing(false);
    }
  };

  // --- IOT TELEMETRY STATES ---
  const hardwareNodes = useMemo(() => (user.resources || []).filter(r => r.category === 'HARDWARE'), [user.resources]);
  const [selectedIotNode, setSelectedIotNode] = useState<AgroResource | null>(hardwareNodes[0] || null);
  const [telemetryLogs, setTelemetryLogs] = useState<{timestamp: string, metric: string, value: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (['telemetry', 'hub', 'twin'].includes(activeTab)) {
        const metrics = ['Temperature', 'Soil Purity', 'm-Constant Drift', 'Photosynthetic Flux'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * 100).toFixed(2);
        const newLog = { timestamp: new Date().toLocaleTimeString(), metric, value };
        setTelemetryLogs(prev => [newLog, ...prev].slice(0, 8));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // --- SIMULATOR ---
  const [r_resonance, setRResonance] = useState(1.12);
  const [in_intensity, setInIntensity] = useState(0.78);
  const [s_stress, setSStress] = useState(0.12);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  const simProjectionData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 12; i++) {
      const ca = 1.2 * i + 1; // dummy ca
      const m = Math.sqrt((0.92 * in_intensity * ca) / Math.max(s_stress, 0.01));
      data.push({ cycle: i, m: Number(m.toFixed(2)), score: Math.min(100, (m * 10)) });
    }
    return data;
  }, [in_intensity, s_stress]);

  const handleRunFullSimulation = async () => {
    if (!await onSpendEAC(50, 'FULL_SUSTAINABILITY_SIMULATION_INGEST')) return;
    setIsRunningSimulation(true);
    setSimulationReport(null);
    try {
      const res = await runSimulationAnalysis({ m: simProjectionData[12].m, stress: s_stress });
      setSimulationReport(res.text);
      
      if (onEmitSignal) {
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'EOS_SIMULATOR',
          title: 'SIMULATION_COMPLETE',
          message: `Sustainability simulation finalized with score: ${simProjectionData[12].score.toFixed(1)}%`,
          priority: 'medium'
        });
      }
    } catch (e: any) {
      setSimulationReport("SIMULATION_ERROR: Handshake interrupted.");
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // --- SID SCANNER ---
  const [isSidScanning, setIsSidScanning] = useState(false);
  const [sidResult, setSidResult] = useState<AgroLangResponse | null>(null);
  const [sidStepIndex, setSidStepIndex] = useState(0);

  const handleRunSidScan = async () => {
    if (!await onSpendEAC(SID_SCAN_COST, 'SID_VIRAL_LOAD_SCAN')) return;
    setIsSidScanning(true);
    setSidResult(null);
    setSidStepIndex(0);
    const stepInterval = setInterval(() => setSidStepIndex(p => (p < SID_STEPS.length - 1 ? p + 1 : p)), 1000);
    try {
      const res = await chatWithAgroLang(`Perform a SID Scan for Node ${user.esin}.`, []);
      setSidResult(res);
      onEarnEAC(20, 'SID_DIAGNOSTIC_INGEST_OK');
    } finally {
      clearInterval(stepInterval);
      setIsSidScanning(false);
    }
  };

  // --- SCIENCE ORACLE (EOS AI) ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AgroLangResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const oracleFileInputRef = useRef<HTMLInputElement>(null);

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() || !uploadedFile) return;
    if (!await onSpendEAC(ORACLE_QUERY_COST, "ORACLE_DIAGNOSTIC_INQUIRY")) return;
    setAiThinking(true);
    setAiResult(null);
    try {
      const resText = await analyzeMedia(fileBase64!, 'image/jpeg', aiQuery);
      setAiResult({ text: resText });
      onEarnEAC(10, "ORACLE_DIAGNOSTIC_FINALIZED");
    } finally {
      setAiThinking(false);
    }
  };

  // --- TREND INGEST ---
  const [isIngestingTrends, setIsIngestingTrends] = useState(false);
  const [trendsResult, setTrendsResult] = useState<AgroLangResponse | null>(null);
  const handleIngestTrends = async () => {
    setIsIngestingTrends(true);
    try {
      const res = await searchAgroTrends("latest agricultural trends 2025");
      setTrendsResult(res);
      onEarnEAC(10, "GLOBAL_TREND_INGEST_OK");
    } finally { setIsIngestingTrends(false); }
  };

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-500 pb-48 max-w-[1600px] mx-auto px-4 relative">
      <SEO title="Intelligence" description="EnvirosAgro Intelligence: Access AI-driven insights, analyze sustainability metrics, and run agricultural simulations." />
      {/* HUD Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Microscope className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl ring-4 ring-white/10 shrink-0">
              <Cpu className="w-20 h-20 text-white animate-pulse" />
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
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div> ACTIVE_SYNC
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center w-full mb-10">
        <SectionTabs 
          tabs={[
            { id: 'hub', label: 'Master Hub', icon: LayoutGrid },
            { id: 'twin', label: 'Digital Twin', icon: Box },
            { id: 'simulator', label: 'EOS Simulator', icon: Cpu },
            { id: 'trends', label: 'Trend Ingest', icon: TrendingUp },
            { id: 'acoustic', label: 'Acoustic Monitor', icon: Waves },
            { id: 'yield_matrix', label: 'Yield Matrix', icon: LayoutGrid },
            { id: 'telemetry', label: 'IoT Telemetry', icon: Wifi },
            { id: 'eos_agro_lang', label: 'AgroBot Intelligence', icon: HenIcon },
            { id: 'sid', label: 'SID Scanner', icon: Radiation },
            { id: 'relay', label: 'Agro-Lang Relay', icon: Languages },
            { id: 'evidence', label: 'Evidence Vault', icon: CloudUpload },
            { id: 'lattice', label: 'BNL Lattice', icon: Network },
            { id: 'ar_shard', label: 'AR Overlay', icon: ScanLine },
            { id: 'pos_verif', label: 'PoS Oracle', icon: BadgeCheck },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          variant="industrial"
          className="w-full"
        />
      </div>

      {/* Viewport */}
      <div className="min-h-[70vh] xl:min-h-[85vh] h-full space-y-16 md:space-y-24 flex flex-col xl:flex-row">
        {/* HUB */}
        {/* --- VIEW: AGRO-LANG RELAY --- */}
        {activeTab === 'relay' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col min-h-0 xl:h-[850px] xl:h-full flex-1">
            <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex-1 flex flex-col space-y-12 shadow-3xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[28px] bg-fuchsia-600/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-500 shadow-xl">
                    <Languages size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Agro-Lang <span className="text-fuchsia-400">Relay.</span></h3>
                    <p className="text-[10px] text-fuchsia-400 font-black uppercase tracking-[0.4em] mt-1">REAL_TIME_LINGUISTIC_SYNCHRONIZATION</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">4 Stewards Syncing</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 h-full w-full flex-1 min-h-0">
                <div className="flex-1 space-y-6 flex flex-col min-h-0 h-full">
                  <div className="flex-1 bg-black/60 rounded-[48px] border border-white/10 p-8 flex flex-col justify-end space-y-4 overflow-y-auto custom-scrollbar min-h-[400px]">
                    {[
                      { user: 'Steward_A', msg: 'Soil moisture at Plot 4 is dropping. Initiating irrigation?', lang: 'EN' },
                      { user: 'Steward_B', msg: 'La humedad del suelo en la Parcela 4 está bajando. ¿Iniciando el riego?', lang: 'ES', translated: true },
                      { user: 'Steward_C', msg: 'A umidade do solo no Talhão 4 está caindo. Iniciando irrigação?', lang: 'PT', translated: true }
                    ].map((chat, i) => (
                      <div key={i} className={`p-5 rounded-3xl border ${chat.translated ? 'bg-fuchsia-500/5 border-fuchsia-500/10' : 'bg-white/5 border-white/10'} space-y-2`}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">{chat.user}</span>
                          <span className="text-[8px] font-mono text-slate-600">{chat.lang}</span>
                        </div>
                        <p className="text-sm text-white italic">{chat.msg}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative shrink-0">
                    <input 
                      placeholder="Type a message to relay across the mesh..."
                      className="w-full py-6 px-10 bg-black/80 border border-white/10 rounded-full text-white font-medium italic outline-none focus:border-fuchsia-500/40 transition-all"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-fuchsia-600 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                      <Send size={20} />
                    </button>
                  </div>
                </div>

                <div className="lg:w-[400px] shrink-0 xl:h-full lg:flex lg:flex-col lg:space-y-6 flex flex-col gap-6 lg:gap-0">
                  <div className="p-8 bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-[40px] space-y-6 flex-1">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Relay Metrics</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Translation Latency', val: '42ms', icon: Clock },
                        { label: 'Semantic Accuracy', val: '98.4%', icon: Target },
                        { label: 'Mesh Coverage', val: 'Global', icon: Globe }
                      ].map((metric, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-3 text-slate-500">
                            <metric.icon size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{metric.label}</span>
                          </div>
                          <span className="text-xs font-black text-white">{metric.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-8 rounded-[40px] border border-white/5 space-y-4 shrink-0">
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Active Dialects</h4>
                    <div className="flex flex-wrap gap-2">
                      {['English', 'Spanish', 'Portuguese', 'Swahili', 'Hindi'].map(lang => (
                        <span key={lang} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hub' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="p-10 md:p-14 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[20s]"><Leaf size={600} className="text-indigo-400" /></div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-float border-4 border-white/10 shrink-0">
                      <Zap className="w-10 h-10 text-white fill-current" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Intelligence <span className="text-indigo-400">Quorum Sync.</span></h4>
                      <p className="text-slate-400 text-lg font-medium italic max-w-2xl leading-relaxed">"Initialize a high-fidelity batch audit across all intelligence shards. Synchronize Twin, Simulator, and Oracle metrics."</p>
                   </div>
                </div>
                <button onClick={handleStartBatchAudit} disabled={isBatchAuditing} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 relative z-10 disabled:opacity-50">
                   {isBatchAuditing ? <Loader2 className="animate-spin w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                   <span className="ml-4">{isBatchAuditing ? 'PROCESSING_BATCH...' : 'RUN ALL SHARDS'}</span>
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Mini Shards */}
                <div onClick={() => setActiveTab('twin')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-blue-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform"><Box size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">DIGITAL_TWIN</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">Twin Calibration</h4>
                   <p className="text-[10px] text-slate-500 italic">"94.2% stability index reached."</p>
                </div>
                <div onClick={() => setActiveTab('simulator')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><Cpu size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">PHYSICS_ENGINE</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">EOS Simulator</h4>
                   <p className="text-[10px] text-slate-500 italic">"12 Cycles Projected (m=1.61)."</p>
                </div>
                <div onClick={() => setActiveTab('sid')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-rose-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform"><Radiation size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">BIO_SECURITY</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">SID Scanner</h4>
                   <p className="text-[10px] text-slate-500 italic">"Social immunity: 98% nominal."</p>
                </div>
                <div onClick={() => setActiveTab('eos_agro_lang')} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col justify-between shadow-xl cursor-pointer">
                   <div className="flex justify-between items-start"><div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform"><HenIcon size={24} /></div><span className="text-[9px] font-black text-slate-700 uppercase">NEURAL_HUB</span></div>
                   <h4 className="text-xl font-black text-white uppercase italic">AgroBot Intelligence</h4>
                   <p className="text-[10px] text-slate-500 italic">"Expert audit ready for ingest."</p>
                </div>
             </div>

             {masterVerdict && (
               <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-l-[20px] border-l-emerald-600 border-2 border-emerald-500/20 shadow-3xl animate-in slide-in-from-bottom-10 duration-1000">
                  <div className="prose prose-invert max-w-none text-slate-300 text-2xl leading-[2.1] italic whitespace-pre-line font-medium pl-10 border-l-2 border-white/5">
                     {masterVerdict}
                  </div>
                  <div className="mt-12 pt-10 border-t border-white/10 flex justify-end gap-6">
                    <button onClick={() => downloadReport(masterVerdict, "Master_Quorum", "Intelligence")} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl"><Download size={20} /> Export</button>
                    <button onClick={() => anchorToLedger(masterVerdict, "Master_Quorum", "Intelligence")} className="px-16 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 transition-all border-2 border-white/10 ring-8 ring-white/5"><Stamp size={24} /> Anchor to Ledger</button>
                  </div>
               </div>
             )}
          </div>
        )}

        {/* TWIN */}
        {activeTab === 'twin' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black overflow-hidden relative min-h-[650px] shadow-3xl flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)]"></div>
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center space-y-12">
                   <div className="relative w-full max-w-4xl aspect-video perspective-1000 group-hover:scale-105 transition-all duration-[3s]">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-[64px] bg-emerald-500/[0.02] shadow-[0_0_80px_rgba(16,185,129,0.1)] transform rotateX(60deg)">
                         <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">{[...Array(144)].map((_, i) => <div key={i} className="border-[0.5px] border-emerald-500/10 hover:bg-emerald-500/20"></div>)}</div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600/40 rounded-full animate-pulse border-2 border-indigo-400"></div>
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 bg-black/80 backdrop-blur-3xl border-2 border-emerald-500/30 rounded-3xl shadow-3xl animate-float">
                        <div className="flex items-center gap-6"><Activity size={32} className="text-emerald-400 animate-pulse" /><span className="text-xl font-mono font-black text-white uppercase italic tracking-tighter">Twin_Stability: 94.2%</span></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                      {[ { id: 'soil', l: 'Substrate', i: Mountain, c: 'text-orange-500' }, { id: 'crop', l: 'Phyto-Resonance', i: Sprout, c: 'text-emerald-400' }, { id: 'energy', l: 'Thermodynamics', i: Zap, c: 'text-blue-400' }].map(m => (
                        <button key={m.id} className="p-8 rounded-[48px] border-2 border-white/5 bg-black hover:border-indigo-500 transition-all flex items-center justify-between group/btn shadow-xl px-12">
                          <div className="flex items-center gap-6">
                            <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${m.c} group-hover/btn:rotate-12 transition-transform shadow-inner`}><m.i size={28} /></div>
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-white italic">{m.l}</span>
                          </div>
                          <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-3/4"></div></div>
                        </button>
                      ))}
                   </div>
                </div>
             </div>
             
             <div className="glass-card p-12 rounded-[56px] border border-blue-500/20 bg-black/40 shadow-2xl relative">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10 border-b border-white/5 pb-8">
                  <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] italic m-0">Model <span className="text-blue-400">Resonance</span> Data</h3>
                  <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">RECALIBRATE_SYSTEM</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[{ l: 'Fidelity', v: '0.998α', p: 98, c: 'bg-emerald-500' }, { l: 'Latency', v: '14ms', p: 88, c: 'bg-blue-500' }, { l: 'Compute Load', v: 'Low', p: 12, c: 'bg-indigo-500' }].map(s => (
                    <div key={s.l} className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-500 tracking-widest">
                        <span>{s.l}</span>
                        <span className="text-white font-mono bg-white/5 px-3 py-1 rounded-lg">{s.v}</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${s.c} shadow-[0_0_40px_currentColor]`} style={{ width: `${s.p}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col min-h-0 xl:h-[850px] xl:h-full flex-1">
             <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 shadow-2xl flex flex-col h-full flex-1">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 border-b border-white/5 pb-8 shrink-0">
                   <div className="p-6 bg-indigo-500/10 rounded-[32px] text-indigo-400 shadow-xl border border-indigo-500/20"><Cpu size={40} /></div>
                   <div className="flex-1 text-center md:text-left">
                      <h3 className="font-black text-white uppercase text-4xl tracking-tighter italic m-0">EOS Physics <span className="text-indigo-400">Core</span></h3>
                      <p className="text-[12px] text-slate-500 uppercase tracking-[0.6em] font-black mt-3 italic">SIMULATION_ENVIRONMENT_v6.5</p>
                   </div>
                   <button onClick={handleRunFullSimulation} disabled={isRunningSimulation} className="px-20 py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-6 hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-50 w-full md:w-auto shrink-0">
                     {isRunningSimulation ? <Loader2 className="animate-spin w-8 h-8" /> : <Zap size={32} className="fill-current" />} 
                     <span>{isRunningSimulation ? 'CALibrating...' : 'RUN_ENGINE'}</span>
                   </button>
                </div>
                
                <div className="flex flex-col xl:flex-row gap-16 flex-1 min-h-0 h-full">
                  <div className="space-y-12 bg-black/60 p-10 rounded-[48px] border border-white/5 flex flex-col xl:w-[450px] shrink-0">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.6em] mb-8 shrink-0">Vector Inputs</h4>
                    <div className="space-y-12 flex-1">
                        <div className="group"><div className="flex justify-between px-2 mb-4"><label className="text-xs font-black text-white uppercase tracking-widest group-hover:text-blue-400 transition-colors italic">Intensity (In)</label><span className="text-lg font-mono text-blue-400 font-black">{in_intensity}</span></div><input type="range" min="0" max="1" step="0.01" value={in_intensity} onChange={e => setInIntensity(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" /></div>
                        <div className="group"><div className="flex justify-between px-2 mb-4"><label className="text-xs font-black text-white uppercase tracking-widest group-hover:text-rose-400 transition-colors italic">Stress (S)</label><span className="text-lg font-mono text-rose-500 font-black">{s_stress}</span></div><input type="range" min="0.01" max="0.5" step="0.01" value={s_stress} onChange={e => setSStress(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500 shadow-inner" /></div>
                    </div>
                    <div className="pt-8 shrink-0 border-t border-white/5 mt-auto">
                       <div className="p-8 rounded-[40px] bg-indigo-900/20 border border-indigo-500/20 flex flex-col gap-6">
                          <div>
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Growth Constant <span className="italic">(m)</span></p>
                             <p className="text-4xl font-mono font-black text-white mt-1">1.618</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Sustainability Target</p>
                             <p className="text-4xl font-mono font-black text-white mt-1">{(in_intensity / s_stress * 1.62).toFixed(2)}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8 flex flex-col h-full flex-1 min-h-0 w-full xl:w-auto">
                    <div className="flex-1 min-h-[400px] glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 overflow-hidden relative">
                      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Projections_Stream</span>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simProjectionData}><Area type="monotone" name="Sustainability Index" dataKey="score" stroke="#10b981" strokeWidth={5} fill="#10b98110" /><Area type="monotone" name="Resilience Factor (m)" dataKey="m" stroke="#3b82f6" strokeWidth={3} fill="#3b82f605" strokeDasharray="5 5" /></AreaChart>
                      </ResponsiveContainer>
                    </div>
                    {simulationReport && <div className="p-10 glass-card border-l-[16px] border-l-emerald-600 bg-emerald-600/5 rounded-[40px] shadow-2xl relative overflow-hidden shrink-0"><div className="absolute top-0 right-0 p-6 opacity-10 animate-pulse text-emerald-500"><Info size={48} /></div><p className="text-slate-200 text-sm md:text-lg italic leading-relaxed whitespace-pre-line font-medium relative z-10">{simulationReport}</p></div>}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* TRENDS */}
        {activeTab === 'trends' && (
           <div className="w-full h-full space-y-12 animate-in zoom-in duration-500 flex flex-col min-h-0">
             {!trendsResult && !isIngestingTrends ? (
                <div className="text-center space-y-10 relative z-10 py-20 flex-1 flex flex-col items-center justify-center">
                   <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto transition-transform group-hover:scale-110"><TrendingUp size={64} className="text-white" /></div>
                   <div className="space-y-4"><h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Trend <span className="text-indigo-400">Ingest</span></h3><p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto opacity-80 leading-relaxed">"Synchronizing global mesh search grounding."</p></div>
                   <button onClick={handleIngestTrends} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10"><Globe2 size={24} /> INITIALIZE TREND SYNC</button>
                </div>
             ) : isIngestingTrends ? (
                <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center flex-1"><Loader2 size={120} className="text-indigo-500 animate-spin" /><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic m-0">CRAWLING GLOBAL SHARDS...</p></div>
             ) : (
                <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10 w-full px-6 py-10 flex-1 overflow-y-auto custom-scrollbar">
                   <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-indigo-600 relative overflow-hidden group/shard min-h-[500px]">
                      <div className="text-slate-300 text-xl md:text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/5">{trendsResult?.text}</div>
                      {trendsResult?.sources && (
                        <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {trendsResult.sources.map((s: any, i: number) => (
                              <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/link hover:border-indigo-500/40 transition-all"><div className="flex items-center gap-4"><Globe size={18} className="text-indigo-400" /><span className="text-xs font-black text-slate-300 uppercase italic truncate">{s.web?.title || 'Registry Shard'}</span></div><ExternalLink size={14} className="text-slate-700 group-hover/link:text-indigo-400 transition-all" /></a>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
             )}
           </div>
        )}

        {/* --- VIEW: ACOUSTIC MONITOR --- */}
        {activeTab === 'acoustic' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col min-h-0 xl:h-[850px] xl:h-full flex-1">
             <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden flex-1 flex flex-col min-h-0 h-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-indigo-900/5 p-8 rounded-[40px] border border-indigo-500/10 shrink-0">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[36px] bg-indigo-600 flex items-center justify-center text-white shadow-3xl border-4 border-white/10 shrink-0">
                         <Waves size={48} />
                      </div>
                      <div>
                         <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Acoustic <span className="text-indigo-400">Resonance.</span></h3>
                         <p className="text-[12px] text-indigo-400 font-black uppercase tracking-[0.6em] mt-3 italic">BIO_SONIC_SURVEILLANCE_v2.1</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest animate-pulse">LIVE_SHARD_FEED</span>
                   </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-12 flex-1 min-h-0 h-full">
                   <div className="flex-1 min-h-[400px] h-full bg-black/60 rounded-[56px] border-2 border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
                      {/* Simulated Spectrogram */}
                      <div className="absolute inset-0 flex items-end justify-around px-20 pb-20 gap-2 opacity-60">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div key={i} className="w-full bg-indigo-500/30 rounded-t-lg animate-pulse" style={{ height: `${10 + Math.random() * 80}%`, animationDelay: `${i * 0.03}s` }}></div>
                        ))}
                      </div>
                      <div className="relative z-10 text-center space-y-8">
                        <div className="w-32 h-32 rounded-full border-[6px] border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto shadow-[0_0_60px_rgba(99,102,241,0.2)]"></div>
                        <p className="text-lg font-black text-white uppercase tracking-[0.6em] italic animate-pulse">Analyzing_Planetary_Soundscape...</p>
                      </div>
                   </div>
                   
                   <div className="xl:w-[450px] shrink-0 space-y-8 flex flex-col min-h-0 xl:h-full">
                      <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-4 m-0 italic shrink-0">Sonic Signatures</h4>
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4">
                        {[
                          { name: 'Apis Mellifera', confidence: 98, status: 'OPTIMAL', time: '2m ago', color: 'text-emerald-400' },
                          { name: 'Gryllidae Pulse', confidence: 82, status: 'NORMAL', time: '5m ago', color: 'text-blue-400' },
                          { name: 'Unknown Anomaly', confidence: 12, status: 'FILTERED', time: '12m ago', color: 'text-rose-500' },
                          { name: 'Cicadidae Sync', confidence: 75, status: 'NORMAL', time: '15m ago', color: 'text-indigo-400' },
                          { name: 'Avian Activity', confidence: 88, status: 'OPTIMAL', time: '1hr ago', color: 'text-amber-400' }
                        ].map((sig, i) => (
                          <div key={i} className="p-8 bg-white/[0.03] rounded-[40px] border border-white/5 flex justify-between items-center group hover:bg-white/[0.06] transition-all">
                            <div className="space-y-2">
                              <p className="text-xl font-black text-white uppercase italic tracking-tight">{sig.name}</p>
                              <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{sig.time}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-2xl font-black ${sig.color}`}>{sig.confidence}%</p>
                              <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">{sig.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-8 bg-white/5 border border-white/10 rounded-full text-[12px] font-black text-white uppercase tracking-[0.3em] hover:bg-white/10 transition-all shadow-xl shrink-0 mt-4">EXPORT_ACOUSTIC_MANIFEST</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 shrink-0 border-t border-white/5">
                   {[
                     { label: 'Acoustic Health', val: '94.2', unit: '%', icon: HeartPulse, color: 'text-emerald-400' },
                     { label: 'Pest Signature', val: '0.02', unit: 'Hz', icon: ShieldAlert, color: 'text-rose-400' },
                     { label: 'Pollinator Sync', val: '88.5', unit: '%', icon: Zap, color: 'text-amber-400' }
                   ].map((stat, i) => (
                     <div key={i} className="p-10 bg-black/40 rounded-[48px] border border-white/5 flex items-center justify-between shadow-xl">
                       <div className="space-y-2">
                         <div className="flex items-center gap-3 text-slate-500">
                           <stat.icon size={20} />
                           <span className="text-[11px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                         </div>
                         <p className={`text-5xl font-mono font-black ${stat.color} tracking-tighter`}>{stat.val}<span className="text-sm text-slate-700 ml-2 italic">{stat.unit}</span></p>
                       </div>
                       <div className="w-2 h-16 bg-white/5 rounded-full overflow-hidden"><div className={`w-full ${stat.color.replace('text-', 'bg-')} h-3/4 shadow-[0_0_20px_currentColor]`}></div></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- VIEW: YIELD MATRIX --- */}
        {activeTab === 'yield_matrix' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col min-h-0 xl:h-[850px] xl:h-full flex-1">
             <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden flex-1 flex flex-col min-h-0 h-full">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-emerald-950/5 p-10 rounded-[56px] border border-emerald-500/20 shrink-0">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[32px] bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_60px_rgba(16,185,129,0.3)] border-4 border-white/10 shrink-0">
                         <LayoutGrid size={48} />
                      </div>
                      <div>
                         <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0">Yield <span className="text-emerald-400">Matrix.</span></h3>
                         <p className="text-[12px] text-emerald-400 font-black uppercase tracking-[0.6em] mt-3 italic">PREDICTIVE_HARVEST_FORECASTING_UNIT</p>
                      </div>
                   </div>
                   <div className="flex gap-6 shrink-0">
                      <div className="px-8 py-5 bg-black/40 rounded-full border border-white/10 flex items-center gap-6 shadow-xl">
                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest italic">Matrix_Scenario:</span>
                         <select className="bg-transparent text-sm font-black text-white outline-none uppercase italic cursor-pointer hover:text-emerald-400 transition-colors">
                            <option>Standard Growth</option>
                            <option>Optimized Mesh</option>
                            <option>Climate Stress</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-12 flex-1 min-h-0 h-full w-full">
                   <div className="flex-1 min-h-[400px] bg-black/60 rounded-[64px] border-2 border-white/10 p-12 relative overflow-hidden shadow-inner group/chart flex flex-col h-full w-full xl:w-auto">
                      <div className="absolute top-10 left-10 flex items-center gap-3 z-20">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_20px_#10b981]"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">LIVE_FORECAST_RENDER</span>
                      </div>
                      <div className="flex-1 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="matrixYield" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="cycle" stroke="#ffffff10" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff10" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '2px solid #10b98120', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#10b981', fontWeight: '900', textTransform: 'uppercase', fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#matrixYield)" />
                          <Area type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="10 10" fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="xl:w-[450px] shrink-0 space-y-8 flex flex-col justify-between h-full min-h-0">
                      <div className="p-10 bg-emerald-500 rounded-[56px] shadow-[0_40px_100px_rgba(16,185,129,0.2)] space-y-6 animate-float relative overflow-hidden group/card shrink-0">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]"></div>
                         <p className="text-[11px] text-emerald-950 font-black uppercase tracking-widest relative z-10 opacity-70">Projected Yield (C14)</p>
                         <h4 className="text-6xl font-black text-white italic m-0 relative z-10 leading-none">1,442<span className="text-xl ml-2 opacity-50 uppercase tracking-tighter not-italic">t/HA</span></h4>
                         <div className="flex items-center gap-3 text-emerald-950 relative z-10 font-bold bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm">
                           <TrendingUp size={18} />
                           <span className="text-xs uppercase tracking-widest">+12.4% <span className="opacity-60 text-[10px]">SYNC</span></span>
                         </div>
                      </div>

                      <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[56px] flex flex-col shadow-2xl flex-1 justify-center space-y-10">
                        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] italic pl-4 border-l-4 border-indigo-500 shrink-0">What-if Parameters</p>
                        <div className="space-y-10 px-2 flex-1 flex flex-col justify-center">
                          <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest italic"><span>Nutrient Mesh</span><span className="text-emerald-400">+15%</span></div>
                            <input type="range" className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest italic"><span>Hydration α</span><span className="text-blue-400">-5%</span></div>
                            <input type="range" className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" />
                          </div>
                        </div>
                        <button className="w-full shrink-0 py-6 mt-4 border-2 border-dashed border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-white/20 hover:text-white transition-all">Lock Scenario</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TELEMETRY */}
        {activeTab === 'telemetry' && (
           <div className="flex flex-col xl:flex-row gap-12 animate-in slide-in-from-right-4 duration-700 h-full w-full">
              {/* Node Sidebar */}
              <div className="w-full xl:w-[450px] shrink-0 h-[850px] xl:h-full flex flex-col">
                 <div className="glass-card p-12 rounded-[64px] border border-blue-500/20 bg-blue-950/10 flex-1 flex flex-col space-y-12 shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.1)_0%,_transparent_50%)] opacity-30"></div>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-10 relative z-10 shrink-0 gap-6 md:gap-0">
                       <h3 className="text-3xl font-black text-white uppercase italic flex items-center gap-6 m-0 tracking-tighter"><Cpu size={32} className="text-blue-400 animate-pulse" /> Node Registry</h3>
                       <div className="px-6 py-2 bg-blue-600 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(37,99,235,0.4)]">ACTIVE</div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-4 relative z-10 space-y-6">
                       {hardwareNodes.length === 0 ? (
                         <div className="h-full w-full flex flex-col items-center justify-center opacity-20 gap-8 group-hover:opacity-40 transition-opacity">
                           <Smartphone size={100} className="text-slate-600 animate-bounce-slow" />
                           <p className="text-sm font-black uppercase tracking-[0.5em] text-white">AWAITING_BIO_LINK...</p>
                         </div>
                       ) : hardwareNodes.map(n => (
                         <button 
                           key={n.id} 
                           onClick={() => setSelectedIotNode(n)} 
                           className={`w-full p-10 rounded-[48px] border-4 transition-all text-left flex items-center justify-between group shadow-3xl transform ${selectedIotNode?.id === n.id ? 'bg-blue-600 border-white text-white translate-x-4' : 'bg-black/60 border-white/5 text-slate-500 hover:border-blue-500/40 hover:translate-x-2'}`}
                         >
                            <div className="flex items-center gap-8">
                               <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all shrink-0 ${selectedIotNode?.id === n.id ? 'bg-white/20' : 'bg-white/5'}`}><Smartphone size={32} /></div>
                               <div className="min-w-0"><p className="text-xl font-black uppercase tracking-tighter m-0 truncate">{n.name}</p><p className="text-[11px] font-mono opacity-50 uppercase tracking-[0.2em] mt-2 italic truncate">{n.id}</p></div>
                            </div>
                            {selectedIotNode?.id === n.id && <Activity size={24} className="text-white animate-pulse shrink-0" />}
                         </button>
                       ))}
                    </div>
                    <button className="w-full shrink-0 py-8 border-2 border-dashed border-white/10 rounded-full text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] hover:text-white hover:border-white/20 transition-all relative z-10 mt-auto">SCAN_NEW_IO_SOURCE</button>
                 </div>
              </div>

              {/* Main Log Console */}
              <div className="flex-1 glass-card p-12 lg:p-20 rounded-[80px] bg-[#050706] border-2 border-white/5 flex flex-col shadow-[0_60px_150px_rgba(0,0,0,0.8)] relative overflow-hidden min-h-[850px] xl:h-full">
                 <div className="shrink-0 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-black/60 p-10 rounded-[56px] border border-white/5">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] shrink-0"><Terminal size={32} className="text-white animate-pulse" /></div>
                       <div>
                          <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight">Shard_Stream <span className="text-blue-400">Telemetry</span></h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">ENCRYPTED_BIOLOGICAL_FEED</p>
                       </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                       <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                       </div>
                       <div className="px-8 py-3 bg-blue-500/10 rounded-full text-[11px] font-mono text-blue-400 border border-blue-500/20 shadow-inner">ZK_SESSION: EA_SYNC_ACTIVE</div>
                    </div>
                 </div>

                 <div className="flex-1 space-y-6 font-mono text-[14px] lg:text-[16px] overflow-y-auto custom-scrollbar relative z-10 bg-black/80 rounded-[64px] p-6 md:p-12 shadow-2xl border border-white/5 group pl-2">
                    {telemetryLogs.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-12 py-32 grayscale hover:opacity-20 transition-opacity">
                          <Disk size={180} className="animate-spin-slow" />
                          <p className="text-xl md:text-3xl font-black uppercase tracking-[0.8em] text-center">BUFFERING_LATTICE_STREAM...</p>
                       </div>
                    ) : telemetryLogs.map((log, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-16 p-8 border-b border-white/[0.04] hover:bg-white/[0.03] transition-all group/row rounded-[24px]">
                        <span className="text-slate-700 shrink-0 font-bold opacity-60">[{log.timestamp}]</span>
                        <div className="flex items-center gap-6 lg:min-w-[250px]">
                           <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_20px_#3b82f6] shrink-0"></div>
                           <span className="text-blue-400 font-black uppercase italic tracking-[0.3em]">[{log.metric}]</span>
                        </div>
                        <div className="flex-1 text-slate-400 font-medium tracking-tight break-all">PACKET_HEX: <span className="text-emerald-400 font-black">{log.value}</span> <span className="ml-8 opacity-20 hidden 2xl:inline">// SYNC_SHARD: OK</span></div>
                        <BadgeCheck size={24} className="text-emerald-500/40 group-hover/row:text-emerald-400 transition-all scale-75 group-hover/row:scale-100 shrink-0 hidden md:block" />
                      </div>
                    ))}
                 </div>
                 
                 <div className="shrink-0 mt-12 flex flex-col md:flex-row gap-8">
                    <button className="flex-1 py-8 bg-white/[0.05] border border-white/10 rounded-full text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/[0.1] shadow-2xl">FLUSH_SHARD_BUFFER</button>
                    <button className="flex-1 py-8 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-[0_20px_60px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">EXPORT_TELEMETRY_LOG</button>
                 </div>
              </div>
           </div>
        )}

        {/* ORACLE (EOS AI) */}
        {activeTab === 'eos_agro_lang' && (
           <div className="space-y-12 animate-in zoom-in duration-700 w-full h-full">
              <div className="flex flex-col w-full h-full">
                 <div className="glass-card rounded-[80px] min-h-[750px] border-2 border-white/5 bg-[#050706] flex flex-col relative overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.8)]">
                    <div className="flex-1 p-12 lg:p-20 overflow-y-auto no-scrollbar flex flex-col">
                       {!uploadedFile && !aiThinking && (
                          <div onClick={() => oracleFileInputRef.current?.click()} className="flex-1 flex flex-col items-center justify-center text-center space-y-16 border-8 border-dashed border-white/5 rounded-[64px] bg-black/40 group cursor-pointer hover:border-indigo-600/40 hover:bg-indigo-950/5 transition-all duration-1000 shadow-inner">
                             <input type="file" ref={oracleFileInputRef} onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 const reader = new FileReader();
                                 reader.onloadend = () => {
                                   setUploadedFile(reader.result as string);
                                   setFileBase64((reader.result as string).split(',')[1]);
                                 };
                                 reader.readAsDataURL(file);
                               }
                             }} className="hidden" accept="image/*" />
                             <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <Camera size={120} className="text-indigo-400 group-hover:scale-125 transition-transform duration-700 relative z-10" />
                             </div>
                             <div className="space-y-6">
                                <p className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Ingest <span className="text-indigo-500">Diagnostic Shard.</span></p>
                                <p className="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">DRAG_DROP_OR_CLICK_TO_SCAN</p>
                             </div>
                          </div>
                       )}
                       {uploadedFile && !aiResult && !aiThinking && (
                          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 animate-in zoom-in h-full">
                             <div className="relative w-full max-w-[500px] aspect-square rounded-[80px] overflow-hidden border-4 border-indigo-500/20 shadow-3xl group">
                                <img src={uploadedFile} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Upload" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <button onClick={() => setUploadedFile(null)} className="absolute top-10 right-10 p-6 bg-black/60 rounded-full text-white hover:bg-rose-600 transition-all shadow-2xl scale-75 hover:scale-100"><X size={32} /></button>
                             </div>
                             <div className="w-full max-w-[600px] space-y-10">
                                <div className="space-y-4">
                                   <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] italic pl-6 border-l-4 border-indigo-500">PENDING_INQUIRY</p>
                                   <h4 className="text-6xl font-black text-white uppercase italic tracking-tighter">Query the <span className="text-indigo-500">Oracle.</span></h4>
                                </div>
                                <div className="relative">
                                   <input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDeepAIQuery()} placeholder="What ails the shard?" className="w-full bg-black border-4 border-white/10 rounded-[48px] py-10 pl-12 pr-24 text-2xl text-white focus:ring-[32px] focus:ring-indigo-500/10 focus:border-indigo-500/40 transition-all outline-none" />
                                   <button onClick={handleDeepAIQuery} className="absolute right-6 top-1/2 -translate-y-1/2 p-6 bg-indigo-600 rounded-full text-white shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all hover:scale-110 active:scale-95"><Send size={32} /></button>
                                </div>
                                <p className="text-sm font-medium text-slate-500 italic opacity-60">The EOS AI will evaluate the spectral data within the provided shard context.</p>
                             </div>
                          </div>
                       )}
                       {aiThinking && (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-32 text-center animate-in zoom-in">
                             <div className="relative scale-150">
                                <div className="w-64 h-64 rounded-full border-t-[12px] border-indigo-500 animate-spin shadow-[0_0_100px_rgba(79,70,229,0.3)]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <HenIcon size={120} className="text-indigo-400 animate-pulse" />
                                </div>
                                <SycamoreLogo size={64} className="absolute -top-6 -right-6 text-emerald-500 animate-spin-slow" />
                             </div>
                             <div className="space-y-6">
                                <p className="text-indigo-400 font-black text-5xl uppercase tracking-[0.5em] animate-pulse italic m-0">DECRYPTING_BIO_LOGIC...</p>
                                <p className="text-xs font-black text-slate-700 uppercase tracking-[0.8em]">CHANNELING_EOS_MATRIX_v6.5</p>
                             </div>
                          </div>
                       )}
                       {aiResult && (
                          <div className="animate-in slide-in-from-bottom-20 duration-1000 space-y-16 pb-12 flex-1 w-full max-w-7xl mx-auto">
                             <div className="relative w-full">
                                <div className="absolute -top-32 -right-32 opacity-[0.03] pointer-events-none scale-150">
                                   <SycamoreLogo size={800} className="text-emerald-500 animate-spin-slow" />
                                </div>
                                <div className="p-16 md:p-24 bg-black/80 rounded-[100px] border-l-[32px] border-l-indigo-600 border border-indigo-500/20 shadow-[0_100px_200px_rgba(0,0,0,0.8)] relative z-10">
                                   <div className="flex items-center justify-between mb-12">
                                      <div className="flex items-center gap-6">
                                         <div className="p-4 bg-emerald-500/10 rounded-2xl"><SycamoreLogo size={40} className="text-emerald-400 animate-pulse" /></div>
                                         <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.6em] italic">Oracle_Verdict_v6.5_SECURE</span>
                                      </div>
                                      <div className="px-6 py-2 bg-indigo-500/10 rounded-full text-[10px] font-mono text-indigo-400 border border-indigo-500/20 tracking-widest">ZK_PROOF_VERIFIED</div>
                                   </div>
                                   <div className="prose prose-invert max-w-none text-slate-200 text-3xl md:text-5xl italic leading-tight whitespace-pre-line font-medium drop-shadow-2xl">{aiResult.text}</div>
                                </div>
                             </div>
                             <div className="flex flex-col md:flex-row justify-center gap-10">
                                <button onClick={() => setAiResult(null)} className="px-16 py-8 bg-white/5 border-4 border-white/10 rounded-full text-slate-500 font-black text-sm uppercase tracking-[0.4em] hover:text-white hover:border-white/20 shadow-2xl transition-all">NEW_DIAGNOSTIC</button>
                                <button onClick={() => anchorToLedger(aiResult.text, 'Oracle', 'AgroLang_Inquiry')} className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_30px_100px_rgba(16,185,129,0.3)] hover:scale-105 transition-all border-4 border-white/10 flex items-center justify-center gap-4"><Stamp size={28} /> Anchor to Shard_Ledger</button>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* SID SCANNER */}
        {activeTab === 'sid' && (
           <div className="space-y-16 animate-in slide-in-from-bottom-4 duration-700 w-full h-full flex flex-col min-h-0">
              <div className="glass-card p-12 lg:p-20 rounded-[80px] border-l-[32px] border-l-rose-600 border border-rose-500/20 bg-rose-950/5 shadow-[0_60px_150px_rgba(244,63,94,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[850px] xl:h-[850px] xl:h-full flex-1">
                 <div className="absolute inset-0 z-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#f43f5e_0%,_transparent_70%)]"></div>
                 </div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-20 mb-12 shrink-0">
                    <div className="flex items-center gap-8">
                       <div className="p-10 bg-rose-600 rounded-[48px] shadow-[0_0_80px_rgba(244,63,94,0.5)] animate-pulse ring-[32px] ring-rose-600/5"><Radiation size={64} className="text-white" /></div>
                       <div>
                          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">SID <span className="text-rose-500 underline decoration-rose-500/20 underline-offset-8">Scanner.</span></h3>
                          <p className="text-xs font-black text-rose-500 uppercase tracking-[0.8em] mt-5 italic">BIO_SECURITY_ENTROPY_AUDIT_PROTOCOL</p>
                       </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-6">
                       <button onClick={handleRunSidScan} disabled={isSidScanning} className="px-24 py-12 agro-gradient rounded-full text-white font-black text-lg uppercase tracking-[0.6em] shadow-[0_40px_100px_rgba(244,63,94,0.3)] hover:scale-105 active:scale-95 transition-all border-8 border-white/10 ring-[40px] ring-rose-500/5 group/scan disabled:opacity-50">
                         {isSidScanning ? (
                           <div className="flex items-center gap-8"><Loader2 size={40} className="animate-spin text-white" /><span>ANALYZING_CORE...</span></div>
                         ) : (
                           <div className="flex items-center gap-8"><Scan size={40} /><span>RUN_DEEP_SCAN</span></div>
                         )}
                       </button>
                       <p className="text-[10px] font-mono text-rose-400 opacity-60 uppercase tracking-[0.4em]">SCAN_DEPTH: 128-SHARD_LATTICE</p>
                    </div>
                 </div>
                 
                 <div className="glass-card rounded-[80px] min-h-[550px] border-4 border-white/5 bg-black/80 flex flex-col relative overflow-hidden shadow-inner group/console flex-1 xl:mt-8">
                    <div className="absolute inset-0 z-10 opacity-60 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="absolute inset-0 z-10 opacity-60 pointer-events-none"><div className="w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_60px_#f43f5e] absolute top-1/2 animate-scan"></div></div>
                    
                    <div className="flex-1 p-16 lg:p-24 overflow-y-auto no-scrollbar relative z-20 flex items-center justify-center text-center">
                       {!sidResult && !isSidScanning ? (
                          <div className="space-y-16 opacity-10 group-hover/console:opacity-20 transition-opacity">
                             <Radiation size={250} className="text-slate-500 mx-auto transform rotate-12" />
                             <p className="text-7xl font-black uppercase tracking-[1em] text-white italic">SCANNER_IDLE</p>
                          </div>
                       ) : isSidScanning ? (
                          <div className="space-y-20 animate-in zoom-in duration-1000">
                             <div className="relative">
                                <Loader2 size={180} className="text-rose-500 animate-spin mx-auto opacity-40" />
                                <div className="absolute inset-0 flex items-center justify-center text-rose-500 text-4xl font-black italic">{Math.floor(sidStepIndex / SID_STEPS.length * 100)}%</div>
                             </div>
                             <div className="space-y-6">
                                <p className="text-rose-400 font-black text-6xl uppercase tracking-[0.5em] animate-pulse italic m-0 bg-white/5 px-20 py-8 rounded-full border-4 border-rose-500/20 shadow-2xl">{SID_STEPS[sidStepIndex]}</p>
                                <p className="text-[10px] font-mono text-rose-500/40 uppercase tracking-[1em]">HANDSHAKE_ZK_PROTOCOL_v4.2</p>
                             </div>
                          </div>
                       ) : (
                          <div className="animate-in slide-in-from-bottom-20 duration-1000 w-full max-w-7xl mx-auto space-y-16 py-10">
                             <div className="p-20 md:p-32 bg-black/90 rounded-[120px] border-8 border-rose-500/30 shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[48px] border-l-rose-600 italic text-slate-100 text-4xl md:text-6xl leading-tight whitespace-pre-line font-black drop-shadow-2xl text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-45"><Radiation size={400} /></div>
                                <div className="flex items-center gap-6 mb-12 opacity-50 relative z-10">
                                   <BadgeCheck size={32} className="text-emerald-400" />
                                   <span className="text-xs font-mono uppercase tracking-[1em]">SCAN_RESULT_VERIFIED_0x882A</span>
                                </div>
                                <div className="relative z-10">{sidResult?.text}</div>
                             </div>
                             <div className="flex flex-col md:flex-row justify-center gap-12">
                                <button onClick={() => setSidResult(null)} className="px-20 py-8 bg-white/5 border-4 border-white/5 rounded-full text-slate-600 font-black text-sm uppercase tracking-[0.5em] hover:text-white hover:border-white/10 transition-all shadow-2xl">CLEAR_SHARD</button>
                                <button onClick={() => anchorToLedger(sidResult?.text || '', 'SID_SCAN', 'Security')} className="px-32 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_40px_100px_rgba(244,63,94,0.4)] hover:scale-105 transition-all border-4 border-white/10 ring-[32px] ring-rose-500/5 flex items-center gap-6"><Stamp size={32} /> ANCHOR_SECURITY_LOG</button>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* EVIDENCE */}
        {activeTab === 'evidence' && (
           <div className="space-y-12 animate-in zoom-in duration-700 w-full h-full flex flex-col min-h-0">
                 <div className="flex flex-col xl:flex-row gap-12 w-full h-full">

                 <div className="w-full xl:w-[450px] shrink-0 h-full flex flex-col">
                    <div className="glass-card p-12 rounded-[64px] border border-emerald-500/20 bg-emerald-500/5 flex-1 flex flex-col space-y-12 shadow-3xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1)_0%,_transparent_50%)]"></div>
                       <div className="flex items-center gap-8 border-b border-white/5 pb-10 relative z-10 shrink-0">
                          <div className="p-6 bg-emerald-600 rounded-[32px] shadow-[0_20px_50px_rgba(16,185,129,0.3)] text-white group-hover:scale-110 transition-transform duration-500"><CloudUpload size={40} /></div>
                          <div>
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Shard <span className="text-emerald-400 underline decoration-emerald-400/20 underline-offset-4">Vault.</span></h3>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em] mt-3">LEDGER_INGESTION_HUB</p>
                          </div>
                       </div>
                       
                       <div className="space-y-8 relative z-10 flex-1 flex flex-col min-h-0">
                          <p className="text-xs text-slate-500 font-medium italic leading-relaxed px-4">Upload high-fidelity field proofs to the decentralized biological ledger. All shards are spectral-verified upon ingestion.</p>
                          <label className={`w-full py-8 agro-gradient rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(16,185,129,0.3)] flex items-center justify-center gap-6 hover:scale-105 active:scale-95 transition-all cursor-pointer border-4 border-white/10 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                             {isUploading ? <Zap className="animate-spin" size={24} /> : <CloudUpload size={24} />}
                             {isUploading ? `UPLOADING ${uploadProgress.toFixed(0)}%` : 'CREATE_SPECTRAL_PROOF'}
                             <input type="file" className="hidden" onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               await ingestEvidence(file, 'SCIENCE_ORACLE_FIELD_PROOF');
                             }} />
                          </label>
                       </div>
                       
                       <div className="p-8 bg-black/40 rounded-[48px] border border-white/5 space-y-6 relative z-10 shrink-0">
                          <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Vault Status</span><div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div></div>
                          <div className="flex items-center gap-6">
                             <Database size={32} className="text-emerald-400/40" />
                             <p className="text-2xl font-mono font-black text-white">4.8 GB<span className="text-xs text-slate-700 ml-4">FREE_SPACE</span></p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 glass-card rounded-[80px] overflow-hidden border-2 border-white/5 bg-black/40 shadow-[0_60px_150px_rgba(0,0,0,0.8)] min-h-[750px] xl:h-[850px] xl:h-full flex flex-col relative">
                    <div className="p-12 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-8 relative z-20 shrink-0">
                       <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-3xl bg-emerald-600/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner"><Database size={32} /></div>
                          <div>
                             <h4 className="text-3xl font-black text-white uppercase italic tracking-widest m-0">Evidence <span className="text-emerald-400">Ledger</span></h4>
                             <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] mt-2">DECENTRALIZED_SPECTRAL_SHARDS</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="px-6 py-2 bg-black/60 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">Sort: Newest</div>
                          <div className="px-6 py-2 bg-black/60 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">Filter: All</div>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#050706] p-20 flex flex-col items-center justify-center text-center relative z-20 h-full">
                       <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center"><Database size={600} /></div>
                       <div className="space-y-12 group relative z-10">
                          <div className="relative">
                             <div className="absolute inset-0 bg-emerald-500 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                             <ImageIcon size={180} className="text-slate-800 mx-auto transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-6 relative z-10" />
                          </div>
                          <div className="space-y-6">
                             <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic group-hover:tracking-[0.8em] transition-all duration-1000">VAULT_EMPTY</p>
                             <p className="text-sm font-bold text-slate-700 uppercase tracking-[0.4em] max-w-[400px] mx-auto leading-loose">The shards of biological truth wait to be anchored. Initiate a new diagnostic scan or upload proof shrapnel.</p>
                          </div>
                       </div>
                    </div>

                    <div className="absolute bottom-10 left-10 p-6 glass-card rounded-3xl border border-white/5 bg-black/80 backdrop-blur-xl z-30 animate-in slide-in-from-left-4">
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                           <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Lattice_Sync: 100%</span>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* BNL LATTICE */}
        {activeTab === 'lattice' && (
           <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700 w-full h-full flex flex-col min-h-0">
              <div className="glass-card p-12 lg:p-20 rounded-[80px] border-l-[32px] border-l-indigo-600 border border-indigo-500/20 bg-indigo-950/5 shadow-[0_60px_150px_rgba(79,70,229,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[850px] xl:h-[850px] xl:h-full flex-1">
                 <div className="absolute inset-0 z-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#4f46e5_0%,_transparent_70%)]"></div>
                 </div>

                 <div className="flex flex-col xl:flex-row justify-between items-center gap-12 relative z-20 mb-16 shrink-0">
                    <div className="flex items-center gap-10">
                       <div className="p-10 bg-indigo-600 rounded-[48px] shadow-[0_0_80px_rgba(79,70,229,0.5)] border-4 border-indigo-400 group hover:scale-110 transition-transform duration-500"><Cpu size={64} className="text-white group-hover:rotate-12 transition-transform" /></div>
                       <div>
                          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">Bio-Neural <span className="text-indigo-400 underline decoration-indigo-400/20 underline-offset-8">Lattice.</span></h3>
                          <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.8em] mt-5 italic">DISTRIBUTED_SHARD_COMPUTE_MATRIX</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-8">
                       <div className="glass-card p-8 rounded-[40px] border border-indigo-500/30 bg-black/40 backdrop-blur-md min-w-[200px] flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">LATTICE_LOAD</p>
                          <div className="flex items-end gap-2">
                             <p className="text-5xl font-mono font-black text-indigo-400 m-0 leading-none">74.2</p>
                             <span className="text-xl text-indigo-500 font-bold">%</span>
                          </div>
                          </div>
                       <div className="glass-card p-8 rounded-[40px] border border-emerald-500/30 bg-black/40 backdrop-blur-md min-w-[200px] flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">EAC_YIELD_RATE</p>
                          <div className="flex items-end gap-2">
                             <p className="text-5xl font-mono font-black text-emerald-400 m-0 leading-none">2.4</p>
                             <span className="text-xl text-emerald-500 font-bold">/hr</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="glass-card rounded-[80px] min-h-[550px] border-4 border-white/5 bg-[#010202] relative overflow-hidden flex flex-col shadow-inner group/lattice flex-1 xl:mt-8">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* Lattice Visualization Simulation */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse group-hover/lattice:bg-indigo-500/40 transition-colors duration-1000"></div>
                       <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[150px] animate-pulse delay-1000 group-hover/lattice:bg-emerald-500/30 transition-colors duration-1000"></div>
                    </div>
                    
                    <div className="flex-1 relative z-10 flex items-center justify-center p-20 overflow-y-auto no-scrollbar">
                       <div className="grid grid-cols-6 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto my-auto">
                          {Array.from({ length: 72 }).map((_, i) => {
                             const isActive = Math.random() > 0.4;
                             return (
                               <div key={i} className={`aspect-square rounded-3xl border-2 flex items-center justify-center transition-all duration-[2000ms] ${isActive ? 'bg-indigo-600/20 border-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.3)] animate-pulse' : 'bg-black/60 border-white/5'}`}>
                                 <Cpu size={24} className={`transition-all duration-1000 ${isActive ? 'text-indigo-400 scale-110' : 'text-slate-800 scale-75'}`} />
                               </div>
                             );
                          })}
                       </div>
                    </div>
                    
                    <div className="p-12 border-t border-white/5 bg-black/60 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-10 relative z-20 shrink-0">
                       <div className="flex items-center gap-6">
                          <div className="w-4 h-4 rounded-full bg-indigo-500 animate-ping"></div>
                          <p className="text-slate-400 font-mono text-[11px] uppercase tracking-[0.8em]">SEQ: 0x82...FA21_SYNC</p>
                       </div>
                       <div className="flex gap-6">
                          <button className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-white hover:border-white/20 transition-all shadow-xl">LATTICE_METRICS</button>
                          <button className="px-24 py-8 bg-indigo-600 rounded-full text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all border-4 border-indigo-400/30">BOOST_LOCAL_SHARD</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* AR SHARD OVERLAY */}
        {activeTab === 'ar_shard' && (
           <div className="space-y-16 animate-in zoom-in-95 duration-700 w-full h-full flex flex-col min-h-0">
              <div className="glass-card p-12 lg:p-20 rounded-[80px] border-l-[32px] border-l-emerald-600 border border-emerald-500/20 bg-emerald-950/5 shadow-[0_60px_150px_rgba(16,185,129,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[850px] xl:h-[850px] xl:h-full flex-1">
                 <div className="absolute inset-0 z-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)]"></div>
                 </div>

                 <div className="flex flex-col xl:flex-row justify-between items-center gap-12 relative z-20 mb-16 shrink-0">
                    <div className="flex items-center gap-10">
                       <div className="p-10 bg-emerald-600 rounded-[48px] shadow-[0_0_80px_rgba(16,185,129,0.5)] border-4 border-emerald-400 group hover:scale-110 transition-transform duration-500 flex items-center justify-center"><Scan size={64} className="text-white group-hover:rotate-12 transition-transform" /></div>
                       <div>
                          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">WebAR <span className="text-emerald-400 underline decoration-emerald-400/20 underline-offset-8">Overlay.</span></h3>
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.8em] mt-5 italic">SPATIAL_SHARD_VISUALIZATION</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-8">
                       <div className="glass-card p-8 rounded-[40px] border border-emerald-500/30 bg-black/40 backdrop-blur-md min-w-[200px] flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">GIS_LATENCY</p>
                          <div className="flex items-end gap-2">
                             <p className="text-5xl font-mono font-black text-emerald-400 m-0 leading-none">12</p>
                             <span className="text-xl text-emerald-500 font-bold">ms</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="glass-card rounded-[80px] min-h-[600px] border-4 border-white/5 bg-black relative overflow-hidden group flex-1 shadow-inner xl:mt-8">
                    <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/agrofield/1920/1080')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-[10000ms]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 pointer-events-none"></div>
                    
                    {/* Simulated AR Scan Overlay Elements */}
                    <div className="absolute inset-0 z-10 p-12 md:p-20 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <div className="w-48 h-48 border-t-[12px] border-l-[12px] border-emerald-500/60 rounded-tl-[64px] animate-pulse"></div>
                          <div className="flex gap-6">
                             <div className="px-8 py-4 bg-red-500/20 rounded-full border border-red-500/40 text-red-400 font-mono text-[11px] uppercase font-black tracking-widest animate-pulse flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500"></div>REC</div>
                             <div className="px-8 py-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white font-mono text-[11px] uppercase font-black tracking-widest ring-2 ring-white/5">47°36'22"N 122°19'55"W</div>
                          </div>
                          <div className="w-48 h-48 border-t-[12px] border-r-[12px] border-emerald-500/60 rounded-tr-[64px] animate-pulse"></div>
                       </div>
                       
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-1 h-full bg-emerald-500/20 absolute"></div>
                          <div className="w-full h-1 bg-emerald-500/20 absolute"></div>
                          <div className="w-96 h-96 border-4 border-emerald-500/30 rounded-full absolute flex items-center justify-center">
                             <div className="w-6 h-6 bg-emerald-500 rounded-full animate-ping"></div>
                          </div>
                       </div>

                       {/* Spatial Data Tags */}
                       <div className="absolute top-1/4 left-1/4 animate-bounce-slow">
                          <div className="glass-card p-8 rounded-[40px] border-2 border-emerald-500/40 bg-black/60 backdrop-blur-xl space-y-4 shadow-[0_30px_60px_rgba(16,185,129,0.3)]">
                             <div className="flex items-center justify-between gap-8 mb-2">
                                <p className="text-xs text-emerald-400 font-black uppercase tracking-[0.4em] m-0">SOIL_MOISTURE_ZONE</p>
                                <CheckCircle2 size={20} className="text-emerald-500" />
                             </div>
                             <p className="text-5xl font-mono font-black text-white italic">42.8%</p>
                             <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-[42.8%] h-full bg-emerald-500 shadow-[0_0_20px_#10b981]"></div>
                             </div>
                          </div>
                       </div>

                       <div className="absolute bottom-1/3 right-[15%] animate-bounce-slow delay-700">
                          <div className="glass-card p-8 rounded-[40px] border-2 border-indigo-500/40 bg-black/60 backdrop-blur-xl space-y-4 shadow-[0_30px_60px_rgba(79,70,229,0.3)]">
                             <div className="flex items-center justify-between gap-8 mb-2">
                                <p className="text-xs text-indigo-400 font-black uppercase tracking-[0.4em] m-0">NEURAL_RESONANCE_NODE</p>
                                <Zap size={20} className="text-indigo-500" />
                             </div>
                             <p className="text-5xl font-mono font-black text-white italic">0.92<span className="text-2xl text-slate-400">Cr</span></p>
                          </div>
                       </div>

                       <div className="flex justify-between items-end">
                          <div className="w-48 h-48 border-b-[12px] border-l-[12px] border-emerald-500/60 rounded-bl-[64px] animate-pulse"></div>
                          <div className="glass-card px-16 py-8 rounded-full border-emerald-500/30 bg-black/80 backdrop-blur-xl flex items-center gap-8 mb-12 group/scan cursor-pointer hover:bg-emerald-900/40 transition-colors shadow-2xl relative z-20">
                             <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-sm font-black text-white uppercase tracking-[0.5em] group-hover/scan:text-emerald-400 transition-colors">INITIATE_FULL_SCAN</span>
                          </div>
                          <div className="w-48 h-48 border-b-[12px] border-r-[12px] border-emerald-500/60 rounded-br-[64px] animate-pulse"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* POS ORACLE VERIFICATION */}
        {activeTab === 'pos_verif' && (
           <div className="space-y-16 animate-in fade-in duration-700 w-full h-full flex flex-col min-h-0">
              <div className="glass-card p-12 lg:p-20 rounded-[80px] border-l-[32px] border-l-amber-500 border border-amber-500/20 bg-amber-950/5 shadow-[0_60px_150px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[850px] xl:h-[850px] xl:h-full flex-1">
                 <div className="absolute inset-0 z-0 opacity-10">
                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#f59e0b_0%,_transparent_70%)]"></div>
                 </div>

                 <div className="flex flex-col xl:flex-row justify-between items-center gap-12 relative z-20 mb-16 shrink-0">
                    <div className="flex items-center gap-10">
                       <div className="p-10 bg-amber-500 rounded-[48px] shadow-[0_0_80px_rgba(245,158,11,0.5)] border-4 border-amber-300 group hover:scale-110 transition-transform duration-500 flex items-center justify-center"><Stamp size={64} className="text-white group-hover:rotate-12 transition-transform" /></div>
                       <div>
                          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">PoS <span className="text-amber-400 underline decoration-amber-400/20 underline-offset-8">Oracle.</span></h3>
                          <p className="text-xs font-black text-amber-500 uppercase tracking-[0.8em] mt-5 italic">PROOF_OF_STEWARDSHIP_CONSENSUS</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-8">
                       <div className="glass-card p-8 rounded-[40px] border border-amber-500/30 bg-black/40 backdrop-blur-md min-w-[200px] flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">VERIFIER_NODE</p>
                          <div className="flex items-center gap-4">
                             <div className="w-4 h-4 rounded-full bg-amber-400 animate-pulse"></div>
                             <p className="text-4xl font-black text-amber-400 m-0 tracking-widest">ACTIVE</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 flex-1 relative z-20 xl:mt-8">
                    <div className="glass-card p-16 rounded-[64px] border-4 border-white/5 bg-black/60 space-y-12 shadow-3xl flex flex-col justify-between h-full">
                       <div className="space-y-10 flex-1">
                          <div className="flex items-center gap-8">
                             <div className="p-6 bg-amber-600/20 rounded-[32px] border border-amber-500/30 shadow-inner"><BadgeCheck size={40} className="text-amber-400" /></div>
                             <div>
                                <h4 className="text-4xl font-black text-white uppercase italic m-0">Pending Validation</h4>
                                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.4em] mt-2">Shard_Batch: #POS-9921</p>
                             </div>
                          </div>
                          
                          <div className="p-10 rounded-[48px] bg-black/80 border border-white/5 space-y-8 shadow-inner">
                             <div className="flex justify-between items-center text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                                <span>Task Type</span>
                                <span className="text-white italic">REGENERATIVE_PLANTING</span>
                             </div>
                             <div className="w-full h-[1px] bg-white/5"></div>
                             <div className="flex justify-between items-center text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                                <span>Steward</span>
                                <span className="text-white italic">{user.name}</span>
                             </div>
                             <div className="w-full h-[1px] bg-white/5"></div>
                             <div className="flex justify-between items-center text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                                <span>Reward Depth</span>
                                <span className="text-amber-400 italic font-mono text-xl">450 EAC</span>
                             </div>
                          </div>
                       </div>
                       
                       <button className="w-full py-10 bg-amber-500/10 border-2 border-amber-500/50 rounded-full text-amber-400 font-black text-lg uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(245,158,11,0.2)] hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all shrink-0">Submit Proof Shard</button>
                    </div>

                    <div className="glass-card p-16 rounded-[64px] border-4 border-white/5 bg-[#050706] space-y-12 shadow-3xl text-center flex flex-col items-center justify-center group hover:bg-black/60 transition-colors duration-1000 h-full">
                       <div className="relative">
                          <div className="absolute inset-0 bg-amber-500/20 blur-[80px] group-hover:bg-amber-500/40 transition-colors duration-1000 rounded-full"></div>
                          <Stamp size={180} className="text-amber-500/40 group-hover:text-amber-400 relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000" />
                       </div>
                       <div className="space-y-6">
                          <p className="text-4xl font-black text-slate-600 uppercase italic tracking-[0.4em] group-hover:text-white transition-colors duration-700">AWAITING_CHALLENGE</p>
                          <p className="text-slate-500 text-sm italic font-medium max-w-[400px] leading-loose">Connect your field bot or oracle to broadcast real-time biometric stewardship shards into the consensus array.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
      <AIAssistant userEsin={user.esin} />
    </div>
  );
};

export default Intelligence;