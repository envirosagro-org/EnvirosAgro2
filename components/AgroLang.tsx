
import React, { useState, useEffect, useRef } from 'react';
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
  ShieldAlert, Gauge, List, Layout
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
  { id: 'S1', title: 'MOISTURE_SYNC', desc: 'Auto-calibrate soil humidity shards.', icon: Waves },
  { id: 'S2', title: 'SWARM_DEFEND', desc: 'Deploy robotic pest containment shards.', icon: Bot },
  { id: 'S3', title: 'LEDGER_SETTLE', desc: 'Anchor commercial finality to L3.', icon: Database },
];

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
  const [hasNewForge, setHasNewForge] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

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
               "Designing industrial sequences that optimize the EnvirosAgro operating system kernel."
            </p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 px-4 relative z-20">
         <div className="p-1 glass-card bg-black/40 rounded-2xl flex border border-white/5 shadow-2xl">
            {[
              { id: 'editor', label: 'Logic Editor', icon: Code2 },
              { id: 'graph', label: 'Signal Flow', icon: GitGraph },
              { id: 'heatmap', label: 'm-Impact Heatmap', icon: Gauge }
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
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Snippet <span className="text-indigo-400">Registry</span></h4>
                 <button className="p-2 text-slate-700 hover:text-white transition-colors"><Plus size={16} /></button>
              </div>
              <div className="space-y-4">
                 {SNIPPETS.map(s => (
                    <div key={s.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400 group-hover:rotate-12 transition-transform shadow-inner"><s.icon size={18} /></div>
                          <span className="text-xs font-black text-white uppercase tracking-tighter">{s.title}</span>
                       </div>
                       <p className="text-[9px] text-slate-500 font-medium italic">"{s.desc}"</p>
                    </div>
                 ))}
              </div>
              <div className="p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20 mt-10">
                 <p className="text-[10px] text-indigo-300 italic leading-relaxed font-medium text-center">"Drag shards into the editor to extend your industrial logic."</p>
              </div>
           </div>
        )}

        <div className={`${isLibraryOpen ? 'xl:col-span-9' : 'xl:col-span-12'} space-y-8 flex flex-col`}>
           <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[700px] relative group">
              <div className="absolute inset-0 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                 <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent absolute top-0 animate-scan"></div>
              </div>

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

                 {activeTab === 'heatmap' && (
                   <div className="flex-1 p-20 animate-in zoom-in duration-500 bg-black/40 flex flex-col items-center justify-center">
                      <div className="max-w-4xl w-full space-y-12">
                         <div className="flex justify-between items-center px-10">
                            <h4 className="text-3xl font-black text-white uppercase italic tracking-widest">m-Constant <span className="text-indigo-400">Load Map</span></h4>
                            <div className="flex items-center gap-3 px-6 py-2 bg-indigo-600/10 rounded-full border border-indigo-500/20 shadow-inner">
                               <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_15px_#6366f1]"></div>
                               <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">NEURAL_CALIBRATION_ACTIVE</span>
                            </div>
                         </div>
                         <div className="grid gap-6">
                            {[
                               { line: 'IMPORT...', impact: 0, col: 'bg-slate-800' },
                               { line: 'AUTHENTICATE...', impact: 12, col: 'bg-indigo-950' },
                               { line: 'CONSTRAIN...', impact: 35, col: 'bg-blue-900' },
                               { line: 'Bio.apply_freq...', impact: 94, col: 'bg-indigo-800 animate-pulse' },
                               { line: 'Bot.swarm_deploy...', impact: 68, col: 'bg-blue-800' },
                               { line: 'COMMIT_SHARD...', impact: 100, col: 'bg-emerald-600 shadow-[0_0_20px_#10b981]' },
                            ].map((heat, i) => (
                               <div key={i} className="flex items-center gap-10 group">
                                  <span className="w-32 text-[11px] font-mono text-slate-600 group-hover:text-white transition-colors">{heat.line}</span>
                                  <div className="flex-1 h-14 bg-black/60 rounded-[32px] border border-white/5 overflow-hidden p-1 shadow-inner relative">
                                     <div className={`h-full rounded-[28px] transition-all duration-[2.5s] ${heat.col}`} style={{ width: `${heat.impact}%` }}></div>
                                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Impact Vector: {heat.impact}%</span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                         </div>
                         <div className="p-10 glass-card rounded-[56px] border border-white/10 bg-black/80 text-center shadow-3xl">
                            <p className="text-slate-400 text-lg italic leading-relaxed font-medium">
                               "Thermal clusters indicate high-frequency OS syscalls. Ensure Bio-Aura frequencies are balanced before final sharding to prevent kernel fatigue."
                            </p>
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
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgroLang;
