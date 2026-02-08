
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
  Lock,
  RefreshCw,
  Signal,
  CheckCircle2,
  X,
  Smartphone,
  MessageSquareCode,
  Globe
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
  requestPhoneCode
} from '../services/firebaseService';

interface LoginProps {
  onLogin: (user: User) => void;
  isEmbed?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isEmbed = false }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'register' | 'login' | 'forgot' | 'verify_shard' | 'phone'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState<any>(null);
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

  const handleShardInput = (val: string, index: number, target: 'shard' | 'otp') => {
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

  const createStewardProfile = async (uid: string, userEmail: string, userName: string) => {
    const generatedMnemonic = "seed plant grow harvest sun rain soil root leaf flower fruit seed";
    const gpsCoords = "1.29, 36.82";

    const newUser: User = {
      name: userName || 'Anonymous Steward',
      email: userEmail.toLowerCase(),
      esin: esin,
      mnemonic: generatedMnemonic,
      regDate: new Date().toLocaleDateString(),
      role: 'Regenerative Farmer',
      location: `${city || 'Unknown City'}, ${county || 'Unknown County'}, ${country || 'Unknown Country'} [${gpsCoords || 'Manual-Node'}]`,
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
      isReadyForHire: false
    };

    const syncSuccess = await syncUserToCloud(newUser, uid);
    if (syncSuccess) {
      onLogin(newUser);
    }
    return syncSuccess;
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
        await createStewardProfile(result.user.uid, result.user.email || '', result.user.displayName || '');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `GOOGLE_AUTH_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setMessage(null);
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      const confirmationResult = await requestPhoneCode(phoneNumber, verifier);
      setVerificationId(confirmationResult);
      setMode('phone'); // Stay in phone mode but logic changes to OTP entry via UI state
    } catch (error: any) {
      setMessage({ type: 'error', text: `PHONE_AUTH_ERROR: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!verificationId) return;
    setLoading(true);
    try {
      const code = otpCode.join('');
      const result = await verificationId.confirm(code);
      const profile = await getStewardProfile(result.user.uid);
      if (profile) {
        onLogin(profile);
      } else {
        await createStewardProfile(result.user.uid, `${phoneNumber}@phone.node`, 'Phone Steward');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `OTP_ERROR: ${error.message}` });
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
        setMessage({ type: 'success', text: "REGISTRY_CREATED: Node synchronized. Verification shard sent to email." });
      } else if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(null, email, password);
        const profile = await getStewardProfile(userCredential.user.uid);
        if (profile) {
          onLogin(profile);
        } else {
          setMessage({ type: 'error', text: "REGISTRY_MISSING: Profile not found. Check Firestore Rules." });
        }
      } else if (mode === 'forgot') {
        await transmitRecoveryCode(email);
        setMessage({ type: 'info', text: "SIGNAL_TRANSMITTED: 6-digit recovery shard sent to your Gmail inbox." });
        setMode('verify_shard');
        setCountdown(60);
      } else if (mode === 'verify_shard') {
        const fullCode = shardCode.join('');
        const isValid = await verifyRecoveryShard(email, fullCode);
        if (isValid) {
          await resetPassword(email);
          setMessage({ type: 'success', text: "HANDSHAKE_VERIFIED: Secure reset link sharded to email. Use it to update node credentials." });
          setMode('login');
        } else {
          setMessage({ type: 'error', text: "SIGNATURE_MISMATCH: Invalid or expired recovery shard code." });
        }
      }
    } catch (error: any) {
      let friendlyMessage = `REGISTRY_ERROR: ${error.message}`;
      if (error.message === "EMAIL_NOT_FOUND") {
        friendlyMessage = "REGISTRY_MISSING: Email not found in the global steward registry.";
      } else if (error.message.includes('PERMISSION_DENIED')) {
        friendlyMessage = "REGISTRY_LOCK: Access denied. Check node permissions.";
      } else if (error.code === 'auth/invalid-credential') {
        friendlyMessage = "INVALID_CREDENTIALS: Node signature mismatch.";
      }
      setMessage({ type: 'error', text: friendlyMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isEmbed ? 'w-full' : 'min-h-screen bg-[#050706] flex items-center justify-center p-4 relative overflow-hidden'}>
      <div id="recaptcha-container"></div>
      {!isEmbed && (
         <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
         </div>
      )}

      <div className={`glass-card p-8 md:p-14 rounded-[56px] border-emerald-500/20 bg-black/40 shadow-3xl w-full text-center space-y-8 relative z-10 ${isEmbed ? '' : 'max-w-xl'}`}>
         {!isEmbed && (
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 agro-gradient rounded-3xl flex items-center justify-center shadow-xl">
                 <Leaf className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Enviros<span className="text-emerald-400">Agro™</span></h1>
              <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]">Official Registry Ingest</p>
           </div>
         )}

         {message && (
           <div className={`p-5 rounded-3xl border text-[10px] md:text-xs font-black uppercase tracking-widest animate-in zoom-in leading-relaxed ${
             message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
             message.type === 'info' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
             'bg-rose-500/10 border-rose-500/30 text-rose-500'
           }`}>
             <div className="flex items-center justify-center gap-3 mb-1">
               {message.type === 'error' ? <ShieldAlert size={16} /> : message.type === 'info' ? <Signal size={16} /> : <ShieldCheck size={16} />}
               <span>{message.text}</span>
             </div>
           </div>
         )}

         <div className="flex p-1.5 glass-card rounded-2xl bg-white/5 border border-white/10 max-w-full mx-auto overflow-x-auto scrollbar-hide">
            <button onClick={() => setMode('register')} className={`flex-1 py-3 px-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Sync</button>
            <button onClick={() => setMode('login')} className={`flex-1 py-3 px-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Connect</button>
            <button onClick={() => { setMode('phone'); setMessage(null); setVerificationId(null); }} className={`flex-1 py-3 px-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'phone' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Phone</button>
            <button onClick={() => { setMode('forgot'); setMessage(null); }} className={`flex-1 py-3 px-4 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'forgot' || mode === 'verify_shard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Recovery</button>
         </div>

         {mode !== 'verify_shard' && mode !== 'phone' && (
           <div className="space-y-4">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Connect with Gmail
              </button>
              <div className="flex items-center gap-4 px-4 opacity-30">
                <div className="h-px bg-white/20 flex-1"></div>
                <span className="text-[10px] font-black uppercase text-white">Or</span>
                <div className="h-px bg-white/20 flex-1"></div>
              </div>
           </div>
         )}

         <form onSubmit={mode === 'phone' ? handlePhoneSignIn : handleAuth} className="space-y-6">
            {mode === 'register' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4">
                <div className="space-y-1 text-left px-1 md:col-span-2">
                   <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Steward Alias</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Bantu Steward" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                </div>
                <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/10" />
                <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} className="bg-black/60 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500/10" />
              </div>
            )}

            {mode === 'phone' && (
              <div className="space-y-8 animate-in slide-in-from-right-4">
                {!verificationId ? (
                  <div className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Phone Shard</label>
                      <div className="relative group">
                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-emerald-500" />
                        <input 
                          type="tel" 
                          required 
                          value={phoneNumber} 
                          onChange={e => setPhoneNumber(e.target.value)} 
                          placeholder="+254 700 000 000" 
                          className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono" 
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={loading || !phoneNumber} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={16} />}
                      TRANSMIT OTP SHARD
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-full animate-pulse">
                        <MessageSquareCode className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Verify SMS Code</h3>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Enter the code sent to your phone node.</p>
                    </div>
                    <div className="flex justify-center gap-3">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleShardInput(e.target.value, i, 'otp')}
                          className="w-10 h-14 md:w-12 md:h-16 bg-black/60 border-2 border-white/10 rounded-xl text-center text-2xl font-mono font-black text-emerald-400 focus:border-emerald-500 outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>
                    <button type="button" onClick={verifyOtp} disabled={loading} className="w-full py-6 bg-emerald-600 rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ANCHOR PHONE NODE'}
                    </button>
                    <button type="button" onClick={() => setVerificationId(null)} className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white">Back to Phone Input</button>
                  </div>
                )}
              </div>
            )}

            {mode !== 'verify_shard' && mode !== 'phone' && (
              <div className="space-y-4 text-left px-1">
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Registry Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-emerald-500" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@envirosagro.org" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                    </div>
                 </div>
                 
                 {(mode === 'login' || mode === 'register') && (
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Node Password</label>
                      <div className="relative group">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-emerald-500" />
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" />
                      </div>
                   </div>
                 )}
              </div>
            )}

            {mode === 'verify_shard' && (
              <div className="space-y-8 animate-in zoom-in duration-500 py-4">
                 <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-full animate-pulse">
                      <Lock className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Shard Verification</h3>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-10">Enter the 6-digit recovery shard sent to <span className="text-indigo-400">{email}</span></p>
                 </div>

                 <div className="flex justify-center gap-3">
                   {shardCode.map((digit, i) => (
                     <input
                       key={i}
                       id={`shard-${i}`}
                       type="text"
                       maxLength={1}
                       value={digit}
                       onChange={e => handleShardInput(e.target.value, i, 'shard')}
                       className="w-12 h-16 md:w-14 md:h-20 bg-black/60 border-2 border-white/10 rounded-2xl text-center text-3xl font-mono font-black text-indigo-400 focus:border-indigo-500 outline-none transition-all shadow-inner focus:ring-4 focus:ring-indigo-500/5"
                     />
                   ))}
                 </div>

                 <div className="flex justify-between items-center px-4">
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setMessage(null); }}
                      className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Change Registry Email
                    </button>
                    {countdown > 0 ? (
                      <span className="text-[9px] font-mono text-indigo-400 uppercase font-black">Retry in {countdown}s</span>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleAuth}
                        className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:text-white"
                      >
                        <RefreshCw size={12} /> Resend Shard
                      </button>
                    )}
                 </div>
              </div>
            )}

            {mode !== 'phone' && (
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 mt-6 ring-8 ring-emerald-500/5 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'verify_shard' ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                 {mode === 'register' ? 'INITIALIZE REAL-TIME NODE' : mode === 'login' ? 'SYNC REGISTRY SESSION' : mode === 'verify_shard' ? 'VERIFY SHARD HANDSHAKE' : 'TRANSMIT RECOVERY SIGNAL'}
              </button>
            )}
         </form>

         {!isEmbed && (
           <div className="pt-6 border-t border-white/5">
              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-4 text-left">
                 <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-blue-200/50 font-black uppercase leading-relaxed tracking-tight italic">
                    EOS_SECURE_INGEST: "Authentication anchors your node to the global industrial ledger. Recovery shards utilize 256-bit sharding for secure restoration."
                 </p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default Login;
