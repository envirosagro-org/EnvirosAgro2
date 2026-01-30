
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  AlertTriangle,
  Play,
  RotateCcw,
  Mountain,
  FileDown,
  Scale,
  Stamp,
  Satellite,
  Wifi,
  Radio,
  Unlink,
  SmartphoneNfc,
  BoxSelect,
  Boxes,
  Maximize2
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
  Radar as RechartsRadar,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { chatWithAgroExpert, analyzeMedia, AIResponse } from '../services/geminiService';
import { User, AgroResource } from '../types';

interface IntelligenceProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
  onOpenEvidence?: () => void;
}

type TabState = 'twin' | 'simulator' | 'sid' | 'evidence' | 'eos_ai' | 'telemetry';

const ORACLE_QUERY_COST = 25;

const Intelligence: React.FC<IntelligenceProps> = ({ user, onSpendEAC, onEarnEAC, onOpenEvidence }) => {
  const [activeTab, setActiveTab] = useState<TabState>('simulator');
  
  // --- IOT TELEMETRY STATES ---
  const hardwareNodes = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'HARDWARE'),
    [user.resources]
  );
  const [selectedIotNode, setSelectedIotNode] = useState<AgroResource | null>(hardwareNodes[0] || null);
  const [isSyncingNode, setIsSyncingNode] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<{timestamp: string, metric: string, value: string}[]>([]);

  // Simulation of incoming telemetry data
  useEffect(() => {
    if (activeTab === 'telemetry' && selectedIotNode) {
      const interval = setInterval(() => {
        const metrics = ['Temperature', 'Soil Purity', 'm-Constant Drift', 'Photosynthetic Flux'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];
        const value = (Math.random() * 100).toFixed(2);
        const newLog = {
          timestamp: new Date().toLocaleTimeString(),
          metric,
          value
        };
        setTelemetryLogs(prev => [newLog, ...prev].slice(0, 8));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, selectedIotNode]);

  // --- DIGITAL TWIN STATES ---
  const [isTwinSyncing, setIsTwinSyncing] = useState(false);
  const [twinResonance, setTwinResonance] = useState(94.2);
  const [activeLayer, setActiveLayer] = useState<'biological' | 'structural' | 'thermal'>('biological');

  const handleTwinRefresh = () => {
    setIsTwinSyncing(true);
    setTimeout(() => {
      setTwinResonance(94 + Math.random() * 5);
      setIsTwinSyncing(false);
      onEarnEAC(5, 'TWIN_MODEL_CALIBRATION');
    }, 2000);
  };

  // --- SUSTAINABILITY EQUATION SIMULATOR STATES ---
  const [x_immunity, setXImmunity] = useState(0.85); // Social Immunity
  const [r_resonance, setRResonance] = useState(1.12); // Growth Rate
  const [n_cycles, setNCycles] = useState(12); // Time
  const [dn_density, setDnDensity] = useState(0.92); // Land Efficiency
  const [in_intensity, setInIntensity] = useState(0.78); // Yield Science
  const [s_stress, setSStress] = useState(0.12); // Degradation
  
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [simulationReport, setSimulationReport] = useState<string | null>(null);

  const calculateCa = (n: number) => {
    if (r_resonance === 1) return x_immunity * n + 1;
    return x_immunity * ((Math.pow(r_resonance, n) - 1) / (r_resonance - 1)) + 1;
  };

  const calculateM = (ca: number) => {
    const stress = Math.max(s_stress, 0.01);
    return Math.sqrt((dn_density * in_intensity * ca) / stress);
  };

  const simProjectionData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= n_cycles; i++) {
      const ca = calculateCa(i);
      const m = calculateM(ca);
      data.push({
        cycle: i,
        ca: Number(ca.toFixed(2)),
        m: Number(m.toFixed(2)),
        score: Math.min(100, (m * 10))
      });
    }
    return data;
  }, [x_immunity, r_resonance, n_cycles, dn_density, in_intensity, s_stress]);

  const currentMetrics = useMemo(() => {
    const last = simProjectionData[simProjectionData.length - 1];
    const prev = simProjectionData[Math.max(0, simProjectionData.length - 2)];
    return {
      ca: last.ca,
      m: last.m,
      velocity: (last.ca - prev.ca).toFixed(2)
    };
  }, [simProjectionData]);

  // --- SID STATES ---
  const [sidLoad, setSidLoad] = useState(35);
  const [remediationStep, setRemediationStep] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [transmissionIndex, setTransmissionIndex] = useState(40);
  const [overcrowdingIndex, setOvercrowdingIndex] = useState(30);
  const [languageVolatility, setLanguageVolatility] = useState(25);
  const immutabilityIndex = Math.min(100, (transmissionIndex * 0.4) + (overcrowdingIndex * 0.3) + (languageVolatility * 0.3));

  // --- EVIDENCE STATES ---
  const [evidenceList] = useState([
    { id: 'SHD-842', type: 'Soil Scan', date: '2h ago', status: 'VERIFIED', node: 'Node_Paris_04' },
    { id: 'SHD-912', type: 'Thermal Map', date: '5h ago', status: 'PENDING', node: 'Stwd_Nairobi' },
    { id: 'SHD-004', type: 'DNA Sequence', date: '1d ago', status: 'AUDITING', node: 'Global_Core' },
  ]);

  // --- EOS AI STATES ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'authorizing' | 'success' | 'failed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRunFullSimulation = async () => {
    setIsRunningSimulation(true);
    setSimulationReport(null);
    
    if (!onSpendEAC(50, 'FULL_SUSTAINABILITY_SIMULATION_INGEST')) {
        setIsRunningSimulation(false);
        return;
    }

    try {
      const prompt = `Act as an EnvirosAgro Framework Oracle. Analyze simulation results:
      Shard: C(a)=${currentMetrics.ca}, m=${currentMetrics.m}, velocity=${currentMetrics.velocity}
      Params: x=${x_immunity}, r=${r_resonance}, Dn=${dn_density}, In=${in_intensity}, S=${s_stress}
      Interpret the trajectory. Is the node accelerating toward a sustainable steady state? Recommend SEHTI interventions.`;
      const response = await chatWithAgroExpert(prompt, []);
      setSimulationReport(response.text);
    } catch (e) {
      setSimulationReport("Oracle handshake interrupted. Manual interpretation required.");
    } finally {
      setIsRunningSimulation(false);
    }
  };

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

  const handleDeepAIQuery = async () => {
    if (!aiQuery.trim() && !fileBase64) return;
    setPaymentStatus('authorizing');
    await new Promise(r => setTimeout(r, 1000));
    
    if (!onSpendEAC(ORACLE_QUERY_COST, `ORACLE_INQUIRY_${Math.random().toString(36).substring(7)}`)) {
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
        responseText = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', aiQuery || "Diagnostic audit.");
      } else {
        const res = await chatWithAgroExpert(aiQuery, [], true);
        responseText = res.text;
      }
      setAiResult({ text: responseText });
    } catch (e) { 
      alert("Oracle congestion."); 
    } finally { 
      setAiThinking(false); 
      setTimeout(() => setPaymentStatus('idle'), 2000); 
    }
  };

  const handleSyncIotConsensus = () => {
    if (!selectedIotNode) return;
    setIsSyncingNode(true);
    setTimeout(() => {
      setIsSyncingNode(false);
      onEarnEAC(15, `IOT_HANDSHAKE_CONSENSUS_${selectedIotNode.id}`);
      alert("CONSENSUS REACHED: Node telemetry immutably anchored to local C(a) constant.");
    }, 2000);
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
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">EOS_SCIENCE_CORE_v5.0</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 leading-none">Science <span className="text-emerald-400">& Intelligence</span></h2>
              </div>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
                 Simulate the EnvirosAgro Sustainability Equations (C(a) & m), synchronize raw telemetry, and protect node integrity from social pathogens.
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Registry Confidence</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter">99.9<span className="text-2xl text-emerald-500">%</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Ledger Sync</span>
                 <span className="text-emerald-400 font-bold">LOCKED</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[99%] shadow-[0_0_100px_#10b98144]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4 md:ml-4">
        {[
          { id: 'twin', label: 'Digital Twin', icon: BoxSelect },
          { id: 'simulator', label: 'Industrial Simulator', icon: LucideLineChart },
          { id: 'telemetry', label: 'Registered IOT Telemetry', icon: SmartphoneNfc },
          { id: 'eos_ai', label: 'EnvirosAgro AI', icon: BrainCircuit },
          { id: 'sid', label: 'SID Remediation (S)', icon: HeartPulse },
          { id: 'evidence', label: 'Evidence Portal', icon: History },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] px-4">
        
        {/* --- DIGITAL TWIN SECTION --- */}
        {activeTab === 'twin' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-500">
             <div className="lg:col-span-8 glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden flex flex-col justify-center min-h-[650px] shadow-3xl group">
                <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-12">
                   <div className="w-96 h-96 relative flex items-center justify-center">
                      {/* Virtual Farm Core */}
                      <div className={`absolute w-48 h-48 rounded-[64px] flex items-center justify-center border-4 shadow-[0_0_100px_rgba(16,185,129,0.3)] transition-all duration-[2s] ${isTwinSyncing ? 'scale-110 bg-emerald-500/20 border-emerald-400' : 'bg-black/60 border-emerald-500/40'}`}>
                         <Boxes size={64} className={`${isTwinSyncing ? 'text-white' : 'text-emerald-500'} animate-pulse`} />
                      </div>
                      
                      {/* Rotating Sensor Orbits */}
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute border-2 border-dashed border-white/5 rounded-full" style={{ width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, animation: `spin ${20 + i * 10}s linear infinite`, animationDirection: i % 2 === 0 ? 'normal' : 'reverse' }}>
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"></div>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="text-center space-y-4">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Node <span className="text-emerald-400">Digital Mirror</span></h3>
                      <p className="text-slate-500 text-xl font-medium italic">"Real-time industrial sharding of your physical farm node."</p>
                   </div>
                </div>

                <div className="absolute bottom-10 left-10 p-6 glass-card rounded-3xl border border-white/5 space-y-4 bg-black/40">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                      <Activity size={12} className="text-emerald-400" /> Mesh Resonance
                   </p>
                   <p className="text-3xl font-mono font-black text-white">{twinResonance.toFixed(1)}%</p>
                </div>

                <div className="absolute top-10 right-10 flex flex-col gap-3">
                   {['biological', 'structural', 'thermal'].map(layer => (
                      <button 
                        key={layer}
                        onClick={() => setActiveLayer(layer as any)}
                        className={`px-6 py-3 rounded-2xl border text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === layer ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-black/60 border-white/10 text-slate-500 hover:text-white'}`}
                      >
                         {layer} Layer
                      </button>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/10 space-y-10 shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-2xl shadow-xl"><RefreshCw className="w-6 h-6 text-white" /></div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest italic">Model <span className="text-blue-400">Sync</span></h4>
                   </div>
                   <div className="space-y-6">
                      <p className="text-slate-400 text-sm italic leading-relaxed">"Synchronize the virtual model with the latest 432Hz spectral data shards from your local IoT cluster."</p>
                      <button 
                        onClick={handleTwinRefresh}
                        disabled={isTwinSyncing}
                        className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                      >
                         {isTwinSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {isTwinSyncing ? 'CALIBRATING...' : 'INITIALIZE SYNC'}
                      </button>
                   </div>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                   <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-indigo-400" />
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Twin Integrity</h4>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                      "Digital twins allow stewards to test 'What-If' scenarios without risking physical C(a) constant decay. Every simulation is logged for registry validation."
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* --- IOT TELEMETRY SECTION --- */}
        {activeTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-700">
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-8 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600 rounded-3xl shadow-xl"><SmartphoneNfc className="w-8 h-8 text-white" /></div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Hardware <span className="text-blue-400">Nodes</span></h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Paired IOT Registry</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {hardwareNodes.length === 0 ? (
                    <div className="py-12 text-center space-y-6 opacity-30">
                      <ZapOff size={48} className="mx-auto text-slate-500" />
                      <p className="text-sm font-black uppercase italic">No Active IOT Shards</p>
                      <button 
                        onClick={() => window.location.href = '#registry_handshake'}
                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all"
                      >
                        Initialize Handshake
                      </button>
                    </div>
                  ) : (
                    hardwareNodes.map(node => (
                      <button 
                        key={node.id}
                        onClick={() => setSelectedIotNode(node)}
                        className={`w-full p-6 rounded-[32px] border transition-all flex items-center justify-between group ${selectedIotNode?.id === node.id ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-black/40 border border-white/5"><Satellite size={18} /></div>
                          <div className="text-left">
                            <span className="text-sm font-black uppercase block leading-none">{node.name}</span>
                            <span className="text-[10px] font-mono opacity-50 uppercase">{node.id}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${node.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-400'}`}>
                          {node.status}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-xl">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" /> Node Impact Shard
                 </h4>
                 <div className="space-y-6">
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center group">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">C(a) Growth Lift</p>
                       <p className="text-4xl font-mono font-black text-white">+0.24<span className="text-sm text-emerald-500 italic">Δ</span></p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 text-center group">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">m-Resilience Stability</p>
                       <p className="text-4xl font-mono font-black text-blue-400">92%</p>
                    </div>
                 </div>
                 <button 
                  onClick={handleSyncIotConsensus}
                  disabled={isSyncingNode || !selectedIotNode}
                  className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                 >
                    {isSyncingNode ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                    {isSyncingNode ? 'Syncing Consensus...' : 'Authorize Shard Consensus'}
                 </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="glass-card rounded-[64px] min-h-[600px] border border-white/5 bg-black/40 flex flex-col relative overflow-hidden shadow-3xl">
                <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4 text-blue-400">
                    <Terminal className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Telemetry Ingest Stream</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest">INGEST_ACTIVE</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-terminal relative">
                  {!selectedIotNode ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                      <Wifi size={120} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                      <div className="space-y-2">
                        <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">TELEMETRY_STANDBY</p>
                        <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Register Physical Nodes to initialize Inflow</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-1000 h-full">
                      <div className="space-y-10">
                        <div className="p-10 bg-black/80 rounded-[48px] border border-blue-500/20 border-l-8 shadow-inner flex flex-col justify-between h-[300px] group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Activity size={200} /></div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Real-time Spectral Wave</h4>
                            <p className="text-3xl font-black text-white italic tracking-tighter">SYST_PULSE_NOMINAL</p>
                          </div>
                          <div className="flex items-end gap-1 h-32 pt-10">
                            {[...Array(24)].map((_, i) => (
                              <div 
                                key={i} 
                                className="flex-1 bg-blue-500/40 rounded-full animate-pulse" 
                                style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s` }}
                              ></div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Consensus Logs</h4>
                           <div className="space-y-3">
                              {telemetryLogs.map((log, i) => (
                                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center text-[11px] font-mono animate-in slide-in-from-right-2">
                                  <span className="text-slate-600">[{log.timestamp}]</span>
                                  <span className="text-white font-bold">{log.metric}</span>
                                  <span className="text-blue-400 font-black">{log.value}</span>
                                </div>
                              ))}
                              {telemetryLogs.length === 0 && <p className="text-center text-[10px] text-slate-700 italic py-10 uppercase tracking-widest">Initializing Handshake...</p>}
                           </div>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div className="p-10 glass-card rounded-[48px] border border-white/10 bg-black/60 space-y-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:rotate-6 transition-transform"><Database size={150} /></div>
                          <div className="space-y-4 relative z-10">
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                              <Binary size={24} className="text-indigo-400" /> Shard <span className="text-indigo-400">Metadata</span>
                            </h4>
                            <div className="space-y-4 pt-4">
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Node Encryption</span>
                                <span className="text-xs font-mono font-black text-emerald-400">ZK-SNARK_ACTIVE</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol Version</span>
                                <span className="text-xs font-mono font-black text-white">EOS-IOT_v5.2</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Signal Latency</span>
                                <span className="text-xs font-mono font-black text-blue-400">14ms</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 relative z-10">
                            <p className="text-[10px] text-slate-500 italic leading-relaxed">
                              "Every physical action on the land is captured by this node and synthesized into the global C(a) constant registry."
                            </p>
                          </div>
                        </div>

                        <div className="p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[48px] flex items-center justify-between shadow-inner group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                              <ShieldCheck size={28} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-white uppercase italic">Sovereign Data Anchor</p>
                               <p className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">Ownership: Node_{user.esin.split('-')[1]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- INDUSTRIAL SIMULATOR --- */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in duration-700">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl">
                         <Activity className="w-8 h-8 text-white" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Equation <span className="text-indigo-400">Simulator</span></h3>
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tune Model Variables</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Users2 size={12} /> x (Social Immunity)</label>
                            <span className="text-xl font-mono font-black text-white">{x_immunity.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="2" step="0.01" value={x_immunity} onChange={e => setXImmunity(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} /> r (Resonance Rate)</label>
                            <span className="text-xl font-mono font-black text-white">{r_resonance.toFixed(2)}</span>
                         </div>
                         <input type="range" min="1" max="2" step="0.01" value={r_resonance} onChange={e => setRResonance(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Layers size={12} /> Dn (Land Density)</label>
                            <span className="text-xl font-mono font-black text-white">{dn_density.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={dn_density} onChange={e => setDnDensity(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Zap size={12} /> In (Yield Intensity)</label>
                            <span className="text-xl font-mono font-black text-white">{in_intensity.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={in_intensity} onChange={e => setInIntensity(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ShieldX size={12} /> S (Stress Factor)</label>
                            <span className="text-xl font-mono font-black text-rose-500">{s_stress.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={s_stress} onChange={e => setSStress(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-600" />
                      </div>
                   </div>

                   <button 
                    onClick={handleRunFullSimulation}
                    disabled={isRunningSimulation}
                    className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                      {isRunningSimulation ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                      {isRunningSimulation ? 'SYNCING FORECAST...' : 'RUN FULL SIMULATION'}
                   </button>
                </div>
             </div>

             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/60 relative overflow-hidden shadow-3xl min-h-[600px]">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none"></div>
                   <div className="flex justify-between items-center mb-10 relative z-10 px-4">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-xl">
                            <Activity className="w-8 h-8 text-emerald-400" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Projected <span className="text-emerald-400">Resilience Curves</span></h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Modeling Shards Cycle 1 to {n_cycles}</p>
                         </div>
                      </div>
                      <div className="p-6 bg-black/60 border border-white/5 rounded-3xl text-center">
                         <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Final m-Resonance</p>
                         <p className="text-3xl font-mono font-black text-emerald-400">{currentMetrics.m}</p>
                      </div>
                   </div>

                   <div className="flex-1 h-[400px] w-full min-h-0 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={simProjectionData}>
                            <defs>
                               <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                               <linearGradient id="colorM" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="cycle" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Area type="monotone" name="Agro Code C(a)" dataKey="ca" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorCa)" strokeLinecap="round" />
                            <Area type="monotone" name="Resilience (m)" dataKey="m" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorM)" strokeDasharray="5 5" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                {simulationReport ? (
                   <div className="animate-in slide-in-from-bottom-10 duration-700">
                      <div className="glass-card p-12 rounded-[64px] border border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden group shadow-3xl">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Bot size={300} className="text-indigo-400" /></div>
                         <div className="flex items-center gap-6 relative z-10 mb-10 border-b border-white/5 pb-6">
                            <div className="p-4 bg-indigo-600 rounded-[28px] shadow-3xl">
                               <Bot className="w-10 h-10 text-white" />
                            </div>
                            <div>
                               <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Oracle <span className="text-indigo-400">Interpretation</span></h3>
                               <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-2">EOS_STRATEGIC_SHARD_V5</p>
                            </div>
                         </div>
                         <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-xl leading-relaxed italic whitespace-pre-line border-l-4 border-indigo-500/30 pl-10 font-medium relative z-10">
                            {simulationReport}
                         </div>
                         <div className="mt-12 flex justify-center relative z-10 gap-6">
                            <button className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                               <Stamp className="w-6 h-6" /> ANCHOR SIMULATION SHARD
                            </button>
                            <button onClick={() => setSimulationReport(null)} className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 hover:text-white transition-all"><RotateCcw size={24} /></button>
                         </div>
                      </div>
                   </div>
                ) : (
                  <div className="p-12 glass-card rounded-[64px] border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center space-y-6 opacity-20 group">
                      <Sparkles size={80} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      <p className="text-xl font-black uppercase tracking-[0.5em] text-white">ORACLE STANDBY</p>
                      <p className="text-sm italic uppercase font-bold tracking-widest text-slate-600">Execute Simulation to Synthesize Strategic Shard</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* --- ENVIROSAGRO AI (ORACLE) --- */}
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
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Data Shard Attachment</label>
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
                                  <p className="text-xs font-black uppercase text-slate-700 group-hover:text-emerald-400 tracking-widest">Upload Reference Shard</p>
                                </>
                             )}
                          </div>
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
                       <div className="flex items-center gap-4 text-emerald-400">
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
                         <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                            <div className="relative">
                               <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <BrainCircuit className="w-10 h-10 text-emerald-400 animate-pulse" />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Processing Neural Shards...</p>
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
                 </div>
              </div>
           </div>
        )}

        {/* --- SID REMEDIATION --- */}
        {activeTab === 'sid' && (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-12 rounded-[56px] border-rose-500/20 bg-rose-950/10 relative overflow-hidden flex flex-col shadow-3xl group min-h-[500px]">
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
                      </div>

                      <button 
                        onClick={runSIDRemediation}
                        disabled={remediationStep === 'scanning'}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all relative z-10 flex items-center justify-center gap-4"
                      >
                         {remediationStep === 'scanning' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {remediationStep === 'scanning' ? 'PURGING PATHOGENS...' : 'INITIALIZE REMEDIATION'}
                      </button>
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-10">
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
                         </div>
                         <div className="space-y-10">
                            <div className="space-y-6">
                               <div className="flex justify-between items-center px-4">
                                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Waves size={14} className="text-blue-500" /> Language Volatility</label>
                                  <span className="text-xl font-mono font-black text-white">{languageVolatility}%</span>
                               </div>
                               <input type="range" min="0" max="100" value={languageVolatility} onChange={e => setLanguageVolatility(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" />
                            </div>
                            <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 space-y-4 shadow-inner">
                               <div className="flex items-center gap-3">
                                  <Info size={16} className="text-rose-500" />
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Remediation Vector</span>
                               </div>
                               <p className="text-[11px] text-slate-400 italic leading-relaxed">
                                  Social sharding protocols minimize stress (S) by distributing ideological load across multiple peer-verified nodes.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- EVIDENCE PORTAL --- */}
        {activeTab === 'evidence' && (
           <div className="space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8 px-4">
                 <div>
                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Evidence <span className="text-emerald-400">Portal</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic mt-2">"Secure evidence sharding is the bridge between physical actions and ledger rewards."</p>
                 </div>
                 <button 
                  onClick={onOpenEvidence}
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
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

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
