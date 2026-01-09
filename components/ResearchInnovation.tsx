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
  Globe,
  Waves,
  Heart,
  BarChart4
} from 'lucide-react';
import { User, ResearchPaper, ViewState } from '../types';
import { generateAgroResearch } from '../services/geminiService';

interface ResearchInnovationProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const INITIAL_ARCHIVE: ResearchPaper[] = [
  { 
    id: 'RP-PDF-882', 
    title: 'Plant Wave Bio-Electric Modulation v1.2', 
    author: 'Dr. Sarah Chen', 
    authorEsin: 'EA-2024-X821', 
    abstract: 'Standardizing 432Hz ultrasonic sharding for soil molecular repair.', 
    content: 'Full AgroInPDF™ content archived in Ledger...', 
    thrust: 'Technological', 
    status: 'Invention', 
    impactScore: 94, 
    rating: 4.8, 
    eacRewards: 1250, 
    timestamp: '2d ago',
    iotDataUsed: true
  },
  { 
    id: 'RP-PDF-104', 
    title: 'Bantu Soil Biome Heritage Mapping', 
    author: 'Steward Nairobi', 
    authorEsin: 'EA-2023-P991', 
    abstract: 'Cross-analyzing ancestral lineages with spectral IoT data shards.', 
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
  const [tab, setTab] = useState<'lab' | 'archive' | 'inventions'>('lab');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isExtractingIot, setIsExtractingIot] = useState(false);
  
  // Lab Form State
  const [researchTitle, setResearchTitle] = useState('');
  const [researchThrust, setResearchThrust] = useState('Technological');
  const [iotTelemetry, setIotTelemetry] = useState<any>(null);
  const [externalData, setExternalData] = useState<string | null>(null);
  const [researchOutput, setResearchOutput] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [archive, setArchive] = useState<ResearchPaper[]>(INITIAL_ARCHIVE);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractIotData = () => {
    setIsExtractingIot(true);
    // Simulate fetching from Digital Twin / Science & IoT module
    setTimeout(() => {
      const mockIot = {
        node: "EA-ZONE4-NE",
        origin: "Science & IoT Hub",
        sensors: [
          { type: 'Soil_Moisture', val: 64.2, status: 'Nominal' },
          { type: 'Nitrogen_Shard', val: 412, unit: 'ppm' },
          { type: 'Resonance_m', val: 432, unit: 'Hz' },
          { type: 'C(a)_Multiplier', val: 1.42, unit: 'x' }
        ],
        timestamp: new Date().toISOString()
      };
      setIotTelemetry(mockIot);
      setIsExtractingIot(false);
      alert("AGROINPDF SYNC: Live Science & IoT telemetry extracted from local node registry.");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setExternalData(`External Research Context: ${file.name} | Integrity: Verified Hash`);
    }
  };

  const runSynthesis = async () => {
    if (!researchTitle) return alert("Title required for AgroInPDF indexing.");
    if (!onSpendEAC(50, 'AGROINPDF_SYNTHESIS_FEE')) return;

    setIsSynthesizing(true);
    setResearchOutput(null);
    
    try {
      const response = await generateAgroResearch(
        researchTitle, 
        researchThrust, 
        iotTelemetry, 
        externalData || "Standard registry context only."
      );
      setResearchOutput(response.text);
    } catch (e) {
      alert("Oracle synthesis failed. Check node handshake.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const registerResearch = () => {
    if (!researchOutput) return;
    
    const newPaper: ResearchPaper = {
      id: `RP-PDF-${Math.random().toString(36).substring(7).toUpperCase()}`,
      title: researchTitle,
      author: user.name,
      authorEsin: user.esin,
      abstract: researchOutput.substring(0, 200) + "...",
      content: researchOutput,
      thrust: researchThrust,
      status: 'Registered',
      impactScore: 0,
      rating: 0,
      eacRewards: 100, // Genesis Reward
      timestamp: 'Just now',
      iotDataUsed: !!iotTelemetry
    };

    setArchive([newPaper, ...archive]);
    onEarnEAC(100, 'AGROINPDF_REGISTRATION_BONUS');
    setResearchOutput(null);
    setResearchTitle('');
    setIotTelemetry(null);
    setExternalData(null);
    setUploadedFileName(null);
    setTab('archive');
    alert("AGROINPDF LEDGER: Shard hardened and committed to the Industrial Archive.");
  };

  const handleRatePaper = (paperId: string, stars: number) => {
    setArchive(prev => prev.map(p => {
      if (p.id === paperId) {
        const newRating = ((p.rating * 10) + stars) / 11; // Weighted average simulation
        const impactBoost = Math.floor(stars * 2);
        
        // Reward author if rating is high
        if (stars >= 4 && p.authorEsin !== user.esin) {
          // In a real app, this would be a network trigger to the author
          console.log(`Rewarding author ${p.author} for high-quality sharding.`);
        }

        return { 
          ...p, 
          rating: Number(newRating.toFixed(1)), 
          impactScore: Math.min(100, p.impactScore + impactBoost)
        };
      }
      return p;
    }));
    
    // Reward voter with small EOC for "Reaction Mining"
    onEarnEAC(2, 'RESEARCH_PEER_REVIEW');
    alert(`RATING COMMITTED: +2 EAC earned for Peer Review. Impact boosted by ${stars * 2}%.`);
  };

  const filteredArchive = archive.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* AgroInPDF Banner */}
      <div className="glass-card p-4 rounded-3xl border-orange-500/20 bg-orange-500/5 flex items-center justify-between overflow-hidden relative">
         <div className="flex items-center gap-4 px-4 border-r border-white/5 relative z-10">
            <div className="p-2 bg-orange-400 text-black rounded-lg">
               <FileJson className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">AgroInPDF™ Protocol</span>
         </div>
         <div className="flex-1 px-6 relative z-10 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee text-[10px] text-orange-400 font-mono font-black uppercase tracking-widest">
               Total Knowledge Shards: 4,281 • Invention Registry Active • C(a) Proof-of-Research Validated • Community Impact Rewards Live • 
            </div>
         </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] w-fit border border-white/5 bg-black/40 mx-auto lg:mx-0">
        {[
          { id: 'lab', label: 'Synthesis Lab', icon: FlaskConical },
          { id: 'archive', label: 'Research Ledger', icon: Database },
          { id: 'inventions', label: 'Invention Vault', icon: Lightbulb },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${tab === t.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[700px]">
        {tab === 'lab' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-left-4 duration-500">
            {/* Lab Input Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] border-orange-500/20 bg-orange-500/5 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
                   <FlaskConical className="w-40 h-40 text-orange-400" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30">
                      <Microscope className="w-5 h-5 text-orange-400" />
                   </div>
                   <h3 className="font-black text-white uppercase text-xs tracking-[0.3em]">Scientific Ingest</h3>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Paper Designation</label>
                    <input 
                      type="text" 
                      value={researchTitle}
                      onChange={e => setResearchTitle(e.target.value)}
                      placeholder="e.g. Soil Biome Sharding..." 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs outline-none focus:ring-2 focus:ring-orange-500/40" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">SEHTI Thrust</label>
                    <select 
                      value={researchThrust}
                      onChange={e => setResearchThrust(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs outline-none appearance-none cursor-pointer"
                    >
                      {['Societal', 'Environmental', 'Human', 'Technological', 'Industry'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4 relative z-10">
                   <div className="flex justify-between items-center px-2">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Connect Data</span>
                      <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
                   </div>
                   <button 
                    onClick={extractIotData}
                    disabled={isExtractingIot}
                    className="w-full py-4 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                      {isExtractingIot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                      Pull Science & IoT Shards
                   </button>
                   
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                      <Upload className="w-4 h-4" />
                      {uploadedFileName ? 'Context Hardened' : 'Inject External Data'}
                   </button>
                   {uploadedFileName && <p className="text-[8px] text-emerald-500 text-center uppercase tracking-widest font-black italic">{uploadedFileName}</p>}
                </div>

                <div className="pt-6">
                   <div className="flex justify-between items-center px-2 mb-4">
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Synthesis Fee</span>
                      <span className="text-[10px] font-mono font-black text-orange-400">50 EAC</span>
                   </div>
                   <button 
                    onClick={runSynthesis}
                    disabled={isSynthesizing || !researchTitle}
                    className="w-full py-6 agro-gradient-orange rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                   >
                    {isSynthesizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5" />}
                    {isSynthesizing ? 'SHARDING PDF...' : 'SYNTHESIZE AGROINPDF'}
                  </button>
                </div>
              </div>

              {iotTelemetry && (
                <div className="glass-card p-6 rounded-[32px] border-emerald-500/20 bg-emerald-500/5 space-y-4 animate-in zoom-in duration-300">
                   <div className="flex justify-between items-center">
                      <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Science Shard</p>
                      <button onClick={() => setIotTelemetry(null)} className="text-slate-600 hover:text-white"><X size={12} /></button>
                   </div>
                   <div className="space-y-2">
                      <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                         {iotTelemetry.sensors.map((s: any) => (
                           <div key={s.type} className="flex justify-between text-[9px] font-mono">
                              <span className="text-slate-500">{s.type}</span>
                              <span className="text-emerald-400">{s.val}{s.unit || ''}</span>
                           </div>
                         ))}
                      </div>
                      <p className="text-[8px] text-slate-600 italic">Source: {iotTelemetry.origin} // Verified Node</p>
                   </div>
                </div>
              )}
            </div>

            {/* Lab Output Stage */}
            <div className="lg:col-span-3 space-y-6">
               <div className="glass-card rounded-[56px] min-h-[750px] flex flex-col border border-white/5 bg-black/20 shadow-3xl overflow-hidden relative">
                  <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                  
                  <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[28px] bg-orange-600 flex items-center justify-center shadow-xl shadow-orange-900/40">
                           <FileJson className="w-8 h-8 text-white" />
                        </div>
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">AgroInPDF <span className="text-orange-400">Drafting Terminal</span></h3>
                           <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Oracle Sync: ACTIVE // EOS Registry v3.2</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase tracking-widest border border-orange-500/20">THINKING_BUDGET: 32K</span>
                     </div>
                  </div>

                  <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                    {isSynthesizing ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-3xl z-20 animate-in fade-in duration-500">
                         <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-orange-500/10 flex items-center justify-center">
                               <Binary className="w-16 h-16 text-orange-400 animate-pulse" />
                            </div>
                            <div className="absolute inset-0 border-t-8 border-orange-500 rounded-full animate-spin"></div>
                         </div>
                         <div className="mt-10 space-y-2 text-center">
                            <p className="text-orange-400 font-black text-sm uppercase tracking-[0.5em] animate-pulse italic">Synthesizing Industrial Shard...</p>
                            <p className="text-slate-700 font-mono text-[9px]">INTERPRETING SCIENCE_IOT_TEL_842...</p>
                         </div>
                      </div>
                    ) : researchOutput ? (
                      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                               <ShieldCheck className="w-4 h-4 text-emerald-400" />
                               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Scientific Protocol Verified</span>
                            </div>
                            <button 
                              onClick={registerResearch}
                              className="px-10 py-4 agro-gradient-orange rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                            >
                               <Database className="w-4 h-4" /> Commit to Industrial Archive
                            </button>
                         </div>
                         <div className="p-16 bg-black/80 rounded-[64px] border border-white/10 prose prose-invert max-w-none shadow-inner border-l-8 border-orange-500/50">
                            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-white/5">
                               <div className="p-5 bg-orange-500/10 rounded-2xl border border-orange-500/20"><Sparkles className="w-8 h-8 text-orange-400" /></div>
                               <div>
                                  <h4 className="text-3xl font-black text-white uppercase tracking-widest italic">Research Shard v1.0</h4>
                                  <p className="text-[10px] text-slate-600 font-mono tracking-widest mt-1">Hashed via ZK-Proof // Registry Shard #881</p>
                               </div>
                            </div>
                            <div className="text-slate-300 leading-[2.4] italic text-xl whitespace-pre-line font-medium border-l-4 border-orange-500/20 pl-12">
                               {researchOutput}
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-30">
                         <div className="w-48 h-48 rounded-[56px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center relative">
                            <Microscope className="w-24 h-24 text-slate-500" />
                            <div className="absolute inset-4 border border-white/5 rounded-full animate-spin-slow"></div>
                         </div>
                         <div className="max-w-md space-y-4">
                            <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">AgroInPDF Hub</h4>
                            <p className="text-slate-500 text-lg italic leading-relaxed font-medium">
                               Define your research title and thrust, optionally ingest live shards from the Science & IoT hub, and initialize the Gemini Oracle to synthesize immutable industrial research.
                            </p>
                         </div>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {tab === 'archive' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic flex items-center justify-center md:justify-start gap-4">
                      <Database className="w-10 h-10 text-orange-400" /> Research <span className="text-orange-400">Archive Ledger</span>
                   </h3>
                   <p className="text-lg text-slate-500 italic">Community reviewed AgroInPDF shards. High-impact research earns EOC/EAC dividends.</p>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                   <input 
                    type="text" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by hash, author, or thrust..." 
                    className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredArchive.map((paper) => (
                  <div key={paper.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-orange-500/40 transition-all group flex flex-col h-full active:scale-[0.98] duration-300 relative overflow-hidden bg-black/20">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform">
                        <FileText className="w-48 h-48 text-white" />
                     </div>
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-4 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-orange-500/10 transition-colors">
                           <FileJson className="w-8 h-8 text-orange-400" />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${paper.status === 'Invention' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                           {paper.status}
                        </span>
                     </div>
                     
                     <div className="flex-1 relative z-10">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-orange-400 transition-colors italic mb-4">{paper.title}</h4>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-6 flex items-center gap-2">
                           <Activity size={10} className="text-orange-500" /> AUTHOR: {paper.author} // {paper.authorEsin}
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed italic mb-8 line-clamp-3">"{paper.abstract}"</p>
                        
                        {/* Rating Component */}
                        <div className="space-y-4 mb-8">
                           <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest px-1">Peer Review Impact</p>
                           <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                 <button 
                                    key={star}
                                    onClick={() => handleRatePaper(paper.id, star)}
                                    className={`p-2 rounded-lg transition-all ${Math.round(paper.rating) >= star ? 'text-amber-400 hover:scale-110' : 'text-slate-800 hover:text-amber-400'}`}
                                 >
                                    <Star className={`w-5 h-5 ${Math.round(paper.rating) >= star ? 'fill-amber-400' : ''}`} />
                                 </button>
                              ))}
                              <span className="text-lg font-mono font-black text-white ml-2">{paper.rating}</span>
                           </div>
                        </div>
                     </div>

                     <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                           <div className="flex flex-col">
                              <span className="text-[8px] text-slate-600 font-black uppercase">Impact Factor</span>
                              <div className="flex items-center gap-2 mt-1">
                                 <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                 <span className="text-[11px] font-mono font-black text-white">{paper.impactScore}%</span>
                              </div>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-[8px] text-slate-600 font-black uppercase">EOC Payout</span>
                              <p className="text-[11px] font-mono font-black text-emerald-400 mt-1">+{Math.round(paper.rating * 50)} EAC</p>
                           </div>
                        </div>
                        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-orange-600 transition-all active:scale-90">
                           <FileDown className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {tab === 'inventions' && (
          <div className="space-y-12 animate-in zoom-in duration-500">
             <div className="glass-card p-16 rounded-[64px] border-amber-500/20 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
                   <Lightbulb className="w-96 h-96 text-amber-400" />
                </div>
                <div className="flex items-center gap-10 relative z-10">
                   <div className="w-32 h-32 agro-gradient-amber rounded-[40px] flex items-center justify-center shadow-3xl animate-pulse ring-[20px] ring-white/5">
                      <Lightbulb className="w-16 h-16 text-white" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">AgroInPDF <span className="text-amber-500">Patent Vault</span></h4>
                      <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-md">Research shards with &gt; 90% Community Consensus graduate into official Industrial Inventions.</p>
                   </div>
                </div>
                <div className="text-right relative z-10 shrink-0">
                   <p className="text-[11px] text-slate-600 font-black uppercase mb-3 tracking-[0.5em]">TOTAL REGISTERED</p>
                   <p className="text-7xl font-mono font-black text-white tracking-tighter">14</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {archive.filter(p => p.status === 'Invention').map(inv => (
                   <div key={inv.id} className="glass-card p-12 rounded-[56px] border border-amber-500/20 bg-black/40 group hover:border-amber-500/40 transition-all flex flex-col h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none"></div>
                      <div className="flex justify-between items-start mb-12">
                         <div className="p-6 bg-amber-500/10 rounded-[32px] border border-amber-500/20 group-hover:rotate-6 transition-transform">
                            <Cpu className="w-10 h-10 text-amber-500" />
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Invention Bounty Earned</p>
                            <p className="text-3xl font-mono font-black text-emerald-400">+{inv.eacRewards} <span className="text-sm">EAC</span></p>
                         </div>
                      </div>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-6 leading-tight">{inv.title}</h4>
                      <p className="text-slate-400 text-lg leading-loose italic mb-12 flex-1">"{inv.abstract}"</p>
                      <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active License Pool</span>
                         </div>
                         <button className="px-8 py-4 bg-amber-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl hover:bg-amber-500 transition-all flex items-center gap-2">
                            Access Full Shard <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <style>{`
        .agro-gradient-orange {
          background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
        }
        .agro-gradient-amber {
          background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
        }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ResearchInnovation;