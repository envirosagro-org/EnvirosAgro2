import * as React from 'react';
const { useState, useEffect } = React;
import { 
  Calendar, Clock, Plus, Trash2, MapPin, AlignLeft, RefreshCw, Loader2, 
  AlertTriangle, CheckSquare, Shield, Info, ExternalLink, CalendarDays, X, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  listCalendarEvents, 
  createCalendarEvent, 
  deleteCalendarEvent, 
  CalendarEvent 
} from '../services/googleCalendarService';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  getDriveAccessToken, 
  initDriveAuth 
} from '../services/googleDriveService';

interface GoogleCalendarViewProps {
  user: any;
}

export const GoogleCalendarView: React.FC<GoogleCalendarViewProps> = ({ user }) => {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Calendar Events State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Event Form State
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [createMeet, setCreateMeet] = useState(false);

  // Destructive deletion confirmation state
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState(false);

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

  // Fetch Calendar Events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await listCalendarEvents(50);
      setEvents(fetchedEvents);
    } catch (err: any) {
      console.error('Failed to load Google Calendar events:', err);
      toast.error(err.message || 'Error occurred while loading calendar shards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      loadEvents();
    }
  }, [token, needsAuth]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Google Workspace authorization verified.');
      }
    } catch (error: any) {
      console.error('Authentication Error:', error);
      toast.error('Authentication dropped or blocked. Verify your browser popups.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleDriveSignOut();
      setToken(null);
      setNeedsAuth(true);
      setEvents([]);
      toast.info('Google Workspace authentication session cleared.');
    } catch (error: any) {
      toast.error('Sign out error: ' + error.message);
    }
  };

  // Pre-load default template settings
  const handleOpenQuickTemplate = (templateType: 'soil' | 'quorum' | 'sensor') => {
    setShowAddForm(true);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    setStartDate(`${year}-${month}-${day}`);
    setEndDate(`${year}-${month}-${day}`);

    if (templateType === 'soil') {
      setSummary('ENVIROSAGRO SOIL VITALITY LAB ANALYSIS');
      setDescription('Routine testing of geofenced micro-organism vitality scores, soil moisture retention indices, and carbon potential thresholds.');
      setLocation('S-AGRO Field Lab Delta III');
      setStartTime('09:00');
      setEndTime('11:00');
    } else if (templateType === 'quorum') {
      setSummary('ENVIROSAGRO MULTI-SIG QUORUM HEURISTIC AUDIT');
      setDescription('Consensus review of pending block shard transactions and multi-signature authorization confirmations with legal delegates.');
      setLocation('Secure Multi-Sig Virtual Room');
      setStartTime('14:00');
      setEndTime('15:30');
    } else {
      setSummary('ENVIROSAGRO HARDWARE NODE CALIBRATION');
      setDescription('Onsite diagnostic check and firmware v3.2.1 validation on active microcomputer telemetry sensors.');
      setLocation('Geodetic Sensor Gateway Alpha-12');
      setStartTime('16:00');
      setEndTime('17:00');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !startDate || !startTime || !endDate || !endTime) {
      toast.error('Please specify summary, start date-time, and end date-time parameters.');
      return;
    }

    const isoStart = new Date(`${startDate}T${startTime}:00`).toISOString();
    const isoEnd = new Date(`${endDate}T${endTime}:00`).toISOString();

    if (new Date(isoStart) >= new Date(isoEnd)) {
      toast.error('The start date and time must occur prior to the end date and time.');
      return;
    }

    setIsCreating(true);
    try {
      await createCalendarEvent({
        summary: summary.trim(),
        description: description.trim(),
        location: location.trim(),
        startTime: isoStart,
        endTime: isoEnd,
        createMeet: createMeet,
      });

      toast.success(createMeet ? 'Scheduled event and generated Google Meet conference room!' : 'Calendar event scheduled successfully.');
      
      // Clean form parameters
      setSummary('');
      setDescription('');
      setLocation('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setCreateMeet(false);
      setShowAddForm(false);
      
      // Reload Calendar Events
      loadEvents();
    } catch (err: any) {
      toast.error('Failed to create calendar event: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const initiateDeleteEvent = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setEventToDelete(event);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    
    setDeletingEvent(true);
    try {
      await deleteCalendarEvent(eventToDelete.id);
      toast.success('Calendar event deleted successfully.');
      setEventToDelete(null);
      loadEvents();
    } catch (err: any) {
      toast.error('Failed to delete event: ' + err.message);
    } finally {
      setDeletingEvent(false);
    }
  };

  // Helper formats to parse human-centric schedules
  const formatEventTime = (event: CalendarEvent) => {
    try {
      const startStr = event.start.dateTime || event.start.date;
      const endStr = event.end.dateTime || event.end.date;
      if (!startStr) return '';
      
      const startDateObj = new Date(startStr);
      const startFormatted = startDateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (event.start.date) {
        return `${startFormatted} (All Day)`;
      }

      const startTimes = startDateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const endTimes = endStr ? new Date(endStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) : '';

      return `${startFormatted} | ${startTimes} - ${endTimes}`;
    } catch (e) {
      return '';
    }
  };

  // Filter local list based on simple search query
  const filteredEvents = events.filter(e => 
    e.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="google_calendar_root" className="min-h-screen bg-black/95 text-slate-100 p-4 sm:p-8 flex flex-col pt-12">
      {/* Background radial overlays */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Header element */}
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                Google Calendar <span className="text-emerald-400">Shard.</span>
              </h2>
              <p className="text-slate-500 text-sm italic font-medium">"Scheduling soil analysis, sensor maintenance, and quorum consensus timelines."</p>
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

      {/* Primary content area */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
        {needsAuth ? (
          /* AUTHENTICATION SHEET */
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto w-full text-center space-y-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                <CalendarDays size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Authorize Calendar Shard</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Integrate your Google Calendar account to schedule vital agricultural sensor tests, physical audits, and synchronize multi-sig cryptographic governance timelines.
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
                      <span>Requesting Scopes...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Connect Google Calendar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Popup guide for sandboxes */}
              <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-3xl text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info size={14} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#f59e0b]">Iframe Popups Notice</span>
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed list-disc list-inside">
                  <li>Ensure your browser is not blocking popup dialogs initiated by this tab.</li>
                  <li>Workspace scopes will be requested with exact user permission.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CALENDAR WORKSPACE */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LATEST SHARDS & LIST PANEL */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Search & Actions Header bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
                <div className="relative w-full sm:max-w-md">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter scheduled events..."
                    className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none transition-all font-mono text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={loadEvents}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95 animate-none"
                    title="Reload Calendar"
                  >
                    <RefreshCw size={15} className={loading ? "animate-spin text-emerald-400" : ""} />
                  </button>

                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 rounded-2xl text-white font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                  >
                    <Plus size={14} />
                    <span>New Event</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Action Cards */}
              <div className="space-y-2">
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">Rapid Scheduling Presets</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleOpenQuickTemplate('soil')}
                    className="p-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <CheckSquare className="text-emerald-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Soil Vitality Test</p>
                    <p className="text-[11px] text-slate-500">Scheduled for tomorrow morning at 09:00.</p>
                  </button>

                  <button 
                    onClick={() => handleOpenQuickTemplate('quorum')}
                    className="p-4 bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Users className="text-indigo-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Quorum Consensus</p>
                    <p className="text-[11px] text-slate-500">Synchronize validator signature boards.</p>
                  </button>

                  <button 
                    onClick={() => handleOpenQuickTemplate('sensor')}
                    className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Shield className="text-purple-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[10px] font-black uppercase text-white tracking-wide">Node Calibration</p>
                    <p className="text-[11px] text-slate-500">Firmware check for sensor gateway.</p>
                  </button>
                </div>
              </div>

              {/* Main Calendar Agenda Event List */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Google Calendar Agenda
                  </p>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {filteredEvents.length} Active Timelines
                  </span>
                </div>

                {loading && filteredEvents.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <Loader2 className="animate-spin text-emerald-400 mx-auto w-8 h-8" />
                    <p className="text-slate-500 font-mono text-xs">COLLECTING REGISTERED CHRONOMETRY NODES...</p>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-1">
                    <Calendar className="mx-auto text-slate-600 mb-2 w-7 h-7" />
                    <p className="font-mono text-xs">NO CHRONO SHARDS OR UPCOMING TIMELINES FOUND.</p>
                    <p className="text-[10px] text-slate-600">Schedule your first EnvirosAgro validation event rightward.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 space-y-1">
                    {filteredEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="py-4 flex gap-4 items-start group hover:bg-white/5 hover:px-3 rounded-2xl transition-all"
                      >
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mt-1 shrink-0">
                          <Clock size={16} />
                        </div>

                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h4 className="text-sm font-bold text-white uppercase italic tracking-tight m-0 truncate">
                              {event.summary}
                            </h4>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                              {formatEventTime(event)}
                            </span>
                          </div>

                          {event.description && (
                            <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          {event.location && (
                            <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                              <MapPin size={11} className="text-slate-600" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}

                          {event.htmlLink && (
                            <a 
                              href={event.htmlLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium text-emerald-400/80 hover:text-emerald-400 pt-1 transition-colors"
                            >
                              <span>View in Google Calendar</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>

                        <div className="shrink-0 self-center">
                          <button 
                            onClick={(e) => initiateDeleteEvent(e, event)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Trash event from Google Calendar"
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

            {/* EVENT CREATION SIDEBAR */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {showAddForm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Plus className="text-emerald-400 w-4 h-4" />
                        <h4 className="text-sm font-black text-white uppercase italic tracking-wider leading-none">Schedule Event</h4>
                      </div>
                      <button 
                        onClick={() => setShowAddForm(false)} 
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Event Title *</label>
                        <input 
                          type="text"
                          required
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder="e.g. Field Soil Organic Carbon analysis"
                          className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Description details</label>
                        <textarea 
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Analysis notes, checklist parameters..."
                          className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono custom-scrollbar"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Physical Location</label>
                        <input 
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Geodetic zone delta 1"
                          className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Start Date *</label>
                          <input 
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-3 py-3 focus:outline-none transition-all font-mono text-white [color-scheme:dark]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Start Time *</label>
                          <input 
                            type="time"
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-3 py-3 focus:outline-none transition-all font-mono text-white [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">End Date *</label>
                          <input 
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-3 py-3 focus:outline-none transition-all font-mono text-white [color-scheme:dark]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">End Time *</label>
                          <input 
                            type="time"
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-3 py-3 focus:outline-none transition-all font-mono text-white [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 pb-2">
                        <input 
                          type="checkbox"
                          id="createMeetCheckbox"
                          checked={createMeet}
                          onChange={(e) => setCreateMeet(e.target.checked)}
                          className="w-4 h-4 rounded bg-black/60 border border-white/10 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                        />
                        <label htmlFor="createMeetCheckbox" className="text-[10px] font-mono font-bold text-slate-300 uppercase cursor-pointer select-none">
                          Add Google Meet video call
                        </label>
                      </div>

                      <button 
                        type="submit"
                        disabled={isCreating}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-45"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="animate-spin text-white w-4 h-4" />
                            <span>Dispatching Timeline...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Commit Schedule Event</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {!showAddForm && (
                  <div className="hidden lg:flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/5 shadow-inner rounded-3xl p-8 py-20 text-center space-y-2 text-slate-600">
                    <CalendarDays size={24} className="text-slate-700 font-bold" />
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Scheduler Module Preview</p>
                    <p className="text-[11px] leading-relaxed text-slate-600 max-w-[180px] mx-auto">Click "New Event" or select one of the rapid agricultural presets to append a consensus time node.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        )}
      </div>

      {/* AUTHORITATIVE CONFIRMATION MODAL TO SATISFY DELETION SAFEGUARD RULES */}
      <AnimatePresence>
        {eventToDelete && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEventToDelete(null)}
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
                <h4 className="text-lg font-black text-white uppercase italic tracking-wider leading-none">Confirm Event Deletion</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you absolutely sure you want to delete this event from Google Calendar? This will trigger an immediate deletion request on your configured Workspace account. This operation is irreversible.
                </p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-left">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">Selected Event Identifier</p>
                <p className="text-xs font-bold text-white mt-1 line-clamp-1 italic">{eventToDelete.summary}</p>
                {eventToDelete.start && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-1">{formatEventTime(eventToDelete)}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setEventToDelete(null)}
                  disabled={deletingEvent}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] text-slate-400 hover:text-white font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDeleteEvent}
                  disabled={deletingEvent}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {deletingEvent ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>DELETING EVENT...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span>Confirm Deletion</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
