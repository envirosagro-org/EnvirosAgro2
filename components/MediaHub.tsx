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
  ArrowRight,
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
  Users
} from 'lucide-react';
import { searchAgroTrends, AIResponse } from '../services/geminiService';

interface MediaHubProps {
  userBalance: number;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const VIDEO_NODES = [
  { id: 'VN-401', title: 'Zone 4 Soil Scanning', viewers: 124, thumb: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400', thrust: 'Environmental', status: 'LIVE', desc: 'Real-time multi-spectral soil analysis from Nebraska hubs.' },
  { id: 'VN-402', title: 'Drone Fleet T-02 Ingest', viewers: 852, thumb: 'https://images.unsplash.com/photo-1508197149814-0cc02e8b7f74?q=80&w=400', thrust: 'Technological', status: 'LIVE', desc: 'Live ingest relay from autonomous weeding swarm in California.' },
  { id: 'VN-403', title: 'Bantu Heritage Archive', viewers: 42, thumb: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400', thrust: 'Societal', status: 'RECORDED', desc: 'Documentary on ancestral lineage seed preservation techniques.' },
  { id: 'VN-404', title: 'Hydro-Array V3 Thermal', viewers: 215, thumb: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=400', thrust: 'Industry', status: 'LIVE', desc: 'Thermal monitoring of global industrial hydroponic pipelines.' },
  { id: 'VN-405', title: 'Steward Wellness Node', viewers: 98, thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400', thrust: 'Human', status: 'RECORDED', desc: 'Meditation session tailored for high-output regenerative farmers.' },
  { id: 'VN-406', title: 'Satellite R-82 Spectral', viewers: 1420, thumb: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400', thrust: 'Technological', status: 'LIVE', desc: 'Hyper-spectral global moisture topology sweep.' },
];

const MediaHub: React.FC<MediaHubProps> = ({ userBalance, onSpendEAC }) => {
  const [tab, setTab] = useState<'all' | 'video' | 'news' | 'audio' | 'waves'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AIResponse | null>(null);

  // Subscriptions logic
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const premiumContent = [
    { id: 'plant_wave_pro', name: 'Plant Wave Pro Sync', price: 150, icon: Sprout, desc: 'Institutional access to real-time bio-electric plant health shards.' },
    { id: 'weekly_steward', name: 'The Weekly Steward', price: 50, icon: Newspaper, desc: 'Deep-dive analysis into Zone 4 soil restoration.' },
    { id: 'industrial_daily', name: 'Industrial Daily', price: 25, icon: FileText, desc: 'Everyday registry pulse and trend forecasting.' },
  ];

  const agribizFeed = [
    { title: "Plant Wave Resonators show 14% Boost in Zone 2 Maize", author: "AgroMusika Lab", time: "30m ago", img: "https://images.unsplash.com/photo-1530836361253-efad5cb2fcc2?q=80&w=400" },
    { title: "Bantu Lineage Seeds Surge 400% in Trade Volume", author: "AgroInPDF Core", time: "1h ago", img: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=400" },
    { title: "MedicAg Shards Authorized for Global Ingest", author: "Registry Audit", time: "4h ago", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=400" },
    { title: "Sonic Remediation: 432Hz Impact Reports", author: "AgroMusika", time: "1d ago", img: "https://images.unsplash.com/photo-1615461066870-40c1440ad7ea?q=80&w=400" },
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
    setIsSubscribing(id);
    setTimeout(() => {
      if (onSpendEAC(price, `SUB_${id.toUpperCase()}`)) {
        setSubscriptions([...subscriptions, id]);
        alert("SUBSCRIPTION ACTIVE: Institutional shards unlocked for 30 days.");
      }
      setIsSubscribing(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
              {newsResult?.text?.replace(/\n/g, ' • ') || 'Registry synchronized. No anomalies detected. Node m-Constant steady at 1.42x. • New Carbon Shards released in Zone 4. • Tokenz Center Gate auth active. • Plant Wave Technology deployment spreading in Zone 2.'}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit">
          {[
            { id: 'all', label: 'Primary Hub' },
            { id: 'video', label: 'Video Nodes' },
            { id: 'news', label: 'Agro-Newsstand' },
            { id: 'audio', label: 'Acoustic Registry' },
            { id: 'waves', label: 'Plant Wave Lab' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6 px-4">
           <div className="text-right">
              <p className="text-[8px] text-slate-600 font-black uppercase">Active Nodes</p>
              <p className="text-xs font-mono font-bold text-white">4,281 STWD</p>
           </div>
           <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]"></div>
        </div>
      </div>

      {tab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* Featured Brand Channel: SkyScout */}
           <div className="lg:col-span-3 glass-card p-12 rounded-[56px] relative overflow-hidden flex flex-col justify-end min-h-[500px] border-white/5 group bg-black">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200')] bg-cover opacity-40 group-hover:scale-105 transition-transform duration-[10s]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-transparent"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-900/40 animate-pulse">
                     <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-red-600/20 text-red-500 text-[10px] font-black uppercase rounded border border-red-500/40 tracking-[0.2em]">LIVE SPECTRAL FEED</span>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mt-1">SkyScout <span className="text-blue-400">Spectral Stream</span></h2>
                  </div>
                </div>
                <p className="text-slate-300 text-xl leading-relaxed max-w-xl font-medium">Observing moisture retention and soil temperature variances across the Nebraska global industrial hub.</p>
                <div className="flex gap-4 pt-4">
                   <button className="px-10 py-5 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3">
                      <Play className="w-5 h-5 fill-current" /> Watch Shard
                   </button>
                   <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                      <Maximize className="w-5 h-5" /> Fullscreen Node
                   </button>
                </div>
              </div>
           </div>

           {/* Brand Secondary Channel: AgroMusika */}
           <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                 <Waves className="w-64 h-64 text-indigo-400" />
              </div>
              <div className="flex justify-between items-start relative z-10">
                 <div className="p-4 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                    <Radio className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div className="flex items-center gap-1">
                    {[0,1,2,3].map(i => <div key={i} className="w-1.5 bg-indigo-400 animate-bounce" style={{ height: `${12+i*8}px`, animationDelay: `${i*0.2}s` }}></div>)}
                 </div>
              </div>
              <div className="py-8 relative z-10">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">AgroMusika Radio</p>
                 <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">Plant Wave Synthesis</h3>
                 <p className="text-xs text-slate-500 font-medium mt-3 italic">"Bio-electric Resonance Logs"</p>
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-900/40 hover:scale-110 active:scale-95 transition-all mx-auto relative z-10 border-4 border-white/5"
              >
                 {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
              </button>
           </div>
        </div>
      )}

      {tab === 'video' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="glass-card p-12 rounded-[56px] border-white/5 bg-indigo-600/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                 <Monitor className="w-64 h-64 text-white" />
              </div>
              <div className="w-20 h-20 bg-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shrink-0">
                 <VideoIcon className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Industrial <span className="text-indigo-400">Video Nodes</span></h2>
                 <p className="text-slate-400 text-lg">Direct telemetry visual ingest and high-fidelity documentation from across the global registry.</p>
              </div>
              <div className="flex gap-4">
                 <div className="p-6 bg-black/40 border border-white/10 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Active Streams</p>
                    <p className="text-2xl font-mono font-black text-white">4</p>
                 </div>
                 <div className="p-6 bg-black/40 border border-white/10 rounded-3xl text-center min-w-[120px]">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Bandwidth</p>
                    <p className="text-2xl font-mono font-black text-indigo-400">1.2TB</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {VIDEO_NODES.map(node => (
                <div key={node.id} className="glass-card rounded-[44px] overflow-hidden group hover:border-indigo-500/30 transition-all flex flex-col h-full active:scale-95 duration-300">
                   <div className="h-60 relative overflow-hidden">
                      <img src={node.thumb} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" alt={node.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-6 left-6 flex gap-2">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${node.status === 'LIVE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-500/20 text-slate-400 border-slate-500/40'}`}>
                            {node.status}
                         </span>
                         <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                            {node.thrust}
                         </span>
                      </div>

                      <div className="absolute bottom-6 left-6 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-mono font-bold text-white uppercase">{node.viewers.toLocaleString()} Viewers</span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                            <CirclePlay className="w-8 h-8 fill-current" />
                         </div>
                      </div>
                   </div>

                   <div className="p-8 flex-1 flex flex-col">
                      <h4 className="text-xl font-bold text-white uppercase tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">{node.title}</h4>
                      <p className="text-[9px] text-slate-600 font-mono mt-2 mb-6 font-black uppercase tracking-widest">{node.id} // GLOBAL_RELAY_SYNC</p>
                      <p className="text-xs text-slate-500 leading-relaxed italic mb-8 flex-1">"{node.desc}"</p>
                      
                      <div className="pt-6 border-t border-white/5 flex gap-4">
                         <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Bookmark className="w-4 h-4" /> Save Node
                         </button>
                         <button className="flex-[2] py-4 bg-indigo-600 rounded-2xl text-white font-black text-[9px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                            Connect to Node <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="flex justify-center pt-8">
              <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all flex items-center gap-4">
                 <Loader2 className="w-5 h-5 animate-spin" /> Synchronize Archive Shards
              </button>
           </div>
        </div>
      )}

      {tab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-3 space-y-10">
              <div className="space-y-6">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                    <Newspaper className="w-6 h-6 text-emerald-400" /> AgroInPDF: <span className="text-emerald-400">Agribiz Feed</span>
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {agribizFeed.map((news, i) => (
                      <div key={i} className="glass-card rounded-[40px] overflow-hidden group hover:border-emerald-500/30 transition-all active:scale-[0.98] duration-300">
                         <div className="h-56 relative overflow-hidden">
                            <img src={news.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={news.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050706] to-transparent"></div>
                            <span className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase rounded-full border border-white/10">{news.author}</span>
                         </div>
                         <div className="p-8 space-y-4">
                            <h4 className="text-xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors m-0">{news.title}</h4>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                               <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{news.time}</span>
                               <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                  Read Shard <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="glass-card p-10 rounded-[48px] border-amber-500/20 bg-amber-500/5 space-y-8">
                 <div className="flex items-center gap-4">
                    <BookOpen className="w-8 h-8 text-amber-500" />
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">Premium Stand</h3>
                 </div>
                 <div className="space-y-6">
                    {premiumContent.map(sub => (
                      <div key={sub.id} className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4 group relative overflow-hidden">
                         {subscriptions.includes(sub.id) && (
                           <div className="absolute top-4 right-4 text-emerald-400">
                             <CheckCircle2 className="w-5 h-5" />
                           </div>
                         )}
                         <sub.icon className={`w-10 h-10 ${subscriptions.includes(sub.id) ? 'text-emerald-400' : 'text-slate-600'}`} />
                         <div>
                            <h4 className="text-lg font-black text-white uppercase tracking-tight">{sub.name}</h4>
                            <p className="text-[10px] text-slate-500 font-medium italic mt-1 leading-relaxed">"{sub.desc}"</p>
                         </div>
                         {subscriptions.includes(sub.id) ? (
                           <button className="w-full py-3 bg-emerald-600/10 text-emerald-400 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Open Shard Journal</button>
                         ) : (
                           <button 
                            onClick={() => handleSubscribe(sub.id, sub.price)}
                            disabled={isSubscribing === sub.id}
                            className="w-full py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95"
                           >
                              {isSubscribing === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                              {sub.price} EAC / MO
                           </button>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {tab === 'audio' && (
        <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
           <div className="glass-card p-12 rounded-[56px] bg-indigo-900/10 border-indigo-500/20 flex flex-col md:flex-row items-center gap-12">
              <div className="w-48 h-48 rounded-[56px] bg-indigo-600 flex items-center justify-center shadow-2xl shrink-0 border-4 border-white/5 relative group">
                 <Headphones className="w-20 h-20 text-white group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-4 rounded-full border-4 border-white/10 animate-spin-slow"></div>
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">EOS_ACOUSTIC_NODE</span>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">AgroMusika <span className="text-indigo-400">Library</span></h2>
                 </div>
                 <p className="text-slate-400 text-lg leading-relaxed font-medium">Bio-electric Plant Wave protocols and scientific rhythmic signatures for soil molecular repair.</p>
              </div>
           </div>

           <div className="space-y-4">
              {[
                { title: "Plant Wave Synthesis v1.0", type: "Bio-Electric", duration: "32:00", cost: "50 EAC", icon: Sprout },
                { title: "m-Constant Resonance v2.1", type: "Soil Stimulation", duration: "45:00", cost: "Free", icon: Radio },
                { title: "SID Trauma Clearing Protocol", type: "Wellness", duration: "20:00", cost: "5 EAC", icon: Heart },
                { title: "Bantu Rhythmic Ingest", type: "Ancestral Heritage", duration: "60:00", cost: "Free", icon: Globe },
              ].map((track, i) => (
                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all flex items-center justify-between group cursor-pointer">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <track.icon className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                      <div>
                         <p className="text-xl font-black text-white uppercase tracking-tight m-0">{track.title}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{track.type} • {track.duration}</p>
                      </div>
                   </div>
                   <div className="text-right flex items-center gap-6">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${track.cost === 'Free' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>{track.cost}</span>
                      <button className="p-3 bg-white/5 rounded-2xl text-slate-600 hover:text-white transition-all"><Download className="w-5 h-5" /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {tab === 'waves' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-12 rounded-[56px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                    <Sprout className="w-80 h-80 text-emerald-400" />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-900/40">
                          <WaveIcon className="w-10 h-10 text-white" />
                       </div>
                       <div>
                          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Plant Wave <span className="text-emerald-400">Monitoring</span></h3>
                          <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Active Bio-Electric Synchronization</p>
                       </div>
                    </div>
                    <div className="flex items-end gap-2 h-40 pt-10">
                       {[...Array(40)].map((_, i) => (
                         <div key={i} className="flex-1 bg-emerald-500 rounded-full animate-wave" style={{ height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 40}%`, animationDelay: `${i * 0.05}s` }}></div>
                       ))}
                    </div>
                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 text-center">
                       <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">Voltage Drift</p><p className="text-xl font-mono font-black text-white">4.2mV</p></div>
                       <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">Photosynth Res.</p><p className="text-xl font-mono font-black text-emerald-400">88.4%</p></div>
                       <div><p className="text-[9px] text-slate-500 font-black uppercase mb-1">Sync Index</p><p className="text-xl font-mono font-black text-blue-400">0.94</p></div>
                    </div>
                 </div>
              </div>

              <div className="glass-card p-10 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 flex flex-col justify-between group overflow-hidden relative">
                 <div className="relative z-10 space-y-8">
                    <h4 className="text-xl font-bold text-white uppercase tracking-widest">Frequency <span className="text-indigo-400">Oracle</span></h4>
                    <p className="text-slate-400 text-sm leading-relaxed italic">"Unlock real-time bio-electric frequency analysis for your farm node. Optimize yield through ultrasonic modulation."</p>
                    <div className="p-6 bg-black/60 rounded-3xl border border-white/5 space-y-4">
                       <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-amber-500" />
                          <span className="text-[10px] font-black text-white uppercase">Pro Shard Access</span>
                       </div>
                       <button 
                        onClick={() => handleSubscribe('plant_wave_pro', 150)}
                        disabled={subscriptions.includes('plant_wave_pro')}
                        className="w-full py-4 agro-gradient rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50"
                       >
                          {subscriptions.includes('plant_wave_pro') ? 'ACTIVE LINK' : 'SUBSCRIBE 150 EAC'}
                       </button>
                    </div>
                 </div>
                 <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl text-center">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">Live Wave ID</p>
                    <p className="text-xs font-mono text-indigo-400">EA_WAVE_#842_SYNC</p>
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
        @keyframes wave { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; transform: scaleY(1.1); } }
        .animate-wave { animation: wave 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default MediaHub;