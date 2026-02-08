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
  RotateCcw
} from 'lucide-react';
import { 
  syncUserToCloud,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  resetPassword,
  auth,
  getStewardProfile,
  transmitRecoveryCode,
  verifyRecoveryShard,
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
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  // Recovery Shard Code State
  const [shardCode, setShardCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleCodeInput = (val: string, index: number, target: 'shard' | 'otp') => {
    if (!/^\d*$/.test(val)) return;
    const currentCode = target === 'shard' ? shardCode : otpCode;
    const setter = target === 'shard' ? setShardCode : setOtpCode;
    
    const newCode = [...currentCode];
    newCode[index] = val.slice(-1);
    setter(newCode);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`${target}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const createStewardProfile = async (uid: string, userEmail: string, userName: string, phone?: string) => {
    const generatedMnemonic = "seed plant grow harvest sun rain soil root leaf flower fruit seed";
    const gpsCoords = "1.29, 36.82";

    const newUser: User = {
      name: userName || 'Anonymous Steward',
      email: userEmail.toLowerCase() || `${phone}@phone.auth`,
      esin: esin,
      mnemonic: generatedMnemonic,
      regDate: new Date().toLocaleDateString(),
      role: 'REGENERATIVE FARMER',
      location: `${city || 'Nairobi'}, ${county || 'Nairobi'}, ${country || 'Kenya'} [${gpsCoords}]`,
      wallet: { 
        balance: 100, 
        eatBalance: 0, 
        exchangeRate: 600, 
        bonusBalance: 100, 
        tier: 'Seed', 
        lifetimeEarned: 100,
        linkedProviders: [],
        miningStreak: 1,
        lastSyncDate: new Date().toISOString().split('T')[0],
        pendingSocialHarvest: 0,
        stakedEat: 0
      },
      metrics: { 
        agriculturalCodeU: 1.2, 
        timeConstantTau: 8.5, 
        sustainabilityScore: 72,
        socialImmunity: 60,
        viralLoadSID: 35,
        baselineM: 8.5
      },
      skills: { 'General': 10 },
      isReadyForHire: false,
      settings: {
        notificationsEnabled: true,
        privacyMode: 'Public',
        autoSync: true,
        biometricLogin: false,
        theme: 'Dark'
      }
    };

    const syncSuccess = await syncUserToCloud(newUser, uid);
    return { success: syncSuccess, profile: newUser };
  };

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      const fbUser = await refreshAuthUser();
      if (fbUser?.emailVerified) {
        const profile = await getStewardProfile(fbUser.uid);
        if (profile) {
          onLogin(profile);
        } else {
          // Profile might not have been created yet (unlikely if they reached here, but safety first)
          const { profile: newProfile } = await createStewardProfile(fbUser.uid, fbUser.email || '', fbUser.displayName || '');
          onLogin(newProfile);
        }
      } else {
        setMessage({ type: 'error', text: "REGISTRY_PENDING: Email signature not yet detected on-chain. Please verify." });
      }
    } catch (e) {
      setMessage({ type: 'error', text: "SYNC_ERROR: Could not reach auth quorum." });
    } finally {
      setLoading(false);
    }
  };

  const resendShard = async () => {
    setLoading(true);
    try {
      await sendVerificationShard();
      setMessage({ type: 'success', text: "SHARD_TRANSMITTED: New ZK-Identity link dispatched to inbox." });
    } catch (e) {
      setMessage({ type: 'error', text: "TRANSMISSION_FAILED: Rate limit hit. Try again in 60s." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await signInWithGoogle();
      if (!result.user.emailVerified) {
        await sendVerificationShard();
        setMode('waiting_verification');
        return;
      }
      const profile = await getStewardProfile(result.user.uid);
      if (profile) {
        onLogin(profile);
      } else {
        const { profile: newProfile } = await createStewardProfile(result.user.uid, result.user.email || '', result.user.displayName || '');
        onLogin(newProfile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `GOOGLE_AUTH_ERROR: ${error.message}` });
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
      if ((window as any).recaptchaVerifier) {
        try { (window as any).recaptchaVerifier.clear(); } catch(e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6 || !confirmationResult) return;
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      const profile = await getStewardProfile(result.user.uid);
      if (profile) {
        onLogin(profile);
      } else {
        const { profile: newProfile } = await createStewardProfile(result.user.uid, '', 'Phone Steward', phoneNumber);
        onLogin(newProfile);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: "INVALID_SHARD: Access code verification failed." });
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
        setMessage({ type: 'success', text: "REGISTRY_CREATED: Identity verification link sharded to email." });
      } else if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(null, email, password);
        if (!userCredential.user.emailVerified) {
          await sendVerificationShard();
          setMode('waiting_verification');
          return;
        }
        const profile = await getStewardProfile(userCredential.user.uid);
        if (profile) {
          onLogin(profile);
        } else {
          setMessage({ type: 'error', text: "REGISTRY_MISSING: Profile not found in organizational ledger." });
        }
      } else if (mode === 'forgot') {
        await transmitRecoveryCode(email);
        setMessage({ type: 'info', text: "SIGNAL_TRANSMITTED: 6-digit recovery shard sent to your inbox." });
        setMode('verify_shard');
        setCountdown(60);
      } else if (mode === 'verify_shard') {
        const fullCode = shardCode.join('');
        const isValid = await verifyRecoveryShard(email, fullCode);
        if (isValid) {
          await resetPassword(email);
          setMessage({ type: 'success', text: "HANDSHAKE_VERIFIED: Secure reset link sharded to email." });
          setMode('login');
        } else {
          setMessage({ type: 'error', text: "SIGNATURE_MISMATCH: Invalid or expired recovery code." });
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `REGISTRY_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isEmbed ? 'w-full' : 'min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden'}>
      {/* Invisible reCAPTCHA container required for Phone Auth */}
      <div id="recaptcha-container" className="fixed bottom-0 left-0"></div>

      <div className={`glass-card p-10 md:p-16 rounded-[64px] border-emerald-500/20 bg-black/60 shadow-3xl w-full text-center space-y-10 relative z-10 ${isEmbed ? '' : 'max-w-2xl'}`}>
         
         <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 md:w-28 md:h-28 agro-gradient rounded-[32px] flex items-center justify-center shadow-3xl border-4 border-white/10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
               <Fingerprint className="w-10 h-10 md:w-14 md:h-14 text-white relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <div className="space-y-2">
               <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic m-0">
                  {mode === 'register' ? 'Node Ingest' : mode === 'phone' || mode === 'verify_phone' ? 'Mobile Link' : mode === 'forgot' || mode === 'verify_shard' ? 'Recovery Shard' : mode === 'waiting_verification' ? 'Handshake Pending' : 'Steward Connect'}
               </h1>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em]">Registry Synchronization Protocol</p>
            </div>
         </div>

         {message && (
           <div className={`p-6 rounded-3xl border text-xs font-black uppercase tracking-widest animate-in zoom-in leading-relaxed ${
             message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
             message.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
             'bg-rose-500/10 border-rose-500/30 text-rose-500'
           }`}>
             <div className="flex items-center justify-center gap-4">
               {message.type === 'error' ? <ShieldAlert size={20} /> : message.type === 'info' ? <Signal size={20} /> : <ShieldCheck size={20} />}
               <span className="flex-1 text-left">{message.text}</span>
               <button onClick={() => setMessage(null)}><X size={14}/></button>
             </div>
           </div>
         )}

         {/* WAITING VERIFICATION FLOW (NEW PRE-LOGIN GATE) */}
         {mode === 'waiting_verification' && (
           <div className="space-y-10 animate-in fade-in zoom-in duration-700">
              <div className="p-8 bg-black/80 rounded-[48px] border border-white/5 space-y-6 shadow-inner relative z-10">
                <div className="flex items-center justify-center gap-4 text-emerald-400">
                  <Mail size={24} />
                  <span className="text-lg font-mono font-black tracking-widest">{email}</span>
                </div>
                <p className="text-slate-400 text-sm md:text-base italic leading-relaxed px-6">
                  "A secure verification shard has been dispatched. Authenticate your email to anchor your node to the planetary regeneration grid."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <button 
                  onClick={checkVerificationStatus}
                  disabled={loading}
                  className="py-6 bg-emerald-600 hover:bg-emerald-500 rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  SYNC NODE STATUS
                </button>
                <button 
                  onClick={resendShard}
                  disabled={loading}
                  className="py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[32px] text-slate-300 font-black text-[10px] uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  RESEND SHARD
                </button>
              </div>

              <button 
                onClick={() => setMode('login')}
                className="text-[10px] font-black text-slate-700 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCcw size={14}/> BACK_TO_LOGIN
              </button>
           </div>
         )}

         {/* MODE TABS */}
         {mode !== 'waiting_verification' && (
           <>
             <div className="flex flex-wrap justify-center p-2 glass-card rounded-[32px] bg-white/5 border border-white/10 w-fit mx-auto overflow-hidden gap-1">
                <button onClick={() => { setMode('login'); setMessage(null); }} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'login' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Email</button>
                <button onClick={() => { setMode('phone'); setMessage(null); }} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'phone' || mode === 'verify_phone' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Phone</button>
                <button onClick={() => { setMode('register'); setMessage(null); }} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'register' ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>New Node</button>
                <button onClick={() => { setMode('forgot'); setMessage(null); }} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${mode === 'forgot' || mode === 'verify_shard' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>Recover</button>
             </div>

             {/* GOOGLE SIGN IN */}
             {(mode === 'login' || mode === 'register' || mode === 'phone') && (
               <div className="space-y-6">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full py-5 bg-white rounded-[24px] flex items-center justify-center gap-6 text-sm font-black uppercase tracking-widest text-black hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                    Handshake with Google (Gmail)
                  </button>
                  <div className="flex items-center gap-6 px-10 opacity-20">
                    <div className="h-px bg-white flex-1"></div>
                    <span className="text-[10px] font-black uppercase text-white">OR DIRECT PROTOCOL</span>
                    <div className="h-px bg-white flex-1"></div>
                  </div>
               </div>
             )}

             {/* EMAIL FLOW */}
             {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
               <form onSubmit={handleAuth} className="space-y-8">
                  {mode === 'register' && (
                    <div className="space-y-6 animate-in slide-in-from-right-10 duration-700">
                      <div className="space-y-3 text-left">
                         <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6 italic">Steward Name / Alias</label>
                         <input type="text" required value={name} onChange={e => setEditName(e.target.value)} placeholder="e.g. Bantu Steward Alpha" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 px-10 text-lg text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 text-left animate-in fade-in duration-700">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6 italic">Registry Identifier (Email)</label>
                        <div className="relative group">
                          <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-lg text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" />
                        </div>
                     </div>
                     
                     {(mode === 'login' || mode === 'register') && (
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6 italic">Handshake Secret (Password)</label>
                          <div className="relative group">
                            <Key className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-lg text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" />
                          </div>
                       </div>
                     )}
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-8 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-[0_0_80px_rgba(16,185,129,0.3)] active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Zap className="w-8 h-8 fill-current" />}
                     {mode === 'register' ? 'INITIALIZE NODE SYNC' : mode === 'login' ? 'ESTABLISH HANDSHAKE' : 'TRANSMIT RECOVERY SIGNAL'}
                  </button>
               </form>
             )}

             {/* PHONE FLOW */}
             {mode === 'phone' && (
               <form onSubmit={handlePhoneRequest} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-3 text-left">
                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-6 italic">Steward Mobile Node (International Format)</label>
                     <div className="relative group">
                       <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                       <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+2547XXXXXXXX" className="w-full bg-black/80 border-2 border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-lg text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner font-mono" />
                     </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={loading || !phoneNumber}
                    className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Smartphone className="w-8 h-8" />}
                     REQUEST ACCESS CODE
                  </button>
               </form>
             )}

             {/* OTP/VERIFY PHONE FLOW */}
             {mode === 'verify_phone' && (
               <form onSubmit={handlePhoneVerify} className="space-y-10 animate-in zoom-in duration-500 py-6">
                  <div className="flex flex-col items-center gap-6">
                     <div className="w-24 h-24 bg-blue-600/10 border-4 border-blue-500/20 rounded-full animate-pulse flex items-center justify-center text-blue-400">
                       <MessageSquareCode size={40} />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Verify Mobile Node</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.4em] px-10">Access code sharded to <span className="text-blue-400 block mt-2 text-xs font-mono">{phoneNumber}</span></p>
                     </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeInput(e.target.value, i, 'otp')}
                        className="w-12 h-16 md:w-14 md:h-20 bg-black/80 border-2 border-white/10 rounded-2xl text-center text-3xl md:text-4xl font-mono font-black text-blue-400 focus:border-blue-500 outline-none transition-all shadow-3xl focus:ring-8 focus:ring-blue-500/10"
                      />
                    ))}
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || otpCode.join('').length < 6}
                    className="w-full py-8 bg-blue-600 hover:bg-blue-500 rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-8 border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ShieldCheck className="w-8 h-8" />}
                     AUTHORIZE ACCESS
                  </button>
                  <button type="button" onClick={() => setMode('phone')} className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">BACK_TO_PHONE</button>
               </form>
             )}

             {/* RECOVERY SHARD FLOW */}
             {mode === 'verify_shard' && (
               <form onSubmit={handleAuth} className="space-y-10 animate-in zoom-in duration-700 py-6">
                  <div className="flex flex-col items-center gap-6">
                     <div className="w-24 h-24 bg-indigo-600/10 border-4 border-indigo-500/20 rounded-full animate-pulse flex items-center justify-center text-indigo-400">
                       <Lock size={40} />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Verify Recovery Shard</h3>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.4em] px-10">Recovery shard sharded to <span className="text-indigo-400 block mt-2 text-xs">{email}</span></p>
                     </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    {shardCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`shard-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeInput(e.target.value, i, 'shard')}
                        className="w-14 h-20 bg-black/80 border-2 border-white/10 rounded-2xl text-center text-4xl font-mono font-black text-indigo-400 focus:border-indigo-500 outline-none transition-all shadow-3xl focus:ring-8 focus:ring-indigo-500/10"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center px-10">
                     <button 
                       type="button" 
                       onClick={() => setMode('forgot')}
                       className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors"
                     >
                       CHANGE_IDENTIFIER
                     </button>
                     {countdown > 0 ? (
                       <span className="text-[10px] font-mono text-indigo-400 font-bold">RETRY: {countdown}s</span>
                     ) : (
                       <button type="button" onClick={handleAuth} className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-2 hover:text-white"><RefreshCw size={14}/> RESEND_SHARD</button>
                     )}
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || shardCode.join('').length < 6}
                    className="w-full py-10 agro-gradient rounded-[40px] text-white font-black text-sm uppercase tracking-[0.5em] shadow-2xl flex items-center justify-center gap-8 active:scale-95 transition-all border-4 border-white/10 ring-[20px] ring-white/5 disabled:opacity-50"
                  >
                     {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <CheckCircle2 className="w-8 h-8" />}
                     VERIFY SHARD INTEGRITY
                  </button>
               </form>
             )}
           </>
         )}

         <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.6em] italic">Official EnvirosAgro™ Network Authority</p>
            <div className="flex gap-10">
               <HelpCircle size={20} className="text-slate-800 hover:text-white cursor-pointer transition-colors" />
               <Globe size={20} className="text-slate-800 hover:text-white cursor-pointer transition-colors" />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;