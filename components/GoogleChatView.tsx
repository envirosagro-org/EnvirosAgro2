import * as React from 'react';
const { useState, useEffect, useRef } = React;
import { 
  Plus, RefreshCw, Loader2, Shield, Info, ExternalLink, Send, MessageSquare, Users, Sparkles, Hash, Circle, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  googleDriveSignIn, 
  googleDriveSignOut, 
  initDriveAuth 
} from '../services/googleDriveService';

interface ChatSpace {
  id: string;
  name: string;
  type: 'ROOM' | 'DM';
  membersCount: number;
  unreads: boolean;
}

interface ChatMessage {
  id: string;
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export default function GoogleChatView() {
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Chat Spaces State
  const [spaces, setSpaces] = useState<ChatSpace[]>([
    { id: 'space-1', name: 'Agro-Meteorology General', type: 'ROOM', membersCount: 14, unreads: true },
    { id: 'space-2', name: 'Cooperative Multi-Sig Shards', type: 'ROOM', membersCount: 8, unreads: false },
    { id: 'space-3', name: 'Nairobi Ingest Pipeline Monitor', type: 'ROOM', membersCount: 5, unreads: false },
    { id: 'space-4', name: 'Dr. Evelyn Ombati', type: 'DM', membersCount: 2, unreads: true }
  ]);
  const [activeSpace, setActiveSpace] = useState<ChatSpace>(spaces[0]);
  
  // Message Thread state
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'space-1': [
      { id: 'm-1', senderName: 'Dr. Evelyn Ombati', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', text: 'Moisture drift values in zone 3 have stabilized back to 0.72. The Matins protocols were applied flawlessly.', timestamp: '10:42 AM', isMe: false },
      { id: 'm-2', senderName: 'Meshack Kiprop', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', text: 'Excellent news. I am uploading the seed ledger now.', timestamp: '10:45 AM', isMe: false }
    ],
    'space-2': [
      { id: 'm-3', senderName: 'Audit Oracle', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', text: 'New Multi-Sig transaction parsed: EAC-MINT-008. Sequence verified by 5 witnesses.', timestamp: 'Yesterday', isMe: false }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeSpace]);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleDriveSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast.success('Authorized Google Chat Session successfully.');
      }
    } catch (e) {
      toast.error('Authentication rejected or popup blocked.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      senderName: 'You (Steward)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => ({
      ...prev,
      [activeSpace.id]: [...(prev[activeSpace.id] || []), newMessage]
    }));
    setInputMessage('');

    // Simulated reply after delay
    setTimeout(() => {
      const responseText = `Acknowledge dispatcher signal shard. Action logged in ${activeSpace.name}.`;
      const replyMessage: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        senderName: 'EnvirosAgro Bot',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => ({
        ...prev,
        [activeSpace.id]: [...(prev[activeSpace.id] || []), replyMessage]
      }));
    }, 1200);
  };

  const activeMessages = messages[activeSpace.id] || [];

  return (
    <div className="p-6 md:p-12 space-y-10 animate-in fade-in duration-700 max-w-[1400px] mx-auto font-sans">
      
      {/* HUD Header Block */}
      <div className="glass-card p-12 rounded-[56px] border border-sky-500/20 bg-sky-500/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none rotate-12">
            <MessageSquare className="w-96 h-96 text-sky-400" />
         </div>
         <div className="flex items-center gap-10 relative z-10 text-center md:text-left flex-col md:flex-row">
            <div className="w-28 h-28 bg-sky-600 rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.4)] ring-[15px] ring-white/5 shrink-0">
               <MessageSquare className="w-14 h-14 text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic m-0 leading-none drop-shadow-2xl">
                 Google <span className="text-sky-400">Chat</span> Terminal
               </h2>
               <p className="text-slate-400 text-lg font-medium italic leading-relaxed max-w-2xl">
                 Collaborate securely across regional workspaces and coordinate emergency field dispatching using real-time Google Chat interfaces.
               </p>
            </div>
         </div>
         <div className="shrink-0 flex items-center gap-4 z-10">
           <button 
             onClick={token && !needsAuth ? googleDriveSignOut : handleLogin}
             disabled={isSigningIn}
             className={`px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 border-2 ${token && !needsAuth ? 'bg-white/5 hover:bg-rose-900 border-white/10 text-slate-300' : 'bg-sky-600 hover:bg-sky-500 border-white/10 text-white'}`}
           >
              {token && !needsAuth ? 'Sign Out' : 'Sign in with Google'}
           </button>
         </div>
      </div>

      {needsAuth ? (
        <div className="glass-card p-16 rounded-[48px] border border-white/5 bg-black/40 text-center space-y-8 max-w-2xl mx-auto my-20">
           <div className="w-24 h-24 bg-sky-500/10 border border-sky-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-xl"><Shield size={40} className="text-sky-400" /></div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Authorized Chat Spaces</h3>
              <p className="text-slate-400 italic text-base leading-relaxed">
                Connect your account to establish active event threads, synchronize messages, and command robotic/field monitors in cooperative chat rooms.
              </p>
           </div>
           <button 
             onClick={handleLogin}
             disabled={isSigningIn}
             className="px-16 py-6 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 mx-auto border-2 border-white/10"
           >
             {isSigningIn ? <Loader2 className="animate-spin" size={18} /> : null}
             Authorize Google Chat
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch h-[600px]">
          
          {/* LEFT PANEL: Spaces List */}
          <div className="md:col-span-4 glass-card p-6 rounded-[36px] border border-white/5 bg-[#050706] flex flex-col justify-start overflow-hidden">
             <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Channels</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             
             <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {spaces.map(space => (
                   <button 
                     key={space.id}
                     onClick={() => {
                        setActiveSpace(space);
                        setSpaces(prev => prev.map(s => s.id === space.id ? {...s, unreads: false} : s));
                     }}
                     className={`w-full p-4 rounded-2xl flex items-center justify-between group transition-all text-left border ${activeSpace.id === space.id ? 'bg-sky-500/10 border-sky-500/20 text-white' : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'}`}
                   >
                      <div className="flex items-center gap-4 min-w-0">
                         <div className={`p-2.5 rounded-xl ${activeSpace.id === space.id ? 'bg-sky-500/10 text-sky-400' : 'bg-white/5 text-slate-600'}`}>
                            {space.type === 'ROOM' ? <Hash size={16} /> : <Users size={16} />}
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-black uppercase tracking-tight italic truncate leading-none">{space.name}</p>
                            <p className="text-[9px] text-slate-600 font-mono mt-1">{space.membersCount} stakeholders connected</p>
                         </div>
                      </div>
                      {space.unreads && (
                         <span className="w-2 h-2 rounded-full bg-sky-500" />
                      )}
                   </button>
                ))}
             </div>
          </div>

          {/* RIGHT PANEL: Chat Thread */}
          <div className="md:col-span-8 glass-card rounded-[36px] border border-white/5 bg-[#050706] flex flex-col h-full overflow-hidden">
             
             {/* Thread Header */}
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                      <Hash size={18} className="text-sky-400" />
                      {activeSpace.name}
                   </h3>
                   <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">ESTABLISHED CONNECTION: SECURE CRYPTO-NODE</p>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[8px] font-black text-slate-500 bg-white/5 px-2.5 py-1 rounded-full uppercase">COOP ACTIVE</span>
                </div>
             </div>

             {/* Message Flow Area */}
             <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                {activeMessages.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-3">
                      <MessageSquare size={36} className="text-slate-600 animate-pulse" />
                      <p className="text-[10px] font-mono uppercase text-slate-500">NO CORRESPONDENCE YET</p>
                   </div>
                ) : (
                   activeMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-4 items-end ${msg.isMe ? 'justify-end' : ''}`}>
                         {!msg.isMe && (
                            <img src={msg.avatar} alt={msg.senderName} className="w-8 h-8 rounded-full border border-white/10 shrink-0" />
                         )}
                         <div className={`max-w-[70%] p-4 rounded-3xl text-sm italic leading-relaxed space-y-1.5 shadow-xl ${msg.isMe ? 'bg-sky-600 text-white rounded-br-none' : 'bg-[#0a0f0d] border border-white/5 text-slate-300 rounded-bl-none'}`}>
                            <p className="text-[8px] font-mono font-black tracking-wide text-slate-500">{msg.senderName} • {msg.timestamp}</p>
                            <p className="font-medium text-[13px]">{msg.text}</p>
                         </div>
                      </div>
                   ))
                )}
                <div ref={messagesEndRef} />
             </div>

             {/* Input Bar */}
             <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-4">
                <input 
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Record consensus dispatch signal..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 text-white text-xs outline-none focus:border-sky-500 transition-all font-medium"
                />
                <button 
                  type="submit" 
                  className="w-10 h-10 bg-sky-600 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95"
                >
                   <Send size={16} />
                </button>
             </form>

          </div>

        </div>
      )}

    </div>
  );
}
