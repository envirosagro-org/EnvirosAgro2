
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  // Added PlayCircle to resolve "Cannot find name 'PlayCircle'" error
  PlayCircle,
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
  CheckCircle,
  QrCode,
  Mic,
  MicOff,
  Settings,
  SmartphoneNfc,
  Cast,
  Box,
  Link2,
  Globe2,
  CircleStop,
  Signature,
  RefreshCw,
  FlipHorizontal,
  FileUp,
  AudioWaveform,
  Podcast,
  PencilRuler,
  ThumbsUp,
  MessageSquare,
  CircleDot
} from 'lucide-react';
import { User, ViewState } from '../types';
import { searchAgroTrends, chatWithAgroExpert, AIResponse } from '../services/geminiService';

interface MediaHubProps {
  user: User;
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
  onEarnEAC: (amount: number, reason: string) => void;
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

const MediaHub: React.FC<MediaHubProps> = ({ user, userBalance, onSpendEAC, onEarnEAC }) => {
  const [tab, setTab] = useState<'all' | 'video' | 'news' | 'audio' | 'waves' | 'blog' | 'streaming'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AIResponse | null>(null);

  // Active Video/Media States
  const [activeVideoNode, setActiveVideoNode] = useState<any | null>(null);

  // Streaming Portal States
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamMode, setStreamMode] = useState<'GENERAL' | 'EVIDENCE' | 'TASK_SYNC' | 'ORACLE_PODCAST'>('GENERAL');
  const [bitrate, setBitrate] = useState(4500);
  const [latency, setLatency] = useState(14);
  const [streamDuration, setStreamDuration] = useState(0);
  const [reactionPool, setReactionPool] = useState<{type: string, id: number}[]>([]);
  const [reactionStats, setReactionStats] = useState({ hearts: 0, zaps: 0, check: 0 });
  const [totalEacEarnedFromStream, setTotalEacEarnedFromStream] = useState(0);
  
  const [showSignatureModal, setShowSignatureModal] = useState<'video' | 'voice' | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureHash, setSignatureHash] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Device References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Live Oracle Logic States
  const [oracleActive, setOracleActive] = useState(false);

  // Blog States
  const [blogTopic, setBlogTopic] = useState('');
  const [isForgingBlog, setIsForgingBlog] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<string | null>(null);
  const [blogHistory, setBlogHistory] = useState([
    { id: 'BLG-01', title: 'The 432Hz Soil Resilience Protocol', date: '2h ago', type: 'Technical' },
    { id: 'BLG-02', title: 'Bantu Seed Lineages: A Registry Audit', date: '1d ago', type: 'Heritage' }
  ]);

  // Audio/Waves States
  const [audioTracks, setAudioTracks] = useState(INITIAL_AUDIO_TRACKS);
  const [activeAudioTrack, setActiveAudioTrack] = useState<any | null>(null);

  // News States
  const premiumNewsletters = [
    { id: 'NL-882', name: 'PLANT WAVE INSIDER', price: 150, icon: Sprout, desc: 'Deep-dives into bio-electric resonance protocols.' },
    { id: 'NL-104', name: 'EOS MARKET PULSE', price: 200, icon: TrendingUp, desc: 'Institutional analysis of EAC/EAT regional liquidity.' },
  ];

  useEffect(() => {
    fetchLatestNews();
  }, []);

  useEffect(() => {
    let interval: any;
    let reactionInterval: any;
    
    if (isBroadcasting) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
        setBitrate(4500 + Math.floor(Math.random() * 500));
        setLatency(12 + Math.floor(Math.random() * 6));
      }, 1000);

      reactionInterval = setInterval(() => {
        const types = ['heart', 'zap', 'check'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newReaction = { type, id: Date.now() };
        
        setReactionPool(prev => [...prev, newReaction].slice(-10));
        setReactionStats(prev => ({
          ...prev,
          hearts: type === 'heart' ? prev.hearts + 1 : prev.hearts,
          zaps: type === 'zap' ? prev.zaps + 1 : prev.zaps,
          check: type === 'check' ? prev.check + 1 : prev.check,
        }));
        
        const reward = type === 'zap' ? 0.5 : type === 'check' ? 1.0 : 0.2;
        setTotalEacEarnedFromStream(prev => prev + reward);
        onEarnEAC(reward, `LIVE_REACTION_REWARD_${streamTitle}`);
      }, 4000);
    } else {
      setStreamDuration(0);
      setReactionPool([]);
    }
    return () => { 
      if (interval) clearInterval(interval); 
      if (reactionInterval) clearInterval(reactionInterval);
    };
  }, [isBroadcasting]);

  useEffect(() => {
    return () => { stopStream(); };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const fetchLatestNews = async () => {
    setLoadingNews(true);
    const result = await searchAgroTrends("Industrial agricultural innovations and Five Thrusts updates including bio-electric plant waves");
    setNewsResult(result);
    setLoadingNews(false);
  };

  const initMediaStream = async (mode: 'user' | 'environment', muted: boolean) => {
    setIsInitializing(true);
    stopStream();
    try {
      const constraints = {
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: !muted
      };
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !muted });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(e => console.error("Video play failed:", e));
      }
      return true;
    } catch (err: any) {
      alert("SIGNAL_ERROR: Permission denied. Registry requires direct camera/audio access for ingest.");
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  const handleStartStream = async () => {
    if (!isRegistered) {
      alert("REGISTRATION_REQUIRED: Initialize broadcast metadata before going live.");
      return;
    }
    const success = await initMediaStream(facingMode, isMuted);
    if (success) {
      setIsBroadcasting(true);
      setStreamDuration(0);
      if (streamMode === 'ORACLE_PODCAST') setOracleActive(true);
    }
  };

  const handleStopStream = () => {
    if (confirm("STOP_BROADCAST: Confirm termination of live registry ingest. All session data will be sharded and archived.")) {
      setIsBroadcasting(false);
      setIsRegistered(false);
      setOracleActive(false);
      stopStream();
      alert(`STREAM FINALIZED: You earned ${totalEacEarnedFromStream.toFixed(2)} EAC from public reactions. Referendum weight successfully anchored.`);
    }
  };

  const toggleCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    if (isBroadcasting) await initMediaStream(newMode, isMuted);
  };

  const toggleMute = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => { track.enabled = !newMuteStatus; });
    }
  };

  const executeSignature = () => {
    setIsSigning(true);
    setSignatureHash(null);
    setTimeout(() => {
      if (showSignatureModal === 'video' && videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0);
        }
      }
      setIsSigning(false);
      const hash = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}_${showSignatureModal?.toUpperCase()}_SIG`;
      setSignatureHash(hash);
    }, 2500);
  };

  const handleForgeBlog = async () => {
    if (!blogTopic.trim()) return;
    const COST = 20;
    if (!onSpendEAC(COST, `BLOG_FORGE_${blogTopic.toUpperCase()}`)) return;
    setIsForgingBlog(true);
    setGeneratedBlog(null);
    try {
      const prompt = `Write a technical blog post shard for EnvirosAgro network about: "${blogTopic}". 
      Include sections for Registry Abstract, SEHTI alignment, and C(a) impact. Use markdown.`;
      const response = await chatWithAgroExpert(prompt, [], true);
      setGeneratedBlog(response.text);
      setBlogHistory([{ id: `BLG-${Math.floor(Math.random() * 100)}`, title: blogTopic, date: 'Just now', type: 'AI_SYNTH' }, ...blogHistory]);
    } catch (e) {
      alert("Oracle Congestion: Synthesis interrupted.");
    } finally {
      setIsForgingBlog(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const publicProofWeight = useMemo(() => {
    const total = reactionStats.hearts + reactionStats.zaps + reactionStats.check;
    if (total === 0) return 0;
    return Math.min(100, (reactionStats.check * 2 + reactionStats.zaps * 1.5 + reactionStats.hearts) * 0.5);
  }, [reactionStats]);

  const liveNodes = VIDEO_NODES.filter(n => n.status === 'LIVE');
  const archiveNodes = VIDEO_NODES.filter(n => n.status === 'ARCHIVE');

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
              {newsResult?.text?.replace(/\n/g, ' • ') || 'Registry synchronized. No anomalies detected. Node m-Constant steady at 1.42x.'}
            </div>
          )}
        </div>
      </div>

      {/* Navigation & Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full lg:w-auto">
          {[
            { id: 'all', label: 'PRIMARY HUB' },
            { id: 'streaming', label: 'LIVE BROADCAST' },
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
      </div>

      <div className="min-h-[600px]">
        {/* TAB: LIVE BROADCAST */}
        {tab === 'streaming' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
             <div className="lg:col-span-4 space-y-8">
                {!isRegistered ? (
                   <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-8 shadow-2xl animate-in slide-in-from-left-6">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl flex items-center justify-center border border-white/10">
                            <Podcast className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Event <span className="text-indigo-400">Planning</span></h3>
                            <p className="text-[10px] font-mono text-indigo-400/60 font-bold uppercase tracking-widest mt-2">PRE_INGEST_CONFIGURATION</p>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Broadcast Initials / Title</label>
                            <input 
                              type="text" 
                              value={streamTitle}
                              onChange={e => setStreamTitle(e.target.value)}
                              placeholder="e.g. ZONE_4_SOIL_AUDIT"
                              className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all uppercase placeholder:text-slate-800"
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Broadcast Purpose</label>
                            <div className="grid grid-cols-2 gap-3">
                               {[
                                  { id: 'GENERAL', l: 'General', i: Globe },
                                  { id: 'EVIDENCE', l: 'Evidence Ingest', i: ShieldCheck },
                                  { id: 'TASK_SYNC', l: 'Task Sharding', i: Settings },
                                  { id: 'ORACLE_PODCAST', l: 'Oracle Podcast', i: Bot },
                               ].map(m => (
                                  <button 
                                    key={m.id} 
                                    onClick={() => setStreamMode(m.id as any)}
                                    className={`p-4 rounded-[28px] border-2 transition-all flex flex-col items-center gap-2 group/btn ${streamMode === m.id ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-xl' : 'bg-black border-white/10 text-slate-500 hover:border-white/30'}`}
                                  >
                                     <m.i size={18} className={streamMode === m.id ? 'text-indigo-400' : 'text-slate-700 group-hover/btn:text-slate-400'} />
                                     <span className="text-[9px] font-black uppercase tracking-tight">{m.l}</span>
                                   </button>
                               ))}
                            </div>
                         </div>
                         <button 
                           onClick={() => { if(streamTitle) setIsRegistered(true); }}
                           disabled={!streamTitle}
                           className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                         >
                            AUTHORIZE BROADCAST
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700"><Activity size={200} className="text-emerald-400" /></div>
                      <div className="flex items-center gap-6 relative z-10">
                         <div className="w-16 h-16 bg-emerald-600 rounded-3xl shadow-xl flex items-center justify-center border border-white/10">
                            <Cast className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Broadcaster <span className="text-emerald-400">Node</span></h3>
                            <p className="text-[10px] font-mono text-emerald-500/60 font-bold uppercase tracking-widest mt-2">STREAM: {streamTitle}</p>
                         </div>
                      </div>
                      <div className="space-y-6 relative z-10">
                         <div className="p-6 bg-black/80 rounded-[32px] border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                               <span>Referendum Weight</span>
                               <span className="text-indigo-400 font-mono">{publicProofWeight.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" style={{ width: `${publicProofWeight}%` }}></div>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl text-center">
                               <p className="text-[9px] text-emerald-500 font-black uppercase mb-1">Reaction Yield</p>
                               <p className="text-3xl font-mono font-black text-white">+{totalEacEarnedFromStream.toFixed(1)} <span className="text-xs">EAC</span></p>
                            </div>
                            <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-3xl text-center">
                               <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">Vouch Count</p>
                               <p className="text-3xl font-mono font-black text-white">{reactionStats.check + reactionStats.zaps + reactionStats.hearts}</p>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4">Registry Tool Ingest</label>
                            <div className="flex gap-3">
                               <button onClick={toggleCamera} className="flex-1 p-5 rounded-3xl border-2 border-white/10 bg-black text-slate-400 hover:text-white transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest">
                                  <FlipHorizontal size={18} /> Flip Camera
                               </button>
                               <button onClick={toggleMute} className={`p-5 rounded-3xl border-2 transition-all ${isMuted ? 'border-rose-500 bg-rose-500/10 text-rose-500' : 'border-white/10 bg-black text-slate-400'}`}>
                                 {isMuted ? <VolumeX size={18} /> : <Mic size={18} />}
                               </button>
                            </div>
                         </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 relative z-10">
                         {isBroadcasting ? (
                           <button onClick={handleStopStream} className="w-full py-8 bg-rose-600 hover:bg-rose-500 rounded-[40px] text-white font-black text-xs uppercase tracking-[0.5em] shadow-xl transition-all flex items-center justify-center gap-4">
                              <CircleStop className="w-6 h-6 fill-current animate-pulse" /> TERMINATE INGEST
                           </button>
                         ) : (
                           <button onClick={handleStartStream} disabled={isInitializing} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                              {isInitializing ? <Loader2 size={24} className="animate-spin" /> : <Play size={24} className="fill-current" />}
                              {isInitializing ? 'CALIBRATING...' : 'GO LIVE ON REGISTRY'}
                           </button>
                         )}
                      </div>
                   </div>
                )}
                
                <div className="p-8 glass-card rounded-[48px] border border-indigo-500/10 bg-indigo-500/5 space-y-6 shadow-xl">
                   <div className="flex items-center gap-3">
                      <History size={16} className="text-indigo-400" />
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">Broadcast Referral Score</h4>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                      Viewer reactions act as a high-frequency referendum. High engagement strengthening the "Public Proof" of your node information effectiveness.
                   </p>
                </div>
             </div>

             <div className="lg:col-span-8 flex flex-col space-y-8">
                <div className="glass-card rounded-[64px] border-2 border-white/5 bg-black overflow-hidden relative group min-h-[650px] shadow-3xl">
                   <video ref={videoRef} autoPlay playsInline muted={true} className={`w-full h-full object-cover transition-opacity duration-1000 ${isBroadcasting ? 'opacity-100' : 'opacity-0'}`} />
                   {!isBroadcasting && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12 py-40 opacity-20">
                        <Monitor size={140} className="text-slate-500" />
                        <div className="text-center space-y-2">
                           <p className="text-4xl font-black text-white uppercase tracking-[0.5em] italic">DIRECT_INGEST_OFFLINE</p>
                           <p className="text-lg font-bold text-slate-600 uppercase tracking-widest italic">Authorize Metadata and Camera to initialize Ingest Shard</p>
                        </div>
                     </div>
                   )}
                   {isBroadcasting && (
                     <>
                        <div className="absolute top-10 left-10 flex gap-4">
                           <div className="px-6 py-2 bg-rose-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse">
                              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div> ON AIR
                           </div>
                           <div className="px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest font-mono">{formatTime(streamDuration)}</div>
                           <div className="px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest">#{streamMode}</div>
                        </div>

                        {/* Floating Reactions overlay */}
                        <div className="absolute bottom-32 right-10 flex flex-col gap-6 items-center pointer-events-none">
                           {reactionPool.map(r => (
                              <div key={r.id} className="animate-in fade-out slide-out-to-top duration-[4s] flex flex-col items-center">
                                 {r.type === 'heart' ? <Heart className="text-rose-500 fill-current w-8 h-8" /> : 
                                  r.type === 'zap' ? <Zap className="text-amber-400 fill-current w-8 h-8" /> : 
                                  <CheckCircle2 className="text-emerald-400 fill-current w-8 h-8" />}
                              </div>
                           ))}
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                           <div className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[40px] max-w-sm space-y-4">
                              <div className="flex items-center gap-3">
                                 <Users className="w-6 h-6 text-emerald-400" />
                                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Public Consensus Active</span>
                              </div>
                              <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                                 {streamMode === 'EVIDENCE' ? '"Public verifying field biometrics in real-time..."' : '"Community sharding active. Public proof weight increasing..."'}
                              </p>
                           </div>
                           <div className="flex gap-4">
                              <div className="p-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl text-center min-w-[120px]">
                                 <p className="text-[9px] text-slate-500 font-black uppercase mb-1">REFERENDUM</p>
                                 <p className="text-2xl font-mono font-black text-indigo-400">{publicProofWeight.toFixed(0)}%</p>
                              </div>
                              <div className="p-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl text-center min-w-[120px]">
                                 <p className="text-[9px] text-slate-500 font-black uppercase mb-1">MINTING</p>
                                 <p className="text-2xl font-mono font-black text-emerald-400">+{totalEacEarnedFromStream.toFixed(1)}</p>
                              </div>
                           </div>
                        </div>
                     </>
                   )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-10 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                      <div className="flex justify-between items-center px-4 border-b border-white/5 pb-6">
                         <h4 className="text-xl font-black text-white uppercase italic tracking-widest flex items-center gap-4"><Terminal className="w-5 h-5 text-emerald-400" /> Ingest Events</h4>
                         <span className="text-[9px] font-mono text-slate-700">NODE_{user.esin.split('-')[1]}</span>
                      </div>
                      <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar font-mono text-[10px]">
                         {isBroadcasting ? (
                            <>
                               <p className="text-indigo-400">[SYSTEM] BROADCAST_METADATA_ANCHORED: {streamTitle}</p>
                               <p className="text-slate-500">[INGEST] PUBLIC_REACTIONS_POOL_OPEN</p>
                               <p className="text-emerald-500">[REWARD] MINTING_EAC_PER_REACTION_ACTIVE</p>
                               <p className="text-blue-400">[ORACLE] CONSENSUS_REFERENDUM_TRACKING</p>
                            </>
                         ) : (<p className="text-slate-700 italic text-center py-10 uppercase tracking-widest">Register Metadata to initialize Stream Hub</p>)}
                      </div>
                   </div>
                   <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-center text-center shadow-xl group">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform"><Sparkles size={120} /></div>
                      <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] mb-2 relative z-10">Public Proof Strength</p>
                      <h4 className="text-7xl font-mono font-black text-white tracking-tighter relative z-10">{publicProofWeight.toFixed(1)}<span className="text-2xl text-emerald-400">%</span></h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase mt-4 relative z-10">Information Efficiency Multiplier</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: PRIMARY HUB */}
        {tab === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-3 glass-card p-12 rounded-[56px] relative overflow-hidden flex flex-col justify-end min-h-[500px] border border-white/5 group bg-black shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200')] bg-cover opacity-40 group-hover:scale-105 transition-transform duration-[10s]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-600/80 rounded-[28px] shadow-2xl backdrop-blur-md"><Globe className="w-10 h-10 text-white" /></div>
                    <div>
                      <span className="px-4 py-1.5 bg-red-600/20 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-500/40 tracking-[0.3em]">LIVE_SPECTRAL_FEED</span>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mt-2">SKYSCOUT <br/><span className="text-blue-400">SPECTRAL STREAM</span></h2>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xl max-w-xl font-medium">Observing moisture retention and soil temperature variances across global hubs.</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                     <button onClick={() => setTab('video')} className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95">
                        <Play className="w-5 h-5 fill-current" /> WATCH SHARD
                     </button>
                  </div>
                </div>
             </div>
             <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 flex flex-col justify-between group overflow-hidden relative shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><Waves className="w-64 h-64 text-white" /></div>
                <div className="py-8 relative z-10 text-center">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-3">RADIO_SYNC</p>
                   <h3 className="text-3xl font-black text-white uppercase italic m-0">PLANT WAVE</h3>
                   <p className="text-xs text-slate-500 mt-4 italic">"Resonance Logs"</p>
                </div>
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-3xl hover:scale-110 active:scale-95 mx-auto relative z-10 border-4 border-white/5">
                   {isPlaying ? <Pause size={40} className="fill-current" /> : <Play size={40} className="fill-current translate-x-1" />}
                </button>
             </div>
          </div>
        )}

        {/* TAB: VIDEO NODES - ENHANCED FOR LIVE STREAMS */}
        {tab === 'video' && (
          <div className="space-y-16 animate-in slide-in-from-right-4 duration-500 px-2 md:px-0">
             {/* Live Section */}
             <div className="space-y-8">
                <div className="flex justify-between items-end px-4 border-b border-white/5 pb-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-rose-600 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                         <Cast size={24} className="text-white" />
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Live Ingest <span className="text-rose-500">Nodes</span></h3>
                   </div>
                   <button 
                    onClick={() => setTab('streaming')}
                    className="px-8 py-3 bg-rose-600 hover:bg-rose-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl transition-all"
                   >
                     Initialize My Stream
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {liveNodes.map(node => (
                      <div key={node.id} className="glass-card rounded-[56px] overflow-hidden border-2 border-rose-500/20 hover:border-rose-500 transition-all flex flex-col group active:scale-[0.98] duration-300 bg-black/60 shadow-3xl relative">
                         <div className="h-64 relative overflow-hidden">
                            <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]" alt={node.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                            <div className="absolute top-6 left-6 flex gap-3">
                               <div className="px-4 py-1.5 bg-rose-600 rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div> LIVE NOW
                               </div>
                               <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[9px] font-black text-white border border-white/10 uppercase tracking-widest">{node.thrust}</span>
                            </div>
                            <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-mono border border-white/10">
                               <Users size={12} className="text-rose-500" /> {node.viewers.toLocaleString()}
                            </div>
                         </div>
                         <div className="p-10 space-y-6">
                            <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight leading-none group-hover:text-rose-500 transition-colors">{node.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">"{node.desc}"</p>
                            <button className="w-full py-5 bg-rose-600 hover:bg-rose-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                               <Eye size={16} /> Enter Stream
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Archive Section */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 px-4 border-b border-white/5 pb-6">
                   <div className="p-3 bg-slate-800 rounded-2xl">
                      <History size={24} className="text-slate-400" />
                   </div>
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Historic <span className="text-slate-500">Registry Shards</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {archiveNodes.map(node => (
                      <div key={node.id} className="glass-card rounded-[56px] overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col group active:scale-[0.98] duration-300 bg-black/20 shadow-xl relative">
                         <div className="h-64 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100">
                            <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s]" alt={node.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050706] to-transparent"></div>
                            <div className="absolute top-6 left-6">
                               <span className="px-4 py-1.5 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">ARCHIVED_NODE</span>
                            </div>
                         </div>
                         <div className="p-10 space-y-6">
                            <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tighter group-hover:text-indigo-400 transition-colors">{node.title}</h4>
                            <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY_REF: {node.id}</p>
                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                               <PlayCircle size={14} /> Download Shard
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* TAB: NEWSSTAND */}
        {tab === 'news' && (
          <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                   <div className="glass-card p-12 rounded-[56px] border border-white/5 bg-black/40 space-y-8 shadow-xl">
                      <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0">Institutional <span className="text-emerald-400">Bulletin</span></h3>
                      <div className="space-y-8">
                         {[
                           { t: 'Zone 4 Moisture Surge', d: 'Spectral data indicates high soil density in northern Nebraska clusters.', date: '30m ago', cat: 'TELEM' },
                           { t: 'Registry Upgrade Finalized', d: 'Handshake v5.0 now active across global nodes.', date: '2h ago', cat: 'SYSTEM' },
                           { t: 'New Carbon Shards Released', d: 'Registry authorizing 12M new credits in East Africa Hub.', date: '4h ago', cat: 'ECONOMY' },
                         ].map((item, i) => (
                           <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] hover:bg-emerald-600/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                              <div className="flex justify-between items-start mb-4">
                                 <span className="px-3 py-1 bg-white/10 rounded-lg text-[8px] font-black text-slate-500">{item.cat}</span>
                                 <span className="text-[10px] text-slate-700 font-mono">{item.date}</span>
                              </div>
                              <h4 className="text-2xl font-black text-white uppercase italic group-hover:text-emerald-400 transition-colors">{item.t}</h4>
                              <p className="text-slate-400 italic text-sm mt-3 opacity-80">"{item.d}"</p>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl">
                      <h4 className="text-xl font-black text-white uppercase italic">Premium <span className="text-indigo-400">Newsletters</span></h4>
                      {premiumNewsletters.map(nl => (
                         <div key={nl.id} className="p-6 bg-black/60 rounded-[32px] border border-white/5 space-y-4 shadow-inner group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><nl.icon size={20} /></div>
                               <h5 className="text-sm font-black text-white uppercase tracking-widest">{nl.name}</h5>
                            </div>
                            <p className="text-[10px] text-slate-500 italic">"{nl.desc}"</p>
                            <button className="w-full py-3 bg-indigo-800 hover:bg-indigo-700 rounded-xl text-[9px] font-black text-white uppercase shadow-lg">SUBSCRIBE ({nl.price} EAC)</button>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB: BLOG SHARDS */}
        {tab === 'blog' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500">
              <div className="lg:col-span-4 space-y-8">
                 <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform"><PencilRuler size={300} className="text-indigo-400" /></div>
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><PenTool className="w-8 h-8 text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Forge <span className="text-indigo-400">Blog Shard</span></h3>
                    </div>
                    <div className="space-y-6 relative z-10">
                       <textarea value={blogTopic} onChange={e => setBlogTopic(e.target.value)} placeholder="Enter technical topic for industrial synthesis..." className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-sm font-medium italic focus:ring-4 focus:ring-indigo-500/10 outline-none h-48 resize-none placeholder:text-slate-900 shadow-inner" />
                       <button onClick={handleForgeBlog} disabled={isForgingBlog || !blogTopic.trim()} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30 transition-all">
                          {isForgingBlog ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-current" />} {isForgingBlog ? 'SYNTHESIZING...' : 'FORGE SHARD'}
                       </button>
                    </div>
                 </div>
                 <div className="p-10 glass-card rounded-[48px] border border-white/5 bg-black/40 space-y-6">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Local Forge History</h4>
                    <div className="space-y-4">
                       {blogHistory.map(bh => (
                          <div key={bh.id} className="p-5 bg-white/5 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-indigo-600/10 transition-all">
                             <div className="min-w-0 flex-1 pr-4">
                                <p className="text-xs font-black text-white uppercase truncate">{bh.title}</p>
                                <p className="text-[9px] text-slate-600 uppercase font-mono mt-1">{bh.date} // {bh.type}</p>
                             </div>
                             <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-400" />
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[750px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
                    <div className="p-10 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                       <div className="flex items-center gap-4 text-indigo-400"><Terminal className="w-6 h-6" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Synthesis Terminal</span></div>
                    </div>
                    <div className="flex-1 p-12 overflow-y-auto custom-scrollbar relative">
                       {!generatedBlog && !isForgingBlog ? (
                         <div className="h-full flex flex-col items-center justify-center text-center space-y-12 opacity-20">
                            <BookOpen size={140} className="text-slate-500" />
                            <p className="text-4xl font-black uppercase tracking-[0.5em] text-white italic">FORGE_STANDBY</p>
                         </div>
                       ) : isForgingBlog ? (
                         <div className="h-full flex flex-col items-center justify-center space-y-12 py-20 animate-in zoom-in">
                            <Loader2 className="w-24 h-24 text-indigo-500 animate-spin" /><p className="text-indigo-400 font-black text-2xl uppercase tracking-[0.6em] animate-pulse italic">Sequencing Neural Shards...</p>
                         </div>
                       ) : (
                         <div className="animate-in slide-in-from-bottom-10 duration-700">
                            <div className="p-16 bg-black/80 rounded-[64px] border border-indigo-500/20 prose prose-invert prose-indigo max-w-none shadow-3xl border-l-8 border-l-indigo-500">
                               <div className="text-slate-300 text-xl leading-relaxed italic whitespace-pre-line font-medium">{generatedBlog}</div>
                            </div>
                            <div className="mt-16 flex justify-center"><button className="px-20 py-8 agro-gradient rounded-3xl text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl active:scale-95 transition-all">ANCHOR BLOG TO REGISTRY</button></div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {tab === 'audio' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="glass-card p-14 rounded-[64px] border border-indigo-500/20 bg-indigo-600/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-14 shadow-3xl">
                 <div className="w-28 h-28 bg-indigo-500 rounded-[40px] flex items-center justify-center shadow-3xl relative group">
                    <AudioLines className="w-12 h-12 text-white group-hover:scale-110 transition-transform" /><div className="absolute inset-0 bg-white/10 rounded-[40px] animate-pulse"></div>
                 </div>
                 <div className="flex-1 space-y-4">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">ACOUSTIC <span className="text-indigo-400">REGISTRY</span></h2>
                    <p className="text-slate-400 text-2xl font-medium italic max-w-2xl">High-fidelity bio-electric sonic shards sharded for planetary remediation.</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {audioTracks.map((track, i) => (
                    <div key={i} className={`p-10 glass-card rounded-[48px] border transition-all flex flex-col h-[450px] relative overflow-hidden group shadow-xl ${track.free ? 'bg-black/40 border-white/5 hover:border-emerald-500/30' : 'bg-indigo-900/10 border-indigo-500/20 hover:border-indigo-400'}`}>
                       <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-12 transition-transform`}><track.icon className={`w-8 h-8 ${track.free ? 'text-emerald-400' : 'text-indigo-400'}`} /></div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${track.free ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>{track.type}</span>
                       </div>
                       <h4 className="text-2xl font-black text-white uppercase italic leading-tight mb-4 flex-1 group-hover:text-indigo-400 transition-colors">{track.title}</h4>
                       <div className="space-y-4 pt-10 border-t border-white/5">
                          <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Duration</span><span className="text-white font-mono">{track.duration}</span></div>
                          <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Node Fee</span><span className={track.free ? 'text-emerald-400' : 'text-amber-500'}>{track.cost}</span></div>
                          <button onClick={() => setActiveAudioTrack(track)} className={`w-full py-4 mt-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${track.free ? 'bg-white/5 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                             <Play size={14} className="fill-current" /> PLAY SHARD
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {tab === 'waves' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in duration-500">
             <div className="p-16 glass-card rounded-[80px] border border-emerald-500/20 bg-emerald-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-12 shadow-3xl group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-[10s]"><Waves size={500} className="text-emerald-400" /></div>
                <div className="w-32 h-32 rounded-[48px] bg-emerald-600 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.3)] border-4 border-white/10 relative z-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                   <AudioWaveform size={64} className="text-white animate-pulse" />
                </div>
                <div className="space-y-6 relative z-10">
                   <h3 className="text-6xl font-black text-white uppercase tracking-tighter italic m-0">Plant Wave <span className="text-emerald-400">Synthesis</span></h3>
                   <p className="text-slate-400 text-2xl font-medium max-w-2xl mx-auto italic leading-relaxed">"Measuring the bio-electric voltage of flora to synthesize the soundtrack of the forest."</p>
                </div>
                <div className="flex items-end gap-3 h-48 justify-center w-full max-w-4xl relative z-10 px-10">
                   {[...Array(40)].map((_, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/40 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.05}s`, animationDuration: `${0.5 + Math.random()}s` }}></div>
                   ))}
                </div>
                <div className="grid grid-cols-3 gap-8 w-full max-w-3xl relative z-10 py-10 border-y border-white/5">
                   <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Signal Strength</p><p className="text-4xl font-mono font-black text-white">94%</p></div>
                   <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Active Root Link</p><p className="text-4xl font-mono font-black text-emerald-400">0.82v</p></div>
                   <div><p className="text-[10px] text-slate-500 font-black uppercase mb-1">Registry Scale</p><p className="text-4xl font-mono font-black text-indigo-400">432Hz</p></div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in" onClick={() => setShowSignatureModal(null)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-12 rounded-[56px] border border-white/10 bg-[#050706] shadow-3xl text-center space-y-10 border-2">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 ${signatureHash ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500 shadow-indigo-500/20'} transition-all duration-700`}>
                 {showSignatureModal === 'video' ? <Camera size={40} className={signatureHash ? 'text-emerald-400' : 'text-indigo-400'} /> : <Mic2 size={40} className={signatureHash ? 'text-emerald-400' : 'text-indigo-400'} />}
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-indigo-400">{showSignatureModal.toUpperCase()}</span> Signature</h3>
                 <p className="text-slate-500 text-sm leading-relaxed italic">
                    {signatureHash ? '"Registry Anchor Secure."' : `"Directly accessing device ${showSignatureModal} to sign the current industrial ingest shard."`}
                 </p>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              {isSigning ? (
                <div className="py-12 flex flex-col items-center gap-6">
                   <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" /><p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Encoding Device Payload...</p>
                </div>
              ) : signatureHash ? (
                <div className="space-y-8 animate-in zoom-in">
                   <div className="p-8 bg-black/60 rounded-[40px] border border-emerald-500/40 shadow-inner"><p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">Commit Hash</p><p className="text-lg font-mono font-black text-emerald-400 break-all">{signatureHash}</p></div>
                   <button onClick={() => { setShowSignatureModal(null); setSignatureHash(null); }} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-xl">COMMIT TO REGISTRY</button>
                </div>
              ) : (
                <div className="space-y-6">
                   <button onClick={executeSignature} className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all"><Zap className="w-6 h-6 fill-current" /> EXECUTE HANDSHAKE</button>
                   <button onClick={() => setShowSignatureModal(null)} className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Abort Signal</button>
                </div>
              )}
           </div>
        </div>
      )}

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MediaHub;
