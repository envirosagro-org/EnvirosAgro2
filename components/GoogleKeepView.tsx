import * as React from 'react';
const { useState, useEffect } = React;
import { 
  Plus as PlusIcon, 
  Trash2 as TrashIcon, 
  Clock as ClockIcon, 
  RefreshCw as RefreshIcon, 
  Loader2 as LoaderIcon, 
  Star as StarIcon, 
  Search as SearchIcon, 
  FileText as FileIcon,
  BookOpen,
  CornerDownRight,
  Sparkles,
  Pin,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  getDriveAccessToken, 
  initDriveAuth 
} from '../services/googleDriveService';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  timestamp: string;
  pinned: boolean;
}

const NOTE_COLORS = [
  { name: 'Default', bg: 'bg-black/60', border: 'border-white/5', text: 'text-white' },
  { name: 'Emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  { name: 'Blue', bg: 'bg-blue-500/15', border: 'border-blue-500/20', text: 'text-blue-400' },
  { name: 'Amber', bg: 'bg-amber-500/15', border: 'border-amber-500/20', text: 'text-amber-400' },
  { name: 'Indigo', bg: 'bg-indigo-500/15', border: 'border-indigo-500/20', text: 'text-indigo-400' },
];

export default function GoogleKeepView() {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Note Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Search notes
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Sync / load helper from Google Drive folder named EnvirosAgro-Keep
  const loadNotesFromDrive = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Find or list keeping notes matching name filter
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='envirosagro_keep_notes.json'&fields=files(id, name)&spaces=drive`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.files && data.files.length > 0) {
        // Load notes file content
        const fileId = data.files[0].id;
        const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const parsedNotes = await fileRes.json();
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        }
      } else {
        // If file doesn't exist, seed some initial files
        const initialNotes: Note[] = [
          {
            id: '1',
            title: 'Long Rain Planting Parameters',
            content: 'Nursery layout: 120sqm plot sizes. Soil pH Target: 6.2 - 6.8 with bio-fertilizer additive. Sowing density should not drift beyond 0.85.',
            color: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400',
            timestamp: new Date().toISOString(),
            pinned: true
          }
        ];
        setNotes(initialNotes);
      }
    } catch (err) {
      console.warn("Drive notebook loader inactive. Using local state.");
      // Fallback to localStorage if Drive API throws some issue
      const cached = localStorage.getItem('agro_keep_notes');
      if (cached) setNotes(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      loadNotesFromDrive();
    }
  }, [token, needsAuth]);

  const saveNotesToDrive = async (updatedNotes: Note[]) => {
    localStorage.setItem('agro_keep_notes', JSON.stringify(updatedNotes));
    if (!token) return;
    
    try {
      // Look for the file
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='envirosagro_keep_notes.json' and trashed=false&fields=files(id, name)`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const searchData = await searchRes.json();
      
      const fileContent = JSON.stringify(updatedNotes);
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;
      const metadata = {
        name: 'envirosagro_keep_notes.json',
        mimeType: 'application/json'
      };

      if (searchData.files && searchData.files.length > 0) {
        // Update existing file
        const fileId = searchData.files[0].id;
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: fileContent
        });
      } else {
        // Create new file
        const multipartBody = 
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          closeDelimiter;

        await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`
          },
          body: multipartBody
        });
      }
    } catch (e) {
      console.warn("Failed to synchronize note to Google Drive backend:", e);
    }
  };

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Authorized keeping shards workspace successfully.');
      }
    } catch (e) {
      toast.error('Authentication rejected or popup blocked.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 9),
      title: title || 'Untitled Note',
      content: content || 'No content.',
      color: `${selectedColor.bg} ${selectedColor.border} ${selectedColor.text}`,
      timestamp: new Date().toISOString(),
      pinned: isPinned
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    setTitle('');
    setContent('');
    setIsPinned(false);
    setSelectedColor(NOTE_COLORS[0]);
    toast.success('Note shard dispatched successfully.');
    
    await saveNotesToDrive(updated);
  };

  const handleDeleteNote = async (id: string) => {
    const confirmed = window.confirm('Discard this note shard permanently from workspace?');
    if (!confirmed) return;

    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    toast.success('Note shard discarded.');
    await saveNotesToDrive(updated);
  };

  const handleTogglePin = async (id: string) => {
    const updated = notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    setNotes(updated);
    await saveNotesToDrive(updated);
  };

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      
      {/* Header Block HUD */}
      <div className="glass-card p-12 rounded-[56px] border border-amber-500/20 bg-amber-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <Sparkles className="w-96 h-96 text-amber-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row font-sans">
            <div className="w-28 h-28 bg-amber-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.4)] ring-[15px] ring-white/5 shrink-0">
               <Sparkles className="w-14 h-14 text-white animate-pulse" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                 Google <span className="text-amber-400">Keep</span> Shards
               </h2>
               <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
                 Draft notes, farm memos, and seed planting instructions securely synchronized to JSON documents in your Google Drive storage.
               </p>
            </div>
         </div>
         <div className="shrink-0 flex items-center gap-4 z-10">
           {token && !needsAuth && (
              <button 
                onClick={loadNotesFromDrive} 
                disabled={loading}
                className="p-5 bg-white/5 hover:bg-white/15 text-white rounded-full border border-white/10 active:scale-95 transition-all shadow-xl"
                title="Refresh Notebook"
              >
                {loading ? <LoaderIcon size={24} className="animate-spin" /> : <RefreshIcon size={24} />}
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
        <div className="glass-card p-16 rounded-[48px] border border-white/5 bg-black/40 text-center space-y-8 max-w-2xl mx-auto my-20 font-sans">
           <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl"><Shield size={40} className="text-amber-400" /></div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Authorized Notepad</h3>
              <p className="text-slate-400 italic text-base leading-relaxed">
                Unlock the Keep Workspace. Synchronize thoughts, blueprints, and sensor thresholds directly to a persistent json file on your Google Drive.
              </p>
           </div>
           <button 
             onClick={handleLogin}
             disabled={isSigningIn}
             className="px-16 py-6 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto border-2 border-white/10"
           >
             {isSigningIn ? <LoaderIcon className="animate-spin" size={18} /> : null}
             Authorize Google Notebook
           </button>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Note Input Pad */}
          <div className="max-w-3xl mx-auto relative z-10 animate-in slide-in-from-top-6 duration-700">
             <form onSubmit={handleCreateNote} className="glass-card p-10 rounded-[44px] border border-white/5 bg-[#050706] shadow-3xl space-y-6">
                <div className="flex justify-between items-center">
                   <input 
                     placeholder="Write notes title..." 
                     value={title} 
                     onChange={e => setTitle(e.target.value)}
                     className="bg-transparent text-white font-black uppercase text-xl placeholder-slate-700 border-none outline-none w-full"
                   />
                   <button 
                     type="button" 
                     onClick={() => setIsPinned(p => !p)}
                     className={`p-3 rounded-full border transition-all ${isPinned ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'border-white/5 text-slate-700 hover:text-white'}`}
                   >
                     <Pin size={18} />
                   </button>
                </div>
                
                <textarea 
                  placeholder="Record seed batches, sensor anomalies, or regional objectives..." 
                  rows={4}
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="bg-transparent text-slate-300 italic text-base placeholder-slate-705 border-none outline-none w-full resize-none font-medium"
                />

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-white/5">
                   {/* Color Shards selection */}
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Accent:</span>
                      <div className="flex gap-2">
                         {NOTE_COLORS.map(color => (
                            <button 
                              key={color.name}
                              type="button" 
                              onClick={() => setSelectedColor(color)}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${color.bg} ${color.border} ${selectedColor.name === color.name ? 'scale-125 ring-4 ring-amber-500/10' : 'hover:scale-110'}`}
                              title={color.name}
                            />
                         ))}
                      </div>
                   </div>

                   <button 
                     type="submit" 
                     className="px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-xl transition-all active:scale-95 border border-white/10 flex items-center gap-3"
                   >
                     <PlusIcon size={12} /> Dispatch Shard
                   </button>
                </div>
             </form>
          </div>

          {/* Searched & Listed Cards */}
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Your <span className="text-amber-400">Keep Shards</span></h3>
                <div className="relative w-full md:w-80">
                   <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                   <input 
                     placeholder="Search notes..." 
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-white text-xs outline-none focus:border-amber-500 transition-all placeholder-slate-700"
                   />
                </div>
             </div>

             {loading ? (
                <div className="py-24 text-center space-y-6">
                   <LoaderIcon size={48} className="text-amber-500 animate-spin mx-auto" />
                   <p className="text-[11px] font-black uppercase text-slate-600 tracking-widest">Hydrating notes from cloud folder...</p>
                </div>
             ) : filteredNotes.length === 0 ? (
                <div className="py-24 text-center opacity-35 space-y-6">
                   <FileIcon size={64} className="text-slate-600 mx-auto animate-pulse" />
                   <p className="text-xs font-black uppercase text-slate-500 tracking-wider">No keeping shards match query.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {filteredNotes.map(note => (
                      <div 
                        key={note.id}
                        className={`p-10 rounded-[36px] border shadow-2xl flex flex-col justify-between min-h-[220px] transition-all hover:scale-105 active:scale-95 group relative ${note.color}`}
                      >
                         <div className="space-y-4">
                            <div className="flex justify-between items-start">
                               <h4 className="text-xl font-black uppercase tracking-tight italic">{note.title}</h4>
                               <button 
                                 onClick={() => handleTogglePin(note.id)}
                                 className={`p-2 rounded-full border transition-all ${note.pinned ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 scale-110' : 'border-transparent text-slate-700 hover:text-white'}`}
                               >
                                 <Pin size={14} />
                               </button>
                            </div>
                            <p className="text-sm italic leading-relaxed whitespace-pre-wrap">{note.content}</p>
                         </div>

                         <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                            <span className="text-[8px] font-mono font-black tracking-widest text-slate-600">
                               {new Date(note.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-2.5 bg-black/40 border border-white/10 text-slate-600 hover:text-rose-400 rounded-xl transition-all shadow-md group-hover:opacity-100 opacity-0"
                            >
                              <TrashIcon size={12} />
                            </button>
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
