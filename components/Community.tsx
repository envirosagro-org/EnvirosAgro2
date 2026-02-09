
import React, { useState, useEffect, useMemo, useRef } from 'react';
/* Import all icons as LucideIcons to fix the "Cannot find name 'LucideIcons'" error on line 700 */
import * as LucideIcons from 'lucide-react';
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
  LineChart as LineChartIcon,
  ImageIcon,
  Volume2,
  Paperclip,
  UserCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { User, ViewState, Collective, SocialPost, PostComment, StewardConnection } from '../types';
import { generateAgroExam, getGroundedAgroResources, chatWithAgroExpert, AIResponse } from '../services/geminiService';
import { listenToCollection, saveCollectionItem, dispatchNetworkSignal } from '../services/firebaseService';

interface CommunityProps {
  user: User;
  isGuest: boolean;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
}

const LMS_MODULES = [
  { id: 'mod-1', title: "EOS Framework Fundamentals", category: "Theoretical", eac: 50, col: "text-emerald-400", special: false, progress: 100, desc: "A comprehensive introduction to the SEHTI pillars and registry architecture." },
  { id: 'mod-2', title: "m-Constant Resilience Logic", category: "Technical", eac: 150, col: "text-blue-400", special: true, progress: 45, desc: "Deep dive into the mathematical derivation of industrial stability and yield multipliers." },
];

const INITIAL_COLLECTIVES: Collective[] = [
  { 
    id: 'SHD-882', name: 'BANTU SOIL GUARDIANS', adminEsin: 'EA-ADMIN-X1', adminName: 'Chief Steward', memberCount: 142, resonance: 94, 
    rules: 'PROTOCOL: REQUIRES VERIFIED TIER 2 STATUS.', type: 'HERITAGE_CLAN', 
    mission: 'Preserving drought-resistant lineage seeds through collective sharding.', trending: '+2.4%',
    status: 'QUALIFIED', members: [], treasuryBalance: 12400, activeMissions: ['MIS-882'],
    /* Added missing description to fix error on line 48 */
    description: 'A collective dedicated to ancestral soil guardianship.'
  },
  { 
    id: 'SHD-104', name: 'NEO-HYDROPONIC GUILD', adminEsin: 'EA-TECH-G4', adminName: 'Dr. Hydro', memberCount: 85, resonance: 88, 
    rules: 'PROTOCOL: OPEN FOR ALL CEA-CERTIFIED STEWARDS.', type: 'TECHNICAL_GUILD', 
    mission: 'Optimizing nutrient delivery shards across urban vertical stacks.', trending: '+8.1%',
    status: 'VERIFIED', members: [], treasuryBalance: 4500, activeMissions: [],
    /* Added missing description to fix error on line 54 */
    description: 'Technical specialists in high-efficiency hydroponic sharding.'
  },
];

const MOCK_STEWARDS = [
  { esin: 'EA-ALPH-8821', name: 'Steward Alpha', role: 'Soil Expert', location: 'Nairobi, Kenya', res: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', online: true, skills: ['Bantu Soil Sharding'] },
  { esin: 'EA-GAIA-1104', name: 'Gaia Green', role: 'Genetics Analyst', location: 'Omaha, USA', res: 92, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150', online: false, skills: ['DNA Sequencing'] },
];

const Community: React.FC<CommunityProps> = ({ user, isGuest, onEarnEAC, onSpendEAC, onContribution, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'social' | 'shards' | 'lms' | 'network'>('social');
  const [lmsSubTab, setLmsSubTab] = useState<'modules' | 'exams' | 'forge'>('modules');
  
  // Real-time Collections
  const [collectives, setCollectives] = useState<Collective[]>(INITIAL_COLLECTIVES);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [connections, setConnections] = useState<StewardConnection[]>([]);
  
  // Modals & UI States
  const [showCreateCollective, setShowCreateCollective] = useState(false);
  const [showProfileView, setShowProfileView] = useState<string | null>(null); // ESIN
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postMedia, setPostMedia] = useState<{type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT', url: string} | null>(null);

  // Collective Creation State
  const [newCollName, setNewCollName] = useState('');
  const [newCollDesc, setNewCollDesc] = useState('');
  const [newCollType, setNewCollType] = useState<Collective['type']>('TECHNICAL_GUILD');
  /* Added esinSign state to fix "Cannot find name 'esinSign'" on line 582 */
  const [esinSign, setEsinSign] = useState('');

  // Exam States
  const [examStep, setExamStep] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examQuestions, setExamQuestions] = useState<any[]>([]);

  // Messenger / Signal Integration
  const [showChat, setShowChat] = useState<string | null>(null); // ESIN
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const unsubPosts = listenToCollection('social_posts', (data) => setPosts(data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())));
    const unsubColl = listenToCollection('collectives', (data) => setCollectives([...INITIAL_COLLECTIVES, ...data]));
    const unsubConn = listenToCollection('connections', setConnections);
    return () => { unsubPosts(); unsubColl(); unsubConn(); };
  }, []);

  const isAgroWorker = user.role.toLowerCase().includes('worker') || user.role.toLowerCase().includes('expert') || user.role.toLowerCase().includes('engineer');

  const handleCreateCollective = async () => {
    if (!isAgroWorker) {
      alert("ROLE_RESTRICTION: Only verified Agro Workers can initialize Collective Nodes.");
      return;
    }
    const fee = 250;
    if (!await onSpendEAC(fee, 'COLLECTIVE_NODE_INITIALIZATION')) return;

    const newColl: Collective = {
      id: `SHD-${Math.random().toString(36).substring(7).toUpperCase()}`,
      name: newCollName,
      adminEsin: user.esin,
      adminName: user.name,
      description: newCollDesc,
      memberCount: 1,
      resonance: 100,
      type: newCollType,
      rules: 'Standard SEHTI Compliance',
      mission: 'Community-driven sustainability sharding.',
      trending: 'New',
      status: 'PROVISIONAL',
      members: [user.esin],
      treasuryBalance: 0,
      activeMissions: []
    };

    await saveCollectionItem('collectives', newColl);
    setShowCreateCollective(false);
    onEarnEAC(50, 'FOUNDER_SHARD_MINTED');
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;
    setIsPosting(true);
    
    const newPost: SocialPost = {
      id: `PST-${Date.now()}`,
      authorEsin: user.esin,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: postContent,
      mediaType: postMedia?.type,
      mediaUrl: postMedia?.url,
      timestamp: new Date().toISOString(),
      likes: 0,
      vouchCount: 0,
      shares: 0,
      comments: []
    };

    await saveCollectionItem('social_posts', newPost);
    setIsPosting(false);
    setPostContent('');
    setPostMedia(null);
  };

  const handleHoodRequest = async (targetEsin: string) => {
    const existing = connections.find(c => (c.fromEsin === user.esin && c.toEsin === targetEsin) || (c.fromEsin === targetEsin && c.toEsin === user.esin));
    if (existing) return;

    const newConn: StewardConnection = {
      id: `CON-${Date.now()}`,
      fromEsin: user.esin,
      toEsin: targetEsin,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    await saveCollectionItem('connections', newConn);
    
    dispatchNetworkSignal({
      type: 'engagement',
      origin: 'MANUAL',
      title: 'HOOD_REQUEST_INBOUND',
      message: `${user.name} requests a social handshake with your node.`,
      priority: 'medium',
      meta: { target: 'profile', payload: { esin: user.esin } }
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !showChat) return;
    
    const targetSteward = MOCK_STEWARDS.find(s => s.esin === showChat);
    
    await dispatchNetworkSignal({
      type: 'engagement',
      origin: 'MANUAL',
      title: 'INCOMING_SYMMETRIC_SIGNAL',
      message: `[ENCRYPTED]: ${chatInput.substring(0, 30)}...`,
      priority: 'medium',
      meta: { target: 'profile', payload: { esin: user.esin } }
    });

    setChatInput('');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-32 max-w-[1700px] mx-auto px-4 relative overflow-hidden">
      
      {/* 1. Community HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 md:p-14 rounded-[64px] border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-3xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <Users2 size={500} className="text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-3xl shrink-0">
              <Users2 size={80} className="text-white animate-float" />
           </div>
           <div className="space-y-6 relative z-10 text-center md:text-left flex-1">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-emerald-500/20">STEWARD_QUORUM_v6.5</span>
                 <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">Collective <span className="text-emerald-400">Mesh.</span></h2>
              </div>
              <p className="text-slate-400 text-xl font-medium italic leading-relaxed max-w-3xl opacity-80 group-hover:opacity-100 transition-opacity">
                 "Orchestrating social resonance through verified steward hoods and collective innovation shards. Forge a guild or synchronize with existing nodes."
              </p>
           </div>
        </div>

        <div className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/40 flex flex-col justify-between text-center relative overflow-hidden shadow-3xl group">
           <div className="space-y-4 relative z-10">
              <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.6em] mb-4 italic opacity-60">SOCIAL_RESONANCE</p>
              <h4 className="text-7xl font-mono font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">98<span className="text-3xl text-emerald-500 font-sans italic ml-1">.4</span></h4>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-4">QUORUM_VERIFIED</p>
           </div>
           <div className="space-y-6 relative z-10 pt-10 border-t border-white/5 mt-10">
              <button 
                onClick={() => setShowCreateCollective(true)}
                disabled={!isAgroWorker}
                className="w-full py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                 <PlusCircle size={18} /> FOUND_COLLECTIVE
              </button>
           </div>
        </div>
      </div>

      {/* 2. Unified Community Navigation */}
      <div className="flex flex-wrap gap-4 p-2 glass-card rounded-[40px] w-fit border border-white/5 bg-black/40 shadow-xl px-10 relative z-20 mx-auto lg:mx-0">
        {[
          { id: 'social', label: 'Steward Feed', icon: HeartPulse },
          { id: 'network', label: 'Steward Network', icon: Globe },
          { id: 'shards', label: 'Collective Shards', icon: Users2 },
          { id: 'lms', label: 'Knowledge Base', icon: Library },
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-4 px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-2xl scale-105 border-b-4 border-indigo-400 ring-8 ring-indigo-500/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[850px] relative z-10">
        
        {/* --- VIEW: STEWARD FEED --- */}
        {activeTab === 'social' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-8">
                 {/* Post Creator */}
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-2xl">
                    <div className="flex gap-8 items-start">
                       <div className="w-16 h-16 rounded-[28px] bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xl relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          <UserIcon size={32} />
                       </div>
                       <div className="flex-1 space-y-6">
                          <textarea 
                             value={postContent}
                             onChange={e => setPostContent(e.target.value)}
                             placeholder={`Steward ${user.name}, broadcast a signal to the mesh...`}
                             className="w-full bg-black/60 border border-white/10 rounded-[40px] p-8 text-white text-xl font-medium italic focus:ring-8 focus:ring-indigo-500/10 outline-none h-44 resize-none placeholder:text-stone-900 shadow-inner"
                          />
                          <div className="flex flex-wrap items-center justify-between gap-6">
                             <div className="flex gap-4">
                                <button onClick={() => setPostMedia({type: 'PHOTO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-emerald-400 transition-all shadow-xl"><ImageIcon size={20}/></button>
                                <button onClick={() => setPostMedia({type: 'VIDEO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-blue-400 transition-all shadow-xl"><VideoIcon size={20}/></button>
                                <button onClick={() => setPostMedia({type: 'AUDIO', url: ''})} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all shadow-xl"><Mic size={20}/></button>
                                <button onClick={() => onNavigate('media')} className="p-4 bg-rose-600/10 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl flex items-center gap-3">
                                   <Radio size={16} className="animate-pulse" /> Live Stream
                                </button>
                             </div>
                             <button 
                               onClick={handlePost}
                               disabled={isPosting || !postContent.trim()}
                               className="px-12 py-6 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.4em] shadow-3xl flex items-center gap-4 transition-all active:scale-95 disabled:opacity-30 border-4 border-white/10 ring-[12px] ring-white/5"
                             >
                                {isPosting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                                {isPosting ? 'BROADCASTING...' : 'BROADCAST SIGNAL'}
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Feed Stream */}
                 <div className="space-y-8">
                    {posts.length === 0 ? (
                       <div className="py-40 text-center opacity-10 space-y-6">
                          <Radio size={100} className="mx-auto" />
                          <p className="text-4xl font-black uppercase tracking-[0.4em]">Awaiting Signals...</p>
                       </div>
                    ) : posts.map(post => (
                       <div key={post.id} className="glass-card p-12 rounded-[64px] border border-white/5 bg-black/20 space-y-8 shadow-3xl hover:border-emerald-500/20 transition-all group active:scale-[0.99] duration-500">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-6">
                                <div onClick={() => setShowProfileView(post.authorEsin)} className="w-16 h-16 rounded-[28px] border-2 border-white/10 overflow-hidden cursor-pointer shadow-xl group-hover:scale-105 transition-transform">
                                   <img src={post.authorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                   <h4 onClick={() => setShowProfileView(post.authorEsin)} className="text-2xl font-black text-white uppercase italic tracking-tight m-0 cursor-pointer group-hover:text-emerald-400 transition-colors">{post.authorName}</h4>
                                   <p className="text-[10px] text-slate-700 font-mono font-bold uppercase tracking-widest mt-1.5">{post.authorEsin}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <span className="text-[10px] font-mono text-slate-800 uppercase tracking-widest">{new Date(post.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                <button className="p-3 text-slate-800 hover:text-white transition-colors"><MoreVertical size={20}/></button>
                             </div>
                          </div>

                          <div className="space-y-6 pl-22 border-l-4 border-white/5 pl-10 ml-8">
                             <p className="text-2xl text-slate-300 italic leading-relaxed font-medium">"{post.text}"</p>
                             {post.mediaType && (
                                <div className="rounded-[40px] overflow-hidden border-2 border-white/10 shadow-3xl relative group/media h-[400px]">
                                   <img src="https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=1200" className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-[10s]" alt="" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                   <div className="absolute bottom-6 left-8 flex items-center gap-4">
                                      <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-2xl"><IconComponent size={20} name={post.mediaType === 'PHOTO' ? 'ImageIcon' : 'Video'} /></div>
                                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Visual Evidence Shard</span>
                                   </div>
                                </div>
                             )}
                          </div>

                          <div className="pt-10 border-t border-white/5 flex gap-10">
                             <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-emerald-400 transition-all uppercase tracking-widest">
                                <ThumbsUp size={18} /> {post.likes + 12} Vouches
                             </button>
                             <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-blue-400 transition-all uppercase tracking-widest">
                                <MessageSquare size={18} /> {post.comments.length + 4} Echoes
                             </button>
                             <button className="flex items-center gap-3 text-[11px] font-black text-slate-600 hover:text-indigo-400 transition-all uppercase tracking-widest">
                                <Share2 size={18} /> Shard Signal
                             </button>
                             <button onClick={() => onNavigate('digital_mrv')} className="ml-auto px-6 py-2 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Audit Evidence</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Sidebar: Social Discovery */}
              <div className="lg:col-span-4 space-y-10">
                 <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-10 shadow-3xl">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Discover <span className="text-indigo-400">Stewards</span></h3>
                       <button className="p-2 bg-white/5 rounded-xl text-slate-700 hover:text-white transition-all"><RefreshCw size={16} /></button>
                    </div>
                    <div className="space-y-6">
                       {MOCK_STEWARDS.map(steward => (
                          <div key={steward.esin} className="p-6 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-indigo-500/30 transition-all group flex items-center justify-between relative overflow-hidden active:scale-[0.98] duration-300">
                             <div className="flex items-center gap-6 relative z-10">
                                <div className="relative shrink-0">
                                   <div onClick={() => setShowProfileView(steward.esin)} className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-all shadow-xl cursor-pointer">
                                      <img src={steward.avatar} alt="" className="w-full h-full object-cover" />
                                   </div>
                                   <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${steward.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                </div>
                                <div className="text-left">
                                   <p onClick={() => setShowProfileView(steward.esin)} className="text-base font-black text-white uppercase italic leading-none cursor-pointer group-hover:text-indigo-400 transition-colors">{steward.name}</p>
                                   <p className="text-[10px] text-slate-700 font-mono mt-2 uppercase">{steward.role}</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => handleHoodRequest(steward.esin)}
                                className="p-4 bg-white/5 hover:bg-indigo-600 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl relative z-10"
                             >
                                <UserPlus size={24} />
                             </button>
                          </div>
                       ))}
                    </div>
                    <button onClick={() => setActiveTab('network')} className="w-full py-5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all">VIEW_STEWARD_REGISTRY</button>
                 </div>

                 {/* Collective Participation Shard */}
                 <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 space-y-8 shadow-3xl group">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl group-hover:rotate-12 transition-transform"><Target size={28} className="text-white" /></div>
                       <h4 className="text-2xl font-black text-white uppercase italic m-0">Group <span className="text-emerald-400">Impact</span></h4>
                    </div>
                    <div className="p-8 bg-black/60 rounded-[44px] border border-white/5 shadow-inner space-y-4">
                       <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-600 px-2">
                          <span>Collective Yield</span>
                          <span className="text-emerald-400 font-mono">+12.4% Δ</span>
                       </div>
                       <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: '84%' }}></div>
                       </div>
                       <p className="text-[10px] text-slate-500 italic text-center pt-2">"Participating in collective missions boosts your node's m-constant by sharding resource stress."</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- VIEW: STEWARD NETWORK (ROBUST HOODING) --- */}
        {activeTab === 'network' && (
           <div className="space-y-12 animate-in zoom-in duration-700 max-w-[1400px] mx-auto">
              <div className="flex flex-col items-center text-center space-y-6 mb-16">
                 <h2 className="text-6xl md:text-9xl font-black text-white uppercase italic tracking-tighter m-0 leading-none drop-shadow-2xl">STEWARD <span className="text-indigo-400">HOODS.</span></h2>
                 <p className="text-slate-500 text-2xl font-medium italic max-w-4xl mx-auto leading-relaxed">"Robust sharding of social connections. Trigger mutual hoods to establish high-fidelity agile networks."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {/* This would be a real search/list of all users */}
                 {[...MOCK_STEWARDS, ...MOCK_STEWARDS, ...MOCK_STEWARDS].map((steward, i) => (
                    <div key={i} className="glass-card p-10 rounded-[64px] border-2 border-white/5 bg-black/40 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center space-y-8 shadow-3xl relative overflow-hidden active:scale-[0.99]">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s]"><Globe size={200} /></div>
                       <div className="relative group">
                          <div onClick={() => setShowProfileView(steward.esin)} className="w-32 h-32 rounded-[44px] overflow-hidden border-4 border-white/10 shadow-3xl cursor-pointer group-hover:scale-105 transition-transform">
                             <img src={steward.avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-4 border-[#050706] shadow-2xl">
                             <BadgeCheck size={20} />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h4 onClick={() => setShowProfileView(steward.esin)} className="text-3xl font-black text-white uppercase italic tracking-tight m-0 cursor-pointer group-hover:text-indigo-400 transition-colors leading-none">{steward.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest">{steward.esin}</p>
                       </div>
                       <div className="w-full pt-8 border-t border-white/5 space-y-6">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 px-4">
                             <span>Resonance</span>
                             <span className="text-emerald-400 font-mono">{steward.res}%</span>
                          </div>
                          <div className="flex gap-3">
                             <button onClick={() => setShowChat(steward.esin)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Signal</button>
                             <button onClick={() => handleHoodRequest(steward.esin)} className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-xl active:scale-90 transition-all border border-white/10">Hook Hood</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- VIEW: COLLECTIVE SHARDS (GROUPS) --- */}
        {activeTab === 'shards' && (
           <div className="space-y-16 animate-in slide-in-from-right-10 duration-700 max-w-[1600px] mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                 {collectives.map(shard => (
                    <div key={shard.id} className="glass-card p-14 rounded-[80px] border-2 border-white/5 bg-black/40 hover:border-emerald-500/40 transition-all group shadow-3xl relative overflow-hidden active:scale-[0.99] duration-300 flex flex-col min-h-[700px] justify-between">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-125 transition-transform duration-[12s] pointer-events-none"><Users2 size={500} /></div>
                       <div className="space-y-10 relative z-10">
                          <div className="flex justify-between items-start">
                             <div className="w-24 h-24 rounded-[40px] bg-emerald-600 shadow-3xl border-4 border-white/10 flex items-center justify-center text-white group-hover:rotate-6 transition-transform"><Users2 size={48} /></div>
                             <div className="text-right flex flex-col items-end gap-3">
                                <span className="px-5 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 shadow-xl tracking-widest">{shard.type.replace('_', ' ')}</span>
                                <p className="text-[11px] text-slate-700 font-mono font-black italic tracking-widest uppercase">{shard.id} // ADMIN: {shard.adminName}</p>
                             </div>
                          </div>
                          <div className="space-y-6">
                             <h4 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">{shard.name}</h4>
                             <p className="text-2xl text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{shard.mission}"</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8 py-10 border-y border-white/5">
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Node Treasury</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-emerald-400 transition-colors">{shard.treasuryBalance.toLocaleString()}<span className="text-sm ml-1 text-emerald-500">EAC</span></p>
                             </div>
                             <div className="text-center group/met">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-3">Steward Quorum</p>
                                <p className="text-5xl font-mono font-black text-white group-hover/met:text-blue-400 transition-colors">{shard.memberCount}</p>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6 relative z-10 mt-10">
                          {shard.adminEsin === user.esin && (
                             <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[44px] flex items-center justify-between shadow-inner">
                                <div>
                                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Administrative Privileges</p>
                                   <p className="text-sm font-bold text-white uppercase italic">Disburse Yield Shards</p>
                                </div>
                                <button className="p-5 bg-indigo-600 rounded-3xl text-white shadow-2xl hover:scale-110 active:scale-95 transition-all"><Gavel size={24}/></button>
                             </div>
                          )}
                          <div className="flex gap-4">
                             <button className="flex-1 py-8 bg-white/5 border-2 border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4">
                                <FileText size={20} /> VIEW_MANIFEST
                             </button>
                             <button 
                               className={`flex-1 py-8 rounded-full font-black text-sm uppercase tracking-[0.5em] shadow-3xl transition-all flex items-center justify-center gap-5 border-4 border-white/10 ring-[12px] ring-white/5 active:scale-95 ${shard.members.includes(user.esin) ? 'bg-rose-950/40 text-rose-500 border-rose-500/30' : 'bg-emerald-600 text-white'}`}
                             >
                                {shard.members.includes(user.esin) ? 'EXIT_SHARD' : 'JOIN_GUILD'}
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

      </div>

      {/* --- MODAL: CREATE COLLECTIVE --- */}
      {showCreateCollective && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowCreateCollective(false)}></div>
           <div className="relative z-10 w-full max-w-2xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col">
              
              <div className="p-10 md:p-14 border-b border-white/5 bg-emerald-500/[0.01] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-2xl animate-float">
                       <Users2 size={36} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Found <span className="text-emerald-400">Collective</span></h3>
                       <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-3 italic">INDUSTRIAL_COLLECTIVE_INIT</p>
                    </div>
                 </div>
                 <button onClick={() => setShowCreateCollective(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white transition-all active:scale-90"><X size={32} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12 bg-black/40">
                 <div className="space-y-10 animate-in slide-in-from-right-6 duration-500 flex-1 flex flex-col justify-center">
                    <div className="text-center space-y-4">
                       <h4 className="text-2xl font-black text-white uppercase italic">Node Definition</h4>
                       <p className="text-slate-500 text-sm">"Establish a new mission quorum on the planetary grid."</p>
                    </div>
                    <div className="space-y-8">
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Collective Identity</label>
                          <input 
                             type="text" value={newCollName} onChange={e => setNewCollName(e.target.value)} 
                             placeholder="e.g. Zone 4 Water Guild..." 
                             className="w-full bg-black border-2 border-white/10 rounded-[32px] py-6 px-10 text-2xl font-bold text-white focus:ring-8 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-stone-900 italic shadow-inner" 
                          />
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Administrative Mission</label>
                          <textarea 
                             value={newCollDesc} onChange={e => setNewCollDesc(e.target.value)}
                             placeholder="Define the collective's primary sharding objective..."
                             className="w-full bg-black border-2 border-white/10 rounded-[32px] p-8 text-white text-lg font-medium italic focus:ring-8 focus:ring-emerald-500/10 outline-none h-40 resize-none placeholder:text-stone-900 shadow-inner"
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4 px-4">
                          {['TECHNICAL_GUILD', 'HERITAGE_CLAN', 'COOPERATIVE', 'INNOVATION_NODE'].map(type => (
                             <button 
                                key={type} onClick={() => setNewCollType(type as any)}
                                className={`p-6 rounded-[32px] border-2 transition-all text-[10px] font-black uppercase tracking-widest ${newCollType === type ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-xl scale-105' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                             >
                                {type.replace('_', ' ')}
                             </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="p-8 bg-black/80 rounded-[48px] border border-white/10 shadow-inner space-y-6">
                       <div className="flex justify-between items-center px-4">
                          <div className="flex items-center gap-4">
                             <Coins size={20} className="text-emerald-500" />
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registration Commitment</span>
                          </div>
                          <span className="text-2xl font-mono font-black text-white">250 <span className="text-sm text-emerald-400 italic">EAC</span></span>
                       </div>
                       <div className="space-y-2 pt-4 border-t border-white/5">
                          <p className="text-[11px] text-slate-600 font-black uppercase text-center tracking-[0.4em]">Founder Signature (ESIN)</p>
                          {/* Fixed: Now uses the esinSign state defined at the top of the component */}
                          <input 
                             type="text" value={esinSign} onChange={e => setEsinSign(e.target.value)}
                             placeholder="EA-XXXX-XXXX-XXXX" 
                             className="w-full bg-transparent border-none text-center text-4xl font-mono text-white outline-none uppercase placeholder:text-stone-900 shadow-inner" 
                          />
                       </div>
                    </div>

                    {/* Fixed: handleCreateCollective now correctly depends on esinSign state */}
                    <button 
                      onClick={handleCreateCollective}
                      disabled={!newCollName || !esinSign}
                      className="w-full py-10 agro-gradient rounded-full text-white font-black text-sm uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[16px] ring-white/5 disabled:opacity-30"
                    >
                       <Stamp size={28} className="fill-current mr-4" /> AUTHORIZE FOUNDATION
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- MODAL: STEWARD PROFILE VIEW --- */}
      {showProfileView && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in" onClick={() => setShowProfileView(null)}></div>
           <div className="relative z-10 w-full max-w-4xl glass-card rounded-[80px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[90vh]">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-16 space-y-12">
                 <div className="flex justify-between items-start">
                    <div className="flex gap-10 items-center">
                       <div className="w-32 h-32 rounded-[44px] overflow-hidden border-4 border-indigo-500/20 shadow-3xl">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150" className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter m-0">Steward <span className="text-indigo-400">Alpha</span></h3>
                          <p className="text-indigo-400/60 text-[11px] font-mono tracking-[0.6em] uppercase mt-4 italic">ESIN: {showProfileView}</p>
                          <div className="flex gap-4 mt-6">
                             <button onClick={() => setShowChat(showProfileView)} className="px-8 py-3 bg-indigo-600 rounded-2xl text-white font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center gap-3"><Send size={14}/> Send Signal</button>
                             <button onClick={() => handleHoodRequest(showProfileView!)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-slate-300 font-black text-[9px] uppercase tracking-widest hover:bg-white/10 flex items-center gap-3"><UserCheck size={14}/> Connect Hood</button>
                          </div>
                       </div>
                    </div>
                    <button onClick={() => setShowProfileView(null)} className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-500 hover:text-white"><X size={32}/></button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                       { l: 'Node Resonance', v: '98%', i: Activity, c: 'text-emerald-400' },
                       { l: 'Vouch Weight', v: '1.42x', i: Zap, c: 'text-indigo-400' },
                       { l: 'Shard History', v: '124', i: History, c: 'text-blue-400' },
                    ].map((s, i) => (
                       <div key={i} className="p-8 bg-black/60 rounded-[44px] border border-white/5 text-center space-y-2 group hover:border-white/20 transition-all shadow-inner">
                          <s.i size={24} className={`${s.c} mx-auto mb-4 opacity-40 group-hover:opacity-100 transition-opacity`} />
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{s.l}</p>
                          <p className="text-3xl font-mono font-black text-white">{s.v}</p>
                       </div>
                    ))}
                 </div>

                 <div className="space-y-8">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-widest px-4 border-l-4 border-indigo-600">Active Shards</h4>
                    <div className="grid gap-4">
                       {MOCK_FEED.slice(0, 2).map(p => (
                          <div key={p.id} className="p-8 glass-card border border-white/5 rounded-[40px] bg-black/20 italic text-slate-400 leading-relaxed text-lg">
                             "{p.text}"
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- CHAT OVERLAY --- */}
      {showChat && (
        <div className="fixed bottom-32 right-10 z-[900] w-96 glass-card rounded-[48px] border-2 border-indigo-500/40 bg-black/90 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
           <div className="p-6 bg-indigo-600/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl"><MessageCircle size={20}/></div>
                 <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-widest">Relay Link</h5>
                    <p className="text-[8px] text-indigo-400 uppercase font-black">STWD_ALPHA_SYNC</p>
                 </div>
              </div>
              <button onClick={() => setShowChat(null)} className="p-2 text-slate-600 hover:text-white"><X size={18}/></button>
           </div>
           <div className="flex-1 p-6 h-80 overflow-y-auto custom-scrollbar-terminal space-y-4 bg-black/40">
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 text-[10px] text-indigo-300 italic">"Secure signal link established. Ingesting peer data shards..."</div>
              <div className="p-5 bg-white/5 rounded-3xl rounded-tl-none italic text-slate-400 text-sm">"Greetings Steward. Ready to synchronize our local node biometrics?"</div>
           </div>
           <div className="p-6 border-t border-white/5 bg-black/95 relative">
              <input 
                 value={chatInput}
                 onChange={e => setChatInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                 type="text" placeholder="Signal to node..." className="w-full bg-white/[0.02] border-2 border-white/10 rounded-full py-4 pl-6 pr-14 text-xs text-white focus:ring-4 focus:ring-indigo-500/10 outline-none" 
              />
              <button onClick={handleChatSend} className="absolute right-8 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 rounded-full text-white shadow-xl"><Send size={16}/></button>
           </div>
        </div>
      )}

      <style>{`
        .shadow-3xl { box-shadow: 0 50px 150px -30px rgba(0, 0, 0, 0.95); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 10px; }
      `}</style>
    </div>
  );
};

// Helper components for Post Creator and Feed Icons
const IconComponent: React.FC<{name: string, size?: number, className?: string}> = ({name, size = 18, className = ""}) => {
  /* Now correctly resolves LucideIcons through wildcard import defined at top of file */
  const Icon = (LucideIcons as any)[name] || LucideIcons.FileCode;
  return <Icon size={size} className={className} />;
};

const MOCK_FEED = [
  { id: 'P-1', authorName: 'Steward Alpha', authorEsin: 'EA-ALPHA-88', text: 'Just completed a successful 432Hz sweep on Sector 4. m-Constant increased by 0.05x!', timestamp: new Date().toISOString(), likes: 12, shares: 3, comments: [], mediaType: 'PHOTO' },
  { id: 'P-2', authorName: 'Gaia Green', authorEsin: 'EA-GAIA-02', text: 'Discovered a rare Bantu Sun-Orchid cluster. Documenting for the archive.', timestamp: new Date().toISOString(), likes: 45, shares: 12, comments: [] },
  { id: 'P-3', authorName: 'Root Steward', authorEsin: 'EA-CORE-01', text: 'Network quorum established for the Season of Awakening. Ensure all geofence shards are synced.', timestamp: new Date().toISOString(), likes: 124, shares: 56, comments: [] },
];

export default Community;
