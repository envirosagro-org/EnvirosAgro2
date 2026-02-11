import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  Leaf, 
  ShieldCheck, 
  Key, 
  Loader2, 
  Sparkles, 
  Gift, 
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Mail,
  HelpCircle,
  Hash,
  Send, 
  Zap,
  Lock,
  RefreshCw,
  Signal,
  CheckCircle2,
  X,
  Smartphone,
  MessageSquareCode,
  Globe,
  Fingerprint,
  ArrowLeft,
  Phone,
  RotateCcw,
  UserPlus,
  UserCheck,
  Chrome
} from 'lucide-react';
import { 
  syncUserToCloud,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  resetPassword,
  auth,
  getStewardProfile,
  signInWithGoogle,
  setupRecaptcha,
  requestPhoneCode,
  sendVerificationShard,
  refreshAuthUser
} from '../services/firebaseService';

interface LoginProps {
  onLogin: (user: User) => void;
  isEmbed?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isEmbed = false }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'register' | 'login' | 'forgot' | 'verify_shard' | 'phone' | 'verify_phone' | 'waiting_verification'>('login');
  
  const [name, setEditName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  const [esin] = useState(`EA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  const createStewardProfile = async (uid: string, userEmail: string, userName: string, phone?: string) => {
    const newUser: User = {
      name: userName || 'Anonymous Steward',
      email: userEmail.toLowerCase() || `${phone}@phone.auth`,
      esin: esin,
      mnemonic: "seed plant grow harvest sun rain soil root leaf flower fruit seed",
      regDate: new Date().toLocaleDateString(),
      role: 'REGENERATIVE FARMER',
      location: `Global Node`,
      wallet: { 
        balance: 100, eatBalance: 0, exchangeRate: 600, bonusBalance: 100, 
        tier: 'Seed', lifetimeEarned: 100, linkedProviders: [], miningStreak: 1,
        lastSyncDate: new Date().toISOString().split('T')[0], pendingSocialHarvest: 0, stakedEat: 0
      },
      metrics: { agriculturalCodeU: 1.2, timeConstantTau: 8.5, sustainabilityScore: 72, socialImmunity: 60, viralLoadSID: 35, baselineM: 8.5 },
      skills: { 'General': 10 },
      isReadyForHire: false,
      settings: { notificationsEnabled: true, privacyMode: 'Public', autoSync: true, biometricLogin: false, theme: 'Dark' }
    };

    const syncSuccess = await syncUserToCloud(newUser, uid);
    return { success: syncSuccess, profile: newUser };
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await signInWithGoogle();
      const profile = await getStewardProfile(result.user.uid);
      
      if (profile) {
        onLogin(profile);
      } else {
        // New user from Google
        const { profile: newProfile } = await createStewardProfile(
          result.user.uid, 
          result.user.email || '', 
          result.user.displayName || ''
        );
        onLogin(newProfile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `GOOGLE_SYNC_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setMessage(null);
    try {
      const appVerifier = setupRecaptcha('recaptcha-container');
      const result = await requestPhoneCode(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setMode('verify_phone');
      setMessage({ type: 'info', text: "SMS_TRANSMITTED: 6-digit access shard sent to your device." });
    } catch (error: any) {
      setMessage({ type: 'error', text: `PHONE_AUTH_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email || (mode === 'login' && !password)) return;
    setLoading(true);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(null, email, password);
        await createStewardProfile(userCredential.user.uid, email, name);
        await sendVerificationShard();
        setMode('waiting_verification');
      } else if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(null, email, password);
        if (!userCredential.user.emailVerified) {
          setMode('waiting_verification');
          return;
        }
        const profile = await getStewardProfile(userCredential.user.uid);
        if (profile) onLogin(profile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `REGISTRY_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isEmbed ? 'w-full' : 'min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden'}>
      <div id="recaptcha-container" className="fixed bottom-0 left-0"></div>

      <div className={`glass-card p-10 md:p-16 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-3xl w-full text-center space-y-10 relative z-10 ${isEmbed ? '' : 'max-w-2xl'}`}>
         <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 agro-gradient rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Fingerprint className="w-10 h-10 md:w-14 md:h-14 text-white relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">
                  {mode === 'register' ? 'Node Ingest' : mode.includes('phone') ? 'Mobile Link' : 'Steward Connect'}
               </h1>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">Registry Synchronization Protocol</p>
            </div>
         </div>

         {message && (
           <div className={`p-6 rounded-3xl border text-xs font-black uppercase tracking-widest animate-in zoom-in ${
             message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
           }`}>
             {message.text}
           </div>
         )}

         {/* Mode Toggle */}
         <div className="flex justify-center p-2 glass-card rounded-full bg-white/5 border border-white/10 w-fit mx-auto overflow-hidden gap-1">
            <button onClick={() => setMode('login')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>Email</button>
            <button onClick={() => setMode('phone')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'phone' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}>Phone</button>
            <button onClick={() => setMode('register')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'register' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500'}`}>New Node</button>
         </div>

         {/* Social / fast-track Section */}
         <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="w-full py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3 shadow-xl hover:bg-slate-100 transition-all active:scale-95"
            >
               <Chrome size={18} />
               {loading ? 'SYNCING...' : 'Sync via Google'}
            </button>
            <div className="flex items-center gap-4 py-2">
               <div className="h-px bg-white/5 flex-1"></div>
               <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">OR USE PROTOCOL</span>
               <div className="h-px bg-white/5 flex-1"></div>
            </div>
         </div>

         {mode === 'login' && (
           <form onSubmit={handleAuth} className="space-y-6">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Secret Signature" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none" />
              <button type="submit" disabled={loading} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl">
                 {loading ? <Loader2 className="animate-spin mx-auto" /> : 'ESTABLISH HANDSHAKE'}
              </button>
           </form>
         )}

         {mode === 'phone' && (
            <form onSubmit={handlePhoneRequest} className="space-y-6">
               <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+2547XXXXXXXX" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none font-mono" />
               <button type="submit" disabled={loading} className="w-full py-8 bg-blue-600 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'REQUEST ACCESS CODE'}
               </button>
            </form>
         )}

         {mode === 'register' && (
            <form onSubmit={handleAuth} className="space-y-6">
               <input type="text" required value={name} onChange={e => setEditName(e.target.value)} placeholder="Steward Alias" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none" />
               <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Node Identifier (Email)" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none" />
               <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Secret Signature" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none" />
               <button type="submit" disabled={loading} className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-xl">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : 'INITIALIZE NODE SYNC'}
               </button>
            </form>
         )}

         {mode === 'waiting_verification' && (
            <div className="space-y-8 animate-in zoom-in">
               <div className="p-8 bg-black/80 rounded-[48px] border border-emerald-500/30">
                  <Mail size={48} className="mx-auto text-emerald-400 mb-4 animate-pulse" />
                  <p className="text-slate-300 italic">"Identity verification shard dispatched to your inbox. Anchor your node to proceed."</p>
               </div>
               <button onClick={() => window.location.reload()} className="w-full py-6 bg-white/5 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">SYNC STATUS</button>
            </div>
         )}
      </div>
    </div>
  );
};

export default Login;
