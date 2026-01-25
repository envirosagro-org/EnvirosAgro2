
import React, { useState, useMemo } from 'react';
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
  Target
} from 'lucide-react';
import { User } from '../types';
import { decodeAgroGenetics, chatWithAgroExpert } from '../services/geminiService';

interface BiotechnologyProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const GENETIC_ARCHIVE = [
  { id: 'GEN-882', name: 'Maize Resilience Shard v4', trait: 'Drought Resistance', stability: 98.4, status: 'VERIFIED', cost: 1500, col: 'text-blue-400' },
  { id: 'GEN-104', name: 'Fortified Wheat Genome', trait: 'High Protein Density', stability: 92.1, status: 'AUDITING', cost: 2500, col: 'text-amber-400' },
  { id: 'GEN-042', name: 'Bantu Rice DNA', trait: 'Pest Shield Alpha', stability: 99.8, status: 'VERIFIED', cost: 3200, col: 'text-emerald-400' },
];

const Biotechnology: React.FC<BiotechnologyProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'decoder' | 'forge' | 'archive'>('decoder');
  
  // Decoder States
  const [bioSignal, setBioSignal] = useState(0.85);
  const [techStatus, setTechStatus] = useState(0.72);
  const [marketDemand, setMarketDemand] = useState(0.65);
  const [govIntegrity, setGovIntegrity] = useState(0.91);
  const [sehtiThrusts] = useState([0.82, 0.76, 0.88, 0.94, 0.70]);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedData, setDecodedData] = useState<any | null>(null);

  // Forge States
  const [isForging, setIsForging] = useState(false);
  const [genomeTitle, setGenomeTitle] = useState('');
  const [genomeTrait, setGenomeTrait] = useState('Pest Resistance');
  const [forgeResult, setForgeResult] = useState<string | null>(null);
  const [stabilityIndex, setStabilityIndex] = useState(85);

  // Archive States
  const [archive, setArchive] = useState(GENETIC_ARCHIVE);
  const [searchTerm, setSearchTerm] = useState('');

  const avgSehti = useMemo(() => sehtiThrusts.reduce((a, b) => a + b, 0) / sehtiThrusts.length, [sehtiThrusts]);

  const handleRunDecoder = async () => {
    const DECODE_FEE = 30;
    if (!onSpendEAC(DECODE_FEE, 'AGRO_GENETIC_DECODING_PROTOCOL')) return;

    setIsDecoding(true);
    setDecodedData(null);
    try {
      const telemetry = {
        bio_signal: bioSignal,
        tech_status: techStatus,
        market_demand: marketDemand,
        gov_integrity: govIntegrity,
        sehti_thrusts: sehtiThrusts
      };
      const result = await decodeAgroGenetics(telemetry);
      setDecodedData(result);
    } catch (err) {
      alert("Oracle Consensus Error: Handshake interrupted.");
    } finally {
      setIsDecoding(false);
    }
  };

  const handleForgeGenome = async () => {
    if (!genomeTitle.trim()) return;
    const FORGE_COST = 100;
    
    if (onSpendEAC(FORGE_COST, `GENOME_FORGE_${genomeTitle.toUpperCase()}`)) {
      setIsForging(true);
      setForgeResult(null);
      try {
        const prompt = `Act as an EOS Geneticist. Forge a genomic shard for:
        Identity: ${genomeTitle}
        Primary Trait: ${genomeTrait}
        Stability Target: ${stabilityIndex}%
        
        Provide a technical DNA sharding report including phenotypic expression targets and SEHTI alignment.`;
        const res = await chatWithAgroExpert(prompt, []);
        setForgeResult(res.text);
        onEarnEAC(20, 'NEW_GENOME_SHARD_FORGED');
      } catch (e) {
        setForgeResult("Oracle consensus interrupted. Shard initialization failed.");
      } finally {
        setIsForging(false);
      }
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for genetic sharding.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header Hub HUD */}
      <div className="glass-card p-12 rounded-[56px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Dna className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-blue-600 flex items-center justify-center shadow-[0_0_80px_rgba(37,99,235,0.3)] ring-4 ring-white/10 shrink-0">
            <Dna className="w-20 h-20 text-white animate-spin-slow" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-blue-500/20 shadow-inner">EOS_GENETIC_HUB_v5</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Genetic <span className="text-blue-400">Decoder Hub</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Merging biological sequencing with industrial telemetry. Visualize ecosystem DNA, forge resilient traits, and anchor genetic shards to the global registry."
            </p>
         </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'decoder', label: 'Ecosystem DNA', icon: Scan },
          { id: 'forge', label: 'DNA Shard Forge', icon: FlaskConical },
          { id: 'archive', label: 'Genomic Archive', icon: Database },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[750px]">
        {/* TAB 1: ECOSYSTEM DNA (Genetic Decoder) */}
        {activeTab === 'decoder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                         <Binary className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Ecosystem <span className="text-emerald-400">Payload</span></h3>
                   </div>

                   <div className="space-y-8">
                      {[
                        { l: 'A: Agro-Bio (Plant/Soil)', v: bioSignal, set: setBioSignal, col: 'accent-emerald-500', icon: Sprout },
                        { l: 'T: Technology (Robotics)', v: techStatus, set: setTechStatus, col: 'accent-blue-500', icon: Bot },
                        { l: 'C: Consumption (Market)', v: marketDemand, set: setMarketDemand, col: 'accent-orange-500', icon: Cookie },
                        { l: 'G: Governance (DeFi)', v: govIntegrity, set: setGovIntegrity, col: 'accent-indigo-500', icon: Landmark },
                      ].map((base, idx) => (
                        <div key={idx} className="space-y-4">
                           <div className="flex justify-between items-center px-4">
                              <div className="flex items-center gap-2">
                                 <base.icon className="w-3.5 h-3.5 text-slate-500" />
                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{base.l}</label>
                              </div>
                              <span className="text-xl font-mono font-black text-white">{base.v.toFixed(2)}</span>
                           </div>
                           <input 
                             type="range" min="0" max="1" step="0.01" value={base.v} 
                             onChange={e => base.set(parseFloat(e.target.value))}
                             className={`w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer ${base.col} shadow-inner`} 
                           />
                        </div>
                      ))}
                   </div>

                   <button 
                    onClick={handleRunDecoder}
                    disabled={isDecoding}
                    className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                      {isDecoding ? <Loader2 className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
                      {isDecoding ? 'DECODING DNA...' : 'DECODE ECOSYSTEM DNA'}
                   </button>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl animate-pulse">
                            <Monitor className="w-8 h-8 text-emerald-400" />
                         </div>
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">3D <span className="text-emerald-400">Helix Visualizer</span></h3>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-slate-500 font-black uppercase">Backbone Integrity</p>
                         <p className={`text-2xl font-mono font-black ${avgSehti > 0.8 ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                            {(avgSehti * 100).toFixed(1)}%
                         </p>
                      </div>
                   </div>

                   <div className="flex-1 relative flex flex-col lg:flex-row min-h-0 overflow-hidden">
                      <div className="flex-1 relative flex items-center justify-center p-12">
                         <div className="relative w-full h-full flex flex-col items-center justify-between py-10">
                            {[...Array(12)].map((_, i) => {
                              const angle = i * 30;
                              const opacity = 0.2 + (Math.sin(i * 0.5) + 1) * 0.4;
                              const isAT = i % 2 === 0;
                              const strength = isAT ? (1 - Math.abs(bioSignal - techStatus)) : (1 - Math.abs(marketDemand - govIntegrity));
                              const color = isAT ? '#10b981' : '#f59e0b';
                              const scale = 0.8 + strength * 0.4;
                              return (
                                <div key={i} className="w-full max-w-sm flex items-center justify-between relative" style={{ opacity, transform: `rotateY(${angle}deg) scale(${scale})`, transition: 'all 1s ease' }}>
                                   <div className={`w-6 h-6 rounded-lg shadow-2xl border-2 border-white/10`} style={{ backgroundColor: color }}></div>
                                   <div className="flex-1 h-1 relative mx-4">
                                      <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                                      <div className={`h-full rounded-full transition-all duration-[2s] ${strength < 0.4 ? 'animate-pulse bg-rose-500' : ''}`} style={{ width: `${strength * 100}%`, backgroundColor: color, boxShadow: `0 0 20px ${color}` }}></div>
                                   </div>
                                   <div className={`w-6 h-6 rounded-lg shadow-2xl border-2 border-white/10`} style={{ backgroundColor: isAT ? '#3b82f6' : '#818cf8' }}></div>
                                </div>
                              );
                            })}
                         </div>
                         <div className={`absolute left-[15%] top-10 bottom-10 w-2 rounded-full transition-all duration-1000 ${avgSehti > 0.8 ? 'bg-emerald-500/40 shadow-[0_0_50px_#10b981]' : 'bg-rose-500/20 animate-wiggle'}`}></div>
                         <div className={`absolute right-[15%] top-10 bottom-10 w-2 rounded-full transition-all duration-1000 ${avgSehti > 0.8 ? 'bg-emerald-500/40 shadow-[0_0_50px_#10b981]' : 'bg-rose-500/20 animate-wiggle'}`}></div>
                      </div>

                      <div className="w-full lg:w-[450px] bg-black/40 border-l border-white/5 flex flex-col p-10 overflow-y-auto custom-scrollbar">
                         {isDecoding ? (
                           <div className="h-full flex flex-col items-center justify-center space-y-12">
                              <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                              <p className="text-emerald-400 font-black text-center uppercase tracking-[0.5em] animate-pulse italic">Sequencing Registry...</p>
                           </div>
                         ) : decodedData ? (
                           <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-10">
                              <div className="p-8 bg-black/80 rounded-[40px] border border-emerald-500/20 border-l-8 shadow-inner space-y-6">
                                 <p className={`text-2xl font-black uppercase italic ${decodedData.helix_status.includes('Optimal') ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {decodedData.helix_status}
                                 </p>
                                 <div className="space-y-6">
                                    {decodedData.base_pairs.map((bp: any, i: number) => (
                                       <div key={i} className="space-y-2">
                                          <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                             <span className="text-slate-500">{bp.type} Bond</span>
                                             <span className="text-white font-mono">{(bp.bond_strength * 100).toFixed(0)}%</span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 italic leading-relaxed">"{bp.diagnosis}"</p>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                              <div className="p-8 glass-card rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-4">
                                 <Sparkles className="w-5 h-5 text-indigo-400" />
                                 <p className="text-sm text-slate-300 italic leading-relaxed font-medium">"{decodedData.recommendation}"</p>
                              </div>
                              <button className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-slate-500 hover:text-white transition-all flex items-center justify-center gap-3">
                                 <Download size={16} /> Export Stability Cert
                              </button>
                           </div>
                         ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-30">
                              <Dna size={80} className="text-slate-500" />
                              <p className="text-xl font-black uppercase tracking-[0.5em] text-white">Awaiting Payload</p>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 2: GENOMIC FORGE */}
        {activeTab === 'forge' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500 px-4">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-10 shadow-2xl">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-blue-600 rounded-3xl shadow-xl"><FlaskConical className="w-8 h-8 text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Forge <span className="text-blue-400">Input</span></h3>
                    </div>
                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Genome Designation</label>
                          <input type="text" value={genomeTitle} onChange={e => setGenomeTitle(e.target.value)} placeholder="e.g. Neo-Rice v4 PestShield" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-blue-500/10" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-4">Primary Trait</label>
                          <select value={genomeTrait} onChange={e => setGenomeTrait(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none">
                             <option>Pest Resistance</option>
                             <option>Drought Resilience</option>
                             <option>Enhanced Nutrient Density</option>
                             <option>Rapid Maturation</option>
                          </select>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-4">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Stability Target</label>
                             <span className="text-lg font-mono font-black text-blue-400">{stabilityIndex}%</span>
                          </div>
                          <input type="range" min="50" max="100" value={stabilityIndex} onChange={e => setStabilityIndex(Number(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600" />
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 space-y-6">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[9px] font-black text-slate-600 uppercase">Sharding Fee</span>
                          <span className="text-lg font-mono font-black text-emerald-400">100 EAC</span>
                       </div>
                       <button onClick={handleForgeGenome} disabled={isForging || !genomeTitle.trim()} className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                          {isForging ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                          {isForging ? 'SYNTHESIZING DNA...' : 'INITIALIZE FORGE'}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[700px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <Terminal className="w-6 h-6 text-blue-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Genome Shard Terminal</span>
                       </div>
                       {forgeResult && <button onClick={() => setForgeResult(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>}
                    </div>
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                       {isForging ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 bg-black/80 backdrop-blur-md z-20">
                             <div className="relative">
                                <Loader2 className="w-24 h-24 text-blue-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center"><Dna className="w-10 h-10 text-blue-400 animate-pulse" /></div>
                             </div>
                             <p className="text-blue-400 font-bold mt-10 animate-pulse uppercase tracking-[0.6em] text-xl italic text-center">SEQUENCING GENETIC SHARD...</p>
                          </div>
                       ) : forgeResult ? (
                          <div className="animate-in slide-in-from-bottom-6 duration-700">
                             <div className="p-12 md:p-20 bg-black/80 rounded-[64px] border-l-8 border-blue-500/40 relative overflow-hidden shadow-inner prose prose-invert prose-blue max-w-none">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Atom className="w-96 h-96 text-white" /></div>
                                <div className="text-slate-300 text-xl md:text-2xl leading-[2.2] italic whitespace-pre-line font-medium border-l border-white/5 pl-12 relative z-10">
                                   {forgeResult}
                                </div>
                             </div>
                             <div className="flex flex-col items-center mt-12">
                                <button className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all">ANCHOR GENOME TO REGISTRY</button>
                             </div>
                          </div>
                       ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20">
                             <Microscope size={120} className="text-slate-500" />
                             <p className="text-3xl font-black uppercase tracking-[0.5em] text-white">FORGE STANDBY</p>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
         )}

         {/* TAB 3: ARCHIVE */}
         {activeTab === 'archive' && (
           <div className="space-y-10 animate-in slide-in-from-left-4 duration-500 px-4">
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-8">
                 <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Authorized <span className="text-blue-400">Genomes</span></h3>
                    <p className="text-slate-500 text-sm mt-1 italic">Verified genetic shards registered for regional node licensing.</p>
                 </div>
                 <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filter DNA shards..." className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {archive.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(gen => (
                    <div key={gen.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 shadow-xl bg-black/20 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Atom size={120} /></div>
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="p-4 bg-white/5 rounded-2xl text-blue-400 border border-white/5 group-hover:rotate-12 transition-all">
                             <Dna size={28} />
                          </div>
                          <span className={`px-3 py-1 border border-white/10 text-[8px] font-black uppercase tracking-widest rounded-lg ${gen.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{gen.status}</span>
                       </div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-2xl font-black text-white uppercase italic leading-none group-hover:text-blue-400 transition-colors m-0 tracking-tighter">{gen.name}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{gen.trait}</p>
                          <div className="pt-6 space-y-3">
                             <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-600">
                                <span>Stability Index</span>
                                <span className="text-blue-400">{gen.stability}%</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]" style={{ width: `${gen.stability}%` }}></div>
                             </div>
                          </div>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                          <p className="text-2xl font-mono font-black text-white">{gen.cost} <span className="text-xs text-blue-500 italic">EAC</span></p>
                          <button className="p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white shadow-xl active:scale-90 transition-all">
                             <Fingerprint size={20} />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes wiggle { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
        .animate-wiggle { animation: wiggle 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Biotechnology;
