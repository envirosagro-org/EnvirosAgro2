
import React, { useState, useEffect, useRef } from 'react';
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
  // Added missing Box icon
  Box
} from 'lucide-react';
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

const NetworkIngest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'analyzer' | 'docs'>('overview');
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

  const generateNewKey = () => {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-12 rounded-[48px] bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 relative overflow-hidden flex flex-col justify-between group">
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
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
                 Link satellite constellations, private IoT arrays, and external scientific datasets directly to the EOS industrial framework.
              </p>
              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={handleStartProvision}
                  className="px-8 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    <PlusCircle className="w-5 h-5" /> Initialize Integration
                 </button>
                 <button 
                  onClick={() => setActiveTab('docs')}
                  className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                    <Code className="w-5 h-5 text-indigo-400" /> API Docs
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-8 flex flex-col justify-center">
           <div className="text-center space-y-2">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em]">Network Throughput</p>
              <h3 className="text-6xl font-black text-white tracking-tighter">14.2 <span className="text-lg">GB/s</span></h3>
              <div className="flex items-center justify-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 Active Pipeline
              </div>
           </div>
           <div className="space-y-3 pt-6 border-t border-white/5">
              {[
                { label: "Active Connections", val: `${keys.length + 426} Nodes`, icon: Wifi, col: "text-emerald-400" },
                { label: "Avg Node Latency", val: "18ms", icon: Activity, col: "text-blue-400" },
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
           <div className="glass-card p-4 rounded-[32px] space-y-2 bg-black/40">
              {[
                { id: 'overview', label: 'Live Stream', icon: Activity },
                { id: 'analyzer', label: 'Stream Analyzer', icon: Sparkles },
                { id: 'api', label: 'Registry Keys', icon: Key },
                { id: 'docs', label: 'Technical Docs', icon: BookOpen },
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
           </div>

           <div className="glass-card p-8 rounded-[32px] bg-amber-500/5 border-amber-500/20 space-y-4">
              <div className="flex gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest">Security Protocol</h4>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                 External datasets must adhere to the Informational Thrust (I) standards. Fraudulent telemetry will trigger a network-wide EAC slashing event.
              </p>
           </div>
        </div>

        <div className="lg:col-span-3 glass-card rounded-[48px] flex flex-col overflow-hidden border-white/5 bg-black/40 shadow-2xl min-h-[750px]">
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
                      <p className="text-slate-400 leading-relaxed text-lg max-w-xl">Provision and manage secure integration nodes for automated industrial sharding.</p>
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
                                    <div className={`p-3 rounded-2xl border ${k.env === 'Production' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                       <Cpu className={`w-6 h-6 ${k.env === 'Production' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                                    </div>
                                    <div>
                                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{k.name}</h4>
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
                                    {k.ipRestriction && (
                                       <span className="px-3 py-1 bg-rose-500/10 rounded-lg text-[8px] font-black text-rose-400 uppercase tracking-widest border border-rose-500/20 flex items-center gap-1">
                                          <Globe2 className="w-2 h-2" /> IP_LOCKED: {k.ipRestriction}
                                       </span>
                                    )}
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

                           <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex items-center justify-between group/key overflow-hidden relative">
                              <span className="text-sm font-mono text-indigo-300 tracking-widest relative z-10 truncate max-w-[70%]">{k.key}</span>
                              <div className="flex gap-3 relative z-10">
                                 <button 
                                    onClick={() => handleCopy(k.id, k.key)}
                                    className={`p-4 rounded-2xl transition-all border ${copiedKeyId === k.id ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border-white/5'}`}
                                    title="Copy Secret"
                                 >
                                    {copiedKeyId === k.id ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                 </button>
                                 <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all hover:bg-white/10 border border-white/5" title="Rotate Key"><RefreshCcw className="w-5 h-5" /></button>
                              </div>
                              <div className="absolute inset-0 bg-indigo-500/[0.02] translate-x-[-100%] group-hover/key:translate-x-0 transition-transform duration-700"></div>
                           </div>

                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                 <span>Monthly Ingest Quota</span>
                                 <span className="text-white font-mono">{k.usage}%</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                 <div className={`h-full bg-indigo-500 transition-all duration-[2s] shadow-[0_0_10px_rgba(99,102,241,0.5)]`} style={{ width: `${k.usage}%` }}></div>
                              </div>
                           </div>
                        </div>

                        <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-8 md:pt-0 md:pl-12 relative z-10">
                           <div className="space-y-6">
                              <div className="p-4 bg-black/40 rounded-3xl border border-white/5 text-center">
                                 <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Packet Integrity</p>
                                 <p className="text-xl font-mono font-black text-emerald-400">99.9%</p>
                              </div>
                              <div className="p-4 bg-black/40 rounded-3xl border border-white/5 text-center">
                                 <p className="text-[8px] text-slate-600 uppercase font-black mb-1">Avg Latency</p>
                                 <p className="text-xl font-mono font-black text-blue-400">12ms</p>
                              </div>
                           </div>
                           <button 
                             onClick={() => revokeKey(k.id)}
                             className="w-full py-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95"
                           >
                              <Trash2 className="w-4 h-4" /> Revoke Shard
                           </button>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-12 glass-card rounded-[56px] border-emerald-500/20 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-[32px] flex items-center justify-center border border-emerald-500/20 shadow-2xl animate-pulse">
                         <ShieldCheck className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Registry Integration Score</h4>
                         <p className="text-slate-400 text-lg">Maintain high uptime across provisioned nodes to earn EAC multipliers.</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-slate-600 font-black uppercase mb-2 tracking-[0.3em]">ACTIVE BONUS</p>
                      <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">1.42x</p>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'docs' && (
             <div className="flex-1 p-12 overflow-y-auto animate-in slide-in-from-right-4 duration-500 space-y-12">
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">API <span className="text-indigo-400">Documentation</span></h3>
                   <p className="text-slate-400 text-lg max-w-2xl leading-relaxed italic">"Integrating the world's scientific data into the EOS Industrial Framework."</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6 group hover:border-indigo-500/30 transition-all">
                      <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                         <Shield className="w-6 h-6 text-indigo-400 group-hover:text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Authentication</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">All requests must include a ZK-Session key in the header. Requests are limited to 1,000 packets per second for standard Steward Nodes.</p>
                      <div className="p-4 bg-black/60 rounded-2xl border border-white/5 font-mono text-[10px] text-indigo-300">
                         Authorization: Bearer {'<YOUR_ESIN_SECRET>'}
                      </div>
                   </div>
                   <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-6 group hover:border-emerald-500/30 transition-all">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                         <Network className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white uppercase tracking-widest">Endpoint Nodes</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">Use the `/ingest/telemetry` endpoint for continuous data streams. Valid payloads must match the SEHTI schema.</p>
                      <div className="p-4 bg-black/60 rounded-2xl border border-white/5 font-mono text-[10px] text-emerald-400">
                         POST https://eos.envirosagro.org/v1/ingest
                      </div>
                   </div>
                </div>
                <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
                   <div className="flex items-center gap-3">
                      <FileCode className="w-6 h-6 text-blue-400" />
                      <h4 className="text-lg font-bold text-white uppercase tracking-widest">Payload Schema (JSON)</h4>
                   </div>
                   <div className="p-8 bg-black/60 rounded-[32px] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                      <pre>
{`{
  "header": {
    "version": "EOS-3.2",
    "timestamp": "ISO-8601",
    "steward_id": "EA-XXXX-XXXX-XXXX"
  },
  "payload": {
    "thrust": "TECHNOLOGICAL",
    "metrics": {
      "soil_moisture": 64.2,
      "nitrogen_val": "OPTIMAL",
      "thermal_deg": 22.4
    },
    "zk_proof": "0x882...CERTIFIED"
  }
}`}
                      </pre>
                   </div>
                   <div className="flex justify-between items-center px-4">
                      <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
                         <Download className="w-4 h-4" /> Download SDK (Node.js)
                      </button>
                      <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all">
                         <ExternalLink className="w-4 h-4" /> Postman Collection
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
                        <p className="text-slate-500 text-sm leading-relaxed">
                           Invoke the Gemini oracle to interpret live telemetry patterns and identify anomalies in your ingest node pipeline.
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
                        <button onClick={() => setAnalysisResult(null)} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Clear Analysis</button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
                           <Download className="w-4 h-4" /> Export Report
                        </button>
                     </div>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050706]/80 backdrop-blur-md z-20">
                     <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                     <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.3em] text-sm">Synchronizing Stream Constants...</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      {showKeyModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-2xl" onClick={() => setShowKeyModal(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card p-1 rounded-[64px] border-indigo-500/20 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.15)]">
              <div className="bg-[#050706] p-16 space-y-10 flex flex-col min-h-[650px]">
                 <button onClick={() => setShowKeyModal(false)} className="absolute top-10 right-10 p-3 bg-white/5 rounded-full text-slate-600 hover:text-white transition-colors border border-white/5"><X className="w-8 h-8" /></button>
                 
                 {provisionStep === 'name' && (
                   <div className="space-y-12 animate-in zoom-in duration-300 flex-1 flex flex-col justify-center">
                      <div className="space-y-6 text-center">
                        <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl">
                           <Network className="w-12 h-12 text-indigo-400" />
                        </div>
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter m-0 italic">Node <span className="text-indigo-400">Designation</span></h3>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md mx-auto">Provide a registry label for this integration node to initialize the ZK-Handshake.</p>
                      </div>
                      
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Integration Alias</label>
                         <div className="relative">
                            <input 
                              type="text" 
                              required 
                              value={newKeyName}
                              onChange={e => setNewKeyName(e.target.value)}
                              placeholder="e.g. Weather Satellite R-82" 
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-10 text-2xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800" 
                            />
                         </div>
                      </div>

                      <button 
                        onClick={() => setProvisionStep('config')}
                        disabled={!newKeyName.trim()}
                        className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-6 disabled:opacity-30"
                      >
                         Configure Scopes <ChevronRight className="w-8 h-8" />
                      </button>
                   </div>
                 )}

                 {provisionStep === 'config' && (
                    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col">
                       <div className="text-center space-y-2">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Node <span className="text-indigo-400">Security Scoping</span></h3>
                          <p className="text-slate-400 text-sm">Define environmental anchors and cryptographic permissions.</p>
                       </div>

                       <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-4">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Environment Anchor</label>
                             <div className="grid grid-cols-2 gap-4">
                                {['Production', 'Sandbox'].map(env => (
                                   <button 
                                      key={env}
                                      onClick={() => setNewKeyEnv(env as any)}
                                      className={`p-6 rounded-3xl border transition-all flex items-center justify-center gap-4 text-sm font-black uppercase tracking-widest ${newKeyEnv === env ? 'bg-indigo-600 border-white text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                                   >
                                      {env === 'Production' ? <ShieldCheck className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                                      {env}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">Pillar Access (Scopes)</label>
                             <div className="flex flex-wrap gap-3">
                                {['Societal', 'Environmental', 'Human', 'Technological', 'Industry'].map(scope => (
                                   <button 
                                      key={scope}
                                      onClick={() => toggleScope(scope)}
                                      className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${newKeyScopes.includes(scope) ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}
                                   >
                                      {scope}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-2">IP Restriction (CIDR Range)</label>
                             <div className="relative">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input 
                                   type="text"
                                   value={newKeyIP}
                                   onChange={e => setNewKeyIP(e.target.value)}
                                   placeholder="e.g. 192.168.1.1/24 (Optional)"
                                   className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 pl-16 pr-6 text-white font-mono text-sm focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800"
                                />
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-4 pt-6">
                          <button onClick={() => setProvisionStep('name')} className="px-8 py-8 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                             onClick={generateNewKey}
                             disabled={isGeneratingKey}
                             className="flex-1 py-8 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                          >
                             {isGeneratingKey ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                             {isGeneratingKey ? "MINTING SHARD..." : "FINALIZE INTEGRATION"}
                          </button>
                       </div>
                    </div>
                 )}

                 {provisionStep === 'success' && (
                   <div className="space-y-12 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center text-center">
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 animate-pulse">
                           <Key className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-5xl font-black text-white uppercase tracking-tighter m-0 italic">Key <span className="text-emerald-400">Minted</span></h3>
                        <p className="text-slate-500 text-lg max-sm:text-sm max-w-sm mx-auto leading-relaxed italic">"This is a one-time cryptographic display. Secure this secret immediately to anchor your node."</p>
                      </div>

                      <div className="p-10 bg-black/60 rounded-[48px] border border-white/10 flex items-center justify-between group overflow-hidden relative">
                         <span className="text-lg font-mono text-emerald-400 break-all select-all tracking-widest relative z-10">{generatedKey}</span>
                         <button 
                           onClick={() => handleCopy('generated', generatedKey)}
                           className={`p-6 rounded-3xl transition-all shadow-lg relative z-10 border ${copiedKeyId === 'generated' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white border-white/5'}`}
                         >
                            {copiedKeyId === 'generated' ? <CheckCircle2 className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                         </button>
                         <div className="absolute inset-0 bg-emerald-500/[0.03] animate-pulse"></div>
                      </div>

                      <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[40px] flex items-center gap-8 text-left">
                         <Shield className="w-12 h-12 text-rose-500 shrink-0" />
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                            Losing this key requires a full Node Re-Authorization. It will never be displayed in plain text on the registry again.
                         </p>
                      </div>

                      <button 
                         onClick={() => setShowKeyModal(false)}
                         className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                         Node Credentials Stored
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
      `}</style>
    </div>
  );
};

export default NetworkIngest;
