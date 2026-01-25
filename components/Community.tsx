import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayCircle, 
  GraduationCap, 
  Video, 
  BookOpen, 
  BookOpen as BookOpenIcon,
  MessageSquare, 
  Award, 
  Clock, 
  ChevronRight, 
  FileText, 
  Library, 
  Coins,
  Users,
  Globe,
  Heart,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  MessageCircle,
  Users2,
  Briefcase,
  Lightbulb,
  CheckCircle2,
  X,
  Loader2,
  ArrowUpRight,
  Handshake,
  Zap,
  Upload,
  Sparkles,
  FileBarChart,
  BarChart4,
  ExternalLink,
  MapPin,
  Fingerprint,
  Activity,
  History,
  BadgeCheck,
  Dna,
  Lock,
  SearchCode,
  Target,
  Bot,
  Brain,
  ShieldAlert,
  HeartPulse,
  Activity as PulseIcon,
  BrainCircuit,
  AlertTriangle,
  Waves,
  Atom,
  RefreshCcw,
  Scale,
  FileSignature,
  FileCheck,
  ClipboardCheck,
  FileDown,
  Timer,
  LayoutGrid,
  Trophy,
  PenTool,
  ArrowRight,
  AlertCircle,
  Download,
  Terminal,
  FileDigit,
  Shield,
  Stamp,
  Dna as DNAIcon
} from 'lucide-react';
import { User } from '../types';
import { findAgroResources, GroundingChunk, chatWithAgroExpert } from '../services/geminiService';

interface CommunityProps {
  user: User;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
}

const CHAPTERS = [
  { id: 1, title: "The SEHTI Philosophy", content: "Agriculture is not just land management; it is a complex system of human psychology, social structures, and scientific data. SEHTI integrates five core thrusts to achieve 100% sustainability.\n\nS: Societal - Anthropological agriculture.\nE: Environmental - Stewardship of physical resources.\nH: Human - Health and behavioral processes.\nT: Technological - Modern agrarian innovations.\nI: Industry - Data-driven industrial optimization and blockchain registries." },
  { id: 2, title: "Industry Thrust (I)", content: "The 'I' pillar focuses on industrial optimization. By leveraging decentralized ledgers (ESIN), we create an immutable record of agricultural output, carbon capture, and resource efficiency. This allows farms to act as independent economic nodes in a global grid." },
  { id: 3, title: "Agricultural Code C(a)", content: "The C(a) is the core biometric of your land. It is calculated based on cumulative sustainable practices. A high C(a) directly correlates with lower registry fees and higher EAC minting multipliers." },
];

const EXAM_QUESTIONS = [
  // THEORETICAL FOUNDATION
  {
    id: 1,
    category: 'SOCIETAL',
    q: "In the EnvirosAgro framework, what does the variable 'x' represent in the C(a) Agro Code formula?",
    options: ["Rainfall Multiplier", "Social Immunity / Resistance to SID", "Seed Purity Shard", "Industrial Capacity"],
    correct: 1
  },
  {
    id: 2,
    category: 'ENVIRONMENTAL',
    q: "Which sequestration method involves high-fidelity 'No-Till' sharding in Zone 4 Nebraska?",
    options: ["Hydroponic Ingest", "Regenerative Tilling Shards", "Bio-Nitrogen Array Installation", "Atmospheric Gaseous Sync"],
    correct: 1
  },
  {
    id: 3,
    category: 'HUMAN',
    q: "Social Influenza Disease (SID) primarily attacks which aspect of a farming cluster?",
    options: ["Soil Microbiome Purity", "Community Trust and Ideological Consensus", "Satellite Signal Stability", "Irrigation Flow Velocity"],
    correct: 1
  },
  {
    id: 4,
    category: 'TECHNOLOGICAL',
    q: "The m-constant formula m = sqrt((Dn * In * C(a)) / S) is specifically used to calculate:",
    options: ["Daily Water Loss", "Time Constant Resilience of an Industrial Node", "EAC Minting Multiplier", "Consumer Vouch Score"],
    correct: 1
  },
  {
    id: 5,
    category: 'INDUSTRY',
    q: "What is the primary role of ZK-SNARKs in the EnvirosAgro registry?",
    options: ["Increasing crop yield", "Enabling privacy-preserving telemetry verification", "Cooling industrial hardware", "Managing employee payroll"],
    correct: 1
  },
  // CORE DEFINITION (WhatIsAG)
  {
    id: 6,
    category: 'CORE',
    q: "The WhatIsAG™ definition states: Agriculture is an application of ____ or ____ from nature by human beings towards natural resources.",
    options: ["Art, Industry", "Science, Labour", "Art, Science", "Craft, Technology"],
    correct: 2
  },
  {
    id: 7,
    category: 'RESOURCES',
    q: "Which of the following is NOT listed as a primary natural resource in the EnvirosAgro mission?",
    options: ["Water", "Soil", "Crops", "Animals"],
    correct: 2
  },
  {
    id: 8,
    category: 'SEHTI',
    q: "Which SEHTI thrust focuses on 'Responsible transformation of raw materials into finished goods'?",
    options: ["Technological", "Industrial", "Environmental", "Societal"],
    correct: 1
  }
];

// Added LMS_MODULES constant to fix "Cannot find name 'LMS_MODULES'" error
const LMS_MODULES = [
  { title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false },
  { title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true },
  { title: "SID Pathogen Identification", category: "Societal", eac: 100, col: "text-rose-400", special: false },
  { title: "Total Quality Management (TQM)", category: "Industrial", eac: 200, col: "text-indigo-400", special: true },
  { title: "Bio-Electric Frequency Repair", category: "Technological", eac: 180, col: "text-teal-400", special: false },
  { title: "Lineage Seed Mapping", category: "Heritage", eac: 120, col: "text-amber-400", special: false },
  { title: "Carbon Sequestration Ingest", category: "Environmental", eac: 250, col: "text-emerald-500", special: true },
  { title: "Institutional DeFi Bridge", category: "Finance", eac: 300, col: "text-indigo-600", special: true },
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

const Community: React.FC<CommunityProps> = ({ user, onEarnEAC, onSpendEAC, onContribution }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'lms' | 'manual' | 'report'>('hub');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams'>('modules');
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
  // Learning States
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const [psychStep, setPsychStep] = useState(1);
  const [psychResonance, setPsychResonance] = useState(70);
  const [isSyncingPsych, setIsSyncingPsych] = useState(false);

  // Exam States
  const [examStep, setExamStep] = useState<'intro' | 'payment' | 'active' | 'grading' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingExam, setIsProcessingExam] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      onContribution('post', 'Sociological');
      setIsPosting(false);
      setPostContent('');
      alert("SUCCESS: Post committed to Heritage Forum. +5 EAC Earned.");
    }, 1500);
  };

  const handleAuthorizeExam = () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    if (onSpendEAC(EXAM_FEE, "INDUSTRIAL_EXAMINATION_INGEST")) {
      setIsProcessingExam(true);
      setTimeout(() => {
        setIsProcessingExam(false);
        setExamStep('active');
        setCurrentQuestion(0);
        setAnswers([]);
      }, 2000);
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for exam registration.");
    }
  };

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    
    if (currentQuestion < EXAM_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finalizeExam(newAnswers);
    }
  };

  const finalizeExam = (finalAnswers: number[]) => {
    setExamStep('grading');
    setIsProcessingExam(true);
    
    setTimeout(() => {
      let score = 0;
      finalAnswers.forEach((ans, i) => {
        if (ans === EXAM_QUESTIONS[i].correct) score++;
      });
      
      const percentage = (score / EXAM_QUESTIONS.length) * 100;
      const passed = percentage >= 70;
      
      setExamResult({ score, percentage, passed });
      setIsProcessingExam(false);
      setExamStep('results');

      if (passed && percentage === 100) {
        onEarnEAC(EXAM_REWARD_BOUNTY, "EXAM_BOUNTY_REWARD_HIGHEST_SCORER");
      }
      onContribution('quiz', passed ? 'Passed' : 'Attempted');
    }, 3000);
  };

  const downloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const themeColor = examResult?.passed ? '#10b981' : '#6366f1';
    
    ctx.fillStyle = '#050706';
    ctx.fillRect(0, 0, 1600, 1200);
    
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 1520, 1120);
    
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = themeColor;
    ctx.font = '800px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EOS', 800, 850);
    ctx.globalAlpha = 1;

    ctx.fillStyle = themeColor;
    ctx.font = 'bold 30px monospace';
    ctx.fillText('ENVIROSAGRO™ INDUSTRIAL REGISTRY', 800, 150);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 80px sans-serif';
    ctx.fillText(examResult?.passed ? 'Certificate of Competency' : 'Certificate of Participation', 800, 260);
    
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('This industrial shard acknowledges that steward', 800, 380);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px monospace';
    ctx.fillText(user.name.toUpperCase(), 800, 500);
    
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`has successfully demonstrated understanding of the`, 800, 600);
    ctx.fillText(`EOS SUSTAINABILITY FRAMEWORK & SEHTI THRUSTS`, 800, 650);

    ctx.fillStyle = themeColor;
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`EXAM GRADE: ${examResult?.percentage}%`, 800, 780);

    ctx.fillStyle = '#475569';
    ctx.font = '20px monospace';
    ctx.fillText(`ESIN: ${user.esin} // CYCLE_12 // DATE: ${new Date().toLocaleDateString()}`, 800, 950);
    ctx.fillText(`M-CONSTANT_HASH: 0x${btoa(user.esin + examResult?.score).substring(0, 32).toUpperCase()}`, 800, 1000);

    const link = document.createElement('a');
    link.download = `EnvirosAgro_Exam_Shard_${user.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const finalizePsychModule = () => {
    setIsSyncingPsych(true);
    setTimeout(() => {
      onContribution('module', 'HUMAN');
      onEarnEAC(150, 'AG_PSYCH_SID_COMPLETION');
      setIsSyncingPsych(false);
      setSelectedModule(null);
      alert("MODULE COMPLETE: Human Thrust Shard synchronized to node registry. +150 EAC.");
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'hub', name: 'HERITAGE HUB', icon: Globe },
          { id: 'lms', name: 'LEARNING HUB', icon: Library },
          { id: 'manual', name: 'SEHTI MANUAL', icon: BookOpen },
          { id: 'report', name: 'PERFORMANCE REPORT', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => { setActiveTab(t.id as any); setSelectedModule(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.name}
          </button>
        ))}
      </div>

      {activeTab === 'hub' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Posting Interface */}
              <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      Heritage Forum Update
                   </h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+5 EAC PER POST</span>
                </div>
                <form onSubmit={handlePostSubmit} className="space-y-6">
                   <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share knowledge, ancestral lineages, or field updates..." 
                    className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none min-h-[160px]"
                   />
                   <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-500/20 border border-transparent transition-all">
                          <Upload className="w-5 h-5" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" />
                      </div>
                      <button 
                        type="submit"
                        disabled={isPosting || !postContent.trim()}
                        className="px-12 py-3.5 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        BROADCAST TO HUB
                      </button>
                   </div>
                </form>
              </div>

              {/* Forum Feed */}
              <div className="space-y-6">
                 {[
                   { author: "@BANTU_STEWARD", title: "Passing the Seed: Lineage-based Crop Rotation", tags: ["S-THRUST", "HERITAGE"], likes: 142, replies: 24, time: "2H AGO" },
                   { author: "@SOILSAGE", title: "Treating Root Rot in Zone 4", tags: ["PATHOLOGY", "T-THRUST"], likes: 89, replies: 12, time: "5H AGO" },
                 ].map((post, i) => (
                   <div key={i} className="glass-card p-8 rounded-[32px] hover:bg-white/[0.04] transition-all border border-white/5 group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-emerald-500 text-xl border border-white/5 shadow-xl">
                               {post.author[1]}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">{post.title}</h4>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">STEWARD {post.author} • {post.time}</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer font-bold">
                            <Heart className="w-5 h-5" /> {post.likes}
                         </div>
                         <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer font-bold">
                            <MessageSquare className="w-5 h-5" /> {post.replies}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
               <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 agro-gradient"></div>
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-emerald-500/10 flex items-center justify-center shadow-inner">
                       <Zap className="w-14 h-14 text-emerald-400 fill-emerald-400/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">SEED STEWARD</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{user.wallet.lifetimeEarned} REP SHARDS</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lms' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="flex gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto border border-white/5 bg-black/40 mb-8">
              {[
                { id: 'modules', name: 'Curriculum Shards', icon: LayoutGrid },
                { id: 'exams', name: 'AgBoard Examination', icon: FileSignature },
              ].map(sub => (
                <button 
                  key={sub.id}
                  onClick={() => setLmsSubTab(sub.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lmsSubTab === sub.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <sub.icon size={14} /> {sub.name}
                </button>
              ))}
           </div>

           {lmsSubTab === 'modules' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                 {LMS_MODULES.map((m, i) => (
                   <div key={i} className={`glass-card p-10 rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full active:scale-95 duration-300 ${m.special ? 'bg-teal-500/5 border-teal-500/20' : 'bg-black/20'}`}>
                     <div className="flex justify-between items-start mb-10">
                         <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] ${m.col}`}>{m.category}</span>
                         <div className="text-right">
                           <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">+{m.eac} EAC</p>
                         </div>
                     </div>
                     <h4 className="text-2xl font-black text-white mb-10 leading-tight flex-1 tracking-tighter uppercase italic">{m.title}</h4>
                     <button onClick={() => setSelectedModule(m)} className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                         <PlayCircle className="w-5 h-5" /> START MODULE
                     </button>
                   </div>
                 ))}
             </div>
           )}

           {lmsSubTab === 'exams' && (
             <div className="max-w-[1400px] mx-auto space-y-12 animate-in slide-in-from-bottom-6">
                
                {examStep === 'intro' && (
                  <div className="p-16 glass-card rounded-[64px] border-indigo-500/20 bg-indigo-950/10 flex flex-col items-center text-center space-y-12 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05]"><FileSignature size={500} className="text-indigo-400" /></div>
                    <div className="w-32 h-32 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-3xl text-white relative z-10 animate-float">
                       <GraduationCap size={64} />
                    </div>
                    <div className="space-y-6 relative z-10">
                       <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">The EOS <span className="text-indigo-500">Registry Board Exam</span></h2>
                       <p className="text-slate-400 text-2xl font-medium max-w-3xl mx-auto italic">"A technical validation shard testing your knowledge of SEHTI thrusts, C(a) constant calculations, and WhatIsAG™ definitions."</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-5xl relative z-10">
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-3">
                          <Coins className="w-8 h-8 text-emerald-400 mx-auto" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Registry Fee</h4>
                          <p className="text-2xl font-mono font-black text-white">{EXAM_FEE} EAC</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-3">
                          <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Highest Scorer</h4>
                          <p className="text-2xl font-mono font-black text-white">{EXAM_REWARD_BOUNTY} EAC</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-3">
                          <BadgeCheck className="w-8 h-8 text-blue-400 mx-auto" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Award</h4>
                          <p className="text-lg font-black text-white uppercase italic">Digital Shard Cert</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 space-y-3">
                          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
                          <h4 className="text-xs font-black text-white uppercase tracking-widest">Reputation</h4>
                          <p className="text-lg font-black text-white uppercase italic">+100 REP</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setExamStep('payment')}
                      className="px-20 py-8 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 relative z-10"
                    >
                       INITIALIZE EXAM SEQUENCE
                    </button>
                  </div>
                )}

                {examStep === 'payment' && (
                  <div className="max-w-2xl mx-auto p-16 glass-card rounded-[64px] border-emerald-500/20 bg-black/40 shadow-3xl text-center space-y-12 animate-in zoom-in">
                    <div className="space-y-4">
                       <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl relative group">
                          <Lock className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                       </div>
                       <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Handshake <span className="text-emerald-400">Settlement</span></h3>
                       <p className="text-slate-500">Sign the registry ingest to release 50 EAC and access the board exam.</p>
                    </div>
                    <div className="p-10 bg-black/80 rounded-[48px] border border-white/10 space-y-8 shadow-inner">
                       <input 
                          type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} 
                          placeholder="ENTER ESIN SIGNATURE" 
                          className="w-full bg-black/60 border border-white/10 text-center py-6 rounded-3xl text-3xl font-mono text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase" 
                       />
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => setExamStep('intro')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest">Back</button>
                       <button 
                        onClick={handleAuthorizeExam}
                        disabled={isProcessingExam || !esinSign}
                        className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                       >
                          {isProcessingExam ? <Loader2 className="w-6 h-6 animate-spin" /> : <PenTool className="w-6 h-6" />}
                          {isProcessingExam ? 'SIGNING...' : 'AUTHORIZE SETTLEMENT'}
                       </button>
                    </div>
                  </div>
                )}

                {examStep === 'active' && (
                  <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-10">
                     <div className="flex justify-between items-center px-8">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em]">Shard {currentQuestion + 1} / {EXAM_QUESTIONS.length}</span>
                        <div className="flex items-center gap-4">
                           <Timer className="w-5 h-5 text-slate-700" />
                           <span className="text-xl font-mono font-black text-white">45:00</span>
                        </div>
                     </div>
                     
                     <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${((currentQuestion + 1) / EXAM_QUESTIONS.length) * 100}%` }}></div>
                     </div>

                     <div className="p-16 glass-card rounded-[64px] border-white/5 bg-black/40 shadow-3xl space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-400 font-black text-xs uppercase tracking-widest">{EXAM_QUESTIONS[currentQuestion].category}</div>
                        <h3 className="text-3xl font-black text-white italic leading-tight uppercase tracking-tight">"{EXAM_QUESTIONS[currentQuestion].q}"</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {EXAM_QUESTIONS[currentQuestion].options.map((opt, i) => (
                              <button 
                                key={i}
                                onClick={() => handleAnswerSelect(i)}
                                className="p-8 bg-white/5 border border-white/5 rounded-[40px] text-left text-lg font-bold text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-white transition-all group flex items-center gap-6"
                              >
                                 <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-xs font-black text-indigo-500 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white">
                                    {String.fromCharCode(65 + i)}
                                 </div>
                                 {opt}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {examStep === 'grading' && (
                  <div className="flex flex-col items-center justify-center space-y-12 py-32 animate-in fade-in">
                     <div className="relative">
                        <Loader2 className="w-24 h-24 text-indigo-500 animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <SearchCode className="w-10 h-10 text-emerald-400 animate-pulse" />
                        </div>
                     </div>
                     <div className="text-center space-y-4">
                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic animate-pulse">Auditing Shard Grading...</h3>
                        <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-[0.8em]">NODE_VERIFICATION_SYNC_#882</p>
                     </div>
                  </div>
                )}

                {examStep === 'results' && examResult && (
                  <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-700">
                     <div className="p-16 glass-card rounded-[64px] border-white/5 bg-black/40 shadow-3xl text-center space-y-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500 shadow-[0_0_50px_#6366f1]"></div>
                        
                        <div className="space-y-6">
                           <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-3xl ${examResult.passed ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                              {examResult.passed ? <Trophy size={64} className="text-white" /> : <Award size={64} className="text-white" />}
                           </div>
                           <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0">{examResult.passed ? 'VERIFIED' : 'PARTICIPATED'}</h3>
                           <p className="text-slate-500 text-xl font-medium italic">"Competency Score: <span className={examResult.passed ? 'text-emerald-400' : 'text-amber-400'}>{examResult.percentage}%</span>"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto">
                           <div className="p-8 bg-black rounded-[40px] border border-white/5 space-y-2">
                              <p className="text-[10px] text-slate-500 uppercase font-black">Correct Shards</p>
                              <p className="text-4xl font-mono font-black text-white">{examResult.score} / {EXAM_QUESTIONS.length}</p>
                           </div>
                           <div className="p-8 bg-black rounded-[40px] border border-white/5 space-y-2">
                              <p className="text-[10px] text-slate-500 uppercase font-black">Bounty Received</p>
                              <p className="text-4xl font-mono font-black text-emerald-400">
                                 {examResult.percentage === 100 ? `+${EXAM_REWARD_BOUNTY}` : '0'} EAC
                              </p>
                           </div>
                        </div>

                        <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[48px] space-y-8 animate-in slide-in-from-top-4">
                             <div className="flex items-center justify-center gap-6">
                                <BadgeCheck className="w-10 h-10 text-indigo-400" />
                                <h4 className="text-2xl font-black text-white uppercase italic">Registry Shard Cert Generated</h4>
                             </div>
                             <button 
                              onClick={downloadCertificate}
                              className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 mx-auto transition-all active:scale-95"
                             >
                                <Download className="w-6 h-6" /> Download Shard Certificate
                             </button>
                        </div>

                        <div className="flex gap-6 pt-10 border-t border-white/5">
                           <button onClick={() => setExamStep('intro')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-400 font-black text-xs uppercase tracking-widest hover:text-white">Exam Overview</button>
                           <button onClick={() => setLmsSubTab('modules')} className="flex-1 py-8 bg-indigo-600 rounded-[40px] text-white font-black text-xs uppercase tracking-widest shadow-xl">Return to Curriculum</button>
                        </div>
                     </div>
                  </div>
                )}
             </div>
           )}
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] space-y-3 border-white/5">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 px-2">MANUAL INDEX</h4>
                 {CHAPTERS.map(ch => (
                   <button 
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-full text-left p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedChapter.id === ch.id ? 'bg-emerald-600 text-white shadow-xl border-emerald-500 scale-105' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
                   >
                      CHAPTER {ch.id}: {ch.title}
                   </button>
                 ))}
              </div>
           </div>
           <div className="lg:col-span-3 glass-card p-16 rounded-[56px] bg-white/[0.01] border-white/5 max-w-none shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-6 mb-12 border-b border-white/5 pb-12">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <BookOpenIcon className="w-10 h-10 text-emerald-400" />
                 </div>
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter m-0 italic">{selectedChapter.title}</h2>
              </div>
              <div className="relative z-10 text-slate-300 leading-[2.2] text-xl whitespace-pre-line bg-black/40 p-12 rounded-[48px] border border-white/5 italic font-medium shadow-inner">
                 {selectedChapter.content}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
           <div className="glass-card p-16 rounded-[56px] bg-emerald-600/5 border-emerald-500/20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
              <div className="w-56 h-56 agro-gradient rounded-full flex flex-col items-center justify-center shadow-2xl ring-[20px] ring-white/5 group hover:scale-105 transition-transform duration-500">
                 <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] mb-1">GLOBAL RANK</p>
                 <h4 className="text-7xl font-black text-white tracking-tighter">#842</h4>
              </div>
              <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mt-2">Performance <span className="text-emerald-400">Registry</span></h2>
                 <p className="text-slate-400 text-2xl leading-relaxed italic font-medium">"Your node is currently operating at <span className="text-emerald-400 font-black">92% efficiency</span> compared to the regional benchmark."</p>
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

export default Community;