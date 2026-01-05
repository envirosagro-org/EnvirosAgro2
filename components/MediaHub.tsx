import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  SkipForward, 
  SkipBack, 
  Search, 
  FileText, 
  Video, 
  Radio, 
  Headphones, 
  ExternalLink, 
  Download,
  Loader2,
  Globe,
  Newspaper,
  Music,
  Tv,
  Eye,
  Zap,
  X,
  AudioWaveform as Waveform,
  Activity,
  Maximize2,
  Share2,
  Heart,
  History,
  Film,
  Calendar,
  Layers,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { searchAgroTrends, generateMediaInsights, AIResponse } from '../services/geminiService';

const MEDIA_CHANNELS = [
  { 
    id: 'agromusika', 
    name: 'AgroMusika Radio', 
    icon: Headphones, 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-400/10',
    desc: 'Live telemetry-based rhythmic farming frequencies and soil-health podcasts.',
    type: 'audio',
    live: true,
    action: 'Generate Frequency'
  },
  { 
    id: 'agroinpdf', 
    name: 'AgroInPDF Journal', 
    icon: FileText, 
    color: 'text-orange-400', 
    bg: 'bg-orange-400/10',
    desc: 'Deep-dive sustainability whitepapers, audit reports, and research publications.',
    type: 'docs',
    live: false,
    action: 'Draft Brief'
  },
  { 
    id: 'skyscout', 
    name: 'SkyScout Visuals', 
    icon: Eye, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10',
    desc: 'Aerial surveillance feeds, satellite time-lapses, and drone cinematography.',
    type: 'video',
    live: true,
    action: 'Spectral Scan'
  },
  { 
    id: 'greenlens', 
    name: 'Green Lens TV', 
    icon: Tv, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-400/10',
    desc: 'Documentaries on regenerative success stories and community innovations.',
    type: 'video',
    live: false,
    action: 'Storyboard Case'
  }
];

const ARCHIVE_ITEMS = [
  { id: 'arc-1', title: 'Zone 4: Spring Moisture Recovery', date: '2024-03-12', type: 'Spectral', duration: '12:40', thrust: 'Technological', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400' },
  { id: 'arc-2', title: 'The Bantu Soil Connection', date: '2024-05-20', type: 'Documentary', duration: '24:15', thrust: 'Societal', img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=400' },
  { id: 'arc-3', title: 'Audit VOD: Farm Unit #882', date: '2024-06-05', type: 'Verification', duration: '05:30', thrust: 'Informational', img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400' },
  { id: 'arc-4', title: 'Precision Harvest Night Scan', date: '2024-07-11', type: 'Spectral', duration: '18:22', thrust: 'Technological', img: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=400' },
];

const MediaHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'docs'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsResult, setNewsResult] = useState<AIResponse | null>(null);
  const [activeTrack, setActiveTrack] = useState('Frequency 432Hz: Soil Regeneration Rhythms');
  
  // Launch state
  const [activeChannel, setActiveChannel] = useState<typeof MEDIA_CHANNELS[0] | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<typeof ARCHIVE_ITEMS[0] | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIResponse | null>(null);
  const [insightQuery, setInsightQuery] = useState('');

  const filteredChannels = activeTab === 'all' ? MEDIA_CHANNELS : MEDIA_CHANNELS.filter(c => c.type === activeTab);

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    setLoadingNews(true);
    const result = await searchAgroTrends("Latest innovations in sustainable agriculture, regenerative farming news, and carbon credit market updates");
    setNewsResult(result);
    setLoadingNews(false);
  };

  const launchChannel = (channel: typeof MEDIA_CHANNELS[0]) => {
    setActiveChannel(channel);
    setAiInsight(null);
    setInsightQuery('');
  };

  const generateInsight = async () => {
    if (!activeChannel) return;
    setLoadingInsights(true);
    const topic = insightQuery || (activeChannel.id === 'agromusika' ? "Nitrogen-rich soil health" : "Regenerative crop rotation success");
    const result = await generateMediaInsights(activeChannel.type, topic);
    setAiInsight(result);
    setLoadingInsights(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Media Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-[40px] relative overflow-hidden flex flex-col justify-end min-h-[400px]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?q=80&w=1200')] bg-cover opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050706] via-[#050706]/60 to-transparent"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-black uppercase rounded animate-pulse border border-red-500/30">LIVE FEED</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">SkyScout Aerial • Zone 4 Nebraska</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">Harvest Surveillance: <span className="text-emerald-400">Night Scan</span></h2>
            <p className="text-slate-300 max-w-xl text-lg leading-relaxed">
              Real-time thermal monitoring of regenerative maize fields. Observing moisture retention and soil temperature variances in high fidelity.
            </p>
            <div className="pt-4 flex gap-4">
              <button 
                onClick={() => launchChannel(MEDIA_CHANNELS.find(c => c.id === 'skyscout')!)}
                className="px-8 py-3 agro-gradient rounded-2xl text-white font-bold flex items-center gap-2 shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all"
              >
                <Eye className="w-5 h-5" /> Switch to Thermal
              </button>
              <button 
                onClick={() => setIsArchiveOpen(true)}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <History className="w-5 h-5" /> Watch Archive
              </button>
            </div>
          </div>
        </div>

        {/* AgroMusika Audio Player Sidebox */}
        <div className="glass-card p-8 rounded-[40px] bg-indigo-600/5 border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <Radio className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-indigo-400/40 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-5 bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-4 bg-indigo-400/60 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            </div>
          </div>

          <div className="py-8">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">AgroMusika Radio</p>
            <h3 className="text-xl font-bold text-white leading-tight mb-2">{activeTrack}</h3>
            <p className="text-xs text-slate-500">Curated by EOS Frequency Node #04</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono text-indigo-300">01:42</span>
              <div className="flex-1 h-1 bg-white/5 rounded-full relative">
                <div className="absolute inset-y-0 left-0 w-1/3 bg-indigo-500 rounded-full"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 bg-white rounded-full shadow-lg shadow-indigo-500/50"></div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">04:30</span>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button className="text-slate-500 hover:text-white transition-colors"><SkipBack className="w-6 h-6" /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-900/40 hover:scale-110 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
              </button>
              <button className="text-slate-500 hover:text-white transition-colors"><SkipForward className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* News Ticker Bar (Powered by Gemini) */}
      <div className="glass-card p-4 rounded-3xl border-emerald-500/20 flex items-center overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 px-4 border-r border-white/5">
          <Zap className="w-4 h-4 text-amber-500 fill-current" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">EOS NEWS FLASH</span>
        </div>
        <div className="flex-1 px-4 overflow-hidden">
          {loadingNews ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
              <span className="text-xs text-slate-500 italic">Gemini is fetching the latest grounded news nodes...</span>
            </div>
          ) : (
            <div className="whitespace-nowrap animate-marquee hover:pause-marquee text-xs text-slate-400 font-medium">
              {newsResult?.text?.replace(/\n/g, ' • ') || 'No news available at this moment. Stay tuned for real-time sector updates.'}
            </div>
          )}
        </div>
      </div>

      {/* Media Channels Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-white flex items-center gap-3">
            <Radio className="w-6 h-6 text-emerald-400" />
            Media Channels
          </h3>
          <div className="flex gap-2 p-1 glass-card rounded-2xl">
            {['all', 'video', 'audio', 'docs'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredChannels.map((channel, i) => (
            <div 
              key={i} 
              onClick={() => launchChannel(channel)}
              className="glass-card p-6 rounded-[32px] group hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden active:scale-95 duration-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${channel.bg} transition-colors group-hover:rotate-6`}>
                  <channel.icon className={`w-6 h-6 ${channel.color}`} />
                </div>
                {channel.live && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">
                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[8px] font-black text-red-500 uppercase">LIVE</span>
                  </div>
                )}
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{channel.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-8 flex-1">{channel.desc}</p>
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  {channel.action}
                </span>
                <Play className="w-3 h-3 text-emerald-400 fill-current" />
              </div>

              {/* Decorative Background Icon */}
              <channel.icon className="absolute -bottom-8 -right-8 w-24 h-24 text-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Archive Portal Modal */}
      {isArchiveOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setIsArchiveOpen(false)}></div>
          
          <div className="relative w-full max-w-7xl h-[90vh] glass-card rounded-[40px] flex flex-col overflow-hidden border-white/10 shadow-2xl bg-black">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <History className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Registry Archives</h2>
                  <p className="text-slate-500 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4" /> SECURE BLOCKCHAIN PLAYBACK NODE
                  </p>
                </div>
              </div>
              <button onClick={() => setIsArchiveOpen(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90">
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Archive List */}
              <div className="w-96 border-r border-white/5 overflow-y-auto p-8 bg-white/[0.01] space-y-6">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Historical Nodes</h4>
                {ARCHIVE_ITEMS.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedArchive(item)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all group ${selectedArchive?.id === item.id ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 relative">
                        <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                           <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-emerald-400">{item.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-1">{item.date} • {item.duration}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cinematic Viewer */}
              <div className="flex-1 p-10 flex flex-col space-y-8 overflow-y-auto bg-gradient-to-b from-black to-emerald-950/20">
                {selectedArchive ? (
                  <div className="animate-in fade-in slide-in-from-right duration-500 space-y-8">
                    {/* Mock Video Player */}
                    <div className="aspect-video glass-card rounded-[40px] overflow-hidden relative shadow-2xl border-white/5 group">
                      <img src={selectedArchive.img} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        <button className="w-24 h-24 rounded-full bg-emerald-500/80 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                          <Play className="w-10 h-10 fill-current translate-x-1" />
                        </button>
                        <p className="mt-6 text-white text-lg font-black tracking-widest uppercase animate-pulse">Reconstructing Signal...</p>
                      </div>
                      
                      {/* Spectral Data Overlays */}
                      <div className="absolute top-8 left-8 p-4 glass-card rounded-2xl border-emerald-500/40 pointer-events-none">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="w-4 h-4 text-rose-500" />
                          <span className="text-[10px] font-bold text-white">THERMAL: 24.2°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-blue-500" />
                          <span className="text-[10px] font-bold text-white">MOISTURE: 62%</span>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-8 right-8 text-[10px] font-mono text-emerald-400 bg-black/80 px-4 py-2 rounded-lg border border-emerald-500/20">
                        SCANLINE_HIST_V2.0 // NODE_{selectedArchive.id.toUpperCase()}
                      </div>

                      {/* Moving Scanline effect */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                         <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-scan"></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded tracking-widest border border-emerald-500/20">
                            {selectedArchive.thrust} Thrust Archive
                          </span>
                          <span className="text-slate-500 font-mono text-xs">{selectedArchive.date}</span>
                        </div>
                        <h3 className="text-4xl font-black text-white">{selectedArchive.title}</h3>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                          Historical data integrity verified on the EOS Registry. This segment provides evidence of high-resilience regenerative practices in Nebraska processing hubs.
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-emerald-600 transition-all border border-white/10 group">
                           <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                        </button>
                        <button className="p-4 bg-white/5 rounded-2xl text-white hover:bg-emerald-600 transition-all border border-white/10 group">
                           <Share2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="glass-card p-6 rounded-3xl border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Registry Hash</p>
                        <p className="text-xs font-mono text-emerald-400 truncate">0x{Math.random().toString(16).slice(2, 20)}...</p>
                      </div>
                      <div className="glass-card p-6 rounded-3xl border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Duration</p>
                        <p className="text-xs font-mono text-white">{selectedArchive.duration}</p>
                      </div>
                      <div className="glass-card p-6 rounded-3xl border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Resolution</p>
                        <p className="text-xs font-mono text-white">4K SPECTRAL</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-32 h-32 rounded-[40px] bg-white/5 flex items-center justify-center border border-white/10 group">
                      <Film className="w-16 h-16 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="max-w-sm">
                      <h4 className="text-2xl font-bold text-white mb-2">Select Historical Node</h4>
                      <p className="text-slate-500">Pick a segment from the registry on the left to initialize spectral playback and data analysis.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer Status */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-between items-center px-10">
               <div className="flex gap-10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">System Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Archive Range: 2021-2024</span>
                  </div>
               </div>
               <span className="text-[9px] font-mono text-slate-700">ENVIROSAGRO_VOD_CORE_BETA</span>
            </div>
          </div>
        </div>
      )}

      {/* Media Portal Modal */}
      {activeChannel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-[#050706]/95 backdrop-blur-2xl" onClick={() => setActiveChannel(null)}></div>
          
          <div className="relative w-full max-w-6xl h-[90vh] glass-card rounded-[40px] flex flex-col overflow-hidden shadow-2xl border-white/10 ring-1 ring-white/20">
            {/* Modal Header */}
            <div className={`p-10 border-b border-white/5 flex items-center justify-between ${activeChannel.bg}`}>
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-black/40 flex items-center justify-center shadow-2xl border border-white/10 relative overflow-hidden group">
                   <activeChannel.icon className={`w-10 h-10 ${activeChannel.color} relative z-10`} />
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-black text-white tracking-tight">{activeChannel.name}</h2>
                      {activeChannel.live && <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded uppercase animate-pulse">On Air</span>}
                   </div>
                   <p className="text-slate-400 text-lg font-medium mt-1">{activeChannel.desc}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveChannel(null)}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Portal Content */}
            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-4 gap-10 bg-[#050706]">
              <div className="lg:col-span-3 space-y-8">
                
                {/* Visualizer / Dashboard */}
                <div className="glass-card rounded-[40px] p-12 min-h-[400px] flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  
                  {!aiInsight && !loadingInsights ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 py-12">
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                        <activeChannel.icon className={`w-32 h-32 ${activeChannel.color} relative z-10 opacity-40`} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-2">Broadcast Intelligence Initialized</h4>
                        <p className="text-slate-500 max-w-sm mx-auto">Input a sustainability topic to generate a grounded broadcast segment or technical insight.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-in fade-in duration-700">
                      <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                          <Activity className="w-6 h-6 text-emerald-400" />
                          <h4 className="text-xl font-bold text-white">Live Insights: {insightQuery || "General Trends"}</h4>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                           <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"><Download className="w-5 h-5" /></button>
                        </div>
                      </div>
                      
                      <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-loose text-lg italic whitespace-pre-line border-l-4 border-emerald-500/20 pl-8 py-2">
                        {aiInsight?.text}
                      </div>

                      <div className="pt-8 flex items-center justify-between text-slate-500 text-xs font-mono">
                         <span>STATION ID: EOS-NODE-{activeChannel.id.toUpperCase()}</span>
                         <span>GENERATED VIA GEMINI 3 FLASH • 2024</span>
                      </div>
                    </div>
                  )}

                  {loadingInsights && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050706]/60 backdrop-blur-md z-20">
                       <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
                       <p className="text-emerald-400 font-bold mt-4 animate-pulse uppercase tracking-[0.2em]">Syncing Broadcast Frequencies...</p>
                    </div>
                  )}
                </div>

                {/* Interaction Panel */}
                <div className="glass-card p-10 rounded-[40px] border-emerald-500/20">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                     <div className="flex-1 w-full">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Segment Focus Topic</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text"
                            value={insightQuery}
                            onChange={(e) => setInsightQuery(e.target.value)}
                            placeholder={activeChannel.id === 'agromusika' ? "e.g. regenerative maize hydration..." : "e.g. Zone 4 spectral analysis..."}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all text-sm"
                          />
                        </div>
                     </div>
                     <button 
                      onClick={generateInsight}
                      disabled={loadingInsights}
                      className="w-full md:w-auto px-10 py-4 agro-gradient rounded-2xl text-white font-black text-sm shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                     >
                        <Zap className="w-5 h-5 fill-current" />
                        {activeChannel.action.toUpperCase()}
                     </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Portal Tools */}
              <div className="space-y-8">
                <div className="glass-card p-8 rounded-[32px] space-y-6">
                   <h5 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-3">Channel Controls</h5>
                   <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                         <span className="text-sm font-bold text-slate-300">Live Feedback</span>
                         <Heart className="w-4 h-4 text-slate-600 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                         <span className="text-sm font-bold text-slate-300">HD Broadcast</span>
                         <Maximize2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                         <span className="text-sm font-bold text-slate-300">Archive Access</span>
                         <FileText className="w-4 h-4 text-slate-600 group-hover:text-orange-400 transition-colors" />
                      </button>
                   </div>
                </div>

                <div className={`glass-card p-8 rounded-[32px] border-l-4 ${activeChannel.color.replace('text-', 'border-')} space-y-4`}>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network Analytics</p>
                   <div>
                      <p className="text-3xl font-black text-white">42.8K</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Verfied Listeners/Viewers</p>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${activeChannel.bg.replace('/10', '')} w-[74%] animate-pulse`}></div>
                   </div>
                   <p className="text-xs text-slate-400 italic">"Global reach across 12 sustainable agricultural zones."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Articles (AgroInPDF) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-orange-400" />
            AgroInPDF Featured Research
          </h3>
          <div className="space-y-4">
            {[
              { title: "Quantifying m-Resilience in Semi-Arid Zones", author: "EOS Research Team", date: "Oct 24, 2024", size: "4.2MB" },
              { title: "The Economic Impact of EAC Tokenization on Smallholdings", author: "Dr. Elena Rodriguez", date: "Oct 21, 2024", size: "2.8MB" },
              { title: "Satellite Analysis: Zone 4 Nebraska Soil Degradation Recovery", author: "SkyScout Labs", date: "Oct 18, 2024", size: "12.5MB" },
            ].map((doc, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white group-hover:text-orange-400 transition-colors">{doc.title}</h5>
                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">
                      {doc.author} • {doc.date}
                    </p>
                  </div>
                </div>
                <button className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-orange-500 transition-all shadow-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Media Stats Sidebox */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-400" />
            Network Reach
          </h3>
          <div className="glass-card p-8 rounded-[40px] space-y-8">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Monthly Views</p>
              <h4 className="text-4xl font-black text-white">2.4M+</h4>
              <div className="w-12 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Audio Stream Time</span>
                <span className="text-white font-bold">12,400 hrs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">PDF Downloads</span>
                <span className="text-white font-bold">84,200 units</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Live Feed Uptime</span>
                <span className="text-emerald-400 font-bold">99.98%</span>
              </div>
            </div>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MediaHub;