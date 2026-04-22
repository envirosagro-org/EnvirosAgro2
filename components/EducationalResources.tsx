import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Video, FileText, ChevronRight, PlayCircle, 
  ExternalLink, GraduationCap, Link as LinkIcon, Calendar, 
  Mic, MessageSquare, Award, CheckCircle2, Volume2, 
  VolumeX, RefreshCw, Radio, ShieldCheck, Loader2,
  Zap, Globe, Target, Cpu, Binary, Search,
  Trophy, Star, History, ArrowRight, Share2,
  Lock, Beaker, Library, Download
} from 'lucide-react';
import { User, ViewState } from '../types';
import { SectionTabs } from './SectionTabs';
import { ShareButton } from './ShareButton';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide';
  category: 'sustainable_ag' | 'blockchain' | 'platform_usage';
  url?: string;
  duration?: string;
  readTime?: string;
}

const RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Regenerative Agriculture 101', description: 'Core principles of soil restoration and biodiversity.', type: 'article', category: 'sustainable_ag', readTime: '5m' },
  { id: 'res-2', title: 'Blockchain for Traceability', description: 'Understanding the cryptographic anchor in supply chains.', type: 'video', category: 'blockchain', duration: '12:30' },
  { id: 'res-3', title: 'EAC Minting Protocols', description: 'Step-by-step guide to verifying environmental offsets.', type: 'guide', category: 'platform_usage', readTime: '10m' },
];

const LEVELS = [
  { id: 'sehti-primary', title: 'SEHTI Primary', description: 'Community Governance & Social Agriculture', icon: Library, color: 'text-emerald-400' },
  { id: 'sehti-junior', title: 'SEHTI Junior', description: 'Environmental Stewardship & Nutrition', icon: Globe, color: 'text-indigo-400' },
  { id: 'sehti-senior', title: 'SEHTI Senior', description: 'Digital MRV & Precision Robotics', icon: Cpu, color: 'text-amber-400' },
  { id: 'sehti-pro', title: 'SEHTI Pro', description: 'Industrial Mesh & Carbon Markets', icon: Binary, color: 'text-rose-400' }
];

interface EducationalResourcesProps {
  user?: User;
  onNavigate: any;
  onUpdateUser?: (user: User) => void;
  onEmitSignal?: (signal: any) => void;
}

const EducationalResources: React.FC<EducationalResourcesProps> = ({ user, onNavigate, onUpdateUser, onEmitSignal }) => {
  const [activeTab, setActiveTab] = useState<'resources' | 'elearning' | 'tree' | 'industrial'>('resources');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sustainable_ag' | 'blockchain' | 'platform_usage'>('all');
  const [knowledgeProgress, setKnowledgeProgress] = useState(42);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const filteredResources = useMemo(() => 
    activeCategory === 'all' ? RESOURCES : RESOURCES.filter(r => r.category === activeCategory)
  , [activeCategory]);

  const handleRegister = () => {
    toast.success("Successfully registered for E-Learning Mesh!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 mx-auto px-2 md:px-4 w-full max-w-full text-left">
      <SEO title="Enviro-Knowledge Mesh" description="Agro Junior Education: Mastery of sustainable agriculture, blockchain, and industrial MRV through the SEHTI framework." />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
            Knowledge <span className="text-indigo-400">Mesh</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">SEHTI_Educational_System_v4.2</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <GraduationCap size={14} className="text-emerald-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">Study_Hours</p>
                 <p className="text-xs font-black text-white">142h</p>
              </div>
           </div>
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5 bg-white/5">
              <Trophy size={14} className="text-amber-400" />
              <div className="text-left font-mono">
                 <p className="text-[7px] text-slate-500 font-black uppercase">IQ_Resonance</p>
                 <p className="text-xs font-black text-white">88/100</p>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <SectionTabs 
            tabs={[
              { id: 'resources', label: 'Library', icon: Library },
              { id: 'elearning', label: 'E-Learning', icon: GraduationCap },
              { id: 'tree', label: 'Evo-Tree', icon: RefreshCw },
              { id: 'industrial', label: 'Industrial', icon: Binary }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
            variant="glass"
          />

          <AnimatePresence mode="wait">
            {activeTab === 'tree' && (
              <motion.div 
                key="tree"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-12 rounded-[48px] border border-emerald-500/20 bg-black/60 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center shadow-3xl text-center"
              >
                 <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <RefreshCw size={240} className="text-emerald-500 animate-spin-slow" />
                 </div>
                 
                 <div className="relative z-10 space-y-10">
                    <div className="w-48 h-48 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative mx-auto">
                       <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                       <div className="flex flex-col items-center">
                          <span className="text-6xl font-black text-white tracking-widest">{knowledgeProgress}</span>
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-2">Evolution_%</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tree of Knowledge Evolution</h3>
                       <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest max-w-sm mx-auto">Mastering the agricultural flow through sharded intelligence modules.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                       {LEVELS.map(level => (
                         <div key={level.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group cursor-pointer hover:bg-white/10 transition-all">
                            <level.icon size={20} className={`${level.color} mx-auto mb-2`} />
                            <p className="text-[8px] font-black text-white uppercase tracking-tighter mb-1">{level.title}</p>
                            <div className="h-1 bg-black rounded-full overflow-hidden">
                               <div className={`h-full ${level.color.replace('text-', 'bg-')}`} style={{ width: '40%' }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'resources' && (
              <motion.div 
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                   <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text" 
                        placeholder="PROBE_KNOWLEDGE_BASE..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      />
                   </div>
                   <div className="flex gap-2">
                      {['All', 'Video', 'Article'].map(type => (
                        <button key={type} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all shadow-inner">{type}</button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {filteredResources.map(res => (
                     <div key={res.id} className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 hover:bg-white/5 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                           {res.type === 'video' ? <Video size={60} /> : <FileText size={60} />}
                        </div>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                 {res.type === 'video' ? <Video size={18} /> : <FileText size={18} />}
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-white uppercase italic truncate max-w-[150px]">{res.title}</h4>
                                 <p className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">{res.category.replace('_', ' ')}</p>
                              </div>
                           </div>
                           <span className="text-[8px] font-mono text-slate-600">{res.readTime || res.duration}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed mb-6 italic">"{res.description}"</p>
                        <div className="flex gap-3">
                           <button className="flex-1 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2">COMMENCE_LECTURE <ArrowRight size={12} /></button>
                           <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Share2 size={16} /></button>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'elearning' && (
              <motion.div 
                key="elearning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-10 rounded-[40px] border border-emerald-500/20 bg-black/60 shadow-3xl text-center space-y-6">
                   <div className="w-20 h-20 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                      <GraduationCap size={40} className="text-emerald-400" />
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Join the Agro Junior E-Learning Portal</h3>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed italic">
                      "Access structured SEHTI-framed agricultural programs from Primary to Pro levels. Earn cryptographic recognized by the Industrial Mesh."
                   </p>
                   <button 
                     onClick={handleRegister}
                     className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[24px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                   >
                     REGISTER_FOR_PORTAL_V4
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {LEVELS.map(level => (
                     <div key={level.id} className="glass-card p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 transition-all group flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${level.color.replace('text-', 'bg-').replace('400', '500')}/10 ${level.color.replace('text-', 'border-').replace('400', '500')}/20 ${level.color}`}>
                           <level.icon size={26} />
                        </div>
                        <div className="flex-1 space-y-2">
                           <h4 className="text-sm font-black text-white uppercase italic tracking-widest">{level.title}</h4>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">"{level.description}"</p>
                           <div className="pt-2 flex items-center gap-2">
                              <Lock size={12} className="text-slate-700" />
                              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic">Awaiting_Prerequisites</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'industrial' && (
              <motion.div 
                key="industrial"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="glass-card p-10 rounded-[40px] border border-rose-500/20 bg-rose-500/5 shadow-3xl text-center space-y-6">
                   <div className="w-20 h-20 rounded-[28px] bg-rose-600/10 border border-rose-600/20 flex items-center justify-center mx-auto mb-4">
                      <Binary size={40} className="text-rose-400" />
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Industrial Readiness Protocol</h3>
                   <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed italic">
                      "Analyze hyper-complex agro-industrial datasets and contribute to the global mesh. Qualified stewards are anchored into the Worker Cloud for high-resonance missions."
                   </p>
                   <button className="px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-[24px] font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20">INITIATE_PRO_SIMULATION</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center gap-4 shadow-inner">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                         <Target size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Industry_IQ</p>
                         <p className="text-sm font-black text-white italic">42/100</p>
                      </div>
                   </div>
                   <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/5 flex items-center gap-4 shadow-inner">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                         <Beaker size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Lab_Resonance</p>
                         <p className="text-sm font-black text-white italic">LVL_02</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Analytics */}
        <div className="w-full lg:w-96 space-y-6 text-left">
           <div className="glass-card p-8 rounded-[40px] border border-white/10 bg-black/40 space-y-8 shadow-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                   <Star size={16} className="text-amber-400" /> Mastery_Stats
                </h3>
              </div>

              <div className="space-y-6">
                 {[
                   { label: 'Platform Knowledge', val: 65, color: 'bg-emerald-500' },
                   { label: 'Blockchain Wisdom', val: 32, color: 'bg-indigo-500' },
                   { label: 'Sustainable Art', val: 88, color: 'bg-amber-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500 px-1">
                         <span>{stat.label}</span>
                         <span className="text-white">{stat.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden shadow-inner border border-white/5">
                         <div className={`h-full ${stat.color}`} style={{ width: `${stat.val}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <History size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Recent Activity</span>
                 </div>
                 <div className="space-y-2 pl-6 border-l border-white/10">
                    <p className="text-[8px] text-slate-400 font-bold uppercase italic leading-none mb-1">2h ago</p>
                    <p className="text-[10px] text-white font-medium italic truncate">"Completed Introduction to Regen Ag"</p>
                 </div>
              </div>

              <button className="w-full py-4 bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-2xl text-[8px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                 DOWNLOAD_QUALIFICATIONS <Download size={14} className="group-hover:translate-y-1 transition-transform" />
              </button>
           </div>

           <div className="glass-card p-8 rounded-[40px] border border-emerald-500/20 bg-emerald-500/5 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                 <Radio size={22} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-black text-white uppercase italic leading-none mb-2">Live SEHTI Broadcast</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                 "Join the global mesh call at 14:00 UTC for a deep dive into hyper-precision soil sharding protocols."
              </p>
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all">JOIN_BROADCAST_SHARD</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalResources;
