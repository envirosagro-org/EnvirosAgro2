import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Scale as ScaleIcon,
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
  ShieldAlert
} from 'lucide-react';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface AgroLangProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onExecuteToShell: (code: string) => void;
}

const REGISTRY_LIBRARIES = [
  {
    name: 'AGROLAW.CORE',
    version: 'v6.5',
    functions: ['validate_tenure()', 'enforce_gleaning()', 'check_nitrate_cap()', 'apply_sabbath_rest()'],
    icon: Gavel
  },
  {
    name: 'EOS.AUTOMATION',
    version: 'v3.2',
    functions: ['swarm_deploy()', 'irrigate_dynamic()', 'scada_sync()', 'remediate_soil()'],
    icon: Cpu
  },
  {
    name: 'MEDICAG.WELLNESS',
    version: 'v2.0',
    functions: ['scan_aura()', 'apply_freq(hz)', 'triage_herd()', 'calibrate_m_drift()'],
    icon: Activity
  },
  {
    name: 'TOKENZ.FINANCE',
    version: 'v4.0',
    functions: ['mint_utility()', 'fractionalize_asset()', 'settle_escrow()', 'stake_equity()'],
    icon: Coins
  }
];

const AGROLANG_TEMPLATES = [
  { name: 'DROUGHT RESILIENCE SHARD', desc: 'Optimize m-constant during dry cycles.' },
  { name: 'NITROGEN RECOVERY SEQUENCE', desc: 'Remediate soil fatigue using bio-inputs.' },
  { name: 'CARBON MINTING FINALITY', desc: 'Protocol for anchoring sequestration proofs.' },
  { name: 'SWARM MAINTENANCE LOOP', desc: 'Daily robotic diagnostic and charging.' }
];

const REGULATORY_CONSTRAINTS = [
  { id: 1, label: 'TENURE_AUDIT', status: 'PASS', desc: 'Valid land trusteeship shard verified.', icon: Gavel },
  { id: 2, label: 'NITRATE_CAP', status: 'ACTIVE', desc: 'Monitoring nitrogen sharding levels.', icon: FlaskConical },
  { id: 3, label: 'BIO_RESONANCE', status: 'SYNC', desc: 'Acoustic frequency alignment confirmed.', icon: Waves },
];

const AgroLang: React.FC<AgroLangProps> = ({ user, onSpendEAC, onEarnEAC, onExecuteToShell }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'graph' | 'variables'>('editor');
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

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setOutput(prev => [...prev, `[${timestamp}] ${type.toUpperCase()}: ${msg}`]);
  };

  const handleForgeSequence = async () => {
    if (!forgePrompt.trim()) return;
    setIsForging(true);
    try {
      const prompt = `Act as the EnvirosAgro AI Core Engine. Generate advanced AgroLang code for: "${forgePrompt}".
      Include logic blending from Code of Law, m-Constant targets, and SEHTI thrusts.
      Use modern Agroboto primitives like SEQUENCE, CONSTRAIN, Bio.apply_freq, and ZK_PROVEN.
      Ensure the code uses 'user_esin' as a placeholder for the authenticated node.
      Return ONLY the raw code.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      const cleanedCode = res.text.replace(/```[a-z]*\n?/g, '').replace(/```/g, '');
      const newShardName = `AI_Synth_${Math.floor(Math.random()*1000)}.al`;
      setCodeMap(prev => ({ ...prev, [newShardName]: cleanedCode.replace('user_esin', user.esin) }));
      setActiveShard(newShardName);
      setHasNewForge(true);
      setShowForgeModal(false);
      onEarnEAC(15, 'AGROBOTO_INTELLIGENCE_SYNTHESIS');
      addLog(`AI Logic for "${forgePrompt}" synthesized and buffered to ${newShardName}`, 'success');
    } catch (e) {
      addLog("Oracle synthesis failure. Registry handshake timed out.", 'error');
    } finally {
      setIsForging(false);
    }
  };

  const handleCompile = async () => {
    const COMPILATION_FEE = 15;
    if (!await onSpendEAC(COMPILATION_FEE, 'AGROLANG_INDUSTRIAL_AUDIT')) return;

    setIsCompiling(true);
    setOutput([]);
    addLog("Mounting Agroboto Runtime Environment...");
    
    setTimeout(() => {
      addLog("Scanning linked library shards: AgroLaw.Core, EOS.Automation...");
      addLog(`Authenticating Node Steward: ${user.esin} (ZK-PROVEN)`, 'success');
    }, 500);

    setTimeout(() => {
      addLog("Analyzing code for m-constant drift risk...");
      addLog("Cross-referencing logic against Registry Act 2026.");
    }, 1500);

    setTimeout(() => {
      addLog("Simulating sequence: CONSTRAIN moisture_delta...", 'info');
      addLog("SCADA handshake verified. Hardware nodes ready.", 'success');
    }, 2500);

    setTimeout(() => {
      const hasConstraint = currentCode.includes('CONSTRAIN');
      const hasFinality = currentCode.includes('COMMIT_SHARD');
      
      if (!hasConstraint || !hasFinality) {
        addLog("AUDIT_FAILURE: Missing mandatory governance constraints or finality anchor.", 'error');
        setComplianceStatus('VIOLATION');
        setIsCompiling(false);
      } else {
        addLog("Compliance Quorum Reached. Logic resonance: 99.8%", 'success');
        setComplianceStatus('COMPLIANT');
        setIsCompiling(false);
        setHasNewForge(true);
        addLog("Industrial Audit Successful. Logic ready for shell deployment.", 'success');
      }
    }, 3500);
  };

  const handleRunInShell = () => {
    setHasNewForge(false);
    onExecuteToShell(currentCode);
    addLog("Redirecting to FarmOS Shell for OS optimization execution...");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* Visual Identity HUD */}
      <div className="glass-card p-12 rounded-[64px] border-indigo-500/20 bg-indigo-500/[0.02] relative overflow-hidden flex flex-col items-center gap-12 group shadow-3xl text-center">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[15s] pointer-events-none">
            <Braces className="w-[600px] h-[600px] text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-indigo-700 flex items-center justify-center shadow-3xl ring-8 ring-white/5 shrink-0 relative overflow-hidden group-hover:scale-105 transition-all">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <Code className="w-20 h-20 text-white relative z-10" />
            <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-[48px] animate-spin-slow"></div>
         </div>
         <div className="space-y-8 relative z-10 max-w-4xl">
            <div className="space-y-4">
               <div className="flex flex-wrap justify-center gap-3 mb-2">
                  <span className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20 shadow-inner italic">AGRO_IDE_STATION_V6.5</span>
                  <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner italic">RUNTIME: AGROBOTO_OS</span>
               </div>
               <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">AGROLANG <span className="text-indigo-400">AI</span> <br/> STUDIO.</h2>
            </div>
            <div className="relative inline-block">
               <div className="absolute -inset-4 border-2 border-indigo-500/30 rounded-xl pointer-events-none"></div>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed px-4 py-2">
                  "Forge technical sequences that optimize the EnvirosAgro operating system. Blend agricultural programming language with real-time machine learning telemetry."
               </p>
            </div>
         </div>
      </div>

      {/* Broadened Sub-Navigation for IDE Modes */}
      <div className="flex justify-center md:justify-start gap-4 px-4">
         <div className="p-1 glass-card bg-black/40 rounded-2xl flex border border-white/5">
            {[
              { id: 'editor', label: 'CODE EDITOR', icon: Code2 },
              { id: 'graph', label: 'VISUAL FLOW', icon: GitGraph },
              { id: 'variables', label: 'SYMBOL TABLE', icon: TableIcon }
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
        
        {/* SIDEBAR: LIBRARY & ASSETS */}
        <div className="xl:col-span-4 space-y-10 flex flex-col">
           <div className="glass-card rounded-[56px] border-white/5 bg-black/40 flex-1 flex flex-col overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-white/5 bg-white/5 flex items-center justify-between">
                 <h4 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-4">
                    <Library size={20} className="text-indigo-400" /> REGISTRY LIBRARY
                 </h4>
                 <ChevronRight size={18} className="text-slate-600" />
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                 {REGISTRY_LIBRARIES.map(lib => (
                    <div key={lib.name} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-4 rounded-3xl transition-all">
                       <div className="flex items-center gap-5">
                          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                             <lib.icon size={20} />
                          </div>
                          <span className="text-lg font-black text-white uppercase italic tracking-tight">{lib.name}</span>
                       </div>
                       <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">{lib.version}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 rounded-[56px] border border-indigo-500/10 bg-indigo-900/5 space-y-10">
              <h4 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                 <Wand2 size={18} /> AI TEMPLATES
              </h4>
              <div className="space-y-6">
                 {AGROLANG_TEMPLATES.map(tmp => (
                    <button key={tmp.name} className="w-full p-8 rounded-[36px] bg-black/40 border border-white/5 hover:border-indigo-500/40 text-left transition-all group shadow-xl">
                       <p className="text-base font-black text-slate-100 uppercase italic tracking-tight group-hover:text-white transition-colors">{tmp.name}</p>
                       <p className="text-xs text-slate-600 italic mt-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">"{tmp.desc}"</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* CENTER: EDITOR WORKSPACE */}
        <div className="xl:col-span-8 space-y-8">
           <div className="glass-card rounded-[80px] border-2 border-white/5 bg-[#050706] overflow-hidden shadow-3xl flex flex-col h-[950px] relative">
              
              {/* HEADER TABS & CONTROLS */}
              <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                 <div className="flex gap-4 items-center">
                    <div className="p-1 bg-white/10 rounded-2xl flex border border-white/5 shadow-inner">
                       {Object.keys(codeMap).map(shard => (
                         <button 
                           key={shard}
                           onClick={() => setActiveShard(shard)}
                           className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 transition-all ${activeShard === shard ? 'bg-indigo-600 text-white shadow-2xl ring-2 ring-indigo-400/20' : 'text-slate-500 hover:text-slate-200'}`}
                         >
                            <FileCode size={14} /> {shard.split('.')[0]}
                         </button>
                       ))}
                    </div>
                    <button className="p-3 text-slate-700 hover:text-white transition-colors"><Plus size={24} /></button>
                 </div>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowForgeModal(true)}
                      className="px-8 py-5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border-2 border-indigo-500/20 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all shadow-xl"
                    >
                      <Bot size={18} /> FORGE_LOGIC
                    </button>
                    
                    {/* RUN IN AGRO SHELL BUTTON - Prominent After Synthesis or Audit */}
                    <button 
                      onClick={handleRunInShell}
                      className={`px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all shadow-xl relative group ${hasNewForge ? 'bg-indigo-600 text-white shadow-indigo-500/50 ring-4 ring-indigo-400/20 animate-pulse' : 'bg-white/5 text-slate-600 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Terminal size={18} /> 
                      RUN_IN_SHELL
                      {hasNewForge && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-indigo-600 animate-ping"></span>
                      )}
                    </button>

                    <button 
                      onClick={handleCompile}
                      disabled={isCompiling}
                      className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all flex items-center gap-4 active:scale-95 disabled:opacity-30 border border-white/10 ring-8 ring-white/5"
                    >
                       {isCompiling ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} fill="white" />}
                       AUDIT_EXEC
                    </button>
                 </div>
              </div>

              {/* DYNAMIC CONTENT AREA BASED ON TAB */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                 {activeTab === 'editor' && (
                    <div className="flex-1 flex gap-12 p-12 bg-black relative overflow-hidden">
                       <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                       <div className="w-14 text-right font-mono text-base text-slate-800 pt-2 border-r border-white/5 pr-8 select-none leading-[2.5]">
                          {/* Fix: Corrected JSX syntax for rendering line numbers to avoid parser error on assignment expression */}
                          {[...Array(24)].map((_, i) => <div key={i}>{(i + 1).toString().padStart(2, '0')}</div>)}
                       </div>
                       <textarea 
                          value={currentCode}
                          onChange={(e) => setCodeMap({ ...codeMap, [activeShard]: e.target.value })}
                          spellCheck={false}
                          className="flex-1 bg-transparent border-none outline-none font-mono text-lg md:text-xl text-emerald-400/90 leading-[2.5] resize-none selection:bg-indigo-500/30 overflow-y-auto custom-scrollbar-editor italic"
                       />
                       
                       <div className="absolute bottom-12 right-12 z-30">
                          <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-3xl animate-float border-4 border-[#050706] relative group">
                             <Bot size={40} className="text-white relative z-10" />
                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'graph' && (
                    <div className="flex-1 p-20 flex flex-col items-center justify-center bg-black/60 relative animate-in zoom-in duration-500">
                       <div className="absolute top-10 left-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Logic Flow Shard</p>
                       </div>
                       <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
                          {[
                             { l: 'AUTH', i: Fingerprint, c: 'indigo' },
                             { l: 'CONSTRAIN', i: ShieldAlert, c: 'rose' },
                             { l: 'BIO_SIGNAL', i: Waves, c: 'emerald' },
                             { l: 'ROBOTIC_SWARM', i: Bot, c: 'blue' },
                             { l: 'COMMIT', i: Stamp, c: 'emerald' }
                          ].map((step, i) => (
                             <React.Fragment key={i}>
                                <div className={`w-full max-sm p-6 bg-black/80 border-2 rounded-[32px] flex items-center justify-between shadow-2xl transition-all hover:scale-105 ${i === 0 ? 'border-indigo-500/40' : 'border-white/10'}`}>
                                   <div className="flex items-center gap-6">
                                      <div className={`p-4 bg-${step.c}-600/20 rounded-2xl text-${step.c}-400`}>
                                         <step.i size={24} />
                                      </div>
                                      <span className="text-lg font-black text-white italic tracking-widest">{step.l}</span>
                                   </div>
                                   <div className="p-3 bg-white/5 rounded-xl text-slate-700 font-mono text-[9px]">0x{Math.floor(Math.random()*1000).toString(16).toUpperCase()}</div>
                                </div>
                                {i < 4 && <div className="h-10 w-[2px] bg-gradient-to-b from-white/10 to-transparent"></div>}
                             </React.Fragment>
                          ))}
                       </div>
                    </div>
                 )}

                 {activeTab === 'variables' && (
                    <div className="flex-1 p-16 animate-in slide-in-from-bottom-10 duration-700 overflow-y-auto">
                       <div className="space-y-12">
                          <div className="flex items-center justify-between border-b border-white/5 pb-8">
                             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Symbol <span className="text-indigo-400">Table</span></h3>
                             <div className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[9px] font-black uppercase">Shard_Integrity: 100%</div>
                          </div>
                          
                          <div className="grid gap-4">
                             {[
                                { k: 'm_DRIFT_LIMIT', v: '0.02', t: 'Float', d: 'Maximum permissible m-constant deviation before halt.' },
                                { k: 'REGISTRY_TARGET', v: 'GLOBAL_L3', t: 'String', d: 'Canonical ledger anchor for finality.' },
                                { k: 'AUTOSYNC_ENABLED', v: 'TRUE', t: 'Boolean', d: 'Enable real-time telemetry-to-code sharding.' },
                                { k: 'RESONANCE_FREQ', v: '432Hz', t: 'Frequency', d: 'Primary biological calibration constant.' },
                             ].map((sym, i) => (
                                <div key={i} className="p-8 glass-card bg-black/40 border border-white/5 rounded-[40px] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                                   <div className="flex items-center gap-10">
                                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-indigo-400 transition-colors">
                                         <Code size={24} />
                                      </div>
                                      <div>
                                         <p className="text-2xl font-mono font-black text-white tracking-tighter">{sym.k}</p>
                                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">"{sym.d}"</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-10">
                                      <div className="text-right">
                                         <p className="text-[9px] text-slate-700 font-black uppercase">Type</p>
                                         <p className="text-sm font-black text-slate-400">{sym.t}</p>
                                      </div>
                                      <div className="p-6 bg-black/60 rounded-3xl border border-white/5 text-center min-w-[120px]">
                                         <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Current Val</p>
                                         <p className="text-xl font-mono font-black text-emerald-400">{sym.v}</p>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              {/* Console Area */}
              <div className="h-64 border-t border-white/10 bg-[#020403] flex flex-col shrink-0 z-20">
                 <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between px-10">
                    <div className="flex items-center gap-4">
                       <Terminal size={14} className="text-slate-500" />
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Node_Output_Console</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-2 rounded-full ${isCompiling ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_100px_#10b981]'}`}></div>
                       <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">System_Stable</span>
                    </div>
                 </div>
                 <div ref={terminalRef} className="flex-1 p-10 overflow-y-auto font-mono text-[12px] space-y-3 custom-scrollbar-terminal text-slate-400 leading-relaxed italic">
                    {output.length === 0 && <div className="opacity-20 uppercase tracking-widest">Awaiting industrial logic deployment...</div>}
                    {output.map((log, i) => (
                      <div key={i} className="flex gap-6 animate-in slide-in-from-left-2 duration-300">
                        <span className="text-emerald-500/30 shrink-0 font-black">>>></span>
                        <span className={
                          log.includes('SUCCESS') ? 'text-emerald-400 font-bold shadow-emerald-500/10' : 
                          log.includes('VIOLATION') || log.includes('ERROR') ? 'text-rose-500 font-black animate-pulse' : 
                          log.includes('COMPLIANT') ? 'text-blue-400 font-black' : 'text-slate-400'
                        }>
                          {log}
                        </span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* AI FORGE MODAL */}
      {showForgeModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowForgeModal(false)}></div>
          <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] p-12 md:p-16 shadow-[0_0_200px_rgba(99,102,241,0.2)] text-center space-y-12 border-2">
             <div className="space-y-8">
                <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto shadow-3xl animate-float border-2 border-white/10">
                   <Wand2 size={40} className="text-white" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Advanced Logic <span className="text-indigo-400">Synthesis</span></h3>
                   <p className="text-slate-400 text-lg italic font-medium">"Describe your agricultural mission. The AI Oracle will forge an advanced AgroLang shard blending Law and OS logic."</p>
                </div>
             </div>
             <div className="relative">
                <textarea 
                  value={forgePrompt}
                  onChange={e => setForgePrompt(e.target.value)}
                  placeholder="e.g. Develop a high-m-constant irrigation shard for Bantu Maize in Sector 4, limited by Nairobi Water Act 2026..."
                  className="w-full bg-black border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none h-48 resize-none shadow-inner placeholder:text-slate-900 italic" 
                />
                <div className="absolute bottom-6 left-10 flex gap-2">
                   <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black text-slate-500 border border-white/5 uppercase">NLP_INGEST_READY</span>
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setShowForgeModal(false)} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all shadow-xl">Abort</button>
                <button 
                  onClick={handleForgeSequence}
                  disabled={isForging || !forgePrompt.trim()}
                  className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-[0_0_100px_rgba(99,102,241,0.3)] flex items-center justify-center gap-6 active:scale-95 transition-all disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                >
                   {isForging ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                   {isForging ? 'MINTING LOGIC...' : 'FORGE AGROLOGIC'}
                </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar-editor::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 4s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AgroLang;