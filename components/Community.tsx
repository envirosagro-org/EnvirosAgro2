
import React, { useState } from 'react';
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
  BarChart4
} from 'lucide-react';
import { User } from '../types';

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

  const handleUpload = () => {
    const categories = ['Precision Farming', 'Irrigation Tech', 'Livestock Manager', 'Greenhouse Specialist'];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    onContribution('upload', randomCat);
    alert(`EVIDENCE SYNC: High-value file uploaded to ${randomCat}. +20 EAC & Skill points earned.`);
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
      <div className="flex flex-wrap gap-4 p-1 glass-card rounded-2xl w-fit">
        {[
          { id: 'hub', name: 'Heritage Hub', icon: Globe },
          { id: 'lms', name: 'Learning Hub', icon: Library },
          { id: 'manual', name: 'SEHTI Manual', icon: BookOpen },
          { id: 'report', name: 'Performance Report', icon: BarChart4 },
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
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-emerald-400" />
                      Heritage Forum Update
                   </h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+5 EAC PER POST</span>
                </div>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                   <textarea 
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share knowledge, ancestral lineages, or field updates..." 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none min-h-[120px]"
                   />
                   <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button type="button" onClick={handleUpload} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Upload className="w-5 h-5" /></button>
                        <button type="button" className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><Globe className="w-5 h-5" /></button>
                      </div>
                      <button 
                        type="submit"
                        disabled={isPosting || !postContent.trim()}
                        className="px-10 py-3 agro-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 flex items-center gap-3"
                      >
                        {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Broadcast to Hub
                      </button>
                   </div>
                </form>
              </div>

              {/* Forum Feed */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Contributions</h4>
                    <button onClick={boostDiscussion} className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors flex items-center gap-2">
                       <Zap className="w-3 h-3 fill-current" /> Pin Discussion (100 EAC)
                    </button>
                 </div>
                 {[
                   { author: "@Bantu_Steward", title: "Passing the Seed: Lineage-based Crop Rotation", tags: ["S-Thrust", "Heritage"], likes: 142, replies: 24, time: "2h ago" },
                   { author: "@SoilSage", title: "Treating Root Rot in Zone 4", tags: ["Pathology", "T-Thrust"], likes: 89, replies: 12, time: "5h ago" },
                 ].map((post, i) => (
                   <div key={i} className="glass-card p-6 rounded-3xl hover:bg-white/[0.04] transition-all border border-white/5 group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-emerald-500">
                               {post.author[1]}
                            </div>
                            <div>
                               <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">{post.title}</h4>
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Steward {post.author} • {post.time}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {post.tags.map(t => <span key={t} className="px-2 py-0.5 bg-white/5 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded border border-white/10">{t}</span>)}
                         </div>
                      </div>
                      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                         <div className="flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => onContribution('post', 'Engagement')}>
                            <Heart className="w-4 h-4" /> {post.likes}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
                            <MessageSquare className="w-4 h-4" /> {post.replies}
                         </div>
                         <button className="ml-auto text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Full Dossier <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Reputation Sidebar */}
            <div className="space-y-6">
               <div className="glass-card p-8 rounded-[40px] border-emerald-500/20 bg-emerald-500/5 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                       <Zap className="w-10 h-10 text-emerald-400" />
                    </div>
                    <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
                       <circle cx="48" cy="48" r="46" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                       <circle cx="48" cy="48" r="46" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={288} strokeDashoffset={288 - (288 * (user.wallet.lifetimeEarned % 500) / 500)} className="text-emerald-500 transition-all duration-1000" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{user.wallet.tier} Steward</h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">{2000 - user.wallet.lifetimeEarned} EAC to Next Rank</p>
                  </div>
                  <div className="w-full space-y-4 pt-4 border-t border-white/5">
                     <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Proof of Effort</span>
                        <span className="text-emerald-400 font-mono">{user.wallet.lifetimeEarned} EAC</span>
                     </div>
                     <button 
                      onClick={() => setActiveTab('report')}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                     >
                        Registry Performance Report
                     </button>
                  </div>
               </div>

               <div className="glass-card p-8 rounded-[40px] space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Top Skill Tags</h4>
                  <div className="space-y-4">
                     {Object.entries(user.skills).length > 0 ? Object.entries(user.skills).map(([skill, points]) => (
                       <div key={skill} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`w-2 h-2 rounded-full ${(points as number) >= 100 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-400'}`}></div>
                             <span className="text-xs font-bold text-slate-300">{skill}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600">{(points as number) >= 100 ? 'SKILLED' : (points as number) >= 20 ? 'APPRENTICE' : 'SEED'}</span>
                       </div>
                     )) : (
                       <p className="text-[10px] text-slate-500 italic text-center">Complete modules to earn skills.</p>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lms' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="glass-card rounded-[40px] p-12 bg-indigo-600/5 border-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <Library className="w-64 h-64 text-indigo-400" />
              </div>
              <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl flex items-center justify-center border border-indigo-500/30 shrink-0 shadow-2xl">
                 <GraduationCap className="w-10 h-10 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-2">
                 <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Steward Education Hub</h2>
                 <p className="text-slate-400 text-lg">Pass modules and quizzes to earn EAC and industry-recognized skill tags.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Precision Drip Irrigation", category: "Irrigation Tech", eac: 100, pts: 20 },
                { title: "Bantu Clan Agronomy", category: "Sociological", eac: 100, pts: 20 },
                { title: "Carbon-Neutral Composting", category: "Precision Farming", eac: 100, pts: 20 },
                { title: "Industry 4.0 Agro-Logistics", category: "Industry", eac: 120, pts: 25 },
              ].map((m, i) => (
                <div key={i} className="glass-card p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer flex flex-col h-full active:scale-95">
                   <div className="flex justify-between items-start mb-8">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">{m.category}</span>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-emerald-400 uppercase">+{m.eac} EAC</p>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">+{m.pts} SKILL PTS</p>
                      </div>
                   </div>
                   <h4 className="text-xl font-black text-white mb-8 leading-tight flex-1">{m.title}</h4>
                   <button 
                    onClick={() => onContribution('module', m.category)}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                   >
                      <PlayCircle className="w-4 h-4" /> Start Module
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
           <div className="lg:col-span-1 space-y-4">
              <div className="glass-card p-6 rounded-[32px] space-y-2">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Manual Index</h4>
                 {CHAPTERS.map(ch => (
                   <button 
                    key={ch.id}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all ${selectedChapter.id === ch.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                   >
                      Chapter {ch.id}: {ch.title}
                   </button>
                 ))}
              </div>
              <div className="glass-card p-6 rounded-[32px] bg-blue-600/5 border-blue-500/20">
                 <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Registry Mandate</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed uppercase">The SEHTI Manual is the governing constitution for all Steward Nodes on the EOS network.</p>
              </div>
           </div>

           <div className="lg:col-span-3 glass-card p-12 rounded-[48px] bg-white/[0.01] border-white/5 prose prose-invert max-w-none">
              <div className="flex items-center gap-4 mb-8">
                 <BookOpenIcon className="w-8 h-8 text-emerald-400" />
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter m-0">{selectedChapter.title}</h2>
              </div>
              <div className="text-slate-300 leading-loose text-lg whitespace-pre-line bg-black/40 p-10 rounded-[32px] border border-white/5 italic">
                 {selectedChapter.content}
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600">
                 <span>REVISION: v3.2.1-STABLE</span>
                 <span>SIGNED BY: GOVERNANCE_ORACLE_01</span>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-8 animate-in zoom-in duration-500">
           <div className="glass-card p-12 rounded-[48px] bg-emerald-600/5 border-emerald-500/20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <BarChart4 className="w-80 h-80 text-emerald-400" />
              </div>
              
              <div className="w-48 h-48 agro-gradient rounded-full flex flex-col items-center justify-center shadow-2xl ring-[12px] ring-white/5 group">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Global Rank</p>
                 <h4 className="text-5xl font-black text-white">#842</h4>
                 <div className="mt-2 flex gap-1">
                    {[0,1,2].map(i => <div key={i} className="w-1 h-3 bg-white/40 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}}></div>)}
                 </div>
              </div>

              <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                 <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Registry Performance <span className="text-emerald-400">Report</span></h2>
                 <p className="text-slate-400 text-lg leading-relaxed italic">"Your node is currently operating at 92% efficiency compared to the regional benchmark for {user.location}."</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                    <div className="p-4 glass-card rounded-2xl border-white/5">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Audit Passes</p>
                       <p className="text-xl font-bold text-white">12/12</p>
                    </div>
                    <div className="p-4 glass-card rounded-2xl border-white/5">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Vouch Score</p>
                       <p className="text-xl font-bold text-emerald-400">4.8/5</p>
                    </div>
                    <div className="p-4 glass-card rounded-2xl border-white/5">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Reaction Yield</p>
                       <p className="text-xl font-bold text-blue-400">142.5 EAC</p>
                    </div>
                    <div className="p-4 glass-card rounded-2xl border-white/5">
                       <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Thrust Level</p>
                       <p className="text-xl font-bold text-amber-500">Tier 2</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-[40px] space-y-6">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Reputation Momentum
                 </h4>
                 <div className="h-48 flex items-end justify-between gap-2 px-4">
                    {[30, 45, 25, 60, 85, 40, 75, 90, 55, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/10 rounded-t-lg relative group overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/40 transition-all duration-1000 group-hover:bg-emerald-400" style={{height: `${h}%`}}></div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="glass-card p-10 rounded-[40px] bg-blue-600/5 border-blue-500/20 flex flex-col justify-center items-center text-center space-y-6">
                 <ShieldCheck className="w-16 h-16 text-blue-400" />
                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Verified Social Presence</h4>
                 <p className="text-slate-400 text-sm max-w-xs leading-relaxed font-medium">Your contributions to the Heritage Hub have been cross-verified by 24 independent validator nodes.</p>
                 <button className="px-10 py-4 agro-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">Download Official PDF</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Community;
