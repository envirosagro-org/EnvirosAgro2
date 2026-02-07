import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PlayCircle, 
  GraduationCap, 
  Video, 
  BookOpen, 
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
  BarChart4,
  ExternalLink,
  MapPin,
  Fingerprint,
  Activity,
  History,
  Info,
  BadgeCheck,
  Dna,
  Lock,
  SearchCode,
  Target,
  Bot,
  Brain,
  ShieldAlert,
  HeartPulse,
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
  Workflow,
  Podcast,
  PencilRuler,
  Hash,
  Crown,
  Star,
  Eye,
  Settings,
  Binary,
  Bookmark,
  ArrowLeftCircle,
  ArrowLeft,
  Database,
  Map as MapIcon,
  SmartphoneNfc,
  CreditCard,
  Globe2,
  WalletCards,
  Factory,
  Sprout,
  Network,
  Send,
  Key,
  Quote,
  Mic,
  Camera,
  PhoneCall,
  UserPlus,
  MessageCircle,
  Video as VideoIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { User } from '../types';
import { generateAgroExam, getGroundedAgroResources, AIResponse } from '../services/geminiService';

interface CommunityProps {
  user: User;
  isGuest: boolean;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
}

const CHAPTERS = [
  { id: 1, title: "The SEHTI Philosophy", icon: Heart, content: "Agriculture is not just land management; it is a complex system of human psychology, social structures, and scientific data. SEHTI integrates five core thrusts to achieve 100% sustainability. Our goal is to minimize Stress (S) while maximizing Density (Dn) and Intensity (In) through Cumulative (Ca) efforts.\n\nAt its core, SEHTI is a survival protocol. In environments where external infrastructure is volatile, the community becomes the primary redundant system. By sharding trust into a decentralized ledger, we ensure that no single point of failure can destabilize the regional food supply." },
  { id: 2, title: "Industrial Optimization (I)", icon: Factory, content: "The 'I' pillar focuses on industrial optimization. By leveraging decentralized ledgers (ESIN), we create an immutable record of agricultural output, carbon capture, and resource efficiency. Every action on the field is sharded and validated by peer nodes.\n\nIndustrializing sustainable agriculture requires a transition from intuition-based farming to data-driven orchestration. This involves real-time telemetry ingest and the use of SCADA systems to monitor biomass growth and nutrient flow with sub-millimeter precision." },
  { id: 3, title: "Agro Code C(a) Biometrics", icon: Binary, content: "The C(a) is the core biometric of your land. It is calculated based on cumulative sustainable practices. Maintaining high resonance in your local node branch requires regular spectral auditing and bio-signal synchronization via the Registry Handshake.\n\nThe formula for C(a) accounts for soil microbial density, water retention capacity, and biodiversity shards. A higher C(a) constant directly translates to increased EAC mining power, incentivizing stewards to prioritize long-term ecological wealth over short-term extraction." },
  { id: 4, title: "m-Constant Resilience", icon: Activity, content: "The sustainable time constant (m) represents your node's ability to resist external volatility. Calculated as the square root of productivity over stress, it determines your institutional multiplier for EAC mining.\n\nm-Constant management is the primary task of a Senior Steward. It requires a balanced approach to the Five Thrusts. For example, excessive technological intensity (In) without sufficient human wellness (H) can lead to social influenza (SID), causing a sudden decay in the m-constant and triggering a registry audit event." },
];

const LMS_MODULES = [
  { id: 'mod-1', title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false, progress: 100, desc: "A comprehensive introduction to the SEHTI pillars and the blockchain registry architecture." },
  { id: 'mod-2', title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true, progress: 45, desc: "Deep dive into the mathematical derivation of industrial stability and yield multipliers." },
  { id: 'mod-3', title: "SID Pathogen Identification", category: "Societal", eac: 100, col: "text-rose-400", special: false, progress: 0, desc: "Learning to identify and mitigate ideological crowding and trust-decay in social shards." },
  { id: 'mod-4', title: "Total Quality Management (TQM)", category: "Industrial", eac: 200, col: "text-indigo-400", special: true, progress: 0, desc: "Mastering the tracking and tracing of agricultural assets from inception to market finality." },
];

const INITIAL_SOCIAL_SHARDS = [
  { 
    id: 'SHD-882', 
    name: 'Bantu Soil Guardians', 
    admin: 'EA-ADMIN-X1', 
    memberCount: 142, 
    resonance: 94, 
    rules: 'Requires verified Tier 2 Steward status.',
    type: 'Heritage Clan',
    mission: 'Preserving drought-resistant lineage seeds through collective sharding.',
    trending: '+2.4%'
  },
  { 
    id: 'SHD-104', 
    name: 'Neo-Hydroponic Guild', 
    admin: 'EA-TECH-G4', 
    memberCount: 85, 
    resonance: 88, 
    rules: 'Open for all CEA-certified stewards.',
    type: 'Technical Guild',
    mission: 'Optimizing nutrient delivery shards across urban vertical stacks.',
    trending: '+8.1%'
  },
  { 
    id: 'SHD-042', 
    name: 'Carbon Offset Alliance', 
    admin: 'EA-CORE-X0', 
    memberCount: 1200, 
    resonance: 99, 
    rules: 'Mandatory for institutional carbon mining.',
    type: 'Industrial Union',
    mission: 'Aggregating regional sequestration proofs for global ledger settlement.',
    trending: '+12.4%'
  }
];

const MOCK_STEWARDS = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', location: 'Nairobi, Kenya', gender: 'Female', mutuals: 12, res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', bio: 'Specialist in Bantu drought sharding.', online: true, coords: { lat: -1.29, lng: 36.82 } },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', location: 'Omaha, USA', gender: 'Female', mutuals: 4, res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', bio: 'Soil MRI engineer.', online: false, coords: { lat: 41.25, lng: -95.93 } },
  { esin: 'EA-TECH-4420', name: 'Marcus Tech', location: 'Nairobi, Kenya', gender: 'Male', mutuals: 8, res: 84, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', bio: 'Swarm drone calibration lead.', online: true, coords: { lat: -1.28, lng: 36.81 } },
  { esin: 'EA-HERI-1122', name: 'Karanja Seed', location: 'Murang\'a, Kenya', gender: 'Male', mutuals: 22, res: 99, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', bio: 'Custodian of lineage maize shards.', online: true, coords: { lat: -0.72, lng: 37.15 } },
  { esin: 'EA-VALE-0922', name: 'Elena Vale', location: 'Valencia, Spain', gender: 'Female', mutuals: 1, res: 91, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', bio: 'Marine biodiversity sharding.', online: false, coords: { lat: 39.46, lng: -0.37 } },
];

const MOCK_FEED = [
  { id: 'P-1', author: 'Steward Alpha', esin: 'EA-ALPHA-88', text: 'Just completed a successful 432Hz sonic sweep on Sector 4. m-Constant increased by 0.05x!', time: '2h ago', likes: 12, shares: 3 },
  { id: 'P-2', author: 'Gaia Green', esin: 'EA-GAIA-02', text: 'Discovered a rare Bantu Sun-Orchid cluster. Documenting for the Agrowild archive.', time: '5h ago', likes: 45, shares: 12 },
  { id: 'P-3', author: 'Nexus Admin', esin: 'EA-CORE-HQ', text: 'System Update: Registry Handshake v5.2 is now rolling out to all regional hubs.', time: '1d ago', likes: 120, shares: 42 },
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

const Community: React.FC<CommunityProps> = ({ user, isGuest, onEarnEAC, onSpendEAC, onContribution }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'shards' | 'social' | 'lms' | 'manual' | 'report'>('hub');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams'>('modules');
  
  const [shards, setShards] = useState(INITIAL_SOCIAL_SHARDS);
  const [joinedShards, setJoinedShards] = useState<string[]>(['SHD-104']); 

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  // Social Hub States
  const [socialSearch, setSocialSearch] = useState('');
  const [selectedSteward, setSelectedSteward] = useState<any | null>(null);
  const [hudInvites, setHudInvites] = useState<string[]>([]); // Track ESINs where invite is pending
  const [activeHudLink, setActiveHudLink] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{from: string, text: string, time: string}[]>([]);
  const [callMode, setCallMode] = useState<'none' | 'audio' | 'video'>('none');

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

  const handlePost = () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    setTimeout(() => {
      onContribution('post', 'General');
      setPostContent('');
      setIsPosting(false);
      alert("SIGNAL BROADCASTED: Shard anchored to heritage hub.");
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

  // Social Hub Logic
  const nearbyStewards = useMemo(() => {
    const userCity = user.location.split(',')[0].trim();
    return MOCK_STEWARDS.filter(s => s.location.includes(userCity) && s.esin !== user.esin);
  }, [user.location, user.esin]);

  const filteredStewards = useMemo(() => {
    if (!socialSearch.trim()) return MOCK_STEWARDS.filter(s => s.esin !== user.esin);
    return MOCK_STEWARDS.filter(s => 
      (s.name.toLowerCase().includes(socialSearch.toLowerCase()) || s.esin.toLowerCase().includes(socialSearch.toLowerCase())) &&
      s.esin !== user.esin
    );
  }, [socialSearch, user.esin]);

  const handleSendHudInvite = (esin: string) => {
    setHudInvites(prev => [...prev, esin]);
    // Mocking an immediate acceptance for some stewards to show the HUD interface
    if (Math.random() > 0.5) {
      const stwd = MOCK_STEWARDS.find(s => s.esin === esin);
      setTimeout(() => {
        setActiveHudLink(stwd);
        onEarnEAC(5, 'SOCIAL_HUD_LINK_ESTABLISHED');
        alert(`HUD_SYNC_OK: ${stwd?.name} accepted your socialization shard.`);
      }, 3000);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = { from: 'Me', text: chatMessage, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChatHistory(prev => [...prev, msg]);
    setChatMessage('');
    
    // Auto-reply mock
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        from: activeHudLink?.name || 'Steward', 
        text: 'Registry resonance confirmed. I am ready for the shared task.', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
    }, 2000);
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
        if (passed) onEarnEAC(EXAM_REWARD_BOUNTY, 'AGBOARD_EXAMINATION_SUCCESS');
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
    if (await onSpendEAC(EXAM_FEE, "INDUSTRIAL_EXAMINATION_INGEST")) {
      setExamStep('generation');
      setIsProcessingExam(true);
      try {
        const questions = await generateAgroExam(examTopic);
        setExamQuestions(questions);
        setExamStep('active');
        setCurrentQuestion(0);
        setAnswers([]);
      } catch (e) {
        onEarnEAC(EXAM_FEE, "EXAM_SYNTHESIS_REFUND");
        setExamStep('intro');
      } finally {
        setIsProcessingExam(false);
      }
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-[1600px] mx-auto relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-40 opacity-[0.01] pointer-events-none rotate-12">
        <Users2 size={1000} className="text-emerald-500" />
      </div>

      {/* Top Navigation Shards */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-6 relative z-20">
        {[
          { id: 'hub', name: 'HERITAGE HUB', icon: Globe },
          { id: 'shards', name: 'SOCIAL SHARDS', icon: Users2 },
          { id: 'social', name: 'STEWARD SOCIAL', icon: HeartPulse },
          { id: 'lms', name: 'LEARNING HUB', icon: Library },
          { id: 'manual', name: 'SEHTI MANUAL', icon: BookOpen },
          { id: 'report', name: 'PERFORMANCE', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)} 
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-2xl scale-105 border-b-4 border-emerald-400 ring-8 ring-emerald-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[800px] relative z-10">
        
        {/* --- TAB: STEWARD SOCIAL (SOCIALIZATION HUB) --- */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-10 duration-700 px-4 md:px-0">
             
             {/* Left Column: Search & Proximity */}
             <div className="lg:col-span-4 space-y-10">
                {/* Search Shard */}
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Search className="text-emerald-400" size={20} />
                      <h4 className="text-lg font-black text-white uppercase italic">Registry <span className="text-emerald-400">Lookup</span></h4>
                   </div>
                   <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      <input 
                        type="text" 
                        value={socialSearch}
                        onChange={e => setSocialSearch(e.target.value)}
                        placeholder="Search by name or ESIN..."
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono"
                      />
                   </div>
                </div>

                {/* Proximity Radar */}
                <div className="glass-card p-10 rounded-[56px] border border-blue-500/20 bg-blue-950/5 space-y-8 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><MapIcon size={200} className="text-blue-400" /></div>
                   <div className="flex items-center gap-4 relative z-10">
                      <div className="p-4 bg-blue-600 rounded-2xl shadow-xl animate-pulse">
                         <Target size={24} className="text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Regional <span className="text-blue-400">Proximity</span></h4>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] relative z-10">Geo-Locked Stewards Nearby</p>
                   <div className="space-y-6 relative z-10">
                      {nearbyStewards.length > 0 ? nearbyStewards.map(stwd => (
                        <div key={stwd.esin} className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedSteward(stwd)}>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                                 <img src={stwd.avatar} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-white uppercase italic">{stwd.name}</p>
                                 <p className="text-[9px] text-slate-500 font-mono">{stwd.location}</p>
                              </div>
                           </div>
                           <button className="p-3 bg-white/5 hover:bg-blue-600 rounded-xl text-slate-500 hover:text-white transition-all shadow-md">
                              <ChevronRight size={14} />
                           </button>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-700 italic text-center py-10 border border-dashed border-white/5 rounded-3xl">"No stewards found within current regional geofence shards."</p>
                      )}
                   </div>
                </div>

                {/* HUD Active Signal */}
                {activeHudLink && (
                  <div className="glass-card p-10 rounded-[56px] border-l-[12px] border-indigo-600 bg-indigo-950/10 space-y-8 shadow-3xl animate-in slide-in-from-left duration-500">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                              <Workflow size={32} />
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active HUD Link</p>
                              <h4 className="text-2xl font-black text-white uppercase italic leading-none mt-2">{activeHudLink.name}</h4>
                           </div>
                        </div>
                        <button onClick={() => setActiveHudLink(null)} className="p-2 text-slate-600 hover:text-rose-500"><X size={20}/></button>
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => setCallMode('audio')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:bg-emerald-600 hover:text-white transition-all flex flex-col items-center gap-2">
                           <Mic size={18} />
                           <span className="text-[7px] font-black uppercase">Talk</span>
                        </button>
                        <button onClick={() => setCallMode('video')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex flex-col items-center gap-2">
                           <VideoIcon size={18} />
                           <span className="text-[7px] font-black uppercase">Video</span>
                        </button>
                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex flex-col items-center gap-2">
                           <Zap size={18} />
                           <span className="text-[7px] font-black uppercase">Shard</span>
                        </button>
                     </div>
                  </div>
                )}
             </div>

             {/* Center Column: Steward Directory or Chat */}
             <div className="lg:col-span-8">
                {activeHudLink && activeTab === 'social' ? (
                  /* THE HUD COMMUNICATION TERMINAL */
                  <div className="glass-card rounded-[80px] border-2 border-indigo-500/20 bg-[#050706] flex flex-col h-[850px] relative overflow-hidden shadow-3xl">
                     <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
                        <div className="w-full h-[3px] bg-indigo-500 absolute top-0 animate-scan"></div>
                     </div>
                     
                     <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center relative z-10 shrink-0">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 rounded-[32px] overflow-hidden border-4 border-indigo-600 shadow-2xl relative group">
                              <img src={activeHudLink.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-indigo-600/10 animate-pulse"></div>
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">HUD <span className="text-indigo-400">Terminal</span></h3>
                              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest mt-3 flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                 LINK_ESTABLISHED // NODE: {activeHudLink.esin}
                              </p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white transition-all"><Settings size={20} /></button>
                           <button onClick={() => setActiveHudLink(null)} className="p-5 bg-rose-600/10 border border-rose-500/30 rounded-2xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-95"><X size={20} /></button>
                        </div>
                     </div>

                     {callMode !== 'none' ? (
                       /* FULL SCREEN CALL OVERLAY */
                       <div className="flex-1 relative flex items-center justify-center bg-black animate-in fade-in duration-700">
                          <div className="absolute inset-0 opacity-40">
                             <img src={activeHudLink.avatar} className="w-full h-full object-cover blur-3xl scale-150" alt="" />
                          </div>
                          <div className="relative z-10 flex flex-col items-center gap-12">
                             <div className="w-64 h-64 rounded-full border-8 border-white/10 overflow-hidden shadow-3xl animate-pulse ring-[32px] ring-white/5">
                                <img src={activeHudLink.avatar} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div className="text-center space-y-4">
                                <h4 className="text-5xl font-black text-white uppercase italic tracking-tighter">{activeHudLink.name}</h4>
                                <div className="flex items-center justify-center gap-4 text-emerald-400 font-black text-xs uppercase tracking-[0.5em] animate-pulse">
                                   <Activity size={24} /> 04:22 // BITRATE: 1.4 MBPS
                                </div>
                             </div>
                             <div className="flex gap-10">
                                <button onClick={() => setCallMode('none')} className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-3xl hover:bg-rose-500 active:scale-90 transition-all border-4 border-white/10">
                                   <X size={32} />
                                </button>
                                <button className="w-24 h-24 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                   <Mic size={32} />
                                </button>
                                {callMode === 'video' && (
                                   <button className="w-24 h-24 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all">
                                      <VideoIcon size={32} />
                                   </button>
                                )}
                             </div>
                          </div>
                       </div>
                     ) : (
                       /* CHAT INTERFACE */
                       <>
                         <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar bg-black/40 flex flex-col">
                            {chatHistory.length === 0 && (
                               <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 opacity-20 group">
                                  <div className="relative">
                                     <MessageCircle size={100} className="text-slate-500 group-hover:text-indigo-400 transition-colors duration-700" />
                                     <div className="absolute inset-[-40px] border-2 border-dashed border-white/10 rounded-full animate-spin-slow"></div>
                                  </div>
                                  <p className="text-2xl font-black uppercase tracking-[0.5em] text-white">Registry Session Private</p>
                               </div>
                            )}
                            {chatHistory.map((chat, i) => (
                               <div key={i} className={`flex ${chat.from === 'Me' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                  <div className={`flex flex-col gap-2 max-w-[75%] ${chat.from === 'Me' ? 'items-end' : 'items-start'}`}>
                                     <div className={`p-6 rounded-[32px] text-lg font-medium italic shadow-2xl relative overflow-hidden ${
                                       chat.from === 'Me' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-black border border-white/10 text-slate-200 rounded-tl-none'
                                     }`}>
                                        <p className="relative z-10">{chat.text}</p>
                                     </div>
                                     <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest px-4">{chat.time} // {chat.from}</span>
                                  </div>
                               </div>
                            ))}
                         </div>

                         <div className="p-10 border-t border-white/5 bg-black/90 relative z-10 shrink-0">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
                               <textarea 
                                 value={chatMessage}
                                 onChange={e => setChatMessage(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage(e))}
                                 placeholder="Enter message shard..."
                                 className="w-full bg-white/5 border border-white/10 rounded-[40px] py-8 pl-10 pr-28 text-lg text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-800 resize-none h-32 shadow-inner italic"
                               />
                               <button 
                                 type="submit"
                                 disabled={!chatMessage.trim()}
                                 className="absolute right-6 bottom-6 p-6 bg-indigo-600 rounded-[32px] text-white shadow-3xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-90"
                               >
                                  <Send size={28} />
                               </button>
                            </form>
                         </div>
                       </>
                     )}
                  </div>
                ) : (
                  /* STEWARD DIRECTORY DISPLAY */
                  <div className="space-y-12 animate-in fade-in duration-700">
                     <div className="flex justify-between items-center px-4 border-b border-white/5 pb-10">
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Peer <span className="text-emerald-400">Node Explorer</span></h3>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] italic">Active_Stewards: {filteredStewards.length}</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {filteredStewards.map((stwd, idx) => (
                           <div key={stwd.esin} className="glass-card p-12 rounded-[72px] border-2 border-white/5 hover:border-emerald-500/40 transition-all group flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[600px] animate-in slide-in-from-bottom-6" style={{animationDelay: `${idx*100}ms`}}>
                              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Fingerprint size={300} /></div>
                              
                              <div className="flex justify-between items-start mb-10 relative z-10">
                                 <div className="w-24 h-24 rounded-[36px] bg-slate-800 border-2 border-white/10 flex items-center justify-center shadow-3xl group-hover:rotate-6 group-hover:scale-105 transition-all overflow-hidden relative">
                                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                                    <img src={stwd.avatar} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="text-right flex flex-col items-end gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-xl transition-all ${
                                       stwd.online ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-600 border-white/5 grayscale'
                                    }`}>{stwd.online ? 'ONLINE_SYNC' : 'OFFLINE'}</span>
                                    <p className="text-[10px] text-slate-700 font-mono font-black italic tracking-tighter">{stwd.esin}</p>
                                 </div>
                              </div>

                              <div className="flex-1 space-y-6 relative z-10">
                                 <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{stwd.name}</h4>
                                 <p className="text-lg text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{stwd.bio}"</p>
                                 
                                 <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-6 bg-black/80 rounded-[44px] border border-white/5 space-y-1 shadow-inner group/val hover:border-emerald-500/20 transition-all">
                                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Resonance</p>
                                       <p className="text-3xl font-mono font-black text-white">{stwd.res}%</p>
                                    </div>
                                    <div className="p-6 bg-black/80 rounded-[44px] border border-white/5 space-y-1 shadow-inner group/val hover:border-blue-500/20 transition-all text-right">
                                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Mutuals</p>
                                       <p className="text-3xl font-mono font-black text-white">{stwd.mutuals}</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="mt-12 pt-10 border-t border-white/5 flex gap-4 relative z-10">
                                 <button 
                                   onClick={() => setSelectedSteward(stwd)}
                                   className="flex-1 py-5 bg-white/5 border border-white/10 rounded-[32px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-md active:scale-95"
                                 >
                                    View Dossier
                                 </button>
                                 <button 
                                   onClick={() => handleSendHudInvite(stwd.esin)}
                                   disabled={hudInvites.includes(stwd.esin)}
                                   className={`flex-[2] py-5 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-4 transition-all active:scale-90 border border-white/10 ${
                                     hudInvites.includes(stwd.esin) ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                   }`}
                                 >
                                    {hudInvites.includes(stwd.esin) ? <Clock size={16}/> : <PlusCircle size={16}/>}
                                    {hudInvites.includes(stwd.esin) ? 'INVITE_PENDING' : 'SEND HUD INVITE'}
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* --- TAB: HERITAGE HUB (COMMUNITY FEED) --- */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700 px-4 md:px-0">
             <div className="lg:col-span-8 space-y-10">
                {/* Broadcast / Post Ingest */}
                <div className="glass-card p-12 rounded-[64px] border-emerald-500/20 bg-emerald-500/5 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[15s] pointer-events-none">
                      <Radio className="w-96 h-96 text-white" />
                   </div>
                   <div className="flex items-center gap-6 mb-10 relative z-10">
                      <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl">
                         <Podcast className="w-8 h-8 text-white" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Heritage <span className="text-emerald-400">Broadcast</span></h3>
                         <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-2">COMMUNITY_SIGNAL_INGEST</p>
                      </div>
                   </div>
                   <textarea 
                    value={postContent} 
                    onChange={(e) => setPostContent(e.target.value)} 
                    placeholder="Share agricultural wisdom or node updates..." 
                    className="w-full bg-black/60 border border-white/10 rounded-[40px] p-10 text-white text-lg font-medium focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none h-48 resize-none shadow-inner italic relative z-10 placeholder:text-slate-900" 
                   />
                   <div className="flex flex-col sm:flex-row justify-between items-center mt-8 relative z-10 gap-6">
                      <div className="flex gap-4">
                         <button className="p-6 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all shadow-md active:scale-95"><FileUp size={24} /></button>
                         <button className="p-6 bg-white/5 border border-white/10 rounded-3xl text-slate-500 hover:text-white transition-all shadow-md active:scale-95"><Hash size={24} /></button>
                      </div>
                      <button 
                        onClick={handlePost}
                        disabled={isPosting || !postContent.trim()}
                        className="w-full sm:w-auto px-20 py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-3xl flex items-center justify-center gap-5 active:scale-95 transition-all disabled:opacity-50 ring-8 ring-white/5 border-2 border-white/10"
                      >
                         {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                         <span>AUTHORIZE BROADCAST</span>
                      </button>
                   </div>
                </div>
                
                {/* Community Shard Stream */}
                <div className="space-y-10">
                   {MOCK_FEED.map((post, idx) => (
                      <div key={post.id} className="glass-card p-12 rounded-[72px] border-2 border-white/5 bg-black/40 shadow-3xl group animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                         <div className="flex justify-between items-start mb-10">
                            <div className="flex items-center gap-8">
                               <div className="w-20 h-20 rounded-[28px] bg-slate-800 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-2xl border-2 border-white/5 group-hover:rotate-6 transition-all">
                                  {post.author[0]}
                               </div>
                               <div>
                                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover:text-emerald-400 transition-colors">{post.author}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono font-black mt-3 uppercase tracking-widest">{post.esin}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-widest">{post.time}</span>
                               <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[8px] font-black text-slate-500">LIVE_SHARD</span>
                               </div>
                            </div>
                         </div>
                         <div className="p-10 bg-white/[0.01] border-l-8 border-l-emerald-500/40 rounded-r-[48px] shadow-inner mb-10">
                            <p className="text-slate-200 text-2xl leading-relaxed italic font-medium">"{post.text}"</p>
                         </div>
                         <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <div className="flex gap-10">
                               <button className="flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:text-rose-500 transition-all group/btn">
                                  <Heart size={20} className="group-hover/btn:fill-current" /> {post.likes}
                               </button>
                               <button className="flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-widest hover:text-blue-400 transition-all group/btn">
                                  <MessageSquareShare size={20} /> {post.shares}
                               </button>
                            </div>
                            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-white transition-all"><MoreVertical size={20} /></button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             {/* Industrial Sidebar Context */}
             <div className="lg:col-span-4 space-y-10">
                <div className="glass-card p-12 rounded-[56px] border border-indigo-500/20 bg-indigo-500/5 space-y-10 shadow-3xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Activity size={300} className="text-indigo-400" /></div>
                   <div className="flex items-center gap-6 relative z-10 border-b border-white/5 pb-8">
                      <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><Globe size={24} className="text-white" /></div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-widest">Global <span className="text-indigo-400">Yield Sync</span></h4>
                   </div>
                   <div className="space-y-8 relative z-10">
                      {[
                        { l: 'Network Resonance', v: '94.2%', i: Waves, c: 'text-indigo-400' },
                        { l: 'Community Voids', v: '0.02', i: Eye, c: 'text-rose-500' },
                        { l: 'EAC Flow Rate', v: '1.4K/h', i: TrendingUp, c: 'text-emerald-400' },
                      ].map(s => (
                        <div key={s.l} className="flex justify-between items-center px-4 py-3 bg-black/40 rounded-2xl border border-white/5 group/s hover:border-white/20 transition-all">
                           <div className="flex items-center gap-4">
                              <s.i size={16} className={s.c} />
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/s:text-slate-300">{s.l}</span>
                           </div>
                           <span className="text-lg font-mono font-black text-white">{s.v}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-12 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <Crown size={24} className="text-amber-500" />
                      <h4 className="text-lg font-black text-white uppercase italic">Active <span className="text-amber-500">Hall of Fame</span></h4>
                   </div>
                   <div className="space-y-6">
                      {MOCK_STEWARDS.slice(0, 3).map((stwd, i) => (
                        <div key={stwd.esin} className="flex items-center justify-between group cursor-pointer" onClick={() => setSelectedSteward(stwd)}>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-amber-400 transition-all shadow-inner">{i+1}</div>
                              <span className="text-sm font-black text-white uppercase italic tracking-tight">{stwd.name}</span>
                           </div>
                           <div className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase rounded border border-amber-500/20">{stwd.res}% RESONANCE</div>
                        </div>
                      ))}
                   </div>
                   <button onClick={() => setActiveTab('social')} className="w-full py-4 mt-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-500 hover:text-white transition-all">VIEW ALL STEWARDS</button>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: SOCIAL SHARDS (CLANS) --- */}
        {activeTab === 'shards' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12 px-8">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Social <span className="text-emerald-400">Sharding Registry</span></h3>
                    <p className="text-slate-500 text-xl font-medium italic opacity-70">Collective mission nodes for cultural and technical synchronization.</p>
                 </div>
                 <button className="px-12 py-5 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all ring-8 ring-emerald-500/5">
                    <PlusCircle size={20} /> Register New Shard Node
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
                 {shards.map(shard => (
                    <div key={shard.id} className="glass-card p-12 rounded-[80px] border-2 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between shadow-3xl bg-black/40 relative overflow-hidden h-[680px]">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Users2 size={300} className="text-emerald-400" /></div>
                       
                       <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className="p-6 rounded-[32px] bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 shadow-2xl group-hover:rotate-6 transition-all">
                             <Users size={40} />
                          </div>
                          <div className="text-right flex flex-col items-end gap-3">
                             <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest">{shard.type}</span>
                             <p className="text-[10px] text-slate-700 font-mono font-black italic">{shard.id}</p>
                          </div>
                       </div>

                       <div className="flex-1 space-y-8 relative z-10">
                          <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-tight group-hover:text-emerald-400 transition-colors drop-shadow-2xl">{shard.name}</h4>
                          <p className="text-lg text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{shard.mission}"</p>
                          
                          <div className="grid grid-cols-2 gap-4 pt-4">
                             <div className="p-8 bg-black/80 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/stat hover:border-emerald-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Resonance</p>
                                <div className="flex items-end gap-2">
                                   <p className="text-4xl font-mono font-black text-white">{shard.resonance}%</p>
                                   <span className="text-[9px] font-black text-emerald-400 mb-1">{shard.trending}</span>
                                </div>
                             </div>
                             <div className="p-8 bg-black/80 rounded-[44px] border border-white/5 space-y-2 shadow-inner group/stat hover:border-blue-500/20 transition-all">
                                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Active Peers</p>
                                <p className="text-4xl font-mono font-black text-white">{shard.memberCount}</p>
                             </div>
                          </div>
                       </div>

                       <div className="mt-12 pt-10 border-t border-white/5 flex flex-col gap-6 relative z-10">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] px-4 text-center">Protocol: {shard.rules}</p>
                          <button 
                            onClick={() => handleJoinShard(shard.id)}
                            className={`w-full py-8 rounded-[40px] font-black text-xs uppercase tracking-[0.4em] shadow-3xl transition-all flex items-center justify-center gap-5 border-2 active:scale-95 ${
                              joinedShards.includes(shard.id) 
                                ? 'bg-rose-600/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' 
                                : 'bg-emerald-600 border-white/10 text-white hover:bg-emerald-500 ring-8 ring-emerald-500/5'
                            }`}
                          >
                             {joinedShards.includes(shard.id) ? <LogOut size={24} /> : <Handshake size={24} />}
                             {joinedShards.includes(shard.id) ? 'LEAVE_SHARD_QUORUM' : 'JOIN_SOCIAL_SHARD'}
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- TAB: LEARNING HUB (LMS) --- */}
        {activeTab === 'lms' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-1000 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 px-8">
                 <div className="flex p-2 glass-card rounded-full bg-black/40 border border-white/5 shadow-inner">
                    <button onClick={() => setLmsSubTab('modules')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${lmsSubTab === 'modules' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>COURSE_TRACKS</button>
                    <button onClick={() => setLmsSubTab('exams')} className={`px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${lmsSubTab === 'exams' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>CERTIFICATIONS</button>
                 </div>
                 <div className="flex items-center gap-4 px-8 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-inner">
                    <History size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aggregate Progress: 38%</span>
                 </div>
              </div>

              {lmsSubTab === 'modules' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
                    {LMS_MODULES.map(mod => (
                       <div key={mod.id} className="p-10 glass-card rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/40 transition-all group flex flex-col gap-10 shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300">
                          <div className="flex justify-between items-start relative z-10">
                             <div className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${mod.col} group-hover:rotate-6 transition-transform shadow-inner`}>
                                <FileText size={40} />
                             </div>
                             <div className="text-right space-y-2">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest shadow-lg ${mod.special ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40' : 'bg-white/5 text-slate-500 border-white/10'}`}>
                                   {mod.category.toUpperCase()}
                                </span>
                                <p className="text-[9px] text-slate-700 font-mono font-black italic">{mod.id}</p>
                             </div>
                          </div>
                          <div className="flex-1 space-y-6 relative z-10">
                             <h4 className="text-4xl font-black text-white uppercase italic m-0 tracking-tighter group-hover:text-indigo-400 transition-colors leading-none">{mod.title}</h4>
                             <p className="text-slate-400 text-xl font-medium italic opacity-80 leading-relaxed line-clamp-3">"{mod.desc}"</p>
                             <div className="space-y-4 pt-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">
                                   <span>Completion Shard</span>
                                   <span className="text-white font-mono">{mod.progress}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                                   <div className={`h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-[2.5s]`} style={{ width: `${mod.progress}%` }}></div>
                                </div>
                             </div>
                          </div>
                          <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                             <div className="flex items-center gap-3">
                                <Coins size={20} className="text-emerald-500" />
                                <span className="text-2xl font-mono font-black text-white">+{mod.eac} <span className="text-xs text-slate-700">EAC</span></span>
                             </div>
                             <button className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[32px] text-[11px] font-black text-white uppercase tracking-[0.4em] shadow-xl transition-all active:scale-90">INITIALIZE MODULE</button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {lmsSubTab === 'exams' && (
                 <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in duration-500 px-6">
                    <div className="p-16 md:p-24 glass-card rounded-[80px] border-2 border-indigo-500/30 bg-black/60 shadow-[0_40px_150px_rgba(0,0,0,0.9)] text-center space-y-16 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-[15s] pointer-events-none"><Stamp size={500} className="text-indigo-400" /></div>
                       
                       {examStep === 'intro' && (
                          <div className="space-y-12 relative z-10 animate-in slide-in-from-bottom-6">
                             <div className="w-40 h-40 bg-indigo-600 rounded-[56px] flex items-center justify-center text-white mx-auto shadow-3xl animate-float border-4 border-white/10 group-hover:rotate-12 transition-all">
                                <Stamp size={80} className="relative z-10" />
                             </div>
                             <div className="space-y-4">
                                <h3 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">STEWARD <span className="text-indigo-400">CERTIFICATION</span></h3>
                                <p className="text-slate-400 text-3xl font-medium italic opacity-80 leading-relaxed max-w-3xl mx-auto">
                                   "Anchor your expertise into the global industrial ledger. Pass the Science Oracle exam to unlock high-tier sharding missions."
                                </p>
                             </div>
                             <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                                <button 
                                  onClick={() => setExamStep('payment')}
                                  className="px-24 py-10 agro-gradient rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                                >
                                   INITIALIZE EXAM SHARD
                                </button>
                             </div>
                          </div>
                       )}

                       {examStep === 'payment' && (
                          <div className="space-y-16 relative z-10 animate-in slide-in-from-right-10 duration-700 w-full max-w-2xl mx-auto">
                             <div className="space-y-4">
                                <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Authorization <span className="text-indigo-400">Ledger</span></h4>
                                <p className="text-slate-500 text-xl italic leading-relaxed">"Authorized sharding fee required for Oracle synthesis."</p>
                             </div>
                             
                             <div className="p-12 bg-black/80 rounded-[64px] border-2 border-indigo-500/20 shadow-inner space-y-12">
                                <div className="flex justify-between items-center px-6">
                                   <div className="text-left space-y-1">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Examination Topic</p>
                                      <p className="text-2xl font-black text-white uppercase italic tracking-tight">{examTopic}</p>
                                   </div>
                                   <div className="h-16 w-px bg-white/5"></div>
                                   <div className="text-right space-y-1">
                                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none">Sharding Fee</p>
                                      <p className="text-4xl font-mono font-black text-emerald-400 tracking-tighter">{EXAM_FEE} EAC</p>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4">Node Signature (ESIN)</p>
                                   <input 
                                      type="text" 
                                      value={esinSign}
                                      onChange={e => setEsinSign(e.target.value)}
                                      placeholder="EA-XXXX-XXXX-XXXX"
                                      className="w-full bg-black border-2 border-white/10 rounded-[40px] py-10 text-center text-5xl font-mono text-white tracking-[0.2em] focus:ring-8 focus:ring-indigo-500/10 outline-none transition-all uppercase placeholder:text-slate-900 shadow-inner" 
                                   />
                                </div>
                             </div>

                             <div className="flex gap-6 pt-4">
                                <button onClick={() => setExamStep('intro')} className="flex-1 py-10 bg-white/5 border border-white/10 rounded-[48px] text-slate-500 font-black text-sm uppercase tracking-widest hover:text-white transition-all shadow-xl active:scale-95">Abort Shard</button>
                                <button 
                                  onClick={handleAuthorizeExam}
                                  disabled={!esinSign}
                                  className="flex-[2] py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[48px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(99,102,241,0.4)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30 transition-all border-4 border-white/10 ring-[16px] ring-white/5"
                                >
                                   <Key className="w-8 h-8 fill-current" /> AUTHORIZE INGEST
                                </button>
                             </div>
                          </div>
                       )}

                       {examStep === 'generation' && (
                          <div className="flex flex-col items-center justify-center space-y-16 py-20 text-center animate-in zoom-in duration-500 min-h-[400px]">
                             <div className="relative">
                                <Loader2 size={120} className="text-indigo-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <Bot className="w-16 h-16 text-indigo-400 animate-pulse" />
                                </div>
                             </div>
                             <div className="space-y-6">
                                <p className="text-indigo-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0 drop-shadow-2xl">SYNTHESIZING EXAM SHARDS...</p>
                                <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">EOS_ORACLE_V5 // SEQUENCING_CERT_LOGIC</p>
                             </div>
                          </div>
                       )}

                       {examStep === 'active' && examQuestions[currentQuestion] && (
                          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 flex flex-col justify-center min-h-[500px]">
                             <div className="flex justify-between items-center mb-10 px-6">
                                <div className="flex items-center gap-6">
                                   <span className="text-7xl font-black text-indigo-500/20 italic font-mono font-black leading-none">0{currentQuestion + 1}</span>
                                   <div className="h-10 w-px bg-white/10"></div>
                                   <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{examQuestions[currentQuestion].category} SHARD</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[10px] text-slate-700 font-black uppercase mb-1">Time Remaining</p>
                                   <div className="px-5 py-2 bg-black rounded-xl border border-rose-500/30 font-mono text-rose-500 text-xl font-black">04:52</div>
                                </div>
                             </div>

                             <div className="p-12 md:p-20 bg-white/[0.01] border-l-[16px] border-l-indigo-600 rounded-r-[64px] border border-white/5 shadow-inner text-left relative overflow-hidden group/q">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover/q:scale-110 transition-transform duration-[15s]"><Database size={400} /></div>
                                <h4 className="text-4xl md:text-5xl font-black text-slate-100 uppercase italic tracking-tighter m-0 leading-tight relative z-10">
                                   "{examQuestions[currentQuestion].q}"
                                </h4>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                                {examQuestions[currentQuestion].options.map((opt: string, i: number) => (
                                   <button 
                                      key={i}
                                      onClick={() => handleAnswerSelect(i)}
                                      className="p-10 glass-card bg-black/60 border-2 border-white/5 rounded-[48px] text-xl font-medium text-slate-300 hover:border-indigo-500 hover:text-white hover:bg-indigo-600/5 transition-all text-left group flex items-start gap-8 shadow-2xl active:scale-[0.98]"
                                   >
                                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-black text-slate-700 group-hover:text-indigo-400 group-hover:border-indigo-500/40 transition-all shadow-inner">
                                         {['A', 'B', 'C', 'D'][i]}
                                      </div>
                                      <span className="italic leading-relaxed">{opt}</span>
                                   </button>
                                ))}
                             </div>
                          </div>
                       )}

                       {examStep === 'grading' && (
                          <div className="flex flex-col items-center justify-center space-y-12 py-20 text-center animate-in zoom-in duration-500 min-h-[400px]">
                             <div className="relative">
                                <Loader2 className="w-120 h-120 text-emerald-500 animate-spin mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <ShieldCheck className="w-16 h-16 text-emerald-400 animate-pulse" />
                                </div>
                             </div>
                             <p className="text-emerald-400 font-black text-3xl uppercase tracking-[0.6em] animate-pulse italic m-0">GRADING SHARD RESPONSE...</p>
                          </div>
                       )}

                       {examStep === 'results' && examResult && (
                          <div className="space-y-16 py-10 animate-in zoom-in duration-1000 flex flex-col items-center justify-center text-center">
                             <div className={`w-64 h-64 rounded-full flex items-center justify-center shadow-[0_0_200px_current] relative group scale-110 ${examResult.passed ? 'agro-gradient text-white' : 'bg-rose-950/20 border-4 border-rose-500/30 text-rose-500'}`}>
                                {examResult.passed ? <CheckCircle2 size={120} /> : <AlertTriangle size={120} />}
                                <div className={`absolute inset-[-20px] rounded-full border-4 animate-ping opacity-30 ${examResult.passed ? 'border-emerald-500' : 'border-rose-500'}`}></div>
                             </div>

                             <div className="space-y-6">
                                <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none">
                                   {examResult.passed ? 'SHARD ANCHORED.' : 'SYNC FAILED.'}
                                </h3>
                                <div className="flex items-center justify-center gap-8 pt-4">
                                   <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 min-w-[200px] shadow-inner">
                                      <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Final Score</p>
                                      <p className={`text-6xl font-mono font-black ${examResult.passed ? 'text-emerald-400' : 'text-rose-500'}`}>{examResult.percentage}%</p>
                                   </div>
                                   <div className="p-8 bg-black/60 rounded-[40px] border border-white/5 min-w-[200px] shadow-inner">
                                      <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Steward Status</p>
                                      <p className="text-3xl font-black text-white uppercase italic">{examResult.passed ? 'CERTIFIED' : 'PROVISIONAL'}</p>
                                   </div>
                                </div>
                             </div>

                             {examResult.passed ? (
                                <div className="w-full max-w-2xl glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-3xl">
                                   <p className="text-slate-300 text-xl italic font-medium leading-relaxed">
                                      "Expertise successfully sharded to the EOS industrial registry. Node multiplier increased by **+0.15x**. Bounty anchored."
                                   </p>
                                   <div className="flex gap-4">
                                      <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                                         <Download size={18} /> DOWNLOAD CERT SHARD
                                      </button>
                                      <button onClick={() => setExamStep('intro')} className="flex-1 py-6 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">DONE</button>
                                   </div>
                                </div>
                             ) : (
                                <div className="w-full max-w-2xl space-y-10">
                                   <div className="p-10 glass-card rounded-[56px] border-rose-500/20 bg-rose-500/5 space-y-6">
                                      <h4 className="text-xl font-black text-rose-500 uppercase italic">Remediation Protocol</h4>
                                      <p className="text-slate-400 text-lg italic">"Registry consensus not reached. Minimum mastery threshold is 80%."</p>
                                   </div>
                                   {studyResources && (
                                      <div className="p-10 glass-card rounded-[56px] border border-blue-500/20 bg-blue-500/5 text-left space-y-8 animate-in slide-in-from-bottom-6">
                                         <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <Sparkles className="w-5 h-5 text-blue-400" />
                                            <h5 className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Study Shard Recommendation</h5>
                                         </div>
                                         <div className="text-slate-300 text-sm leading-relaxed italic whitespace-pre-line font-medium border-l-2 border-blue-500/20 pl-6">
                                            {studyResources.text}
                                         </div>
                                      </div>
                                   )}
                                   <button onClick={() => setExamStep('intro')} className="w-full py-8 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl">Return to Hub</button>
                                </div>
                             )}
                          </div>
                       )}
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* --- TAB: SEHTI MANUAL (CORE DOCS) --- */}
        {activeTab === 'manual' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 animate-in slide-in-from-left-4 duration-700 px-4 md:px-0">
             <div className="lg:col-span-1 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><BookOpen size={24} className="text-white" /></div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Registry <span className="text-emerald-400">Chapters</span></h3>
                   </div>
                   <div className="space-y-4">
                      {CHAPTERS.map(ch => (
                        <button 
                          key={ch.id} 
                          onClick={() => setSelectedChapter(ch)}
                          className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center justify-between group ${selectedChapter.id === ch.id ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-xl scale-105' : 'bg-black/60 border-white/5 text-slate-500 hover:border-emerald-500/20'}`}
                        >
                           <div className="flex items-center gap-4">
                              <ch.icon size={20} className={selectedChapter.id === ch.id ? 'text-emerald-400' : 'text-slate-700 group-hover:rotate-12 transition-transform'} />
                              <span className="text-xs font-black uppercase tracking-widest">{ch.title}</span>
                           </div>
                           {selectedChapter.id === ch.id && <ChevronRight size={20} className="animate-pulse" />}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-blue-500/10 bg-blue-500/5 space-y-6 group">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-5 h-5 text-blue-400" />
                       <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest italic">Immutable Doctrine</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                       "The SEHTI Manual is the supreme protocol for all node sharding. Adherence is non-optional for Tier 1 Stewards."
                    </p>
                </div>
             </div>

             <div className="lg:col-span-3">
                <div className="glass-card p-12 md:p-24 rounded-[80px] border-2 border-white/5 bg-black/20 h-full flex flex-col relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] group/doc">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[15s] pointer-events-none">
                      <selectedChapter.icon size={600} className="text-emerald-500" />
                   </div>
                   
                   <div className="relative z-10 space-y-12">
                      <div className="flex justify-between items-start">
                         <div className="space-y-4">
                            <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase rounded-full border border-emerald-500/20 tracking-widest shadow-inner">SHARD_CHAPTER_0{selectedChapter.id}</span>
                            <h2 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter m-0 leading-none group-hover/doc:text-emerald-400 transition-colors drop-shadow-2xl">{selectedChapter.title}</h2>
                         </div>
                         <button className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-700 hover:text-white transition-all shadow-xl active:scale-90"><Share2 size={24} /></button>
                      </div>

                      <div className="p-12 md:p-20 bg-black/40 rounded-[64px] border border-white/10 relative overflow-hidden shadow-inner group/p">
                         <div className="absolute top-10 left-10 opacity-20 text-emerald-500 group-hover/p:scale-110 transition-transform">
                           <Quote size={60} />
                         </div>
                         <p className="text-slate-200 text-2xl md:text-5xl italic leading-relaxed font-medium border-l-[12px] border-l-emerald-600/40 font-serif relative z-10 pl-12 md:pl-20">
                            {selectedChapter.content}
                         </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-slate-700 group-hover/doc:text-indigo-400 transition-colors">
                               <Stamp size={28} />
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Last Registry Revision</p>
                               <p className="text-xl font-mono font-black text-white uppercase">2024.12.14 // EOS_v6</p>
                            </div>
                         </div>
                         <button className="px-12 py-6 bg-white/5 hover:bg-emerald-600 rounded-[36px] text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-4">
                            <Download size={20} /> Export Markdown Shard
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- TAB: PERFORMANCE REPORT (COMMUNITY ANALYTICS) --- */}
        {activeTab === 'report' && (
           <div className="space-y-16 animate-in zoom-in duration-700 px-4 md:px-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8 glass-card p-12 rounded-[64px] border-2 border-white/5 bg-black/40 relative overflow-hidden flex flex-col shadow-3xl group">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none overflow-hidden">
                       <div className="w-full h-[2px] bg-indigo-500/20 absolute top-0 animate-scan"></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 relative z-10 px-4 gap-8">
                       <div className="flex items-center gap-8">
                          <div className="p-6 bg-indigo-600 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                             <BarChart4 className="w-10 h-10 text-white" />
                          </div>
                          <div>
                             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Network <span className="text-indigo-400">Vitality Map</span></h3>
                             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-4">EOS_AGGREGATE_SOCIAL_SYMMETRY</p>
                          </div>
                       </div>
                       <div className="text-right border-l-4 border-indigo-500/20 pl-8">
                          <p className="text-[11px] text-slate-600 font-black uppercase mb-2 tracking-widest">Global Resonance</p>
                          <p className="text-8xl font-mono font-black text-emerald-400 tracking-tighter leading-none drop-shadow-2xl italic">94<span className="text-3xl font-sans italic ml-1">.2%</span></p>
                       </div>
                    </div>

                    <div className="flex-1 min-h-[450px] w-full relative z-10 p-10 bg-black/80 rounded-[56px] border border-white/5 shadow-inner">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Societal', val: 82, color: '#f43f5e' },
                            { name: 'Enviro', val: 94, color: '#10b981' },
                            { name: 'Human', val: 76, color: '#14b8a6' },
                            { name: 'Tech', val: 88, color: '#3b82f6' },
                            { name: 'Industry', val: 91, color: '#818cf8' },
                          ]}>
                             <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                             <XAxis dataKey="name" stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <YAxis stroke="rgba(128,128,128,0.4)" fontSize={11} fontStyle="italic" axisLine={false} tickLine={false} />
                             <Tooltip contentStyle={{ backgroundColor: '#050706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                             <Bar dataKey="val" radius={[15, 15, 0, 0]} barSize={80}>
                                {[1,2,3,4,5].map((_, i) => (
                                  <Cell key={i} fill={['#f43f5e', '#10b981', '#14b8a6', '#3b82f6', '#818cf8'][i]} />
                                ))}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="lg:col-span-4 space-y-10 flex flex-col justify-between">
                    <div className="glass-card p-12 rounded-[64px] border-2 border-indigo-500/20 bg-indigo-950/10 flex flex-col justify-center items-center text-center space-y-10 group shadow-3xl relative overflow-hidden flex-1">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-[12s]"><Bot size={400} className="text-indigo-400" /></div>
                       <div className="w-28 h-28 bg-indigo-600 rounded-[44px] flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.3)] border-4 border-white/10 relative z-10 group-hover:scale-110 transition-transform duration-700 animate-float">
                          <Bot size={56} className="text-white" />
                       </div>
                       <div className="space-y-6 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Oracle <span className="text-indigo-400">Insights</span></h4>
                          <p className="text-slate-400 text-xl font-medium italic leading-relaxed px-8">"Network resonance is peaking. 12% boost in C(a) index observed across all regional social clusters."</p>
                       </div>
                       <div className="p-10 bg-black/60 rounded-[48px] border border-indigo-500/20 w-[90%] relative z-10 shadow-inner group-hover:border-indigo-400 transition-colors">
                          <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest mb-3">Sync Confidence</p>
                          <p className="text-6xl font-mono font-black text-indigo-400 tracking-tighter leading-none">99<span className="text-2xl italic font-sans text-indigo-700 ml-1">.8%</span></p>
                       </div>
                    </div>

                    <div className="p-12 glass-card rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-xl relative overflow-hidden group/m">
                       <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover/m:rotate-12 transition-transform duration-1000"><Zap size={120} className="text-emerald-400" /></div>
                       <div className="flex items-center gap-6 relative z-10">
                          <TrendingUp className="w-8 h-8 text-emerald-400" />
                          <h4 className="text-xl font-black text-white uppercase italic">Reputation Shards</h4>
                       </div>
                       <div className="flex items-baseline gap-4 relative z-10">
                          <p className="text-7xl font-mono font-black text-white tracking-tighter leading-none">4,281</p>
                          <span className="text-2xl font-black text-emerald-500 italic uppercase">Global High</span>
                       </div>
                       <p className="text-slate-500 text-sm italic leading-relaxed relative z-10 border-l-2 border-emerald-500/20 pl-6">
                          "Collectively anchoring 124M EAC shards across the heritage registry."
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* STEWARD DOSSIER MODAL (SOCIAL VIEW) */}
      {selectedSteward && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedSteward(null)}></div>
           <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-[0_0_200px_rgba(16,185,129,0.2)] animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="p-12 md:p-16 border-b border-white/5 bg-emerald-600/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-[32px] overflow-hidden border-2 border-emerald-500 shadow-2xl relative group">
                       <img src={selectedSteward.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Steward <span className="text-emerald-400">Social Dossier</span></h3>
                       <p className="text-emerald-400/60 text-[10px] font-mono tracking-widest uppercase mt-3">REGISTRY_ID: {selectedSteward.esin}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSteward(null)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 md:p-16 space-y-12 custom-scrollbar bg-black/40">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-black/60 border border-white/5 rounded-[40px] space-y-3 shadow-inner group/d hover:border-emerald-500/20 transition-all">
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Regional Hub</p>
                       <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-emerald-500" />
                          <p className="text-lg font-bold text-white uppercase italic">{selectedSteward.location}</p>
                       </div>
                    </div>
                    <div className="p-8 bg-black/60 border border-white/5 rounded-[40px] space-y-3 shadow-inner group/d hover:border-blue-500/20 transition-all">
                       <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Identity Shard</p>
                       <div className="flex items-center gap-3">
                          <CircleDot size={16} className="text-blue-400" />
                          <p className="text-lg font-bold text-white uppercase italic">{selectedSteward.gender || 'Not Specified'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-indigo-950/10 border-2 border-indigo-500/20 rounded-[56px] space-y-8 shadow-3xl group/social relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover/social:scale-110 transition-transform"><Users2 size={120} /></div>
                    <div className="flex items-center gap-4 relative z-10">
                       <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400"><History size={20} /></div>
                       <h4 className="text-xl font-black text-white uppercase italic">Social <span className="text-indigo-400">Accelerator</span></h4>
                    </div>
                    <div className="flex items-baseline gap-4 relative z-10">
                       <p className="text-6xl font-mono font-black text-white tracking-tighter">{selectedSteward.mutuals || 0}</p>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Mutual Peer Nodes</p>
                    </div>
                    <p className="text-sm text-slate-400 italic leading-relaxed relative z-10 pl-6 border-l-2 border-indigo-500/30">
                       "{selectedSteward.bio || 'Steward identity registry synced but bio shard is currently empty.'}"
                    </p>
                 </div>

                 <div className="p-10 glass-card rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                       <Target size={18} className="text-emerald-400" />
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SOCIAL_RESONANCE_METRICS</h4>
                    </div>
                    <div className="flex justify-between items-center px-4">
                       <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Consensus Factor</span>
                       <span className="text-2xl font-mono font-black text-white">{selectedSteward.res}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5">
                       <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: `${selectedSteward.res}%` }}></div>
                    </div>
                 </div>
              </div>
              <div className="p-12 border-t border-white/5 bg-black/80 flex gap-6 shrink-0">
                 <button 
                   onClick={() => handleSendHudInvite(selectedSteward.esin)}
                   disabled={hudInvites.includes(selectedSteward.esin)}
                   className="flex-1 py-7 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                 >
                    {hudInvites.includes(selectedSteward.esin) ? <Clock size={20}/> : <SmartphoneNfc size={20}/>}
                    {hudInvites.includes(selectedSteward.esin) ? 'INVITE_PENDING' : 'INITIATE HUD LINK'}
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Community;