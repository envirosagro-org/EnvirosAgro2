
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PlayCircle, GraduationCap, Video, BookOpen, MessageSquare, Award, Clock, ChevronRight, FileText, Library, Coins,
  Users, Globe, Heart, PlusCircle, TrendingUp, ShieldCheck, Search, Users2, Briefcase, Lightbulb, CheckCircle2,
  X, Loader2, ArrowUpRight, Handshake, Zap, Upload, Sparkles, BarChart4, ExternalLink, MapPin, Fingerprint,
  Activity, History, Info, BadgeCheck, Dna, Lock, SearchCode, Target, Bot, Brain, ShieldAlert, HeartPulse,
  BrainCircuit, AlertTriangle, Waves, Atom, RefreshCw, Scale, FileSignature, FileCheck, ClipboardCheck,
  FileDown, Timer, LayoutGrid, Trophy, PenTool, ArrowRight, AlertCircle, Download, Terminal, FileDigit,
  Shield, Stamp, Scan, User as UserIcon, Share2, MoreVertical, ThumbsUp, MessageSquareShare, Monitor,
  Radio, Cast, LogOut, CircleDot, FileUp, Workflow, Podcast, PencilRuler, Hash, Crown, Star, Eye,
  Settings, Binary, Bookmark, ArrowLeftCircle, ArrowLeft, Database, Map as MapIcon, SmartphoneNfc,
  CreditCard, Globe2, WalletCards, Factory, Sprout, Network, Send, Key, Quote, Mic, Camera, PhoneCall,
  UserPlus, MessageCircle, Video as VideoIcon, LogOut as LeaveIcon, Gavel,
  ChevronDown,
  Wand2,
  ListTodo,
  FileSearch,
  Box,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { User, ViewState } from '../types';
import { generateAgroExam, getGroundedAgroResources, chatWithAgroExpert, AIResponse } from '../services/geminiService';

interface CommunityProps {
  user: User;
  isGuest: boolean;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

const CHAPTERS = [
  { id: 1, title: "The SEHTI Philosophy", icon: Heart, content: "Agriculture is not just land management; it is a complex system of human psychology, social structures, and scientific data. SEHTI integrates five core thrusts to achieve 100% sustainability." },
  { id: 2, title: "Industrial Optimization (I)", icon: Factory, content: "The 'I' pillar focuses on industrial optimization. By leveraging decentralized ledgers (ESIN), we create an immutable record of agricultural output, carbon capture, and resource efficiency." },
  { id: 3, title: "Agro Code C(a) Biometrics", icon: Binary, content: "The C(a) is the core biometric of your land. It is calculated based on cumulative sustainable practices. Maintaining high resonance requires regular spectral auditing." },
  { id: 4, title: "m-Constant Resilience Logic", icon: Activity, content: "The sustainable time constant (m) represents your node's ability to resist external volatility. Calculated as the square root of productivity over stress." },
];

const LMS_MODULES = [
  { id: 'mod-1', title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false, progress: 100, desc: "A comprehensive introduction to the SEHTI pillars and registry architecture." },
  { id: 'mod-2', title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true, progress: 45, desc: "Deep dive into the mathematical derivation of industrial stability and yield multipliers." },
  { id: 'mod-3', title: "SID Pathogen Identification", category: "Societal", eac: 100, col: "text-rose-400", special: false, progress: 0, desc: "Identify and mitigate ideological crowding and trust-decay in social shards." },
  { id: 'mod-4', title: "Total Quality Management (TQM)", category: "Industrial", eac: 200, col: "text-indigo-400", special: true, progress: 0, desc: "Tracking and tracing agricultural assets from inception to finality." },
];

const INITIAL_SOCIAL_SHARDS = [
  { 
    id: 'SHD-882', name: 'BANTU SOIL GUARDIANS', admin: 'EA-ADMIN-X1', memberCount: 142, resonance: 94, 
    rules: 'PROTOCOL: REQUIRES VERIFIED TIER 2 STATUS.', type: 'HERITAGE CLAN', 
    mission: 'Preserving drought-resistant lineage seeds through collective sharding.', trending: '+2.4%'
  },
  { 
    id: 'SHD-104', name: 'NEO-HYDROPONIC GUILD', admin: 'EA-TECH-G4', memberCount: 85, resonance: 88, 
    rules: 'PROTOCOL: OPEN FOR ALL CEA-CERTIFIED STEWARDS.', type: 'TECHNICAL GUILD', 
    mission: 'Optimizing nutrient delivery shards across urban vertical stacks.', trending: '+8.1%'
  },
];

const MOCK_STEWARDS = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', location: 'Nairobi, Kenya', mutuals: 12, res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', bio: 'Specialist in Bantu drought sharding.', online: true },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', location: 'Omaha, USA', mutuals: 4, res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', bio: 'Soil MRI engineer.', online: false },
];

const MOCK_FEED = [
  { id: 'P-1', author: 'Steward Alpha', esin: 'EA-ALPHA-88', text: 'Just completed a successful 432Hz sweep on Sector 4. m-Constant increased by 0.05x!', time: '2h ago', likes: 12, shares: 3 },
  { id: 'P-2', author: 'Gaia Green', esin: 'EA-GAIA-02', text: 'Discovered a rare Bantu Sun-Orchid cluster. Documenting for the archive.', time: '5h ago', likes: 45, shares: 12 },
  { id: 'P-3', author: 'Root Steward', esin: 'EA-CORE-01', text: 'Network quorum established for the Season of Awakening. Ensure all geofence shards are synced.', time: '8h ago', likes: 124, shares: 56 },
];

const MOCK_PERFORMANCE_HISTORY = [
  { cycle: 'C1', resonance: 82, vouchers: 12 }, { cycle: 'C2', resonance: 85, vouchers: 18 },
  { cycle: 'C3', resonance: 84, vouchers: 25 }, { cycle: 'C4', resonance: 89, vouchers: 42 },
  { cycle: 'C5', resonance: 92, vouchers: 38 }, { cycle: 'C6', resonance: 94, vouchers: 56 },
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

const Community: React.FC<CommunityProps> = ({ user, isGuest, onEarnEAC, onSpendEAC, onContribution, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'shards' | 'social' | 'lms' | 'manual' | 'report'>('social');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams' | 'forge'>('modules');
  
  const [shards] = useState(INITIAL_SOCIAL_SHARDS);
  const [joinedShards, setJoinedShards] = useState<string[]>(['SHD-882']); 

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  
  const [socialSearch, setSocialSearch] = useState('');
  const [selectedSteward, setSelectedSteward] = useState<any | null>(null);

  const [examStep, setExamStep] = useState<'intro' | 'payment' | 'generation' | 'active' | 'grading' | 'results'>('intro');
  const [examTopic] = useState('EnvirosAgro Ecosystem');
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [esinSign, setEsinSign] = useState('');
  const [isProcessingExam, setIsProcessingExam] = useState(false);
  const [examResult, setExamResult] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);
  const [studyResources, setStudyResources] = useState<AIResponse | null>(null);

  // LMS Forge States
  const [forgeInput, setForgeInput] = useState('');
  const [isForgingModule, setIsForgingModule] = useState(false);
  const [forgedModule, setForgedModule] = useState<string | null>(null);

  const handlePost = () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      onContribution('post', 'General');
      setPostContent('');
      setIsPosting(false);
      alert("SIGNAL BROADCASTED TO SOCIAL REGISTRY");
    }, 1500);
  };

  const handleJoinShard = (id: string) => {
    if (joinedShards.includes(id)) {
      setJoinedShards(joinedShards.filter(s => s !== id));
    } else {
      setJoinedShards([...joinedShards, id]);
      onEarnEAC(10, `JOINED_SHARD_${id}`);
    }
  };

  const handleForgeModule = async () => {
    if (!forgeInput.trim()) return;
    const fee = 40;
    if (!await onSpendEAC(fee, "KNOWLEDGE_MODULE_SYNTHESIS")) return;

    setIsForgingModule(true);
    setForgedModule(null);
    try {
      const prompt = `Act as an EnvirosAgro Senior Educator. Synthesize a comprehensive learning module for: "${forgeInput}".
      Requirements: 
      1. Map to SEHTI pillars. 
      2. Include 3 technical sub-modules. 
      3. Define m-constant stability implications.
      Use Markdown formatting.`;
      const res = await chatWithAgroExpert(prompt, []);
      setForgedModule(res.text);
      onEarnEAC(20, "KNOWLEDGE_SHARD_CONTRIBUTION");
    } catch (e) {
      setForgedModule("Oracle disconnected. Knowledge ingest failed.");
    } finally {
      setIsForgingModule(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setExamStep('grading');
      setIsProcessingExam(true);
      const score = examQuestions.reduce((acc, q, idx) => acc + (q.correct === newAnswers[idx] ? 1 : 0), 0);
      const percentage = (score / examQuestions.length) * 100;
      const passed = percentage >= 80;
      setTimeout(async () => {
        setExamResult({ score, percentage, passed });
        setIsProcessingExam(false);
        setExamStep('results');
        if (passed) onEarnEAC(EXAM_REWARD_BOUNTY, 'AGBOARD_EXAM_SUCCESS');
        else {
          try {
            const resources = await getGroundedAgroResources(`Learning materials for ${examTopic}`);
            setStudyResources(resources);
          } catch (e) {}
        }
      }, 3000);
    }
  };

  const handleAuthorizeExam = async () => {
    if (esinSign.toUpperCase() !== user.esin.toUpperCase()) {
      alert("SIGNATURE ERROR: Node ESIN mismatch.");
      return;
    }
    if (await onSpendEAC(EXAM_FEE, "EXAM_INGEST")) {
      setExamStep('generation');
      setIsProcessingExam(true);
      try {
        const questions = await generateAgroExam(examTopic);
        setExamQuestions(questions);
        setExamStep('active');
        setCurrentQuestion(0);
        setAnswers([]);
      } catch (e) {
        onEarnEAC(EXAM_FEE, "REFUND");
        setExamStep('intro');
      } finally {
        setIsProcessingExam(false);
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 animate-in fade-in duration-500 max-w-[1600px] mx-auto relative overflow-hidden">
      
      {/* Top Navigation */}
      <div className="flex flex-wrap justify-center gap-4 p-2 glass-card rounded-[40px] w-fit mx-auto lg:mx-4 border border-white/5 bg-black/40 shadow-2xl px-10 relative z-20">
        {[
          { id: 'hub', name: 'HERITAGE', icon: Globe },
          { id: 'shards', name: 'SHARDS', icon: Users2 },
          { id: 'social', name: 'SOCIAL', icon: HeartPulse },
          { id: 'lms', name: 'LEARNING', icon: Library },
          { id: 'manual', name: 'MANUAL', icon: BookOpen },
          { id: 'report', name: 'METRICS', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)} 
            className={`flex items-center gap-3 px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon size={16} /> {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[700px] relative z-10 px-4">
        
        {/* --- TAB: HERITAGE HUB --- */}
        {activeTab === 'hub' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-700 max-w-[1200px] mx-auto">
             <div className="text-center space-y-4">
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">Heritage <span className="text-emerald-400">Hub.</span></h2>
                <p className="text-slate-500 text-xl font-medium italic opacity-70">"Ancestral wisdom sharded for the planetary grid."</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {CHAPTERS.map(ch => (
                   <div key={ch.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 space-y-8 group hover:border-emerald-500/30 transition-all shadow-3xl relative overflow-hidden h-[480px] flex flex-col justify-between active:scale-[0.99]">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><ch.icon size={300} /></div>
                      <div className="space-y-8 relative z-10">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl border-2 border-emerald-500/20 group-hover:rotate-6 transition-all shadow-2xl flex items-center justify-center">
                               <ch.icon size={40} className="text-emerald-400" />
                            </div>
                            <h4 className="text-3xl font-black text-white uppercase italic tracking-tight m-0">{ch.title}</h4>
                         </div>
                         <p className="text-xl text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 font-medium border-l-4 border-emerald-500/20 pl-8">"{ch.content}"</p>
                      </div>
                      <button className="px-10 py-5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 border border-emerald-500/20 shadow-xl relative z-10 w-fit">
                         EXPLORE SHARD <ChevronRight size={16} />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- TAB: SOCIAL SHARDS --- */}
        {activeTab === 'shards' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700 max-w-[1400px] mx-auto">
              <div className="flex flex-col items-center text-center space-y-6">
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 drop-shadow-2xl">Social <span className="text-emerald-400">Registry.</span></h2>
                 <p className="text-slate-500 text-xl font-medium italic opacity-70 max-w-2xl mx-auto leading-relaxed">"Collective mission nodes for cultural and industrial synchronization across regional clusters."</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                 {shards.map(shard => (
                    <div key={shard.id} className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300 flex flex-col h-[650px] justify-between">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><Users2 size={500} /></div>
                       <div className="space-y-10 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="w-24 h-24 rounded-[40px] bg-emerald-600 shadow-3xl border-4 border-white/10 flex items-center justify-center text-white group-hover:rotate-6 transition-transform"><Users2 size={48} /></div>
                             <div className="text-right flex flex-col items-end gap-3">
                                <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-xl tracking-widest">{shard.type}</span>
                                <p className="text-[11px] text-slate-700 font-mono font-black italic tracking-widest uppercase">{shard.id}</p>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors truncate m-0 drop-shadow-2xl">{shard.name}</h4>
                             <p className="text-xl text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{shard.mission}"</p>
                          </div>
                          <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Resonance</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-emerald-400 transition-colors">{shard.resonance}%</p>
                             </div>
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Active Peers</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-blue-400 transition-colors">{shard.memberCount}</p>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => handleJoinShard(shard.id)} 
                         className={`w-full py-8 mt-12 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-5 border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95 ${joinedShards.includes(shard.id) ? 'bg-rose-950/40 text-rose-500 border-rose-500/30' : 'bg-emerald-600 text-white'}`}
                       >
                          {joinedShards.includes(shard.id) ? <LeaveIcon size={20} /> : <Handshake size={20} />}
                          {joinedShards.includes(shard.id) ? 'EXIT_SHARD_LEDGER' : 'JOIN_COLLECTIVE'}
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- TAB: SOCIAL FEED & PROFILES --- */}
        {activeTab === 'social' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-8">
                 {/* Create Post */}
                 <div className="glass-card p-8 rounded-[48px] border-white/5 bg-black/40 space-y-6 shadow-xl">
                    <div className="flex gap-6 items-start">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                          <UserIcon size={28} />
                       </div>
                       <textarea 
                          value={postContent}
                          onChange={e => setPostContent(e.target.value)}
                          placeholder="Broadcast a signal to the registry..."
                          className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 text-white text-lg font-medium italic focus:ring-4 focus:ring-indigo-500/10 outline-none h-32 resize-none placeholder:text-stone-900 shadow-inner"
                       />
                    </div>
                    <div className="flex justify-end gap-4">
                       <button onClick={handlePost} disabled={isPosting || !postContent.trim()} className="px-10 py-4 agro-gradient rounded-full text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 disabled:opacity-30">
                          {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          BROADCAST SIGNAL
                       </button>
                    </div>
                 </div>

                 {/* Feed */}
                 <div className="space-y-6">
                    {MOCK_FEED.map(post => (
                       <div key={post.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/20 space-y-8 shadow-xl hover:border-emerald-500/20 transition-all group">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shadow-inner">
                                   <UserIcon size={24} />
                                </div>
                                <div>
                                   <h4 className="text-xl font-black text-white uppercase italic tracking-tight m-0">{post.author}</h4>
                                   <p className="text-[10px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1">{post.esin}</p>
                                </div>
                             </div>
                             <span className="text-[10px] font-mono text-slate-800">{post.time}</span>
                          </div>
                          <p className="text-xl text-slate-300 italic leading-relaxed font-medium pl-8 border-l-2 border-emerald-500/20">"{post.text}"</p>
                          <div className="pt-6 border-t border-white/5 flex gap-8">
                             <button className="flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-rose-500 transition-all uppercase tracking-widest">
                                <ThumbsUp size={14} /> {post.likes} VOUCHES
                             </button>
                             <button className="flex items-center gap-2 text-[10px] font-black text-slate-600 hover:text-indigo-400 transition-all uppercase tracking-widest">
                                <MessageSquareShare size={14} /> {post.shares} SHARDS
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Sidebar Stewards */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-lg font-black text-white uppercase tracking-widest">Discover <span className="text-indigo-400">Stewards</span></h3>
                       <button className="text-slate-600 hover:text-white transition-all"><RefreshCw size={14} /></button>
                    </div>
                    <div className="space-y-4">
                       {MOCK_STEWARDS.map(steward => (
                          <div key={steward.esin} className="p-6 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all flex items-center justify-between group cursor-pointer">
                             <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-transform">
                                   <img src={steward.avatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <p className="text-sm font-black text-white uppercase italic leading-none">{steward.name}</p>
                                   <p className="text-[9px] text-slate-700 font-mono mt-1.5 uppercase">{steward.location}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                   <div className={`w-1.5 h-1.5 rounded-full ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                   <span className="text-xl font-mono font-black text-white">{steward.res}%</span>
                                </div>
                                <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Resonance</span>
                             </div>
                          </div>
                       ))}
                    </div>
                    <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">VIEW GLOBAL NETWORK</button>
                 </div>
              </div>
           </div>
        )}

        {/* --- TAB: LEARNING (LMS) --- */}
        {activeTab === 'lms' && (
           <div className="space-y-12 animate-in slide-in-from-top-4 duration-700 max-w-[1400px] mx-auto">
              <div className="flex flex-wrap justify-center gap-4 p-2 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 bg-black/60 border border-white/5 shadow-2xl px-8 relative z-20">
                 {[
                    { id: 'modules', label: 'Knowledge Modules', icon: Library },
                    { id: 'exams', label: 'Vetting Exams', icon: BadgeCheck },
                    { id: 'forge', label: 'Knowledge Forge', icon: Wand2 },
                 ].map(sub => (
                    <button 
                      key={sub.id} 
                      onClick={() => setLmsSubTab(sub.id as any)} 
                      className={`flex items-center gap-3 px-10 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${lmsSubTab === sub.id ? 'bg-indigo-600 text-white shadow-xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white'}`}
                    >
                       <sub.icon size={18} /> {sub.label}
                    </button>
                 ))}
              </div>

              {lmsSubTab === 'modules' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {LMS_MODULES.map(mod => (
                       <div key={mod.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group shadow-3xl h-[520px] relative overflow-hidden flex flex-col justify-between active:scale-[0.98]">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><GraduationCap size={400} /></div>
                          <div className="space-y-8 relative z-10">
                             <div className="flex justify-between items-start">
                                <div className={`px-5 py-2 bg-black/60 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner ${mod.col}`}>
                                   {mod.category} SHARD
                                </div>
                                {mod.special && (
                                   <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-2xl animate-pulse">
                                      <Star className="text-amber-500 fill-amber-500" size={24} />
                                   </div>
                                )}
                             </div>
                             <div className="space-y-4">
                                <h4 className="text-4xl font-black text-white uppercase italic leading-none group-hover:text-indigo-400 transition-colors m-0 tracking-tighter drop-shadow-2xl">{mod.title}</h4>
                                <p className="text-xl text-slate-500 italic leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">"{mod.desc}"</p>
                             </div>
                          </div>
                          <div className="pt-12 border-t border-white/5 space-y-6 relative z-10">
                             <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 px-4">
                                <span>Ingest Progress</span>
                                <span className="text-white font-mono">{mod.progress}%</span>
                             </div>
                             <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_#6366f1] transition-all duration-[2s]" style={{ width: `${mod.progress}%` }}></div>
                             </div>
                             <button className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-4 active:scale-95 transition-all border-4 border-white/10 ring-8 ring-indigo-500/5">
                                {mod.progress === 100 ? <FileCheck size={20} /> : <PlayCircle size={20} />}
                                {mod.progress === 100 ? 'ARCHIVE_ACCESS' : 'RESUME_INGEST'}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {lmsSubTab === 'exams' && (
                <div className="max-w-4xl mx-auto animate-in zoom-in duration-700">
                   {examStep === 'intro' && (
                     <div className="glass-card p-16 rounded-[80px] border-2 border-indigo-500/20 bg-black/60 shadow-3xl text-center space-y-12">
                        <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-3xl mx-auto">
                           <BadgeCheck size={56} className="text-white" />
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Vetting <span className="text-indigo-400">Exam</span></h3>
                           <p className="text-slate-400 text-xl font-medium italic max-w-xl mx-auto">"Certify your node stewardship knowledge and unlock higher network tiers. Passing rewards 500 EAC."</p>
                        </div>
                        <div className="p-8 bg-black/80 rounded-[44px] border border-white/10 flex justify-between items-center max-w-md mx-auto">
                           <div className="flex items-center gap-4">
                              <Coins size={24} className="text-emerald-500" />
                              <span className="text-xs font-black text-slate-500 uppercase">Exam Access Fee</span>
                           </div>
                           <span className="text-2xl font-mono font-black text-white">{EXAM_FEE} EAC</span>
                        </div>
                        <div className="space-y-4 max-w-sm mx-auto">
                           <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">ADMIN SIGNATURE (ESIN)</label>
                           <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="EA-XXXX-XXXX" className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 text-center text-3xl font-mono text-white outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all uppercase shadow-inner" />
                        </div>
                        <button onClick={handleAuthorizeExam} disabled={!esinSign} className="w-full max-w-md py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5">AUTHORIZE EXAM INGEST</button>
                     </div>
                   )}
                   {examStep === 'generation' && (
                     <div className="py-40 flex flex-col items-center gap-12 text-center">
                        <Loader2 size={120} className="text-indigo-500 animate-spin" />
                        <p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">SEQUENCING EXAM SHARD...</p>
                     </div>
                   )}
                   {examStep === 'active' && examQuestions.length > 0 && (
                     <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-white/5 bg-black/40 space-y-12 shadow-3xl">
                        <div className="flex justify-between items-center px-4">
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Question {currentQuestion + 1} / {examQuestions.length}</span>
                           <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 shadow-xl" style={{ width: `${((currentQuestion + 1) / examQuestions.length) * 100}%` }}></div>
                           </div>
                        </div>
                        <h4 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-tight">"{examQuestions[currentQuestion].question}"</h4>
                        <div className="grid gap-4">
                           {examQuestions[currentQuestion].options.map((opt: string, idx: number) => (
                             <button key={idx} onClick={() => handleAnswerSelect(idx)} className="p-8 glass-card border-2 border-white/5 hover:border-indigo-500/40 bg-black/60 rounded-[40px] text-left text-xl font-medium italic transition-all group">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all font-mono font-black">{String.fromCharCode(65 + idx)}</div>
                                   <span className="text-slate-300 group-hover:text-white transition-colors">{opt}</span>
                                </div>
                             </button>
                           ))}
                        </div>
                     </div>
                   )}
                   {examStep === 'results' && examResult && (
                      <div className="glass-card p-16 rounded-[80px] border-2 border-white/5 bg-black/60 shadow-3xl text-center space-y-12 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-12 opacity-[0.03] animate-spin-slow"><BadgeCheck size={400} /></div>
                         <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 ${examResult.passed ? 'bg-emerald-600 border-white' : 'bg-rose-600 border-white'}`}>
                            {examResult.passed ? <CheckCircle2 size={56} className="text-white" /> : <ShieldAlert size={56} className="text-white" />}
                         </div>
                         <div className="space-y-4">
                            <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">{examResult.passed ? 'EXAM_VERIFIED' : 'VETTING_FAILED'}</h3>
                            <p className="text-slate-400 text-xl font-medium italic">"You achieved a resonance score of {examResult.percentage}%."</p>
                         </div>
                         {examResult.passed ? (
                           <div className="p-10 bg-emerald-600/10 border-2 border-emerald-500/20 rounded-[56px] space-y-4">
                              <p className="text-emerald-400 font-black text-3xl italic tracking-widest">+500 EAC</p>
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Rewards sharded to registry treasury</p>
                           </div>
                         ) : (
                           <div className="p-10 bg-rose-600/10 border-2 border-rose-500/20 rounded-[56px] space-y-6">
                              <p className="text-rose-500 font-black text-lg uppercase italic tracking-widest">MINIMUM RESONANCE: 80%</p>
                              {studyResources && (
                                <div className="text-left space-y-4 border-t border-rose-500/20 pt-6">
                                   <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest px-4">Suggested Knowledge Ingest</p>
                                   <div className="text-slate-400 text-sm italic line-clamp-4 leading-relaxed px-4">"{studyResources.text}"</div>
                                </div>
                              )}
                           </div>
                         )}
                         <button onClick={() => setExamStep('intro')} className="w-full py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">CLOSE TERMINAL</button>
                      </div>
                   )}
                </div>
              )}

              {lmsSubTab === 'forge' && (
                 <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-700">
                    <div className="glass-card p-16 md:p-24 rounded-[80px] border-2 border-indigo-500/20 bg-indigo-950/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[700px] shadow-3xl text-center group">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none"><Sparkles size={800} className="text-indigo-400" /></div>
                       
                       {!forgedModule && !isForgingModule ? (
                          <div className="space-y-12 relative z-10 py-20 w-full max-w-4xl">
                             <div className="w-32 h-32 rounded-[44px] bg-indigo-600 flex items-center justify-center shadow-[0_0_120px_rgba(99,102,241,0.4)] border-4 border-white/10 mx-auto animate-float">
                                <Wand2 size={56} className="text-white" />
                             </div>
                             <div className="space-y-6">
                                <h3 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Knowledge <span className="text-indigo-400">Forge</span></h3>
                                <p className="text-slate-400 text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed">
                                   "Invoke the Oracle to synthesize a new technical learning module. Every forged shard is peer-vetted and rewards the author."
                                </p>
                             </div>
                             <div className="max-w-2xl mx-auto space-y-10">
                                <textarea 
                                   value={forgeInput}
                                   onChange={e => setForgeInput(e.target.value)}
                                   placeholder="Define the technical learning objective (e.g. Bantu soil mineral sharding)..."
                                   className="w-full bg-black border-2 border-white/10 rounded-[48px] p-10 text-white text-2xl font-medium italic focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-stone-900 shadow-inner h-64 resize-none"
                                />
                                <button 
                                   onClick={handleForgeModule}
                                   disabled={!forgeInput.trim()}
                                   className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6 border-4 border-white/10 ring-[16px] ring-emerald-500/5 disabled:opacity-30"
                                >
                                   INITIALIZE FORGE SHARD <Binary size={28} />
                                </button>
                             </div>
                          </div>
                       ) : isForgingModule ? (
                          <div className="flex flex-col items-center justify-center space-y-16 py-32 text-center animate-in zoom-in duration-500">
                             <div className="relative">
                                <Loader2 size={140} className="text-indigo-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Bot size={48} className="text-indigo-400 animate-pulse" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.8em] animate-pulse italic m-0">SYNTHESIZING KNOWLEDGE SHARD...</p>
                                <div className="flex justify-center gap-2">
                                   {[...Array(6)].map((_, i) => <div key={i} className="w-1.5 h-16 bg-indigo-500/20 rounded-full animate-bounce shadow-xl" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                                </div>
                             </div>
                          </div>
                       ) : (
                          <div className="animate-in slide-in-from-bottom-10 duration-1000 space-y-16 py-10 w-full max-w-5xl px-4">
                             <div className="p-16 md:p-24 bg-black/80 rounded-[80px] border-2 border-indigo-500/20 shadow-[0_40px_150px_rgba(0,0,0,0.9)] border-l-[24px] border-l-indigo-600 text-left relative overflow-hidden group/mod">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover/mod:scale-110 transition-transform duration-[15s]"><FileText size={600} className="text-white" /></div>
                                <div className="flex justify-between items-center mb-16 relative z-10 border-b border-white/5 pb-10">
                                   <div className="flex items-center gap-8">
                                      <Stamp size={48} className="text-indigo-400" />
                                      <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter leading-none">Forged Knowledge Shard</h4>
                                   </div>
                                   <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
                                      <span className="text-[11px] font-mono font-black text-indigo-400 uppercase tracking-widest italic">ORACLE_SYNTH_OK</span>
                                   </div>
                                </div>
                                <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-2xl leading-relaxed italic whitespace-pre-line font-medium relative z-10 pl-6 border-l-2 border-white/5">
                                   {forgedModule}
                                </div>
                             </div>
                             <div className="flex justify-center gap-10">
                                <button onClick={() => setForgedModule(null)} className="px-16 py-8 bg-white/5 border-2 border-white/10 rounded-full text-[13px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-xl active:scale-95">Discard Synthesis</button>
                                <button className="px-24 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_120px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[16px] ring-white/5">
                                   <Stamp size={32} /> ANCHOR MODULE TO LMS
                                </button>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* --- TAB: TECHNICAL MANUAL --- */}
        {activeTab === 'manual' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-700 max-w-[1400px] mx-auto">
              <div className="text-center space-y-4 mb-20">
                 <h2 className="text-6xl md:text-[100px] font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)]">TECHNICAL <span className="text-indigo-400">MANUAL</span></h2>
                 <p className="text-slate-500 text-2xl font-medium italic max-w-3xl mx-auto leading-relaxed opacity-80">"Official documentation shards for network architecture, m-constant derivation, and EOS kernel protocols."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {[
                    { id: 'MAN-01', title: 'Network Architecture v6.5', type: 'System', size: '2.4 MB', icon: Database, color: 'text-blue-400' },
                    { id: 'MAN-02', title: 'C(a) Biometric Derivation', type: 'Technical', size: '1.8 MB', icon: Binary, color: 'text-emerald-400' },
                    { id: 'MAN-03', title: 'SEHTI Compliance Handbook', type: 'Legal', size: '4.2 MB', icon: Scale, color: 'text-indigo-400' },
                    { id: 'MAN-04', title: 'Agro Musika Acoustic Lab', type: 'Technical', size: '8.4 MB', icon: Waves, color: 'text-teal-400' },
                    { id: 'MAN-05', title: 'Tokenz DeFi Bridge Logic', type: 'Economic', size: '0.9 MB', icon: Coins, color: 'text-amber-500' },
                    { id: 'MAN-06', title: 'Steward Identity Handshake', type: 'Protocol', size: '1.2 MB', icon: Fingerprint, color: 'text-slate-400' },
                 ].map(manual => (
                    <div key={manual.id} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col justify-between h-[450px] relative overflow-hidden active:scale-[0.98] shadow-3xl">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><manual.icon size={250} /></div>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className={`p-5 rounded-3xl bg-white/5 border border-white/10 ${manual.color} shadow-xl group-hover:rotate-6 transition-all`}>
                             <manual.icon size={32} />
                          </div>
                          <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase text-slate-500 tracking-widest">{manual.type} Shard</span>
                       </div>
                       <div className="flex-1 space-y-4 relative z-10">
                          <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors m-0">{manual.title}</h4>
                          <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest italic">{manual.id} // SIZE: {manual.size}</p>
                       </div>
                       <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                          <button className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-400 hover:text-white transition-all flex items-center gap-3">
                             <FileSearch size={16} /> LOAD SHARD
                          </button>
                          <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-600 hover:text-white transition-all shadow-xl active:scale-90"><Download size={20}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- TAB: PERFORMANCE METRICS --- */}
        {activeTab === 'report' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700 max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 glass-card p-12 md:p-16 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent absolute top-0 animate-scan opacity-20"></div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-8">
                          <div className="p-6 bg-indigo-600 rounded-[32px] shadow-[0_0_50px_rgba(99,102,241,0.3)] border-2 border-white/10">
                             <LineChartIcon className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Global <span className="text-indigo-400">Resonance</span></h3>
                             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">COMMUNITY_EQUILIBRIUM_INDEX_v4.2</p>
                          </div>
                       </div>
                       <div className="text-right border-l-4 border-indigo-500/20 pl-8">
                          <p className="text-[11px] text-slate-600 font-black uppercase mb-2">Network Momentum</p>
                          <p className="text-7xl font-mono font-black text-indigo-400 tracking-tighter leading-none drop-shadow-2xl">94<span className="text-2xl text-indigo-600 italic ml-1">%</span></p>
                       </div>
                    </div>

                    <div className="flex-1 min-h-[450px] w-full relative z-10 p-6 bg-black/40 rounded-[56px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_PERFORMANCE_HISTORY}>
                             <defs>
                                <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="cycle" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px' }} />
                             <Area type="monotone" name="Community Resonance" dataKey="resonance" stroke="#6366f1" strokeWidth={8} fillOpacity={1} fill="url(#colorRes)" strokeLinecap="round" />
                             <Area type="stepAfter" name="Active Vouchers" dataKey="vouchers" stroke="#10b981" strokeWidth={2} fill="transparent" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-8 flex flex-col">
                    <div className="glass-card p-12 rounded-[64px] border border-emerald-500/10 bg-emerald-600/5 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden flex-1 group shadow-xl">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Sprout size={300} className="text-emerald-400" /></div>
                       <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 group-hover:rotate-12 transition-transform">
                          <TrendingUp size={40} className="text-white" />
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Yield <span className="text-emerald-400">Aggregation</span></h4>
                          <p className="text-slate-400 text-lg leading-relaxed italic px-6">"Collective network rewards accrued through peer-to-peer knowledge sharding."</p>
                       </div>
                       <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/20 w-full relative z-10 shadow-inner">
                          <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-3">Community Treasury</p>
                          <p className="text-5xl font-mono font-black text-emerald-400 tracking-tighter">1.2M <span className="text-lg">EAC</span></p>
                       </div>
                    </div>

                    <div className="p-10 glass-card rounded-[48px] border border-blue-500/20 bg-blue-500/5 space-y-6 shadow-xl relative overflow-hidden group/tip">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/tip:scale-125 transition-transform"><Bot size={150} /></div>
                       <div className="flex items-center gap-4 relative z-10">
                          <Bot className="w-8 h-8 text-blue-400" />
                          <h4 className="text-xl font-black text-white uppercase italic">Consensus Advice</h4>
                       </div>
                       <p className="text-slate-400 text-sm leading-relaxed italic relative z-10 border-l-2 border-blue-500/20 pl-6">
                          "Network activity is 12% above seasonal average. High sharding frequency in Zone 4 suggests early carbon credit finality."
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Community;
