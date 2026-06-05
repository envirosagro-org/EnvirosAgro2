import * as React from 'react';
const { useState, useEffect } = React;
import { 
  CheckCircle2, Plus, Trash2, Clock, RefreshCw, Loader2, 
  AlertTriangle, CheckSquare, Shield, Info, ExternalLink, ListTodo, X, ArrowLeft, ArrowRight, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  listTasks, 
  createTask, 
  updateTaskStatus, 
  deleteTask, 
  Task as GTask 
} from '../services/googleTasksService';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  getDriveAccessToken, 
  initDriveAuth 
} from '../services/googleDriveService';
import { Task as KTask } from '../types';

interface GoogleTasksViewProps {
  user: any;
  tasks?: KTask[];
  onSaveTask?: (task: any) => void;
  onEarnEAC?: (amount: number, reason: string) => void;
  onSpendEAC?: (amount: number, reason: string) => Promise<boolean>;
}

export default function GoogleTasksView({ user, tasks = [], onSaveTask, onEarnEAC, onSpendEAC }: GoogleTasksViewProps) {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Google Tasks State
  const [gTasks, setGTasks] = useState<GTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);

  // Task to delete confirm state
  const [taskToDelete, setTaskToDelete] = useState<GTask | null>(null);

  // Authenticate monitor
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, activeToken) => {
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

  // Fetch Google Tasks
  const loadGoogleTasks = async () => {
    setLoading(true);
    try {
      const list = await listTasks();
      setGTasks(list);
    } catch (err: any) {
      console.error('Failed to load Google tasks:', err);
      toast.error(err.message || 'Error occurred while loading task shards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      loadGoogleTasks();
    }
  }, [token, needsAuth]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Google Tasks Session established successfully.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Authentication dropped or blocked. Verify your browser popup permissions.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error('Task title must be supplied.');
      return;
    }

    setIsCreating(true);
    try {
      const dueIso = newTaskDueDate ? new Date(newTaskDueDate).toISOString() : undefined;
      const created = await createTask(newTaskTitle, newTaskNotes || undefined, dueIso);
      setGTasks(prev => [created, ...prev]);
      setNewTaskTitle('');
      setNewTaskNotes('');
      setNewTaskDueDate('');
      setShowAddForm(false);
      toast.success('Task created successfully on your Google Tasks.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to initialize task shard.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (task: GTask) => {
    const nextStatus = task.status === 'completed' ? 'needsAction' : 'completed';
    try {
      // Optimistic update
      setGTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
      await updateTaskStatus(task.id, nextStatus);
      toast.success(`Task status updated: ${nextStatus === 'completed' ? 'Completed' : 'Active'}`);
    } catch (err: any) {
      // Revert status
      setGTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
      toast.error('Failed to update Google Task status.');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      setGTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      await deleteTask(taskToDelete.id);
      toast.success('Task shard deleted from Google Tasks.');
    } catch (err: any) {
      toast.error('Failed to discard task. Re-fetching list.');
      loadGoogleTasks();
    } finally {
      setTaskToDelete(null);
    }
  };

  // Bidirectional Synchronization Model between Local Kanban vs Google Tasks
  const handleBidirectionalSync = async () => {
    if (onSpendEAC) {
      const authorized = await onSpendEAC(5, 'KANBAN_GOOGLE_TASKS_SYNC');
      if (!authorized) return;
    }

    setSyncingAll(true);
    let updatedCount = 0;
    let addedToGoogleCount = 0;
    let addedToKanbanCount = 0;

    try {
      // 1. Fetch latest Google Tasks
      const latestGTasks = await listTasks();
      setGTasks(latestGTasks);

      // 2. Align local Kanban structures
      if (onSaveTask && tasks) {
        // Find tasks in Kanban but missing from Google Tasks (compare by exact title match)
        for (const localTask of tasks) {
          const matchingGTask = latestGTasks.find(
            gt => gt.title.toLowerCase() === localTask.title.toLowerCase()
          );

          if (!matchingGTask) {
            // Push to Google Tasks
            try {
              await createTask(
                localTask.title,
                `EnvirosAgro Local Shard. Thrust: ${localTask.thrust}. Priority: ${localTask.priority}`,
                localTask.status === 'Completed' ? new Date().toISOString() : undefined
              );
              addedToGoogleCount++;
            } catch (err) {
              console.warn('Sync singular push failed:', err);
            }
          } else {
            // Update statuses if mismatched
            const localIsCompleted = localTask.status === 'Completed';
            const googleIsCompleted = matchingGTask.status === 'completed';

            if (localIsCompleted !== googleIsCompleted) {
              if (googleIsCompleted) {
                // If completed on Google, mark completed locally
                onSaveTask({ ...localTask, status: 'Completed' });
                updatedCount++;
              } else {
                // If active on Google, set to Process/Audit or Inception locally
                onSaveTask({ ...localTask, status: 'Processing' });
                updatedCount++;
              }
            }
          }
        }

        // Find tasks in Google Tasks but missing from local Kanban
        for (const gt of latestGTasks) {
          const matchingLocalTask = tasks.find(
            lt => lt.title.toLowerCase() === gt.title.toLowerCase()
          );

          if (!matchingLocalTask) {
            // Pull from Google Tasks to local Kanban
            const newLocalTask: Partial<KTask> = {
              id: `TSK-${Math.floor(Math.random() * 9000 + 1000)}`,
              title: gt.title,
              thrust: 'Genesis',
              priority: 'Medium',
              status: gt.status === 'completed' ? 'Completed' : 'Inception',
              description: gt.notes || 'Imported via Google Tasks synchronization.',
              timestamp: new Date().toISOString(),
              stewardEsin: user?.esin || 'ESIN-ROOT'
            };
            onSaveTask(newLocalTask);
            addedToKanbanCount++;
          }
        }
      }

      // Re-fetch final
      const list = await listTasks();
      setGTasks(list);

      toast.success(
        `Consensus Synchronized! Added to Google Tasks: ${addedToGoogleCount}. Imported to Kanban: ${addedToKanbanCount}. Mappings reconciled: ${updatedCount}.`
      );

      if (onEarnEAC && (addedToGoogleCount + addedToKanbanCount + updatedCount) > 0) {
        onEarnEAC(10, 'GOOGLE_TASKS_SYNCHRONICITY_BONUS');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Reconciliation cycle dropped.');
    } finally {
      setSyncingAll(false);
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      
      {/* HUD Header Block */}
      <div className="glass-card p-12 rounded-[56px] border border-blue-500/20 bg-blue-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <ListTodo className="w-96 h-96 text-blue-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-28 h-28 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] ring-[15px] ring-white/5 shrink-0">
               <ListTodo className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                 Google <span className="text-blue-400">Tasks</span> Bridge
               </h2>
               <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
                 Access cloud tasks from your Google Workspace and reconcile them with the local Lean Agronomic Kanban Matrix.
               </p>
            </div>
         </div>
         <div className="shrink-0 flex items-center gap-4 z-10">
           {token && !needsAuth && (
              <button 
                onClick={loadGoogleTasks} 
                disabled={loading}
                className="p-5 bg-white/5 hover:bg-white/15 text-white rounded-full border border-white/10 active:scale-95 transition-all shadow-xl"
                title="Refresh Shard"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
              </button>
           )}
           <button 
             onClick={token && !needsAuth ? googleDriveSignOut : handleLogin}
             disabled={isSigningIn}
             className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 border-2 ${token && !needsAuth ? 'bg-white/5 hover:bg-rose-900 border-white/10 text-slate-300' : 'bg-blue-600 hover:bg-blue-500 border-white/10 text-white'}`}
           >
              {token && !needsAuth ? 'Sign Out' : 'Sign in with Google'}
           </button>
         </div>
      </div>

      {needsAuth ? (
        <div className="glass-card p-16 rounded-[48px] border border-white/5 bg-black/40 text-center space-y-8 max-w-2xl mx-auto my-20">
           <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl"><Shield size={40} className="text-blue-400" /></div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Authentication Standby</h3>
              <p className="text-slate-400 italic text-base leading-relaxed">
                Connect your Google Workspace in order to browse, modify, and reconcile Google Tasks alongside the internal EnvirosAgro board. This app accesses cloud task objects with permission from current users.
              </p>
           </div>
           <button 
             onClick={handleLogin}
             disabled={isSigningIn}
             className="px-16 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto border-2 border-white/10"
           >
             {isSigningIn ? <Loader2 className="animate-spin" size={18} /> : null}
             Authorize Google Tasks Bridge
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Google Tasks Ledger */}
          <div className="lg:col-span-8 space-y-8">
             <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 shadow-3xl space-y-8">
                <div className="flex justify-between items-center px-4">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tasks <span className="text-blue-400">List</span></h3>
                   <button 
                     onClick={() => setShowAddForm(p => !p)} 
                     className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all"
                   >
                     {showAddForm ? <X size={14} /> : <Plus size={14} />} {showAddForm ? 'Cancel' : 'New Task'}
                   </button>
                </div>

                <AnimatePresence>
                  {showAddForm && (
                     <motion.form 
                       onSubmit={handleCreateTask}
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="p-8 bg-black/80 rounded-3xl border border-blue-500/20 space-y-6 overflow-hidden"
                     >
                       <div className="space-y-2">
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Task Title</label>
                          <input 
                            placeholder="e.g. Conduct Soil Sample zone 3" 
                            value={newTaskTitle} 
                            onChange={e => setNewTaskTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-700 outline-none focus:border-blue-500 transition-all font-medium"
                          />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Description / Notes</label>
                          <textarea 
                            placeholder="Add task notes or parameters..." 
                            rows={3}
                            value={newTaskNotes} 
                            onChange={e => setNewTaskNotes(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-700 outline-none focus:border-blue-500 transition-all font-medium resize-none"
                          />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Due Date</label>
                             <input 
                               type="date"
                               value={newTaskDueDate} 
                               onChange={e => setNewTaskDueDate(e.target.value)}
                               className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-all font-medium"
                             />
                          </div>
                          <div className="flex items-end">
                             <button 
                               type="submit" 
                               disabled={isCreating}
                               className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all border border-white/10"
                             >
                               {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                               Add Google Task
                             </button>
                          </div>
                       </div>
                     </motion.form>
                  )}
                </AnimatePresence>

                {loading ? (
                   <div className="py-24 text-center space-y-6">
                      <Loader2 size={48} className="text-blue-500 animate-spin mx-auto" />
                      <p className="text-[11px] font-black uppercase text-slate-600 tracking-widest">Accessing cloud resources...</p>
                   </div>
                ) : gTasks.length === 0 ? (
                   <div className="py-24 text-center space-y-6 opacity-30">
                      <ListTodo size={64} className="text-slate-600 mx-auto animate-pulse" />
                      <p className="text-xs font-black uppercase text-slate-500 tracking-wider">No active Google Tasks found.</p>
                   </div>
                ) : (
                   <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                     {gTasks.map(task => (
                        <div key={task.id} className="p-6 bg-[#050706] rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all">
                           <div className="flex items-start gap-5">
                              <button 
                                onClick={() => handleToggleStatus(task)}
                                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all ${task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-inner' : 'border-slate-800 text-slate-800 hover:border-slate-600'}`}
                              >
                                 {task.status === 'completed' && <Check size={18} />}
                              </button>
                              <div className="space-y-1.5">
                                 <h4 className={`text-xl font-black uppercase tracking-tight italic transition-all ${task.status === 'completed' ? 'text-slate-600 line-through' : 'text-white'}`}>{task.title}</h4>
                                 {task.notes && <p className="text-xs text-slate-500 italic max-w-xl">{task.notes}</p>}
                                 {task.due && (
                                   <p className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                     <Clock size={10} /> DUE: {new Date(task.due).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                   </p>
                                 )}
                              </div>
                           </div>
                           <button 
                             onClick={() => setTaskToDelete(task)}
                             className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-600 hover:text-rose-500 hover:border-rose-500/30 opacity-0 group-hover:opacity-100 transition-all shadow"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                     ))}
                   </div>
                )}
             </div>
          </div>

          {/* RIGHT: Synchronization Control HUD */}
          <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-10 rounded-[48px] border border-white/5 bg-black/40 shadow-3xl space-y-8">
                <div className="space-y-2">
                   <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl w-fit text-blue-400"><Shield size={24} /></div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-4">Task Sync Consensus</h3>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">RECONCILIATION ENGINE v1.1</p>
                </div>

                <div className="p-6 bg-[#050706] rounded-3xl border border-white/5 space-y-4">
                   <p className="text-xs text-slate-400 italic">"Ensure perfect synchronicity between Google Tasks and local physical industrial nodes in Kenya."</p>
                   
                   <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                         <span>Google Shards</span>
                         <span className="font-mono text-white">{gTasks.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                         <span>Local Kanban</span>
                         <span className="font-mono text-white">{tasks.length}</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handleBidirectionalSync}
                  disabled={syncingAll || loading}
                  className="w-full py-6 agro-gradient rounded-full text-white font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-2 border-white/10 ring-8 ring-white/5 disabled:opacity-30"
                >
                   {syncingAll ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                   {syncingAll ? 'RECONCILING...' : 'SYNC WITH KANBAN'}
                </button>
             </div>
          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
         {taskToDelete && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 backdrop-blur-md">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="glass-card max-w-lg w-full p-10 rounded-[48px] border-rose-500/20 bg-black shadow-3xl text-center space-y-8"
               >
                  <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto text-rose-500"><AlertTriangle size={36} /></div>
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Discard Task Shard?</h3>
                     <p className="text-slate-400 italic text-sm">
                        Are you sure you want to delete task <strong className="text-white">"{taskToDelete.title}"</strong> from Google Tasks? This will permanently modify your Google Workspace data.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <button 
                       onClick={() => setTaskToDelete(null)}
                       className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold uppercase rounded-full text-xs tracking-widest active:scale-95 transition-all"
                     >
                        Cancel
                     </button>
                     <button 
                       onClick={handleDeleteTask}
                       className="flex-1 py-5 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase rounded-full text-xs tracking-widest active:scale-95 transition-all shadow-xl"
                     >
                        Discard Shard
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
