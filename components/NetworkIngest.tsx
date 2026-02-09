
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cable, 
  DatabaseZap, 
  Activity, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Server, 
  Layers, 
  Key, 
  ExternalLink, 
  Globe, 
  Search, 
  PlusCircle, 
  X, 
  Loader2, 
  Terminal, 
  Copy, 
  RefreshCcw,
  AlertTriangle,
  Code,
  Zap,
  Bot,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Shield,
  FileCode,
  Network,
  Download,
  Trash2,
  Settings,
  MoreVertical,
  Fingerprint,
  Lock,
  Eye,
  Globe2,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Clock,
  Box,
  Coins,
  Smartphone,
  SmartphoneNfc,
  Gamepad2,
  QrCode,
  Binary,
  Workflow,
  Target,
  ArrowRight
} from 'lucide-react';
import { User, ViewState, AgroResource } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  status: 'SUCCESS' | 'SYNC' | 'ERROR';
  data: string;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  status: 'Live' | 'Revoked' | 'Expiring';
  env: 'Production' | 'Sandbox';
  scopes: string[];
  ipRestriction?: string;
  usage: number; // 0-100
  lastUsed: string;
  relay: string;
  trustLevel: number; // 0-100
}

interface NetworkIngestProps {
  user: User;
  onSpendEAC?: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
  onExecuteToShell?: (code: string) => void;
}

const INITIAL_KEYS: APIKey[] = [
  { 
    id: '1', 
    name: 'Primary Field Swarm (Zone 4)', 
    key: 'EA_LIVE_882_X_SYNC_A01', 
    status: 'Live', 
    env: 'Production',
    scopes: ['Technological', 'Environmental'],
    ipRestriction: '192.168.1.*',
    usage: 42, 
    lastUsed: '12m ago', 
    relay: 'GLOBAL_BETA_SYNC',
    trustLevel: 98
  },
  { 
    id: '2', 
    name: 'Research Sandbox Node', 
    key: 'EA_TEST_104_Y_DEV_B42', 
    status: 'Live', 
    env: 'Sandbox',
    scopes: ['Societal', 'Human'],
    usage: 12, 
    lastUsed: '1h ago', 
    relay: 'LOCAL_EDGE_P4',
    trustLevel: 100
  },
];

const PROVISIONING_FEE = 500;

const NetworkIngest: React.FC<NetworkIngestProps> = ({ user, onSpendEAC, onNavigate, onExecuteToShell }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'nodes' | 'bridge' | 'analyzer'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [keys, setKeys] = useState<APIKey[]>(INITIAL_KEYS);
  
  // Provisioning States
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [provisionStep, setProvisionStep] = useState<'name' | 'config' | 'success'>('name');
  
  // Form State
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'Production' | 'Sandbox'>('Sandbox');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['Technological']);
  const [newKeyIP, setNewKeyIP] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Derived Physical Hardware Nodes
  const physicalNodes = useMemo(() => 
    (user.resources || []).filter(r => r.category === 'HARDWARE'),
    [user.resources]
  );

  useEffect(() => {
    const sources = ['SAT-EOS-04', 'Drone-NE-82', 'Soil-Array-P4', 'ThirdParty-API-C1'];
    const events = ['Data Packet Received', 'ZK-Proof Validated', 'Registry Hash Committed', 'Telemetry Resync'];
    
    const interval = setInterval(() => {
      const source = sources[Math.floor(Math.random() * sources.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const id = Math.random().toString(36).substring(7).toUpperCase();
      const val = (Math.random() * 100).toFixed(2);
      
      const newLog: LogEntry = {
        id,
        timestamp: new Date().toLocaleTimeString(),
        source,
        event,
        status: Math.random() > 0.1 ? (Math.random() > 0.5 ? 'SUCCESS' : 'SYNC') : 'ERROR',
        data: `{"id": "${id}", "telemetry": {"val": ${val}, "unit": "pH", "trust_score": 0.98}, "auth": "ZK-SNARK"}`
      };
      setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleStartProvision = () => {
    setNewKeyName('');
    setNewKeyEnv('Sandbox');
    setNewKeyScopes(['Technological']);
    setNewKeyIP('');
    setProvisionStep('name');
    setShowKeyModal(true);
  };

  const toggleScope = (scope: string) => {
    setNewKeyScopes(prev => 
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const generateNewKey = async () => {
    if (onSpendEAC) {
        const success = await onSpendEAC(PROVISIONING_FEE, `NETWORK_INGEST_PROVISIONING_${newKeyName}`);
        if (!success) return;
    }

    setIsGeneratingKey(true);
    setTimeout(() => {
      const prefix = newKeyEnv === 'Production' ? 'EA_LIVE' : 'EA_TEST';
      const newKeyString = `${prefix}_${Math.random().toString(36).substring(2, 15).toUpperCase()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setGeneratedKey(newKeyString);
      
      const newKey: APIKey = {
        id: Date.now().toString(),
        name: newKeyName || 'Unnamed Integration Node',
        key: newKeyString,
        status: 'Live',
        env: newKeyEnv,
        scopes: newKeyScopes,
        ipRestriction: newKeyIP || undefined,
        usage: 0,
        lastUsed: 'Never',
        relay: 'GLOBAL_BETA_SYNC',
        trustLevel: 100
      };
      
      setKeys([newKey, ...keys]);
      setIsGeneratingKey(false);
      setProvisionStep('success');
    }, 2000);
  };

  const handleCopy = (id: string, keyStr: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const revokeKey = (id: string) => {
    if (confirm("REVOKE SIGNAL: This will permanently unlink the integration node. Proceed?")) {
      setKeys(keys.filter(k => k.id !== id));
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const sampleLogs = logs.slice(0, 5).map(l => `${l.source}: ${l.event}`).join('\n');
    const prompt = `Act as an EOS Network Engineer. Analyze the following live telemetry stream log pattern and provide a technical interpretation for a steward: \n\n${sampleLogs}\n\nWhat are the implications for farm resilience?`;
    const response = await chatWithAgroExpert(prompt, []);
    setAnalysisResult(response.text);
    setIsAnalyzing(false);
  };

  const transmitToKernel = (key: APIKey) => {
    const code = `// AUTO_GENERATED_INGEST_SYNC: ${key.name}
IMPORT EOS.Network AS Net;
IMPORT EOS.Kernel AS Kernel;

AUTHENTICATE node_signature(id: "${user.esin}");

SEQUENCE External_Ingest_Handshake {
    // 1. Establish secure tunnel to virtual node
    SET bridge_key = "${key.key}";
    SET relay_node = "${key.relay}";
    
    // 2. Open ingest pipe
    Net.bridge_external(id: "${key.id}", key: bridge_key, relay: relay_node);
    
    // 3. Verify packet integrity
    ASSERT Net.node_status("${key.id}") == "VERIFIED";
    
    // 4. Synchronize with Kernel Shell
    Kernel.map_telemetry(source: "${key.id}", thrust: "${key.scopes[0]}");
    
    // 5. Commit finality
    COMMIT_SHARD(registry: "GLOBAL_INGEST", finality: ZK_PROVEN);
}`;
    if (onExecuteToShell) {
      onExecuteToShell(code);
    } else {
      onNavigate('farm_os');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1700px] mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 relative overflow-hidden flex flex-col justify-between group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
              <Cable className="w-80 h-80 text-indigo-400" />
           </div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <DatabaseZap className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Network <span className="text-indigo-400">Ingest</span></h2>
                    <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 mt-1">
                       <ShieldCheck className="w-3 h-3" /> ZK-Verified Data Bridge Node
                    </p>
                 </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium italic">
                 "Orchestrating agile telemetry inflow. Synchronize external networks through the Farm OS kernel bridge for real-time optimization."
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <button 
                  onClick={handleStartProvision}
                  className="px-8 py-4 bg-indigo-600 rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all flex items-center gap-3 active:scale-95"
                 >
                    <PlusCircle size={20} /> Virtual Node Key
                 </button>
                 <button 
                  onClick={() => onNavigate('registry_handshake')}
                  className="px-8 py-4 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                 >
                    <SmartphoneNfc size={20} /> Pair Physical Hardware
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8 flex flex-col justify-center shadow-xl">
           <div className="text-center space-y-2">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Network Throughput</p>
              <h3 className="text-6xl font-black text-white tracking-tighter italic">14.2 <span className="text-lg">GB/s</span></h3>
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 Active Pipeline
              </div>
           </div>
           <div className="space-y-3 pt-6 border-t border-white/5">
              {[
                { label: "Active Connections", val: `${keys.length + physicalNodes.length + 426} Nodes`, icon: Wifi, col: "text-emerald-400" },
                { label: "Physical Shards", val: `${physicalNodes.length} Paired`, icon: Smartphone, col: "text-blue-400" },
                { label: "Validation Integrity", val: "99.98%", icon: ShieldCheck, col: "text-amber-400" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                      <s.icon className={`w-3.5 h-3.5 ${s.col}`} />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{s.label}</span>
                   </div>
                   <span className="text-xs font-black text-white font-mono">{s.val}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
           <div className="glass-card p-4 rounded-[32px] space-y-2 bg-black/40 shadow-xl">
              {[
                { id: 'overview', label: 'Live Stream', icon: Activity },
                { id: 'nodes', label: 'Physical Nodes', icon: SmartphoneNfc, badge: physicalNodes.length },
                { id: 'api', label: 'Registry Keys', icon: Key, badge: keys.length },
                { id: 'bridge', label: 'Kernel Bridge', icon: Terminal },
                { id: 'analyzer', label: 'Stream Analyzer', icon: Sparkles },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-black/40 text-[9px] font-mono font-black">{tab.badge}</span>
                  )}
                </button>
              ))}
           </div>

           <div className="glass-card p-8 rounded-[32px] bg-amber-500/5 border-amber-500/20 space-y-4 shadow-lg">
              <div className="flex gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Security Protocol</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                 "Synchronized networks must maintain <span className="text-amber-500">99.8% consensus fidelity</span>. Ingest drift triggers an automated kernel isolation."
              </p>
           </div>
        </div>

        <div className="lg:col-span-3 glass-card rounded-[48px] flex flex-col overflow-hidden border-white/5 bg-black/40 shadow-3xl min-h-[750px]">
           {activeTab === 'overview' && (
             <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Terminal className="w-6 h-6 text-emerald-400" />
                      <span className="text-sm font-black text-white uppercase tracking-widest">Industrial Ledger Ingest</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-mono text-emerald-500 tracking-widest">STREAMING_ACTIVE_SHARD_8</span>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-4 bg-[#050706]">
                   {logs.map((log) => (
                     <div key={log.id} className="flex gap-6 p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group rounded-2xl">
                        <span className="text-slate-600 w-24 shrink-0 font-bold">{log.timestamp}</span>
                        <span className="text-indigo-400 w-32 shrink-0 truncate">[{log.source}]</span>
                        <div className="flex-1 space-y-2">
                           <span className="text-slate-200 block font-bold uppercase tracking-tight">{log.event}</span>
                           <span className="text-slate-700 text-[10px] block bg-black/60 p-3 rounded-xl border border-white/[0.02] italic">{log.data}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] h-fit font-black tracking-widest shrink-0 border ${
                           log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 
                           log.status === 'SYNC' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 
                           'text-rose-500 bg-rose-500/10 border-rose-500/20'
                        }`}>{log.status}</span>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'api' && (
             <div className="flex-1 p-12 overflow-y-auto animate-in slide-in-from-bottom-4 duration-500 space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-10 gap-6">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Registry <span className="text-indigo-400">Credentials</span></h3>
                      <p className="text-slate-400 leading-relaxed text-lg max-w-xl italic font-medium">"Managing virtual integration nodes. Bridge to Farm OS for live optimization."</p>
                </div>
                   <button 
                    onClick={handleStartProvision}
                    className="px-8 py-4 bg-indigo-600 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all flex items-center gap-3 active:scale-95"
                   >
                      <PlusCircle className="w-4 h-4" /> Provision Node Key
                   </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   {keys.map(k => (
                     <div key={k.id} className={`p-10 glass-card rounded-[48px] border-2 transition-all group relative overflow-hidden flex flex-col md:flex-row gap-12 ${k.env === 'Production' ? 'border-indigo-500/20 bg-indigo-500/[0.02]' : 'border-emerald-500/10 bg-emerald-500/[0.01]'}`}>
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                           <Key className="w-48 h-48 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-8 relative z-10">
                           <div className="flex justify-between items-start">
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl border ${k.env === 'Production' ? 'bg-indigo-600/10 border-indigo-500/20' : 'bg-emerald-600/10 border-emerald-500/20'}`}>
                                       <Cpu className={`w-6 h-6 ${k.env === 'Production' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                                    </div>
                                    <div>
                                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">{k.name}</h4>
                                       <div className="flex items-center gap-2 mt-1">
                                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${k.env === 'Production' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
                                             {k.env} Environment
                                          </span>
                                          <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                          <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">LAST_SYNC: {k.lastUsed}</p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex flex-wrap gap-2 pl-14">
                                    {k.scopes.map(s => (
                                       <span key={s} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/5">{s} Access</span>
                                    ))}
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex flex-col items-end mr-4 hidden sm:block">
                                    <p className="text-[8px] text-slate-500 font-black uppercase">Node Trust</p>
                                    <p className="text-xs font-mono font-bold text-white">{k.trustLevel}%</p>
                                 </div>
                                 <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${k.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                    {k.status}
                                 </span>
                                 <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><MoreVertical className="w-5 h-5" /></button>
                              </div>
                           </div>

                           <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex items-center justify-between group/key overflow-hidden relative shadow-inner">
                              <span className="text-sm font-mono text-indigo-300 tracking-widest relative z-10 truncate max-w-[70%]">{k.key}</span>
                              <div className="flex gap-3 relative z-10">
                                 <button 
                                    onClick={() => handleCopy(k.id, k.key)}
                                    className={`p-4 rounded-2xl transition-all border ${copiedKeyId === k.id ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border-white/5'}`}
                                    title="Copy Secret"
                                 >
                                    {copiedKeyId === k.id ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                 </button>
                                 <button 
                                    onClick={() => transmitToKernel(k)}
                                    className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-90" 
                                    title="Bridge to Farm OS"
                                 >
                                    <Terminal size={20} />
                                 </button>
                              </div>
                              <div className="absolute inset-0 bg-indigo-500/[0.02] translate-x-[-100%] group-hover/key:translate-x-0 transition-transform duration-700"></div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === 'bridge' && (
             <div className="flex-1 p-12 flex flex-col animate-in slide-in-from-right-4 duration-500 overflow-y-auto">
                <div className="text-center space-y-8 py-20 min-h-[500px] flex flex-col items-center justify-center">
                   <div className="w-32 h-32 rounded-[48px] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center shadow-3xl group relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                      <Workflow size={64} className="text-indigo-400 animate-float" />
                   </div>
                   <div className="max-w-xl space-y-6">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Kernel <span className="text-indigo-400">Handshake</span></h3>
                      <p className="text-slate-400 text-lg font-medium italic leading-relaxed">
                         "Synchronizing external networks requires a formal kernel handshake. This anchors your ingest pipeline to the Farm OS logic core."
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-2 shadow-inner group hover:border-emerald-500/30 transition-all">
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Mesh Affinity</p>
                            <p className="text-3xl font-mono font-black text-emerald-400">94.2%</p>
                         </div>
                         <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-2 shadow-inner group hover:border-indigo-500/30 transition-all">
                            <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest">Logic Quorum</p>
                            <p className="text-3xl font-mono font-black text-indigo-400">LOCKED</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => onNavigate('farm_os')}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-indigo-500/5"
                      >
                        OPEN KERNEL SHELL <ArrowRight className="w-8 h-8 ml-4" />
                      </button>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'analyzer' && (
             <div className="flex-1 p-12 flex flex-col animate-in slide-in-from-right-4 duration-500 overflow-y-auto">
                <div className="flex items-center gap-6 border-b border-white/5 pb-8 mb-10">
                   <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                      <Bot className="w-8 h-8 text-emerald-400" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Stream Analyzer</h3>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                         <Sparkles className="w-3 h-3" /> Gemini 3 Flash Oracle
                      </p>
                   </div>
                </div>
                {!analysisResult && !isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12 min-h-[400px]">
                     <div className="w-32 h-32 rounded-full border-4 border-dashed border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                        <Activity className="w-12 h-12 text-emerald-400 opacity-20" />
                     </div>
                     <div className="max-w-md space-y-4">
                        <h4 className="text-xl font-bold text-white uppercase tracking-widest">Analyze Packet Trends</h4>
                        <p className="text-slate-500 text-sm leading-relaxed italic">
                           "Invoke the Gemini oracle to interpret live telemetry patterns and verify ingest success at the atomic level."
                        </p>
                        <button 
                         onClick={handleRunAnalysis}
                         className="px-10 py-5 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center justify-center gap-3"
                        >
                           <Zap className="w-5 h-5 fill-current" /> Run Oracle Sweep
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-700 pb-10">
                     <div className="p-10 glass-card rounded-[40px] bg-white/[0.01] border-l-4 border-emerald-500/50 shadow-2xl">
                        <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-lg leading-loose italic whitespace-pre-line">
                           {analysisResult}
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <button onClick={() => setAnalysisResult(null)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">Clear Analysis</button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2 shadow-xl">
                           <Download className="w-4 h-4" /> Export Report
                        </button>
                     </div>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050706]/80 backdrop-blur-md z-20">
                     <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                     <p className="text-emerald-400 font-black mt-6 animate-pulse uppercase tracking-[0.3em] text-sm italic">Synchronizing Stream Constants...</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.95); }
      `}</style>
    </div>
  );
};

export default NetworkIngest;
