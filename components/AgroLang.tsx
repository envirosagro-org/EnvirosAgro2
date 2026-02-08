import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Play, 
  ShieldCheck, 
  Scale, 
  Terminal, 
  Bot, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  FileCode, 
  Zap, 
  Microscope, 
  Database, 
  Coins, 
  Gavel, 
  Stamp, 
  Cpu, 
  Waves, 
  Search, 
  /* Added SearchCode to fix the 'Cannot find name' error on line 133 */
  SearchCode,
  Upload, 
  Download, 
  Binary, 
  Fingerprint, 
  Lock, 
  Workflow, 
  Share2, 
  Info,
  BadgeCheck,
  Target,
  ArrowRight,
  Copy,
  Activity,
  X,
  ShieldPlus,
  Landmark,
  FileSignature,
  Mic2,
  AlertCircle,
  Wind,
  RotateCcw,
  Wand2,
  Send,
  Library,
  BookOpen,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Settings,
  Flame,
  MousePointer2,
  Box,
  Braces,
  Plus,
  FlaskConical,
  Code,
  Network,
  Share,
  LineChart,
  Eye,
  GitGraph,
  Split,
  Table as TableIcon,
  ShieldAlert,
  Gauge
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

const AgroLang: React.FC<AgroLangProps> = ({ user, onSpendEAC, onEarnEAC, onExecuteToShell, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'graph' | 'heatmap'>('editor');
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
  const [isForging, setIsForging] = useState(false);
  const [forgePrompt, setForgePrompt] = useState('');
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [hasNewForge, setHasNewForge] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const currentCode = codeMap[activeShard];

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
      actionIcon: SearchCode
    });

    try {
      const res = await auditAgroLangCode(currentCode);
      setOutput([`[${new Date().toLocaleTimeString()}] INFO: Booting Runtime...`, `[${new Date().toLocaleTimeString()}] SUCCESS: Handshake with ${user.esin} OK.`]);
      
      if (res.is_compliant) {
        setComplianceStatus('COMPLIANT');
        setHasNewForge(true);
        onEmitSignal({
          type: 'ledger_anchor',
          origin: 'ORACLE',
          title: 'AUDIT_COMPLIANT',
          message: `Code shard ${activeShard} verified as compliant with SEHTI standards.`,
          priority: 'medium',
          actionIcon: ShieldCheck,
          meta: { target: 'agrolang', ledgerContext: 'INVENTION' }
        });
      } else {
        setComplianceStatus('VIOLATION');
        onEmitSignal({
          type: 'system',
          origin: 'ORACLE',
          title: 'AUDIT_VIOLATION',
          message: `Code shard ${activeShard} failed compliance check. m-constant drift risk detected.`,
          priority: 'high',
          actionIcon: ShieldAlert
        });
      }
    } catch (e) {
      setOutput(p => [...p, "ERROR: Oracle timeout."]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDeploy = () => {
    onEmitSignal({
      type: 'network',
      origin: 'MANUAL',
      title: 'LOGIC_DEPLOY_REQUEST',
      message: `Steward ${user.name} requesting kernel deployment of ${activeShard}.`,
      priority: 'high',
      actionIcon: Zap
    });
    onExecuteToShell(currentCode);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden flex flex-col items-center gap-12 group shadow-3xl text-center">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12"><Braces className="w-[600px] h-[600px] text-white" /></div>
         <div className="w-40 h-40 rounded-[48px] bg-indigo-700 flex items-center justify-center shadow-3xl ring-8 ring-white/5 relative overflow-hidden group-hover:scale-105 transition-all">
            <Code className="w-20 h-20 text-white relative z-10" />
         </div>
         <div className="space-y-8 relative z-10 max-w-4xl">
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">AGROLANG <span className="text-indigo-400">AI</span> <br/> STUDIO.</h2>
            <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed">"Designing industrial sequences that optimize the EnvirosAgro operating system."</p>
         </div>
      </div>

      <div className="flex justify-center md:justify-start gap-4 px-4">
         <div className="p-1 glass-card bg-black/40 rounded-2xl flex border border-white/5 shadow-inner">
            {[
              { id: 'editor', label: 'CODE EDITOR', icon: Code2 },
              { id: 'graph', label: 'VISUAL FLOW', icon: GitGraph },
              { id: 'heatmap', label: 'm-CONSTANT HEATMAP', icon: Gauge }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
        <div className="xl:col-span-8 space-y-8">
           <div className="glass-card rounded-[80px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[850px] relative">
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                 <div className="flex items-center gap-4">
                    <button onClick={handleCompile} disabled={isCompiling} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-xl flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50">
                       {isCompiling ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="white" />}
                       RUN_AUDIT
                    </button>
                    {hasNewForge && <button onClick={handleDeploy} className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest animate-pulse hover:bg-indigo-500 transition-all shadow-xl">DEPLOY_TO_SHELL</button>}
                 </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden relative">
                 {activeTab === 'editor' && (
                    <div className="flex-1 flex gap-12 p-12 bg-black relative overflow-hidden">
                       <div className="w-14 text-right font-mono text-base text-slate-800 pt-2 border-r border-white/5 pr-8 select-none leading-[2.5]">
                          {[...Array(24)].map((_, i) => <div key={i}>{(i + 1).toString().padStart(2, '0')}</div>)}
                       </div>
                       <textarea 
                          value={currentCode}
                          onChange={(e) => setCodeMap({ ...codeMap, [activeShard]: e.target.value })}
                          spellCheck={false}
                          className="flex-1 bg-transparent border-none outline-none font-mono text-lg md:text-xl text-emerald-400/90 leading-[2.5] resize-none selection:bg-indigo-500/30 overflow-y-auto italic custom-scrollbar-editor"
                       />
                    </div>
                 )}

                 {activeTab === 'heatmap' && (
                   <div className="flex-1 p-20 animate-in zoom-in duration-500 bg-black/40 flex flex-col items-center justify-center">
                      <div className="max-w-4xl w-full space-y-12">
                         <div className="flex justify-between items-center px-10">
                            <h4 className="text-3xl font-black text-white uppercase italic tracking-widest">m-Constant <span className="text-indigo-400">Impact Analysis</span></h4>
                            <div className="flex items-center gap-3 px-6 py-2 bg-indigo-600/10 rounded-full border border-indigo-500/20 shadow-inner">
                               <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                               <span className="text-[10px] font-black text-indigo-400">NEURAL_MAP_ACTIVE</span>
                            </div>
                         </div>
                         <div className="grid gap-6">
                            {[
                               { line: 'IMPORT...', impact: 0, col: 'bg-slate-800' },
                               { line: 'AUTHENTICATE...', impact: 5, col: 'bg-emerald-950' },
                               { line: 'CONSTRAIN...', impact: 15, col: 'bg-blue-900' },
                               { line: 'Bio.apply_freq...', impact: 92, col: 'bg-indigo-800 animate-pulse' },
                               { line: 'Bot.swarm_deploy...', impact: 64, col: 'bg-blue-800' },
                               { line: 'COMMIT_SHARD...', impact: 100, col: 'bg-emerald-600 shadow-[0_0_20px_#10b981]' },
                            ].map((heat, i) => (
                               <div key={i} className="flex items-center gap-8 group">
                                  <span className="w-32 text-[10px] font-mono text-slate-600 group-hover:text-white transition-colors">{heat.line}</span>
                                  <div className="flex-1 h-12 bg-black/60 rounded-2xl border border-white/5 overflow-hidden p-1 shadow-inner relative">
                                     <div className={`h-full rounded-xl transition-all duration-[2s] ${heat.col}`} style={{ width: `${heat.impact}%` }}></div>
                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Impact Vector: {heat.impact}%</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <div className="p-8 glass-card rounded-[40px] border border-white/10 bg-black/60 text-center shadow-xl">
                            <p className="text-sm text-slate-400 italic">"Hot lines indicate high-frequency OS interactions. Optimize frequency sharding to reduce node load."</p>
                         </div>
                      </div>
                   </div>
                 )}
              </div>

              <div className="h-64 border-t border-white/10 bg-[#020403] flex flex-col shrink-0 z-20">
                 <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                       <Terminal size={14} className="text-slate-500" />
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Node_Output_Console</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${complianceStatus === 'COMPLIANT' ? 'bg-emerald-500 shadow-[0_0_100px_#10b981]' : complianceStatus === 'VIOLATION' ? 'bg-rose-600 shadow-[0_0_100px_#e11d48]' : 'bg-slate-800'}`}></div>
                       <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">{complianceStatus}</span>
                    </div>
                 </div>
                 <div className="flex-1 p-10 overflow-y-auto font-mono text-[12px] space-y-3 custom-scrollbar-terminal text-slate-400 leading-relaxed italic">
                    {output.map((log, i) => (
                      <div key={i} className="flex gap-6 animate-in slide-in-from-left-2 duration-300">
                        <span className="text-emerald-500/30 shrink-0 font-black">{" >>>"}</span>
                        <span className={log.includes('SUCCESS') || log.includes('COMPLIANT') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-rose-500' : ''}>{log}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                 <History size={20} className="text-slate-500" />
                 <h4 className="text-xl font-black text-white uppercase italic">Session Ledger</h4>
              </div>
              <div className="space-y-4">
                 {[
                    { id: 'S-1', title: 'Irrigation_Sequence', time: '12m ago', status: 'AUDITED' },
                    { id: 'S-2', title: 'Swarm_Relay_Init', time: '1h ago', status: 'DEPLO' },
                 ].map(s => (
                    <div key={s.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <FileCode className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <div>
                             <p className="text-xs font-black text-white uppercase leading-none">{s.title}</p>
                             <p className="text-[8px] text-slate-600 font-mono mt-1">{s.time}</p>
                          </div>
                       </div>
                       <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">{s.status}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-950/5 space-y-8 shadow-xl relative overflow-hidden group/oracle">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/oracle:scale-110 transition-transform duration-[12s]"><Bot size={300} className="text-indigo-400" /></div>
              <div className="flex items-center gap-4 relative z-10">
                 <Bot className="w-8 h-8 text-indigo-400" />
                 <h4 className="text-xl font-black text-white uppercase italic">Forge <span className="text-indigo-400">Oracle</span></h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic relative z-10 border-l-2 border-indigo-500/20 pl-6">
                 "Registry patterns suggest using ZK-Proof finality for all harvest sharding to ensure 100% price resonance."
              </p>
              <button 
                onClick={() => setShowForgeModal(true)}
                className="relative z-10 w-full py-5 agro-gradient rounded-[28px] text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                 FORGE NEW LOGIC
              </button>
           </div>
        </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AgroLang;