import React, { useState } from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  UserPlus, 
  Key, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  Send,
  ShieldAlert,
  Inbox,
  X,
  Search,
  Fingerprint,
  RefreshCcw,
  Copy,
  Lock,
  Eye,
  Shield
} from 'lucide-react';
import { User } from '../types';
import IdentityCard from './IdentityCard';
import { syncUserToCloud, getUserByESIN, checkEmailExists, getUserByEmail, getUserByMnemonic } from '../services/firebaseService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const SEED_WORD_POOL = [
  'soil', 'seed', 'water', 'leaf', 'grain', 'farm', 'harvest', 'steward', 'earth', 'growth',
  'field', 'root', 'sun', 'rain', 'cycle', 'flora', 'forest', 'bloom', 'nature', 'biome',
  'solar', 'clean', 'pure', 'green', 'vital', 'rich', 'deep', 'wide', 'vast', 'solid',
  'anchor', 'spirit', 'wisdom', 'hand', 'skill', 'ancient', 'future', 'steady', 'bold', 'kind'
];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'landing' | 'login' | 'register' | 'sending' | 'verify' | 'mnemonic' | 'recovery' | 'success'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [esinInput, setEsinInput] = useState('');
  
  const [vCode, setVCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showMockEmail, setShowMockEmail] = useState(false);
  const [generatedUser, setGeneratedUser] = useState<User | null>(null);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');

  // Recovery Specific
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'phrase'>('email');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [recoveredESIN, setRecoveredESIN] = useState<string | null>(null);

  const generateESIN = () => {
    const year = new Date().getFullYear();
    const randomHex = () => Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
    return `EA-${year}-${randomHex()}-${randomHex()}`;
  };

  const generateMnemonic = () => {
    const phrase = [];
    for (let i = 0; i < 12; i++) {
      phrase.push(SEED_WORD_POOL[Math.floor(Math.random() * SEED_WORD_POOL.length)]);
    }
    return phrase.join(' ');
  };

  const handleRegisterInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setError("STATION ERROR: This email is already bound to an active Steward Node in the Cloud.");
        setLoading(false);
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setMode('sending');
      setLoading(false);

      setTimeout(() => {
        setMode('verify');
        setShowMockEmail(true);
      }, 2000);
    } catch (err) {
      setError("GATEWAY ERROR: Unable to reach Cloud Registry.");
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (vCode !== generatedCode) {
      setError("VERIFICATION FAILED: Invalid intercept code.");
      setVCode('');
      return;
    }
    
    const phrase = generateMnemonic();
    setGeneratedMnemonic(phrase);
    setMode('mnemonic');
  };

  const finalizeRegistration = async () => {
    setLoading(true);
    const esin = generateESIN();
    const newUser: User = {
      name: name || 'Anonymous Steward',
      email: email.toLowerCase(),
      esin: esin,
      mnemonic: generatedMnemonic,
      regDate: new Date().toLocaleDateString(),
      role: 'Regenerative Farmer',
      location: location || 'Global Registry Node',
      wallet: { balance: 100, tier: 'Seed', lifetimeEarned: 100 },
      metrics: { agriculturalCodeU: 1.2, timeConstantTau: 8.5, sustainabilityScore: 72 },
      skills: { 'General': 10 },
      isReadyForHire: false
    };

    const success = await syncUserToCloud(newUser);
    if (success) {
      setGeneratedUser(newUser);
      setMode('success');
      setShowMockEmail(false);
    } else {
      setError("CLOUD SYNC ERROR: Failed to commit identity to blockchain.");
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const user = await getUserByESIN(esinInput.trim());
      if (user) {
        onLogin(user);
      } else {
        setError("AUTHENTICATION FAILED: ESIN signature not found in Cloud Registry.");
      }
    } catch (err) {
      setError("COMMUNICATION ERROR: Identity service unreachable.");
    }
    setLoading(false);
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user = null;
      if (recoveryMethod === 'email') {
        user = await getUserByEmail(recoveryEmail.trim());
      } else {
        user = await getUserByMnemonic(recoveryPhrase.trim());
      }

      if (user) {
        setRecoveredESIN(user.esin);
        if (recoveryMethod === 'email') setShowMockEmail(true);
      } else {
        setError(`RECOVERY ERROR: No steward node found matching this ${recoveryMethod === 'email' ? 'email anchor' : 'seed phrase'}.`);
      }
    } catch (err) {
      setError("COMMUNICATION ERROR: Recovery node unreachable.");
    }
    setLoading(false);
  };

  const handleCopyESIN = () => {
    if (recoveredESIN) {
      navigator.clipboard.writeText(recoveredESIN);
      alert("ESIN Signature copied to clipboard.");
      setMode('login');
      setEsinInput(recoveredESIN);
      setShowMockEmail(false);
      setRecoveredESIN(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050706] flex items-center justify-center overflow-hidden">
      {showMockEmail && (
        <div className="fixed top-10 right-10 z-[200] w-80 animate-in slide-in-from-right-8 duration-500">
          <div className="glass-card p-6 rounded-3xl border-emerald-500/40 bg-[#0a1510]/95 backdrop-blur-2xl shadow-2xl shadow-emerald-900/40 ring-1 ring-emerald-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Inbox className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Incoming Signal</p>
                  <button onClick={() => setShowMockEmail(false)} className="text-slate-600 hover:text-white"><X className="w-3 h-3" /></button>
                </div>
                {recoveredESIN ? (
                  <>
                    <h5 className="text-sm font-bold text-white mb-1">ESIN Recovery Signal</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your identity anchor has been found: <br/>
                      <span className="text-sm font-mono font-black text-emerald-400 mt-2 block tracking-tight">{recoveredESIN}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <h5 className="text-sm font-bold text-white mb-1">EnvirosAgro Node Verify</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Your registration code is: <br/>
                      <span className="text-lg font-mono font-black text-emerald-400 mt-2 block tracking-[0.2em]">{generatedCode}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8 flex flex-col items-center">
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-24 h-24 agro-gradient rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 ring-1 ring-white/20">
            <Leaf className="text-white w-12 h-12" />
          </div>
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">
              Enviros<span className="text-emerald-400">Agro</span>
            </h1>
            <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 mt-2">
              <ShieldCheck className="w-3 h-3" /> Blockchain Identity Protocol
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl glass-card p-1 rounded-[44px] shadow-2xl border-white/5 relative">
          <div className="bg-[#050706]/80 backdrop-blur-3xl rounded-[43px] p-10 overflow-hidden relative min-h-[450px] flex flex-col justify-center">
            
            {error && mode !== 'landing' && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-in slide-in-from-top-2">
                <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {mode === 'landing' && (
              <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold mb-4">
                    <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access Control</h2>
                  <p className="text-slate-500 text-sm font-medium">Initialize or resume your steward node session.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => { setMode('register'); setError(null); }} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl text-left hover:bg-emerald-600/10 hover:border-emerald-500/40 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all"><UserPlus className="w-7 h-7" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">New Steward</h3>
                      <p className="text-xs text-slate-500">Generate immutable ESIN via Cloud.</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-emerald-400 transition-all" />
                  </button>
                  <button onClick={() => { setMode('login'); setError(null); }} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl text-left hover:bg-blue-600/10 hover:border-blue-500/40 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all"><Key className="w-7 h-7" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">Existing Node</h3>
                      <p className="text-xs text-slate-500">Signature-based Cloud authentication.</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-blue-400 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegisterInitiate} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setMode('landing'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Initialize Node</h2>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Steward Alias</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Alias" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-emerald-500/40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Primary Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@registry.node" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-emerald-500/40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Geo-Node</label>
                    <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-emerald-500/40" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Register Steward Node
                </button>
              </form>
            )}

            {mode === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-10 animate-in zoom-in duration-500 text-center">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Confirm Node</h2>
                <input type="text" maxLength={6} required autoFocus value={vCode} onChange={e => setVCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-white font-mono text-5xl text-center focus:ring-4 focus:ring-blue-500/20 tracking-[0.4em] outline-none" />
                <button type="submit" disabled={loading || vCode.length !== 6} className="w-full py-6 bg-blue-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  Proceed to Decentralized Anchoring
                </button>
              </form>
            )}

            {mode === 'mnemonic' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Identity Recovery Seed</h2>
                  <p className="text-slate-400 text-xs italic">Store this 12-word phrase securely. It is the ONLY way to recover your node if you lose your anchor email.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 p-6 bg-black/60 border border-white/10 rounded-[32px] relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none"></div>
                   {generatedMnemonic.split(' ').map((word, i) => (
                     <div key={i} className="bg-white/5 border border-white/5 py-3 px-2 rounded-xl">
                        <span className="text-[8px] text-slate-600 block mb-1 uppercase font-black">{i + 1}</span>
                        <span className="text-sm font-mono font-bold text-white tracking-tighter">{word}</span>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-left">
                   <Shield className="w-10 h-10 text-amber-500 shrink-0" />
                   <p className="text-[10px] text-amber-200 font-bold uppercase leading-tight">I understand that EnvirosAgro cannot recover my node without this phrase or the anchor email.</p>
                </div>
                <button onClick={finalizeRegistration} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  I Have Secured My Seed
                </button>
              </div>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setMode('landing'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Cloud Auth</h2>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 text-center block">Enter ESIN Signature</label>
                  <input type="text" required value={esinInput} onChange={e => setEsinInput(e.target.value)} placeholder="EA-2025-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-6 text-white font-mono text-3xl text-center uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/20" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-6 bg-blue-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                  Authorize Session
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => { setMode('recovery'); setRecoveredESIN(null); }} className="text-[10px] font-black text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors">Forgot ESIN signature?</button>
                </div>
              </form>
            )}

            {mode === 'recovery' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => { setMode('login'); setError(null); }} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Node Recovery</h2>
                </div>

                {!recoveredESIN ? (
                  <div className="space-y-8">
                    <div className="flex p-1 bg-white/5 rounded-2xl gap-1">
                      <button 
                        onClick={() => setRecoveryMethod('email')} 
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${recoveryMethod === 'email' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Email Anchor
                      </button>
                      <button 
                        onClick={() => setRecoveryMethod('phrase')} 
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${recoveryMethod === 'phrase' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        Seed Phrase
                      </button>
                    </div>

                    <form onSubmit={handleRecoverySubmit} className="space-y-8">
                      {recoveryMethod === 'email' ? (
                        <div className="space-y-6">
                          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
                            <Mail className="w-8 h-8 text-blue-400" />
                          </div>
                          <p className="text-slate-400 text-xs text-center leading-relaxed">
                            Enter your registered email anchor to retrieve your ESIN signature.
                          </p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Email Anchor</label>
                             <input 
                               type="email" 
                               required 
                               value={recoveryEmail} 
                               onChange={e => setRecoveryEmail(e.target.value)} 
                               placeholder="steward@registry.node" 
                               className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/40" 
                             />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                            <Fingerprint className="w-8 h-8 text-emerald-400" />
                          </div>
                          <p className="text-slate-400 text-xs text-center leading-relaxed">
                            Input your 12-word recovery seed in the correct order.
                          </p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">12-Word Phrase</label>
                             <textarea 
                               required 
                               value={recoveryPhrase} 
                               onChange={e => setRecoveryPhrase(e.target.value)} 
                               placeholder="word1 word2 word3..." 
                               className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white text-sm font-mono h-32 focus:ring-2 focus:ring-emerald-500/40 outline-none resize-none" 
                             />
                          </div>
                        </div>
                      )}
                      <button type="submit" disabled={loading} className="w-full py-6 bg-blue-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        {loading ? "Searching Registry..." : "Find My Node"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-8 text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl scale-110">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-xl font-bold text-white uppercase tracking-tight">Node Found</h3>
                       <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Registry Sync Complete</p>
                    </div>
                    <div className="p-8 bg-black/60 border border-white/10 rounded-[32px] relative group overflow-hidden">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">ESIN Signature</p>
                       <p className="text-lg font-mono font-black text-emerald-400 tracking-tight">{recoveredESIN}</p>
                       <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <button onClick={handleCopyESIN} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
                       <Copy className="w-5 h-5" /> Copy & Return to Login
                    </button>
                    <button onClick={() => { setRecoveredESIN(null); setRecoveryEmail(''); setRecoveryPhrase(''); }} className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Start Over</button>
                  </div>
                )}
              </div>
            )}

            {mode === 'success' && generatedUser && (
              <div className="space-y-10 animate-in zoom-in duration-700 text-center py-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl scale-110">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Identity Secure</h2>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Cloud Sync Complete</p>
                </div>
                <IdentityCard user={generatedUser} />
                <button onClick={() => onLogin(generatedUser)} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl">
                  Initialize Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;