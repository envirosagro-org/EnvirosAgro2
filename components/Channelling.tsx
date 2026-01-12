import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Video, 
  Youtube, 
  Twitter, 
  Facebook, 
  Instagram, 
  Ghost, 
  FileText, 
  LayoutGrid, 
  Search, 
  Plus, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Heart, 
  Zap, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  X,
  Bot,
  Sparkles,
  Download,
  Filter,
  Users,
  Coins,
  ShieldCheck,
  Smartphone,
  Globe,
  BookOpen,
  FileJson,
  FileDown,
  Database,
  AtSign,
  Pin,
  HelpCircle,
  Cloud,
  Wind,
  Linkedin,
  Send,
  ArrowRight, 
  ArrowUpRight,
  Mic, 
  Library, 
  Film, 
  Bookmark, 
  FileCode, 
  Globe2, 
  Info,
  Paperclip
} from 'lucide-react';
import { User } from '../types';

interface ChannellingProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
}

type ContentType = 'YouTube' | 'TikTok' | 'Vimeo' | 'X' | 'Facebook' | 'Instagram' | 'Snapchat' | 'Blog' | 'Research Paper' | 'Podcast' | 'Book' | 'Documentary' | 'Technical Topic';

interface ArchiveItem {
  id: string;
  type: ContentType;
  title: string;
  url: string;
  author: string;
  views: number;
  interactions: number;
  eacEarned: number;
  timestamp: string;
  isAgroInPDF?: boolean;
  category?: string;
}

const OFFICIAL_ENVIRONMENTS = [
  { name: 'Threads', url: 'https://www.threads.com/@envirosagro', icon: AtSign, color: 'text-white' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@envirosagro?_r=1&_t=ZM-92puItTmTF6', icon: Video, color: 'text-pink-500' },
  { name: 'YouTube', url: 'https://youtube.com/@envirosagro?si=JOezDZYuxRVmeplX', icon: Youtube, color: 'text-red-500' },
  { name: 'X / Twitter', url: 'https://x.com/EnvirosAgro', icon: Twitter, color: 'text-blue-400' },
  { name: 'Quora', url: 'https://www.quora.com/profile/EnvirosAgro?ch=10&oid=2274202272&share=cee3144a&srid=3uVNlE&target_type=user', icon: HelpCircle, color: 'text-red-600' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/modern-agrarian-revolution', icon: Linkedin, color: 'text-blue-600' },
];

const INITIAL_ARCHIVE: ArchiveItem[] = [
  { id: '1', type: 'YouTube', title: 'Regenerative Composting in Arid Zones', url: 'https://youtube.com/watch?v=agro1', author: 'Dr. Sarah Chen', views: 1240, interactions: 420, eacEarned: 12.4, timestamp: '2h ago' },
  { id: '2', type: 'X', title: 'Soil pH Anomaly Report - Sector 4', url: 'https://x.com/steward/status/882', author: 'Node_Paris_04', views: 8500, interactions: 1200, eacEarned: 85.0, timestamp: '5h ago' },
  { id: '3', type: 'Research Paper', title: 'The SEHTI Framework: Industrial Resilience', url: 'https://registry.eos/papers/v3.2', author: 'Steward Central', views: 420, interactions: 98, eacEarned: 42.0, timestamp: '1d ago', isAgroInPDF: true },
  { id: '4', type: 'Podcast', title: 'AgroPulse: The Future of Blockchain Farming', url: 'https://spotify.com/episode/882', author: 'Marcus T.', views: 3200, interactions: 150, eacEarned: 32.0, timestamp: '4h ago' },
  { id: '5', type: 'Book', title: 'Bantu Soil Wisdom: A Modern Guide', url: 'https://agroinpdf.org/book/842', author: 'Steward Alpha', views: 950, interactions: 210, eacEarned: 45.0, timestamp: '2d ago', isAgroInPDF: true },
  { id: '6', type: 'Documentary', title: 'Zone 4: The Recovery Journey', url: 'https://youtube.com/watch?v=wild1', author: 'EnvirosAgro Films', views: 12000, interactions: 3400, eacEarned: 120.0, timestamp: '3d ago' },
];

const PLATFORM_ICONS: Record<string, any> = {
  YouTube: Youtube,
  TikTok: Video,
  Vimeo: Video,
  X: Twitter,
  Facebook: Facebook,
  Instagram: Instagram,
  Snapchat: Ghost,
  Blog: FileText,
  'Research Paper': FileJson,
  Podcast: Mic,
  Book: Library,
  Documentary: Film,
  'Technical Topic': Info
};

const Channelling: React.FC<ChannellingProps> = ({ user, onEarnEAC }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'social' | 'knowledge' | 'official'>('video');
  const [archive, setArchive] = useState<ArchiveItem[]>(INITIAL_ARCHIVE);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Submission Form State
  const [subUrl, setSubUrl] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [subType, setSubType] = useState<ContentType>('YouTube');
  const [subCategory, setSubCategory] = useState('Sustainable Innovation');

  const [totalEACEarned, setTotalEACEarned] = useState(745.8);

  const filteredArchive = archive.filter(item => {
    if (activeTab === 'video') return ['YouTube', 'TikTok', 'Vimeo', 'Documentary'].includes(item.type);
    if (activeTab === 'social') return ['X', 'Facebook', 'Instagram', 'Snapchat'].includes(item.type);
    if (activeTab === 'knowledge') return ['Blog', 'Research Paper', 'Podcast', 'Book', 'Technical Topic'].includes(item.type);
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const isKnowledge = ['Blog', 'Research Paper', 'Book', 'Podcast', 'Technical Topic'].includes(subType);
      const newItem: ArchiveItem = {
        id: Date.now().toString(),
        type: subType,
        title: subTitle,
        url: subUrl,
        author: user.name,
        views: 0,
        interactions: 0,
        eacEarned: 0,
        timestamp: 'Just now',
        isAgroInPDF: isKnowledge,
        category: subCategory
      };
      setArchive([newItem, ...archive]);
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      setSubUrl('');
      setSubTitle('');
      onEarnEAC(15, 'KNOWLEDGE_SHARD_INDEXED');
    }, 2000);
  };

  const handleInteraction = (id: string) => {
    setArchive(prev => prev.map(item => {
      if (item.id === id) {
        const bonus = 0.5;
        if (item.author === user.name) {
          setTotalEACEarned(prev => prev + bonus);
          onEarnEAC(bonus, 'CONTENT_ENGAGEMENT_REWARD');
        }
        return { ...item, interactions: item.interactions + 1, eacEarned: item.eacEarned + bonus };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1600px] mx-auto">
      
      {/* Monetization Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-12 rounded-[56px] border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 group shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform pointer-events-none">
              <Share2 className="w-96 h-96 text-white" />
           </div>
           <div className="w-40 h-40 rounded-[48px] bg-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] ring-4 ring-white/10 shrink-0">
              <Share2 className="w-20 h-20 text-white" />
           </div>
           <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                 <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full tracking-[0.4em] border border-indigo-500/20">EOS_CHANNEL_HUB_V4</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mt-4">Channelling <span className="text-indigo-400">& Hub</span></h2>
              </div>
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl font-medium">
                 The Network Broadcast Node. Archive and index **Videos, Research Papers, Blogs, Podcasts, and Books** to synchronize global knowledge shards and earn <span className="text-indigo-400 font-bold">EAC Rewards</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                 <button 
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    <PlusCircle className="w-5 h-5" /> Index Content Link
                 </button>
                 <button className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                    <Download className="w-5 h-5" /> Export Knowledge Ledger
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-10 rounded-[48px] border-white/5 bg-black/40 flex flex-col justify-between text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-indigo-500/[0.02] pointer-events-none"></div>
           <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">Shard Monetization</p>
              <h4 className="text-6xl font-mono font-black text-white tracking-tighter">{totalEACEarned.toFixed(0)}<span className="text-xl text-emerald-500">EAC</span></h4>
           </div>
           <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600">
                 <span>Sync Velocity</span>
                 <span className="text-emerald-400">High</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                 <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_15px_#10b981]"></div>
              </div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-[32px] w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40 shadow-xl">
        {[
          { id: 'video', label: 'Cinema & Streaming', icon: Film },
          { id: 'social', label: 'Social Shards', icon: Smartphone },
          { id: 'knowledge', label: 'Knowledge Archive', icon: Library },
          { id: 'official', label: 'Official Environments', icon: Globe2 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
         {activeTab === 'official' ? (
           OFFICIAL_ENVIRONMENTS.map((env, i) => (
             <a 
              key={i} 
              href={env.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-card p-10 rounded-[56px] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex flex-col items-center text-center gap-8 group active:scale-95 shadow-2xl relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><Globe size={160} /></div>
                <div className={`w-24 h-24 rounded-[32px] bg-white/5 flex items-center justify-center shadow-3xl transition-all group-hover:scale-110 border border-white/10 ${env.color}`}>
                   <env.icon className="w-12 h-12" />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic m-0">{env.name}</h4>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Verified Network Node</p>
                </div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                   Connect to Environment <ExternalLink className="w-4 h-4" />
                </div>
             </a>
           ))
         ) : (
           filteredArchive.map(item => {
             const Icon = PLATFORM_ICONS[item.type] || Globe;
             const isKnowledge = ['Blog', 'Research Paper', 'Book', 'Podcast', 'Technical Topic'].includes(item.type);
             
             return (
               <div key={item.id} className={`glass-card rounded-[48px] p-8 border group transition-all flex flex-col h-full active:scale-[0.98] duration-300 shadow-xl relative overflow-hidden ${isKnowledge ? 'border-orange-500/10 hover:border-orange-500/30 bg-orange-500/[0.01]' : 'border-white/5 hover:border-indigo-500/20 bg-black/20'}`}>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 transition-transform"><Icon size={120} /></div>
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isKnowledge ? 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' : 'bg-white/5 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        <Icon className="w-8 h-8" />
                     </div>
                     <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 border rounded-lg text-[8px] font-black uppercase tracking-widest ${isKnowledge ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{item.type}</span>
                        <span className="text-[9px] text-slate-700 font-mono mt-2 font-bold">{item.timestamp}</span>
                     </div>
                  </div>

                  <h4 className={`text-2xl font-black text-white leading-tight tracking-tighter mb-4 transition-colors flex-1 italic m-0 ${isKnowledge ? 'group-hover:text-orange-400' : 'group-hover:text-indigo-400'}`}>{item.title}</h4>
                  
                  <div className="space-y-4 mb-10 relative z-10">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-600">Publisher</span>
                        <span className="text-white font-bold">{item.author}</span>
                     </div>
                     <div className="flex gap-6">
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-emerald-400 transition-colors">
                           <Eye className="w-4 h-4" />
                           <span className="text-[11px] font-mono font-black">{item.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                           <MessageSquare className="w-4 h-4" />
                           <span className="text-[11px] font-mono font-black">{item.interactions.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest">EAC Shards</p>
                        <p className={`text-2xl font-mono font-black ${item.eacEarned > 0 ? 'text-emerald-400' : 'text-slate-700'}`}>+{item.eacEarned.toFixed(1)}</p>
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => handleInteraction(item.id)}
                          className="p-4 rounded-2xl bg-white/5 hover:bg-emerald-600 hover:text-white transition-all border border-white/10 shadow-lg active:scale-90"
                        >
                           <Zap className="w-5 h-5 fill-current" />
                        </button>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`p-4 rounded-2xl transition-all border border-white/10 shadow-lg active:scale-90 ${isKnowledge ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white' : 'bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'}`}
                        >
                           <ArrowUpRight className="w-5 h-5" />
                        </a>
                     </div>
                  </div>
               </div>
             );
           })
         )}
      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#050706]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setIsSubmitModalOpen(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card rounded-[64px] border-indigo-500/30 bg-[#050706] overflow-hidden shadow-3xl animate-in zoom-in duration-300 border-2">
              <div className="p-16 space-y-12 min-h-[650px] flex flex-col">
                 <button onClick={() => setIsSubmitModalOpen(false)} className="absolute top-12 right-12 p-4 bg-white/5 border border-white/10 rounded-full text-slate-600 hover:text-white transition-all z-20"><X className="w-8 h-8" /></button>
                 
                 <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-indigo-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-indigo-500/20 shadow-2xl relative group">
                       <Plus className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[32px] animate-ping opacity-30"></div>
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic m-0">Index <span className="text-indigo-400">Content Shard</span></h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-md:text-sm max-w-md mx-auto">Commit a URL node to the global ledger. Videos, books, and scientific papers earn higher weightage.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Content Designation</label>
                       <select 
                        value={subType}
                        onChange={e => setSubType(e.target.value as ContentType)}
                        className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none shadow-inner"
                       >
                          <optgroup label="Visual Media">
                            <option>YouTube</option>
                            <option>Documentary</option>
                            <option>TikTok</option>
                            <option>Vimeo</option>
                          </optgroup>
                          <optgroup label="Knowledge Shards">
                            <option>Research Paper</option>
                            <option>Book</option>
                            <option>Podcast</option>
                            <option>Blog</option>
                            <option>Technical Topic</option>
                          </optgroup>
                          <optgroup label="Social Registry">
                            <option>X</option>
                            <option>Instagram</option>
                            <option>Facebook</option>
                            <option>Snapchat</option>
                          </optgroup>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Shard Title</label>
                       <input 
                        type="text" 
                        required 
                        value={subTitle}
                        onChange={e => setSubTitle(e.target.value)}
                        placeholder="Title of your post, paper or media..." 
                        className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-xl font-bold text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-800 shadow-inner" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-6">Public URL Node</label>
                       <input 
                        type="url" 
                        required 
                        value={subUrl}
                        onChange={e => setSubUrl(e.target.value)}
                        placeholder="https://..." 
                        className="w-full bg-black/60 border border-white/10 rounded-[32px] py-6 px-10 text-lg font-mono text-indigo-400 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-inner" 
                       />
                    </div>

                    <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[40px] flex items-center gap-6">
                       <ShieldCheck className="w-10 h-10 text-indigo-400 shrink-0" />
                       <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-widest">
                          By indexing, you authorize network monitoring for reward verification. Non-functional links trigger a <span className="text-rose-500">Node Trust Penalty</span>.
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting || !subUrl || !subTitle}
                      className="w-full py-10 bg-indigo-600 hover:bg-indigo-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
                    >
                       {isSubmitting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                       {isSubmitting ? "SYNCING SHARD..." : "AUTHORIZE REGISTRY MINT"}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .animate-marquee { animation: marquee 45s linear infinite; }
        @keyframes marquee { from { transform: translateX(100%); } to { transform: translateX(-100%); } }
        .pause-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default Channelling;