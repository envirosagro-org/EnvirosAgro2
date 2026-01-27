import React, { useState, useRef, useMemo } from 'react';
import { 
  Palette, 
  Binary, 
  Box, 
  Microscope, 
  Info, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Scale, 
  Thermometer, 
  Users, 
  Leaf, 
  Heart, 
  Loader2, 
  Upload, 
  CheckCircle2, 
  Scan, 
  ArrowRight,
  Droplets,
  Radiation,
  Waves,
  Layout,
  Fingerprint,
  Monitor,
  Sun,
  RefreshCw,
  ShieldPlus,
  Terminal,
  Stamp,
  PencilRuler,
  Building,
  Trees,
  Mountain,
  ChevronRight,
  X,
  Download,
  FileText,
  // Added missing Coins import to resolve error on line 306
  Coins
} from 'lucide-react';
import { User } from '../types';
import { chatWithAgroExpert } from '../services/geminiService';

interface ChromaSystemProps {
  user: User;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
}

const SEHTI_CHROMA_MAPPING = [
  { thrust: 'Societal', variable: 'W_s', spectrum: 'Warm (Red/Orange/Yellow)', context: 'Markets, Education', diagnosis: 'Warning: Nutrient Stress', color: '#F2CC8F', icon: Users },
  { thrust: 'Environmental', variable: 'B_s', spectrum: 'Bio (Green/Brown/Teal)', context: 'Production, Waste', diagnosis: 'Health: Chlorophyll Density', color: '#4A7C59', icon: Leaf },
  { thrust: 'Human', variable: 'C_s', spectrum: 'Calm (Blue/Indigo/Violet)', context: 'Labs, Rest Areas', diagnosis: 'Deficiency: Phosphorus/Fungal', color: '#818cf8', icon: Heart },
  { thrust: 'Technological', variable: 'U_s', spectrum: 'UV/IR (Greyscale Mapping)', context: 'Server Rooms, Robotics', diagnosis: 'Early Detection: Pre-symptomatic', color: '#2F3E46', icon: Bot },
  { thrust: 'Informational', variable: 'I_s', spectrum: 'Contrast (White/Black/Neon)', context: 'Signage, Alerts', diagnosis: 'Necrosis: Tissue Death', color: '#F2F7F2', icon: Binary },
];

const ARCHITECTURAL_PALETTES = [
  { zone: 'Growth Zone', name: 'Photosynthetic Green', hex: '#4A7C59', function: 'Blends with crops, maximizes psychological connection to nature.' },
  { zone: 'Control Zone', name: 'Slate Tech Grey', hex: '#2F3E46', accent: '#E07A5F', function: 'High contrast for robot navigation, reduces screen glare.' },
  { zone: 'Market Zone', name: 'Harvest Gold', hex: '#F2CC8F', function: 'Stimulates appetite, signifies warmth and community welcome.' },
];

const ChromaSystem: React.FC<ChromaSystemProps> = ({ user, onSpendEAC, onEarnEAC }) => {
  const [activeTab, setActiveTab] = useState<'mapping' | 'macro' | 'micro' | 'design'>('mapping');
  
  // Macro States
  const [albedo, setAlbedo] = useState(0.92);
  const [psychScore, setPsychScore] = useState(8);
  const [thermalCoeff, setThermalCoeff] = useState(0.45);
  const [footprint, setFootprint] = useState(0.12);
  const [isCalculatingSc, setIsCalculatingSc] = useState(false);
  const [scResult, setScResult] = useState<string | null>(null);

  // Micro States
  const [isScanning, setIsScanning] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [chromaDiagnosis, setChromaDiagnosis] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Design Ingest States
  const [designDescription, setDesignDescription] = useState('');
  const [designCategory, setDesignCategory] = useState('Landscaping');
  const [isForgingDesign, setIsForgingDesign] = useState(false);
  const [designShard, setDesignShard] = useState<string | null>(null);

  const calculateSc = () => {
    setIsCalculatingSc(true);
    setTimeout(() => {
      const scValue = (albedo * psychScore) / (thermalCoeff + footprint);
      let colorName = "EnvirosAgro White (#F2F7F2)";
      if (scValue < 5) colorName = "Photosynthetic Green (#4A7C59)";
      else if (scValue < 8) colorName = "Harvest Gold (#F2CC8F)";
      
      setScResult(colorName);
      setIsCalculatingSc(false);
      onEarnEAC(10, 'ARCHITECTURAL_CHROMA_CALIBRATION');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
        runDigitalChromatography();
      };
      reader.readAsDataURL(file);
    }
  };

  const runDigitalChromatography = async () => {
    setIsScanning(true);
    setChromaDiagnosis(null);
    try {
      const mockG = 0.8;
      const mockR = 0.2;
      const mockY = 0.1;
      const hi = mockG / (mockR + mockY);
      
      const prompt = `Perform a Digital Chromatography Audit on a crop shard with Health Index ${hi.toFixed(2)}. 
      G_val: ${mockG}, R_val: ${mockR}, Y_val: ${mockY}. 
      Explain the pathobiological implications and recommend a SEHTI remediation shard.`;
      
      const response = await chatWithAgroExpert(prompt, []);
      setChromaDiagnosis({ hi, report: response.text });
      onEarnEAC(20, 'CHROMATOGRAPHY_INGEST_SYNC');
    } catch (e) {
      setChromaDiagnosis({ hi: 0.5, report: "Oracle sync timeout. Manual audit required." });
    } finally {
      setIsScanning(false);
    }
  };

  const handleForgeDesign = async () => {
    if (!designDescription.trim()) return;
    const DESIGN_FEE = 40;
    
    if (!onSpendEAC(DESIGN_FEE, `DESIGN_INGEST_SHARD_${designCategory.toUpperCase()}`)) return;

    setIsForgingDesign(true);
    setDesignShard(null);

    try {
      const prompt = `Act as an EnvirosAgro Architectural Consultant. Ingest and synthesize this ${designCategory} design:
      "${designDescription}"
      
      Tasks:
      1. Map the design to the Chroma-SEHTI spectrum (Societal, Environmental, Human, Technological, Informational).
      2. Calculate the predicted Albedo (Solar Reflectance) and Psychological Resonance.
      3. Recommend specific hex codes and materials based on the EACSS protocol.
      4. Predict m-constant stability impact.
      
      Return a technical, inspiring industrial shard report.`;
      
      const response = await chatWithAgroExpert(prompt, []);
      setDesignShard(response.text);
      onEarnEAC(15, 'DESIGN_INGEST_SYNERGY_BONUS');
    } catch (e) {
      setDesignShard("Registry link timeout. Oracle could not finalize the design shard.");
    } finally {
      setIsForgingDesign(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      {/* Header HUD */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s] pointer-events-none">
            <Palette className="w-96 h-96 text-white" />
         </div>
         <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
            <Palette className="w-20 h-20 text-white animate-pulse" />
         </div>
         <div className="space-y-6 relative z-10 text-center md:text-left">
            <div className="space-y-2">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20 shadow-inner">CHROMA_SEHTI_SYSTEM_v1</span>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4 m-0 leading-none">Chroma <span className="text-emerald-400">SEHTI</span></h2>
            </div>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed italic">
               "Transforming color from an aesthetic choice into a functional agricultural instrument. The EACSS protocol maps architecture and plant pathology to the SEHTI framework."
            </p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'mapping', label: 'Spectral Mapping', icon: Binary },
          { id: 'design', label: 'Design Sharding', icon: PencilRuler },
          { id: 'macro', label: 'Macro: Architectural Sc', icon: Box },
          { id: 'micro', label: 'Micro: Chromatography', icon: Microscope },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {/* TAB 1: SEHTI CHROMA MAPPING */}
        {activeTab === 'mapping' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {SEHTI_CHROMA_MAPPING.map((m, i) => (
                   <div key={i} className="glass-card p-10 rounded-[48px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-[450px] relative overflow-hidden">
                      <div className="absolute -bottom-10 -right-10 p-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-[5s]">
                         <m.icon size={250} />
                      </div>
                      <div className="space-y-6 relative z-10">
                         <div className="flex justify-between items-start">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                               <m.icon className="w-8 h-8 text-emerald-400" />
                            </div>
                            <span className="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">{m.variable}</span>
                         </div>
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">{m.thrust}</h4>
                         <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                            <div className="h-full" style={{ backgroundColor: m.color, width: '100%' }}></div>
                         </div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.spectrum}</p>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
                         <div className="space-y-1">
                            <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Ag-Context</p>
                            <p className="text-xs text-slate-400 italic">"{m.context}"</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Diagnostic Shard</p>
                            <p className="text-xs text-emerald-500/80 font-bold uppercase italic">{m.diagnosis}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-950/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[10s]"><Binary size={400} /></div>
                <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
                   <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-pulse border-2 border-white/10 shrink-0">
                      <Binary size={40} className="text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Chroma Registry Consensus</h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-lg:text-sm max-w-lg mx-auto md:mx-0">
                        The EACSS protocol ensures every visual signal is a verified data point in the global agricultural ledger.
                      </p>
                   </div>
                </div>
                <div className="text-center md:text-right relative z-10 shrink-0">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em] px-4 border-b border-white/10 pb-4">SPECTRAL_STABILITY</p>
                   <p className="text-8xl font-mono font-black text-white tracking-tighter">100<span className="text-4xl text-indigo-400 ml-1">%</span></p>
                </div>
             </div>
          </div>
        )}

        {/* TAB 4: DESIGN SHARDING (New) */}
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><PencilRuler size={300} className="text-emerald-400" /></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl"><PencilRuler className="w-8 h-8 text-white" /></div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none m-0">Design <span className="text-emerald-400">Ingest</span></h3>
                   </div>
                   
                   <div className="space-y-8 relative z-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Design Category</label>
                         <div className="grid grid-cols-2 gap-3">
                            {['Landscaping', 'Structures', 'Waterways', 'Furniture'].map(cat => (
                               <button 
                                 key={cat} 
                                 onClick={() => setDesignCategory(cat)}
                                 className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${designCategory === cat ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
                               >
                                  {cat === 'Landscaping' ? <Trees size={14} /> : cat === 'Structures' ? <Building size={14} /> : cat === 'Waterways' ? <Droplets size={14} /> : <Box size={14} />}
                                  {cat}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Visual Description</label>
                         <textarea 
                           value={designDescription}
                           onChange={e => setDesignDescription(e.target.value)}
                           placeholder="Describe your design intent: Materials, specific color codes, spatial layout, etc..."
                           className="w-full bg-black/60 border border-white/10 rounded-3xl p-8 text-white text-sm font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none h-40 resize-none placeholder:text-slate-800 shadow-inner"
                         />
                      </div>

                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center shadow-inner">
                         <div className="flex items-center gap-3">
                            <Coins size={16} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase">Ingest Fee</span>
                         </div>
                         <span className="text-xl font-mono font-black text-emerald-400">40 EAC</span>
                      </div>

                      <button 
                        onClick={handleForgeDesign}
                        disabled={isForgingDesign || !designDescription.trim()}
                        className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30"
                      >
                         {isForgingDesign ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-current" />}
                         {isForgingDesign ? "SYNTHESIZING SHARD..." : "FORGE DESIGN SHARD"}
                      </button>
                   </div>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-blue-500/10 bg-blue-500/5 space-y-6 group">
                    <div className="flex items-center gap-3">
                       <Info className="w-5 h-5 text-blue-400" />
                       <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Design Integrity</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100">
                       "Architectural shards are evaluated for solar albedo (Av), social stress (S) reduction, and biological alignment (Ca)."
                    </p>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4 text-emerald-400">
                         <Terminal className="w-6 h-6" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Design Synthesis Terminal</span>
                      </div>
                      {designShard && (
                        <div className="flex gap-4">
                           <button onClick={() => setDesignShard(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><X size={18} /></button>
                        </div>
                      )}
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                      {!designShard && !isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                           <div className="relative">
                              <Building size={140} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
                              <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">ORACLE STANDBY</p>
                              <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Enter Design Context to Sync Shard</p>
                           </div>
                        </div>
                      ) : isForgingDesign ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <PencilRuler className="w-10 h-10 text-emerald-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING ARCHITECTURAL CHROMA...</p>
                              <div className="flex justify-center gap-1.5 pt-6">
                                 {[...Array(8)].map((_, i) => <div key={i} className="w-1.5 h-12 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-12 pb-10">
                           <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-emerald-500/20 prose prose-invert prose-emerald max-w-none shadow-3xl border-l-8 border-l-emerald-500 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform"><Sparkles size={300} /></div>
                              <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-6">
                                 <Bot className="w-10 h-10 text-emerald-400" />
                                 <div>
                                    <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Architectural Oracle</h4>
                                    <p className="text-emerald-400/60 text-[9px] font-black uppercase tracking-widest mt-1">EACSS_BLUEPRINT_SYNC</p>
                                 </div>
                              </div>
                              <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10">
                                 {designShard}
                              </div>
                              <div className="mt-12 flex justify-end relative z-10">
                                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center px-8 flex items-center gap-3">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VERIFIED_DESIGN_QUORUM</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-center gap-8">
                              <button onClick={() => setDesignShard(null)} className="px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard Shard</button>
                              <button className="px-20 py-6 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                 <Stamp className="w-6 h-6" /> ANCHOR DESIGN SHARD
                              </button>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center opacity-30 mt-auto">
                      <div className="flex items-center gap-4">
                         <Fingerprint size={28} className="text-slate-400" />
                         <div className="space-y-1">
                            <p className="text-[9px] font-mono uppercase font-black text-slate-500 tracking-widest leading-none">REGISTRY_LINK: ACTIVE_HANDSHAKE</p>
                            <p className="text-lg font-mono font-black text-slate-600 tracking-tighter leading-none">0x882_CHROMA_DESIGN_SYNC</p>
                         </div>
                      </div>
                      <Box size={40} className="text-emerald-400" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 2: MACRO-APPLICATION (Architecture Sc) */}
        {activeTab === 'macro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500 px-4">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-2xl">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Scale className="w-8 h-8 text-white" /></div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sc <span className="text-indigo-400">Calculator</span></h3>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Sun size={12} /> Albedo (Av)</label>
                            <span className="text-xl font-mono font-black text-white">{albedo.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={albedo} onChange={e => setAlbedo(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Heart size={12} /> Psych Score (Ps)</label>
                            <span className="text-xl font-mono font-black text-white">{psychScore}</span>
                         </div>
                         <input type="range" min="1" max="10" step="1" value={psychScore} onChange={e => setPsychScore(parseInt(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-rose-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Thermometer size={12} /> Thermal (Ta)</label>
                            <span className="text-xl font-mono font-black text-white">{thermalCoeff.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={thermalCoeff} onChange={e => setThermalCoeff(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500" />
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center px-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Leaf size={12} /> Footprint (Ef)</label>
                            <span className="text-xl font-mono font-black text-white">{footprint.toFixed(2)}</span>
                         </div>
                         <input type="range" min="0" max="1" step="0.01" value={footprint} onChange={e => setFootprint(parseFloat(e.target.value))} className="w-full h-3 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500" />
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5 space-y-6">
                      <div className="p-8 bg-black/60 rounded-[40px] border border-white/10 text-center space-y-4 shadow-inner">
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">The Sc Equation</p>
                         <p className="text-lg font-mono text-emerald-400 font-black leading-none">Sc = (Av * Ps) / (Ta + Ef)</p>
                      </div>
                      <button 
                        onClick={calculateSc}
                        disabled={isCalculatingSc}
                        className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                      >
                         {isCalculatingSc ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                         {isCalculatingSc ? 'SYNTHESIZING Sc...' : 'CALIBRATE SUSTAINABLE COLOR'}
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 min-h-[600px] flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Monitor className="w-6 h-6 text-indigo-400" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architectural Palette Forge</span>
                      </div>
                      <div className="flex gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[9px] font-mono text-emerald-500 uppercase font-black">EOS_CORE_LINKED</span>
                      </div>
                   </div>

                   <div className="flex-1 p-12 flex flex-col items-center justify-center">
                      {!scResult && !isCalculatingSc ? (
                         <div className="text-center space-y-8 opacity-20 group">
                            <Palette size={120} className="mx-auto text-slate-500 group-hover:text-indigo-400 transition-colors" />
                            <p className="text-3xl font-black uppercase tracking-[0.5em] text-white italic">Awaiting Variables</p>
                         </div>
                      ) : isCalculatingSc ? (
                         <div className="flex flex-col items-center gap-12 text-center">
                            <div className="relative">
                               <Loader2 className="w-32 h-32 text-indigo-500 animate-spin" />
                               <div className="absolute inset-0 flex items-center justify-center">
                                  <Activity className="w-12 h-12 text-emerald-400 animate-pulse" />
                               </div>
                            </div>
                            <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Modeling Solar Reflection...</p>
                         </div>
                      ) : (
                         <div className="w-full animate-in zoom-in duration-500 space-y-12">
                            <div className="text-center space-y-4">
                               <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.5em]">Optimal Sustainable Color Sc</p>
                               <h3 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-2xl">{scResult}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               {ARCHITECTURAL_PALETTES.map((p, i) => (
                                  <div key={i} className="p-8 glass-card rounded-[44px] border border-white/5 bg-black/40 space-y-6 group hover:border-white/20 transition-all shadow-xl">
                                     <div className="h-40 rounded-3xl relative overflow-hidden border border-white/5 shadow-inner" style={{ backgroundColor: p.hex }}>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10"></div>
                                        <div className="absolute bottom-4 right-6 text-white font-mono font-black text-xs opacity-40">{p.hex}</div>
                                     </div>
                                     <div className="space-y-2">
                                        <h5 className="text-xl font-black text-white uppercase italic tracking-tighter m-0">{p.zone}</h5>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{p.name}</p>
                                        <p className="text-xs text-slate-400 italic leading-relaxed opacity-80 mt-4">"{p.function}"</p>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 3: MICRO-APPLICATION (Chromatography) */}
        {activeTab === 'micro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-4 duration-500 px-4">
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-black/40 space-y-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-[10s]"><Microscope size={250} className="text-blue-500" /></div>
                   <div className="text-center space-y-6 relative z-10">
                      <div className="w-24 h-24 bg-blue-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl animate-float">
                         <Scan size={48} className="text-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Diagnostic <span className="text-blue-400">Lab</span></h3>
                        <p className="text-slate-400 text-lg italic leading-relaxed">Decompose crop shards into spectral data for pathology auditing.</p>
                      </div>
                   </div>

                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center text-center space-y-6 group/scan cursor-pointer bg-black/40 ${filePreview ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-blue-500/40'}`}
                   >
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                      {filePreview ? (
                        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/40 group-hover/scan:scale-105 transition-transform duration-500">
                           <img src={filePreview} className="w-full h-full object-cover grayscale-[0.2]" alt="Scan Preview" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/scan:opacity-100 transition-opacity">
                              <RefreshCw size={48} className="text-white animate-spin-slow" />
                           </div>
                        </div>
                      ) : (
                        <>
                           <Upload size={56} className="text-slate-800 group-hover/scan:text-blue-400 transition-all duration-500" />
                           <div className="space-y-1">
                              <p className="text-xl font-black text-white uppercase tracking-widest italic leading-none">Select Crop Shard</p>
                              <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest">Image Upload Required</p>
                           </div>
                        </>
                      )}
                   </div>

                   <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[44px] flex items-center gap-6 shadow-inner">
                      <ShieldPlus className="w-10 h-10 text-blue-500 shrink-0" />
                      <p className="text-[10px] text-blue-200/50 font-black uppercase tracking-tight leading-relaxed text-left italic">
                         DIAGNOSTIC_PROTOCOL: Digital spectral decomposition identifies pre-symptomatic stress shards before physical markers appear.
                      </p>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                   <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <Terminal className="w-6 h-6 text-blue-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phyto-Pathology Oracle Terminal</span>
                      </div>
                      <div className="flex gap-4">
                         <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">SYNCING_ORACLE</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                      {!chromaDiagnosis && !isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20 group">
                           <div className="relative">
                              <Microscope size={140} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                              <div className="absolute inset-0 border-4 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                           </div>
                           <div className="space-y-2">
                              <p className="text-4xl font-black uppercase tracking-[0.5em] text-white">LAB STANDBY</p>
                              <p className="text-lg italic uppercase font-bold tracking-widest text-slate-600">Awaiting Ingest for Spectral Decomposition</p>
                           </div>
                        </div>
                      ) : isScanning ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                           <div className="relative">
                              <Loader2 className="w-24 h-24 text-blue-500 animate-spin mx-auto" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Scan className="w-10 h-10 text-blue-400 animate-pulse" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-blue-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">DECOMPOSING SPECTRUM...</p>
                              <div className="flex justify-center gap-1.5 pt-4">
                                 {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-12 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="animate-in slide-in-from-bottom-6 duration-700 space-y-12 pb-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-10">
                                 <div className="p-10 glass-card rounded-[48px] bg-black/60 border border-white/10 flex flex-col items-center text-center space-y-6 shadow-inner group">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mb-2">Pigment Health Index (Hi)</p>
                                    <h5 className={`text-9xl font-mono font-black tracking-tighter leading-none ${chromaDiagnosis.hi > 0.8 ? 'text-emerald-400' : 'text-rose-500 animate-pulse'}`}>
                                       {chromaDiagnosis.hi.toFixed(2)}
                                    </h5>
                                    <p className={`text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-lg border ${chromaDiagnosis.hi > 0.8 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                       {chromaDiagnosis.hi > 0.8 ? 'OPTIMAL_RESONANCE' : 'CHLOROSIS_DETECTED'}
                                    </p>
                                 </div>
                                 <div className="grid grid-cols-3 gap-4">
                                    {['R-Channel', 'G-Channel', 'B-Channel'].map((chan, idx) => (
                                       <div key={chan} className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center space-y-2">
                                          <p className="text-8xl text-slate-600 font-black uppercase tracking-widest leading-none opacity-5 absolute inset-0 flex items-center justify-center select-none pointer-events-none">{idx === 0 ? 'R' : idx === 1 ? 'G' : 'B'}</p>
                                          <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest relative z-10">{chan}</p>
                                          <div className="h-12 w-full bg-black/40 rounded-lg flex items-end justify-center gap-1 p-1 shadow-inner relative z-10">
                                             {[...Array(4)].map((_, j) => <div key={j} className={`flex-1 rounded-sm ${idx === 0 ? 'bg-rose-500/40' : idx === 1 ? 'bg-emerald-500/40' : 'bg-blue-500/40'}`} style={{ height: `${Math.random() * 80 + 20}%` }}></div>)}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <div className="p-10 md:p-14 bg-black/80 rounded-[48px] border border-blue-500/20 prose prose-invert max-w-none shadow-3xl border-l-8 border-l-blue-500 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform"><Bot size={300} /></div>
                                 <div className="flex items-center gap-6 mb-10 relative z-10 border-b border-white/5 pb-6">
                                    <Bot className="w-10 h-10 text-blue-400" />
                                    <div>
                                       <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter">Oracle Verdict</h4>
                                       <p className="text-blue-400/60 text-[9px] font-black uppercase tracking-widest mt-1">SEHTI_DIAGNOSTIC_v5</p>
                                    </div>
                                 </div>
                                 <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium relative z-10">
                                    {chromaDiagnosis.report}
                                 </div>
                                 <div className="mt-12 flex justify-end relative z-10">
                                    <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center px-8 flex items-center gap-3">
                                       <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VERIFIED_HI_CONSENSUS</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="flex justify-center gap-8 pt-10">
                              <button onClick={() => { setChromaDiagnosis(null); setFilePreview(null); }} className="px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Discard Analysis</button>
                              <button className="px-20 py-6 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-5 ring-8 ring-white/5">
                                 <Stamp className="w-6 h-6" /> ANCHOR REMEDIATION SHARD
                              </button>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center opacity-30 mt-auto grayscale">
                      <div className="flex items-center gap-4">
                         <Fingerprint size={28} className="text-slate-400" />
                         <div className="space-y-1">
                            <p className="text-[9px] font-mono uppercase font-black text-slate-500 tracking-widest leading-none">ZK-PROOF: AUTH_SYNC_OK</p>
                            <p className="text-lg font-mono font-black text-slate-600 tracking-tighter leading-none">0x882_CHROMA_MICRO_SYNC</p>
                         </div>
                      </div>
                      <Sparkles size={40} className="text-blue-400" />
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Global Persistence Shard Footer */}
      <div className="p-16 md:p-24 glass-card rounded-[80px] border-emerald-500/20 bg-emerald-600/[0.03] flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden shadow-3xl mt-32 mx-4 z-10 backdrop-blur-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12 transition-transform duration-[15s] group-hover:rotate-45">
            <ShieldCheck className="w-[1000px] h-[1000px] text-emerald-400" />
         </div>
         <div className="flex items-center gap-16 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-40 h-40 bg-emerald-600 rounded-[56px] flex items-center justify-center shadow-3xl animate-pulse ring-[24px] ring-white/5 shrink-0">
               <Fingerprint className="w-20 h-20 text-white" />
            </div>
            <div className="space-y-6">
               <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">Spectral <span className="text-emerald-400">Sovereignty</span></h4>
               <p className="text-slate-400 text-2xl md:text-3xl font-medium italic leading-relaxed max-w-2xl">
                 The EACSS protocol ensures every visual signal across your node—from building colors to plant pigments—is mathematically aligned with global sustainability.
               </p>
            </div>
         </div>
         <div className="text-center md:text-right relative z-10 shrink-0 border-l border-white/10 pl-20">
            <p className="text-[14px] text-slate-600 font-black uppercase mb-6 tracking-[0.8em]">CHROMA_QUORUM</p>
            <p className="text-9xl md:text-[180px] font-mono font-black text-white tracking-tighter leading-none">100<span className="text-6xl text-emerald-400 ml-2">%</span></p>
         </div>
      </div>

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChromaSystem;