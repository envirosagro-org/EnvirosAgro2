import React, { useState, useEffect, useMemo } from 'react';
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
  // Added missing Send import
  Send
} from 'lucide-react';
import { User } from '../types';
import { generateAgroExam, getGroundedAgroResources, AIResponse } from '../services/geminiService';

interface CommunityProps {
  user: User;
  // Added isGuest prop to match usage in App.tsx
  isGuest: boolean;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
}

const CHAPTERS = [
  { id: 1, title: "The SEHTI Philosophy", icon: Heart, content: "Agriculture is not just land management; it is a complex system of human psychology, social structures, and scientific data. SEHTI integrates five core thrusts to achieve 100% sustainability. Our goal is to minimize Stress (S) while maximizing Density (Dn) and Intensity (In) through Cumulative (Ca) efforts." },
  { id: 2, title: "Industrial Optimization (I)", icon: Factory, content: "The 'I' pillar focuses on industrial optimization. By leveraging decentralized ledgers (ESIN), we create an immutable record of agricultural output, carbon capture, and resource efficiency. Every action on the field is sharded and validated by peer nodes." },
  { id: 3, title: "Agro Code C(a) Biometrics", icon: Binary, content: "The C(a) is the core biometric of your land. It is calculated based on cumulative sustainable practices. Maintaining high resonance in your local node branch requires regular spectral auditing and bio-signal synchronization via the Registry Handshake." },
  { id: 4, title: "m-Constant Resilience", icon: Activity, content: "The sustainable time constant (m) represents your node's ability to resist external volatility. Calculated as the square root of productivity over stress, it determines your institutional multiplier for EAC mining." },
];

const LMS_MODULES = [
  { id: 'mod-1', title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false, progress: 100 },
  { id: 'mod-2', title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true, progress: 45 },
  { id: 'mod-3', title: "SID Pathogen Identification", category: "Societal", eac: 100, col: "text-rose-400", special: false, progress: 0 },
  { id: 'mod-4', title: "Total Quality Management (TQM)", category: "Industrial", eac: 200, col: "text-indigo-400", special: true, progress: 0 },
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
  }
];

const MOCK_FEED = [
  { id: 'P-1', author: 'Steward Alpha', esin: 'EA-ALPHA-88', text: 'Just completed a successful 432Hz sonic sweep on Sector 4. m-Constant increased by 0.05x!', time: '2h ago', likes: 12, shares: 3 },
  { id: 'P-2', author: 'Gaia Green', esin: 'EA-GAIA-02', text: 'Discovered a rare Bantu Sun-Orchid cluster. Documenting for the Agrowild archive.', time: '5h ago', likes: 45, shares: 12 },
  { id: 'P-3', author: 'Nexus Admin', esin: 'EA-CORE-HQ', text: 'System Update: Registry Handshake v5.2 is now rolling out to all regional hubs.', time: '1d ago', likes: 120, shares: 42 },
];

const EXAM_FEE = 50;
const EXAM_REWARD_BOUNTY = 500;

// Added isGuest to destructured props
const Community: React.FC<CommunityProps> = ({ user, isGuest, onEarnEAC, onSpendEAC, onContribution }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'shards' | 'lms' | 'manual' | 'report'>('hub');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams'>('modules');
  
  const [shards, setShards] = useState(INITIAL_SOCIAL_SHARDS);
  const [activeShard, setActiveShard] = useState<any | null>(null);
  const [joinedShards, setJoinedShards] = useState<string[]>(['SHD-104']); 

  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
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
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl px-4">
        {[
          { id: 'hub', name: 'HERITAGE HUB', icon: Globe },
          { id: 'shards', name: 'SOCIAL SHARDS', icon: Users2 },
          { id: 'lms', name: 'LEARNING HUB', icon: Library },
          { id: 'manual', name: 'SEHTI MANUAL', icon: BookOpen },
          { id: 'report', name: 'PERFORMANCE', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)} 
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.name}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {/* --- HUB TAB --- */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
             <div className="lg:col-span-8 space-y-8">
                {/* Broadcast Box */}
                <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:rotate-12 transition-transform duration-[10s]"><MessageSquare className="w-48 h-48" /></div>
                   <h3 className="text-xl font-black text-white mb-6 flex items-center gap-4 italic uppercase relative z-10"><MessageSquare className="w-5 h-5 text-emerald-400" /> Community Broadcast</h3>
                   <textarea 
                    value={postContent} 
                    onChange={(e) => setPostContent(e.target.value)} 
                    placeholder="Share agricultural wisdom or node updates..." 
                    className="w-full bg-black/60 border border-white/10 rounded-3xl p-8 text-white text-base focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none h-48 resize-none shadow-inner italic relative z-10" 
                   />
                   <div className="flex justify-between items-center mt-6 relative z-10">
                      <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shadow-md active:scale-95"><Upload className="w-5 h-5" /></button>
                      <button 
                        onClick={handlePost}
                        disabled={isPosting || !postContent.trim()}
                        className="px-16 py-4 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                      >
                         {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
                         <span>Broadcast Signal</span>
                      </button>
                   </div>
                </div>
                
                {/* MOCK_FEED rendering */}
                <div className="space-y-6">
                   {MOCK_FEED.map(post => (
                      <div key={post.id} className="glass-card p-8 rounded-[40px] border border-white/5 bg-black/40 space-y-6">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 font-black">
                                  {post.author[0]}
                               </div>
                               <div>
                                  <h4 className="text-white font-black text-sm uppercase tracking-widest">{post.author}</h4>
                                  <p className="text-[10px] text-slate-500 font-mono uppercase">{post.esin}</p>
                               </div>
                            </div>
                            <span className="text-[10px] text-slate-700 font-mono font-black">{post.time}</span>
                         </div>
                         <p className="text-slate-300 text-lg italic leading-relaxed">"{post.text}"</p>
                         <div className="flex gap-6 pt-4 border-t border-white/5">
                            <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-emerald-400 transition-colors">
                               <ThumbsUp size={14} /> {post.likes}
                            </button>
                            <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-blue-400 transition-colors">
                               <MessageSquareShare size={14} /> {post.shares}
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
             
             {/* Sidebar widgets */}
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[48px] border border-emerald-500/20 bg-emerald-500/5 space-y-8">
                   <h4 className="text-xl font-black text-white uppercase italic">Active <span className="text-emerald-400">Stats</span></h4>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Stewards</span>
                         <span className="text-xl font-mono font-black text-white">1,242</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Yield</span>
                         <span className="text-xl font-mono font-black text-emerald-400">14.2k EAC</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Other tabs placeholders to make it valid TSX */}
        {(activeTab === 'shards' || activeTab === 'lms' || activeTab === 'manual' || activeTab === 'report') && (
           <div className="py-40 text-center opacity-20 italic uppercase tracking-[0.5em] font-black text-slate-500">
              {activeTab.replace('_', ' ').toUpperCase()} Node Standby.
           </div>
        )}
      </div>
    </div>
  );
};

// Added missing default export to resolve "Module has no default export" error
export default Community;