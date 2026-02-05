import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dna, 
  FlaskConical, 
  Zap, 
  Bot, 
  Sparkles, 
  Loader2, 
  ShieldCheck, 
  SearchCode, 
  Microscope, 
  Binary, 
  TrendingUp, 
  Atom, 
  Activity, 
  Lock, 
  Database, 
  Fingerprint, 
  Search, 
  ChevronRight, 
  ShieldPlus, 
  Terminal, 
  Scan, 
  Layers, 
  Star, 
  Heart, 
  AlertTriangle,
  FileCode,
  BadgeCheck,
  Circle,
  X,
  Monitor,
  Sprout,
  Cookie,
  Landmark,
  Info,
  Download,
  Target,
  Stamp,
  Key,
  Waves,
  History,
  Workflow,
  BoxSelect,
  FileDigit,
  Radiation,
  CheckCircle2,
  Microscope as LabIcon
} from 'lucide-react';
import { User } from '../types';
import { decodeAgroGenetics, chatWithAgroExpert } from '../services/geminiService';

interface BiotechnologyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
}

const GENETIC_ARCHIVE = [
  { id: 'GEN-882', name: 'Maize Resilience Shard v4', trait: 'Drought Resistance', stability: 98.4, status: 'VERIFIED', cost: 1500, col: 'text-blue-400', sequence: 'ATGC-882-SYNC' },
  { id: 'GEN-104', name: 'Fortified Wheat Genome', trait: 'High Protein Density', stability: 92.1, status: 'AUDITING', cost: 2500, col: 'text-amber-400', sequence: 'TAGC-104-GATE' },
  { id: 'GEN-042', name: 'Bantu Rice DNA', trait: 'Pest Shield Alpha', stability: 99.8, status: 'VERIFIED', cost: 3200, col: 'text-emerald-400', sequence: 'GCTA-042-CORE' },
];

const Biotechnology: React.FC<BiotechnologyProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'decoder' | 'forge' | 'archive'>('decoder');
  
  // Decoder States
  const [bioSignal, setBioSignal] = useState(0.85);
  const [techStatus, setTechStatus] = useState(0.72);
  const [marketDemand, setMarketDemand] = useState(0.65);
  const [govIntegrity, setGovIntegrity] = useState(0.91);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<any | null>(null);
  const [dnaAnimation, setDnaAnimation] = useState(0);

  // Forge States
  const [isForging, setIsForging] = useState(false);
  const [forgeStep, setForgeStep] = useState<'config' | 'sequencing' | 'success'>('config');
  const [genomeTitle, setGenomeTitle] = useState('');
  const [genomeTrait, setGenomeTrait] = useState('Pest Resistance');
  const [stabilityIndex, setStabilityIndex] = useState(85);
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [esinSign, setEsinSign] = useState('');

  // Archive States
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDnaAnimation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleRunDecoder = async () => {
    const DECODE_FEE = 30;
    if (!await onSpendEAC(DECODE_FEE, 'AGRO_GENETIC_DECODING_PROTOCOL')) return;

    setIsDecoding(true);
    setDecodedData(null);
    try {
      const telemetry = {
        bio_signal: bioSignal,
        tech_status: techStatus,
        market_demand: marketDemand,
        gov_integrity: govIntegrity,
        sehti_thrusts: [0.82, 0.76, 0.88, 0.94, 0.70] // Reference thrusts
      };
      const result = await decodeAgroGenetics(telemetry);
      setDecodedData(result);
      onEarnEAC(15, 'ECOSYSTEM_DNA_DECODED');
    } catch (err) {
      alert("Oracle Consensus Error: Handshake interrupted.");
    } finally {
      setIsDecoding(false);
    }
  };

  const handleForgeGenome = async () => {
    if (!genomeTitle.trim() || esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    
    const FORGE_COST = 100;
    if (await onSpendEAC(FORGE_COST, `GENOME_FORGE_${genomeTitle.toUpperCase()}`)) {
      setIsForging(true);
      setForgeStep('sequencing');
      try {
        const prompt = `Act as an EOS Geneticist. Forge a genomic shard for:
        Identity: ${genomeTitle}
        Primary Trait: ${genomeTrait}
        Stability Target: ${stabilityIndex}%
        
        Provide a technical DNA sharding report including phenotypic expression targets and SEHTI alignment.`;
        const res = await chatWithAgroExpert(prompt, []);
        setForgeResult(res.text);
        setIsForging(false);
      } catch (e) {
        alert("Oracle disconnected. Shard lost in void.");
        setForgeStep('config');
        setIsForging(false);
      }
    }
  };

  const finalizeForge = () => {
    onEarnEAC(50, 'IMMUTABLE_GENOME_ANCHORED');
    setForgeStep('success');
  };

  const filteredArchive = useMemo(() => 
    GENETIC_ARCHIVE.filter(g => 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.trait.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* 1. Portal Header HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
              <Dna className="w-[800px] h-[800px] text-white" />
           </div>
           
           <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[64px] bg-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.4)] flex items-center justify-center ring-4 ring-white/10 relative overflow-hidden group-hover:scale-105 transition-all duration-700">
                 <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                 <Dna size={96} className="text-white animate-spin-slow" />
              </div>
              <div className="absolute -bottom-4 -right-4 p-4 glass-card rounded-2xl bg-black/80 border border-white/20 shadow-2xl flex flex-col items-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Consensus</span>
                 <p className="text-xl font-mono font-black text-emerald-400 leading-none">99.8%</p>
              </div>
           </div>

           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-blue-500/20 shadow-inner">EOS_GENETIC_SYSTEM_v5.2</span>
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20 shadow-inner">MUGUMO_SYNC_READY</span>
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Genetic <span className="text-blue-400">Decoder</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-2xl">
                 "Mapping the biological architecture of sustainable clusters. Ingesting agro-telemetry to decode the genetic base-pairs of regional resonance."
              </p>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-xl group">
           <div className="absolute inset-0 bg-blue-500/[0.01] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Genomic Shards</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter italic">42</h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Sync Velocity</span>
                 <span className="text-blue-400">HIGH</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                 <div className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]" style={{ width: '92%' }}></div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-4 p-2 glass-card rounded-[36px] w-full lg:w-fit border border-white/5 bg-black/40 shadow-2xl px-6 mx-auto lg:mx-4 relative z-20">
        {[
          { id: 'decoder', label: 'Ecosystem Decoder', icon: Scan },
          { id: 'forge', label: 'DNA Shard Forge', icon: FlaskConical },
          { id: 'archive', label: 'Genomic Archive', icon: Database },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-105 ring-4 ring-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px] px-4 relative z-10">
        
        {/* --- TAB: ECOSYSTEM DECODER --- */}
        {activeTab === 'decoder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-left-4 duration-700">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                         <Scan size={28} className="text-blue-400" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Telemetry <span className="text-blue-400">Ingest</span></h3>
                         <p className="text-[9px] font-mono text-slate-500 uppercase">Input Ecosystem Base-Pairs</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      {[
                        { l: 'A: AGRO-BIO (Plant/Soil)', v: bioSignal, set: setBioSignal, col: 'accent-emerald-500', icon: Sprout },
                        { l: 'T: TECH (Automation)', v: techStatus, set: setTechStatus, col: 'accent-blue-500', icon: Bot },
                        { l: 'C: CONSUME (Market)', v: marketDemand, set: setMarketDemand, col: 'accent-orange-500', icon: Cookie },
                        { l: 'G: GOVERN (Institutional)', v: govIntegrity, set: setGovIntegrity, col: 'accent-indigo-500', icon: Landmark },
                      ].map((base, idx) => (
                        <div key={idx} className="space-y-4 group">
                           <div className="flex justify-between items-center px-4">
                              <div className="flex items-center gap-3">
                                 <base.icon className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300">{base.l}</label>
                              </div>
                              <span className="text-xl font-mono font-black text-white group-hover:scale-110 transition-transform">{base.v.toFixed(2)}</span>
                           </div>
                           <input 
                             type="range" min="0" max="1" step="0.01" value={base.v} 
                             onChange={e => base.set(parseFloat(e.target.value))}
                             className={`w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer ${base.col} shadow-inner group-hover:h-3 transition-all`} 
                           />
                        </div>
                      ))}
                   </div>

                   <button 
                    onClick={handleRunDecoder}
                    disabled={isDecoding}
                    className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                   >
                      {isDecoding ? <Loader2 className="w-8 h-8 animate-spin" /> : <Binary className="w-8 h-8" />}
                      {isDecoding ? 'SEQUENCING SHARDS...' : 'DECODE ECOSYSTEM DNA'}
                   </button>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-emerald-500/10 bg-emerald-500/5 space-y-6 group shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-600/10 rounded-2xl border border-emerald-500/20 group-hover:rotate-12 transition-transform"><Sparkles size={24} className="text-emerald-500" /></div>
                      <h4 className="text-xl font-black text-white uppercase italic">Decoding <span className="text-emerald-500">Yield</span></h4>
                   </div>
                   <p className="text-sm text-slate-400 italic leading-relaxed">
                      "High-fidelity decodes earn up to 30 EAC per session. Maintaining genomic consensus increases regional node multipliers."
                   </p>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] border-2 border-white/5 bg-[#050706] flex flex-col min-h-[750px] relative overflow-hidden shadow-3xl">
                   {/* Terminal Scanline FX */}
                   <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                      <div className="w-full h-1/2 bg-gradient-to-b from-blue-500/10 to-transparent absolute top-0 animate-scan"></div>
                   </div>

                   <div className="p-10 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-10">
                      <div className="flex items-center gap-8">
                         <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                            <Monitor size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Oracle <span className="text-blue-400">Terminal</span></h3>
                            <p className="text-blue-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_DNA_LINK // EOS_PROTOCOL_V5.2</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_100px_#10b981]"></div>
                            <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest">ORACLE_STABLE</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10">
                      {!decodedData && !isDecoding ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-16 py-20 opacity-20 group">
                           <div className="relative">
                              <LabIcon size={180} className="text-slate-500 group-hover:text-blue-400 transition-colors duration-1000" />
                              <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">DECODER_STANDBY</p>
                              <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Awaiting industrial telemetry ingest</p>
                           </div>
                        </div>
                      ) : isDecoding ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <div className="w-64 h-64 rounded-full border-8 border-blue-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,0.2)]">
                                 <Dna size={100} className="text-blue-500 animate-pulse" />
                              </div>
                              <div className="absolute inset-[-15px] border-t-8 border-blue-500 rounded-full animate-spin"></div>
                           </div>
                           <div className="space-y-6">
                              <p className="text-blue-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">SEQUENCING HELIX SHARDS...</p>
                              <div className="flex justify-center gap-1.5">
                                 {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-12 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 pb-10">
                           <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-indigo-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[12px] border-l-blue-600/50 relative overflow-hidden group/shard">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><Atom size={600} className="text-blue-400" /></div>
                              
                              <div className="flex justify-between items-center mb-10 relative z-10 border-b border-white/5 pb-8">
                                 <div className="flex items-center gap-6">
                                    <ShieldCheck className="w-10 h-10 text-blue-400" />
                                    <h4 className="text-3xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Diagnostic Result</h4>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-black uppercase">Consensus confidence</p>
                                    <p className="text-3xl font-mono font-black text-emerald-400">99.8%</p>
                                 </div>
                              </div>

                              <div className="space-y-6 mb-12">
                                 <div className="inline-block px-5 py-2 bg-blue-500/10 text-blue-400 text-xs font-black uppercase rounded-lg border border-blue-500/20">
                                    HELIX_STATUS: {decodedData.helix_status}
                                 </div>
                                 <p className="text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium border-l-4 border-white/5 pl-10">
                                    {decodedData.recommendation}
                                 </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                                 {decodedData.base_pairs.map((bp: any, i: number) => (
                                    <div key={i} className="p-8 bg-black/60 border border-white/5 rounded-[40px] text-center space-y-6 shadow-inner group/bp hover:border-blue-500/40 transition-all">
                                       <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                                          <Circle size={64} className="text-white/5" />
                                          <p className="absolute text-2xl font-black text-white">{bp.visual_cue}</p>
                                          <div className={`absolute inset-[-5px] rounded-full border-2 border-dashed border-blue-500/20 animate-spin-slow`}></div>
                                       </div>
                                       <div>
                                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{bp.type}</p>
                                          <p className="text-xl font-mono font-black text-white">{(bp.bond_strength * 100).toFixed(0)}%</p>
                                       </div>
                                       <p className="text-[9px] text-blue-400 italic font-bold">"{bp.diagnosis}"</p>
                                    </div>
                                 ))}
                              </div>

                              <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                 <div className="flex items-center gap-6">
                                    <Fingerprint size={40} className="text-indigo-400" />
                                    <div className="text-left">
                                       <p className="text-[9px] text-slate-600 font-black uppercase">RESONANCE_HASH</p>
                                       <p className="text-lg font-mono text-white">0x882...DNA_SYNC</p>
                                    </div>
                                 </div>
                                 <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">Audit Full Sequence</button>
                              </div>
                           </div>

                           <div className="flex justify-center gap-8 pt-6">
                              <button onClick={() => setDecodedData(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                              <button className="px-24 py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                 <Stamp size={24} /> ANCHOR TO REGISTRY
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: DNA SHARD FORGE --- */}
        {activeTab === 'forge' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 md:p-14 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-12 shadow-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><FlaskConical size={300} className="text-blue-400" /></div>
                      <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                         <div className="p-5 bg-blue-600 rounded-[28px] shadow-3xl group-hover:rotate-12 transition-transform">
                            <FlaskConical className="w-10 h-10 text-white" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Shard <span className="text-blue-400">Forge</span></h3>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">EOS_GENOME_SYNTH_v5</p>
                         </div>
                      </div>
                      
                      <div className="space-y-10 relative z-10">
                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Genome Identity</label>
                            <input 
                              type="text" value={genomeTitle} onChange={e => setGenomeTitle(e.target.value)}
                              placeholder="e.g. Bantu Corn v2..."
                              className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-800 italic"
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Dominant Trait</label>
                            <div className="grid grid-cols-2 gap-3">
                               {['Pest Resistance', 'Nitrogen Density', 'Moisture Latency', 'Thermal Sync'].map(trait => (
                                  <button 
                                    key={trait} 
                                    onClick={() => setGenomeTrait(trait)}
                                    className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all flex items-center justify-center text-center ${genomeTrait === trait ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                  >
                                     {trait}
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Stability Delta</label>
                               <span className="text-2xl font-mono font-black text-blue-400">{stabilityIndex}%</span>
                            </div>
                            <input 
                               type="range" min="40" max="100" value={stabilityIndex} 
                               onChange={e => setStabilityIndex(parseInt(e.target.value))}
                               className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500 shadow-inner" 
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Node Signature</label>
                            <input 
                              type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                              placeholder="EA-XXXX-XXXX"
                              className="w-full bg-black border border-white/10 rounded-[32px] py-6 px-10 text-sm font-mono text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase text-center tracking-[0.2em]"
                            />
                         </div>

                         <button 
                          onClick={handleForgeGenome}
                          disabled={isForging || !genomeTitle.trim() || !esinSign}
                          className="w-full py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-3xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-6 ring-8 ring-white/5"
                         >
                            {isForging ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8 fill-current" />}
                            {isForging ? 'FORGING GENOME...' : 'INITIALIZE FORGE'}
                         </button>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-8">
                   <div className="glass-card rounded-[80px] min-h-[850px] border-2 border-white/10 bg-[#050706] flex flex-col relative overflow-hidden shadow-3xl text-white">
                      <div className="p-10 md:p-14 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0 relative z-20">
                         <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl group overflow-hidden relative">
                               <LabIcon size={32} className="group-hover:scale-110 transition-transform relative z-10" />
                               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                            </div>
                            <div>
                               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Invention <span className="text-indigo-400">Oracle</span></h3>
                               <p className="text-indigo-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">ZK_FORGE_LINK // EOS_SYNC_OK</p>
                            </div>
                         </div>
                         <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                            <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest">FORGE_SYNC_ACTIVE</span>
                         </div>
                      </div>

                      <div className="flex-1 p-12 md:p-20 overflow-y-auto custom-scrollbar relative z-20">
                         {forgeStep === 'config' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                               <div className="relative">
                                  <Sparkles size={180} className="text-slate-500 group-hover:text-blue-500 transition-colors duration-1000" />
                                  <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-125 animate-spin-slow"></div>
                               </div>
                               <div className="space-y-4">
                                  <p className="text-5xl font-black uppercase tracking-[0.6em] text-white italic">FORGE_STANDBY</p>
                                  <p className="text-xl font-bold italic text-slate-600 uppercase tracking-widest">Configure genetic parameters to begin synthesis</p>
                               </div>
                            </div>
                         )}

                         {forgeStep === 'sequencing' && (
                            <div className="h-full flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500">
                               {isForging ? (
                                  <>
                                     <div className="relative">
                                        <div className="w-64 h-64 rounded-full border-8 border-blue-500/10 flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,0.2)]">
                                           <FlaskConical size={100} className="text-blue-500 animate-spin-slow" />
                                        </div>
                                        <div className="absolute inset-[-10px] border-t-8 border-blue-500 rounded-full animate-spin"></div>
                                     </div>
                                     <div className="space-y-6">
                                        <p className="text-blue-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">SYNTHESIZING GENOME SHARD...</p>
                                        <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">EOS_CORE_AUDIT // CHECKING_ALLELE_STABILITY</p>
                                     </div>
                                  </>
                               ) : (
                                  <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-10 w-full">
                                     <div className="p-12 md:p-20 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-[12px] border-l-indigo-600/50 relative overflow-hidden group/shard text-left">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group/shard:scale-110 transition-transform duration-[12s]"><Atom size={800} className="text-blue-400" /></div>
                                        
                                        <div className="flex justify-between items-center mb-12 relative z-10 border-b border-white/5 pb-10">
                                           <div className="flex items-center gap-6">
                                              <Stamp size={40} className="text-blue-400" />
                                              <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Invention Shard Report</h4>
                                           </div>
                                           <div className="text-right">
                                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Shard stability</p>
                                              <p className="text-3xl font-mono font-black text-emerald-400">{stabilityIndex}%</p>
                                           </div>
                                        </div>

                                        <div className="text-slate-200 text-2xl leading-[2.2] italic whitespace-pre-line font-medium relative z-10 pl-4">
                                           {forgeResult}
                                        </div>

                                        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                                           <div className="flex items-center gap-4 px-6 py-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-xl">
                                              <ShieldCheck className="w-6 h-6 text-blue-400" />
                                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">GENOMIC_CERTIFIED</span>
                                           </div>
                                           <div className="text-right">
                                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">M-CONSTANT BOOST</p>
                                              <p className="text-3xl font-mono font-black text-white">+0.24x</p>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="flex justify-center gap-10">
                                        <button onClick={() => setForgeStep('config')} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Shard</button>
                                        <button onClick={finalizeForge} className="px-24 py-8 agro-gradient rounded-full text-white font-black text-[13px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-2 border-white/10 ring-8 ring-white/5">
                                           <Stamp size={28} /> ANCHOR TO LEDGER
                                        </button>
                                     </div>
                                  </div>
                               )}
                            </div>
                         )}

                         {forgeStep === 'success' && (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-16 py-20 animate-in zoom-in duration-700 text-center">
                               <div className="w-56 h-56 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(59,130,246,0.4)] scale-110 relative group">
                                  <CheckCircle2 className="w-28 h-28 text-white group-hover:scale-110 transition-transform" />
                                  <div className="absolute inset-[-15px] rounded-full border-4 border-blue-500/20 animate-ping opacity-30"></div>
                               </div>
                               <div className="space-y-4 text-center">
                                  <h3 className="text-8xl font-black text-white uppercase tracking-tighter italic m-0">Shard <span className="text-blue-400">Anchored.</span></h3>
                                  <p className="text-blue-400 text-sm font-black uppercase tracking-[0.8em] font-mono">REGISTRY_HASH: 0x882_DNA_OK_SYNC</p>
                               </div>
                               <button onClick={() => { setForgeStep('config'); setGenomeTitle(''); }} className="w-full max-w-md py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Forge</button>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: GENOMIC ARCHIVE --- */}
        {activeTab === 'archive' && (
           <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 px-4">
                 <div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Genomic <span className="text-blue-400">Ledger</span></h3>
                    <p className="text-slate-500 text-xl font-medium mt-4 italic">"Browse verified biological shards sharded across the global mesh."</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Filter by genome ID or trait..." 
                      className="w-full bg-black/60 border border-white/10 rounded-[40px] py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-mono italic shadow-inner" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArchive.map(gen => (
                   <div key={gen.id} className="glass-card p-12 rounded-[64px] border-2 border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><Binary size={250} /></div>
                      
                      <div className="flex justify-between items-start mb-12 relative z-10">
                         <div className="p-6 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-xl group-hover:rotate-6 transition-all">
                            <Dna size={40} />
                         </div>
                         <div className="text-right flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full border border-blue-500/20 tracking-widest">{gen.status}</span>
                            <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest mt-2">{gen.id}</p>
                         </div>
                      </div>

                      <div className="flex-1 space-y-6 relative z-10">
                         <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-blue-400 transition-colors">{gen.name}</h4>
                         <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic leading-none">{gen.trait}</p>
                         <div className="pt-8 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">
                               <span>Genome Stability</span>
                               <span className="text-emerald-400 font-mono">{gen.stability}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                               <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: `${gen.stability}%` }}></div>
                            </div>
                         </div>
                      </div>

                      <div className="mt-14 pt-10 border-t border-white/5 flex items-center justify-between relative z-10">
                         <div className="space-y-1">
                            <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest">Shard Acquisition</p>
                            <p className="text-3xl font-mono font-black text-white tracking-tighter">
                               {gen.cost} <span className="text-sm text-blue-400 italic font-sans ml-1">EAC</span>
                            </p>
                         </div>
                         <button className="p-6 bg-blue-600 rounded-[28px] text-white shadow-xl hover:bg-blue-500 transition-all flex items-center justify-center active:scale-90 border border-white/10">
                            <Download size={24} />
                         </button>
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}
      </div>

      {/* Global Persistence Shard Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-blue-500/20 bg-blue-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mt-32 mx-4 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-blue-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Fingerprint className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Biological <span className="text-blue-400">Sovereignty</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 Securing the agricultural genome through decentralized consensus. Every genetic shard represents a verified step towards high-m-constant resilience.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20 hidden lg:block">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">GENOMIC_QUORUM</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-blue-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan {
          0% { top: -100%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Biotechnology;
