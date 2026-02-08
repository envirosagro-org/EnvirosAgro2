
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
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { User, ViewState } from '../types';
import { generateAgroExam, getGroundedAgroResources, AIResponse } from '../services/geminiService';

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
];

const MOCK_PERFORMANCE_HISTORY = [
  { cycle: 'C1', resonance: 82, vouchers: 12 }, { cycle: 'C2', resonance: 85, vouchers: 18 },
  { cycle: 'C3', resonance: 84, vouchers: 25 }, { cycle: 'C4', resonance: 89, vouchers: 42 },
  { cycle: 'C5', resonance: 92, vouchers: 38 }, { cycle: 'C6', resonance: 94, vouchers: 56 },
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

const Community: React.FC<CommunityProps> = ({ user, isGuest, onEarnEAC, onSpendEAC, onContribution, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'shards' | 'social' | 'lms' | 'manual' | 'report'>('shards');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams'>('modules');
  
  const [shards] = useState(INITIAL_SOCIAL_SHARDS);
  const [joinedShards, setJoinedShards] = useState<string[]>(['SHD-882']); 

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
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

  const handlePost = () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      onContribution('post', 'General');
      setPostContent('');
      setIsPosting(false);
      alert("SIGNAL BROADCASTED");
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
      alert("SIGNATURE ERROR");
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
      <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black shadow-2xl px-6 relative z-20">
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
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-500 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
          >
            <t.icon size={12} /> {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[600px] relative z-10 px-4">
        
        {/* --- TAB: HERITAGE HUB --- */}
        {activeTab === 'hub' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-700 max-w-5xl mx-auto">
             <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">Heritage <span className="text-emerald-400">Hub</span></h2>
                <p className="text-slate-500 text-sm md:text-lg font-medium italic opacity-70">"Ancestral wisdom sharded for the modern grid."</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CHAPTERS.map(ch => (
                   <div key={ch.id} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 space-y-6 group hover:border-emerald-500/20 transition-all shadow-xl">
                      <div className="flex items-center gap-4">
                         <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:rotate-6 transition-all shadow-inner">
                            <ch.icon size={24} className="text-emerald-400" />
                         </div>
                         <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{ch.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 font-medium">"{ch.content}"</p>
                      <button className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:text-white">
                         Explore Shard <ArrowRight size={12} />
                      </button>
                   </div>
                ))}
             </div>
          </div>
        )}

        {/* --- TAB: SOCIAL SHARDS --- */}
        {activeTab === 'shards' && (
           <div className="space-y-10 animate-in slide-in-from-right-4 duration-700 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-3">
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0">Social <span className="text-emerald-400">Registry</span></h2>
                 <p className="text-slate-500 text-sm md:text-lg font-medium italic opacity-70">Collective mission nodes for cultural synchronization.</p>
              </div>
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                 {shards.map(shard => (
                    <div key={shard.id} className="glass-card p-10 rounded-[48px] border-2 border-white/5 bg-black relative overflow-hidden shadow-2xl group transition-all">
                       <div className="flex justify-between items-start mb-8">
                          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><Users2 size={32} /></div>
                          <div className="text-right">
                             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase rounded-full">{shard.type}</span>
                             <p className="text-[9px] text-slate-700 font-mono mt-2 italic">{shard.id}</p>
                          </div>
                       </div>
                       <h4 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors truncate">{shard.name}</h4>
                       <p className="text-xs text-slate-400 mt-4 leading-relaxed italic line-clamp-2">"{shard.mission}"</p>
                       <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                          <div className="text-center"><p className="text-[7px] text-slate-600 font-black uppercase">Resonance</p><p className="text-2xl font-mono font-black text-white">{shard.resonance}%</p></div>
                          <div className="text-center"><p className="text-[7px] text-slate-600 font-black uppercase">Peers</p><p className="text-2xl font-mono font-black text-white">{shard.memberCount}</p></div>
                       </div>
                       <button onClick={() => handleJoinShard(shard.id)} className={`w-full py-4 mt-8 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${joinedShards.includes(shard.id) ? 'bg-rose-900/40 text-rose-400 border border-rose-500/20' : 'bg-emerald-600 text-white'}`}>
                          {joinedShards.includes(shard.id) ? <LeaveIcon size={14} /> : <Handshake size={14} />}
                          {joinedShards.includes(shard.id) ? 'EXIT_SHARD' : 'JOIN_SHARD'}
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- TAB: SOCIAL FEED --- */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
             <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-6 rounded-[40px] border border-white/5 bg-black/60 shadow-xl space-y-4">
                   <textarea 
                    value={postContent} onChange={e => setPostContent(e.target.value)}
                    placeholder="Broadcast a signal to the steward network..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all h-24 resize-none"
                   />
                   <div className="flex justify-between items-center px-2">
                      <div className="flex gap-2">
                        <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-400 transition-colors"><Camera size={16}/></button>
                        <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-emerald-400 transition-colors"><MapIcon size={16}/></button>
                      </div>
                      <button onClick={handlePost} disabled={isPosting || !postContent.trim()} className="px-8 py-3 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30">
                        {isPosting ? 'BROADCASTING...' : 'INITIALIZE SIGNAL'}
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   {MOCK_FEED.map(post => (
                      <div key={post.id} className="glass-card p-8 rounded-[48px] border border-white/5 bg-black/40 space-y-6 shadow-xl group">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg">{post.author[0]}</div>
                               <div>
                                  <h4 className="text-sm font-black text-white uppercase italic">{post.author}</h4>
                                  <p className="text-[9px] text-slate-600 font-mono tracking-tighter">{post.esin}</p>
                               </div>
                            </div>
                            <span className="text-[9px] text-slate-700 font-bold uppercase">{post.time}</span>
                         </div>
                         <p className="text-[11px] text-slate-300 leading-relaxed italic">"{post.text}"</p>
                         <div className="flex gap-6 pt-4 border-t border-white/5">
                            <button className="flex items-center gap-2 text-[9px] font-black text-slate-600 hover:text-emerald-400 transition-colors"><ThumbsUp size={14}/> {post.likes} VOUCHES</button>
                            <button className="flex items-center gap-2 text-[9px] font-black text-slate-600 hover:text-blue-400 transition-colors"><Share2 size={14}/> {post.shares} SHARDS</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-950/5 space-y-8 shadow-xl">
                   <h4 className="text-sm font-black text-white uppercase tracking-widest italic border-b border-white/10 pb-4">Steward Network</h4>
                   <div className="space-y-6">
                      {MOCK_STEWARDS.map(s => (
                        <div key={s.esin} className="flex items-center justify-between group">
                           <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={s.avatar} className="w-12 h-12 rounded-2xl border-2 border-white/5 group-hover:border-emerald-500/40 transition-all" alt="" />
                                {s.online && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black animate-pulse"></div>}
                              </div>
                              <div>
                                 <p className="text-xs font-black text-white uppercase leading-none">{s.name}</p>
                                 <p className="text-[8px] text-slate-500 font-mono mt-1">{s.location}</p>
                              </div>
                           </div>
                           <button className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><UserPlus size={16}/></button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: LEARNING (LMS) --- */}
        {activeTab === 'lms' && (
           <div className="space-y-12 animate-in slide-in-from-top-4 duration-700 max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit mx-auto lg:mx-0 bg-black/60 border border-white/5">
                 {['modules', 'exams'].map(sub => (
                    <button key={sub} onClick={() => setLmsSubTab(sub as any)} className={`px-8 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${lmsSubTab === sub ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{sub.toUpperCase()}</button>
                 ))}
              </div>

              {lmsSubTab === 'modules' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {LMS_MODULES.map(mod => (
                       <div key={mod.id} className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-between group hover:border-indigo-500/20 transition-all shadow-xl h-[380px] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[10s]"><GraduationCap size={200} /></div>
                          <div className="space-y-6 relative z-10">
                             <div className="flex justify-between items-start">
                                <span className={`px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest ${mod.col}`}>{mod.category}</span>
                                {mod.special && <Star className="text-amber-500 fill-amber-500" size={16} />}
                             </div>
                             <h4 className="text-2xl font-black text-white uppercase italic leading-tight m-0 group-hover:text-indigo-400 transition-colors">{mod.title}</h4>
                             <p className="text-[10px] text-slate-500 italic leading-relaxed font-medium">"{mod.desc}"</p>
                          </div>
                          <div className="pt-8 mt-auto border-t border-white/5 space-y-4 relative z-10">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                                <span>Module Progress</span>
                                <span className="text-white">{mod.progress}%</span>
                             </div>
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${mod.progress}%` }}></div>
                             </div>
                             <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                                {mod.progress === 100 ? 'ARCHIVE ACCESS' : 'RESUME SEQUENCE'}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="glass-card p-12 md:p-20 rounded-[80px] border-2 border-indigo-500/20 bg-[#020403] shadow-3xl text-center space-y-12 animate-in zoom-in duration-700 relative overflow-hidden group">
                    {examStep === 'intro' && (
                       <div className="space-y-10 relative z-10">
                          <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-2xl animate-float border-2 border-white/10">
                             <Award size={48} />
                          </div>
                          <div className="space-y-4">
                             <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">AgBoard <span className="text-indigo-400">Authorization</span></h3>
                             <p className="text-slate-400 text-xl font-medium italic max-w-xl mx-auto leading-relaxed">"Pass the institutional vetting cycle to earn the **Master Steward** multiplier and a {EXAM_REWARD_BOUNTY} EAC bounty."</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto py-8 border-y border-white/5">
                             <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex flex-col items-center">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Ingest Fee</p>
                                <p className="text-3xl font-mono font-black text-rose-500">{EXAM_FEE} EAC</p>
                             </div>
                             <div className="p-6 bg-black/60 rounded-[32px] border border-white/5 flex flex-col items-center">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-2">Success Shard</p>
                                <p className="text-3xl font-mono font-black text-emerald-400">+{EXAM_REWARD_BOUNTY} EAC</p>
                             </div>
                          </div>
                          <button onClick={() => setExamStep('payment')} className="px-16 py-8 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl hover:scale-105 active:scale-95 transition-all ring-8 ring-indigo-500/5">INITIALIZE AUDIT</button>
                       </div>
                    )}
                    {examStep === 'payment' && (
                       <div className="space-y-12 relative z-10 animate-in slide-in-from-right-10 duration-700">
                          <div className="w-24 h-24 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-3xl">
                             <Fingerprint size={48} className="animate-pulse" />
                          </div>
                          <div className="space-y-4">
                             <h4 className="text-4xl font-black text-white uppercase italic m-0">Consensus <span className="text-indigo-400">Signature</span></h4>
                             <p className="text-slate-500 text-sm">Sign the exam escrow to generate your unique question shard.</p>
                          </div>
                          <div className="max-w-md mx-auto space-y-8">
                             <input type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)} placeholder="SIGN WITH ESIN" className="w-full bg-black border-2 border-white/10 rounded-[32px] py-8 text-center text-5xl font-mono text-white outline-none focus:ring-8 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-900 shadow-inner" />
                             <button onClick={handleAuthorizeExam} disabled={!esinSign || isProcessingExam} className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.6em] shadow-xl active:scale-95 transition-all">
                                {isProcessingExam ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : 'AUTHORIZE INGEST'}
                             </button>
                          </div>
                       </div>
                    )}
                    {examStep === 'active' && (
                       <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-6 duration-700">
                          <div className="flex justify-between items-center px-10">
                             <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Question {currentQuestion + 1} of {examQuestions.length}</span>
                             <div className="flex items-center gap-3">
                                <Clock size={14} className="text-indigo-400" />
                                <span className="text-xs font-mono font-black text-white tracking-widest">ACTIVE_SESSION</span>
                             </div>
                          </div>
                          <div className="p-12 md:p-16 bg-black rounded-[64px] border-l-8 border-l-indigo-600 border border-white/10 shadow-3xl text-left">
                             <h4 className="text-2xl md:text-4xl font-black text-white leading-relaxed italic mb-10">"{examQuestions[currentQuestion].question}"</h4>
                             <div className="grid gap-4">
                                {examQuestions[currentQuestion].options.map((opt: string, i: number) => (
                                   <button key={i} onClick={() => handleAnswerSelect(i)} className="w-full p-8 bg-white/[0.02] border-2 border-white/5 rounded-3xl text-left text-lg font-medium italic hover:bg-indigo-600/10 hover:border-indigo-500/40 transition-all active:scale-[0.98] group">
                                      <div className="flex items-center gap-6">
                                         <span className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center font-mono font-black text-slate-600 group-hover:text-indigo-400">{String.fromCharCode(65 + i)}</span>
                                         <span className="text-slate-300 group-hover:text-white transition-colors">{opt}</span>
                                      </div>
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    )}
                    {examStep === 'results' && examResult && (
                       <div className="space-y-12 relative z-10 animate-in zoom-in duration-700">
                          <div className={`w-40 h-40 rounded-[48px] flex items-center justify-center mx-auto shadow-3xl border-4 border-white/10 relative overflow-hidden ${examResult.passed ? 'bg-emerald-600' : 'bg-rose-700'}`}>
                             <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                             {examResult.passed ? <BadgeCheck size={80} className="text-white" /> : <AlertTriangle size={80} className="text-white" />}
                          </div>
                          <div className="space-y-4">
                             <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Audit <span className={examResult.passed ? 'text-emerald-400' : 'text-rose-500'}>{examResult.passed ? 'SUCCESS' : 'FAILED'}</span></h3>
                             <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-6">Protocol Accuracy: {examResult.percentage.toFixed(1)}% // QUORUM_REACHED</p>
                          </div>
                          <div className="max-w-xl mx-auto p-10 bg-black rounded-[48px] border border-white/10 shadow-inner space-y-6">
                             <p className="text-lg text-slate-400 italic leading-relaxed">
                                {examResult.passed 
                                   ? "Consensus verified. Your Master Steward shard is now part of the global registry. High-Tier multiplier activated." 
                                   : "Protocol violation. Your resonance alpha did not meet the minimum mastery threshold of 80%."}
                             </p>
                             {!examResult.passed && studyResources && (
                                <div className="p-6 bg-rose-500/5 rounded-3xl border border-rose-500/20 text-left">
                                   <p className="text-[10px] text-rose-500 font-black uppercase mb-3">Suggested Remediation</p>
                                   <p className="text-[11px] text-slate-500 italic leading-relaxed">{studyResources.text.substring(0, 200)}...</p>
                                </div>
                             )}
                          </div>
                          <button onClick={() => setExamStep('intro')} className="px-16 py-8 bg-white/5 border border-white/10 rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Return to Lab</button>
                       </div>
                    )}
                 </div>
              )}
           </div>
        )}

        {/* --- TAB: MANUAL (REGISTRY BOOK) --- */}
        {activeTab === 'manual' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[80px] border-emerald-500/20 bg-black/60 shadow-3xl space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><BookOpen size={600} className="text-emerald-400" /></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-12 mb-10">
                   <div className="w-24 h-24 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                      <BookOpen size={48} />
                   </div>
                   <div className="text-center md:text-left space-y-2">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Registry <span className="text-emerald-400">Handbook</span></h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">OFFICIAL_OPERATING_MANUAL_v6.5</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                   {CHAPTERS.map(ch => (
                      <button 
                        key={ch.id} 
                        onClick={() => setSelectedChapter(ch)}
                        className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 text-center ${selectedChapter.id === ch.id ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl scale-105' : 'bg-black/60 border-white/5 text-slate-600 hover:border-white/20'}`}
                      >
                         <ch.icon size={24} className={selectedChapter.id === ch.id ? 'text-emerald-400' : 'text-slate-700'} />
                         <span className="text-[10px] font-black uppercase tracking-tight leading-none">{ch.title}</span>
                      </button>
                   ))}
                </div>

                <div className="p-12 md:p-16 bg-black/80 rounded-[64px] border border-white/10 shadow-inner relative overflow-hidden animate-in fade-in duration-500 min-h-[400px]">
                   <div className="absolute top-10 left-10 opacity-10"><Quote size={64} className="text-emerald-400" /></div>
                   <h4 className="text-3xl font-black text-emerald-400 uppercase italic m-0 mb-10 tracking-tighter relative z-10">{selectedChapter.title}</h4>
                   <p className="text-slate-300 text-2xl leading-[2.1] italic font-medium relative z-10 pl-6 border-l-4 border-emerald-500/40">
                      "{selectedChapter.content}"
                   </p>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex justify-center gap-6 relative z-10">
                   <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all">Download PDF Warrant</button>
                   <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all">Print Protocol Scroll</button>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: METRICS (REPORT) --- */}
        {activeTab === 'report' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-1000 max-w-6xl mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 shadow-3xl space-y-10 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none overflow-hidden">
                      <div className="w-full h-[2px] bg-emerald-500/20 absolute top-0 animate-scan"></div>
                   </div>
                   <div className="flex justify-between items-center mb-10 relative z-10 px-4">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                            <Activity className="w-10 h-10 text-white" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Network <span className="text-emerald-400">Resonance</span></h3>
                            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mt-2">GLOBAL_METRIC_AGGREGATOR_v4</p>
                         </div>
                      </div>
                      <div className="text-right border-l-4 border-emerald-500/20 pl-8">
                         <p className="text-[11px] text-slate-600 font-black uppercase mb-1">Impact Delta</p>
                         <p className="text-7xl font-mono font-black text-emerald-400 tracking-tighter italic">+18.4%</p>
                      </div>
                   </div>
                   <div className="h-[400px] w-full relative z-10 p-10 bg-black/80 rounded-[56px] border border-white/5 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={MOCK_PERFORMANCE_HISTORY}>
                            <defs>
                               <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                            <XAxis dataKey="cycle" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Area type="monotone" name="Resonance Index" dataKey="resonance" stroke="#10b981" strokeWidth={6} fillOpacity={1} fill="url(#colorRes)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-8">
                   <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 flex flex-col justify-center items-center text-center space-y-8 shadow-xl flex-1 group overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-[12s]"><Database size={200} /></div>
                      <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-3xl animate-float border-2 border-white/10 relative z-10">
                         <Target size={32} className="text-white" />
                      </div>
                      <div className="space-y-4 relative z-10">
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-widest leading-none m-0">Ledger Compliance</h4>
                         <p className="text-slate-500 italic text-sm">"Your node is performing at 1.42x m-constant efficiency. Reward sharding is prioritized."</p>
                      </div>
                      <div className="p-8 bg-black/80 rounded-[40px] border border-white/5 w-full relative z-10 shadow-inner">
                         <p className="text-[10px] text-slate-700 uppercase font-black mb-2 tracking-widest">Mastery Level</p>
                         <p className="text-5xl font-mono font-black text-indigo-400 tracking-tighter italic">98<span className="text-xl">.4</span></p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Community;
