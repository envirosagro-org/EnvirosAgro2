
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
  Sparkles
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

const NetworkIngest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'analyzer'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  
  // Analyzer state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // Simulated live log feed
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

  const generateNewKey = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      setGeneratedKey(`EA_LIVE_${Math.random().toString(36).substring(2, 15).toUpperCase()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      setIsGeneratingKey(false);
      setShowKeyModal(true);
    }, 2000);
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
      {/* Technical Header */}
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
                  onClick={generateNewKey}
                  className="px-8 py-5 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:scale-105 transition-all flex items-center gap-3"
                 >
                    {isGeneratingKey ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                    Initialize Integration
                 </button>
                 <button className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
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
                { label: "Active Connections", val: "428 Nodes", icon: Wifi, col: "text-emerald-400" },
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

      {/* Main Terminal View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[650px]">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
           <div className="glass-card p-4 rounded-[32px] space-y-2">
              {[
                { id: 'overview', label: 'Live Stream', icon: Activity },
                { id: 'analyzer', label: 'Stream Analyzer', icon: Sparkles },
                { id: 'api', label: 'API Credentials', icon: Key },
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

           <div className="p-8 glass-card rounded-[32px] flex-1 flex flex-col justify-center items-center text-center space-y-4 border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                 <Server className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                 <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Active Shard</p>
                 <h5 className="text-sm font-mono text-white font-bold uppercase">NODE_GALAXY_08</h5>
              </div>
           </div>
        </div>

        {/* Content Terminal Area */}
        <div className="lg:col-span-3 glass-card rounded-[48px] flex flex-col overflow-hidden border-white/5 bg-black/40">
           
           {activeTab === 'overview' && (
             <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">Industrial Ledger Ingest</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-mono text-emerald-500">STREAMING_ACTIVE_SHARD_8</span>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 font-mono text-[11px] space-y-4 bg-[#050706]">
                   {logs.map((log) => (
                     <div key={log.id} className="flex gap-6 p-3 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group rounded-lg">
                        <span className="text-slate-600 w-24 shrink-0 font-bold">{log.timestamp}</span>
                        <span className="text-indigo-400 w-32 shrink-0 truncate">[{log.source}]</span>
                        <div className="flex-1 space-y-1">
                           <span className="text-slate-200 block font-bold uppercase tracking-tight">{log.event}</span>
                           <span className="text-slate-700 text-[9px] block bg-black/40 p-2 rounded-md border border-white/[0.02] italic">{log.data}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] h-fit font-black tracking-widest shrink-0 ${
                           log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10' : 
                           log.status === 'SYNC' ? 'text-blue-400 bg-blue-400/10' : 
                           'text-rose-500 bg-rose-500/10'
                        }`}>{log.status}</span>
                     </div>
                   ))}
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
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12">
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
                     <div className="p-10 glass-card rounded-[40px] bg-white/[0.01] border-l-4 border-emerald-500/50">
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

           {activeTab === 'api' && (
             <div className="flex-1 p-12 space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Developer Credentials</h3>
                   <p className="text-slate-400 leading-relaxed text-lg">Provision and manage secure access keys for automated telemetry submission via the ZK-Relay.</p>
                </div>

                <div className="space-y-6">
                   <div className="p-8 glass-card rounded-[40px] border-white/10 bg-white/[0.01] space-y-8">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <Key className="w-6 h-6 text-indigo-400" />
                            <span className="text-sm font-black text-white uppercase tracking-widest">Active Ingest Key</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase">
                            Status: Live
                         </div>
                      </div>
                      
                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 flex items-center justify-between group overflow-hidden relative">
                         <span className="text-sm font-mono text-indigo-300 tracking-widest relative z-10">EA_STWD_A842_XXXX_SYNC</span>
                         <div className="flex gap-2 relative z-10">
                            <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><Copy className="w-4 h-4" /></button>
                            <button className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"><RefreshCcw className="w-4 h-4" /></button>
                         </div>
                         <div className="absolute inset-0 bg-indigo-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                      </div>
                      
                      <div className="pt-4 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                         <span>Last Signature: 12m ago</span>
                         <span>Relay Node: GLOBAL_BETA_SYNC</span>
                      </div>
                   </div>

                   <button 
                    onClick={generateNewKey}
                    className="w-full py-6 bg-white/5 border border-white/10 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                   >
                      <PlusCircle className="w-5 h-5" /> Provision New Integration Key
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-2xl" onClick={() => setShowKeyModal(false)}></div>
           <div className="relative z-10 w-full max-w-lg glass-card p-1 rounded-[44px] border-indigo-500/20 overflow-hidden">
              <div className="bg-[#050706] p-12 space-y-8 flex flex-col text-center">
                 <button onClick={() => setShowKeyModal(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors">
                   <X className="w-8 h-8" />
                 </button>

                 <div className="space-y-4">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-[28px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                       <Key className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Key Provisioned</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                       This is a one-time cryptographic display. Secure this key immediately. Exposure leads to registry risk.
                    </p>
                 </div>

                 <div className="p-8 bg-black/60 rounded-[32px] border border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 break-all select-all tracking-wider">{generatedKey}</span>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(generatedKey); alert("API Key copied."); }}
                      className="p-4 bg-white/5 rounded-2xl text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                    >
                       <Copy className="w-6 h-6" />
                    </button>
                 </div>

                 <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[32px] flex items-center gap-4 text-left">
                    <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                       Losing this integration key requires a full Node Re-Authorization via your verified email anchor.
                    </p>
                 </div>

                 <button 
                    onClick={() => setShowKeyModal(false)}
                    className="w-full py-6 agro-gradient rounded-[32px] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all"
                 >
                    Node Credentials Stored
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Local Download Icon fix
const Download = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default NetworkIngest;
