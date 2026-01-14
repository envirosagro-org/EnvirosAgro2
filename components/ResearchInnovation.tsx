
import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, 
  FlaskConical, 
  Zap, 
  Bot, 
  Sparkles, 
  Loader2, 
  Search, 
  PlusCircle, 
  Download, 
  Database, 
  ChevronRight, 
  Award, 
  History, 
  ArrowUpRight, 
  FileText, 
  Cpu, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  X, 
  Upload, 
  Coins, 
  Star, 
  TrendingUp, 
  MessageSquare,
  Binary,
  Lightbulb,
  CheckCircle2,
  Trash2,
  Bookmark,
  FileJson,
  Eye,
  FileDown,
  Paperclip,
  FileUp,
  CloudUpload,
  Link2,
  RefreshCw,
  Library,
  ScrollText,
  Dna,
  Binary as BinaryIcon,
  Atom,
  Wind,
  Info
} from 'lucide-react';
import { User, ResearchPaper } from '../types';
import { generateAgroResearch, analyzeMedia } from '../services/geminiService';

interface ResearchInnovationProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  pendingAction?: string | null;
  clearAction?: () => void;
}

const INITIAL_PATENTS: ResearchPaper[] = [
  { 
    id: 'PAT-8821', 
    title: 'Plant Wave Bio-Electric Modulation v1.2', 
    author: 'Dr. Sarah Chen', 
    authorEsin: 'EA-2024-X821', 
    abstract: 'Standardizing 432Hz ultrasonic sharding for soil molecular repair. Identifies specific voltage signatures required for root-level nutrient intake acceleration.', 
    content: 'Full content archived in Ledger. Analysis shows 14% boost in biomass in controlled environments.', 
    thrust: 'Technological', 
    status: 'Invention', 
    impactScore: 94, 
    rating: 4.8, 
    eacRewards: 1250, 
    timestamp: '2d ago',
    iotDataUsed: true
  },
  { 
    id: 'PAT-9104', 
    title: 'Bantu Soil Biome Heritage Mapping', 
    author: 'Steward Nairobi', 
    authorEsin: 'EA-2023-P991', 
    abstract: 'Cross-analyzing ancestral lineages with spectral IoT data shards. Mapping the resilience of drought-resistant seeds across Zone 4.', 
    content: 'Full experimental content archived in Ledger...', 
    thrust: 'Societal', 
    status: 'Registered', 
    impactScore: 88, 
    rating: 4.5, 
    eacRewards: 450, 
    timestamp: '5d ago',
    iotDataUsed: true
  },
  { 
    id: 'PAT-4420', 
    title: 'Nitrogen-Fixing Microbial Sharding', 
    author: 'Dr. Elena Rodriguez', 
    authorEsin: 'EA-2024-V420', 
    abstract: 'Developing synthetic microbial nodes that communicate nitrogen levels via the industrial registry for real-time fertilization optimization.', 
    content: 'Proprietary biological protocol v4.0...', 
    thrust: 'Environmental', 
    status: 'Invention', 
    impactScore: 91, 
    rating: 4.9, 
    eacRewards: 2000, 
    timestamp: '1w ago',
    iotDataUsed: true
  },
  { 
    id: 'PAT-1122', 
    title: 'C(a) Index Exponential Scalar v3', 
    author: 'Neo Harvest', 
    authorEsin: 'EA-2025-W12', 
    abstract: 'A new mathematical derivation for the m-Constant to account for extreme weather-driven resonance friction in alpine farming nodes.', 
    content: 'Finalized logic shard committed to EOS Core...', 
    thrust: 'Industry', 
    status: 'Invention', 
    impactScore: 96, 
    rating: 5.0, 
    eacRewards: 3500, 
    timestamp: '3h ago',
    iotDataUsed: true
  }
];

const ResearchInnovation: React.FC<ResearchInnovationProps> = ({ user, onEarnEAC, onSpendEAC, pendingAction, clearAction }) => {
  const [activeTab, setActiveTab] = useState<'forge' | 'archive'>('archive');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExtractingIot, setIsExtractingIot] = useState(false);
  
  const [researchTitle, setResearchTitle] = useState('');
  const [researchThrust, setResearchThrust] = useState('Technological');
  const [iotTelemetry, setIotTelemetry] = useState<any>(null);
  const [externalData, setExternalData] = useState('');
  const [researchOutput, setResearchOutput] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [archive, setArchive] = useState<ResearchPaper[]>(INITIAL_PATENTS);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (pendingAction === 'OPEN_ARCHIVE') {
      setActiveTab('archive');
      if (clearAction) clearAction();
    }
  }, [pendingAction, clearAction]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFilePreview(base64String);
        setFileBase64(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const extractIotData = () => {
    setIsExtractingIot(true);
    setTimeout(() => {
      const mockIot = {
        node: "EA-ZONE4-NE",
        sensors: [
          { type: 'Soil_Moisture', val: 64.2, status: 'Nominal' },
          { type: 'C(a)_Multiplier', val: 1.42, unit: 'x' }
        ],
        timestamp: new Date().toISOString()
      };
      setIotTelemetry(mockIot);
      setIsExtractingIot(false);
    }, 1500);
  };

  const runSynthesis = async () => {
    if (!researchTitle) return alert("Title required.");
    if (!onSpendEAC(50, 'RESEARCH_SYNTHESIS_FEE')) return;

    setIsSynthesizing(true);
    setResearchOutput(null);
    
    try {
      let responseText = "";
      if (fileBase64) {
        const prompt = `Act as an EnvirosAgro Senior Research Scientist. Using the attached reference shard and the following inputs, forge a formal research paper:
        Title: ${researchTitle}
        Thrust: ${researchThrust}
        IoT Data: ${JSON.stringify(iotTelemetry)}
        Additional Context: ${externalData}
        
        Synthesize the visual/document data with the technical telemetry to predict C(a) index impact.`;
        responseText = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', prompt);
      } else {
        const response = await generateAgroResearch(researchTitle, researchThrust, iotTelemetry, externalData || "Standard registry context.");
        responseText = response.text;
      }
      setResearchOutput(responseText);
    } catch (e) {
      alert("Oracle synthesis failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const registerResearch = () => {
    if (!researchOutput) return;
    const newPaper: ResearchPaper = {
      id: `PAT-${Math.random().toString(36).substring(7).toUpperCase()}`,
      title: researchTitle,
      author: user.name,
      authorEsin: user.esin,
      abstract: researchOutput.substring(0, 200) + "...",
      content: researchOutput,
      thrust: researchThrust,
      status: 'Registered',
      impactScore: 0,
      rating: 0,
      eacRewards: 100,
      timestamp: 'Just now',
      iotDataUsed: !!iotTelemetry
    };
    setArchive([newPaper, ...archive]);
    onEarnEAC(100, 'RESEARCH_REGISTRATION_BONUS');
    setResearchOutput(null);
    setResearchTitle('');
    setSelectedFile(null);
    setFileBase64(null);
    setActiveTab('archive');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-[1400px] mx-auto px-4">
      
      {/* Header Section - Refined for Screenshot Sync */}
      <div className="glass-card p-12 rounded-[56px] border-emerald-500/10 bg-black/40 relative overflow-hidden flex flex-col items-center text-center space-y-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform">
           <Microscope className="w-96 h-96 text-white" />
        </div>
        
        <div className="w-36 h-36 rounded-[48px] bg-emerald-500/90 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)] shrink-0">
           <ScrollText className="w-16 h-16 text-white" />
        </div>

        <div className="space-y-4 max-w-3xl relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.6em]">Invention Ledger v4.2</span>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">Research <span className="text-emerald-400">& Innovation</span></h2>
          </div>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
            Forge the future of agriculture. Access the global patent archive or synthesize raw IoT telemetry into immutable research papers.
          </p>
        </div>

        <div className="flex gap-4 pt-4 relative z-10">
          <button 
            onClick={() => setActiveTab('archive')}
            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'archive' ? 'bg-emerald-600 text-white shadow-xl border border-emerald-400/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Patent Archive
          </button>
          <button 
            onClick={() => setActiveTab('forge')}
            className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'forge' ? 'bg-emerald-600 text-white shadow-xl border border-emerald-400/50' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            Research Shard Forge
          </button>
        </div>
      </div>

      {/* Global Inventions Counter Card */}
      <div className="glass-card p-12 rounded-[56px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
         <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.6em]">Global Inventions</p>
         <h3 className="text-8xl font-black text-white font-mono tracking-tighter">{archive.length}</h3>
         <div className="pt-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Registry Validated</p>
         </div>
      </div>

      {activeTab === 'archive' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="space-y-4 px-4 text-center">
              <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Immutable <span className="text-emerald-400">Patent Vault</span></h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Authorized scientific shards and industrial inventions.</p>
           </div>

           <div className="relative group w-full max-w-4xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filter patent shards by ID, author or title..." 
                className="w-full bg-black/40 border border-white/10 rounded-full py-6 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium placeholder:text-slate-700"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {archive.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.author.toLowerCase().includes(searchTerm.toLowerCase())).map((paper) => (
                <div key={paper.id} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-emerald-500/20 transition-all group flex flex-col h-full bg-black/20 shadow-xl relative overflow-hidden">
                   <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                         <ScrollText className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20 tracking-widest`}>{paper.status.toUpperCase()}</span>
                        <p className="text-[10px] text-slate-700 font-mono font-bold tracking-widest uppercase">{paper.id}</p>
                      </div>
                   </div>

                   <div className="flex-1 space-y-4 relative z-10">
                      <h4 className="text-3xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-400 transition-colors m-0">{paper.title}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Published By: {paper.author}</p>
                      <p className="text-sm text-slate-400 leading-relaxed italic mt-6 opacity-80 font-medium">"{paper.abstract}"</p>
                   </div>
                   
                   <div className="mt-10 space-y-5 border-t border-white/5 pt-8 relative z-10">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                         <span className="text-slate-600">Pillar Thrust</span>
                         <span className="text-blue-400">{paper.thrust.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                         <span className="text-slate-600">Impact Score</span>
                         <div className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span className="text-white font-mono">{paper.impactScore}%</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-mono font-black text-white">{paper.rating}</span>
                      </div>
                      <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl active:scale-90">
                         <Download size={20} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-8 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <Zap className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h3 className="font-black text-white uppercase text-xs tracking-widest italic">Forge Inputs</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Invention Title</label>
                    <input 
                      type="text" 
                      value={researchTitle}
                      onChange={e => setResearchTitle(e.target.value)}
                      placeholder="e.g. Ultrasonic Soil Repair..." 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-bold placeholder:text-slate-800" 
                    />
                  </div>
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Framework Anchor</label>
                    <select 
                      value={researchThrust}
                      onChange={e => setResearchThrust(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option>Technological</option>
                      <option>Environmental</option>
                      <option>Societal</option>
                      <option>Industry</option>
                      <option>Human</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reference Ingest (Upload)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center cursor-pointer group ${selectedFile ? 'bg-emerald-600/10 border-emerald-500' : 'bg-black/40 border-white/10 hover:border-emerald-500/40'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf" />
                      {filePreview ? (
                         <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            <img src={filePreview} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <RefreshCw size={24} className="text-white animate-spin-slow" />
                            </div>
                         </div>
                      ) : (
                         <div className="flex flex-col items-center gap-2">
                           <FileUp size={24} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                           <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-emerald-500 transition-colors">Attach Evidence Shard</span>
                         </div>
                      )}
                    </div>
                    {selectedFile && (
                      <button onClick={removeFile} className="w-full mt-2 text-[8px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 flex items-center justify-center gap-1">
                        <X size={10} /> Discard Shard
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={extractIotData}
                      disabled={isExtractingIot}
                      className="py-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isExtractingIot ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wifi className="w-3 h-3" />}
                        Sync IoT
                    </button>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center">
                       <span className={`text-[8px] font-black uppercase tracking-widest ${iotTelemetry ? 'text-emerald-400 animate-pulse' : 'text-slate-700'}`}>
                          {iotTelemetry ? 'TELEM_SYNCED' : 'TELEM_IDLE'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Synthesis Fee</span>
                      <span className="text-xs font-mono font-black text-emerald-400">50 EAC</span>
                   </div>
                   <button 
                    onClick={runSynthesis}
                    disabled={isSynthesizing || !researchTitle}
                    className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                   >
                    {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                    INITIALIZE SYNTHESIS
                  </button>
                </div>
              </div>

              <div className="p-8 glass-card rounded-[40px] border border-blue-500/20 bg-blue-500/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Forge Logic</h4>
                 </div>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase italic">
                    "Synthesizing IoT biometrics with documented research creates an immutable invention shard. Verified patents earn recurring EAC royalties from the global grid."
                 </p>
              </div>
           </div>

           <div className="lg:col-span-3">
              <div className="glass-card rounded-[56px] min-h-[600px] flex flex-col border border-white/5 bg-black/20 shadow-3xl overflow-hidden">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[28px] bg-emerald-600 flex items-center justify-center shadow-xl">
                          <BinaryIcon className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Forge <span className="text-emerald-400">Terminal</span></h3>
                    </div>
                    <div className="flex gap-4 items-center">
                       {selectedFile && (
                          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
                             <Paperclip size={12} className="text-emerald-400" />
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Evidence Sync Active</span>
                          </div>
                       )}
                       <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[9px] font-mono font-black text-slate-500">CONSENSUS_READY</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                    {isSynthesizing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
                         <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                         <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.3em] text-sm italic">Synthesizing Industrial Consensus Shard...</p>
                         <div className="mt-10 flex gap-2">
                           {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-8 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                         </div>
                      </div>
                    ) : researchOutput ? (
                      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                         <div className="p-16 bg-black/80 rounded-[64px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-emerald-500/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Atom className="w-96 h-96 text-white" /></div>
                            <div className="prose prose-emerald prose-xl text-slate-300 leading-[2.2] italic whitespace-pre-line font-medium border-l-4 border-emerald-500/10 pl-12 relative z-10">
                               {researchOutput}
                            </div>
                         </div>
                         <div className="flex flex-col items-center gap-6">
                            <button 
                              onClick={registerResearch}
                              className="px-16 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all block ring-8 ring-emerald-500/5"
                            >
                               COMMIT INVENTION TO GLOBAL ARCHIVE
                            </button>
                            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">Requires one-time ESIN node signature.</p>
                         </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-30 group">
                         <div className="relative">
                            <FlaskConical className="w-32 h-32 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                         </div>
                         <div className="space-y-2">
                            <p className="text-xl font-black uppercase tracking-[0.5em] text-white">Terminal Standby</p>
                            <p className="text-xs italic uppercase font-bold tracking-widest text-slate-600">Awaiting Industrial Metadata & Payment</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ResearchInnovation;
