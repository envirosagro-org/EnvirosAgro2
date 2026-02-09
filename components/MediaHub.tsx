
import React, { useState, useEffect, useRef, useMemo } from 'react';
// Added LucideIcons namespace import to fix dynamic icon lookup in IconComponent
import * as LucideIcons from 'lucide-react';
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
  CirclePlay,
  PlayCircle,
  Monitor,
  Users,
  ArrowRight,
  ArrowUpRight,
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
  CircleDot,
  Send,
  Leaf,
  Ear,
  Waves as WavesIcon
} from 'lucide-react';
import { User, ViewState } from '../types';
import { searchAgroTrends, chatWithAgroExpert, AIResponse } from '../services/geminiService';

interface MediaHubProps {
  user: User;
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => Promise<boolean>;
  onEarnEAC: (amount: number, reason: string) => void;
  onNavigate: (view: ViewState) => void;
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

const AGROMUSIKA_SOURCES = [
  { id: 'SRC-01', name: 'Amazonian Fern', biome: 'Tropical', phi: 0.98, color: 'text-emerald-400', freq: 432 },
  { id: 'SRC-02', name: 'Highland Moss', biome: 'Alpine', phi: 1.42, color: 'text-blue-400', freq: 432 },
  { id: 'SRC-03', name: 'Bantu Sun-Orchid', biome: 'Savannah', phi: 1.618, color: 'text-amber-400', freq: 432 },
  { id: 'SRC-04', name: 'Mangrove Root', biome: 'Coastal', phi: 0.82, color: 'text-teal-400', freq: 432 },
];

const MediaHub: React.FC<MediaHubProps> = ({ user, userBalance, onSpendEAC, onEarnEAC, onNavigate }) => {
  const [tab, setTab] = useState<'all' | 'video' | 'news' | 'audio' | 'waves' | 'blog' | 'streaming'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AIResponse | null>(null);

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
  
  const [isMuted, setIsMuted] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Device References
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Engine States
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const [selectedSource, setSelectedSource] = useState(AGROMUSIKA_SOURCES[0]);
  const [bioVoltage, setBioVoltage] = useState(0);
  const [spatialValue, setSpatialValue] = useState(0);

  // Blog States
  const [blogTopic, setBlogTopic] = useState('');
  const [isForgingBlog, setIsForgingBlog] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<string | null>(null);
  const [blogHistory, setBlogHistory] = useState([
    { id: 'BLG-01', title: 'The 432Hz Soil Resilience Protocol', date: '2h ago', type: 'Technical' },
    { id: 'BLG-02', title: 'Bantu Seed Lineages: A Registry Audit', date: '1d ago', type: 'Heritage' }
  ]);

  // Audio/Waves States
  const [audioTracks] = useState(INITIAL_AUDIO_TRACKS);

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
    }
    return () => { 
      if (interval) clearInterval(interval); 
      if (reactionInterval) clearInterval(reactionInterval);
    };
  }, [isBroadcasting, onEarnEAC, streamTitle]);

  // Bio-Acoustic Engine Logic
  useEffect(() => {
    let bioInterval: any;
    if (isPlaying && tab === 'waves') {
      bioInterval = setInterval(() => {
        const newVal = Math.random();
        setBioVoltage(newVal);
        
        if (oscillatorRef.current && gainRef.current) {
          // Implementing the math: y(t) = sin(wt + phi_plant)
          // We modulate frequency based on plant resonance delta
          const baseFreq = selectedSource.freq;
          const shift = (newVal - 0.5) * 10; // Phase shift simulation
          oscillatorRef.current.frequency.setTargetAtTime(baseFreq + shift, audioCtxRef.current!.currentTime, 0.1);
          
          // Spatial panning simulation
          setSpatialValue(Math.sin(Date.now() * 0.001));
        }
      }, 100);
    }
    return () => clearInterval(bioInterval);
  }, [isPlaying, tab, selectedSource]);

  const initAudioEngine = () => {
    if (!audioCtxRef.current) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
      
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      const filter = audioCtxRef.current.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(selectedSource.freq, audioCtxRef.current.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, audioCtxRef.current.currentTime);
      
      gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      
      osc.start();
      
      oscillatorRef.current = osc;
      gainRef.current = gain;
      filterRef.current = filter;
    }
  };

  const toggleAudio = () => {
    initAudioEngine();
    if (isPlaying) {
      gainRef.current?.gain.setTargetAtTime(0, audioCtxRef.current!.currentTime, 0.2);
    } else {
      gainRef.current?.gain.setTargetAtTime(0.3, audioCtxRef.current!.currentTime, 0.2);
    }
    setIsPlaying(!isPlaying);
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const fetchLatestNews = async () => {
    setLoadingNews(true);
    const query = "latest agricultural trends impacting regenerative farming practices and blockchain integration for carbon credit tracking 2025";
    const result = await searchAgroTrends(query);
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
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
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
    }
  };

  const handleStopStream = () => {
    if (confirm("STOP_BROADCAST: Confirm termination of live registry ingest. All session data will be sharded and archived.")) {
      setIsBroadcasting(false);
      setIsRegistered(false);
      stopStream();
      alert(`STREAM FINALIZED: You earned ${totalEacEarnedFromStream.toFixed(2)} EAC from public reactions.`);
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

  const handleForgeBlog = async () => {
    if (!blogTopic.trim()) return;
    const COST = 20;
    if (!await onSpendEAC(COST, `BLOG_FORGE_${blogTopic.toUpperCase()}`)) return;
    setIsForgingBlog(true);
    setGeneratedBlog(null);
    try {
      const prompt = `Write a technical blog post shard for EnvirosAgro network about: "${blogTopic}". 
      Include sections for Registry Abstract, SEHTI alignment, and C(a) impact. Use markdown. Focus on regenerative farming and blockchain trends.`;
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-1 md:px-4">
      
      {/* Registry Pulse Ticker */}
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

      {/* Main Navigation */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[24px] bg-black/40 border border-white/5 shadow-xl w-full lg:w-fit mx-auto lg:mx-0">
        {[
          { id: 'all', label: 'PRIMARY HUB' },
          { id: 'streaming', label: 'LIVE BROADCAST' },
          { id: 'video', label: 'VIDEO NODES' },
          { id: 'news', label: 'NEWSSTAND' },
          { id: 'blog', label: 'BLOG SHARDS' },
          { id: 'audio', label: 'ACOUSTIC REGISTRY' },
          { id: 'waves', label: 'PLANT WAVE LAB' },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id as any); if (t.id !== 'waves') { setIsPlaying(false); gainRef.current?.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0); } }} className={`flex-1 lg:flex-none px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[650px]">
        {/* TAB: LIVE BROADCAST */}
        {tab === 'streaming' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-6 duration-700">
             <div className="lg:col-span-4 space-y-8">
                {!isRegistered ? (
                   <div className="glass-card p-10 rounded-[56px] border border-indigo-500/20 bg-black/40 space-y-8 shadow-2xl">
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
                         <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-xl flex items-center justify-center border border-white/10">
                            <Cast className="w-8 h-8 text-white" />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">Broadcaster <span className="text-emerald-400">Node</span></h3>
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
                               <div className="h-full bg-indigo-500 shadow-[0_0_100px_rgba(99,102,241,0.6)]" style={{ width: `${publicProofWeight}%` }}></div>
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
                        </div>
                     </>
                   )}
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

        {/* TAB: VIDEO NODES */}
        {tab === 'video' && (
          <div className="space-y-16 animate-in slide-in-from-right-4 duration-500">
             <div className="space-y-8">
                <div className="flex justify-between items-end px-4 border-b border-white/5 pb-6">
                   <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Live Ingest <span className="text-rose-500">Nodes</span></h3>
                   <button onClick={() => setTab('streaming')} className="px-8 py-3 bg-rose-600 hover:bg-rose-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Start My Stream</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {VIDEO_NODES.filter(n => n.status === 'LIVE').map(node => (
                      <div key={node.id} className="glass-card rounded-[56px] overflow-hidden border-2 border-rose-500/20 hover:border-rose-500 transition-all flex flex-col group active:scale-[0.98] duration-300 bg-black/60 shadow-3xl">
                         <div className="h-72 relative overflow-hidden">
                            <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[8s] grayscale-[0.3] group-hover:grayscale-0" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                            <div className="absolute top-6 left-6 flex gap-3">
                               <div className="px-4 py-1.5 bg-rose-600 rounded-full text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div> LIVE
                               </div>
                            </div>
                         </div>
                         <div className="p-10 space-y-6">
                            <h4 className="text-2xl font-black text-white uppercase italic m-0 tracking-tight">{node.title}</h4>
                            <p className="text-xs text-slate-400 italic">"{node.desc}"</p>
                            <button className="w-full py-5 bg-rose-600 hover:bg-rose-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                               <Eye size={16} /> Enter Stream
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
                        {loadingNews ? (
                           <div className="py-20 flex flex-col items-center gap-6">
                              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ingesting Strategic Trends...</p>
                           </div>
                        ) : newsResult ? (
                           <div className="space-y-8">
                              <div className="p-10 bg-white/5 rounded-[40px] border-l-8 border-emerald-500 border border-white/10">
                                 <p className="text-slate-300 text-lg leading-relaxed italic whitespace-pre-line font-medium">
                                    {newsResult.text}
                                 </p>
                                 {newsResult.sources && newsResult.sources.length > 0 && (
                                    <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {newsResult.sources.map((s, i) => (
                                          <a key={i} href={s.web?.uri || '#'} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group/slink hover:border-emerald-500/40 transition-all">
                                             <span className="text-[10px] font-black text-slate-400 uppercase italic truncate max-w-[150px]">{s.web?.title || 'External Shard'}</span>
                                             <ArrowUpRight size={14} className="text-slate-700 group-hover/slink:text-emerald-400" />
                                          </a>
                                       ))}
                                    </div>
                                 )}
                              </div>
                              <button onClick={fetchLatestNews} className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
                                 <RefreshCw size={14} /> REFRESH_INGEST
                              </button>
                           </div>
                        ) : (
                           <div className="p-20 text-center opacity-30 italic">No bulletin data sharded.</div>
                        )}
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4 space-y-8">
                   <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 space-y-8 shadow-xl">
                      <h4 className="text-xl font-black text-white uppercase italic">Premium <span className="text-indigo-400">Subscriptions</span></h4>
                      {[{ id: 'NL-882', name: 'PLANT WAVE INSIDER', price: 150, icon: Sprout }].map(nl => (
                         <div key={nl.id} className="p-6 bg-black/60 rounded-3xl border border-white/5 space-y-4 shadow-inner">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 bg-indigo-500/20 rounded-xl text-indigo-400`}><nl.icon size={20} /></div>
                               <h5 className="text-sm font-black text-white uppercase tracking-widest">{nl.name}</h5>
                            </div>
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
                    <div className="flex items-center gap-6 relative z-10">
                       <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl"><PenTool className="w-8 h-8 text-white" /></div>
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Forge <span className="text-indigo-400">Blog Shard</span></h3>
                    </div>
                    <div className="space-y-6 relative z-10">
                       <textarea value={blogTopic} onChange={e => setBlogTopic(e.target.value)} placeholder="Enter technical topic for industrial synthesis..." className="w-full bg-black/60 border border-white/10 rounded-[32px] p-8 text-white text-sm font-medium italic focus:ring-4 focus:ring-indigo-500/10 outline-none h-48 resize-none placeholder:text-slate-900 shadow-inner" />
                       <button onClick={handleForgeBlog} disabled={isForgingBlog || !blogTopic.trim()} className="w-full py-8 agro-gradient rounded-40px text-white font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-30">
                          {isForgingBlog ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 fill-current" />} {isForgingBlog ? 'SYNTHESIZING...' : 'FORGE SHARD'}
                       </button>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-8">
                 <div className="glass-card rounded-[64px] min-h-[600px] border border-white/5 bg-black/20 flex flex-col relative overflow-hidden shadow-3xl">
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

        {/* TAB: ACOUSTIC REGISTRY */}
        {tab === 'audio' && (
           <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
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
                          <button onClick={toggleAudio} className={`w-full py-4 mt-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${track.free ? 'bg-white/5 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}>
                             {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />} {isPlaying ? 'STOP SHARD' : 'PLAY SHARD'}
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TAB: PLANT WAVE LAB - UPDATED AUDITORY SYSTEM */}
        {tab === 'waves' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in zoom-in duration-500">
             {/* Left: Agromusika Sources & Controls */}
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 rounded-[56px] border border-emerald-500/20 bg-black/40 space-y-10 shadow-3xl">
                   <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                      <div className="p-4 bg-emerald-600 rounded-3xl shadow-xl flex items-center justify-center border border-white/10">
                         <Sprout className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter m-0">Bio-Acoustic <span className="text-emerald-400">Sources</span></h3>
                        <p className="text-[10px] text-emerald-500/60 font-mono uppercase tracking-widest mt-2">AGROMUSIKA_v6.5</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {AGROMUSIKA_SOURCES.map(source => (
                         <button 
                            key={source.id} 
                            onClick={() => setSelectedSource(source)}
                            className={`w-full p-6 rounded-[32px] border-2 transition-all text-left flex items-center justify-between group ${selectedSource.id === source.id ? 'bg-emerald-600/10 border-emerald-500 text-white shadow-xl scale-105' : 'bg-black border-white/5 text-slate-600 hover:border-white/20'}`}
                         >
                            <div className="flex items-center gap-5">
                               <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:rotate-6 transition-transform ${source.color}`}>
                                  <Leaf size={24} />
                               </div>
                               <div>
                                  <p className="text-sm font-black uppercase tracking-tight italic">{source.name}</p>
                                  <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">{source.biome} // {source.freq}Hz</p>
                               </div>
                            </div>
                            <ChevronRight size={20} className={selectedSource.id === source.id ? 'text-emerald-400' : 'text-slate-800'} />
                         </button>
                      ))}
                   </div>

                   <div className="pt-8 border-t border-white/5 space-y-6">
                      <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-[32px] flex items-center justify-between shadow-inner group/tune">
                         <div className="flex items-center gap-4">
                            <Headphones size={20} className="text-emerald-400 group-hover/tune:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Acoustic Sync</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-white">432Hz</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                         </div>
                      </div>
                      <button 
                         onClick={toggleAudio}
                         className={`w-full py-8 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_100px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all border-4 border-white/10 ring-[12px] ring-emerald-500/5 flex items-center justify-center gap-6 ${isPlaying ? 'bg-rose-600' : 'bg-emerald-600'}`}
                      >
                         {isPlaying ? <CircleStop size={28} /> : <Ear size={28} />}
                         {isPlaying ? 'SEVER HANDSHAKE' : 'LISTEN TO WAVES'}
                      </button>
                   </div>
                </div>

                <div className="p-10 glass-card rounded-[48px] border border-indigo-500/10 bg-indigo-900/5 space-y-6 group shadow-xl">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 group-hover:rotate-12 transition-transform"><AudioWaveform size={24} className="text-indigo-400" /></div>
                      <h4 className="text-xl font-black text-white uppercase italic">Resonance <span className="text-indigo-400">Mapping</span></h4>
                   </div>
                   <p className="text-xs text-slate-400 italic leading-relaxed">
                      "Translating biological micro-voltages into 432Hz sine waves. Bio-electric sharding promotes high-resonance growth patterns."
                   </p>
                </div>
             </div>

             {/* Right: Immersive Sonic Orb Interface */}
             <div className="lg:col-span-8">
                <div className="glass-card rounded-[64px] border-2 border-emerald-500/20 bg-[#050706] relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[750px] shadow-[0_40px_150px_rgba(0,0,0,0.9)] group">
                   
                   {/* Background Dynamic Waveform Grid */}
                   <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
                      <div className="grid grid-cols-24 h-full gap-1 items-center px-10">
                         {[...Array(48)].map((_, i) => (
                            <div 
                               key={i} 
                               className="w-1 bg-emerald-500/40 rounded-full transition-all duration-300"
                               style={{ 
                                  height: isPlaying ? `${20 + Math.random() * 60}%` : '2px',
                                  opacity: isPlaying ? 0.4 : 0.1
                               }}
                            ></div>
                         ))}
                      </div>
                   </div>

                   {/* THE SONIC ORB */}
                   <div className="relative z-10 flex flex-col items-center space-y-16">
                      <div className="relative w-80 h-80 flex items-center justify-center">
                         {/* Static Inner Core */}
                         <div className={`absolute w-32 h-32 rounded-full border-4 border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all duration-1000 ${isPlaying ? 'scale-125' : 'scale-100 opacity-20'}`}>
                            <AudioLines size={48} className={`text-emerald-400 ${isPlaying ? 'animate-pulse' : ''}`} />
                         </div>

                         {/* Reactive Outer Shells */}
                         <div 
                           className={`absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/20 transition-all duration-[2s] ${isPlaying ? 'animate-spin-slow scale-110' : 'opacity-10'}`}
                           style={{ animationDuration: '20s' }}
                         ></div>
                         <div 
                           className={`absolute inset-[-40px] rounded-full border border-indigo-500/10 transition-all duration-[4s] ${isPlaying ? 'animate-spin scale-110' : 'opacity-10'}`}
                           style={{ animationDirection: 'reverse', animationDuration: '40s' }}
                         ></div>

                         {/* Binaural Aura Effect */}
                         {isPlaying && (
                           <div className="absolute inset-[-100px] pointer-events-none">
                              <div 
                                 className="absolute top-1/2 left-0 w-4 h-4 bg-emerald-500 rounded-full blur-sm animate-bounce"
                                 style={{ transform: `translateX(${spatialValue * 150}px)`, animationDuration: '2s' }}
                              ></div>
                              <div 
                                 className="absolute top-1/2 right-0 w-4 h-4 bg-indigo-500 rounded-full blur-sm animate-bounce"
                                 style={{ transform: `translateX(${-spatialValue * 150}px)`, animationDuration: '2.5s' }}
                              ></div>
                           </div>
                         )}

                         {/* Ingest Heat Gradient */}
                         <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 blur-[80px] transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>

                      <div className="text-center space-y-6">
                         <div className="space-y-2">
                            <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                               {isPlaying ? <span className="animate-pulse">RESONANCE_LIVE</span> : 'SHARD_STANDBY'}
                            </h3>
                            <p className="text-emerald-500/60 font-mono text-[10px] font-black uppercase tracking-[0.8em]">NODE_SYNC_A882 // 432HZ_LOCKED</p>
                         </div>
                         
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-white/5">
                            <div>
                               <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-1">Bio-Voltage</p>
                               <p className="text-2xl font-mono font-black text-white">{isPlaying ? (bioVoltage * 100).toFixed(2) : '0.00'}<span className="text-xs ml-1 text-emerald-800 italic">mV</span></p>
                            </div>
                            <div>
                               <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-1">Phi Factor</p>
                               <p className="text-2xl font-mono font-black text-white">{selectedSource.phi}<span className="text-xs ml-1 text-indigo-800 italic">α</span></p>
                            </div>
                            <div className="hidden md:block">
                               <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-1">Spectral Albedo</p>
                               <p className="text-2xl font-mono font-black text-white">0.14<span className="text-xs ml-1 text-slate-800">λ</span></p>
                            </div>
                            <div className="hidden md:block">
                               <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-1">Registry Shard</p>
                               <p className="text-2xl font-mono font-black text-emerald-400">#882A</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Absolute HUD Overlays */}
                   <div className="absolute top-10 left-10 p-6 glass-card rounded-[40px] border border-white/10 bg-black/80 shadow-2xl backdrop-blur-md hidden md:block">
                      <div className="flex items-center gap-4 mb-4">
                         <Radio size={16} className="text-emerald-400 animate-pulse" />
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">Inflow Telemetry</span>
                      </div>
                      <div className="h-20 w-48 overflow-hidden relative border border-white/5 rounded-xl bg-[#020403]">
                         <svg viewBox="0 0 200 80" className="w-full h-full">
                            <path 
                              d={`M0,40 Q25,${40 + bioVoltage*40} 50,40 T100,40 T150,40 T200,40`}
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="2"
                              className={isPlaying ? 'animate-dash' : ''}
                            />
                         </svg>
                      </div>
                   </div>

                   <div className="absolute bottom-10 right-10 flex gap-4">
                      <button className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all shadow-3xl">
                         <Volume2 size={24} />
                      </button>
                      <button className="p-6 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all shadow-3xl">
                         <Maximize2 size={24} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 45s linear infinite; }
        .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.9); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(16, 185, 129, 0.2) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-terminal { scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.2) transparent; }
        .custom-scrollbar-terminal::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-editor::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.4); border-radius: 10px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dash { to { stroke-dashoffset: -100; } }
        .animate-dash { stroke-dasharray: 10; animation: dash 20s linear infinite; }
        @keyframes scan { from { top: -100%; } to { top: 100%; } }
        .animate-scan { animation: scan 3s linear infinite; }
      `}</style>
    </div>
  );
};

// Helper components for Post Creator and Feed Icons
const IconComponent: React.FC<{name: string, size?: number, className?: string}> = ({name, size = 18, className = ""}) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.FileCode;
  return <Icon size={size} className={className} />;
};

const MOCK_FEED = [
  { id: 'P-1', authorName: 'Steward Alpha', authorEsin: 'EA-ALPHA-88', text: 'Just completed a successful 432Hz sweep on Sector 4. m-Constant increased by 0.05x!', timestamp: new Date().toISOString(), likes: 12, shares: 3, comments: [], mediaType: 'PHOTO' },
  { id: 'P-2', authorName: 'Gaia Green', authorEsin: 'EA-GAIA-02', text: 'Discovered a rare Bantu Sun-Orchid cluster. Documenting for the archive.', timestamp: new Date().toISOString(), likes: 45, shares: 12, comments: [] },
  { id: 'P-3', authorName: 'Root Steward', authorEsin: 'EA-CORE-01', text: 'Network quorum established for the Season of Awakening. Ensure all geofence shards are synced.', timestamp: new Date().toISOString(), likes: 124, shares: 56, comments: [] },
];

export default MediaHub;
