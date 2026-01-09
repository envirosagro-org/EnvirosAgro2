
import React, { useState, useRef } from 'react';
import { 
  PlayCircle, 
  GraduationCap, 
  Video, 
  BookOpen, 
  BookOpen as BookOpenIcon,
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
  Filter,
  MessageCircle,
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
  FileBarChart,
  BarChart4,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { User } from '../types';
import { findAgroResources, GroundingChunk } from '../services/geminiService';

interface CommunityProps {
  user: User;
  onContribution: (type: 'post' | 'upload' | 'module' | 'quiz', category: string) => void;
  onSpendEAC: (amount: number, reason: string) => boolean;
}

const CHAPTERS = [
  { id: 1, title: "The SEHTI Philosophy", content: "Agriculture is not just land management; it is a complex system of human psychology, social structures, and scientific data. SEHTI integrates five core thrusts to achieve 100% sustainability.\n\nS: Societal - Anthropological agriculture.\nE: Environmental - Stewardship of physical resources.\nH: Human - Health and behavioral processes.\nT: Technological - Modern agrarian innovations.\nI: Industry - Data-driven industrial optimization and blockchain registries." },
  { id: 2, title: "Industry Thrust (I)", content: "The 'I' pillar focuses on industrial optimization. By leveraging decentralized ledgers (ESIN), we create an immutable record of agricultural output, carbon capture, and resource efficiency. This allows farms to act as independent economic nodes in a global grid." },
  { id: 3, title: "Agricultural Code C(a)", content: "The C(a) is the core biometric of your land. It is calculated based on cumulative sustainable practices. A high C(a) directly correlates with lower registry fees and higher EAC minting multipliers." },
];

const Community: React.FC<CommunityProps> = ({ user, onContribution, onSpendEAC }) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'lms' | 'manual' | 'report'>('hub');
  const [isPosting, setIsPosting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(CHAPTERS[0]);
  
  // New States for screenshot-driven features
  const [isSearchingResources, setIsSearchingResources] = useState(false);
  const [resourceResults, setResourceResults] = useState<{ text: string, sources?: GroundingChunk[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    
    setIsPosting(true);
    setTimeout(() => {
      onContribution('post', 'Sociological');
      setIsPosting(false);
      setPostContent('');
      alert("SUCCESS: Post committed to Heritage Forum. +5 EAC Earned.");
    }, 1500);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onContribution('upload', 'Registry Evidence');
      alert(`EVIDENCE SYNC: "${file.name}" uploaded to registry. +20 EAC & Skill points earned.`);
    }
  };

  const handleGlobeClick = async () => {
    setIsSearchingResources(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const res = await findAgroResources("Find sustainable agricultural centers and resources nearby", pos.coords.latitude, pos.coords.longitude);
          setResourceResults(res);
          setIsSearchingResources(false);
        },
        async () => {
          const res = await findAgroResources("Find global sustainable agricultural resources");
          setResourceResults(res);
          setIsSearchingResources(false);
        }
      );
    } catch (e) {
      setIsSearchingResources(false);
    }
  };

  const boostDiscussion = () => {
    const success = onSpendEAC(100, 'PIN_DISCUSSION');
    if (success) {
      alert("DISCUSSION PINNED: This topic will remain at the top for 24 hours.");
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 p-1.5 glass-card rounded-2xl w-fit mx-auto lg:mx-0 border border-white/5 bg-black/40">
        {[
          { id: 'hub', name: 'HERITAGE HUB', icon: Globe },
          { id: 'lms', name: 'LEARNING HUB', icon: Library },
          { id: 'manual', name: 'SEHTI MANUAL', icon: BookOpen },
          { id: 'report', name: 'PERFORMANCE REPORT', icon: BarChart4 },
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <t.icon className="w-4 h-4" />
            {t.name}
          </button>
        ))}
      </div>

      {activeTab === 'hub' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Posting Interface */}
              <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      Heritage Forum Update
                   </h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+5 EAC PER POST</span>
                </div>
                <form onSubmit={handlePostSubmit} className="space-y-6">
                   <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share knowledge, ancestral lineages, or field updates..." 
                    className="w-full bg-black/60 border border-white/10 rounded-3xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none min-h-[160px]"
                   />
                   <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button 
                          type="button" 
                          onClick={handleUploadClick}
                          title="Upload Evidence"
                          className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-transparent transition-all"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={handleGlobeClick}
                          title="Find Resources"
                          className={`p-3 bg-white/5 rounded-xl transition-all border border-transparent ${isSearchingResources ? 'text-emerald-400 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/40'}`}
                        >
                          <Globe className="w-5 h-5" />
                        </button>
                      </div>
                      <button 
                        type="submit"
                        disabled={isPosting || !postContent.trim()}
                        className="px-12 py-3.5 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        BROADCAST TO HUB
                      </button>
                   </div>
                </form>

                {/* Resource Results Dropdown */}
                {resourceResults && (
                  <div className="mt-6 p-6 bg-black/60 border border-emerald-500/20 rounded-3xl animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Regional Resource Shards
                      </h4>
                      <button onClick={() => setResourceResults(null)} className="text-slate-600 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic mb-4">{resourceResults.text}</p>
                    {resourceResults.sources && (
                      <div className="flex flex-wrap gap-2">
                        {resourceResults.sources.map((s, i) => (
                          <a key={i} href={s.web?.uri || s.maps?.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center gap-2">
                            <ExternalLink className="w-3 h-3" /> {s.web?.title || s.maps?.title || "Resource"}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Forum Feed */}
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">ACTIVE CONTRIBUTIONS</h4>
                    <button onClick={boostDiscussion} className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors flex items-center gap-2 px-4 py-2 glass-card rounded-xl border border-amber-500/20">
                       <Zap className="w-3 h-3 fill-current" /> PIN DISCUSSION (100 EAC)
                    </button>
                 </div>
                 {[
                   { author: "@BANTU_STEWARD", title: "Passing the Seed: Lineage-based Crop Rotation", tags: ["S-THRUST", "HERITAGE"], likes: 142, replies: 24, time: "2H AGO" },
                   { author: "@SOILSAGE", title: "Treating Root Rot in Zone 4", tags: ["PATHOLOGY", "T-THRUST"], likes: 89, replies: 12, time: "5H AGO" },
                 ].map((post, i) => (
                   <div key={i} className="glass-card p-8 rounded-[32px] hover:bg-white/[0.04] transition-all border border-white/5 group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-emerald-500 text-xl border border-white/5 shadow-xl">
                               {post.author[1]}
                            </div>
                            <div>
                               <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">{post.title}</h4>
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">STEWARD {post.author} • {post.time}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {post.tags.map(t => <span key={t} className="px-3 py-1 bg-white/5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-lg border border-white/10">{t}</span>)}
                         </div>
                      </div>
                      <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer font-bold">
                            <Heart className="w-5 h-5" /> {post.likes}
                         </div>
                         <div className="flex items-center gap-2.5 text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer font-bold">
                            <MessageSquare className="w-5 h-5" /> {post.replies}
                         </div>
                         <button className="ml-auto text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            FULL DOSSIER <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Reputation Sidebar */}
            <div className="space-y-8">
               <div className="glass-card p-10 rounded-[48px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 agro-gradient"></div>
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-emerald-500/10 flex items-center justify-center shadow-inner">
                       <Zap className="w-14 h-14 text-emerald-400 fill-emerald-400/20" />
                    </div>
                    <svg className="absolute inset-0 w-32 h-32 transform -rotate-90">
                       <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                       <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={364} strokeDashoffset={364 - (364 * (user.wallet.lifetimeEarned % 2000) / 2000)} className="text-emerald-500 transition-all duration-1000 shadow-[0_0_10px_#10b981]" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">SEED STEWARD</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{2000 - user.wallet.lifetimeEarned} EAC TO NEXT RANK</p>
                  </div>
                  <div className="w-full space-y-6 pt-6 border-t border-white/5">
                     <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                        <span>PROOF OF EFFORT</span>
                        <span className="text-emerald-400 font-mono text-lg">{user.wallet.lifetimeEarned} <span className="text-[10px]">EAC</span></span>
                     </div>
                     <button 
                      onClick={() => setActiveTab('report')}
                      className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-white/10 transition-all shadow-xl"
                     >
                        REGISTRY PERFORMANCE REPORT
                     </button>
                  </div>
               </div>

               <div className="glass-card p-10 rounded-[48px] space-y-8 border-white/5">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5 pb-6">TOP SKILL TAGS</h4>
                  <div className="space-y-6">
                     {Object.entries(user.skills).length > 0 ? Object.entries(user.skills).map(([skill, points]) => (
                       <div key={skill} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className={`w-2.5 h-2.5 rounded-full transition-shadow ${(points as number) >= 100 ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-blue-400'}`}></div>
                             <span className="text-sm font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">{skill}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 font-black tracking-widest">{(points as number) >= 100 ? 'SKILLED' : (points as number) >= 20 ? 'APPRENTICE' : 'SEED'}</span>
                       </div>
                     )) : (
                       <p className="text-[10px] text-slate-500 italic text-center font-black">COMPLETE MODULES TO EARN SKILLS.</p>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lms' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="glass-card rounded-[48px] p-16 bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-14">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <Library className="w-80 h-80 text-indigo-400" />
              </div>
              <div className="w-24 h-24 bg-indigo-500/20 rounded-[32px] flex items-center justify-center border border-indigo-500/30 shrink-0 shadow-2xl relative z-10">
                 <GraduationCap className="w-12 h-12 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic m-0">Learning <span className="text-indigo-400">Hub</span></h2>
                 <p className="text-slate-400 text-xl font-medium leading-relaxed">Deconstruct complex agro-architectures. Earn EAC and verified registry reputation shards.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: "Precision Drip Irrigation", category: "IRRIGATION TECH", eac: 100, pts: 20 },
                { title: "Bantu Clan Agronomy", category: "SOCIOLOGICAL", eac: 100, pts: 20 },
                { title: "Carbon-Neutral Composting", category: "PRECISION FARMING", eac: 100, pts: 20 },
                { title: "Industry 4.0 Agro-Logistics", category: "INDUSTRY", eac: 120, pts: 25 },
              ].map((m, i) => (
                <div key={i} className="glass-card p-10 rounded-[48px] border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full active:scale-95 duration-300">
                   <div className="flex justify-between items-start mb-10">
                      <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">{m.category}</span>
                      <div className="text-right">
                         <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">+{m.eac} EAC</p>
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">+{m.pts} SKILL PTS</p>
                      </div>
                   </div>
                   <h4 className="text-2xl font-black text-white mb-10 leading-tight flex-1 tracking-tighter">{m.title}</h4>
                   <button 
                    onClick={() => onContribution('module', m.category)}
                    className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black text-white uppercase tracking-[0.4em] hover:bg-indigo-600 hover:border-indigo-500 transition-all flex items-center justify-center gap-3 shadow-xl group-hover:scale-105 active:scale-95"
                   >
                      <PlayCircle className="w-5 h-5" /> START MODULE
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-8 rounded-[40px] space-y-3 border-white/5">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 px-2">MANUAL INDEX</h4>
                 {CHAPTERS.map(ch => (
                   <button 
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-full text-left p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${selectedChapter.id === ch.id ? 'bg-emerald-600 text-white shadow-xl border-emerald-500 scale-105' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
                   >
                      CHAPTER {ch.id}: {ch.title}
                   </button>
                 ))}
              </div>
              <div className="glass-card p-8 rounded-[40px] bg-blue-600/5 border-blue-500/20">
                 <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mb-3">REGISTRY MANDATE</p>
                 <p className="text-xs text-slate-400 leading-relaxed uppercase font-bold italic">The SEHTI Manual is the governing constitution for all Steward Nodes on the EOS network.</p>
              </div>
           </div>

           <div className="lg:col-span-3 glass-card p-16 rounded-[56px] bg-white/[0.01] border-white/5 prose prose-invert max-w-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12">
                 <BookOpenIcon className="w-[400px] h-[400px] text-white" />
              </div>
              <div className="relative z-10 flex items-center gap-6 mb-12 border-b border-white/5 pb-12">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <BookOpenIcon className="w-10 h-10 text-emerald-400" />
                 </div>
                 <h2 className="text-5xl font-black text-white uppercase tracking-tighter m-0 italic">{selectedChapter.title}</h2>
              </div>
              <div className="relative z-10 text-slate-300 leading-[2.2] text-xl whitespace-pre-line bg-black/40 p-12 rounded-[48px] border border-white/5 italic font-medium shadow-inner">
                 {selectedChapter.content}
              </div>
              <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600 font-black uppercase tracking-[0.4em] relative z-10">
                 <span>REVISION_v3.2.1_STABLE</span>
                 <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-emerald-500" /> SIGNED_BY: GOVERNANCE_ORACLE_01</span>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
           <div className="glass-card p-16 rounded-[56px] bg-emerald-600/5 border-emerald-500/20 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <BarChart4 className="w-96 h-96 text-emerald-400" />
              </div>
              
              <div className="w-56 h-56 agro-gradient rounded-full flex flex-col items-center justify-center shadow-2xl ring-[20px] ring-white/5 group hover:scale-105 transition-transform duration-500">
                 <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] mb-1">GLOBAL RANK</p>
                 <h4 className="text-7xl font-black text-white tracking-tighter">#842</h4>
                 <div className="mt-4 flex gap-1.5">
                    {[0,1,2,3].map(i => <div key={i} className="w-1.5 h-4 bg-white/40 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                 </div>
              </div>

              <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                 <div className="space-y-2">
                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full tracking-[0.5em] border border-emerald-500/20">REGISTRY_AUDIT_SYNC</span>
                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mt-2">Performance <span className="text-emerald-400">Report</span></h2>
                 </div>
                 <p className="text-slate-400 text-2xl leading-relaxed italic font-medium">"Your node is currently operating at <span className="text-emerald-400 font-black">92% efficiency</span> compared to the regional benchmark for {user.location}."</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                    {[
                      { l: 'AUDIT PASSES', v: '12/12', c: 'text-white' },
                      { l: 'VOUCH SCORE', v: '4.8/5', c: 'text-emerald-400' },
                      { l: 'REACTION YIELD', v: '142.5 EAC', c: 'text-blue-400' },
                      { l: 'THRUST LEVEL', v: 'TIER 2', c: 'text-amber-500' },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 glass-card rounded-3xl border-white/5 bg-black/40 group hover:border-white/10 transition-all">
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">{stat.l}</p>
                         <p className={`text-xl font-black ${stat.c}`}>{stat.v}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="glass-card p-12 rounded-[56px] border-white/5 space-y-8 bg-black/40">
                 <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                       <TrendingUp className="w-5 h-5 text-emerald-400" /> REPUTATION MOMENTUM
                    </h4>
                    <span className="text-[10px] font-mono text-slate-700 tracking-tighter">DATA_SYNC: 24H_BLOCK</span>
                 </div>
                 <div className="h-60 flex items-end justify-between gap-3 px-6 pt-10">
                    {[30, 45, 25, 60, 85, 40, 75, 90, 55, 100, 88, 92].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/5 rounded-t-2xl relative group overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 transition-all duration-[1.5s] group-hover:bg-emerald-500 group-hover:shadow-[0_0_20px_#10b98144]" style={{height: `${h}%`}}></div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-4 px-6 text-[8px] font-black text-slate-800 uppercase tracking-[0.6em]">
                    <span>T-12_BLOCK</span>
                    <span>CURRENT_NODE</span>
                 </div>
              </div>
              <div className="glass-card p-12 rounded-[56px] bg-blue-600/5 border-blue-500/20 flex flex-col justify-center items-center text-center space-y-10 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/[0.02] animate-pulse"></div>
                 <div className="w-24 h-24 bg-blue-500/20 rounded-[32px] flex items-center justify-center border border-blue-500/40 shadow-2xl group-hover:rotate-12 transition-transform duration-500 relative z-10">
                    <ShieldCheck className="w-12 h-12 text-blue-400" />
                 </div>
                 <div className="space-y-4 relative z-10">
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter italic">Verified Standing</h4>
                    <p className="text-slate-400 text-lg max-w-xs leading-relaxed font-medium">Your node contributions have been cross-verified by 24 independent industrial validator nodes.</p>
                 </div>
                 <button className="w-full max-w-sm py-6 agro-gradient rounded-3xl text-[11px] font-black uppercase tracking-[0.5em] text-white shadow-2xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition-all relative z-10">
                    DOWNLOAD PDF SHARD
                 </button>
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

export default Community;
