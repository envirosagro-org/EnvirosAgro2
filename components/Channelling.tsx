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
  Database
} from 'lucide-react';
import { User } from '../types';

interface ChannellingProps {
  user: User;
  onEarnEAC: (amount: number, reason: string) => void;
}

type ContentType = 'YouTube' | 'TikTok' | 'Vimeo' | 'X' | 'Facebook' | 'Instagram' | 'Snapchat' | 'Blog' | 'Paper';

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
  isAgroInPDF?: boolean; // Flag for Knowledge Ledger items
}

const INITIAL_ARCHIVE: ArchiveItem[] = [
  { id: '1', type: 'YouTube', title: 'Regenerative Composting in Arid Zones', url: 'https://youtube.com/watch?v=agro1', author: 'Dr. Sarah Chen', views: 1240, interactions: 420, eacEarned: 12.4, timestamp: '2h ago' },
  { id: '2', type: 'X', title: 'Soil pH Anomaly Report - Sector 4', url: 'https://x.com/steward/status/882', author: 'Node_Paris_04', views: 8500, interactions: 1200, eacEarned: 85.0, timestamp: '5h ago' },
  { id: '3', type: 'Paper', title: 'The SEHTI Framework: Industrial Resilience', url: 'https://registry.eos/papers/v3.2', author: 'Steward Central', views: 420, interactions: 98, eacEarned: 42.0, timestamp: '1d ago', isAgroInPDF: true },
  { id: '4', type: 'TikTok', title: 'Daily Harvest Speedrun', url: 'https://tiktok.com/@agro/v/992', author: 'Farm_Vibe', views: 45000, interactions: 8200, eacEarned: 450.0, timestamp: '3d ago' },
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
  Paper: FileJson
};

const Channelling: React.FC<ChannellingProps> = ({ user, onEarnEAC }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'social' | 'knowledge'>('video');
  const [archive, setArchive] = useState<ArchiveItem[]>(INITIAL_ARCHIVE);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Submission Form State
  const [subUrl, setSubUrl] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [subType, setSubType] = useState<ContentType>('YouTube');

  const [totalEACEarned, setTotalEACEarned] = useState(589.4);

  const filteredArchive = archive.filter(item => {
    if (activeTab === 'video') return ['YouTube', 'TikTok', 'Vimeo'].includes(item.type);
    if (activeTab === 'social') return ['X', 'Facebook', 'Instagram', 'Snapchat'].includes(item.type);
    if (activeTab === 'knowledge') return ['Blog', 'Paper'].includes(item.type);
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const isKnowledge = ['Blog', 'Paper'].includes(subType);
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
        isAgroInPDF: isKnowledge
      };
      setArchive([newItem, ...archive]);
      setIsSubmitting(false);
      setIsSubmitModalOpen(false);
      setSubUrl('');
      setSubTitle('');
      onEarnEAC(10, 'CHANNEL_INDEXING_REWARD');
    }, 2000);
  };

  const handleInteraction = (id: string) => {
    setArchive(prev => prev.map(item => {
      if (item.id === id) {
        const bonus = 0.5;
        if (item.author === user.name) {
          setTotalEACEarned(prev => prev + bonus);
          onEarnEAC(bonus, 'CONTENT_INTERACTION');
        }
        return { ...item, interactions: item.interactions + 1, eacEarned: item.eacEarned + bonus };
      }
      return item;
    }));
  };

  const handleAgroInPDFExport = (item: ArchiveItem) => {
    alert(`AGROINPDF PROTOCOL: Sharding "${item.title}" into immutable industrial PDF format. Transaction signed by ESIN: ${user.esin}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Monetization Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
           <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-6 transition-transform">
              <TrendingUp className="w-80 h-80 text-white" />
           </div>
           <div className="w-32 h-32 rounded-[40px] bg-emerald-500 flex items-center justify-center shadow-2xl shrink-0 ring-4 ring-white/10">
              <Share2 className="w-16 h-16 text-white" />
           </div>
           <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Channelling <span className="text-emerald-400">& Archive</span></h2>
                 <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest">Industry standard protocol</div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
                Broadcast your sustainability journey. Earn <span className="text-emerald-400 font-black">EAC Rewards</span> from global views and network-wide interactions. All Knowledge Shards are indexed via <span className="text-orange-400">AgroInPDF™</span>.
              </p>
              <div className="flex gap-4 pt-2">
                 <button 
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-8 py-3 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                 >
                    <PlusCircle className="w-4 h-4" /> Index Content Shard
                 </button>
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export Ledger
                 </button>
              </div>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[48px] border-white/5 flex flex-col justify-center text-center space-y-4 bg-black/20">
           <div className="flex flex-col items-center">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Lifetime Monetization</p>
              <h4 className="text-5xl font-mono font-black text-emerald-400">{totalEACEarned.toFixed(1)} <span className="text-sm">EAC</span></h4>
           </div>
           <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full">
              <div className="h-full bg-emerald-500 w-[65%] animate-pulse"></div>
           </div>
           <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase">
              <span>Next Payout</span>
              <span>12.4 EAC Remaining</span>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'video', label: 'Visual Nodes', icon: Video },
          { id: 'social', label: 'Social Shards', icon: Smartphone },
          { id: 'knowledge', label: 'Knowledge Ledger', icon: BookOpen },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'knowledge' && (
        <div className="p-8 glass-card border-orange-500/20 bg-orange-500/5 rounded-3xl flex items-center justify-between mb-4">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-400 text-black rounded-xl shadow-xl">
                 <FileJson className="w-6 h-6" />
              </div>
              <div>
                 <h4 className="text-xl font-black text-white uppercase tracking-tighter italic">AgroInPDF™ Knowledge Protocol</h4>
                 <p className="text-slate-400 text-xs font-medium">Standardized sharding for research papers, topics, and technical blogs.</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-orange-400 font-black uppercase">Indexing active</p>
              <p className="text-xs font-mono text-white font-bold">NODE_PDF_V3.2</p>
           </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-500">
         {filteredArchive.map(item => {
           const Icon = PLATFORM_ICONS[item.type] || Globe;
           const isKnowledge = ['Blog', 'Paper'].includes(item.type);
           return (
             <div key={item.id} className={`glass-card rounded-[44px] p-8 border group transition-all flex flex-col h-full active:scale-[0.98] duration-200 ${isKnowledge ? 'border-orange-500/10 hover:border-orange-500/30' : 'border-white/5 hover:border-indigo-500/20'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isKnowledge ? 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' : 'bg-white/5 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      <Icon className="w-7 h-7" />
                   </div>
                   <div className="flex flex-col items-end">
                      <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-widest ${isKnowledge ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>{item.type}</span>
                      <span className="text-[9px] text-slate-600 font-mono mt-1">{item.timestamp}</span>
                   </div>
                </div>

                <h4 className={`text-xl font-black text-white leading-tight tracking-tighter mb-4 transition-colors flex-1 ${isKnowledge ? 'group-hover:text-orange-400' : 'group-hover:text-indigo-400'}`}>{item.title}</h4>
                
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">Source Steward</span>
                      <span className="text-white">{item.author}</span>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-slate-500 group-hover:text-emerald-400 transition-colors">
                         <Eye className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-mono font-bold">{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                         <MessageSquare className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-mono font-bold">{item.interactions.toLocaleString()}</span>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[8px] text-slate-600 font-black uppercase">EAC Accrued</p>
                      <p className={`text-xl font-mono font-black ${item.eacEarned > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>+{item.eacEarned.toFixed(1)}</p>
                   </div>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleInteraction(item.id)}
                        className="p-3 rounded-xl bg-white/5 hover:bg-emerald-600 hover:text-white transition-all border border-white/10"
                      >
                         <Zap className="w-4 h-4" />
                      </button>
                      {isKnowledge ? (
                        <button 
                          onClick={() => handleAgroInPDFExport(item)}
                          className="p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20"
                        >
                           <FileDown className="w-4 h-4" />
                        </button>
                      ) : (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-white/5 hover:bg-blue-600 hover:text-white transition-all border border-white/10"
                        >
                           <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                   </div>
                </div>
             </div>
           );
         })}
      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setIsSubmitModalOpen(false)}></div>
           <div className="relative z-10 w-full max-w-xl glass-card p-1 rounded-[40px] border-indigo-500/20 overflow-hidden shadow-2xl">
              <div className="bg-[#050706] p-12 space-y-8 flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                          <Share2 className="w-8 h-8 text-indigo-400" />
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Archive <span className="text-indigo-400">Ingest</span></h3>
                    </div>
                    <button onClick={() => setIsSubmitModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Archive Shard Type</label>
                       <select 
                        value={subType}
                        onChange={e => setSubType(e.target.value as ContentType)}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500/40"
                       >
                          <optgroup label="Video Nodes">
                            <option>YouTube</option>
                            <option>TikTok</option>
                            <option>Vimeo</option>
                            <option>Facebook</option>
                          </optgroup>
                          <optgroup label="Social Shards">
                            <option>X</option>
                            <option>Instagram</option>
                            <option>Snapchat</option>
                          </optgroup>
                          <optgroup label="Knowledge Ledger (AgroInPDF)">
                            <option>Blog</option>
                            <option>Paper</option>
                          </optgroup>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Shard Label</label>
                       <input 
                        type="text" 
                        required 
                        value={subTitle}
                        onChange={e => setSubTitle(e.target.value)}
                        placeholder="Title of your post, video or research paper..." 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Registry URL</label>
                       <input 
                        type="url" 
                        required 
                        value={subUrl}
                        onChange={e => setSubUrl(e.target.value)}
                        placeholder="https://platform.com/your-content-link" 
                        className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                       />
                    </div>

                    <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[32px] flex items-center gap-4">
                       <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
                       <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-black tracking-widest">
                          By indexing, you authorize the network to track interaction metadata for EAC payouts. Fraudulent links trigger a <span className="text-rose-400">m-constant penalty</span>.
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                       {isSubmitting ? "INDEXING SHARD..." : "FINALIZE REGISTRY MINT"}
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
      `}</style>
    </div>
  );
};

export default Channelling;