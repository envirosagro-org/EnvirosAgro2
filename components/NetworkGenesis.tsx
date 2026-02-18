
import React, { useState, useMemo } from 'react';
import { 
  Construction, 
  Binary, 
  BadgeCheck, 
  Bot, 
  Sparkles, 
  Loader2, 
  Target, 
  Radio, 
  Database, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  History, 
  ArrowRight,
  Stamp,
  Network,
  Cpu,
  Fingerprint,
  ChevronRight,
  CheckCircle2,
  X,
  History as HistoryIcon,
  Atom,
  Wind,
  Layers,
  SearchCode
} from 'lucide-react';
import { User, ViewState } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';
import { SycamoreLogo } from '../App';

interface NetworkGenesisProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onNavigate: (view: ViewState) => void;
}

const SHARD_TEMPLATES = [
  { id: 'CORE', label: 'Primary Mesh Hub', desc: 'Initialize a root node for a new regional cluster.', cost: 1000, col: 'text-indigo-400', icon: Database },
  { id: 'INGEST', label: 'Telemetry Relay', desc: 'Provision a high-frequency data ingest point.', cost: 450, col: 'text-emerald-400', icon: Radio },
  { id: 'STORAGE', label: 'Immutable Vault', desc: 'Anchor redundant history sharding for existing nodes.', cost: 250, col: 'text-blue-400', icon: Database },
];

const NetworkGenesis: React.FC<NetworkGenesisProps> = ({ user, onEarnEAC, onSpendEAC, onNavigate }) => {
  const [step, setStep] = useState<'selection' | 'config' | 'audit' | 'genesis' | 'success'>('selection');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof SHARD_TEMPLATES[0] | null>(null);
  const [shardAlias, setShardAlias] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');
  const [isMintingGenesis, setIsMintingGenesis] = useState(false);

  const handleRunAudit = async () => {
    if (!shardAlias.trim()) return;
    setIsAuditing(true);
    setStep('audit');
    try {
      const prompt = `Act as the EnvirosAgro Network Architect. Analyze the proposal for a new ${selectedTemplate?.label} named "${shardAlias}". 
      Assess its impact on the planetary m-constant resonance. 
      Verify its alignment with the SEHTI framework.
      Calculate the "Resilience Yield" for this induction.
      Format as an OFFICIAL AUDIT SHARD.`;
      
      const res = await chatWithAgroExpert(prompt, []);
      setAuditReport(res.text);
    } catch (e) {
      setAuditReport("ORACLE_HANDSHAKE_ERROR: Mesh congestion detected in the building buffer.");
    } finally {
      setIsAuditing(false);
    }
  };

  const executeGenesisHandshake = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    
    if (selectedTemplate && await onSpendEAC(selectedTemplate.cost, `NETWORK_GENESIS_PROVISION_${selectedTemplate.id}`)) {
      setIsMintingGenesis(true);
      setStep('genesis');
      // Final finality sync simulation
      setTimeout(() => {
        setIsMintingGenesis(false);
        setStep('success');
        onEarnEAC(100, 'GENESIS_BUILDER_REWARD');
      }, 3500);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-6xl mx-auto px-4">
      
      {/* 1. Integrated Header HUD */}
      <div className="glass-card p-12 md:p-16 rounded-[80px] border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-3xl group">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
            <Network size={800} className="text-indigo-400" />
         </div>
         <div className="w-32 h-32 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-3xl ring-8 ring-white/5 relative overflow-hidden">
            <Construction size={56} className="text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">NETWORK <span className="text-indigo-400">GENESIS.</span></h2>
            <p className="text-slate-400 text-2xl font-medium italic leading-relaxed opacity-90">
               "Constructing the foundations of global agricultural transparency. Induct new mesh shards and sign the genesis block of your regional cluster."
            </p>
         </div>
      </div>

      <div className="min-h-[600px] relative z-10">
        
        {step === 'selection' && (
           <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center px-10">
                 <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Select Shard <span className="text-indigo-400">Blueprint</span></h4>
                 <p className="text-slate-600 mt-4 italic font-medium">Provision the physical or virtual core of a new network shard.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                 {SHARD_TEMPLATES.map(tmp => (
                    <div 
                      key={tmp.id} 
                      onClick={() => { setSelectedTemplate(tmp); setStep('config'); }}
                      className="glass-card p-10 rounded-[64px] border-2 border-white/5 hover:border-indigo-500/40 bg-black/40 flex flex-col justify-between h-[480px] shadow-3xl group cursor-pointer active:scale-95 transition-all"
                    >
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${tmp.col} shadow-inner group-hover:rotate-6 transition-all`}>
                             <tmp.icon size={32} />
                          </div>
                          <span className="px-4 py-1.5 bg-black/60 rounded-full border border-white/10 text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">v6.5_TMPL</span>
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h5 className="text-3xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0">{tmp.label}</h5>
                          <p className="text-sm text-slate-400 italic leading-relaxed">"{tmp.desc}"</p>
                       </div>
                       <div className="pt-8 border-t border-white/5 flex items-end justify-between relative z-10">
                          <div>
                             <p className="text-[9px] text-slate-700 font-black uppercase mb-1">Induction Cost</p>
                             <p className="text-4xl font-mono font-black text-emerald-400">{tmp.cost}<span className="text-sm italic font-sans text-indigo-400 ml-1">EAC</span></p>
                          </div>
                          <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                             <ChevronRight size={24} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {step === 'config' && selectedTemplate && (
           <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-700">
              <div className="glass-card p-12 md:p-16 rounded-[64px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl space-y-12">
                 <div className="flex items-center gap-6 border-b border-white/5 pb-10">
                    <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><selectedTemplate.icon size={28} className="text-white" /></div>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Configure <span className="text-indigo-400">Induced Node</span></h3>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="space-y-3 px-4">
                       <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Shard Alias (Induction Identifier)</label>
                       <input 
                         type="text" value={shardAlias} onChange={e => setShardAlias(e.target.value)}
                         placeholder="e.g. Zone-4-Relay-Alpha"
                         className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-3xl font-black text-white focus:ring-8 focus:ring-indigo-500/10 transition-all outline-none italic placeholder:text-stone-900 shadow-inner" 
                       />
                    </div>
                    
                    <div className="p-8 bg-indigo-950/20 rounded-[44px] border border-indigo-500/20 flex items-center justify-between shadow-inner">
                       <div className="flex items-center gap-6">
                          <Bot size={28} className="text-indigo-400 animate-pulse" />
                          <p className="text-[10px] text-slate-400 italic max-w-[250px]">"Automated Oracle audit will trigger upon submission to ensure regional stability (m)."</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-700 font-black uppercase">Shard Induction Cost</p>
                          <p className="text-4xl font-mono font-black text-white">{selectedTemplate.cost}</p>
                       </div>
                    </div>

                    <button 
                      onClick={handleRunAudit}
                      disabled={!shardAlias.trim()}
                      className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[24px] ring-indigo-500/5 disabled:opacity-20"
                    >
                       <Target size={32} className="fill-current mr-4" /> INITIALIZE AUDIT SHARD
                    </button>
                 </div>
              </div>
           </div>
        )}

        {step === 'audit' && (
           <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-10 duration-700">
              <div className="glass-card rounded-[80px] min-h-[600px] border-2 border-indigo-500/20 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 px-16">
                    <div className="flex items-center gap-6 text-indigo-400">
                       <Bot className="animate-pulse" />
                       <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Oracle_Audit_Terminal</span>
                    </div>
                 </div>

                 <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar relative bg-black/40">
                    {isAuditing ? (
                       <div className="h-full flex flex-col items-center justify-center space-y-16 py-32 text-center animate-in zoom-in">
                          <div className="relative">
                             <div className="w-48 h-48 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                             <div className="absolute inset-0 flex items-center justify-center"><Binary size={56} className="text-indigo-400 animate-pulse" /></div>
                          </div>
                          <p className="text-indigo-400 font-black text-4xl uppercase tracking-[0.8em] animate-pulse italic m-0">AUDITING_GENESIS_VECTORS...</p>
                       </div>
                    ) : (
                       <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 pb-16">
                          <div className="p-12 md:p-20 bg-black/90 rounded-[80px] border-2 border-indigo-500/20 prose prose-invert prose-indigo max-w-none shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[24px] border-l-indigo-600 relative overflow-hidden group/shard text-left">
                             <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/shard:scale-110 transition-transform duration-[15s] pointer-events-none"><Database size={800} className="text-indigo-400" /></div>
                             <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                                <div className="flex items-center gap-8">
                                   <BadgeCheck size={56} className="text-indigo-400" />
                                   <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Induction Audit Shard</h4>
                                </div>
                                <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                                   <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest italic">AUDIT_0x882A_OK</span>
                                </div>
                             </div>
                             <div className="text-slate-300 text-3xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-6 border-l-2 border-white/5">
                                {auditReport}
                             </div>
                             <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                                <div className="flex items-center gap-8">
                                   <Fingerprint size={64} className="text-indigo-400" />
                                   <div className="text-left">
                                      <p className="text-[12px] text-slate-600 font-black uppercase tracking-widest">Audit Genesis Hash</p>
                                      <p className="text-2xl font-mono text-white italic">0xHS_GENESIS_#{(Math.random()*1000).toFixed(0)}</p>
                                   </div>
                                </div>
                                <button onClick={() => setStep('genesis')} className="px-24 py-10 agro-gradient rounded-full text-white font-black text-[16px] uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all ring-[16px] ring-white/5 border-4 border-white/10">PROCEED TO SIGNATURE</button>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {step === 'genesis' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-10 duration-700 flex flex-col justify-center">
              <div className="text-center space-y-8">
                 <div className="w-40 h-40 bg-indigo-600 rounded-[44px] flex items-center justify-center mx-auto text-white shadow-3xl border-8 border-[#050706] ring-8 ring-indigo-500/5 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                    <Fingerprint size={80} className="relative z-10 group-hover:scale-110 transition-transform animate-float" />
                 </div>
                 <h4 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">Genesis <span className="text-indigo-400">Signature.</span></h4>
                 <p className="text-slate-400 text-2xl font-medium italic">"Authorize the finality anchor for your newly provisioned mesh shard."</p>
              </div>

              <div className="max-w-xl mx-auto w-full space-y-12 pt-10">
                 <div className="space-y-6">
                    <label className="text-[13px] font-black text-slate-500 uppercase tracking-[0.8em] block text-center italic leading-none">NODE_SIGNATURE_AUTH (ESIN)</label>
                    <input 
                       type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                       placeholder="EA-XXXX-XXXX-XXXX" 
                       className="w-full bg-black border-2 border-white/10 rounded-[56px] py-14 text-center text-5xl md:text-7xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-stone-900 shadow-inner" 
                    />
                 </div>
                 
                 <button 
                    onClick={executeGenesisHandshake}
                    disabled={isMintingGenesis || !esinSign}
                    className="w-full py-12 md:py-16 agro-gradient rounded-full text-white font-black text-xl md:text-2xl uppercase tracking-[0.6em] shadow-[0_0_200px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-12 border-4 border-white/10 ring-[32px] ring-white/5 group/sign"
                 >
                    {isMintingGenesis ? <Loader2 className="w-12 h-12 animate-spin" /> : <Stamp className="w-12 h-12 fill-current group-hover/sign:scale-110 transition-transform" />}
                    {isMintingGenesis ? "MINTING GENESIS..." : "AUTHORIZE GENESIS"}
                 </button>
                 <button onClick={() => setStep('audit')} className="w-full text-[11px] font-black text-slate-700 uppercase tracking-[1em] hover:text-white transition-colors">Discard Audit Shard</button>
              </div>
           </div>
        )}

        {step === 'success' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-20 py-20 animate-in zoom-in duration-1000 text-center relative">
              <div className="w-80 h-80 agro-gradient rounded-full flex items-center justify-center mx-auto text-white shadow-[0_0_300px_rgba(99,102,241,0.6)] relative group scale-110">
                 <CheckCircle2 size={160} className="group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-[-30px] rounded-full border-8 border-emerald-500/20 animate-ping opacity-30"></div>
                 <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-8 text-center">
                 <h3 className="text-8xl md:text-[140px] font-black text-white uppercase tracking-tighter italic m-0 leading-none">SHARD <span className="text-indigo-400">ANCHORED.</span></h3>
                 <p className="text-indigo-400 text-xl font-black uppercase tracking-[1em] font-mono mt-10">GENESIS_BLOCK_0x{(Math.random()*1000).toFixed(0)}_FINAL</p>
              </div>
              <div className="p-12 glass-card rounded-[80px] border-2 border-indigo-500/20 bg-indigo-500/5 space-y-12 max-w-2xl w-full shadow-2xl relative overflow-hidden group/ok">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/ok:scale-110 transition-transform duration-[15s]"><BadgeCheck size={400} /></div>
                 <div className="flex justify-between items-center text-xs relative z-10 px-4">
                    <span className="text-slate-500 font-black uppercase tracking-widest italic">Node Status</span>
                    <span className="text-white font-mono font-black text-3xl text-emerald-400 uppercase italic">ACTIVE_MESH_NODE</span>
                 </div>
                 <div className="h-px w-full bg-white/10 relative z-10"></div>
                 <div className="flex items-center gap-8 text-left relative z-10 px-4">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-3xl">
                       <ShieldCheck size={40} />
                    </div>
                    <div>
                       <p className="text-xl font-black text-white uppercase italic">Sovereign Shard Finality</p>
                       <p className="text-base text-slate-400 italic mt-2 leading-relaxed">"Your induced node is now immutably anchored to the Layer-3 industrial ledger. Registry synchronization nominal."</p>
                    </div>
                 </div>
              </div>
              <button onClick={() => onNavigate('dashboard')} className="px-24 py-10 bg-white/5 border-4 border-white/10 rounded-full text-white font-black text-sm uppercase tracking-[0.6em] hover:bg-white/10 transition-all shadow-xl active:scale-95 ring-[24px] ring-white/5">Return to Command Hub</button>
           </div>
        )}
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 80px 200px -50px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default NetworkGenesis;
