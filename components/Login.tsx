
import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  UserPlus, 
  Key, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft,
  Copy,
  Download,
  Mail,
  RefreshCcw,
  AlertCircle,
  Send,
  Lock,
  Wifi,
  ShieldAlert,
  Globe,
  Inbox,
  X
} from 'lucide-react';
import { User } from '../types';
import IdentityCard from './IdentityCard';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'landing' | 'login' | 'register' | 'sending' | 'verify' | 'recovery' | 'success'>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Registration States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  
  // Login States
  const [esinInput, setEsinInput] = useState('');
  
  // Verification States
  const [vCode, setVCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showMockEmail, setShowMockEmail] = useState(false);
  const [generatedUser, setGeneratedUser] = useState<User | null>(null);

  const getRegistry = (): User[] => {
    const data = localStorage.getItem('agro_users');
    return data ? JSON.parse(data) : [];
  };

  const saveToRegistry = (user: User) => {
    const registry = getRegistry();
    registry.push(user);
    localStorage.setItem('agro_users', JSON.stringify(registry));
  };

  const generateESIN = () => {
    const year = new Date().getFullYear();
    const randomHex = () => Math.floor(Math.random() * 65536).toString(16).toUpperCase().padStart(4, '0');
    return `EA-${year}-${randomHex()}-${randomHex()}`;
  };

  const handleRegisterInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check for unique email
    const registry = getRegistry();
    if (registry.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("STATION ERROR: This email is already bound to an active Steward Node.");
      return;
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setMode('sending');

    // Simulate high-fidelity email dispatch
    setTimeout(() => {
      setMode('verify');
      setShowMockEmail(true); // Trigger the "email received" notification
    }, 3000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (vCode !== generatedCode) {
      setError("VERIFICATION FAILED: Invalid intercept code. Check your signal.");
      setVCode('');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        name: name || 'Anonymous Steward',
        email: email.toLowerCase(),
        esin: generateESIN(),
        regDate: new Date().toLocaleDateString(),
        role: 'Regenerative Farmer',
        location: location || 'Global Registry Node',
        wallet: { balance: 100, tier: 'Seed', lifetimeEarned: 100 },
        metrics: { agriculturalCodeU: 1.2, timeConstantTau: 8.5, sustainabilityScore: 72 },
        // Fix: Added missing skills and isReadyForHire properties to comply with User type.
        skills: {},
        isReadyForHire: false
      };
      setGeneratedUser(newUser);
      saveToRegistry(newUser);
      setMode('success');
      setShowMockEmail(false);
      setLoading(false);
    }, 2000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    setTimeout(() => {
      const registry = getRegistry();
      const user = registry.find(u => u.esin.toUpperCase() === esinInput.toUpperCase());
      
      if (user) {
        onLogin(user);
      } else {
        setError("AUTHENTICATION FAILED: ESIN signature not found in global ledger.");
      }
      setLoading(false);
    }, 1500);
  };

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    setTimeout(() => {
      const registry = getRegistry();
      const user = registry.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // Recovery simulation
        const code = "RECOVERY-" + Math.random().toString(36).substring(7).toUpperCase();
        setGeneratedCode(code); 
        setShowMockEmail(true);
        alert(`RECOVERY PACKET DISPATCHED: Check your intercepted signal for node credentials.`);
        setEsinInput(user.esin);
        setMode('login');
      } else {
        setError("IDENTITY RECOVERY ERROR: No node associated with this address.");
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050706] flex items-center justify-center overflow-hidden">
      {/* Mock Email Intercept Notification */}
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
                <h5 className="text-sm font-bold text-white mb-1">EnvirosAgro Node Verify</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your registration code is: <br/>
                  <span className="text-lg font-mono font-black text-emerald-400 mt-2 block tracking-[0.2em]">{generatedCode}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[8px] text-slate-600 font-mono uppercase">Simulation Mode</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  alert("Code copied to clipboard.");
                }} 
                className="text-[9px] font-black text-emerald-500 uppercase hover:text-white transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8 flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-24 h-24 agro-gradient rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 ring-1 ring-white/20 group hover:rotate-6 transition-transform">
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

        {/* Interaction Card */}
        <div className="w-full max-w-xl glass-card p-1 rounded-[44px] shadow-2xl border-white/5 relative">
          <div className="bg-[#050706]/80 backdrop-blur-3xl rounded-[43px] p-10 overflow-hidden relative min-h-[450px] flex flex-col justify-center">
            
            {error && (
              <div className="absolute top-6 left-10 right-10 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold animate-in slide-in-from-top-2 z-20">
                <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            {mode === 'landing' && (
              <div className="space-y-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Access Control</h2>
                  <p className="text-slate-500 text-sm font-medium">Initialize or resume your steward node session.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setMode('register')} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl text-left hover:bg-emerald-600/10 hover:border-emerald-500/40 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all"><UserPlus className="w-7 h-7" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">New Steward</h3>
                      <p className="text-xs text-slate-500">Generate immutable ESIN via Email.</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-emerald-400 transition-all" />
                  </button>

                  <button onClick={() => setMode('login')} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl text-left hover:bg-blue-600/10 hover:border-blue-500/40 transition-all flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all"><Key className="w-7 h-7" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">Existing Node</h3>
                      <p className="text-xs text-slate-500">Signature-based registry authentication.</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-blue-400 transition-all" />
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegisterInitiate} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMode('landing')} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase">Initialize Node</h2>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Steward Alias</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Legal or Professional Alias" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Primary Email (ID Anchor)</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@registry.node" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Current Geo-Node</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Registry Base (City, Country)" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-medium" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 agro-gradient rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {loading ? 'Dispersing Packets...' : 'Execute Node Registration'}
                </button>
              </form>
            )}

            {mode === 'sending' && (
              <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in fade-in zoom-in duration-500 text-center">
                 <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
                       <Mail className="w-12 h-12 text-emerald-400 animate-bounce" />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full border-t-2 border-emerald-500 rounded-full animate-spin"></div>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Transmitting Signal</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                       Sending verification intercept to <br/><span className="text-emerald-400 font-mono font-bold">{email}</span>
                    </p>
                 </div>
                 <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                 </div>
              </div>
            )}

            {mode === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-10 animate-in zoom-in duration-500 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20 mb-4">
                     <Wifi className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Confirm Node</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     Enter the 6-digit verification code received at <br/>
                     <span className="text-blue-400 font-bold italic">{email}</span>
                  </p>
                </div>
                
                <div className="relative group">
                  <input 
                    type="text" 
                    maxLength={6} 
                    required 
                    autoFocus
                    value={vCode}
                    onChange={e => setVCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000 000"
                    className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 text-white font-mono text-5xl text-center focus:ring-4 focus:ring-blue-500/20 tracking-[0.4em] outline-none group-hover:border-blue-500/40 transition-all placeholder:opacity-20"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button type="submit" disabled={loading || vCode.length !== 6} className="w-full py-6 bg-blue-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Finalize Connection
                  </button>
                  <button 
                    onClick={() => {
                      setMode('sending');
                      setTimeout(() => {
                        setMode('verify');
                        setShowMockEmail(true);
                        alert("Signal Resent.");
                      }, 2000);
                    }} 
                    type="button" 
                    className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
                  >
                     Resend Intercept Signal
                  </button>
                </div>
              </form>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMode('landing')} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase">Node Auth</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2 text-center block w-full">Enter Registered ESIN</label>
                    <input type="text" required value={esinInput} onChange={e => setEsinInput(e.target.value)} placeholder="EA-2025-XXXX-XXXX" className="w-full bg-black/60 border border-white/10 rounded-[32px] py-8 px-6 text-white font-mono text-3xl text-center uppercase tracking-widest focus:ring-4 focus:ring-blue-500/20 outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button type="submit" disabled={loading} className="w-full py-6 bg-blue-600 rounded-3xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 hover:scale-[1.02] transition-all">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                    Authorize Session
                  </button>
                  <button type="button" onClick={() => setMode('recovery')} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-emerald-400 transition-colors py-2 flex items-center justify-center gap-2">
                    <RefreshCcw className="w-3 h-3" /> Identity Lost?
                  </button>
                </div>
              </form>
            )}

            {mode === 'recovery' && (
              <form onSubmit={handleRecover} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMode('login')} type="button" className="p-2 text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-2xl font-black text-white uppercase">Packet Recovery</h2>
                </div>

                <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    We will route your ESIN credentials to the verified anchor email associated with your node.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-2">Anchor Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="steward@registry.node" className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/40 font-medium" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                  {loading ? 'Routing Recovery...' : 'Request Recovery Packet'}
                </button>
              </form>
            )}

            {mode === 'success' && generatedUser && (
              <div className="space-y-10 animate-in zoom-in duration-700 text-center py-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40 scale-110">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Identity Secure</h2>
                  <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Registry Synchronization Complete</p>
                </div>
                
                <div className="transform scale-95 origin-center">
                  <IdentityCard user={generatedUser} />
                </div>
                
                <div className="space-y-4">
                  <button onClick={() => onLogin(generatedUser)} className="w-full py-6 agro-gradient rounded-3xl text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/40 hover:scale-[1.02] transition-all">
                    Initialize Command Center
                  </button>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">ESIN: {generatedUser.esin}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex items-center gap-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-500">
          <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> Encrypted Layer-1</span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          <span>v3.2.0-STABLE</span>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          <span className="flex items-center gap-2"><Globe className="w-3 h-3" /> Global Registry</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
