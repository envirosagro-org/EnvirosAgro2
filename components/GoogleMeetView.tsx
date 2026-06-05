import * as React from 'react';
const { useState, useEffect } = React;
import { 
  Video, Clock, Plus, Trash2, MapPin, AlignLeft, RefreshCw, Loader2, 
  AlertTriangle, CheckSquare, Shield, Info, ExternalLink, CalendarDays, X, 
  Copy, Link, LayoutList, Check, VideoOff, Users, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  createMeetSpace, 
  MeetSpace 
} from '../services/googleMeetService';
import { 
  listCalendarEvents, 
  CalendarEvent 
} from '../services/googleCalendarService';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  initDriveAuth 
} from '../services/googleDriveService';

interface GoogleMeetViewProps {
  user: any;
}

interface SavedMeetSpace extends MeetSpace {
  purpose: string;
  createdAt: string;
}

export const GoogleMeetView: React.FC<GoogleMeetViewProps> = ({ user }) => {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Meet and Calendar States
  const [savedSpaces, setSavedSpaces] = useState<SavedMeetSpace[]>([]);
  const [calendarMeets, setCalendarMeets] = useState<CalendarEvent[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Creation State
  const [purpose, setPurpose] = useState('');
  const [accessType, setAccessType] = useState<'OPEN' | 'TRUSTED' | 'RESTRICTED'>('OPEN');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Deletion confirmations
  const [spaceToDelete, setSpaceToDelete] = useState<SavedMeetSpace | null>(null);

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

  // Fetch Saved Rooms and Calendar Events with Meet links
  const loadData = async () => {
    if (!token || needsAuth) return;
    setLoading(true);
    
    // Load local storage saved spaces
    try {
      const stored = localStorage.getItem('envirosagro_meet_spaces');
      if (stored) {
        setSavedSpaces(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse saved meet spaces:', e);
    }

    // Load active Meet sessions scheduled from Google Calendar
    try {
      const fetchedEvents = await listCalendarEvents(100);
      const filteredMeets = fetchedEvents.filter((event) => {
        // Look for Google Meet links in conferenceData, description, or location
        const hasMeetData = event.conferenceData?.entryPoints?.some(
          ep => ep.entryPointType === 'video' || ep.uri.includes('meet.google.com')
        );
        const hasMeetUrlInDescription = (event.description || '').includes('meet.google.com');
        const hasMeetUrlInLocation = (event.location || '').includes('meet.google.com');
        return hasMeetData || hasMeetUrlInDescription || hasMeetUrlInLocation;
      });
      setCalendarMeets(filteredMeets);
    } catch (err: any) {
      console.error('Failed to load Google Calendar meets:', err);
      toast.error('Could not sync upcoming scheduled Meets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      loadData();
    }
  }, [token, needsAuth]);

  // Handle Clipboard Copy
  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Meeting URL copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Google Meet API authorized successfully.');
      }
    } catch (error: any) {
      console.error('Auth Error:', error);
      toast.error('Authorization failed. Verify your popup settings.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleDriveSignOut();
      setToken(null);
      setNeedsAuth(true);
      setCalendarMeets([]);
      toast.info('Google Workspace session cleared.');
    } catch (error: any) {
      toast.error('Sign out failed: ' + error.message);
    }
  };

  // Instant Meet provisioning
  const handleCreateMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) {
      toast.error('Please specify the meeting goal or purpose.');
      return;
    }

    setIsCreating(true);
    try {
      const meet = await createMeetSpace(accessType);
      
      const newSpace: SavedMeetSpace = {
        name: meet.name,
        meetingUri: meet.meetingUri,
        meetingCode: meet.meetingCode,
        config: meet.config,
        purpose: purpose.trim(),
        createdAt: new Date().toLocaleString()
      };

      const updated = [newSpace, ...savedSpaces];
      setSavedSpaces(updated);
      localStorage.setItem('envirosagro_meet_spaces', JSON.stringify(updated));

      toast.success('Google Meet Space provisioned instantly!');
      setPurpose('');
      setShowCreateForm(false);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to provision meeting space: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSavedSpace = (spaceName: string) => {
    const updated = savedSpaces.filter(s => s.name !== spaceName);
    setSavedSpaces(updated);
    localStorage.setItem('envirosagro_meet_spaces', JSON.stringify(updated));
    setSpaceToDelete(null);
    toast.success('Local meeting bookmark deleted.');
  };

  // Preset quick triggers
  const handleLoadPreset = (presetPurpose: string, selectAccess: 'OPEN' | 'TRUSTED' | 'RESTRICTED') => {
    setShowCreateForm(true);
    setPurpose(presetPurpose);
    setAccessType(selectAccess);
  };

  // Helper format events
  const extractMeetLink = (event: CalendarEvent): string => {
    const epLink = event.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video' || ep.uri.includes('meet.google.com'))?.uri;
    if (epLink) return epLink;

    const descMatch = (event.description || '').match(/https:\/\/meet\.google\.com\/[a-z0-9-]+/i);
    if (descMatch) return descMatch[0];

    const locMatch = (event.location || '').match(/https:\/\/meet\.google\.com\/[a-z0-9-]+/i);
    if (locMatch) return locMatch[0];

    return '';
  };

  const formatEventTime = (event: CalendarEvent) => {
    try {
      const startStr = event.start.dateTime || event.start.date;
      if (!startStr) return '';
      const dateObj = new Date(startStr);
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div id="google_meet_root" className="min-h-screen bg-black/95 text-slate-100 p-4 sm:p-8 flex flex-col pt-12">
      {/* Visual backgrounds */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Hub Header */}
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <Video size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                Google Meet <span className="text-emerald-400">Shard.</span>
              </h2>
              <p className="text-slate-500 text-sm italic font-medium">"Instant multi-user diagnostic telepresence & quorum consensus video rooms."</p>
            </div>
          </div>
        </div>

        {!needsAuth && (
          <button 
            onClick={handleLogout}
            className="text-[10px] uppercase tracking-widest font-mono text-slate-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 bg-white/5 px-6 py-2.5 rounded-full transition-all"
          >
            Clear Session
          </button>
        )}
      </div>

      {/* Content Canvas */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        {needsAuth ? (
          /* AUTH SHEET */
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto w-full text-center space-y-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                <Video size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Authorize Google Meet</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect your Google Account to authorize Google Meet space creation APIs. Securely host instant sessions directly in the Registry workspace, with user permission.
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <button 
                  onClick={handleLogin}
                  disabled={isSigningIn}
                  className="gsi-material-button px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-45"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="animate-spin text-white w-4 h-4" />
                      <span>Validating Security Token...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Connect Google Meet API</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secure sandbox alert */}
              <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-3xl text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info size={14} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#f59e0b]">Integrators Notice</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  Google Meet API is now fully supported. Permissions are securely bound to your Google Workspace identity. Popup permissions must be granted to establish active sessions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE MEET HUB LAYOUT */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MEETING ROOMS LIST */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Action Row */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/5 rounded-3xl p-5 backdrop-blur-md animate-none">
                <div className="flex items-center gap-2 text-slate-400">
                  <Video className="text-emerald-400 w-5 h-5" />
                  <span className="text-xs font-mono uppercase tracking-widest font-bold">Direct Meeting Coordinator</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={loadData}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
                    title="Reload meeting statuses"
                  >
                    <RefreshCw size={15} className={loading ? "animate-spin text-emerald-400" : ""} />
                  </button>

                  <button 
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 rounded-2xl text-white font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                  >
                    <Plus size={14} />
                    <span>Create Instant Room</span>
                  </button>
                </div>
              </div>

              {/* Instant Presets */}
              <div className="space-y-2">
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">Rapid Telepresence Templates</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleLoadPreset('S-AGRO Soil Diagnostic Session', 'OPEN')}
                    className="p-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Users className="text-emerald-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Soil Diagnostics</p>
                    <p className="text-[11px] text-slate-500">Quick Meet for field lab experts (Open Access).</p>
                  </button>

                  <button 
                    onClick={() => handleLoadPreset('Multi-Sig Quorum Agreement Verification', 'TRUSTED')}
                    className="p-4 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Shield className="text-indigo-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Quorum Verification</p>
                    <p className="text-[11px] text-slate-500">Secure consensus with trusted domains.</p>
                  </button>

                  <button 
                    onClick={() => handleLoadPreset('Hardware Diagnostics & Sensor Calibrations', 'RESTRICTED')}
                    className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <LayoutList className="text-purple-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Sensor Diagnostics</p>
                    <p className="text-[11px] text-slate-500">Restricted diagnostic review panel.</p>
                  </button>
                </div>
              </div>

              {/* List of Instant Rooms */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Active & Bookmarked Meet Rooms
                  </p>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {savedSpaces.length} Active Rooms
                  </span>
                </div>

                {savedSpaces.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-1">
                    <VideoOff className="mx-auto text-slate-600 mb-2 w-7 h-7" />
                    <p className="font-mono text-xs">NO ACTIVE MEETING ROOMS DISPATCHED.</p>
                    <p className="text-[10px] text-slate-600">Provision your first instant room now or trigger a template.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 space-y-1">
                    {savedSpaces.map((space) => (
                      <div 
                        key={space.name}
                        className="py-4 flex gap-4 items-start group hover:bg-white/5 hover:px-3 rounded-2xl transition-all"
                      >
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1 shrink-0">
                          <Video size={16} />
                        </div>

                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight m-0 truncate">
                              {space.purpose}
                            </h4>
                            <span className="text-[8px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded uppercase font-semibold">
                              {space.config?.accessType || 'OPEN'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">
                              Code: {space.meetingCode}
                            </span>
                            <span className="text-[8px] font-mono text-slate-500">
                              Created {space.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <a 
                              href={space.meetingUri} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <span>Launch Meet Room</span>
                              <ArrowUpRight size={11} />
                            </a>

                            <button 
                              onClick={() => handleCopyLink(space.meetingUri, space.name)}
                              className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[9px] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {copiedId === space.name ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              <span>{copiedId === space.name ? 'Copied' : 'Copy Link'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="shrink-0 self-center">
                          <button 
                            onClick={() => setSpaceToDelete(space)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete Room Bookmark"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: SCHEDULING FORM + UPCOMING EVENTS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* INSTANT FORM DRAWER */}
              {showCreateForm && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Plus className="text-emerald-400 w-4 h-4" />
                      <h4 className="text-sm font-black text-white uppercase italic tracking-wider leading-none">Create Meet</h4>
                    </div>
                    <button 
                      onClick={() => setShowCreateForm(false)} 
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateMeet} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Meeting Objective/Purpose *</label>
                      <input 
                        type="text"
                        required
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g. Consensus validation, sensor audit"
                        className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Access Control Tier</label>
                      <select 
                        value={accessType}
                        onChange={(e) => setAccessType(e.target.value as any)}
                        className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-3 py-3 focus:outline-none transition-all font-mono text-slate-300"
                      >
                        <option value="OPEN">OPEN (Anyone can join directly)</option>
                        <option value="TRUSTED">TRUSTED (Domain/invited only)</option>
                        <option value="RESTRICTED">RESTRICTED (Explicit host approve)</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      disabled={isCreating}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-45"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="animate-spin text-white w-4 h-4" />
                          <span>Provisioning Meet...</span>
                        </>
                      ) : (
                        <>
                          <Video size={14} />
                          <span>Instantly Host Space</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* CALENDAR SYNCED UPCOMING MEET EVENTS */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <CalendarDays className="text-emerald-400 w-4.5 h-4.5" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none m-0">Scheduled Calendar Meets</h4>
                </div>

                {loading && calendarMeets.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <Loader2 className="animate-spin text-emerald-400 mx-auto w-6 h-6" />
                    <p className="text-slate-500 font-mono text-[10px]">SYNCING CALENDAR AGENDA...</p>
                  </div>
                ) : calendarMeets.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-1">
                    <Info className="mx-auto text-slate-600 mb-2 w-5 h-5" />
                    <p className="font-mono text-[10px]">NO SCHEDULE_MEETS DETECTED.</p>
                    <p className="text-[9px] text-slate-600">Events with a valid video conference description or location will sync here automatically.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {calendarMeets.map((event) => {
                      const meetUri = extractMeetLink(event);
                      return (
                        <div key={event.id} className="p-3.5 bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl space-y-2 transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <p className="text-xs font-bold text-white uppercase italic leading-tight truncate max-w-[160px]">
                                {event.summary}
                              </p>
                              <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                                {formatEventTime(event)}
                              </p>
                            </div>
                            {meetUri && (
                              <a 
                                href={meetUri} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
                                title="Join Google Meet Call"
                              >
                                <ArrowUpRight size={12} />
                              </a>
                            )}
                          </div>
                          
                          {event.description && (
                            <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* CONFIRM BOOKMARK DELETION MODAL */}
      <AnimatePresence>
        {spaceToDelete && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSpaceToDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-950 border border-red-500/20 rounded-[32px] p-8 max-w-md w-full relative z-10 shadow-2xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-400 border border-red-500/20">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-black text-white uppercase italic tracking-wider leading-none">Remove Room bookmark</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to delete the local bookmark for this meeting room? The original space remains active on Google's servers, but this link entry will be cleared from your Registry hub.
                </p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-left">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">Room Objective</p>
                <p className="text-xs font-bold text-white mt-1 line-clamp-1 italic">{spaceToDelete.purpose}</p>
                <p className="text-[10px] font-mono text-emerald-400 mt-1">{spaceToDelete.meetingUri}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSpaceToDelete(null)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] text-slate-400 hover:text-white font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteSavedSpace(spaceToDelete.name)}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Trash2 size={13} />
                  <span>Clear Entry</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
