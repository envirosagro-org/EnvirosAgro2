import React, { useState, useEffect, useRef } from 'react';
/* Added ArrowUpRight to lucide-react imports to fix error on line 339 */
import { 
  Code2, Play, ShieldCheck, Scale, Terminal, Bot, Sparkles, 
  Loader2, CheckCircle2, AlertTriangle, History, FileCode, 
  Zap, Microscope, Database, Coins, Gavel, Stamp, Cpu, 
  Waves, Search, SearchCode, Upload, Download, Binary, 
  Fingerprint, Lock, Workflow, Share2, Info, BadgeCheck, 
  Target, ArrowRight, Copy, Activity, X, ShieldPlus, 
  Landmark, FileSignature, Mic2, AlertCircle, Wind, 
  RotateCcw, Wand2, Send, Library, BookOpen, ChevronRight, 
  ChevronDown, LayoutGrid, Settings, Flame, MousePointer2, 
  Box, Braces, Plus, FlaskConical, Code, Network, Share, 
  LineChart, Eye, GitGraph, Split, Table as TableIcon, 
  ShieldAlert, Gauge, List, Layout,
  RefreshCw,
  Braces as BracesIcon,
  Globe,
  Radio,
  FileSearch,
  CheckCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { User, SignalShard } from '../types';
import { auditAgroLangCode, chatWithAgroExpert } from '../services/geminiService';

interface AgroLangProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onExecuteToShell: (code: string) => void;
  onEmitSignal: (signal: Partial<SignalShard>) => Promise<void>;
}

const SNIPPETS = [
  { 
    id: 'NET-1', 
    title: 'NET_BRIDGE_CORE', 
    desc: 'Establish lean external network sync.', 
    icon: Globe,
    code: `IMPORT EOS.Network AS Net;\nNet.bridge_external(id: "EA-EXT-01", protocol: "ZK_HANDSHAKE");`
  },
  { 
    id: 'NET-2', 
    title: 'TELEMETRY_CALIBRATE', 
    desc: 'Recalibrate spectral ingest loads.', 
    icon: Activity,
    code: `IMPORT EOS.Kernel AS Kernel;\nKernel.calibrate_ingest(source: "SATELLITE", weight: 0.85);`
  },
  { 
    id: 'S1', 
    title: 'MOISTURE_SYNC', 
    desc: 'Auto-calibrate soil humidity shards.', 
    icon: Waves,
    code: `Bio.sync_moisture(zone: "SECTOR_4", target: "OPTIMAL");`
  },
  { 
    id: 'S2', 
    title: 'SWARM_DEFEND', 
    desc: 'Deploy robotic pest containment shards.', 
    icon: Bot,
    code: `Bot.swarm_deploy(units: 12, mode: "MIN_STRESS");`
  },
  { 
    id: 'S3', 
    title: 'LEDGER_SETTLE', 
    desc: 'Anchor commercial finality to L3.', 
    icon: Database,
    code: `COMMIT_SHARD(registry: "GLOBAL_L3", finality: ZK_PROVEN);`
  },
];

const AgroLang: React.FC<AgroLangProps> = ({ user, onSpendEAC, onEarnEAC, onExecuteToShell, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'translator' | 'graph'>('editor');
  const [activeShard, setActiveShard] = useState('Production_Init.al');
  const [codeMap, setCodeMap] = useState<Record<string, string>>({
    'Production_Init.al': `// AGROLANG_ENVIRONMENT: EnvirosAgro OS v6.5
// NODE_DESIGNATION: ${user.esin}
IMPORT AgroLaw.Kenya.NairobiCounty AS Law;
IMPORT EOS.Automation AS Bot;
IMPORT MedicAg.Aura AS Bio;

AUTHENTICATE node_signature(id: "${user.esin}");

SEQUENCE Optimize_Cycle_882 {
    // 1. Constrain process within Legal Thresholds
    CONSTRAIN moisture_delta < Law.WATER_ACT.quota_shard;
    
    // 2. Adjust m-Resilience via Sonic Remediation
    Bio.apply_freq(target: 432Hz, gain: 0.82v);
    
    // 3. Deploy Swarm for precision sharding
    Bot.swarm_deploy(units: 12, mode: "MIN_STRESS");
    
    // 4. Anchor value to ledger
    COMMIT_SHARD(registry: "GLOBAL_L3", finality: ZK_PROVEN);
}`
  });
  
  const [isCompiling, setIsCompiling] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<'IDLE' | 'COMPLIANT' | 'VIOLATION'>('IDLE');
  const [hasNewForge, setHasNewForge] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  // Translator States
  const [externalSchema, setExternalSchema] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);

  const handleCompile = async () => {
    const fee = 25;
    if (!await onSpendEAC(fee, 'AGROLANG_INDUSTRIAL_AUDIT')) return;
    setIsCompiling(true);
    setComplianceStatus('IDLE');
    setOutput([]);
    
    onEmitSignal({
      type: 'task',
      origin: 'ORACLE',
      title: 'AGROLANG_AUDIT_STARTED',
      message: `Auditing code shard ${activeShard} for EOS Framework compliance.`,
      priority: 'low',
      actionIcon: 'SearchCode'
    });

    try {
      const res = await auditAgroLangCode(codeMap[activeShard]);
      await new Promise(r => setTimeout(r, 1000));
      setOutput(p => [...p, `[${new Date().toLocaleTimeString()}] INFO: Booting Runtime Environment...`]);
      await new Promise(r => setTimeout(r, 800));
      setOutput(p => [...p, `[${new Date().toLocaleTimeString()}] INFO: Mapping Pillar Weights...`]);
      await new Promise(r => setTimeout(r, 600));
      setOutput(p => [...p, `[${new Date().toLocaleTimeString()}] SUCCESS: Handshake with Node ${user.esin} verified.`]);
      
      if (res.is_compliant) {
        setComplianceStatus('COMPLIANT');
        setHasNewForge(true);
        setOutput(p => [...p, `[${new Date().toLocaleTimeString()}] COMPLIANT: Shard integrity index 0.98a.`]);
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'AUDIT_COMPLIANT',
          message: `Code shard ${activeShard} verified as compliant with SEHTI standards.`,
          priority: 'medium',
          actionIcon: 'ShieldCheck',
          meta: { target: 'agrolang', ledgerContext: 'INVENTION' }
        });
      } else {
        setComplianceStatus('VIOLATION');
        setOutput(p => [...p, `[${new Date().toLocaleTimeString()}] VIOLATION: Resource constraint overflow detected at line 14.`]);
        onEmitSignal({
          type: 'system',
          origin: 'ORACLE',
          title: 'AUDIT_VIOLATION',
          message: `Code shard ${activeShard} failed compliance check. m-constant drift risk detected.`,
          priority: 'high',
          actionIcon: 'ShieldAlert'
        });
      }
    } catch (e) {
      setOutput(p => [...p, "ERROR: Oracle connection timeout."]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleTranslate = async () => {
    if (!externalSchema.trim()) return;
    const fee = 10;
    if (!await onSpendEAC(fee, 'ORACLE_TRANSLATION_HANDSHAKE')) return;
    
    setIsTranslating(true);
    setTranslationResult(null);
    try {
      const prompt = `Act as the AgroLang Translator. Convert the following external JSON telemetry schema into valid AgroLang industrial logic for EnvirosAgro OS v6.5. 
      Schema: "${externalSchema}"
      Requirements: Include IMPORT statements for EOS.Network and EOS.Kernel. Wrap in a SEQUENCE block. Ensure m-constant optimization is mentioned.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setTranslationResult(res.text);
      onEarnEAC(5, 'NETWORK_INTEGRATION_ADAPTER_FORGED');
    } catch (e) {
      setTranslationResult("// Translation failed. Check Oracle connectivity.");
    } finally {
      setIsTranslating(false);
    }
  };

  const insertSnippet = (snippet: any) => {
    const currentCode = codeMap[activeShard];
    setCodeMap({ ...codeMap, [activeShard]: currentCode + "\n" + snippet.code });
  };

  const handleDeploy = () => {
    onEmitSignal({
      type: 'network',
      origin: 'MANUAL',
      title: 'LOGIC_DEPLOY_REQUEST',
      message: `Steward ${user.name} requesting kernel deployment of ${activeShard}.`,
      priority: 'high',
      actionIcon: 'Zap'
    });
    onExecuteToShell(codeMap[activeShard]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden flex flex-col items-center gap-12 group shadow-3xl text-center">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12"><Braces className="w-[600px] h-[600px] text-white" /></div>
         <div className="w-36 h-36 rounded-[48px] bg-indigo-700 flex items-center justify-center shadow-3xl ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
            <Code className="w-16 h-16 text-white relative z-10" />
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
         </div>
         <div className="space-y-6 relative z-10 max-w-4xl">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">AGROLANG <span className="text-indigo-400">STUDIO.</span></h2>
            <p className="text-slate-400 text-xl md:text-2xl font-medium italic leading-relaxed opacity-80">
               "Forging the agile language of the mesh. Translate external telemetry into industrial finality."
            </p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4 relative z-20">
         <div className="p-1 glass-card bg-black/40 rounded-2xl flex border border-white/5 shadow-2xl">
            {[
              { id: 'editor', label: 'Logic Editor', icon: Code2 },
              { id: 'translator', label: 'Agro Translation', icon: Languages },
              { id: 'graph', label: 'Signal Flow', icon: GitGraph }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => setIsLibraryOpen(!isLibraryOpen)} className={`p-4 rounded-xl border transition-all ${isLibraryOpen ? 'bg-indigo-600 text-white border-white/20' : 'bg-white/5 border-white/10 text-slate-500'}`}>
               <Library size={20} />
            </button>
            <button onClick={handleCompile} disabled={isCompiling} className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50 border border-white/10">
               {isCompiling ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="white" />}
               INITIALIZE_AUDIT
            </button>
            {hasNewForge && (
               <button onClick={handleDeploy} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest animate-pulse hover:bg-indigo-500 transition-all shadow-xl border border-white/10 ring-4 ring-indigo-500/10">
                  DEPLOY_TO_KERNEL
               </button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch relative z-10 px-4">
        {/* Shard Sidebar Library */}
        {isLibraryOpen && (
           <div className="xl:col-span-3 glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 space-y-10 shadow-3xl animate-in slide-in-from-left-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Protocol <span className="text-indigo-400">Registry</span></h4>
                 <button className="p-2 text-slate-700 hover:text-white transition-colors"><Plus size={16} /></button>
              </div>
              <div className="space-y-4">
                 {SNIPPETS.map(s => (
                    <div key={s.id} onClick={() => insertSnippet(s)} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400 group-hover:rotate-12 transition-transform shadow-inner"><s.icon size={18} /></div>
                          <span className="text-xs font-black text-white uppercase tracking-tighter">{s.title}</span>
                       </div>
                       <p className="text-[9px] text-slate-500 font-medium italic">"{s.desc}"</p>
                    </div>
                 ))}
              </div>
           </div>
        )}

        <div className={`${isLibraryOpen ? 'xl:col-span-9' : 'xl:col-span-12'} space-y-8 flex flex-col`}>
           <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[700px] relative group">
              
              <div className="flex-1 flex flex-col overflow-hidden relative">
                 {activeTab === 'editor' && (
                    <div className="flex-1 flex gap-10 p-12 bg-black relative overflow-hidden">
                       <div className="w-12 text-right font-mono text-base text-slate-800 pt-2 border-r border-white/5 pr-8 select-none leading-[2.5]">
                          {[...Array(24)].map((_, i) => <div key={i}>{(i + 1).toString().padStart(2, '0')}</div>)}
                       </div>
                       <textarea 
                          value={codeMap[activeShard]}
                          onChange={(e) => setCodeMap({ ...codeMap, [activeShard]: e.target.value })}
                          spellCheck={false}
                          className="flex-1 bg-transparent border-none outline-none font-mono text-xl text-emerald-400/90 leading-[2.5] resize-none selection:bg-indigo-500/40 overflow-y-auto italic custom-scrollbar-editor"
                       />
                    </div>
                 )}

                 {activeTab === 'translator' && (
                    <div className="flex-1 p-12 animate-in slide-in-from-right-10 duration-700 bg-black/40 flex flex-col gap-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                          <div className="flex flex-col space-y-6">
                             <div className="flex justify-between items-center px-4">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-widest">External <span className="text-indigo-400">Telemetry</span></h4>
                                <span className="text-[8px] font-mono text-slate-700 uppercase">Input_Schema_Buffer</span>
                             </div>
                             <textarea 
                                value={externalSchema}
                                onChange={e => setExternalSchema(e.target.value)}
                                placeholder='Paste raw network schema here (e.g. {"temp": 24.2, "humidity": 60})...'
                                className="flex-1 bg-black/80 border-2 border-white/10 rounded-[40px] p-10 text-white font-mono text-sm focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 shadow-inner italic"
                             />
                             <button 
                                onClick={handleTranslate}
                                disabled={isTranslating || !externalSchema.trim()}
                                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 disabled:opacity-30"
                             >
                                {isTranslating ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                GENERATE_AGROLANG_ADAPTER
                             </button>
                          </div>

                          <div className="flex flex-col space-y-6">
                             <div className="flex justify-between items-center px-4">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-widest">AgroLang <span className="text-emerald-400">Handshake</span></h4>
                                <span className="text-[8px] font-mono text-slate-700 uppercase">Internal_Protocol_Forge</span>
                             </div>
                             <div className="flex-1 bg-black/60 border-2 border-white/5 rounded-[40px] p-10 font-mono text-sm text-emerald-400/80 leading-relaxed italic overflow-y-auto custom-scrollbar-editor shadow-inner relative">
                                {isTranslating ? (
                                   <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-black/40 backdrop-blur-sm">
                                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                      <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Forging Sycamore Shard...</p>
                                   </div>
                                ) : translationResult ? (
                                   <>
                                      <pre>{translationResult}</pre>
                                      <button 
                                         onClick={() => { setCodeMap({ ...codeMap, [activeShard]: translationResult }); setActiveTab('editor'); }}
                                         className="absolute bottom-6 right-6 p-4 bg-emerald-600 rounded-2xl text-white shadow-3xl hover:bg-emerald-500 transition-all active:scale-90"
                                      >
                                         <ArrowUpRight size={20} />
                                      </button>
                                   </>
                                ) : (
                                   <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10">
                                      <RefreshCw size={48} className="animate-spin-slow" />
                                      <p className="text-xs uppercase tracking-widest font-black">Awaiting Handshake Trigger</p>
                                   </div>
                                )}
                             </div>
                             <div className="p-6 bg-emerald-500/5 rounded-[32px] border border-emerald-500/20">
                                <p className="text-[10px] text-emerald-400 italic leading-relaxed text-center font-medium">
                                   "Translation logic aligns third-party telemetry with SEHTI Pillar IV (Technological) ensuring zero data friction."
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              {/* Console Output Footer */}
              <div className="h-64 border-t border-white/10 bg-[#020403] flex flex-col shrink-0 z-20">
                 <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between px-14">
                    <div className="flex items-center gap-5">
                       <Terminal size={18} className="text-slate-600" />
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] italic">NODE_OUTPUT_STREAM</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className={`w-2.5 h-2.5 rounded-full ${complianceStatus === 'COMPLIANT' ? 'bg-emerald-500 shadow-[0_0_100px_#10b981]' : complianceStatus === 'VIOLATION' ? 'bg-rose-600 shadow-[0_0_100px_#e11d48]' : 'bg-slate-800'}`}></div>
                       <span className="text-[11px] font-mono text-slate-700 font-bold uppercase tracking-widest">{complianceStatus}</span>
                    </div>
                 </div>
                 <div className="flex-1 p-10 overflow-y-auto font-mono text-[14px] space-y-4 custom-scrollbar-terminal text-slate-400 leading-relaxed italic bg-black/20">
                    {output.length === 0 ? (
                       <p className="text-slate-800 uppercase tracking-widest text-xs">Waiting for audit trigger...</p>
                    ) : (
                       output.map((log, i) => (
                         <div key={i} className="flex gap-8 animate-in slide-in-from-left-4 duration-300 group/log">
                           <span className="text-emerald-500/20 shrink-0 font-black tracking-tighter">{" >>>"}</span>
                           <span className={log.includes('SUCCESS') || log.includes('COMPLIANT') ? 'text-emerald-400 font-bold' : log.includes('ERROR') || log.includes('VIOLATION') ? 'text-rose-500 font-bold' : 'text-slate-500'}>{log}</span>
                         </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// Internal Helper for Translator
const Languages = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
  </svg>
);

export default AgroLang;
