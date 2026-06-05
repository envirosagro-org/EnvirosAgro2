import * as React from 'react';
const { useState, useEffect } = React;
import { 
  Mail, Send, Search, Loader2, Trash2, ArrowLeft, Info, CheckCircle2, 
  ExternalLink, Clock, User, Reply, AlertTriangle, Eye, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  listGmailMessages, 
  getGmailMessage, 
  sendGmailEmail, 
  trashGmailMessage, 
  GmailMessage 
} from '../services/gmailService';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  getDriveAccessToken, 
  initDriveAuth 
} from '../services/googleDriveService';

interface GmailViewProps {
  user: any;
}

export const GmailView: React.FC<GmailViewProps> = ({ user }) => {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Messages lists state
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Compose parameters state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // Message Delete modal confirmation
  const [messageToDelete, setMessageToDelete] = useState<GmailMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState(false);

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

  // Fetch emails
  const loadEmails = async (query: string = '') => {
    setLoading(true);
    try {
      const msgs = await listGmailMessages(query);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      toast.error(err.message || 'Error occurred while loading mailbox shards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !needsAuth) {
      loadEmails(searchQuery);
    }
  }, [token, needsAuth]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Google Workspace Session established successfully.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Authentication dropped or blocked. Verify your popup settings.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await googleDriveSignOut();
      setToken(null);
      setNeedsAuth(true);
      setMessages([]);
      setSelectedMessage(null);
      toast.info('Google Workspace session cleared.');
    } catch (error: any) {
      toast.error('Sign out error: ' + error.message);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEmails(searchQuery);
  };

  const handleSelectMessage = async (msgId: string) => {
    try {
      setLoading(true);
      const detailed = await getGmailMessage(msgId);
      setSelectedMessage(detailed);
    } catch (err: any) {
      toast.error('Failed to query message body: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      toast.error('Please fulfill all dispatch parameters.');
      return;
    }

    setIsSending(true);
    try {
      await sendGmailEmail(composeTo, composeSubject, composeBody);
      toast.success('Audit Report dispatched to ' + composeTo);
      
      // Clean up inputs
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setShowCompose(false);
      
      // Reload inbox to reflect sent/threads
      setTimeout(() => loadEmails(searchQuery), 1500);
    } catch (err: any) {
      toast.error('Failed to dispatch mail: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenComposeTemplate = (templateType: 'soil' | 'audit' | 'network') => {
    setShowCompose(true);
    
    if (templateType === 'audit') {
      setComposeSubject('ENVIROSAGRO SHARD FINALITY AUDIT - TRANSACTION STATUS REPORT');
      setComposeBody(`
        <h2>INDUSTRIAL FINALITY REPORT</h2>
        <p>This report has been compiled and dispatched securely via the EnvirosAgro Registry System.</p>
        <hr style="border:0; border-top: 1px solid #1e293b; margin: 20px 0;" />
        <table style="width:100%; font-family: monospace; font-size: 11px;">
          <tr style="background:#5c21df30;">
            <th style="padding: 10px; text-align: left; color:#a78bfa;">AUDIT METRICS</th>
            <th style="padding: 10px; text-align: left; color:#a78bfa;">CURRENT STATUS</th>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b;">Ledger State</td>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b; color:#34d399;">● CONSENSUS FINALITY</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b;">Security Level</td>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b; color:#10b981;">ISO TQM Grade AAA</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b;">Assigned Stewards</td>
            <td style="padding: 8px; border-bottom: 1px solid #1e293b;">Active Node Multi-Sig Quorum</td>
          </tr>
        </table>
        <br/>
        <p style="font-size:10px; color:#64748b;">This data was synchronized with local databases prior to dispatching.</p>
      `);
    } else if (templateType === 'soil') {
      setComposeSubject('ENVIROSAGRO SOIL & BIO-VITALITY REGISTRY ANNOUNCEMENT');
      setComposeBody(`
        <h2>SOIL VITALITY AUDIT SUCCESS</h2>
        <p>Dear Registry Inspectors,</p>
        <p>This message certifies that soil micro-organism vitality assessments have passed the standard geofenced threshold constraints. Sub-grade elements have successfully completed local remediation phases.</p>
        <p>Vitality score: <strong>1.48 Giga-Resilience Unit</strong></p>
        <p>Verification ID: SAGRO-SOIL-${Math.floor(Math.random() * 900000 + 100000)}</p>
      `);
    } else {
      setComposeSubject('ENVIROSAGRO REGISTRY ALERTS: INBOUND INFRASTRUCTURE SIGNAL MATCH');
      setComposeBody(`
        <h2>Registry Hardware Node Update</h2>
        <p>An authorized connection has successfully occurred. Integrated firmware parameters have reported normal telemetry metrics.</p>
        <p>Firmware status: <strong>Up to Date (v3.2.1)</strong></p>
        <p>Stability Rating: 1.42x</p>
      `);
    }
  };

  const initiateDeleteMessage = (e: React.MouseEvent, msg: GmailMessage) => {
    e.stopPropagation();
    setMessageToDelete(msg);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    
    setDeletingMessage(true);
    try {
      await trashGmailMessage(messageToDelete.id);
      toast.success('Email trashed successfully.');
      setSelectedMessage(null);
      setMessageToDelete(null);
      // Reload
      loadEmails(searchQuery);
    } catch (err: any) {
      toast.error('Failed to trash message: ' + err.message);
    } finally {
      setDeletingMessage(false);
    }
  };

  return (
    <div id="gmail_portal_root" className="min-h-screen bg-black/95 text-slate-100 p-4 sm:p-8 flex flex-col pt-12">
      {/* Background aesthetic */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Header element */}
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter m-0 leading-none">
                Gmail <span className="text-emerald-400">Audit Hub.</span>
              </h2>
              <p className="text-slate-500 text-sm italic font-medium">"Dispatching blockchain consensus & industrial audit finality proofs."</p>
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
          /* AUTH SHEET */
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-xl mx-auto w-full text-center space-y-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto border border-emerald-500/20 text-emerald-400">
                <Mail size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white italic tracking-tight uppercase">Authorize Workspace APIs</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Connect your Google Account to access Gmail. This allows EnvirosAgro to securely display audit threads and dispatch system summaries to requested inspectors.
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
                      <span>Verifying Authority...</span>
                    </>
                  ) : (
                    <>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '20px', height: '20px' }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Connect Gmail Accounts</span>
                    </>
                  )}
                </button>
              </div>

              {/* Secure sandbox alert */}
              <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-3xl text-left space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info size={14} />
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest">Popup & Cookies Advice</span>
                </div>
                <ul className="text-[10px] text-slate-400 space-y-1.5 font-medium leading-relaxed list-disc list-inside">
                  <li>If clicking fails to open the Google login popup, verify that your browser block is disabled.</li>
                  <li>Ensure cross-website cookie tracking is enabled if using private incognito tabs.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* ACTIVE CONTAINER LAYOUT */
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* INBOX & ACTIONS COLUMN */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Toolbar search & compose */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages (e.g., audit)..."
                    className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 placeholder:text-slate-600 focus:outline-none transition-all font-mono text-xs text-white"
                  />
                </form>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                  <button 
                    onClick={() => loadEmails(searchQuery)}
                    className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
                    title="Refresh Shard List"
                  >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                  </button>

                  <button 
                    onClick={() => setShowCompose(!showCompose)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/20 rounded-2xl text-white font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-md"
                  >
                    <Send size={14} />
                    <span>Compose Audit</span>
                  </button>
                </div>
              </div>

              {/* Quick Template Actions */}
              <div className="space-y-2">
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">Rapid Dispatch Templates</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleOpenComposeTemplate('audit')}
                    className="p-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <CheckCircle2 className="text-emerald-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[9px] font-black uppercase text-white tracking-wide">Finality Audit</p>
                    <p className="text-[10px] text-slate-500">MIME table summary of local ledger state</p>
                  </button>

                  <button 
                    onClick={() => handleOpenComposeTemplate('soil')}
                    className="p-4 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Info className="text-blue-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[9px] font-black uppercase text-white tracking-wide">Soil Vitality Status</p>
                    <p className="text-[10px] text-slate-500">Report of geofenced resilience thresholds</p>
                  </button>

                  <button 
                    onClick={() => handleOpenComposeTemplate('network')}
                    className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/20 rounded-2xl text-left space-y-1 group transition-all"
                  >
                    <Reply className="text-purple-400 group-hover:scale-110 transition-transform w-5 h-5 mb-1" />
                    <p className="text-[9px] font-black uppercase text-white tracking-wide">Signal Telemetry</p>
                    <p className="text-[10px] text-slate-500">Report of hardware registry firmware parameters</p>
                  </button>
                </div>
              </div>

              {/* Mail list container */}
              <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Latest Mail Registry {searchQuery && `(matching: "${searchQuery}")`}
                  </p>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {messages.length} Records Found
                  </span>
                </div>

                {loading && messages.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <Loader2 className="animate-spin text-emerald-400 mx-auto w-8 h-8" />
                    <p className="text-slate-500 font-mono text-xs">AQUIRING MAIL SHARDS FROM GOOGLE DIRECTORY...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl text-slate-500 space-y-1">
                    <Mail className="mx-auto text-slate-600 mb-2 w-7 h-7" />
                    <p className="font-mono text-xs">NO AUDIO, TEXT, OR COGNITIVE SPEC RECORDS DETECTED.</p>
                    <p className="text-[10px] text-slate-600">Try executing a search query or dispatching your first audit email.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id}
                        onClick={() => handleSelectMessage(msg.id)}
                        className={`py-4 flex gap-4 items-start cursor-pointer group transition-all ${selectedMessage?.id === msg.id ? 'bg-white/5 px-4 rounded-2xl' : 'hover:bg-white/5 hover:px-2 rounded-2xl'}`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${selectedMessage?.id === msg.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 group-hover:text-emerald-400 group-hover:bg-white/10'} transition-all`}>
                          <Mail size={16} />
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex justify-between items-center gap-4">
                            <span className="font-black text-[10px] uppercase text-emerald-400 tracking-wide truncate max-w-[180px] sm:max-w-xs">
                              {msg.from.split('<')[0] || msg.from}
                            </span>
                            <span className="text-[8px] font-mono text-slate-500 shrink-0">
                              {msg.date}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white uppercase italic tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">
                            {msg.subject}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {msg.snippet}
                          </p>
                        </div>

                        <div className="shrink-0 self-center">
                          <button 
                            onClick={(e) => initiateDeleteMessage(e, msg)}
                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Trash ledger node from Gmail"
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

            {/* DETAIL MODAL DRAWER OR COMPOSE PANEL COLUMN */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* COMPOSE VIEW */}
              {showCompose && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Send className="text-emerald-400 w-4 h-4" />
                      <h4 className="text-sm font-black text-white uppercase italic tracking-wider leading-none">Compose Audit</h4>
                    </div>
                    <button 
                      onClick={() => setShowCompose(false)} 
                      className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Recipient Address *</label>
                      <input 
                        type="email"
                        required
                        value={composeTo}
                        onChange={(e) => setComposeTo(e.target.value)}
                        placeholder="auditor@envirosagro.com"
                        className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Subject Header *</label>
                      <input 
                        type="text"
                        required
                        value={composeSubject}
                        onChange={(e) => setComposeSubject(e.target.value)}
                        placeholder="Industrial ledger finality checksum..."
                        className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[8px] font-mono font-black uppercase text-slate-500 tracking-widest">Email Message (HTML permitted) *</label>
                      <textarea 
                        required
                        rows={8}
                        value={composeBody}
                        onChange={(e) => setComposeBody(e.target.value)}
                        placeholder="Verify ledger integrity and environmental compliance metrics..."
                        className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-emerald-500 rounded-xl px-4 py-3 focus:outline-none placeholder:text-slate-600 transition-all font-mono custom-scrollbar"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSending}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-45"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="animate-spin text-white w-4 h-4" />
                          <span>Delivering Packets...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Dispatch Email Packet</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* MESSAGE DETAIL VIEW */}
              <AnimatePresence mode="wait">
                {selectedMessage ? (
                  <motion.div 
                    key={selectedMessage.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4"
                  >
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">MESSAGE DETAIL</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-tight italic mt-1 leading-snug">
                          {selectedMessage.subject}
                        </h4>
                      </div>
                      <button 
                        onClick={() => setSelectedMessage(null)}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Close Audit Detail"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-400">
                      <div className="grid grid-cols-4 gap-1 text-[9px] font-mono uppercase bg-black/40 p-3 rounded-xl border border-white/5 text-slate-500">
                        <span className="text-slate-600">From</span>
                        <span className="col-span-3 text-white font-semibold truncate leading-none">{selectedMessage.from}</span>
                        
                        <span className="text-slate-600">To</span>
                        <span className="col-span-3 text-slate-400 truncate leading-none">{selectedMessage.to}</span>
                        
                        <span className="text-slate-600">Date</span>
                        <span className="col-span-3 text-slate-400 truncate leading-none">{selectedMessage.date}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[8px] font-mono uppercase text-slate-500 tracking-widest">Decoded Message Body</span>
                        <div 
                          className="bg-black/60 border border-white/5 rounded-2xl p-4 text-[11px] leading-relaxed text-slate-300 font-normal overflow-y-auto max-h-[340px] custom-scrollbar space-y-2 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedMessage.body || selectedMessage.snippet }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setComposeTo(selectedMessage.from.match(/<([^>]+)>/)?.[1] || selectedMessage.from);
                            setComposeSubject(`Re: ${selectedMessage.subject}`);
                            setComposeBody(`\n\nOn ${selectedMessage.date}, ${selectedMessage.from} wrote:\n> ${selectedMessage.snippet}`);
                            setShowCompose(true);
                            toast.success('Replying template loaded into compose panel.');
                          }}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-[9px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                        >
                          <Reply size={12} />
                          <span>Reply to Auditor</span>
                        </button>

                        <button 
                          onClick={(e) => initiateDeleteMessage(e, selectedMessage)}
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-white border border-red-500/20 rounded-xl transition-all"
                          title="Trash Message"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  !showCompose && (
                    <div className="hidden lg:flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/5 shadow-inner rounded-3xl p-8 py-20 text-center space-y-2 text-slate-600">
                      <Eye size={24} className="text-slate-700" />
                      <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Node Auditor Preview</p>
                      <p className="text-[10px] leading-relaxed text-slate-600 max-w-[180px] mx-auto">Select a mailbox shard from the list leftward to view full cryptographic proof context.</p>
                    </div>
                  )
                )}
              </AnimatePresence>
            </div>

          </div>
        )}
      </div>

      {/* MUTATION CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMessageToDelete(null)}
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
                <h4 className="text-lg font-black text-white uppercase italic tracking-wider leading-none">Confirm Shard Trashing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you absolutely sure you want to delete this Gmail message node? This will trigger a deletion request on your configured Workspace account. This operation is authoritative.
                </p>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-left">
                <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">Selected Payload Subject</p>
                <p className="text-xs font-bold text-white mt-1 line-clamp-1 italic">{messageToDelete.subject}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setMessageToDelete(null)}
                  disabled={deletingMessage}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] text-slate-400 hover:text-white font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDeleteMessage}
                  disabled={deletingMessage}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  {deletingMessage ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>MUTATING DATABASE...</span>
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
