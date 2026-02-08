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
  Globe2, ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar } from 'recharts';
import { chatWithAgroExpert, AIResponse, searchAgroTrends } from '../services/geminiService';
import { User, AgroResource, ViewState } from '../types';
import { backupTelemetryShard, fetchTelemetryBackup } from '../services/firebaseService';

interface IntelligenceProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onOpenEvidence?: () => void;
  onNavigate: (view: ViewState) => void;
}

type TabState = 'twin' | 'simulator' | 'sid' | 'evidence' | 'eos_ai' | 'telemetry' | 'trends';
type OracleMode = 'REGISTRY_AUDIT' | 'BIO_RESONANCE' | 'SEHTI_STRATEGY' | 'MARKET_PREDICT';

const ORACLE_QUERY_COST = 25;

const NEURAL_STEPS = [
  "Initializing Handshake...",
  "Ingesting Node Telemetry...",
  "Consulting EOS Registry...",
  "Sequencing Multi-Thrust Neurals...",
  "Performing Quantum Integrity Sweep...",
  "Finalizing Output Shard..."
];

const Intelligence: React.FC<IntelligenceProps> = ({ user, onEarnEAC, onSpendEAC, onOpenEvidence, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabState>('simulator');
  
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
    if (activeTab === 'telemetry' && selectedIotNode) {
      const interval = setInterval(() => {
        const metrics = ['Temperature', 'Soil Purity', 'm-Constant Drift', 'Photosynthetic Flux'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * 100).toFixed(2);
        const newLog = { timestamp: new Date().toLocaleTimeString(), metric, value };
        setTelemetryLogs(prev => {
           const updated = [newLog, ...prev].slice(0, 8);
           if (user) backupTelemetryShard(user.esin, { logs: updated, node: selectedIotNode.id });
           return updated;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedIotNode, user]);

  // --- DIGITAL TWIN STATES ---
  const [isTwinSyncing, setIsTwinSyncing] = useState(false);
  const [twinResonance, setTwinResonance] = useState(94.2);

  const handleTwinRefresh = () => {
    setIsTwinSyncing(true);
    setTimeout(() => {
      setTwinResonance(94 + Math.random() * 5);
      setIsTwinSyncing(false);
      onEarnEAC(5, 'TWIN_MODEL_CALIBRATION');
    }, 2000);
  };

  // --- SIMULATOR STATES ---
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
      const prompt = `EOS Oracle: Analyze C(a)=${simProjectionData[n_cycles].ca}, m=${simProjectionData[n_cycles].m}. recommended SEHTI intervention?`;
      const res = await chatWithAgroExpert(prompt, []);
      setSimulationReport(res.text);
    } catch (e) {
      setSimulationReport("Handshake error.");
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // --- SID STATES ---
  const [sidLoad, setSidLoad] = useState(user.metrics.viralLoadSID);

  // --- SCIENCE ORACLE (EOS AI) ENHANCED STATES ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [oracleMode, setOracleMode] = useState<OracleMode>('BIO_RESONANCE');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // --- TREND INGEST STATES ---
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
      setTrendsResult({ text: "Global trend link timed out. Mesh synchronization required." });
    } finally {
      setIsIngestingTrends(false);
    }
  };

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() || aiThinking) return;
    if (!await onSpendEAC(ORACLE_QUERY_COST, "ORACLE_INQUIRY")) return;
    
    setAiThinking(true);
    setAiResult(null);
    setCurrentStepIndex(0);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev < NEURAL_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const contextPrompt = `[MODE: ${oracleMode}] [NODE: ${user.esin}] [LOC: ${user.location}] 
      Process the following agricultural query within the EnvirosAgro scientific framework. 
      Query: ${aiQuery}`;
      
      const res = await chatWithAgroExpert(contextPrompt, [], true);
      setAiResult(res);
      onEarnEAC(5, "ORACLE_INSIGHT_ANCHORED");
    } catch (e) {
      setAiResult({ text: "Oracle sync timeout. Ledger congested." });
    } finally {
      clearInterval(stepInterval);
      setAiThinking(false);
    }
  };

  const handleDownloadShard = () => {
    if (!aiResult) return;
    const blob = new Blob([`ENVIROSAGRO_ORACLE_SHARD\nID: 0x${Math.random().toString(16).slice(2,10).toUpperCase()}\nMODE: ${oracleMode}\nTIMESTAMP: ${new Date().toISOString()}\n\nVERDICT:\n${aiResult.text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORACLE_SHARD_${oracleMode}_${new Date().getTime()}.txt`;
    a.click();
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
           <div className="space-y-4 relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0">Science <span className="text-emerald-400">& Intelligence</span></h2>
              <p className="text-slate-400 text-xl font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                 "Executing technical sharding and biological simulation protocols for node {user.esin}."
              </p>
           </div>
        </div>
        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2 relative z-10">Node Ingest Status</p>
           <h4 className="text-6xl font-mono font-black text-white tracking-tighter relative z-10 leading-none">99<span className="text-xl text-emerald-500 italic">.9</span></h4>
           <div className="flex items-center justify-center gap-3 text-emerald-400 text-[10px] font-black uppercase relative z-10 tracking-widest border border-emerald-500/20 bg-emerald-500/5 py-2 px-4 rounded-full shadow-inner">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> ACTIVE_SYNC
           </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit border border-white/5 bg-black/40 shadow-xl mx-auto lg:mx-0">
        {[
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
        
        {/* --- TAB: TREND INGEST --- */}
        {activeTab === 'trends' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px] shadow-3xl">
                <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
                
                {!trendsResult && !isIngestingTrends ? (
                  <div className="text-center space-y-10 relative z-10 py-20">
                     <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl border-4 border-white/10 mx-auto group-hover:scale-110 transition-transform">
                        <TrendingUp size={64} className="text-white" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Trend <span className="text-indigo-400">Ingest</span></h3>
                        <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto">
                           "Synchronizing latest innovations in regenerative farming and blockchain carbon tracking via global mesh search grounding."
                        </p>
                     </div>
                     <button 
                       onClick={handleIngestTrends}
                       className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10"
                     >
                        <Globe2 size={24} /> INITIALIZE TREND SYNC
                     </button>
                  </div>
                ) : isIngestingTrends ? (
                  <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in fade-in">
                     <div className="relative">
                        <Loader2 size={120} className="text-indigo-500 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Activity size={40} className="text-indigo-400 animate-pulse" />
                        </div>
                     </div>
                     <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.8em] animate-pulse italic">CRAWLING GLOBAL SHARDS...</p>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-10 w-full px-6 py-10">
                     <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 prose prose-invert max-w-none shadow-3xl border-l-[12px] border-l-indigo-600 relative overflow-hidden group/shard">
                        <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                           <div className="flex items-center gap-6">
                              <Bot size={40} className="text-indigo-400" />
                              <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter">Strategic Trend Shard</h4>
                           </div>
                           <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                              <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">GROUNDED_SYNC_STABLE</span>
                           </div>
                        </div>

                        <div className="text-slate-300 text-xl md:text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/5">
                           {trendsResult?.text}
                        </div>

                        {trendsResult?.sources && trendsResult.sources.length > 0 && (
                          <div className="mt-16 pt-10 border-t border-white/10 relative z-10 space-y-6">
                             <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Grounding Sources / Verification Nodes:</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {trendsResult.sources.map((s, i) => (
                                   <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group/link hover:border-indigo-500/40 transition-all">
                                      <div className="flex items-center gap-4">
                                         <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover/link:scale-110 transition-transform"><Globe size={18} /></div>
                                         <div className="max-w-[150px]">
                                            <p className="text-xs font-black text-slate-300 uppercase italic truncate leading-none">{s.web?.title || 'Registry Shard'}</p>
                                            <p className="text-[8px] text-slate-600 font-mono mt-1 truncate">{s.web?.uri}</p>
                                         </div>
                                      </div>
                                      <ExternalLink size={14} className="text-slate-700 group-hover/link:text-indigo-400 transition-all" />
                                   </a>
                                ))}
                             </div>
                          </div>
                        )}
                     </div>
                     <div className="flex justify-center">
                        <button onClick={() => setTrendsResult(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">DISCARD ANALYSIS</button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* --- TAB: DIGITAL TWIN --- */}
        {activeTab === 'twin' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500 text-center">
             <div className="glass-card p-16 rounded-[80px] border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[650px] shadow-3xl group">
                <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                <div className="w-64 h-64 relative flex items-center justify-center mb-12">
                   <div className={`w-48 h-48 rounded-[64px] border-4 transition-all duration-[2s] shadow-[0_0_100px_rgba(16,185,129,0.3)] flex items-center justify-center ${isTwinSyncing ? 'scale-110 bg-emerald-500/20 border-emerald-400' : 'bg-black/60 border-emerald-500/40'}`}>
                      <Box size={80} className="text-emerald-500 animate-pulse" />
                   </div>
                   <div className="absolute inset-[-30px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                   <div className="absolute inset-[-60px] border-2 border-dotted border-indigo-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                </div>
                <div className="space-y-4">
                   <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Universal <span className="text-emerald-400">Mirror Node</span></h3>
                   <p className="text-slate-400 text-xl font-medium italic">"Real-time biological digital twin of node {user.esin}."</p>
                </div>
                <div className="grid grid-cols-3 gap-8 w-full max-w-2xl mt-12 py-10 border-y border-white/5">
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Mirror Drift</p>
                      <p className="text-3xl font-mono font-black text-emerald-400">0.02%</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Resonance Score</p>
                      <p className="text-3xl font-mono font-black text-indigo-400">{twinResonance.toFixed(1)}%</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Last Calibration</p>
                      <p className="text-3xl font-mono font-black text-white">Just now</p>
                   </div>
                </div>
                <button 
                  onClick={handleTwinRefresh}
                  disabled={isTwinSyncing}
                  className="mt-12 px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                   {isTwinSyncing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={16} />}
                   {isTwinSyncing ? 'Recalibrating Mirror...' : 'RE-CALIBRATE TWIN'}
                </button>
             </div>
          </div>
        )}

        {/* --- TAB: SIMULATOR --- */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                   <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 shadow-xl">
                      <Cpu size={24} />
                   </div>
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
                <button 
                  onClick={handleRunFullSimulation} 
                  disabled={isRunningSimulation} 
                  className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isRunningSimulation ? <Loader2 className="animate-spin" /> : <Zap size={20} className="fill-current" />} RUN ENGINE
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 h-[500px] shadow-3xl">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simProjectionData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="cycle" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '15px' }} />
                    <Area type="monotone" name="Sustainability Index" dataKey="score" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" strokeLinecap="round" />
                    <Area type="monotone" name="Resilience Factor (m)" dataKey="m" stroke="#3b82f6" strokeWidth={3} fill="#3b82f605" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {simulationReport && (
                <div className="p-10 glass-card border-l-8 border-emerald-500 bg-emerald-500/[0.02] animate-in slide-in-from-left-6 duration-700 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Sparkles size={120} className="text-emerald-400" /></div>
                  <div className="flex items-center gap-4 mb-6">
                    <Bot className="w-8 h-8 text-emerald-400" />
                    <h4 className="text-xl font-black text-white uppercase italic">Simulator Oracle Verdict</h4>
                  </div>
                  <p className="text-slate-300 text-lg italic leading-relaxed whitespace-pre-line border-l border-white/5 pl-8 font-medium">{simulationReport}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: IOT TELEMETRY (INGEST) --- */}
        {activeTab === 'telemetry' && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
              <div className="lg:col-span-1 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase italic px-4 flex items-center gap-4">
                       <Database size={20} className="text-blue-400" /> Active Nodes
                    </h3>
                    <div className="space-y-4">
                       {hardwareNodes.length === 0 ? (
                         <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                            <Smartphone size={48} className="text-slate-600" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Paired Hardware</p>
                         </div>
                       ) : hardwareNodes.map(n => (
                         <button 
                           key={n.id} 
                           onClick={() => setSelectedIotNode(n)} 
                           className={`w-full p-6 rounded-[32px] border-2 transition-all text-left group ${selectedIotNode?.id === n.id ? 'bg-blue-600 border-white text-white shadow-xl scale-105' : 'bg-black/60 border-white/5 text-slate-500 hover:border-blue-500/20 hover:bg-blue-500/5'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl transition-all ${selectedIotNode?.id === n.id ? 'bg-white/10' : 'bg-white/5 group-hover:rotate-6'}`}><Smartphone size={20} /></div>
                               <div>
                                  <p className="text-xs font-black uppercase tracking-widest">{n.name}</p>
                                  <p className="text-[9px] font-mono opacity-60 mt-1">{n.id}</p>
                               </div>
                            </div>
                         </button>
                       ))}
                    </div>
                    <button onClick={() => onNavigate('registry_handshake')} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">PAIR NEW DEVICE</button>
                 </div>
              </div>

              <div className="lg:col-span-3 glass-card p-12 rounded-[64px] bg-[#050706] border-2 border-white/5 flex flex-col shadow-3xl min-h-[650px] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none animate-scan"></div>
                 <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-8 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform">
                          <Terminal size={32} />
                       </div>
                       <div>
                          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Local <span className="text-blue-400">Ingest Buffer</span></h3>
                          <p className="text-[10px] text-blue-500/60 font-mono tracking-[0.4em] uppercase mt-3">TARGET_NODE: {selectedIotNode?.id || 'STANDBY'}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 font-mono text-[10px] font-black uppercase tracking-widest animate-pulse">
                          STREAMING_OK
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 space-y-4 font-mono text-[11px] overflow-y-auto custom-scrollbar relative z-10 bg-black/40 rounded-[48px] p-8 shadow-inner">
                    {telemetryLogs.map((log, i) => (
                      <div key={i} className="flex gap-10 p-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group/log animate-in slide-in-from-right-2">
                        <span className="text-slate-700 w-24 shrink-0 font-bold">[{log.timestamp}]</span>
                        <span className="text-blue-400 w-40 shrink-0 font-bold uppercase italic tracking-widest">[{log.metric}]</span>
                        <div className="flex-1 text-slate-300">
                           PACKET_VAL: <span className="text-emerald-400 font-black">{log.value}</span> // ZK_SESSION: SYNC_A882
                        </div>
                        <CheckCircle2 size={16} className="text-emerald-500/40 group-hover/log:text-emerald-400 transition-colors" />
                      </div>
                    ))}
                    {telemetryLogs.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
                          <Activity size={100} className="animate-pulse" />
                          <p className="text-2xl font-black uppercase tracking-[0.5em]">Awaiting Ingest...</p>
                       </div>
                    )}
                 </div>

                 <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-10 px-4">
                    <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">Proprietary Telemetry Protocol v5.2 // End-to-End Shard encryption Active</p>
                    <button className="text-[10px] font-black text-blue-400 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
                       Clear Local Buffer <Trash2 size={14} />
                    </button>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: SCIENCE ORACLE (EOS AI) --- */}
        {activeTab === 'eos_ai' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left: Control Panel */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-10 shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700"><Settings size={300} className="text-indigo-400" /></div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Brain size={32} className="text-white" /></div>
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Inquiry <span className="text-indigo-400">Control</span></h3>
                      </div>

                      <div className="space-y-6 relative z-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Diagnostic Mode</label>
                            <div className="grid grid-cols-1 gap-3">
                               {[
                                 { id: 'BIO_RESONANCE', label: 'Bio-Resonance', icon: Sprout, col: 'text-emerald-400' },
                                 { id: 'REGISTRY_AUDIT', label: 'Registry Audit', icon: ShieldCheck, col: 'text-blue-400' },
                                 { id: 'SEHTI_STRATEGY', label: 'SEHTI Strategy', icon: Network, col: 'text-indigo-400' },
                                 { id: 'MARKET_PREDICT', label: 'Market Prediction', icon: TrendingUp, col: 'text-amber-500' },
                               ].map(mode => (
                                 <button 
                                   key={mode.id}
                                   onClick={() => setOracleMode(mode.id as OracleMode)}
                                   className={`flex items-center justify-between p-5 rounded-[28px] border-2 transition-all ${oracleMode === mode.id ? 'bg-indigo-600/10 border-indigo-500 shadow-xl' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                                 >
                                    <div className="flex items-center gap-4">
                                       <mode.icon size={20} className={oracleMode === mode.id ? 'text-indigo-400' : 'text-slate-700'} />
                                       <span className={`text-[11px] font-black uppercase tracking-widest ${oracleMode === mode.id ? 'text-white' : ''}`}>{mode.label}</span>
                                    </div>
                                    {oracleMode === mode.id && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="pt-8 border-t border-white/5 space-y-6 relative z-10">
                         <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex justify-between items-center shadow-inner">
                            <div className="flex items-center gap-3">
                               <Coins size={16} className="text-emerald-500" />
                               <span className="text-[10px] font-black text-slate-500 uppercase">Sharding Fee</span>
                            </div>
                            <span className="text-xl font-mono font-black text-white">{ORACLE_QUERY_COST} EAC</span>
                         </div>
                      </div>
                   </div>

                   <div className="p-10 glass-card rounded-[56px] border border-emerald-500/10 bg-emerald-500/5 space-y-6 shadow-xl group">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:rotate-12 transition-transform"><Sparkles size={24} className="text-emerald-500" /></div>
                         <h4 className="text-xl font-black text-white uppercase italic m-0">Neural <span className="text-emerald-400">Integrity</span></h4>
                      </div>
                      <p className="text-sm text-slate-400 italic leading-relaxed font-medium">
                         "The Science Oracle utilizes high-frequency thinking budgets to ensure diagnostic shards possess 99% accuracy before registry anchoring."
                      </p>
                   </div>
                </div>

                {/* Right: Terminal Area */}
                <div className="lg:col-span-8">
                   <div className="glass-card rounded-[64px] min-h-[850px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                      
                      {/* Terminal Scanline FX */}
                      <div className="absolute inset-0 pointer-events-none z-10">
                        <div className="w-full h-[2px] bg-indigo-500/20 absolute top-0 animate-scan"></div>
                      </div>

                      <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0 relative z-20">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                               <Bot size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                               <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                            <div>
                               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Science <span className="text-indigo-400">Oracle Shard</span></h3>
                               <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_NEURAL_LINK // MODE: {oracleMode}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            {aiResult && (
                              <button onClick={handleDownloadShard} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"><Download size={20} /></button>
                            )}
                            <div className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                               <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_STABLE</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-20 flex flex-col">
                         {!aiResult && !aiThinking ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 opacity-30 group">
                               <div className="relative">
                                  <BrainCircuit size={140} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-700" />
                                  <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                               </div>
                               <div className="space-y-4">
                                  <p className="text-5xl font-black uppercase tracking-[0.5em] text-white italic">TERMINAL_STANDBY</p>
                                  <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Inquire with the Oracle for industrial diagnostics</p>
                               </div>
                            </div>
                         ) : aiThinking ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                               <div className="relative">
                                  <div className="w-64 h-64 rounded-full border-8 border-indigo-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.2)]">
                                     <Brain size={100} className="text-indigo-500 animate-pulse" />
                                  </div>
                                  <div className="absolute inset-[-10px] border-t-8 border-indigo-500 rounded-full animate-spin"></div>
                               </div>
                               <div className="space-y-8">
                                  <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">{NEURAL_STEPS[currentStepIndex]}</p>
                                  <div className="flex justify-center gap-2">
                                     {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-12 bg-indigo-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         ) : (
                            <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 flex-1">
                               <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border-2 border-white/5 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-8 border-l-indigo-600/50 relative overflow-hidden group/shard">
                                  <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[10s]"><Activity size={600} className="text-indigo-400" /></div>
                                  
                                  <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                     <div className="flex items-center gap-6">
                                        <FileDigit size={32} className="text-indigo-400" />
                                        <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Diagnostic Result</h4>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-slate-500 font-black uppercase">Consensus Confidence</p>
                                        <p className="text-2xl font-mono font-black text-emerald-400">99.8%</p>
                                     </div>
                                  </div>

                                  <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-4 border-l border-white/10">
                                     {aiResult.text}
                                  </div>

                                  {aiResult.sources && aiResult.sources.length > 0 && (
                                     <div className="mt-16 pt-10 border-t border-white/10 relative z-10 space-y-6">
                                        <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">Grounding Shards / Registry Ref:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           {aiResult.sources.map((s, i) => (
                                              <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center justify-between group hover:border-indigo-500/40 transition-all">
                                                 <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Globe size={18} /></div>
                                                    <span className="text-xs font-black text-slate-300 uppercase italic truncate max-w-[200px]">{s.web?.title || 'Registry Shard'}</span>
                                                 </div>
                                                 <ArrowUpRight size={18} className="text-slate-700 group-hover:text-indigo-400 transition-all" />
                                              </a>
                                           ))}
                                        </div>
                                     </div>
                                  )}
                               </div>

                               <div className="flex justify-center gap-8">
                                  <button onClick={() => setAiResult(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                  <button onClick={handleDownloadShard} className="px-16 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-white/5">
                                     <Stamp size={24} /> ANCHOR TO LEDGER
                                  </button>
                               </div>
                            </div>
                         )}
                      </div>

                      <div className="p-10 border-t border-white/5 bg-black/90 relative z-20 shrink-0">
                         <div className="max-w-4xl mx-auto relative group">
                            <textarea 
                               value={aiQuery}
                               onChange={e => setAiQuery(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleDeepAIQuery())}
                               placeholder="Input diagnostic query or technical observation shard..."
                               className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 pl-10 pr-28 text-xl text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 resize-none h-32 shadow-inner italic" 
                            />
                            <button 
                               onClick={handleDeepAIQuery}
                               disabled={aiThinking || !aiQuery.trim()}
                               className={`absolute right-6 bottom-6 p-7 rounded-[32px] text-white shadow-3xl transition-all disabled:opacity-30 active:scale-90 ring-4 ring-indigo-500/5 group-hover:scale-105 ${aiThinking ? 'bg-indigo-900/50' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                            >
                               {aiThinking ? <Loader2 className="w-10 h-10 animate-spin" /> : <Send size={36} />}
                            </button>
                         </div>
                         <div className="mt-6 flex justify-between items-center px-10">
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">Proprietary Oracle v5.2 // End-to-End Shard encryption Active</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: SID SCANNER --- */}
        {activeTab === 'sid' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700 text-center">
              <div className="p-20 glass-card rounded-[80px] border-rose-500/20 bg-rose-950/5 relative overflow-hidden flex flex-col items-center justify-center space-y-12 shadow-3xl group">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s]"><Radiation size={500} className="text-rose-500" /></div>
                 <div className="w-32 h-32 rounded-[48px] bg-rose-600 flex items-center justify-center shadow-[0_0_80px_rgba(244,63,94,0.4)] border-4 border-white/10 relative z-10 animate-pulse">
                    <Radiation size={64} className="text-white" />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">SID <span className="text-rose-500">Scanner</span></h3>
                    <p className="text-slate-400 text-2xl font-medium italic">"Mitigating Social Influenza Disease (S) in your local cluster."</p>
                 </div>
                 <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative z-10 py-10 border-y border-white/5">
                    <div className="p-8 bg-black/60 rounded-[40px] border border-rose-500/20 shadow-inner">
                       <p className="text-[11px] text-slate-500 font-black uppercase mb-1">Pathogen Load (S)</p>
                       <p className="text-6xl font-mono font-black text-rose-500 tracking-tighter">{sidLoad}%</p>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 shadow-inner">
                       <p className="text-[11px] text-slate-500 font-black uppercase mb-1">Social Immunity (x)</p>
                       <p className="text-6xl font-mono font-black text-emerald-400 tracking-tighter">{user.metrics.socialImmunity}%</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => { setSidLoad(Math.max(5, sidLoad - 5)); onEarnEAC(2, 'SID_MITIGATION_PROTOCOL'); }}
                  className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 relative z-10"
                 >
                    <ShieldAlert size={24} className="animate-bounce" /> EXECUTE REMEDIATION PROTOCOL
                 </button>
              </div>
           </div>
        )}

        {/* --- TAB: EVIDENCE VAULT --- */}
        {activeTab === 'evidence' && (
           <div className="max-w-4xl mx-auto py-20 text-center space-y-12 animate-in zoom-in duration-500">
              <div className="w-40 h-40 bg-white/5 rounded-[48px] flex items-center justify-center mx-auto border-2 border-dashed border-white/10 text-slate-700 shadow-inner group hover:border-emerald-500/30 transition-all duration-700">
                 <CloudUpload size={80} className="group-hover:scale-110 group-hover:text-emerald-500 transition-all" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter">Evidence <span className="text-emerald-400">Vault</span></h3>
                 <p className="text-slate-500 text-xl font-medium italic">"Immutable registry of field shards sharded for carbon validation."</p>
              </div>
              <button 
                onClick={onOpenEvidence}
                className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all"
              >
                 INITIALIZE FIELD INGEST
              </button>
              <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 flex items-center justify-between px-16 shadow-xl">
                 <div className="text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Archived Shards</p>
                    <p className="text-4xl font-mono font-black text-white">42</p>
                 </div>
                 <div className="h-12 w-px bg-white/10"></div>
                 <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Registry Output</p>
                    <p className="text-4xl font-mono font-black text-emerald-400">100%</p>
                 </div>
              </div>
           </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .shadow-3xl { box-shadow: 0 40px 150px -20px rgba(0, 0, 0, 0.9); }
      `}</style>
    </div>
  );
};

export default Intelligence;