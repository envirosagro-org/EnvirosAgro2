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
  Atom,
  Wind,
  Info,
  Stamp,
  // Added missing Terminal import
  Terminal
} from 'lucide-react';
import { User, ResearchPaper } from '../types';
import { generateAgroResearch, analyzeMedia } from '../services/geminiService';

interface ResearchInnovationProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
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
    
    const fee = 50;
    if (!await onSpendEAC(fee, 'RESEARCH_SYNTHESIS_FEE')) return;

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
      setResearchOutput("Oracle synthesis failed. Please check network link.");
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
      
      {/* Header Section */}
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

      {activeTab === 'archive' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
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
                   
                   <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 text-amber-500">
                        <Star size={16} fill="currentColor" />
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
                  
                  <div className="pt-4 px-2">
                    <button 
                      onClick={extractIotData}
                      disabled={isExtractingIot}
                      className="w-full py-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl text-blue-400 font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                       {isExtractingIot ? <Loader2 size={12} className="animate-spin" /> : <Wifi size={12} />}
                       Link Local IoT Shards
                    </button>
                    {iotTelemetry && (
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-in zoom-in">
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2"><CheckCircle2 size={10} /> Shards Sync'd</p>
                         <p className="text-[10px] text-slate-300 font-mono italic">Node: {iotTelemetry.node}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                   <button 
                    onClick={runSynthesis}
                    disabled={isSynthesizing || !researchTitle}
                    className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                   >
                      {isSynthesizing ? <Loader2 className="animate-spin" /> : <FlaskConical size={20} />}
                      FORGE SHARD
                   </button>
                </div>
              </div>
           </div>

           <div className="lg:col-span-3 flex flex-col space-y-8">
              <div className="glass-card rounded-[56px] border border-white/5 bg-black/20 flex flex-col flex-1 relative overflow-hidden shadow-3xl">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4 text-emerald-400">
                       {/* Added missing Terminal import from lucide-react */}
                       <Terminal className="w-6 h-6" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Invention Oracle Terminal</span>
                    </div>
                    {researchOutput && (
                       <button onClick={registerResearch} className="px-8 py-3 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
                          <Stamp size={14} /> Anchor to Registry
                       </button>
                    )}
                 </div>

                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative bg-[#050706]">
                    {!researchOutput && !isSynthesizing ? (
                       <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20">
                          <Bot size={140} className="text-slate-500" />
                          <div className="space-y-2">
                             <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">FORGE_STANDBY</p>
                             <p className="text-lg font-bold text-slate-600 uppercase tracking-widest italic">Synthesize research from raw telemetry shards</p>
                          </div>
                       </div>
                    ) : isSynthesizing ? (
                       <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500">
                          <div className="relative">
                             <Loader2 className="w-24 h-24 text-emerald-500 animate-spin mx-auto" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-emerald-400 animate-pulse" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">MAPPING ENERGY PATTERNS...</p>
                             <p className="text-slate-600 font-mono text-[10px]">EOS_CORE_AUDIT // CHECKING_FRAMEWORK_ALIGN</p>
                          </div>
                       </div>
                    ) : (
                       <div className="animate-in slide-in-from-bottom-10 duration-700 pb-10">
                          <div className="p-12 bg-black/60 rounded-[64px] border border-emerald-500/20 shadow-inner border-l-8 border-l-emerald-600 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={400} /></div>
                             <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                                <FileText className="w-8 h-8 text-emerald-400" />
                                <h4 className="text-2xl font-black text-white uppercase italic m-0">Generated Research Shard</h4>
                             </div>
                             <div className="prose prose-invert prose-emerald max-w-none text-slate-300 text-xl leading-loose italic whitespace-pre-line font-medium relative z-10">
                                {researchOutput}
                             </div>
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
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
      `}</style>
    </div>
  );
};

export default ResearchInnovation;