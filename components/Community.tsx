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
  RefreshCw,
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
  Scan,
  Dna as DNAIcon,
  User as UserIcon,
  Share2,
  MoreVertical,
  ThumbsUp,
  MessageSquareShare,
  Monitor,
  Radio,
  Cast,
  LogOut,
  CircleDot,
  FileUp,
  Podcast,
  PencilRuler,
  Hash,
  Crown,
  Eye,
  Settings,
  Binary,
  Bookmark,
  ArrowLeftCircle,
  ArrowLeft,
  Database,
  Map as MapIcon
} from 'lucide-react';
import { User, ViewState } from '../types';
import { generateAgroExam, getGroundedAgroResources, AIResponse, GroundingChunk } from '../services/geminiService';

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

const LMS_MODULES = [
  { title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false },
  { title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true },
  { title: "SID Pathogen Identification", category: "Societal", eac: 100, col: "text-rose-400", special: false },
  { title: "Total Quality Management (TQM)", category: "Industrial", eac: 200, col: "text-indigo-400", special: true },
];

const INITIAL_SOCIAL_SHARDS = [
  { 
    id: 'SHD-882', 
    name: 'Bantu Soil Guardians', 
    admin: 'EA-ADMIN-X1', 
    memberCount: 142, 
    resonance: 94, 
    rules: 'Requires verified Tier 2 Steward status. Must demonstrate ancestral seed lineage vouching.',
    missions: [
      { id: 'MSN-01', title: 'Nitrogen Baseline Mapping', status: 'In Progress', milestones: [{label: 'Field Ingest', done: true}, {label: 'Spectral Analysis', done: true}, {label: 'Registry Commit', done: false}], progress: 65, likes: 242, earnings: 1200 },
      { id: 'MSN-02', title: 'Ancestral Seed Collection', status: 'Deploying', milestones: [{label: 'Identification', done: true}, {label: 'Handshake', done: false}, {label: 'Archive', done: false}], progress: 12, likes: 89, earnings: 450 }
    ],
    isPrivate: false
  },
  { 
    id: 'SHD-104', 
    name: 'Omaha Ingest Cluster', 
    admin: 'EA-STEWARD-B4', 
    memberCount: 84, 
    resonance: 88, 
    rules: 'Open to all Nebraska-Zone stewards. Active m-constant monitoring hardware required for link.',
    missions: [
      { id: 'MSN-03', title: 'Grain Silo Bio-Audit', status: 'Completed', milestones: [{label: 'Structural Scan', done: true}, {label: 'Yield Sharding', done: true}, {label: 'Profit Diffusion', done: true}], progress: 100, likes: 1100, earnings: 8500 }
    ],
    isPrivate: true
  }
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

const Community: React.FC<CommunityProps> = ({ user, onEarnEAC, onSpendEAC, onContribution }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'shards' | 'lms' | 'manual' | 'report'>('hub');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams'>('modules');
  
  // Shards/Channelling States
  const [shards, setShards] = useState(INITIAL_SOCIAL_SHARDS);
  const [activeShard, setActiveShard] = useState<any | null>(null);
  const [joinedShards, setJoinedShards] = useState<string[]>(['SHD-104']); // Mock user joined Omaha
  const [labTab, setLabTab] = useState<'feed' | 'missions' | 'streaming' | 'discuss'>('feed');
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinGate, setShowJoinGate] = useState<any | null>(null);

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
  // Learning States
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  // Exam States
  const [examStep, setExamStep] = useState<'intro' | 'payment' | 'generation' | 'active' | 'grading' | 'results'>('intro');
  const [examTopic, setExamTopic] = useState('EnvirosAgro Ecosystem');
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingExam, setIsProcessingExam] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);
  const [studyResources, setStudyResources] = useState<AIResponse | null>(null);

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setExamStep('grading');
      setIsProcessingExam(true);
      
      const score = examQuestions.reduce((acc, q, idx) => {
        return acc + (q.correct === newAnswers[idx] ? 1 : 0);
      }, 0);
      
      const percentage = (score / examQuestions.length) * 100;
      const passed = percentage >= 80;
      
      setTimeout(async () => {
        setExamResult({ score, percentage, passed });
        setIsProcessingExam(false);
        setExamStep('results');
        
        if (passed) {
          onEarnEAC(EXAM_REWARD_BOUNTY, 'AGBOARD_EXAMINATION_SUCCESS');
        } else {
          // Fetch grounded resources for failing stewards using requested 2.5 Maps-aware logic
          try {
            const resources = await getGroundedAgroResources(`Scientific resources and learning materials for ${examTopic} and sustainable industrial agriculture`);
            setStudyResources(resources);
          } catch (e) {
            console.error("Study resource ingest failed");
          }
        }
      }, 3000);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    setIsPosting(false);
    setTimeout(() => {
      onContribution('post', 'Sociological');
      setIsPosting(false);
      setPostContent('');
      alert("SUCCESS: Post committed to Heritage Forum. +5 EAC Earned.");
    }, 1500);
  };

  const handleJoinShard = (shardId: string) => {
    setIsJoining(true);
    setTimeout(() => {
      setJoinedShards([...joinedShards, shardId]);
      setIsJoining(false);
      setShowJoinGate(null);
      const shard = shards.find(s => s.id === shardId);
      if (shard) setActiveShard(shard);
    }, 2000);
  };

  const handleVouchMission = (shardId: string, missionId: string) => {
    setShards(prev => prev.map(s => {
      if (s.id === shardId) {
        return {
          ...s,
          resonance: Math.min(100, s.resonance + 1),
          missions: s.missions.map(m => m.id === missionId ? { ...m, likes: m.likes + 1, earnings: m.earnings + 2 } : m)
        };
      }
      return s;
    }));
    onEarnEAC(0.5, 'MISSION_REACTION_MINING');
  };

  const handleAuthorizeExam = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    if (onSpendEAC(EXAM_FEE, "INDUSTRIAL_EXAMINATION_INGEST")) {
      setExamStep('generation');
      setIsProcessingExam(true);
      try {
        const questions = await generateAgroExam(examTopic);
        setExamQuestions(questions);
        setExamStep('active');
        setCurrentQuestion(0);
        setAnswers([]);
      } catch (e) {
        alert("ORACLE ERROR: Exam shard synthesis failed. EAC refunded.");
        onEarnEAC(EXAM_FEE, "EXAM_SYNTHESIS_REFUND");
        setExamStep('intro');
      } finally {
        setIsProcessingExam(false);
      }
    } else {
      alert("LIQUIDITY ERROR: Insufficient EAC for exam registration.");
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'hub', name: 'FORUM HUB', icon: Globe },
          { id: 'shards', name: 'SOCIAL SHARDS', icon: Users2 },
          { id: 'lms', name: 'LEARNING HUB', icon: Library },
          { id: 'manual', name: 'SEHTI MANUAL', icon: BookOpen },
          { id: 'report', name: 'PERFORMANCE', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => { setActiveTab(t.id as any); setActiveShard(null); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {/* --- TAB: HUB (Forum) --- */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-2 space-y-8">
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
                       style={{ minHeight: '160px' }}
                      />
                      <div className="flex justify-between items-center">
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-500/20 transition-all">
                           <Upload className="w-5 h-5" />
                         </button>
                         <button 
                           type="submit"
                           disabled={isPosting || !postContent.trim()}
                           className="px-12 py-3.5 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 flex items-center gap-3 hover:scale-105 transition-all"
                         >
                           {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                           BROADCAST TO HUB
                         </button>
                      </div>
                   </form>
                </div>
                <div className="space-y-6">
                   {[
                     { author: "@BANTU_STEWARD", title: "Passing the Seed: Lineage-based Crop Rotation", likes: 142, replies: 24, time: "2H AGO" },
                     { author: "@SOILSAGE", title: "Treating Root Rot in Zone 4", likes: 89, replies: 12, time: "5H AGO" },
                   ].map((post, i) => (
                     <div key={i} className="glass-card p-8 rounded-[32px] hover:bg-white/[0.04] border border-white/5 group">
                        <div className="flex gap-5 mb-6">
                           <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-emerald-500 text-xl shadow-xl">{post.author[1]}</div>
                           <div>
                              <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight">{post.title}</h4>
                              <p className="text-[10px] text-slate-500 font-black uppercase mt-2">{post.author} • {post.time}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                           <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-emerald-400 cursor-pointer font-bold"><Heart className="w-4 h-4" /> {post.likes}</div>
                           <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-blue-400 cursor-pointer font-bold"><MessageSquare className="w-4 h-4" /> {post.replies}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <div className="lg:col-span-1">
                <div className="glass-card p-10 rounded-[48px] border-indigo-500/20 bg-indigo-500/5 space-y-8 flex flex-col items-center text-center">
                   <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center shadow-3xl text-white"><Users size={40} /></div>
                   <h4 className="text-xl font-black text-white uppercase italic">Active Shards</h4>
                   <div className="w-full space-y-4">
                      {shards.map(s => (
                         <div key={s.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:border-indigo-400" onClick={() => { setActiveShard(s); setActiveTab('shards'); }}>
                            <span className="text-xs font-black text-slate-400 uppercase group-hover:text-white transition-colors">{s.name}</span>
                            <span className="text-[10px] font-mono text-indigo-400">{s.memberCount} members</span>
                         </div>
                      ))}
                   </div>
                   <button onClick={() => setActiveTab('shards')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Explore All Shards</button>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: SOCIAL SHARDS (Channelling Lab) --- */}
        {activeTab === 'shards' && (
          <div className="animate-in fade-in duration-700">
             {!activeShard ? (
                <div className="space-y-12 px-4 md:px-0">
                   <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-10 gap-8">
                      <div>
                         <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Social <span className="text-indigo-400">Shard Channelling</span></h3>
                         <p className="text-slate-500 text-lg font-medium italic mt-2">Access decentralized community nodes for high-fidelity engagement and mission sharding.</p>
                      </div>
                      <button className="px-10 py-5 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                         <PlusCircle size={20} /> Deploy Registered Shard
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {shards.map(shard => (
                         <div key={shard.id} className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col h-full bg-black/40 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Share2 size={200} /></div>
                            <div className="flex justify-between items-start mb-8 relative z-10">
                               <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-xl group-hover:rotate-6 transition-all shadow-xl"><Users2 size={28} /></div>
                               <div className="text-right">
                                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-slate-500 tracking-widest">{shard.memberCount} Members</span>
                                  <p className="text-[10px] text-slate-700 font-mono mt-3 uppercase font-black">{shard.id}</p>
                               </div>
                            </div>
                            <h4 className="text-3xl font-black text-white uppercase italic m-0 leading-tight group-hover:text-indigo-400 transition-colors">{shard.name}</h4>
                            <div className="mt-8 p-6 bg-black/60 rounded-3xl border border-white/5 shadow-inner">
                               <p className="text-[9px] text-slate-600 font-black uppercase mb-2">Joining Rules (Admin Mandate)</p>
                               <p className="text-xs text-slate-400 italic leading-relaxed">"{shard.rules}"</p>
                            </div>
                            <div className="mt-auto pt-10 flex items-center justify-between relative z-10">
                               <div className="flex items-center gap-2">
                                  <Activity className="w-4 h-4 text-emerald-400" />
                                  <span className="text-[11px] font-mono font-black text-white">{shard.resonance}% RESONANCE</span>
                               </div>
                               {joinedShards.includes(shard.id) ? (
                                 <button 
                                  onClick={() => setActiveShard(shard)}
                                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase text-white shadow-xl transition-all"
                                 >
                                    Enter Lab
                                 </button>
                               ) : (
                                 <button 
                                  onClick={() => setShowJoinGate(shard)}
                                  className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase text-slate-400 transition-all"
                                 >
                                    Authorize Join
                                 </button>
                               )}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             ) : (
                <div className="space-y-10 animate-in zoom-in duration-500 px-1 md:px-4">
                   <div className="p-10 md:p-14 glass-card rounded-[56px] border border-white/5 bg-black/40 flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-20"></div>
                      <div className="flex items-center gap-8 relative z-10">
                         <button onClick={() => setActiveShard(null)} className="p-5 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all shadow-xl"><ArrowLeft size={24} /></button>
                         <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl border-2 border-white/10 relative overflow-hidden">
                            <Users2 size={44} />
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                         </div>
                         <div>
                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">{activeShard.name.split(' ')[0]} <span className="text-white">{activeShard.name.split(' ').slice(1).join(' ').toUpperCase()}</span> <span className="text-blue-400">LAB</span></h2>
                            <p className="text-[10px] text-blue-400/60 font-mono tracking-widest uppercase mt-4">CHANNEL_NODE: {activeShard.id} // ADMIN: {activeShard.admin}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                         <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-[32px] text-center min-w-[200px] shadow-inner">
                            <p className="text-[10px] text-emerald-400 font-black uppercase mb-1 tracking-widest leading-none">SHARD RANK</p>
                            <p className="text-lg font-black text-white italic uppercase tracking-tighter">STEWARD_LEVEL</p>
                         </div>
                         <button className="p-7 bg-white/5 border border-white/10 rounded-[32px] text-slate-500 hover:text-rose-500 transition-all shadow-xl active:scale-90"><LogOut size={28} /></button>
                      </div>
                   </div>

                   <div className="flex overflow-x-auto scrollbar-hide border-b border-white/5 px-2 md:px-8 gap-2">
                      {[
                        { id: 'feed', label: 'ENGAGEMENT FEED', icon: Radio },
                        { id: 'missions', label: 'MISSION LEDGER', icon: Target },
                        { id: 'streaming', label: 'LIVE LAB STREAM', icon: Cast },
                      ].map(tab => (
                        <button 
                          key={tab.id}
                          onClick={() => setLabTab(tab.id as any)}
                          className={`py-8 px-12 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative flex-1 min-w-[220px] ${labTab === tab.id ? 'bg-white/[0.03] text-white' : 'text-slate-500 hover:text-white hover:bg-white/[0.01]'}`}
                        >
                           <div className="flex items-center justify-center gap-3">
                              <tab.icon size={16} className={labTab === tab.id ? 'text-blue-400' : 'text-slate-700'} /> {tab.label}
                           </div>
                           {labTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600 animate-in slide-in-from-left duration-300"></div>}
                        </button>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      <div className="lg:col-span-8 space-y-10">
                         {labTab === 'feed' && (
                            <div className="space-y-10 animate-in slide-in-from-bottom-4">
                               <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/20 shadow-inner">
                                  <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 px-4">NEW KNOWLEDGE INGEST</h4>
                                  <textarea placeholder="LOG TECHNICAL FINDINGS OR SOIL OBSERVATIONS..." className="w-full bg-black/40 border border-white/10 rounded-[32px] p-10 text-white italic outline-none focus:ring-4 focus:ring-blue-500/10 min-h-[220px] text-lg font-medium shadow-inner placeholder:text-slate-900" />
                                  <div className="flex justify-between items-center mt-10 px-4">
                                     <div className="flex gap-4">
                                        <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all border border-white/5 shadow-xl"><FileUp size={24} /></button>
                                        <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all border border-white/5 shadow-xl"><Radio size={24} /></button>
                                     </div>
                                     <button className="px-16 py-6 bg-blue-600 hover:bg-blue-500 rounded-[32px] text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all">BROADCAST SHARD</button>
                                  </div>
                               </div>

                               {[1, 2].map(i => (
                                  <div key={i} className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/60 hover:border-blue-500/20 transition-all group shadow-3xl relative overflow-hidden">
                                     <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className="flex items-center gap-6">
                                           <div className="w-16 h-16 rounded-[24px] bg-slate-800 flex items-center justify-center font-black text-2xl text-blue-400 border border-white/10 shadow-2xl group-hover:rotate-6 transition-all">S</div>
                                           <div>
                                              <h5 className="text-3xl font-black text-white uppercase italic leading-none group-hover:text-blue-400 transition-colors tracking-tighter">SPECTRAL SOIL DEPTH SHARDING REPORT</h5>
                                              <p className="text-[10px] text-slate-600 font-black uppercase mt-4 tracking-[0.3em]">LOGGED BY @STEWARD_{i*14} // {i}H AGO</p>
                                           </div>
                                        </div>
                                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl"><MoreVertical size={20} /></button>
                                     </div>
                                     <p className="text-slate-400 text-xl leading-[1.8] italic border-l-4 border-blue-500/20 pl-12 mb-12 relative z-10 font-medium">
                                        "Telemetry from our last moisture ingest cycle indicates a {10+i}% increase in absorption resonance. This shard suggests we should adjust the 432Hz repair sweep."
                                     </p>
                                     <div className="flex items-center gap-12 pt-10 border-t border-white/5 relative z-10">
                                        <button className="flex items-center gap-3 text-[11px] font-black text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest"><ThumbsUp size={22} className="opacity-40" /> {40+i}</button>
                                        <button className="flex items-center gap-3 text-[11px] font-black text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-widest"><MessageCircle size={22} className="opacity-40" /> {8+i}</button>
                                        <button className="flex items-center gap-3 text-[11px] font-black text-slate-500 hover:text-emerald-400 transition-colors ml-auto uppercase tracking-[0.2em] italic"><Share2 size={20} /> Anchor Shard</button>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}

                         {labTab === 'missions' && (
                            <div className="space-y-12 animate-in slide-in-from-right-4">
                               {activeShard.missions.map((msn: any) => (
                                  <div key={msn.id} className="p-12 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 shadow-3xl flex flex-col md:flex-row gap-12 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform"><Target size={300} className="text-white" /></div>
                                     <div className="flex-1 space-y-10 relative z-10">
                                        <div className="space-y-4">
                                           <div className="flex items-center gap-4">
                                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${
                                                 msn.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                                              }`}>{msn.status}</span>
                                              <p className="text-[10px] text-slate-600 font-mono font-black uppercase">GOAL_ID: {msn.id}</p>
                                           </div>
                                           <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none group-hover:text-indigo-400 transition-colors">{msn.title}</h4>
                                        </div>
                                        <div className="space-y-4">
                                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                                              <History size={14} className="text-indigo-400" /> Shard Milestones
                                           </p>
                                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                              {msn.milestones.map((m: any, i: number) => (
                                                 <div key={i} className={`p-5 rounded-[32px] border flex items-center gap-4 shadow-inner group/m transition-all ${m.done ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/60 border-white/5'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.done ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-800'}`}>
                                                       {m.done ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase transition-colors ${m.done ? 'text-white' : 'text-slate-500 group-hover/m:text-slate-300'}`}>{m.label}</span>
                                                 </div>
                                              ))}
                                           </div>
                                        </div>
                                        <div className="space-y-3 pt-6">
                                           <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600">
                                              <span>Industrial Fulfillment</span>
                                              <span className="text-white font-mono">{msn.progress}%</span>
                                           </div>
                                           <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.8)] transition-all duration-[2s]" style={{ width: `${msn.progress}%` }}></div>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-8 pt-6 border-t border-white/5 mt-10">
                                           <button onClick={() => handleVouchMission(activeShard.id, msn.id)} className="flex items-center gap-3 text-[11px] font-black text-slate-500 hover:text-amber-500 transition-all group/react"><Zap size={20} className="group-hover/react:fill-current" /> {msn.likes} VOUCH MINING</button>
                                           <div className="flex items-center gap-3 text-[11px] font-black text-slate-500"><Coins size={20} className="text-emerald-500" /><span>{msn.earnings.toLocaleString()} EAC ACCRUED</span></div>
                                           <button className="p-4 bg-white/5 rounded-2xl ml-auto text-slate-700 hover:text-white transition-all"><Share2 size={20} /></button>
                                        </div>
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}

                         {labTab === 'streaming' && (
                            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-500">
                               <div className="w-80 h-80 rounded-full border-4 border-dashed border-blue-500/20 flex flex-col items-center justify-center relative group">
                                  <Monitor size={100} className="text-slate-800 group-hover:text-blue-400 transition-all duration-1000" />
                                  <div className="absolute inset-[-30px] rounded-full border-2 border-blue-500/30 animate-ping opacity-30"></div>
                                  <div className="absolute inset-0 bg-blue-600/5 animate-pulse rounded-full"></div>
                               </div>
                               <div className="space-y-6">
                                  <h4 className="text-5xl font-black text-white uppercase italic m-0">LIVE LAB <span className="text-blue-400">STREAM</span></h4>
                                  <p className="text-slate-400 text-xl font-medium italic max-w-sm mx-auto leading-relaxed">"Broadcast real-time industrial sharding, field walkthroughs, or knowledge labs to your shard cluster."</p>
                               </div>
                               <button className="px-20 py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(225,29,72,0.3)] active:scale-95 transition-all flex items-center gap-6 ring-8 ring-rose-600/5">
                                  <Cast size={28} className="animate-pulse" /> START DIRECT BROADCAST
                               </button>
                            </div>
                         )}
                      </div>

                      <div className="lg:col-span-4 space-y-10">
                         <div className="glass-card p-14 rounded-[56px] border border-blue-500/20 bg-blue-950/10 space-y-12 shadow-3xl relative overflow-hidden group/audit">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover/audit:scale-110 transition-transform duration-[15s] pointer-events-none"><Scale size={400} className="text-white" /></div>
                            <div className="flex items-center gap-4 relative z-10">
                               <div className="p-4 bg-blue-600 rounded-[24px] shadow-3xl border border-white/10 group-hover:scale-110 transition-transform"><BadgeCheck size={32} className="text-white" /></div>
                               <h4 className="text-2xl font-black text-white uppercase tracking-widest italic m-0">SHARD <span className="text-blue-400">RESONANCE</span></h4>
                            </div>
                            <div className="space-y-10 relative z-10 text-center">
                               <div className="space-y-2">
                                  <p className="text-[11px] text-slate-500 font-black uppercase mb-6 tracking-[0.5em]">CURRENT APY MULTIPLIER</p>
                                  <p className="text-[110px] md:text-[130px] font-mono font-black text-emerald-400 tracking-tighter leading-none">1.88<span className="text-3xl text-emerald-600 font-sans italic ml-1">x</span></p>
                               </div>
                               <div className="flex flex-col items-center gap-6">
                                  <div className="flex items-center justify-center gap-4 text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] italic bg-emerald-500/10 px-8 py-3 rounded-full border border-emerald-500/20 shadow-inner">
                                     <Activity size={18} className="animate-pulse" /> CONSENSUS MINING ENABLED
                                  </div>
                                  <p className="text-xs text-slate-500 italic leading-relaxed max-w-[280px] mx-auto opacity-70">"The collective engagement index (likes, posts, streams) directly fuels the shard's economic multiplier."</p>
                               </div>
                            </div>
                         </div>

                         <div className="p-12 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                            <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-3 px-4 border-b border-white/5 pb-4">
                               <Users size={16} className="text-blue-400" /> NODE CONTRIBUTORS
                            </h5>
                            <div className="space-y-6">
                               {[
                                 {n: 'Alpha Stwd', r: 98, e: '+1.4K'},
                                 {n: 'Eco Maven', r: 94, e: '+842'},
                                 {n: 'Root Master', r: 88, e: '+420'}
                               ].map((c, i) => (
                                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] p-2 rounded-2xl transition-all">
                                     <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-[18px] bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xl text-blue-400 shadow-xl group-hover:scale-110 transition-transform">{c.n[0]}</div>
                                        <div className="text-left">
                                           <p className="text-sm font-black text-white uppercase tracking-tight italic">{c.n}</p>
                                           <p className="text-[8px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1">RES_PULSE: {c.r}%</p>
                                        </div>
                                     </div>
                                     <span className="text-[11px] font-mono font-black text-emerald-400">{c.e} EAC</span>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {/* --- JOIN SHARD MODAL (Admin Rules Gate) --- */}
        {showJoinGate && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={() => setShowJoinGate(null)}></div>
             <div className="relative z-[710] w-full max-w-xl glass-card p-12 rounded-[56px] border border-white/10 bg-[#050706] shadow-3xl text-center space-y-10 border-2 border-indigo-500/30">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl animate-float">
                   <Lock size={40} className="text-indigo-400" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Shard <span className="text-indigo-400">Join Request</span></h3>
                   <p className="text-slate-500 text-sm leading-relaxed">To link with <b>{showJoinGate.name}</b>, your node must adhere to the following Admin-formed rules:</p>
                </div>
                <div className="p-10 bg-black/60 rounded-[40px] border border-indigo-500/20 shadow-inner text-left">
                   <p className="text-slate-300 text-base italic leading-relaxed">"{showJoinGate.rules}"</p>
                   <div className="mt-8 flex items-center gap-4 text-emerald-400 font-black text-[10px] uppercase">
                      <ShieldCheck size={16} /> Registry validation active
                   </div>
                </div>
                <div className="space-y-4 pt-4">
                   <button 
                    onClick={() => handleJoinShard(showJoinGate.id)} 
                    disabled={isJoining} 
                    className="w-full py-8 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                   >
                      {isJoining ? <Loader2 className="animate-spin" /> : <Handshake size={20} />}
                      {isJoining ? 'SYNCHRONIZING...' : 'ACKNOWLEDGE & JOIN'}
                   </button>
                   <button onClick={() => setShowJoinGate(null)} className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Abort Signal</button>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: LEARNING HUB --- */}
        {activeTab === 'lms' && (
           <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto border border-white/5 bg-black/40 mb-8 shadow-xl">
                 {[
                   { id: 'modules', name: 'Curriculum Shards', icon: LayoutGrid },
                   { id: 'exams', name: 'AgBoard Examination', icon: FileSignature },
                 ].map(sub => (
                   <button 
                     key={sub.id}
                     onClick={() => setLmsSubTab(sub.id as any)}
                     className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${lmsSubTab === sub.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
                   >
                     <sub.icon size={14} /> {sub.name}
                   </button>
                 ))}
              </div>

              {lmsSubTab === 'modules' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4 md:px-0">
                    {LMS_MODULES.map((m, i) => (
                      <div key={i} className={`glass-card p-10 rounded-[48px] border-2 border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full active:scale-95 duration-300 bg-black/20 shadow-2xl relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-110 transition-transform">
                           <Database className="w-16 h-16 text-white" />
                        </div>
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <span className={`px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.3em] ${m.col}`}>{m.category}</span>
                            <div className="text-right">
                              <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">+{m.eac} EAC</p>
                            </div>
                        </div>
                        <h4 className="text-2xl font-black text-white mb-10 leading-tight flex-1 tracking-tighter uppercase italic group-hover:text-indigo-400 transition-colors">{m.title}</h4>
                        <button 
                          onClick={() => { setSelectedModule(m); setExamTopic(m.title); setLmsSubTab('exams'); setExamStep('intro'); }} 
                          className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 relative z-10 shadow-lg"
                        >
                            <PlayCircle className="w-5 h-5" /> INITIALIZE EXAM
                        </button>
                      </div>
                    ))}
                </div>
              )}

              {lmsSubTab === 'exams' && (
                <div className="max-w-4xl mx-auto animate-in zoom-in duration-500 px-4">
                  {examStep === 'intro' && (
                    <div className="glass-card p-16 md:p-20 rounded-[80px] border-2 border-white/10 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 via-transparent to-indigo-600/5 opacity-50"></div>
                       <div className="w-36 h-36 bg-indigo-600 rounded-[48px] flex items-center justify-center mx-auto shadow-3xl animate-float border-2 border-white/20 relative z-10">
                          <FileSignature size={80} className="text-white" />
                       </div>
                       <div className="space-y-6 relative z-10">
                          <h3 className="text-6xl md:text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">AGBOARD <span className="text-indigo-400">EXAMINATION</span></h3>
                          <p className="text-slate-400 text-2xl font-medium italic leading-relaxed max-w-2xl mx-auto">"Proctored certification on <b>{examTopic}</b>. Maintain registry standing through high-fidelity knowledge validation."</p>
                       </div>
                       <div className="grid grid-cols-2 gap-8 p-10 bg-black/80 rounded-[48px] border border-white/10 shadow-inner relative z-10">
                          <div className="text-center space-y-2"><p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Ingest Fee</p><p className="text-5xl font-mono font-black text-rose-500">{EXAM_FEE} <span className="text-sm">EAC</span></p></div>
                          <div className="text-center space-y-2"><p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Staking Reward</p><p className="text-5xl font-mono font-black text-emerald-400">{EXAM_REWARD_BOUNTY} <span className="text-sm">EAC</span></p></div>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => setLmsSubTab('modules')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest">Select Different Shard</button>
                          <button onClick={() => setExamStep('payment')} className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl active:scale-95 transition-all relative z-10 ring-8 ring-white/5">INITIALIZE AUTH</button>
                       </div>
                    </div>
                  )}

                  {examStep === 'payment' && (
                    <div className="glass-card p-16 md:p-20 rounded-[80px] border-2 border-indigo-500/30 bg-black/60 shadow-3xl text-center space-y-12 animate-in slide-in-from-right-10">
                       <div className="flex flex-col items-center gap-8">
                          <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                             <Fingerprint className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                             <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[32px] animate-ping opacity-30"></div>
                          </div>
                          <h4 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Registry <span className="text-indigo-400">Authorization</span></h4>
                       </div>
                       <div className="space-y-6">
                          <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.6em] block text-center">Node Signature (ESIN)</label>
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-black border border-white/10 rounded-[40px] py-10 text-center text-4xl font-mono text-white tracking-[0.2em] focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                          />
                       </div>
                       <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[44px] flex items-center gap-8 shadow-inner">
                          <ShieldAlert className="w-12 h-12 text-indigo-400 shrink-0" />
                          <p className="text-[11px] text-indigo-200/50 font-black uppercase leading-relaxed tracking-tight text-left italic leading-loose">
                             "Examination ingest confirms your willingness to shard professional knowledge. AI proctoring will be active."
                          </p>
                       </div>
                       <div className="flex gap-6">
                          <button onClick={() => setExamStep('intro')} className="flex-1 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all">Back</button>
                          <button 
                             onClick={handleAuthorizeExam}
                             disabled={isProcessingExam || !esinSign}
                             className="flex-[2] py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
                          >
                             {isProcessingExam ? <Loader2 className="w-8 h-8 animate-spin" /> : <Stamp className="w-8 h-8 fill-current" />}
                             {isProcessingExam ? 'ANCHORING...' : 'AUTHORIZE SETTLEMENT'}
                          </button>
                       </div>
                    </div>
                  )}

                  {examStep === 'generation' && (
                    <div className="glass-card p-24 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 flex flex-col items-center justify-center min-h-[600px] animate-in zoom-in">
                       <div className="relative">
                          <Loader2 className="w-32 h-32 text-indigo-500 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Sparkles className="w-12 h-12 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">MINTING EXAM SHARD...</p>
                          <p className="text-slate-600 font-mono text-[11px] uppercase tracking-widest">Consulting Knowledge Oracle for {examTopic}</p>
                       </div>
                    </div>
                  )}

                  {examStep === 'active' && (
                    <div className="glass-card p-12 md:p-16 rounded-[80px] border-2 border-white/10 bg-black/60 shadow-3xl space-y-12 animate-in slide-in-from-bottom-10 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 overflow-hidden">
                          <div className="h-full bg-emerald-500 animate-scan"></div>
                       </div>
                       <div className="flex justify-between items-center px-4 pt-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse border border-blue-500/40">
                                <Scan size={20} />
                             </div>
                             <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">AI_PROCTORING_ACTIVE</span>
                          </div>
                          <span className="px-4 py-1.5 bg-white/5 text-white text-[10px] font-mono font-black border border-white/10 rounded-full">
                             SHARD {currentQuestion + 1} / {examQuestions.length}
                          </span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-700 shadow-[0_0_15px_#3b82f6]" style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}></div>
                       </div>
                       <div className="space-y-10 py-6">
                          <div className="p-10 bg-black/80 rounded-[48px] border border-white/10 shadow-inner relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Database size={200} /></div>
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-6 block px-4 border-l-2 border-indigo-500/50">{examQuestions[currentQuestion].category} MODULE</span>
                             <h4 className="text-3xl font-black text-white leading-relaxed italic px-4 relative z-10">"{examQuestions[currentQuestion].q}"</h4>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                             {examQuestions[currentQuestion].options.map((opt: string, i: number) => (
                                <button 
                                   key={i} 
                                   onClick={() => handleAnswerSelect(i)}
                                   className="w-full p-8 rounded-[32px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 hover:bg-indigo-600/5 text-left transition-all group flex items-center gap-6"
                                >
                                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-mono font-black text-slate-500 group-hover:text-indigo-400 transition-all border border-white/5 group-hover:rotate-6">0{i+1}</div>
                                   <span className="text-xl font-bold text-slate-400 group-hover:text-white transition-colors">{opt}</span>
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {examStep === 'grading' && (
                    <div className="glass-card p-24 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12 flex flex-col items-center justify-center min-h-[600px] animate-in zoom-in">
                       <div className="relative">
                          <div className="absolute inset-[-20px] border-t-8 border-emerald-500 rounded-full animate-spin"></div>
                          <div className="w-48 h-48 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-2xl relative overflow-hidden">
                             <Binary className="w-20 h-20 text-indigo-400 animate-pulse" />
                             <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic">GRADING SHARD...</p>
                          <p className="text-slate-600 font-mono text-[11px] uppercase tracking-widest">Cross-referencing global consensus models</p>
                       </div>
                    </div>
                  )}

                  {examStep === 'results' && examResult && (
                    <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 bg-black/60 shadow-3xl text-center space-y-16 animate-in zoom-in duration-700 relative overflow-hidden">
                       <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${examResult.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                       
                       <div className="relative z-10 space-y-12">
                          <div className={`w-64 h-64 rounded-[48px] flex items-center justify-center mx-auto shadow-3xl relative group ${examResult.passed ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400'} border-4`}>
                             {examResult.passed ? <Trophy size={96} className="text-white group-hover:scale-110 transition-transform" /> : <ShieldAlert size={96} className="text-white" />}
                             <div className="absolute inset-[-15px] border-4 border-current opacity-20 rounded-[56px] animate-ping"></div>
                          </div>

                          <div className="space-y-4">
                             <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                                {examResult.passed ? 'CERTIFIED' : 'RETRY_REQUIRED'}
                             </h3>
                             <p className={`text-xl font-black uppercase tracking-[0.4em] ${examResult.passed ? 'text-emerald-400' : 'text-rose-500'}`}>
                                REGISTRY_SCORE: {examResult.percentage}%
                             </p>
                          </div>

                          <div className="p-12 bg-black/80 rounded-[64px] border border-white/5 grid grid-cols-2 gap-12 shadow-inner">
                             <div className="text-center space-y-2 border-r border-white/10 pr-12">
                                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Correct Shards</p>
                                <p className="text-5xl font-mono font-black text-white">{examResult.score}/{examQuestions.length}</p>
                             </div>
                             <div className="text-center space-y-2 pl-12">
                                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Shard Bounty</p>
                                <p className={`text-5xl font-mono font-black ${examResult.passed ? 'text-emerald-400' : 'text-slate-700'}`}>
                                   {examResult.passed ? `+${EXAM_REWARD_BOUNTY}` : '0'} <span className="text-xs italic">EAC</span>
                                </p>
                             </div>
                          </div>

                          {!examResult.passed && studyResources && (
                            <div className="p-10 bg-indigo-600/5 border border-indigo-500/20 rounded-[48px] text-left space-y-8 animate-in slide-in-from-bottom-4 shadow-2xl">
                               <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                  <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl"><Search size={20} /></div>
                                  <h4 className="text-xl font-black text-white uppercase italic">Study Remediation Shards</h4>
                               </div>
                               <p className="text-slate-400 italic text-sm leading-relaxed border-l-4 border-indigo-500/40 pl-6">
                                  "Steward missed critical <b>{examTopic}</b> benchmarks. Access grounded search shards to remediate knowledge gaps before next sync."
                               </p>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {studyResources.sources?.map((source, idx) => (
                                    <a 
                                      key={idx} 
                                      href={source.web?.uri || source.maps?.uri} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="p-5 glass-card rounded-2xl border border-white/10 flex items-center justify-between group hover:border-blue-400 transition-all"
                                    >
                                       <div className="flex items-center gap-4">
                                          {source.maps ? <MapIcon size={16} className="text-emerald-400" /> : <Globe size={16} className="text-blue-400" />}
                                          <span className="text-[10px] font-black text-slate-300 uppercase truncate max-w-[150px]">{source.web?.title || source.maps?.title || "Registry Resource"}</span>
                                       </div>
                                       <ArrowUpRight size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                                    </a>
                                  ))}
                               </div>
                            </div>
                          )}
                       </div>

                       <div className="relative z-10 flex flex-col md:flex-row gap-6 justify-center pt-10">
                          <button 
                             onClick={() => setExamStep('intro')}
                             className="px-16 py-8 bg-white/5 border border-white/10 rounded-[40px] text-slate-400 font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-all shadow-xl"
                          >
                             Return to Intro
                          </button>
                          {examResult.passed ? (
                             <button onClick={() => setActiveTab('hub')} className="px-20 py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] active:scale-95 transition-all">
                                Back to Hub
                             </button>
                          ) : (
                             <button onClick={() => setExamStep('payment')} className="px-20 py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(244,63,94,0.3)] active:scale-95 transition-all">
                                Retry Examination
                             </button>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              )}
           </div>
        )}
        
        {activeTab === 'manual' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500 px-4 md:px-0">
              <div className="lg:col-span-4 space-y-6">
                 <h3 className="text-2xl font-black text-white uppercase italic px-4 flex items-center gap-3">
                    <BookOpenIcon className="w-6 h-6 text-emerald-400" /> Manual Shards
                 </h3>
                 <div className="space-y-3">
                    {CHAPTERS.map(ch => (
                       <button key={ch.id} onClick={() => setSelectedChapter(ch)} className={`w-full p-6 rounded-[32px] border text-left transition-all flex justify-between items-center group ${selectedChapter.id === ch.id ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl shadow-emerald-900/40' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>
                          <div className="flex flex-col gap-1">
                             <span className="text-[8px] font-black text-slate-700 uppercase group-hover:text-slate-500">CHAPTER 0{ch.id}</span>
                             <span className="text-sm font-black uppercase tracking-tight italic leading-none">{ch.title}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform ${selectedChapter.id === ch.id ? 'rotate-90 text-emerald-400' : 'text-slate-700'}`} />
                       </button>
                    ))}
                 </div>
              </div>
              <div className="lg:col-span-8">
                 <div className="glass-card p-12 md:p-20 rounded-[64px] border border-white/10 bg-[#0B0F0D] shadow-3xl relative overflow-hidden h-full group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform duration-[10s]"><Binary size={500} className="text-emerald-400" /></div>
                    <div className="relative z-10 space-y-12">
                       <div className="space-y-4">
                          <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">CHAPTER_SYNC_OK</span>
                          <h4 className="text-4xl md:text-5xl font-black text-white uppercase italic m-0 leading-none">{selectedChapter.title}</h4>
                       </div>
                       <div className="prose prose-invert max-w-none text-slate-300 text-xl leading-relaxed whitespace-pre-line italic font-medium border-l-4 border-emerald-500/40 pl-10">
                          {selectedChapter.content}
                       </div>
                       <div className="pt-10 border-t border-white/5 flex gap-4">
                          <button className="px-10 py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-emerald-500 transition-all flex items-center gap-2 active:scale-95"><Bookmark size={14} /> Bookmark Shard</button>
                          <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2"><Download size={14} /> Export in PDF</button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'report' && (
           <div className="space-y-10 animate-in zoom-in duration-500 text-center flex flex-col items-center justify-center py-20 max-w-3xl mx-auto opacity-30">
              <BarChart4 size={120} className="text-slate-600 mb-8 animate-pulse" />
              <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em] italic leading-none">Reporting Terminal <span className="text-indigo-400">Offline</span></h3>
              <p className="text-slate-500 text-lg font-medium italic mt-6 leading-relaxed">"Performance analytics shards are finalized at the end of each harvest cycle. Current Cycle (12) is still in processing inflow."</p>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.85); }
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Community;