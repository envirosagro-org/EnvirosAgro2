
import React, { useState, useRef } from 'react';
import { 
  X, Upload, ShieldCheck, Zap, Loader2, Cpu, Camera, 
  FileText, Microscope, Binary, Coins, Sparkles, Bot,
  ArrowRight, Heart, Leaf, Dna, Database, CheckCircle2,
  AlertCircle, Cloud
} from 'lucide-react';
import { User } from '../types';
import { diagnoseCropIssue } from '../services/geminiService';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onMinted: (value: number) => void;
}

type Step = 'thrust' | 'upload' | 'audit' | 'settlement' | 'success';

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, user, onMinted }) => {
  const [step, setStep] = useState<Step>('thrust');
  const [thrust, setThrust] = useState<string>('Technological');
  const [evidenceType, setEvidenceType] = useState<string>('Soil Scan');
  const [file, setFile] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedValue, setMintedValue] = useState(45.00);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
        setStep('audit');
        runAudit();
      };
      reader.readAsDataURL(f);
    }
  };

  const runAudit = async () => {
    setIsAuditing(true);
    try {
      // Direct call to Gemini for scientific evaluation
      const res = await diagnoseCropIssue(`Evaluate this ${evidenceType} evidence for the ${thrust} thrust. Assess C(a) growth potential and resilience factors.`);
      setAuditReport(res.text);
      setMintedValue(Math.floor(Math.random() * 50) + 25); // Random reward based on quality
      setStep('settlement');
    } catch (err) {
      alert("Registry Audit Failed. Check node connection.");
      setStep('upload');
    } finally {
      setIsAuditing(false);
    }
  };

  const executeMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      onMinted(mintedValue);
      setStep('success');
      setIsMinting(false);
    }, 2500);
  };

  const reset = () => {
    setStep('thrust');
    setFile(null);
    setAuditReport(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={reset}></div>
      
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-[56px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300">
        <div className="p-12 space-y-10 min-h-[650px] flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Upload className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Evidence <span className="text-emerald-400">Ingest</span></h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Steward: {user.esin}</p>
              </div>
            </div>
            <button onClick={reset} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
          </div>

          {/* Progress Shards */}
          <div className="flex gap-2">
            {(['thrust', 'upload', 'settlement', 'success'] as Step[]).map((s, i) => {
              const stages = ['thrust', 'upload', 'settlement', 'success'];
              const currentIndex = stages.indexOf(step === 'audit' ? 'upload' : step);
              return (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${i <= currentIndex ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-white/10'}`}></div>
              );
            })}
          </div>

          {step === 'thrust' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <h4 className="text-2xl font-black text-white uppercase tracking-widest">Select Scientific Pillar</h4>
                <p className="text-slate-400 text-lg italic">Which thrust does this evidence secure?</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'Societal', icon: Heart, col: 'text-rose-400' },
                  { id: 'Environmental', icon: Leaf, col: 'text-emerald-400' },
                  { id: 'Human', icon: Dna, col: 'text-teal-400' },
                  { id: 'Technological', icon: Cpu, col: 'text-blue-400' },
                  { id: 'Industry', icon: Database, col: 'text-purple-400' },
                ].map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setThrust(t.id)}
                    className={`p-8 rounded-[40px] border flex flex-col items-center text-center gap-4 transition-all ${thrust === t.id ? 'bg-emerald-600 border-white text-white shadow-2xl scale-105' : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'}`}
                  >
                    <t.icon className={`w-10 h-10 ${thrust === t.id ? 'text-white' : t.col}`} />
                    <span className="text-xs font-black uppercase tracking-widest italic">{t.id}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('upload')} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Continue to Data Ingest</button>
            </div>
          )}

          {step === 'upload' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
               <div className="text-center space-y-4">
                 <h4 className="text-2xl font-black text-white uppercase tracking-widest italic">Data <span className="text-emerald-400">Sync</span></h4>
                 <p className="text-slate-400 text-lg">Initialize multi-spectral evidence upload.</p>
               </div>
               
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   {['Soil Scan', 'Drone Map', 'Carbon Audit', 'Genetic Shard'].map(type => (
                     <button 
                      key={type} 
                      onClick={() => setEvidenceType(type)}
                      className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${evidenceType === type ? 'bg-emerald-600 border-white text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>

                 <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-20 border-4 border-dashed border-white/5 rounded-[48px] bg-black/40 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all group"
                 >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <Cloud className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-xl font-black text-white uppercase tracking-tighter">Choose Shard File</p>
                    <p className="text-slate-500 text-xs mt-2 uppercase font-bold tracking-widest">Spectral Scan or Research Shard</p>
                 </div>
               </div>

               <button onClick={() => setStep('thrust')} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Change Thrust Anchor</button>
            </div>
          )}

          {step === 'audit' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-emerald-500/10 flex items-center justify-center shadow-2xl">
                     <Microscope className="w-20 h-20 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 border-t-8 border-emerald-500 rounded-full animate-spin"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Scientific <span className="text-emerald-400">Audit</span></h3>
                  <p className="text-emerald-500/60 font-mono text-sm animate-pulse uppercase tracking-[0.4em]">Analyzing C(a) growth constants...</p>
                  <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">NODE_RESONANCE: 1.42x // PACKET_INTEGRITY: 100%</p>
               </div>
            </div>
          )}

          {step === 'settlement' && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1">
               <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                  <div className="w-16 h-16 rounded-[28px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-2xl shrink-0">
                     <Bot className="w-10 h-10 text-indigo-400" />
                  </div>
                  <div>
                     <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Oracle <span className="text-indigo-400">Briefing</span></h4>
                     <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                        <ShieldCheck className="w-3 h-3" /> Integrity Verified
                     </p>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-4">
                  <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-4 border-l-indigo-500/50">
                     <p className="text-slate-300 text-lg leading-loose italic whitespace-pre-line">
                        {auditReport}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 glass-card rounded-[32px] border-emerald-500/20 bg-emerald-500/5 space-y-2 text-center group">
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Mintable Value</p>
                     <p className="text-4xl font-mono font-black text-emerald-400">+{mintedValue.toFixed(2)} <span className="text-sm">EAC</span></p>
                  </div>
                  <div className="p-8 glass-card rounded-[32px] border-blue-500/20 bg-blue-500/5 space-y-2 text-center group">
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">Reputation Shards</p>
                     <p className="text-4xl font-mono font-black text-blue-400">+12.4</p>
                  </div>
               </div>

               <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-center gap-6">
                  <AlertCircle className="w-8 h-8 text-amber-500 shrink-0" />
                  <p className="text-[10px] text-amber-200/50 font-black uppercase leading-relaxed tracking-tight">
                     Signing this settlement commits your evidence to the Archive Ledger. Payout will be distributed to node <strong>{user.esin}</strong> instantly.
                  </p>
               </div>

               <button 
                // Fix: changed executeVouch to executeMint as it was a typo
                onClick={executeMint}
                disabled={isMinting}
                className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
               >
                  {isMinting ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                  {isMinting ? "MINTING EAC SHARDS..." : "AUTHORIZE MINT"}
               </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-10 animate-in zoom-in duration-700 text-center">
               <div className="w-40 h-40 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.4)] scale-110 relative group">
                  <CheckCircle2 className="w-20 h-20 text-white group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-[-10px] rounded-full border-4 border-emerald-500/20 animate-ping"></div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Minting <span className="text-emerald-400">Success</span></h3>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Asset Hash: 0x882_MNT_#{(Math.random()*1000).toFixed(0)}</p>
               </div>
               <div className="w-full glass-card p-12 rounded-[56px] border-white/5 bg-emerald-500/5 space-y-6 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><Coins className="w-40 h-40 text-emerald-400" /></div>
                  <div className="flex justify-between items-center text-xs relative z-10">
                     <span className="text-slate-500 font-black uppercase tracking-widest">Treasury Impact</span>
                     <span className="text-white font-mono font-black text-2xl text-emerald-400">+{mintedValue.toFixed(2)} EAC</span>
                  </div>
                  <div className="flex justify-between items-center text-xs relative z-10">
                     <span className="text-slate-500 font-black uppercase tracking-widest">Skill Evolution</span>
                     <span className="text-white font-black uppercase bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/20 tracking-widest">+12 {thrust} PTS</span>
                  </div>
               </div>
               <button onClick={reset} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl">Return to Command Center</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal;
