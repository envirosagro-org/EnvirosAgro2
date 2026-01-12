import React, { useState, useRef } from 'react';
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
  // Added missing RefreshCw import
  RefreshCw
} from 'lucide-react';
import { User, ResearchPaper } from '../types';
import { generateAgroResearch, analyzeMedia } from '../services/geminiService';

interface ResearchInnovationProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const PDF_LIBRARY: ResearchPaper[] = [
  { 
    id: 'RP-882', 
    title: 'Plant Wave Bio-Electric Modulation v1.2', 
    author: 'Dr. Sarah Chen', 
    authorEsin: 'EA-2024-X821', 
    abstract: 'Standardizing 432Hz ultrasonic sharding for soil molecular repair. This research identifies the specific voltage signatures required for root-level nutrient intake acceleration.', 
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
    id: 'RP-104', 
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
  }
];

const ResearchInnovation: React.FC<ResearchInnovationProps> = ({ user, onEarnEAC, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'forge' | 'archive'>('forge');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExtractingIot, setIsExtractingIot] = useState(false);
  
  // Lab Form State
  const [researchTitle, setResearchTitle] = useState('');
  const [researchThrust, setResearchThrust] = useState('Technological');
  const [iotTelemetry, setIotTelemetry] = useState<any>(null);
  const [externalData, setExternalData] = useState('');
  const [researchOutput, setResearchOutput] = useState<string | null>(null);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [archive, setArchive] = useState<ResearchPaper[]>(PDF_LIBRARY);
  const [searchTerm, setSearchTerm] = useState('');

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
      alert("IOT SYNC: Technical telemetry extracted from local node.");
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
        // Multi-modal synthesis if a file is present
        const prompt = `Act as an EnvirosAgro Senior Research Scientist. Using the attached reference shard and the following inputs, forge a formal research paper:
        Title: ${researchTitle}
        Thrust: ${researchThrust}
        IoT Data: ${JSON.stringify(iotTelemetry)}
        Additional Context: ${externalData}
        
        Synthesize the visual/document data with the technical telemetry to predict C(a) index impact.`;
        
        responseText = await analyzeMedia(fileBase64, selectedFile?.type || 'image/jpeg', prompt);
      } else {
        // Standard text-only synthesis
        const response = await generateAgroResearch(
          researchTitle, 
          researchThrust, 
          iotTelemetry, 
          externalData || "Standard registry context."
        );
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
      id: `RP-${Math.random().toString(36).substring(7).toUpperCase()}`,
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 group shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform">
             <Microscope className="w-96 h-96 text-white" />
          </div>
          <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-2xl shrink-0">
             <FlaskConical className="w-16 h-16 text-white" />
          </div>
          <div className="flex-1 space-y-4">
             <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Invention Ledger v4.2</span>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Research <span className="text-emerald-400">& Innovation</span></h2>
             </div>
             <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
               Forge the future of agriculture. Synthesize raw IoT telemetry and reference shards into immutable research papers.
             </p>
             <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setActiveTab('forge')}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'forge' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                >
                  Shard Forge
                </button>
                <button 
                  onClick={() => setActiveTab('archive')}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'archive' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                >
                  Patent Archive
                </button>
             </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-emerald-500/[0.02] animate-pulse"></div>
           <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.4em]">Total Patents</p>
           <h3 className="text-6xl font-black text-white font-mono tracking-tighter">{archive.length}</h3>
           <div className="pt-4 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <p className="text-[9px] text-slate-600 font-black uppercase">Registry Validated</p>
           </div>
        </div>
      </div>

      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 space-y-8 relative overflow-hidden">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <Zap className="w-5 h-5 text-emerald-400" />
                   </div>
                   <h3 className="font-black text-white uppercase text-xs tracking-widest">Synthesis Input</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Shard Title</label>
                    <input 
                      type="text" 
                      value={researchTitle}
                      onChange={e => setResearchTitle(e.target.value)}
                      placeholder="e.g. Ultrasonic Soil Repair..." 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all" 
                    />
                  </div>
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Pillar Anchor</label>
                    <select 
                      value={researchThrust}
                      onChange={e => setResearchThrust(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option>Technological</option>
                      <option>Environmental</option>
                      <option>Societal</option>
                      <option>Industry</option>
                      <option>Human</option>
                    </select>
                  </div>
                  
                  {/* File Upload Section */}
                  <div className="space-y-2 px-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Reference Shard (Upload)</label>
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
                           <span className="text-[10px] font-black text-slate-600 uppercase group-hover:text-emerald-500 transition-colors">Attach Data File</span>
                         </div>
                      )}
                    </div>
                    {selectedFile && (
                      <button onClick={removeFile} className="w-full mt-2 text-[8px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 flex items-center justify-center gap-1">
                        <X size={10} /> Remove Shard
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={extractIotData}
                      disabled={isExtractingIot}
                      className="py-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        {isExtractingIot ? <Loader2 className="w-3 h-3 animate-spin" /> : <Cpu className="w-3 h-3" />}
                        Sync IoT
                    </button>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center">
                       <span className={`text-[8px] font-black uppercase ${iotTelemetry ? 'text-emerald-400' : 'text-slate-700'}`}>
                          {iotTelemetry ? 'TELEM_OK' : 'TELEM_IDLE'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-[9px] font-black text-slate-600 uppercase">Registry Fee</span>
                      <span className="text-xs font-mono font-black text-emerald-400">50 EAC</span>
                   </div>
                   <button 
                    onClick={runSynthesis}
                    disabled={isSynthesizing || !researchTitle}
                    className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                   >
                    {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                    Initialize Synthesis
                  </button>
                </div>
              </div>
           </div>

           <div className="lg:col-span-3">
              <div className="glass-card rounded-[56px] min-h-[600px] flex flex-col border border-white/5 bg-black/20 shadow-3xl overflow-hidden">
                 <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[28px] bg-emerald-600 flex items-center justify-center shadow-xl">
                          <Binary className="w-8 h-8 text-white" />
                       </div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Synthesis <span className="text-emerald-400">Terminal</span></h3>
                    </div>
                    {selectedFile && (
                       <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
                          <Paperclip size={12} className="text-emerald-400" />
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Shard Boost Active</span>
                       </div>
                    )}
                 </div>
                 <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                    {isSynthesizing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl z-20">
                         <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                         <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.3em] text-sm italic">Forging Scientific Consensus Shard...</p>
                      </div>
                    ) : researchOutput ? (
                      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6">
                         <div className="p-16 bg-black/80 rounded-[64px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-emerald-500/50">
                            <p className="text-slate-300 leading-[2.2] italic text-xl whitespace-pre-line font-medium border-l-4 border-emerald-500/20 pl-12">
                               {researchOutput}
                            </p>
                         </div>
                         <button 
                           onClick={registerResearch}
                           className="px-16 py-6 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all mx-auto block"
                         >
                            Commit Invention to Archive
                         </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-30">
                         <FlaskConical className="w-24 h-24 text-slate-500" />
                         <p className="text-lg font-black uppercase tracking-widest">Terminal Standby: Initialize Synthesis Ingest</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'archive' && (
        <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
           <div className="flex justify-between items-center border-b border-white/5 pb-8 px-4">
              <div className="relative group w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter patent shards..." 
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs text-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {archive.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((paper) => (
                <div key={paper.id} className="glass-card p-8 rounded-[44px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Database size={140} /></div>
                   <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors`}>
                         <FileText className="w-8 h-8 text-emerald-400" />
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20">{paper.status}</span>
                   </div>
                   <h4 className="text-2xl font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors italic truncate">{paper.title}</h4>
                   <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-6">STEWARD: {paper.author}</p>
                   <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-3 mb-10">"{paper.abstract}"</p>
                   <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-blue-400" />
                        <span className="text-[10px] font-mono font-black text-white">{paper.impactScore}%</span>
                      </div>
                      <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white transition-all"><Download size={16} /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ResearchInnovation;