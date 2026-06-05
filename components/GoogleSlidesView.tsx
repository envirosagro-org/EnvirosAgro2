import * as React from 'react';
const { useState, useEffect } = React;
import { 
  Plus, RefreshCw, Loader2, Shield, Info, ExternalLink, CalendarDays, Trash2, Search, ArrowUpRight, Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  initDriveAuth,
  listDocumentsByType,
  createDocumentByType,
  trashDriveFile,
  DriveFile
} from '../services/googleDriveService';

export default function GoogleSlidesView() {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Slides state
  const [slides, setSlides] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Form State
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, activeToken) => {
        setToken(activeToken);
        setNeedsAuth(false);
      },
      () => {
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const fetchSlides = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const list = await listDocumentsByType('presentation');
      setSlides(list);
    } catch (err: any) {
      toast.error('Failed to load Google Slides: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      fetchSlides();
    }
  }, [token, needsAuth]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Authorized Slides workspace successfully.');
      }
    } catch (e) {
      toast.error('Authentication rejected or popup blocked.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Presentation Title is required.');
      return;
    }
    setIsCreating(true);
    try {
      const created = await createDocumentByType(newTitle.trim(), 'presentation');
      toast.success(`Google Slide "${created.name}" created successfully!`);
      setNewTitle('');
      setShowForm(false);
      fetchSlides(); // reload list
    } catch (err: any) {
      toast.error('Failed to create Google Slide: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSlide = async (id: string, name: string) => {
    const confirmed = window.confirm(`Trash "${name}" presentation from Google Drive?`);
    if (!confirmed) return;

    try {
      await trashDriveFile(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      toast.success(`"${name}" moved to trash.`);
    } catch (e) {
      toast.error('Discard request rejected.');
    }
  };

  const filteredSlides = slides.filter(slide => 
    slide.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto font-sans font-sans">
      
      {/* HUD Header Block */}
      <div className="glass-card p-12 rounded-[56px] border border-amber-500/20 bg-amber-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Presentation className="w-96 h-96 text-amber-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-28 h-28 bg-amber-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.4)] ring-[15px] ring-white/5 shrink-0">
               <Presentation className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                 Google <span className="text-amber-400">Slides</span> Deck
               </h2>
               <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
                 Publish agricultural investor pitch decks, farm blueprints, and seasonal project review slides directly to your Google presentations ledger.
               </p>
            </div>
         </div>
         <div className="shrink-0 flex items-center gap-4 z-10">
           {token && !needsAuth && (
              <button 
                onClick={fetchSlides} 
                disabled={loading}
                className="p-5 bg-white/5 hover:bg-white/15 text-white rounded-full border border-white/10 active:scale-95 transition-all shadow-xl"
                title="Refresh presentation catalog"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
              </button>
           )}
           <button 
             onClick={token && !needsAuth ? googleDriveSignOut : handleLogin}
             disabled={isSigningIn}
             className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 border-2 ${token && !needsAuth ? 'bg-white/5 hover:bg-rose-900 border-white/10 text-slate-300' : 'bg-amber-600 hover:bg-amber-500 border-white/10 text-white'}`}
           >
              {token && !needsAuth ? 'Sign Out' : 'Sign in with Google'}
           </button>
         </div>
      </div>

      {needsAuth ? (
        <div className="glass-card p-16 rounded-[48px] border border-white/5 bg-black/40 text-center space-y-8 max-w-2xl mx-auto my-20">
           <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl"><Shield size={40} className="text-amber-400" /></div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Authorized Presentations</h3>
              <p className="text-slate-400 italic text-base leading-relaxed">
                Connect your account to map, schedule, and compile beautiful cooperative slide decks that highlight seasonal milestones and tech improvements.
              </p>
           </div>
           <button 
             onClick={handleLogin}
             disabled={isSigningIn}
             className="px-16 py-6 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto border-2 border-white/10"
           >
             {isSigningIn ? <Loader2 className="animate-spin" size={18} /> : null}
             Authorize Google Slides
           </button>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Quick Creator Box */}
          <div className="max-w-3xl mx-auto relative z-10">
             <div className="glass-card p-8 rounded-[36px] border border-white/5 bg-[#050706]">
                <button 
                  onClick={() => setShowForm(p => !p)}
                  className="w-full flex justify-between items-center text-sm font-black text-white uppercase italic"
                >
                   <span>Create New Presentation Shard</span>
                   <Plus size={18} className={`text-amber-400 transition-transform ${showForm ? 'rotate-45' : ''}`} />
                </button>

                <AnimatePresence>
                   {showForm && (
                      <motion.form 
                        onSubmit={handleCreateSlide}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 mt-6 pt-6 border-t border-white/5 overflow-hidden"
                      >
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Presentation Title</label>
                         <div className="flex gap-4">
                            <input 
                              placeholder="e.g. Cooperative Q4 Agri-expansion and EAC Stake Model" 
                              value={newTitle} 
                              onChange={e => setNewTitle(e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-amber-500 transition-all font-medium"
                            />
                            <button 
                              type="submit" 
                              disabled={isCreating}
                              className="px-8 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-xl disabled:opacity-45"
                            >
                               {isCreating ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                               Create Slide
                            </button>
                         </div>
                      </motion.form>
                   )}
                </AnimatePresence>
             </div>
          </div>

          {/* List and Grid display */}
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Your <span className="text-amber-400">Google Slides</span></h3>
                <div className="relative w-full md:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                   <input 
                     placeholder="Search presentations..." 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-white text-xs outline-none focus:border-amber-500 transition-all placeholder-slate-700 font-sans"
                   />
                </div>
             </div>

             {loading ? (
                <div className="py-24 text-center space-y-6">
                   <Loader2 size={48} className="text-amber-500 animate-spin mx-auto" />
                   <p className="text-[11px] font-black uppercase text-slate-600 tracking-widest">Scanning cloud presentation registries...</p>
                </div>
             ) : filteredSlides.length === 0 ? (
                <div className="py-24 text-center opacity-30 space-y-6">
                   <Presentation size={64} className="text-slate-600 mx-auto animate-pulse" />
                   <p className="text-xs font-black uppercase text-slate-500 tracking-wider">No Google presentations match query.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredSlides.map(slide => (
                      <div key={slide.id} className="p-8 bg-[#050706] rounded-3xl border border-white/5 flex flex-col justify-between min-h-[200px] group hover:border-amber-500/20 transition-all">
                         <div className="space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Presentation size={20} /></div>
                               <button 
                                 onClick={() => handleDeleteSlide(slide.id, slide.name)}
                                 className="p-2.5 bg-white/5 text-slate-600 hover:text-rose-400 hover:border-rose-400/20 border border-transparent hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                               >
                                  <Trash2 size={12} />
                               </button>
                            </div>
                            <h4 className="text-lg font-black text-white uppercase italic tracking-tight line-clamp-2 leading-tight">{slide.name}</h4>
                         </div>

                         <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-6">
                            <span className="text-[9px] font-mono text-slate-600 font-bold uppercase">
                               Created {slide.createdTime ? new Date(slide.createdTime).toLocaleDateString() : 'N/A'}
                            </span>
                            {slide.webViewLink && (
                               <a 
                                 href={slide.webViewLink} 
                                 target="_blank" 
                                 rel="noreferrer" 
                                 className="px-5 py-2.5 bg-white/5 hover:bg-amber-600 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow active:scale-95"
                               >
                                  Open Slide
                                  <ArrowUpRight size={11} />
                               </a>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             )}
          </div>

        </div>
      )}

    </div>
  );
}
