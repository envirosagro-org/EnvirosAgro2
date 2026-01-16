import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Search, 
  Video, 
  Radio, 
  Headphones, 
  Download,
  Loader2,
  Tv,
  Eye,
  Zap,
  X,
  Activity,
  Film,
  Sparkles,
  Camera,
  Maximize,
  AlertCircle,
  Key,
  Bot,
  ImageIcon,
  Edit2,
  Trash2,
  Upload,
  Coins,
  ShieldAlert,
  Newspaper,
  BookOpen,
  Globe,
  Waves,
  Heart,
  FileText,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Sprout,
  Activity as WaveIcon,
  CirclePlay,
  Monitor,
  Video as VideoIcon,
  Users,
  ArrowRight,
  Maximize2,
  Lock,
  Signal,
  Wifi,
  Smartphone,
  Info,
  Calendar,
  Layers,
  Database,
  Terminal,
  VolumeX,
  Volume1,
  ChevronRight,
  TrendingUp,
  FileDigit,
  Fingerprint,
  ShieldCheck,
  RefreshCcw,
  BadgeCheck,
  ZapOff,
  Flame,
  CreditCard,
  MailCheck,
  PenTool,
  History,
  FileDown,
  Atom,
  Quote,
  Music,
  PlusCircle,
  AudioLines,
  Mic2,
  FileSearch,
  CheckCircle
} from 'lucide-react';
import { User } from '../types';
import { searchAgroTrends, chatWithAgroExpert, AIResponse } from '../services/geminiService';

interface MediaHubProps {
  user: User;
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const VIDEO_NODES = [
  { id: 'VID-01', title: 'SkyScout Spectral Stream', thumb: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200', viewers: 1240, status: 'LIVE', thrust: 'ENVIRONMENTAL', desc: 'Real-time spectral telemetry ingest from autonomous satellite relays.' },
  { id: 'VID-02', title: 'Nebraska Ingest Node #82', thumb: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800', viewers: 842, status: 'LIVE', thrust: 'INDUSTRIAL', desc: 'Active processing feed from the regional bio-refinery cluster.' },
  { id: 'VID-03', title: 'Bantu Seed Shard Verification', thumb: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800', viewers: 3200, status: 'ARCHIVE', thrust: 'SOCIETAL', desc: 'Audit log of lineage seed curation and registry anchoring.' },
  { id: 'VID-04', title: 'Drone Swarm Thermal Scan', thumb: 'https://images.unsplash.com/photo-1615461066870-40ad1440ad7ea?q=80&w=800', viewers: 412, status: 'LIVE', thrust: 'TECHNOLOGICAL', desc: 'Multi-node thermal mapping of soil moisture variances.' },
];

const INITIAL_AUDIO_TRACKS = [
  { title: "PLANT WAVE SYNTHESIS V1.0", type: "BIO-ELECTRIC", duration: "32:00", cost: "50 EAC", icon: Sprout, free: false },
  { title: "M-CONSTANT RESONANCE V2.1", type: "SOIL STIMULATION", duration: "45:00", cost: "FREE", icon: Radio, free: true },
  { title: "SID TRAUMA CLEARING PROTOCOL", type: "WELLNESS", duration: "20:00", cost: "5 EAC", icon: Heart, free: false },
  { title: "BANTU RHYTHMIC INGEST", type: "ANCESTRAL HERITAGE", duration: "60:00", cost: "FREE", icon: Globe, free: true },
];

const MOCK_INGEST_LOGS = [
  { id: 'SONIC-882', source: 'Rose Flower', date: '2h ago', status: 'ANCHORED', hash: '0x882_ROSE_SYNC' },
  { id: 'SONIC-421', source: 'Bamboo Shard', date: '5h ago', status: 'VERIFIED', hash: '0x421_BAMBOO_OK' },
  { id: 'SONIC-104', source: 'Aloe Vera Node', date: '1d ago', status: 'ANCHORED', hash: '0x104_ALOE_FINAL' },
];

const MediaHub: React.FC<MediaHubProps> = ({ user, userBalance, onSpendEAC }) => {
  const [tab, setTab] = useState<'all' | 'video' | 'news' | 'audio' | 'waves' | 'blog'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AIResponse | null>(null);

  // Interaction States
  const [activeVideoNode, setActiveVideoNode] = useState<any | null>(null);
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [activeAudioTrack, setActiveAudioTrack] = useState<any | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Subscriptions logic
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  // Audio Upload States
  const [showAudioUpload, setShowAudioUpload] = useState(false);
  const [showIngestLogs, setShowIngestLogs] = useState(false);
  const [audioUploadStep, setAudioUploadStep] = useState<'upload' | 'metadata' | 'sync' | 'success'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [plantSource, setPlantSource] = useState('Rose Flower');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [audioTracks, setAudioTracks] = useState(INITIAL_AUDIO_TRACKS);

  // Blog States
  const [blogTopic, setBlogTopic] = useState('');
  const [isForgingBlog, setIsForgingBlog] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<string | null>(null);
  const [blogHistory, setBlogHistory] = useState<{id: string, title: string, date: string, type: string}[]>([
    { id: 'BLG-001', title: 'The 432Hz Soil Resilience Protocol', date: '2h ago', type: 'Scientific' },
    { id: 'BLG-002', title: 'Bantu Seed Lineages: A Registry Audit', date: '1d ago', type: 'Heritage' }
  ]);

  const premiumNewsletters = [
    { id: 'NL-882', name: 'PLANT WAVE INSIDER', price: 150, icon: Sprout, desc: 'Bi-weekly deep-dives into bio-electric resonance protocols and yield optimization shards.', type: 'Scientific' },
    { id: 'NL-104', name: 'EOS MARKET PULSE', price: 200, icon: TrendingUp, desc: 'Institutional analysis of EAC/EAT volatility and regional investment multipliers.', type: 'Industrial' },
    { id: 'NL-042', name: 'BANTU SOIL ANTHRO', price: 100, icon: BookOpen, desc: 'Ancestral seed mapping and sociological stewardship reports from Kenya Hub.', type: 'Societal' },
    { id: 'NL-991', name: 'DRONE SWARM LOGS', price: 120, icon: Video, desc: 'Raw telemetry insights and spectral anomaly reports from global autonomous fleets.', type: 'Technological' },
  ];

  const agribizFeed = [
    { id: 'ART-01', title: "Plant Wave Resonators show 14% Boost in Zone 2 Maize", author: "AGROMUSIKA LAB", time: "30M AGO", img: "https://images.unsplash.com/photo-1530836361253-efad5cb2fcc2?q=80&w=400", content: "Laboratory findings confirm that 432Hz modulation accelerations nutrient intake in Zone 2 clusters..." },
    { id: 'ART-02', title: "Bantu Lineage Seeds Surge 400% in Trade Volume", author: "AGROINPDF CORE", time: "1H AGO", img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=800", content: "Market trends show a massive influx of capital into ancestral Bantu soil shards as resilience metrics peak..." },
    { id: 'ART-03', title: "MedicAg Shards Authorized for Global Ingest", author: "REGISTRY AUDIT", time: "4H AGO", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400", content: "The global registry has finalized the verification of 12 new health nodes across the central corridor..." },
    { id: 'ART-04', title: "Sonic Remediation: 432Hz Impact Reports", author: "AGROMUSIKA", time: "1D AGO", img: "https://images.unsplash.com/photo-1615461066870-40ad1440ad7ea?q=80&w=400", content: "Comprehensive impact studies highlight the success of sound-based soil repair in the previous harvest cycle..." },
  ];

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    setLoadingNews(true);
    const result = await searchAgroTrends("Industrial agricultural innovations and Five Thrusts updates including bio-electric plant waves");
    setNewsResult(result);
    setLoadingNews(false);
  };

  const handleSubscribe = (id: string, price: number) => {
    if (subscriptions.includes(id)) return;
    
    setIsSubscribing(id);
    setTimeout(() => {
      if (onSpendEAC(price, `NEWSLETTER_SUB_${id.toUpperCase()}`)) {
        setSubscriptions([...subscriptions, id]);
        alert(`SUBSCRIPTION ANCHORED: Shard access for ${id} has been provisioned to your node.`);
      }
      setIsSubscribing(null);
    }, 1500);
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUploadStep('metadata');
    }
  };

  const handleFinalizeAudioUpload = () => {
    setIsUploadingAudio(true);
    setAudioUploadStep('sync');
    setTimeout(() => {
      const newTrack = {
        title: `${plantSource.toUpperCase()} RHYTHM SHARD`,
        type: "PLANT WAVE TECHNOLOGY",
        duration: "04:20",
        cost: "FREE",
        icon: Mic2,
        free: true
      };
      setAudioTracks([newTrack, ...audioTracks]);
      setIsUploadingAudio(false);
      setAudioUploadStep('success');
    }, 3000);
  };

  const handleForgeBlog = async () => {
    if (!blogTopic.trim()) return;
    
    const COST = 20;
    if (!onSpendEAC(COST, `BLOG_FORGE_${blogTopic.toUpperCase()}`)) {
      alert("LIQUIDITY ERROR: Insufficient EAC for blog sharding.");
      return;
    }

    setIsForgingBlog(true);
    setGeneratedBlog(null);

    try {
      const prompt = `Write a professional, technical, and inspiring blog post shard for the EnvirosAgro network about the following topic: "${blogTopic}". 
      Format the output with:
      1. A bold Industrial Title.
      2. A "Registry Abstract" summary.
      3. Three main sections discussing the SEHTI alignment.
      4. A "C(a) Impact" conclusion.
      Keep it high-fidelity and futuristic. Use markdown.`;

      const response = await chatWithAgroExpert(prompt, [], true);
      setGeneratedBlog(response.text);
      
      const newEntry = {
        id: `BLG-${Math.floor(Math.random() * 1000)}`,
        title: blogTopic.substring(0, 40) + (blogTopic.length > 40 ? '...' : ''),
        date: 'Just now',
        type: 'AI_SYNTH'
      };
      setBlogHistory([newEntry, ...blogHistory]);
    } catch (e) {
      alert("Oracle Congestion: Synthesis interrupted.");
    } finally {
      setIsForgingBlog(false);
    }
  };

  const openVideoNode = (node: any) => {
    setActiveVideoNode(node);
    setIsFullScreen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-4">
      {/* Registry Pulse News Ticker */}
      <div className="glass-card p-4 rounded-3xl border-emerald-500/20 flex items-center overflow-hidden bg-emerald-500/[0.02] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none"></div>
        <div className="flex items-center gap-3 shrink-0 px-6 border-r border-white/5 relative z-10">
          <Zap className="w-5 h-5 text-amber-500 fill-current animate-pulse" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">EOS_PULSE_V3</span>
        </div>
        <div className="flex-1 px-6 overflow-hidden relative z-10">
          {loadingNews ? (
            <div className="flex items-center gap-2"><Loader2 className="w-3 h-3 text-emerald-400 animate-spin" /><span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Syncing Global Shards...</span></div>
          ) : (
            <div className="whitespace-nowrap animate-marquee hover:pause-marquee text-xs text-emerald-400 font-mono font-bold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              {newsResult?.text?.replace(/\n/g, ' • ') || 'Registry synchronized. No anomalies detected. Node m-Constant steady at 1.42x. • New Carbon Shards released in Zone 4. • Tokenz Center Gate auth active.'}
            </div>
          )}
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 text-xs font-black text-slate-600 border-l border-white/5">
           INDUSTRIAL AGRICULTURAL INNOVATION
        </div>
      </div>

      {/* Navigation & Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full lg:w-auto">
          {[
            { id: 'all', label: 'PRIMARY HUB' },
            { id: 'video', label: 'VIDEO NODES' },
            { id: 'news', label: 'NEWSSTAND' },
            { id: 'blog', label: 'BLOG SHARDS' },
            { id: 'audio', label: 'ACOUSTIC REGISTRY' },
            { id: 'waves', label: 'PLANT WAVE LAB' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 px-4">
           <div className="text-right">
              <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1">Active Nodes</p>
              <p className="text-xs font-mono font-black text-white">4,281 STWD</p>
           </div>
           <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
        </div>
      </div>

      <div className="min-h-[600px]">
        {/* TAB: PRIMARY HUB */}
        {tab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-3 glass-card p-12 rounded-[56px] relative overflow-hidden flex flex-col justify-end min-h-[500px] border border-white/5 group bg-black shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200')] bg-cover opacity-40 group-hover:scale-105 transition-transform duration-[10s]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-600/80 rounded-[28px] shadow-2xl backdrop-blur-md">
                       <Globe className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <span className="px-4 py-1.5 bg-red-600/20 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/40 tracking-[0.3em]">LIVE_SPECTRAL_FEED</span>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mt-2">SKYSCOUT <br/><span className="text-blue-400">SPECTRAL STREAM</span></h2>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xl leading-relaxed max-w-xl font-medium">Observing moisture retention and soil temperature variances across the Nebraska global industrial hub.</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <button onClick={() => openVideoNode({ id: 'SKY-01', title: 'SkyScout Spectral Stream', thrust: 'ENVIRONMENTAL' })} className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                        <Play className="w-5 h-5 fill-current" /> WATCH SHARD
                     </button>
                     <button onClick={() => openVideoNode({ id: 'SKY-01', title: 'SkyScout Spectral Stream', thrust: 'ENVIRONMENTAL' })} className="px-10 py-5 bg-black/60 border border-white/20 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                        <Maximize className="w-5 h-5" /> FULLSCREEN NODE
                     </button>
                  </div>
                </div>
             </div>

             <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 flex flex-col justify-between group overflow-hidden relative shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Waves className="w-64 h-64 text-white" /></div>
                <div className="flex justify-between items-start relative z-10">
                   <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 shadow-xl">
                      <WaveIcon className="w-8 h-8 text-indigo-400" />
                   </div>
                   <div className="flex items-end gap-1.5 h-10">
                      {[0,1,2,3].map(i => <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${12+i*8}px`, animationDelay: `${i*0.2}s` }}></div>)}
                   </div>
                </div>
                <div className="py-8 relative z-10">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-3">AGROMUSIKA RADIO</p>
                   <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic m-0">PLANT WAVE SYNTHESIS</h3>
                   <p className="text-xs text-slate-500 font-medium mt-4 italic">"Bio-electric Resonance Logs"</p>
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl hover:scale-110 active:scale-95 transition-all mx-auto relative z-10 border-4 border-white/5"
                >
                   {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
                </button>
             </div>
          </div>
        )}

        {/* TAB: VIDEO NODES */}
        {tab === 'video' && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="glass-card p-14 rounded-[64px] border border-white/10 bg-indigo-600/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-14 shadow-3xl">
                <div className="w-28 h-28 bg-indigo-500 rounded-[40px] flex items-center justify-center shadow-3xl shrink-0 relative group">
                   <VideoIcon className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-white/10 rounded-[40px] animate-pulse"></div>
                </div>
                <div className="flex-1 space-y-4">
                   <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">INDUSTRIAL <span className="text-indigo-400">VIDEO NODES</span></h2>
                   <p className="text-slate-400 text-2xl font-medium italic max-w-2xl">Direct telemetry visual ingest and high-fidelity documentation from across the global registry.</p>
                </div>
                <div className="grid grid-cols-2 gap-6 shrink-0">
                   <div className="p-8 bg-black/60 border border-white/10 rounded-[40px] text-center min-w-[160px] shadow-2xl">
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">ACTIVE STREAMS</p>
                      <p className="text-4xl font-mono font-black text-white">4</p>
                   </div>
                   <div className="p-8 bg-black/60 border border-white/10 rounded-[40px] text-center min-w-[160px] shadow-2xl">
                      <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-2">BANDWIDTH</p>
                      <p className="text-4xl font-mono font-black text-indigo-400">1.2TB</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {VIDEO_NODES.map(node => (
                  <div key={node.id} className="glass-card rounded-[56px] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col h-full group active:scale-[0.98] duration-300 bg-black/40 shadow-3xl relative">
                     <div className="h-80 relative overflow-hidden shrink-0">
                        <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={node.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050706] to-transparent"></div>
                        
                        <div className="absolute top-8 left-8 flex gap-3">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-xl ${node.status === 'LIVE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-500/20 text-slate-400 border-slate-500/40'}`}>
                              {node.status}
                           </span>
                           <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                              {node.thrust}
                           </span>
                        </div>

                        <div className="absolute bottom-8 left-8 flex items-center gap-3">
                           <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                           <span className="text-[11px] font-mono font-black text-white uppercase tracking-widest">{node.viewers.toLocaleString()} VIEWERS</span>
                        </div>
                     </div>

                     <div className="p-12 flex-1 flex flex-col space-y-6">
                        <div>
                           <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-indigo-400 transition-colors m-0 italic">{node.title}</h4>
                           <p className="text-[10px] text-slate-700 font-mono mt-3 font-black uppercase tracking-[0.4em]">{node.id} // GLOBAL_RELAY_SYNC</p>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed italic mb-8 flex-1 font-medium opacity-80">"{node.desc}"</p>
                        
                        <div className="pt-10 border-t border-white/5 flex gap-6">
                           <button className="flex-1 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
                              <Bookmark className="w-5 h-5" /> SAVE NODE
                           </button>
                           <button onClick={() => openVideoNode(node)} className="flex-[2] py-5 bg-indigo-600 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl hover:bg-indigo-500 flex items-center justify-center gap-4 active:scale-90">
                              CONNECT TO NODE <ArrowRight className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: NEWSSTAND */}
        {tab === 'news' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             
             {/* Premium Newsletters Section */}
             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <MailCheck className="w-6 h-6 text-amber-500" />
                    <h3 className="text-xl font-black text-white uppercase tracking-widest italic">Premium <span className="text-amber-500">Newsletter Shards</span></h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Publications Only</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                   {premiumNewsletters.map(nl => (
                     <div key={nl.id} className={`glass-card p-8 rounded-[40px] border-2 transition-all flex flex-col h-full bg-black/40 group relative overflow-hidden ${subscriptions.includes(nl.id) ? 'border-emerald-500/40' : 'border-white/5 hover:border-amber-500/20'}`}>
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><nl.icon size={120} /></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className={`p-4 rounded-2xl ${subscriptions.includes(nl.id) ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} border border-white/5`}>
                              <nl.icon className="w-6 h-6" />
                           </div>
                           <div className="text-right">
                              <span className="text-[8px] font-mono text-slate-700 font-black uppercase tracking-widest">{nl.type} Shard</span>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">{nl.id}</p>
                           </div>
                        </div>

                        <div className="flex-1 space-y-4 relative z-10">
                           <h4 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-amber-500 transition-colors">{nl.name}</h4>
                           <p className="text-xs text-slate-400 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{nl.desc}"</p>
                        </div>

                        <div className="pt-8 mt-6 border-t border-white/5 relative z-10 flex flex-col gap-4">
                           <div className="flex justify-between items-center px-2">
                              <span className="text-[9px] font-black text-slate-600 uppercase">Registry Cost</span>
                              <span className={`text-sm font-mono font-black ${subscriptions.includes(nl.id) ? 'text-emerald-400' : 'text-white'}`}>
                                {subscriptions.includes(nl.id) ? 'ACTIVE_ACCESS' : `${nl.price} EAC`}
                              </span>
                           </div>
                           <button 
                             onClick={() => handleSubscribe(nl.id, nl.price)}
                             disabled={subscriptions.includes(nl.id) || isSubscribing === nl.id}
                             className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                                subscriptions.includes(nl.id) 
                                 ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                                 : 'bg-amber-600 text-white hover:bg-amber-500 shadow-amber-900/20 active:scale-95'
                             }`}
                           >
                              {isSubscribing === nl.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                               subscriptions.includes(nl.id) ? <MailCheck className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                              {subscriptions.includes(nl.id) ? 'READ SHARDS' : 'SUBSCRIBE NODE'}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Standard Feed Section */}
             <div className="space-y-6 pt-8">
               <div className="flex items-center gap-4 px-4">
                  <Newspaper className="w-8 h-8 text-emerald-400" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none m-0">AGRIBIZ <span className="text-emerald-400">LEDGER FEED</span></h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
                  {agribizFeed.map((news, i) => (
                     <div key={i} className="glass-card rounded-[56px] overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all active:scale-[0.98] duration-500 shadow-3xl bg-black group">
                        <div className="h-[400px] relative overflow-hidden shrink-0">
                           <img src={news.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={news.title} />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
                           <div className="absolute top-8 left-8">
                              <span className="px-5 py-2 bg-black/60 backdrop-blur-xl text-[10px] font-black text-white uppercase rounded-full border border-white/10 tracking-widest">{news.author}</span>
                           </div>
                        </div>
                        <div className="p-12 space-y-8 flex flex-col h-full">
                           <h4 className="text-3xl font-black text-white leading-tight group-hover:text-emerald-400 transition-colors m-0 italic tracking-tighter uppercase">{news.title}</h4>
                           <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-auto">
                              <span className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest">{news.time}</span>
                              <button onClick={() => setActiveArticle(news)} className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.4em] flex items-center gap-3 hover:translate-x-2 transition-all">
                                 READ SHARD <ArrowRight className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
             </div>
          </div>
        )}

        {/* TAB: BLOG SHARDS */}
        {tab === 'blog' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
             <div className="glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
                   <PenTool className="w-96 h-96 text-white" />
                </div>
                <div className="w-32 h-32 rounded-[40px] bg-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] ring-4 ring-white/10 shrink-0">
                   <PenTool className="w-14 h-14 text-white" />
                </div>
                <div className="flex-1 space-y-6 relative z-10">
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">Blog <span className="text-emerald-400">Shard Forge</span></h3>
                   <p className="text-slate-400 text-xl font-medium leading-relaxed max-xl:text-sm max-w-xl italic">
                      "Synthesize high-fidelity agricultural thought-leadership using the EnvirosAgro AI Oracle. Every generated shard is anchored to your node reputation."
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Forge Input Area */}
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 space-y-10 shadow-xl">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                         </div>
                         <h4 className="text-xs font-black text-white uppercase tracking-[0.4em]">Initialize Forge</h4>
                      </div>
                      
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Topic Shard Identity</label>
                         <textarea 
                           value={blogTopic}
                           onChange={e => setBlogTopic(e.target.value)}
                           placeholder="Enter topic: e.g. Impact of 432Hz on Maize m-Constant..."
                           className="w-full bg-black border border-white/10 rounded-[32px] p-6 text-white text-sm font-medium italic focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all h-32 resize-none placeholder:text-slate-800 shadow-inner"
                         />
                      </div>

                      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                         <span className="text-[9px] font-black text-slate-500 uppercase">Sharding Cost</span>
                         <span className="text-lg font-mono font-black text-emerald-400">20 EAC</span>
                      </div>

                      <button 
                        onClick={handleForgeBlog}
                        disabled={isForgingBlog || !blogTopic.trim()}
                        className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.5em] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                      >
                         {isForgingBlog ? <Loader2 className="w-6 h-6 animate-spin" /> : <Bot className="w-6 h-6" />}
                         {isForgingBlog ? "SYNTHESIZING..." : "FORGE BLOG SHARD"}
                      </button>
                   </div>

                   <div className="glass-card p-8 rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-6">
                      <div className="flex items-center justify-between">
                         <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <History size={14} /> Forge History
                         </h4>
                      </div>
                      <div className="space-y-4">
                         {blogHistory.map(item => (
                           <div key={item.id} className="p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-indigo-500/40 transition-all cursor-pointer">
                              <div className="flex justify-between items-start mb-2">
                                 <p className="text-[10px] font-black text-white italic truncate max-w-[150px]">{item.title}</p>
                                 <span className="text-[8px] font-mono text-slate-700">{item.date}</span>
                              </div>
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[7px] font-black uppercase">{item.type}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Content Display Area */}
                <div className="lg:col-span-8">
                   <div className="glass-card rounded-[56px] border border-white/5 bg-black/20 min-h-[600px] flex flex-col relative overflow-hidden shadow-3xl">
                      <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Terminal className="w-6 h-6 text-emerald-400" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shard Output Terminal</span>
                         </div>
                         {generatedBlog && (
                            <div className="flex gap-4">
                               <button onClick={() => setGeneratedBlog(null)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-rose-500 transition-all"><X size={16} /></button>
                            </div>
                         )}
                      </div>

                      <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar relative">
                         {!generatedBlog && !isForgingBlog ? (
                           <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-20 group">
                              <div className="relative">
                                 <FileText className="w-24 h-24 text-slate-500 group-hover:text-emerald-500 transition-colors" />
                                 <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-full scale-150 animate-spin-slow"></div>
                              </div>
                              <p className="text-xl font-black uppercase tracking-[0.5em] text-white">Awaiting Synthesis</p>
                           </div>
                         ) : isForgingBlog ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20">
                              <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                              <p className="text-emerald-400 font-bold mt-6 animate-pulse uppercase tracking-[0.3em] text-sm italic">Forging Industrial Thought-Shard...</p>
                              <div className="mt-10 flex gap-2">
                                 {[...Array(8)].map((_, i) => <div key={i} className="w-1 h-10 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                              </div>
                           </div>
                         ) : (
                           <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12">
                              <div className="p-10 md:p-16 bg-black/60 rounded-[64px] border-l-8 border-emerald-500/40 relative overflow-hidden shadow-inner">
                                 <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Atom className="w-64 h-64 text-white" /></div>
                                 <div className="absolute top-10 left-10 opacity-20"><Quote size={40} className="text-emerald-400" /></div>
                                 
                                 <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-[2] italic whitespace-pre-line font-medium text-lg md:text-xl pl-10 relative z-10">
                                    {generatedBlog}
                                 </div>

                                 <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                       <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-emerald-400 border border-white/5">{user.name[0]}</div>
                                       <div>
                                          <p className="text-xs font-black text-white uppercase tracking-tight italic">Signed by Node steward</p>
                                          <p className="text-[10px] text-slate-600 font-mono">0x{Math.random().toString(16).substring(2,10).toUpperCase()}</p>
                                       </div>
                                    </div>
                                    <button className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                                       <FileDown className="w-5 h-5" /> Download Shard (PDF)
                                    </button>
                                 </div>
                              </div>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ACOUSTIC REGISTRY */}
        {tab === 'audio' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="glass-card p-16 rounded-[64px] bg-indigo-900/10 border-indigo-500/20 flex flex-col md:flex-row items-center gap-16 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform"><Database size={400} className="text-indigo-400" /></div>
                <div className="w-56 h-56 rounded-[56px] bg-indigo-600 flex items-center justify-center shadow-3xl shrink-0 border-4 border-white/5 relative group overflow-hidden">
                   <Headphones className="w-24 h-24 text-white group-hover:scale-110 transition-transform relative z-10" />
                   <div className="absolute inset-8 rounded-full border-[10px] border-white/10 animate-spin-slow"></div>
                </div>
                <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                   <div className="space-y-2">
                      <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em]">EOS_ACOUSTIC_NODE</span>
                      <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic m-0">AGROMUSIKA <span className="text-indigo-400">LIBRARY</span></h2>
                   </div>
                   <p className="text-slate-400 text-xl font-medium italic">Bio-electric Plant Wave protocols and scientific rhythmic signatures for soil molecular repair.</p>
                   <div className="pt-4 flex gap-4 justify-center md:justify-start">
                      <button 
                        onClick={() => { setAudioUploadStep('upload'); setShowAudioUpload(true); }}
                        className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                      >
                         <PlusCircle className="w-5 h-5" /> Plant Rhythm Ingest
                      </button>
                      <button 
                        onClick={() => setShowIngestLogs(true)}
                        className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-slate-500 font-black text-xs uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
                      >
                         <History className="w-5 h-5" /> Ingest Logs
                      </button>
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                {audioTracks.map((track, i) => (
                  <div key={i} onClick={() => setActiveAudioTrack(track)} className="p-10 bg-white/[0.02] border border-white/5 rounded-[48px] hover:bg-white/[0.05] hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden">
                     <div className="flex items-center gap-10 w-full md:w-auto">
                        <div className="w-20 h-20 rounded-[28px] bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/10 transition-all border border-white/5 group-hover:border-indigo-500/40">
                           <track.icon className={`w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors`} />
                        </div>
                        <div>
                           <p className="text-2xl font-black text-white uppercase tracking-tight m-0 italic leading-none">{track.title}</p>
                           <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3">{track.type} // {track.duration}</p>
                        </div>
                     </div>
                     <div className="text-right flex items-center gap-8 mt-6 md:mt-0 w-full md:w-auto justify-end">
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                           track.free ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                        }`}>{track.cost}</span>
                        <button className="p-5 bg-white/5 border border-white/10 rounded-2xl text-slate-700 hover:text-white transition-all shadow-xl active:scale-90">
                           <Download className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/20 w-0 group-hover:w-full transition-all duration-[3s]"></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: WAVES LAB */}
        {tab === 'waves' && (
           <div className="max-w-6xl mx-auto space-y-12 animate-in zoom-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-3xl">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-[10s]">
                       <Sprout size={450} className="text-emerald-400" />
                    </div>
                    <div className="relative z-10 space-y-10 w-full">
                       <div className="flex items-center gap-6">
                          <div className="p-6 bg-emerald-500 rounded-[32px] shadow-3xl shadow-emerald-900/40 relative group overflow-hidden">
                             <WaveIcon className="w-12 h-12 text-white relative z-10" />
                             <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                          <div>
                             <h3 className="text-5xl font-black text-white uppercase tracking-tighter m-0 italic">PLANT WAVE <br/><span className="text-emerald-400">MONITORING</span></h3>
                             <p className="text-emerald-400/60 text-[11px] font-black uppercase tracking-[0.5em] mt-3">ACTIVE BIO-ELECTRIC SYNCHRONIZATION</p>
                          </div>
                       </div>
                       <div className="flex items-end gap-3 h-48 pt-10">
                          {[...Array(50)].map((_, i) => (
                            <div key={i} className="flex-1 bg-emerald-500/60 rounded-full animate-pulse group-hover:bg-emerald-400 transition-colors" style={{ height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 40}%`, animationDelay: `${i * 0.05}s` }}></div>
                          ))}
                       </div>
                       <div className="grid grid-cols-3 gap-10 pt-10 border-t border-white/10 text-center">
                          <div className="space-y-1"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">VOLTAGE DRIFT</p><p className="text-3xl font-mono font-black text-white">4.2<span className="text-xs text-slate-700 ml-1">mV</span></p></div>
                          <div className="space-y-1"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">PHOTOSYNTH RES.</p><p className="text-3xl font-mono font-black text-emerald-400">88.4<span className="text-xs ml-1">%</span></p></div>
                          <div className="space-y-1"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">SYNC INDEX</p><p className="text-3xl font-mono font-black text-blue-400">0.94</p></div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8 flex flex-col">
                    <div className="glass-card p-10 rounded-[56px] border-amber-500/20 bg-amber-500/5 flex-1 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
                       <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform"><Bot size={300} className="text-amber-500" /></div>
                       <div className="relative z-10 space-y-8">
                          <div className="flex items-center gap-4">
                             <div className="p-4 bg-amber-500/20 rounded-[24px] border border-amber-500/30 shadow-xl">
                                <Zap className="w-8 h-8 text-amber-500 fill-current" />
                             </div>
                             <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic m-0">FREQUENCY <span className="text-amber-500">ORACLE</span></h4>
                          </div>
                          <p className="text-slate-400 text-lg leading-relaxed italic font-medium">"Unlock real-time bio-electric frequency analysis for your farm node. Optimize yield through ultrasonic modulation."</p>
                          
                          <div className="p-8 bg-black/60 rounded-3xl border border-white/10 space-y-6 shadow-inner relative overflow-hidden">
                             <div className="flex items-center gap-3 relative z-10">
                                <Zap className="w-5 h-5 text-amber-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">PRO SHARD ACCESS</span>
                             </div>
                             <button 
                              onClick={() => handleSubscribe('plant_wave_pro_lab', 150)}
                              disabled={subscriptions.includes('plant_wave_pro_lab')}
                              className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.3em] shadow-3xl disabled:opacity-50 relative z-10 hover:scale-[1.02] active:scale-95 transition-all"
                             >
                                {subscriptions.includes('plant_wave_pro_lab') ? 'ACTIVE LINK' : 'SUBSCRIBE 150 EAC'}
                             </button>
                             <div className="absolute inset-0 bg-amber-50/[0.02] animate-pulse"></div>
                          </div>
                       </div>
                       <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-[32px] text-center shadow-xl">
                          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em] mb-3">LIVE WAVE ID</p>
                          <p className="text-xs font-mono text-indigo-400 font-bold tracking-widest">EA_WAVE_#842_SYNC</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* 0. Plant Rhythm Upload Modal */}
      {showAudioUpload && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowAudioUpload(false)}></div>
           <div className="relative z-[610] w-full max-w-xl glass-card rounded-[64px] border-emerald-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-12 md:p-16 space-y-10 min-h-[650px] flex flex-col justify-center">
                 <button onClick={() => setShowAudioUpload(false)} className="absolute top-10 right-10 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X size={32} /></button>
                 
                 {audioUploadStep === 'upload' && (
                    <div className="space-y-10 text-center animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
                          <Music className="w-12 h-12 text-emerald-400" />
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Sonic <span className="text-emerald-400">Ingest</span></h3>
                          <p className="text-slate-400 text-lg italic leading-relaxed">Upload rhythms generated from your plant wave technology device.</p>
                       </div>
                       
                       <div 
                         onClick={() => audioInputRef.current?.click()}
                         className={`p-16 border-4 border-dashed rounded-[48px] transition-all flex flex-col items-center justify-center cursor-pointer group ${audioFile ? 'bg-emerald-600/10 border-emerald-500' : 'bg-black/40 border-white/10 hover:border-emerald-500/40'}`}
                       >
                          <input type="file" ref={audioInputRef} onChange={handleAudioFileSelect} className="hidden" accept="audio/*" />
                          {audioFile ? (
                             <div className="text-center space-y-4">
                                <div className="p-6 bg-emerald-500/10 rounded-full">
                                   <AudioLines className="w-16 h-16 text-emerald-500 animate-pulse" />
                                </div>
                                <p className="text-sm font-black text-white uppercase">{audioFile.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">FILE_BUFFERED_OK</p>
                             </div>
                          ) : (
                             <>
                                <Mic2 className="w-14 h-14 text-slate-800 group-hover:text-emerald-500 transition-all mb-4" />
                                <p className="text-xs font-black uppercase text-slate-700 group-hover:text-emerald-400 tracking-widest">Select Audio Shard</p>
                             </>
                          )}
                       </div>
                    </div>
                 )}

                 {audioUploadStep === 'metadata' && (
                    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500 flex-1 flex flex-col justify-center">
                       <div className="space-y-4">
                          <h4 className="text-xl font-black text-white uppercase italic tracking-widest text-center">Shard <span className="text-emerald-400">Identity</span></h4>
                          <p className="text-slate-500 text-sm text-center">Define the biological source of the rhythmic signature.</p>
                       </div>
                       <div className="space-y-8">
                          <div className="space-y-3 px-4">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left">Plant Source</label>
                             <select value={plantSource} onChange={e => setPlantSource(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-black appearance-none outline-none focus:ring-4 focus:ring-emerald-500/20 uppercase text-xs">
                                <option>Rose Flower</option>
                                <option>Bamboo Shard</option>
                                <option>Aloe Vera Node</option>
                                <option>Ancient Baobab</option>
                                <option>Sunflower Relay</option>
                             </select>
                          </div>
                          <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] flex items-center gap-6">
                             <ShieldCheck className="w-10 h-10 text-emerald-400" />
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                                By anchoring this signature, you prove the biological resonance of your regional node.
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={handleFinalizeAudioUpload}
                         className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                       >
                          COMMENCE ZK-SYNC
                       </button>
                    </div>
                 )}

                 {audioUploadStep === 'sync' && (
                    <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-500 py-10 text-center">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Fingerprint className="w-10 h-10 text-emerald-400 animate-pulse" />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <p className="text-emerald-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Anchoring Shard...</p>
                          <p className="text-slate-600 font-mono text-[10px]">SYNCING_ACOUSTIC_REGISTRY // 0x882_SONIC</p>
                       </div>
                    </div>
                 )}

                 {audioUploadStep === 'success' && (
                    <div className="space-y-12 animate-in zoom-in duration-700 flex flex-col items-center text-center">
                       <div className="w-48 h-48 agro-gradient rounded-full flex items-center justify-center shadow-[0_0_150px_rgba(16,185,129,0.3)] relative group">
                          <CheckCircle2 className="w-24 h-24 text-white group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-[-10px] border-4 border-emerald-500/20 rounded-full animate-ping"></div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">Acoustic <span className="text-emerald-400">Anchored</span></h3>
                          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">Registry ID: 0x882_OK_{Math.random().toString(16).substring(2,6).toUpperCase()}</p>
                       </div>
                       <button onClick={() => setShowAudioUpload(false)} className="w-full py-8 bg-white/5 border border-white/10 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] hover:bg-white/10 transition-all shadow-xl active:scale-95">Finalize Ingest</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* 0.1 Ingest Logs Modal */}
      {showIngestLogs && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowIngestLogs(false)}></div>
          <div className="relative z-[610] w-full max-w-2xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2 flex flex-col max-h-[80vh]">
            <div className="p-12 border-b border-white/5 bg-indigo-500/[0.02] flex items-center justify-between shrink-0">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-600 rounded-[28px] flex items-center justify-center shadow-2xl">
                     <History className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">Ingest <span className="text-indigo-400">Ledger</span></h3>
                     <p className="text-[10px] text-indigo-400/60 font-mono tracking-widest uppercase mt-2">SONIC_SHARD_HISTORY // SECURED</p>
                  </div>
               </div>
               <button onClick={() => setShowIngestLogs(false)} className="p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={32} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-6">
               {MOCK_INGEST_LOGS.map(log => (
                  <div key={log.id} className="p-8 glass-card border border-white/5 rounded-[40px] hover:bg-white/[0.02] transition-all group flex items-center justify-between cursor-pointer active:scale-[0.99]">
                     <div className="flex items-center gap-8">
                        <div className="p-5 rounded-2xl bg-white/5 group-hover:bg-indigo-600/10 transition-all border border-white/5">
                           <Mic2 size={24} className="text-indigo-400" />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white uppercase tracking-tight italic leading-none">{log.source} Rhythm</h4>
                           <p className="text-[10px] text-slate-500 mt-2 uppercase font-black">{log.date} // {log.id}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="flex items-center gap-2 justify-end text-emerald-400 font-mono font-black text-xs mb-1">
                           <BadgeCheck size={14} className="text-emerald-500" /> {log.status}
                        </div>
                        <span className="text-[8px] text-slate-700 font-mono tracking-widest">{log.hash}</span>
                     </div>
                  </div>
               ))}
               <div className="p-8 bg-black/40 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 opacity-30 mt-6">
                  <FileSearch size={32} className="text-slate-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest">End of Industrial Shard History</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Video Modal */}
      {activeVideoNode && (
        <div className="fixed inset-0 z-[500] flex flex-col animate-in fade-in duration-500 overflow-hidden">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl"></div>
           <div className="relative z-[510] p-6 md:p-10 border-b border-white/5 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl border border-white/10">
                    <VideoIcon size={28} className="text-white" />
                 </div>
                 <div>
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic m-0 truncate max-w-[200px] md:max-w-none">{activeVideoNode.title}</h2>
                    <p className="text-indigo-400 text-[9px] font-mono tracking-widest uppercase mt-2">{activeVideoNode.id} // SECURED_STREAM_v4</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-white transition-all"><Maximize2 size={24} /></button>
                 <button onClick={() => setActiveVideoNode(null)} className="p-4 bg-white/5 rounded-full text-slate-500 hover:text-rose-500 transition-all"><X size={24} /></button>
              </div>
           </div>
           
           <div className="flex-1 relative flex flex-col lg:flex-row overflow-hidden bg-black">
              <div className={`flex-1 relative transition-all duration-700 ${isFullScreen ? 'w-full' : ''}`}>
                 <img src={activeVideoNode.thumb} className="w-full h-full object-cover opacity-60 grayscale-[0.5]" alt="Stream" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-dashed border-white/20 rounded-full flex items-center justify-center animate-spin-slow">
                       <Loader2 className="w-12 h-12 md:w-20 md:h-20 text-indigo-400 animate-spin" />
                    </div>
                 </div>
                 <div className="absolute bottom-10 left-10 p-6 bg-black/60 backdrop-blur-xl rounded-[32px] border border-white/10 space-y-4 shadow-3xl">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">INGEST_SIGNAL: 100% OK</span>
                    </div>
                    <p className="text-xs text-slate-400 italic">"Processing real-time spectral telemetry shards..."</p>
                 </div>
              </div>
              
              {!isFullScreen && (
                <div className="w-full lg:w-[450px] bg-[#050706] border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-500">
                   <div className="p-10 border-b border-white/5 flex items-center justify-between">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-3"><Terminal className="w-5 h-5 text-indigo-400" /> STREAM_INTEL</h3>
                   </div>
                   <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10 font-mono text-[11px]">
                      <div className="space-y-4">
                         <p className="text-indigo-400">[SYSTEM] Handshake initiated...</p>
                         <p className="text-slate-500">[AUTH] ZK-SNARK signature verified.</p>
                         <p className="text-emerald-500">[LEDGER] Shard #{(Math.random()*1000).toFixed(0)} linked.</p>
                         <p className="text-slate-500">[IO] Ingesting multi-spectral logs...</p>
                         <p className="text-amber-500">[ALERT] Atmospheric resonance spike detected.</p>
                      </div>
                      <div className="p-8 bg-white/5 rounded-[40px] border border-white/5 space-y-6">
                         <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-black uppercase">Consensus Status</span>
                            <span className="text-emerald-400 font-black">99.8%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[99%] animate-pulse"></div>
                         </div>
                      </div>
                      <div className="p-8 glass-card rounded-[40px] border-indigo-500/20 bg-indigo-500/5 space-y-4">
                         <Bot className="w-6 h-6 text-indigo-400" />
                         <p className="text-slate-300 italic leading-relaxed">"The current node is exhibiting stable growth patterns. Advise maintaining current irrigation shards."</p>
                      </div>
                   </div>
                   <div className="p-10 border-t border-white/5 bg-black/40">
                      <button className="w-full py-5 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-3xl active:scale-95 transition-all">DECODE RAW DATA SHARD</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* 2. Article Reader Modal - ENHANCED TO MATCH SCREENSHOT */}
      {activeArticle && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setActiveArticle(null)}></div>
           <div className="relative z-510 w-full max-w-4xl h-[90vh] glass-card rounded-[64px] border-emerald-500/30 bg-[#050706]/95 overflow-hidden shadow-[0_0_150px_rgba(16,185,129,0.15)] animate-in zoom-in duration-300 border-2 flex flex-col">
              <div className="h-96 relative overflow-hidden shrink-0">
                 <img src={activeArticle.img} className="w-full h-full object-cover opacity-40" alt="Article" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/20 to-transparent"></div>
                 <button onClick={() => setActiveArticle(null)} className="absolute top-10 right-10 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white hover:text-emerald-400 transition-all shadow-2xl z-50"><X size={32} /></button>
                 <div className="absolute bottom-12 left-12 right-12 space-y-4">
                    <span className="px-5 py-2 bg-emerald-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-2xl border border-white/20">{activeArticle.author}</span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">{activeArticle.title}</h2>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 custom-scrollbar bg-white/[0.01]">
                 <div className="max-w-3xl mx-auto space-y-12">
                    {/* Metadata Header */}
                    <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                       <div className="flex items-center gap-3">
                          <History className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-slate-500 uppercase">{activeArticle.time}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <Eye className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs font-mono font-bold text-slate-500">1.2K READS</span>
                       </div>
                       <div className="ml-auto flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">REGISTRY_VERIFIED_SHARD</span>
                       </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-12">
                       <p className="text-slate-300 text-3xl leading-relaxed italic font-medium">
                          {activeArticle.content}
                       </p>
                       
                       <p className="text-slate-400 text-xl leading-[1.8] font-medium">
                          This breakthrough in bio-resonance demonstrates the network's ability to scale biological optimization through decentralized industrial nodes. By synchronizing regional frequencies with the global m-constant registry, we ensure a higher sustainability score across all participating shards, driving the agricultural revolution forward.
                       </p>
                       
                       {/* Shard Insight Box */}
                       <div className="p-10 bg-black rounded-[48px] border border-white/5 space-y-8 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Bot size={120} /></div>
                          <div className="flex items-center gap-4">
                             <Sparkles className="w-7 h-7 text-emerald-400" />
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">SHARD_INSIGHT</h4>
                          </div>
                          <p className="text-slate-400 italic font-medium text-lg md:text-xl leading-relaxed border-l-2 border-emerald-500/30 pl-10">
                             "This research node establishes a new baseline for C(a) constant stability in tropical clusters. Recommended implementation cycle: Q4."
                          </p>
                       </div>

                       {/* Read Shard Link */}
                       <div className="flex justify-end pt-12">
                          <button className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-[0.5em] group hover:text-white transition-colors">
                             READ SHARD <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Redesigned Footer Section */}
              <div className="h-64 md:h-80 relative overflow-hidden shrink-0 border-t border-white/10">
                 <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200" className="w-full h-full object-cover opacity-60 grayscale-[0.2]" alt="Footer bg" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                 
                 <div className="absolute inset-0 p-12 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6">
                       <span className="px-6 py-2 bg-black/80 backdrop-blur-xl rounded-full text-xs font-black text-white uppercase tracking-widest border border-white/20 shadow-2xl">REGISTRY AUDIT</span>
                       <div className="flex items-center gap-6">
                          <Fingerprint className="w-10 h-10 text-slate-500" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-[0.4em]">ZK-PROOF: AUTH_SYNC_OK</p>
                             <p className="text-lg font-mono text-slate-400 font-bold uppercase tracking-widest">0x882_ARTICLE_SYNC</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="relative group">
                       <button className="px-16 py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.4em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-5 ring-8 ring-white/5">
                          <FileDown className="w-8 h-8" />
                          DOWNLOAD SHARD (PDF)
                       </button>
                       {/* Bot Mini Icon Overlap */}
                       <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#050706] rounded-2xl flex items-center justify-center border-2 border-emerald-500 shadow-2xl group-hover:rotate-12 transition-transform">
                          <Bot className="w-6 h-6 text-emerald-500" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 3. Audio Player Modal */}
      {activeAudioTrack && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setActiveAudioTrack(null)}></div>
           <div className="relative z-[510] w-full max-w-2xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12 min-h-[600px] flex flex-col items-center text-center">
                 <button onClick={() => setActiveAudioTrack(null)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all"><X size={32} /></button>
                 
                 <div className="w-64 h-64 bg-indigo-600 rounded-[56px] flex items-center justify-center shadow-[0_0_100px_rgba(79,70,229,0.3)] border-4 border-white/5 relative group overflow-hidden">
                    <activeAudioTrack.icon className="w-32 h-32 text-white relative z-10 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-10 rounded-full border-[12px] border-white/10 animate-spin-slow"></div>
                 </div>

                 <div className="space-y-4">
                    <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 tracking-widest">ACOUSTIC_SHARD // {activeAudioTrack.type}</span>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">{activeAudioTrack.title}</h3>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Registry ID: 0x882_SONIC_{Math.random().toString(16).substring(2,6).toUpperCase()}</p>
                 </div>

                 <div className="w-full space-y-8 py-6">
                    <div className="flex items-end justify-center gap-2 h-20">
                       {[...Array(32)].map((_, i) => (
                         <div key={i} className="flex-1 bg-indigo-500/40 rounded-full animate-pulse" style={{ height: `${20+Math.random()*80}%`, animationDelay: `${i*0.05}s` }}></div>
                       ))}
                    </div>
                    <div className="space-y-3">
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-indigo-500 w-[35%] shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                       </div>
                       <div className="flex justify-between text-[10px] font-mono text-slate-600 font-black">
                          <span>11:12</span>
                          <span>{activeAudioTrack.duration}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-10">
                    <button className="p-4 text-slate-700 hover:text-white transition-colors"><Volume1 size={28} /></button>
                    <button className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-black shadow-3xl hover:scale-110 active:scale-90 transition-all border-4 border-indigo-500/20">
                       <Play className="w-12 h-12 fill-current translate-x-1" />
                    </button>
                    <button className="p-4 text-slate-700 hover:text-white transition-colors"><RefreshCcw size={28} /></button>
                 </div>
                 
                 <div className="pt-10 w-full border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <Info size={16} className="text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Effect: Soil De-compaction active</span>
                    </div>
                    <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest shadow-xl">Export Sonic Shard</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .pause-marquee:hover { animation-play-state: paused; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MediaHub;
